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
      <a-button type="primary" :style="{margin:'0 10px 0 0'}" @click="handleModify(record.evenStudyCheckId)">编辑</a-button>
    </template>
  </a-table>
  <a-modal v-model:visible="showSetItem" title="修改晚修检查项" @ok="handleModifyOk()"
           okText="确认" cancelText="取消" width="500px">
    <label>教室：</label>
    <a-input-number placeholder="请输入教室名" style="width:100%;margin-bottom: 10px" v-model:value="clazzNum"></a-input-number>
    <label>应到人数：</label>
    <a-input-number placeholder="请输入应到人数" style="width:100%;margin-bottom: 10px"
                    v-model:value="sArriveNumOfPeople"></a-input-number>
    <label>外宿人数：</label>
    <a-input-number placeholder="请输入外宿人数" style="width:100%;margin-bottom: 10px"
                    v-model:value="numOfPeopleStayOut"></a-input-number>
    <label>请假人数：</label>
    <a-input-number placeholder="请输入请假人数" style="width:100%;margin-bottom: 10px" v-model:value="leave"></a-input-number>
    <label>缺席人数：</label>
    <a-input-number placeholder="请输入缺席人数" style="width:100%;margin-bottom: 10px"
                    v-model:value="absent"></a-input-number>
    <label>学生干部人数：</label>
    <a-input-number placeholder="请输入学生干部人数" style="width:100%;margin-bottom: 10px"
                    v-model:value="studentCadres"></a-input-number>
    <label>社团人数：</label>
    <a-input-number placeholder="请输入学生干部人数" style="width:100%;margin-bottom: 10px"
                    v-model:value="numOfAssociation"></a-input-number>
    <label>实到人数：</label>
    <a-input-number placeholder="请输入实到人数" style="width:100%;margin-bottom: 10px"
                    v-model:value="actualNumber"></a-input-number>
    <label>班干确认:</label><br/>
    <a-checkbox v-model:checked="isChecked" :disabled="isChecked?true:false">确认</a-checkbox>
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
  teacher:string;
  evenStudyCheckId: number;
  clazzName: string;
  clazz: number;
  sArriveNumOfPeople: any;
  numOfPeopleStayOut: any;
  leave: any;
  absent: any;
  studentCadres: any;
  numOfAssociation: any;
  actualNumber: any;
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
        title: '操作',
        dataIndex: 'operation',
        slots: {customRender: 'operation'},
      },
    ];
    //模拟数据，使用TableDataType接口验证数据
    const data:Ref<TableDataType[]>= ref([
      {
        key: '1',
        id: 1,
        date: '2021-07-05',
        teacher:'刘杨',
        evenStudyCheckId: 1,
        clazzName: '183计网502',
        clazz: 1301,
        sArriveNumOfPeople: 54,
        numOfPeopleStayOut: null,
        leave: null,
        absent: null,
        studentCadres: null,
        numOfAssociation: 8,
        actualNumber: 46,
      }
    ])
    const showSetItem = ref(false)
    const _id = ref()
    const clazzNum = ref() //教室
    const sArriveNumOfPeople = ref('') //应到人数
    const numOfPeopleStayOut = ref('')
    const leave = ref('')
    const absent = ref('')
    const studentCadres = ref('')
    const numOfAssociation = ref('')
    const actualNumber = ref('')
    const numOfPeopleNotArrived = ref('')
    const isChecked = ref(false)
    const isConfirm = ref(false)
    const handleModify = (id:number) =>{
      _id.value = id
      for (let i in data.value) {
        if (data.value[i].evenStudyCheckId === _id.value) {
          clazzNum.value = data.value[i].clazz
          sArriveNumOfPeople.value = data.value[i].sArriveNumOfPeople
          numOfPeopleStayOut.value = data.value[i].numOfPeopleStayOut
          leave.value = data.value[i].leave
          absent.value = data.value[i].absent
          studentCadres.value = data.value[i].studentCadres
          numOfAssociation.value = data.value[i].numOfAssociation
          actualNumber.value = data.value[i].actualNumber
        }
      }
      showSetItem.value = true

    }
    const handleModifyOk = () =>{
      for (let i in data.value) {
        if (data.value[i].evenStudyCheckId === _id.value) {
          data.value[i].clazz = clazzNum.value
          data.value[i].sArriveNumOfPeople = sArriveNumOfPeople.value
          data.value[i].numOfPeopleStayOut = numOfPeopleStayOut.value
          data.value[i].leave = leave.value
          data.value[i].absent = absent.value
          data.value[i].studentCadres = studentCadres.value
          data.value[i].numOfAssociation = numOfAssociation.value
          data.value[i].actualNumber = actualNumber.value
        }
      }
      showSetItem.value = false
    }
    return {
      searchInput,
      pagination,
      data,
      columns,
      showSetItem,
      handleModify,
      handleModifyOk,

      clazzNum,
      sArriveNumOfPeople,
      numOfPeopleStayOut,
      leave,
      absent,
      studentCadres,
      numOfAssociation,
      actualNumber,
      isChecked,
      isConfirm,
    }
  }
})
</script>

<style scoped>

</style>