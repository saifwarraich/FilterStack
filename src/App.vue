<template>
  <div class="min-h-screen bg-slate-900">
    <div v-if="!store.file" class="flex items-center justify-center min-h-screen py-8 px-4">
      <div class="max-w-2xl w-full">
        <div class="text-center mb-8">
          <h1 class="text-4xl font-bold text-white mb-3">FilterStack</h1>
          <p class="text-slate-400 text-lg">Advanced layered filters, no cloud upload</p>
        </div>
        <ImageUpload />
      </div>
    </div>

    <div v-else class="pr-80">
      <div class="bg-slate-900 px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-white">FilterStack</h1>
            <p class="text-slate-400 text-sm">Powered by WebAssembly</p>
          </div>
          <button
            @click="store.upload(null as any)"
            class="bg-slate-700 hover:bg-slate-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-950 flex items-center space-x-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <span>New Image</span>
          </button>
        </div>
      </div>

      <div class="p-6">
        <ImageEditor />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useImageStore } from "@/stores/image";

const store = useImageStore();
</script>
