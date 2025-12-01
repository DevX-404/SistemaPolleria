<template>
  <div class="dashboard-admin">
    <h2 class="mb-4">Dashboard Principal</h2>
    <div class="row">
      <div class="col-xl-3 col-sm-6 mb-xl-0 mb-4">
        <div class="card bg-primary text-white p-3 shadow-sm">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <p class="text-sm mb-0 text-uppercase font-weight-bold">Ventas Hoy</p>
                <h5 class="font-weight-bolder">S/ 1,500.00</h5>
                <p class="mb-0">
                  <span class="text-success text-sm font-weight-bolder">+55%</span> desde ayer
                </p>
              </div>
              <font-awesome-icon icon="chart-bar" size="2x" />
            </div>
          </div>
        </div>
      </div>
      </div>
    <div class="card mt-4 p-4 shadow-sm">
      <h3>Gráficas y Estadísticas</h3>
      <p>Aquí se mostrarán gráficas impresionantes.</p>
      </div>
  </div>
</template>

<script setup>
// Lógica para cargar datos del dashboard
</script>

<style scoped>
.card {
  border-radius: 0.5rem;
  overflow: hidden;
}
.card.bg-primary {
  background-image: linear-gradient(195deg, #42424a 0%, #191919 100%);
}
/* Agrega más estilos de cards para replicar el diseño de Metronic */
</style>