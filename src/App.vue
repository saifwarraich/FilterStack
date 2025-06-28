<template>
  <div
    class="font-sans max-w-2xl bg-slate-950 border border-slate-800 p-8 rounded-lg shadow-2xl absolute m-auto left-0 right-0 mt-16"
  >
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-white mb-2">Photo Filters</h1>
      <p class="text-slate-400 text-sm">Transform your images with custom filters</p>
    </div>

    <ImageUpload v-if="!store.file" />
    <ImageEditor v-if="store.file" />
  </div>
</template>

<script setup lang="ts">
import { useImageStore } from "@/stores/image";

const store = useImageStore();
</script>
