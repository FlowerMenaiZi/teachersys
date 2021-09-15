<!--
学期作业管理
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
  <a-modal v-model:visible="showHomeItem" title="查看学期作业检查项" @ok="handleOk()" okText="确认" cancelText="取消"
           width="80%">
    <a-table :columns="columns2" :data-source="itemData" :scroll="{ x: 1200}"
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

  <a-button type="primary" :style="{margin:'0 10px 0 0'}" @click="handleAdd">新增
    <a-modal v-model:visible="visibleTwo" title="新增学期作业记录" @ok="handleAddOk" okText="确认" cancelText="取消">
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
  import {defineComponent, reactive, ref, Ref,onMounted,getCurrentInstance,computed} from 'vue';
  import {message} from 'ant-design-vue';
  import {CheckOutlined, EditOutlined, SearchOutlined} from '@ant-design/icons-vue';

  //设置接收数据的接口
  interface TableDataType {
    key: string;
    id:number;
    created_at: string;
    term: string;
    staff: string;
    teacher_id: number;
    teacher: string;
  }

  export default defineComponent({
    name: 'homeworkCheck',
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
      const {proxy}:any = getCurrentInstance()
      const sData: Ref<TableDataType[]> = ref([]);
      //获取数据
      const sectionData:any = ref([]);
      onMounted(()=>{
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
            '/getHomeworkCheck',
            {},
            {},
            (success) => {
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
        {title: '授课班级', dataIndex: 'clazz', key: 'clazz', width: 125, fixed: 'left', align: 'center'},
        {title: '课程名称', dataIndex: 'course', key: 'course', width: 130, fixed: 'left', align: 'center'},
        {title: '周课时及实习周数', dataIndex: 'weekly_class_hour', key: 'weekly_class_hour', width: 150, align: 'center'},
        {title: '布置书面作业次数', dataIndex: 'assign_homework_number', key: 'assign_homework_number', width: 150, align: 'center'},
        {title: '批改书面作业次数', dataIndex: 'correcting_homework_number', key: 'correcting_homework_number', width: 150, align: 'center'},
        {title: '实习（验）报告（个）', dataIndex: 'internship', key: 'internship', width: 200, align: 'center'},
        {title: '其他作业批改次数', dataIndex: 'other_homework_number', key: 'other_homework_number', width: 150, align: 'center'},
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
      const showHomeItem = ref(false)
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
      //确认删除
      const confirm = (key: string) => {
        proxy.$api.get(
            '/delHomeworkCheck',
            {},
            {'id':parseInt(key)},
            (success)=>{
              if (success.data.error === 0) {
                sData.value.splice(0, sData.value.length)
                for (let i in success.data.data) {
                  let id = success.data.data[i].id
                  success.data.data[i].key = id.toString()
                  success.data.data[i].created_at = success.data.data[i].created_at.slice(0,10)
                  sData.value.push(success.data.data[i])
                }
                message.success('删除成功')
              } else {
                message.success('删除失败')
              }
            },
            (error)=>{

            }
        )
      };
      /*每一项导出*/
      const handleExport = computed(()=>(id)=>{
        return 'http://119.29.185.52:9001/exportHCI?id='+parseInt(id);
      })
      const itemData:any = ref([])
      /*查看每一项*/
      const handleSee = (key: string) => {
        showHomeItem.value = true
        proxy.$api.get(
            '/getHomeworkCheckItem',
            {},
            {'id':parseInt(key)},
            (success)=>{
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
      //处理修改函数，传入key值
      const weeklyClazzHour = ref('')
      const assignHomeworkNum = ref('')
      const corHomeworkNum = ref('')
      const internship = ref('')
      const orderHomeworkNum = ref('')
      const evaluateVal = ref('')
      /*点击修改*/
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
      /*确定修改*/
      const handleModifyOk = () => {
        proxy.$api.get(
            '/updHomeworkCheckItem',
            {},
            {'id':parseInt(_key.value),'weekly_class_hour':weeklyClazzHour.value,'assign_homework_number':assignHomeworkNum.value,'correcting_homework_number':corHomeworkNum.value,'internship':internship.value,'other_homework_number':orderHomeworkNum.value,'evaluate':evaluateVal.value},
            (success)=>{
              if (success.data.error === 0){
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
            (error)=>{

            }
        )
      }
      /*删除子项*/
      const itemConfirm = (key:string) =>{
        proxy.$api.get(
            '/delHomeworkCheckItem',
            {},
            {'id':parseInt(key)},
            (success)=>{
              if (success.data.error === 0) {
                itemData.value = itemData.value.filter(item => item.key != key)
                message.success('删除成功')
              } else {
                message.success('删除失败')
              }
            },
            (error)=>{

            }
        )
      }

      //获取选择的教研室
      const selDepartment = ref('')
      const handleModifySelect = (value: string) => {
        selDepartment.value = value
      };
      //处理弹出层点击ok
      const handleOk = () => {
        showHomeItem.value = false
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
        for (let i = 0;i<sData.value.length;i++){
          if (sData.value[i].staff === curSelValue.value){
            isTeachingSec.value = true
          }
        }
        if (isTeachingSec.value){
          message.error('该教研室已存在')
          return false
        }
        proxy.$api.get(
            '/addHomeworkCheck',
            {},
            {'staff_id':curSelValue.value},
            (success)=>{
              if (success.data.error === 0) {
                sData.value.splice(0, sData.value.length)
                for (let i in success.data.data) {
                  let id = success.data.data[i].id
                  success.data.data[i].key = id.toString()
                  success.data.data[i].created_at = success.data.data[i].created_at.slice(0,10)
                  sData.value.push(success.data.data[i])
                }
                message.success('添加成功')
              } else {
                message.success('添加失败')
              }
            },
            (error)=>{

            }
        )
        curSelValue.value = ''
        visibleTwo.value = false;
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
        weeklyClazzHour,
        assignHomeworkNum,
        corHomeworkNum,
        internship,
        orderHomeworkNum,
        evaluateVal,
        handleModifyOk,
        itemConfirm,
        showHomeItem
      };
    },
  });
</script>

<style>
  .ant-spin-container .ant-table-fixed-left .ant-table-tbody > tr{
    height: 107px !important;
  }
</style>