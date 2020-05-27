<script>
  import Button from '../components/button'
  import Icon from '../components/icon'
  import {insertImage} from './render';

  export default {
    name: 'insertImageButton',
    render() {
      const editor = this.$editor
      return (
        <Button
          onMouseDown={event => {
            event.preventDefault()
            const url = window.prompt('Enter the URL of the image:')
            if (!url) return
            insertImage(editor, url)
          }}
        >
          <Icon icon="image"></Icon>
        </Button>
      )
    }
  };
</script>

<style scoped>

</style>
