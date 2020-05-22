<script>
  import Button from './button'
  import Icon from './icon'
  import {Editor} from 'slate'
  import {SlateMixin} from 'slate-vue';

  const isMarkActive = (editor, format) => {
    const marks = Editor.marks(editor)
    return marks ? marks[format] === true : false
  }

  const toggleMark = (editor, format) => {
    const isActive = isMarkActive(editor, format)

    if (isActive) {
      Editor.removeMark(editor, format)
    } else {
      Editor.addMark(editor, format, true)
    }
  }

  export default {
    name: 'markButton',
    mixins: [SlateMixin],
    components: {
      Button,
      Icon
    },
    props: {
      format: String,
      icon: String
    },
    render() {
      const editor = this.$editor
      return (
        <Button
          active={isMarkActive(editor, this.format)}
          onMouseDown={event => {
            event.preventDefault()
            toggleMark(editor, this.format)
          }}
        >
          <Icon icon={this.icon}></Icon>
        </Button>
      )
    }
  };
</script>

<style scoped>

</style>
