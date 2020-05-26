<script>
  import Button from '../components/button'
  import Icon from '../components/icon'
  import {wrapLink, isLinkActive} from './render';
  import { SlateMixin } from 'slate-vue';

  export default {
    name: 'LinkButton',
    components: {
      Button,
      Icon
    },
    mixins: [SlateMixin],
    render() {
      const editor = this.$editor
      const insertLink = (editor, url) => {
        if (editor.selection) {
          wrapLink(editor, url)
        }
      }
      return (
        <Button
          active={isLinkActive(editor)}
          onMouseDown={event => {
            event.preventDefault()
            const url = window.prompt('Enter the URL of the link:')
            if (!url) return
            insertLink(editor, url)
          }}
        >
          <Icon icon='link'></Icon>
        </Button>
      )
    }
  };
</script>

<style scoped>

</style>
