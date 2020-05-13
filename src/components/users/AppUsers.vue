<template>
<el-card class="box-card">
    <!-- 面包屑导航 -->
    <com-breadcrumb level1='用户管理' level2='用户列表'></com-breadcrumb>
    <!-- 搜索框 -->
    <el-row class="row">
        <el-col :span="7">
            <el-input placeholder="请输入内容" v-model="searchValue" class="input-with-select">
                <el-button slot="append" @click="loadData()" icon="el-icon-search"></el-button>
            </el-input>
        </el-col>
        <el-col :span="6">
            <el-button type="success" plain class="addbtn" @click="dialogFormVisibleAdd = true">添加用户</el-button>
        </el-col>
    </el-row>

    <!-- 数据表格 -->
    <el-table :data="users" border style="width: 100%" v-loading="loading">
        <el-table-column type="index" label="#" width="50">
        </el-table-column>
        <el-table-column prop="username" label="姓名">
        </el-table-column>
        <el-table-column prop="email" label="邮箱">
        </el-table-column>
        <el-table-column prop="mobile" label="电话">
        </el-table-column>
        <el-table-column prop="create_time" label="创建日期">
            <!-- 日期处理 -->
            <template slot-scope="scope">
                {{scope.row.create_time|moment('YYYY-MM-DD HH:mm:ss')}}
            </template>
        </el-table-column>
        <el-table-column label="用户状态">
            <template slot-scope="scope">
                <!-- 开关 -->
                <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949" @change="handleChangeState(scope.row.id,scope.row.mg_state)">
                </el-switch>
            </template>
        </el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit" circle plain @click="handleShowEdit(scope.row.id)"></el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete" circle plain @click="handleDelete(scope.row.id)"></el-button>
                <el-button size="mini" type="success" icon="el-icon-check" circle plain @click="handleShowRole(scope.row.id)"></el-button>
            </template>
        </el-table-column>
    </el-table>

    <!-- 
        分页栏
        size-change 页面显示条数 改变时会触发
        urrent-change 当前页 改变时会触发
        current-page 当前页码
        page-sizes 支持每页显示的条数
        page-size 每页显示条数
        layout 组件布局
        total 总条数
     -->
    <el-pagination class="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum" :page-sizes="[2, 4, 6, 8]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>

    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd" width="35%" @close="handleCloseDialog('ruleAddForm')">
        <el-form :model="formdata" :rules="rules" ref="ruleAddForm">
            <el-form-item label="用户名" label-width="120px" prop="username">
                <el-input v-model="formdata.username" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码" label-width="120px" prop="password">
                <el-input v-model="formdata.password" autocomplete="off" show-password></el-input>
            </el-form-item>
            <el-form-item label="确认密码" label-width="120px" prop="repwd">
                <el-input v-model="formdata.repwd" autocomplete="off" show-password></el-input>
            </el-form-item>
            <el-form-item label="邮箱" label-width="120px" prop="email">
                <el-input v-model="formdata.email" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="手机号" label-width="120px" prop="mobile">
                <el-input v-model="formdata.mobile" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
            <el-button type="primary" @click="handleAdd">添加</el-button>
        </div>
    </el-dialog>

    <!-- 修改用户对话框 -->
    <el-dialog title="修改用户" :visible.sync="dialogFormVisibleEdit" width="35%" @close="handleCloseDialog('ruleEditForm')">
        <el-form :model="formdata" :rules="rules" ref="ruleEditForm">
            <el-form-item label="用户名" label-width="120px">
                <el-input v-model="formdata.username" autocomplete="off" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" label-width="120px" prop="email">
                <el-input v-model="formdata.email" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="手机号" label-width="120px" prop="mobile">
                <el-input v-model="formdata.mobile" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
            <el-button type="primary" @click="handleEdit('ruleEditForm')">修改</el-button>
        </div>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRole" width="35%" @close="handleCloseRole">
        <el-form :model="formdata">
            <el-form-item label="用户名" label-width="120px">
                <!-- <el-input v-model="formdata.username" autocomplete="off" :disabled="true"></el-input> -->
                {{formdata.username}}
            </el-form-item>

            <el-form-item label="角色" label-width="120px">
                <el-select v-model="formdata.rid" placeholder="请选择">
                    <el-option v-for="item in roles" :key="item.id" :label="item.roleName" :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleRole = false">取 消</el-button>
            <el-button type="primary" @click="handleEditRole">确定</el-button>
        </div>
    </el-dialog>
</el-card>
</template>

<script>
export default {
    data() {
        var validateRepwd = (rule, value, callback) => {
            if (value === '' || value === undefined) {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.formdata.password) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        var validateEmail = (rule, value, callback) => {
            let reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
            if (value === '' || value === undefined) {
                callback(new Error('请输入邮箱'));
            } else if (!reg.test(value)) {
                callback(new Error('邮箱格式不合法!'));
            } else {
                callback();
            }
        };
        var validateMobile = (rule, value, callback) => {
            let reg = /^1[3-9]\d{9}$/
            if (value === '' || value === undefined) {
                callback(new Error('请输入手机号'));
            } else if (!reg.test(value)) {
                callback(new Error('手机号格式不合法!'));
            } else {
                callback();
            }
        };
        return {
            loading: false, // 加载等待
            users: [], // 用户数据
            pagenum: 1, // 当前页
            pagesize: 2, // 每页条数
            total: 0, // 总条数
            searchValue: '', // 查询字段
            dialogFormVisibleAdd: false, // 添加用户对话框
            dialogFormVisibleEdit: false, // 修改用户对话框
            dialogFormVisibleRole: false, // 用户角色对话框
            formdata: {}, // 表单对象
            roles: {}, // 角色列表

            // 表单校验规则
            rules: {
                username: [{
                        required: true,
                        message: '请输入用户名',
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
                repwd: [{
                    required: true,
                    validator: validateRepwd,
                    trigger: 'blur'
                }],
                email: [{
                    required: true,
                    validator: validateEmail,
                    trigger: 'blur'
                }],
                mobile: [{
                    required: true,
                    validator: validateMobile,
                    trigger: 'blur'
                }],
            }
        }
    },
    created() {
        // 查询数据
        this.loadData()
    },
    methods: {
        // 关闭角色对话框
        handleCloseRole() {
            this.formdata = {}
        },
        // 分配角色
        handleEditRole() {
            if (this.formdata.rid === undefined) {
                this.$message.warning('请选择分配的角色')
                return
            }
            // 发送请求 分配角色
            this.$http.put(`users/${this.formdata.id}/role`, this.formdata)
                .then(res => {
                    const {
                        data,
                        meta: {
                            msg,
                            status
                        }
                    } = res.data
                    if (status === 200) {
                        this.dialogFormVisibleRole = false
                        this.$message.success(msg)
                    } 
                }).catch(res => {})
        },
        // 打开角色对话框
        handleShowRole(id) {
            this.dialogFormVisibleRole = true
            // 查询用户信息
            this.$http.get(`users/${id}`)
                .then(res => {
                    const {
                        data,
                        meta: {
                            msg,
                            status
                        }
                    } = res.data
                    if (status === 200) {
                        this.formdata = data
                        // 处理为 -1 undefined 请选择
                        this.formdata.rid = data.rid == -1 ? data.rid = undefined : data.rid
                    } 
                }).catch(res => {})
            // 加载角色列表
            this.$http.get(`roles`)
                .then(res => {

                    const {
                        data,
                        meta: {
                            msg,
                            status
                        }
                    } = res.data
                    if (status === 200) {
                        this.roles = data
                    } 
                }).catch(res => {})
        },
        // 修改用户
        handleEdit(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$http.put(`users/${this.formdata.id}`, this.formdata)
                        .then(res => {
                            const {
                                data,
                                meta: {
                                    msg,
                                    status
                                }
                            } = res.data
                            if (status === 200) {
                                this.loadData()
                                this.$message.success(msg)
                                //关闭对话框
                                this.dialogFormVisibleEdit = false
                            } 
                        }).catch(res => {})
                } else {
                    return false;
                }
            });
        },
        // 打开修改对话框
        handleShowEdit(id) {
            this.dialogFormVisibleEdit = true
            // 根据ID查询信息
            this.$http.get(`users/${id}`)
                .then(res => {

                    const {
                        data,
                        meta: {
                            msg,
                            status
                        }
                    } = res.data
                    if (status === 200) {
                        this.formdata = data
                    } 
                }).catch(res => {})
        },
        // 添加用户
        handleAdd() {
            this.$refs['ruleAddForm'].validate((valid) => {
                if (valid) {
                    this.$http.post(`users`, this.formdata)
                        .then(res => {
                            const {
                                data,
                                meta: {
                                    msg,
                                    status
                                }
                            } = res.data
                            if (status === 201) {
                                this.loadData()
                                this.$message.success(msg)
                                //关闭对话框
                                this.dialogFormVisibleAdd = false
                            } 
                        }).catch(res => {})
                } else {
                    return false;
                }
            });
        },
        // 关闭添加对话框
        handleCloseDialog(formName) {
            // 清除数据
            this.formdata = {}
            // 重置验证
            this.$refs[formName].resetFields();
        },
        // 删除用户
        handleDelete(id) {
            this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http.delete(`users/${id}`)
                    .then(res => {
                        const {
                            data,
                            meta: {
                                msg,
                                status
                            }
                        } = res.data
                        if (status === 200) {
                            this.loadData()
                            this.$message.success(msg)
                        } else {
                            this.$message.error(msg)
                        }
                    }).catch(res => {})
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        // 改变状态
        handleChangeState(id, state) {
            this.$http.put(`users/${id}/state/${state}`)
                .then(res => {
                    const {
                        data,
                        meta: {
                            msg,
                            status
                        }
                    } = res.data
                    if (status === 200) {
                        this.loadData()
                        this.$message.success(msg)
                    }
                }).catch(res => {})
        },
        // 页面大小发生变化
        handleSizeChange(val) {
            this.pagesize = val
            this.loadData()
        },
        // 页码发生变化
        handleCurrentChange(val) {
            this.pagenum = val
            this.loadData()
        },
        // 加载数据
        async loadData() {
            this.loading = true
            await this.$http.get(`users?query=${this.searchValue}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
                .then(res => {
                    const {
                        data,
                        meta: {
                            msg,
                            status
                        }
                    } = res.data
                    if (status === 200) {
                        this.users = data.users
                        this.pagenum = data.pagenum
                        this.total = data.total
                    } 
                }).catch(res => {})
            this.loading = false
        }
    },
}
</script>

<style scoped>
.row {
    margin: 20px 0;
}

.addbtn {
    margin-left: 10px;
}

.pagination {
    text-align: center;
    margin: 30px 0;
}
</style>
