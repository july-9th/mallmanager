<template>
<el-card class="box-card">
    <!-- 面包屑导航 -->
    <com-breadcrumb level1='数据统计' level2='数据报表'></com-breadcrumb>
    <!-- 绘制图形区域 -->
    <div id="main" style="width: 800px;height:400px;margin-top:21px"></div>
</el-card>
</template>

<script>
// 引入echarts对象
const echarts = require('echarts')

export default {

    /**
     * 必须等待页面加载完成
     */
    async mounted() {
        let myChart = echarts.init(document.getElementById('main'))
        // 1.指定图表的配置项和数据
        var option2 = {}
        var option1 = {
            title: {
                text: '区域销售情况统计'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985'
                    }
                }
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
        }
        // 2.发送请求获取数据
        await this.$http.get(`reports/type/1`)
            .then(res => {
                const {
                    data,
                    meta: {
                        msg,
                        status
                    }
                } = res.data
                if (status === 200) {
                    option2 = data
                }
            })
        // 3.合并数据
        var option = {
            ...option1,
            ...option2
        }
        // 4.使用刚指定的配置项和数据显示图表
        myChart.setOption(option);
    },
}
</script>

<style scoped>

</style>
