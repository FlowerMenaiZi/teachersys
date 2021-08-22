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
      <a-button type="primary" :style="{margin:'0 10px 0 0'}" @click="handleConfirmTime(record.key)">确认
      </a-button>
      <a-popconfirm
              title="是否要删除？"
              ok-text="是"
              cancel-text="否"
              @confirm="handleConfirmDel(record.key)"
      >
        <a-button type="danger">删除</a-button>
      </a-popconfirm>
    </template>
  </a-table>
  <a-modal v-model:visible="showAllItem" title="查看授课计划执行情况项" @ok="handleSeeOk()" okText="确认" cancelText="取消"
           width="90%">
    <a-table :columns="columns2" :data-source="itemData" :scroll="{ x: 1200, y: 300 }"
             :pagination="pagination">
      <template #operation="{ record }">
        <a-button type="primary" :style="{margin:'0 10px 10px 0'}" @click="handleModify(record.key)">
          修改
        </a-button>
        <a-popconfirm
                title="是否要删除？"
                ok-text="是"
                cancel-text="否"
                @confirm="itemConfirmDel(record.key)"
        >
          <a-button type="danger">删除</a-button>
        </a-popconfirm>
      </template>
    </a-table>
  </a-modal>
  <a-modal v-model:visible="showModifyItem" title="修改授课计划执行情况项" @ok="handleModifyOk()" okText="确认" cancelText="取消"
           width="40%">
    <label>计划进度:</label>
    <a-input placeholder="请输入计划进度" style="margin-bottom: 10px;"
             v-model:value="schedule"></a-input>
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
  import {defineComponent, reactive, ref, Ref,getCurrentInstance,onMounted,computed} from 'vue';
  import {message} from 'ant-design-vue';
  import {CheckOutlined, EditOutlined, SearchOutlined} from '@ant-design/icons-vue';
  import $store from "../../../store/index"
  //设置接收数据的接口
  interface TableDataType {
    key: string;
    id: number;
    created_at: string;
    term: string;
    term_id: number;
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
      const sData: Ref<TableDataType[]> = ref([]);

      const {proxy}:any = getCurrentInstance()
      onMounted(()=>{
        proxy.$api.get(
            '/teachingPlanItem',
            {},
            {'id':$store.state.userInfo.id},
            (success)=>{
              sData.value.splice(0, sData.value.length)
              for (let i in success.data.data) {
                let id = success.data.data[i].id
                success.data.data[i].key = id.toString()
                success.data.data[i].created_at = success.data.data[i].created_at.slice(0,10)
                sData.value.push(success.data.data[i])
              }
            },
            (error)=>{

            }
        )
      })
      const columns = [
        {
          title: '日期',
          dataIndex: 'created_at',
          defaultSortOrder: 'false',
          sorter: (a: TableDataType, b: TableDataType) => Date.parse(a.created_at) - Date.parse(b.created_at),
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

      /*第二个弹出层*/
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
      ]
      const itemData:any = ref([])
      const showAllItem = ref(false)
      const handleSee = (key:string) =>{
        proxy.$api.get(
            '/getPCheckItem',
            {},
            {'id':parseInt(key)},
            (success)=>{
              if (success.data.error === 0) {
                showAllItem.value = true
                itemData.value.splice(0, itemData.value.length)
                for (let i in success.data.data) {
                  let id = success.data.data[i].id
                  success.data.data[i].key = id.toString()
                  itemData.value.push(success.data.data[i])
                }
              }
            },
            (error)=>{}
        )
      }
      const handleSeeOk = () =>{
        showAllItem.value = false
      }
      const _key = ref()
      //弹出按钮
      const handleExport = computed(() => (id) => {
        return 'http://119.29.185.52:9001/exportPlanCheck?id=' + parseInt(id);
      })
      //确认按钮
      const handleConfirmTime = (key:string) =>{
        proxy.$api.get(
            '/checkPlanCheck',
            {},
            {'id':parseInt(key),'teacher_id':$store.state.userInfo.id},
            (success)=>{
              if (success.data.error === 0) {
                for (let i in sData.value) {
                  if (sData.value[i].key === key) {
                    sData.value[i].teacher = $store.state.userInfo.user
                  }
                }
              }
            },
            (error)=>{

            }
        )
      }
      //删除按钮
      const handleConfirmDel = (key:string) => {
        proxy.$api.get(
            '/delTeachingPlan',
            {},
            {'id':parseInt(key)},
            (success)=>{
              if (success.data.error === 0) {
                sData.value = sData.value.filter(item => item.key != key)
                message.success('删除成功')
              } else {
                message.success('删除失败')
              }
            },
            (error)=>{

            }
        )
      }

      /*第三个弹出层*/
      const showModifyItem = ref(false)
      const schedule = ref('')
      const actualProgress = ref('')
      const comparison = ref('')
      const causeAnalysis = ref('')
      const handleModify = (key:string) =>{
        _key.value = key
        showModifyItem.value = true
        for (let i = 0; i < itemData.value.length; i++) {
          if (itemData.value[i].key === _key.value) {
            schedule.value = itemData.value[i].plan_progress
            actualProgress.value = itemData.value[i].actual_progress
            comparison.value = itemData.value[i].compare
            causeAnalysis.value = itemData.value[i].reason
          }
        }
      }
      const handleModifyOk = () =>{
        proxy.$api.get(
            '/updTPlanCheckItem',
            {},
            {'id':parseInt(_key.value),'plan_progress':schedule.value,'actual_progress':actualProgress.value,'compare':comparison.value,'reason':causeAnalysis.value},
            (success)=>{
              if (success.data.error===0){
                for (let i = 0; i < itemData.value.length; i++) {
                  if (itemData.value[i].key === _key.value) {
                    itemData.value[i].plan_progress = schedule.value
                    itemData.value[i].actual_progress = actualProgress.value
                    itemData.value[i].compare = comparison.value
                    itemData.value[i].reason = causeAnalysis.value
                  }
                }
                showModifyItem.value = false
                message.success('修改成功')
              }
            },
            (error)=>{

            }
        )
      }

      const itemConfirmDel = (key:string) =>{
        proxy.$api.get(
            '/delPlanCheckItem',
            {},
            {'id':parseInt(key)},
            (success)=>{
              if (success.data.error === 0){
                itemData.value = itemData.value.filter(item => item.key != key)
                message.success('删除成功')
              }
            },
            (error)=>{

            }
        )
      }

      /*新增*/
      const handleConfirmInsert = () =>{
        //  进行新增操作
        proxy.$api.get(
            '/tSAddPlanCheck',
            {},
            {'id': $store.state.userInfo.id},
            (success) => {
              for (let i in success.data.data) {
                let id = success.data.data[i].id
                success.data.data[i].key = id.toString()
                success.data.data[i].created_at = success.data.data[i].created_at.slice(0, 10)
                sData.value.push(success.data.data[i])
              }
              message.success('新增成功')
            },
            (error) => {

            }
        )
      }

      return {
        sData,
        columns,
        pagination,
        searchInput,
        handleExport,
        handleConfirmTime,
        handleConfirmDel,

        columns2,
        showAllItem,
        itemData,
        handleSee,
        handleSeeOk,
        itemConfirmDel,

        showModifyItem,
        schedule,
        actualProgress,
        comparison,
        causeAnalysis,
        handleModify,
        handleModifyOk,

        handleConfirmInsert,

      }
    }
  })
</script>

<style scoped>

</style>