<template>
  <div class="information">
    <a href="http://study.rsgis.whu.edu.cn/hi-story" target="_blank"><img src="../assets/logo.png"/></a>
    <div class="bottom-information">
      <div>
        <a href="https://www.whu.edu.cn/" target="_blank">武汉大学</a>
      </div>
      |
      <div>
        <a href="http://rsgis.whu.edu.cn/" target="_blank">遥感信息工程学院</a>
      </div>
      |
      <div>
        <a href="https://www.openstreetmap.org/" target="_blank">OpenStreetMap</a>
      </div>
      |
      <div>
        <a href="https://www.openlayers.org/" target="_blank">Openlayers</a>
      </div>
      |
      <a href="https://projects.iq.harvard.edu/cbdb" target="_blank">China Biographical Database Peoject(CBDB)</a>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      
    }
  },
}
</script>

<style>
.information {
  position: absolute;
  bottom: 0;
  left: 5px;
  text-align: left;
}
.information img {
  height: 50px;
  width: auto;
}
.bottom-information {
  background-color: rgba(255, 255, 255, 0.8);
  padding: 0 5px;
}
.bottom-information div{
  display: inline-block;
}
.bottom-information a{
  color: inherit;
  text-decoration: none;
}
.bottom-information a:hover {
  text-decoration: underline;
  color: #0c88e8;
}
</style>
