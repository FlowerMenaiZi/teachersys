<template>
  <a-modal v-model:visible="vis" title="修改" @ok="Ok($event)" okText="确认" cancelText="取消">
    <label>系名</label>
    <a-input placeholder="请输入系名" v-model:value="curValue" ref="modifyValue"></a-input>
  </a-modal>
</template>

<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "departmentModal",
  props:{
    vis:{
      type:Boolean
    },
    handleOk:{
      type:Function,
      required: true
    },
    curValue:{
      type:String,
      required:true
    }
  },
  setup(props) {
    const Ok = (e:any) =>{
      // props.handleOk(e)
      console.log(e);
    }
    return {
      Ok
    }
  }
})
</script>

<style scoped>

</style>