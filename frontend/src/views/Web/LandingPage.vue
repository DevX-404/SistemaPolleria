<template>
  <div class="landing-page">
    
    <div class="hero-section text-white d-flex align-items-center justify-content-center text-center">
        <div class="container position-relative" style="z-index: 2;">
            <h1 class="display-3 fw-bold mb-3 text-shadow animate__animated animate__fadeInDown">
                ¡El Pollo Más Sabroso! 🍗
            </h1>
            <p class="lead mb-4 fs-4 text-shadow animate__animated animate__fadeInUp">
                A la leña, crujiente y con las mejores papas. Pide ahora.
            </p>
            <button @click="scrollToMenu" class="btn btn-warning btn-lg fw-bold px-5 py-3 rounded-pill shadow-lg hover-scale">
                VER LA CARTA 👇
            </button>
        </div>
        <div class="overlay"></div>
    </div>

    <div id="menu" class="container py-5">
        <div class="text-center mb-5">
            <h2 class="fw-bold text-dark display-6">Nuestra Carta</h2>
            <div class="divider mx-auto bg-primary"></div>
        </div>

        <div class="d-flex justify-content-center gap-2 mb-5 flex-wrap sticky-top pt-3 pb-2 bg-light-transparent" style="top: 60px; z-index: 9;">
             <button 
                v-for="cat in categorias" 
                :key="cat"
                @click="filtro = cat"
                :class="['btn rounded-pill px-4 fw-bold', filtro === cat ? 'btn-primary shadow' : 'btn-outline-secondary border-0 bg-white']"
             >
                {{ cat }}
             </button>
        </div>

        <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
        </div>

        <div v-else class="row g-4">
            <div class="col-md-4 col-sm-6" v-for="prod in productosFiltrados" :key="prod.id_producto">
                <div class="card h-100 border-0 shadow-sm product-card overflow-hidden">
                    <div class="img-wrapper">
                        <img :src="getImgPath(prod.imagen_path)" class="card-img-top product-img" alt="Producto">
                    </div>
                    <div class="card-body text-center d-flex flex-column">
                        <h5 class="fw-bold text-dark mb-1">{{ prod.nombre }}</h5>
                        <p class="text-muted small mb-3 flex-grow-1">{{ prod.descripcion || 'Delicioso y preparado al momento.' }}</p>
                        <div class="d-flex justify-content-between align-items-center mt-3">
                            <h4 class="text-primary fw-bold mb-0">S/ {{ parseFloat(prod.precio).toFixed(2) }}</h4>
                            <button class="btn btn-outline-primary rounded-circle btn-add shadow-sm" @click="agregarAlCarrito(prod)">
                                <font-awesome-icon icon="plus" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="fixed-bottom container mb-4 d-flex justify-content-center" style="z-index: 1050; pointer-events: none;">
        <button v-if="carrito.length > 0" 
                class="btn btn-dark shadow-lg rounded-pill px-4 py-3 d-flex align-items-center gap-3 animate__animated animate__bounceInUp cart-btn" 
                @click="mostrarCarrito = true"
                style="pointer-events: auto;">
            <div class="position-relative">
                <font-awesome-icon icon="shopping-cart" size="lg" />
                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {{ totalItems }}
                </span>
            </div>
            <span class="fw-bold border-start ps-3 border-secondary">Ver Pedido</span>
            <span class="fw-bold text-warning ms-auto">S/ {{ totalPagar.toFixed(2) }}</span>
        </button>
    </div>

    <div v-if="mostrarCarrito" class="modal fade show d-block" style="background: rgba(0,0,0,0.6); backdrop-filter: blur(4px);">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content border-0 shadow-lg rounded-4">
                <div class="modal-header border-bottom-0 pb-0">
                    <h5 class="modal-title fw-bold">🛒 Finalizar Pedido</h5>
                    <button type="button" class="btn-close" @click="mostrarCarrito = false"></button>
                </div>
                
                <div class="modal-body">
                    <div class="alert alert-light border d-flex justify-content-between fw-bold mb-3">
                        <span>Total a Pagar (Inc. Delivery):</span>
                        <span class="text-primary fs-5">S/ {{ (totalPagar + costoDelivery).toFixed(2) }}</span>
                    </div>

                    <div class="mb-4">
                        <h6 class="fw-bold mb-2 text-muted small text-uppercase">1. Datos de Entrega</h6>
                        <div class="row g-2">
                            <div class="col-6">
                                <input type="text" class="form-control form-control-sm" placeholder="Tu Nombre" v-model="cliente.nombre">
                            </div>
                            <div class="col-6">
                                <input type="tel" class="form-control form-control-sm" placeholder="Celular" v-model="cliente.telefono">
                            </div>
                            <div class="col-12">
                                <input type="text" class="form-control form-control-sm" placeholder="Dirección Exacta" v-model="cliente.direccion">
                            </div>
                            <div class="col-12">
                                <input type="text" class="form-control form-control-sm" placeholder="Referencia (Opcional)" v-model="cliente.referencia">
                            </div>
                        </div>
                    </div>

                    <div>
                        <h6 class="fw-bold mb-2 text-muted small text-uppercase">2. Método de Pago</h6>
                        
                        <div class="btn-group w-100 mb-3">
                            <input type="radio" class="btn-check" name="pago" id="web_efectivo" value="efectivo" v-model="pago.metodo">
                            <label class="btn btn-outline-dark btn-sm" for="web_efectivo">💵 Efectivo</label>

                            <input type="radio" class="btn-check" name="pago" id="web_yape" value="yape" v-model="pago.metodo">
                            <label class="btn btn-outline-dark btn-sm" for="web_yape">📱 Yape/Plin</label>

                            <input type="radio" class="btn-check" name="pago" id="web_tarjeta" value="tarjeta" v-model="pago.metodo">
                            <label class="btn btn-outline-dark btn-sm" for="web_tarjeta">💳 Tarjeta</label>
                        </div>

                        <div v-if="pago.metodo === 'efectivo'" class="bg-light p-2 rounded animate__animated animate__fadeIn">
                            <label class="small text-muted">¿Con cuánto vas a pagar?</label>
                            <div class="input-group input-group-sm">
                                <span class="input-group-text">S/</span>
                                <input type="number" class="form-control" v-model="pago.monto" placeholder="Monto">
                            </div>
                            <small class="text-primary fw-bold d-block mt-1" v-if="pago.monto >= (totalPagar + 5)">
                                Vuelto: S/ {{ (pago.monto - (totalPagar + 5)).toFixed(2) }}
                            </small>
                        </div>

                        <div v-if="pago.metodo === 'yape'" class="bg-light p-2 rounded text-center animate__animated animate__fadeIn">
                            <p class="small mb-1">Yapea al <strong>999-888-777</strong> (Juan Perez)</p>
                            <input type="text" class="form-control form-control-sm text-center" v-model="pago.referencia" placeholder="Ingresa # Operación aquí">
                        </div>

                         <div v-if="pago.metodo === 'tarjeta'" class="bg-light p-2 rounded text-center animate__animated animate__fadeIn">
                            <small class="text-muted">El motorizado llevará el POS.</small>
                        </div>
                    </div>

                </div>

                <div class="modal-footer border-top-0 pt-0">
                    <button class="btn btn-success w-100 py-3 rounded-pill fw-bold shadow hover-scale" 
                            @click="enviarPedido"
                            :disabled="!formValido">
                        <font-awesome-icon icon="motorcycle" /> ¡ENVIAR PEDIDO!
                    </button>
                </div>
            </div>
        </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const API_URL = 'http://localhost:3000/api'; 
const productos = ref([]);
const loading = ref(true);
const filtro = ref('Todas');
const categorias = ref(['Todas', 'Pollo', 'Combo', 'Bebida']);
const carrito = ref([]);
const mostrarCarrito = ref(false);
const costoDelivery = ref(5.00);

const cliente = ref({ nombre: '', telefono: '', direccion: '', referencia: '' });
const pago = ref({ metodo: 'efectivo', monto: '', referencia: '' });

onMounted(async () => {
    try {
        const res = await axios.get(`${API_URL}/productos`);
        productos.value = res.data;
        const cats = [...new Set(res.data.map(p => p.categoria))];
        if(cats.length) categorias.value = ['Todas', ...cats];
    } catch(e) { console.error(e); } finally { loading.value = false; }
});

const productosFiltrados = computed(() => {
    if(filtro.value === 'Todas') return productos.value;
    return productos.value.filter(p => p.categoria === filtro.value);
});

const agregarAlCarrito = (prod) => {
    const existe = carrito.value.find(i => i.id_producto === prod.id_producto);
    if(existe) existe.cantidad++;
    else carrito.value.push({ ...prod, cantidad: 1, precio: parseFloat(prod.precio) });
    mostrarCarrito.value = true;
    if (navigator.vibrate) navigator.vibrate(50);
};

const eliminarItem = (idx) => carrito.value.splice(idx, 1);

const totalItems = computed(() => carrito.value.reduce((acc, i) => acc + i.cantidad, 0));
const totalPagar = computed(() => carrito.value.reduce((acc, i) => acc + (i.precio * i.cantidad), 0));

const formValido = computed(() => {
    const datosOk = cliente.value.nombre && cliente.value.telefono && cliente.value.direccion;
    const carritoOk = carrito.value.length > 0;
    // Validar pago
    let pagoOk = true;
    const total = totalPagar.value + costoDelivery.value;
    if (pago.value.metodo === 'efectivo') pagoOk = pago.value.monto >= total;
    if (pago.value.metodo === 'yape') pagoOk = pago.value.referencia.length > 4;
    
    return datosOk && carritoOk && pagoOk;
});

const enviarPedido = async () => {
    const total = totalPagar.value + costoDelivery.value;
    
    // Construir referencia de pago para el motorizado
    let refPago = '';
    if (pago.value.metodo === 'efectivo') {
        const vuelto = parseFloat(pago.value.monto) - total;
        refPago = `Paga con S/${pago.value.monto} (Vuelto: S/${vuelto.toFixed(2)})`;
    } else if (pago.value.metodo === 'yape') {
        refPago = `Yape Operación: ${pago.value.referencia}`;
    } else {
        refPago = 'Llevar POS Izipay';
    }

    const payload = {
        id_cliente: null,
        tipo_venta: 'delivery',
        total_neto: totalPagar.value,
        costo_delivery: costoDelivery.value,
        total_final: total,
        metodo_pago: pago.value.metodo,
        referencia_pago: refPago,
        id_vendedor: 1, 
        productos: carrito.value,
        datos_cliente_delivery: cliente.value
    };

    try {
        await axios.post(`${API_URL}/pedidos`, payload);
        alert('✅ ¡Pedido Recibido! El motorizado va en camino.');
        
        carrito.value = [];
        mostrarCarrito.value = false;
        cliente.value = { nombre: '', telefono: '', direccion: '', referencia: '' };
        pago.value = { metodo: 'efectivo', monto: '', referencia: '' };
    } catch (error) {
        console.error(error);
        alert('Hubo un error al enviar el pedido.');
    }
};

const getImgPath = (path) => path ? `/img/${path}` : '/img/default.jpg';
const scrollToMenu = () => document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
</script>

<style scoped>
/* Estilos Hero */
.hero-section {
    background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/img/pollo-hero.jpg');
    background-size: cover;
    background-position: center;
    height: 500px;
    margin-top: -20px;
}
.section-title:after {
    content: ''; display: block; width: 60px; height: 4px; background: var(--primary); margin: 10px auto 0;
}
.product-card { transition: all 0.3s ease; border-radius: 15px; }
.product-card:hover { transform: translateY(-5px); box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important; }
.img-wrapper { height: 220px; overflow: hidden; border-bottom: 1px solid #f0f0f0; }
.product-img { height: 100%; width: 100%; object-fit: cover; transition: transform 0.5s; }
.product-card:hover .product-img { transform: scale(1.1); }
.btn-add { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; }
.btn-add:hover { background-color: var(--primary); color: white; }
.divider { width: 80px; height: 5px; border-radius: 5px; margin-top: 10px; }
.bg-light-transparent { background-color: rgba(249, 249, 249, 0.9); backdrop-filter: blur(5px); }
</style>