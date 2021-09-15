<!--
作业检查记录
-->
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
  <a-modal v-model:visible="showSee" title="查看作业批改情况表" @ok="handleSeeOk()" okText="确认" cancelText="取消" width="70%">
    <a-table :columns="columns2" :data-source="itemData" :scroll="{ x: 1200, y: 300 }" :pagination="pagination">
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
  <a-modal v-model:visible="showModify" title="修改学期作业检查项" @ok="handleModifyOk()" okText="确认" cancelText="取消"
           width="40%">
    <label>周课时及实习周数:</label>
    <a-input-number placeholder="请输入周课时及实习周数" style="width:100%;margin-bottom: 10px;"
                    v-model:value="weeklyClazzHour"></a-input-number>
    <label>布置书面作业次数:</label>
    <a-input-number placeholder="请输入布置书面作业次数" style="width:100%;margin-bottom: 10px;"
                    v-model:value="assignHomeworkNum"></a-input-number>
    <label>批改书面作业次数:</label>
    <a-input-number placeholder="请输入批改书面作业次数" style="width:100%;margin-bottom: 10px;"
                    v-model:value="corHomeworkNum"></a-input-number>
    <label>实习（验）报告（个）:</label>
    <a-input-number placeholder="请输入实习（验）报告（个）" style="width:100%;margin-bottom: 10px;"
                    v-model:value="internship"></a-input-number>
    <label>其他作业批改次数:</label>
    <a-input-number placeholder="请输入其他作业批改次数" style="width:100%;margin-bottom: 10px;"
                    v-model:value="orderHomeworkNum"></a-input-number>
    <label>评价:</label>
    <a-input placeholder="请输入评价" style="margin-bottom: 10px;" v-model:value="evaluateVal"></a-input>
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
  import {defineComponent, reactive, ref, Ref, getCurrentInstance, onMounted, computed} from 'vue';
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
    name: "homeworkCheck",
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
      /*获取数据*/
      const {proxy}: any = getCurrentInstance()
      onMounted(() => {
        proxy.$api.get(
            '/getTSHomeworkCheck',
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
              console.log(error);
            }
        )
      })
      //导出按钮
      const handleExport = computed(() => (id) => {
        return 'http://119.29.185.52:9001/exportHCI?id=' + parseInt(id);
      })
      //确认按钮
      const handleConfirmTime = (key: string) => {
        proxy.$api.get(
            '/checkHomework',
            {},
            {'id': parseInt(key), 'teacher_id': $store.state.userInfo.id},
            (success) => {
              if (success.data.error === 0) {
                for (let i in sData.value) {
                  if (sData.value[i].key === key) {
                    sData.value[i].teacher = $store.state.userInfo.user
                  }
                }
              }
            },
            (error) => {

            }
        )
      }
      //删除按钮
      const handleConfirmDel = (key: string) => {
        proxy.$api.get(
            '/delHomeworkCheck',
            {},
            {'id': parseInt(key)},
            (success) => {
              if (success.data.error === 0) {
                sData.value = sData.value.filter(item => item.key != key)
                message.success('删除成功')
              } else {
                message.success('删除失败')
              }
            },
            (error) => {

            }
        )
      }

      /*第二个弹出层*/
      const columns2 = [
        {title: '教师姓名', width: 100, dataIndex: 'teacher', key: 'teacher', fixed: 'left', align: 'center'},
        {title: '授课班级', dataIndex: 'clazz', key: 'clazz', width: 125, fixed: 'left', align: 'center'},
        {title: '课程名称', dataIndex: 'course', key: 'course', width: 130, fixed: 'left', align: 'center'},
        {title: '周课时及实习周数', dataIndex: 'weekly_class_hour', key: 'weekly_class_hour', width: 150, align: 'center'},
        {
          title: '布置书面作业次数',
          dataIndex: 'assign_homework_number',
          key: 'assign_homework_number',
          width: 150,
          align: 'center'
        },
        {
          title: '批改书面作业次数',
          dataIndex: 'correcting_homework_number',
          key: 'correcting_homework_number',
          width: 150,
          align: 'center'
        },
        {title: '实习（验）报告（个）', dataIndex: 'internship', key: 'internship', width: 200, align: 'center'},
        {
          title: '其他作业批改次数',
          dataIndex: 'other_homework_number',
          key: 'other_homework_number',
          width: 150,
          align: 'center'
        },
        {title: '评价', dataIndex: 'evaluate', key: 'evaluate', width: 100, align: 'center'},
        {
          title: '操作',
          dataIndex: 'operation',
          key: 'operation',
          fixed: 'right',
          width: 90,
          slots: {customRender: 'operation'},
        },
      ];
      const itemData: any = ref([])
      const showSee = ref(false)
      /*查看按钮*/
      const handleSee = (key: string) => {
        proxy.$api.get(
            '/getHomeworkCheckItem',
            {},
            {'id': parseInt(key)},
            (success) => {
              itemData.value.splice(0, itemData.value.length)
              for (let i in success.data.data) {
                let id = success.data.data[i].id
                success.data.data[i].key = id.toString()
                itemData.value.push(success.data.data[i])
              }
              showSee.value = true
            },
            (error) => {
            }
        )
      }
      const handleSeeOk = () => {
        showSee.value = false
      }

      /*子项删除按钮*/
      const itemConfirmDel = (key: string) => {
        proxy.$api.get(
            '/delHomeworkCheckItem',
            {},
            {'id': parseInt(key)},
            (success) => {
              if (success.data.error === 0) {
                itemData.value = itemData.value.filter(item => item.key != key)
                message.success('删除成功')
              } else {
                message.success('删除失败')
              }
            },
            (error) => {

            }
        )
      }
      /*第三个弹出层*/
      const weeklyClazzHour = ref('')
      const assignHomeworkNum = ref('')
      const corHomeworkNum = ref('')
      const internship = ref('')
      const orderHomeworkNum = ref('')
      const evaluateVal = ref('')
      const showModify = ref(false)
      const _key = ref()
      /*修改按钮*/
      const handleModify = (key: string) => {
        showModify.value = true
        _key.value = key
        //显示弹出层
        for (let i = 0; i < itemData.value.length; i++) {
          if (itemData.value[i].key === _key.value) {
            weeklyClazzHour.value = itemData.value[i].weekly_class_hour
            assignHomeworkNum.value = itemData.value[i].assign_homework_number
            corHomeworkNum.value = itemData.value[i].correcting_homework_number
            internship.value = itemData.value[i].internship
            orderHomeworkNum.value = itemData.value[i].other_homework_number
            evaluateVal.value = itemData.value[i].evaluate
          }
        }
      }
      /*确认修改*/
      const handleModifyOk = () => {
        proxy.$api.get(
            '/updHomeworkCheckItem',
            {},
            {
              'id': parseInt(_key.value),
              'weekly_class_hour': weeklyClazzHour.value,
              'assign_homework_number': assignHomeworkNum.value,
              'correcting_homework_number': corHomeworkNum.value,
              'internship': internship.value,
              'other_homework_number': orderHomeworkNum.value,
              'evaluate': evaluateVal.value
            },
            (success) => {
              if (success.data.error === 0) {
                for (let i = 0; i < itemData.value.length; i++) {
                  if (itemData.value[i].key === _key.value) {
                    itemData.value[i].weekly_class_hour = weeklyClazzHour.value
                    itemData.value[i].assign_homework_number = assignHomeworkNum.value
                    itemData.value[i].correcting_homework_number = corHomeworkNum.value
                    itemData.value[i].internship = internship.value
                    itemData.value[i].other_homework_number = orderHomeworkNum.value
                    itemData.value[i].evaluate = evaluateVal.value
                  }
                }
                message.success('修改成功')
                showModify.value = false
              }
            },
            (error) => {

            }
        )
      }
      /*新增*/
      const handleConfirmInsert = () => {
        //  进行新增操作
        proxy.$api.get(
            '/tSAddHomeworkCheck',
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

        showModify,
        weeklyClazzHour,
        assignHomeworkNum,
        corHomeworkNum,
        internship,
        orderHomeworkNum,
        evaluateVal,
        handleModify,
        handleModifyOk,

        handleConfirmInsert,
      }
    }
  })
</script>

<style scoped>

</style>