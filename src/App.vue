<template>
  <router-view/>
</template>

<script lang="ts">
  import {defineComponent, ref, onBeforeMount, getCurrentInstance} from 'vue'
  import { useRouter } from 'vue-router'
  import $store from "./store/index"

  export default defineComponent({
    name: "app",
    setup() {
      const {proxy}:any = getCurrentInstance()
      const router = useRouter()
      onBeforeMount(() => {
        //在页面加载时读取sessionStorage里的状态信息
        let allStore = sessionStorage.getItem("store") ? sessionStorage.getItem("store") : ''
        if (allStore) {
          $store.replaceState(Object.assign({}, $store.state, JSON.parse(allStore)))
        }
        //在页面刷新时将vuex里的信息保存到sessionStorage里
        window.addEventListener("beforeunload", () => {
          if (proxy.$cookie.getCookie('user') === null) {
            sessionStorage.removeItem("store")
          } else {
            sessionStorage.setItem("store", JSON.stringify($store.state))
          }
        })
      })
      return {}
    }
  })
</script>

<style lang="less">
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    height: 100%;
  }

  #nav {
    padding: 30px;

    a {
      font-weight: bold;
      color: #2c3e50;

      &.router-link-exact-active {
        color: #42b983;
      }
    }
  }

  #header {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    background: #001529;
    color: #fff;

    p {
      margin: 0 20px 0 0;
    }

    span {
      cursor: pointer;
    }
  }

</style>
