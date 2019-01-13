<template>
  <nav class="col-md-2 d-none d-md-block bg-light sidebar">
    <div class="sidebar-sticky">
      <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
        <span>ADMIN</span>
      </h6>
      <ul class="nav flex-column mb-2">
        <li class="nav-item" @click="currentPage = 'Products'">
          <router-link class="nav-link" to="/admin/products" 
            :class="{ 'active': currentPage == 'Products'}">
            <span data-feather="file-text">
              <i class="fas fa-shopping-cart"></i>
              Products
            </span>
          </router-link>
        </li>
        <li class="nav-item" @click="currentPage = 'Orders'">
          <router-link class="nav-link" to="/admin/orders"
            :class="{ 'active': currentPage == 'Orders'}">
            <span data-feather="file-text">
              <i class="far fa-list-alt"></i>
              Orders
            </span>
          </router-link>
        </li>
        <li class="nav-item" @click="currentPage = 'Coupon'" >
          <router-link class="nav-link" to="/admin/coupon"
            :class="{ 'active': currentPage == 'Coupon'}">
            <span data-feather="file-text">
              <i class="far fa-money-bill-alt"></i>
              Coupons
            </span>
          </router-link>
        </li>
      </ul>
      <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
        <span>Customer</span>
      </h6>
      <ul class="nav flex-column mb-2">
        <li class="nav-item" @click="currentPage = 'Order'">
          <router-link class="nav-link" to="/order"
            :class="{ 'active': currentPage == 'Order'}">
            <span data-feather="file-text">
              <i class="fas fa-file-alt"></i>
              Order
            </span>
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
  export default {
    data() {
      return {
        currentPage: 'Products',
      };
    },
    methods: {
      Page() {
        this.currentPage = this.$router.history.current.name;
      },
    },
    created() {
      this.Page();
    },
  };
</script>