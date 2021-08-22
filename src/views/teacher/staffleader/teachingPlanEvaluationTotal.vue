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
  <a-modal v-model:visible="showSee" title="查看教案测评记录项" @ok="handleSeeOk()" okText="确认" cancelText="取消"

           width="50%">
    <a-table :columns="columns2" :data-source="itemData"
             :pagination="pagination" :rowKey="itemData.key">
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
  <a-modal v-model:visible="showModify" title="修改教案测评记录项" @ok="handleModifyOk()" okText="确认" cancelText="取消"
           width="30%">
    <label>教案上传（审批）情况（10%）:</label>
    <a-input-number placeholder="教案上传（审批）情况（10%）" style="width:100%;margin-bottom: 10px;"
                    v-model:value="uploadScore" :max="10" :min="0"></a-input-number>
    <label>教案格式规范性（10%）:</label>
    <a-input-number placeholder="请输入教案格式规范性（10%）" style="width:100%;margin-bottom: 10px;"
                    v-model:value="formatScore" :max="10" :min="0"></a-input-number>
    <label>教学内容完整性（40%）:</label>
    <a-input-number placeholder="请输入教学内容完整性（40%）" style="width:100%;margin-bottom: 10px;"
                    v-model:value="completeScore" :max="40" :min="0"></a-input-number>
    <label>教学设计科学性（40%）:</label>
    <a-input-number placeholder="请输入教学设计科学性（40%）" style="width:100%;margin-bottom: 10px;"
                    v-model:value="designScore" :max="40" :min="0"></a-input-number>
    <a-input-group compact>
      <label>合计:</label><br>
      <a-input-number placeholder="请输入合计" style="width:75%;margin-bottom: 10px;"
                      v-model:value="totalScore" :max="100" :min="0"></a-input-number>
      <a-button style="width:25%;margin-bottom: 10px" @click="calcTotalScore">
        计算总得分
      </a-button>
    </a-input-group>
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
  created_at: string;
  term: string;
  staff: string;
  staff_id: number;
  teacher: string;
  teacher_id: number;
}

export default defineComponent({
  name: "teachingPlanEvaluationTotal",
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
    const sData: Ref<TableDataType[]> = ref([])
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
    const {proxy}:any = getCurrentInstance()
    onMounted(()=>{
      proxy.$api.get(
          '/getTSEvaluation',
          {},
          {'id':$store.state.userInfo.id},
          (success) => {
            sData.value.splice(0, sData.value.length)
            for (let i in success.data.data) {
              let id = success.data.data[i].id
              success.data.data[i].key = id.toString()
              success.data.data[i].created_at = success.data.data[i].created_at.slice(0,10)
              sData.value.push(success.data.data[i])
            }
          },
          (error) => {
            console.log(error);
          }
      )
    })

    /*第二个弹出层*/
    const columns2 = [
      {title: '教师姓名', dataIndex: 'teacher', key: 'teacher', width: 80,align: 'center'},
      {title: '课程', dataIndex: 'course', key: 'course', width: 100, align: 'center'},
      {title: '合计', dataIndex: 'total_score', key: 'total_score', width: 120, align: 'center'},
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width: 120,
        slots: {customRender: 'operation'},
      },
    ]
    const itemData:any = ref([])
    const showSee = ref(false)
    const _key = ref()
    const handleSee = (key: string) => {
      proxy.$api.get(
          '/getTEvaluationItem',
          {},
          {'id':parseInt(key)},
          (success)=>{
            showSee.value = true
            itemData.value.splice(0, itemData.value.length)
            for (let i in success.data.data) {
              let id = success.data.data[i].id
              success.data.data[i].key = id.toString()
              itemData.value.push(success.data.data[i])
            }
          },
          (error)=>{

          }
      )
    }
    const handleSeeOk = () => {
      showSee.value = false
    }
    //弹出按钮
    const handleExport = computed(()=>(id)=>{
      return 'http://119.29.185.52:9001/exportTEvaluation?id='+parseInt(id);
    })
    //确认按钮
    const handleConfirmTime = (key: string) => {
      proxy.$api.get(
          '/checkTeachingEval',
          {},
          {'id':parseInt(key),'teacher_id':$store.state.userInfo.id},
          (success)=>{
            if (success.data.error === 0){
              sData.value.splice(0, sData.value.length)
              for (let i in success.data.data) {
                let id = success.data.data[i].id
                success.data.data[i].key = id.toString()
                success.data.data[i].created_at = success.data.data[i].created_at.slice(0,10)
                sData.value.push(success.data.data[i])
              }
            }
          },
          (error)=>{

          }
      )
    }
    //删除按钮
    const handleConfirmDel = (key: string) => {
      proxy.$api.get(
          '/delTEvaluation',
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



    const itemConfirmDel = (key: string) => {
      proxy.$api.get(
          '/delTEvaluationItem',
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

    /*第三个弹出层*/
    //处理修改函数，传入key值
    const uploadScore = ref('')
    const formatScore = ref('')
    const completeScore = ref('')
    const designScore = ref('')
    const totalScore = ref('')
    const showModify = ref(false)
    const handleModify = (key: string) => {
      _key.value = key
      //显示弹出层
      for (let i = 0; i < itemData.value.length; i++) {
        if (itemData.value[i].key === _key.value) {
          uploadScore.value = itemData.value[i].upload_score
          formatScore.value = itemData.value[i].format_score
          completeScore.value = itemData.value[i].complete_score
          designScore.value = itemData.value[i].design_score
          totalScore.value = itemData.value[i].total_score
        }
      }
      showModify.value = true
    }
    const calcTotalScore = () => {
      totalScore.value = uploadScore.value + formatScore.value + completeScore.value + designScore.value
    }
    const handleModifyOk = () => {
      proxy.$api.get(
          '/updTEvaluationItem',
          {},
          {'id':parseInt(_key.value),'upload_score':uploadScore.value,'format_score':formatScore.value,'complete_score':completeScore.value,'design_score':designScore.value,'total_score':totalScore.value},
          (success)=>{
            if (success.data.error === 0){
              for (let i = 0; i < itemData.value.length; i++) {
                if (itemData.value[i].key === _key.value) {
                  itemData.value[i].upload_score = uploadScore.value
                  itemData.value[i].format_score = formatScore.value
                  itemData.value[i].complete_score = completeScore.value
                  itemData.value[i].design_score = designScore.value
                  itemData.value[i].total_score = totalScore.value
                }
              }
              showModify.value = false
              message.success('修改成功')
            }else{
              message.error('修改失败')
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
          '/tAddTEvaluation',
          {},
          {'id':$store.state.userInfo.id},
          (success)=>{
            for (let i in success.data.data) {
              let id = success.data.data[i].id
              success.data.data[i].key = id.toString()
              success.data.data[i].created_at = success.data.data[i].created_at.slice(0,10)
              sData.value.push(success.data.data[i])
            }
            message.success('新增成功')
          },
          (error)=>{

          }
      )
    }
    return {
      searchInput,
      state,
      pagination,
      columns,
      sData,
      handleExport,
      handleConfirmTime,
      handleConfirmDel,

      columns2,
      showSee,
      itemData,
      handleSee,
      handleSeeOk,
      itemConfirmDel,

      handleModify,
      handleModifyOk,
      calcTotalScore,
      uploadScore,
      formatScore,
      completeScore,
      designScore,
      totalScore,
      showModify,

      handleConfirmInsert,
    }
  }
})
</script>

<style scoped>

</style>