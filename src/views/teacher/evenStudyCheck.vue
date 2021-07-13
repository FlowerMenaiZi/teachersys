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
  <a-modal v-model:visible="showAllItem" title="查看晚修检查项" @ok="handleSeeOk()" okText="确认" cancelText="取消" width="80%">
    <a-table :columns="columns2" :data-source="itemData" :scroll="{ x: 1200, y: 300 }"
             :pagination="pagination">
      <template #operation="{ record }">
        <a-button type="primary" :style="{margin:'0 10px 10px 0'}" @click="handleModify(record.evenStudyCheckId)">
          修改
        </a-button>
        <a-popconfirm
                title="是否要删除？"
                ok-text="是"
                cancel-text="否"
                @confirm="itemConfirmDel(record.evenStudyCheckId)">
          <a-button type="danger">删除</a-button>
        </a-popconfirm>
      </template>
    </a-table>
  </a-modal>
  <a-modal v-model:visible="showSetItem" title="修改晚修检查项" @ok="handleModifyOk()"
           okText="确认" cancelText="取消" width="500px">
    <label>教室：</label>
    <a-input-number placeholder="请输入教室名" style="width:100%;margin-bottom: 10px" v-model:value="clazz"></a-input-number>
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
    <label>未到人数：</label>
    <a-input-number placeholder="请输入未到人数" style="width:100%;margin-bottom: 10px"
                    v-model:value="numOfPeopleNotArrived"></a-input-number>
    <label>人数得分 (满分20)：</label>
    <a-input-number placeholder="请输入人数得分" style="width:100%;margin-bottom: 10px" :max="20"
                    :min="0" v-model:value="numberScore"></a-input-number>
    <label>课堂纪律得分 (满分30)：</label>
    <a-input-number placeholder="请输入课堂纪律得分" style="width:100%;margin-bottom: 10px" :max="30"
                    :min="0" v-model:value="clazzDisScore"></a-input-number>
    <label>学习气氛得分 (满分40)：</label>
    <a-input-number placeholder="请输入学习气氛得分" style="width:100%;margin-bottom: 10px" :max="40"
                    :min="0" v-model:value="learnAtmScore"></a-input-number>
    <label>教室卫生得分 (满分10)：</label>
    <a-input-number placeholder="请输入教室卫生得分" style="width:100%;margin-bottom: 10px" :max="10"
                    :min="0" v-model:value="clazzHygieneScore"></a-input-number>
    <a-input-group compact>
      <label>总得分 (满分100)：</label>
      <a-input-number placeholder="请输入总得分" style="width:75%;margin-bottom: 10px" :max="100"
                      :min="0" v-model:value="totalScore">
      </a-input-number>
      <a-button style="width:25%;margin-bottom: 10px" @click="calcTotalScore">计算总得分</a-button>
    </a-input-group>
    <label>评价：</label>
    <a-input placeholder="请输入评价" style="width:100%;margin-bottom: 10px" v-model:value="evaluate"></a-input>
    <label>值班老师确认:</label><br/>
    <a-checkbox v-model:checked="isChecked" :disabled="isConfirm">确认</a-checkbox>
  </a-modal>
  <a-button type="primary" :style="{margin:'0 10px 0 0'}" @click="handleAdd">新增
    <a-modal v-model:visible="visibleTwo" title="新增晚修检查表" @ok="handleAddOk" okText="确认" cancelText="取消">
      <label>日期:</label>
      <a-date-picker style="width: 100%;margin-bottom: 10px" placeholder="请选择日期" :format="format" @change="onDateChange"
                     :showToday="false"/>
      <label>第几周:</label>
      <a-input-number placeholder="第几周" style="width: 100%;margin-bottom: 10px" :max="20"
                      v-model:value="weekly"></a-input-number>
      <label>星期几:</label>
      <a-input type="text" placeholder="星期几" style="margin-bottom: 10px" v-model:value="whichToday"></a-input>
      <label>值班老师:</label>
      <a-select
              show-search
              style="width: 100%;margin-bottom: 10px"
              v-model:value="curTeacherName"
      >
        <a-select-option v-for="(item,index) in teachers" :value="item.name" :key="item.key">
          {{ item.name }}
        </a-select-option>
      </a-select>
      <label>班级:</label>
      <a-select
              mode="multiple"
              v-model:value="curClazz"
              style="width: 100%"
              placeholder="请选择班级"
              @change="handleClazzChange"
      >
        <a-select-option v-for="i in allClazz" :key="i.key">
          {{i.clazz}} - {{i.clazzRoom}}
        </a-select-option>
      </a-select>
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
      //模拟数据，使用TableDataType接口验证数据
      const data: Ref<TableDataType[]> = ref([
        {
          key: '1',
          id: 1,
          date: '2021-06-26',
          checkConfirmTime: '',
        }
      ]);
      const showAllItem = ref(false)
      const itemData: any = ref([])
      //搜索框状态
      const state = reactive({
        searchText: '',
        searchedColumn: '',
      });
      //设置表头及字段排序或字段搜索
      const columns = [
        {
          title: '日期',
          dataIndex: 'date',
          slots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender',
          },
          sorter: (a: TableDataType, b: TableDataType) => Date.parse(a.date) - Date.parse(b.date),
          onFilter: (value: string, record: TableDataType) =>
              record.date.toString().toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible: any) => {
            if (visible) {
              setTimeout(() => {
                searchInput.value.focus();
              }, 0);
            }
          },
        },
        {
          title: '确认时间',
          dataIndex: 'checkConfirmTime',
          slots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender',
          },
          sorter: (a: TableDataType, b: TableDataType) => Date.parse(a.date) - Date.parse(b.date),
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
      const columns2 = [
        {title: '班级名', width: 150, dataIndex: 'clazzName', key: 'clazzName', fixed: 'left', align: 'center'},
        {title: '教室', dataIndex: 'clazz', key: 'clazz', width: 100, align: 'center'},
        {title: '应到人数', dataIndex: 'sArriveNumOfPeople', key: 'sArriveNumOfPeople', width: 100, align: 'center'},
        {title: '外宿人数', dataIndex: 'numOfPeopleStayOut', key: 'numOfPeopleStayOut', width: 100, align: 'center'},
        {title: '请假', dataIndex: 'leave', key: 'leave', width: 100, align: 'center'},
        {title: '缺席', dataIndex: 'absent', key: 'absent', width: 100, align: 'center'},
        {title: '学生干部', dataIndex: 'studentCadres', key: 'studentCadres', width: 100, align: 'center'},
        {title: '社团人数', dataIndex: 'numOfAssociation', key: 'numOfAssociation', width: 100, align: 'center'},
        {title: '实到人数', dataIndex: 'actualNumber', key: 'actualNumber', width: 100, align: 'center'},
        {title: '未到人数', dataIndex: 'numOfPeopleNotArrived', key: 'numOfPeopleNotArrived', width: 100, align: 'center'},
        {title: '人数得分', dataIndex: 'numberScore', key: 'studentCadres', width: 100, align: 'center'},
        {title: '课堂纪律得分', dataIndex: 'clazzDisScore', key: 'clazzDisScore', width: 120, align: 'center'},
        {title: '学习氛围得分', dataIndex: 'learnAtmScore', key: 'learnAtmScore', width: 120, align: 'center'},
        {title: '教室卫生得分', dataIndex: 'clazzHygieneScore', key: 'clazzHygieneScore', width: 120, align: 'center'},
        {title: '总得分', dataIndex: 'totalScore', key: 'totalScore', width: 100, align: 'center'},
        {title: '评价', dataIndex: 'evaluate', key: 'evaluate', width: 100, align: 'center'},
        {title: '班干确认', dataIndex: 'shiftManagerCon', key: 'shiftManagerCon', width: 100, align: 'center'},
        {title: '值班老师确认', dataIndex: 'teacherOnDutyCon', key: 'teacherOnDutyCon', width: 120, align: 'center'},
        {
          title: '操作',
          dataIndex: 'operation',
          key: 'operation',
          fixed: 'right',
          width: 100,
          slots: {customRender: 'operation'},
        },
      ];
      const confirmDel = (key: string) => {
        data.value = data.value.filter(item => item.key !== key)
        message.success('删除成功');
      }
      const handleCheck = (key: string) => {
        itemData.value.splice(0, itemData.value.length)
        itemData.value.push({
          key: '1',
          fKey: '1',
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
          numOfPeopleNotArrived: 8,
          numberScore: 17,
          clazzDisScore: 30,
          learnAtmScore: 40,
          clazzHygieneScore: 10,
          totalScore: null,
          evaluate: null,
          shiftManagerCon: null,
          teacherOnDutyCon: null,
        })
        showAllItem.value = true
      }
      const handleSeeOk = () => {
        showAllItem.value = false
      }
      const clazz = ref('') //教室
      const sArriveNumOfPeople = ref('') //应到人数
      const numOfPeopleStayOut = ref('')
      const leave = ref('')
      const absent = ref('')
      const studentCadres = ref('')
      const numOfAssociation = ref('')
      const actualNumber = ref('')
      const numOfPeopleNotArrived = ref('')
      const numberScore = ref('')
      const clazzDisScore = ref('')
      const learnAtmScore = ref('')
      const clazzHygieneScore = ref('')
      const totalScore = ref('')
      const evaluate = ref('')
      const shiftManagerCon = ref('')
      const teacherOnDutyCon = ref('')


      const showSetItem = ref(false);
      //eSCID 晚修检查项Id
      const eSCId = ref()
      const handleModify = (eId: number) => {
        eSCId.value = eId
        for (let i in itemData.value) {
          if (itemData.value[i].evenStudyCheckId === eId) {
            clazz.value = itemData.value[i].clazz
            sArriveNumOfPeople.value = itemData.value[i].sArriveNumOfPeople
            numOfPeopleStayOut.value = itemData.value[i].numOfPeopleStayOut
            leave.value = itemData.value[i].leave
            absent.value = itemData.value[i].absent
            studentCadres.value = itemData.value[i].studentCadres
            numOfAssociation.value = itemData.value[i].numOfAssociation
            actualNumber.value = itemData.value[i].actualNumber
            numOfPeopleNotArrived.value = itemData.value[i].numOfPeopleNotArrived
            numberScore.value = itemData.value[i].numberScore
            clazzDisScore.value = itemData.value[i].clazzDisScore
            learnAtmScore.value = itemData.value[i].learnAtmScore
            clazzHygieneScore.value = itemData.value[i].clazzHygieneScore
            totalScore.value = itemData.value[i].totalScore
            evaluate.value = itemData.value[i].evaluate
            shiftManagerCon.value = itemData.value[i].shiftManagerCon
            teacherOnDutyCon.value = itemData.value[i].teacherOnDutyCon
          }
        }
        showSetItem.value = true
      }
      const calcTotalScore = () => {
        totalScore.value = numberScore.value + clazzDisScore.value + learnAtmScore.value + clazzHygieneScore.value
      }

      const itemConfirmDel = (escId:string) =>{
        console.log(escId);
      }

      const isChecked = ref(true)
      const isConfirm = ref(true)
      const handleModifyOk = () => {
        for (let i in itemData.value) {
          if (itemData.value[i].evenStudyCheckId === eSCId.value) {
            itemData.value[i].clazz = clazz.value
            itemData.value[i].sArriveNumOfPeople = sArriveNumOfPeople.value
            itemData.value[i].numOfPeopleStayOut = numOfPeopleStayOut.value
            itemData.value[i].leave = leave.value
            itemData.value[i].absent = absent.value
            itemData.value[i].studentCadres = studentCadres.value
            itemData.value[i].numOfAssociation = numOfAssociation.value
            itemData.value[i].actualNumber = actualNumber.value
            itemData.value[i].numOfPeopleNotArrived = numOfPeopleNotArrived.value
            itemData.value[i].numberScore = numberScore.value
            itemData.value[i].clazzDisScore = clazzDisScore.value
            itemData.value[i].learnAtmScore = learnAtmScore.value
            itemData.value[i].clazzHygieneScore = clazzHygieneScore.value
            itemData.value[i].totalScore = totalScore.value
            itemData.value[i].evaluate = evaluate.value
            itemData.value[i].shiftManagerCon = shiftManagerCon.value
            itemData.value[i].teacherOnDutyCon = teacherOnDutyCon.value
          }
        }
        showSetItem.value = false
      }

      const selTime = ref('')
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
      const curTeacherName = ref('')
      const weekly = ref('')
      const whichToday = ref('')
      const allClazz = ref([
        {
          key: '1',
          id: 1,
          clazz: '183计网502',
          clazzRoom:'1301'
        },
        {
          key: '2',
          id: 2,
          clazz: '183云计算502',
          clazzRoom:'1302'
        },
        {
          key: '3',
          id: 3,
          clazz: '183商务512',
          clazzRoom:'1303'
        },
        {
          key: '4',
          id: 4,
          clazz: '183商务522',
          clazzRoom:'1503'
        },
      ])
      const curClazz = ref([])
      const format = 'YYYY-MM-DD'

      const onDateChange = (value: Moment[], dateString: string) => {
        selTime.value = dateString
      }
      const selClazzChange:any = ref([])
      const handleClazzChange = (value: string[]) => {
        selClazzChange.value.splice(0,selClazzChange.value.length)
        for (let i =0;i<value.length;i++){
          selClazzChange.value.push(allClazz.value[parseInt(value[i]) - 1])
        }
      };
      const visibleTwo = ref(false)
      const handleAdd = () => {
        visibleTwo.value = true
      }
      const handleAddOk = () =>{
        if (selTime.value === '') {
          message.error('请选择日期')
          return false
        }
        if (weekly.value === '') {
          message.error('请选择第几周')
          return false
        }
        if (whichToday.value === '') {
          message.error('请选择星期几')
          return false
        }
        if (curTeacherName.value === '') {
          message.error('请选择值班老师')
          return false
        }
        if (selClazzChange.value === '') {
          message.error('请选择至少一个班级')
          return false
        }else{
          allClazz.value = selClazzChange.value
        }
        const newItem:any = {
          key: Date.now().toString(),
          id: Date.now(),
          date: selTime.value,
          checkConfirmTime: '',
        }
        data.value.push(newItem)
        visibleTwo.value = false
      }
      return {
        data,
        columns,
        columns2,
        itemData,
        pagination,
        showAllItem,
        handleCheck,
        handleModify,
        handleModifyOk,
        calcTotalScore,
        handleSeeOk,
        showSetItem,
        isConfirm,
        isChecked,
        handleAdd,
        visibleTwo,
        confirmDel,
        itemConfirmDel,

        //添加用到的变量
        selTime,
        teachers,
        curTeacherName,
        weekly,
        whichToday,
        allClazz,
        curClazz,
        format,
        onDateChange,
        handleClazzChange,
        handleAddOk,

        clazz,
        sArriveNumOfPeople,
        numOfPeopleStayOut,
        leave,
        absent,
        studentCadres,
        numOfAssociation,
        actualNumber,
        numOfPeopleNotArrived,
        numberScore,
        clazzDisScore,
        learnAtmScore,
        clazzHygieneScore,
        totalScore,
        evaluate,
        shiftManagerCon,
        teacherOnDutyCon,
      }
    }
  })
</script>

<style scoped>

</style>