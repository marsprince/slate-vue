<template>
  <input v-model="value" @click="onClick" @change="onChange" />
</template>

<script>
  export default {
    name: 'UrlInput',
    props: {
      url: String,
    },
    data() {
      return {
        value: this.url,
      }
    },
    methods: {
      onClick(e) {
        e.stopPropagation()
      },
      onChange(e) {
        const newUrl = e.target.value
        this.value = newUrl
        this.$emit('change', newUrl)
      },
    },
  }
</script>

<style scoped>
  input {
    margin-top: 5px;
    box-sizing: border-box;
  }
</style>
