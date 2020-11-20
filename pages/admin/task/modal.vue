<template>
  <a-modal v-model="visible" :title="temp.id ? '修改' : '添加'">
    <a-form-model ref="temp" :model="temp" :rules="ruleValidate" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
      <a-form-model-item label="名称" prop="name">
        <a-input v-model="temp.name" />
      </a-form-model-item>
      <a-form-model-item label="发送内容" prop="content">
        <a-textarea v-model="temp.content" :auto-size="{ minRows: 3, maxRows: 5 }" allow-clear />
      </a-form-model-item>
      <a-form-model-item label="选择场景" prop="factor">
        <a-radio-group v-model="temp.factor">
          <a-radio v-for="(item, index) in taskFactors" :key="index" :value="index">
            {{ item }}
          </a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item v-if="temp.factor === 0" label="选择好友" prop="friend">
        <a-select
          v-model="temp.friendId"
          show-search
          placeholder="输入好友昵称搜索"
          :default-active-first-option="false"
          :show-arrow="false"
          :filter-option="false"
          :not-found-content="null"
          @search="handleSearch"
        >
          <a-select-option v-for="item in friends" :key="item._id" :value="item.id">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item v-if="temp.factor === 1" label="选择群聊" prop="roomId">
        <a-select v-model="temp.roomId">
          <a-select-option v-for="(item, index) in groups" :key="index" :value="item.id">
            {{ item.topic }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="时间单位" prop="unit">
        <a-radio-group v-model="temp.unit">
          <a-radio v-for="(item, index) in units" :key="index" :value="index">
            {{ item }}
          </a-radio>
        </a-radio-group>
      </a-form-model-item>
      <template v-if="temp.unit !== 3">
        <a-form-model-item v-if="temp.unit > 1" label="时" prop="hour">
          <a-input-number v-model="temp.hour" :min="0" :max="23" />
        </a-form-model-item>
        <a-form-model-item v-if="temp.unit > 0" label="分" prop="minute">
          <a-input-number v-model="temp.minute" :min="0" :max="59" />
        </a-form-model-item>
        <a-form-model-item label="秒" prop="second">
          <a-input-number v-model="temp.second" :min="0" :max="59" />
        </a-form-model-item>
      </template>
      <a-form-model-item v-else label="cron表达式" prop="cron">
        <a-input v-model="temp.cron" />
        <a-textarea v-model="cronTips" auto-size disabled />
        <div>
          <a-icon type="question-circle" />
          <a href="https://cron.qqe2.com/" target="_blank">在线Cron表达式生成器</a>
        </div>
      </a-form-model-item>
      <a-form-model-item label="状态">
        <a-radio-group v-model="temp.status">
          <a-radio v-for="(item, index) in statusList" :key="index" :value="index">
            {{ item }}
          </a-radio>
        </a-radio-group>
      </a-form-model-item>
    </a-form-model>
    <div slot="footer">
      <a-button key="submit" type="primary" @click="handleOk">
        确定
      </a-button>
    </div>
  </a-modal>
</template>
<script>
import { taskFactors, statusList, units } from '../enume'

// @see https://blog.csdn.net/tatetianos/article/details/103050707
const regEx = new RegExp(
  '^\\s*($|#|\\w+\\s*=|(\\?|\\*|(?:[0-5]?\\d)(?:(?:-|\\/|\\,)(?:[0-5]?\\d))?(?:,(?:[0-5]?\\d)(?:(?:-|\\/|\\,)(?:[0-5]?\\d))?)*)\\s+(\\?|\\*|(?:[0-5]?\\d)(?:(?:-|\\/|\\,)(?:[0-5]?\\d))?(?:,(?:[0-5]?\\d)(?:(?:-|\\/|\\,)(?:[0-5]?\\d))?)*)\\s+(\\?|\\*|(?:[01]?\\d|2[0-3])(?:(?:-|\\/|\\,)(?:[01]?\\d|2[0-3]))?(?:,(?:[01]?\\d|2[0-3])(?:(?:-|\\/|\\,)(?:[01]?\\d|2[0-3]))?)*)\\s+(\\?|\\*|(?:0?[1-9]|[12]\\d|3[01])(?:(?:-|\\/|\\,)(?:0?[1-9]|[12]\\d|3[01]))?(?:,(?:0?[1-9]|[12]\\d|3[01])(?:(?:-|\\/|\\,)(?:0?[1-9]|[12]\\d|3[01]))?)*)\\s+(\\?|\\*|(?:[1-9]|1[012])(?:(?:-|\\/|\\,)(?:[1-9]|1[012]))?(?:L|W)?(?:,(?:[1-9]|1[012])(?:(?:-|\\/|\\,)(?:[1-9]|1[012]))?(?:L|W)?)*|\\?|\\*|(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?:(?:-)(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC))?(?:,(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?:(?:-)(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC))?)*)\\s+(\\?|\\*|(?:[0-6])(?:(?:-|\\/|\\,|#)(?:[0-6]))?(?:L)?(?:,(?:[0-6])(?:(?:-|\\/|\\,|#)(?:[0-6]))?(?:L)?)*|\\?|\\*|(?:MON|TUE|WED|THU|FRI|SAT|SUN)(?:(?:-)(?:MON|TUE|WED|THU|FRI|SAT|SUN))?(?:,(?:MON|TUE|WED|THU|FRI|SAT|SUN)(?:(?:-)(?:MON|TUE|WED|THU|FRI|SAT|SUN))?)*)(|\\s)+(\\?|\\*|(?:|\\d{4})(?:(?:-|\\/|\\,)(?:|\\d{4}))?(?:,(?:|\\d{4})(?:(?:-|\\/|\\,)(?:|\\d{4}))?)*))$',
)
const checkCron = (rule, value, callback) => {
  if (!value) {
    callback(new Error('不能为空'))
  } else if (value && !regEx.test(value)) {
    callback(new Error('cron表达式不合法'))
  }
  callback()
}
const rules = {
  name: [{ required: true, message: '不能为空', trigger: 'blur' }],
  content: [{ required: true, message: '不能为空', trigger: 'blur' }],
  factor: [{ required: true, message: '请选择场景', trigger: 'change' }],
  friend: [{ required: true, message: '请选择好友', trigger: 'change' }],
  roomId: [{ required: true, message: '请选择群聊', trigger: 'change' }],
  unit: [{ required: true, message: '请选择', trigger: 'change' }],
  hour: [{ required: true, message: '不能为空', trigger: 'blur' }],
  minute: [{ required: true, message: '不能为空', trigger: 'blur' }],
  second: [{ required: true, message: '不能为空', trigger: 'blur' }],
  cron: [{ validator: checkCron, trigger: 'blur' }],
}
let timeout
export default {
  props: {
    temp: { type: Object, default: () => ({}) },
  },
  data () {
    return {
      cronTips: `
# ┌──────────── second (optional)
# │ ┌────────── minute
# │ │ ┌──────── hour
# │ │ │ ┌────── day of month
# │ │ │ │ ┌──── month
# │ │ │ │ │ ┌── day of week
# │ │ │ │ │ │
# │ │ │ │ │ │
# * * * * * *
      `,
      visible: false,
      ruleValidate: rules,
      taskFactors,
      statusList,
      units,
      friends: [],
      groups: [],
    }
  },
  created () {
    this.getGroups()
  },
  methods: {
    async getGroups () {
      const res = await this.$axios.$get('/admin/group?id=' + this.$auth.user.robotId)
      if (res) {
        this.groups = res
      }
    },
    isShow (v) {
      this.visible = v
    },
    handleOk () {
      this.$refs.temp.validate((valid) => {
        if (!valid) {
          return
        }
        if (this.temp.unit === 0) {
          this.temp.hour = null
          this.temp.minute = null
        }
        if (this.temp.unit === 1) {
          this.temp.hour = null
        }
        if (this.temp.unit !== 3) {
          this.temp.cron = null
        }
        this.$emit('onOK', this.temp)
      })
    },
    handleSearch (value) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      timeout = setTimeout(this.searchFriends(value), 300)
    },
    async searchFriends (value) {
      const res = await this.$axios.$get('/admin/friend', {
        params: {
          search$$robotId$$: this.$auth.user.robotId,
          search$$name$$all: value,
        },
      })
      if (res) {
        this.friends = res.list
      }
    },
  },
}
</script>
