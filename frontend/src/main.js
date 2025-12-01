// frontend/src/main.js

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';

/* --- 1. Importar Iconos --- */
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { 
    faHome, 
    faUtensils, 
    faUsers, 
    faTruckFast, 
    faChartBar, 
    faArrowRightFromBracket, 
    faBoxOpen, 
    faShoppingCart, 
    faCheck,
    faCashRegister,   // <--- NUEVO (Caja)
    faClipboardList   // <--- NUEVO (Lista Pedidos)
} from '@fortawesome/free-solid-svg-icons';

/* --- 2. Agregarlos a la librería --- */
library.add(
    faHome, faUtensils, faUsers, faTruckFast, faChartBar, 
    faArrowRightFromBracket, faBoxOpen, faShoppingCart, 
    faCheck, faCashRegister, faClipboardList
);

import 'bootstrap/dist/css/bootstrap.min.css'; 
import './assets/css/main.css'; 

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.component('font-awesome-icon', FontAwesomeIcon);
app.mount('#app');