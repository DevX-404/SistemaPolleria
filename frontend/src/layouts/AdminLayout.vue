<template>
  <div class="d-flex" id="wrapper">
    <Sidebar />
    <div id="page-content-wrapper" class="main-content">
      <Navbar />

      <div class="container-fluid py-4">
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
/* Scoped styles for AdminLayout if needed, otherwise main.css handles it */
</style>