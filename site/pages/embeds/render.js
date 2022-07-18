import VideoElement from './videoElement'

export const renderElement = ({ attributes, children, element }) => {
  return {
    components: {
      VideoElement,
    },
    render() {
      switch (element.type) {
        case 'video':
          return (
            <VideoElement element={element} {...{ attrs: attributes }}>
              {children}
            </VideoElement>
          )
        default:
          return <p {...{ attrs: attributes }}>{children}</p>
      }
    },
  }
}
