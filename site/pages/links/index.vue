<template>
  <Slate :value="JSON.stringify(initialValue)">
    <Toolbar>
      <LinkButton></LinkButton>
    </Toolbar>
    <Editable placeholder="Enter some plain text..." :renderElement="renderElement"></Editable>
  </Slate>
</template>

<script>
  import {Slate, Editable} from 'slate-vue'
  import {renderElement, wrapLink} from './render';
  import isUrl from 'is-url'
  import LinkButton from './linkButton'
  import Toolbar from '../components/toolbar'

  // this value is for editor
  const initialValue = [
    {
      children: [
        {
          text: 'In addition to block nodes, you can create inline nodes, like ',
        },
        {
          type: 'link',
          url: 'https://en.wikipedia.org/wiki/Hypertext',
          children: [{ text: 'hyperlinks' }],
        },
        {
          text: '!',
        },
      ],
    },
    {
      children: [
        {
          text:
            'This example shows hyperlinks in action. It features two ways to add links. You can either add a link via the toolbar icon above, or if you want in on a little secret, copy a URL to your keyboard and paste it while a range of text is selected.',
        },
      ],
    },
  ]
  const withLinks = editor => {
    const { insertData, insertText, isInline } = editor

    editor.isInline = element => {
      return element.type === 'link' ? true : isInline(element)
    }

    editor.insertText = text => {
      if (text && isUrl(text)) {
        wrapLink(editor, text)
      } else {
        insertText(text)
      }
    }

    editor.insertData = data => {
      const text = data.getData('text/plain')

      if (text && isUrl(text)) {
        wrapLink(editor, text)
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
      LinkButton,
      Toolbar
    },
    data() {
      return {
        initialValue,
        renderElement
      }
    },
    beforeCreate() {
      withLinks(this.$editor);
    }
  };
</script>

<style scoped>

</style>
