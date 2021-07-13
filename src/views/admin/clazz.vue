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
      <a-select-option v-for="(item,index) in departmentData" :key="item.id" :value="item.name">
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
        <a-select-option v-for="(item,index) in departmentData" :key="item.id" :value="item.name">
          {{ item.name }}
        </a-select-option>
      </a-select>
      <label>密码</label><br/>
      <a-input placeholder="请输入密码" v-model:value="curClazzPass" style="margin-bottom: 4px"></a-input>
    </a-modal>
  </a-button>
  <a-button type="primary" :style="{margin:'0 10px 0 0'}">下载模板</a-button>
  <a-upload accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
    <a-button type="primary" :style="{margin:'0 10px 0 0'}">导入Excel</a-button>
  </a-upload>
</template>

<script lang="ts">
import {defineComponent, reactive, ref, Ref} from 'vue';
import {message} from 'ant-design-vue';
import {CheckOutlined, EditOutlined, SearchOutlined} from '@ant-design/icons-vue';

//设置接收数据的接口
interface TableDataType {
  key: string;
  id: number;
  clazzName: string;
  clazzRoom: string;
  department: string;
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
        clazzName: '183计网502',
        clazzRoom: '1301',
        department: '计算机应用系'
      },
      {
        key: '2',
        id: 2,
        clazzName: '183汽修512',
        clazzRoom: 'A1401',
        department: '汽车系'
      },
      {
        key: '3',
        id: 3,
        clazzName: '183家电502',
        clazzRoom: '1231',
        department: '电气应用系'
      },
      {
        key: '4',
        id: 4,
        clazzName: '183数控加工502',
        clazzRoom: '3453',
        department: '机械系'
      },
      {
        key: '5',
        id: 5,
        clazzName: '183云计算502',
        clazzRoom: '1302',
        department: '计算机应用系'
      },
    ]);
    const departmentData = ref([
      {
        id: '1',
        name: '计算机应用系'
      },
      {
        id: '2',
        name: '汽车系'
      },
      {
        id: '3',
        name: '电气应用系'
      },
      {
        id: '4',
        name: '机械系'
      }
    ]);
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
        dataIndex: 'clazzName',
        slots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'customRender',
        },
        onFilter: (value: string, record: TableDataType) =>
            record.clazzName.toString().toLowerCase().includes(value.toLowerCase()),
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
        dataIndex: 'clazzRoom',
        slots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'customRender',
        },
        onFilter: (value: string, record: TableDataType) =>
            record.clazzRoom.toString().toLowerCase().includes(value.toLowerCase()),
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
    //处理修改函数，传入key值
    const handleModify = (id: string) => {
      _id.value = id
      isShow.value = true
      //显示弹出层
      for (let i of data.value) {
        if (i.id === _id.value) {
          //设置弹出层input显示的值
          curClazzName.value = i.clazzName
          curClazzRoomName.value = i.clazzRoom
          curSelValue.value = i.department
        }
      }
    }
    //获取选择的系
    const selDepartment = ref('')
    const handleModifySelect = (value: string) => {
      selDepartment.value = value
    };
    //处理弹出层点击ok
    const handleOk = () => {
      let isRepClazz = false
      for (let i in data.value) {
        if (data.value[i].clazzName === curClazzName.value && data.value[i].id !== _id.value) {
          message.error('该班级已存在')
          isRepClazz = true
        }
      }
      let isRepClazzRoom = false
      for (let i in data.value) {
        if (data.value[i].clazzRoom === curClazzRoomName.value && data.value[i].id !== _id.value) {
          message.error('该教室已存在班级')
          isRepClazzRoom = true
        }
      }
      if (!isRepClazz && !isRepClazzRoom) {
        for (let i in data.value) {
          if (data.value[i].id == _id.value) {
            // 是否修改了系
            if (selDepartment.value !== '') {
              data.value[i].department = selDepartment.value
              selDepartment.value = ''
            }
            //默认重新获取老师名并且修改
            data.value[i].clazzName = curClazzName.value
            data.value[i].clazzRoom = curClazzRoomName.value
            //是否修改了密码
            if (curClazzPass.value !== '') {
              //  在这修改该老师密码
              console.log('修改了密码');
              curClazzPass.value = ''
            }
            message.success('修改成功')
          }
        }
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
        for (let i in data.value) {
          //判断是否已经存在该班级或教室
          if (data.value[i].clazzName === curClazzName.value.trim()) {
            message.error('该班级已经存在')
            return false
          }
        }
      }
      if (curClazzRoomName.value === '') {
        message.error('请输入教室')
        return false
      } else {
        for (let i in data.value) {
          //判断是否已经存在该教室
          if (data.value[i].clazzRoom === curClazzRoomName.value.trim()) {
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

      //模拟添加
      const newClazz = {
        key:Date.now().toString(),
        id: Date.now(),
        clazzName: curClazzName.value,
        clazzRoom: curClazzRoomName.value,
        department: curSelValue.value,
      }
      //向源数据追加
      data.value.push(newClazz)
      message.success('添加成功')
      curClazzPass.value = ''
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
    };
  },
});
</script>

<style>
.ant-modal-mask {
  background-color: rgba(0, 0, 0, 0.3);
}
</style>