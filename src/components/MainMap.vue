<template>
  <div id="map" :style="MapStyle"></div>
</template>

<script>
// Openlayers based modules
import 'ol/ol.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';

// Map Control
import {defaults} from 'ol/control'

export default {
  name: 'MainMap',
  data() {
    return {
      Map: {},
      View: {},
      Layers: [],
      MapStyle: {
        height: innerHeight + 'px',
        width: innerWidth + 'px'
      }
    }
  },

  created() {
    const self = this;

    onresize = e => {
      let win = e.currentTarget;
      self.MapStyle.height = win.innerHeight + 'px';
      self.MapStyle.width = win.innerWidth + 'px';
    }
  },


  mounted() {
    const self = this;
    // View
    const center = [12175093.67465372, 4209022.808896985];
    const zoom = 4;
    const projecton = 'EPSG:3857';

    self.View = new View({
      center: center,
      zoom: zoom,
      projecton: projecton,
    });

    // Layers
    const osmLayer = new TileLayer({
      source: new OSM(),
      opacity: 1
    });
    self.Layers.push(osmLayer);

    // Map
    self.Map = new Map({
      target: 'map',
      view: self.View,
      layers: self.Layers,
      controls: defaults({
        attribution: false,
        rotate: false,
        zoom: false
      }),
    });

    self.map.on('click', event => {
      console.log('(' + event.coordinate.toString() + ') ' + event.map.getView().getZoom());
    });
  },
}
</script>

<style scoped>

</style>