<template>
  <div>
    <Navbar />
    <MapComponent />
    <router-view />
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue'

</script>

<style scoped>
body {
  margin: 0;
  font-family: sans-serif;
  background: #000000;
  background-color: #e2e6ea;
}


</style>
