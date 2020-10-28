<template>
  <a-layout class="layout-admin">
    <a-layout-sider
      :trigger="null"
      collapsible
      v-model="collapsed"
      breakpoint="lg"
      class="layout-sider"
      v-if="!isSmallScreen"
    >
      <div class="logo">{{title}}</div>
      <a-menu theme="dark" mode="inline" :selected-keys="[currentKey]">
        <a-menu-item v-for="item in menuList" :key="item.index" :title="item.title">
          <nuxt-link :to="item.url">
            <a-icon :type="item.icon" v-if="!item.icon.startsWith('icon')" />
            <icon-font :type="item.icon" v-else />
            <span>{{item.title}}</span>
          </nuxt-link>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-drawer
      placement="left"
      width="200"
      :closable="false"
      :visible="drawerVisible"
      @close="() => (drawerVisible = !drawerVisible)"
      v-else
    >
      <a-layout-sider
        class="layout-sider"
      >
        <div class="logo">{{this.$store.state.robot.appName}}</div>
        <a-menu theme="dark" mode="inline" :selected-keys="[currentKey]">
          <a-menu-item v-for="item in menuList" :key="item.index" :title="item.title">
            <nuxt-link :to="item.url">
              <a-icon :type="item.icon" v-if="!item.icon.startsWith('icon')" />
              <icon-font :type="item.icon" v-else />
              <span>{{item.title}}</span>
            </nuxt-link>
          </a-menu-item>
        </a-menu>
      </a-layout-sider>
    </a-drawer>
    <a-layout :style="{ marginLeft }">
      <a-layout-header class="layout-header">
        <a-icon
          class="trigger"
          :type="collapsed ? 'menu-unfold' : 'menu-fold'"
          @click="onClick"
        />
        <div class="auth-actions">
          <a-dropdown placement="bottomRight">
            <span>
              {{this.$auth.user.username}}
              <a-icon type="down" />
            </span>
            <a-menu slot="overlay">
              <a-menu-item>
                <a title="退出登录" @click="logout">退出登录</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </div>
      </a-layout-header>
      <a-layout-content :style="{ margin: '10px 10px 0', overflow: 'initial'}">
        <nuxt />
      </a-layout-content>
      <a-layout-footer :style="{ textAlign: 'center' }">
        <a href="https://github.com/wux-weapp/wxbot.git" target="_blank">wxbot@2020</a>
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script lang="javascript">
import Vue from "vue";
import { Icon } from "ant-design-vue";
import moment from "moment";
const IconFont = Icon.createFromIconfontCN({
  scriptUrl: "//at.alicdn.com/t/font_1770829_93vxtfu9rh.js"
});
Vue.filter("toDate", date => {
  return moment(date).format("YYYY-MM-DD HH:mm:ss");
});
export default {
  middleware: "auth",
  components: {
    IconFont
  },
  data() {
    return {
      menuList: [{
        key: 'index',
        title: '控制台',
        url: '/admin',
        icon: 'dashboard'
      }, {
        key: 'reply',
        title: '自动回复',
        url: '/admin/reply',
        icon: 'icon-chakantiezihuifu'
      }, {
        key: 'friend',
        title: '我的好友',
        url: '/admin/friend',
        icon: 'icon-haoyou'
      }, {
        key: 'group',
        title: '我的群聊',
        url: '/admin/group',
        icon: 'icon-qun'
      }, {
        key: 'task',
        title: '定时任务',
        url: '/admin/task',
        icon: 'icon-dingshirenwu'
      }],
      isSmallScreen: false,
      drawerVisible: false,
      collapsed: false,
      currentKey: ""
    };
  },
  computed: {
    title() {
      return this.collapsed
        ? this.$store.state.robot.appName.substr(0, 1)
        : this.$store.state.robot.appName;
    },
    marginLeft() {
      if (this.isSmallScreen) { return 0 }
      return this.collapsed ? "80px" : "200px";
    }
  },
  created() {
    this.currentKey = this.getCurrentKey(this.$route.path);
    this.$router.afterEach(to => {
      this.currentKey = this.getCurrentKey(to.path);
    });
  },
  mounted() {
    this.$nextTick(() => {
      this.$nuxt.$loading.start();
      setTimeout(() => this.$nuxt.$loading.finish(), 500);
    });
    this.onResize()
    window.addEventListener('resize', () => {
      this.onResize()
    })
  },
  methods: {
    onResize () {
      this.isSmallScreen = document.documentElement.clientWidth < 768
    },
    onClick () {
      if (this.isSmallScreen) {
        this.drawerVisible = !this.drawerVisible
        return
      }
      this.collapsed = !this.collapsed
    },
    logout() {
      this.$auth.logout("local");
    },
    getCurrentKey(originalPath) {
      let path = originalPath.replace("/admin", "");
      if (path.substring(0, 1) === "/") {
        path = path.substring(1);
      }
      if (path.substring(path.length - 1) === "/") {
        path = path.substring(0, path.length - 1);
      }
      if (!path) {
        return "index";
      }
      return path;
    }
  }
}
</script>
<style>
@media(max-width: 480px) {
  .ant-table {
    width:100%;
    overflow-x: auto;
  }

  .ant-table-tbody>tr>td,.ant-table-tbody>tr>th,.ant-table-thead>tr>td,.ant-table-thead>tr>th {
    white-space: pre
  }

  .ant-table-tbody>tr>td>span,.ant-table-tbody>tr>th>span,.ant-table-thead>tr>td>span,.ant-table-thead>tr>th>span {
    display: block
  }
}
</style>
<style>
body {
  background: #f0f2f5;
}
.logo {
  height: 38px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
  color: #fff;
  text-align: center;
  font-weight: bold;
  font-size: 20px;
  padding-top: 4px;
}

.layout-admin .trigger {
  font-size: 18px;
  line-height: 64px;
  cursor: pointer;
  transition: color 0.3s;
}

.layout-admin .trigger:hover {
  color: #1890ff;
}

.layout-sider {
  overflow-y: auto;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
}

.layout-header {
  display: flex;
  justify-content: space-between;
  padding: 0 24px;
  background: #fff;
  border-bottom: 1px solid #e7eaec;
}

.auth-actions {
  color: #777;
  font-weight: 500;
}

.auth-actions span {
  cursor: pointer;
  margin-right: 4px;
}

.auth-actions a {
  color: #777;
}

.layout-footer {
  text-align: center;
  color: #888;
  user-select: none;
  padding: 24px 0;
}
</style>