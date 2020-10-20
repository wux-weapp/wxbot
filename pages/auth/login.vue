<template>
  <div class="container">
    <div class="auth-panel">
      <h2 class="auth-title">后台登录</h2>
      <a-form :form="form" @submit="handleSubmit" class="form">
        <a-form-item>
          <a-input
            size="large"
            placeholder="用户名"
            v-decorator="['username',{ rules: [{ required: true, message: '输入用户名!' }]}]"
          />
        </a-form-item>
        <a-form-item>
          <a-input-password
            size="large"
            placeholder="密码"
            v-decorator="['password',{ rules: [{ required: true, message: '输入密码!' }]}]"
          />
        </a-form-item>
        <a-button type="primary" :block="true" size="large" html-type="submit">登录</a-button>
      </a-form>
    </div>
  </div>
</template>
<script lang="javascript">
export default {
  data() {
    return {
      form: this.$form.createForm(this, {})
    };
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          this.$auth.loginWith("local", { data: values });
        }
      });
    }
  }
}
</script>
<style scoped>
.container {
  position: absolute;
  background: #2579eb;
  height: 100%;
  width: 100%;
}
.auth-panel {
  max-width: 370px;
  margin: 13vh auto 0;
  padding: 50px 40px;
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 20px 25px -12px rgba(0, 0, 0, 0.09);
}
.auth-title {
  text-align: center;
}
</style>
