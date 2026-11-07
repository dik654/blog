/** 5를 k번 곱한 뒤 23으로 나눈 나머지. 칸 번호 k가 곱한 횟수입니다. 22번 곱하면 다시 1입니다. */
export const RING_VALUES: readonly number[] = Array.from({ length: 22 }, (_, k) =>
  Array.from({ length: k }).reduce<number>((value) => (value * 5) % 23, 1),
);
