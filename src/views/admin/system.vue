<template>
  <div class="content">
    <div class="curTerm">
      <p>当前学期</p>
      <a-select style="width: 300px" @change="handleChange" v-model:value="curTerm">
        <a-select-option v-for="(item,index) in termItem" :value="item.id" :key="index">{{item.start}}-{{item.end}}年度
          第{{item.which}}学期
        </a-select-option>
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
  import {defineComponent, ref, onMounted, getCurrentInstance} from 'vue'
  import {message} from 'ant-design-vue';
  import $store from "../../store/index"

  export default defineComponent({
    name: "system",
    setup() {
      const curTerm: any = ref()
      const {proxy}: any = getCurrentInstance()
      const termItem: any = ref([])
      onMounted(() => {
        proxy.$api.get(
            '/getTerm',
            {},
            {},
            (success) => {
              for (let i in success.data.data) {
                let id = success.data.data[i].id
                success.data.data[i].key = id.toString()
                termItem.value.push(success.data.data[i])
              }
            },
            (error) => {

            }
        )
        proxy.$api.get(
            '/getCurTerm',
            {},
            {},
            (success) => {
              curTerm.value = parseInt(success.data.data)

            },
            (error) => {

            }
        )
      })
      const handleChange = (value: number) => {
        proxy.$api.get(
            '/updCurTerm',
            {},
            {'id':value},
            (success) => {
              curTerm.value = value
            },
            (error) => {

            }
        )
      }
      const password = ref('')
      const repModifyPass = () => {
        if (password.value === '') {
          message.error('请输入新密码')
          return false
        } else {
          proxy.$api.post(
              '/changePass',
              {},
              {'id': $store.state.userInfo.id, 'password': password.value},
              (success) => {
                if (success.data.error === 0) {
                  message.success('修改成功')
                } else {
                  message.error('修改失败')
                }
              }
          )
        }
      }
      return {
        curTerm,
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