<template>
  <div class="sidebar">
    <div class="sidebar-header d-flex align-items-center">
      <img src="/img/logo-polleria.avif" alt="Logo" style="width: 30px; margin-right: 10px;">
      <span>Pollería Admin</span>
    </div>

    <ul class="sidebar-menu">
      
      <li class="sidebar-menu-item">
        <router-link to="/admin/dashboard">
          <font-awesome-icon icon="chart-bar" class="fa-icon" /> Dashboard
        </router-link>
      </li>

      <div class="text-uppercase text-muted small fw-bold mt-3 mb-2 px-4" style="font-size: 0.7rem;">Operaciones</div>

      <li class="sidebar-menu-item">
        <router-link to="/admin/ventas">
          <font-awesome-icon icon="cash-register" class="fa-icon" /> Nueva Venta (POS)
        </router-link>
      </li>

      <li class="sidebar-menu-item">
        <router-link to="/admin/pedidos">
          <font-awesome-icon icon="clipboard-list" class="fa-icon" /> Lista Pedidos
        </router-link>
      </li>

       <li class="sidebar-menu-item">
        <router-link to="/admin/delivery">
          <font-awesome-icon icon="truck-fast" class="fa-icon" /> Delivery
        </router-link>
      </li>

      <div class="text-uppercase text-muted small fw-bold mt-3 mb-2 px-4" style="font-size: 0.7rem;">Gestión</div>

      <li class="sidebar-menu-item">
        <router-link to="/admin/productos">
          <font-awesome-icon icon="utensils" class="fa-icon" /> Productos
        </router-link>
      </li>

      <li class="sidebar-menu-item">
        <router-link to="/admin/clientes">
          <font-awesome-icon icon="users" class="fa-icon" /> Clientes
        </router-link>
      </li>

      <li class="sidebar-menu-item mt-4">
        <router-link to="/login" class="text-danger">
          <font-awesome-icon icon="arrow-right-from-bracket" class="fa-icon" /> Cerrar Sesión
        </router-link>
      </li>

    </ul>
  </div>
</template>

<script setup>
// No se requiere lógica compleja, RouterLink maneja la clase 'active' automáticamente
</script>

<style scoped>
/* Los estilos ya están en main.css, pero aquí ajustamos el hover del botón salir */
.text-danger:hover {
    background-color: rgba(220, 53, 69, 0.1) !important;
    color: #ff6b6b !important;
}
</style>