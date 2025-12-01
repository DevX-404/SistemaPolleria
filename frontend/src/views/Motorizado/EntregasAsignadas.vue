<template>
  <div class="container-fluid py-4 fade-in-up">
    
    <div class="card bg-primary text-white shadow-sm mb-4 border-0">
        <div class="card-body p-3 d-flex justify-content-between align-items-center">
            <div>
                <span class="opacity-8 small text-uppercase fw-bold">Dinero en Mano</span>
                <h2 class="mb-0 fw-bold text-white">S/ {{ totalEnMano.toFixed(2) }}</h2>
            </div>
            <div class="text-end opacity-8">
                <font-awesome-icon icon="motorcycle" size="3x" />
            </div>
        </div>
    </div>

    <h5 class="fw-bold text-dark mb-3 ps-1">
        En Ruta ({{ entregasPendientes.length }})
    </h5>

    <div class="row g-3">
        
        <div v-if="entregasPendientes.length === 0" class="col-12 text-center py-5">
            <div class="opacity-50 mb-3">
                <font-awesome-icon icon="check-circle" size="4x" class="text-success" />
            </div>
            <h6 class="text-muted">¡Todo entregado! Esperando nuevos pedidos...</h6>
            <button @click="cargarPedidos" class="btn btn-sm btn-outline-primary mt-3">Actualizar</button>
        </div>

        <div class="col-12 col-md-6 col-lg-4" v-for="pedido in entregasPendientes" :key="pedido.id_pedido">
            <div class="card border-0 shadow-sm h-100 position-relative overflow-hidden">
                <div class="position-absolute top-0 start-0 bottom-0 bg-warning" style="width: 5px;"></div>
                
                <div class="card-body p-3 ps-4">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <span class="badge bg-warning text-dark">Ticket #{{ pedido.id_pedido }}</span>
                        <small class="text-muted fw-bold">{{ formatearHora(pedido.fecha_hora) }}</small>
                    </div>

                    <h5 class="fw-bold text-dark mb-1">{{ pedido.nombre_cliente }}</h5>
                    <p class="text-muted small mb-3 text-truncate">
                        <font-awesome-icon icon="map-marker-alt" class="me-1 text-danger" /> 
                        {{ pedido.direccion }}
                    </p>

                    <div class="d-flex gap-2 mb-3">
                        <a :href="`tel:${pedido.telefono}`" class="btn btn-outline-dark btn-sm flex-grow-1">
                            <font-awesome-icon icon="phone" /> Llamar
                        </a>
                        <a :href="`https://wa.me/51${pedido.telefono}`" target="_blank" class="btn btn-outline-success btn-sm flex-grow-1">
                            WhatsApp
                        </a>
                        <a :href="`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pedido.direccion)}`" target="_blank" class="btn btn-outline-primary btn-sm flex-grow-1">
                            Mapa
                        </a>
                    </div>

                    <hr class="dashed-line my-2">

                    <div class="d-flex justify-content-between align-items-center mt-2">
                        <div class="d-flex flex-column">
                            <span class="small text-muted">A Cobrar:</span>
                            <span class="fs-4 fw-bold text-primary">S/ {{ parseFloat(pedido.total_final).toFixed(2) }}</span>
                        </div>
                        <button class="btn btn-success fw-bold shadow-sm" @click="confirmarEntrega(pedido)">
                            <font-awesome-icon icon="money-bill-wave" class="me-1" /> PAGADO
                        </button>
                    </div>
                </div>
            </div>
        </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/pedidos';
const pedidos = ref([]);
const loading = ref(false);
let intervalId = null;

const cargarPedidos = async () => {
    loading.value = true;
    try {
        const res = await axios.get(API_URL);
        pedidos.value = res.data;
    } catch (e) {
        console.error(e);
    } finally {
        loading.value = false;
    }
};

// Filtramos solo lo que está "En Camino"
const entregasPendientes = computed(() => {
    return pedidos.value.filter(p => p.estado === 'en_camino');
});

// Calculamos cuánto dinero tiene el motorizado de pedidos NO liquidados (opcional, aquí suma lo en camino)
// O podríamos sumar lo "entregado" hoy. Por ahora sumamos lo que tiene que cobrar.
const totalEnMano = computed(() => {
    return entregasPendientes.value.reduce((acc, p) => acc + parseFloat(p.total_final), 0);
});

const confirmarEntrega = async (pedido) => {
    if(!confirm(`¿Confirmar entrega y cobro de S/ ${pedido.total_final}?`)) return;

    try {
        await axios.put(`${API_URL}/${pedido.id_pedido}`, { estado: 'entregado_pagado' });
        // Actualizar lista localmente para efecto inmediato
        pedido.estado = 'entregado_pagado';
        alert("✅ Entrega registrada con éxito");
    } catch (error) {
        alert("Error al registrar entrega");
        console.error(error);
    }
};

const formatearHora = (fecha) => {
    return new Date(fecha).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

onMounted(() => {
    cargarPedidos();
    // Actualización automática para que el motorizado vea cuando le asignan algo nuevo
    intervalId = setInterval(cargarPedidos, 15000); 
});

onUnmounted(() => clearInterval(intervalId));
</script>

<style scoped>
/* Estilos para móvil */
.dashed-line {
    border-top: 1px dashed #dee2e6;
    background: none;
    height: 0;
}
</style>