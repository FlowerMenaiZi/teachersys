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
  <a-modal v-model:visible="showSee" title="查看教案测评记录项" @ok="handleSeeOk()" okText="确认" cancelText="取消"
           width="80%">
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
  <a-modal v-model:visible="showModify" title="修改教案测评记录项" @ok="handleModifyOk()" okText="确认" cancelText="取消"
           width="30%">
    <label>教案上传（审批）情况（10%）:</label>
    <a-input-number placeholder="教案上传（审批）情况（10%）" style="width:100%;margin-bottom: 10px;"
                    v-model:value="uploadScore" :max="10" :min="0"></a-input-number>
    <label>教案格式规范性（10%）:</label>
    <a-input-number placeholder="请输入教案格式规范性（10%）" style="width:100%;margin-bottom: 10px;"
                    v-model:value="formatScore" :max="10" :min="0"></a-input-number>
    <label>教学内容完整性（40%）:</label>
    <a-input-number placeholder="请输入教学内容完整性（40%）" style="width:100%;margin-bottom: 10px;"
                    v-model:value="completeScore" :max="40" :min="0"></a-input-number>
    <label>教学设计科学性（40%）:</label>
    <a-input-number placeholder="请输入教学设计科学性（40%）" style="width:100%;margin-bottom: 10px;"
                    v-model:value="designScore" :max="40" :min="0"></a-input-number>
    <a-input-group compact>
      <label>合计:</label><br>
      <a-input-number placeholder="请输入合计" style="width:75%;margin-bottom: 10px;"
                      v-model:value="totalScore" :max="100" :min="0"></a-input-number>
      <a-button style="width:25%;margin-bottom: 10px" @click="calcTotalScore">
        计算总得分
      </a-button>
    </a-input-group>
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
  name: "teachingPlanEvaluation",
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
        tpcId: 1,
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
    const handleExport = (id: number) => {

    }
    //确认按钮
    const handleConfirmTime = (id: number) => {

    }
    //删除按钮
    const handleConfirmDel = (id: number) => {

    }

    /*第二个弹出层*/
    const columns2 = [
      {title: '教师姓名', width: 100, dataIndex: 'teacherName', key: 'teacherName', fixed: 'left', align: 'center'},
      {title: '课程', dataIndex: 'courseName', key: 'courseName', width: 100, fixed: 'left', align: 'center'},
      {title: '教案上传（审批）情况（10%）', dataIndex: 'uploadScore', key: 'uploadScore', width: 180, align: 'center'},
      {title: '教案格式规范性（10%）', dataIndex: 'formatScore', key: 'formatScore', width: 180, align: 'center'},
      {title: '教学内容完整性（40%）', dataIndex: 'completeScore', key: 'completeScore', width: 180, align: 'center'},
      {title: '教学设计科学性（40%）', dataIndex: 'designScore', key: 'designScore', width: 180, align: 'center'},
      {title: '合计', dataIndex: 'totalScore', key: 'totalScore', width: 180, align: 'center'},
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
        tpcItemId: 1,
        teacherName: '郑镇耿',
        courseName: 'LINUX服务器管理(下)',
        uploadScore: '',
        formatScore: '',
        completeScore: '',
        designScore: '',
        totalScore: '',
      },
    ])
    const showSee = ref(false)
    const handleSee = (id: number) => {
      showSee.value = true
    }
    const handleSeeOk = () => {
      showSee.value = false
    }
    const _id = ref()

    const itemConfirmDel = (id: number) => {

    }

    /*第三个弹出层*/
    //处理修改函数，传入key值
    const uploadScore = ref('')
    const formatScore = ref('')
    const completeScore = ref('')
    const designScore = ref('')
    const totalScore = ref('')
    const showModify = ref(false)
    const handleModify = (id: number) => {
      _id.value = id
      //显示弹出层
      for (let i = 0; i < itemData.value.length; i++) {
        if (itemData.value[i].tpcItemId === _id.value) {
          uploadScore.value = itemData.value[i].uploadScore
          formatScore.value = itemData.value[i].formatScore
          completeScore.value = itemData.value[i].completeScore
          designScore.value = itemData.value[i].designScore
          totalScore.value = itemData.value[i].totalScore
        }
      }
      showModify.value = true
    }
    const calcTotalScore = () => {
      totalScore.value = uploadScore.value + formatScore.value + completeScore.value + designScore.value
    }
    const handleModifyOk = () => {
      //在这进行数据修改上传数据库//////////////////////////////////////////////
      for (let i = 0; i < itemData.value.length; i++) {
        if (itemData.value[i].tpcItemId === _id.value) {
          itemData.value[i].uploadScore = uploadScore.value
          itemData.value[i].formatScore = formatScore.value
          itemData.value[i].completeScore = completeScore.value
          itemData.value[i].designScore = designScore.value
          itemData.value[i].totalScore = totalScore.value
        }
      }
      showModify.value = false
      message.success('修改成功')
    }

    /*新增*/
    const handleConfirmInsert = () =>{
      //  进行新增操作
    }
    return {
      searchInput,
      state,
      pagination,
      columns,
      data,
      handleExport,
      handleConfirmTime,
      handleConfirmDel,

      columns2,
      showSee,
      itemData,
      handleSee,
      handleSeeOk,
      itemConfirmDel,


      handleModify,
      handleModifyOk,
      calcTotalScore,
      uploadScore,
      formatScore,
      completeScore,
      designScore,
      totalScore,
      showModify,

      handleConfirmInsert,
    }
  }
})
</script>

<style scoped>

</style>