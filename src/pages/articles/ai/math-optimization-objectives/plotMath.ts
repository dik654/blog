/** 이 글의 그래프 Viz 들이 함께 쓰는 좌표 변환과 곡선 경로 계산입니다. */
export interface PlotScale {
  sx: (x: number) => number;
  sy: (y: number) => number;
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export function makeScale(
  [xMin, xMax]: readonly [number, number],
  [yMin, yMax]: readonly [number, number],
  { left, right, top, bottom }: { left: number; right: number; top: number; bottom: number },
): PlotScale {
  return {
    sx: (x) => left + ((x - xMin) / (xMax - xMin)) * (right - left),
    sy: (y) => bottom - ((y - yMin) / (yMax - yMin)) * (bottom - top),
    left,
    right,
    top,
    bottom,
  };
}

export function curvePath(fn: (x: number) => number, from: number, to: number, scale: PlotScale, samples = 160) {
  return Array.from({ length: samples + 1 }, (_, index) => {
    const x = from + ((to - from) * index) / samples;
    return `${index ? "L" : "M"}${scale.sx(x).toFixed(2)},${scale.sy(fn(x)).toFixed(2)}`;
  }).join(" ");
}
