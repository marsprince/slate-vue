import Children from './children';
import * as tsx from "vue-tsx-support";
import { useEffect, useRef } from '../plugins/vue-hooks';
// import throttle from 'lodash/throttle'
import {ReactEditor} from '..';
import {IS_FOCUSED, EDITOR_TO_ELEMENT, NODE_TO_ELEMENT, ELEMENT_TO_NODE} from '../utils/weak-maps';
import {DOMNode,isDOMNode} from '../utils/dom';
import {Transforms, Range,Editor} from 'slate';
import {DOMStaticRange} from '../utils/dom';

const hasEditableTarget = (
  editor: ReactEditor,
  target: EventTarget | null
): target is DOMNode => {
  return (
    isDOMNode(target) &&
    ReactEditor.hasDOMNode(editor, target, { editable: true })
  )
}
// the contentEditable div
export const Editable = tsx.component({
  // some global props will provide for child component
  props: {
    autoFocus: Boolean,
    renderLeaf: Function,
    renderElement: Function,
    readOnly: Boolean
  },
  components: {
    Children
  },
  provide() {
    return {
      'renderLeaf': this.renderLeaf,
      'renderElement': this.renderElement,
      'readOnly': this.readOnly
    }
  },
  data() {
    return {
      latestElement: null
    }
  },
  methods: {
    onClick(e) {
      console.log('click');
      console.log(e);
    },
    onSelectionchange(e) {
      const { readOnly } = this;
      const editor = this.$editor
      if (!readOnly) {
        const { activeElement } = window.document
        const el = ReactEditor.toDOMNode(editor, editor)
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
          const range = ReactEditor.toSlateRange(editor, domRange)
          Transforms.select(editor, range)
        } else {
          Transforms.deselect(editor)
        }
      }
    },
    onBeforeInput(event: Event & {
      data: string | null
      dataTransfer: DataTransfer | null
      getTargetRanges(): DOMStaticRange[]
      inputType: string
      isComposing: boolean
    }) {
      const editor = this.$editor;
      if(!this.readOnly) {
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
            const range = ReactEditor.toSlateRange(editor, targetRange)

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
              ReactEditor.insertData(editor, data)
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

    }
  },
  hooks() {
    const ref = this.ref = useRef(null);
    const editor = this.$editor;
    const initListener = ()=>{
      // Attach a native DOM event handler for `selectionchange`
      useEffect(()=>{
        document.addEventListener('selectionchange', this.onSelectionchange)
        return () => {
          document.removeEventListener('selectionchange', this.onSelectionchange)
        }
      }, []);
    };
    const initRef = () => {
      // use autofocus
      useEffect(() => {
        if (ref.current && this.autoFocus) {
          ref.current.focus()
        }
      }, [this.autoFocus])

      // Update element-related weak maps with the DOM element ref.
      useEffect(() => {
        if (ref.current) {
          EDITOR_TO_ELEMENT.set(editor, ref.current)
          NODE_TO_ELEMENT.set(editor, ref.current)
          ELEMENT_TO_NODE.set(ref.current, editor)
        } else {
          NODE_TO_ELEMENT.delete(editor)
        }
      },[])
    };
    initListener();
    initRef();
  },
  render() {
    const editor = this.$editor;
    const ref = this.ref;
    // name must be correspond with standard
    const on = {
      keydown: this.onKeyDown,
      beforeinput: this.onBeforeInput
    }
    return (
      <div
        ref = {ref.id}
        contenteditable={true}
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
          node={editor}
        />
      </div>
    )
  }
})
