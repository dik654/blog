export type Point = readonly [number, number];
export type Scale = (value: number) => number;

/** 점 목록을 SVG path 문자열로 바꿉니다. */
export const linePath = (points: readonly Point[], sx: Scale, sy: Scale) =>
  points.map(([x, y], index) => `${index ? "L" : "M"}${sx(x).toFixed(2)} ${sy(y).toFixed(2)}`).join(" ");

/** 함수 f를 a부터 b까지 n칸으로 표본화합니다. */
export const sample = (f: (x: number) => number, a: number, b: number, n = 60): Point[] =>
  Array.from({ length: n + 1 }, (_, index) => {
    const x = a + ((b - a) * index) / n;
    return [x, f(x)] as const;
  });

/** x′=−x, x(0)=1에 Euler를 간격 h로 끝까지 적용한 점들입니다. */
export const eulerDecay = (h: number): Point[] => {
  const steps = Math.round(1 / h);
  return Array.from({ length: steps + 1 }, (_, n) => [n * h, (1 - h) ** n] as const);
};
