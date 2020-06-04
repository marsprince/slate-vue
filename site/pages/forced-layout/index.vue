<template>
  <Slate :value="JSON.stringify(initialValue)">
    <Editable placeholder="Enter some plain text..." :renderElement="renderElement"></Editable>
  </Slate>
</template>

<script>
  import {Slate, Editable} from 'slate-vue'
  import {withLayout} from './util';
  import {renderElement} from './render';

  // this value is for editor
  const initialValue = [
    {
      type: 'title',
      children: [{ text: 'Enforce Your Layout!' }],
    },
    {
      type: 'paragraph',
      children: [
        {
          text:
            'This example shows how to enforce your layout with domain-specific constraints. This document will always have a title block at the top and at least one paragraph in the body. Try deleting them and see what happens!',
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
      withLayout(this.$editor)
    }
  };
</script>

<style scoped>

</style>
