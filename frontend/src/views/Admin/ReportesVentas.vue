<template>
  <div class="container-fluid py-4 fade-in-up">
    
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h3 class="fw-bold text-dark mb-0">Reportes de Venta 📈</h3>
        <p class="text-muted small mb-0">Consulta el historial de ingresos</p>
      </div>
      <button class="btn btn-dark btn-sm shadow-sm" @click="exportarReporte">
        <font-awesome-icon icon="clipboard-list" class="me-2" /> Exportar Datos
      </button>
    </div>

    <div class="card border-0 shadow-sm mb-4">
      <div class="card-body p-4">
        <div class="row g-3 align-items-end">
          <div class="col-md-4">
            <label class="form-label small fw-bold text-uppercase text-muted">Fecha Inicio</label>
            <input type="date" class="form-control" v-model="filtros.inicio">
          </div>
          <div class="col-md-4">
            <label class="form-label small fw-bold text-uppercase text-muted">Fecha Fin</label>
            <input type="date" class="form-control" v-model="filtros.fin">
          </div>
          <div class="col-md-4">
             <button class="btn btn-primary w-100 fw-bold" @click="cargarVentas">
               <font-awesome-icon icon="search" class="me-2" /> Filtrar Reporte
             </button>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-3 mb-4">
      <div class="col-md-4">
        <div class="card border-0 shadow-sm h-100 bg-gradient-primary text-white">
          <div class="card-body text-center p-4">
            <div class="mb-2 opacity-75">
                <font-awesome-icon icon="money-bill-wave" size="2x" />
            </div>
            <h6 class="text-uppercase small fw-bold opacity-75">Venta Total</h6>
            <h2 class="fw-bold mb-0">S/ {{ reporte.total.toFixed(2) }}</h2>
          </div>
        </div>
      </div>
      
      <div class="col-md-4">
        <div class="card border-0 shadow-sm h-100 bg-white">
          <div class="card-body text-center p-4">
            <div class="mb-2 text-primary">
                <font-awesome-icon icon="clipboard-list" size="2x" />
            </div>
            <h6 class="text-uppercase small fw-bold text-muted">Pedidos Cerrados</h6>
            <h2 class="fw-bold text-dark mb-0">{{ reporte.cantidad }}</h2>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card border-0 shadow-sm h-100 bg-white">
          <div class="card-body text-center p-4">
            <div class="mb-2 text-success">
                <font-awesome-icon icon="chart-bar" size="2x" />
            </div>
            <h6 class="text-uppercase small fw-bold text-muted">Ticket Promedio</h6>
            <h2 class="fw-bold text-success mb-0">S/ {{ reporte.promedio.toFixed(2) }}</h2>
          </div>
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm">
       <div class="card-header bg-white border-0 py-3">
          <h6 class="fw-bold mb-0 text-dark">Detalle de Transacciones</h6>
       </div>
       <div class="table-responsive">
          <table class="table align-items-center mb-0">
             <thead class="bg-light">
                <tr>
                   <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-4">Fecha</th>
                   <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Cliente</th>
                   <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Tipo</th>
                   <th class="text-end text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 pe-4">Monto</th>
                </tr>
             </thead>
             <tbody>
                <tr v-for="venta in ventasFiltradas" :key="venta.id_pedido">
                   <td class="ps-4">
                      <div class="d-flex flex-column">
                        <span class="text-sm fw-bold text-dark">{{ new Date(venta.fecha_hora).toLocaleDateString() }}</span>
                        <span class="text-xs text-muted">{{ new Date(venta.fecha_hora).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }}</span>
                      </div>
                   </td>
                   <td>
                      <h6 class="mb-0 text-sm text-dark">{{ venta.nombre_cliente || 'Cliente Mostrador' }}</h6>
                      <span class="text-xs text-secondary">Ticket #{{ venta.id_pedido }}</span>
                   </td>
                   <td class="text-center align-middle">
                      <span v-if="venta.tipo_venta === 'delivery'" class="badge bg-light-warning text-warning border-warning border">
                         DELIVERY
                      </span>
                      <span v-else class="badge bg-light-info text-info border-info border">
                         LOCAL
                      </span>
                   </td>
                   <td class="text-end pe-4 align-middle">
                      <span class="fw-bold text-dark">S/ {{ parseFloat(venta.total_final).toFixed(2) }}</span>
                   </td>
                </tr>
                
                <tr v-if="ventasFiltradas.length === 0">
                   <td colspan="4" class="text-center py-5">
                      <p class="text-muted mb-0">No hay ventas registradas en este rango de fechas.</p>
                   </td>
                </tr>
             </tbody>
          </table>
       </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const ventas = ref([]);
const hoy = new Date().toISOString().split('T')[0];
const filtros = ref({
  inicio: hoy,
  fin: hoy
});

// Cargar datos del Backend
const cargarVentas = async () => {
    try {
        const res = await axios.get('http://localhost:3000/api/pedidos/reporte');
        ventas.value = res.data;
        
    } catch (e) { 
        console.error("Error cargando reportes:", e); 
    }
};

// Lógica de Filtrado por Fecha
const ventasFiltradas = computed(() => {
    if (!filtros.value.inicio || !filtros.value.fin) return [];

    const start = new Date(filtros.value.inicio + 'T00:00:00').getTime();
    const end = new Date(filtros.value.fin + 'T23:59:59').getTime();

    return ventas.value.filter(v => {
        const fechaVenta = new Date(v.fecha_hora).getTime();
        return fechaVenta >= start && fechaVenta <= end;
    });
});

// Cálculos Automáticos 
const reporte = computed(() => {
    const lista = ventasFiltradas.value;
    const total = lista.reduce((acc, v) => acc + parseFloat(v.total_final), 0);
    return {
        total,
        cantidad: lista.length,
        promedio: lista.length > 0 ? total / lista.length : 0
    };
});

const exportarReporte = () => {
    alert("Aquí podrías integrar una librería como 'xlsx' para descargar un Excel real.");
};

onMounted(() => cargarVentas());
</script>

<style scoped>
.bg-gradient-primary {
    background: linear-gradient(310deg, #3E97FF 0%, #B1D4FF 100%);
}
</style>