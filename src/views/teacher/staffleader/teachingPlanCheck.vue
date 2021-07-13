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
      <a-button type="primary" :style="{margin:'0 10px 0 0'}" @click="handleSee(record.id)">查看
      </a-button>
      <a-button type="primary" :style="{margin:'0 10px 0 0'}" @click="handleExport(record.id)">导出
      </a-button>
      <a-button type="primary" :style="{margin:'0 10px 0 0'}" @click="handleConfirmTime(record.id)">确认
      </a-button>
      <a-popconfirm
              title="是否要删除？"
              ok-text="是"
              cancel-text="否"
              @confirm="handleConfirmDel(record.tpcId)"
      >
        <a-button type="danger">删除</a-button>
      </a-popconfirm>
    </template>
  </a-table>
  <a-modal v-model:visible="showModify" title="查看授课计划执行情况项" @ok="handleSeeOk()" okText="确认" cancelText="取消"
           width="90%">
    <a-table :columns="columns2" :data-source="itemData" :scroll="{ x: 1200, y: 300 }"
             :pagination="pagination" :rowKey="itemData.key">
      <template #operation="{ record }">
        <a-button type="primary" :style="{margin:'0 10px 10px 0'}" @click="handleModify(record.tpcItemId)">
          修改
        </a-button>
        <a-popconfirm
                title="是否要删除？"
                ok-text="是"
                cancel-text="否"
                @confirm="itemConfirmDel(record.tpcItemId)"
        >
          <a-button type="danger">删除</a-button>
        </a-popconfirm>
      </template>
    </a-table>
  </a-modal>
  <a-modal v-model:visible="showModifyItem" title="修改授课计划执行情况项" @ok="handleModifyOk()" okText="确认" cancelText="取消"
           width="40%">
    <label>计划进度:</label>
    <a-input placeholder="请输入计划进度" style="margin-bottom: 10px;"
             v-model:value="schedule"></a-input>
    <label>实际进度:</label>
    <a-input placeholder="请输入实际进度" style="margin-bottom: 10px;"
             v-model:value="actualProgress"></a-input>
    <label>比较情况:</label>
    <a-input placeholder="请输入比较情况" style="margin-bottom: 10px;"
             v-model:value="comparison"></a-input>
    <label>原因分析:</label>
    <a-input placeholder="请输入原因分析" style="margin-bottom: 10px;"
             v-model:value="causeAnalysis"></a-input>
  </a-modal>
  <a-popconfirm
      title="是否要新增？"
      ok-text="确定"
      cancel-text="取消"
      @confirm="handleConfirmInsert()"
  >
    <a-button type="primary">新增</a-button>
  </a-popconfirm>
</template>

<script lang="ts">
  import {defineComponent, reactive, ref, Ref} from 'vue';
  import {message} from 'ant-design-vue';
  import {CheckOutlined, EditOutlined, SearchOutlined} from '@ant-design/icons-vue';
  //设置接收数据的接口
  interface TableDataType {
    key: string;
    date: string;
    term: string;
    examiner: string;
  }
  export default defineComponent({
    name: "teachingPlanCheck",
    components: {
      SearchOutlined,
      CheckOutlined,
      EditOutlined,
    },
    setup() {
      //搜索框
      const searchInput = ref();
      //搜索框状态
      const state = reactive({
        searchText: '',
        searchedColumn: '',
      });
      //分页数
      const pagination = {
        pageSize: 5
      };
      /*第一个弹出层*/
      const data = ref([
        {
          key: '1',
          tpcId:1,
          date: '2021-7-12',
          term: '2020-2021学年度 第2学期',
          examiner: ''
        }
      ])
      const columns = [
        {
          title: '日期',
          dataIndex: 'date',
          defaultSortOrder: 'false',
          sorter: (a: TableDataType, b: TableDataType) => Date.parse(a.date) - Date.parse(b.date),
        },
        {
          title: '学期',
          dataIndex: 'term',
          slots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender',
          },
          onFilter: (value: string, record: TableDataType) =>
              record.term.toString().toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible: any) => {
            if (visible) {
              setTimeout(() => {
                searchInput.value.focus();
              }, 0);
            }
          },
        },
        {
          title: '检查人',
          dataIndex: 'examiner',
          slots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender',
          },
          onFilter: (value: string, record: TableDataType) =>
              record.examiner.toString().toLowerCase().includes(value.toLowerCase()),
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
      //弹出按钮
      const handleExport = (id:number) =>{

      }
      //确认按钮
      const handleConfirmTime = (id:number) =>{

      }
      //删除按钮
      const handleConfirmDel = (id:number) => {

      }

      /*第二个弹出层*/
      const columns2 = [
        {title: '教师姓名', width: 100, dataIndex: 'teacherName', key: 'teacherName', fixed: 'left', align: 'center'},
        {title: '课程', dataIndex: 'courseName', key: 'courseName', width: 100, fixed: 'left',align: 'center'},
        {title: '班级', dataIndex: 'clazz', key: 'clazz', width: 200, fixed: 'left', align: 'center'},
        {title: '计划进度', dataIndex: 'schedule', key: 'schedule', width: 180, align: 'center'},
        {title: '实际进度', dataIndex: 'actualProgress', key: 'actualProgress', width: 180, align: 'center'},
        {title: '比较情况', dataIndex: 'comparison', key: 'comparison', width: 180, align: 'center'},
        {title: '原因分析', dataIndex: 'causeAnalysis', key: 'causeAnalysis', width: 180, align: 'center'},
        {
          title: '操作',
          dataIndex: 'operation',
          key: 'operation',
          fixed: 'right',
          width: 180,
          slots: {customRender: 'operation'},
        },
      ]
      const itemData = ref([
        {
          key: '1',
          tpcItemId:1,
          teacherName: '郑镇耿',
          courseName: 'LINUX服务器管理(下)',
          clazz: '193计网502',
          schedule: '',
          actualProgress: '',
          comparison: '',
          causeAnalysis: '',
        },
      ])
      const showModify = ref(false)
      const handleSee = (id:number) =>{
        showModify.value = true
      }
      const handleSeeOk = () =>{
        showModify.value = false
      }
      const _id = ref()

      const itemConfirmDel = (id:number) =>{

      }

      /*第三个弹出层*/
      const showModifyItem = ref(false)
      const schedule = ref('')
      const actualProgress = ref('')
      const comparison = ref('')
      const causeAnalysis = ref('')
      const handleModify = (id:number) =>{
        _id.value = id
        for (let i = 0; i < itemData.value.length; i++) {
          if (itemData.value[i].tpcItemId === _id.value) {
            schedule.value = itemData.value[i].schedule
            actualProgress.value = itemData.value[i].actualProgress
            comparison.value = itemData.value[i].comparison
            causeAnalysis.value = itemData.value[i].causeAnalysis
          }
        }
        showModifyItem.value = true
      }
      const handleModifyOk = () =>{
        for (let i = 0; i < itemData.value.length; i++) {
          if (itemData.value[i].tpcItemId === _id.value) {
            itemData.value[i].schedule = schedule.value
            itemData.value[i].actualProgress = actualProgress.value
            itemData.value[i].comparison = comparison.value
            itemData.value[i].causeAnalysis = causeAnalysis.value
          }
        }
        showModifyItem.value = false
      }

      /*新增*/
      const handleConfirmInsert = () =>{
        //  进行新增操作
      }

      return {
        data,
        columns,
        pagination,
        searchInput,
        handleExport,
        handleConfirmTime,
        handleConfirmDel,

        columns2,
        showModify,
        itemData,
        handleSee,
        handleSeeOk,
        itemConfirmDel,

        showModifyItem,
        schedule,
        actualProgress,
        comparison,
        causeAnalysis,
        handleModify,
        handleModifyOk,

        handleConfirmInsert,

      }
    }
  })
</script>

<style scoped>

</style>