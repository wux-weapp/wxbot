<template>
  <a-card>
    <a-row :gutter="[16, 16]">
      <a-col :xs="24" :sm="12" :md="5" :lg="5">
        <a-input v-model="filters.search$$name$$all" placeholder="输入名称搜索" />
      </a-col>
      <a-col :xs="24" :sm="12" :md="5" :lg="5">
        <a-select v-model="filters.search$$status$$" :options="options" placeholder="请选择" style="width: 100%" />
      </a-col>
      <a-col :xs="24" :sm="12" :md="12" :lg="8">
        <a-button icon="reload" type="default" @click="reset">
          重置
        </a-button>&nbsp;
        <a-button icon="search" type="primary" @click="search">
          搜索
        </a-button>&nbsp;
        <a-button icon="plus" type="primary" @click="handleAdd">
          添加
        </a-button>
      </a-col>
    </a-row>
    <div style="margin: 10px 0">
      <a-table
        table-layout="auto"
        :columns="columns"
        :data-source="list"
        :loading="loading"
        :row-key="(record) => record._id"
        bordered
        size="small"
        :pagination="pagination"
        @change="onTableChange"
      >
        <span slot="type" slot-scope="type">{{ taskTypes[type] }}</span>
        <span slot="factor" slot-scope="factor">{{ taskFactors[factor] }}</span>
        <span slot="status" slot-scope="status">{{ statusList[status] }}</span>
        <span slot="unit" slot-scope="text, record">
          {{ units[text] }}
          <template
            v-if="text !== 3"
          >{{ record.hour || record.hour == 0 ? record.hour + '时' : ''
          }}{{ record.minute || record.minute == 0 ? record.minute + '分' : ''
          }}{{ (record.second || record.second == 0) && '第' + record.second + '秒' }}</template>
        </span>
        <span slot="action" slot-scope="text, record, index">
          <a-button-group>
            <a-button size="small" type="primary" @click="handleEdit(record)">修改</a-button>
            <a-button size="small" type="danger" @click="handleDelete([record._id], index)">删除</a-button>
          </a-button-group>
        </span>
      </a-table>
    </div>
    <ModalV ref="modalDom" :temp="temp" @onOK="(e) => this.save(e)" />
  </a-card>
</template>

<script>
import { taskFactors, taskTypes, statusList, units } from '../enume'
import ModalV from './modal'
const columns = [
  {
    title: '名称',
    dataIndex: 'name',
    align: 'center',
  },
  {
    title: '类型',
    dataIndex: 'type',
    align: 'center',
    scopedSlots: { customRender: 'type' },
  },
  {
    title: '场景',
    dataIndex: 'factor',
    align: 'center',
    scopedSlots: { customRender: 'factor' },
  },
  {
    title: '内容',
    dataIndex: 'content',
    align: 'center',
    // ellipsis: true,
    width: 500,
  },
  {
    title: '提醒时间',
    dataIndex: 'unit',
    align: 'center',
    width: 200,
    scopedSlots: { customRender: 'unit' },
  },
  {
    title: '状态',
    dataIndex: 'status',
    align: 'center',
    scopedSlots: { customRender: 'status' },
  },
  {
    title: '操作',
    key: 'action',
    align: 'center',
    width: 150,
    scopedSlots: { customRender: 'action' },
  },
]
export default {
  components: { ModalV },
  layout: 'admin',
  data () {
    return {
      loading: false,
      filters: {
        search$$robotId$$: this.$auth.user.robotId || 0,
        search$$status$$: '',
      },
      columns,
      list: [],
      pagination: { total: 0, showQuickJumper: true, size: 'lage' },
      temp: {},
      taskFactors,
      taskTypes,
      statusList,
      options: [{ value: '', title: '全部' }, ...statusList.map((v, i) => ({ value: i, title: v }))],
      units,
    }
  },
  created () {
    this.getList()
  },
  methods: {
    reset () {
      this.filters = {
        ...this.filters,
        search$$status$$: '',
        page: 1,
      }
      this.pagination = {
        ...this.pagination,
        total: 0,
      }
      this.getList()
    },
    async getList () {
      this.loading = true
      const res = await this.$axios.$get('/admin/task/', {
        params: this.filters,
      })
      this.loading = false
      this.list = res.list
      this.pagination.total = res.total
    },
    search () {
      this.getList()
    },
    onTableChange (pagination, filters, sorter) {
      this.filters.page = pagination.current
      this.getList()
    },
    handleAdd () {
      this.temp = {}
      this.$refs.modalDom.isShow(true)
    },
    handleEdit (row) {
      this.temp = { ...row }
      this.$refs.modalDom.isShow(true)
    },
    async save (formData) {
      if (!formData) {
        formData = this.temp
      }
      const { _id, ...vals } = formData
      let res = false
      if (_id) {
        res = await this.$axios.$put('/admin/task/' + _id, vals)
      } else {
        formData.robotId = this.$auth.user.robotId
        res = await this.$axios.$post('/admin/task', formData)
      }
      if (res) {
        this.getList()
        this.$refs.modalDom.isShow(false)
      }
    },
    handleDelete (ids, index) {
      this.$confirm({
        title: '确定进行该操作吗??',
        content: '该操作数据不可逆，请谨慎操作!!!',
        cancelText: '我再想想',
        okText: '确定',
        onOk: () => {
          this.delete(ids, index)
        },
      })
    },
    async delete (ids, index) {
      const res = await this.$axios.$post('/admin/task', { ids })
      if (!res) {
        return
      }
      if (index) {
        return this.list.splice(index, 1)
      }
      this.getList()
    },
  },
}
</script>
