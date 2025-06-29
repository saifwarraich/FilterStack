import { ref } from "vue";
import init, { open_image, filter, putImageData } from "@silvia-odwyer/photon";

export default function useCanvas() {
  const canvasRef = ref<HTMLCanvasElement | null>(null);
  let canvasCtx: CanvasRenderingContext2D | null = null;
  const imageElem = new Image();
  let photonInitialized = false;

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
    imageElem.addEventListener("load", drawImage);
    imageElem.src = url;
  }

  function drawImage() {
    if (!canvasCtx || !canvasRef.value) return;

    const imgDim = calculateAspectRatio(imageElem.naturalWidth, imageElem.naturalHeight, 448, 448);
    canvasRef.value.width = imgDim.width;
    canvasRef.value.height = imgDim.height;
    canvasCtx.drawImage(imageElem, 0, 0, imgDim.width, imgDim.height);
  }

  async function filterImage(filterName: string) {
    if (!canvasCtx || !canvasRef.value || !filterName.trim()) return;

    await initPhoton();

    const photonImage = open_image(canvasRef.value, canvasCtx);
    filter(photonImage, filterName);
    putImageData(canvasRef.value, canvasCtx, photonImage);
  }

  return { canvasRef, loadImage, drawImage, filterImage };
}
