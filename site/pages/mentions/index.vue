<template>
  <Slate
    :value="JSON.stringify(initialValue)"
    @onChange="onChange"
  >
    <Editable
      :renderElement="renderElement"
      placeholder="Enter some text..."
      :onKeyDown="onKeyDown"
    />
  </Slate>
</template>
<script>
  import {Slate, Editable} from 'slate-vue'
  import {renderElement} from './render';
  import {Editor, Transforms, Range} from 'slate'
  import { CHARACTERS, insertMention, withMentions } from './utils';

  // this value is for editor
  const initialValue = [
    {
      children: [
        {
          text:
            'This example shows how you might implement a simple @-mentions feature that lets users autocomplete mentioning a user by their username. Which, in this case means Star Wars characters. The mentions are rendered as void inline elements inside the document.',
        },
      ],
    },
    {
      children: [
        { text: 'Try mentioning characters, like ' },
        {
          type: 'mention',
          character: 'R2-D2',
          children: [{ text: '' }],
        },
        { text: ' or ' },
        {
          type: 'mention',
          character: 'Mace Windu',
          children: [{ text: '' }],
        },
        { text: '!' },
      ],
    },
  ]
  export default {
    name: 'mentions',
    components: {
      Slate,
      Editable
    },
    data() {
      return {
        target: null,
        search: '',
        index: 0,
        renderElement,
        initialValue
      }
    },
    computed: {
      chars() {
        return CHARACTERS.filter(c =>
          c.toLowerCase().startsWith(this.search.toLowerCase())
        ).slice(0, 10)
      }
    },
    methods: {
      onKeyDown(event) {
        const editor = this.$editor
        const {chars} = this
        if (this.target) {
          switch (event.key) {
            case 'ArrowDown':
              event.preventDefault()
              const prevIndex = index >= chars.length - 1 ? 0 : index + 1
              this.index = prevIndex
              break
            case 'ArrowUp':
              event.preventDefault()
              const nextIndex = index <= 0 ? chars.length - 1 : index - 1
              this.index = nextIndex
              break
            case 'Tab':
            case 'Enter':
              event.preventDefault()
              Transforms.select(editor, this.target)
              insertMention(editor, chars[index])
              this.target = null
              break
            case 'Escape':
              event.preventDefault()
              this.target = null
              break
          }
        }
      },
      onChange() {
        console.log('change');
        const editor = this.$editor
        const { selection } = editor

        if (selection && Range.isCollapsed(selection)) {
          const [start] = Range.edges(selection)
          const wordBefore = Editor.before(editor, start, { unit: 'word' })
          const before = wordBefore && Editor.before(editor, wordBefore)
          const beforeRange = before && Editor.range(editor, before, start)
          const beforeText = beforeRange && Editor.string(editor, beforeRange)
          const beforeMatch = beforeText && beforeText.match(/^@(\w+)$/)
          const after = Editor.after(editor, start)
          const afterRange = Editor.range(editor, start, after)
          const afterText = Editor.string(editor, afterRange)
          const afterMatch = afterText.match(/^(\s|$)/)

          if (beforeMatch && afterMatch) {
            this.target = beforeRange
            this.search = beforeMatch[1]
            this.index = 0
            return
          }
        }

        this.target = null
      }
    },
    beforeCreate() {
      withMentions(this.$editor)
    }
  };
</script>

<style scoped>

</style>
