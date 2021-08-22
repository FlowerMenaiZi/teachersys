<template>
  <a-table :columns="columns" :data-source="sData" :pagination="pagination">
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
      <a-popconfirm
              title="是否要删除？"
              ok-text="是"
              cancel-text="否"
              @confirm="confirm(record.key)">
        <a-button type="danger">删除</a-button>
      </a-popconfirm>
    </template>
  </a-table>
  <a-modal v-model:visible="showAllItem" title="查看晚修检查项" @ok="handleOk()" okText="确认" cancelText="取消" width="80%">
    <a-table :columns="columns2" :data-source="itemData" :scroll="{ x: 1200}"
             :pagination="pagination" :rowKey="itemData.key">
      <template #operation="{ record }">
        <a-button type="primary" :style="{margin:'0 10px 10px 0'}" @click="handleModify(record.key)">
          修改
        </a-button>
        <a-popconfirm
                title="是否要删除？"
                ok-text="是"
                cancel-text="否"
                @confirm="itemConfirm(record.key)">
          <a-button type="danger">删除</a-button>
        </a-popconfirm>
      </template>
    </a-table>
  </a-modal>
  <a-modal v-model:visible="showSetItem" title="修改晚修检查项" @ok="handleV3Ok()"
           okText="确认" cancelText="取消" width="500px">
    <label>教室：</label>
    <a-input-number placeholder="请输入教室名" style="width:100%;margin-bottom: 10px" v-model:value="room"></a-input-number>
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
        <a-select-option v-for="(item,index) in teachers" :value="item.id" :key="item.key">
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
        <a-select-option v-for="(i,index) in allClazz" :key="i.key">
          {{i.name}} - {{i.room}}
        </a-select-option>
      </a-select>
    </a-modal>
  </a-button>
  <a-button type="primary" :style="{margin:'0 10px 0 0'}" @click="handleExport">导出某日数据
    <a-modal v-model:visible="visibleThree" title="导出" @ok="handleExportOk" okText="确认" cancelText="取消">
      <label>日期:</label>
      <a-date-picker style="width: 100%;margin-bottom: 10px" placeholder="请选择日期" :format="format"
                     @change="onExportDateChange" :showToday="false"/>
    </a-modal>
    <a-modal v-model:visible="visibleFour" title="下载" okText="确认" cancelText="取消" @ok="handleDownLoadOk">
      <a :href="handleExportLink" target="_blank">下载</a>
    </a-modal>
  </a-button>
</template>

<script lang="ts">
  import {defineComponent, ref, reactive, UnwrapRef, Ref, onMounted, getCurrentInstance, computed} from 'vue';
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
    teacher: string;
    teacher_id: number;
    check_at: string;
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
      const sData: Ref<TableDataType[]> = ref([]);
      const teachers: any = ref([])
      const allClazz: any = ref([])
      const itemData: any = ref([])
      const {proxy}: any = getCurrentInstance()
      onMounted(() => {
        proxy.$api.get(
            '/getEvenCheck',
            {},
            {},
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
        proxy.$api.get(
            '/getTeacher',
            {},
            {},
            (success) => {
              for (let i in success.data.data) {
                let id = success.data.data[i].id
                success.data.data[i].key = id.toString()
                teachers.value.push(success.data.data[i])
              }
            },
            (error) => {

            }
        )
        proxy.$api.get(
            '/getClazz',
            {},
            {},
            (success) => {
              for (let i in success.data.data) {
                let id = success.data.data[i].id
                success.data.data[i].key = id.toString()
                allClazz.value.push(success.data.data[i])
              }
            },
            (error) => {

            }
        )
      })
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
              record.check_at.toString().toLowerCase().includes(value.toLowerCase()),
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
          dataIndex: 'check_at',
          slots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender',
          },
          onFilter: (value: string, record: TableDataType) =>
              record.check_at.toString().toLowerCase().includes(value.toLowerCase()),
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
        {title: '班级名', width: 150, dataIndex: 'clazz', key: 'clazz', fixed: 'left', align: 'center'},
        {title: '教室', dataIndex: 'room', key: 'room', width: 100, align: 'center'},
        {title: '应到人数', dataIndex: 'should_arrive_number', key: 'should_arrive_number', width: 100, align: 'center'},
        {title: '外宿人数', dataIndex: 'goout_number', key: 'goout_number', width: 100, align: 'center'},
        {title: '请假', dataIndex: 'leave_number', key: 'leave_number', width: 100, align: 'center'},
        {title: '缺席', dataIndex: 'absent_number', key: 'absent_number', width: 100, align: 'center'},
        {title: '学生干部', dataIndex: 'student_cadres_number', key: 'student_cadres_number', width: 100, align: 'center'},
        {title: '社团人数', dataIndex: 'associations_number', key: 'associations_number', width: 100, align: 'center'},
        {title: '实到人数', dataIndex: 'arrive_number', key: 'arrive_number', width: 100, align: 'center'},
        {title: '未到人数', dataIndex: 'unarrive_number', key: 'unarrive_number', width: 100, align: 'center'},
        {title: '人数得分', dataIndex: 'number_score', key: 'number_score', width: 100, align: 'center'},
        {title: '课堂纪律得分', dataIndex: 'discipline_score', key: 'discipline_score', width: 120, align: 'center'},
        {title: '学习氛围得分', dataIndex: 'atmosphere_score', key: 'atmosphere_score', width: 120, align: 'center'},
        {title: '教室卫生得分', dataIndex: 'hygiene_score', key: 'hygiene_score', width: 120, align: 'center'},
        {title: '总得分', dataIndex: 'total_score', key: 'total_score', width: 100, align: 'center'},
        {title: '评价', dataIndex: 'appraise', key: 'appraise', width: 100, align: 'center'},
        {title: '班干确认', dataIndex: 'clazz_check_at', key: 'clazz_check_at', width: 100, align: 'center'},
        {title: '值班老师确认', dataIndex: 'teacher_check_at', key: 'teacher_check_at', width: 120, align: 'center'},
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
      const curClazzName = ref('')
      //处理修改函数，传入key值
      const showAllItem = ref(false)
      const handleCheck = (key: string) => {
        proxy.$api.get(
            '/getEvenCheckItem',
            {},
            {'id': parseInt(key)},
            (success) => {
              showAllItem.value = true
              itemData.value.splice(0, itemData.value.length)
              for (let i in success.data.data) {
                let id = success.data.data[i].id
                success.data.data[i].key = id.toString()
                itemData.value.push(success.data.data[i])
              }
            },
            (error) => {

            }
        )
      }
      //处理弹出层点击ok
      const handleOk = () => {
        showAllItem.value = false
      };
      //确认删除
      const confirm = (key: string) => {
        proxy.$api.get(
            '/delEvenCheck',
            {},
            {'id': parseInt(key)},
            (success) => {
              if (success.data.error === 0) {
                sData.value = sData.value.filter(item => item.key !== key)

                message.success('删除成功');
              }
            }
        )
      };

      const itemConfirm = (key: string) => {
        proxy.$api.get(
            '/delEvenCheckItem',
            {},
            {'id': parseInt(key)},
            (success) => {
              if (success.data.error === 0) {
                itemData.value = itemData.value.filter(item => item.key !== key)
                message.success('删除成功');
              }
            }
        )

      };

      const room = ref('') //教室
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
      //设置当前点击的key值为空
      const _key = ref()
      const handleModify = (key: string) => {
        for (let i in itemData.value) {
          if (itemData.value[i].key === key) {
            _key.value = key
            showSetItem.value = true
            room.value = itemData.value[i].room
            sArriveNumOfPeople.value = itemData.value[i].should_arrive_number
            numOfPeopleStayOut.value = itemData.value[i].goout_number
            leave.value = itemData.value[i].leave_number
            absent.value = itemData.value[i].absent_number
            studentCadres.value = itemData.value[i].student_cadres_number
            numOfAssociation.value = itemData.value[i].associations_number
            actualNumber.value = itemData.value[i].arrive_number
            numOfPeopleNotArrived.value = itemData.value[i].unarrive_number
            numberScore.value = itemData.value[i].number_score
            clazzDisScore.value = itemData.value[i].discipline_score
            learnAtmScore.value = itemData.value[i].atmosphere_score
            clazzHygieneScore.value = itemData.value[i].hygiene_score
            totalScore.value = itemData.value[i].total_score
            evaluate.value = itemData.value[i].appraise
            shiftManagerCon.value = itemData.value[i].clazz_check_at
            teacherOnDutyCon.value = itemData.value[i].teacher_check_at
          }
        }
      }
      const calcTotalScore = () => {
        totalScore.value = numberScore.value + clazzDisScore.value + learnAtmScore.value + clazzHygieneScore.value
      }
      const handleV3Ok = () => {

        proxy.$api.get(
            '/updEvenCheckItem',
            {},
            {
              'id': parseInt(_key.value),
              'room': room.value,
              'should_arrive_number': sArriveNumOfPeople.value,
              'goout_number': numOfPeopleStayOut.value,
              'leave_number': leave.value,
              'absent_number': absent.value,
              'student_cadres_number': studentCadres.value,
              'associations_number': numOfAssociation.value,
              'arrive_number': actualNumber.value,
              'unarrive_number': numOfPeopleNotArrived.value,
              'number_score': numberScore.value,
              'discipline_score': clazzDisScore.value,
              'atmosphere_score': learnAtmScore.value,
              'hygiene_score': clazzHygieneScore.value,
              'total_score': totalScore.value,
              'appraise': evaluate.value,
              'clazz_check_at': shiftManagerCon.value,
              'teacher_check_at': teacherOnDutyCon.value
            },
            (success) => {
              if (success.data.error === 0) {
                for (let j in itemData.value) {
                  if (itemData.value[j].key == _key.value) {
                    itemData.value[j].room = room.value
                    itemData.value[j].should_arrive_number = sArriveNumOfPeople.value
                    itemData.value[j].goout_number = numOfPeopleStayOut.value
                    itemData.value[j].leave_number = leave.value
                    itemData.value[j].absent_number = absent.value
                    itemData.value[j].student_cadres_number = studentCadres.value
                    itemData.value[j].associations_number = numOfAssociation.value
                    itemData.value[j].arrive_number = actualNumber.value
                    itemData.value[j].unarrive_number = numOfPeopleNotArrived.value
                    itemData.value[j].number_score = numberScore.value
                    itemData.value[j].discipline_score = clazzDisScore.value
                    itemData.value[j].atmosphere_score = learnAtmScore.value
                    itemData.value[j].hygiene_score = clazzHygieneScore.value
                    itemData.value[j].total_score = totalScore.value
                    itemData.value[j].appraise = evaluate.value
                    itemData.value[j].clazz_check_at = shiftManagerCon.value
                    itemData.value[j].teacher_check_at = teacherOnDutyCon.value
                  }
                }
                showSetItem.value = false
              }
            },
            (error) => {

            }
        )

      }

      //第二个弹出层默认为否
      const visibleTwo = ref(false);
      const visibleThree = ref(false);
      const selTime = ref('')

      const curTeacherName = ref('')
      const weekly = ref('')
      const whichToday = ref('')
      const curClazz = ref([])
      const format = 'YYYY-MM-DD'

      const onDateChange = (value: Moment[], dateString: string) => {
        selTime.value = dateString
      }
      const selClazzChange: any = ref([])
      const handleClazzChange = (value: string[]) => {
        selClazzChange.value.splice(0, selClazzChange.value.length)
        for (let i in value) {
          selClazzChange.value.push(parseInt(value[i]))
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
        }
        proxy.$api.get(
            '/addEvenCheck',
            {},
            {
              'date': selTime.value,
              'week': parseInt(weekly.value),
              'day': parseInt(whichToday.value),
              'teacher': parseInt(curTeacherName.value),
              'clazz': selClazzChange.value,
              'ident':'admin',
            },
            (success) => {
              sData.value.splice(0, sData.value.length)
              for (let i in success.data.data) {
                let id = success.data.data[i].id
                success.data.data[i].key = id.toString()
                sData.value.push(success.data.data[i])
              }
              message.success('添加成功')
              visibleTwo.value = false;
            },
            (error) => {

            }
        )
      }
      //处理点击导出事件
      const handleExport = () => {
        visibleThree.value = true;
      }
      const exportDate = ref('')
      const onExportDateChange = (value: Moment[], dateString: string) => {
        exportDate.value = dateString
      }
      //处理添加弹出层的确认事件
      const visibleFour = ref(false)
      const handleExportLink = ref('')
      const handleExportOk = () => {
        //判断是否为空
        if (exportDate.value === '') {
          message.error('请选择导出的日期')
          return false
        } else {
          let issetDate = false
          for (let i in sData.value) {
            if (sData.value[i].date === exportDate.value) {
              issetDate = true
            }
          }
          if (issetDate) {
            handleExportLink.value = 'http://119.29.185.52:9001/exportEvenCheck?date=' + exportDate.value
            visibleFour.value = true
            visibleThree.value = false;
          } else {
            message.error('未找到该日期')
            return false
          }
        }
      }
      const handleDownLoadOk = () => {
        visibleFour.value = false
      }
      return {
        sData,
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
        showAllItem,
        visibleFour,
        handleDownLoadOk,
        handleExportLink,

        room,
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
  .ant-spin-container .ant-table-fixed-left .ant-table-tbody > tr {
    height: 107px !important;
  }
</style>