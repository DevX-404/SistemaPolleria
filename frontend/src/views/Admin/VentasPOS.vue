<template>
   <div class="container-fluid py-4 h-100 d-flex flex-column fade-in-up">

      <div class="row flex-grow-1 h-100">

         <div class="col-lg-8 d-flex flex-column h-100">
            <div class="card mb-3 shadow-sm border-0">
               <div class="card-body p-3 d-flex align-items-center justify-content-between">
                  <div class="d-flex gap-2 overflow-auto">
                     <button v-for="cat in categorias" :key="cat" @click="filtroCategoria = cat"
                        :class="['btn btn-sm', filtroCategoria === cat ? 'btn-primary' : 'btn-light']">
                        {{ cat }}
                     </button>
                  </div>
                  <div class="ms-3">
                     <input type="text" class="form-control form-control-sm" placeholder="Buscar producto..."
                        v-model="busqueda">
                  </div>
               </div>
            </div>

            <div class="row g-3 overflow-auto custom-scroll" style="max-height: calc(100vh - 180px);">
               <div class="col-md-4 col-sm-6" v-for="prod in productosFiltrados" :key="prod.id_producto">
                  <div class="card h-100 shadow-sm border-0 product-card" @click="agregarAlCarrito(prod)">
                     <div class="card-body text-center p-3">
                        <img :src="getImgPath(prod.imagen_path)" class="img-fluid rounded mb-3"
                           style="height: 120px; object-fit: cover;">
                        <h6 class="fw-bold text-dark mb-1">{{ prod.nombre }}</h6>
                        <span class="badge bg-light-primary text-primary fs-6">S/ {{ parseFloat(prod.precio).toFixed(2)
                           }}</span>
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
                     <div class="d-flex flex-column gap-2">
                        <label class="small fw-bold text-muted">TIPO DE PEDIDO</label>
                        <div class="btn-group w-100" role="group">
                           <input type="radio" class="btn-check" name="tipoVenta" id="mesa" value="mesa"
                              v-model="formVenta.tipoVenta">
                           <label class="btn btn-outline-primary" for="mesa">🍽️ Mesa</label>

                           <input type="radio" class="btn-check" name="tipoVenta" id="llevar" value="llevar"
                              v-model="formVenta.tipoVenta">
                           <label class="btn btn-outline-primary" for="llevar">🛍️ Llevar</label>

                           <input type="radio" class="btn-check" name="tipoVenta" id="delivery" value="delivery"
                              v-model="formVenta.tipoVenta">
                           <label class="btn btn-outline-primary" for="delivery">🛵 Delivery</label>
                        </div>
                     </div>

                     <div v-if="formVenta.tipoVenta === 'delivery'" class="mt-3 animate__animated animate__fadeIn">
                        <input type="text" class="form-control form-control-sm mb-2" placeholder="Teléfono"
                           v-model="clienteDelivery.telefono">
                        <input type="text" class="form-control form-control-sm mb-2" placeholder="Nombre Cliente"
                           v-model="clienteDelivery.nombre">
                        <input type="text" class="form-control form-control-sm" placeholder="Dirección Exacta"
                           v-model="clienteDelivery.direccion">
                     </div>
                  </div>

                  <div class="flex-grow-1 overflow-auto p-3 custom-scroll">
                     <div v-if="carrito.length === 0" class="text-center text-muted mt-5">
                        <font-awesome-icon icon="basket-shopping" size="3x" class="mb-3 opacity-25" />
                        <p>Carrito vacío</p>
                     </div>

                     <div v-else v-for="(item, index) in carrito" :key="index"
                        class="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
                        <div class="d-flex align-items-center">
                           <div class="me-2">
                              <h6 class="mb-0 text-sm fw-bold">{{ item.nombre }}</h6>
                              <small class="text-muted">S/ {{ item.precio }} x {{ item.cantidad }}</small>
                           </div>
                        </div>
                        <div class="d-flex align-items-center">
                           <span class="fw-bold me-3 text-primary">S/ {{ (item.precio * item.cantidad).toFixed(2)
                              }}</span>
                           <button class="btn btn-icon btn-sm btn-light-danger"
                              @click="eliminarDelCarrito(index)">x</button>
                        </div>
                     </div>
                  </div>

                  <div class="p-4 bg-light border-top">
                     <div class="d-flex justify-content-between mb-2 text-muted">
                        <span>Subtotal:</span>
                        <span>S/ {{ totalNeto.toFixed(2) }}</span>
                     </div>
                     <div v-if="formVenta.tipoVenta === 'delivery'"
                        class="d-flex justify-content-between mb-2 text-muted">
                        <span>Delivery:</span>
                        <span>S/ {{ costoDelivery.toFixed(2) }}</span>
                     </div>
                     <div class="d-flex justify-content-between mb-4">
                        <span class="fs-4 fw-bold text-dark">Total:</span>
                        <span class="fs-4 fw-bold text-primary">S/ {{ totalFinal.toFixed(2) }}</span>
                     </div>

                     <button class="btn btn-primary w-100 py-3 fw-bold shadow-sm" @click="abrirModalPago"
                        :disabled="carrito.length === 0">
                        CONFIRMAR PEDIDO (S/ {{ totalFinal.toFixed(2) }})
                     </button>
                  </div>

               </div>
            </div>
         </div>

      </div>

      <div v-if="mostrarModal" class="modal fade show d-block"
         style="background: rgba(0,0,0,0.5); backdrop-filter: blur(2px);">
         <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content shadow-lg">
               <div class="modal-header bg-primary text-white">
                  <h5 class="modal-title">📝 Datos del Cliente</h5>
                  <button type="button" class="btn-close btn-close-white" @click="mostrarModal = false"></button>
               </div>
               <div class="modal-body p-4">
                  <div class="row g-3">
                     <div class="col-md-6">
                        <label class="form-label small fw-bold text-muted">DNI / RUC</label>
                        <input type="number" class="form-control" v-model="formVenta.dni" placeholder="Opcional">
                     </div>
                     <div class="col-md-6">
                        <label class="form-label small fw-bold text-muted">Nombre Cliente</label>
                        <input type="text" class="form-control" v-model="formVenta.nombre"
                           placeholder="Público General">
                     </div>

                     <div v-if="formVenta.tipoVenta === 'delivery'" class="col-12 mt-3 p-3 bg-light rounded border">
                        <h6 class="text-primary fw-bold mb-3 small"><font-awesome-icon icon="truck-fast" /> Datos de
                           Entrega</h6>
                        <div class="mb-2">
                           <label class="form-label small">Teléfono</label>
                           <input type="text" class="form-control form-control-sm" v-model="formVenta.telefono">
                        </div>
                        <div>
                           <label class="form-label small">Dirección Exacta</label>
                           <input type="text" class="form-control form-control-sm" v-model="formVenta.direccion">
                        </div>
                     </div>
                  </div>
               </div>
               <div class="modal-footer border-0">
                  <button class="btn btn-secondary" @click="mostrarModal = false">Cancelar</button>
                  <button class="btn btn-success fw-bold" @click="finalizarVenta">
                     <font-awesome-icon icon="print" /> IMPRIMIR TICKET
                  </button>
               </div>
            </div>
         </div>
      </div>

      <div id="ticket-print" class="d-none">
         <div style="font-family: 'Courier New', monospace; font-size: 12px; width: 100%;">
            <div class="text-center mb-2">
               <h3 style="margin:0; font-weight:bold;">POLLERIA EL SABROSÓN</h3>
               <p style="margin:0;">RUC: 20123456789</p>
               <p style="margin:0;">Av. Siempre Viva 123</p>
            </div>

            <p style="border-top: 1px dashed #000; margin: 5px 0;"></p>

            <div style="display: flex; justify-content: space-between;">
               <span><strong>Ticket:</strong> #{{ datosTicket.id }}</span>
               <span>{{ new Date().toLocaleTimeString() }}</span>
            </div>
            <div><strong>Cliente:</strong> {{ datosTicket.nombre }}</div>
            <div v-if="datosTicket.dni"><strong>DNI:</strong> {{ datosTicket.dni }}</div>
            <div v-if="datosTicket.tipo === 'delivery'"><strong>Dir:</strong> {{ datosTicket.direccion }}</div>

            <p style="border-top: 1px dashed #000; margin: 5px 0;"></p>

            <table style="width: 100%; border-collapse: collapse;">
               <tr v-for="item in datosTicket.items" :key="item.id_producto">
                  <td style="padding: 2px 0;">{{ item.cantidad }} x {{ item.nombre }}</td>
                  <td style="text-align: right;">{{ (item.precio * item.cantidad).toFixed(2) }}</td>
               </tr>
            </table>

            <p style="border-top: 1px dashed #000; margin: 5px 0;"></p>

            <div style="display: flex; justify-content: space-between; font-size: 14px; font-weight: bold;">
               <span>TOTAL:</span>
               <span>S/ {{ datosTicket.total }}</span>
            </div>

            <br>
            <div class="text-center">
               <p>¡Gracias por su compra!</p>
               <small>Wifi: Pollos123</small>
            </div>
         </div>
      </div>

   </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import axios from 'axios';

// Estado Base
const productos = ref([]);
const carrito = ref([]);
const categorias = ref(['Todas', 'Pollo', 'Combo', 'Bebida', 'Extra']);
const filtroCategoria = ref('Todas');
const busqueda = ref('');
const costoDelivery = ref(5.00);

// --- NUEVOS ESTADOS ---
const mostrarModal = ref(false);
const formVenta = ref({
   tipoVenta: 'local',
   nombre: '',
   dni: '',
   telefono: '',
   direccion: ''
});
const datosTicket = ref({ // Datos fijos para el ticket impreso
   id: '---', items: [], total: '0.00', nombre: '', dni: '', direccion: '', tipo: ''
});

// Cargar Productos
const cargarProductos = async () => {
   try { const res = await axios.get('http://localhost:3000/api/productos'); productos.value = res.data; } catch (e) { }
};

// Computed
const productosFiltrados = computed(() => {
   return productos.value.filter(p => {
      const matchCat = filtroCategoria.value === 'Todas' || p.categoria === filtroCategoria.value;
      const matchSearch = p.nombre.toLowerCase().includes(busqueda.value.toLowerCase());
      return matchCat && matchSearch;
   });
});

const totalNeto = computed(() => carrito.value.reduce((acc, item) => acc + (item.precio * item.cantidad), 0));
const totalFinal = computed(() => {
   return formVenta.value.tipoVenta === 'delivery' ? totalNeto.value + costoDelivery.value : totalNeto.value;
});

// Acciones Carrito
const agregarAlCarrito = (prod) => {
   const existente = carrito.value.find(item => item.id_producto === prod.id_producto);
   if (existente) existente.cantidad++;
   else carrito.value.push({ id_producto: prod.id_producto, nombre: prod.nombre, precio: parseFloat(prod.precio), cantidad: 1 });
};

const eliminarDelCarrito = (idx) => carrito.value.splice(idx, 1);

// --- LÓGICA DEL FLUJO DE VENTA ---

// 1. Abrir Modal (Reemplaza el proceso directo anterior)
const abrirModalPago = () => {
   // Preservar tipo de venta seleccionado en el switch, limpiar el resto
   const tipoActual = formVenta.value.tipoVenta;
   formVenta.value = {
      tipoVenta: tipoActual,
      nombre: '',
      dni: '',
      telefono: '',
      direccion: ''
   };
   mostrarModal.value = true;
};

// Paso 2: Finalizar, Guardar en BD e Imprimir
const finalizarVenta = async () => {
   // A. Validación Delivery
   if (formVenta.value.tipoVenta === 'delivery' && !formVenta.value.direccion) {
      alert('Para delivery, la dirección es obligatoria.');
      return;
   }

   // B. Preparar datos del cliente
   const clienteFinal = {
      nombre: formVenta.value.nombre || 'Cliente General',
      dni: formVenta.value.dni || '',
      telefono: formVenta.value.telefono || '',
      direccion: formVenta.value.direccion || ''
   };

   // C. [CORRECCIÓN] Llenar el ticket VISUALMENTE ahora (con ID temporal)
   // Esto asegura que la boleta NO salga vacía si el servidor falla
   datosTicket.value = {
      id: 'Pendiente...', // Se actualizará si el servidor responde bien
      items: [...carrito.value],
      total: totalFinal.value.toFixed(2),
      nombre: clienteFinal.nombre,
      dni: clienteFinal.dni,
      direccion: clienteFinal.direccion,
      tipo: formVenta.value.tipoVenta
   };

   const payload = {
      id_cliente: null,
      tipo_venta: formVenta.value.tipoVenta,
      total_neto: totalNeto.value,
      costo_delivery: formVenta.value.tipoVenta === 'delivery' ? costoDelivery.value : 0,
      total_final: totalFinal.value,
      metodo_pago: 'efectivo',
      id_vendedor: 1,
      productos: carrito.value,
      datos_cliente_delivery: clienteFinal
   };

   try {
      // D. Enviar al Backend
      const res = await axios.post('http://localhost:3000/api/pedidos', payload);

      // E. Si hay éxito, actualizamos SOLO el ID del ticket
      datosTicket.value.id = res.data.id_pedido; // ¡Aquí ponemos el ID real!

      // F. Cerrar modal y limpiar carrito
      mostrarModal.value = false;
      carrito.value = [];
      formVenta.value = { tipoVenta: 'local', nombre: '', dni: '', telefono: '', direccion: '' }; // Resetear formulario

      // G. Imprimir
      await nextTick();
      setTimeout(() => {
         window.print();
      }, 500);

   } catch (error) {
      console.error("Error en venta:", error);
      // Opcional: Imprimir igual aunque falle (útil para depurar) o mostrar alerta
      alert('Hubo un problema de conexión, pero intentaremos imprimir la constancia.');
      mostrarModal.value = false;
      setTimeout(() => window.print(), 500);
   }
};

const getImgPath = (path) => path ? `/img/${path}` : '/img/default.jpg';

onMounted(() => cargarProductos());
</script>

<style scoped>
/* Tus estilos originales se mantienen */
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