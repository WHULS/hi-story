<template>
  <div id="app">
    <main-map></main-map>
  </div>
</template>

<script>
// Map
import MainMap from './components/MainMap.vue';
// Function button
// Map control
// Query field
// User portrait
// Year line

export default {
  name: 'HiMap',
  components: {
    MainMap
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
html, body, div {
  margin: 0;
}
</style>
