<template>
<div class="login">
    <el-form label-position="top" label-width="80px" :model="formdata" class="login-form" :rules="rules" ref="ruleForm">
        <h2>用户登录</h2>
        <el-form-item label="用户名" prop="username">
            <el-input v-model="formdata.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
            <el-input v-model="formdata.password" placeholder="请输入密码" show-password></el-input>
        </el-form-item>
        <!-- 登录按钮 -->
        <el-button class="login-button" type="primary" @click="handleLogin('ruleForm')">登录</el-button>
    </el-form>
</div>
</template>

<script>
export default {
    data() {
        return {
            // 表单数据
            formdata: {
                username: 'admin',
                password: '123456',
            },
            // 表单校验规则
            rules: {
                username: [{
                        required: true,
                        message: '请输入登录名',
                        trigger: 'blur'
                    },
                    {
                        min: 2,
                        max: 10,
                        message: '长度在 2 到 10 个字符',
                        trigger: 'blur'
                    }
                ],
                password: [{
                        required: true,
                        message: '请输入密码',
                        trigger: 'blur'
                    },
                    {
                        min: 6,
                        max: 16,
                        message: '长度在 6 到 16 个字符',
                        trigger: 'blur'
                    }
                ],
            }
        }
    },
    methods: {
        // 用户登录
        handleLogin(formName) {
            //1.表单校验
            this.$refs[formName].validate((valid) => {
                if (valid) { // true 验证成功
                    //发送网络请求
                    this.$http.post(`login`, this.formdata)
                        .then(res => {
                            // 处理结果 结构
                            let{data,meta:{msg,status}} = res.data
                            if(status === 200){
                                // 登录成功
                                this.$message.success(msg)
                                // 存储token localStorage
                                localStorage.setItem('token',data.token)
                                // 跳转主页 home组件中有默认子路由 使用path
                                this.$router.push({path:'/'})
                            }
                        }).catch(res => {})
                } else {
                    return false;
                }
            });
        }
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.login {
    background-color: #324152;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.login .login-form {
    background-color: #fff;
    width: 400px;
    padding: 27px;
    border-radius: 7px;
}

.login .login-form .login-button {
    width: 100%;
}
</style>
