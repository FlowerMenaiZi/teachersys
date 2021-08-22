<template>
  <a-table :columns="columns" :data-source="sData" :pagination="pagination"
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
      <a-button type="primary" :style="{margin:'0 10px 0 0'}">
        <a :href="handleExport(record.key)" target="_blank">导出</a>
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
  <a-modal v-model:visible="showItem" title="查看授课计划执行情况项" @ok="handleOk()" okText="确认" cancelText="取消"
           width="80%">
    <a-table :columns="columns2" :data-source="itemData" :scroll="{ x: 1200 }"
             :pagination="pagination">
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
        <a-select-option v-for="(item,index) in sectionData" :key="item.id" :value="item.id">
          {{ item.name }}
        </a-select-option>
      </a-select>
    </a-modal>
  </a-button>
</template>

<script lang="ts">
  import {defineComponent, reactive, ref, Ref, getCurrentInstance, onMounted, computed} from 'vue';
  import {message} from 'ant-design-vue';
  import {CheckOutlined, EditOutlined, SearchOutlined} from '@ant-design/icons-vue';

  //设置接收数据的接口
  interface TableDataType {
    key: string;
    id: number;
    created_at: string;
    term: string;
    staff: string;
    teacher_id: number;
    teacher: string;
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
      const sData: Ref<TableDataType[]> = ref([]);

      //教研室
      const sectionData: any = ref([]);

      const {proxy}: any = getCurrentInstance()
      onMounted(() => {
        proxy.$api.get(
            '/getStaff',
            {},
            {},
            (success) => {
              for (let i in success.data.data) {
                sectionData.value.push(success.data.data[i])
              }
            },
            (error) => {
              console.log(error);
            }
        )
        proxy.$api.get(
            '/getTeachingPlan',
            {},
            {},
            (success) => {
              for (let i in success.data.data) {
                let id = success.data.data[i].id
                success.data.data[i].key = id.toString()
                success.data.data[i].created_at = success.data.data[i].created_at.slice(0, 10)
                sData.value.push(success.data.data[i])
              }
            },
            (error) => {
              console.log(error);
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
          dataIndex: 'created_at',
          defaultSortOrder: 'false',
          slots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender',
          },
          sorter: (a: TableDataType, b: TableDataType) => Date.parse(a.created_at) - Date.parse(b.created_at),
          onFilter: (value: string, record: TableDataType) =>
              record.created_at.toString().toLowerCase().includes(value.toLowerCase()),
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
          dataIndex: 'staff',
          slots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender',
          },
          onFilter: (value: string, record: TableDataType) =>
              record.staff.toString().toLowerCase().includes(value.toLowerCase()),
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
          dataIndex: 'teacher',
          slots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender',
          },
          onFilter: (value: string, record: TableDataType) =>
              record.teacher_id.toString().toLowerCase().includes(value.toLowerCase()),
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
        {title: '教师姓名', width: 100, dataIndex: 'teacher', key: 'teacher', fixed: 'left', align: 'center'},
        {title: '课程', dataIndex: 'course', key: 'course', width: 130, fixed: 'left', align: 'center'},
        {title: '班级', dataIndex: 'clazz', key: 'clazz', width: 125, fixed: 'left', align: 'center'},
        {title: '计划进度', dataIndex: 'plan_progress', key: 'plan_progress', width: 180, align: 'center'},
        {title: '实际进度', dataIndex: 'actual_progress', key: 'actual_progress', width: 180, align: 'center'},
        {title: '比较情况', dataIndex: 'compare', key: 'compare', width: 180, align: 'center'},
        {title: '原因分析', dataIndex: 'reason', key: 'reason', width: 180, align: 'center'},
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
      //确认删除
      const confirm = (key: string) => {
        proxy.$api.get(
            '/delTeachingPlan',
            {},
            {'id': parseInt(key)},
            (success) => {
              if (success.data.error === 0) {
                sData.value = sData.value.filter(item => item.key !== key)
                message.success('删除成功');
              }
            },
            (error) => {

            }
        )
      };
      //设置当前点击的key值为空
      const _key = ref()
      const curSelValue = ref('')
      const showModify = ref(false)
      const showItem = ref(false)
      const itemData: any = ref([])
      const handleSee = (key: string) => {
        proxy.$api.get(
            '/getPCheckItem',
            {},
            {'id': parseInt(key)},
            (success) => {
              if (success.data.error === 0) {
                showItem.value = true
                itemData.value.splice(0, itemData.value.length)
                for (let i in success.data.data) {
                  let id = success.data.data[i].id
                  success.data.data[i].key = id.toString()
                  itemData.value.push(success.data.data[i])
                }
              }
            },
            (error) => {

            }
        )
      }
      const handleExport = computed(() => (id) => {
        return 'http://119.29.185.52:9001/exportPlanCheck?id=' + parseInt(id);
      })
      //处理弹出层点击ok
      const handleOk = () => {
        showItem.value = false
      };
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
            Schedule.value = itemData.value[i].plan_progress
            actualProgress.value = itemData.value[i].actual_progress
            comparison.value = itemData.value[i].compare
            causeAnalysis.value = itemData.value[i].reason
          }
        }
      }
      const handleModifyOk = () => {
        proxy.$api.get(
            '/updTPlanCheckItem',
            {},
            {'id':parseInt(_key.value),'plan_progress':Schedule.value,'actual_progress':actualProgress.value,'compare':comparison.value,'reason':causeAnalysis.value},
            (success)=>{
              if (success.data.error===0){
                for (let i = 0; i < itemData.value.length; i++) {
                  if (itemData.value[i].key === _key.value) {
                    itemData.value[i].plan_progress = Schedule.value
                    itemData.value[i].actual_progress = actualProgress.value
                    itemData.value[i].compare = comparison.value
                    itemData.value[i].reason = causeAnalysis.value
                  }
                }
                showModify.value = false
                message.success('修改成功')
              }
            },
            (error)=>{

            }
        )

      }

      const itemConfirm = (key: string) => {
        proxy.$api.get(
            '/delPlanCheckItem',
            {},
            {'id':parseInt(key)},
            (success)=>{
              if (success.data.error===0){
                itemData.value = itemData.value.filter(item => item.key != key)
              }
            },
            (error)=>{

            }
        )
      }

      //第二个弹出层默认为否
      const visibleTwo = ref(false);

      //处理点击添加事件
      const handleAdd = () => {
        visibleTwo.value = true;
        curSelValue.value = ''
      }

      //处理添加弹出层的确认事件
      //获取选择的教研室
      const selDepartment = ref('')
      const handleModifySelect = (value: string) => {
        selDepartment.value = value
      };
      const handleAddOk = () => {
        if (curSelValue.value === '') {
          message.error('请选择教研室')
          return false
        }
        proxy.$api.get(
            '/addTPlanCheck',
            {},
            {'staff_id':parseInt(curSelValue.value)},
            (success)=>{
              sData.value.splice(0,sData.value.length)
              for (let i in success.data.data) {
                let id = success.data.data[i].id
                success.data.data[i].key = id.toString()
                success.data.data[i].created_at = success.data.data[i].created_at.slice(0, 10)
                sData.value.push(success.data.data[i])
              }
              message.success('添加成功')
              curSelValue.value = ''
              visibleTwo.value = false;
            },
            (error)=>{

            }
        )

      }
      return {
        sData,
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
        itemConfirm,
        showItem
      };
    },
  });
</script>

<style>
</style>