// @ts-nocheck
// same react hooks in vue, forked from https://github.com/yyx990803/vue-hooks
let currentInstance = null
let isMounting = false
let callIndex = 0

function ensureCurrentInstance() {
  if (!currentInstance) {
    throw new Error(
      `invalid hooks call: hooks can only be called in a function passed to withHooks.`
    )
  }
}

function findEl(component) {
  return component._isVue ? component.$el : component
}

export function useEffect(rawEffect, deps?:Array) {
  ensureCurrentInstance()
  const id = ++callIndex
  if (isMounting) {
    const cleanup = () => {
      const { current } = cleanup
      if (current) {
        current()
        cleanup.current = null
      }
    }
    const effect = function() {
      const { current } = effect
      if (current) {
        cleanup.current = current.call(this)
        effect.current = null
      }
    }
    effect.current = rawEffect

    currentInstance._effectStore[id] = {
      effect,
      cleanup,
      deps
    }

    currentInstance.$on('hook:mounted', effect)
    currentInstance.$on('hook:destroyed', cleanup)
    if (!deps || deps.length > 0) {
      currentInstance.$on('hook:updated', effect)
    }
  } else {
    const record = currentInstance._effectStore[id]
    const { effect, cleanup, deps: prevDeps = [] } = record
    record.deps = deps
    if (!deps || deps.some((d, i) => d !== prevDeps[i])) {
      cleanup()
      effect.current = rawEffect
    }
  }
}

export function useRef(initial) {
  ensureCurrentInstance()
  // vue ref type must be string
  const id = (++callIndex).toString()
  const { _refsStore: refs } = currentInstance
  // added for auto inject $refs
  currentInstance.$on('hook:mounted', function() {
    if(this.$refs[id]) {
      refs[id].current = findEl(this.$refs[id])
    }
  });
  currentInstance.$on('hook:updated', function(){
    if(this.$refs[id]) {
      refs[id].current = findEl(this.$refs[id])
    }
  });
  return isMounting ? (refs[id] = { current: initial, id }) : refs[id]
}

export function hooks (Vue) {
  Vue.mixin({
    beforeCreate() {
      const { hooks, data } = this.$options
      if (hooks) {
        this._effectStore = {}
        this._refsStore = {}
        this._computedStore = {}
        this.$options.data = function () {
          const ret = data ? data.call(this) : {}
          ret._state = {}
          return ret
        }
      }
    },
    beforeMount() {
      const { hooks, render } = this.$options
      if (hooks && render) {
        this.$options.render = function(h) {
          callIndex = 0
          currentInstance = this
          isMounting = !this._vnode
          // changed for get this
          const hookProps = hooks.call(this, this.$props)
          Object.assign(this._self, hookProps)
          const ret = render.call(this, h)
          currentInstance = null
          return ret
        }
      }
    }
  })
}
