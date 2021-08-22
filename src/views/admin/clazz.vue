<template>
  <a-table :columns="columns" :data-source="sData" :pagination="pagination"
           :locale="{filterConfirm:'确定',filterReset: '重置',emptyText: '暂无数据'}">
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
      <a-button type="primary" :style="{margin:'0 10px 0 0'}" @click="handleModify(record.id)">修改

      </a-button>
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
  <a-modal v-model:visible="isShow" title="修改" @ok="handleOk()" okText="确认" cancelText="取消">
    <label>班级名</label>
    <a-input placeholder="请输入班级名" v-model:value="curClazzName" style="margin-bottom: 4px"></a-input>
    <label>教室</label>
    <a-input placeholder="请输入教室名" v-model:value="curClazzRoomName" style="margin-bottom: 4px"></a-input>
    <label>系</label>
    <a-select style="width: 100%;margin-bottom: 4px" @change="handleModifySelect"
              v-model:value="curSelValue">
      <a-select-option v-for="(item,index) in departmentData" :key="item.id" :value="item.id">
        {{ item.name }}
      </a-select-option>
    </a-select>
    <label>密码</label><br/>
    <a-input placeholder="请输入密码" v-model:value="curClazzPass" style="margin-bottom: 4px"></a-input>
  </a-modal>
  <a-button type="primary" :style="{margin:'0 10px 0 0'}" @click="handleAdd">添加
    <a-modal v-model:visible="visibleTwo" title="添加" @ok="handleAddOk" okText="确认" cancelText="取消">
      <label>班级名</label>
      <a-input placeholder="请输入班级名" v-model:value="curClazzName" style="margin-bottom: 4px"></a-input>
      <label>教室</label>
      <a-input placeholder="请输入教室名" v-model:value="curClazzRoomName" style="margin-bottom: 4px"></a-input>
      <label>系</label>
      <a-select style="width: 100%;margin-bottom: 4px" @change="handleModifySelect"
                v-model:value="curSelValue">
        <a-select-option v-for="(item,index) in departmentData" :key="item.id" :value="item.id">
          {{ item.name }}
        </a-select-option>
      </a-select>
      <label>密码</label><br/>
      <a-input placeholder="请输入密码" v-model:value="curClazzPass" style="margin-bottom: 4px"></a-input>
    </a-modal>
  </a-button>
  <a-button type="primary" :style="{margin:'0 10px 0 0'}">
    <a href="http://119.29.185.52:9001/downClazzTemplate" target="_blank">下载模板</a>
  </a-button>
  <a-upload accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" :show-upload-list="false" action="http://119.29.185.52:9001/importClazzTem" @change="upLoadFinal">
    <a-button type="primary" :style="{margin:'0 10px 0 0'}">导入Excel</a-button>
  </a-upload>
</template>

<script lang="ts">
  import {defineComponent, reactive, ref, Ref, onMounted, getCurrentInstance} from 'vue';
  import {message} from 'ant-design-vue';
  import {CheckOutlined, EditOutlined, SearchOutlined} from '@ant-design/icons-vue';

  //设置接收数据的接口
  interface TableDataType {
    key: string;
    id: number;
    name: string;
    room: string;
    department: string;
    department_id:number;
  }

  export default defineComponent({
    name: 'teacher',
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
      const departmentData: any = ref([]);
      const {proxy}: any = getCurrentInstance();
      onMounted(() => {
        proxy.$api.get(
            "/getClazz",
            {},
            {},
            (success: any) => {
              for (let i in success.data.data) {
                let id = success.data.data[i].id
                success.data.data[i].key = id.toString()
                sData.value.push(success.data.data[i])
              }
            },
            (error: any) => {
              console.log(error);
            }
        )
        proxy.$api.get(
            "/getDepartment",
            {},
            {},
            (success: any) => {
              for (let i in success.data.data) {
                departmentData.value.push(success.data.data[i])
              }
            },
            (error: any) => {
              console.log(error);
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
          title: '编号',
          dataIndex: 'id',
          defaultSortOrder: 'false',
          sorter: (a: TableDataType, b: TableDataType) => a.id - b.id,
        },
        {
          title: '班级名称',
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
          title: '教室',
          dataIndex: 'room',
          slots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender',
          },
          onFilter: (value: string, record: TableDataType) =>
              record.room.toString().toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible: any) => {
            if (visible) {
              setTimeout(() => {
                searchInput.value.focus();
              }, 0);
            }
          },
        },
        {
          title: '系',
          dataIndex: 'department',
          slots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender',
          },
          onFilter: (value: string, record: TableDataType) =>
              record.department.toString().toLowerCase().includes(value.toLowerCase()),
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
      //设置当前点击的班级名值为空
      const curClazzName = ref('')
      //设置当前点击的教室值为空
      const curClazzRoomName = ref('')
      //设置当前点击的老师密码值为空
      const curClazzPass = ref('')
      //设置当前点击的key值为空
      const _id = ref()
      const isShow = ref(false)
      const curSelValue = ref('')
      const curSelValueId = ref()
      //处理修改函数，传入key值
      const handleModify = (id: string) => {
        _id.value = id
        isShow.value = true
        //显示弹出层
        for (let i of sData.value) {
          if (i.id === _id.value) {
            //设置弹出层input显示的值
            curClazzName.value = i.name
            curClazzRoomName.value = i.room
            curSelValue.value = i.department
            curSelValueId.value = i.department_id
          }
        }
      }
      //获取选择的系
      const handleModifySelect = (value: number) => {
        curSelValueId.value = value
      };
      //处理弹出层点击ok
      const handleOk = () => {
        let isRepClazz = false
        for (let i in sData.value) {
          if (sData.value[i].name === curClazzName.value && sData.value[i].id !== _id.value) {
            message.error('该班级已存在')
            isRepClazz = true
          }
        }
        let isRepClazzRoom = false
        for (let i in sData.value) {
          if (sData.value[i].room === curClazzRoomName.value && sData.value[i].id !== _id.value) {
            message.error('该教室已存在班级')
            isRepClazzRoom = true
          }
        }
        if (!isRepClazz && !isRepClazzRoom) {
          for (let i in sData.value) {
            if (sData.value[i].id == _id.value) {
              //是否修改了密码
              if (curClazzPass.value !== '') {
                //  在这修改该班级密码
                console.log('修改了密码');
                curClazzPass.value = ''
              }
              proxy.$api.get(
                  '/updClazz',
                  {},
                  {'id':parseInt(_id.value),'name':curClazzName.value,'room':curClazzRoomName.value,'department_id':parseInt(curSelValueId.value)},
                  (success)=>{
                    if (success.data.error === 0){
                      message.success('修改成功')
                      isShow.value = false
                      sData.value.splice(0,sData.value.length)
                      for (let i in success.data.data) {
                        let id = success.data.data[i].id
                        success.data.data[i].key = id.toString()
                        sData.value.push(success.data.data[i])
                      }
                    }
                  },
                  (error)=>{

                  }
              )
            }
          }
        }
      };
      //确认删除
      const confirm = (key: string) => {
        proxy.$api.get(
            '/delClazz',
            {},
            {'id':parseInt(key)},
            (success)=>{
              if (success.data.error === 0){
                message.success('删除成功')
                sData.value.splice(0,sData.value.length)
                for (let i in success.data.data) {
                  let id = success.data.data[i].id
                  success.data.data[i].key = id.toString()
                  sData.value.push(success.data.data[i])
                }
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
        visibleTwo.value = true;
        curClazzName.value = ''
        curClazzRoomName.value = ''
        curSelValue.value = ''
      }

      //处理添加弹出层的确认事件
      const handleAddOk = () => {
        //判断是否为空
        if (curClazzName.value === '') {
          message.error('请输入班级名')
          return false
        } else {
          for (let i in sData.value) {
            //判断是否已经存在该班级或教室
            if (sData.value[i].name === curClazzName.value.trim()) {
              message.error('该班级已经存在')
              return false
            }
          }
        }
        if (curClazzRoomName.value === '') {
          message.error('请输入教室')
          return false
        } else {
          for (let i in sData.value) {
            //判断是否已经存在该教室
            if (sData.value[i].room === curClazzRoomName.value.trim()) {
              message.error('该教室已经存在班级')
              return false
            }
          }
        }
        if (curSelValue.value === '') {
          message.error('请选择系')
          return false
        }
        if (curClazzPass.value === '') {
          message.error('请输入班级密码')
          return false
        }

        proxy.$api.get(
            '/addClazz',
            {},
            {'clazzName':curClazzName.value,'room':curClazzRoomName.value,'departId':curSelValue.value,'power':'班级','password':curClazzPass.value},
            (success)=>{
              if (success.data.error === 0){
                message.success('添加成功')
                sData.value.splice(0,sData.value.length)
                for (let i in success.data.data) {
                  let id = success.data.data[i].id
                  success.data.data[i].key = id.toString()
                  sData.value.push(success.data.data[i])
                }
              }
            },
            (error)=>{

            }
        )
        curClazzPass.value = ''
        visibleTwo.value = false;
      }
      const upLoadFinal = ({file}) =>{
        if (file.status === 'done') {
          sData.value.splice(0,sData.value.length)
          for (let i in file.response.data) {
            let id = file.response.data[i].id
            file.response.data[i].key = id.toString()
            sData.value.push(file.response.data[i])
          }
          message.success('批量导入成功');
        }
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
        curClazzName,
        curClazzRoomName,
        handleAdd,
        handleAddOk,
        visibleTwo,
        departmentData,
        handleModifySelect,
        curSelValue,
        curClazzPass,
        isShow,
        upLoadFinal
      };
    },
  });
</script>

<style>
  .ant-modal-mask {
    background-color: rgba(0, 0, 0, 0.3);
  }
</style>