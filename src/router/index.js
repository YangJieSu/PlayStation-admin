import Vue from 'vue';
import Router from 'vue-router';

// 掛載元件
import Dashboard from '@/components/Dashboard';
import Products from '@/components/pages/Products';
import Orders from '@/components/pages/Orders';
import Coupon from '@/components/pages/Coupon';
import SignIn from '@/components/pages/SignIn';
import Order from '@/components/pages/Order';
import CustomerCheckout from '@/components/pages/CustomerCheckout';


Vue.use(Router)

export default new Router({
  routes: [
    // 進入未定義的頁面自動導回 signin
    {
      path: '*',
      redirect: '/admin',
    },
    {
      path: '/sign_in',
      name: 'SignIn',
      component: SignIn,
    },
    {
      path: '/admin',
      name: 'Dashboard',
      component: Dashboard,
      children: [
        {
          path: 'products',
          name: 'Products',
          component: Products,
          meta: { requiresAuth: true },
        },
        {
          path: 'orders',
          name: 'Orders',
          component: Orders,
          meta: { requiresAuth: true },
        },
        {
          path: 'coupon',
          name: 'Coupon',
          component: Coupon,
          meta: { requiresAuth: true },
        },
      ],
    },
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard,
      children: [
        {
          path: 'order',
          name: 'Order',
          component: Order,
        },
        {
          path: 'customer_checkout/:orderId',
          name: 'CustomerCheckout',
          component: CustomerCheckout,
        },
      ],
    },
  ]
})
