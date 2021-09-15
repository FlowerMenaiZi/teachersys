<!--
班级选课管理
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
      <a-button type="primary" :style="{margin:'0 10px 0 0'}" @click="handleModify(record.key)">修改
      </a-button>
      <a-popconfirm
              title="是否要删除？"
              ok-text="是"
              cancel-text="否"
              @confirm="confirm(record.key)">
        <a-button type="danger">删除</a-button>
      </a-popconfirm>
    </template>
  </a-table>
  <a-modal v-model:visible="showModify" title="修改" @ok="handleOk()" okText="确认" cancelText="取消">
    <label>班级名</label>
    <a-select
            show-search
            style="width: 100%;margin-bottom: 10px"
            @change="handleClazzChange"
            v-model:value="curClazzName"
    >
      <a-select-option v-for="(item,index) in allClazz" :value="item.name" :key="item.key">
        {{ item.name }}
      </a-select-option>
    </a-select>
    <label>课程</label><br/>
    <a-select
            show-search
            style="width: 100%"
            @change="handleCourseChange"
            v-model:value="curCourseValue">
      <a-select-option v-for="(item,index) in clazzTeacher" :value="[item.name,item.teacher_name]" :key="item.key">
        {{ item.name }} - {{ item.teacher_name }}
      </a-select-option>
    </a-select>
  </a-modal>
  <a-button type="primary" :style="{margin:'0 10px 0 0'}" @click="handleAdd">添加
    <a-modal v-model:visible="visibleTwo" title="添加" @ok="handleAddOk" okText="确认" cancelText="取消">
      <label>班级名</label>
      <a-select
              show-search
              style="width: 100%;margin-bottom: 10px"
              @change="handleClazzChange"
              v-model:value="curClazzName">
        <a-select-option v-for="(item,index) in allClazz" :value="item.name" :key="item.key">
          {{ item.name }}
        </a-select-option>
      </a-select>
      <label>课程</label><br/>
      <a-select
              show-search
              style="width: 100%"
              @change="handleCourseChange"
              v-model:value="curCourseValue">
        <a-select-option v-for="(item,index) in clazzTeacher" :value="[item.name,item.teacher_name]" :key="item.key">
          {{ item.name }} - {{ item.teacher_name }}
        </a-select-option>
      </a-select>
    </a-modal>
  </a-button>
</template>

<script lang="ts">
  import {defineComponent, ref, reactive, UnwrapRef, Ref, onMounted, getCurrentInstance} from 'vue';
  import {message} from 'ant-design-vue';
  import {SearchOutlined, CheckOutlined, EditOutlined} from '@ant-design/icons-vue';

  //设置接收数据的接口
  interface TableDataType {
    key: string;
    id: number;
    clazz_name: string;
    course_name: string;
    teacher_name: string;
    clazz_id: number;
    course_id: number;
    teacher_id: number;
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
      const sData: Ref<TableDataType[]> = ref([]);
      const clazzTeacher: any = ref([])
      const allClazz: any = ref([])
      /*获取数据*/
      const {proxy}: any = getCurrentInstance()
      onMounted(() => {
        proxy.$api.get(
            '/getCourse',
            {},
            {},
            (success) => {
              for (let i in success.data.data) {
                let id = success.data.data[i].id
                success.data.data[i].key = id.toString()
                clazzTeacher.value.push(success.data.data[i])
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
        proxy.$api.get(
            '/getClazzCourse',
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
      })
      //搜索框状态
      const state = reactive({
        searchText: '',
        searchedColumn: '',
      });
      //设置表头及字段排序或字段搜索
      const columns = [
        {
          title: '班级名',
          dataIndex: 'clazz_name',
          slots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender',
          },
          onFilter: (value: string, record: TableDataType) =>
              record.clazz_name.toString().toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible: any) => {
            if (visible) {
              setTimeout(() => {
                searchInput.value.focus();
              }, 0);
            }
          },
        },
        {
          title: '课程名',
          dataIndex: 'course_name',
          slots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender',
          },
          onFilter: (value: string, record: TableDataType) =>
              record.course_name.toString().toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible: any) => {
            if (visible) {
              setTimeout(() => {
                searchInput.value.focus();
              }, 0);
            }
          },
        },
        {
          title: '授课老师',
          dataIndex: 'teacher_name',
          slots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender',
          },
          onFilter: (value: string, record: TableDataType) =>
              record.teacher_name.toString().toLowerCase().includes(value.toLowerCase()),
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
      //设置当前点击的值为空
      const curCourseValue = ref('')
      //设置当前点击的key值为空
      const _key = ref()
      const curClazzName = ref('')
      const showModify = ref(false)
      //处理修改函数，传入key值
      const handleModify = (key: string) => {
        _key.value = key
        for (let i of sData.value) {
          if (i.key === _key.value) {
            //设置弹出层input显示的值
            curClazzName.value = i.clazz_name
            curCourseValue.value = i.course_name + ' - ' + i.teacher_name
          }
          showModify.value = true
        }
      }
      /*是否选择了新的班级*/
      const selClazzChange = ref('')
      const handleClazzChange = (value: string) => {
        selClazzChange.value = value
      };
      /*是否选择新的课程*/
      const selCourseChange = ref('')
      const handleCourseChange = (value: string) => {
        selCourseChange.value = value
        curCourseValue.value = selCourseChange.value[0] + ' - ' + selCourseChange.value[1]
      };
      //处理弹出层点击ok
      /*修改课程*/
      const handleOk = () => {
        let courseAndTeacher = curCourseValue.value.split('-')
        proxy.$api.get(
            '/updClazzCourse',
            {},
            {'id':parseInt(_key.value),'course': courseAndTeacher[0].trim(), 'clazz': curClazzName.value},
            (success) => {
              if (success.data.error === 0) {
                sData.value.splice(0, sData.value.length)
                for (let i in success.data.data) {
                  let id = success.data.data[i].id
                  success.data.data[i].key = id.toString()
                  sData.value.push(success.data.data[i])
                }
                message.success('修改成功')
                showModify.value = false;
              } else {
                message.error('修改失败')
              }

            },
            (error) => {

            }
        )
      };
      //确认删除
      const confirm = (key: string) => {
        proxy.$api.get(
            '/delClazzCourse',
            {},
            {'id': parseInt(key)},
            (success) => {
              if (success.data.error === 0) {
                sData.value.splice(0, sData.value.length)
                for (let i in success.data.data) {
                  let id = success.data.data[i].id
                  success.data.data[i].key = id.toString()
                  sData.value.push(success.data.data[i])
                }
                message.success('删除成功')
              } else {
                message.success('删除失败')
              }
            },
            (error) => {}
        )
      };

      //第二个弹出层默认为否
      const visibleTwo = ref(false);
      //处理点击添加事件
      const handleAdd = () => {
        visibleTwo.value = true;
        curCourseValue.value = ''
        curClazzName.value = ''
      }

      //处理添加弹出层的确认事件
      const handleAddOk = () => {
        //判断是否为空
        if (curClazzName.value === '') {
          message.error('请输入班级名')
          return false
        } else if (curCourseValue.value === '') {
          message.error('请选择课程')
          return false
        } else {
          let courseAndTeacher = curCourseValue.value.split('-')
          // 判断是否已经存在该课程
          for (let i in sData.value) {
            if (sData.value[i].clazz_name == curClazzName.value
                &&
                sData.value[i].course_name == courseAndTeacher[0].trim()) {
              message.error('该课程已存在')
              return false
            }
          }
          proxy.$api.get(
              '/addClazzCourse',
              {},
              {'course': courseAndTeacher[0].trim(), 'clazz': curClazzName.value},
              (success) => {
                if (success.data.error === 0) {
                  sData.value.splice(0, sData.value.length)
                  for (let i in success.data.data) {
                    let id = success.data.data[i].id
                    success.data.data[i].key = id.toString()
                    sData.value.push(success.data.data[i])
                  }
                  message.success('添加成功')
                } else {
                  message.success('添加失败')
                }
                visibleTwo.value = false;
              },
              (error) => {

              }
          )
        }

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
        curCourseValue,
        handleAdd,
        handleAddOk,
        visibleTwo,
        handleClazzChange,
        handleCourseChange,
        curClazzName,
        clazzTeacher,
        allClazz,
        showModify,
      };
    },
  });
</script>

<style>
  .ant-modal-mask {
    background-color: rgba(0, 0, 0, 0.3);
  }
</style>