<template>
  <div class="container-fluid py-4 fade-in-up">
    
    <div class="card border-0 shadow-sm mb-4">
      <div class="card-body p-3 d-flex justify-content-between align-items-center">
        <div>
            <h4 class="fw-bold text-dark mb-0">Directorio de Clientes 📒</h4>
            <span class="text-muted small">Gestiona tu base de datos de delivery</span>
        </div>
        <div class="w-50 position-relative">
            <input type="text" class="form-control ps-5" placeholder="Buscar por nombre o teléfono..." v-model="busqueda">
            <font-awesome-icon icon="search" class="position-absolute text-muted" style="left: 15px; top: 12px;" />
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="table-responsive">
        <table class="table align-items-center mb-0">
          <thead class="bg-light">
            <tr>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-4">Cliente</th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Contacto</th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Dirección</th>
              <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Pedidos</th>
              <th class="text-secondary opacity-7"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cliente in clientesFiltrados" :key="cliente.id_cliente">
              <td class="ps-4">
                <div class="d-flex px-2 py-1">
                  <div class="avatar avatar-sm me-3 bg-gradient-primary rounded-circle d-flex align-items-center justify-content-center text-white fw-bold">
                    {{ cliente.nombre.charAt(0).toUpperCase() }}
                  </div>
                  <div class="d-flex flex-column justify-content-center">
                    <h6 class="mb-0 text-sm">{{ cliente.nombre }}</h6>
                    <p class="text-xs text-secondary mb-0">ID: {{ cliente.id_cliente }}</p>
                  </div>
                </div>
              </td>
              
              <td>
                <p class="text-xs font-weight-bold mb-0">
                    <font-awesome-icon icon="phone" class="me-1 text-success" /> {{ cliente.telefono }}
                </p>
                <p class="text-xs text-secondary mb-0">Última compra: {{ formatearFecha(cliente.ultima_compra) }}</p>
              </td>

              <td>
                <span class="text-secondary text-xs font-weight-bold d-block text-truncate" style="max-width: 200px;">
                    {{ cliente.direccion }}
                </span>
                <span class="text-xs text-muted fst-italic" v-if="cliente.referencia">Ref: {{ cliente.referencia }}</span>
              </td>

              <td class="align-middle text-center">
                <span class="badge bg-light text-dark border">{{ cliente.total_pedidos }} Órdenes</span>
              </td>

              <td class="align-middle text-end pe-4">
                <button class="btn btn-link text-secondary mb-0" @click="editarCliente(cliente)">
                  <font-awesome-icon icon="edit" /> Editar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        
        <div v-if="clientesFiltrados.length === 0" class="text-center py-5">
            <p class="text-muted">No se encontraron clientes.</p>
        </div>
      </div>
    </div>

    <div v-if="mostrarModal" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content shadow">
                <div class="modal-header">
                    <h5 class="modal-title fw-bold">Editar Cliente</h5>
                    <button type="button" class="btn-close" @click="mostrarModal = false"></button>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="guardarCambios">
                        <div class="mb-3">
                            <label class="form-label small fw-bold">Nombre Completo</label>
                            <input type="text" class="form-control" v-model="formCliente.nombre" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label small fw-bold">Teléfono</label>
                            <input type="text" class="form-control" v-model="formCliente.telefono" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label small fw-bold">Dirección</label>
                            <input type="text" class="form-control" v-model="formCliente.direccion" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label small fw-bold">Referencia (Opcional)</label>
                            <textarea class="form-control" rows="2" v-model="formCliente.referencia"></textarea>
                        </div>
                        <div class="text-end">
                            <button type="button" class="btn btn-secondary me-2" @click="mostrarModal = false">Cancelar</button>
                            <button type="submit" class="btn btn-primary">Guardar Cambios</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
// Importamos iconos extra necesarios (asegúrate de agregarlos en main.js: faSearch, faEdit)
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const clientes = ref([]);
const busqueda = ref('');
const mostrarModal = ref(false);
const formCliente = ref({});

const cargarClientes = async () => {
    try {
        const res = await axios.get('http://localhost:3000/api/clientes');
        clientes.value = res.data;
    } catch (e) {
        console.error(e);
    }
};

const clientesFiltrados = computed(() => {
    if (!busqueda.value) return clientes.value;
    const term = busqueda.value.toLowerCase();
    return clientes.value.filter(c => 
        c.nombre.toLowerCase().includes(term) || 
        c.telefono.includes(term)
    );
});

const editarCliente = (cliente) => {
    formCliente.value = { ...cliente }; // Clonar datos
    mostrarModal.value = true;
};

const guardarCambios = async () => {
    try {
        await axios.put(`http://localhost:3000/api/clientes/${formCliente.value.id_cliente}`, formCliente.value);
        alert('Cliente actualizado');
        mostrarModal.value = false;
        cargarClientes(); // Recargar lista
    } catch (e) {
        alert('Error al actualizar');
    }
};

const formatearFecha = (fecha) => {
    if (!fecha) return 'Nunca';
    return new Date(fecha).toLocaleDateString();
};

onMounted(() => cargarClientes());
</script>

<style scoped>
.avatar {
    width: 40px; 
    height: 40px;
    font-size: 1.2rem;
}
.bg-gradient-primary {
    background: linear-gradient(135deg, #3E97FF 0%, #2884EF 100%);
}
</style>