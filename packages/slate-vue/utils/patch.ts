export const patch = (immer, editor) => {
  editor._state.$$data = immer
}
