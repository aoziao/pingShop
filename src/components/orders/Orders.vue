<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容"
                    v-model="queryInfo.query">
            <el-button slot="append"
                       icon="el-icon-search"
                       @click="getOrderList"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 列表渲染 -->
      <el-table :data="orderList"
                border
                stripe
                style="width: 100%">
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="order_number"
                         label="订单编号"
                         width="250">
        </el-table-column>
        <el-table-column prop="order_price"
                         label="订单价格"></el-table-column>
        <el-table-column prop="is_send"
                         label="是否发货">
          <template #default="scope">
            <el-tag type="success"
                    size="medium"
                    v-if="scope.row.is_send === '是'">已付款</el-tag>
            <el-tag type="warning"
                    size="medium"
                    v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="add_time"
                         label="下单时间"
                         width="250">
          <template #default="{ row }">
            {{ row.add_time | dataFormat("YYYY-MM-DDDD  hh:mm:ss") }}
          </template>
        </el-table-column>
        <el-table-column label="操作"
                         width="250">
          <template #default="scope">
            <el-button type="primary"
                       icon="el-icon-edit"
                       size="medium"
                       @click="editOrderAdress(scope.row.order_id)"></el-button>
            <el-button type="success"
                       icon="el-icon-location"
                       size="medium"
                       @click="showProgress(scope.row.order_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--分页  -->
      <el-pagination background
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page.sync="queryInfo.pagenum"
                     :page-size="10"
                     :page-sizes="[10, 20, 50, 100]"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </el-card>

    <!-- 编辑地址 -->
    <el-dialog title="修改地址"
               :visible.sync="editAdressDialogVisible"
               width="50%"
               @close="editAdressDialogClosed">
      <el-form :label-position="labelPosition"
               label-width="80px"
               :model="editAdress"
               :rules="editAdressFormRules"
               ref="editAdressFormRef">
        <el-form-item label="省市区/县">
          <el-cascader v-model="selectedCateKeys"
                       :options="cityData"
                       :props="cascaderProps"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址"
                      prop="adress2">
          <el-input v-model="editAdress.adress2"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer"
            class="dialog-footer">
        <el-button @click="editAdressDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="editAddressInfo"> 确 定 </el-button>
      </span>
    </el-dialog>

    <!-- 物流信息 -->
    <el-dialog title="物流信息"
               :visible.sync="progressDialogVisible"
               width="50%">
      <el-timeline>
        <el-timeline-item v-for="(progerssMsg, index) in progerssMsg"
                          :key="index"
                          :timestamp="progerssMsg.time">
          {{ progerssMsg.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from './citydata'

export default {
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      orderList: [],
      labelPosition: 'right',
      editAdressDialogVisible: false,
      progressDialogVisible: false,
      editAdress: {
        adress1: '',
        adress2: ''
      },
      cityData,
      editAdressFormRules: { adress1: [], adress2: [] },
      selectedCateKeys: '',
      // 级联选择框配置属性
      cascaderProps: {
        value: 'value',
        label: 'label',
        children: 'children',
        checkStrictly: true,
        expandTrigger: 'hover'
      },
      progerssMsg: []

    }
  },
  created () {
    this.getOrderList()
  },
  methods: {
    async getOrderList () {
      const { data: res } = await this.$http.get('orders', { params: this.queryInfo })
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取商品列表失败')
      this.orderList = res.data.goods
      this.total = res.data.total
    },
    // 列表条数
    handleSizeChange (val) {
      this.queryInfo.pagesize = val
      this.getOrderList()
    },
    // 页码
    handleCurrentChange (val) {
      this.queryInfo.pagenum = val
      this.getOrderList()
    },
    editOrderAdress (id) {
      console.log(id)
      this.editAdressDialogVisible = true
    },
    editAddressInfo () {
      this.editAdressDialogVisible = false
    },
    editAdressDialogClosed () {
      this.$refs.editAdressFormRef.resetFields()
    },
    async showProgress (id) {
      console.log(id)
      this.progressDialogVisible = true
      const { data: res } = await this.$http.get('/kuaidi/1106975712662')
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取物流信息失败')
      this.$message.success('获取物流信息成功')
      this.progerssMsg = res.data
    }
  }
}
</script>

<style scoped>
</style>
