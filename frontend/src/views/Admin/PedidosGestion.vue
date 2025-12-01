<template>
  <div class="container-fluid py-4 fade-in-up">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3 class="fw-bold text-dark">Monitor de Pedidos 📋</h3>
      <button @click="cargarPedidos" class="btn btn-outline-primary btn-sm">
        <font-awesome-icon icon="rotate" /> Actualizar
      </button>
    </div>

    <ul class="nav nav-pills mb-3">
      <li class="nav-item">
        <a class="nav-link" :class="{ active: filtroEstado === 'todos' }" href="#" @click.prevent="filtroEstado = 'todos'">Todos</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" :class="{ active: filtroEstado === 'pendiente' }" href="#" @click.prevent="filtroEstado = 'pendiente'">Pendientes (Cocina)</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" :class="{ active: filtroEstado === 'en_camino' }" href="#" @click.prevent="filtroEstado = 'en_camino'">En Ruta 🛵</a>
      </li>
    </ul>

    <div class="card border-0 shadow-sm">
      <div class="card-body px-0 pt-0 pb-2">
        <div class="table-responsive p-0">
          <table class="table align-items-center mb-0">
            <thead>
              <tr>
                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-3">ID / Hora</th>
                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Cliente</th>
                <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Tipo</th>
                <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Total</th>
                <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Estado</th>
                <th class="text-secondary opacity-7"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="pedido in pedidosFiltrados" :key="pedido.id_pedido">
                <td class="ps-3">
                  <div class="d-flex flex-column">
                    <span class="text-dark fw-bold">#{{ pedido.id_pedido }}</span>
                    <span class="text-xs text-muted">{{ new Date(pedido.fecha_hora).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }}</span>
                  </div>
                </td>
                
                <td>
                  <h6 class="mb-0 text-sm">{{ pedido.nombre_cliente || 'Cliente Mostrador' }}</h6>
                  <p class="text-xs text-secondary mb-0" v-if="pedido.tipo_venta === 'delivery'">
                    {{ pedido.direccion }}
                  </p>
                </td>

                <td class="align-middle text-center">
                    <span v-if="pedido.tipo_venta === 'delivery'" class="badge bg-light-warning text-warning">🛵 Delivery</span>
                    <span v-else class="badge bg-light-info text-info">🏢 Local</span>
                </td>

                <td class="align-middle text-center">
                  <span class="text-dark fw-bold text-sm">S/ {{ parseFloat(pedido.total_final).toFixed(2) }}</span>
                </td>

                <td class="align-middle text-center">
                  <span :class="['badge', getBadgeClass(pedido.estado)]">
                    {{ pedido.estado.replace('_', ' ').toUpperCase() }}
                  </span>
                </td>

                <td class="align-middle text-end pe-4">
                    <button v-if="pedido.estado === 'pendiente'" 
                            class="btn btn-sm btn-primary mb-0"
                            @click="cambiarEstado(pedido.id_pedido, 'en_camino')">
                        Despachar 🚀
                    </button>
                    
                    <button v-if="pedido.estado === 'en_camino'" 
                            class="btn btn-sm btn-success mb-0"
                            @click="cambiarEstado(pedido.id_pedido, 'entregado_pagado')">
                        Finalizar ✅
                    </button>
                </td>
              </tr>
            </tbody>
          </table>
          
          <div v-if="pedidos.length === 0" class="text-center py-5">
              <p class="text-muted">No hay pedidos registrados hoy.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const pedidos = ref([]);
const filtroEstado = ref('todos');

// Cargar Pedidos desde Backend
const cargarPedidos = async () => {
    try {
        const res = await axios.get('http://localhost:3000/api/pedidos');
        pedidos.value = res.data;
    } catch (e) {
        console.error(e);
    }
};

// Computed para filtrar
const pedidosFiltrados = computed(() => {
    if (filtroEstado.value === 'todos') return pedidos.value;
    return pedidos.value.filter(p => p.estado === filtroEstado.value);
});

// Cambiar Estado (Lógica simple, faltaría endpoint específico si quieres ser muy puro)
// IMPORTANTE: Necesitas agregar la lógica en el Backend para UPDATE pedidos.
// Por ahora simularemos en frontend o asumimos que tienes un endpoint genérico.
const cambiarEstado = async (id, nuevoEstado) => {
    try {
        // AQUÍ NECESITAMOS CREAR ESTE ENDPOINT RÁPIDO EN EL BACKEND
        // await axios.put(`http://localhost:3000/api/pedidos/${id}`, { estado: nuevoEstado });
        alert(`Pedido #${id} cambiado a: ${nuevoEstado}`);
        
        // Simulación visual rápida
        const p = pedidos.value.find(x => x.id_pedido === id);
        if(p) p.estado = nuevoEstado;
        
    } catch (e) {
        console.error(e);
    }
};

const getBadgeClass = (estado) => {
    const map = {
        'pendiente': 'bg-light-danger text-danger',
        'en_cocina': 'bg-light-warning text-warning',
        'en_camino': 'bg-light-primary text-primary',
        'entregado_pagado': 'bg-light-success text-success'
    };
    return map[estado] || 'bg-light-secondary';
};

onMounted(() => {
    cargarPedidos();
    // Auto-refresh cada 30 segundos
    setInterval(cargarPedidos, 30000);
});
</script>