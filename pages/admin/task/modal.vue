<template>
  <a-modal v-model="visible" :title="temp.id?'修改':'添加'">
    <a-form-model
      ref="temp"
      :model="temp"
      :rules="ruleValidate"
      :labelCol="{span:4}"
      :wrapperCol="{span:19}"
    >
      <a-form-model-item label="名称" prop="name">
        <a-input v-model="temp.name" />
      </a-form-model-item>
      <a-form-model-item label="发送内容" prop="content">
        <a-textarea v-model="temp.content" :auto-size="{ minRows: 3, maxRows: 5 }" allow-clear />
      </a-form-model-item>
      <a-form-model-item label="选择场景" prop="factor">
        <a-radio-group v-model="temp.factor">
          <a-radio v-for="(item,index) in taskFactors" :value="index" :key="index">{{item}}</a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="选择好友" v-if="temp.factor==0" prop="friend">
        <a-select
          show-search
          placeholder="输入好友昵称搜索"
          :default-active-first-option="false"
          :show-arrow="false"
          :filter-option="false"
          :not-found-content="null"
          @search="handleSearch"
          v-model="temp.friendId"
        >
          <a-select-option v-for="item in friends" :value="item.id" :key="item._id">{{ item.name }}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="选择群聊" v-if="temp.factor==1" prop="roomId">
        <a-select v-model="temp.roomId">
          <a-select-option
            v-for="(item,index) in groups"
            :value="item.id"
            :key="index"
          >{{item.topic}}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="时间单位" prop="unit">
        <a-radio-group v-model="temp.unit">
          <a-radio v-for="(item,index) in units" :value="index" :key="index">{{item}}</a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="时" v-if="temp.unit>1" prop="hour">
        <a-input-number v-model="temp.hour" :min="0" :max="23" />
      </a-form-model-item>
      <a-form-model-item label="分" v-if="temp.unit>0" prop="minute">
        <a-input-number v-model="temp.minute" :min="0" :max="59" />
      </a-form-model-item>
      <a-form-model-item label="秒" prop="second">
        <a-input-number v-model="temp.second" :min="0" :max="59" />
      </a-form-model-item>
      <a-form-model-item label="状态">
        <a-radio-group v-model="temp.status">
          <a-radio v-for="(item,index) in statusList" :value="index" :key="index">{{item}}</a-radio>
        </a-radio-group>
      </a-form-model-item>
    </a-form-model>
    <div slot="footer">
      <a-button key="submit" type="primary" @click="handleOk">确定</a-button>
    </div>
  </a-modal>
</template>
<script>
import { taskFactors, statusList, units } from "../enume";
const rules = {
  name: [{ required: true, message: "不能为空", trigger: "blur" }],
  content: [{ required: true, message: "不能为空", trigger: "blur" }],
  factor: [{ required: true, message: "请选择场景", trigger: "change" }],
  friend: [{ required: true, message: "请选择好友", trigger: "change" }],
  roomId: [{ required: true, message: "请选择群聊", trigger: "change" }],
  unit: [{ required: true, message: "请选择", trigger: "change" }],
  hour: [{ required: true, message: "不能为空", trigger: "blur" }],
  minute: [{ required: true, message: "不能为空", trigger: "blur" }],
  second: [{ required: true, message: "不能为空", trigger: "blur" }]
};
let timeout;
export default {
  props: {
    temp: { type: Object, default: () => ({}) }
  },
  data() {
    return {
      visible: false,
      ruleValidate: rules,
      taskFactors,
      statusList,
      units,
      friends: [],
      groups: []
    };
  },
  created() {
    this.getGroups();
  },
  methods: {
    async getGroups() {
      const res = await this.$axios.$get(
        "/admin/group?id=" + this.$auth.user.robotId
      );
      if (res) this.groups = res;
    },
    isShow(v) {
      this.visible = v;
    },
    handleOk() {
      this.$refs["temp"].validate(valid => {
        if (!valid) return;
        if (this.temp.unit == 0) {
          this.temp.hour = null;
          this.temp.minute = null;
        }
        if (this.temp.unit == 1) {
          this.temp.hour = null;
        }
        this.$emit("onOK", this.temp);
      });
    },
    handleSearch(value) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      timeout = setTimeout(this.searchFriends(value), 300);
    },
    async searchFriends(value) {
      const res = await this.$axios.$get("/admin/friend", {
        params: {
          search$$robotId$$: this.$auth.user.robotId,
          search$$name$$all: value
        }
      });
      if (res) this.friends = res.list;
    }
  }
}
</script>
