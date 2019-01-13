<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="navbar-brand">
      <router-link to="/customer_shopping" class="">
        <i class="fab fa-playstation"></i>
        PlayStation Store
      </router-link>
    </div>
    <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item" @click="currentPage = 'Products'">
          <router-link
            class="nav-link font-size-lg"
            to="/admin/products"
            :class="{ 'active': currentPage == 'Products' }"
          >
            <i class="fas fa-shopping-cart mr-1"></i>產品列表
          </router-link>
        </li>
        <li class="nav-item" @click="currentPage = 'Orders'">
          <router-link
            class="nav-link"
            :class="{ 'active': currentPage == 'Orders' }"
            to="/admin/orders"
          >
            <i class="far fa-list-alt mr-1"></i>訂單列表
          </router-link>
        </li>
        <li class="nav-item" @click="currentPage = 'Coupon'">
          <router-link
            class="nav-link"
            :class="{ 'active': currentPage == 'Coupon' }"
            to="/admin/coupon"
          >
            <i class="far fa-money-bill-alt mr-1"></i>優惠券
          </router-link>
        </li>
        <li class="nav-item" @click="currentPage = 'Order'">
          <router-link
            class="nav-link"
            :class="{ 'active': currentPage == 'Order' }"
            to="/order"
          >
            <i class="fas fa-file-alt mr-1"></i>模擬購物
          </router-link>
        </li>
      </ul>
      <div>
        <a class="nav-link" href="#" @click.prevent="signOut" v-if="isLogin">
          <i class="fas fa-sign-out-alt"></i>
          <b>登出</b>
        </a>
        <router-link class="nav-link" to="/sign_in" v-else>
          <i class="fas fa-sign-in-alt"></i>
          <b>登入</b>
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      isLogin: false,
      currentPage: "Products"
    };
  },
  methods: {
    signOut() {
      // 登出
      const api = `${process.env.API_PATH}/logout`;
      const vm = this;
      this.$http.post(api).then(response => {
        console.log(response.data);
        if (response.data.success) {
          vm.$router.push("/sign_in");
        }
      });
    },
    userCheck() {
      // 登入驗證
      const api = `${process.env.API_PATH}/api/user/check`;
      this.$http.post(api).then(response => {
        console.log(response.data);
        if (response.data.success) {
          this.isLogin = true;
        } else {
          this.isLogin = false;
          alert("您還沒有登入哦！ 請先登入");
        }
      });
    },
    Page() {
      this.currentPage = this.$router.history.current.name;
    }
  },
  created() {
    this.userCheck();
    this.Page();
  }
};
</script>

<style lang="scss" scoped>
.nav-link {
  letter-spacing: 1px;
}
</style>
