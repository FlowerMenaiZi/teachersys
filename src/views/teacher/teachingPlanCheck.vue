<!--
个人授课计划
-->
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
    </template>
  </a-table>
  <a-modal v-model:visible="showAllItem" title="查看授课情况表" @ok="handleSeeOk()" okText="确认" cancelText="取消" width="70%">
    <a-table :columns="columns2" :data-source="itemData" :pagination="pagination">
      <template #operation="{ record }">
        <a-button type="primary" :style="{margin:'0 10px 10px 0'}"
                  @click="handleModify(record.teaching_plan_check_item_id)">
          修改
        </a-button>
      </template>
    </a-table>
  </a-modal>
  <a-modal v-model:visible="showSetItem" title="修改授课情况项" @ok="handleModifyOk()"
           okText="确认" cancelText="取消" width="500px">

    <label>计划进度：</label>
    <a-input placeholder="请输入计划进度" style="margin-bottom: 10px" v-model:value="planProgress"></a-input>

    <label>实际进度：</label>
    <a-input placeholder="请输入实际进度" style="margin-bottom: 10px" v-model:value="actualProgress"></a-input>

    <label>实际与计划比较情况：</label>
    <a-input placeholder="请输入实际与计划比较情况" style="margin-bottom: 10px" v-model:value="compare"></a-input>

    <label>原因分析：</label>
    <a-input placeholder="请输入原因分析" style="margin-bottom: 10px" v-model:value="reason"></a-input>

  </a-modal>
</template>

<script lang="ts">
  import {defineComponent, ref, reactive, UnwrapRef, Ref, onMounted, getCurrentInstance} from 'vue';
  import {message} from 'ant-design-vue';
  import {SearchOutlined, CheckOutlined, EditOutlined} from '@ant-design/icons-vue';
  import $store from "../../store/index"

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
      //分页数
      const pagination = {
        pageSize: 5
      };

      //搜索框状态
      const state = reactive({
        searchText: '',
        searchedColumn: '',
      });

      const sData: Ref<TableDataType[]> = ref([]);
      /*获取数据*/
      const {proxy}: any = getCurrentInstance()
      onMounted(() => {
        proxy.$api.get(
            '/teachingPlanItem',
            {},
            {'id': $store.state.userInfo.id},
            (success) => {
              sData.value.splice(0, sData.value.length)
              for (let i in success.data.data) {
                let id = success.data.data[i].id
                success.data.data[i].key = id.toString()
                success.data.data[i].created_at = success.data.data[i].created_at.slice(0, 10)
                sData.value.push(success.data.data[i])
              }
            },
            (error) => {

            }
        )
      })
      //设置表头及字段排序或字段搜索
      const columns = [
        {
          title: '日期',
          dataIndex: 'created_at',
          sorter: (a: TableDataType, b: TableDataType) => Date.parse(a.created_at) - Date.parse(b.created_at)
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
      const columns2 = [
        {title: '课程', dataIndex: 'name', key: 'name', width: 150},
        {title: '班级', dataIndex: 'clazz', key: 'clazz', width: 100},
        {
          title: '操作',
          dataIndex: 'operation',
          key: 'operation',
          width: 150,
          slots: {customRender: 'operation'},
        },
      ];
      const itemData: any = ref([])
      /*点击查看*/
      const handleCheck = () => {
        proxy.$api.get(
            '/getTPlanCheckItem',
            {},
            {'id': $store.state.userInfo.id},
            (success) => {
              itemData.value.splice(0, itemData.value.length)
              for (let i in success.data.data) {
                let id = success.data.data[i].id
                success.data.data[i].key = id.toString()
                success.data.data[i].clazz = success.data.data[i].clazz.join("，")
                itemData.value.push(success.data.data[i])
              }

              showAllItem.value = true
            },
            (error) => {
            }
        )
      }


      const handleSeeOk = () => {
        showAllItem.value = false
      }

      /*第三个弹出层*/
      const showSetItem = ref(false)
      const _id = ref()
      const planProgress = ref('')    //计划进度
      const actualProgress = ref('')  //实际进度
      const compare = ref('')         //实际与计划比较情况
      const reason = ref('')          //原因
      /*点击修改*/
      const handleModify = (key: number) => {
        _id.value = key
        for (let i in itemData.value) {
          if (itemData.value[i].teaching_plan_check_item_id === _id.value) {
            planProgress.value = itemData.value[i].plan_progress
            actualProgress.value = itemData.value[i].actual_progress
            compare.value = itemData.value[i].compare
            reason.value = itemData.value[i].reason
          }
        }
        showSetItem.value = true
      }
      /*确认修改*/
      const handleModifyOk = () => {
        console.log(parseInt(_id.value));
        proxy.$api.get(
            '/updTPlanCheckItem',
            {},
            {
              id: parseInt(_id.value),
              'plan_progress': planProgress.value,
              'actual_progress': actualProgress.value,
              'compare': compare.value,
              'reason': reason.value
            },
            (success) => {
              if (success.data.error === 0) {
                for (let i in itemData.value) {
                  if (itemData.value[i].key === _id.value) {
                    itemData.value[i].plan_progress = planProgress.value
                    itemData.value[i].actual_progress = actualProgress.value
                    itemData.value[i].compare = compare.value
                    itemData.value[i].reason = reason.value
                  }
                }
                showSetItem.value = false
              }
            },
            (error) => {

            }
        )
      }


      return {
        sData,
        columns,
        pagination,
        handleCheck,
        showAllItem,

        handleSeeOk,
        columns2,
        itemData,
        handleModify,
        showSetItem,
        handleModifyOk,
        planProgress,
        actualProgress,
        compare,
        reason,
      }
    }
  })
</script>

<style scoped>

</style>