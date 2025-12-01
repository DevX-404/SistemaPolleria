<template>
  <div class="container-fluid py-4 fade-in-up">
    
    <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="fw-bold text-dark mb-0 ps-1">
            Mis Entregas ({{ entregasPendientes.length }})
        </h5>
        <button class="btn btn-sm btn-icon btn-white shadow-sm border" @click="cargarPedidos">
            <font-awesome-icon icon="rotate" />
        </button>
    </div>

    <div class="row g-3">
        
        <div v-if="entregasPendientes.length === 0" class="col-12 text-center py-5">
            <div class="opacity-50 mb-3">
                <font-awesome-icon icon="check-circle" size="4x" class="text-success" />
            </div>
            <h6 class="text-muted">No tienes entregas pendientes.</h6>
        </div>

        <div class="col-12 col-md-6 col-lg-4" v-for="pedido in entregasPendientes" :key="pedido.id_pedido">
            <div class="card border-0 shadow-sm h-100 position-relative overflow-hidden">
                <div class="position-absolute top-0 start-0 bottom-0" 
                     :class="pedido.metodo_pago === 'efectivo' ? 'bg-danger' : 'bg-success'" 
                     style="width: 6px;">
                </div>
                
                <div class="card-body p-3 ps-4">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <span class="badge bg-dark text-white">Ticket #{{ pedido.id_pedido }}</span>
                        <small class="text-muted fw-bold">{{ formatearHora(pedido.fecha_hora) }}</small>
                    </div>

                    <h5 class="fw-bold text-dark mb-1">{{ pedido.nombre_cliente }}</h5>
                    
                    <a :href="`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pedido.direccion)}`" 
                       target="_blank" class="text-decoration-none d-block mb-3 p-2 bg-light rounded border border-light">
                        <font-awesome-icon icon="map-marker-alt" class="me-2 text-danger" /> 
                        <span class="text-dark small fw-bold">{{ pedido.direccion }}</span>
                    </a>

                    <div class="d-flex gap-2 mb-3">
                        <a :href="`tel:${pedido.telefono}`" class="btn btn-outline-dark btn-sm flex-grow-1">
                            <font-awesome-icon icon="phone" />
                        </a>
                        <a :href="`https://wa.me/51${pedido.telefono}`" target="_blank" class="btn btn-success btn-sm flex-grow-1 text-white">
                            <font-awesome-icon :icon="['fab', 'whatsapp']" /> WhatsApp
                        </a>
                    </div>

                    <hr class="dashed-line my-2">

                    <div class="mt-2">
                        
                        <div v-if="pedido.metodo_pago !== 'efectivo'" class="alert alert-success py-2 px-3 mb-2 text-center border-0">
                            <div class="fw-bold small"><font-awesome-icon icon="check-circle" /> YA PAGADO</div>
                            <div class="text-xs opacity-75">{{ pedido.metodo_pago.toUpperCase() }} - {{ pedido.referencia_pago }}</div>
                        </div>

                        <div v-else class="alert alert-warning py-2 px-3 mb-2 text-center border-0 text-dark">
                            <div class="small fw-bold text-uppercase text-danger">⚠️ Cobrar al entregar</div>
                            <div class="fs-2 fw-bold text-dark">S/ {{ parseFloat(pedido.total_final).toFixed(2) }}</div>
                            <div class="text-xs fw-bold text-muted border-top border-secondary mt-1 pt-1">
                                {{ pedido.referencia_pago }} </div>
                        </div>

                        <button class="btn btn-dark w-100 fw-bold shadow-sm py-2 mt-1" @click="confirmarEntrega(pedido)">
                            <font-awesome-icon icon="check" class="me-1" /> MARCAR ENTREGADO
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
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const API_URL = 'http://localhost:3000/api/pedidos';
const pedidos = ref([]);
const loading = ref(false);
let intervalId = null;

const cargarPedidos = async () => {
    loading.value = true;
    try {
        const res = await axios.get(API_URL);
        pedidos.value = res.data;
    } catch (e) { console.error(e); } finally { loading.value = false; }
};

// Filtramos solo lo que está "En Camino"
const entregasPendientes = computed(() => {
    return pedidos.value.filter(p => p.estado === 'en_camino');
});

const confirmarEntrega = async (pedido) => {
    // Mensaje diferente según si hay que cobrar o no
    const mensaje = pedido.metodo_pago === 'efectivo' 
        ? `¿Ya cobraste los S/ ${pedido.total_final} y entregaste el pedido?` 
        : `¿Confirmas que ya entregaste el pedido (Ya estaba pagado)?`;

    if(!confirm(mensaje)) return;

    try {
        await axios.put(`${API_URL}/${pedido.id_pedido}`, { estado: 'entregado_pagado' });
        // Actualizar localmente 
        pedido.estado = 'entregado_pagado';
        alert("✅ Entrega registrada.");
    } catch (error) {
        alert("Error al registrar entrega");
    }
};

const formatearHora = (fecha) => {
    return new Date(fecha).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

onMounted(() => {
    cargarPedidos();
    intervalId = setInterval(cargarPedidos, 15000); 
});

onUnmounted(() => clearInterval(intervalId));
</script>

<style scoped>
.dashed-line { border-top: 1px dashed #ccc; background: none; height: 0; opacity: 0.5; }
</style>