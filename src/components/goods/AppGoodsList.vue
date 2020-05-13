<template>
<el-card class="box-card">
    <!-- 面包屑导航 -->
    <com-breadcrumb level1='商品管理' level2='商品列表'></com-breadcrumb>
    <!-- 搜索框 -->
    <el-row class="row">
        <el-col :span="7">
            <el-input placeholder="请输入内容" v-model="searchValue" class="input-with-select">
                <el-button slot="append" @click="loadData()" icon="el-icon-search"></el-button>
            </el-input>
        </el-col>
        <el-col :span="6">
            <el-button type="success" plain class="addbtn" @click="$router.push({name:'goodsadd'})">添加商品</el-button>
        </el-col>
    </el-row>

    <!-- 数据表格 -->
    <el-table :data="goods" border style="width: 100%" height="377" v-loading="loading">
        <el-table-column type="index" label="#" width="50">
        </el-table-column>
        <el-table-column prop="goods_name" label="商品名称">
        </el-table-column>
        <el-table-column prop="goods_price" label="商品价格（元）" width="100">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="100">
        </el-table-column>
        <el-table-column label="创建日期" width="170">
            <!-- 日期处理 -->
            <template slot-scope="scope">
                {{scope.row.add_time|moment('YYYY-MM-DD HH:mm:ss')}}
            </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
            <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit" circle plain @click="handleShowEdit(scope.row.goods_id)"></el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete" circle plain @click="handleDelete(scope.row.goods_id)"></el-button>
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
    <el-pagination class="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum" :page-sizes="[5, 10, 15, 20]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
</el-card>
</template>

<script>
export default {
    data() {
        return {
            loading: false, // 加载等待
            goods: [], // 商品数据
            pagenum: 1, // 当前页
            pagesize: 5, // 每页条数
            total: 0, // 总条数
            searchValue: '', // 查询字段
        }
    },
    created() {
        // 查询数据
        this.loadData()
    },
    methods: {
        // 跳转页面修改
        handleShowEdit(id){
            this.$router.push({name:'goodsedit',params:{id:id}})
        },
        // 删除商品
        handleDelete(id) {
            id
            this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http.delete(`goods/${id}`)
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
            }).catch(() => {});
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
            await this.$http.get(`goods?query=${this.searchValue}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
                .then(res => {
                    const {
                        data,
                        meta: {
                            msg,
                            status
                        }
                    } = res.data
                    if (status === 200) {
                        this.goods = data.goods
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
