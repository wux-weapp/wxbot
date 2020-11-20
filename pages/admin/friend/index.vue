<template>
  <a-card>
    <a-row :gutter="[16, 16]">
      <a-col :xs="24" :sm="12" :md="5" :lg="5">
        <a-input v-model="filters.search$$name$$all" placeholder="输入昵称搜索" />
      </a-col>
      <a-col :xs="24" :sm="12" :md="5" :lg="5">
        <a-select v-model="filters.search$$gender$$" :options="options" placeholder="请选择" style="width: 100%" />
      </a-col>
      <a-col :xs="24" :sm="12" :md="12" :lg="8">
        <a-button icon="reload" type="default" @click="reset">
          重置
        </a-button>&nbsp;
        <a-button icon="search" type="primary" @click="search">
          搜索
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
        <span slot="avatar" slot-scope="avatar">
          <a-avatar :src="avatar" />
        </span>
        <span slot="gender" slot-scope="gender">{{
          options.filter((v) => v.value !== '').map((v) => v.title)[gender]
        }}</span>
        <span slot="province" slot-scope="text, record">{{ record.province }}-{{ record.city }}</span>
        <span slot="action" slot-scope="text, record">
          <a-button size="small" type="primary" @click="handleSay(record)">发消息</a-button>
        </span>
      </a-table>
    </div>
    <SayV ref="modalDom" :say="say" @onOK="(e) => this.sendMsg(e)" />
  </a-card>
</template>

<script>
import SayV from '~/components/Say.vue'
const columns = [
  {
    title: '头像',
    dataIndex: 'avatar',
    align: 'center',
    scopedSlots: { customRender: 'avatar' },
  },
  {
    title: '昵称',
    dataIndex: 'name',
    align: 'center',
  },
  {
    title: '备注',
    dataIndex: 'alias',
    align: 'center',
  },
  {
    title: '性别',
    dataIndex: 'gender',
    align: 'center',
    scopedSlots: { customRender: 'gender' },
  },
  {
    title: '微信',
    dataIndex: 'weixin',
    align: 'center',
  },
  {
    title: '地区',
    dataIndex: 'province',
    align: 'center',
    scopedSlots: { customRender: 'province' },
    width: 300,
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
  components: { SayV },
  layout: 'admin',
  data () {
    return {
      loading: false,
      filters: {
        search$$robotId$$: this.$auth.user.robotId || 0,
        search$$gender$$: '',
      },
      options: [
        { value: '', title: '全部' },
        { value: 0, title: '未知' },
        { value: 1, title: '男' },
        { value: 2, title: '女' },
      ],
      columns,
      list: [],
      pagination: { total: 0, showQuickJumper: true, size: 'lage' },
      say: {},
    }
  },
  created () {
    this.getList()
  },
  methods: {
    reset () {
      this.filters = {
        ...this.filters,
        search$$gender$$: '',
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
      const res = await this.$axios.$get('/admin/friend/', {
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
    handleSay (row) {
      this.say = { id: row.id, name: row.name }
      this.$refs.modalDom.isShow(true)
    },
    async sendMsg (data) {
      const res = await this.$axios.$post('/robot/friend/say', data)
      if (res) {
        this.$notification.success({
          message: '操作提示',
          description: '消息发送成功',
        })
        this.$refs.modalDom.isShow(false)
      }
    },
  },
}
</script>
