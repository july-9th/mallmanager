<template>
<el-card class="box-card">
    <!-- 面包屑导航 -->
    <com-breadcrumb level1='权限管理' level2='权限列表'></com-breadcrumb>
    <!-- 数据表格 -->
    <el-table :data="rights" border style="margin: 30px 0" height="377" v-loading="loading">
        <el-table-column type="index" label="#" width="50">
        </el-table-column>
        <el-table-column prop="authName" label="权限名称">
        </el-table-column>
        <el-table-column prop="path" label="路径">
        </el-table-column>
        <el-table-column label="层级">
            <template slot-scope="scope">
                <!-- 处理级别 -->
                <span v-if="scope.row.level === '0'">一级</span>
                <span v-else-if="scope.row.level === '1'">二级</span>
                <span v-else-if="scope.row.level === '2'">三级</span>
            </template>
        </el-table-column>
    </el-table>
</el-card>
</template>

<script>
export default {
    data() {
        return {
            loading: false, // 加载等待
            rights: [], // 权限列表
        }
    },
    created() {
        this.loadData()
    },
    methods: {
        async loadData() {
            this.loading = true
            await this.$http.get(`rights/list`)
                .then(res => {
                    const {
                        data,
                        meta: {
                            msg,
                            status
                        }
                    } = res.data
                    if (status === 200) {
                        this.rights = data
                    }
                }).catch(res => {})
            this.loading = false
        }
    },
}
</script>

<style scoped>

</style>
