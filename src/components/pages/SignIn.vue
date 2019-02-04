<template>
  <div>
    <Alert></Alert>
    <div class="sign-box d-flex align-items-start justify-content-center">
      <div class="card border-0">
        <h5 class="card-header card-header-bg text-white text-center">
          <i class="fab fa-playstation"></i>
          PlayStation
        </h5>
        <div class="card-body">
          <form class="form-signin rounded" @submit.prevent="signIn">
            <h1 class="h3 mb-3 mx-auto font-weight-bold text-primary text-center">後台管理系統</h1>
            <label for="inputEmail" class="sr-only">登入 ID (電子郵件位址)</label>
            <input type="email" id="inputEmail" class="form-control" 
            v-model="user.username"  
            placeholder="登入 ID (電子郵件位址)" required autofocus>
            <label for="inputPassword" class="sr-only">密碼</label>
            <input type="password" id="inputPassword" class="form-control"
            v-model="user.password" 
            placeholder="密碼" required>
            <div class="form-group form-check">
              <input type="checkbox" class="form-check-input" id="exampleCheck1" v-model="user.isRemember">
              <label class="form-check-label" for="exampleCheck1">記住我</label>
            </div>
            <button class="btn btn-lg btn-warning btn-block" type="submit">
              登入
              <i class="fas fa-spinner fa-spin" v-if="status.itemLoading"></i>
            </button>
            <p class="mt-4 text-muted text-center">&copy; 2018 PlayStation Store</p>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Alert from '@/components/AlertMessage';
  export default {
    components: {
      Alert
    },
    data() {
      return {
        user: {
          username: '',
          password: '',
          isRemember: false
        },
        status: {
          itemLoading: false,
        },
      };
    },
    methods: {
      signIn() {
        let api = `${process.env.API_PATH}/admin/signin`;
        const vm = this;
        vm.status.itemLoading = true;
        localStorage.setItem('isRemember', vm.user.isRemember);
        vm.user.isRemember ? localStorage.setItem('userAccount', vm.user.username) : localStorage.removeItem('userAccount');
        this.$http.post(api, vm.user).then((response) => {
          console.log(response.data);
          vm.status.itemLoading = false;
          if (response.data.success) {
            vm.$router.push('/admin/products');
          } else {
            vm.$bus.$emit('AlertMessage', `【${response.data.message}】`, 'danger');
          };
        });
      },
      rememberMe() {
        const userAccount = localStorage.getItem('userAccount') || '';
        const remember = localStorage.getItem('isRemember') || false;
        const vm = this;
        if(remember === 'true') {
          vm.user.username = userAccount;
          vm.user.isRemember = true;
        }
      },
    },
    mounted() {
      const vm = this; 
      vm.rememberMe();
    },
  };
</script>

<style lang="scss" scoped>
.sign-box {
  min-height: 100vh;
  background-image: url('https://id.sonyentertainmentnetwork.com/signin/d084c7895e199769b234c47f23e8c4341fefc658/assets/images/wallpaper.jpg');
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
}
.card {
  width: 90%;
  max-width: 330px;
  margin: 100px auto 0 auto;
  background-color: rgb(255, 255, 255);
  .card-header-bg {
    background-color: #141414;
  }
}
.form-signin {
  h1 {
    width: 170px;
    border-right: 1px solid;
    overflow: hidden;
    white-space: nowrap;
    animation: typing 1.5s steps(13), insert 1s steps(1) infinite;
  }
}
.form-signin .checkbox {
  font-weight: 400;
}
.form-signin .form-control {
  position: relative;
  box-sizing: border-box;
  height: auto;
  padding: 10px;
  font-size: 16px;
}
.form-signin .form-control:focus {
  z-index: 2;
}
.form-signin input[type="email"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}
.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
@keyframes insert {
  50% {
    border-color: transparent;
  }
}
@keyframes typing {
  0% {
    width: 0;
  }
}
</style>