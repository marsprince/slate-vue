import {Children} from './children';
import * as tsx from "vue-tsx-support";
import {VueEditor, SlateMixin, useEffect, useRef} from '../plugins';
import {
  EDITOR_TO_ELEMENT, NODE_TO_ELEMENT, ELEMENT_TO_NODE, IS_READ_ONLY,
  HAS_BEFORE_INPUT_SUPPORT,
  DOMStaticRange,
  addOnBeforeInput,
  EditableComponent,
  IS_FIREFOX_LEGACY
} from 'slate-vue-shared';
import { Range } from 'slate';
import { PropType } from 'vue';
import { UseRef } from '../types';

interface IEvent extends Event {
  data: string | null
  dataTransfer: DataTransfer | null
  getTargetRanges(): DOMStaticRange[]
  inputType: string
  isComposing: boolean
}

/**
 * A default memoized decorate function.
 */
const defaultDecorate = () => []

interface EditableData {
  latestElement: null | Element,
  isComposing: boolean,
  isUpdatingSelection: boolean
}

type PropsEventListener = PropType<(event: any) => void>

// the contentEditable div
export const Editable = tsx.component({
  // some global props will provide for child component
  props: {
    autoFocus: Boolean,
    renderLeaf: Function,
    renderElement: Function,
    readOnly: Boolean,
    decorate: {
      type: Function,
      default: defaultDecorate
    },
    placeholder: String,
    spellCheck: Boolean,
    autoCorrect: String,
    autoCapitalize: String,

    // user event
    onBeforeInput: {
      type: Function as PropsEventListener
    },
    onKeyDown: {
      type: Function as PropsEventListener
    },
    onClick: {
      type: Function as PropsEventListener
    },
    onCompositionEnd: {
      type: Function as PropsEventListener
    },
    onCompositionStart: {
      type: Function as PropsEventListener
    },
    onCut: {
      type: Function as PropsEventListener
    },
    onCopy: {
      type: Function as PropsEventListener
    },
    onDragOver: {
      type: Function as PropsEventListener
    },
    onDragStart: {
      type: Function as PropsEventListener
    },
    onDragStop: {
      type: Function as PropsEventListener
    },
    onPaste: {
      type: Function as PropsEventListener
    },
    onFocus: {
      type: Function as PropsEventListener
    },
    onBlur: {
      type: Function as PropsEventListener
    },
    onDrop: {
      type: Function as PropsEventListener
    },
  },
  components: {
    Children
  },
  mixins: [SlateMixin],
  provide(): object {
    return {
      'renderLeaf': this.renderLeaf,
      'renderElement': this.renderElement,
      'decorate': this.decorate,
      'readOnly': this.readOnly,
      'placeholder': this.placeholder
    }
  },
  data(): EditableData & UseRef {
    return {
      latestElement: null,
      isComposing: false,
      isUpdatingSelection: false,
      ref: null
    }
  },
  methods: {
    _onClick(event: IEvent) {
      EditableComponent.onClick(event, this.$editor, this)
    },
    onSelectionchange() {
      EditableComponent.onSelectionchange(this.$editor, this)
    },
    _onBeforeInput(event: IEvent) {
      EditableComponent.onBeforeInput(event, this.$editor, this)
    },
    _onCompositionEnd(event: any) {
      EditableComponent.onCompositionEnd(event, this.$editor, this)
    },
    _onCompositionStart(event: IEvent) {
      EditableComponent.onCompositionStart(event, this.$editor, this)
    },
    _onKeyDown(event: any) {
      EditableComponent.onKeyDown(event, this.$editor, this)
    },
    _onFocus(event: any) {
      EditableComponent.onFocus(event, this.$editor, this)
    },
    _onBlur(event: any) {
      EditableComponent.onBlur(event, this.$editor, this)
    },
    _onCopy(event: any) {
      EditableComponent.onCopy(event, this.$editor, this)
    },
    _onPaste(event: any) {
      EditableComponent.onPaste(event, this.$editor, this)
    },
    _onCut(event: any) {
      EditableComponent.onCut(event, this.$editor, this)
    },
    _onDragOver(event: any) {
      EditableComponent.onDragOver(event, this.$editor, this)
    },
    _onDragStart(event: any) {
      EditableComponent.onDragStart(event, this.$editor, this)
    },
    _onDrop(event: any) {
      EditableComponent.onDrop(event, this.$editor, this)
    }
  },
  hooks() {
    const ref = this.ref = useRef(null);
    const editor = this.$editor;
    IS_READ_ONLY.set(editor, this.readOnly)

    const initListener = () => {
      
      // Attach a native DOM event handler for `selectionchange`
      useEffect(() => {
        if (HAS_BEFORE_INPUT_SUPPORT) {
          document.addEventListener('beforeinput', this.onBeforeInput)
        }
        return () => {
          if (HAS_BEFORE_INPUT_SUPPORT) {
            document.removeEventListener('beforeinput', this.onBeforeInput)
          }
        }
      });
      useEffect(()=>{
        document.addEventListener('selectionchange', this.onSelectionchange)
        return () => {
          document.removeEventListener('selectionchange', this.onSelectionchange)
        }
      });
    };
    const updateAutoFocus = () => {
      useEffect(() => {
        if (ref.current && this.autoFocus) {
          // can't focus in current event loop?
          setTimeout(()=>{
            ref.current.focus()
          }, 0)
        }
      }, [this.autoFocus])
    }
    const updateRef = () => {
      // Update element-related weak maps with the DOM element ref.
      useEffect(() => {
        if (ref.current) {
          EDITOR_TO_ELEMENT.set(editor, ref.current)
          NODE_TO_ELEMENT.set(editor, ref.current)
          ELEMENT_TO_NODE.set(ref.current, editor)
        } else {
          NODE_TO_ELEMENT.delete(editor)
        }
      })
    };
    const updateSelection = () => {
      useEffect(() => {
        const { selection } = editor
        const domSelection = window.getSelection()

        if (this.isComposing || !domSelection || !VueEditor.isFocused(editor)) {
          return
        }

        const hasDomSelection = domSelection.type !== 'None'

        // If the DOM selection is properly unset, we're done.
        if (!selection && !hasDomSelection) {
          return
        }

        // verify that the dom selection is in the editor
        const editorElement = EDITOR_TO_ELEMENT.get(editor)!
        let hasDomSelectionInEditor = false
        if (
          editorElement.contains(domSelection.anchorNode) &&
          editorElement.contains(domSelection.focusNode)
        ) {
          hasDomSelectionInEditor = true
        }

        // If the DOM selection is in the editor and the editor selection is already correct, we're done.
        if (
          hasDomSelection &&
          hasDomSelectionInEditor &&
          selection &&
          Range.equals(VueEditor.toSlateRange(editor, domSelection), selection)
        ) {
          return
        }

        // Otherwise the DOM selection is out of sync, so update it.
        const el = VueEditor.toDOMNode(editor, editor)
        this.isUpdatingSelection = true

        const newDomRange = selection && VueEditor.toDOMRange(editor, selection)

        if (newDomRange) {
          if (Range.isBackward(selection as Range)) {
            domSelection.setBaseAndExtent(
              newDomRange.endContainer,
              newDomRange.endOffset,
              newDomRange.startContainer,
              newDomRange.startOffset
            )
          } else {
            domSelection.setBaseAndExtent(
              newDomRange.startContainer,
              newDomRange.startOffset,
              newDomRange.endContainer,
              newDomRange.endOffset
            )
          }
          const leafEl = newDomRange.startContainer.parentElement!
          // scrollIntoView(leafEl, {
          //   scrollMode: 'if-needed',
          //   boundary: el,
          // })
        } else {
          domSelection.removeAllRanges()
        }

        setTimeout(() => {
          // COMPAT: In Firefox, it's not enough to create a range, you also need
          // to focus the contenteditable element too. (2016/11/16)
          if (newDomRange && IS_FIREFOX_LEGACY) {
            el.focus()
          }

          this.isUpdatingSelection = false
        })
      })
    }

    // init selectionchange
    initListener();
    // Update element-related weak maps with the DOM element ref.
    updateRef();
    // Whenever the editor updates, make sure the DOM selection state is in sync.
    updateSelection();
    // The autoFocus TextareaHTMLAttribute doesn't do anything on a div, so it
    // needs to be manually focused.
    updateAutoFocus();
    // patch beforeinput in FireFox
    if (IS_FIREFOX_LEGACY) {
      useEffect(() => {
        addOnBeforeInput(ref.current, true)
      }, [])
    }
  },
  render() {
    const editor = this.$editor;
    const {ref} = this;
    // name must be corresponded with standard
    const on: any  = {
      click: this._onClick,
      keydown: this._onKeyDown,
      focus: this._onFocus,
      blur: this._onBlur,
      beforeinput: this._onBeforeInput,
      copy: this._onCopy,
      cut: this._onCut,
      compositionend: this._onCompositionEnd,
      compositionstart: this._onCompositionStart,
      dragover: this._onDragOver,
      dragstart: this._onDragStart,
      drop: this._onDrop,
      paste: this._onPaste
    };
    const attrs = {
      spellcheck: !HAS_BEFORE_INPUT_SUPPORT ? undefined : this.spellCheck,
      autocorrect: !HAS_BEFORE_INPUT_SUPPORT ? undefined : this.autoCorrect,
      autocapitalize: !HAS_BEFORE_INPUT_SUPPORT ? undefined : this.autoCapitalize,
    }
    return (
      <div
        // COMPAT: The Grammarly Chrome extension works by changing the DOM
        // out from under `contenteditable` elements, which leads to weird
        // behaviors so we have to disable it like editor. (2017/04/24)
        data-gramm={false}
        role={this.readOnly ? undefined : 'textbox'}
        ref = {(ref as any).id}
        contenteditable={this.readOnly ? false : true}
        data-slate-editor
        data-slate-node="value"
        style={{
         // Prevent the default outline styles.
         outline: 'none',
         // Preserve adjacent whitespace and new lines.
         whiteSpace: 'pre-wrap',
         // Allow words to break if they are too long.
         wordWrap: 'break-word',
         // Allow for passed-in styles to override anything.
         // ...style,
        }}
        {...{on}}
        {...{attrs}}
        >
        <Children
          node={editor}
          selection={editor.selection}
        />
      </div>
    )
  }
})
