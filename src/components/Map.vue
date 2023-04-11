<template>
  <div class="world-map">
    <v-chart
      ref="map"
      :option="getMapConfig"
      autoresize
      @click="handleClick"
    />
  </div>
</template>

<script>
import {use, registerMap} from 'echarts/core';
import {CanvasRenderer} from 'echarts/renderers';
import {TooltipComponent, GeoComponent} from 'echarts/components';
import {MapChart, ScatterChart} from 'echarts/charts';
import VChart from 'vue-echarts';
import MapJson from '@/assets/map/world.json';
// https://raw.githubusercontent.com/gavinr/world-countries-centroids/master/dist/countries.geojson
import MapCentroids from '@/assets/map/centroids.json';
// https://raw.githubusercontent.com/sandstrom/country-bounding-boxes/master/bounding-boxes.json
import MapBoundingBoxes from '@/assets/map/bounding-boxes.json';

use([
  CanvasRenderer,
  MapChart,
  ScatterChart,
  GeoComponent,
  TooltipComponent
]);

registerMap('world', MapJson);

export default {
  components: {
    VChart
  },
  props: {
    country: {
      type: String,
      required: false,
      default: '',
    },
    points: {
      type: Array,
      required: false,
      default: null,
    },
  },
  emits: [
    'click',
  ],
  computed: {
    getMapConfig() {
      let config = {
        geo: {
          map: 'world',
          renderer: 'svg',
          roam: true,
          left: 0, top: 0, right: 0, bottom: 0,
          itemStyle: {
            areaColor: '#e7e8ea'
          },
          regions: [],
          silent: true
        },
        tooltip: {},
      };

      if (this.country) {
        let countryData = this.calculateCountryData();

        config['geo']['center'] = countryData['center'];
        config['geo']['boundingCoords'] = countryData['bounding'];
        config['geo']['regions'].push(
          {
            name: this.country,
            selected: true,
            itemStyle: {
              areaColor: '#fec42c',
              color: '#000'
            }
          }
        );
      }
      if (this.points) {
        config['color'] = ['#fec42c'];
        config['series'] = [
          {
            type: 'scatter',
            coordinateSystem: 'geo',
            label: {
              show: false
            },
            labelLine: {
              show: false
            },
            itemStyle: {
              borderColor: '#000'
            },
            tooltip: {
              formatter: function (params) {
                return params.value[2];
              }
            },
            data: this.points
          }
        ];
      }

      return config;
    },
  },
  methods: {
    calculateCountryData() {
      let centroid = MapCentroids['features'].find(json => json['properties']['COUNTRY'] === this.country);
      if (!centroid) {
        throw new Error("Country not found in centroids:" + this.country);
      }

      let ISOcode = centroid['properties']['ISO'];
      let boundingBox = MapBoundingBoxes[ISOcode] || null;
      if (!boundingBox) {
        throw new Error("Bounding box not found:" + this.country);
      }

      return {
        'center': centroid['geometry']['coordinates'],
        'bounding': [
          [boundingBox[1][0], boundingBox[1][1]],
          [boundingBox[1][2], boundingBox[1][3]],
        ]
      };
    },
    handleClick(...args) {
      console.log("click from echarts", ...args);
      if(args.length === 1) {
        console.log(args[0].data);
        this.$emit('click', args[0].data);
      }
    }
  }
};
</script>

<style lang="scss">
.world-map {
  aspect-ratio: 16/7;
  width: 100%;
  height:auto;
  max-height:100%;
  canvas {
    aspect-ratio: 16/7 !important;
    height: auto !important;
    max-height:100%;
  }
}
</style>
