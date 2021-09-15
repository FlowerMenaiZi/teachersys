<!--
教案评测记录管理
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
  <a-modal v-model:visible="showSee" title="查看教案测评记录项" @ok="handleOk()" okText="确认" cancelText="取消"
           width="90%">
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
                @confirm="itemConfirm(record.key)"
        >
          <a-button type="danger">删除</a-button>
        </a-popconfirm>
      </template>
    </a-table>
  </a-modal>
  <a-modal v-model:visible="showModify" title="修改教案测评记录项" @ok="handleModifyOk()" okText="确认" cancelText="取消"
           width="40%">
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
    name: "teachingPlanEvaluation",
    components: {
      SearchOutlined,
      CheckOutlined,
      EditOutlined,
    },
    setup() {
      //搜索框
      const searchInput = ref()
      //分页数
      const pagination = {
        pageSize: 5
      }
      //模拟数据，使用TableDataType接口验证数据
      const sData: Ref<TableDataType[]> = ref([])
      const itemData: any = ref([])
      //教研室
      const sectionData: any = ref([])
      /*获取数据*/
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
            '/getTEvaluation',
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
      })
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
      ]
      const columns2 = [
        {title: '教师姓名', width: 100, dataIndex: 'teacher', key: 'teacher', fixed: 'left', align: 'center'},
        {title: '课程', dataIndex: 'course', key: 'course', width: 140, fixed: 'left', align: 'center'},
        {
          title: '教案上传（审批）情况（10%）', dataIndex: 'upload_score', key: 'upload_score', width: 140, align: 'center',
          onCell: () => {
            return {
              style: {
                maxWidth: 140,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                cursor: 'pointer'
              }
            }
          },
          ellipsis: true,
        },
        {
          title: '教案格式规范性（10%）', dataIndex: 'format_score', key: 'format_score', width: 140, align: 'center',
          onCell: () => {
            return {
              style: {
                maxWidth: 140,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                cursor: 'pointer'
              }
            }
          },
          ellipsis: true,
        },
        {
          title: '教学内容完整性（40%）', dataIndex: 'complete_score', key: 'complete_score', width: 140, align: 'center',
          onCell: () => {
            return {
              style: {
                maxWidth: 140,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                cursor: 'pointer'
              }
            }
          },
          ellipsis: true,
        },
        {
          title: '教学设计科学性（40%）', dataIndex: 'design_score', key: 'design_score', width: 140, align: 'center',
          onCell: () => {
            return {
              style: {
                maxWidth: 140,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                cursor: 'pointer'
              }
            }
          },
          ellipsis: true,
        },
        {title: '合计', dataIndex: 'total_score', key: 'total_score', width: 100, align: 'center'},
        {
          title: '操作',
          dataIndex: 'operation',
          key: 'operation',
          fixed: 'right',
          width: 120,
          slots: {customRender: 'operation'},
        },
      ]
      //处理搜索结果
      const handleSearch = (selectedKeys: any, confirm: any, dataIndex: any) => {
        confirm()
        state.searchText = selectedKeys[0]
        state.searchedColumn = dataIndex
      };
      //处理重置事件，清除搜索的内容
      const handleReset = (clearFilters: any) => {
        clearFilters()
        state.searchText = ''
      }
      //设置当前点击的key值为空
      const _key = ref()
      const curSelValue = ref('')
      const showModify = ref(false)
      const showSee = ref(false)
      const handleSee = (key: string) => {
        showSee.value = true
        proxy.$api.get(
            '/getTEvaluationItem',
            {},
            {'id': parseInt(key)},
            (success) => {
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
      //处理修改函数，传入key值
      const uploadScore = ref('')
      const formatScore = ref('')
      const completeScore = ref('')
      const designScore = ref('')
      const totalScore = ref('')
      const handleModify = (key: string) => {
        showModify.value = true
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
      }
      /*计算总分*/
      const calcTotalScore = () => {
        totalScore.value = uploadScore.value + formatScore.value + completeScore.value + designScore.value
      }
      /*确认修改*/
      const handleModifyOk = () => {
        proxy.$api.get(
            '/updTEvaluationItem',
            {},
            {
              'id': parseInt(_key.value),
              'upload_score': uploadScore.value,
              'format_score': formatScore.value,
              'complete_score': completeScore.value,
              'design_score': designScore.value,
              'total_score': totalScore.value
            },
            (success) => {
              if (success.data.error === 0) {
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
              } else {
                message.error('修改失败')
              }
            },
            (error) => {

            }
        )
      }
      /*子项删除*/
      const itemConfirm = (key: string) => {
        proxy.$api.get(
            '/delTEvaluationItem',
            {},
            {'id': parseInt(key)},
            (success) => {
              if (success.data.error === 0) {
                itemData.value = itemData.value.filter(item => item.key != key)
                message.success('删除成功')
              }
            },
            (error) => {

            }
        )
      }
      /*导出*/
      const handleExport = computed(() => (id) => {
        return 'http://119.29.185.52:9001/exportTEvaluation?id=' + parseInt(id);
      })
      //获取选择的教研室
      const selDepartment = ref('')
      const handleModifySelect = (value: string) => {
        selDepartment.value = value
      };
      //处理弹出层点击ok
      const handleOk = () => {
        showModify.value = false
      };
      //确认删除
      const confirm = (key: string) => {
        proxy.$api.get(
            '/delTEvaluation',
            {},
            {'id': parseInt(key)},
            (success) => {
              if (success.data.error === 0) {
                sData.value.splice(0, sData.value.length)
                for (let i in success.data.data) {
                  let id = success.data.data[i].id
                  success.data.data[i].key = id.toString()
                  success.data.data[i].created_at = success.data.data[i].created_at.slice(0, 10)
                  sData.value.push(success.data.data[i])
                }
                message.success('删除成功')
              } else {
                message.success('删除失败')
              }
            },
            (error) => {

            }
        )
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
        for (let i = 0; i < sData.value.length; i++) {
          if (sData.value[i].staff === curSelValue.value) {
            isTeachingSec.value = true
          }
        }
        if (isTeachingSec.value) {
          message.error('该教研室已存在')
          return false
        }
        proxy.$api.get(
            '/addTEvaluation',
            {},
            {'staff_id': parseInt(curSelValue.value)},
            (success) => {
              sData.value.splice(0, sData.value.length)
              for (let i in success.data.data) {
                let id = success.data.data[i].id
                success.data.data[i].key = id.toString()
                success.data.data[i].created_at = success.data.data[i].created_at.slice(0, 10)
                sData.value.push(success.data.data[i])
              }
              message.success('添加成功')
            },
            (error) => {

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
        uploadScore,
        formatScore,
        completeScore,
        designScore,
        totalScore,
        handleModifyOk,
        itemConfirm,
        calcTotalScore,
        showSee
      };
    },
  });
</script>

<style>
  .ant-spin-container .ant-table-fixed-left .ant-table-tbody > tr {
    height: 107px !important;
  }
</style>