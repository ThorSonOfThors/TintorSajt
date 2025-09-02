<template>
  <div>
    <input v-model="address" placeholder="Enter address" @keyup.enter="geocodeAddress" />
    <button @click="geocodeAddress">Show on Map</button>
    <div id="map" style="height: 400px; margin-top: 20px;"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';

import * as L from 'leaflet';


export default defineComponent({
  name: 'MapComponent',
  setup() {
    const address = ref('');
    let map: L.Map;
    let marker: L.Marker;

    const initMap = () => {
      map = L.map('map').setView([51.505, -0.09], 13); // default position

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
    };

    const geocodeAddress = async () => {
      if (!address.value) return;

      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address.value)}`);
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];

        map.setView([+lat, +lon], 15);

        if (marker) {
          marker.setLatLng([+lat, +lon]);
        } else {
          marker = L.marker([+lat, +lon]).addTo(map);
        }
      } else {
        alert('Address not found');
      }
    };

    onMounted(() => {
      initMap();
    });

    return {
      address,
      geocodeAddress
    };
  }
});
</script>
