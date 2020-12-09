<template>
  <div class="checkListItem">
    <span contentEditable="false" class="checkListItem__input">
      <input type="checkbox" :checked="checked" @change="onChange">
    </span>
    <span suppressContentEditableWarning class="checkListItem__content"
          :contentEditable="!readOnly"
          :style="[{opacity: checked ? 0.666 : 1}, {textDecoration: checked ? 'none' : 'line-through'}]">
      <slot></slot>
    </span>
  </div>
</template>

<script>
  import { Transforms, VueEditor } from 'slate-vue';

  export default {
    name: 'checkListItem',
    props: {
      element: Object
    },
    inject: ['readOnly'],
    computed: {
      checked() {
        return this.element.checked
      }
    },
    methods: {
      onChange(event) {
        const editor = this.$editor
        const {element} = this
        const path = VueEditor.findPath(editor, element)
        Transforms.setNodes(
          editor,
          { checked: event.target.checked },
          { at: path }
        )
      }
    }
  };
</script>

<style scoped lang="less">
.checkListItem {
  display: flex;
  flex-direction: row;
  align-items: center;

  & + & {
    margin-top: 0;
  }

  &__input {
    margin-right: 0.75em;
  }

  &__content {
    flex: 1;

    &:focus {
      outline: none;
    }
  }
}
</style>
