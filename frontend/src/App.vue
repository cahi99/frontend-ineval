<template>
  <div id="app">
    <router-view></router-view>
    </div>


  
</template>

<script>
import { RouterView } from 'vue-router';

export default {
  name: 'App',
  components: {
    RouterView
  }
}
</script>

<style>
body, #app {
  display: flex;
  justify-content: center; 
  align-items: center; 
  min-height: 100vh; 
  margin: 0; 
  background-color: #f0f2f5; 
}
</style>
