<template>
  <Slate :value="JSON.stringify(initialValue)">
    <Toolbar>
      <MarkButton format="bold" icon="format_bold" />
      <MarkButton format="italic" icon="format_italic" />
      <MarkButton format="underline" icon="format_underlined" />
      <MarkButton format="code" icon="code" />
      <BlockButton format="heading-one" icon="looks_one" />
      <BlockButton format="heading-two" icon="looks_two" />
      <BlockButton format="block-quote" icon="format_quote" />
      <BlockButton format="numbered-list" icon="format_list_numbered" />
      <BlockButton format="bulleted-list" icon="format_list_bulleted" />
    </Toolbar>
    <Editable placeholder="Enter some rich text…" :renderLeaf="renderLeaf" :renderElement="renderElement"></Editable>
  </Slate>
</template>

<script>
  import {Slate, Editable} from 'slate-vue'
  import {renderLeaf, renderElement} from './render';
  import MarkButton from '../components/markButton';
  import BlockButton from '../components/blockButton'
  import Toolbar from '../components/toolbar';

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
      Toolbar,
      MarkButton,
      BlockButton
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
