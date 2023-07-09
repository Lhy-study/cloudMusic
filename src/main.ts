import { createApp, VueElement } from 'vue'
// import './style.css';
import {createPinia} from "pinia";
import router from './router';
import App from './App.vue';
import axios from 'axios';
import "./assets/font_3o7fureqv5m/iconfont.css"
import 'element-plus/theme-chalk/el-message.css';
import { lazyImg } from "./directives/index";
// axios.defaults.baseURL="http://localhost:3000";
axios.defaults.baseURL="http://houyu.fun:3000";
// axios.create({
//     baseURL:
// })

axios.defaults.withCredentials=true;
const pinia = createPinia();
const app=createApp(App);
app.use(pinia).use(router).mount('#app');
app.directive("lazyImg",lazyImg);


export default pinia;