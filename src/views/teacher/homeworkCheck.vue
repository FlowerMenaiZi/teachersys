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
      <a-button type="primary" :style="{margin:'0 10px 0 0'}" @click="handleCheck(record.key)">查看</a-button>
    </template>
  </a-table>
  <a-modal v-model:visible="showAllItem" title="查看作业批改情况表" @ok="handleSeeOk()" okText="确认" cancelText="取消" width="70%">
    <a-table :columns="columns2" :data-source="itemData" :pagination="pagination">
      <template #operation="{ record }">
        <a-button type="primary" :style="{margin:'0 10px 10px 0'}" @click="handleModify(record.id)">
          修改
        </a-button>
      </template>
    </a-table>
  </a-modal>
  <a-modal v-model:visible="showSetItem" title="修改作业批改情况项" @ok="handleModifyOk()" okText="确认" cancelText="取消" width="500px">

    <label>周课时及实习周数:</label>
    <a-input-number placeholder="请输入周课时及实习周数" style="width:100%;margin-bottom: 10px" :min="0" v-model:value="weeklyClassHour"></a-input-number>
    <label>布置书面作业次数:</label>
    <a-input-number placeholder="请输入布置书面作业次数" style="width:100%;margin-bottom: 10px" :min="0" v-model:value="assignHomeworkNumber"></a-input-number>
    <label>批改书面作业次数:</label>
    <a-input-number placeholder="请输入批改书面作业次数" style="width:100%;margin-bottom: 10px" :min="0" v-model:value="correctingHomeworkNumber"></a-input-number>
    <label>实习（验）报告（个）:</label>
    <a-input-number placeholder="请输入实习（验）报告（个）" style="width:100%;margin-bottom: 10px" :min="0" v-model:value="internship"></a-input-number>
    <label>其他作业批改次数:</label>
    <a-input-number placeholder="请输入其他作业批改次数" style="width:100%;margin-bottom: 10px" :min="0" v-model:value="otherHomeworkNumber"></a-input-number>
    <label>评价：</label>
    <a-input placeholder="请输入评价" style="width:100%;margin-bottom: 10px" v-model:value="evaluate"></a-input>

  </a-modal>
</template>

<script lang="ts">
  import {defineComponent, ref, reactive, UnwrapRef, Ref} from 'vue';
  import {message} from 'ant-design-vue';
  import {SearchOutlined, CheckOutlined, EditOutlined} from '@ant-design/icons-vue';
  interface TableDataType {
    key: string;
    id: number;
    date: string;
    term: string;
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
      //分页数
      const pagination = {
        pageSize: 5
      };
      //搜索框状态
      const state = reactive({
        searchText: '',
        searchedColumn: '',
      });
      /*第一个弹出层*/
      //模拟数据，使用TableDataType接口验证数据
      const data: Ref<TableDataType[]> = ref([
        {
          key: '1',
          id: 1,
          date: '2021-06-26',
          term: '2020-2021学年度 第2学期',
        }
      ]);
      //设置表头及字段排序或字段搜索
      const columns = [
        {
          title: '日期',
          dataIndex: 'date',
          sorter: (a: TableDataType, b: TableDataType) => Date.parse(a.date) - Date.parse(b.date)
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
          title: '操作',
          dataIndex: 'operation',
          slots: {customRender: 'operation'},
        },
      ];
      const showAllItem = ref(false);
      const handleCheck = (key:string) =>{
        showAllItem.value = true
      }
      /*第二个弹出层*/
      const itemData = ref([
        {
          key:'1',
          id:1,
          tpc:20,
          course:'短视频制作',
          clazz:'',
          assignHomeworkNumber:'',  //布置书面作业次数
          correctingHomeworkNumber:'', //批改书面作业次数
          internship:'', //实习（验）报告（个）
          otherHomeworkNumber:'',  //其他作业批改次数
          weeklyClassHour:'',  //周课时及实习周数
          evaluate:'',  //评价
        },
        {
          key:'2',
          id:2,
          tpc:20,
          course:'商品摄影',
          clazz:'',
          assignHomeworkNumber:'',
          correctingHomeworkNumber:'',
          internship:'',
          otherHomeworkNumber:'',
          weeklyClassHour:'',
          evaluate:'',
        },
      ])
      const columns2 = [
        {title: '课程',  dataIndex: 'course', key: 'course',width: 150},
        {title: '班级', dataIndex: 'clazzName', key: 'clazzName', width: 100},
        {
          title: '操作',
          dataIndex: 'operation',
          key: 'operation',
          width: 150,
          slots: {customRender: 'operation'},
        },
      ];
      const handleSeeOk = () =>{
        showAllItem.value = false
      }

      /*第三个弹出层*/
      const showSetItem = ref(false)
      const _id = ref()
      const assignHomeworkNumber = ref('')        //布置书面作业次数
      const correctingHomeworkNumber = ref('')    //批改书面作业次数
      const internship = ref('')                  //实习（验）报告（个）
      const otherHomeworkNumber = ref('')         //其他作业批改次数
      const weeklyClassHour = ref('')             //周课时及实习周数
      const evaluate = ref('')                    //评价
      const handleModify = (key:number) =>{
        _id.value = key
        for (let i in itemData.value) {
          if (itemData.value[i].id === _id.value) {
            assignHomeworkNumber.value = itemData.value[i].assignHomeworkNumber
            correctingHomeworkNumber.value = itemData.value[i].correctingHomeworkNumber
            internship.value = itemData.value[i].internship
            otherHomeworkNumber.value = itemData.value[i].otherHomeworkNumber
            weeklyClassHour.value = itemData.value[i].weeklyClassHour
            evaluate.value = itemData.value[i].evaluate
          }
        }
        showSetItem.value = true
      }
      const handleModifyOk = () =>{
        for (let i in itemData.value) {
          if (itemData.value[i].id === _id.value) {
            itemData.value[i].assignHomeworkNumber = assignHomeworkNumber.value
            itemData.value[i].correctingHomeworkNumber = correctingHomeworkNumber.value
            itemData.value[i].internship = internship.value
            itemData.value[i].otherHomeworkNumber = otherHomeworkNumber.value
            itemData.value[i].weeklyClassHour = weeklyClassHour.value
            itemData.value[i].evaluate = evaluate.value
          }
        }
        showSetItem.value = false
      }
      return {
        data,
        columns,
        pagination,
        handleCheck,
        showAllItem,

        handleSeeOk,
        itemData,
        columns2,
        handleModify,
        showSetItem,
        handleModifyOk,
        assignHomeworkNumber,
        correctingHomeworkNumber,
        internship,
        otherHomeworkNumber,
        weeklyClassHour,
        evaluate,
      }
    }
  })
</script>

<style scoped>

</style>