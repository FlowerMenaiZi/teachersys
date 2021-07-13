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
  <a-modal v-model:visible="showSee" title="查看作业批改情况表" @ok="handleSeeOk()" okText="确认" cancelText="取消" width="70%">
    <a-table :columns="columns2" :data-source="itemData" :scroll="{ x: 1200, y: 300 }" :pagination="pagination">
      <template #operation="{ record }">
        <a-button type="primary" :style="{margin:'0 10px 10px 0'}" @click="handleModify(record.id)">
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
  <a-modal v-model:visible="showModify" title="修改学期作业检查项" @ok="handleModifyOk()" okText="确认" cancelText="取消"
           width="40%">
    <label>周课时及实习周数:</label>
    <a-input-number placeholder="请输入周课时及实习周数" style="width:100%;margin-bottom: 10px;"
                    v-model:value="weeklyClazzHour"></a-input-number>
    <label>布置书面作业次数:</label>
    <a-input-number placeholder="请输入布置书面作业次数" style="width:100%;margin-bottom: 10px;"
                    v-model:value="assignHomeworkNum"></a-input-number>
    <label>批改书面作业次数:</label>
    <a-input-number placeholder="请输入批改书面作业次数" style="width:100%;margin-bottom: 10px;"
                    v-model:value="corHomeworkNum"></a-input-number>
    <label>实习（验）报告（个）:</label>
    <a-input-number placeholder="请输入实习（验）报告（个）" style="width:100%;margin-bottom: 10px;"
                    v-model:value="internship"></a-input-number>
    <label>其他作业批改次数:</label>
    <a-input-number placeholder="请输入其他作业批改次数" style="width:100%;margin-bottom: 10px;"
                    v-model:value="orderHomeworkNum"></a-input-number>
    <label>评价:</label>
    <a-input placeholder="请输入评价" style="margin-bottom: 10px;" v-model:value="evaluateVal"></a-input>
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
    name: "homeworkCheck",
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
        {title: '授课班级', dataIndex: 'clazz', key: 'clazz', width: 150, fixed: 'left', align: 'center'},
        {title: '课程名称', dataIndex: 'courseName', key: 'courseName', width: 100, fixed: 'left', align: 'center'},
        {title: '周课时及实习周数', dataIndex: 'weeklyClazzHour', key: 'weeklyClazzHour', width: 150, align: 'center'},
        {title: '布置书面作业次数', dataIndex: 'assignHomeworkNum', key: 'assignHomeworkNum', width: 150, align: 'center'},
        {title: '批改书面作业次数', dataIndex: 'corHomeworkNum', key: 'corHomeworkNum', width: 150, align: 'center'},
        {title: '实习（验）报告（个）', dataIndex: 'internship', key: 'internship', width: 160, align: 'center'},
        {title: '其他作业批改次数', dataIndex: 'orderHomeworkNum', key: 'orderHomeworkNum', width: 150, align: 'center'},
        {title: '评价', dataIndex: 'evaluate', key: 'evaluate', width: 100, align: 'center'},
        {
          title: '操作',
          dataIndex: 'operation',
          key: 'operation',
          fixed: 'right',
          width: 180,
          slots: {customRender: 'operation'},
        },
      ];
      const itemData = ref([
        {
          key: '1',
          id:1,
          teacherName: '罗颖秋',
          clazz: '',
          courseName: '成高数学',
          weeklyClazzHour: '',
          assignHomeworkNum: '',
          corHomeworkNum: '',
          internship: '',
          orderHomeworkNum: '',
          evaluate: ''
        },
      ])
      const showSee = ref(false)
      const handleSee = (id: number) => {
        showSee.value = true
      }
      const handleSeeOk = () => {
        showSee.value = false
      }

      const itemConfirmDel = (id: number) => {

      }
      /*第三个弹出层*/
      const weeklyClazzHour = ref('')
      const assignHomeworkNum = ref('')
      const corHomeworkNum = ref('')
      const internship = ref('')
      const orderHomeworkNum = ref('')
      const evaluateVal = ref('')
      const showModify = ref(false)
      const _id = ref()
      const handleModify = (id: number) => {
        showModify.value = true
        _id.value = id
        //显示弹出层
        for (let i = 0; i < itemData.value.length; i++) {
          if (itemData.value[i].id === _id.value) {
            weeklyClazzHour.value = itemData.value[i].weeklyClazzHour
            assignHomeworkNum.value = itemData.value[i].assignHomeworkNum
            corHomeworkNum.value = itemData.value[i].corHomeworkNum
            internship.value = itemData.value[i].internship
            orderHomeworkNum.value = itemData.value[i].orderHomeworkNum
            evaluateVal.value = itemData.value[i].evaluate
          }
        }
      }
      const handleModifyOk = () => {
        //在这进行数据修改上传数据库//////////////////////////////////////////////
        for (let i = 0; i < itemData.value.length; i++) {
          if (itemData.value[i].id === _id.value) {
            itemData.value[i].weeklyClazzHour = weeklyClazzHour.value
            itemData.value[i].assignHomeworkNum = assignHomeworkNum.value
            itemData.value[i].corHomeworkNum = corHomeworkNum.value
            itemData.value[i].internship = internship.value
            itemData.value[i].orderHomeworkNum = orderHomeworkNum.value
            itemData.value[i].evaluate = evaluateVal.value
          }
        }
        showModify.value = false
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

        showModify,
        weeklyClazzHour,
        assignHomeworkNum,
        corHomeworkNum,
        internship,
        orderHomeworkNum,
        evaluateVal,
        handleModify,
        handleModifyOk,

        handleConfirmInsert,
      }
    }
  })
</script>

<style scoped>

</style>