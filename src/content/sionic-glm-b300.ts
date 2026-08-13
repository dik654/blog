export const GLM52_OFFICIAL_CONFIG = [
  ["전체 파라미터", "753B"],
  ["hidden layers", "78"],
  ["routed experts", "256"],
  ["token당 routed experts", "8"],
  ["shared experts", "1"],
  ["MTP layers", "1"],
  ["최대 context", "1,048,576"],
] as const;

export const B300_OFFICIAL_CONFIG = [
  ["HBM3e / GPU", "288 GB"],
  ["HBM bandwidth / GPU", "up to 8 TB/s"],
  ["B300 / HGX node", "8 GPUs"],
] as const;

export const GLM_B300_PROJECT_MEASUREMENTS = {
  environment: {
    model: "GLM-5.2",
    hardware: "NVIDIA B300 × 8",
    parallelism: "TP8, batch 1 decode",
    note: "precision·commit·clock·power limit·prompt/output shape는 원 측정 로그 공개 시 함께 고정해야 한다.",
  },
  trafficAssumptionGbPerRank: 6.65,
  peakBandwidthTbPerSec: 8,
  assumedEfficiency: 0.6,
  observedForwardMs: 9,
  gemmEffectiveBandwidthTbPerSec: 2.1,
  liveQuantKernel: {
    unfusedUs: 53,
    naiveFusedUs: 127,
    splitKFusedUs: 37,
  },
  pipelineBandwidth: {
    beforeTbPerSec: 0.49,
    afterTbPerSec: 1.53,
  },
  throughput: {
    greedyTokensPerSec: 108,
    mtpTokensPerSec: 600,
    reportedRange: "600–1,000 tok/s",
  },
  acceptanceRegression: {
    before: 7.13,
    after: 4.47,
  },
} as const;

export const GLM_B300_DERIVED = {
  peakFloorMs:
    (GLM_B300_PROJECT_MEASUREMENTS.trafficAssumptionGbPerRank /
      (GLM_B300_PROJECT_MEASUREMENTS.peakBandwidthTbPerSec * 1000)) *
    1000,
  practicalFloorMs:
    (GLM_B300_PROJECT_MEASUREMENTS.trafficAssumptionGbPerRank /
      (GLM_B300_PROJECT_MEASUREMENTS.peakBandwidthTbPerSec *
        GLM_B300_PROJECT_MEASUREMENTS.assumedEfficiency *
        1000)) *
    1000,
} as const;

export const GLM_B300_OPTIMIZATION_LAYERS = [
  {
    id: "occupancy",
    label: "Occupancy·Split-K",
    goal: "작은 batch GEMM의 CTA 수를 늘려 더 많은 SM이 memory request를 낸다",
  },
  {
    id: "pipeline",
    label: "tcgen05·TMEM pipeline",
    goal: "accumulator register pressure를 줄이고 load·MMA·scale 경로를 겹친다",
  },
  {
    id: "fusion",
    label: "PQ-GEMM fusion",
    goal: "live activation quantization의 중간 HBM round trip과 launch를 줄인다",
  },
  {
    id: "runtime",
    label: "SGLang runtime",
    goal: "CUDA Graph·sampling·collective·CPU sync에서 새로 드러난 병목을 없앤다",
  },
  {
    id: "mtp",
    label: "MTP speculative decoding",
    goal: "한 번 읽은 main-model weight로 여러 future token을 검증한다",
  },
] as const;

export const GLM_B300_SOURCE_LINKS = {
  roofline: {
    label: "Williams et al. — Roofline model",
    href: "https://doi.org/10.1145/1498765.1498785",
  },
  mtpPaper: {
    label: "Better & Faster LLMs via Multi-token Prediction",
    href: "https://arxiv.org/abs/2404.19737",
  },
  model: {
    label: "Z.ai GLM-5.2 model card",
    href: "https://huggingface.co/zai-org/GLM-5.2",
  },
  config: {
    label: "GLM-5.2 official config.json",
    href: "https://huggingface.co/zai-org/GLM-5.2/blob/main/config.json",
  },
  b300: {
    label: "NVIDIA HGX B300 component specification",
    href: "https://docs.nvidia.com/enterprise-reference-architectures/hgx-ai-factory/latest/components.html",
  },
  tcgen05: {
    label: "NVIDIA CUTLASS tcgen05 programming guide",
    href: "https://docs.nvidia.com/cutlass/latest/media/docs/pythonDSL/mma_docs/tcgen05_programming.html",
  },
  ptx: {
    label: "NVIDIA PTX ISA: tcgen05 and Tensor Memory",
    href: "https://docs.nvidia.com/cuda/parallel-thread-execution/",
  },
  sglang: {
    label: "SGLang releases",
    href: "https://github.com/sgl-project/sglang/releases",
  },
} as const;
