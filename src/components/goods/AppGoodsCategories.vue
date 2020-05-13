<template>
<el-card class="box-card">
    <!-- 面包屑导航 -->
    <com-breadcrumb level1='商品管理' level2='商品分类'></com-breadcrumb>
    <!-- 添加按钮 -->
    <el-button type="success" plain class="addbtn" @click="handleAddGoodsCate">添加分类</el-button>
    <!-- 数据表格 -->
    <el-table :data="categorys" border height="420px" v-loading="loading">
        <!-- <el-table-column prop="cat_name" label="分类名称">
        </el-table-column> -->
        <!-- 树状菜单 prop属性值 label显示标题 treeKey实际值 parentKey父级编号 levelKey当前级别 childKey子节点-->
        <el-tree-grid prop="cat_name" label="分类名称" treeKey="cat_id" parentKey="cat_pid" levelKey="cat_level" childKey="children" :indentSize="30" folderIcon="">
        </el-tree-grid>
        <el-table-column label="级别">
            <template slot-scope="scope">
                <span v-if="scope.row.cat_level === 0">一级</span>
                <span v-if="scope.row.cat_level === 1">二级</span>
                <span v-if="scope.row.cat_level === 2">三级</span>
            </template>
        </el-table-column>
        <el-table-column label="是否有效">
            <template slot-scope="scope">
                {{scope.row.cat_deleted?"无效":"有效"}}
            </template>
        </el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit" circle plain @click="handleShowEdit(scope.row)"></el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete" circle plain @click="handleDelete(scope.row.cat_id)"></el-button>
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
    <el-pagination class="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum" :page-sizes="[10, 15, 20, 25]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>

    <!-- 添加商品对话框 -->
    <el-dialog title="添加商品分类" :visible.sync="dialogFormVisibleAdd" width="42%" @close="handleCloseDialog()">
        <el-form :model="formdata">
            <el-form-item label="分类名称" label-width="120px">
                <el-input v-model="formdata.cat_name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="选择分类" label-width="120px">
                <el-cascader v-model="selectOptions" :options="cateOptions" clearable :props="defaultProps">
                </el-cascader> 分类不选，即为根级
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
            <el-button type="primary" @click="handleAdd">添加</el-button>
        </div>
    </el-dialog>

    <!-- 修改商品对话框 -->
    <el-dialog title="修改商品分类" :visible.sync="dialogFormVisibleEdit" width="42%" @close="handleCloseDialog()">
        <el-form :model="formdata">
            <el-form-item label="分类名称" label-width="120px">
                <el-input v-model="formdata.cat_name" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
                <el-button type="primary" @click="handleEdit">修改</el-button>
            </div>
    </el-dialog>
</el-card>
</template>

<script>
var ElTreeGrid = require('element-tree-grid')
export default {
    data() {
        return {
            loading: false, // 加载等待
            categorys: [], // 商品分类数据
            cateOptions: [], // 选中分类
            formdata: {}, // 表单对象
            selectOptions: {}, // 选项
            pagenum: 1, // 当前页
            pagesize: 10, // 每页条数
            total: 0, // 总条数
            dialogFormVisibleAdd: false, // 添加对话框
            dialogFormVisibleEdit: false, // 修改对话框
            defaultProps: { // 商品分类数据
                value: 'cat_id',
                label: 'cat_name',
                children: 'children',
                checkStrictly: true, // 支持单选
            },

        }
    },
    components: {
        ElTreeGrid
    },
    created() {
        // 查询数据
        this.loadData()
    },
    methods: {
        // 添加分类
        handleAdd() {
            if (this.selectOptions.length === 0) {
                // 第一级
                this.formdata.cat_level = 0
                this.formdata.cat_pid = 0
            } else if (this.selectOptions.length === 1) {
                // 第二级
                this.formdata.cat_level = 1
                this.formdata.cat_pid = this.selectOptions[0]

            } else if (this.selectOptions.length === 2) {
                // 第三级
                this.formdata.cat_level = 2
                this.formdata.cat_pid = this.selectOptions[1]
            }
            this.$http.post(`categories`, this.formdata)
                .then(res => {
                    const {
                        data,
                        meta: {
                            msg,
                            status
                        }
                    } = res.data
                    if (status === 201) {
                        this.$message.success(msg)
                        this.loadData()
                        //关闭对话框
                        this.dialogFormVisibleAdd = false
                        this.selectOptions = {}
                    }
                }).catch(res => {})
        },
        // 打开添加分类对话框
        handleAddGoodsCate() {
            // 加载分类信息
            this.$http.get(`categories?type=2`)
                .then(res => {
                    const {
                        data,
                        meta: {
                            msg,
                            status
                        }
                    } = res.data
                    if (status === 200) {
                        this.cateOptions = data
                        this.dialogFormVisibleAdd = true
                    }
                }).catch(res => {})
        },
        // 修改分类
        handleEdit() {
            this.$http.put(`categories/${this.formdata.cat_id}`, this.formdata)
                .then(res => {
                    const {
                        data,
                        meta: {
                            msg,
                            status
                        }
                    } = res.data
                    if (status === 200) {
                        this.$message.success(msg)
                        this.loadData()
                        //关闭对话框
                        this.dialogFormVisibleEdit = false
                    } 
                }).catch(res => {})
        },
        // 打开修改对话框
        handleShowEdit(category) {
            this.formdata = {
                cat_id: category.cat_id,
                cat_name: category.cat_name
            }
            this.dialogFormVisibleEdit = true
        },
        // 关闭添加对话框
        handleCloseDialog() {
            // 清除数据
            this.formdata = {}
        },
        // 删除分类
        handleDelete(id) {
            this.$confirm('此操作将永久删除该分类信息, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http.delete(`categories/${id}`)
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
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
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
            await this.$http.get(`categories?type=3&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
                .then(res => {
                    const {
                        data,
                        meta: {
                            msg,
                            status
                        }
                    } = res.data
                    if (status === 200) {
                        this.categorys = data.result
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
.addbtn {
    margin: 20px 0;
}

.pagination {
    text-align: center;
    margin: 30px 0;
}
</style>
