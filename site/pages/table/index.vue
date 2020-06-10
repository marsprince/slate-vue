<template>
  <Slate :value="JSON.stringify(initialValue)">
    <Editable placeholder="Enter some plain text..." :renderElement="renderElement" :renderLeaf="renderLeaf"></Editable>
  </Slate>
</template>

<script>
  import {Slate, Editable} from 'slate-vue'
  import {renderLeaf, renderElement, withTables} from './render';

  // this value is for editor
  const initialValue = [
    {
      children: [
        {
          text:
            'Since the editor is based on a recursive tree model, similar to an HTML document, you can create complex nested structures, like tables:',
        },
      ],
    },
    {
      type: 'table',
      children: [
        {
          type: 'table-row',
          children: [
            {
              type: 'table-cell',
              children: [{ text: '' }],
            },
            {
              type: 'table-cell',
              children: [{ text: 'Human', bold: true }],
            },
            {
              type: 'table-cell',
              children: [{ text: 'Dog', bold: true }],
            },
            {
              type: 'table-cell',
              children: [{ text: 'Cat', bold: true }],
            },
          ],
        },
        {
          type: 'table-row',
          children: [
            {
              type: 'table-cell',
              children: [{ text: '# of Feet', bold: true }],
            },
            {
              type: 'table-cell',
              children: [{ text: '2' }],
            },
            {
              type: 'table-cell',
              children: [{ text: '4' }],
            },
            {
              type: 'table-cell',
              children: [{ text: '4' }],
            },
          ],
        },
        {
          type: 'table-row',
          children: [
            {
              type: 'table-cell',
              children: [{ text: '# of Lives', bold: true }],
            },
            {
              type: 'table-cell',
              children: [{ text: '1' }],
            },
            {
              type: 'table-cell',
              children: [{ text: '1' }],
            },
            {
              type: 'table-cell',
              children: [{ text: '9' }],
            },
          ],
        },
      ],
    },
    {
      children: [
        {
          text:
            "This table is just a basic example of rendering a table, and it doesn't have fancy functionality. But you could augment it to add support for navigating with arrow keys, displaying table headers, adding column and rows, or even formulas if you wanted to get really crazy!",
        },
      ],
    },
  ]

  export default {
    name: 'Table',
    components: {
      Slate,
      Editable
    },
    data() {
      return {
        initialValue,
        renderElement,
        renderLeaf
      }
    },
    created() {
      withTables(this.$editor)
    }
  };
</script>

<style scoped>

</style>
