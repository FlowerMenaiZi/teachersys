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
      <a-button type="primary" :style="{margin:'0 10px 0 0'}" @click="handleModify(record.id)">修改</a-button>
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
    <label>老师名</label>
    <a-input placeholder="请输入老师名" v-model:value="curTeacherName" style="margin-bottom: 4px"></a-input>
    <label>密码</label>
    <a-input placeholder="请输入密码" v-model:value="curTeacherPass" style="margin-bottom: 4px"></a-input>
    <label>教研室</label>
    <a-select style="width: 100%;margin-bottom: 4px" ref="select" @change="handleModifySelect"
              v-model:value="curSelValue">
      <a-select-option v-for="(item,index) in sectionData" :key="item.id" :value="item.id">
        {{ item.name }}
      </a-select-option>
    </a-select>
    <label>是否是教研室管理人员:</label><br/>
    <a-radio-group :options="options" @change="handleModifyRadio" v-model:value="curRadioValue"/>
  </a-modal>
  <a-button type="primary" :style="{margin:'0 10px 0 0'}" @click="handleAdd">添加
    <a-modal v-model:visible="visibleTwo" title="添加" @ok="handleAddOk" okText="确认" cancelText="取消">
      <label>老师名</label>
      <a-input placeholder="请输入老师名" v-model:value="curTeacherName" style="margin-bottom: 4px"></a-input>
      <label>密码</label>
      <a-input placeholder="请输入密码" v-model:value="curTeacherPass" style="margin-bottom: 4px"></a-input>
      <label>教研室</label>
      <a-select style="width: 100%;margin-bottom: 4px" ref="select" @change="handleModifySelect"
                v-model:value="curSelValue">
        <a-select-option v-for="(item,index) in sectionData" :key="item.id" :value="item.id">
          {{ item.name }}
        </a-select-option>
      </a-select>
      <label>是否是教研室管理人员:</label><br/>
      <a-radio-group :options="options" @change="handleModifyRadio" v-model:value="curRadioValue"/>
    </a-modal>
  </a-button>
</template>

<script lang="ts">
import {defineComponent, reactive, ref, Ref,getCurrentInstance,onMounted} from 'vue';
import {message} from 'ant-design-vue';
import {CheckOutlined, EditOutlined, SearchOutlined} from '@ant-design/icons-vue';

//设置接收数据的接口
interface TableDataType {
  key: string;
  id: number;
  name: string;
  role: string;
  staff: string;
  staff_id:number;
  user_role:number;
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
    const sectionData:any = ref([]);
    const {proxy}: any = getCurrentInstance()
    onMounted(() => {
      proxy.$api.get(
          '/getTeacher',
          {},
          {},
          (success) => {
            for (let i in success.data.data) {
              let id = success.data.data[i].id
              success.data.data[i].key = id.toString()
              sData.value.push(success.data.data[i])
            }
          },
          (error) => {
            console.log(error);
          }
      )
      proxy.$api.get(
          '/getStaff',
          {},
          {},
          (success) => {
            for (let i in success.data.data) {
              sectionData.value.push(success.data.data[i])
            }
          },
          (error) => {
            console.log(error);
          }
      )
    })
    //是否教研室管理员单选框内容
    const options = [
      {label: '是', value: 'yes'},
      {label: '否', value: 'no'},
    ]
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
        title: '老师名',
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
        title: '老师类型',
        dataIndex: 'role',
        filters: [
          { text: '老师', value: '老师' },
          { text: '教研室管理人员', value: '教研室管理人员' },
        ],
        onFilter: (value: string, record: TableDataType) => record.role.includes(value),
        ellipsis: true,
      },
      {
        title: '教研室',
        dataIndex: 'staff',
        slots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'customRender',
        },
        onFilter: (value: string, record: TableDataType) =>
            record.staff.toString().toLowerCase().includes(value.toLowerCase()),
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
    //设置当前点击的老师名值为空
    const curTeacherName = ref('')
    //设置当前点击的老师密码值为空
    const curTeacherPass = ref('')
    //设置当前点击的key值为空
    const _id = ref()
    const curSelValue = ref()
    const curRadioValue = ref('')
    const showModifyM = ref(false)
    //处理修改函数，传入key值
    const handleModify = (id: string) => {
      _id.value = id
      //显示弹出层
      for (let i of sData.value) {
        if (i.id === _id.value) {
          //设置弹出层input显示的值
          curTeacherName.value = i.name
          curSelValue.value = i.staff_id
          //根据老师类型设置单选框默认选择
          if (i.role === '老师') {
            curRadioValue.value = 'no'
          } else if (i.role === '教研室主任') {
            curRadioValue.value = 'yes'
          }
        }
        showModifyM.value = true
      }
    }
    //获取选择的教研室
    const selTeacherSection = ref('')
    const handleModifySelect = (value: string) => {
      selTeacherSection.value = value
    };
    //是否更改了教研室管理人员选择
    const isTeacherSectionAdmin = ref('')
    const handleModifyRadio = (value: any) => {
      isTeacherSectionAdmin.value = value.target.value
    }
    //处理弹出层点击ok
    const modifyPassSuccess = ref(true)
    const handleOk = () => {
      let newTeacherType = ''
      if (curRadioValue.value === 'no'){
        newTeacherType = '老师'
      }else if (curRadioValue.value === 'yes'){
        newTeacherType = '教研室主任'
      }
      proxy.$api.get(
          '/updTeacher',
          {},
          {'id':parseInt(_id.value),'name':curTeacherName.value,'staff_id':parseInt(curSelValue.value),'role_name':newTeacherType,'password':curTeacherPass.value},
          (success)=>{
            sData.value.splice(0,sData.value.length)
            for (let i in success.data.data) {
              let id = success.data.data[i].id
              success.data.data[i].key = id.toString()
              sData.value.push(success.data.data[i])
            }
            message.success('修改成功');
           showModifyM.value = false
          },
          (error)=>{

          }
      )

    };
    //确认删除
    const confirm = (key: string) => {
      proxy.$api.get(
          '/delTeacher',
          {},
          {'id':parseInt(key)},
          (success)=>{
            if(success.data.error == 0){
              message.success('删除成功');
              sData.value.splice(0,sData.value.length)
              for (let i in success.data.data) {
                let id = success.data.data[i].id
                success.data.data[i].key = id.toString()
                sData.value.push(success.data.data[i])
              }
            }else{
              message.error('删除失败');
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
      curTeacherName.value = ''
      curTeacherPass.value = ''
      curSelValue.value = ''
      curRadioValue.value = ''
    }

    //处理添加弹出层的确认事件
    const handleAddOk = () => {
      //判断是否为空
      if (curTeacherName.value === '') {
        message.error('请输入老师名')
        return false
      } else if (curTeacherPass.value === '') {
        message.error('请输入密码')
        return false
      } else if (selTeacherSection.value === '') {
        message.error('请选择教研室')
        return false
      } else if (isTeacherSectionAdmin.value === '') {
        message.error('请选择是否为教研室管理人员')
        return false
      }else{
        //判断是否已经存在该教研室
        for (let i in sData.value) {
          if (sData.value[i].name === curTeacherName.value.trim()
              &&
              sData.value[i].staff_id === parseInt(selTeacherSection.value)) {
            message.error('该老师已经存在')
            return false
          }
        }
        let newTeacherType = ''
        if (isTeacherSectionAdmin.value === 'no'){
          newTeacherType = '老师'
        }else if (isTeacherSectionAdmin.value === 'yes'){
          newTeacherType = '教研室主任'
        }
        proxy.$api.get(
            "/addTeacher",
            {},
            {'name':curTeacherName.value,'power':newTeacherType,'staff_id':curSelValue.value,'password':curTeacherPass.value},
            (success)=>{
              sData.value.splice(0,sData.value.length)
              for (let i in success.data.data) {
                let id = success.data.data[i].id
                success.data.data[i].key = id.toString()
                sData.value.push(success.data.data[i])
              }

              message.success('添加成功')
            },
            (error)=>{}
        )
      }

      visibleTwo.value = false;

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
      curTeacherName,
      handleAdd,
      handleAddOk,
      visibleTwo,
      sectionData,
      handleModifySelect,
      options,
      handleModifyRadio,
      curSelValue,
      curRadioValue,
      curTeacherPass,
      showModifyM
    };
  },
});
</script>

<style>
.ant-modal-mask {
  background-color: rgba(0, 0, 0, 0.3);
}
</style>