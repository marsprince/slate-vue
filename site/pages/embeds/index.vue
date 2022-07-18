<template>
  <Slate :value="JSON.stringify(initialValue)">
    <Editable
      placeholder="Enter some plain text..."
      :renderElement="renderElement"
    ></Editable>
  </Slate>
</template>

<script>
  import { Slate, Editable } from 'slate-vue'
  import { renderElement } from './render'
  import { withEmbeds } from './util'

  // this value is for editor
  const initialValue = [
    {
      children: [
        {
          text:
            'In addition to simple image nodes, you can actually create complex embedded nodes. For example, this one contains an input element that lets you change the video being rendered!',
        },
      ],
    },
    {
      type: 'video',
      url: 'https://player.vimeo.com/video/26689853',
      children: [{ text: '' }],
    },
    {
      children: [
        {
          text:
            'Try it out! This editor is built to handle Vimeo embeds, but you could handle any type.',
        },
      ],
    },
  ]

  export default {
    name: 'index',
    components: {
      Slate,
      Editable,
    },
    data() {
      return {
        initialValue,
        renderElement,
      }
    },
    created() {
      withEmbeds(this.$editor)
    },
  }
</script>

<style scoped></style>
