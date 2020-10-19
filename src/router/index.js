import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import(/* webPackChunkName:'login_home_welcome' */'@/components/Login.vue')
const Home = () => import(/* webPackChunkName:'login_home_welcome' */'@/components/Home.vue')
const Welcome = () => import(/* webPackChunkName:'login_home_welcome' */'@/components/Welcome.vue')

const Users = () => import(/* webPackChunkName:'user_rights_roles' */'@/components/user/Users.vue')
const Rights = () => import(/* webPackChunkName:'user_rights_roles' */'@/components/power/Rights.vue')
const Roles = () => import(/* webPackChunkName:'user_rights_roles' */'@/components/power/Roles.vue')

const Cate = () => import(/* webPackChunkName:'cate_params' */'@/components/goods/Cate.vue')
const Params = () => import(/* webPackChunkName:'cate_params' */'@/components/goods/Params.vue')

const Goods = () => import(/* webPackChunkName:'goods_add' */'@/components/goods/Goods.vue')
const Add = () => import(/* webPackChunkName:'goods_add' */'@/components/goods/Add.vue')

const Orders = () => import(/* webPackChunkName:'orders_reports' */'@/components/orders/Orders.vue')
const Reports = () => import(/* webPackChunkName:'orders_reports' */'@/components/reports/Reports.vue')
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Cate },
      { path: '/params', component: Params },
      { path: '/goods', component: Goods },
      { path: '/goods/add', component: Add },
      { path: '/orders', component: Orders },
      { path: '/reports', component: Reports }
    ]
  }

]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
