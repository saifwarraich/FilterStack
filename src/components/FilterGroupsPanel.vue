<template>
  <div class="px-4 py-3 h-80 flex flex-col">
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-white font-medium text-sm">FILTERS</h3>
      <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z"
        />
      </svg>
    </div>

    <div v-if="!store.activeLayer" class="flex-1 flex items-center justify-center text-slate-500">
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
            d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1a1 1 0 011-1h2a1 1 0 011 1v14a1 1 0 01-1 1H4a1 1 0 01-1-1V1a1 1 0 011-1h2a1 1 0 011 1v3z"
          />
        </svg>
        <p class="text-xs">Select a layer first</p>
      </div>
    </div>

    <div v-else class="flex-1 overflow-y-auto scrollbar-hide space-y-2">
      <div v-for="group in store.filterGroups" :key="group.name" class="space-y-1">
        <button
          @click="toggleGroup(group.name)"
          class="flex items-center justify-between w-full text-left text-slate-300 hover:text-white transition-colors duration-200 py-1"
        >
          <span class="font-medium text-xs uppercase tracking-wide">{{ group.name }}</span>
          <svg
            class="w-3 h-3 transition-transform duration-200"
            :class="{ 'rotate-180': expandedGroups.has(group.name) }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        <div v-show="expandedGroups.has(group.name)" class="grid grid-cols-2 gap-1 pl-1">
          <button
            v-for="filter in group.filters"
            :key="filter"
            @click="store.selectFilter(filter)"
            class="text-xs font-medium py-1.5 px-2 rounded transition-colors duration-200 focus:outline-none"
            :class="{
              'bg-blue-600 hover:bg-blue-700 text-white': store.activeLayer?.filter === filter,
              'bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600':
                store.activeLayer?.filter !== filter,
            }"
          >
            {{ formatFilterName(filter) }}
          </button>
        </div>
      </div>

      <div class="pt-2 mt-2 border-t border-slate-700">
        <button
          @click="store.selectFilter('')"
          class="w-full bg-slate-700 hover:bg-slate-600 text-slate-300 font-medium py-1.5 px-2 rounded transition-colors duration-200 focus:outline-none text-xs border border-slate-600"
        >
          Clear Filter
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useImageStore } from "@/stores/image";

const store = useImageStore();
const expandedGroups = ref(new Set(["Color Effects"]));

function toggleGroup(groupName: string) {
  if (expandedGroups.value.has(groupName)) {
    expandedGroups.value.delete(groupName);
  } else {
    expandedGroups.value.add(groupName);
  }
}

function formatFilterName(filter: string): string {
  return filter.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}
</script>
