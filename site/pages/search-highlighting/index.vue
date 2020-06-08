<template>
  <Slate :value="JSON.stringify(initialValue)">
    <Toolbar>
      <Icon :icon="search" class="toolbar__icon"></Icon>
      <input
        type="search"
        placeholder="Search the text..."
        class="toolbar__input"
        v-model="search"
      />
    </Toolbar>
    <Editable placeholder="Enter some plain text..."
              :decorate="decorate"
              :renderLeaf="renderLeaf"></Editable>
  </Slate>
</template>

<script>
  import {Slate, Editable} from 'slate-vue'
  import {Text} from 'slate'
  import {renderLeaf} from './render';
  import Toolbar from '../components/toolbar';
  import Icon from '../components/icon'

  // this value is for editor
  const initialValue = [
    {
      children: [
        {
          text:
            'This is editable text that you can search. As you search, it looks for matching strings of text, and adds ',
        },
        { text: 'decorations', bold: true },
        { text: ' to them in realtime.' },
      ],
    },
    {
      children: [
        { text: 'Try it out for yourself by typing in the search box above!' },
      ],
    },
  ]

  export default {
    name: 'index',
    components: {
      Slate,
      Editable,
      Toolbar,
      Icon
    },
    data() {
      return {
        initialValue,
        renderLeaf,
        search: ''
      }
    },
    methods: {
      decorate([node, path]) {
        const ranges = []
        const {search} = this

        if (search && Text.isText(node)) {
          const { text } = node
          const parts = text.split(search)
          let offset = 0

          parts.forEach((part, i) => {
            if (i !== 0) {
              ranges.push({
                anchor: { path, offset: offset - search.length },
                focus: { path, offset },
                highlight: true,
              })
            }

            offset = offset + part.length + search.length
          })
        }

        return ranges
      }
    }
  };
</script>

<style scoped lang="less">
.toolbar {
  position: relative;

  &__icon {
    position: absolute;
    top: 0.5em;
    left: 0.5em;
    color: #ccc;
  }

  &__input {
    padding-left: 2em;
    width: 100%;
  }
}
</style>
