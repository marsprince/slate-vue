// forked from vue-fragment
// https://github.com/y-nk/vue-fragment
import * as tsx from 'vue-tsx-support'
const freeze = (object: any, property: any, value: any) => {
  Object.defineProperty(object, property, {
    configurable: true,
    get() { return value; },
    set(v) { console.warn(`tried to set frozen property ${property} with ${v}`) }
  });
};

const unfreeze = (object: any, property: any, value: any = null) => {
  Object.defineProperty(object, property, {
    configurable: true,
    writable: true,
    value: value
  });
};

export const fragment = tsx.component({
  abstract: true,
  name: 'Fragment',

  props: {
    name: {
      type: String,
      default: () => Math.floor(Date.now() * Math.random()).toString(16)
    }
  },

  // mounted() {
  //   const container = this.$el;
  //   const parent = container.parentNode;
  //
  //   ['appendChild', 'insertBefore', 'removeChild'].forEach(item => {
  //     const _c = container[item]
  //     container[item] = (node) => {
  //       console.log(`container: ${item}`, node);
  //       _c.call(container, node)
  //     }
  //     const _p = parent[item]
  //     parent[item] = (node) => {
  //       console.log(`parent: ${item}`, node);
  //       _p.call(parent, node)
  //     }
  //   })
  // },

  mounted() {
    const container: any = this.$el;
    const parent: any = container.parentNode;

    const head = document.createComment(`fragment#${this.name}#head`)
    const tail = document.createComment(`fragment#${this.name}#tail`)

    parent.insertBefore(head, container)
    parent.insertBefore(tail, container)

    container.appendChild = (node: any) => {
      parent.insertBefore(node, tail)
      freeze(node, 'parentNode', container)
    }

    container.insertBefore = (node: any, ref: any) => {
      parent.insertBefore(node, ref)
      freeze(node, 'parentNode', container)
    }

    container.removeChild = (node: any) => {
      parent.removeChild(node)
      unfreeze(node, 'parentNode')
    }

    Array.from(container.childNodes)
      .forEach(node => container.appendChild(node))

    parent.removeChild(container)

    freeze(container, 'parentNode', parent)
    freeze(container, 'nextSibling', tail.nextSibling)
    // @added
    // after insert, the child.nextSibling is tail, nextSibling's parent and parent are not same
    // nodeOps.parentNode(ref$$1) => parent === parent => container cause error (line: 6043)
    freeze(tail, 'parentNode', container)

    const insertBefore = parent.insertBefore;
    parent.insertBefore = (node: any, ref: any) => {
      insertBefore.call(parent, node, ref !== container ? ref : head)
    }

    const removeChild = parent.removeChild;
    parent.removeChild = (node: any) => {
      if (node === container) {
        while(head.nextSibling !== tail)
          container.removeChild(head.nextSibling)

        parent.removeChild(head)
        parent.removeChild(tail)
        unfreeze(container, 'parentNode')

        parent.insertBefore = insertBefore
        parent.removeChild = removeChild
      }
      else {
        removeChild.call(parent, node)
      }
    }
  },

  render(h) {
    const children = this.$slots.default

    // // add fragment attribute on the children
    // if (children && children.length)
    //   children.forEach(child =>
    //     child.data = { ...child.data, attrs: { fragment: this.name, ...(child.data || {}).attrs } }
    //   )

    return h(
      "div",
      {
        // force render
        key: this.name
      },
      children
    )
  }
});
