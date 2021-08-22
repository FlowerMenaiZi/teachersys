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
        <a-sub-menu>
          <template #title>
            <span>
              <FileSearchOutlined/>
              <span>个人教务管理</span>
            </span>
          </template>
          <a-menu-item key="evenStudyCheck">
            <FormOutlined style="margin-right: 10px"/>
            <router-link to="/teacher/evenStudyCheck">晚修检查表</router-link>
          </a-menu-item>
          <a-menu-item key="teachingPlanCheck">
            <ProjectOutlined style="margin-right: 10px"/>
            <router-link to="/teacher/teachingPlanCheck">授课计划</router-link>
          </a-menu-item>
          <a-menu-item key="homeworkCheck">
            <ProfileOutlined style="margin-right: 10px"/>
            <router-link to="/teacher/homeworkCheck">作业检查</router-link>
          </a-menu-item>
        </a-sub-menu>
        <!--教研室管理员查看-->
        <a-sub-menu :class="isStaffAdmin?'disNone':''">
          <template #title>
            <span>
              <ReadOutlined />
              <span>系教务管理</span>
            </span>
          </template>
          <a-menu-item key="s-evenStudyCheck">
            <CheckCircleOutlined style="margin-right: 10px"/>
            <router-link to="/staffleader/evenStudyCheck">系晚修检查表管理</router-link>
          </a-menu-item>
          <a-menu-item key="s-teachingPlanCheck">
            <ProjectOutlined style="margin-right: 10px"/>
            <router-link to="/staffleader/teachingPlanCheck">授课计划检查管理</router-link>
          </a-menu-item>
          <a-menu-item key="s-teachingPlanEvaluation">
            <ReconciliationOutlined style="margin-right: 10px"/>
            <router-link to="/staffleader/teachingPlanEvaluation">教案测评记录表管理</router-link>
          </a-menu-item>
          <a-menu-item key="s-teachingPlanEvaluationTotal">
            <PieChartOutlined style="margin-right: 10px"/>
            <router-link to="/staffleader/teachingPlanEvaluationTotal">教案测评汇总管理</router-link>
          </a-menu-item>
          <a-menu-item key="s-homeworkCheck">
            <ProfileOutlined style="margin-right: 10px"/>
            <router-link to="/staffleader/homeworkCheck">作业检查记录管理</router-link>
          </a-menu-item>
        </a-sub-menu>
        <!--教研室管理员查看-->
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
  import {
    PieChartOutlined,
    CheckCircleOutlined,
    ProfileOutlined,
    ProjectOutlined,
    ReconciliationOutlined,
    FormOutlined,
    FileSearchOutlined,
    ReadOutlined
  } from '@ant-design/icons-vue';
  import {defineComponent, ref,getCurrentInstance} from 'vue';
  import $store from "../../store/index"
  import { useRouter } from 'vue-router'

  export default defineComponent({
    name: "teacher",
    components: {
      PieChartOutlined,
      CheckCircleOutlined,
      ProfileOutlined,
      ProjectOutlined,
      ReconciliationOutlined,
      FormOutlined,
      FileSearchOutlined,
      ReadOutlined
    },
    setup() {
      const whatEnd = ref('老师端')
      const name = ref('')
      const isStaffAdmin = ref()
      name.value = $store.state.userInfo.user
      if ($store.state.userInfo.role === 1){
        isStaffAdmin.value = true
      } else {
        isStaffAdmin.value = false
      }
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
        isStaffAdmin,
        logout
      };
    },
  });
</script>
<style>
  #components-layout-demo-responsive .logo {
    height: 32px;
    background: rgba(255, 255, 255, 0.2);
    margin: 16px;
  }

  .ant-menu-item {
    padding-left: 30px !important;
  }

  .showScroll {
    overflow: auto;
    z-index: 2 !important;
  }

  .site-layout-sub-header-background {
    background: #fff;
  }

  .site-layout-background {
    background: #fff;
  }

  [data-theme='dark'] .site-layout-sub-header-background {
    background: #141414;
  }

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

  #header p {
    margin: 0 20px 0 0;
  }

  #header span {
    cursor: pointer;
  }
  .disNone{
    display: none;
  }
</style>