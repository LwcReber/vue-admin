<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb
      id="breadcrumb-container"
      class="breadcrumb-container"
    />

    <div class="right-menu">
      <el-dropdown
        class="avatar-container right-menu-item hover-effect"
        trigger="hover"
        @command="rightMenuChange"
      >
        <div class="avatar-wrapper">
          <div class="user-avatar"></div>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="logout">
            <div>
              退出登录
            </div>
          </el-dropdown-item>
          <el-dropdown-item command="password">
            <span>修改密码</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <PasswordDialog :visible.sync="visible"></PasswordDialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Hamburger from '@/components/Hamburger'

import Breadcrumb from '@/components/Breadcrumb'
import PasswordDialog from './Password.vue'
import {
  Dropdown,
  DropdownMenu,
  DropdownItem
} from 'element-ui'
export default {
  components: {
    Hamburger,
    PasswordDialog,
    'el-dropdown': Dropdown,
    'el-dropdown-menu': DropdownMenu,
    'el-dropdown-item': DropdownItem,
    Breadcrumb
  },
  data () {
    return {
      visible: false
    }
  },
  computed: {
    ...mapGetters([
      'envValueList',
      'env',
      'sidebar',
      'avatar',
      'device'
    ])
  },
  methods: {
    rightMenuChange (value) {
      if (value === 'logout') {
        this.logout()
      } else {
        this.handlePassword()
      }
    },
    toggleSideBar () {
      this.$store.dispatch('app/toggleSideBar')
    },
    handlePassword () {
      this.visible = true
      console.log('password')
    },
    logout () {
      this.$confirm('确定要退出登录吗？', '退出登录', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        center: true
      }).then(async () => {
        await this.$store.dispatch('user/logout')
        this.$router.push('/login')
      }).catch(() => {

      })
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: $navbarHeight;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: $navbarHeight;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #eee;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 50%;
          margin-top: -6px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
