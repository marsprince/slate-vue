export const renderLeaf = ({ attributes, children, leaf }) => {
  return {
    render() {
      const data  = {
        style: {
          fontWeight: leaf.bold && 'bold',
          backgroundColor: leaf.highlight && '#ffeeba'
        },
        attrs: attributes
      }
      return <span {...data}>{children}</span>
    }
  }
}
