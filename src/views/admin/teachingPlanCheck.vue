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
      <a-button type="primary" :style="{margin:'0 10px 0 0'}" @click="handleSee(record.key)">查看
      </a-button>
      <a-modal v-model:visible="record.isShow" title="查看授课计划执行情况项" @ok="handleOk()" okText="确认" cancelText="取消"
               width="90%">
        <a-table :columns="columns2" :data-source="itemData" :scroll="{ x: 1200, y: 300 }"
                 :pagination="pagination" :rowKey="itemData.key">
          <template #operation="{ record }">
            <a-button type="primary" :style="{margin:'0 10px 10px 0'}" @click="handleModify(record.key)">
              修改
            </a-button>
            <a-popconfirm
                    title="是否要删除？"
                    ok-text="是"
                    cancel-text="否"
                    @confirm="itemConfirm(record.key)"
            >
              <a-button type="danger">删除</a-button>
            </a-popconfirm>
          </template>
        </a-table>
      </a-modal>
      <a-button type="primary" :style="{margin:'0 10px 0 0'}" @click="handleExport(record.key)">导出
      </a-button>
      <a-popconfirm
              title="是否要删除？"
              ok-text="是"
              cancel-text="否"
              @confirm="confirm(record.key)"
      >
        <a-button type="danger">删除</a-button>
      </a-popconfirm>
    </template>
  </a-table>

  <a-modal v-model:visible="showModify" title="修改学期作业检查项" @ok="handleModifyOk()" okText="确认" cancelText="取消"
           width="40%">
    <label>计划进度:</label>
    <a-input placeholder="请输入计划进度" style="margin-bottom: 10px;"
                    v-model:value="Schedule"></a-input>
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

  <a-button type="primary" :style="{margin:'0 10px 0 0'}" @click="handleAdd">新增
    <a-modal v-model:visible="visibleTwo" title="新增授课计划情况表" @ok="handleAddOk" okText="确认" cancelText="取消">
      <label>教研室</label>
      <a-select style="width: 100%;margin-bottom: 4px" @change="handleModifySelect"
                v-model:value="curSelValue">
        <a-select-option v-for="(item,index) in sectionData" :key="item.id" :value="item.name">
          {{ item.name }}
        </a-select-option>
      </a-select>
    </a-modal>
  </a-button>
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
    teachingSection: string;
    examiner: string;
    isShow?: boolean;
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
      //分页数
      const pagination = {
        pageSize: 5
      };
      //模拟数据，使用TableDataType接口验证数据
      const data: Ref<TableDataType[]> = ref([
        {
          key: '1',
          date: "2021-07-05",
          term: '2020-2021学年度 第2学期',
          teachingSection: '网络教研室',
          examiner: '',
          isShow: false,
        },
        {
          key: '2',
          date: "2021-07-06",
          term: '2020-2021学年度 第2学期',
          teachingSection: '系办教研室',
          examiner: '',
        }
      ]);
      const itemData = ref([
        {
          key: '',
          teacherName: '',
          courseName: '',
          clazz: '',
          Schedule: '',
          actualProgress: '',
          comparison: '',
          causeAnalysis: ''
        },
      ])
      //教研室
      const sectionData = ref([
        {
          id: '1',
          name: '系办教研室'
        },
        {
          id: '2',
          name: '网络教研室'
        },
        {
          id: '3',
          name: '商务教研室'
        },
        {
          id: '4',
          name: '会计教研室'
        },
        {
          id: '5',
          name: '灯饰教研室'
        },
        {
          id: '6',
          name: '环艺教研室'
        },
        {
          id: '7',
          name: '专业基础教研室'
        },
        {
          id: '8',
          name: '美容教研室'
        },
        {
          id: '9',
          name: '行政部门教研室'
        },
      ]);
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
          defaultSortOrder: 'false',
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
          title: '教研室',
          dataIndex: 'teachingSection',
          slots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender',
          },
          onFilter: (value: string, record: TableDataType) =>
              record.teachingSection.toString().toLowerCase().includes(value.toLowerCase()),
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
      const columns2 = [
        {title: '教师姓名', width: 100, dataIndex: 'teacherName', key: 'teacherName', fixed: 'left', align: 'center'},
        {title: '课程', dataIndex: 'courseName', key: 'courseName', width: 100, fixed: 'left',align: 'center'},
        {title: '班级', dataIndex: 'clazz', key: 'clazz', width: 200, fixed: 'left', align: 'center'},
        {title: '计划进度', dataIndex: 'Schedule', key: 'Schedule', width: 180, align: 'center'},
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
      //设置当前点击的key值为空
      const _key = ref()
      const curSelValue = ref('')
      const showModify = ref(false)
      const handleSee = (key: string) => {
        itemData.value.splice(0, itemData.value.length)
        for (let i in data.value) {
          if (data.value[i].key === data.value[0].key) data.value[i].isShow = true
        }

        //在这进行数据请求///////////////////////////////////////////////////////////
        if (key === '1') {
          const getData = [
            {
              key: '1',
              teacherName: '郑镇耿',
              courseName: 'LINUX服务器管理(下)',
              clazz: '193计网502',
              Schedule: '',
              actualProgress: '',
              comparison: '',
              causeAnalysis: '',
            },
            {
              key: '2',
              teacherName: '郑镇耿',
              courseName: 'LINUX服务器管理(下)',
              clazz: '193计网502',
              Schedule: '',
              actualProgress: '',
              comparison: '',
              causeAnalysis: '',
            },
            {
              key: '3',
              teacherName: '郑镇耿',
              courseName: 'LINUX服务器管理(下)',
              clazz: '193计网502',
              Schedule: '',
              actualProgress: '',
              comparison: '',
              causeAnalysis: '',
            },
            {
              key: '4',
              teacherName: '郑镇耿',
              courseName: 'LINUX服务器管理(下)',
              clazz: '193计网502',
              Schedule: '',
              actualProgress: '',
              comparison: '',
              causeAnalysis: '',
            },
            {
              key: '5',
              teacherName: '郑镇耿',
              courseName: 'LINUX服务器管理(下)',
              clazz: '193计网502',
              Schedule: '',
              actualProgress: '',
              comparison: '',
              causeAnalysis: '',
            },
            {
              key: '6',
              teacherName: '郑镇耿',
              courseName: 'LINUX服务器管理(下)',
              clazz: '193计网502',
              Schedule: '',
              actualProgress: '',
              comparison: '',
              causeAnalysis: '',
            },
          ]
          itemData.value = getData
        } else {
          const getData2 = [
            {
              key: '1',
              teacherName: '郑镇耿',
              courseName: 'LINUX服务器管理(下)',
              clazz: '193计网502',
              Schedule: '',
              actualProgress: '',
              comparison: '',
              causeAnalysis: '',
            },
            {
              key: '2',
              teacherName: '郑镇耿',
              courseName: 'LINUX服务器管理(下)',
              clazz: '193计网502',
              Schedule: '',
              actualProgress: '',
              comparison: '',
              causeAnalysis: '',
            },
            {
              key: '3',
              teacherName: '郑镇耿',
              courseName: 'LINUX服务器管理(下)',
              clazz: '193计网502',
              Schedule: '',
              actualProgress: '',
              comparison: '',
              causeAnalysis: '',
            },
            {
              key: '4',
              teacherName: '郑镇耿',
              courseName: 'LINUX服务器管理(下)',
              clazz: '193计网502',
              Schedule: '',
              actualProgress: '',
              comparison: '',
              causeAnalysis: '',
            },
            {
              key: '5',
              teacherName: '郑镇耿',
              courseName: 'LINUX服务器管理(下)',
              clazz: '193计网502',
              Schedule: '',
              actualProgress: '',
              comparison: '',
              causeAnalysis: '',
            },
            {
              key: '6',
              teacherName: '郑镇耿',
              courseName: 'LINUX服务器管理(下)',
              clazz: '193计网502',
              Schedule: '',
              actualProgress: '',
              comparison: '',
              causeAnalysis: '',
            },
          ]
          itemData.value = getData2
        }
      }
      //处理修改函数，传入key值
      const Schedule = ref('')
      const actualProgress = ref('')
      const comparison = ref('')
      const causeAnalysis = ref('')
      const handleModify = (key: string) => {
        showModify.value = true
        _key.value = key
        //显示弹出层
        for (let i = 0; i < itemData.value.length; i++) {
          if (itemData.value[i].key === _key.value) {
            Schedule.value = itemData.value[i].Schedule
            actualProgress.value = itemData.value[i].actualProgress
            comparison.value = itemData.value[i].comparison
            causeAnalysis.value = itemData.value[i].causeAnalysis
          }
        }
      }
      const handleModifyOk = () => {
        //在这进行数据修改上传数据库//////////////////////////////////////////////
        for (let i = 0; i < itemData.value.length; i++) {
          if (itemData.value[i].key === _key.value) {
            itemData.value[i].Schedule = Schedule.value
            itemData.value[i].actualProgress = actualProgress.value
            itemData.value[i].comparison = comparison.value
            itemData.value[i].causeAnalysis = causeAnalysis.value
          }
        }
        showModify.value = false
        message.success('修改成功')
      }

      const itemConfirm = (key: string) => {
        itemData.value = itemData.value.filter(item => item.key != key)
      }
      const handleExport = (key: string) => {

      }
      //获取选择的教研室
      const selDepartment = ref('')
      const handleModifySelect = (value: string) => {
        selDepartment.value = value
      };
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
      //第二个弹出层默认为否
      const visibleTwo = ref(false);

      //处理点击添加事件
      const handleAdd = () => {
        visibleTwo.value = true;
        curSelValue.value = ''
      }

      //处理添加弹出层的确认事件
      const handleAddOk = () => {
        if (curSelValue.value === '') {
          message.error('请选择教研室')
          return false
        }
        const isTeachingSec = ref(false)
        for (let i = 0;i<data.value.length;i++){
          if (data.value[i].teachingSection === curSelValue.value){
            isTeachingSec.value = true
          }
        }
        if (isTeachingSec.value){
          message.error('该教研室已存在')
          return false
        }
        //模拟添加/////////////////////////////////////////////////////
        let now = new Date();
        let year = now.getFullYear();
        let month = now.getMonth() + 1;
        let day = now.getDate();
        let clock = year + "-";
        if (month < 10)
          clock += "0";
        clock += month + "-";
        if (day < 10)
          clock += "0";
        clock += day + " ";
        const newHCheck = {
          key: Date.now().toString(),
          date: clock.toString(),
          term: '2020-2021学年度 第2学期',
          teachingSection: curSelValue.value,
          examiner: '',
        }
        //向源数据追加
        data.value.push(newHCheck)
        message.success('添加成功')
        curSelValue.value = ''
        visibleTwo.value = false;

      }
      return {
        data,
        columns,
        handleSearch,
        handleReset,
        pagination,
        searchInput,
        handleModify,
        confirm,
        handleOk,
        handleAdd,
        handleAddOk,
        visibleTwo,
        handleModifySelect,
        curSelValue,
        handleExport,
        sectionData,
        handleSee,
        columns2,
        itemData,
        showModify,
        Schedule,
        actualProgress,
        comparison,
        causeAnalysis,
        handleModifyOk,
        itemConfirm
      };
    },
  });
</script>

<style>
  .ant-modal-mask {
    background-color: rgba(0, 0, 0, 0.3);
  }
</style>