<template>
  <div class="px-4 py-3 flex flex-col h-full">
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-white font-medium text-sm">LAYERS</h3>
      <button
        @click="store.addLayer()"
        class="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs font-medium transition-colors duration-200 flex items-center space-x-1"
      >
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        <span>Add</span>
      </button>
    </div>

    <div class="flex-1 overflow-y-auto scrollbar-hide space-y-1 min-h-0">
      <div
        v-for="(layer, index) in [...store.layers].reverse()"
        :key="layer.id"
        class="border border-slate-600 rounded p-2 transition-all duration-200 cursor-pointer"
        :class="{
          'bg-blue-600/20 border-blue-500': store.activeLayerId === layer.id,
          'bg-slate-800/50 hover:bg-slate-800 border-slate-600': store.activeLayerId !== layer.id,
        }"
        @click="store.setActiveLayer(layer.id)"
      >
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center space-x-2 flex-1 min-w-0">
            <button
              @click.stop="store.toggleLayerVisibility(layer.id)"
              class="text-slate-400 hover:text-white transition-colors duration-200 flex-shrink-0"
            >
              <svg v-if="layer.visible" class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path
                  fill-rule="evenodd"
                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clip-rule="evenodd"
                />
              </svg>
              <svg v-else class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                  clip-rule="evenodd"
                />
                <path
                  d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"
                />
              </svg>
            </button>
            <input
              v-model="layer.name"
              @click.stop
              @change="store.updateLayer(layer.id, { name: layer.name })"
              class="bg-transparent text-white text-xs font-medium border-none outline-none focus:bg-slate-700 px-1 rounded flex-1 min-w-0"
            />
          </div>

          <div class="flex items-center space-x-1 flex-shrink-0">
            <button
              @click.stop="store.duplicateLayer(layer.id)"
              class="text-slate-400 hover:text-white p-0.5 transition-colors duration-200"
              title="Duplicate"
            >
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </button>
            <button
              @click.stop="store.removeLayer(layer.id)"
              class="text-slate-400 hover:text-red-400 p-0.5 transition-colors duration-200"
              title="Delete"
            >
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>

        <div class="text-xs text-slate-400 mb-2 truncate">
          {{ layer.filter || "No filter" }}
        </div>

        <div class="space-y-1.5">
          <div class="flex items-center space-x-2">
            <label class="text-xs text-slate-400 w-8 flex-shrink-0">Opa</label>
            <input
              type="range"
              min="0"
              max="100"
              :value="layer.opacity"
              @input="
                store.updateLayer(layer.id, {
                  opacity: parseInt(($event.target as HTMLInputElement).value),
                })
              "
              @click.stop
              class="flex-1 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <span class="text-xs text-slate-400 w-8 text-right flex-shrink-0"
              >{{ layer.opacity }}%</span
            >
          </div>

          <div class="flex items-center space-x-2">
            <label class="text-xs text-slate-400 w-8 flex-shrink-0">Mix</label>
            <select
              :value="layer.blendMode"
              @change="
                store.updateLayer(layer.id, {
                  blendMode: ($event.target as HTMLSelectElement).value,
                })
              "
              @click.stop
              class="flex-1 bg-slate-700 text-white text-xs rounded px-1 py-0.5 border border-slate-600 focus:border-blue-500 outline-none"
            >
              <option value="normal">Normal</option>
              <option value="multiply">Multiply</option>
              <option value="screen">Screen</option>
              <option value="overlay">Overlay</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="!store.hasLayers"
      class="flex-1 flex items-center justify-center text-slate-500 min-h-0"
    >
      <div class="text-center">
        <svg
          class="w-8 h-8 mx-auto mb-2 text-slate-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1a1 1 0 011-1h2a1 1 0 011 1v14a1 1 0 01-1-1H4a1 1 0 01-1-1V1a1 1 0 011-1h2a1 1 0 011 1v3z"
          />
        </svg>
        <p class="text-xs">No layers yet</p>
        <p class="text-xs mt-1 text-slate-600">Click Add to start</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useImageStore } from "@/stores/image";

const store = useImageStore();
</script>

<style scoped>
.slider::-webkit-slider-thumb {
  appearance: none;
  height: 12px;
  width: 12px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: 2px solid #ffffff;
}

.slider::-moz-range-thumb {
  height: 12px;
  width: 12px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: 2px solid #ffffff;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
