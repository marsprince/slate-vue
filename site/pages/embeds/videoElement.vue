<template>
  <div>
    <div contenteditable="false">
      <div class="iframe">
        <iframe
          :src="`${element.url}?title=0&byline=0&portrait=0`"
          frameBorder="0"
          class="iframe__content"
        />
      </div>
      <UrlInput :value="element.url" @change="onChange"></UrlInput>
    </div>
    <slot></slot>
  </div>
</template>

<script>
  import UrlInput from './UrlInput'
  import { VueEditor, Transforms } from 'slate-vue'

  export default {
    name: 'videoElement',
    props: {
      element: Object,
    },
    components: {
      UrlInput,
    },
    methods: {
      onChange(val) {
        const editor = this.$editor
        const { element } = this
        const path = VueEditor.findPath(editor, element)
        Transforms.setNodes(editor, { url: val }, { at: path })
      },
    },
  }
</script>

<style scoped lang="less">
  .iframe {
    padding: 75% 0 0 0;
    position: relative;
    &__content {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
</style>
