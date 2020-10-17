<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card>
      <el-row>
        <el-col>
          <el-alert title="添加商品信息" type="info" center show-icon>
          </el-alert>
        </el-col>
        <el-col>
          <el-steps :active="active - 0" finish-status="success" align-center>
            <el-step title="基本信息"></el-step>
            <el-step title="商品参数"></el-step>
            <el-step title="商品属性"></el-step>
            <el-step title="商品图片"></el-step>
            <el-step title="商品内容"></el-step>
            <el-step title="完成"></el-step>
          </el-steps>
        </el-col>
      </el-row>

      <!-- tab标签-->
      <el-form
        :label-position="labelPosition"
        label-width="80px"
        :model="addGoods"
        :rules="addGoodsFormRules"
        ref="addGoodsFormRef"
      >
        <el-tabs
          :tab-position="tabPosition"
          v-model="active"
          style="height: 900px"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addGoods.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格(元)" prop="goods_price">
              <el-input v-model="addGoods.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量(千克)" prop="goods_weight">
              <el-input
                v-model="addGoods.goods_weight"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input
                v-model="addGoods.goods_number"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <el-cascader
                v-model="addGoods.goods_cat"
                :options="cateList"
                :props="cascaderProps"
                @change="selectedCateChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              :key="item.attr_id"
              v-for="item in manyTabData"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  border
                  :label="item1"
                  v-for="(item1, index) in item.attr_vals"
                  :key="index"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              :key="item.attr_id"
              v-for="item in onlyTabData"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="imgUplaodUrl"
              :on-preview="handlePreview"
              :headers="headersObj"
              :on-remove="handleRemove"
              :on-progress="handleUpdate"
              :on-success="handleSuccess"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addGoods.goods_introduce"></quill-editor>
            <el-button type="primary" class="btnadd" @click="addGoodsInfo"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="40%">
      <img :src="previewPath" alt="" class="preview_img" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      active: '0',
      tabPosition: 'left',
      labelPosition: 'top',
      addGoods: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      addGoodsFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }]
      },
      // 级联选择框配置属性
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true,
        expandTrigger: 'hover'
      },
      // 获取分类
      cateList: [],
      manyTabData: [],
      onlyTabData: [],
      imgUplaodUrl: 'http://vue-shop-api.itheima.net/api/private/v1/upload',
      headersObj: { Authorization: window.sessionStorage.getItem('token') },
      previewVisible: false,
      previewPath: ''
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
      console.log(res)
    },
    selectedCateChange  () {
      if (this.addGoods.goods_cat.length !== 3) {
        this.$message.error('只允许选择第三级分类')
        this.addGoods.goods_cat = []
      }
      console.log(this.addGoods.goods_cat)
    },
    beforeTabLeave (activeName, oldActivename) {
      if (oldActivename === '0' && this.addGoods.goods_cat.length !== 3) {
        this.$message.error('请选择分类')
        return false
      }
    },
    // tab标签点击触发函数
    async  tabClicked () {
      if (this.active === '1') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'many' } })
        if (res.meta.status !== 200) return this.$message.error('获取商品参数失败')
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.manyTabData = res.data
      } else if (this.active === '2') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'only' } })
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.onlyTabData = res.data
      }
    },
    handleUpdate () {},
    // 图片预览效果
    handlePreview (file) {
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },
    handleRemove (file) {
      const filePath = file.response.data.tmp_path
      const index = this.addGoods.pics.findIndex(item => {
        return item.pic === filePath
      })
      this.addGoods.pics.splice(index, 1)
    },
    // 监听图片上传成功的事件
    handleSuccess (response) {
      console.log(response)
      const picInfo = {
        pic: response.data.tmp_path
      }
      this.addGoods.pics.push(picInfo)
      console.log(this.addGoods)
    },
    addGoodsInfo () {
      this.$refs.addGoodsFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请正确填写商品参数')
        // 数组转字符串
        this.addGoods.goods_cat = this.addGoods.goods_cat.join(',')
        // 深拷贝
        const newAddGoods = JSON.parse(JSON.stringify(this.addGoods))
        // 加入attrs参数
        this.manyTabData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addGoods.attrs.push(newInfo)
        })

        this.onlyTabData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addGoods.attrs.push(newInfo)
        })

        newAddGoods.attrs = this.addGoods.attrs
        console.log(newAddGoods)
        const { data: res } = await this.$http.post('goods', this.addGoods)
        console.log(res)
        if (res.meta.status !== 201) return this.$message.error('创建商品失败')
        this.$message.success('创建商品成功')
        // 跳转列表页面
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    cateId () {
      return this.addGoods.goods_cat.length === 3 ? this.addGoods.goods_cat[2] : null
    }
  }
}
</script>

<style scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.preview_img {
  width: 100%;
}
</style>
