<template>
  <div>
    <Navbar></Navbar>
    <Alert></Alert>
    <div class="container">
      <main role="main">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar';
import Alert from '@/components/AlertMessage'

export default {
  data() {
    return {};
  },
  components: {
    Navbar,
    Alert,
  },
}; 

</script>