<!--
学期管理
-->
<template>
  <a-table :columns="columns" :data-source="sData" :pagination="pagination">
    <template #filterDropdown="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }">
      <div style="padding: 8px">
        <a-input
                ref="searchInput"
                :placeholder="`查询${column.title}`"
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
      <a-button type="primary" :style="{margin:'0 10px 0 0'}" @click="handleModify(record.key)">修改
      </a-button>
      <a-popconfirm
              title="是否要删除？"
              ok-text="是"
              cancel-text="否"
              @confirm="confirm(record.key)">
        <a-button type="danger">删除</a-button>
      </a-popconfirm>
    </template>
  </a-table>
  <a-modal v-model:visible="showModify" title="修改" @ok="handleOk()" okText="确认" cancelText="取消">
    <label>开始学年:</label>
    <a-input placeholder="请输入开始学年" style="margin-bottom: 10px" v-model:value="start"></a-input>
    <label>结束学年:</label>
    <a-input placeholder="请输入结束学年" style="margin-bottom: 10px" v-model:value="end"></a-input>
    <label>第几学期:</label>
    <a-input placeholder="请输入第几学期" style="margin-bottom: 10px" v-model:value="whichTerm"></a-input>
  </a-modal>
  <a-button type="primary" :style="{margin:'0 10px 0 0'}" @click="handleAdd">添加
    <a-modal v-model:visible="visibleTwo" title="添加" @ok="handleAddOk" okText="确认" cancelText="取消">
      <label>开始学年:</label>
      <a-input-number placeholder="请输入开始学年" style="margin-bottom: 10px;width: 100%;" v-model:value="start"></a-input-number>
      <label>结束学年:</label>
      <a-input-number placeholder="请输入结束学年" style="margin-bottom: 10px;width: 100%;" v-model:value="end"></a-input-number>
      <label>第几学期:</label>
      <a-input-number placeholder="请输入第几学期" style="margin-bottom: 10px;width: 100%;" v-model:value="whichTerm" :min="0" :max="2"></a-input-number>
    </a-modal>
  </a-button>
</template>

<script lang="ts">
  import {defineComponent, ref, reactive, UnwrapRef, Ref,onMounted,getCurrentInstance} from 'vue';
  import {message} from 'ant-design-vue';
  import {SearchOutlined, CheckOutlined, EditOutlined} from '@ant-design/icons-vue';

  //设置接收数据的接口
  interface TableDataType {
    key: string;
    id: number;
    start: string;
    end: string;
    which: string;
  }

  export default defineComponent({
    name: "term",
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
      //模拟数据，使用TableDataType接口验证数据
      const sData: Ref<TableDataType[]> = ref([]);
      /*获取数据*/
      const {proxy}:any = getCurrentInstance()
      onMounted(()=>{
        proxy.$api.get(
            '/getTerm',
            {},
            {},
            (success)=>{
              for (let i in success.data.data){
                let id = success.data.data[i].id
                success.data.data[i].key = id.toString()
                sData.value.push(success.data.data[i])
              }
            },
            (error)=>{

            }
        )
      })
      //搜索框状态
      const state = reactive({
        searchText: '',
        searchedColumn: '',
      });
      //设置表头及字段排序或字段搜索
      const columns = [
        {
          title: '开始学年',
          dataIndex: 'start',
          slots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender',
          },
          onFilter: (value: string, record: TableDataType) =>
              record.start.toString().toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible: any) => {
            if (visible) {
              setTimeout(() => {
                searchInput.value.focus();
              }, 0);
            }
          },
        },
        {
          title: '结束学年',
          dataIndex: 'end',
          slots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender',
          },
          onFilter: (value: string, record: TableDataType) =>
              record.end.toString().toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible: any) => {
            if (visible) {
              setTimeout(() => {
                searchInput.value.focus();
              }, 0);
            }
          },
        },
        {
          title: '第几学期',
          dataIndex: 'which',
          slots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender',
          },
          onFilter: (value: string, record: TableDataType) =>
              record.which.toString().toLowerCase().includes(value.toLowerCase()),
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
      //设置当前点击的key值为空
      const _key = ref()
      const showModify = ref(false)
      const start = ref('')
      const end = ref('')
      const whichTerm = ref('')
      //处理修改函数，传入key值
      const handleModify = (key: string) => {
        showModify.value = true
        _key.value = key
        for (let i of sData.value) {
          if (i.key === _key.value) {
            start.value = i.start
            end.value = i.end
            whichTerm.value = i.which
          }
        }
      }
      //处理弹出层点击ok
      const handleOk = () => {
        const isUpdTerm = ref(false)
        for (let i = 0;i<sData.value.length;i++){
          if (start.value == sData.value[i].start){
            if (end.value == sData.value[i].end){
              if (whichTerm.value == sData.value[i].which){
                isUpdTerm.value = true
              }
            }
          }
        }
        if (isUpdTerm.value){
          message.error('该学期已存在')
          return false
        }else{
          proxy.$api.get(
              '/updTerm',
              {},
              {'id':parseInt(_key.value),'start':start.value,'end':end.value,'which':whichTerm.value},
              (success)=>{
                if (success.data.error === 0){
                  sData.value.splice(0,sData.value.length)
                  for (let i in success.data.data){
                    let id = success.data.data[i].id
                    success.data.data[i].key = id.toString()
                    sData.value.push(success.data.data[i])
                  }
                  message.success('修改成功')
                  showModify.value = false
                }else{
                  message.error('修改失败')
                }
              },
              (error)=>{

              }
          )
        }

      };
      //确认删除
      const confirm = (key: string) => {
        proxy.$api.get(
            '/delTerm',
            {},
            {'id':parseInt(key)},
            (success)=>{
              if (success.data.error === 0){
                sData.value.splice(0,sData.value.length)
                for (let i in success.data.data){
                  let id = success.data.data[i].id
                  success.data.data[i].key = id.toString()
                  sData.value.push(success.data.data[i])
                }

                message.success('删除成功');
              }
            },
            (error)=>{

            }
        )
      };

      //第二个弹出层默认为否
      const visibleTwo = ref(false);
      //处理点击添加事件
      const handleAdd = () => {
        start.value = ''
        end.value = ''
        whichTerm.value = ''
        visibleTwo.value = true;
      }

      //处理添加弹出层的确认事件
      const handleAddOk = () => {
        //判断是否为空
        if (start.value == null || start.value == ''){
          message.error('请输入开始学年')
          return false
        }
        if (end.value == null || end.value == ''){
          message.error('请输入结束学年')
          return false
        }
        if (whichTerm.value == null || whichTerm.value == ''){
          message.error('请输入第几学期')
          return false
        }
        const isTerm = ref(false)
        for (let i = 0;i<sData.value.length;i++){
          if (start.value == sData.value[i].start){
            if (end.value == sData.value[i].end){
              if (whichTerm.value == sData.value[i].which){
                isTerm.value = true
              }
            }
          }
        }
        if (isTerm.value){
          message.error('该学期已存在')
          return false
        }
        proxy.$api.get(
            '/addTerm',
            {},
            {'start':start.value,'end':end.value,'which':whichTerm.value},
            (success)=>{
              if (success.data.error === 0){
                sData.value.splice(0,sData.value.length)
                for (let i in success.data.data){
                  let id = success.data.data[i].id
                  success.data.data[i].key = id.toString()
                  sData.value.push(success.data.data[i])
                }
                message.success('添加成功')
                visibleTwo.value = false;
              }
            },
            (error)=>{

            }
        )

      }
      return {
        sData,
        columns,
        handleSearch,
        handleReset,
        pagination,
        searchInput,
        handleModify,
        confirm,
        handleOk,
        handleAdd,
        handleAddOk,
        visibleTwo,
        showModify,
        start,
        end,
        whichTerm,
      };
    },
  });
</script>

<style>
</style>