import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import ElementPlus from 'element-plus'
import Maska from 'maska'

import 'element-plus/theme-chalk/el-reset.css'
import 'element-plus/theme-chalk/index.css'
import './styles/index.scss'
import './styles/variables.css'

createApp(App)
	.use(store)
	.use(router)
	.use(Maska)
	.use(ElementPlus)
	.mount('#app')
