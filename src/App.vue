<template>

  <router-view/>
</template>

<script lang="ts">
  import {defineComponent, ref} from 'vue'
  import { useRoute } from 'vue-router'

  export default defineComponent({
    name: "login",
    setup() {



      return {
      }
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

    p{
      margin: 0 20px 0 0;
    }

    span{
      cursor: pointer;
    }
  }

</style>
