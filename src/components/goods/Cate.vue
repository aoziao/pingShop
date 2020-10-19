<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-button type="primary"
               @click="addParentGoodsList">添加分类</el-button>
    <!-- 表格  selection-type:多选框  expand-type：展开行效果 show-index：索引列 show-row-hover：悬停高亮-->
    <tree-table class="treeTable"
                :data="goodsList"
                :columns="columns"
                :selection-type="false"
                :expand-type="false"
                show-index
                index-text="#"
                border
                :show-row-hover="false">
      <!-- 是否有效 -->
      <template v-slot:isok="scope">
        <i class="el-icon-success"
           v-if="scope.row.cat_deleted === false"
           style="color: lightgreen"></i>
        <i class="el-icon-error"
           v-else
           style="color: red"></i>
      </template>
      <!-- 排序 -->
      <template v-slot:order="scope">
        <el-tag size="mini"
                v-if="scope.row.cat_level === 0">一级</el-tag>
        <el-tag type="success"
                size="mini"
                v-else-if="scope.row.cat_level === 1">二级</el-tag>
        <el-tag type="warning"
                size="mini"
                v-else>三级</el-tag>
      </template>
      <!-- 操作 -->
      <template v-slot:opt="scope"
                class="last_caoz">
        <el-button type="primary"
                   icon="el-icon-edit"
                   size="mini"
                   @click="showEditform(scope.row)">编辑</el-button>
        <el-button type="danger"
                   icon="el-icon-delete"
                   size="mini"
                   @click="deleteCate(scope.row)">删除</el-button>
      </template>
    </tree-table>

    <!-- 分页 -->
    <el-pagination background
                   @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :current-page.sync="queryInfo.pagenum"
                   :page-size="2"
                   :page-sizes="[1, 2, 5, 10]"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="total">
    </el-pagination>

    <!-- 添加分类 -->
    <el-dialog title="提示"
               :visible.sync="addCateDialogVisible"
               width="50%"
               @close="addCateDialogClosed">
      <el-form :label-position="labelPosition"
               label-width="90px"
               :model="addCate"
               :rules="addCateFormRules"
               ref="addCateFormRef">
        <el-form-item label="分类名称:"
                      prop="cat_name">
          <el-input v-model="addCate.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:"
                      prop="cat_Par">
          <div class="block select_from"
               width="100%">
            <el-cascader v-model="changeCateInfo"
                         :options="parentGoodsList"
                         :props="cascaderProps"
                         @change="parentCateChange"
                         expand-trigger="hover"></el-cascader>
          </div>
        </el-form-item>
      </el-form>

      <span slot="footer"
            class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="addCateInfo"> 确 定 </el-button>
      </span>
    </el-dialog>

    <!-- 编辑分类 -->
    <el-dialog title="提示"
               :visible.sync="editCateDialogVisible"
               width="50%"
               @close="editCateDialogClosed">
      <el-form :label-position="labelPosition"
               label-width="90px"
               :model="editCate"
               :rules="editCateFormRules"
               ref="editCateFormRef">
        <el-form-item label="分类名称:"
                      prop="cat_name">
          <el-input v-model="editCate.cat_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer"
            class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="saveEditCate"> 确 定 </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      goodsList: [],
      parentGoodsList: [],
      changeCateInfo: '',
      addCateDialogVisible: false,
      editCateDialogVisible: false,
      labelPosition: 'right',
      addCate: {
        cat_pid: 0,
        cat_name: '',
        cat_level: 0
      },
      editCate: {
        cat_id: '',
        cat_name: ''
      },
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        }, {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      addCateFormRules: {
        cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
        cat_Par: [{ trigger: 'blur' }]
      },
      editCateFormRules: {
        cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]

      },
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true
      }
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList () {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      this.goodsList = res.data.result
      this.total = res.data.total
    },
    // 列表条数
    handleSizeChange (val) {
      this.queryInfo.pagesize = val
      this.getGoodsList()
    },
    // 页码
    handleCurrentChange (val) {
      this.queryInfo.pagenum = val
      this.getGoodsList()
    },
    addCateDialogClosed () {
      this.$refs.addCateFormRef.resetFields()
      this.changeCateInfo = ''
    },
    // 点击打开添加弹出框
    addParentGoodsList () {
      this.getParentGoodsList()
      this.addCateDialogVisible = true
    },

    // 获取父级分类数据
    async getParentGoodsList () {
      const { data: res } = await this.$http.get('categories', {
        params: {
          type: 2
        }
      })
      this.parentGoodsList = res.data
    },
    // 选择项变化出发函数
    parentCateChange () {
      if (this.changeCateInfo.length > 0) {
      // 则将数组中的最后一项设置为父级分类
        this.addCate.cat_pid = this.changeCateInfo[this.changeCateInfo.length - 1]
        // level也要跟着发生变化
        this.addCate.cat_level = this.changeCateInfo.length
      } else {
        this.addCate.cat_pid = 0
        this.addCate.cat_level = 0
      }
    },
    // 编辑弹出
    showEditform (val) {
      console.log(val)
      this.editCateDialogVisible = true
      this.editCate.cat_name = val.cat_name
      this.editCate.cat_id = val.cat_id
    },
    // 编辑取消重置
    editCateDialogClosed () {
      this.$refs.editCateFormRef.resetFields()
    },
    // 保存编辑
    saveEditCate () {
      this.$refs.editCateFormRef.validate(async valid => {
        if (!valid) return
        // 发送请求完成添加分类
        const { data: res } = await this.$http.put(
          'categories/' + this.editCate.cat_id,
          { cat_name: this.editCate.cat_name }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('编辑分类失败')
        }

        this.$message.success('编辑分类成功')
        this.getGoodsList()
        this.editCateDialogVisible = false
      })
    },
    // 删除
    async deleteCate (cate) {
      console.log(cate)
      const confirmResult = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 取消删除
      if (confirmResult !== 'confirm') {
        return this.$message.info('已经取消删除')
      }
      // 发送请求根据id完成删除操作
      const { data: res } = await this.$http.delete('categories/' + cate.cat_id)
      // 判断如果删除失败，就做提示
      if (res.meta.status !== 200) return this.$message.error('删除分类失败')
      // 修改成功的提示
      this.$message.success('删除分类成功')
      // 重新请求最新的数据
      this.getGoodsList()
    },

    addCateInfo () {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        // 发送请求完成添加分类
        const { data: res } = await this.$http.post(
          'categories',
          this.addCate
        )
        console.log(res)
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败')
        }

        this.$message.success('添加分类成功')
        this.getGoodsList()
        this.addCateDialogVisible = false
      })
    }

  }
}
</script>

<style scoped>
.el-cascader {
  width: 100%;
}
</style>
