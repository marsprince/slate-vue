<template>
  <Menu ref="menu" class="hoveringToolbar">
    <FormatButton format="bold" icon="format_bold" />
    <FormatButton format="italic" icon="format_italic" />
    <FormatButton format="underlined" icon="format_underlined" />
  </Menu>
</template>

<script>
  import Menu from '../components/menu'
  import { useEffect, VueEditor, SlateMixin } from 'slate-vue';
  import {Editor, Range} from 'slate'
  import FormatButton from './formatButton'

  export default {
    name: 'hoveringToolbar',
    components: {
      Menu,
      FormatButton
    },
    mixins: [SlateMixin],
    hooks() {
      useEffect(() => {
        const el = this.$refs.menu.$el
        const editor = this.$editor
        const { selection } = editor

        if (!el) {
          return
        }

        if (
          !selection ||
          !VueEditor.isFocused(editor) ||
          Range.isCollapsed(selection) ||
          Editor.string(editor, selection) === ''
        ) {
          el.removeAttribute('style')
          return
        }

        const domSelection = window.getSelection()
        const domRange = domSelection.getRangeAt(0)
        const rect = domRange.getBoundingClientRect()
        el.style.opacity = 1
        el.style.top = `${rect.top + window.pageYOffset - el.offsetHeight}px`
        el.style.left = `${rect.left + window.pageXOffset - el.offsetWidth / 2 + rect.width / 2}px`
      })
    }
  };
</script>

<style scoped lang="less">
.hoveringToolbar {
  padding: 8px 7px 6px;
  position: absolute;
  z-index: 1;
  top: -10000px;
  left: -10000px;
  margin-top: -6px;
  opacity: 0;
  background-color: #222;
  border-radius: 4px;
  transition: opacity 0.75s;
}
</style>
