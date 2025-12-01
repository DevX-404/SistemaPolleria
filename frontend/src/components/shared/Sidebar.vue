<template>
  <div class="sidebar">
    
    <div class="sidebar-header d-flex align-items-center">
      <img src="/img/logo-polleria.avif" alt="Logo" style="width: 35px; margin-right: 12px;">
      <span>Pollería Admin</span>
    </div>

    <div class="sidebar-menu-wrapper">
      <ul class="sidebar-menu list-unstyled">
        
        <li class="sidebar-menu-item">
          <router-link to="/admin/dashboard">
            <font-awesome-icon icon="chart-bar" class="fa-icon" /> Dashboard
          </router-link>
        </li>

        <div class="menu-section-title">Operaciones</div>

        <li class="sidebar-menu-item">
          <router-link to="/admin/ventas">
            <font-awesome-icon icon="cash-register" class="fa-icon" /> Nueva Venta
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

        <div class="menu-section-title">Gestión</div>

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
        
        <li class="sidebar-menu-item">
          <router-link to="/admin/reportes">
            <font-awesome-icon icon="chart-bar" class="fa-icon" /> Reportes
          </router-link>
        </li>

      </ul>
    </div>

    <div class="sidebar-footer">
      <li class="sidebar-menu-item list-unstyled">
        <router-link to="/login" class="text-danger-custom">
          <font-awesome-icon icon="arrow-right-from-bracket" class="fa-icon" /> Cerrar Sesión
        </router-link>
      </li>
    </div>

  </div>
</template>

<script setup>
</script>

<style scoped>
/* Estilo específico para el botón de salir rojo suave */
.text-danger-custom {
    color: #ff6b6b !important;
    background-color: rgba(255, 107, 107, 0.1);
}
.text-danger-custom:hover {
    background-color: #ff6b6b !important;
    color: white !important;
    box-shadow: 0 4px 10px rgba(255, 107, 107, 0.4);
}
</style>