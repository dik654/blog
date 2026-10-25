export type TimeInterval = readonly [start: number, end: number];

export function mergeIntervals(intervals: readonly TimeInterval[]): TimeInterval[] {
  if (intervals.length === 0) return [];

  const sorted = [...intervals]
    .map(([start, end]) => {
      if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) {
        throw new Error(`잘못된 시간 구간입니다: [${start}, ${end}]`);
      }
      return [start, end] as const;
    })
    .sort(([leftStart], [rightStart]) => leftStart - rightStart);

  const merged: [number, number][] = [];
  let current: [number, number] = [...sorted[0]];

  for (const [nextStart, nextEnd] of sorted.slice(1)) {
    if (nextStart <= current[1]) {
      current[1] = Math.max(current[1], nextEnd);
      continue;
    }
    merged.push(current);
    current = [nextStart, nextEnd];
  }

  merged.push(current);
  return merged;
}

export function temporalCoverage(
  intervals: readonly TimeInterval[],
  videoDuration: number,
) {
  if (!Number.isFinite(videoDuration) || videoDuration <= 0) {
    throw new Error("영상 길이는 0보다 커야 합니다.");
  }

  const merged = mergeIntervals(intervals);
  const observedDuration = merged.reduce(
    (sum, [start, end]) => sum + (end - start),
    0,
  );

  return {
    merged,
    observedDuration,
    coverage: observedDuration / videoDuration,
  };
}
