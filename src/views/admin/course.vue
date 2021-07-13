<template>
  <a-table :columns="columns" :data-source="data" :pagination="pagination">
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
        <a-modal v-model:visible="record.isShow" title="修改" @ok="handleOk()" okText="确认" cancelText="取消">
          <label>课程名</label>
          <a-input placeholder="请输入课程名称" v-model:value="curCourseValue" style="margin-bottom: 10px"></a-input>
          <label>老师</label><br/>
          <a-select
              show-search
              style="width: 100%"
              @change="handleTeacherChange"
              v-model:value="curTeacherName"
          >
            <a-select-option v-for="(item,index) in teachers" :value="item.name" :key="item.key">
              {{ item.name }}
            </a-select-option>
          </a-select>
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
      <label>课程名</label>
      <a-input placeholder="请输入课程名称" v-model:value="curCourseValue" style="margin-bottom: 10px"></a-input>
      <label>老师</label><br/>
      <a-select
          show-search
          style="width: 100%"
          @change="handleTeacherChange"
          v-model:value="curTeacherName"
      >
        <a-select-option v-for="(item,index) in teachers" :value="item.name" :key="item.key">
          {{ item.name }}
        </a-select-option>
      </a-select>
    </a-modal>
  </a-button>
</template>

<script lang="ts">
import {defineComponent, ref, reactive, UnwrapRef, Ref} from 'vue';
import {message} from 'ant-design-vue';
import {SearchOutlined, CheckOutlined, EditOutlined} from '@ant-design/icons-vue';

//设置接收数据的接口
interface TableDataType {
  key: string;
  id: number;
  courseName: string;
  teachersName: string;
  isShow?:boolean;
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
    //模拟数据，使用TableDataType接口验证数据
    const data: Ref<TableDataType[]> = ref([
      {
        key: '1',
        id: 1,
        courseName: '海报型录设计',
        teachersName: '邱垂章',
        isShow:false
      },
      {
        key: '2',
        id: 2,
        courseName: '税收筹划',
        teachersName: '刘献红'
      },
      {
        key: '3',
        id: 3,
        courseName: '学习高技能人才楷模专题教育',
        teachersName: '郝佩玉'
      },
      {
        key: '4',
        id: 4,
        courseName: 'JAVA网站编程',
        teachersName: '付天义'
      },
      {
        key: '5',
        id: 5,
        courseName: '就业指导',
        teachersName: '王景奇'
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
        title: '课程名',
        dataIndex: 'courseName',
        slots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'customRender',
        },
        onFilter: (value: string, record: TableDataType) =>
            record.courseName.toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: (visible: any) => {
          if (visible) {
            setTimeout(() => {
              searchInput.value.focus();
            }, 0);
          }
        },
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
        title: '操作',
        dataIndex: 'operation',
        slots: {customRender: 'operation'},
      },
    ];
    const teachers = ref([
      {
        key: '1',
        id: 1,
        name: '王景奇'
      },
      {
        key: '2',
        id: 2,
        name: '钟春琛'
      },
      {
        key: '3',
        id: 3,
        name: '邱垂章'
      },
      {
        key: '4',
        id: 4,
        name: '刘献红'
      },
      {
        key: '5',
        id: 5,
        name: '林德南'
      },
      {
        key: '6',
        id: 6,
        name: '郝佩玉'
      },
      {
        key: '7',
        id: 7,
        name: '付天义'
      },
      {
        key: '8',
        id: 8,
        name: '刘杨'
      },
    ])
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
    const curCourseValue = ref('')
    //设置当前点击的key值为空
    const _key = ref()
    const curTeacherName = ref('')
    //处理修改函数，传入key值
    const handleModify = (key: string) => {
      _key.value = key
      //显示弹出层
      for (let i of data.value) {
        if (i.key === _key.value) {
          //设置弹出层input显示的值
          curCourseValue.value = i.courseName
          curTeacherName.value = i.teachersName
        }
        if (i.key === data.value[0].key) i.isShow = true
      }
    }
    const selTeacherChange = ref('')
    const handleTeacherChange = (value: string) => {
      selTeacherChange.value = value
    };
    //处理弹出层点击ok
    const handleOk = () => {
      for (let i in data.value) {
        if (data.value[i].key === _key.value) {
          //修改源数据对应的值
          data.value[i].courseName = curCourseValue.value
          if (selTeacherChange.value !== ''){
            data.value[i].teachersName = selTeacherChange.value
          }
          message.success('修改成功')
        }
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
      curCourseValue.value = ''
      curTeacherName.value = ''
    }

    //处理添加弹出层的确认事件
    const handleAddOk = () => {
      //判断是否为空
      if (curCourseValue.value === '') {
        message.error('请输入课程名')
        return false
      } else if (selTeacherChange.value === ''){
        message.error('请选择授课老师')
        return false
      } else {
        //判断是否已经存在该课程
        for (let i in data.value) {
          if (data.value[i].courseName === curCourseValue.value.trim()) {
            message.error('该课程已存在')
            return false
          }
        }
        //模拟添加
        const newCourse = {
          key: Date.now().toString(),
          id: Date.now(),
          courseName: curCourseValue.value,
          teachersName: selTeacherChange.value,
        }
        // //向源数据追加
        data.value.push(newCourse)
        message.success('添加成功')
        visibleTwo.value = false;
      }

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
      curCourseValue,
      handleAdd,
      handleAddOk,
      visibleTwo,
      handleTeacherChange,
      curTeacherName,
      teachers
    };
  },
});
</script>

<style>
.ant-modal-mask {
  background-color: rgba(0, 0, 0, 0.3);
}
</style>