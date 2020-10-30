<template>
  <a-card>
    <a-row :gutter="[16, 16]">
      <a-col :xs="24" :sm="12" :md="5" :lg="5">
        <a-input v-model="filters.search$$keyword$$all" placeholder="输入关键字搜索" />
      </a-col>
      <a-col :xs="24" :sm="12" :md="5" :lg="5">
        <a-select :options="options" v-model="filters.search$$status$$" placeholder="请选择" style="width: 100%" />
      </a-col>
      <a-col :xs="24" :sm="12" :md="12" :lg="8">
        <a-button icon="reload" type="default" @click="reset">重置</a-button>&nbsp;
        <a-button icon="search" type="primary" @click="search">搜索</a-button>&nbsp;
        <a-button icon="plus" type="primary" @click="handleAdd">添加</a-button>
      </a-col>
    </a-row>
    <div style="margin:10px 0">
      <a-table
        tableLayout="auto"
        :columns="columns"
        :dataSource="list"
        :loading="loading"
        :rowKey="record => record._id"
        bordered
        size="small"
        :pagination="pagination"
        @change="onTableChange"
      >
        <span slot="type" slot-scope="type">{{replyTypes[type]}}</span>
        <span slot="factor" slot-scope="factor">{{factorsList[factor]}}</span>
        <span slot="status" slot-scope="status">{{statusList[status]}}</span>
        <span slot="action" slot-scope="text,record,index">
          <a-button-group>
            <a-button
              size="small"
              type="primary"
              @click="handleEdit(record)"
            >修改</a-button>
            <a-button size="small" type="danger" @click="handleDelete([record._id],index)">删除</a-button>
          </a-button-group>
        </span>
      </a-table>
    </div>
    <ModalV ref="modalDom" :temp="temp" @onOK="e=>this.save(e)" />
  </a-card>
</template>

<script>
import { replyTypes, factorsList, statusList } from "../enume";
import ModalV from "./modal";
const columns = [
  {
    title: "关键字",
    dataIndex: "keyword",
    align: "center"
  },
  {
    title: "事件类型",
    dataIndex: "type",
    align: "center",
    scopedSlots: { customRender: "type" }
  },
  {
    title: "场景",
    dataIndex: "factor",
    align: "center",
    scopedSlots: { customRender: "factor" }
  },
  {
    title: "回复内容",
    dataIndex: "content",
    align: "center",
    // ellipsis: true,
    width: 400
  },
  {
    title: "描述",
    dataIndex: "remark",
    align: "center"
  },
  {
    title: "状态",
    dataIndex: "status",
    align: "center",
    scopedSlots: { customRender: "status" }
  },
  {
    title: "操作",
    key: "action",
    align: "center",
    width: 150,
    scopedSlots: { customRender: "action" }
  }
];

export default {
  layout: "admin",
  components: { ModalV },
  data() {
    return {
      loading: false,
      filters: { search$$robotId$$: this.$auth.user.robotId || 0, search$$status$$: '' },
      columns,
      list: [],
      pagination: { total: 0, showQuickJumper: true, size: "lage" },
      temp: {},
      replyTypes,
      factorsList,
      statusList,
      options: [{ value: '', title: '全部' }, ...statusList.map((v, i) => ({ value: i, title: v }))]
    };
  },
  created() {
    this.getList();
  },
  methods: {
    reset() {
      this.filters = {
        ...this.filters,
        search$$status$$: '',
        page: 1
      }
      this.pagination = {
        ...this.pagination,
        total: 0
      }
      this.getList();
    },
    async getList() {
      this.loading = true;
      const res = await this.$axios.$get("/admin/reply/", {
        params: this.filters
      });
      this.loading = false;
      this.list = res.list;
      this.pagination.total = res.total;
    },
    search() {
      this.getList();
    },
    onTableChange(pagination, filters, sorter) {
      this.filters.page = pagination.current;
      this.getList();
    },
    handleAdd() {
      this.temp = {};
      this.$refs["modalDom"].isShow(true);
    },
    handleEdit(row) {
      this.temp = { ...row };
      this.$refs["modalDom"].isShow(true);
    },
    async save(formData) {
      if (!formData) formData = this.temp;
      const { _id, ...vals } = formData;
      let res = false;
      if (_id) {
        res = await this.$axios.$put("/admin/reply/" + _id, vals);
      } else {
        formData.robotId = this.$auth.user.robotId;
        res = await this.$axios.$post("/admin/reply", formData);
      }
      if (res) {
        this.getList();
        this.$refs["modalDom"].isShow(false);
      }
    },
    handleDelete(ids, index) {
      this.$confirm({
        title: "确定进行该操作吗??",
        content: "该操作数据不可逆，请谨慎操作!!!",
        cancelText: "我再想想",
        okText: "确定",
        onOk: () => {
          this.delete(ids, index);
        }
      });
    },
    async delete(ids, index) {
      const res = await this.$axios.$delete("/admin/reply", { data: { ids } });
      if (!res) return;
      if (index) return this.list.splice(index, 1);
      this.getList();
    }
  }
}
</script>
