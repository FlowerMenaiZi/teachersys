<template>
  <a-table :columns="columns" :data-source="data" :pagination="pagination"
           :locale="{emptyText: '暂无数据'}">
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
      <a-button type="primary" :style="{margin:'0 10px 0 0'}" @click="handleCheck(record.key)">录入</a-button>
      <a-popconfirm
          title="是否确认检查？"
          ok-text="是"
          cancel-text="否"
          @confirm="sureCheck(record.key)">
        <a-button type="primary" :style="{margin:'0 10px 0 0'}">确认</a-button>
      </a-popconfirm>
      <a-popconfirm
          title="是否要删除？"
          ok-text="是"
          cancel-text="否"
          @confirm="confirmDel(record.key)">
        <a-button type="danger">删除</a-button>
      </a-popconfirm>
    </template>
  </a-table>
  <a-button type="primary" :style="{margin:'30px 0 0 0'}" @click="handleExport">导出某日数据
    <a-modal v-model:visible="visibleExport" title="导出" @ok="handleExportOk" okText="确认" cancelText="取消">
      <label>日期:</label>
      <a-date-picker style="width: 100%;margin-bottom: 10px" placeholder="请选择日期" :format="format" @change="onExportDateChange" :showToday="false"/>
    </a-modal>
  </a-button>
</template>

<script lang="ts">
import {defineComponent, ref, reactive, UnwrapRef, Ref} from 'vue';
import {message} from 'ant-design-vue';
import {SearchOutlined, CheckOutlined, EditOutlined} from '@ant-design/icons-vue';
import {Moment} from 'moment';
import moment from 'moment'
import 'moment/locale/zh-cn'

moment.locale('zh-cn')

interface TableDataType {
  key: string;
  id: number;
  date: string;
  teacher:string;
  checkConfirmTime: string;
}

  export default defineComponent({
    name: "evenStudyCheck",
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
      const columns = [
        {
          title: '日期',
          dataIndex: 'date',
          sorter: (a: TableDataType, b: TableDataType) => Date.parse(a.date) - Date.parse(b.date),
        },
        {
          title: '值班老师',
          dataIndex: 'teacher',
          slots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender',
          },
          onFilter: (value: string, record: TableDataType) =>
              record.teacher.toString().toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible: any) => {
            if (visible) {
              setTimeout(() => {
                searchInput.value.focus();
              }, 0);
            }
          },
        },
        {
          title: '检查确认时间',
          dataIndex: 'checkConfirmTime',
          slots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender',
          },
          onFilter: (value: string, record: TableDataType) =>
              record.checkConfirmTime.toString().toLowerCase().includes(value.toLowerCase()),
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
      //模拟数据，使用TableDataType接口验证数据
      const data: Ref<TableDataType[]> = ref([
        // {
        //   key: '1',
        //   id: 1,
        //   date: '2021-06-26',
        //   checkConfirmTime: '',
        // }
      ]);
      //处理点击导出事件
      const visibleExport = ref(false)
      const handleExport = () => {
        visibleExport.value = true;
      }
      const exportDate = ref('')
      const onExportDateChange = (value: Moment[], dateString: string) =>{
        exportDate.value = dateString
      }
      //处理添加弹出层的确认事件
      const handleExportOk = () => {
        //判断是否为空
        if (exportDate.value === ''){
          message.error('请选择导出的日期')
          return false
        }
        message.success('导出成功')
        visibleExport.value = false;
      }
      return {
        searchInput,
        pagination,
        data,
        columns,


        handleExport,
        onExportDateChange,
        handleExportOk,
        visibleExport
      }
    }
  })
</script>

<style scoped>

</style>