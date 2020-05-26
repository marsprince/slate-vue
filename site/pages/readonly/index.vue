<template>
  <Slate :value="JSON.stringify(initialValue)">
    <Editable placeholder="Enter some plain text..." :readOnly="true"></Editable>
  </Slate>
</template>

<script>
  import {Slate, Editable} from 'slate-vue'

  // this value is for editor
  const initialValue = [
    {
      children: [
        { text: 'This is editable plain text, just like a <textarea>!' },
      ],
    },
  ]
  export default {
    name: 'readonly',
    components: {
      Slate,
      Editable
    },
    data() {
      return {
        initialValue
      }
    }
  };
</script>

<style scoped>

</style>
