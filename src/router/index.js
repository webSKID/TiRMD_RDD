import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const Login = () => import('../pages/login/login')
const Home = () => import('../pages/home/home')
const LineRun = () => import('../pages/line/line-run')
const State = () => import('../pages/state/state')
const EquipmentList = () => import('../pages/equipment/equipment-list')
const EquipmentFile = () => import('../pages/equipment/equipment-file')
const CustomerList = () => import('../pages/equipment/customer-list')
const CustomerDetail = () => import('../pages/equipment/customer-detail')
const DataAnalysis = () => import('../pages/analytical/data-analysis')
const RepairList = () => import('../pages/repair/repair-manage')
const NotFound = () => import('../components/error/not-found')
const RepairPlan = () => import('../pages/equipment/repair-plan')
const OrderTemplate = () => import('../pages/equipment/component/order-template')
const routes = [
  {
    path: '/',
    redirect: '/login',
    component: Login
  },
  {
    path: '/login',
    name: '/login',
    component: Login
  },
  {
    path: '/redirect',
    component: Home,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/pages/redirect/index')
      }
    ]
  },
  {
    path: '/home',
    name: '/home',
    component: Home,
    meta: {
      requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
    },
    children: [
      {
        path: 'message-center',
        name: 'message-center',
        component: LineRun
      },
      {
        path: 'network-overview',
        name: 'network-overview',
        component: State
      }
    ]
  },
  {
    path: '/equipment',
    name: '/equipment',
    component: Home,
    children: [
      {
        // 设备列表
        path: 'equipment-list',
        name: 'equipment-list',
        component: EquipmentList
      },
      {
        // 设备工况
        path: 'equipment-file',
        name: 'equipment-file',
        component: EquipmentFile
      },
      {
        path: 'customer-list',
        name: 'CustomerList',
        component: CustomerList
      },
      {
        path: 'customer-detail',
        name: 'CustomerDetail',
        component: CustomerDetail
      },
      {
        //  检修计划
        path: 'repair-plan',
        name: 'repair-plan',
        component: RepairPlan
      },
      {
        path: 'order-template',
        name: 'order-template',
        component: OrderTemplate
      }
    ]
  },
  {
    path: '/analytical',
    name: '/analytical',
    component: Home,
    children: [
      {
        path: 'data-analysis',
        name: 'data-analysis',
        component: DataAnalysis
      }
    ]
  },
  {
    path: '/repair',
    name: '/repair',
    component: Home,
    children: [
      {
        path: 'repair-manage',
        name: 'repair-manage',
        component: RepairList
      }
    ]
  },
  {
    path: '*',
    name: 'notFound',
    component: Home,
    redirect: '/404',
    children: [
      {
        path: '404',
        name: '404',
        component: NotFound
      }
    ]
  }
]

const router = new Router({
  routes
})

export default router
