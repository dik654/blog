export type Vector2 = readonly [number, number];

export function l2Norm2d(vector: Vector2) {
  return Math.sqrt(vector[0] ** 2 + vector[1] ** 2);
}

export function normalize2d(vector: Vector2): Vector2 {
  const norm = l2Norm2d(vector);
  if (norm === 0) throw new Error("영벡터는 방향을 정규화할 수 없습니다.");
  return [vector[0] / norm, vector[1] / norm];
}

export function cosine2d(left: Vector2, right: Vector2) {
  const leftUnit = normalize2d(left);
  const rightUnit = normalize2d(right);
  return leftUnit[0] * rightUnit[0] + leftUnit[1] * rightUnit[1];
}

export const PROJECTION_FIXTURE = (() => {
  const projection = [3, 4] as const;
  const reference = [1, 0] as const;
  return {
    projection,
    reference,
    norm: l2Norm2d(projection),
    unit: normalize2d(projection),
    cosine: cosine2d(projection, reference),
  };
})();
