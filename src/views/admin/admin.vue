<template>
  <div id="header">
    <p>{{whatEnd}} ({{name}})</p>
    <span>注销</span>
  </div>
  <a-layout>
    <a-layout-sider
            breakpoint="lg"
            collapsed-width="0"
            @breakpoint="breakPoint"
            :style="{ height: '90vh'}"
            :class="isShowScroll?'showScroll':''"
    >
      <div class="logo"/>
      <a-menu theme="dark" mode="inline">
        <a-sub-menu>
          <template #title>
            <span>
              <ClusterOutlined/>
              <span>部门管理</span>
            </span>
          </template>
          <a-menu-item key="department">
            <DeploymentUnitOutlined style="margin-right: 10px"/>
            <router-link to="/admin/department">系管理</router-link>
          </a-menu-item>
          <a-menu-item key="teacher">
            <UserOutlined style="margin-right: 10px"/>
            <router-link to="/admin/teacher">老师管理</router-link>
          </a-menu-item>
          <a-menu-item key="staff">
            <team-outlined style="margin-right: 10px"/>
            <router-link to="/admin/staff">教研室管理</router-link>
          </a-menu-item>
        </a-sub-menu>
        <a-sub-menu>
          <template #title>
            <span>
              <team-outlined/>
              <span>教学管理</span>
            </span>
          </template>
          <a-menu-item key="course">
            <BookOutlined style="margin-right: 10px"/>
            <router-link to="/admin/course">课程管理</router-link>
          </a-menu-item>
          <a-menu-item key="clazz">
            <SmileOutlined style="margin-right: 10px"/>
            <router-link to="/admin/clazz">班级管理</router-link>
          </a-menu-item>
          <a-menu-item key="clazzCourse">
            <TableOutlined style="margin-right: 10px"/>
            <router-link to="/admin/clazzCourse">班级选课管理</router-link>
          </a-menu-item>
        </a-sub-menu>
        <a-menu-item key="evenStudyCheck">
          <CheckCircleOutlined />
          <span><router-link to="/admin/evenStudyCheck">晚修检查管理</router-link></span>
        </a-menu-item>
        <a-sub-menu>
          <template #title>
            <span>
              <SolutionOutlined/>
              <span>授课管理</span>
            </span>
          </template>
          <a-menu-item key="homeworkCheck">
            <ProfileOutlined style="margin-right: 10px"/>
            <router-link to="/admin/homeworkCheck">学期作业管理</router-link>
          </a-menu-item>
          <a-menu-item key="teachingPlanCheck">
            <ProjectOutlined style="margin-right: 10px"/>
            <router-link to="/admin/teachingPlanCheck">授课计划情况管理</router-link>
          </a-menu-item>
          <a-menu-item key="teachingPlanEvaluation">
            <ReconciliationOutlined style="margin-right: 10px"/>
            <router-link to="/admin/teachingPlanEvaluation">教案测评记录管理</router-link>
          </a-menu-item>
        </a-sub-menu>
        <a-sub-menu>
          <template #title>
            <span>
              <team-outlined/>
              <span>系统配置</span>
            </span>
          </template>
          <a-menu-item key="term">
            <ContactsOutlined style="margin-right: 10px"/>
            <router-link to="/admin/term">学期管理</router-link>
          </a-menu-item>
          <a-menu-item key="system">
            <SettingOutlined style="margin-right: 10px"/>
            <router-link to="/admin/system">系统管理</router-link>
          </a-menu-item>
        </a-sub-menu>
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
    UserOutlined,
    VideoCameraOutlined,
    UploadOutlined,
    TeamOutlined,
    PieChartOutlined,
    ClusterOutlined,
    DeploymentUnitOutlined,
    SmileOutlined,
    BookOutlined,
    TableOutlined,
    CheckCircleOutlined,
    SolutionOutlined,
    ProfileOutlined,
    ProjectOutlined,
    ReconciliationOutlined,
    SettingOutlined,
    ContactsOutlined,
  } from '@ant-design/icons-vue';
  import {defineComponent, ref} from 'vue';

  export default defineComponent({
    components: {
      UserOutlined,
      VideoCameraOutlined,
      UploadOutlined,
      TeamOutlined,
      PieChartOutlined,
      ClusterOutlined,
      DeploymentUnitOutlined,
      SmileOutlined,
      BookOutlined,
      TableOutlined,
      CheckCircleOutlined,
      SolutionOutlined,
      ProfileOutlined,
      ProjectOutlined,
      ReconciliationOutlined,
      SettingOutlined,
      ContactsOutlined,
    },
    setup() {
      const whatEnd = ref('管理员端')
      const name = ref('刘杨')
      let isShowScroll = ref(true)
      const breakPoint = () => {
        if (window.innerWidth > 992) {
          isShowScroll.value = true
        } else {
          isShowScroll.value = false
        }
      }
      return {
        breakPoint,
        isShowScroll,
        whatEnd,
        name
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
  .ant-menu-submenu .ant-menu-item {
    padding-left: 30px !important;
  }
  .showScroll {
    overflow: auto;
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
  #header p{
    margin: 0 20px 0 0;
  }

  #header span{
    cursor: pointer;
  }
</style>