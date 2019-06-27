<template>
	<div class="info">
		<el-container>
			<el-header>
				<el-breadcrumb separator-class="el-icon-arrow-right">
					<el-breadcrumb-item :to="{path:'/equipment/customer-list'}">客户列表</el-breadcrumb-item>
					<el-breadcrumb-item :to="{path:'/equipment/customer-detail'}">信息</el-breadcrumb-item>
				</el-breadcrumb>
			</el-header>
			<el-main>
				<el-row class="content" v-loading="loading" element-loading-text="拼命加载中">
					<ul>
						<li><p>客户名称</p><p>{{tableData.EAF_NAME}}</p></li>
						<li><p>客户类型</p><p>{{tableData.RMD_TYPE}}</p></li>
						<li><p>客户介绍</p><p>{{tableData.RMD_INTRODUCTION}}</p></li>
						<li><p>地址</p><p>{{tableData.RMD_ADDRESS}}</p></li>
						<li><p>省</p><p>{{tableData.RMD_PROVINCE}}</p></li>
						<li><p>市</p><p>{{tableData.RMD_CITY}}</p></li>
						<li><p>经度</p><p>{{tableData.RMD_LNG}}</p></li>
						<li><p>维度</p><p>{{tableData.RMD_LNG}}</p></li>
						<li><p>添加时间</p><p>{{tableData.EAF_CREATETIME_STR}}</p></li>
					</ul>
				</el-row>
			</el-main>
		</el-container>
	</div>
</template>
<script>
import { getCustomerDetail } from '@/assets/js/equipment'

export default {
  name: 'CustomerDetail',
  data () {
    return {
      tableData: {},
      loading: true
    }
  },
  methods: {
    getTableData (_eafId) {
      this.loading = true
      getCustomerDetail(_eafId).then((res) => {
        if (!res.data.EAF_ERROR) {
          setTimeout(() => {
            this.loading = false
            this.tableData = res.data
          }, 500)
        }
      }).catch((error) => {
        console.log(error)
      })
    }
  },
  mounted () {
    this.getTableData(this.$route.params.eafId)
  }
}
</script>
<style scoped lang="scss" rel="stylesheet/scss">
	.info {
		display: flex;
		background-color: #ECEFF4;
		.el-container{
			.el-header {
				height: 30px !important;
				.el-breadcrumb {
					line-height: 30px;
				}
			}
			.el-main{
				display: flex;
				padding-top: 0;
				.content{
					flex: 1;
					background-color: #fff;
					overflow: auto;
					ul {
						width: 100%;
						border: 1px solid #ccc;
						li{
							width: 100%;
							height: 50px;
							display: flex;
							border-bottom: 1px solid #ccc;
							p{
								display: flex;
								padding: 0 20px;
								align-items: center;
								&:nth-child(1) {
									flex: 1;
									justify-content: flex-end;
									border-right: 1px solid #ccc;
								}
								&:nth-child(2) {
									flex: 3;
									justify-content: flex-start;
								}
							}
						}
					}
				}
			}
		}
	}
</style>
