<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-md">
      <a class="navbar-brand" href="/">Car Assembly</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <div class="me-auto navbar-nav">
          
          <router-link class="nav-link" to="storage">Storage</router-link>
          <router-link class="nav-link" to="assembly">Assembly</router-link>
          <router-link class="nav-link" to="products">Products</router-link>
          <router-link class="nav-link" to="admin">Admin</router-link>
        </div>
        <button class="btn text-white" onclick="loginAction()">Login</button>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'NavigationBar'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
