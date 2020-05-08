import "vue-tsx-support/enable-check"
import Vue from 'vue'
declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    hooks?: Function,
    abstract?: Boolean
  }
}
