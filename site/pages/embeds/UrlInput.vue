<template>
  <input
    v-model="value"
    @click="onClick"
    @change="onChange"
  />
</template>

<script>
  export default {
    name: 'UrlInput',
    props: {
      url: String
    },
    data() {
      return {
        value: this.url
      }
    },
    methods: {
      onClick(e) {
        e.stopPropagation()
      },
      onChange() {
        this.$emit('change', this.value)
      }
    }
  };
</script>

<style scoped>

</style>
