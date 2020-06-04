<template>
  <Slate :value="JSON.stringify(initialValue)">
    <hoveringToolbar></hoveringToolbar>
    <Editable placeholder="Enter some plain text..."
              :onDOMBeforeInput="onDOMBeforeInput"
              :renderLeaf="renderLeaf"></Editable>
  </Slate>
</template>

<script>
  import {Slate, Editable} from 'slate-vue'
  import {toggleFormat} from './util';
  import {renderLeaf} from './render';
  import hoveringToolbar from './hoveringToolbar';

  // this value is for editor
  const initialValue = [
    {
      children: [
        {
          text:
            'This example shows how you can make a hovering menu appear above your content, which you can use to make text ',
        },
        { text: 'bold', bold: true },
        { text: ', ' },
        { text: 'italic', italic: true },
        { text: ', or anything else you might want to do!' },
      ],
    },
    {
      children: [
        { text: 'Try it out yourself! Just ' },
        { text: 'select any piece of text and the menu will appear', bold: true },
        { text: '.' },
      ],
    },
  ]

  export default {
    name: 'hovering-toolbar',
    components: {
      Slate,
      Editable,
      hoveringToolbar
    },
    data() {
      return {
        initialValue,
        renderLeaf
      }
    },
    methods: {
      onDOMBeforeInput(event) {
        const editor = this.$editor
        switch (event.inputType) {
          case 'formatBold':
            return toggleFormat(editor, 'bold')
          case 'formatItalic':
            return toggleFormat(editor, 'italic')
          case 'formatUnderline':
            return toggleFormat(editor, 'underline')
        }
      }
    }
  };
</script>

<style scoped>

</style>
