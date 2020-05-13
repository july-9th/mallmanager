<template>
<!-- <h1>欢迎使用电商后台管理系统</h1> -->
<el-container class="container">
    <el-header class="header">
        <el-row>
            <el-col :span="22">
                <h1>电商后台管理系统</h1>
            </el-col>
            <el-col :span="2">
                <a href="#" @click.prevent="handleExit">退出</a>
            </el-col>
        </el-row>
    </el-header>
    <el-container>
        <el-aside width="200px" class="aside">
            <!-- 侧边栏 -->
            <el-menu class="menu" :unique-opened="true" :router="true">
                <el-submenu :index="index+''" v-for="(item, index) in menus" :key="index">
                    <template slot="title">
                        <i class="el-icon-s-tools"></i>
                        <span>{{item.authName}}</span>
                    </template>
                    <el-menu-item :index="'/'+item1.path" v-for="(item1, index) in item.children" :key="index">
                        <i class="el-icon-menu"></i>
                        <span slot="title">{{item1.authName}}</span>
                    </el-menu-item>
                </el-submenu>
            </el-menu>
        </el-aside>
        <el-main class="main">
            <!-- 动态显示组件区域 （嵌套路由 子路由） -->
            <router-view></router-view>
        </el-main>
    </el-container>
</el-container>
</template>

<script>
export default {
    data() {
        return {
            menus: [], // 菜单项
        }
    },
    // 判断是否有token ? =>login 仅仅是在第一次进首页时生效。最终效果：每次页面跳转都需要验证
    // beforeCreate() {
    //     let token = localStorage.getItem('token')
    //     if (!token) { // true 没有登录 token = null
    //         // 跳转登录
    //         this.$router.push({
    //             name: 'login'
    //         })
    //         this.$message.warning('请先登录')
    //     }
    // },
    created() {
        // 动态加载左侧菜单
        this.$http.get(`menus`)
            .then(res => {
                const {
                    data,
                    meta: {
                        msg,
                        status
                    }
                } = res.data
                if (status === 200) {
                    this.menus = data
                }
            }).catch(res => {})
    },
    methods: {
        handleExit() {
            //清空
            localStorage.clear()
            //删除token
            //localStorage.removeItem('token')
            //跳转登录
            this.$router.push({
                name: 'login'
            })
        }
    },
}
</script>

<style scoped>
.header {
    background-color: #222;
    color: #fff;
    text-align: center;
    line-height: 60px;
}

.header a {
    color: #fff;
}

.container,
.aside,
.menu {
    height: 100%;
}

.main {
    background-color: #E8EDF2;
}
</style>
