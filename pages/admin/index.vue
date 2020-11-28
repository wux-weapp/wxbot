<template>
  <a-spin :spinning="loading">
    <a-card>
      <a-empty v-if="!robot" description="未绑定机器人">
        <a-button type="primary" @click="(e) => (this.visible = true)">
          添加
        </a-button>
      </a-empty>
      <div v-else>
        <a-row>
          <a-col :sm="12" class="rInfo">
            <p>
              <span class="name">{{ robot.nickName }} </span><a-icon
                type="edit"
                @click="
                  () => {
                    ;(this.temp = this.robot), (this.visible = true)
                  }
                "
              />
            </p>
            <p>
              <span class="title">上次登录时间：</span>
              <span v-if="robot.lastLoginT">{{ robot.lastLoginT | toDate }}</span><span v-else>未登录</span>
            </p>
            <p><span class="title">启动提示语：</span>{{ robot.startSay }}</p>
            <p><span class="title">知识盲区回复：</span>{{ robot.unknownSay }}</p>
            <p>
              <span class="title">好友验证自动通过关键字：</span>
              <a-tag v-for="(item, index) in robot.addFriendKeywords" :key="index" color="pink">
                {{ item }}
              </a-tag>
            </p>
            <p><span class="title">好友验证通过自动回复：</span>{{ robot.addFriendReply }}</p>
            <p><span class="title">Token：</span>{{ robot.token ? '******************************' : '' }}</p>
          </a-col>
          <a-col :sm="12" style="text-align: right">
            <a-switch
              checked-children="开启"
              :checked="robot.status === 1 ? true : false"
              un-checked-children="关闭"
              @change="onChangeRobot"
            />
          </a-col>
        </a-row>
      </div>
      <a-modal v-model="showQrcode" title="微信扫码登录" :footer="null" :mask-closable="false" :width="200">
        <div id="qrcode" style="text-align: center" />
      </a-modal>
      <a-modal v-model="visible" :title="robot ? '修改机器人' : '添加机器人'" @ok="handleOk">
        <a-form-model ref="temp" :model="temp" :rules="rules" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
          <a-form-model-item label="机器人名称" prop="nickName">
            <a-input v-model="temp.nickName" />
          </a-form-model-item>
          <a-form-model-item label="启动提示语">
            <a-input v-model="temp.startSay" />
          </a-form-model-item>
          <a-form-model-item label="知识盲区回复">
            <a-input v-model="temp.unknownSay" />
          </a-form-model-item>
          <a-form-model-item label="好友通过关键字">
            <a-select
              v-model="temp.addFriendKeywords"
              mode="tags"
              style="width: 100%"
              placeholder="好友验证自动通过关键字，最多3个"
              @change="onKeyChange"
            />
          </a-form-model-item>
          <a-form-model-item label="好友通过自动回复">
            <a-textarea v-model="temp.addFriendReply" :auto-size="{ minRows: 3, maxRows: 5 }" />
          </a-form-model-item>
          <a-form-model-item label="协议Token">
            <a-input-password v-model="temp.token" autocomplete="new-password" />
          </a-form-model-item>
        </a-form-model>
      </a-modal>
    </a-card>
  </a-spin>
</template>
<script lang="javascript">
import QRCode from 'qrcodejs2'
const rules = {
  nickName: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
}
export default {
  layout: 'admin',
  asyncData () {},
  data () {
    return {
      loading: false,
      robot: null,
      visible: false,
      showQrcode: false,
      temp: {
        startSay: 'Hello, robot has started',
        unknownSay: '你在说什么，我听不懂',
        addFriendKeywords: ['机器人'],
      },
      rules,
      timer: false,
      timerTask: 0,
      refreshCount: 0,
    }
  },
  watch: {
    timer (value) {
      if (value) {
        this.timerTask = setInterval(() => {
          this.refresh()
        }, 15000)
      } else {
        clearInterval(this.timerTask)
      }
    },
  },
  created () {
    this.initData()
  },
  destroyed () {
    clearInterval(this.timerTask)
  },
  methods: {
    handleOk () {
      this.$refs.temp.validate((valid) => {
        if (!valid) { return }
        this.save(this.temp)
      })
    },
    createQrcode (url) {
      new QRCode('qrcode', {
        width: 150,
        height: 150,
        text: url,
      })
    },
    async initData () {
      if (!this.$auth.user.robot_id) { return }
      const res = await this.$axios.$get('/admin/robot/' + this.$auth.user.robot_id)
      if (res) {
        this.robot = res
        this.loading = false
        if (res.id) { this.$auth.user.robotId = res.id }
        if (res.status === 1 && this.showQrcode) {
          this.showQrcode = false
          this.$notification.success({ message: '登录提示', description: '机器人登录成功' })
        }
      }
    },
    async save (formData) {
      formData.addFriendKeywords.slice(0, 3)
      const { _id, ...vals } = formData
      let res = false
      if (_id) {
        res = await this.$axios.$put('/admin/robot/' + _id, vals)
      } else {
        res = await this.$axios.$post('/admin/robot', formData)
        this.$auth.user.robot_id = res._id
      }
      this.initData()
      this.visible = false
    },
    async onChangeRobot (open) {
      this.loading = true
      if (!open) {
        await this.$axios.$post('/robot/logout', { id: this.robot._id })
        this.robot.status = 0
        this.loading = false
        return this.$notification.warning({ message: '操作提示', description: '机器人已经退出' })
      }
      const res = await this.$axios.$post('/robot/login', { id: this.robot._id })
      this.loading = false
      if (res.isLogin) {
        this.initData()
        this.$notification.success({ message: '登录提示', description: '机器人登录成功' })
        return
      }
      if (res.qrcode) {
        this.showQrcode = true
        this.$nextTick(function () {
          this.createQrcode(res.qrcode)
        })
        this.refreshCount = 0
        this.timer = true
      }
    },
    async refresh () {
      if (this.refreshCount < 5) {
        this.initData()
        this.refreshCount++
        return
      }
      this.timer = false
      this.refreshCount = 0
      this.showQrcode = false
    },
    onKeyChange (value) {

    },
  },
}
</script>
<style lang="scss" scoped>
.rInfo {
  color: #666;
  .name {
    color: #1890ff;
    font-size: 20px;
  }
  .title {
    color: #000;
  }
}
</style>
