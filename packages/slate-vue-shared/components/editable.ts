import {
  DOMNode,
  Hotkeys,
  HAS_BEFORE_INPUT_SUPPORT,
  IS_FOCUSED,
  IS_SAFARI,
  isDOMElement,
  isDOMNode,
  isPlainTextOnlyPaste,
  IS_FIREFOX_LEGACY,
} from '../utils'
import { VueEditor } from '../plugins'
import { Editor, Element as SlateElement, Range, Transforms } from 'slate'

/**
 * Check if the target is in the editor.
 */

const hasTarget = (
  editor: VueEditor,
  target: EventTarget | null
): target is DOMNode => {
  return isDOMNode(target) && VueEditor.hasDOMNode(editor, target)
}

/**
 * Check if an event is overrided by a handler.
 */

const isEventHandled = (event: any, handler?: (event: any) => void) => {
  if (!handler) {
    return false
  }
  handler(event)
  return event.defaultPrevented || event.cancelBubble
}

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
}

/**
 * Check if the target is inside void and in the editor.
 */

const isTargetInsideVoid = (
  editor: VueEditor,
  target: EventTarget | null
): boolean => {
  const slateNode =
    hasTarget(editor, target) && VueEditor.toSlateNode(editor, target)
  return Editor.isVoid(editor, slateNode)
}

/****************************/
/**
 * Reusable methods
 */

export const EditableComponent = {
  /**
   * ctx means this in vue2 and vue3 and other obj
   * @param event
   * @param editor
   * @param ctx
   */
  onClick(event: any, editor: any, ctx: any) {
    if (
      !ctx.readOnly &&
      hasTarget(editor, event.target) &&
      isDOMNode(event.target) &&
      !isEventHandled(event, ctx.onClick)
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
  onBeforeInput(event: any, editor: any, ctx: any) {
    if (
      !HAS_BEFORE_INPUT_SUPPORT &&
      !ctx.readOnly &&
      !isEventHandled(event, ctx.onBeforeInput) &&
      hasEditableTarget(editor, event.target)
    ) {
      event.preventDefault()
      const { selection } = editor
      const { inputType: type } = event
      const data = event.dataTransfer || event.data || undefined

      const text = (event as any).detail as string
      Editor.insertText(editor, text)

      // These two types occur while a user is composing text and can't be
      // cancelled. Let them through and wait for the composition to end.
      if (
        type === 'insertCompositionText' ||
        type === 'deleteCompositionText'
      ) {
        return
      }

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
  onCompositionEnd(event: any, editor: any, ctx: any) {
    if (
      hasEditableTarget(editor, event.target) &&
      !isEventHandled(event, ctx.onCompositionEnd)
    ) {
      ctx.isComposing = false

      // COMPAT: In Chrome, `beforeinput` events for compositions
      // aren't correct and never fire the "insertFromComposition"
      // type that we need. So instead, insert whenever a composition
      // ends since it will already have been committed to the DOM.
      if (!IS_SAFARI && !IS_FIREFOX_LEGACY && event.data) {
        Editor.insertText(editor, event.data)
      }
    }
  },
  onCompositionStart(event: any, editor: any, ctx: any) {
    if (
      hasEditableTarget(editor, event.target) &&
      !isEventHandled(event, ctx.onCompositionStart)
    ) {
      ctx.isComposing = true
    }
  },
  onKeyDown(event: any, editor: any, ctx: any) {
    if (
      !ctx.readOnly &&
      hasEditableTarget(editor, event.target) &&
      !isEventHandled(event, ctx.onKeyDown)
    ) {
      const nativeEvent = event
      const { selection } = editor

      // COMPAT: Since we prevent the default behavior on
      // `beforeinput` events, the browser doesn't think there's ever
      // any history stack to undo or redo, so we have to manage these
      // hotkeys ourselves. (2019/11/06)
      if (Hotkeys.isRedo(nativeEvent)) {
        event.preventDefault()

        if (editor.redo) {
          // slate-history
          // @ts-ignore
          editor.redo()
        }

        return
      }

      if (Hotkeys.isUndo(nativeEvent)) {
        event.preventDefault()

        if (editor.undo) {
          // slate-history
          // @ts-ignore
          editor.undo()
        }

        return
      }

      // COMPAT: Certain browsers don't handle the selection updates
      // properly. In Chrome, the selection isn't properly extended.
      // And in Firefox, the selection isn't properly collapsed.
      // (2017/10/17)
      if (Hotkeys.isMoveLineBackward(nativeEvent)) {
        event.preventDefault()
        Transforms.move(editor, { unit: 'line', reverse: true })
        return
      }

      if (Hotkeys.isMoveLineForward(nativeEvent)) {
        event.preventDefault()
        Transforms.move(editor, { unit: 'line' })
        return
      }

      if (Hotkeys.isExtendLineBackward(nativeEvent)) {
        event.preventDefault()
        Transforms.move(editor, {
          unit: 'line',
          edge: 'focus',
          reverse: true,
        })
        return
      }

      if (Hotkeys.isExtendLineForward(nativeEvent)) {
        event.preventDefault()
        Transforms.move(editor, { unit: 'line', edge: 'focus' })
        return
      }

      // COMPAT: If a void node is selected, or a zero-width text node
      // adjacent to an inline is selected, we need to handle these
      // hotkeys manually because browsers won't be able to skip over
      // the void node with the zero-width space not being an empty
      // string.
      if (Hotkeys.isMoveBackward(nativeEvent)) {
        event.preventDefault()

        if (selection && Range.isCollapsed(selection)) {
          Transforms.move(editor, { reverse: true })
        } else {
          Transforms.collapse(editor, { edge: 'start' })
        }

        return
      }

      if (Hotkeys.isMoveForward(nativeEvent)) {
        event.preventDefault()

        if (selection && Range.isCollapsed(selection)) {
          Transforms.move(editor)
        } else {
          Transforms.collapse(editor, { edge: 'end' })
        }

        return
      }

      if (Hotkeys.isMoveWordBackward(nativeEvent)) {
        event.preventDefault()
        Transforms.move(editor, { unit: 'word', reverse: true })
        return
      }

      if (Hotkeys.isMoveWordForward(nativeEvent)) {
        event.preventDefault()
        Transforms.move(editor, { unit: 'word' })
        return
      }

      // COMPAT: Certain browsers don't support the `beforeinput` event, so we
      // fall back to guessing at the input intention for hotkeys.
      // COMPAT: In iOS, some of these hotkeys are handled in the
      if (!HAS_BEFORE_INPUT_SUPPORT) {
        // We don't have a core behavior for these, but they change the
        // DOM if we don't prevent them, so we have to.
        if (
          Hotkeys.isBold(nativeEvent) ||
          Hotkeys.isItalic(nativeEvent) ||
          Hotkeys.isTransposeCharacter(nativeEvent)
        ) {
          event.preventDefault()
          return
        }

        if (Hotkeys.isSplitBlock(nativeEvent)) {
          event.preventDefault()
          Editor.insertBreak(editor)
          return
        }

        if (Hotkeys.isDeleteBackward(nativeEvent)) {
          event.preventDefault()

          if (selection && Range.isExpanded(selection)) {
            Editor.deleteFragment(editor)
          } else {
            Editor.deleteBackward(editor)
          }

          return
        }

        if (Hotkeys.isDeleteForward(nativeEvent)) {
          event.preventDefault()

          if (selection && Range.isExpanded(selection)) {
            Editor.deleteFragment(editor)
          } else {
            Editor.deleteForward(editor)
          }

          return
        }

        if (Hotkeys.isDeleteLineBackward(nativeEvent)) {
          event.preventDefault()

          if (selection && Range.isExpanded(selection)) {
            Editor.deleteFragment(editor)
          } else {
            Editor.deleteBackward(editor, { unit: 'line' })
          }

          return
        }

        if (Hotkeys.isDeleteLineForward(nativeEvent)) {
          event.preventDefault()

          if (selection && Range.isExpanded(selection)) {
            Editor.deleteFragment(editor)
          } else {
            Editor.deleteForward(editor, { unit: 'line' })
          }

          return
        }

        if (Hotkeys.isDeleteWordBackward(nativeEvent)) {
          event.preventDefault()

          if (selection && Range.isExpanded(selection)) {
            Editor.deleteFragment(editor)
          } else {
            Editor.deleteBackward(editor, { unit: 'word' })
          }

          return
        }

        if (Hotkeys.isDeleteWordForward(nativeEvent)) {
          event.preventDefault()

          if (selection && Range.isExpanded(selection)) {
            Editor.deleteFragment(editor)
          } else {
            Editor.deleteForward(editor, { unit: 'word' })
          }

          return
        }
      }
    }
  },
  onFocus(event: any, editor: any, ctx: any) {
    if (
      !ctx.readOnly &&
      !ctx.isUpdatingSelection &&
      hasEditableTarget(editor, event.target) &&
      !isEventHandled(event, ctx.onFocus)
    ) {
      const el = VueEditor.toDOMNode(editor, editor)
      ctx.latestElement = window.document.activeElement

      // COMPAT: If the editor has nested editable elements, the focus
      // can go to them. In Firefox, this must be prevented because it
      // results in issues with keyboard navigation. (2017/03/30)
      if (IS_FIREFOX_LEGACY && event.target !== el) {
        el.focus()
        return
      }

      IS_FOCUSED.set(editor, true)
    }
  },
  onBlur(event: any, editor: any, ctx: any) {
    if (
      ctx.readOnly ||
      ctx.isUpdatingSelection ||
      !hasEditableTarget(editor, event.target) ||
      !isEventHandled(event, ctx.onBlur)
    ) {
      return
    }

    // COMPAT: If the current `activeElement` is still the previous
    // one, this is due to the window being blurred when the tab
    // itself becomes unfocused, so we want to abort early to allow to
    // editor to stay focused when the tab becomes focused again.
    if (ctx.latestElement === window.document.activeElement) {
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

      if (SlateElement.isElement(node) && !editor.isVoid(node)) {
        return
      }
    }

    IS_FOCUSED.delete(editor)
  },
  onCopy(event: any, editor: any, ctx: any) {
    if (
      hasEditableTarget(editor, event.target) &&
      !isEventHandled(event, ctx.onCopy)
    ) {
      event.preventDefault()
      VueEditor.setFragmentData(editor, event.clipboardData)
    }
  },
  onPaste(event: any, editor: any, ctx: any) {
    if (
      (!HAS_BEFORE_INPUT_SUPPORT || isPlainTextOnlyPaste(event)) &&
      !ctx.readOnly &&
      hasEditableTarget(editor, event.target) &&
      !isEventHandled(event, ctx.onPaste)
    ) {
      event.preventDefault()
      VueEditor.insertData(editor, event.clipboardData)
    }
  },
  onCut(event: any, editor: any, ctx: any) {
    if (
      !ctx.readOnly &&
      hasEditableTarget(editor, event.target) &&
      !isEventHandled(event, ctx.onCut)
    ) {
      event.preventDefault()
      VueEditor.setFragmentData(editor, event.clipboardData)
      const { selection } = editor

      if (selection && Range.isExpanded(selection)) {
        Editor.deleteFragment(editor)
      }
    }
  },
  onDragOver(event: any, editor: any, ctx: any) {
    if (
      hasTarget(editor, event.target) &&
      !isEventHandled(event, ctx.onDragOver)
    ) {
      // Only when the target is void, call `preventDefault` to signal
      // that drops are allowed. Editable content is droppable by
      // default, and calling `preventDefault` hides the cursor.
      const node = VueEditor.toSlateNode(editor, event.target)

      if (Editor.isVoid(editor, node)) {
        event.preventDefault()
      }
    }
  },
  onDragStart(event: any, editor: any, ctx: any) {
    if (
      hasTarget(editor, event.target) &&
      !isEventHandled(event, ctx.onDragStart)
    ) {
      const node = VueEditor.toSlateNode(editor, event.target)
      const path = VueEditor.findPath(editor, node)
      const voidMatch = Editor.void(editor, { at: path })

      // If starting a drag on a void node, make sure it is selected
      // so that it shows up in the selection's fragment.
      if (voidMatch) {
        const range = Editor.range(editor, path)
        Transforms.select(editor, range)
      }

      VueEditor.setFragmentData(editor, event.clipboardData)
    }
  },
  onDrop(event: any, editor: any, ctx: any) {
    if (
      hasTarget(editor, event.target) &&
      !ctx.readOnly &&
      !isEventHandled(event, ctx.onDrop)
    ) {
      // COMPAT: Certain browsers don't fire `beforeinput` events at all, and
      // Chromium browsers don't properly fire them for files being
      // dropped into a `contenteditable`. (2019/11/26)
      // https://bugs.chromium.org/p/chromium/issues/detail?id=1028668
      if (
        !HAS_BEFORE_INPUT_SUPPORT ||
        (!IS_SAFARI && event.dataTransfer.files.length > 0)
      ) {
        event.preventDefault()
        const range = VueEditor.findEventRange(editor, event)
        const data = event.dataTransfer
        Transforms.select(editor, range)
        VueEditor.insertData(editor, data)
      }
    }
  },

  onSelectionchange(editor: any, ctx: any) {
    if (!ctx.readOnly && !ctx.isComposing && !ctx.isUpdatingSelection) {
      const { activeElement } = window.document
      const el = VueEditor.toDOMNode(editor, editor)
      const domSelection = window.getSelection()

      if (activeElement === el) {
        ctx.latestElement = activeElement
        IS_FOCUSED.set(editor, true)
      } else {
        IS_FOCUSED.delete(editor)
      }

      if (!domSelection) {
        return Transforms.deselect(editor)
      }

      const { anchorNode, focusNode } = domSelection

      const anchorNodeSelectable =
        hasEditableTarget(editor, anchorNode) ||
        isTargetInsideVoid(editor, anchorNode)

      const focusNodeSelectable =
        hasEditableTarget(editor, focusNode) ||
        isTargetInsideVoid(editor, focusNode)

      if (anchorNodeSelectable && focusNodeSelectable) {
        const range = VueEditor.toSlateRange(editor, domSelection)
        Transforms.select(editor, range)
      } else {
        Transforms.deselect(editor)
      }
    }
  },
}
