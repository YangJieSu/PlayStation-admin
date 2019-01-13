<template>
  <div>
    <Navbar></Navbar>
    <Alert></Alert>
    <div class="container">
      <!-- <Sidebar></Sidebar> -->
      <main role="main">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar';
// import Sidebar from '@/components/Sidebar';
import Alert from '@/components/AlertMessage'

export default {
  data() {
    return {};
  },
  components: {
    Navbar,
    // Sidebar,
    Alert,
  },
}; 

</script>