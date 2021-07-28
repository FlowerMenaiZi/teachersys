<template>
  <div class="body">
    <p>404 | NOT FOUND</p>
    <a-button type="primary" @click="goBack">返回上一页</a-button>
  </div>
</template>

<script lang="ts">
  import {defineComponent} from 'vue'
  import router from "@/router";

  export default defineComponent({
    name: "404",
    setup() {
      const goBack = () => {
        router.back()
      }
      return {
        goBack
      }
    }
  })
</script>

<style scoped>
  html {
    width: 100%;
    height: 100%;
  }
  .body{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  p {
    color: #a0aec0;
    font-size: 22px;
  }
</style>