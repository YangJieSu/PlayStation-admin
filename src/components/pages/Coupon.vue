<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <div class="d-flex mt-4">
      <h3 class="m-0">優惠券列表</h3>
      <button class="btn btn-outline-primary ml-auto" @click.prevent="openCouponModal(true)">建立優惠券</button>
    </div>
    <table class="table mt-4">
      <thead>
        <tr>
          <th>優惠名稱</th>
          <th>折扣百分比</th>
          <th>到期日</th>
          <th>是否啟用</th>
          <th>編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in coupons" :key="index">
          <td class="align-middle">{{ item.title }}</td>
          <td class="align-middle">{{ item.percent }} %</td>
          <td class="align-middle">{{ item.due_date }}</td>
          <td class="align-middle">
            <span class="text-success font-weight-bold" v-if="item.is_enabled">已啟用</span>
            <span class="text-dark font-weight-bold" v-else>尚未啟用</span>
          </td>
          <td>
            <button class="btn btn-outline-primary btn-sm" @click.prevent="openCouponModal(false, item)">編輯</button>
            <button class="btn btn-outline-danger btn-sm" @click.prevent="opendelModal(item)">刪除</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 優惠券 modal -->
    <div class="modal fade" id="couponModal" tabindex="-1" role="dialog"
      aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title" id="exampleModalLabel">優惠券設定</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label for="title">優惠名稱</label>
              <input type="text" class="form-control" id="title"
                v-model="tempCoupon.title"
                placeholder="請輸入優惠名稱">
            </div>
            <div class="form-group">
              <label for="coupon_code">優惠碼</label>
              <input type="text" class="form-control" id="coupon_code"
                v-model="tempCoupon.code"
                placeholder="請輸入優惠碼">
            </div>
            <div class="form-group">
              <label for="due_date">到期日</label>
              <input type="date" class="form-control" 
                v-model="tempCoupon.due_date"
              id="due_date">
            </div>
            <div class="form-group">
              <label for="price">折扣百分比</label>
              <input type="number" class="form-control" id="price"
                v-model="tempCoupon.percent"
                placeholder="請輸入折扣百分比">
            </div>
            <div class="form-group">
              <div class="form-check">
                <input class="form-check-input" type="checkbox"
                  v-model="tempCoupon.is_enabled"
                  :true-value="1"
                  :false-value="0"
                  id="is_enabled">
                <label class="form-check-label" for="is_enabled">
                  是否啟用
                </label>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-outline-primary" @click.prevent="updateCoupon">更新優惠券</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 刪除商品  Modal -->
    <div class="modal fade" id="delCouponModal" tabindex="-1" role="dialog"
      aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>刪除優惠券</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            是否刪除 <strong class="text-danger">{{ tempCoupon.title }}</strong> 商品(刪除後將無法恢復)。
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-dange" @click.prevent="delCoupon(tempCoupon.id)">確認刪除</button>
          </div>
        </div>
      </div>
    </div>


    
  </div>
</template>

<script>
import $ from 'jquery';

  export default {
    data() {
      return {
        coupons: [],
        tempCoupon: {
          title: '',
          code: '',
          due_date: 0,
          percent: 100,
          is_enabled: 0,
        },
        isNew: false,
        isLoading: false,
      };
    },
    methods: {
      getCoupons(page = 1) {
        // 取得優惠券
        const vm = this;
        let api = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/admin/coupons?page=${page}`;
        vm.isLoading = true;
        this.$http.get(api).then((response) => {
          console.log(response.data);
          vm.isLoading = false;
          vm.coupons = response.data.coupons;
        });
      },
      openCouponModal(isNew, item) {
        // 開啟 編輯 modal
        const vm = this;
        if (isNew) {
          vm.tempCoupon = {};
          vm.isNew = true;
        } else {
          vm.tempCoupon = Object.assign({}, item);
          vm.isNew = false;
        };
        $('#couponModal').modal('show');
      },
      updateCoupon() {
        // 建立 編輯 優惠券
        const vm = this;
        let api = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/admin/coupon`;
        let httpmethod = 'post';
        if (vm.isNew == false) {
          api = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/admin/coupon/${vm.tempCoupon.id}`;
          httpmethod = 'put';
        };
        this.$http[httpmethod](api, { data: vm.tempCoupon}).then((response) => {
          console.log(response.data);
          if (response.data.success) {
            $('#couponModal').modal('hide');
            vm.getCoupons();
          };
        });
      },
      opendelModal(item) {
        //開啟 刪除優惠券  modal
        const vm = this;
        vm.tempCoupon = Object.assign({}, item);
        $('#delCouponModal').modal('show');
      },
      delCoupon(id) {
        // 刪除優惠券
        const vm = this;
        let api = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/admin/coupon/${id}`;
        this.$http.delete(api).then((response) => {
          console.log(response.data);
          if (response.data.success) {
            $('#delCouponModal').modal('hide');
            vm.getCoupons();
          };
        });
      },
    },
    created() {
      this.getCoupons();
    },
  };
</script>