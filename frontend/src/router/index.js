import { createRouter, createWebHistory } from 'vue-router';

// Importamos Layouts y Vistas usando rutas relativas
import AdminLayout from '../layouts/AdminLayout.vue';
import Login from '../views/Auth/Login.vue';
import PublicLayout from '../layouts/PublicLayout.vue';
import LandingPage from '../views/Web/LandingPage.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: PublicLayout,
      children: [
        {
          path: '', // Ruta vacía = /
          name: 'Home',
          component: LandingPage
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/admin',
      component: AdminLayout,
      children: [
        {
          path: 'dashboard',
          name: 'AdminDashboard',
          component: () => import('../views/Admin/DashboardAdmin.vue'),
        },
        // --- AQUÍ ESTÁ LA NUEVA RUTA DEL POS ---
        {
            path: 'ventas', 
            name: 'VentasPOS',
            component: () => import('../views/Admin/VentasPOS.vue'),
        },
        // ---------------------------------------
        {
            path: 'pedidos', 
            name: 'PedidosList',
            // Si aun no creamos esta vista, usa VentasPOS temporalmente o crea un archivo vacio
            component: () => import('../views/Admin/PedidosGestion.vue'), 
        },
        {
          path: 'productos',
          name: 'ProductosGestion',
          component: () => import('../views/Admin/ProductosGestion.vue'),
        },
        {
          path: 'clientes',
          name: 'ClientesGestion',
          component: () => import('../views/Admin/ClientesGestion.vue'),
        },
        {
            path: 'delivery',
            name: 'DeliveryGestion',
            component: () => import('../views/Motorizado/EntregasAsignadas.vue'),
        },
        {
          path: 'reportes',
          name: 'Reportes',
          component: () => import('../views/Admin/ReportesVentas.vue'),
        },
      ]
    },
  ]
});

export default router;