import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Antd from 'ant-design-vue/es';
import 'ant-design-vue/dist/antd.css';
import request from './network/request';
import toolCookie from './tool/cookie';
const app = createApp(App);
app.config.globalProperties.$api = request;
app.config.globalProperties.$cookie = toolCookie;
app.use(store).use(router).use(Antd).mount('#app');
//# sourceMappingURL=main.js.map