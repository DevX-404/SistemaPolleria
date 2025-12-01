<template>
  <div class="container-fluid py-4 fade-in-up">
    
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3 class="fw-bold text-dark">Resumen del Día 📈</h3>
      <span class="text-muted small">{{ new Date().toLocaleDateString() }}</span>
    </div>

    <div class="row g-3 mb-4">
      
      <div class="col-xl-3 col-sm-6">
        <div class="card bg-gradient-dark text-white border-0 shadow h-100">
          <div class="card-body">
            <div class="row">
              <div class="col">
                <h5 class="text-uppercase text-muted mb-0 text-xs font-weight-bolder">Ventas Hoy</h5>
                <span class="h3 font-weight-bold mb-0 text-white">S/ {{ parseFloat(stats.ventas_hoy).toFixed(2) }}</span>
              </div>
              <div class="col-auto">
                <div class="icon icon-shape bg-white text-dark rounded-circle shadow text-center d-flex align-items-center justify-content-center" style="width: 48px; height: 48px;">
                  <font-awesome-icon icon="money-bill-wave" size="lg" />
                </div>
              </div>
            </div>
            <p class="mt-3 mb-0 text-sm">
              <span class="text-success font-weight-bolder">{{ stats.pedidos_hoy }}</span> pedidos cerrados
            </p>
          </div>
        </div>
      </div>

      <div class="col-xl-3 col-sm-6">
        <div class="card border-0 shadow h-100" :class="{'bg-danger text-white': stats.pendientes > 0}">
          <div class="card-body">
            <div class="row">
              <div class="col">
                <h5 class="text-uppercase mb-0 text-xs font-weight-bolder" :class="stats.pendientes > 0 ? 'text-white' : 'text-muted'">Por Atender</h5>
                <span class="h3 font-weight-bold mb-0">{{ stats.pendientes }}</span>
              </div>
              <div class="col-auto">
                <div class="icon icon-shape bg-gradient-danger text-white rounded-circle shadow text-center d-flex align-items-center justify-content-center" style="width: 48px; height: 48px;">
                  <font-awesome-icon icon="bell" size="lg" />
                </div>
              </div>
            </div>
             <p class="mt-3 mb-0 text-sm">
              Requieren atención inmediata
            </p>
          </div>
        </div>
      </div>

      <div class="col-xl-6 col-sm-12">
          <div class="card bg-primary border-0 shadow h-100 position-relative overflow-hidden">
              <div class="position-absolute top-0 end-0 p-3 opacity-25">
                  <font-awesome-icon icon="cash-register" size="6x" class="text-white" />
              </div>
              <div class="card-body d-flex flex-column justify-content-center">
                  <h4 class="text-white fw-bold">¿Cliente en Caja? 🛒</h4>
                  <p class="text-white opacity-75">Registra una nueva venta rápidamente.</p>
                  <div>
                      <router-link to="/admin/ventas" class="btn btn-white text-primary fw-bold px-4 rounded-pill shadow-sm">
                          Ir al Punto de Venta
                      </router-link>
                  </div>
              </div>
          </div>
      </div>
    </div>

    <div class="row">
        <div class="col-lg-7 mb-4">
            <div class="card border-0 shadow-sm">
                <div class="card-header bg-white border-0 pb-0">
                    <h6 class="fw-bold mb-0">🏆 Top Productos del Mes</h6>
                </div>
                <div class="card-body px-0 pt-0 pb-2">
                    <div class="table-responsive p-0">
                        <table class="table align-items-center mb-0">
                            <tbody>
                                <tr v-for="(prod, index) in stats.top_productos" :key="index">
                                    <td class="w-10 ps-4">
                                        <div class="d-flex align-items-center">
                                            <span class="text-xs font-weight-bold me-2 text-muted">#{{ index + 1 }}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <h6 class="mb-0 text-sm text-dark">{{ prod.nombre }}</h6>
                                    </td>
                                    <td class="align-middle text-sm">
                                        <div class="col text-center">
                                            <span class="text-xs font-weight-bold"> {{ prod.vendidos }} und. </span>
                                        </div>
                                    </td>
                                    <td class="align-middle">
                                        <div class="progress-wrapper w-75 mx-auto">
                                            <div class="progress-info">
                                                <div class="progress-percentage">
                                                    <span class="text-xs font-weight-bold">{{ prod.vendidos }}%</span>
                                                </div>
                                            </div>
                                            <div class="progress">
                                                <div class="progress-bar bg-gradient-info" role="progressbar" :style="`width: ${prod.vendidos * 2}%`"></div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr v-if="stats.top_productos.length === 0">
                                    <td colspan="4" class="text-center text-muted py-4">Aún no hay suficientes ventas este mes.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-lg-5">
            <div class="card border-0 shadow-sm">
                <div class="card-body">
                    <h6 class="fw-bold mb-3">Accesos Rápidos</h6>
                    <div class="list-group list-group-flush">
                        <router-link to="/admin/pedidos" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center px-0 border-0">
                            <div>
                                <font-awesome-icon icon="motorcycle" class="me-2 text-warning" />
                                Ver pedidos en ruta
                            </div>
                            <span class="badge bg-light text-dark rounded-pill">Ir</span>
                        </router-link>
                        <router-link to="/admin/clientes" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center px-0 border-0">
                            <div>
                                <font-awesome-icon icon="users" class="me-2 text-info" />
                                Directorio de clientes
                            </div>
                            <span class="badge bg-light text-dark rounded-pill">Ir</span>
                        </router-link>
                        <router-link to="/admin/productos" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center px-0 border-0">
                            <div>
                                <font-awesome-icon icon="utensils" class="me-2 text-danger" />
                                Ajustar precios / Menú
                            </div>
                            <span class="badge bg-light text-dark rounded-pill">Ir</span>
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const stats = ref({
    ventas_hoy: 0,   
    pedidos_hoy: 0,
    pendientes: 0,
    top_productos: []
});

const cargarStats = async () => {
    try {
        const res = await axios.get('http://localhost:3000/api/stats/dashboard');

        stats.value = {
            ventas_hoy: parseFloat(res.data.ventas_hoy) || 0,
            pedidos_hoy: parseInt(res.data.pedidos_hoy) || 0,
            pendientes: parseInt(res.data.pendientes) || 0,
            top_productos: res.data.top_productos || []
        };

    } catch (e) {
        console.error("Error cargando stats:", e);
    }
};

onMounted(() => {
    cargarStats();
    setInterval(cargarStats, 60000);
});
</script>

<style scoped>
.bg-gradient-dark {
    background: linear-gradient(310deg, #212229 0%, #212529 100%);
}
.bg-gradient-danger {
    background: linear-gradient(310deg, #ea0606 0%, #ff667c 100%);
}
.icon-shape {
    width: 48px;
    height: 48px;
    background-position: center;
    border-radius: 0.5rem;
}
</style>