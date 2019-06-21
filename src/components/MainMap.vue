<template>
<div>
  <div id="map" :style="MapStyle"></div>
  <div class="map-overlays" id="map-overlays">
    <div v-for="i in overlayNumber" :key="i" :id="'overlay-div-' + i">
      <img class="img-overlay" src="../assets/position.png"/>
    </div>
  </div>
  <div class="route-hide-button" v-show="isRouteButtonShow" @click="onRouteHideButtonClicked">隐藏路线</div>
</div>
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

// Feature and LineString to create curve route
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import LineString from 'ol/geom/LineString';

import Overlay from 'ol/Overlay.js';
import {fromLonLat, toLonLat} from 'ol/proj';

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
      routeLayer: new VectorLayer({
        source: new VectorSource({ warpX: false }),
        style: new Style({
          fill: new Fill({     // File style
            color: [255, 255, 255, 0.2]
          }),
          stroke: new Stroke({ // Border style
            color: '#0420f4',
            width: 2
          }),
        })
      }),

      wmtsResults: undefined,

      overlayNumber: 0,
      overlays: [],
      events: [],

      isRouteButtonShow: false
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
    },
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

    bus.$on('show-events', events => {
      self.events = events;
      self.overlayNumber = events.length;
      self.overlays = [];
    });
  },

  updated() {
    const self = this;
    self.showPersonEvents();
  },


  mounted() {
    const self = this;
      
    // View
    const center = fromLonLat([114.35373902320862, 30.52881696263104]);
    const zoom = 6.5;
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
      self.drawingLayer,
      self.routeLayer
    ];

    let point1Feature = new Feature({
      geometry: new LineString([fromLonLat])
    });
    let point2Feature = new Feature({
      geometry: new Point([0, 0])
    });
    self.drawingLayer.getSource().addFeature(point1Feature);
    // self.drawingLayer.getSource().addFeature(point2Feature);

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
      overlays: self.overlays
    });

    self.Map.on('click', event => {
      console.log('(' + toLonLat(event.coordinate).toString() + ') ' + event.map.getView().getZoom());
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
    },
    showPersonEvents() {
      const self = this;
      let events = [];
      self.events.forEach(e => {
        if (e.LON && e.LAT) {
          events.push(e);
        }
      });
      
      // Show points overlay
      for (let i = 0; i < events.length; i++)
      {
        let coordinate = [parseFloat(events[i].LON), parseFloat(events[i].LAT)];

        if (coordinate[0] && coordinate[1]) {
          let el = $("#overlay-div-" + (i + 1))[0];
          self.overlays.push(new Overlay({
            position: fromLonLat(coordinate),
            positioning: 'center-center',
            element: el
          }));
        }
      }
      
      self.overlays.forEach( e => {
        self.Map.addOverlay(e);
      });
      self.Map.render();

      // Get curve route
      events.sort( (a, b) => {
        return a.YEAR > b.YEAR;
      });
      let curveLineString = [];
      for (let i = 0; i < events.length-1; i++)
      {
        let pt1 = {
          lng: events[i].LON,
          lat: events[i].LAT
        };
        let pt2 = {
          lng: events[i+1].LON,
          lat: events[i+1].LAT
        };

        curveLineString.push(self.getCurveByTwoPoints(pt1, pt2).map(e => {
          return fromLonLat(e);
        }));
      }

      // Draw curve
      let curveFeatures = curveLineString.map(line => {
        return new Feature({
          geometry: new LineString(line)
        });
      })

      self.routeLayer.getSource().addFeatures(curveFeatures);

      self.isRouteButtonShow = true;
    },

    onRouteHideButtonClicked() {
      const self = this;
      self.isRouteButtonShow = false;

      self.overlayNumber = 0;
      self.overlays = [];
      self.events = [];

      self.routeLayer.getSource().clear();

      self.Map.render();
    },

    /**
     * 根据两点获取曲线坐标点数组
     * @param Point 起点
     * @param Point 终点
     */
    getCurveByTwoPoints(obj1, obj2) {
      if (!obj1 || !obj2) {
        return null;
      }

      var B1 = function(x) {
        return 1 - 2 * x + x * x;
      };
      var B2 = function(x) {
        return 2 * x - 2 * x * x;
      };
      var B3 = function(x) {
        return x * x;
      };

      let curveCoordinates = [];

      var count=30; // 曲线是由一些小的线段组成的，这个表示这个曲线所有到的折线的个数
      var isFuture=false;
      var t, h, h2, lat3, lng3, j, t2;
      var LnArray = [];
      var i = 0;
      var inc = 0;

      var lat1 = parseFloat(obj1.lat);
      var lat2 = parseFloat(obj2.lat);
      var lng1 = parseFloat(obj1.lng);
      var lng2 = parseFloat(obj2.lng);
        
      // 计算曲线角度的方法
      if (lng2 > lng1) {
        if (parseFloat(lng2-lng1) > 180) {
          if (lng1 < 0) {
            lng1 = parseFloat(180 + 180 + lng1);
          }
        }
      }
      
      if (lng1 > lng2) {
        if (parseFloat(lng1-lng2) > 180) {
          if (lng2 < 0) {
            lng2 = parseFloat(180 + 180 + lng2);
          }
        }
      }
      j = 0;
      t2 = 0;
      if (lat2 == lat1) {
        t = 0;
        h = lng1 - lng2;
      } else if (lng2 == lng1) {
        t = Math.PI / 2;
        h = lat1 - lat2;
      } else {
        t = Math.atan((lat2 - lat1) / (lng2 - lng1));
        h = (lat2 - lat1) / Math.sin(t);
      }
      if (t2 == 0) {
        t2 = (t + (Math.PI / 5));
      }
      h2 = h / 2;
      lng3 = h2 * Math.cos(t2) + lng1;
      lat3 = h2 * Math.sin(t2) + lat1;

      for (i = 0; i < count + 1; i++) {
        curveCoordinates.push([
          (lng1 * B1(inc) + lng3 * B2(inc)) + lng2 * B3(inc),
          (lat1 * B1(inc) + lat3 * B2(inc) + lat2 * B3(inc))
        ]);
        inc = inc + (1 / count);
      }
      return curveCoordinates;
    }
  },
}
</script>

<style>
.map-overlays {
  display: none;
}
.img-overlay {
  height: 30px;
  width: auto;
  position: absolute;
  left: -15px;
  bottom: -5px;
}
.route-hide-button {
  position: absolute;
  top: 20px;
  right: 375px;
  background-color: white;
  height: 35px;
  line-height: 35px;
  padding: 0 10px;
  border-radius: 3px;
  box-shadow: 1px 2px 1px rgba(0, 0, 0, .15);
  cursor: pointer;
}
</style>
