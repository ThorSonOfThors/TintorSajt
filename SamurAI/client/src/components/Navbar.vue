<template>
  <nav class="navbar">
    <ul>
      <li><router-link to="/">Home</router-link></li>
      <li><router-link to="/orders">Orders</router-link></li>
      
      <!-- Add more links here as needed -->
    </ul>
  </nav>
</template>

<script setup>
// No script needed for now
</script>

<style scoped>
.navbar {
  background-color: #227bdb;
  padding: 1rem;
}

.navbar ul {
  list-style: none;
  display: flex;
  gap: 1.5rem;
  margin: 0;
  padding: 0;
}



.navbar a {
  color: white;
  text-decoration: none;
  font-weight: 600;
  background-color: null;
}

.navbar a.router-link-exact-active {
  border-bottom: 2px solid #4caf50;
}
</style>
