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
      <a-modal v-model:visible="record.isShow" title="查看晚修检查项" @ok="handleOk()" okText="确认" cancelText="取消" width="80%">
        <a-table :columns="columns2" :data-source="itemData" :scroll="{ x: 1200, y: 300 }"
                 :pagination="pagination" :rowKey="record.insItems.key">
          <template #operation="{ record }">
            <a-button type="primary" :style="{margin:'0 10px 10px 0'}" @click="handleModify(record.key,record.fKey)">
              修改
            </a-button>
            <a-popconfirm
                    title="是否要删除？"
                    ok-text="是"
                    cancel-text="否"
                    @confirm="itemConfirm(record.key,record.fKey)">
              <a-button type="danger">删除</a-button>
            </a-popconfirm>
          </template>
        </a-table>
      </a-modal>
      <a-popconfirm
              title="是否要删除？"
              ok-text="是"
              cancel-text="否"
              @confirm="confirm(record.key)">
        <a-button type="danger">删除</a-button>
      </a-popconfirm>
    </template>
  </a-table>
  <a-modal v-model:visible="showSetItem" title="修改晚修检查项" @ok="handleV3Ok()"
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
  </a-modal>
  <a-button type="primary" :style="{margin:'0 10px 0 0'}" @click="handleAdd">新增
    <a-modal v-model:visible="visibleTwo" title="新增晚修检查表" @ok="handleAddOk" okText="确认" cancelText="取消">
      <label>日期:</label>
      <a-date-picker style="width: 100%;margin-bottom: 10px" placeholder="请选择日期" :format="format" @change="onDateChange" :showToday="false"/>
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
  <a-button type="primary" :style="{margin:'0 10px 0 0'}" @click="handleExport">导出某日数据
    <a-modal v-model:visible="visibleThree" title="导出" @ok="handleExportOk" okText="确认" cancelText="取消">
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

  //设置接收数据的接口
  interface TableDataType {
    key: string;
    id: number;
    date: string;
    teacherOnDuty: string;
    checkConfirmTime: string;
    insItems: any;
    isShow?: boolean;
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
          date: '2021-06-26',
          teacherOnDuty: '王景奇',
          checkConfirmTime: '',
          isShow: false,
          insItems: [
            {
              key: '1',
              fKey: '1',
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
            },
            {
              key: '2',
              fKey: '1',
              clazzName: '183云计算502',
              clazz: 1302,
              sArriveNumOfPeople: null,
              numOfPeopleStayOut: null,
              leave: null,
              absent: null,
              studentCadres: null,
              numOfAssociation: null,
              actualNumber: null,
              numOfPeopleNotArrived: null,
              numberScore: null,
              clazzDisScore: null,
              learnAtmScore: null,
              clazzHygieneScore: null,
              totalScore: null,
              evaluate: null,
              shiftManagerCon: null,
              teacherOnDutyCon: null,
            }
          ]
        },
        {
          key: '2',
          id: 2,
          date: '2021-06-27',
          teacherOnDuty: '吴振庭',
          checkConfirmTime: '',
          insItems: [
            {
              key: '1',
              fKey: '2',
              clazzName: '183商务512',
              clazz: 1303,
              sArriveNumOfPeople: null,
              numOfPeopleStayOut: null,
              leave: null,
              absent: null,
              studentCadres: null,
              numOfAssociation: null,
              actualNumber: null,
              numOfPeopleNotArrived: null,
              numberScore: null,
              clazzDisScore: null,
              learnAtmScore: null,
              clazzHygieneScore: null,
              totalScore: null,
              evaluate: null,
              shiftManagerCon: null,
              teacherOnDutyCon: null,
            },
            {
              key: '2',
              fKey: '2',
              clazzName: '183商务522',
              clazz: 1502,
              sArriveNumOfPeople: null,
              numOfPeopleStayOut: null,
              leave: null,
              absent: null,
              studentCadres: null,
              numOfAssociation: null,
              actualNumber: null,
              numOfPeopleNotArrived: null,
              numberScore: null,
              clazzDisScore: null,
              learnAtmScore: null,
              clazzHygieneScore: null,
              totalScore: null,
              evaluate: null,
              shiftManagerCon: null,
              teacherOnDutyCon: null,
            }
          ]
        }
      ]);
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
          sorter: (a: TableDataType, b: TableDataType) =>Date.parse(a.date) - Date.parse(b.date),
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
          title: '值班老师',
          dataIndex: 'teacherOnDuty',
          slots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender',
          },
          onFilter: (value: string, record: TableDataType) =>
              record.teacherOnDuty.toString().toLowerCase().includes(value.toLowerCase()),
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
      //设置弹出层默认为否
      const showSetItem = ref(false);
      //设置当前点击的值为空
      const curCourseValue = ref('')
      //设置当前点击的key值为空
      const _key = ref()
      const curClazzName = ref('')
      //处理修改函数，传入key值
      const handleCheck = (key: string) => {
        itemData.value.splice(0, itemData.value.length)
        for (let i in data.value) {
          if (data.value[i].key === key) {
            for (let j in data.value[i].insItems) {
              itemData.value.push(data.value[i].insItems[j])
            }
          }
          if (data.value[i].key === data.value[0].key) data.value[i].isShow = true

        }
      }
      //处理弹出层点击ok
      const handleOk = () => {
        for (let i in data.value) {
          data.value[0].isShow = false
        }
      };
      //确认删除
      const confirm = (key: string) => {
        data.value = data.value.filter(item => item.key !== key)
        message.success('删除成功');
      };

      const itemConfirm = (key: string, fKey: string) => {
        console.log(key, fKey);
        for (let i in itemData.value) {
          itemData.value = itemData.value.filter((item: { key: string; }) => item.key !== key)
        }
        for (let i in data.value) {
          if (data.value[i].key === fKey) {
            data.value[i].insItems = data.value[i].insItems.filter((item: { key: string; }) => item.key !== key)
          }
        }
        message.success('删除成功');
      };

      const clazz = ref('') //教室
      const sArriveNumOfPeople = ref('') //应到人数
      const numOfPeopleStayOut = ref('') //
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
      const curKey = ref('')
      const curFKey = ref('')
      const handleModify = (key: string, fKey: string) => {
        curKey.value = key
        curFKey.value = fKey
        for (let i in itemData.value) {
          if (itemData.value[i].key === key) {
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
            curKey.value = key
            curFKey.value = fKey
          }
          if (itemData.value[i].key === itemData.value[0].key) {
            showSetItem.value = true
          }
        }
      }
      const calcTotalScore = () => {
        totalScore.value = numberScore.value + clazzDisScore.value + learnAtmScore.value + clazzHygieneScore.value
      }
      const handleV3Ok = () => {
        for (let i in data.value) {
          if (data.value[i].key === curFKey.value) {
            let itemData = data.value[i].insItems
            for (let j of itemData) {
              if (j.key === curKey.value) {
                j.clazz = clazz.value
                j.sArriveNumOfPeople = sArriveNumOfPeople.value
                j.numOfPeopleStayOut = numOfPeopleStayOut.value
                j.leave = leave.value
                j.absent = absent.value
                j.studentCadres = studentCadres.value
                j.numOfAssociation = numOfAssociation.value
                j.actualNumber = actualNumber.value
                j.numOfPeopleNotArrived = numOfPeopleNotArrived.value
                j.numberScore = numberScore.value
                j.clazzDisScore = clazzDisScore.value
                j.learnAtmScore = learnAtmScore.value
                j.clazzHygieneScore = clazzHygieneScore.value
                j.totalScore = totalScore.value
                j.evaluate = evaluate.value
                j.shiftManagerCon = shiftManagerCon.value
                j.teacherOnDutyCon = teacherOnDutyCon.value
              }
            }
          }
        }
        showSetItem.value = false
      }

      //第二个弹出层默认为否
      const visibleTwo = ref(false);
      const visibleThree = ref(false);
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
      // const selTeacherChange = ref('')
      // const handleTeacherChange = (value: string) => {
      //   selTeacherChange.value = value
      // };
      const selClazzChange:any = ref([])
      const handleClazzChange = (value: string[]) => {
        selClazzChange.value.splice(0,selClazzChange.value.length)
        for (let i =0;i<value.length;i++){
          selClazzChange.value.push(allClazz.value[parseInt(value[i]) - 1])
        }
      };
      //处理点击添加事件
      const handleAdd = () => {
        weekly.value = ''
        whichToday.value = ''
        curTeacherName.value = ''
        curClazz.value = []
        visibleTwo.value = true;
      }

      //处理添加弹出层的确认事件
      const handleAddOk = () => {
        //判断是否为空
        // console.log(selTime.value);
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
          teacherOnDuty: curTeacherName.value,
          checkConfirmTime: '',
          isShow: false,
          insItems: []
        }
        for (let i = 0;i<allClazz.value.length;i++){
          const clazzItem:any = {
            key: Math.floor((Math.random()*100000)+1).toString(),
            fKey: newItem.key,
            clazzName: allClazz.value[i].clazz,
            clazz: allClazz.value[i].clazzRoom,
            sArriveNumOfPeople: null,
            numOfPeopleStayOut: null,
            leave: null,
            absent: null,
            studentCadres: null,
            numOfAssociation: null,
            actualNumber: null,
            numOfPeopleNotArrived: null,
            numberScore: null,
            clazzDisScore: null,
            learnAtmScore: null,
            clazzHygieneScore: null,
            totalScore: null,
            evaluate: null,
            shiftManagerCon: null,
            teacherOnDutyCon: null,
          }
          newItem.insItems.push(clazzItem)
        }
        data.value.push(newItem)
        console.log(data.value);
        message.success('添加成功')
        visibleTwo.value = false;
      }
      //处理点击导出事件
      const handleExport = () => {
        visibleThree.value = true;
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
        // message.success('导出成功')
        // visibleThree.value = false;
      }
      return {
        data,
        columns,
        columns2,
        handleSearch,
        handleReset,
        pagination,
        searchInput,
        handleCheck,
        confirm,
        itemConfirm,
        handleOk,
        showSetItem,
        curCourseValue,
        handleAdd,
        handleAddOk,
        visibleTwo,
        curClazzName,
        allClazz,
        handleModify,
        itemData,
        handleV3Ok,
        visibleThree,
        handleExport,
        handleExportOk,
        selTime,
        teachers,
        curTeacherName,
        // handleTeacherChange,
        handleClazzChange,
        curClazz,
        format,
        onDateChange,
        weekly,
        whichToday,
        onExportDateChange,

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


        calcTotalScore,
      };
    },
  });
</script>

<style>
  .ant-modal-mask {
    background-color: rgba(0, 0, 0, 0.3);
  }
</style>