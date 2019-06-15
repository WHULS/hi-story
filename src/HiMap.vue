<template>
  <div id="app">
    <main-map :identifier="identifier"></main-map>
    <function-area @dynasty-change="onDynastyChange"></function-area>
    <portrait></portrait>
    <information></information>
  </div>
</template>

<script>
// Map
import MainMap from './components/MainMap.vue';
// Function Area
import FunctionArea from './components/FunctionArea.vue';
// User portrait
import Portrait from './components/Portrait.vue';
// Map control
// Query field
// Year line
// Department information
import Information from './components/Information.vue';

export default {
  name: 'HiMap',
  components: {
    MainMap, FunctionArea, Portrait, Information
  },

  data() {
    return {
      identifier: ''
    }
  },
  methods: {
    onDynastyChange(i) {
      this.identifier = i;
    },
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
