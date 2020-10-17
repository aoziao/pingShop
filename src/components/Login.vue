<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 图像 -->
      <div class="avatat_box">
        <img src="../assets/logo.png" alt="默认图像" />
      </div>
      <!-- 登录表单 -->
      <!-- ref:获取当前表单元素 model：绑定表单数据 rules：表单验证规则 -->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        class="login_form"
        :rules="loginFormRules"
      >
        <!-- 登录 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="iconfont icon-user"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="iconfont icon-3702mima"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="loginBtn">登录</el-button>
          <el-button type="info" @click="resetBtn">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginFormRules: {
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 4, max: 10, message: '长度在 4 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetBtn () {
      // 此时的this指向改函数的实例对象
      this.$refs.loginFormRef.resetFields()
    },
    loginBtn () {
      // validate 表单预校验 返回第一个参数valid是个布尔值验证是否预校验成功
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.loginForm)
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error('登录失败！' + res.meta.msg)
        this.$message.success('登陆成功!')
        // 保存token到本地存储
        window.sessionStorage.setItem('token', res.data.token)
        // 跳转首页
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less"  scoped>
.login_container {
  height: 100%;
  background-color: #2b4b6b;
}
.login_box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 450px;
  height: 300px;
  background-color: #fff;
  border: 1px solid #eee;
  border-radius: 3px;

  .avatat_box {
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 130px;
    height: 130px;
    padding: 10px;
    box-shadow: 0 0 10px #eee;
    border-radius: 50%;
    border: 1px solid #eee;
    background-color: #fff;
    img {
      width: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }

  .login_form {
    position: absolute;
    box-sizing: border-box;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    .btns {
      display: flex;
      justify-content: center;
    }
  }
}
</style>
