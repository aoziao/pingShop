<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <el-row>
        <el-col>
          <el-alert
            title="注意：只允许为第三级分类设置相关参数！"
            type="warning"
            :closable="false"
            show-icon
          >
          </el-alert>
        </el-col>
        <el-col>
          <span>请选择分类：</span>
          <el-cascader
            v-model="selectedCateKeys"
            :options="cateList"
            :props="cascaderProps"
            @change="selectedCateChange"
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- 页签 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addmanyDataDialogVisible = true"
            >添加参数
          </el-button>

          <!-- 动态参数表格 -->
          <el-table :data="manyTabData" stripe border>
            <el-table-column type="expand">
              <template #default="scope">
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="handleClose(index, scope.row)"
                >
                  {{ item }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.addNewTagVisible"
                  v-model="scope.row.addNewTagValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index"> </el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作" width="400">
              <template #default="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditManyData(scope.row.attr_id)"
                >
                  编辑
                </el-button>
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="deleteDataInfo(scope.row.attr_id)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addmanyDataDialogVisible = true"
            >添加参数
          </el-button>

          <!-- 静态参数表格 -->
          <el-table :data="onlyTabData" stripe border>
            <el-table-column type="expand">
              <template #default="scope">
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="handleClose(index, scope.row)"
                >
                  {{ item }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.addNewTagVisible"
                  v-model="scope.row.addNewTagValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index"> </el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作" width="400">
              <template #default="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit "
                  @click="showEditManyData(scope.row.attr_id)"
                >
                  编辑
                </el-button>
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="deleteDataInfo(scope.row.attr_id)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数弹出框 -->
    <el-dialog
      :title="titleText"
      :visible.sync="addmanyDataDialogVisible"
      width="50%"
      @close="addmanyDataClose"
    >
      <el-form
        :label-position="labelPosition"
        label-width="90px"
        :model="addmanyData"
        :rules="addmanyDataFormRules"
        ref="addmanyDataFormRef"
      >
        <el-form-item label="动态参数:" prop="attr_name">
          <el-input v-model="addmanyData.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addmanyDataDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addmanyDataInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑参数弹出框 -->
    <el-dialog
      title="编辑参数"
      :visible.sync="editmanyDataDialogVisible"
      width="50%"
      @close="editmanyDataClose"
    >
      <el-form
        :label-position="labelPosition"
        label-width="90px"
        :model="editmanyData"
        :rules="addmanyDataFormRules"
        ref="editManyDataFormRef"
      >
        <el-form-item :label="translateData" prop="attr_name">
          <el-input v-model="editmanyData.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editmanyDataDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editManyDataInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      cateList: [],
      // 动态数据参数
      manyTabData: [],
      // 静态属性参数
      onlyTabData: [],
      // 级联选择框双向绑定数据
      selectedCateKeys: [],
      // 级联选择框配置属性
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true,
        expandTrigger: 'hover'
      },
      // 页签数据：
      activeName: 'many',
      labelPosition: 'right',
      addmanyDataDialogVisible: false,
      editmanyDataDialogVisible: false,
      addmanyData: { attr_name: '' },
      editmanyData: { attr_name: '', attr_id: '' },
      addmanyDataFormRules: {
        attr_name: [
          { required: true, message: '请输入动态参数名称', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    async  getCateList () {
      const { data: res } = await this.$http.get('/categories')
      if (res.meta.status !== 200) return this.$message.error('获取分类列表失败')
      this.cateList = res.data
    },

    selectedCateChange  () {
      this.getParamsData()
    },

    // 页签切换函数
    handleTabClick () {
      console.log(this.activeName)
      this.getParamsData()
    },

    // 单独抽取参数获取函数
    async getParamsData () {
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        this.manyTabData = []
        this.onlyTabData = []
      }
      // 发起请求
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`,
        { params: { sel: this.activeName } })
      if (res.meta.status !== 200) return this.$message.error('获取数据失败')
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        item.addNewTagVisible = false
        item.addNewTagValue = ''
      })
      console.log(res.data)
      this.activeName === 'many'
        ? this.manyTabData = res.data : this.onlyTabData = res.data
    },

    addmanyDataClose () {
      this.$refs.addmanyDataFormRef.resetFields()
    },

    addmanyDataInfo () {
      this.$refs.addmanyDataFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请输入正确的数据')
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`,
          {
            attr_name: this.addmanyData.attr_name,
            attr_sel: this.activeName
          })
        if (res.meta.status !== 201) return this.$message.error('创建数据失败！')
        this.$message.success('创建动态数据成功！')
      })
      this.getParamsData()
      this.addmanyDataDialogVisible = false
    },

    editManyDataInfo () {
      this.$refs.editManyDataFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请输入正确的数据')
        const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editmanyData.attr_id}`, {
          attr_name: this.editmanyData.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 200) return this.$message.error('编辑数据失败！')
        this.$message.success('编辑数据成功！')
        this.getParamsData()
      })
      this.editmanyDataDialogVisible = false
    },

    editmanyDataClose () {
      this.$refs.editManyDataFormRef.resetFields()
    },

    async showEditManyData (id) {
      this.editmanyDataDialogVisible = true
      this.editmanyData.attr_id = id
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${id}`)
      this.editmanyData.attr_name = res.data.attr_name
    },
    async deleteDataInfo (id) {
      console.log(id)
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 取消删除
      if (confirmResult !== 'confirm') {
        return this.$message.info('已经取消删除')
      }
      // 发送请求根据id完成删除操作
      const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${id}`)
      // 判断如果删除失败，就做提示
      if (res.meta.status !== 200) return this.$message.error('删除数据失败')
      // 修改成功的提示
      this.$message.success('删除数据成功')
      // 重新请求最新的数据
      this.getParamsData()
    },
    async handleInputConfirm (row) {
      if (row.addNewTagValue.trim().length === 0) {
        row.addNewTagValue = ''
      } else {
        row.attr_vals.push(row.addNewTagValue.trim())
        row.addNewTagValue = ''
        this.saveAttrVals(row)
      }
      row.addNewTagVisible = false
    },
    showInput (row) {
      row.addNewTagVisible = true
      // 自动聚焦 $nextTick页面上的元素被重新渲染之后，才会调用会带函数的代码
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 抽离更新数组
    async saveAttrVals (row) {
      const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' ')
      })
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('修改参数项失败')
      // 修改成功的提示
      this.$message.success('修改参数项成功')
    },
    // 删除参数
    handleClose (index, row) {
      // 截取数组
      row.attr_vals.splice(index, 1)
      this.saveAttrVals(row)
    }
  },
  computed: {
    isBtnDisabled () {
      return this.selectedCateKeys.length !== 3
    },
    cateId () {
      return this.selectedCateKeys.length === 3 ? this.selectedCateKeys[2] : null
    },
    titleText () {
      return this.activeName === 'many' ? '添加动态参数' : '添加静态属性'
    },
    translateData () {
      return this.activeName === 'many' ? '动态参数:' : '静态属性:'
    }
  }
}
</script>

<style scoped>
.el-cascader {
  width: 50%;
}

.el-tag {
  margin: 10px;
}
.input-new-tag {
  width: 120px;
}
</style>
