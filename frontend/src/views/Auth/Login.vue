<template>
  <div class="login-page">
    <div class="login-container">
      <div class="card shadow-lg p-4 login-card">
        <div class="card-header text-center bg-white border-0 pb-0">
          <img src="/img/logo-polleria.avif" alt="Logo Pollería" class="mb-3 logo-login">
          <h4 class="mb-0 text-dark">Iniciar Sesión</h4>
          <p class="text-muted text-sm">Ingresa tus credenciales para acceder</p>
        </div>
        <div class="card-body">
          <form @submit.prevent="handleLogin">
            <div class="mb-3">
              <label for="email" class="form-label visually-hidden">Email</label> <input type="email" class="form-control form-control-lg" id="email" v-model="email" placeholder="Email" required>
            </div>
            <div class="mb-3">
              <label for="password" class="form-label visually-hidden">Contraseña</label> <input type="password" class="form-control form-control-lg" id="password" v-model="password" placeholder="Contraseña" required>
            </div>
            <button type="submit" class="btn btn-primary btn-lg w-100 mt-3">Acceder</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const router = useRouter();

const handleLogin = () => {
  console.log('Intentando iniciar sesión con:', email.value, password.value);
  router.push('/admin/dashboard'); 
};
</script>

<style scoped>
/* Estilos para centrar la página de login y hacerla responsive */
.login-page {
  display: flex;
  justify-content: center; /* Centrar horizontalmente */
  align-items: center; /* Centrar verticalmente */
  min-height: 100vh; /* Ocupar el 100% del alto de la ventana */
  background-color: #f0f2f5; /* Fondo suave */
  width: 100%; /* Asegura que ocupe todo el ancho */
  position: absolute; /* Para que ocupe toda la pantalla y no sea afectado por el sidebar */
  top: 0;
  left: 0;
  z-index: 1050; /* Por encima de otros elementos si hay conflicto */
}

.login-container {
  width: 100%;
  max-width: 420px; /* Ancho máximo para el formulario de login */
  padding: 1rem; /* Espaciado interno en móviles */
}

.login-card {
  border-radius: 12px; /* Bordes más redondeados */
  border: none;
  overflow: hidden; /* Para que el shadow se vea bien con los bordes */
}

.logo-login {
  max-width: 120px; /* Tamaño del logo */
  height: auto;
  margin-top: 10px; /* Pequeño margen superior */
}

/* Estilos para los inputs de Bootstrap */
.form-control-lg {
  height: 3rem; /* Inputs un poco más altos */
  font-size: 1.1rem;
}

.btn-lg {
  padding: 0.75rem 1.5rem;
  font-size: 1.1rem;
  border-radius: 8px; /* Botón con bordes redondeados */
}

/* Para pantallas más pequeñas */
@media (max-width: 576px) {
  .login-container {
    max-width: 90%; /* Ajustar el ancho en móviles */
    margin: 1rem; /* Márgenes para no pegarse a los bordes */
  }
  .logo-login {
    max-width: 100px; /* Logo más pequeño en móviles */
  }
}
</style>