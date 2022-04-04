<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-light" style="background-color: #2F2E41">
      <div class="container my-2 d-flex align-items-center">
          <div class="d-flex ">
              <router-link to="/">
                  <img src="./assets/brand.svg" alt="" class="mr-2">
              </router-link>
              <router-link to="/" class="navbar-brand " style="color:#fff;">READ 4 IT</router-link>
          </div>
        <button class="navbar-toggler" @click="toggleMenu">
            <img src="./assets/hamburger.png">
        </button>
        <div class="collapse navbar-collapse" id="mainNav" >
          <ul class="navbar-nav ml-auto">
              <li class="nav-item">
                  <router-link to="/train" class="nav-link text-white">Train</router-link>
              </li>
            <li class="nav-item">
              <router-link  to="/documents" class="nav-link text-white">Documents</router-link>
            </li>
              <li class="nav-item">
                  <router-link to="/companies" class="nav-link text-white">Companies</router-link>
              </li>
            <li class="nav-item">
              <router-link to="/scan" class="nav-link scan-link">Scan</router-link>
            </li>
          </ul>
        </div>
          <div v-if="menu" class="menu">
            <div class="sidebar-cos text-center">
                <img width="100px" height="100px" src="./assets/logo-mobile.svg">
                <div>
                    <div class="mb-4">
                        <a @click="goTo('/train')" class="scan-link">Train</a>
                    </div>
                    <div class="mb-4">
                        <a @click="goTo('/documents')" class="scan-link">Documents</a>
                    </div>
                    <div class="mb-4">
                        <a @click="goTo('/companies')" class="scan-link">Companies</a>
                    </div>
                    <div class="mb-4">
                        <a @click="goTo('/scan')" class="scan-link">Scan</a>
                    </div>
                    <div>
                        <a>About</a>
                    </div>
                </div>
                <div></div>
            </div>
            <div class="close-nav">
                <img  @click="toggleMenu" src="./assets/close.png">
            </div>
          </div>
      </div>
    </nav>

    <div class="height-costum">
      <router-view></router-view>
    </div>

  <footer-content class="footer"></footer-content>

  </div>
</template>

<script>
import FooterContent from "./components/FooterContent";

export default {
    name: 'App',

    components:{
      'footer-content' : FooterContent
    },

  data(){
    return {
      menu:false,
    }
  },
  methods:{
    toggleMenu(){
      this.menu = !this.menu
    },
    goTo(link){
      this.toggleMenu()
      this.$router.push(link)
    }
  }
}
</script>

<style>
  *{
    font-family: 'Roboto', sans-serif;
  }
  .container {
    max-width: 1300px !important;
  }
  .footer {
    display: flex;
    align-items: center;
    height: 350px;
    background-color: rgb(47, 46, 65);
    color: white;
  }
  .height-costum {
    min-height: 84.6vh;
  }
  .scan-link{
    background: white;
    color: rgb(47, 46, 65) !important;
    width: 80px;
    text-align: center;
    border-radius: .2rem;
  }
  .sidebar-cos {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
    background: white;
    display: flex;
      justify-content: space-around;
    align-items: center;
    align-content: center;
    flex-direction: column;
  }
  .sidebar-cos a{
    font-size: 25px;
  }
  .close-nav{
    position: fixed;
    z-index: 1000;
    top: 0;
    right: 0;
    margin: 20px;
  }
  ul a.router-link-active {
    font-weight: bolder ;
  }

  @media (max-width: 768px) {
      .footer{
          height: 450px;
      }
      .footer img{
          width: 80px;
          margin-bottom: 50px;
      }
      .navbar-brand{
          display: none;
      }

  }

  .pointer{
    cursor:pointer;
  }
</style>
