<template>
  <div class="toolbar">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'toolbar',
  };
</script>

<style scoped lang="less">
.toolbar {
  position: relative;
  padding: 1px 18px 17px;
  margin: 0 -20px;
  border-bottom: 2px solid #eee;
  margin-bottom: 20px;
}
</style>
