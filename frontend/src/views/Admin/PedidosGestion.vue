<template>
  <div class="container-fluid py-4 fade-in-up">
    
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h3 class="fw-bold text-dark mb-0">Monitor de Pedidos 🛎️</h3>
        <p class="text-muted small mb-0">Control de despacho y delivery</p>
      </div>
      <div class="d-flex gap-2">
        <span class="badge bg-white text-dark border d-flex align-items-center px-3">
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
            {{ loading ? 'Actualizando...' : 'Actualizado hace instantes' }}
        </span>
        <button @click="cargarPedidos" class="btn btn-icon btn-white border shadow-sm">
            <font-awesome-icon icon="rotate" />
        </button>
      </div>
    </div>

    <div class="card border-0 shadow-sm mb-4">
        <div class="card-body p-2">
            <ul class="nav nav-pills nav-fill">
                <li class="nav-item">
                    <a class="nav-link fw-bold" :class="{ active: filtro === 'activos', 'bg-light text-dark': filtro !== 'activos' }" href="#" @click.prevent="filtro = 'activos'">
                        ACTIVOS ({{ conteo.activos }})
                    </a>
                </li>
                
                <li class="nav-item ps-1">
                    <a class="nav-link fw-bold" :class="{ active: filtro === 'pendiente', 'bg-danger text-white': filtro === 'pendiente' }" href="#" @click.prevent="filtro = 'pendiente'">
                        PENDIENTES ({{ conteo.pendiente }})
                    </a>
                </li>
                <li class="nav-item ps-1">
                    <a class="nav-link fw-bold" :class="{ active: filtro === 'en_camino', 'bg-warning text-dark': filtro === 'en_camino' }" href="#" @click.prevent="filtro = 'en_camino'">
                        EN RUTA 🛵 ({{ conteo.en_camino }})
                    </a>
                </li>
                <li class="nav-item ps-1">
                    <a class="nav-link fw-bold" :class="{ active: filtro === 'entregado_pagado', 'bg-success text-white': filtro === 'entregado_pagado' }" href="#" @click.prevent="filtro = 'entregado_pagado'">
                        HISTORIAL HOY
                    </a>
                </li>
            </ul>
        </div>
    </div>

    <div class="row">
        <div class="col-12">
            <div class="card border-0 shadow-sm">
                <div class="table-responsive">
                    <table class="table align-items-center mb-0">
                        <thead class="bg-light">
                            <tr>
                                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-4">Pedido #</th>
                                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Cliente / Dirección</th>
                                <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Total</th>
                                <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Tipo</th>
                                <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Estado Actual</th>
                                <th class="text-secondary opacity-7"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="pedido in pedidosFiltrados" :key="pedido.id_pedido" class="align-middle">
                                
                                <td class="ps-4">
                                    <div class="d-flex flex-column">
                                        <h6 class="mb-0 text-sm fw-bold">#{{ pedido.id_pedido }}</h6>
                                        <small class="text-muted">{{ formatearHora(pedido.fecha_hora) }}</small>
                                    </div>
                                </td>

                                <td>
                                    <div class="d-flex flex-column">
                                        <span class="text-dark fw-bold text-sm">{{ pedido.nombre_cliente || 'Cliente Mostrador' }}</span>
                                        <span class="text-xs text-muted" v-if="pedido.tipo_venta === 'delivery'">
                                            <font-awesome-icon icon="location-dot" /> {{ pedido.direccion }}
                                        </span>
                                    </div>
                                </td>

                                <td class="align-middle text-center">
                                    <span class="text-secondary text-sm fw-bold">S/ {{ parseFloat(pedido.total_final).toFixed(2) }}</span>
                                </td>

                                <td class="align-middle text-center">
                                    <span v-if="pedido.tipo_venta === 'delivery'" class="badge badge-sm bg-gradient-info">DELIVERY</span>
                                    <span v-else class="badge badge-sm bg-gradient-secondary">LOCAL</span>
                                </td>

                                <td class="align-middle text-center text-sm">
                                    <span :class="['badge badge-sm', getBadgeColor(pedido.estado)]">
                                        {{ pedido.estado.replace('_', ' ').toUpperCase() }}
                                    </span>
                                </td>

                                <td class="align-middle text-end pe-4">
    
    <div v-if="pedido.estado === 'pendiente'">
        
        <button v-if="pedido.tipo_venta === 'delivery'" 
                class="btn btn-sm btn-outline-warning mb-0 fw-bold"
                @click="cambiarEstado(pedido.id_pedido, 'en_camino')">
            🚀 Al Motorizado
        </button>

        <button v-else 
                class="btn btn-sm btn-success mb-0 fw-bold"
                @click="cambiarEstado(pedido.id_pedido, 'entregado_pagado')">
            ✅ Entregar al Cliente
        </button>

    </div>

    <button v-if="pedido.estado === 'en_camino'" 
            class="btn btn-sm btn-info mb-0 fw-bold"
            @click="cambiarEstado(pedido.id_pedido, 'entregado_pagado')">
        💰 Confirmar Pago
    </button>

</td>
                            </tr>

                            <tr v-if="pedidosFiltrados.length === 0">
                                <td colspan="6" class="text-center py-5">
                                    <div class="d-flex flex-column align-items-center">
                                        <font-awesome-icon icon="clipboard-list" size="3x" class="text-muted opacity-25 mb-3" />
                                        <h6 class="text-muted">No hay pedidos en esta lista</h6>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
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
// Asegúrate de tener los iconos importados en main.js (location-dot, check-circle, rotate)

const API_URL = 'http://localhost:3000/api/pedidos';
const pedidos = ref([]);
const filtro = ref('activos'); // 'todos', 'pendiente', 'en_camino', 'entregado_pagado'
const loading = ref(false);
let intervalId = null;

// Cargar datos
const cargarPedidos = async () => {
    loading.value = true;
    try {
        const res = await axios.get(API_URL);
        pedidos.value = res.data;
    } catch (e) {
        console.error("Error cargando pedidos:", e);
    } finally {
        loading.value = false;
    }
};

// Cambiar estado (Flujo)
const cambiarEstado = async (id, nuevoEstado) => {
    if(!confirm(`¿Cambiar estado del pedido #${id}?`)) return;

    try {
        await axios.put(`${API_URL}/${id}`, { estado: nuevoEstado });
        // Actualización optimista local
        const p = pedidos.value.find(x => x.id_pedido === id);
        if(p) p.estado = nuevoEstado;
        
        // Opcional: mostrar un toast o alerta pequeña
    } catch (e) {
        alert('Error al actualizar estado');
        console.error(e);
    }
};

// Computed: Filtrado Inteligente
const pedidosFiltrados = computed(() => {
    // Definimos el límite de tiempo: "Hace 1 hora"
    const ahora = Date.now();
    const limiteTiempo = ahora - (60 * 60 * 1000); // 60 min * 60 seg * 1000 ms

    // 1. Pestaña ACTIVOS: Todo lo que no ha terminado + Cancelados recientes
    if (filtro.value === 'activos') {
        return pedidos.value.filter(p => 
            p.estado !== 'entregado_pagado' && p.estado !== 'cancelado'
        );
    }

    // 2. Pestaña HISTORIAL (ENTREGADOS): Solo los de la ÚLTIMA HORA
    if (filtro.value === 'entregado_pagado') {
        return pedidos.value.filter(p => {
            const fechaPedido = new Date(p.fecha_hora).getTime();
            // Mostrar solo si es 'entregado' Y es más reciente que hace 1 hora
            return p.estado === 'entregado_pagado' && fechaPedido > limiteTiempo;
        });
    }

    // 3. Resto de filtros (Pendiente, En camino): Comportamiento normal
    return pedidos.value.filter(p => p.estado === filtro.value);
});

// Computed: Contadores (Actualizados con la misma lógica)
const conteo = computed(() => {
    const ahora = Date.now();
    const limiteTiempo = ahora - (60 * 60 * 1000);

    return {
        activos: pedidos.value.filter(p => p.estado !== 'entregado_pagado' && p.estado !== 'cancelado').length,
        
        pendiente: pedidos.value.filter(p => p.estado === 'pendiente').length,
        
        en_camino: pedidos.value.filter(p => p.estado === 'en_camino').length,
        
        // El contador del historial también mostrará solo los de la última hora
        entregado: pedidos.value.filter(p => {
            const fechaPedido = new Date(p.fecha_hora).getTime();
            return p.estado === 'entregado_pagado' && fechaPedido > limiteTiempo;
        }).length
    };
});

// Utilidades Visuales
const getBadgeColor = (estado) => {
    switch (estado) {
        case 'pendiente': return 'bg-gradient-danger';
        case 'en_cocina': return 'bg-gradient-warning';
        case 'en_camino': return 'bg-gradient-info';
        case 'entregado_pagado': return 'bg-gradient-success';
        default: return 'bg-gradient-secondary';
    }
};

const formatearHora = (fechaIso) => {
    if (!fechaIso) return '';
    const d = new Date(fechaIso);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Ciclo de vida
onMounted(() => {
    cargarPedidos();
    // Auto-actualizar cada 10 segundos
    intervalId = setInterval(cargarPedidos, 10000); 
});

onUnmounted(() => {
    if (intervalId) clearInterval(intervalId);
});
</script>

<style scoped>
/* Estilos extra para los badges degradados tipo Argon */
.bg-gradient-danger { background: linear-gradient(87deg, #f5365c 0, #f56036 100%) !important; color: white; }
.bg-gradient-warning { background: linear-gradient(87deg, #fb6340 0, #fbb140 100%) !important; color: white; }
.bg-gradient-success { background: linear-gradient(87deg, #2dce89 0, #2dcecc 100%) !important; color: white; }
.bg-gradient-info { background: linear-gradient(87deg, #11cdef 0, #1171ef 100%) !important; color: white; }
.bg-gradient-secondary { background: #e9ecef; color: #525f7f; }

.nav-pills .nav-link {
    border-radius: 0.5rem;
    transition: all 0.2s;
    color: #67748e;
}
.nav-pills .nav-link:hover {
    background-color: #f6f9fc;
}
</style>