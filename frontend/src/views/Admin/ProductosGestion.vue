<template>
  <div class="container-fluid py-4 fade-in-up">
    
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h3 class="fw-bold text-dark mb-0">Gestión de Productos</h3>
        <span class="text-muted text-sm">Administra tu menú e inventario</span>
      </div>
      <button @click="abrirModalCrear" class="btn btn-primary shadow-sm">
        <font-awesome-icon icon="box-open" class="me-2" /> Nuevo Producto
      </button>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="card-body px-0 pt-0 pb-2">
        <div class="table-responsive p-4">
          
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="text-muted mt-2">Cargando productos...</p>
          </div>

          <div v-else-if="productos.length === 0" class="text-center py-5">
            <h5 class="text-muted">No hay productos registrados.</h5>
            <button @click="abrirModalCrear" class="btn btn-sm btn-outline-primary mt-2">Crear el primero</button>
          </div>

          <table v-else class="table align-items-center mb-0">
            <thead>
              <tr>
                <th class="ps-2 text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Producto</th>
                <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Categoría</th>
                <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Precio</th>
                <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Estado / Stock</th>
                <th class="text-secondary opacity-7"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="producto in productos" :key="producto.id_producto">
                <td>
                  <div class="d-flex px-2 py-1">
                    <div>
                        <img 
                            :src="getImgPath(producto.imagen_path)" 
                            class="avatar avatar-sm me-3 rounded-3 shadow-sm" 
                            style="width: 45px; height: 45px; object-fit: cover;"
                            alt="prod"
                        >
                    </div>
                    <div class="d-flex flex-column justify-content-center">
                      <h6 class="mb-0 text-sm fw-bold text-dark">{{ producto.nombre }}</h6>
                      <p class="text-xs text-muted mb-0">{{ producto.descripcion ? producto.descripcion.substring(0, 35) + '...' : 'Sin descripción' }}</p>
                    </div>
                  </div>
                </td>
                
                <td class="align-middle text-center text-sm">
                  <span class="badge bg-light-primary">{{ producto.categoria }}</span>
                </td>
                
                <td class="align-middle text-center">
                  <span class="text-dark text-sm fw-bold">S/ {{ parseFloat(producto.precio).toFixed(2) }}</span>
                </td>
                
                <td class="align-middle text-center">
                    <span v-if="producto.stock === null || producto.stock > 10" class="badge bg-light-success">Disponible</span>
                    <span v-else-if="producto.stock > 0" class="badge bg-light-warning">Poco Stock ({{ producto.stock }})</span>
                    <span v-else class="badge bg-light-danger">Agotado</span>
                </td>

                <td class="align-middle text-end">
                  <button class="btn btn-icon btn-sm btn-light me-2" @click="editarProducto(producto)" title="Editar">
                    ✏️
                  </button>
                  <button class="btn btn-icon btn-sm btn-light-danger text-danger" @click="eliminarProducto(producto.id_producto)" title="Eliminar">
                    🗑️
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-if="mostrarModal" class="modal fade show d-block" style="background: rgba(0,0,0,0.5); backdrop-filter: blur(2px);">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content border-0 shadow-lg">
                <div class="modal-header">
                    <h5 class="modal-title fw-bold">{{ productoForm.id_producto ? 'Editar Producto' : 'Nuevo Producto' }}</h5>
                    <button type="button" class="btn-close" @click="cerrarModal"></button>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="guardarProducto">
                        <div class="mb-3">
                            <label class="form-label fw-bold small text-muted">Nombre del Producto</label>
                            <input type="text" class="form-control" v-model="productoForm.nombre" placeholder="Ej: Pollo a la Brasa" required>
                        </div>
                        
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label fw-bold small text-muted">Precio (S/)</label>
                                <input type="number" step="0.01" class="form-control" v-model="productoForm.precio" required>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label fw-bold small text-muted">Categoría</label>
                                <select class="form-select" v-model="productoForm.categoria" required>
                                    <option value="Pollo">Pollo</option>
                                    <option value="Combo">Combo</option>
                                    <option value="Bebida">Bebida</option>
                                    <option value="Extra">Extra</option>
                                </select>
                            </div>
                        </div>

                        <div class="mb-3">
                             <label class="form-label fw-bold small text-muted">Descripción</label>
                             <textarea class="form-control" rows="2" v-model="productoForm.descripcion"></textarea>
                        </div>

                        <div class="row">
                             <div class="col-md-8 mb-3">
                                <label class="form-label fw-bold small text-muted">Nombre de Imagen (en public/img)</label>
                                <input type="text" class="form-control" v-model="productoForm.imagen_path" placeholder="ej: pollo.jpg">
                             </div>
                             <div class="col-md-4 mb-3">
                                <label class="form-label fw-bold small text-muted">Stock</label>
                                <input type="number" class="form-control" v-model="productoForm.stock" placeholder="Opcional">
                             </div>
                        </div>
                        
                        <div class="modal-footer border-0 px-0 pb-0">
                            <button type="button" class="btn btn-light text-muted" @click="cerrarModal">Cancelar</button>
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
import { ref, onMounted } from 'vue';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/productos'; 
const productos = ref([]);
const loading = ref(true); // Estado de carga
const mostrarModal = ref(false);
const productoForm = ref({
  id_producto: null,
  nombre: '',
  descripcion: '',
  precio: '',
  categoria: 'Pollo',
  imagen_path: '', 
  stock: null
});

// Obtener Productos
const cargarProductos = async () => {
  loading.value = true;
  try {
    const response = await axios.get(API_URL);
    productos.value = response.data;
  } catch (error) {
    console.error('Error cargando productos:', error);
    // Opcional: Mostrar alerta de error de conexión
  } finally {
    loading.value = false;
  }
};

const guardarProducto = async () => {
    try {
        if (productoForm.value.id_producto) {
            await axios.put(`${API_URL}/${productoForm.value.id_producto}`, productoForm.value);
        } else {
            await axios.post(API_URL, productoForm.value);
        }
        cerrarModal();
        cargarProductos();
    } catch (error) {
        console.error('Error guardando:', error);
        alert('Error al guardar. Verifica que el servidor Backend esté corriendo.');
    }
}

const eliminarProducto = async (id) => {
    if (confirm('¿Desactivar este producto?')) {
        try {
            await axios.delete(`${API_URL}/${id}`);
            cargarProductos();
        } catch (error) {
            console.error(error);
        }
    }
}

const abrirModalCrear = () => {
    productoForm.value = { id_producto: null, nombre: '', descripcion: '', precio: '', categoria: 'Pollo', imagen_path: '', stock: null };
    mostrarModal.value = true;
};

const editarProducto = (producto) => {
    productoForm.value = { ...producto }; 
    mostrarModal.value = true;
};

const cerrarModal = () => { mostrarModal.value = false; };

const getImgPath = (path) => {
    if (!path) return '/img/default.jpg'; // Asegúrate de tener una imagen default.jpg
    return `/img/${path}`; 
}

onMounted(() => {
  cargarProductos();
});
</script>

<style scoped>
/* Estilos específicos para este componente si se requiere extra */
.avatar {
    transition: transform 0.2s;
}
.avatar:hover {
    transform: scale(1.1);
}
.btn-light-danger {
    background-color: #FFF5F8;
    border: none;
}
.btn-light-danger:hover {
    background-color: #F1416C;
    color: white !important;
}
</style>