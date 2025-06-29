import { ref } from "vue";

export default function useCanvas() {
  const canvasRef = ref<HTMLCanvasElement | null>(null);
  let canvasCtx: CanvasRenderingContext2D | null = null;
  const imageElem = new Image();

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

  return { canvasRef, loadImage };
}
