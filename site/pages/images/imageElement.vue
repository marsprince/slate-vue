<template>
  <div>
    <div contentEditable="false">
      <img
        :src="element.url"
        :style="{ boxShadow: selected && focused ? '0 0 0 3px #B4D5FF' : 'none'}"
      />
    </div>
    <slot></slot>
  </div>
</template>
<script>
  export default {
    name: 'imageElement',
    props: {
      selected: Boolean,
      focused: Boolean,
      element: Object
    },
  };
</script>

<style scoped lang="less">
img {
  display: block;
  max-width: 100%;
  max-height: 20em;
}
</style>
