<template>
Home
</template>

<script>
export default {
  created() {
    if(this.$store.getters['Auth/isLoggedIn']) {
      this.$router.push('/dashboard');
    } else {
      this.$router.push('/login');
    }
  }
};
</script>
