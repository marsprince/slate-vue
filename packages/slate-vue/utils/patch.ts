export const patch = (immer, editor) => {
  // TODO：manual update
  editor._state.$$data = immer
}
