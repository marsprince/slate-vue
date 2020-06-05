<template>
  <Slate :value="JSON.stringify(initialValue)">
    <Editable placeholder="Enter some plain text..." :renderElement="renderElement"></Editable>
  </Slate>
</template>

<script>
  import {Slate, Editable} from 'slate-vue'
  import {withShortcuts, renderElement} from './render';

  // this value is for editor
  const initialValue = [
    {
      type: 'paragraph',
      children: [
        {
          text:
            'The editor gives you full control over the logic you can add. For example, it\'s fairly common to want to add markdown-like shortcuts to editors. So that, when you start a line with "> " you get a blockquote that looks like this:',
        },
      ],
    },
    {
      type: 'block-quote',
      children: [{ text: 'A wise quote.' }],
    },
    {
      type: 'paragraph',
      children: [
        {
          text:
            'Order when you start a line with "## " you get a level-two heading, like this:',
        },
      ],
    },
    {
      type: 'heading-two',
      children: [{ text: 'Try it out!' }],
    },
    {
      type: 'paragraph',
      children: [
        {
          text:
            'Try it out for yourself! Try starting a new line with ">", "-", or "#"s.',
        },
      ],
    },
  ]

  export default {
    name: 'index',
    components: {
      Slate,
      Editable
    },
    data() {
      return {
        initialValue,
        renderElement
      }
    },
    created() {
      withShortcuts(this.$editor)
    }
  };
</script>

<style scoped>

</style>
