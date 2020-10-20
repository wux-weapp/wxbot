<template>
  <div class="container">
    <nuxt-link class="loginbtn" to="/admin">
      <span v-if="!this.$auth.user">登录</span>
      <span v-else>控制台</span>
    </nuxt-link>
    <div>
      <h1 class="title">wxbot</h1>
      <h2 class="subtitle">让你的个人微信号成为微信机器人</h2>
      <div class="links">
        <a
          href="https://juejin.im/post/5ebbb7726fb9a043740ba7f9"
          target="_blank"
          class="button--green"
        >Documentation</a>
        <a href="https://github.com/wux-weapp/wxbot.git" target="_blank" class="button--grey">GitHub</a>
      </div>
    </div>
  </div>
</template>
<style scoped>
.container {
  position: absolute;
  margin: 0 auto;
  text-align: center;
  color: #fff;
  padding-top: 10px;
  background: #2579eb;
  height: 100%;
  width: 100%;
}
.loginbtn {
  right: 10px;
  position: absolute;
  border-radius: 4px;
  border: 1px solid #fff;
  color: #fff;
  text-decoration: none;
  padding: 10px 30px;
}
.loginbtn a {
  color: #fff;
}
.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #fff;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #fff;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
  color: #fff;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #fff;
  color: #fff;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #fff;
  color: #fff;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}
</style>
