<template>
  <div class="admin-layout-wrapper">
    
    <Sidebar />

    <div class="main-content">
      
      <Navbar />

      <div class="router-container">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>

    </div>
  </div>
</template>

<script setup>
import Sidebar from '@/components/shared/Sidebar.vue';
import Navbar from '@/components/shared/Navbar.vue';
</script>

<style scoped>
/* Aseguramos que la estructura ocupe el 100% */
.admin-layout-wrapper {
  display: flex;
  width: 100%;
  min-height: 100vh;
}

/* El contenedor principal donde se renderizan las vistas */
.router-container {
  flex: 1; /* ¡CLAVE! Esto le dice: "Ocupa todo el espacio vertical que sobre" */
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
  overflow-x: hidden; /* Evita scroll horizontal accidental */
  /* NOTA: No ponemos padding aquí. Cada vista (POS, Clientes) manejará su propio padding. */
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>