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
import {defaults} from 'ol/control';

// WMTS loader
import WMTS, {optionsFromCapabilities} from 'ol/source/WMTS';
import WMTSCapabilities from 'ol/format/WMTSCapabilities';

// Drawing tools
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import CircleStyle from 'ol/style/Circle';
import {Style, Fill, Stroke} from 'ol/style';
import Polygon from 'ol/geom/Polygon';
import Draw from 'ol/interaction/Draw';

import bus from './bus.js';

import $ from 'jquery';

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
      },
      basedLayer: new TileLayer({
        opacity: 0.7
      }),
      wmtsLayer: new TileLayer({
        opacity: 0.8
      }),
      drawingLayer: new VectorLayer({
        source: new VectorSource({ wrapX: false }),
        style: new Style({
          fill: new Fill({                  // Fill style
            color: [255, 255, 255, 0.2]
          }),

          stroke: new Stroke({              // Border style
            color: '#ffcc33',
            width: 2
          }),

          image: new CircleStyle({          // Point style
            radius: 7,
            fill: new Fill({
              color: '#ffcc33'
            })
          }),

        }),
      }),
      wmtsResults: undefined
    }
  },

  props: {
    identifier: {
      type: String,
      required: false
    }
  },

  watch: {
    identifier: function (val, oldVal) {
      if (val !== oldVal) {
        this.setWmtsSource(val);
      }
    }
  },

  created() {
    const self = this;

    onresize = e => {
      let win = e.currentTarget;
      self.MapStyle.height = win.innerHeight + 'px';
      self.MapStyle.width = win.innerWidth + 'px';
    };

    bus.$on('screen-shot', _ => {
      self.screenShot();
    });
  },


  mounted() {
    const self = this;
    // View
    const center = [12175093.67465372, 4209022.808896985];
    const zoom = 5;
    const projecton = 'EPSG:3857';

    self.View = new View({
      center: center,
      zoom: zoom,
      projecton: projecton,
    });

    // Layers
    self.basedLayer.setSource(new OSM());
    self.setWmtsSource('ad1208');
    self.Layers = [
      self.basedLayer,
      self.wmtsLayer,
      self.drawingLayer
    ]

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

    self.Map.on('click', event => {
      console.log('(' + event.coordinate.toString() + ') ' + event.map.getView().getZoom());
    });
  },

  methods: {
    setWmtsSource(identifier) {
      const self = this;

      if (identifier === 'now') {
        self.wmtsLayer.setSource(null);
        return;
      }
      
      if (self.wmtsResults === undefined)
      {
        let parser = new WMTSCapabilities();
        
        let wmtsString = 'http://gis.sinica.edu.tw/ccts/wmts/1.0.0/WMTSCapabilities.xml';
        fetch(wmtsString)
        .then( response => {
          return response.text();
        }).then( data => {
          // Parse WMTS data
          // results.Contents.Layer.Title/.Identifier
          let results = parser.read(data);
          self.wmtsResults = results;

          let options = optionsFromCapabilities(results, {
            layer: identifier,
            matrixSet: 'GoogleMapsCompatible'
          });
          
          self.wmtsLayer.setSource(new WMTS(options));
        });
      }
      else
      {
        let results = self.wmtsResults;
        let options = optionsFromCapabilities(results, {
          layer: identifier,
          matrixSet: 'GoogleMapsCompatible'
        });

        self.wmtsLayer.setSource(new WMTS(options));
      }
    },
    // Drawing on drawingLayer
    screenShot() {
      const self = this;

      // Reset drawingLayer
      self.drawingLayer.setSource(new VectorSource({ wrapX: false }));

      // Get drawer
      let source = self.drawingLayer.getSource();
      let type = 'LineString';
      let maxPoints = 2;
      let geometryFunction = (coordinates, geometry) => {
        if (!geometry) {
          geometry = new Polygon(coordinates); // 多边形
        }
        let start = coordinates[0];
        let end = coordinates[1];
        geometry.setCoordinates([
          [start, [start[0], end[1]], end, [end[0], start[1]], start]
        ]);
        return geometry;
      };
      const drawer = new Draw({
        source: source,
        type: type,
        maxPoints: maxPoints,
        geometryFunction: geometryFunction
      });
      drawer.on('drawend', ev => {
        self.onDrawEnd(ev);

        setTimeout(() => {
          document.onclick = () => {
            self.drawingLayer.setSource(new VectorSource({ wrapX: false }));
            document.onclick = null;
          };
        }, 0);
      });

      self.Map.addInteraction(drawer);
    },
    onDrawEnd(event) {
      const self = this;
      // Clear source and drawer
      self.Map.removeInteraction(event.target);

      // Get drawing rectangle
      const rect = event.feature.getGeometry().getExtent();

      // Emit screen shot over event
      bus.$emit('screen-shotted', rect);

      // Rebuild rectangle area
      let canvas = self.Map.renderer_.canvas_;
      let ctx = canvas.getContext('2d');
      let top_left_pt = self.Map.getPixelFromCoordinate([rect[0], rect[3]]);
      let bottom_right_pt = self.Map.getPixelFromCoordinate([rect[2], rect[1]]);

      let x = top_left_pt[0];
      let width = bottom_right_pt[0] - x;
      let y = top_left_pt[1]
      let height = bottom_right_pt[1] - y;
      
      // let rectDataWrap = ctx.getImageData(x, y, width, height);
      
      // // Create filename
      // let currentTime = (new Date()).getTime();

      // // Create new canvas
      // let outputCanvas = $('<canvas style="display:none;" id="' + currentTime + '" width="' + width + '" height="' + height + '"></canvas>')[0];
      // outputCanvas.getContext("2d").putImageData(rectDataWrap, 0, 0);

      // // Download by tag <a></a>
      // let $a = $("<a></a>").attr("href", canvas.toDataURL('image/png')).attr("download", currentTime + ".png");
      // self.$message({
      //   type: 'success',
      //   message: '开始下载: [' + currentTime + '.png]'
      // });
      // $a[0].click();

      // // Delete tag <a></a>
      // $('#' + currentTime).remove();
    }
  },
}
</script>