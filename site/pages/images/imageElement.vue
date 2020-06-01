<template>
  <div>
    <div contentEditable="false">
      <img
        :src="element.url"
        :style="{ boxShadow: selected && focused ? '0 0 0 3px #B4D5FF' : 'none'}"
      />
    </div><!-- why there has an blank when using enter?/--><slot></slot>
  </div>
</template>
<script>
  import {SelectedMixin, FocusedMixin} from 'slate-vue';

  export default {
    name: 'imageElement',
    mixins: [SelectedMixin, FocusedMixin],
    props: {
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
