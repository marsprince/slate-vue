import Children from './children';
import * as tsx from "vue-tsx-support";
import { useEffect, useRef } from '../plugins/vue-hooks';
import {VueEditor} from '..';
import { IS_FOCUSED, EDITOR_TO_ELEMENT, NODE_TO_ELEMENT, ELEMENT_TO_NODE, IS_READ_ONLY, PLACEHOLDER_SYMBOL, VUE_COMPONENT } from '../utils/weak-maps';
import {DOMNode,isDOMNode, DOMRange, isDOMElement} from '../utils/dom';
import {Transforms, Range,Editor, Element, Node} from 'slate';
import {DOMStaticRange} from '../utils/dom';
import { IS_FIREFOX, IS_SAFARI, IS_EDGE_LEGACY } from '../utils/environment'
import {SlateMixin} from '..';

/**
 * Check if the target is editable and in the editor.
 */
const hasEditableTarget = (
  editor: VueEditor,
  target: EventTarget | null
): target is DOMNode => {
  return (
    isDOMNode(target) &&
    VueEditor.hasDOMNode(editor, target, { editable: true })
  )
};

/**
 * Check if two DOM range objects are equal.
 */

const isRangeEqual = (a: DOMRange, b: DOMRange) => {
  return (
    (a.startContainer === b.startContainer &&
      a.startOffset === b.startOffset &&
      a.endContainer === b.endContainer &&
      a.endOffset === b.endOffset) ||
    (a.startContainer === b.endContainer &&
      a.startOffset === b.endOffset &&
      a.endContainer === b.startContainer &&
      a.endOffset === b.startOffset)
  )
};

/**
 * Check if the target is in the editor.
 */

const hasTarget = (
  editor: VueEditor,
  target: EventTarget | null
): target is DOMNode => {
  return isDOMNode(target) && VueEditor.hasDOMNode(editor, target)
};
/**
 * A default memoized decorate function.
 */
const defaultDecorate = () => []

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
    placeholder: String
  },
  components: {
    Children
  },
  mixins: [SlateMixin],
  provide() {
    return {
      'renderLeaf': this.renderLeaf,
      'renderElement': this.renderElement,
      'decorate': this.decorate,
      'readOnly': this.readOnly
    }
  },
  data() {
    return {
      latestElement: null,
      isComposing: false,
      isUpdatingSelection: false
    }
  },
  methods: {
    onClick(event) {
      const editor = this.$editor
      if (
        !this.readOnly &&
        hasTarget(editor, event.target) &&
        isDOMNode(event.target)
      ) {
        const node = VueEditor.toSlateNode(editor, event.target)
        const path = VueEditor.findPath(editor, node)
        const start = Editor.start(editor, path)

        if (Editor.void(editor, { at: start })) {
          const range = Editor.range(editor, start)
          Transforms.select(editor, range)
        }
      }
    },
    onSelectionchange(e) {
      const { readOnly } = this;
      const editor = this.$editor
      if (!readOnly && !this.isComposing && !this.isUpdatingSelection) {
        const { activeElement } = window.document
        const el = VueEditor.toDOMNode(editor, editor)
        const domSelection = window.getSelection()
        const domRange =
          domSelection &&
          domSelection.rangeCount > 0 &&
          domSelection.getRangeAt(0)

        if (activeElement === el) {
          this.latestElement = activeElement
          IS_FOCUSED.set(editor, true)
        } else {
          IS_FOCUSED.delete(editor)
        }

        if (
          domRange &&
          hasEditableTarget(editor, domRange.startContainer) &&
          hasEditableTarget(editor, domRange.endContainer)
        ) {
          const range = VueEditor.toSlateRange(editor, domRange)
          Transforms.select(editor, range)
        } else {
          Transforms.deselect(editor)
        }
      }
    },
    onDOMBeforeInput(event: Event & {
      data: string | null
      dataTransfer: DataTransfer | null
      getTargetRanges(): DOMStaticRange[]
      inputType: string
      isComposing: boolean
    }) {
      const editor = this.$editor;
      if (
        !this.readOnly &&
        hasEditableTarget(editor, event.target)
      ) {
        const { selection } = editor
        const { inputType: type } = event
        const data = event.dataTransfer || event.data || undefined

        // These two types occur while a user is composing text and can't be
        // cancelled. Let them through and wait for the composition to end.
        if (
          type === 'insertCompositionText' ||
          type === 'deleteCompositionText'
        ) {
          return
        }

        event.preventDefault()

        // COMPAT: For the deleting forward/backward input types we don't want
        // to change the selection because it is the range that will be deleted,
        // and those commands determine that for themselves.
        if (!type.startsWith('delete') || type.startsWith('deleteBy')) {
          const [targetRange] = event.getTargetRanges()

          if (targetRange) {
            const range = VueEditor.toSlateRange(editor, targetRange)

            if (!selection || !Range.equals(selection, range)) {
              Transforms.select(editor, range)
            }
          }
        }

        // COMPAT: If the selection is expanded, even if the command seems like
        // a delete forward/backward command it should delete the selection.
        if (
          selection &&
          Range.isExpanded(selection) &&
          type.startsWith('delete')
        ) {
          Editor.deleteFragment(editor)
          return
        }

        switch (type) {
          case 'deleteByComposition':
          case 'deleteByCut':
          case 'deleteByDrag': {
            Editor.deleteFragment(editor)
            break
          }

          case 'deleteContent':
          case 'deleteContentForward': {
            Editor.deleteForward(editor)
            break
          }

          case 'deleteContentBackward': {
            Editor.deleteBackward(editor)
            break
          }

          case 'deleteEntireSoftLine': {
            Editor.deleteBackward(editor, { unit: 'line' })
            Editor.deleteForward(editor, { unit: 'line' })
            break
          }

          case 'deleteHardLineBackward': {
            Editor.deleteBackward(editor, { unit: 'block' })
            break
          }

          case 'deleteSoftLineBackward': {
            Editor.deleteBackward(editor, { unit: 'line' })
            break
          }

          case 'deleteHardLineForward': {
            Editor.deleteForward(editor, { unit: 'block' })
            break
          }

          case 'deleteSoftLineForward': {
            Editor.deleteForward(editor, { unit: 'line' })
            break
          }

          case 'deleteWordBackward': {
            Editor.deleteBackward(editor, { unit: 'word' })
            break
          }

          case 'deleteWordForward': {
            Editor.deleteForward(editor, { unit: 'word' })
            break
          }

          case 'insertLineBreak':
          case 'insertParagraph': {
            Editor.insertBreak(editor)
            break
          }

          case 'insertFromComposition':
          case 'insertFromDrop':
          case 'insertFromPaste':
          case 'insertFromYank':
          case 'insertReplacementText':
          case 'insertText': {
            if (data instanceof DataTransfer) {
              VueEditor.insertData(editor, data)
            } else if (typeof data === 'string') {
              Editor.insertText(editor, data)
            }

            break
          }
        }
      }
    },
    onCompositionEnd(e) {

    },
    onKeyDown(e) {

    },
    onFocus(event) {
      const editor = this.$editor
      if (
        !this.readOnly &&
        !this.isUpdatingSelection &&
        hasEditableTarget(editor, event.target)
      ) {
        const el = VueEditor.toDOMNode(editor, editor)
        this.latestElement = window.document.activeElement

        // COMPAT: If the editor has nested editable elements, the focus
        // can go to them. In Firefox, this must be prevented because it
        // results in issues with keyboard navigation. (2017/03/30)
        if (IS_FIREFOX && event.target !== el) {
          el.focus()
          return
        }

        IS_FOCUSED.set(editor, true)
      }
    },
    onBlur(event) {
      const editor = this.$editor
      if (
        this.readOnly ||
        this.isUpdatingSelection ||
        !hasEditableTarget(editor, event.target)
      ) {
        return
      }

      // COMPAT: If the current `activeElement` is still the previous
      // one, this is due to the window being blurred when the tab
      // itself becomes unfocused, so we want to abort early to allow to
      // editor to stay focused when the tab becomes focused again.
      if (this.latestElement === window.document.activeElement) {
        return
      }

      const { relatedTarget } = event
      const el = VueEditor.toDOMNode(editor, editor)

      // COMPAT: The event should be ignored if the focus is returning
      // to the editor from an embedded editable element (eg. an <input>
      // element inside a void node).
      if (relatedTarget === el) {
        return
      }

      // COMPAT: The event should be ignored if the focus is moving from
      // the editor to inside a void node's spacer element.
      if (
        isDOMElement(relatedTarget) &&
        relatedTarget.hasAttribute('data-slate-spacer')
      ) {
        return
      }

      // COMPAT: The event should be ignored if the focus is moving to a
      // non- editable section of an element that isn't a void node (eg.
      // a list item of the check list example).
      if (
        relatedTarget != null &&
        isDOMNode(relatedTarget) &&
        VueEditor.hasDOMNode(editor, relatedTarget)
      ) {
        const node = VueEditor.toSlateNode(editor, relatedTarget)

        if (Element.isElement(node) && !editor.isVoid(node)) {
          return
        }
      }

      IS_FOCUSED.delete(editor)
    }
  },
  hooks() {
    const ref = this.ref = useRef(null);
    const editor = this.$editor;
    IS_READ_ONLY.set(editor, this.readOnly)

    const initListener = ()=>{
      // Attach a native DOM event handler for `selectionchange`
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
          ref.current.focus()
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
    const updateSelection = ()=> {
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

        const newDomRange = selection && VueEditor.toDOMRange(editor, selection)

        // If the DOM selection is already correct, we're done.
        if (
          hasDomSelection &&
          newDomRange &&
          isRangeEqual(domSelection.getRangeAt(0), newDomRange)
        ) {
          return
        }

        // Otherwise the DOM selection is out of sync, so update it.
        const el = VueEditor.toDOMNode(editor, editor)
        this.isUpdatingSelection = true
        domSelection.removeAllRanges()

        if (newDomRange) {
          domSelection.addRange(newDomRange)
          // const leafEl = newDomRange.startContainer.parentElement!
          // scrollIntoView(leafEl, { scrollMode: 'if-needed' })
        }

        setTimeout(() => {
          // COMPAT: In Firefox, it's not enough to create a range, you also need
          // to focus the contenteditable element too. (2016/11/16)
          if (newDomRange && IS_FIREFOX) {
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
    // The autoFocus TextareaHTMLAttribute doesn't do anything on a div, so it
    // needs to be manually focused.
    updateAutoFocus();
    // Whenever the editor updates, make sure the DOM selection state is in sync.
    updateSelection();
  },
  render() {
    // set vue component
    const editor = this.$editor;
    const {ref, decorate} = this;
    // name must be corresponded with standard
    const on = {
      keydown: this.onKeyDown,
      focus: this.onFocus,
      blur: this.onBlur,
      beforeinput: this.onDOMBeforeInput
    };
    const decorations = decorate([editor, []]);
    const initDecorations = () => {
      const {placeholder} = this
      if (
        placeholder &&
        editor.children.length === 1 &&
        Array.from(Node.texts(editor)).length === 1 &&
        Node.string(editor) === ''
      ) {
        const start = Editor.start(editor, [])
        decorations.push({
          [PLACEHOLDER_SYMBOL]: true,
          placeholder,
          anchor: start,
          focus: start,
        })
        editor._vue.placeholder = true
      } else {
        editor._vue.placeholder = false
      }
      return decorations
    }
    initDecorations()
    return (
      <div
        ref = {ref.id}
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
        >
        <Children
          decorations={decorations}
          node={editor}
        />
      </div>
    )
  }
})
