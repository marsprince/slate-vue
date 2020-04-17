<template>
  <div class="main">
    <plaintext></plaintext>
  </div>
</template>

<script>
  import plaintext from './pages/plaintext';
  export default {
    name: 'app',
    components: {
      plaintext
    }
  };
</script>

<style scoped lang="less">
.main {
  background: #fff;
  max-width: 42em;
  margin: 20px auto;
  padding: 20px;
}
</style>
