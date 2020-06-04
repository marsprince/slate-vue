<template>
    <span class="button"
          :style="{color: color}"
          @mousedown="$emit('mouseDown', $event)">
      <slot></slot>
    </span>
</template>

<script>
  export default {
    name: 's-button',
    props: {
      active: Boolean,
      reversed: Boolean
    },
    computed: {
      color() {
        return this.reversed
          ? (this.active
            ? 'white'
            : '#aaa')
          : (this.active
            ? 'black'
            : '#ccc')
      }
    }
  };
</script>

<style scoped lang="less">
.button {
  cursor: pointer;
}
</style>
