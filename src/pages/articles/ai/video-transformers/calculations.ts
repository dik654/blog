export type TubeletGrid = {
  temporalPositions: number;
  rows: number;
  columns: number;
  spatialPositions: number;
  totalTokens: number;
};

function requirePositiveInteger(value: number, name: string) {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${name} must be a positive integer`);
  }
}

export function tubeletGrid({
  frames,
  height,
  width,
  tubeletDepth,
  patchSize,
}: {
  frames: number;
  height: number;
  width: number;
  tubeletDepth: number;
  patchSize: number;
}): TubeletGrid {
  [
    [frames, "frames"],
    [height, "height"],
    [width, "width"],
    [tubeletDepth, "tubeletDepth"],
    [patchSize, "patchSize"],
  ].forEach(([value, name]) =>
    requirePositiveInteger(value as number, name as string),
  );

  if (
    frames % tubeletDepth !== 0 ||
    height % patchSize !== 0 ||
    width % patchSize !== 0
  ) {
    throw new Error("input axes must be divisible by the tubelet geometry");
  }

  const temporalPositions = frames / tubeletDepth;
  const rows = height / patchSize;
  const columns = width / patchSize;
  const spatialPositions = rows * columns;

  return {
    temporalPositions,
    rows,
    columns,
    spatialPositions,
    totalTokens: temporalPositions * spatialPositions,
  };
}

export function attentionPairLedger({
  temporalPositions,
  spatialPositions,
}: {
  temporalPositions: number;
  spatialPositions: number;
}) {
  requirePositiveInteger(temporalPositions, "temporalPositions");
  requirePositiveInteger(spatialPositions, "spatialPositions");

  const totalTokens = temporalPositions * spatialPositions;
  const jointPairs = totalTokens * totalTokens;
  const spatialPairs = temporalPositions * spatialPositions * spatialPositions;
  const temporalPairs =
    spatialPositions * temporalPositions * temporalPositions;

  return {
    totalTokens,
    jointPairs,
    spatialPairs,
    temporalPairs,
    dividedPairs: spatialPairs + temporalPairs,
  };
}

export function videoMaeTubeMaskLedger({
  temporalPositions,
  spatialPositions,
  maskRatio,
}: {
  temporalPositions: number;
  spatialPositions: number;
  maskRatio: number;
}) {
  requirePositiveInteger(temporalPositions, "temporalPositions");
  requirePositiveInteger(spatialPositions, "spatialPositions");
  if (maskRatio < 0 || maskRatio > 1) {
    throw new Error("maskRatio must be between 0 and 1");
  }

  // VideoMAE의 공식 TubeMaskingGenerator와 같이 공간 한 장에서 가릴 수를 먼저 버림합니다.
  const maskedPerTemporalPosition = Math.trunc(maskRatio * spatialPositions);
  const visiblePerTemporalPosition =
    spatialPositions - maskedPerTemporalPosition;

  // 같은 공간 mask map을 모든 시간 위치에 반복합니다.
  const maskedTokens = temporalPositions * maskedPerTemporalPosition;
  const visibleTokens = temporalPositions * visiblePerTemporalPosition;

  return {
    totalTokens: temporalPositions * spatialPositions,
    maskedPerTemporalPosition,
    visiblePerTemporalPosition,
    maskedTokens,
    visibleTokens,
  };
}
