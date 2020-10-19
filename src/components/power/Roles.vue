<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-button type="primary"
                 @click="AddRolesDialogVisible = true">添加角色</el-button>
      <el-table :data="rolesList"
                stripe
                border>
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row v-for="item in scope.row.children"
                    :key="item.id"
                    class="bdtop">
              <el-col :span="6">
                <el-tag closable
                        @close="deleteThreeRoles(scope.row, item)">{{
                  item.authName
                }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="18">
                <el-row v-for="item1 in item.children"
                        :key="item1.id"
                        class="bdbottom">
                  <el-col :span="6">
                    <el-tag closable
                            type="success"
                            @close="deleteThreeRoles(scope.row, item1)">{{ item1.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag closable
                            v-for="item2 in item1.children"
                            :key="item2.id"
                            type="warning"
                            @close="deleteThreeRoles(scope.row, item2)">{{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"> </el-table-column>
        <el-table-column label="角色名称"
                         prop="roleName"></el-table-column>
        <el-table-column label="角色描述"
                         prop="roleDesc"></el-table-column>
        <el-table-column label="操作"
                         width="400">
          <template v-slot="{ row }">
            <el-button size="mini"
                       type="primary"
                       icon="el-icon-edit"
                       @click="editRolesForm(row.id)">编辑</el-button>
            <el-button size="mini"
                       type="danger"
                       icon="el-icon-delete"
                       @click="deleteRolesForm(row.id)">删除</el-button>
            <el-button size="mini"
                       type="warning"
                       icon="el-icon-s-tools"
                       @click="showRolesTree(row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加弹出框 -->
    <el-dialog title="添加角色"
               :visible.sync="AddRolesDialogVisible"
               width="50%"
               @close="AddRolesDialogClose">
      <el-form :label-position="labelPosition"
               label-width="80px"
               :model="AddRoles"
               :rules="AddRolesFormRules"
               ref="AddRolesFormRef">
        <el-form-item label="角色名称"
                      prop="roleName">
          <el-input v-model="AddRoles.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述"
                      prop="roleDesc">
          <el-input v-model="AddRoles.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer"
            class="dialog-footer">
        <el-button @click="AddRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="AddRolesInfo"> 确 定 </el-button>
      </span>
    </el-dialog>

    <!-- 编辑弹出框 -->
    <el-dialog title="提示"
               :visible.sync="editRolesDialogVisible"
               width="50%"
               @close="editRolesDialogClosed">
      <el-form :label-position="labelPosition"
               label-width="80px"
               :model="editRoles"
               :rules="editRolesFormRules"
               ref="editRolesFormRef">
        <el-form-item label="用户"
                      prop="roleName">
          <el-input v-model="editRoles.roleName"></el-input>
        </el-form-item>
        <el-form-item label="用户描述"
                      prop="roleDesc">
          <el-input v-model="editRoles.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer"
            class="dialog-footer">
        <el-button @click="editRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="editRolesInfo"> 确 定 </el-button>
      </span>
    </el-dialog>

    <!-- 权限树 -->
    <el-dialog title="分配权限"
               :visible.sync="showRolesVisible"
               width="50%"
               @close="showRolesTreeClosed">
      <el-tree :data="rolesTree"
               :props="defaultProps"
               default-expand-all
               show-checkbox
               node-key="id"
               :default-checked-keys="defKeys"
               ref="treeRef"></el-tree>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="showRolesVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="resetRolesInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      rolesList: [],
      labelPosition: 'right',
      AddRoles: { roleName: '', roleDesc: '' },
      editRoles: { roleId: '', roleName: '', roleDesc: '' },
      rolesTree: [],
      AddRolesDialogVisible: false,
      editRolesDialogVisible: false,
      showRolesVisible: false,
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      defKeys: [],
      // 权限分配id
      roleId: '',
      AddRolesFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { message: '请输入角色描述', trigger: 'blur' }
        ]
      },
      editRolesFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { message: '请输入角色描述', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    async getRolesList () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('获取角色列表失败')
      this.rolesList = res.data
      // console.log(this.rolesList)
    },
    // 对话框关闭之后，重置表达
    AddRolesDialogClose () {
      this.$refs.AddRolesFormRef.resetFields()
    },
    AddRolesInfo () {
      this.$refs.AddRolesFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请填写正确的角色信息')
        // 发送请求完成添加用户的操作
        const { data: res } = await this.$http.post('roles', this.AddRoles)
        // 判断如果添加失败，就做提示
        if (res.meta.status !== 201) {
          return this.$message.error('添加角色失败')
        }
        // 添加成功的提示
        this.$message.success('添加角色成功')
        // 关闭对话框
        this.AddRolesDialogVisible = false
        // 重新请求最新的数据
        this.getRolesList()
      })
    },
    // 对话框关闭之后，重置表达
    editRolesDialogClosed () {
      this.$refs.editRolesFormRef.resetFields()
    },
    async editRolesForm (id) {
      this.editRoles.roleId = id
      this.editRolesDialogVisible = true
      const { data: res } = await this.$http.get(`roles/${id}`)
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取角色信息失败')
      this.editRoles.roleName = res.data.roleName
      this.editRoles.roleDesc = res.data.roleDesc
    },

    editRolesInfo () {
      this.$refs.editRolesFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请填写正确的角色信息')
        const { data: res } = await this.$http.put(`roles/${this.editRoles.roleId}`, this.editRoles)
        if (res.meta.status !== 200) return this.$message.error('编辑角色信息失败')
        // 添加成功的提示
        this.$message.success('编辑角色信息成功')
        // 关闭对话框
        this.editRolesDialogVisible = false
        // 重新请求最新的数据
        this.getRolesList()
      })
    },
    async deleteRolesForm (id) {
      console.log(id)
      // 弹出确定取消框，是否删除用户
      const confirmResult = await this.$confirm('请问是否要永久删除该用户', '删除提示', {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 如果用户点击确认，则confirmResult 为'confirm'
      // 如果用户点击取消, 则confirmResult获取的就是catch的错误消息'cancel'
      if (confirmResult !== 'confirm') {
        return this.$message.info('已经取消删除')
      }
      // 发送请求根据id完成删除操作
      const { data: res } = await this.$http.delete('roles/' + id)
      // 判断如果删除失败，就做提示
      if (res.meta.status !== 200) return this.$message.error('删除角色失败')
      // 修改成功的提示
      this.$message.success('删除角色成功')
      // 重新请求最新的数据
      this.getRolesList()
    },
    async deleteThreeRoles (msg, item) {
      console.log(msg)
      // 弹出确定取消框，是否删除用户
      const confirmResult = await this.$confirm('请问是否要永久删除该用户', '删除提示', {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 如果用户点击确认，则confirmResult 为'confirm'
      // 如果用户点击取消, 则confirmResult获取的就是catch的错误消息'cancel'
      if (confirmResult !== 'confirm') {
        return this.$message.info('已经取消删除')
      }
      // 发送请求根据id完成删除操作
      // 发送请求根据id完成删除操作
      const { data: res } = await this.$http.delete(`roles/${msg.id}/rights/${item.id}`)
      // 判断如果删除失败，就做提示
      if (res.meta.status !== 200) return this.$message.error('删除指定权限失败')
      // 修改成功的提示
      this.$message.success('删除指定权限成功')
      // 重新请求最新的数据
      // this.getRolesList()
      msg.children = res.data
    },
    async showRolesTree (role) {
      this.roleId = role.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) return this.$message.error('获取权限失败')
      this.rolesTree = res.data
      // console.log(this.rolesTree)
      this.getDefKeys(role, this.defKeys)
      // console.log(this.defKeys)
      this.showRolesVisible = true
    },
    // 获取defKeys
    getDefKeys (node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }

      node.children.forEach(item => {
        this.getDefKeys(item, arr)
      })
    },
    // 重置数组
    showRolesTreeClosed () {
      this.defKeys = []
    },
    // 设置权限
    async resetRolesInfo () {
      const keyRoles = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedNodes()]

      const StrRoles = keyRoles.join(',')

      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: StrRoles })

      if (res.meta.status !== 200) return this.$message.error('更新权限失败')

      this.$message.success('更新权限成功')
      this.getRolesList()
      this.showRolesVisible = false
    }
  }
}
</script>
<style scoped>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}
.bdtop:last-of-type {
  border-bottom: 1px solid #eee;
}
.bdbottom:last-of-type {
  border-bottom: none;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
</style>
