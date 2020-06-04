<template>
  <Button :reversed="true" :active="active" @mouseDown="onMouseDown">
    <Icon :icon="icon"></Icon>
  </Button>
</template>

<script>
  import Button from '../components/button'
  import Icon from '../components/icon'
  import {isFormatActive, toggleFormat} from './util';
  import { SlateMixin, useEffect } from 'slate-vue';

  export default {
    name: 'formatButton',
    props: {
      format: String,
      icon: String
    },
    components: {
      Button,
      Icon
    },
    data() {
      return {
        active: isFormatActive(this.$editor, this.format)
      }
    },
    mixins: [SlateMixin],
    hooks() {
      useEffect(()=>{
        this.active = isFormatActive(this.$editor, this.format)
      })
    },
    methods: {
      onMouseDown(event) {
        event.preventDefault()
        toggleFormat(this.$editor, this.format)
      }
    }
  };
</script>

<style scoped>

</style>
