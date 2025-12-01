<template>
  <div class="container-fluid py-4 h-100 d-flex flex-column fade-in-up">
    
    <div class="row flex-grow-1 h-100">
      
      <div class="col-lg-8 d-flex flex-column h-100">
        <div class="card mb-3 shadow-sm border-0">
          <div class="card-body p-3 d-flex align-items-center justify-content-between">
            <div class="d-flex gap-2 overflow-auto">
               <button 
                  v-for="cat in categorias" 
                  :key="cat"
                  @click="filtroCategoria = cat"
                  :class="['btn btn-sm', filtroCategoria === cat ? 'btn-primary' : 'btn-light']"
               >
                 {{ cat }}
               </button>
            </div>
            <div class="ms-3">
               <input type="text" class="form-control form-control-sm" placeholder="Buscar producto..." v-model="busqueda">
            </div>
          </div>
        </div>

        <div class="row g-3 overflow-auto custom-scroll" style="max-height: calc(100vh - 180px);">
           <div class="col-md-4 col-sm-6" v-for="prod in productosFiltrados" :key="prod.id_producto">
              <div class="card h-100 shadow-sm border-0 product-card" @click="agregarAlCarrito(prod)">
                 <div class="card-body text-center p-3">
                    <img :src="getImgPath(prod.imagen_path)" class="img-fluid rounded mb-3" style="height: 120px; object-fit: cover;">
                    <h6 class="fw-bold text-dark mb-1">{{ prod.nombre }}</h6>
                    <span class="badge bg-light-primary text-primary fs-6">S/ {{ parseFloat(prod.precio).toFixed(2) }}</span>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <div class="col-lg-4 h-100">
         <div class="card h-100 shadow border-0 d-flex flex-column">
            <div class="card-header bg-white border-bottom py-3">
               <h5 class="fw-bold mb-0"><font-awesome-icon icon="shopping-cart" /> Nueva Orden</h5>
            </div>
            
            <div class="card-body flex-grow-1 d-flex flex-column p-0">
               
               <div class="p-3 bg-light border-bottom">
                  <div class="btn-group w-100" role="group">
                     <input type="radio" class="btn-check" name="tipoVenta" id="local" value="local" v-model="tipoVenta">
                     <label class="btn btn-outline-primary" for="local">🏢 Local</label>

                     <input type="radio" class="btn-check" name="tipoVenta" id="delivery" value="delivery" v-model="tipoVenta">
                     <label class="btn btn-outline-primary" for="delivery">🛵 Delivery</label>
                  </div>

                  <div v-if="tipoVenta === 'delivery'" class="mt-3 animate__animated animate__fadeIn">
                     <input type="text" class="form-control form-control-sm mb-2" placeholder="Teléfono" v-model="clienteDelivery.telefono">
                     <input type="text" class="form-control form-control-sm mb-2" placeholder="Nombre Cliente" v-model="clienteDelivery.nombre">
                     <input type="text" class="form-control form-control-sm" placeholder="Dirección Exacta" v-model="clienteDelivery.direccion">
                  </div>
               </div>

               <div class="flex-grow-1 overflow-auto p-3 custom-scroll">
                  <div v-if="carrito.length === 0" class="text-center text-muted mt-5">
                     <font-awesome-icon icon="basket-shopping" size="3x" class="mb-3 opacity-25" />
                     <p>Carrito vacío</p>
                  </div>

                  <div v-else v-for="(item, index) in carrito" :key="index" class="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
                     <div class="d-flex align-items-center">
                        <div class="me-2">
                           <h6 class="mb-0 text-sm fw-bold">{{ item.nombre }}</h6>
                           <small class="text-muted">S/ {{ item.precio }} x {{ item.cantidad }}</small>
                        </div>
                     </div>
                     <div class="d-flex align-items-center">
                        <span class="fw-bold me-3 text-primary">S/ {{ (item.precio * item.cantidad).toFixed(2) }}</span>
                        <button class="btn btn-icon btn-sm btn-light-danger" @click="eliminarDelCarrito(index)">x</button>
                     </div>
                  </div>
               </div>

               <div class="p-4 bg-light border-top">
                  <div class="d-flex justify-content-between mb-2 text-muted">
                     <span>Subtotal:</span>
                     <span>S/ {{ totalNeto.toFixed(2) }}</span>
                  </div>
                  <div v-if="tipoVenta === 'delivery'" class="d-flex justify-content-between mb-2 text-muted">
                     <span>Delivery:</span>
                     <span>S/ {{ costoDelivery.toFixed(2) }}</span>
                  </div>
                  <div class="d-flex justify-content-between mb-4">
                     <span class="fs-4 fw-bold text-dark">Total:</span>
                     <span class="fs-4 fw-bold text-primary">S/ {{ totalFinal.toFixed(2) }}</span>
                  </div>

                  <button class="btn btn-primary w-100 py-3 fw-bold shadow-sm" @click="procesarPedido" :disabled="carrito.length === 0">
                     CONFIRMAR PEDIDO (S/ {{ totalFinal.toFixed(2) }})
                  </button>
               </div>

            </div>
         </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

// Estado
const productos = ref([]);
const carrito = ref([]);
const categorias = ref(['Todas', 'Pollo', 'Combo', 'Bebida', 'Extra']);
const filtroCategoria = ref('Todas');
const busqueda = ref('');

// Datos Venta
const tipoVenta = ref('local'); // 'local' o 'delivery'
const clienteDelivery = ref({ nombre: '', telefono: '', direccion: '', referencia: '' });
const costoDelivery = ref(5.00); // Costo fijo ejemplo

// Cargar Productos
const cargarProductos = async () => {
   try {
      const res = await axios.get('http://localhost:3000/api/productos');
      productos.value = res.data;
   } catch (e) { console.error(e); }
};

// Computed: Filtrado
const productosFiltrados = computed(() => {
   return productos.value.filter(p => {
      const matchCat = filtroCategoria.value === 'Todas' || p.categoria === filtroCategoria.value;
      const matchSearch = p.nombre.toLowerCase().includes(busqueda.value.toLowerCase());
      return matchCat && matchSearch;
   });
});

// Computed: Totales
const totalNeto = computed(() => carrito.value.reduce((acc, item) => acc + (item.precio * item.cantidad), 0));
const totalFinal = computed(() => {
   return tipoVenta.value === 'delivery' ? totalNeto.value + costoDelivery.value : totalNeto.value;
});

// Acciones Carrito
const agregarAlCarrito = (prod) => {
   const existente = carrito.value.find(item => item.id_producto === prod.id_producto);
   if (existente) {
      existente.cantidad++;
      existente.subtotal = existente.cantidad * existente.precio;
   } else {
      carrito.value.push({
         id_producto: prod.id_producto,
         nombre: prod.nombre,
         precio: parseFloat(prod.precio),
         cantidad: 1,
         subtotal: parseFloat(prod.precio)
      });
   }
};

const eliminarDelCarrito = (index) => {
   carrito.value.splice(index, 1);
};

// Procesar Pedido (Enviar al Backend)
const procesarPedido = async () => {
   if (tipoVenta.value === 'delivery' && (!clienteDelivery.value.telefono || !clienteDelivery.value.direccion)) {
      alert('Por favor complete los datos de delivery');
      return;
   }

   const payload = {
      id_cliente: null, // Opcional si es local anonimo
      tipo_venta: tipoVenta.value,
      total_neto: totalNeto.value,
      costo_delivery: tipoVenta.value === 'delivery' ? costoDelivery.value : 0,
      total_final: totalFinal.value,
      metodo_pago: 'efectivo', // Podrías agregar un selector de pago
      id_vendedor: 1, // ID hardcodeado por ahora (luego vendrá del login)
      productos: carrito.value,
      datos_cliente_delivery: tipoVenta.value === 'delivery' ? clienteDelivery.value : null
   };

   try {
      await axios.post('http://localhost:3000/api/pedidos', payload);
      alert('✅ Pedido Registrado Correctamente');
      // Limpiar
      carrito.value = [];
      clienteDelivery.value = { nombre: '', telefono: '', direccion: '', referencia: '' };
      tipoVenta.value = 'local';
   } catch (error) {
      console.error(error);
      alert('❌ Error al procesar pedido');
   }
};

const getImgPath = (path) => path ? `/img/${path}` : '/img/default.jpg';

onMounted(() => cargarProductos());
</script>

<style scoped>
.product-card {
   cursor: pointer;
   transition: transform 0.2s, border-color 0.2s;
}
.product-card:hover {
   transform: translateY(-5px);
   border: 1px solid var(--primary) !important;
}
.custom-scroll::-webkit-scrollbar {
   width: 6px;
}
.custom-scroll::-webkit-scrollbar-thumb {
   background-color: #e9ecef;
   border-radius: 4px;
}
</style>