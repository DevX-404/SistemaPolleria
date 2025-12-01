const express = require('express');
const cors = require('cors');
const { checkConnection } = require('./config/db');
const productosRoutes = require('./routes/productosRoutes');
const pedidosRoutes = require('./routes/pedidosRoutes');
const clientesRoutes = require('./routes/clientesRoutes');
const statsRoutes = require('./routes/statsRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000; // Elige el puerto que prefieras

// Middleware
app.use(cors()); // Permite peticiones desde el frontend (Vite)
app.use(express.json()); // Habilita el parsing de JSON en el body de las peticiones

// Rutas
app.use('/api/productos', productosRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/stats', statsRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('API de Pollería funcionando.');
});

// Iniciar servidor y verificar conexión a DB
checkConnection().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Servidor Node.js corriendo en http://localhost:${PORT}`);
    });
}).catch(error => {
    console.error('No se pudo iniciar el servidor debido a errores de DB:', error);
});