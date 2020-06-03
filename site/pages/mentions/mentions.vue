<template>
    <span
      contentEditable='false'
      class="mentions"
      :style="{ boxShadow: selected && focused ? '0 0 0 2px #B4D5FF' : 'none'}"
    >@{{element.character}}<slot></slot>
    </span>
</template>

<script>
  import { FocusedMixin, SelectedMixin } from 'slate-vue';

  export default {
    name: 'mentions',
    mixins: [SelectedMixin, FocusedMixin],
    props: {
      element: Object
    }
  };
</script>

<style scoped lang="less">
.mentions {
  padding: 3px 3px 2px;
  margin: 0 1px;
  vertical-align: baseline;
  display: inline-block;
  border-radius: 4px;
  background-color: #eee;
  font-size: 0.9em
}
</style>
