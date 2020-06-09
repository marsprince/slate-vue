<template>
  <div>
    <div class="header">
      <span class="header__title">Slate-vue Examples</span>
      <div class="header__linklist">
        <a href="https://github.com/marsprince/slate-vue">Github</a>
        <a href="https://github.com/marsprince/slate-vue/blob/master/README.md">Docs</a>
      </div>
    </div>
    <div class="exampleHeader">
      <span class="exampleHeader__tabButton">
        <Icon icon="menu" @click.native="showTabs = !showTabs"></Icon>
      </span>
      <span class="exampleHeader__title">
        {{name}}
        <a
          :href='`https://github.com/marsprince/slate-vue/blob/master/site/pages/${path}/index.vue`'
        >
          (View Source)
        </a>
      </span>
    </div>
    <transition name="slide">
      <div v-if="showTabs" class="tabList">
        <router-link v-for="({name, path}, $index) in routes"
                     :key="$index"
                     :to="path"
                     active-class="active"
                     class="tabList__item"
                     @click.native="index = $index, showTabs = false">{{name}}
        </router-link>
      </div>
    </transition>
    <div class="main">
      <router-view></router-view>
    </div>
    <div class="underlay" @click="showTabs = false"
         :style="{display: showTabs ? 'block' : 'none'}" v-if="showTabs"></div>
  </div>
</template>

<script>
  import Icon from './pages/components/icon';
  import {routes} from './router'

  export default {
    name: 'app',
    components: {
      Icon
    },
    data() {
      return {
        showTabs: false,
        routes,
        index: null
      }
    },
    watch: {
      '$route'(val) {
        if(val.name) {
          this.index = this.routes.findIndex(el => el.name === val.name) || 14
        }
      }
    },
    computed: {
      name() {
        return this.index!==null && this.routes[this.index].name
      },
      path() {
        return this.index!==null && this.routes[this.index].path
      }
    }
  };
</script>

<style scoped lang="less">
.main {
  background: #fff;
  max-width: 42em;
  margin: 20px auto;
  padding: 20px;
}
.header {
  align-items: center;
  background: #000;
  color: #aaa;
  display: flex;
  height: 42px;
  position: relative;
  z-index: 1; /* To appear above the underlay */

  &__title {
    margin-left: 1em;
  }

  &__linklist {
    margin-left: auto;
    margin-right: 1em;
    a {
      margin-left: 1em;
      color: #aaa;
      text-decoration: none;

      &:hover {
        color: #fff;
        text-decoration: underline;
      }
    }
  }
}
.exampleHeader {
  align-items: center;
  background-color: #555;
  color: #ddd;
  display: flex;
  height: 42px;
  position: relative;
  z-index: 1; /* To appear above the underlay */

  &__tabButton {
    margin-left: 0.8em;

    &:hover {
      cursor: pointer;
    }

    .material-icons {
      color: #aaa;
      font-size: 24px;
    }
  }

  &__title {
    margin-left: 1em;

    a {
      margin-left: 1em;
      color: #aaa;
      text-decoration: none;

      &:hover {
        color: #fff;
        text-decoration: underline;
      }
    }
  }
}
.tabList {
  background-color: #222;
  display: flex;
  flex-direction: column;
  overflow: auto;
  padding-top: 0.2em;
  position: absolute;
  white-space: nowrap;
  max-height: 70vh;
  width: 200px;
  z-index: 1; /* To appear above the underlay */

  &__item {
    display: inline-block;
    margin-bottom: 0.2em;
    padding: 0.2em 1em;
    border-radius: 0.2em;
    text-decoration: none;
    color: #777;
    background: transparent;

    &:hover {
      background: #333;
    }

    &.active {
      color: white;
      background: #333
    }
  }
}
.underlay {
  background-color: rgba(200, 200, 200, 0.8);
  height: 100%;
  top: 0;
  position: fixed;
  width: 100%;
}
.slide-enter-active, .slide-leave-active {
  transition: width .2s;
}
.slide-enter, .slide-leave-to /* .fade-leave-active below version 2.1.8 */ {
  width: 0;
}
</style>
