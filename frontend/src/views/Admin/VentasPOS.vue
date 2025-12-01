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
                  <div class="d-flex flex-column gap-2">
                      <div class="btn-group w-100" role="group">
                          <input type="radio" class="btn-check" name="tipoVenta" id="mesa" value="mesa" v-model="formVenta.tipoVenta">
                          <label class="btn btn-outline-primary" for="mesa">🍽️ Mesa</label>

                          <input type="radio" class="btn-check" name="tipoVenta" id="llevar" value="llevar" v-model="formVenta.tipoVenta">
                          <label class="btn btn-outline-primary" for="llevar">🛍️ Llevar</label>

                          <input type="radio" class="btn-check" name="tipoVenta" id="delivery" value="delivery" v-model="formVenta.tipoVenta">
                          <label class="btn btn-outline-primary" for="delivery">🛵 Delivery</label>
                      </div>
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
                  <div v-if="formVenta.tipoVenta === 'delivery'" class="d-flex justify-content-between mb-2 text-muted">
                     <span>Delivery:</span>
                     <span>S/ {{ costoDelivery.toFixed(2) }}</span>
                  </div>
                  <div class="d-flex justify-content-between mb-4">
                     <span class="fs-4 fw-bold text-dark">Total:</span>
                     <span class="fs-4 fw-bold text-primary">S/ {{ totalFinal.toFixed(2) }}</span>
                  </div>

                  <button class="btn btn-primary w-100 py-3 fw-bold shadow-sm" @click="abrirModalPago" :disabled="carrito.length === 0">
                     CONFIRMAR PEDIDO (S/ {{ totalFinal.toFixed(2) }})
                  </button>
               </div>

            </div>
         </div>
      </div>

    </div>

    <div v-if="mostrarModal" class="modal fade show d-block" style="background: rgba(0,0,0,0.6); backdrop-filter: blur(2px);">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content border-0 shadow-lg overflow-hidden">
                <div class="modal-header bg-dark text-white border-0 py-3">
                    <h5 class="modal-title fw-bold">💳 Procesar Pago</h5>
                    <button type="button" class="btn-close btn-close-white" @click="mostrarModal = false"></button>
                </div>
                
                <div class="modal-body p-0">
                    <div class="row g-0 h-100">
                        
                        <div class="col-md-7 p-4 border-end">
                            <h6 class="fw-bold text-muted mb-3 small text-uppercase">1. Datos del Cliente</h6>
                            
                            <div class="mb-3 text-center">
                                <span class="badge bg-primary fs-6 text-uppercase w-100 py-2">{{ formVenta.tipoVenta }}</span>
                            </div>

                            <div class="row g-2">
                                <div class="col-md-6">
                                    <label class="form-label small fw-bold">DNI / RUC</label>
                                    <input type="number" class="form-control form-control-sm" v-model="formVenta.dni">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label small fw-bold">Nombre</label>
                                    <input type="text" class="form-control form-control-sm" v-model="formVenta.nombre">
                                </div>
                                
                                <div v-if="formVenta.tipoVenta === 'delivery'" class="col-12 mt-2 bg-light p-2 rounded border">
                                    <input type="text" class="form-control form-control-sm mb-2" v-model="formVenta.telefono" placeholder="📞 Teléfono">
                                    <input type="text" class="form-control form-control-sm" v-model="formVenta.direccion" placeholder="📍 Dirección">
                                </div>
                            </div>
                        </div>

                        <div class="col-md-5 p-4 bg-light">
                            <h6 class="fw-bold text-muted mb-3 small text-uppercase">2. Método de Pago</h6>
                            
                            <h2 class="text-center fw-bold text-dark mb-3 display-6">S/ {{ totalFinal.toFixed(2) }}</h2>

                            <div class="d-grid gap-2 mb-3">
                                <div class="btn-group" role="group">
                                    <input type="radio" class="btn-check" id="pago_efectivo" value="efectivo" v-model="pago.metodo">
                                    <label class="btn btn-outline-dark btn-sm" for="pago_efectivo">💵 Efectivo</label>

                                    <input type="radio" class="btn-check" id="pago_tarjeta" value="tarjeta" v-model="pago.metodo">
                                    <label class="btn btn-outline-dark btn-sm" for="pago_tarjeta">💳 Tarjeta</label>

                                    <input type="radio" class="btn-check" id="pago_yape" value="yape" v-model="pago.metodo">
                                    <label class="btn btn-outline-dark btn-sm" for="pago_yape">📱 Yape/Plin</label>
                                </div>
                            </div>

                            <div v-if="pago.metodo === 'efectivo'" class="animate__animated animate__fadeIn">
                                <label class="form-label small">Monto Recibido</label>
                                <input type="number" class="form-control mb-2 text-center fw-bold" v-model="pago.montoRecibido" @input="calcularVuelto">
                                
                                <div class="d-flex justify-content-between fw-bold mt-3" :class="pago.vuelto < 0 ? 'text-danger' : 'text-success'">
                                    <span>Vuelto:</span>
                                    <span>S/ {{ pago.vuelto.toFixed(2) }}</span>
                                </div>
                                <small v-if="pago.vuelto < 0" class="text-danger d-block text-center fw-bold">Falta dinero</small>
                            </div>

                            <div v-if="pago.metodo === 'tarjeta'" class="text-center animate__animated animate__fadeIn">
                                <div class="alert alert-warning py-2 small border-0 mb-2">
                                    <font-awesome-icon icon="credit-card" class="me-1"/> Usar POS Izipay/Niubiz
                                </div>
                                <input type="text" class="form-control form-control-sm text-center" v-model="pago.referencia" placeholder="Ref (Opcional)">
                            </div>

                            <div v-if="pago.metodo === 'yape'" class="text-center animate__animated animate__fadeIn">
                                <div class="bg-white p-2 rounded mb-2 border">
                                    <small class="d-block text-muted mb-1">Escanear QR</small>
                                    <div style="width: 80px; height: 80px; background: #eee; margin: 0 auto;"></div>
                                </div>
                                <input type="text" class="form-control form-control-sm text-center" v-model="pago.referencia" placeholder="# Operación / Teléfono">
                            </div>

                        </div>
                    </div>
                </div>

                <div class="modal-footer border-top bg-white">
                    <button class="btn btn-light text-muted" @click="mostrarModal = false">Cancelar</button>
                    <button class="btn btn-success fw-bold px-4 shadow-sm" 
                            @click="finalizarVenta"
                            :disabled="pago.metodo === 'efectivo' && pago.vuelto < 0">
                        <font-awesome-icon icon="check" /> CONFIRMAR VENTA
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
            <div v-if="datosTicket.tipo === 'delivery'"><strong>Dir:</strong> {{ datosTicket.direccion }}</div>
            <div v-if="datosTicket.tipo"><strong>Tipo:</strong> {{ datosTicket.tipo.toUpperCase() }}</div>

            <p style="border-top: 1px dashed #000; margin: 5px 0;"></p>

            <table style="width: 100%; border-collapse: collapse;">
                <tr v-for="item in datosTicket.items" :key="item.id_producto">
                    <td style="padding: 2px 0;">{{ item.cantidad }} x {{ item.nombre }}</td>
                    <td style="text-align: right;">{{ (item.precio * item.cantidad).toFixed(2) }}</td>
                </tr>
            </table>

            <p style="border-top: 1px dashed #000; margin: 5px 0;"></p>

            <div style="margin-bottom: 5px; font-size: 11px;">
                <div><strong>MÉTODO:</strong> {{ datosTicket.metodoPago }}</div>
                <div v-if="datosTicket.referencia"><em>{{ datosTicket.referencia }}</em></div>
            </div>

            <div style="display: flex; justify-content: space-between; font-size: 14px; font-weight: bold;">
                <span>TOTAL:</span>
                <span>S/ {{ datosTicket.total }}</span>
            </div>
            
            <br>
            <div class="text-center">
                <p>¡Gracias por su preferencia!</p>
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

// --- ESTADOS DE VENTA Y PAGO ---
const mostrarModal = ref(false);
const formVenta = ref({
    tipoVenta: 'mesa', 
    nombre: '',
    dni: '',
    telefono: '',
    direccion: ''
});
const pago = ref({
    metodo: 'efectivo',
    montoRecibido: 0,
    vuelto: 0,
    referencia: ''
});
const datosTicket = ref({
    id: '---', items: [], total: '0.00', nombre: '', dni: '', direccion: '', tipo: '', metodoPago: '', referencia: ''
});

// Cargar Productos
const cargarProductos = async () => {
   try { const res = await axios.get('http://localhost:3000/api/productos'); productos.value = res.data; } catch (e) {}
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

// --- LÓGICA DE PAGO ---

const abrirModalPago = () => {
    // Resetear pagos al abrir
    pago.value = {
        metodo: 'efectivo',
        montoRecibido: 0, 
        vuelto: -totalFinal.value, 
        referencia: ''
    };
    // Sugerir monto exacto para no mostrar error de saque
    pago.value.montoRecibido = totalFinal.value;
    calcularVuelto();

    mostrarModal.value = true;
};

const calcularVuelto = () => {
    pago.value.vuelto = parseFloat(pago.value.montoRecibido) - parseFloat(totalFinal.value);
};

const finalizarVenta = async () => {
    // Validar Delivery
    if (formVenta.value.tipoVenta === 'delivery' && !formVenta.value.direccion) {
        alert('La dirección es obligatoria para delivery.');
        return;
    }

    // Preparar referencia de pago
    let refPagoFinal = '';
    if (pago.value.metodo === 'efectivo') {
        refPagoFinal = `Efectivo: S/${pago.value.montoRecibido} | Vuelto: S/${pago.value.vuelto.toFixed(2)}`;
    } else {
        refPagoFinal = pago.value.referencia || '';
    }

    const clienteFinal = {
        nombre: formVenta.value.nombre || 'Cliente General',
        dni: formVenta.value.dni || '',
        telefono: formVenta.value.telefono || '',
        direccion: formVenta.value.direccion || ''
    };

    // 1. Llenar Ticket Visualmente
    datosTicket.value = {
        id: '...', 
        items: [...carrito.value],
        total: totalFinal.value.toFixed(2),
        nombre: clienteFinal.nombre,
        dni: clienteFinal.dni,
        direccion: clienteFinal.direccion,
        tipo: formVenta.value.tipoVenta,
        metodoPago: pago.value.metodo.toUpperCase(),
        referencia: refPagoFinal
    };

    const payload = {
      id_cliente: null, 
      tipo_venta: formVenta.value.tipoVenta,
      total_neto: totalNeto.value,
      costo_delivery: formVenta.value.tipoVenta === 'delivery' ? costoDelivery.value : 0,
      total_final: totalFinal.value,
      metodo_pago: pago.value.metodo, 
      referencia_pago: refPagoFinal, 
      id_vendedor: 1, 
      productos: carrito.value,
      datos_cliente_delivery: clienteFinal
   };

   try {
      const res = await axios.post('http://localhost:3000/api/pedidos', payload);
      
      datosTicket.value.id = res.data.id_pedido;
      mostrarModal.value = false;
      carrito.value = [];
      // Limpiar formulario excepto tipo venta
      const tipo = formVenta.value.tipoVenta;
      formVenta.value = { tipoVenta: tipo, nombre: '', dni: '', telefono: '', direccion: '' };
      
      await nextTick();
      setTimeout(() => window.print(), 300);

   } catch (error) {
      console.error(error);
      alert('Error al guardar venta. (Revise backend)');
      mostrarModal.value = false;
   }
};

const getImgPath = (path) => path ? `/img/${path}` : '/img/default.jpg';

onMounted(() => cargarProductos());
</script>

<style scoped>
.product-card {
   cursor: pointer;
   transition: transform 0.2s;
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