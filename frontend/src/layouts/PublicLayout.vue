<template>
  <div class="public-layout">
    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top">
      <div class="container">
        <a class="navbar-brand fw-bold text-primary d-flex align-items-center" href="#">
          <img src="/img/logo-polleria.avif" width="35" height="35" class="me-2">
          POLLERÍA EL SABROSÓN
        </a>
        <button class="btn btn-primary btn-sm rounded-pill px-3" @click="$emit('abrirCarrito')">
           <font-awesome-icon icon="shopping-cart" /> Ver Pedido
        </button>
      </div>
    </nav>

    <div class="page-content">
      <router-view />
    </div>

    <footer class="bg-dark text-white text-center py-4 mt-auto">
      <div class="container">
        <p class="mb-0 small opacity-75">© 2024 El Sabrosón - El verdadero sabor a leña</p>
        <small class="text-muted">Desarrollado por TuAgencia</small>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.page-content {
    padding-top: 70px; /* Espacio para el navbar fijo */
    min-height: 100vh;
    background-color: #f8f9fa;
}
</style>