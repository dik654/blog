export type TemporalLayer = {
  kernel: number;
  dilation: number;
  stride: number;
};

export type TemporalReceptiveStep = TemporalLayer & {
  receptivePositions: number;
  outputJump: number;
};

export function temporalReceptiveSteps(
  layers: readonly TemporalLayer[],
): TemporalReceptiveStep[] {
  let receptivePositions = 1;
  let outputJump = 1;

  return layers.map((layer) => {
    receptivePositions +=
      (layer.kernel - 1) * layer.dilation * outputJump;
    outputJump *= layer.stride;
    return { ...layer, receptivePositions, outputJump };
  });
}

export function sourceTimestampSpanSeconds({
  receptivePositions,
  inputStride,
  sourceFps,
}: {
  receptivePositions: number;
  inputStride: number;
  sourceFps: number;
}) {
  const sourceFrameGap = (receptivePositions - 1) * inputStride;
  return {
    sourceFrameGap,
    seconds: sourceFrameGap / sourceFps,
  };
}

export function r2plus1dParameterLedger({
  temporalKernel,
  spatialKernel,
  inputChannels,
  outputChannels,
}: {
  temporalKernel: number;
  spatialKernel: number;
  inputChannels: number;
  outputChannels: number;
}) {
  const spatialArea = spatialKernel * spatialKernel;
  const full3d =
    temporalKernel * spatialArea * inputChannels * outputChannels;
  const intermediateChannels = Math.floor(
    full3d /
      (spatialArea * inputChannels + temporalKernel * outputChannels),
  );
  const spatial2d = spatialArea * inputChannels * intermediateChannels;
  const temporal1d =
    temporalKernel * intermediateChannels * outputChannels;

  return {
    full3d,
    intermediateChannels,
    spatial2d,
    temporal1d,
    factorized: spatial2d + temporal1d,
  };
}

export function slowFastShape({
  slowFrames,
  slowChannels,
  alpha,
  beta,
}: {
  slowFrames: number;
  slowChannels: number;
  alpha: number;
  beta: number;
}) {
  return {
    slowFrames,
    slowChannels,
    fastFrames: slowFrames * alpha,
    fastChannels: slowChannels * beta,
  };
}
