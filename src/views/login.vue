<template>
  <div id="main">
    <div class="loginBg">
      <div class="erWeiMa"></div>
      <div class="form">
        <label>
          <span>用户名：</span>
          <a-input v-model:value="username" placeholder="请输入用户名"/>
        </label>
        <label>
          <span>密　码：</span>
          <a-input-password v-model:value="password" placeholder="请输入密码"/>
        </label>
        <label>
          <a-button type="primary" @click="login">提交</a-button>
        </label>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue'
import {message} from "ant-design-vue";

export default defineComponent({
  name: "login",
  setup() {
    const username = ref<string>()
    const password = ref<string>()
    const login = () =>{
      if (username.value === ''){
        message.error('请输入用户名')
        return false
      }
      if (password.value === ''){
        message.error('请输入密码')
        return false
      }
      /*进行传输验证返回的权限根据路由守卫去访问，并形成用户信息存储到vuex中*/


    }
    return {
      username,
      password,
      login,
    }
  }
})
</script>

<style scoped>
#main{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.loginBg {
  height: 563px;
  width: 1000px;
  display: inline-block;
  background: url("../assets/bg.ce8402e6.jpeg") no-repeat;
  position: relative;
}

@media screen and (max-width: 1000px) {
  .loginBg {
    background: url("../assets/logo.c3d03272.jpg") no-repeat;
    width: 150px;
    height: 150px;
    background-size: cover;
    position: absolute;
    top: 30%;
    transform: translate(0,-30%);
  }
}

.erWeiMa {
  width: 140px;
  height: 140px;
  position: absolute;
  top: 420px;
  left: 400px;
  background: url("../assets/erweima.602fdb02.png") no-repeat;
  background-size: cover;
}

@media screen and (max-width: 1000px) {
  .erWeiMa {
    background: none;
    top: 100%;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .erWeiMa::after {
    content: '中山市技师学院教学检查系统';
    font-size: 1.2rem;
    font-weight: bold;
  }
}

.form {
  width: 300px;
  height: 140px;
  position: absolute;
  top: 420px;
  left: 550px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}

.form label {
  height: 40px;
  line-height: 40px;
  display: flex;
  justify-content: space-around;
}

.form label input, .form label button, .form label .ant-input-password {
  width: 200px;
  height: 35px;
}

@media screen and (max-width: 1000px) {
  .form {
    background: none;
    top: 150%;
    left: 50%;
    transform: translate(-50%, 0);
  }
}

</style>