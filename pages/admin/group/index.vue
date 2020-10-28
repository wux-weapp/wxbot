<template>
  <div>
    <a-spin :spinning="loading">
    <a-card :style="{marginBottom: '16px'}">共{{groups.length}}个群聊</a-card>
    <a-row :gutter="[16, 16]">
      <a-col :xs="24" :sm="12" :md="6" v-for="item in groups" :key="item._id">
        <a-card :bordered="false" :bodyStyle="bodyStyle">
          <a-card-meta :title="item.topic" :description="item.memberIdList.length+'人'">
            <a-avatar slot="avatar" :src="item.avatar" />
          </a-card-meta>
          <template class="ant-card-actions" slot="actions">
            <a-icon key="setting" type="setting" @click="handleSet(item.id)"/>
            <a-icon key="edit" type="edit" @click="handleEdit(item)"/>
            <a-icon key="message" type="message" @click="handleSay(item)"/>
          </template>
        </a-card>
      </a-col>
    </a-row>
    <a-modal title="修改" v-model="visible" @ok="save" :maskClosable="false">
      <a-form-model
        ref="temp"
        :model="temp"
        :labelCol="{span:5}"
        :wrapperCol="{span:19}"
      >
        <a-form-model-item label="群编码(字母)">
          <a-input v-model="temp.joinCode" />
        </a-form-model-item>
        <a-form-model-item label="入群欢迎语">
          <a-textarea v-model="temp.roomJoinReply"/>
        </a-form-model-item>
        <a-form-model-item label="机器人控制">
          <a-switch checkedChildren="允许" :checked="temp.control" unCheckedChildren="禁止" @change="(e)=>this.temp.control=e"/>
        </a-form-model-item>
        <a-form-model-item label="开启自动加群">
          <a-switch checkedChildren="打开" :checked="temp.autojoin" unCheckedChildren="关闭" @change="(e)=>this.temp.autojoin=e"/>
        </a-form-model-item>
        <div><a-icon type="question-circle"/> 打开自动加群，当机器人收到加群指令消息后，会回复该群名称。</div>
        <a-form-model-item label="群员违规上限">
          <a-input-number v-model="temp.maxFoul" :min="1"/>
        </a-form-model-item>
        <div><a-icon type="question-circle"/>每违规一次，机器人会发出警告，次数达到上限将会被机器人移出群聊</div>
      </a-form-model>
    </a-modal>
    <a-modal title="设置" v-model="visible2" @ok="saveSet" :maskClosable="false">
      <a-form-model
        ref="room"
        :model="room"
        :labelCol="{span:5}"
        :wrapperCol="{span:19}"
      >
        <a-form-model-item label="群名称">
          <a-input v-model="temp.topic" />
        </a-form-model-item>
        <a-form-model-item label="群公告">
          <a-textarea v-model="temp.announce"/>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <SayV ref="modalDom" :say="say" @onOK="e=>this.sendMsg(e)" />
    </a-spin>
  </div>
</template>
<script lang="javascript">
import SayV from "~/components/Say.vue";
export default {
  layout: "admin",
  // async asyncData ({ $axios }) {
  // },
  components: { SayV },
  data() {
    return {
      bodyStyle: {
        minHeight: '93px'
      },
      loading: false,
      visible: false,
      visible2:false,
      groups: [],
      temp:{},
      robotId:this.$auth.user.robotId,
      say:{},
      room:{}
    };
  },
  created() {
    this.initData();
  },
  methods: {
    async initData() {
      let res = await this.$axios.$get("/admin/group?id="+this.robotId);
      if (res) this.groups = res;
    },
    async save() {
      const { _id, ...vals } = this.temp;
      const res = await this.$axios.$put("/admin/group/" + _id, vals)
      if(res){
        this.initData()
        this.visible = false
        this.temp = {}
        this.$notification.success({message:'操作提示',description:'修改成功'})
      }
    },
    async handleSet(id){
      let temp = {id}
      const room = await this.$axios.$get("/robot/room/" + id)
      if(room){
        this.room = room
        this.temp = Object.assign(temp, room)
        this.visible2 = true
      }
    },
    async saveSet(){
      let vals = {}
      if(this.room.topic!=this.temp.topic) vals.topic = this.temp.topic
      if(this.room.announce!=this.temp.announce) vals.announce = this.temp.announce
      if(JSON.stringify(vals) == "{}"){
        this.visible2 = false; return
      }
      this.loading  = true
      const res = await this.$axios.$put("/robot/room/" + this.temp.id, vals)
      this.loading  = false
      if(res){
        this.visible2 = false
        this.temp = {}
        this.room = {}
        this.$notification.success({message:'操作提示',description:'设置成功'})
      }
    },
    handleEdit(row){
      this.temp={...row}
      this.visible=true
    },
    handleSay(row) {
      this.say = { id: row.id, name: row.topic };
      this.$refs["modalDom"].isShow(true);
    },
    async sendMsg(data) {
      const res = await this.$axios.$post("/robot/room/say", data);
      if (res) {
        this.$notification.success({
          message: "操作提示",
          description: "消息发送成功"
        });
        this.$refs["modalDom"].isShow(false);
      }
    }
  }
}
</script>

<style scoped>
.ant-form-item-control{line-height: 0px}
/* .ant-col{padding-top: 10px} */
</style>