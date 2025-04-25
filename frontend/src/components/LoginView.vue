<template>
  <div class="login-container">
  <img src="../assets/ineval.svg" alt="Logo de la Aplicación" class="logo">
    <h1>Iniciar Sesión</h1>
    <form @submit.prevent="login" class="login-form">
      <div class="form-group">
        <label for="email">Correo Electrónico:</label>
        <input type="email" id="email" v-model="loginForm.email" required>
      </div>
      <div class="form-group">
        <label for="password">Contraseña:</label>
        <input type="password" id="password" v-model="loginForm.password" required>
      </div>
      <button type="submit" class="login-button">Iniciar Sesión</button>
      <div v-if="error" class="error-message">{{ error }}</div>
    </form>
  </div>
</template>


<script>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

export default {
    name: 'LoginView',
  setup() {
    const loginForm = reactive({
      email: '',
      password: '',
    });
    const error = ref('');
    const apiUrl = 'http://localhost:8000/api/login';
    const router = useRouter();

    const login = async () => {
      error.value = '';
      try {
        const response = await axios.post(apiUrl, loginForm);
        if (response.data.token) {

            
          console.log('Login exitoso. Token:', response.data.token);
          localStorage.setItem('authToken', response.data.token);
          router.push('/camera');
          
          
        } else {
          error.value = 'Credenciales inválidas.';
        }
      } catch (e) {
        console.error('Error al iniciar sesión:', e);
        error.value = 'Error al iniciar sesión. Por favor, inténtalo de nuevo.';
        if (e.response && e.response.data && e.response.data.errors) {
          error.value = Object.values(e.response.data.errors).flat().join(', ');
        }
      }
    };

    return {
      loginForm,
      error,
      login,
    };
  },
};
</script>

<style scoped>

body {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  margin: 0;
  background-color: #f0f2f5;
}

.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 50vw;
  height: 65vw;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 10%;
  box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.2);
}

.login-form {
  display: flex;
  flex-direction: column;
  width: 80%; 
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input[type="email"],
.form-group input[type="password"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 5px;
  box-sizing: border-box;
}

.login-button {
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: bold;
}

.login-button:hover {
  background-color: #0056b3;
}

.logo {
  width: 15vw;
  height: auto;
  margin-bottom: -10px;
}
.error-message {
  color: red;
  margin-top: 15px;
  text-align: center;
}
</style>
