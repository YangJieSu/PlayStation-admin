<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <h3 class="mt-4">模擬訂單</h3>
    <div class="product-list">
      <div class="row mt-4">
        <div class="col-md-4 mb-3" v-for="(item) in products" :key="item.id">
          <div class="card mt-0 bg-white rounded-0 h-100 prod-card">
            <div
              class="product-img"
              style="padding-bottom: 45%; background-size:cover; background-position: center;"
              :style="{backgroundImage : `url(${item.imageUrl})`}"
            ></div>
            <div class="card-body">
              <div class="prod-info mb-3">
                <h5 class="card-title mb-3 font-weight-bold overflow-hidden">{{ item.title }}</h5>
                <p class="card-text">{{ item.description }}</p>
              </div>
              <div class="d-flex justify-content-between align-items-baseline prod-price">
                <div class="h5" v-if="!item.price">{{ item.origin_price | currency }}元</div>
                <del class="font-italic" v-if="item.price">原價 {{ item.origin_price | currency }}</del>
                <div class="h5 text-danger font-weight-bold" v-if="item.price">售價 {{ item.price | currency }}</div>
              </div>
            </div>
            <div class="card-footer d-flex">
              <button
                type="button"
                class="btn btn-outline-info btn-sm"
                @click.prevent="getProduct(item.id)"
              >
                <i class="fas fa-search"></i>
                查看商品
              </button>
              <button
                type="button"
                class="btn btn-outline-danger btn-sm ml-auto"
                @click.prevent="addtoCart(item.id)"
              >
                <i class="fas fa-shopping-cart"></i>
                加入購物車
              </button>
            </div>
          </div>
        </div>
      </div>
      <nav aria-label="Page navigation example">
        <ul class="pagination">
          <li class="page-item" :class="{ 'disabled' : !pagination.has_pre }">
            <a
              class="page-link"
              href="#"
              aria-label="Previous"
              @click.prevent="getProducts(pagination.current_page - 1)"
            >
              <span aria-hidden="true">&laquo;</span>
              <span class="sr-only">Previous</span>
            </a>
          </li>
          <li
            class="page-item"
            v-for="(page, index) in pagination.total_pages"
            :key="index"
            :class="{ 'active' : pagination.current_page == page }"
          >
            <a class="page-link" href="#" @click.prevent="getProducts(page)">{{ page }}</a>
          </li>
          <li class="page-item" :class="{ 'disabled' : !pagination.has_next }">
            <a
              class="page-link"
              href="#"
              aria-label="Next"
              @click.prevent="getProducts(pagination.current_page + 1)"
            >
              <span aria-hidden="true">&raquo;</span>
              <span class="sr-only">Next</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>

    <div
      class="modal fade"
      id="productModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title font-weight-bold" id="exampleModalLabel">{{ product.title }}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <img :src="product.imageUrl" class="img-fluid" alt>
            <div class="mt-3">
              <div class="h5 pb-2 font-weight-bold title">產品描述</div>
              <p class="mb-0">{{ product.content }}</p>
              <p>{{ product.description }}</p>
            </div>
            <div class="d-flex justify-content-between align-items-baseline">
              <div class="h5" v-if="!product.price">{{ product.origin_price | currency }} 元</div>
              <del class="font-italic" v-if="product.price">原價 {{ product.origin_price | currency }} 元</del>
              <div class="h5 text-danger font-weight-bold" v-if="product.price">售價 {{ product.price | currency }} 元</div>
            </div>
            <select name class="form-control mt-3" v-model="product.num">
              <option :value="num" v-for="num in 10" :key="num">選購 {{num}} {{product.unit}}</option>
            </select>
          </div>
          <div class="modal-footer">
            <div class="text-muted text-nowrap mr-3">小計
              <strong>{{ product.num * product.price | currency }}</strong> 元
            </div>
            <button
              type="button"
              class="btn btn-primary"
              @click.prevent="addtoCart(product.id, product.num)"
            >
              <i class="fas fa-spinner fa-spin" v-if="status.loadingItem == product.id"></i>
              加到購物車
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="my-5 row justify-content-center" v-if="carts.total !== 0">
      <div class="col-md-6">
        <h3 class="text-center mb-4">購物車明細</h3>
        <table class="table">
          <thead>
            <th></th>
            <th>品名</th>
            <th class="text-right">數量</th>
            <th class="text-center">單價</th>
          </thead>
          <tbody>
            <tr v-for="(item) in carts.carts" :key="item.id" v-if="carts.carts">
              <td class="align-middle">
                <button class="btn btn-outline-danger btn-sm" @click.prevent="removeCart(item.id)">
                  <i class="far fa-trash-alt"></i>
                </button>
              </td>
              <td class="align-middle">
                {{ item.product.title }}
                <div class="text-success" v-if="item.coupon">已套用優惠券</div>
              </td>
              <td class="align-middle text-right">{{ item.qty }}/{{ item.product.unit }}</td>
              <td class="align-middle text-right">{{ item.final_total | currency }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" class="text-right">總計</td>
              <td class="text-right">{{ carts.final_total | currency }}</td>
            </tr>
            <tr v-if="carts.final_total !== carts.total">
              <td colspan="3" class="text-right text-success">折扣價</td>
              <td class="text-right text-success">{{ carts.final_total | currency }}</td>
            </tr>
          </tfoot>
        </table>
        <div class="input-group mb-3 input-group-sm">
          <input type="text" class="form-control" placeholder="請輸入優惠碼" v-model="coupon_code">
          <div class="input-group-append">
            <button
              class="btn btn-outline-secondary"
              type="button"
              @click.prevent="addCouponCode"
            >套用優惠碼</button>
          </div>
        </div>
      </div>
    </div>

    <div class="my-5 row justify-content-center" v-if="carts.total !== 0">
      <form class="col-md-6" @submit.prevent="creatOrder">
        <div class="form-group">
          <label for="useremail">Email</label>
          <input
            type="email"
            class="form-control"
            name="email"
            id="useremail"
            v-validate="'required|email'"
            :class="{ 'is-invalid' : errors.has('email') }"
            v-model="form.user.email"
            placeholder="請輸入 Email"
          >
          <span class="text-danger" v-if="errors.has('email')">給個Emial很困難??</span>
        </div>

        <div class="form-group">
          <label for="username">收件人姓名</label>
          <input
            type="text"
            class="form-control"
            name="name"
            id="username"
            v-validate="'required'"
            :class="{ 'is-invalid' : errors.has('name') }"
            v-model="form.user.name"
            placeholder="輸入姓名"
          >
          <span class="text-danger" v-if="errors.has('name')">請不要當個隱姓埋名的大俠</span>
        </div>

        <div class="form-group">
          <label for="usertel">收件人電話</label>
          <input
            type="tel"
            class="form-control"
            id="usertel"
            name="phone"
            v-validate="'required'"
            :class="{ 'is-invalid' : errors.has('phone') }"
            v-model="form.user.tel"
            placeholder="請輸入電話"
          >
          <span class="text-danger" v-if="errors.has('phone')">您不輸入就無法聯絡您喔</span>
        </div>

        <div class="form-group">
          <label for="useraddress">收件人地址</label>
          <input
            type="address"
            class="form-control"
            name="address"
            id="useraddress"
            v-validate="'required'"
            :class="{ 'is-invalid' : errors.has('address') }"
            v-model="form.user.address"
            placeholder="請輸入地址"
          >
          <span class="text-danger" v-if="errors.has('address')">商品將永遠存放倉庫</span>
        </div>

        <div class="form-group">
          <label for="useraddress">留言</label>
          <textarea name id class="form-control" cols="30" rows="10" v-model="form.message"></textarea>
        </div>
        <div class="text-right">
          <button class="btn btn-danger">送出訂單</button>
        </div>
      </form>
    </div>
  </div>
</template>


<script>
import $ from "jquery";

export default {
  data() {
    return {
      products: [],
      isLoading: false,
      product: {},
      carts: {},
      coupon_code: "",
      pagination: {},
      form: {
        user: {}
      },
      status: {
        loadingItem: ""
      }
    };
  },
  methods: {
    getProducts(page = 1) {
      // 取得商品列表
      const vm = this;
      let api = `${process.env.API_PATH}/api/${
        process.env.CUSTOM_PATH
      }/products?page=${page}`;
      vm.isLoading = true;
      this.$http.get(api).then(response => {
        console.log(response.data);
        vm.isLoading = false;
        if (response.data.success) {
          vm.products = response.data.products;
          vm.pagination = response.data.pagination;
        }
      });
    },
    getProduct(id) {
      // 取得單一商品內容
      const vm = this;
      let api = `${process.env.API_PATH}/api/${
        process.env.CUSTOM_PATH
      }/product/${id}`;
      this.$http.get(api).then(response => {
        console.log(response.data);
        if (response.data.success) {
          vm.product = response.data.product;
          $("#productModal").modal("show");
        }
      });
    },
    addtoCart(id, qty = 1) {
      // 加入購物車
      const vm = this;
      const api = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/cart`;
      const cart = {
        product_id: id,
        qty
      };
      vm.isLoading = true;
      vm.status.loadingItem = id;
      this.$http.post(api, { data: cart }).then(response => {
        console.log(response.data);
        vm.isLoading = false;
        vm.status.loadingItem = "";
        vm.getCart();
        $("#productModal").modal("hide");
      });
    },
    getCart() {
      const vm = this;
      let api = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/cart`;
      this.$http.get(api).then(response => {
        console.log(response.data);
        vm.carts = response.data.data;
      });
    },
    removeCart(id) {
      const vm = this;
      let api = `${process.env.API_PATH}/api/${
        process.env.CUSTOM_PATH
      }/cart/${id}`;
      vm.isLoading = true;
      this.$http.delete(api).then(response => {
        console.log(response.data);
        vm.isLoading = false;
        if (response.data.success) {
          vm.getCart();
        }
      });
    },
    addCouponCode() {
      // 套用優惠券
      const vm = this;
      let api = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/coupon`;
      const coupon = {
        code: vm.coupon_code
      };
      vm.isLoading = true;
      this.$http.post(api, { data: coupon }).then(response => {
        console.log(response.data);
        vm.isLoading = false;
        if (response.data.success) {
          vm.getCart();
        } else {
          alert(response.data.message);
        }
      });
    },
    creatOrder() {
      // 結帳頁面
      const vm = this;
      let api = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/order`;
      this.$validator.validate().then(result => {
        if (result) {
          this.$http.post(api, { data: vm.form }).then(response => {
            console.log(response.data);
            vm.$router.push(`/customer_checkout/${response.data.orderId}`);
          });
        } else {
          console.log("欄位不完整");
        }
      });
    }
  },
  created() {
    this.getProducts();
    this.getCart();
  }
};
</script>