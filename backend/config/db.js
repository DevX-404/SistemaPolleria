const mysql = require('mysql2/promise');
require('dotenv').config();

// Configuración de la conexión a la base de datos
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root', // Cambia 'root' por tu usuario
    password: process.env.DB_PASSWORD || '123456', // Coloca tu contraseña
    database: process.env.DB_NAME || 'polleria_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Función de prueba para verificar la conexión
async function checkConnection() {
    try {
        await pool.getConnection();
        console.log('✅ Conexión a la base de datos establecida correctamente.');
    } catch (error) {
        console.error('❌ Error al conectar a la base de datos:', error.message);
        process.exit(1); // Sale del proceso si la conexión falla
    }
}

// Exportamos el pool para usarlo en los controladores
module.exports = { pool, checkConnection };