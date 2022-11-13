<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-md">
      <router-link class="navbar-brand" to="/">Car Assembly</router-link>
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
<style scoped>
.router-link-active {
  color: #fff !important;
  margin-bottom: -1px !important;
  border-bottom: 1px solid white;
  border-radius: .05rem;
}
</style>
