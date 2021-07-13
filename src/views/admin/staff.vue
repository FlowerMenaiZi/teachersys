<template>
  <a-table :columns="columns" :data-source="data" :pagination="pagination">
    <template #filterDropdown="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }">
      <div style="padding: 8px">
        <a-input
            ref="searchInput"
            :placeholder="teachingSectionTips"
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
          @confirm="confirm(record.key)"
      >
        <a-button type="danger">删除</a-button>
      </a-popconfirm>
    </template>
  </a-table>

  <a-modal v-model:visible="modifyVis" title="修改" @ok="handleOk()" okText="确认" cancelText="取消">
    <label>教研室名称</label>
    <a-input placeholder="请输入教研室名称" v-model:value="curValue" ref="modifyValue"></a-input>
  </a-modal>

  <a-button type="primary" :style="{margin:'0 10px 0 0'}" @click="handleAdd">添加
    <a-modal v-model:visible="visibleTwo" title="添加" @ok="handleAddOk" okText="确认" cancelText="取消">
      <label>教研室名称:</label>
      <a-input placeholder="请输入教研室名称" v-model:value="curValue"></a-input>
      <label>系:</label>
      <a-select style="width: 100%;margin-bottom: 4px" @change="handleModifySelect"
                v-model:value="curSelValue">
        <a-select-option v-for="(item,index) in departmentData" :key="item.id" :value="item.name">
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
  teachingSection: string;
  depId:string;
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
        id:1,
        teachingSection: '系办教研室',
        depId:'1',
      },
      {
        key: '2',
        id:2,
        teachingSection: '网络教研室',
        depId:'1',
      },
      {
        key: '3',
        id:3,
        teachingSection: '商务教研室',
        depId:'1',
      },
      {
        key: '4',
        id:4,
        teachingSection: '会计教研室',
        depId:'1',
      },
      {
        key: '5',
        id:5,
        teachingSection: '灯饰教研室',
        depId:'1',
      },
      {
        key: '6',
        id:6,
        teachingSection: '环艺教研室',
        depId:'1',
      },
      {
        key: '7',
        id:7,
        teachingSection: '专业基础教研室',
        depId:'1',
      },
      {
        key: '8',
        id:8,
        teachingSection: '美容教研室',
        depId:'1',
      },
      {
        key: '9',
        id:9,
        teachingSection: '行政部门教研室',
        depId:'1',
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
    //添加系输入框的placeholder
    const teachingSectionTips = ref("查询教研室名称")
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
        title: '教研室名称',
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
    //设置当前点击的值为空
    const curValue = ref()
    //设置当前点击的key值为空
    const _key = ref()
    const modifyVis = ref(false)
    //处理修改函数，传入key值
    const handleModify = (key: string) => {
      _key.value = key
      modifyVis.value = true
      //显示弹出层
      for (let i of data.value) {
        if (i.key === _key.value) {
          //设置弹出层input显示的值
          curValue.value = i.teachingSection
        }
      }
    }
    //处理弹出层点击ok
    const handleOk = () => {
      for (let i in data.value) {
        if (data.value[i].key === _key.value) {
          //修改源数据对应的值
          data.value[i].teachingSection = curValue.value
        }
      }
      modifyVis.value = false
      message.success('修改成功')
    };

    //获取选择的教研室
    const selDepartment = ref('')
    const handleModifySelect = (value: string) => {
      selDepartment.value = value
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
      curValue.value = ''
    }

    //处理添加弹出层的确认事件
    const handleAddOk = () => {
      //判断是否为空
      if (curValue.value === '') {
        message.error('请输入教研室名称')
      } else {
        //判断是否已经存在该教研室
        for (let i in data.value) {
          if (data.value[i].teachingSection === curValue.value.trim()) {
            message.error('该教研室已存在')
            return false
          }
        }
        if (selDepartment.value === ''){
          message.error('请选择系')
          return false
        }
        //模拟添加
        const newSection = {
          key: Date.now().toString(),
          id: Date.now(),
          teachingSection: curValue.value,
          depId:selDepartment.value
        }
        // //向源数据追加
        data.value.push(newSection)
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
      teachingSectionTips,
      handleModify,
      confirm,
      handleOk,
      curValue,
      handleAdd,
      handleAddOk,
      visibleTwo,
      departmentData,
      modifyVis,
      handleModifySelect
    };
  },
});
</script>

<style >
.ant-modal-mask {
  background-color: rgba(0, 0, 0, 0.3);
}
</style>