<template>
  <Slate :value="initialValue">
    <Editable></Editable>
  </Slate>
</template>

<script>
  import {Slate, Editable} from 'slate-vue'

  // this value is for editor
  const initialValue = [
    { text: 'This is editable plain text, just like a <textarea>!' },
  ]
  export default {
    name: 'index',
    components: {
      Slate,
      Editable
    },
    data() {
      return {
        initialValue
      }
    },
    beforeCreate() {

    }
  };
</script>

<style scoped>

</style>
