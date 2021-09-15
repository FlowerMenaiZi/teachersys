<!--
系管理
-->
<template>
  <a-table :columns="columns" :data-source="sData" :pagination="pagination">
    <template #filterDropdown="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }">
      <div style="padding: 8px">
        <a-input
            ref="searchInput"
            :placeholder="departmentNameTips"
            :value="selectedKeys[0]"
            style="width: 188px; margin-bottom: 8px; display: block"
            @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
            @pressEnter="handleSearch(selectedKeys, confirm, column.dataIndex)"
        />
        <a-button
            type="primary"
            size="small"
            style="width: 90px; margin-right: 8px"
            @click="handleSearch(selectedKeys, confirm, column.dataIndex)"
        >
          <template #icon>
            <SearchOutlined/>
          </template>
          搜索
        </a-button>
        <a-button size="small" style="width: 90px" @click="handleReset(clearFilters)">
          重置
        </a-button>
      </div>
    </template>
    <template #operation="{ record }">
      <a-button type="primary" :style="{margin:'0 10px 0 0'}" @click="handleModify(record.key)">修改</a-button>
      <a-popconfirm
          title="是否要删除？"
          ok-text="是"
          cancel-text="否"
          @confirm="confirm(record.key)"
      >
        <a-button type="danger">删除</a-button>
      </a-popconfirm>
    </template>
  </a-table>
  <a-modal v-model:visible="showModifyM" title="修改" @ok="handleOk()" okText="确认" cancelText="取消">
    <label>系名</label>
    <a-input placeholder="请输入系名" v-model:value="curValue" ref="modifyValue"></a-input>
  </a-modal>
  <a-button type="primary" :style="{margin:'0 10px 0 0'}" @click="handleAdd">添加
    <a-modal v-model:visible="visibleTwo" title="添加" @ok="handleAddOk" okText="确认" cancelText="取消">
      <label>系名</label>
      <a-input placeholder="请输入系名" v-model:value="curValue"></a-input>
    </a-modal>
  </a-button>
</template>
<script lang="ts">
import {defineComponent, ref, reactive, UnwrapRef, Ref,getCurrentInstance,onMounted} from 'vue';
import {message} from 'ant-design-vue';
import {SearchOutlined, CheckOutlined, EditOutlined} from '@ant-design/icons-vue';

//设置接收数据的接口
interface TableDataType {
  key: string;
  id: number;
  name: string;
}

export default defineComponent({
  name: 'department',
  components: {
    SearchOutlined,
    CheckOutlined,
    EditOutlined,
  },
  setup() {
    //搜索框
    const searchInput = ref();
    //分页数
    const pagination = {
      pageSize: 5
    };
    //获取接口数据
    let sData:any = ref([]);
    const {proxy}: any = getCurrentInstance();
    onMounted(()=>{
      proxy.$api.get(
          "/getDepartment",
          {},
          {},
          (success:any)=>{
            for (let i in success.data.data){
              let id = success.data.data[i].id
              success.data.data[i].key=id.toString()
              sData.value.push(success.data.data[i])
            }
          },
          (error:any)=>{
            console.log(error);
          }
      )
    })

    //添加系输入框的placeholder
    const departmentNameTips = ref("请输入系名")
    //搜索框状态
    const state = reactive({
      searchText: '',
      searchedColumn: '',
    });
    //设置表头及字段排序或字段搜索
    const columns = [
      {
        title: '编号',
        dataIndex: 'id',
        defaultSortOrder: 'false',
        sorter: (a: TableDataType, b: TableDataType) => a.id - b.id,
      },
      {
        title: '系名',
        dataIndex: 'name',
        slots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'customRender',
        },
        onFilter: (value: string, record: TableDataType) =>
            record.name.toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: (visible: any) => {
          if (visible) {
            setTimeout(() => {
              searchInput.value.focus();
            }, 0);
          }
        },
      },
      {
        title: '操作',
        dataIndex: 'operation',
        slots: {customRender: 'operation'},
      },
    ];
    //处理搜索结果
    const handleSearch = (selectedKeys: any, confirm: any, dataIndex: any) => {
      confirm();
      state.searchText = selectedKeys[0];
      state.searchedColumn = dataIndex;
    };
    //处理重置事件，清除搜索的内容
    const handleReset = (clearFilters: any) => {
      clearFilters();
      state.searchText = '';
    };
    //设置当前点击的值为空
    const curValue = ref()
    //设置当前点击的key值为空
    const _key = ref()
    const showModifyM = ref(false)

    //处理修改函数，传入key值
    const handleModify = (key: string) => {
      _key.value = key
      //显示弹出层
      for (let i of sData.value) {
        if (i.key === _key.value) {
          //设置弹出层input显示的值
          curValue.value = i.name
        }
        showModifyM.value = true
      }
    }
    //处理弹出层点击ok
    const handleOk = () => {
      if (curValue.value === ''){
        message.error('系不得为空!')
        return false
      }else{
        for (let i in sData.value) {
          if (sData.value[i].name === curValue.value) {
            message.error('该系已存在')
            return false
          }
        }
        proxy.$api.get(
            '/updDepartment',
            {},
            {"departId":parseInt(_key.value),"departName":curValue.value},
            (success)=>{
              sData.value.splice(0,sData.value.length)
              for (let i in success.data.data){
                let id = success.data.data[i].id
                success.data.data[i].key=id.toString()
                sData.value.push(success.data.data[i])
              }
              message.success('修改成功')
            },
            (error)=>{

            }
        )
      }
      showModifyM.value = false
    };
    //确认删除
    const confirm = (key: string) => {

      proxy.$api.get(
          '/delDepartment',
          {},
          {"departId":parseInt(key)},
          (success)=>{
            sData.value.splice(0,sData.value.length)
            for (let i in success.data.data){
              let id = success.data.data[i].id
              success.data.data[i].key=id.toString()
              sData.value.push(success.data.data[i])
            }
            message.success('删除成功')
          },
          (error)=>{

          }
      )
    };

    //第二个弹出层默认为否
    const visibleTwo = ref(false);
    //处理点击添加事件
    const handleAdd = () => {
      visibleTwo.value = true;
      curValue.value = ''
    }

    //处理添加弹出层的确认事件
    const handleAddOk = () => {
      //判断是否为空
      if (curValue.value === '') {
        message.error('请输入系名')
      } else {
        //判断是否已经存在该系
        for (let i in sData.value) {
          if (sData.value[i].name === curValue.value) {
            message.error('该系已存在')
            return false
          }
        }
        proxy.$api.get(
            '/addDepartment',
            {},
            {"departName":curValue.value},
            (success)=>{
              sData.value.splice(0,sData.value.length)
              for (let i in success.data.data){
                let id = success.data.data[i].id
                success.data.data[i].key=id.toString()
                sData.value.push(success.data.data[i])
              }
              message.success('添加成功')
            },
            (error)=>{

            }
        )
        visibleTwo.value = false;
      }

    }
    return {
      sData,
      columns,
      handleSearch,
      handleReset,
      pagination,
      searchInput,
      departmentNameTips,
      handleModify,
      confirm,
      handleOk,
      curValue,
      handleAdd,
      handleAddOk,
      visibleTwo,
      showModifyM
    };
  },
});
</script>

<style scoped>

</style>