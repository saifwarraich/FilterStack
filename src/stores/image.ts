import { defineStore } from "pinia";

export interface Layer {
  id: string;
  name: string;
  filter: string;
  opacity: number;
  visible: boolean;
  blendMode: string;
}

export interface FilterGroup {
  name: string;
  filters: string[];
}

interface ImageState {
  file: File | null;
  layers: Layer[];
  activeLayerId: string | null;
  filterGroups: FilterGroup[];
}

export const useImageStore = defineStore("image", {
  state: (): ImageState => ({
    file: null,
    layers: [],
    activeLayerId: null,
    filterGroups: [
      {
        name: "Vintage",
        filters: ["vintage", "sepia", "golden"],
      },
      {
        name: "Color Effects",
        filters: ["oceanic", "rosetint", "bluechrome", "perfume"],
      },
      {
        name: "Black & White",
        filters: ["grayscale", "dramatic", "firenze"],
      },
      {
        name: "Artistic",
        filters: ["oil", "frosted", "pastel_pink"],
      },
      {
        name: "Enhancement",
        filters: ["inc_brightness", "inc_contrast", "sharpen"],
      },
    ],
  }),

  getters: {
    activeLayer: (state) => state.layers.find((layer) => layer.id === state.activeLayerId),

    visibleLayers: (state) => state.layers.filter((layer) => layer.visible),

    hasLayers: (state) => state.layers.length > 0,
  },

  actions: {
    upload(file: File) {
      this.file = file;
      this.layers = [];
      this.activeLayerId = null;
    },

    addLayer(name?: string) {
      const id = `layer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const layer: Layer = {
        id,
        name: name || `Layer ${this.layers.length + 1}`,
        filter: "",
        opacity: 100,
        visible: true,
        blendMode: "normal",
      };

      this.layers.push(layer);
      this.activeLayerId = id;
    },

    removeLayer(layerId: string) {
      const index = this.layers.findIndex((layer) => layer.id === layerId);
      if (index === -1) return;

      this.layers.splice(index, 1);

      if (this.activeLayerId === layerId) {
        this.activeLayerId = this.layers.length > 0 ? this.layers[Math.max(0, index - 1)].id : null;
      }
    },

    duplicateLayer(layerId: string) {
      const layer = this.layers.find((l) => l.id === layerId);
      if (!layer) return;

      const newId = `layer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const duplicatedLayer: Layer = {
        ...layer,
        id: newId,
        name: `${layer.name} Copy`,
      };

      const index = this.layers.findIndex((l) => l.id === layerId);
      this.layers.splice(index + 1, 0, duplicatedLayer);
      this.activeLayerId = newId;
    },

    updateLayer(layerId: string, updates: Partial<Layer>) {
      const layer = this.layers.find((l) => l.id === layerId);
      if (layer) {
        Object.assign(layer, updates);
      }
    },

    moveLayer(fromIndex: number, toIndex: number) {
      if (
        fromIndex < 0 ||
        fromIndex >= this.layers.length ||
        toIndex < 0 ||
        toIndex >= this.layers.length
      ) {
        return;
      }

      const [movedLayer] = this.layers.splice(fromIndex, 1);
      this.layers.splice(toIndex, 0, movedLayer);
    },

    setActiveLayer(layerId: string) {
      if (this.layers.find((layer) => layer.id === layerId)) {
        this.activeLayerId = layerId;
      }
    },

    toggleLayerVisibility(layerId: string) {
      const layer = this.layers.find((l) => l.id === layerId);
      if (layer) {
        layer.visible = !layer.visible;
      }
    },

    selectFilter(filter: string) {
      if (this.activeLayer) {
        this.activeLayer.filter = this.activeLayer.filter === filter ? "" : filter;
      }
    },
  },
});
