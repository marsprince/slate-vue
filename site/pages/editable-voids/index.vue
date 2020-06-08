<template>
  <Slate :value="JSON.stringify(initialValue)">
    <Toolbar>
      <InsertEditableVoidButton></InsertEditableVoidButton>
    </Toolbar>
    <Editable placeholder="Enter some plain text..." :renderElement="renderElement"></Editable>
  </Slate>
</template>

<script>
  import {Slate, Editable} from 'slate-vue'
  import {withEditableVoids, renderElement} from './render';
  import Toolbar from '../components/toolbar'
  import InsertEditableVoidButton from './insertEditableVoidButton';

  // this value is for editor
  const initialValue = [
    {
      type: 'paragraph',
      children: [
        {
          text:
            'In addition to nodes that contain editable text, you can insert void nodes, which can also contain editable elements, inputs, or an entire other Slate editor.',
        },
      ],
    },
    {
      type: 'editable-void',
      children: [{ text: '' }],
    },
    {
      type: 'paragraph',
      children: [
        {
          text: '',
        },
      ],
    },
  ]

  export default {
    name: 'editable-voids',
    components: {
      Slate,
      Editable,
      Toolbar,
      InsertEditableVoidButton
    },
    data() {
      return {
        initialValue,
        renderElement
      }
    },
    created() {
      withEditableVoids(this.$editor)
    }
  };
</script>

<style scoped>

</style>
