<template>
  <div class="content">
    <div class="curTerm">
      <p>当前学期</p>
      <a-select style="width: 300px" @change="handleChange" :default-value="defaultSheet">
        <a-select-option v-for="(item,index) in termItem"  :value="index" :key="index" >{{item.start}}-{{item.end}}年度 第{{item.which}}学期</a-select-option>
      </a-select>
    </div>
    <div class="changePass" style="margin-top: 10px">
      <p>修改管理员密码</p>
      <div>
        <a-input style="width: 200px;margin-right: 10px" v-model:value="password"></a-input>
        <a-button @click="repModifyPass">确认修改</a-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import {defineComponent,ref} from 'vue'
  import {message} from 'ant-design-vue';

  export default defineComponent({
    name: "system",
    setup() {
      const defaultSheet = 0
      const termItem = ref([
        {
          key:'1',
          id:1,
          start:'2020',
          end:'2021',
          which:'2',
        },
        {
          key:'2',
          id:2,
          start:'2020',
          end:'2021',
          which:'1',
        }
      ])
      const handleChange = (value:number) =>{
        console.log(termItem.value[value]);
      }
      const password = ref('')
      const repModifyPass = () =>{
        if (password.value === ''){
          message.error('请输入新密码')
          return false
        }
      }
      return {
        defaultSheet,
        termItem,
        handleChange,
        repModifyPass,
        password
      }
    }
  })
</script>

<style scoped>

</style>