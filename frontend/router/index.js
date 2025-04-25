import { createRouter, createWebHashHistory } from 'vue-router';
import LoginView from '../src/components/LoginView.vue';
import CameraView from '../src/components/Camera.vue'; 

const routes = [
    
  {
        path: '/',
        redirect: '/login',
  },
    
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
  },
  {
    path: '/camera',
    name: 'Camera',
    component: CameraView,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
