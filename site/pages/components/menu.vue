<template>
  <div class="menu">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'ToolBarMenu',
  };
</script>

<style scoped lang="less">
.menu {
  & > * {
    display: inline-block;
  }

  & > * + * {
    margin-left: 15px;
  }
}
</style>
