<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <h3 class="mt-4">訂單管理列表 Order Managment</h3>
    <table class="table mt-4">
      <thead>
        <tr>
          <th>購買時間</th>
          <th>購買帳號</th>
          <th>購買清單</th>
          <th>應付金額</th>
          <th>是否付款</th>
          <th>詳細內容</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in orders" :key="item.id">
          <th>{{ item.create_at | date }}</th>
          <td v-if="item.user">{{ item.user.name }}</td>
          <td>
            <div v-for="(product, index) in item.products" :key="index">
              {{product.product.title}}：共{{product.qty}}{{product.product.unit}}
            </div>
          </td>
          <td>{{ item.total | currency }}</td>
          <td>
            <span class="text-success" v-if="item.is_paid">錢到手</span>
            <span class="text-danger" v-else>快給錢</span>
          </td>
          <td>
            <button class="btn btn-outline-primary btn-sm" @click.prevent="openOrderModal(item)">查看</button>
          </td>
        </tr>
      </tbody>
    </table>   

    <pagination :page-data="pagination" @changepage="getOrders"></pagination>
    
    <!--查看 modal-->
    <div class="modal fade" id="orderModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-md" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title" id="exampleModalLabel"><span>訂單詳情</span></h5>
		        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
		          <span aria-hidden="true">&times;</span>
		        </button>
		      </div>
		      <div class="modal-body">
            <div class="row">
              <div class="col-sm-12">
								<table class="table">
								  <thead class="thead-dark">
								    <tr>
								      <th width=100>訂單資料</th>
								      <th>內容</th>
								    </tr>
								  </thead>
								  <tbody>
								  	<tr>
								      <th>代碼</th>
								      <td>{{ tempOrder.id }}</td>
								    </tr>
								    <tr>
								      <th>日期</th>
								      <td>{{ tempOrder.create_at | date }}</td>
								    </tr>
								    <tr>
								      <th>商品</th>
								      <td>
												<div v-for="product in tempOrder.products" :key="product.id">
													{{product.product.title}}：共 {{product.qty}} {{product.product.unit}}
												</div>
											</td>
								    </tr>
								    <tr>
								      <th>金額</th>
								      <td>{{ tempOrder.total | currency }}</td>
								    </tr>
								    <tr>
								      <th>付款狀態</th>
								      <td>
								      	<span class="text-success" v-if="tempOrder.is_paid">錢到手</span>
												<span class="text-danger" v-else>未付款，
													<router-link :to="`/customer_checkout/${tempOrder.id}`" target="_blank">查看付款頁面</router-link>
												</span>
								      </td>
								    </tr>
								    <tr>
								      <th>留言</th>
								      <td>{{ tempOrder.message }}</td>
								    </tr>
								  </tbody>
								</table>
								<!-- customer into -->
								<table class="table">
								  <thead class="thead-dark">
								    <tr>
								      <th width=100>收件資料</th>
								      <th>內容</th>
								    </tr>
								  </thead>
								  <tbody>
								    <tr>
								      <th>姓名</th>
								      <td>{{ tempOrder.user.name }}</td>
								    </tr>
								    <tr>
								      <th>email</th>
								      <td>{{ tempOrder.user.email }}</td>
								    </tr>
								    <tr>
								      <th>電話</th>
								      <td>{{ tempOrder.user.tel }}</td>
								    </tr>
								    <tr>
								      <th>地址</th>
								      <td>{{ tempOrder.user.address }}</td>
								    </tr>
								  </tbody>
								</table>
              </div>
            </div>
		      </div>
		      <div class="modal-footer">
		        <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">Close</button>
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
        orders: [],
        pagination: {},
        isLoading: false,
        tempOrder: {
          user: { name: '', }
        }
      };
    },
    methods: {
      getOrders( page = 1 ) {
        // 取得訂單列表
        const vm = this;
        let api = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/admin/orders?page=${page}`;
        vm.isLoading = true;
        this.$http.get(api).then((response) => {
          console.log(response.data);
          vm.isLoading = false;
          if (response.data.success) {
            vm.orders = response.data.orders;
            vm.pagination = response.data.pagination;
          };
        });
      },
      openOrderModal(item) {
        // 查看訂單內容
        const vm = this;
        vm.tempOrder = Object.assign({}, item);
        $('#orderModal').modal('show');
      },
    },
    created() {
      this.getOrders();
    },
  };
</script>