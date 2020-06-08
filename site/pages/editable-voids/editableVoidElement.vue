<template>
  <div contenteditable="false">
    <div class="editableVoidElement">
      <h4>Name:</h4>
      <input
        class="editableVoidElement__input"
        type="text"
        v-model='inputValue'
      />
      <h4>Left or right handed:</h4>
      <input
        class="unset"
        type="radio"
        name="handedness"
        value="left"
      />Left<br />
      <input
        class="unset"
        type="radio"
        name="handedness"
        value="right"
      />Right
      <h4>Tell us about yourself:</h4>
      <div class="editableVoidElement__richtext">
        <RichText></RichText>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script>
  import RichText from '../richtext'

  export default {
    name: 'editableVoidElement',
    components: {
      RichText
    },
    data() {
      return {
        inputValue: ''
      }
    }
  };
</script>

<style scoped lang="less">
.editableVoidElement {
  box-shadow: 0 0 0 3px #ddd;
  padding: 8px;

  &__input {
    margin: 8px 0;
  }

  &__richtext {
    padding: 20px;
    border: 2px solid #ddd;
  }

}
.unset {
  width: unset;
}

</style>
