<template>
  <a-modal v-model="visible" :title="temp.id ? '修改' : '添加'">
    <a-form-model ref="temp" :model="temp" :rules="ruleValidate" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
      <a-form-model-item label="关键词" prop="keyword">
        <a-input v-model="temp.keyword" />
      </a-form-model-item>
      <a-form-model-item label="事件类型" prop="type">
        <a-select v-model="temp.type">
          <a-select-option v-for="(item, index) in replyTypes" :key="index" :value="index">
            {{ item }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item v-if="temp.type === 0" label="回复内容">
        <a-textarea v-model="temp.content" :auto-size="{ minRows: 3, maxRows: 5 }" />
      </a-form-model-item>
      <a-form-model-item label="选择场景" prop="factor">
        <a-radio-group v-model="temp.factor">
          <a-radio v-for="(item, index) in factorsList" :key="index" :value="index">
            {{ item }}
          </a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item v-if="temp.factor === 2" label="选择群聊">
        <a-select v-model="temp.roomId">
          <a-select-option v-for="(item, index) in groups" :key="index" :value="item.id">
            {{ item.topic }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="状态">
        <a-radio-group v-model="temp.status">
          <a-radio v-for="(item, index) in statusList" :key="index" :value="index">
            {{ item }}
          </a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="备注">
        <a-input v-model="temp.remark" />
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
import { replyTypes, factorsList, statusList } from '../enume'
const rules = {
  keyword: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
  type: [{ required: true, message: '请选择事件类型', trigger: 'change' }],
  factor: [{ required: true, message: '场景不能为空', trigger: 'change' }],
}
export default {
  props: {
    temp: { type: Object, default: () => ({}) },
  },
  data () {
    return {
      visible: false,
      ruleValidate: rules,
      replyTypes,
      factorsList,
      statusList,
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
        if (this.temp.type === 1 && this.temp.factor !== 1) {
          return this.$notification.warning({
            message: '操作提示',
            description: '群邀请仅限私聊',
          })
        }
        if (this.temp.type === 2 && this.temp.factor < 2) {
          return this.$notification.warning({
            message: '操作提示',
            description: '踢人仅限群聊和通用群聊',
          })
        }
        this.$emit('onOK', this.temp)
      })
    },
  },
}
</script>
