<template>
  <div>
    <Slate>
      <Editable></Editable>
    </Slate>
  </div>
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
    name: 'index',
    components: {
      Slate,
      Editable
    },
    mounted() {

    }
  };
</script>

<style scoped>

</style>
