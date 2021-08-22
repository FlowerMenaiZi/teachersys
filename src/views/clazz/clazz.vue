<template>
  <div id="header">
    <p>{{whatEnd}} ({{name}})</p>
    <span @click="logout">注销</span>
  </div>
  <a-layout>
    <a-layout-sider
        breakpoint="lg"
        collapsed-width="0"
        @breakpoint="breakPoint"
        :class="isShowScroll?'showScroll':''"
        :defaultCollapsed="true"
    >
      <div class="logo"/>
      <a-menu theme="dark" mode="inline">
        <a-menu-item key="evenStudyCheck">
          <PieChartOutlined style="margin-right: 10px"/>
          <span><router-link to="/clazz/evenStudyCheck">晚修检查管理</router-link></span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-content :style="{ margin: '10px'}">
        <div :style="{ padding: '10px', background: '#fff', minHeight: '90vh' }">
          <router-view/>
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script lang="ts">
import {defineComponent,ref,getCurrentInstance} from 'vue'
import { PieChartOutlined } from '@ant-design/icons-vue';
import $store from "../../store/index"
import { useRouter } from 'vue-router'

export default defineComponent({
  name: "clazz",
  components:{
    PieChartOutlined
  },
  setup() {
    const whatEnd = ref('班级端')
    const name = ref('')
    name.value = $store.state.userInfo.user
    let isShowScroll = ref(true)
    const breakPoint = () => {
      if (window.innerWidth > 992) {
        isShowScroll.value = true
      } else {
        isShowScroll.value = false
      }
    }
    const router = useRouter()
    const {proxy}:any = getCurrentInstance()
    const logout = () =>{
      sessionStorage.removeItem('store');
      proxy.$cookie.clearCookie('user');
      $store.replaceState(Object.assign({}, $store.state, null))
      router.push('/login');
    }
    return {
      breakPoint,
      isShowScroll,
      whatEnd,
      name,
      logout
    };
  }
})
</script>

<style scoped>
.ant-menu-item a {
  color: rgba(255, 255, 255, 0.65);
}

.ant-menu-item a:hover {
  color: rgba(255, 255, 255, 1);
}
#header {
   display: flex;
   align-items: center;
   justify-content: center;
   height: 40px;
   background: #001529;
   color: #fff;

 }
#header p{
  margin: 0 20px 0 0;
}

#header span{
  cursor: pointer;
}

</style>