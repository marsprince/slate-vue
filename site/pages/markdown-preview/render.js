export const renderLeaf = ({ attributes, children, leaf }) => {
  return {
    render() {
      let style = {
        fontWeight: leaf.bold && 'bold',
        fontStyle: leaf.italic && 'italic',
        textDecoration: leaf.underlined && 'underline'
      }
      if(leaf.title){
        style = {...style, ...{
            display: 'inline-block',
            fontWeight: 'bold',
            fontSize: '20px',
            margin: '20px 0 10px 0'
        }}
      }
      if(leaf.list){
        style = {...style, ...{
            paddingLeft: '10px',
            fontSize: '20px',
            lineHeight: '10px',
          }}
      }
      if(leaf.hr){
        style = {...style, ...{
            display: 'block',
            textAlign: 'center',
            borderBottom: '2px solid #ddd'
          }}
      }
      if(leaf.blockquote){
        style = {...style, ...{
            display: 'inlineBlock',
            borderLeft: '2px solid #ddd',
            paddingLeft: '10px',
            color: '#aaa',
            fontStyle: 'italic'
          }}
      }
      if(leaf.code){
        style = {...style, ...{
            fontFamily: 'monospace',
            backgroundColor: '#eee',
            padding: '3px'
          }}
      }
      const data  = {
        style,
        attrs: attributes
      }
      return <span {...data}>{children}</span>
    }
  }
}
