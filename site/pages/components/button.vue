<template>
    <span class="button" :class="{active: active}" @mousedown="$emit('mouseDown', $event)">
      <slot></slot>
    </span>
</template>

<script>
  export default {
    name: 's-button',
    props: {
      active: Boolean
    }
  };
</script>

<style scoped lang="less">
.button {
  cursor: pointer;
  color: #ccc;
  &.active {
    color: black;
  }
}
</style>
