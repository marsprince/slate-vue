<template>
  <Button @mouseDown='onMouseDown'>
    <Icon icon="add"></Icon>
  </Button>
</template>

<script>
  import Button from '../components/button'
  import Icon from '../components/icon'
  import {Transforms} from 'slate-vue';

  const insertEditableVoid = editor => {
    const text = { text: '' }
    const voidNode = { type: 'editable-void', children: [text] }
    Transforms.insertNodes(editor, voidNode)
  }

  export default {
    name: 'insertEditableVoidButton',
    components: {
      Button,
      Icon
    },
    methods: {
      onMouseDown(event) {
        event.preventDefault()
        insertEditableVoid(this.$editor)
      }
    }
  };
</script>

<style scoped>

</style>
