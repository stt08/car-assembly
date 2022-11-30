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
        <button class="btn text-white" @click="loginAction" data-bs-toggle="modal" data-bs-target="#authModal">
          <i class="fas fa-user"></i>
          {{ loggedIn ? 'Logout' : 'Login' }}
        </button>
      </div>
    </div>
  </nav>

  <div class="modal fade" id="authModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ modal_title }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div v-if="loggedIn" class="text-start">
            <div class="mb-3">
              <p class="mb-0">Your name:</p>
              <input class="form-control" type="text" :value="user.name" disabled>
            </div>
            <div class="mb-3">
              <p class="mb-0">Your role:</p>
              <input class="form-control" type="text" :value="user.role" disabled>
            </div>
          </div>
          <div v-else>
            <h2 v-if="!shown" class="py-3"><i class="fa fw fa-2xl" :class="icon" aria-hidden="true"></i></h2>
            <p v-if="!shown" class="mb-0"> {{ modal_body }} </p>
            <QrStream :camera="camera" @decode="onDecode" v-if="shown" />
          </div>
        </div>
        <div class="modal-footer">
          <button v-if="loggedIn" @click="logoutAction" type="button" class="btn btn-danger" data-bs-dismiss="modal">Logout</button>
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
  <div class="error_animation"></div>
</template>

<script>
import { QrStream } from 'vue3-qr-reader';
import UserService from '../services/UserService.js';

export default {
  name: 'NavigationBar',
  components: {
    QrStream
  },
  data() {
    return {
      loggedIn: false,
      modal_title: '--',
      modal_body: '--',
      camera: 'auto',
      shown: false,
      icon: '',
      user: {},
    }
  },
  created() {
    this.user = JSON.parse(localStorage.getItem('user'));
    if (this.user && this.user.expiry < Date.now())
      this.logoutAction();
    this.loggedIn = (this.user ? this.user.name !== '' : false);
  },
  methods: {
    loginAction() {
      console.log(0)
      if (!this.loggedIn) {
        console.log(111)
        this.shown = true;
        this.camera = 'auto';
        this.modal_title = 'QR Login';
      } else {
        console.log(222)
        this.modal_title = 'Profile (logout)';
      }
    },
    logoutAction() {
      this.user = {};
      this.loggedIn = false;
      this.shown = false;
      localStorage.clear();
    },
    async onDecode(text) {
      this.camera = 'off'
      this.shown = false
      this.modal_body = 'authenticating...';
      this.icon = 'fa-spinner fa-spin'
      await this.timeout(1000)
      let result = await UserService.auth(text);
      if (!result || result.data._id == '-1') {
        this.icon = 'fa-times-circle text-danger';
        this.modal_body = 'Invalid data!';
        console.log(UserService.getUsers());
        return;
      }
      else {
        this.icon = 'fa-check-circle text-success';
        this.modal_body = `Welcome, ${result.data.name}!`;
        let user = {
          id: result.data._id,
          name: result.data.name,
          role: result.data.role,
          expiry: new Date((new Date()).getTime() + 10*60000)
        }
        this.user = user;
        await this.timeout(3000);
        this.loggedIn = true;
        this.modal_title = 'Profile (logout)';
        localStorage.setItem('user', JSON.stringify(user));
      }
    },
    timeout (ms) {
      return new Promise(resolve => {
        window.setTimeout(resolve, ms)
      })
    }
  }
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
.animateicon {
  animation: animateicon 1s;
}
@keyframes animateicon {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
