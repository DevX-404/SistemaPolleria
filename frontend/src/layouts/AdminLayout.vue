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
/* Layout base: Ocupa toda la pantalla */
.admin-layout-wrapper {
  display: flex;
  width: 100%;
  height: 100vh; /* Forzamos altura fija de ventana */
  overflow: hidden; /* Evitamos scroll en el wrapper principal */
}

/* Contenido Principal: Columna flexible */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden; /* Importante para que el scroll sea interno */
  margin-left: 280px; /* Ancho del Sidebar */
  transition: margin-left 0.3s ease;
}

/* Contenedor de Vistas: Crece para llenar el hueco */
.router-container {
  flex: 1; /* Ocupa todo el espacio debajo del Navbar */
  display: flex;
  flex-direction: column;
  overflow-y: auto; /* El scroll ocurre AQUÍ, no en el body */
  overflow-x: hidden;
  background-color: var(--bg-body); /* Asegura fondo gris en todo el hueco */
}

/* --- EL TRUCO MÁGICO --- */
/* Esto fuerza al primer hijo (tu vista .vue) a crecer */
.router-container > * {
  flex-grow: 1;
  width: 100%;
}

/* Animación */
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* Responsive */
@media (max-width: 992px) {
  .main-content { margin-left: 0 !important; }
}
</style>