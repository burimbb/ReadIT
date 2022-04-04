import Vue from 'vue'
import VueRouter from 'vue-router'
import axios from 'axios';

import 'bootstrap/dist/css/bootstrap.min.css'
import 'jquery/src/jquery.js'
import 'bootstrap/dist/js/bootstrap.min.js'
import VModal from 'vue-js-modal'
import 'font-awesome/css/font-awesome.min.css'

Vue.use(VueRouter)
Vue.use(VModal)

import App from './App.vue'

const instanceAxios = axios.create({
    baseURL: 'http://localhost:3000',
});

Vue.config.productionTip = false

import routes from './routes'
const router = new VueRouter({
    mode: 'history',
    routes
})

Vue.prototype.axios = instanceAxios

new Vue({
    render: h => h(App),
    router,
}).$mount('#app')