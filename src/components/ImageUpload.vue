<template>
  <div class="mb-8">
    <div
      class="relative border-2 border-dashed border-slate-700 rounded-lg p-12 text-center hover:border-purple-500 transition-colors duration-200 bg-slate-900/50"
      @drag.prevent.stop=""
      @dragstart.prevent.stop=""
      @dragend.prevent.stop=""
      @dragover.prevent.stop=""
      @dragenter.prevent.stop=""
      @dragleave.prevent.stop=""
      @drop.prevent.stop="handleDrop"
    >
      <div class="flex flex-col items-center space-y-4">
        <svg class="w-12 h-12 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <div>
          <p class="text-slate-300 font-medium">Drag and drop your image here</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useImageStore } from "@/stores/image";

const store = useImageStore();

const handleDrop = (e: DragEvent) => {
  if (!e.dataTransfer) return;

  const file = e.dataTransfer.files[0];
  if (!file.type.match("image.*")) return;

  store.upload(file);
};
</script>
