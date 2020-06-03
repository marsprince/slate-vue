<template>
  <Slate :value="JSON.stringify(initialValue)">
    <Editable placeholder="Get to work…" :renderElement="renderElement" :autoFocus="true"></Editable>
  </Slate>
</template>

<script>
  import {Slate, Editable} from 'slate-vue'
  import {renderElement} from './render'
  import { withChecklists } from './util';

  // this value is for editor
  const initialValue = [
    {
      children: [
        {
          text:
            'With Slate you can build complex block types that have their own embedded content and behaviors, like rendering checkboxes inside check list items!',
        },
      ],
    },
    {
      type: 'check-list-item',
      checked: true,
      children: [{ text: 'Slide to the left.' }],
    },
    {
      type: 'check-list-item',
      checked: true,
      children: [{ text: 'Slide to the right.' }],
    },
    {
      type: 'check-list-item',
      checked: false,
      children: [{ text: 'Criss-cross.' }],
    },
    {
      type: 'check-list-item',
      checked: true,
      children: [{ text: 'Criss-cross!' }],
    },
    {
      type: 'check-list-item',
      checked: false,
      children: [{ text: 'Cha cha real smooth…' }],
    },
    {
      type: 'check-list-item',
      checked: false,
      children: [{ text: "Let's go to work!" }],
    },
    {
      children: [{ text: 'Try it out for yourself!' }],
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
      withChecklists(this.$editor)
    }
  };
</script>

<style scoped>

</style>
