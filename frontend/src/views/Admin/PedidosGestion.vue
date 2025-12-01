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
                        VISIÓN GENERAL ({{ conteo.activos }})
                    </a>
                </li>

                <li class="nav-item ps-1">
                    <a class="nav-link fw-bold" :class="{ active: filtro === 'pendiente', 'bg-danger text-white': filtro === 'pendiente' }" href="#" @click.prevent="filtro = 'pendiente'">
                        🔥 EN COCINA ({{ conteo.pendiente }})
                    </a>
                </li>

                <li class="nav-item ps-1">
                    <a class="nav-link fw-bold" :class="{ active: filtro === 'en_camino', 'bg-warning text-dark': filtro === 'en_camino' }" href="#" @click.prevent="filtro = 'en_camino'">
                        ⏳ POR COBRAR / RUTA ({{ conteo.en_camino }})
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

    <div class="card border-0 shadow-sm">
        <div class="table-responsive">
            <table class="table align-items-center mb-0">
                <thead class="bg-light">
                    <tr>
                        <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-4">#</th>
                        <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Cliente</th>
                        <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Total</th>
                        <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Tipo</th>
                        <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Estado</th>
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
                            <span v-else-if="pedido.tipo_venta === 'mesa'" class="badge badge-sm bg-gradient-warning text-dark">MESA</span>
                            <span v-else-if="pedido.tipo_venta === 'llevar'" class="badge badge-sm bg-dark">LLEVAR</span>
                            <span v-else class="badge badge-sm bg-secondary">LOCAL</span>
                        </td>

                        <td class="align-middle text-center text-sm">
                            <span :class="['badge badge-sm', getBadgeColor(pedido.estado)]">
                                {{ getEstadoTexto(pedido) }}
                            </span>
                        </td>

                        <td class="align-middle text-end pe-4">
                            
                            <button class="btn btn-sm btn-icon btn-light me-2 shadow-sm" @click="prepararImpresion(pedido)" title="Imprimir Comanda">
                                <font-awesome-icon icon="print" />
                            </button>

                            <div v-if="pedido.estado === 'pendiente'" class="d-inline-block">
                                <button v-if="pedido.tipo_venta === 'delivery'" 
                                        class="btn btn-sm btn-outline-info mb-0 fw-bold"
                                        @click="cambiarEstado(pedido.id_pedido, 'en_camino')">
                                    🛵 Al Motorizado
                                </button>
                                <button v-else-if="pedido.tipo_venta === 'mesa'" 
                                        class="btn btn-sm btn-outline-warning mb-0 fw-bold text-dark"
                                        @click="cambiarEstado(pedido.id_pedido, 'en_camino')">
                                    🍽️ Servir Mesa
                                </button>
                                <button v-else 
                                        class="btn btn-sm btn-success mb-0 fw-bold"
                                        @click="cambiarEstado(pedido.id_pedido, 'entregado_pagado')">
                                    ✅ Entregar
                                </button>
                            </div>

                            <div v-if="pedido.estado === 'en_camino'" class="d-inline-block">
                                <button class="btn btn-sm btn-success mb-0 fw-bold"
                                        @click="cambiarEstado(pedido.id_pedido, 'entregado_pagado')">
                                    💰 Cobrar
                                </button>
                            </div>

                            <span v-if="pedido.estado === 'entregado_pagado'" class="text-success text-xs fw-bold">
                                <font-awesome-icon icon="check-circle" /> Cerrado
                            </span>

                        </td>
                    </tr>
                </tbody>
            </table>
            
            <div v-if="pedidosFiltrados.length === 0" class="text-center py-5">
                <p class="text-muted">No hay pedidos en esta sección.</p>
            </div>
        </div>
    </div>

    <div id="ticket-print" class="d-none">
        <div style="font-family: 'Courier New', monospace; font-size: 12px; width: 100%;">
            <div class="text-center mb-2">
                <h3 style="margin:0; font-weight:bold;">POLLERIA EL SABROSÓN</h3>
                <p style="margin:0;">REIMPRESIÓN / COCINA</p>
            </div>
            <p style="border-top: 1px dashed #000; margin: 5px 0;"></p>
            <div style="display: flex; justify-content: space-between;">
                <span><strong>#{{ ticketData.id }}</strong></span>
                <span>{{ ticketData.fecha }}</span>
            </div>
            <div><strong>Cliente:</strong> {{ ticketData.cliente }}</div>
            <div><strong>Tipo:</strong> {{ ticketData.tipo }}</div>
            <p style="border-top: 1px dashed #000; margin: 5px 0;"></p>
            <div class="text-center py-2 fw-bold" style="font-size:14px">
                 TOTAL: S/ {{ ticketData.total }}
            </div>
        </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const API_URL = 'http://localhost:3000/api/pedidos';
const pedidos = ref([]);
const filtro = ref('activos'); 
const loading = ref(false);
let intervalId = null;

const ticketData = ref({ id: '', cliente: '', direccion: '', total: '', tipo: '', fecha: '', detalles: [] });

const cargarPedidos = async () => {
    loading.value = true;
    try {
        const res = await axios.get(API_URL);
        pedidos.value = res.data;
    } catch (e) { console.error("Error cargando pedidos:", e); } 
    finally { loading.value = false; }
};

const cambiarEstado = async (id, nuevoEstado) => {
    if(!confirm(`¿Avanzar estado del pedido #${id}?`)) return;
    try {
        await axios.put(`${API_URL}/${id}`, { estado: nuevoEstado });
        const p = pedidos.value.find(x => x.id_pedido === id);
        if(p) p.estado = nuevoEstado;
    } catch (e) { console.error(e); }
};

const prepararImpresion = (pedido) => {
    ticketData.value = {
        id: pedido.id_pedido,
        cliente: pedido.nombre_cliente || 'Mostrador',
        direccion: pedido.direccion || '',
        total: parseFloat(pedido.total_final).toFixed(2),
        tipo: pedido.tipo_venta.toUpperCase(),
        fecha: new Date(pedido.fecha_hora).toLocaleTimeString(),
        detalles: []
    };
    nextTick(() => setTimeout(() => window.print(), 300));
};

// COMPUTED: Lógica de Filtros
const pedidosFiltrados = computed(() => {
    // 1. Visión General: Todo lo vivo
    if (filtro.value === 'activos') {
        return pedidos.value.filter(p => p.estado !== 'entregado_pagado' && p.estado !== 'cancelado');
    }
    // 2. Historial Hoy
    if (filtro.value === 'entregado_pagado') {
        const inicioDia = new Date(); inicioDia.setHours(0, 0, 0, 0);
        return pedidos.value.filter(p => {
            const fechaP = new Date(p.fecha_hora);
            return p.estado === 'entregado_pagado' && fechaP >= inicioDia;
        });
    }
    // 3. Estados específicos
    return pedidos.value.filter(p => p.estado === filtro.value);
});

const conteo = computed(() => {
    const inicioDia = new Date(); inicioDia.setHours(0, 0, 0, 0);
    return {
        activos: pedidos.value.filter(p => p.estado !== 'entregado_pagado' && p.estado !== 'cancelado').length,
        pendiente: pedidos.value.filter(p => p.estado === 'pendiente').length,
        en_camino: pedidos.value.filter(p => p.estado === 'en_camino').length,
        entregado_pagado: pedidos.value.filter(p => {
            const fechaP = new Date(p.fecha_hora);
            return p.estado === 'entregado_pagado' && fechaP >= inicioDia;
        }).length
    };
});

const getBadgeColor = (estado) => {
    switch (estado) {
        case 'pendiente': return 'bg-gradient-danger';
        case 'en_camino': return 'bg-gradient-warning text-dark';
        case 'entregado_pagado': return 'bg-gradient-success';
        default: return 'bg-gradient-secondary';
    }
};

const getEstadoTexto = (pedido) => {
    if(pedido.estado === 'pendiente') return 'EN COCINA';
    if(pedido.estado === 'en_camino') {
        if(pedido.tipo_venta === 'mesa') return 'COMIENDO';
        if(pedido.tipo_venta === 'delivery') return 'EN RUTA';
        return 'POR COBRAR';
    }
    if(pedido.estado === 'entregado_pagado') return 'FINALIZADO';
    return pedido.estado;
}

const formatearHora = (fechaIso) => {
    if (!fechaIso) return '';
    const d = new Date(fechaIso);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

onMounted(() => {
    cargarPedidos();
    intervalId = setInterval(cargarPedidos, 10000); 
});

onUnmounted(() => { if (intervalId) clearInterval(intervalId); });
</script>

<style scoped>
.bg-gradient-danger { background: linear-gradient(87deg, #f5365c 0, #f56036 100%) !important; color: white; }
.bg-gradient-warning { background: linear-gradient(87deg, #fb6340 0, #fbb140 100%) !important; color: white; }
.bg-gradient-success { background: linear-gradient(87deg, #2dce89 0, #2dcecc 100%) !important; color: white; }
.bg-gradient-info { background: linear-gradient(87deg, #11cdef 0, #1171ef 100%) !important; color: white; }
.bg-gradient-secondary { background: #e9ecef; color: #525f7f; }
.nav-pills .nav-link { border-radius: 0.5rem; transition: all 0.2s; color: #67748e; }
.nav-pills .nav-link:hover { background-color: #f6f9fc; }
</style>