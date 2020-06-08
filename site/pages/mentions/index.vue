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
    <fragment>
      <div class="mentions" v-if="target && chars.length > 0" :ref="ref.id">
        <div class="mentions__item" v-for="(char, i) in chars" :key="char" :style="[{background: i === index ? '#B4D5FF' : 'transparent'}]">
          {{char}}
        </div>
      </div>
    </fragment>
  </Slate>
</template>
<script>
  import { Slate, Editable, useEffect, useRef, VueEditor, Transforms, fragment } from 'slate-vue';
  import {renderElement} from './render';
  import {Editor, Range} from 'slate'
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
      Editable,
      fragment
    },
    hooks() {
      const ref = this.ref = useRef(null)
      const {target, index, search, chars} = this
      const editor = this.$editor
      useEffect(() => {
        if (target && chars.length > 0) {
          const el = ref.current
          const domRange = VueEditor.toDOMRange(editor, target)
          const rect = domRange.getBoundingClientRect()
          el.style.top = `${rect.top + window.pageYOffset + 24}px`
          el.style.left = `${rect.left + window.pageXOffset}px`
        }
      }, [chars.length, editor, index, search, target])
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
        const {chars,index} = this
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

<style scoped lang="less">
.mentions {
  top: -9999px;
  left: -9999px;
  position: absolute;
  z-index: 1;
  padding: 3px;
  background: white;
  border-radius: 4px;
  box-shadow: 0 1px 5px rgba(0,0,0,.2);
  &__item {
    padding: 1px 3px;
    border-radius: 3px;
  }
}
</style>
