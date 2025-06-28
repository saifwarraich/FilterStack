<template>
  <div
    class="font-sans max-w-2xl bg-slate-950 border border-slate-800 p-8 rounded-lg shadow-2xl absolute m-auto left-0 right-0 mt-16"
  >
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-white mb-2">Photo Filters</h1>
      <p class="text-slate-400 text-sm">Transform your images with custom filters</p>
    </div>

    <ImageUpload />

    <div class="mb-8">
      <div class="bg-slate-900 rounded-lg p-4 border border-slate-800">
        <canvas
          width="448"
          height="448"
          class="w-full h-auto rounded border border-slate-700 bg-slate-800"
        ></canvas>
      </div>
    </div>

    <div class="space-y-4">
      <div class="grid grid-cols-3 gap-3">
        <button
          type="button"
          class="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-950"
        >
          Vintage
        </button>
        <button
          type="button"
          class="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-950"
        >
          Sepia
        </button>
        <button
          type="button"
          class="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-950"
        >
          Blur
        </button>
      </div>

      <button
        class="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 px-4 rounded-md border border-slate-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-950 flex items-center justify-center space-x-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <span>Download Image</span>
      </button>
    </div>
  </div>
</template>
