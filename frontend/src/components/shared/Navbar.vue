<template>
  <nav class="navbar-top">
    <div class="navbar-brand-top">
      Bienvenido al Panel
    </div>
    <div class="user-profile-top dropdown">
      <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
        Admin <img src="/img/user.jpg" alt="User Avatar">
      </a>
      <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
        <li><a class="dropdown-item" href="#">Mi Perfil</a></li>
        <li><hr class="dropdown-divider"></li>
        <li><a class="dropdown-item" href="/login">Cerrar Sesión</a></li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { onMounted } from 'vue';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Importa JS de Bootstrap para el dropdown

onMounted(() => {
  // Inicialización de dropdowns de Bootstrap si fuera necesario con componentes custom
});
</script>

<style scoped>
/* Styles handled in main.css for consistency */
</style>