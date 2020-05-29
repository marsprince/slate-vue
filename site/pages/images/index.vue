<template>
  <Slate :value="JSON.stringify(initialValue)">
    <Toolbar>
      <InsertImageButton></InsertImageButton>
    </Toolbar>
    <Editable placeholder="Enter some plain text..." :renderElement="renderElement"></Editable>
  </Slate>
</template>

<script>
  import {Slate, Editable} from 'slate-vue'
  import {renderElement} from './render';
  import InsertImageButton from './insertImageButton'
  import Toolbar from '../components/toolbar'
  import {insertImage} from './render';
  import isUrl from 'is-url'
  import imageExtensions from 'image-extensions'

  // this value is for editor
  const initialValue = [
    {
      type: 'paragraph',
      children: [
        {
          text:
            'In addition to nodes that contain editable text, you can also create other types of nodes, like images or videos.',
        },
      ],
    },
    {
      type: 'image',
      url: 'https://source.unsplash.com/kFrdX5IeQzI',
      children: [{ text: '' }],
    },
    {
      type: 'paragraph',
      children: [
        {
          text:
            'This example shows images in action. It features two ways to add images. You can either add an image via the toolbar icon above, or if you want in on a little secret, copy an image URL to your keyboard and paste it anywhere in the editor!',
        },
      ],
    },
  ]
  const isImageUrl = url => {
    if (!url) return false
    if (!isUrl(url)) return false
    const ext = new URL(url).pathname.split('.').pop()
    return imageExtensions.includes(ext)
  }
  const withImages = editor => {
    const { insertData, isVoid } = editor

    editor.isVoid = element => {
      return element.type === 'image' ? true : isVoid(element)
    }

    editor.insertData = data => {
      const text = data.getData('text/plain')
      const { files } = data

      if (files && files.length > 0) {
        for (const file of files) {
          const reader = new FileReader()
          const [mime] = file.type.split('/')

          if (mime === 'image') {
            reader.addEventListener('load', () => {
              const url = reader.result
              insertImage(editor, url)
            })

            reader.readAsDataURL(file)
          }
        }
      } else if (isImageUrl(text)) {
        insertImage(editor, text)
      } else {
        insertData(data)
      }
    }

    return editor
  }

  export default {
    name: 'links',
    components: {
      Slate,
      Editable,
      InsertImageButton,
      Toolbar
    },
    data() {
      return {
        initialValue,
        renderElement
      }
    },
    beforeCreate() {
      withImages(this.$editor);
    }
  };
</script>

<style scoped>

</style>
