<template>
  <Slate :value="JSON.stringify(initialValue)">
    <Editable placeholder="Enter some plain text..." :renderElement="renderElement"></Editable>
  </Slate>
</template>

<script>
  import {Slate, Editable} from 'slate-vue'
  import faker from 'faker'
  import {renderElement} from './render';

  const HEADINGS = 100
  const PARAGRAPHS = 7
  const initialValue = []

  for (let h = 0; h < HEADINGS; h++) {
    initialValue.push({
      type: 'heading',
      children: [{ text: faker.lorem.sentence() }],
    })

    for (let p = 0; p < PARAGRAPHS; p++) {
      initialValue.push({
        children: [{ text: faker.lorem.paragraph() }],
      })
    }
  }

  export default {
    name: 'index',
    components: {
      Slate,
      Editable
    },
    data() {
      return {
        initialValue,
        renderElement
      }
    }
  };
</script>

<style scoped>

</style>
