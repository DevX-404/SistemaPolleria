<template>
  <div>
    <div class="hero-section d-flex align-items-center text-white">
        <div class="container text-center py-5">
            <h1 class="display-4 fw-bold animate__animated animate__fadeInDown">¡El Mejor Pollo a la Brasa!</h1>
            <p class="lead mb-4 animate__animated animate__fadeInUp">Crujiente, jugoso y con las papas que te encantan.</p>
            <a href="#menu" class="btn btn-lg btn-warning fw-bold text-dark shadow-lg rounded-pill px-5">
                ¡ORDENAR AHORA! 🍗
            </a>
        </div>
    </div>

    <div id="menu" class="container py-5">
        <h3 class="text-center fw-bold mb-5 position-relative section-title">
            NUESTRA CARTA
        </h3>

        <div class="d-flex justify-content-center gap-2 mb-4 flex-wrap">
             <button v-for="cat in ['Todas', 'Pollo', 'Combo', 'Bebida']" :key="cat"
                @click="filtro = cat"
                :class="['btn rounded-pill px-4', filtro === cat ? 'btn-primary shadow' : 'btn-outline-secondary border-0 bg-white']">
                {{ cat }}
             </button>
        </div>

        <div class="row g-4">
            <div class="col-md-4 col-sm-6" v-for="prod in productosFiltrados" :key="prod.id_producto">
                <div class="card h-100 border-0 shadow-sm product-hover">
                    <img :src="getImgPath(prod.imagen_path)" class="card-img-top" style="height: 220px; object-fit: cover;">
                    <div class="card-body text-center">
                        <h5 class="fw-bold text-dark">{{ prod.nombre }}</h5>
                        <p class="text-muted small">{{ prod.descripcion }}</p>
                        <h4 class="text-primary fw-bold my-3">S/ {{ parseFloat(prod.precio).toFixed(2) }}</h4>
                        <button class="btn btn-outline-primary w-100 fw-bold rounded-pill" @click="agregarAlCarrito(prod)">
                            AGREGAR AL PEDIDO
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="fixed-bottom p-3 d-flex justify-content-center" v-if="carrito.length > 0" style="z-index: 1050;">
        <button class="btn btn-dark shadow-lg rounded-pill px-4 py-3 d-flex align-items-center gap-3 animate__animated animate__bounceInUp" 
                @click="mostrarCarrito = true">
            <span class="badge bg-danger rounded-circle">{{ totalItems }}</span>
            <span class="fw-bold">Ver mi Canasta</span>
            <span class="fw-bold text-warning">S/ {{ totalPagar.toFixed(2) }}</span>
        </button>
    </div>

    <div v-if="mostrarCarrito" class="modal fade show d-block" style="background: rgba(0,0,0,0.6); backdrop-filter: blur(3px);">
        <div class="modal-dialog modal-dialog-scrollable">
            <div class="modal-content border-0">
                <div class="modal-header bg-light">
                    <h5 class="modal-title fw-bold">🛒 Tu Pedido</h5>
                    <button type="button" class="btn-close" @click="mostrarCarrito = false"></button>
                </div>
                <div class="modal-body">
                    
                    <div v-if="carrito.length === 0" class="text-center py-4 text-muted">
                        Tu canasta está vacía 😢
                    </div>
                    <ul class="list-group list-group-flush mb-3">
                        <li v-for="(item, idx) in carrito" :key="idx" class="list-group-item d-flex justify-content-between align-items-center px-0">
                            <div>
                                <h6 class="mb-0 fw-bold">{{ item.cantidad }}x {{ item.nombre }}</h6>
                                <small class="text-muted">S/ {{ item.precio }} c/u</small>
                            </div>
                            <div class="d-flex align-items-center gap-3">
                                <span class="fw-bold">S/ {{ (item.precio * item.cantidad).toFixed(2) }}</span>
                                <button class="btn btn-sm text-danger" @click="eliminarItem(idx)">✕</button>
                            </div>
                        </li>
                    </ul>

                    <div class="bg-light p-3 rounded" v-if="carrito.length > 0">
                        <h6 class="fw-bold mb-3 text-primary">Datos de Entrega 🛵</h6>
                        <div class="mb-2">
                            <input type="text" class="form-control" placeholder="Tu Nombre" v-model="cliente.nombre">
                        </div>
                        <div class="mb-2">
                            <input type="tel" class="form-control" placeholder="Celular / WhatsApp" v-model="cliente.telefono">
                        </div>
                        <div class="mb-2">
                            <input type="text" class="form-control" placeholder="Dirección de Entrega" v-model="cliente.direccion">
                        </div>
                        <div class="mb-2">
                            <textarea class="form-control" rows="1" placeholder="Referencia (Casa azul, etc)" v-model="cliente.referencia"></textarea>
                        </div>
                    </div>

                </div>
                <div class="modal-footer flex-column border-0 bg-light">
                    <div class="d-flex justify-content-between w-100 mb-2 fs-5 fw-bold">
                        <span>Total + Delivery:</span>
                        <span class="text-primary">S/ {{ (totalPagar + 5).toFixed(2) }}</span>
                    </div>
                    <small class="text-muted mb-3 w-100 text-center">*Delivery fijo S/ 5.00</small>
                    
                    <button class="btn btn-success w-100 py-3 fw-bold shadow-sm" 
                            @click="enviarPedido"
                            :disabled="carrito.length === 0 || !cliente.telefono || !cliente.direccion">
                        <font-awesome-icon icon="motorcycle" /> ¡PEDIR AHORA!
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

const productos = ref([]);
const filtro = ref('Todas');
const carrito = ref([]);
const mostrarCarrito = ref(false);
const cliente = ref({ nombre: '', telefono: '', direccion: '', referencia: '' });

// Cargar menú
onMounted(async () => {
    try {
        const res = await axios.get('http://localhost:3000/api/productos');
        productos.value = res.data;
    } catch(e) { console.error(e); }
});

const productosFiltrados = computed(() => {
    if(filtro.value === 'Todas') return productos.value;
    return productos.value.filter(p => p.categoria === filtro.value);
});

// Carrito Logic
const agregarAlCarrito = (prod) => {
    const existe = carrito.value.find(i => i.id_producto === prod.id_producto);
    if(existe) existe.cantidad++;
    else carrito.value.push({ ...prod, cantidad: 1, precio: parseFloat(prod.precio) });
    mostrarCarrito.value = true; // Abrir carrito al agregar para motivar la compra
};

const eliminarItem = (idx) => carrito.value.splice(idx, 1);

const totalItems = computed(() => carrito.value.reduce((acc, i) => acc + i.cantidad, 0));
const totalPagar = computed(() => carrito.value.reduce((acc, i) => acc + (i.precio * i.cantidad), 0));

// Enviar Pedido
const enviarPedido = async () => {
    const payload = {
        id_cliente: null,
        tipo_venta: 'delivery',
        total_neto: totalPagar.value,
        costo_delivery: 5.00,
        total_final: totalPagar.value + 5.00,
        metodo_pago: 'efectivo',
        id_vendedor: 1, // Asignado a Admin por defecto o un usuario "Web"
        productos: carrito.value,
        datos_cliente_delivery: cliente.value
    };

    try {
        await axios.post('http://localhost:3000/api/pedidos', payload);
        alert('¡Gracias! Tu pedido ha sido recibido. Te llamaremos para confirmar. 🍗');
        carrito.value = [];
        mostrarCarrito.value = false;
        cliente.value = { nombre: '', telefono: '', direccion: '', referencia: '' };
    } catch (error) {
        alert('Hubo un error al enviar el pedido.');
    }
};

const getImgPath = (path) => path ? `/img/${path}` : '/img/default.jpg';
</script>

<style scoped>
/* Estilos Hero */
.hero-section {
    background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/img/pollo-hero.jpg'); /* Pon una imagen buena aquí */
    background-size: cover;
    background-position: center;
    height: 500px;
    margin-top: -20px; /* Pegarlo al navbar */
}

.section-title:after {
    content: '';
    display: block;
    width: 60px;
    height: 4px;
    background: var(--primary);
    margin: 10px auto 0;
}

.product-hover {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.product-hover:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
}
</style>