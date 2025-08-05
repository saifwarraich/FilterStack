import { ref } from "vue";
import init, { open_image, filter, putImageData } from "@silvia-odwyer/photon";
import type { Layer } from "@/stores/image";

export default function useCanvas() {
  const canvasRef = ref<HTMLCanvasElement | null>(null);
  const layerCanvases = ref<Map<string, HTMLCanvasElement>>(new Map());
  let canvasCtx: CanvasRenderingContext2D | null = null;
  const imageElem = new Image();
  let photonInitialized = false;
  const canvasImageURL = ref("");
  let originalImageData: ImageData | null = null;

  async function initPhoton() {
    if (!photonInitialized) {
      await init();
      photonInitialized = true;
    }
  }

  function calculateAspectRatio(
    srcWidth: number,
    srcHeight: number,
    maxWidth: number,
    maxHeight: number,
  ) {
    const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
    return { width: srcWidth * ratio, height: srcHeight * ratio };
  }

  function loadImage(url: string) {
    if (!canvasRef.value) return;

    canvasCtx = canvasRef.value.getContext("2d");
    imageElem.addEventListener("load", drawOriginalImage);
    imageElem.src = url;
  }

  function drawOriginalImage() {
    if (!canvasCtx || !canvasRef.value) return;

    canvasRef.value.width = 448;
    canvasRef.value.height = 448;

    const imgDim = calculateAspectRatio(imageElem.naturalWidth, imageElem.naturalHeight, 448, 448);

    const offsetX = (448 - imgDim.width) / 2;
    const offsetY = (448 - imgDim.height) / 2;

    canvasCtx.clearRect(0, 0, 448, 448);

    canvasCtx.drawImage(imageElem, offsetX, offsetY, imgDim.width, imgDim.height);

    originalImageData = canvasCtx.getImageData(0, 0, 448, 448);
    canvasImageURL.value = canvasRef.value.toDataURL();
  }

  function createLayerCanvas(width: number, height: number): HTMLCanvasElement {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }

  async function applyFilterToLayer(
    layer: Layer,
    sourceImageData: ImageData,
  ): Promise<ImageData | null> {
    if (!layer.filter.trim()) return sourceImageData;

    await initPhoton();

    const tempCanvas = createLayerCanvas(448, 448);
    const tempCtx = tempCanvas.getContext("2d");
    if (!tempCtx) return null;

    tempCtx.putImageData(sourceImageData, 0, 0);

    try {
      const photonImage = open_image(tempCanvas, tempCtx);
      filter(photonImage, layer.filter);
      putImageData(tempCanvas, tempCtx, photonImage);

      return tempCtx.getImageData(0, 0, 448, 448);
    } catch (error) {
      console.error(`Error applying filter ${layer.filter}:`, error);
      return sourceImageData;
    }
  }

  function blendLayers(
    baseImageData: ImageData,
    overlayImageData: ImageData,
    opacity: number,
    blendMode: string,
  ): ImageData {
    const result = new ImageData(
      new Uint8ClampedArray(baseImageData.data),
      baseImageData.width,
      baseImageData.height,
    );
    const alpha = opacity / 100;

    for (let i = 0; i < result.data.length; i += 4) {
      const baseR = baseImageData.data[i];
      const baseG = baseImageData.data[i + 1];
      const baseB = baseImageData.data[i + 2];
      const baseA = baseImageData.data[i + 3];

      const overlayR = overlayImageData.data[i];
      const overlayG = overlayImageData.data[i + 1];
      const overlayB = overlayImageData.data[i + 2];
      const overlayA = overlayImageData.data[i + 3];

      if (blendMode === "normal" || !blendMode) {
        result.data[i] = baseR + (overlayR - baseR) * alpha;
        result.data[i + 1] = baseG + (overlayG - baseG) * alpha;
        result.data[i + 2] = baseB + (overlayB - baseB) * alpha;
        result.data[i + 3] = Math.max(baseA, overlayA * alpha);
      } else if (blendMode === "multiply") {
        result.data[i] = baseR + ((baseR * overlayR) / 255 - baseR) * alpha;
        result.data[i + 1] = baseG + ((baseG * overlayG) / 255 - baseG) * alpha;
        result.data[i + 2] = baseB + ((baseB * overlayB) / 255 - baseB) * alpha;
        result.data[i + 3] = Math.max(baseA, overlayA * alpha);
      } else if (blendMode === "screen") {
        result.data[i] = baseR + (255 - ((255 - baseR) * (255 - overlayR)) / 255 - baseR) * alpha;
        result.data[i + 1] =
          baseG + (255 - ((255 - baseG) * (255 - overlayG)) / 255 - baseG) * alpha;
        result.data[i + 2] =
          baseB + (255 - ((255 - baseB) * (255 - overlayB)) / 255 - baseB) * alpha;
        result.data[i + 3] = Math.max(baseA, overlayA * alpha);
      } else if (blendMode === "overlay") {
        const blendR =
          baseR < 128
            ? (2 * baseR * overlayR) / 255
            : 255 - (2 * (255 - baseR) * (255 - overlayR)) / 255;
        const blendG =
          baseG < 128
            ? (2 * baseG * overlayG) / 255
            : 255 - (2 * (255 - baseG) * (255 - overlayG)) / 255;
        const blendB =
          baseB < 128
            ? (2 * baseB * overlayB) / 255
            : 255 - (2 * (255 - baseB) * (255 - overlayB)) / 255;

        result.data[i] = baseR + (blendR - baseR) * alpha;
        result.data[i + 1] = baseG + (blendG - baseG) * alpha;
        result.data[i + 2] = baseB + (blendB - baseB) * alpha;
        result.data[i + 3] = Math.max(baseA, overlayA * alpha);
      }
    }

    return result;
  }

  async function renderLayers(layers: Layer[]) {
    if (!canvasCtx || !canvasRef.value || !originalImageData) return;

    let compositeImageData = new ImageData(new Uint8ClampedArray(originalImageData.data), 448, 448);

    const visibleLayers = layers.filter((layer) => layer.visible);

    for (const layer of visibleLayers) {
      if (layer.filter.trim()) {
        const filteredImageData = await applyFilterToLayer(layer, originalImageData);
        if (filteredImageData) {
          compositeImageData = blendLayers(
            compositeImageData,
            filteredImageData,
            layer.opacity,
            layer.blendMode,
          );
        }
      }
    }

    canvasCtx.putImageData(compositeImageData, 0, 0);
    canvasImageURL.value = canvasRef.value.toDataURL();
  }

  return {
    canvasRef,
    loadImage,
    drawOriginalImage,
    renderLayers,
    canvasImageURL,
  };
}
