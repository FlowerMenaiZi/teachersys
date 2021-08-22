<template>
  <a-table :columns="columns" :data-source="sData" :pagination="pagination"
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
      <a-button type="primary" :style="{margin:'0 10px 0 0'}" @click="handleModify(record.id)">编辑
      </a-button>
    </template>
  </a-table>
  <a-modal v-model:visible="showSetItem" title="修改晚修检查项" @ok="handleModifyOk()"
           okText="确认" cancelText="取消" width="500px">
    <label>教室：</label>
    <a-input-number placeholder="请输入教室名" style="width:100%;margin-bottom: 10px"
                    v-model:value="clazzNum"></a-input-number>
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
  import {defineComponent, ref, reactive, UnwrapRef, Ref, onMounted, getCurrentInstance} from 'vue';
  import {message} from 'ant-design-vue';
  import $store from "../../store/index"
  import {SearchOutlined, CheckOutlined, EditOutlined} from '@ant-design/icons-vue';


  interface TableDataType {
    key: string;
    id: number;
    date: string;
    teacher: string;
    teacher_id: number;
    even_study_check_id: number;
    clazz_id: number;
    room: number;
    should_arrive_number: any;
    goout_number: any;
    leave_number: any;
    absent_number: any;
    student_cadres_number: any;
    associations_number: any;
    arrive_number: any;
    clazz_check_at: any;
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
      const sData: Ref<TableDataType[]> = ref([])
      const {proxy}: any = getCurrentInstance()

      onMounted(() => {
        proxy.$api.get(
            '/clazzEvenCheck',
            {},
            {'id': $store.state.userInfo.id},
            (success) => {
              for (let i in success.data.data) {
                let id = success.data.data[i].id
                success.data.data[i].key = id.toString()
                sData.value.push(success.data.data[i])
              }
            },
            (error) => {
            }
        )
      })
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
      const handleModify = (id: number) => {
        _id.value = id
        for (let i in sData.value) {
          if (sData.value[i].id === _id.value) {
            clazzNum.value = sData.value[i].room
            sArriveNumOfPeople.value = sData.value[i].should_arrive_number
            numOfPeopleStayOut.value = sData.value[i].goout_number
            leave.value = sData.value[i].leave_number
            absent.value = sData.value[i].absent_number
            studentCadres.value = sData.value[i].student_cadres_number
            numOfAssociation.value = sData.value[i].associations_number
            actualNumber.value = sData.value[i].arrive_number
            isChecked.value = sData.value[i].clazz_check_at ? true : false
          }
        }
        showSetItem.value = true

      }
      const handleModifyOk = () => {
        function getNowFormatDate() {
          var date = new Date();
          var seperator1 = "-";
          var year = date.getFullYear();
          var month:any = date.getMonth() + 1;
          var strDate:any = date.getDate();
          let hh = new Date().getHours()
          let mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()
          let ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds()
          if (month >= 1 && month <= 9) {
            month = "0" + month;
          }
          if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
          }
          var currentdate = year + seperator1 + month + seperator1 + strDate + ' ' + hh + ':' + mf + ':' + ss;
          return currentdate;
        }
        let checkDay = null
        if (isChecked.value){
          for (let i in sData.value){
            if (sData.value[i].id === _id.value){
              checkDay = sData.value[i].clazz_check_at?sData.value[i].clazz_check_at:getNowFormatDate()
            }
          }
        }
        proxy.$api.get(
            '/updClazzEvenCheck',
            {},
            {
              'id': parseInt(_id.value),
              'room': clazzNum.value,
              'should_arrive_number': sArriveNumOfPeople.value,
              'goout_number': numOfPeopleStayOut.value,
              'leave_number': leave.value,
              'absent_number': absent.value,
              'student_cadres_number': studentCadres.value,
              'associations_number': numOfAssociation.value,
              'arrive_number': actualNumber.value,
              'clazz_check_at':checkDay
            },
            (success)=>{
              for (let i in sData.value) {
                if (sData.value[i].id === _id.value) {
                  sData.value[i].room = clazzNum.value
                  sData.value[i].should_arrive_number = sArriveNumOfPeople.value
                  sData.value[i].goout_number = numOfPeopleStayOut.value
                  sData.value[i].leave_number = leave.value
                  sData.value[i].absent_number = absent.value
                  sData.value[i].student_cadres_number = studentCadres.value
                  sData.value[i].associations_number = numOfAssociation.value
                  sData.value[i].arrive_number = actualNumber.value
                  sData.value[i].clazz_check_at = checkDay
                }
              }
              showSetItem.value = false
            },
            (error)=>{

            }
        )
      }
      return {
        searchInput,
        pagination,
        sData,
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