<template>
  <div class="flex gap-6 min-h-screen justify-center">
    <!-- Canvas Area - Left Side -->
    <div class="w-full max-w-2xl">
      <div class="bg-slate-900 rounded-lg p-4 border border-slate-800 flex justify-center mb-6">
        <canvas
          width="448"
          height="448"
          class="rounded border border-slate-700 bg-slate-800"
          style="width: 448px; height: 448px"
          ref="canvasRef"
        ></canvas>
      </div>

      <!-- Action Buttons -->
      <div class="flex space-x-3 max-w-md mx-auto">
        <button
          @click="resetToOriginal"
          class="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-medium py-3 px-4 rounded-md border border-slate-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-950 flex items-center justify-center space-x-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span>Reset</span>
        </button>

        <a :href="canvasImageURL" download="filtered-image.png" class="flex-1">
          <button
            class="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-950 flex items-center justify-center space-x-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span>Download</span>
          </button>
        </a>
      </div>
    </div>

    <!-- Fixed Right Sidebar - Photoshop Style -->
    <div
      class="w-80 fixed right-0 top-0 bottom-0 bg-slate-950 border-l border-slate-800 flex flex-col"
    >
      <!-- Sidebar Header -->
      <div class="flex-shrink-0 px-4 py-3 border-b border-slate-800">
        <h2 class="text-white font-semibold text-lg">Tools</h2>
      </div>

      <!-- Filter Groups Panel - Upper Section -->
      <div class="flex-shrink-0 border-b border-slate-800">
        <FilterGroupsPanel />
      </div>

      <!-- Layers Panel - Lower Section -->
      <div class="flex-1 min-h-0">
        <LayersPanel />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch } from "vue";
import { useImageStore } from "@/stores/image";
import useReader from "@/composables/use-reader";
import useCanvas from "@/composables/use-canvas";
import LayersPanel from "@/components/LayersPanel.vue";
import FilterGroupsPanel from "@/components/FilterGroupsPanel.vue";

const store = useImageStore();
const { canvasRef, loadImage, drawOriginalImage, renderLayers, canvasImageURL } = useCanvas();

const { reader } = useReader(store.file, () => {
  if (!reader.result) return;

  const dataURL = reader.result.toString();
  loadImage(dataURL);
});

// Watch for changes in layers and re-render
watch(
  () => store.layers,
  (layers) => {
    if (layers.length > 0) {
      renderLayers(layers);
    }
  },
  { deep: true },
);

// Watch for changes in active layer and re-render
watch(
  () => store.activeLayerId,
  () => {
    if (store.layers.length > 0) {
      renderLayers(store.layers);
    }
  },
);

function resetToOriginal() {
  store.layers = [];
  store.activeLayerId = null;
  drawOriginalImage();
}
</script>
