<template>
  <div id="app">
    <DetailDomCompo />
  </div>
</template>

<script>
import DetailDomCompo from './components/detailDomCompo.vue'

export default {
  name: 'App',
  components: {
    DetailDomCompo
  }
}
</script>

<style>
#app {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
  margin-top: 0 auto;
}
</style>
