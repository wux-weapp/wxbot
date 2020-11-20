<template>
  <a-modal v-model="visible" :title="'发消息给：' + say.name">
    <a-form-model ref="say" :model="say" :rules="ruleValidate" :label-col="{ span: 3 }" :wrapper-col="{ span: 19 }">
      <a-form-model-item label="内容" prop="content">
        <a-textarea v-model="say.content" :auto-size="{ minRows: 3, maxRows: 5 }" allow-clear />
      </a-form-model-item>
    </a-form-model>
    <div slot="footer">
      <a-button key="submit" type="primary" @click="handleOk">
        发送
      </a-button>
    </div>
  </a-modal>
</template>
<script>
const rules = {
  content: [{ required: true, message: '不能为空', trigger: 'blur' }],
}
export default {
  props: {
    say: { type: Object, default: () => ({}) },
  },
  data () {
    return {
      visible: false,
      ruleValidate: rules,
    }
  },
  methods: {
    isShow (v) {
      this.visible = v
    },
    handleOk () {
      this.$refs.say.validate((valid) => {
        if (!valid) {
          return
        }
        this.$emit('onOK', this.say)
      })
    },
  },
}
</script>
