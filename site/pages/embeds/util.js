export const withEmbeds = editor => {
  const { isVoid } = editor
  editor.isVoid = element => (element.type === 'video' ? true : isVoid(element))
  return editor
}
