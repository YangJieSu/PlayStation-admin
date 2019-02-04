<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <div class="d-flex mt-4">
      <h3 class="m-0">商品上架管理列表 Product Management</h3>
      <button class="btn btn-outline-primary ml-auto" @click.prevent="openModal(true)">建立新商品</button>
    </div>
    <table class="table mt-4">
      <thead>
        <tr>
          <th width="120">分類</th>
          <th width="120">商品圖片</th>
          <th>產品名稱</th>
          <th width="120" class="text-center">原價</th>
          <th width="120" class="text-center">售價</th>
          <th width="100" class="text-center">是否啟用</th>
          <th width="180" class="text-center">編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in products" :key="index">
          <td class="align-middle">{{ item.category }}</td>
          <td class="align-middle p-0">
            <img class="img-fluid" :src="item.imageUrl" alt="productImg">
          </td>
          <td class="align-middle">{{ item.title }}</td>
          <td class="align-middle text-center">{{ item.origin_price | currency }}</td>
          <td class="align-middle text-center">{{ item.price | currency }}</td>
          <td class="align-middle text-center">
            <span v-if="item.is_enabled" class="text-success">啟用</span>
            <span v-else class="text-success">未啟用</span>
          </td>
          <td class="align-middle text-center justify-content-between">
            <button
              class="btn btn-outline-primary btn-sm"
              @click.prevent="openModal(false, item)"
            >編輯</button>
            <button class="btn btn-outline-danger btn-sm" @click.prevent="opendelModal(item)">刪除</button>
          </td>
        </tr>
      </tbody>
    </table>

    <pagination :page-data="pagination" @changepage="getProducts"></pagination>

    <!-- 建立商品 編輯商品  Modal -->
    <div
      class="modal fade"
      id="productModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span v-if="isNew">新增商品</span>
              <span v-else>編輯商品</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-sm-4">
                <div class="form-group">
                  <label for="image">輸入圖片網址</label>
                  <input
                    type="text"
                    class="form-control"
                    id="image"
                    v-model="tempProduct.imageUrl"
                    placeholder="請輸入圖片連結"
                  >
                </div>
                <div class="form-group">
                  <label for="customFile">
                    或 上傳圖片
                    <i class="fas fa-spinner fa-spin" v-if="status.itemLoading"></i>
                  </label>
                  <input
                    type="file"
                    id="customFile"
                    class="form-control"
                    @change="uploadPicture"
                    ref="files"
                  >
                </div>
                <img
                  img="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=828346ed697837ce808cae68d3ddc3cf&auto=format&fit=crop&w=1350&q=80"
                  class="img-fluid"
                  alt
                  :src="tempProduct.imageUrl"
                >
              </div>
              <div class="col-sm-8">
                <div class="form-group">
                  <label for="title">商品名稱</label>
                  <input
                    type="text"
                    class="form-control"
                    id="title"
                    v-model="tempProduct.title"
                    placeholder="請輸入商品名稱"
                  >
                </div>

                <div class="form-row">
                  <div class="form-group col-md-6">
                    <label for="category">分類</label>
                    <input
                      type="text"
                      class="form-control"
                      id="category"
                      v-model="tempProduct.category"
                      placeholder="請輸入分類"
                    >
                  </div>
                  <div class="form-group col-md-6">
                    <label for="price">單位</label>
                    <input
                      type="unit"
                      class="form-control"
                      id="unit"
                      v-model="tempProduct.unit"
                      placeholder="請輸入單位"
                    >
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group col-md-6">
                    <label for="origin_price">原價</label>
                    <input
                      type="number"
                      class="form-control"
                      id="origin_price"
                      v-model="tempProduct.origin_price"
                      placeholder="請輸入原價"
                    >
                  </div>
                  <div class="form-group col-md-6">
                    <label for="price">售價</label>
                    <input
                      type="number"
                      class="form-control"
                      id="price"
                      v-model="tempProduct.price"
                      placeholder="請輸入售價"
                    >
                  </div>
                </div>

                <hr>

                <div class="form-group">
                  <label for="description">產品描述</label>
                  <textarea
                    type="text"
                    class="form-control"
                    id="description"
                    v-model="tempProduct.description"
                    placeholder="請輸入產品描述"
                  ></textarea>
                </div>
                <div class="form-group">
                  <label for="content">說明內容</label>
                  <textarea
                    type="text"
                    class="form-control"
                    id="content"
                    v-model="tempProduct.content"
                    placeholder="請輸入產品說明內容"
                  ></textarea>
                </div>
                <div class="form-group">
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      v-model="tempProduct.is_enabled"
                      :true-value="1"
                      :false-value="0"
                      id="is_enabled"
                    >
                    <label class="form-check-label" for="is_enabled">是否啟用</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" @click.prevent="updateProduct">確認</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 刪除商品  Modal -->
    <div
      class="modal fade"
      id="delProductModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>刪除產品</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            是否刪除
            <strong class="text-danger">{{ tempProduct.title }}</strong> 商品(刪除後將無法恢復)。
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>
            <button
              type="button"
              class="btn btn-danger"
              @click.prevent="delProduct(tempProduct.id)"
            >確認刪除</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";

export default {
  data() {
    return {
      products: [],
      tempProduct: {},
      isNew: false,
      isLoading: false,
      pagination: {},
      status: {
        itemLoading: false
      },
    };
  },
  methods: {
    getProducts(page = 1) {
      // 取得商品列表
      const vm = this;
      let api = `${process.env.API_PATH}/api/${
        process.env.CUSTOM_PATH
      }/admin/products?page=${page}`;
      vm.isLoading = true;
      this.$http.get(api).then(response => {
        // console.log(response.data);
        vm.isLoading = false;
        if (response.data.success) {
          vm.products = response.data.products;
          vm.pagination = response.data.pagination;
        };
      });
    },
    openModal(isNew, item) {
      // 開啟 modal
      const vm = this;
      if (isNew) {
        vm.tempProduct = {};
        vm.isNew = true;
      } else {
        vm.tempProduct = Object.assign({}, item);
        vm.isNew = false;
      }
      $("#productModal").modal("show");
    },
    updateProduct() {
      // 建立與更新商品
      const vm = this;
      let api = `${process.env.API_PATH}/api/${
        process.env.CUSTOM_PATH
      }/admin/product`;
      let httpmethod = "post";
      if (vm.isNew == false) {
        api = `${process.env.API_PATH}/api/${
          process.env.CUSTOM_PATH
        }/admin/product/${vm.tempProduct.id}`;
        httpmethod = "put";
      }
      // 可做驗證，防止無資料卻能新增產品
      this.$http[httpmethod](api, { data: vm.tempProduct }).then(response => {
        // console.log(response.data);
        if (response.data.success) {
          $("#productModal").modal("hide");
          vm.getProducts();
        }
      });
    },
    opendelModal(item) {
      //開啟 刪除商品  modal
      const vm = this;
      vm.tempProduct = Object.assign({}, item);
      $("#delProductModal").modal("show");
    },
    delProduct(id) {
      // 刪除商品
      const vm = this;
      let api = `${process.env.API_PATH}/api/${
        process.env.CUSTOM_PATH
      }/admin/product/${id}`;
      this.$http.delete(api).then(response => {
        // console.log(response.data);
        if (response.data.success) {
          $("#delProductModal").modal("hide");
          vm.$bus.$emit('AlertMessage', response.data.message, 'success');
          vm.getProducts();
        } else {
          $("#delProductModal").modal("hide");
          vm.$bus.$emit('AlertMessage', response.data.message, 'danger');
        };
      });
    },
    uploadPicture() {
      // 上傳商品圖片
      const vm = this;
      // files <= 此名稱與上方  ref=files 相同 ，可以自定義名稱
      let pictureFile = vm.$refs.files.files[0];
      let pictureData = new FormData();
      let api = `${process.env.API_PATH}/api/${
        process.env.CUSTOM_PATH
      }/admin/upload`;
      pictureData.append("file-to-upload", pictureFile);
      vm.status.itemLoading = true;
      this.$http
        .post(api, pictureData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        .then(response => {
          console.log(response.data);
          vm.status.itemLoading = false;
          if (response.data.success) {
            vm.$set(vm.tempProduct, "imageUrl", response.data.imageUrl);
          } else {
            vm.$bus.$emit("AlertMessage", response.data.message, "danger");
          }
        });
    }
  },
  created() {
    this.getProducts();
  }
};
</script>