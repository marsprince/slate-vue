<template>
  <Slate :value="JSON.stringify(initialValue)">
    <Toolbar></Toolbar>
    <Editable placeholder="Enter some rich text…" :renderLeaf="renderLeaf" :renderElement="renderElement"></Editable>
  </Slate>
</template>

<script>
  import {Slate, Editable} from 'slate-vue'
  import Toolbar from './toolbar'
  import {renderLeaf, renderElement} from './render';

  // this value is for editor
  const initialValue = [
    {
      type: 'paragraph',
      children: [
        { text: 'This is editable ' },
        { text: 'rich', bold: true, italic: true },
        { text: ' text, ' },
        { text: 'much', italic: true },
        { text: ' better than a ' },
        { text: '<textarea>', code: true },
        { text: '!' },
      ],
    },
    {
      type: 'paragraph',
      children: [
        {
          text:
            "Since it's rich text, you can do things like turn a selection of text ",
        },
        { text: 'bold', bold: true },
        {
          text:
            ', or add a semantically rendered block quote in the middle of the page, like this:',
        },
      ],
    },
    {
      type: 'block-quote',
      children: [{ text: 'A wise quote.' }],
    },
    {
      type: 'paragraph',
      children: [{ text: 'Try it out for yourself!' }],
    },
  ]
  export default {
    name: 'richtext',
    components: {
      Slate,
      Editable,
      Toolbar
    },
    data() {
      return {
        initialValue,
        renderLeaf,
        renderElement
      }
    }
  };
</script>

<style scoped>

</style>
