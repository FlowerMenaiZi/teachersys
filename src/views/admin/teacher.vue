<template>
  <a-table :columns="columns" :data-source="data" :pagination="pagination"
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
        <a-modal v-model:visible="record.isShow" title="修改" @ok="handleOk()" okText="确认" cancelText="取消">
          <label>老师名</label>
          <a-input placeholder="请输入老师名" v-model:value="curTeacherName" style="margin-bottom: 4px"></a-input>
          <label>密码</label>
          <a-input placeholder="请输入密码" v-model:value="curTeacherPass" style="margin-bottom: 4px"></a-input>
          <label>教研室</label>
          <a-select style="width: 100%;margin-bottom: 4px" ref="select" @change="handleModifySelect"
                    v-model:value="curSelValue">
            <a-select-option v-for="(item,index) in sectionData" :key="item.id" :value="item.name">
              {{ item.name }}
            </a-select-option>
          </a-select>
          <label>是否是教研室管理人员:</label><br/>
          <a-radio-group :options="options" @change="handleModifyRadio" v-model:value="curRadioValue"/>
        </a-modal>
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
  <a-button type="primary" :style="{margin:'0 10px 0 0'}" @click="handleAdd">添加
    <a-modal v-model:visible="visibleTwo" title="添加" @ok="handleAddOk" okText="确认" cancelText="取消">
      <label>老师名</label>
      <a-input placeholder="请输入老师名" v-model:value="curTeacherName" style="margin-bottom: 4px"></a-input>
      <label>密码</label>
      <a-input placeholder="请输入密码" v-model:value="curTeacherPass" style="margin-bottom: 4px"></a-input>
      <label>教研室</label>
      <a-select style="width: 100%;margin-bottom: 4px" ref="select" @change="handleModifySelect"
                v-model:value="curSelValue">
        <a-select-option v-for="(item,index) in sectionData" :key="item.id" :value="item.name">
          {{ item.name }}
        </a-select-option>
      </a-select>
      <label>是否是教研室管理人员:</label><br/>
      <a-radio-group :options="options" @change="handleModifyRadio" v-model:value="curRadioValue"/>
    </a-modal>
  </a-button>
</template>

<script lang="ts">
import {defineComponent, reactive, ref, Ref} from 'vue';
import {message} from 'ant-design-vue';
import {CheckOutlined, EditOutlined, SearchOutlined} from '@ant-design/icons-vue';

//设置接收数据的接口
interface TableDataType {
  key: string;
  id: number;
  teachersName: string;
  teachersType: string;
  teachingSection: string;
  isShow?:boolean
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
    const data: Ref<TableDataType[]> = ref([
      {
        key: '1',
        id: 1,
        teachersName: '王景奇',
        teachersType: '老师',
        teachingSection: '系办教研室',
        isShow:false
      },
      {
        key: '2',
        id: 2,
        teachersName: '钟春琛',
        teachersType: '老师',
        teachingSection: '系办教研室'
      },
      {
        key: '3',
        id: 3,
        teachersName: '郑镇耿',
        teachersType: '教研室管理人员',
        teachingSection: '网络教研室'
      },
      {
        key: '4',
        id: 4,
        teachersName: '吴振庭',
        teachersType: '教研室管理人员',
        teachingSection: '系办教研室'
      },
      {
        key: '5',
        id: 5,
        teachersName: '刘杨',
        teachersType: '老师',
        teachingSection: '系办教研室'
      },
    ]);
    const sectionData = ref([
      {
        id: '1',
        name: '系办教研室'
      },
      {
        id: '2',
        name: '网络教研室'
      },
      {
        id: '3',
        name: '商务教研室'
      },
      {
        id: '4',
        name: '会计教研室'
      },
      {
        id: '5',
        name: '灯饰教研室'
      },
      {
        id: '6',
        name: '环艺教研室'
      },
      {
        id: '7',
        name: '专业基础教研室'
      },
      {
        id: '8',
        name: '美容教研室'
      },
      {
        id: '9',
        name: '行政部门教研室'
      },
    ]);
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
        dataIndex: 'teachersName',
        slots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'customRender',
        },
        onFilter: (value: string, record: TableDataType) =>
            record.teachersName.toString().toLowerCase().includes(value.toLowerCase()),
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
        dataIndex: 'teachersType',
        filters: [
          { text: '老师', value: '老师' },
          { text: '教研室管理人员', value: '教研室管理人员' },
        ],
        onFilter: (value: string, record: TableDataType) => record.teachersType.includes(value),
        ellipsis: true,
      },
      {
        title: '教研室',
        dataIndex: 'teachingSection',
        slots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'customRender',
        },
        onFilter: (value: string, record: TableDataType) =>
            record.teachingSection.toString().toLowerCase().includes(value.toLowerCase()),
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
    const curSelValue = ref('')
    const curRadioValue = ref('')
    //处理修改函数，传入key值
    const handleModify = (id: string) => {
      _id.value = id
      //显示弹出层
      for (let i of data.value) {

        if (i.id === _id.value) {
          //设置弹出层input显示的值
          curTeacherName.value = i.teachersName
          curSelValue.value = i.teachingSection
          //根据老师类型设置单选框默认选择
          if (i.teachersType === '老师') {
            curRadioValue.value = 'no'
          } else if (i.teachersType === '教研室管理人员') {
            curRadioValue.value = 'yes'
          }
        }
        if (i.key === data.value[0].key) i.isShow = true
      }
    }
    //获取选择的教研室
    const selTeacherSection = ref('')
    const handleModifySelect = (value: string) => {
      selTeacherSection.value = value
      console.log(value);
      for (let i=0;i<sectionData.value.length;i++){
        if (sectionData.value[i].name === value){
          console.log(sectionData.value[i].id);
        }
      }
    };
    //是否更改了教研室管理人员选择
    const isTeacherSectionAdmin = ref('')
    const handleModifyRadio = (value: any) => {
      // console.log(value.target.value);
      isTeacherSectionAdmin.value = value.target.value
    }
    //处理弹出层点击ok
    const handleOk = () => {
      for (let i in data.value) {
        if (data.value[i].id === _id.value) {
          //修改源数据对应的值
          //是否修改了教研室
          if (selTeacherSection.value !== '') {
            data.value[i].teachingSection = selTeacherSection.value
            selTeacherSection.value = ''
          }
          //是否修改了教研室管理人员
          if (isTeacherSectionAdmin.value !== '') {
            if (isTeacherSectionAdmin.value === 'no') {
              data.value[i].teachersType = '老师'
            } else if (isTeacherSectionAdmin.value === 'yes') {
              data.value[i].teachersType = '教研室管理人员'
            }
            isTeacherSectionAdmin.value = ''
          }
          //默认重新获取老师名并且修改
          data.value[i].teachersName = curTeacherName.value
          //是否修改了密码
          if (curTeacherPass.value !== '') {
            //  在这修改该老师密码
            console.log('老师修改了密码');
            curTeacherPass.value = ''
          }
        }
        message.success('修改成功')
        data.value[0].isShow = false
      }
    };
    //确认删除
    const confirm = (key: string) => {
      data.value = data.value.filter(item => item.key !== key)
      message.success('删除成功');
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
      }
      //判断是否已经存在该系
      for (let i in data.value) {
        if (data.value[i].teachersName === curTeacherName.value.trim()
            &&
            data.value[i].teachingSection === selTeacherSection.value) {
          message.error('该老师已经存在')
          return false
        }
      }
      let newTeacherType = ''
      if (isTeacherSectionAdmin.value === 'no'){
        newTeacherType = '老师'
      }else if (isTeacherSectionAdmin.value === 'yes'){
        newTeacherType = '教研室管理人员'
      }

      //模拟添加
      const newTeacher = {
        key:Date.now().toString(),
        id: Date.now(),
        teachersName: curTeacherName.value,
        teachersType: newTeacherType,
        teachingSection: curSelValue.value,
      }
      //向源数据追加
      data.value.push(newTeacher)
      message.success('添加成功')
      visibleTwo.value = false;

    }
    return {
      data,
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
      curTeacherPass
    };
  },
});
</script>

<style>
.ant-modal-mask {
  background-color: rgba(0, 0, 0, 0.3);
}
</style>