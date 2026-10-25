export type QuantizationLearningTrack = "concept" | "practice" | "reference";

export type QuantizationLearningNodeId =
  | "quantizer-contract"
  | "ptq-calibration"
  | "formats-granularity"
  | "qat"
  | "weight-only"
  | "activation-smoothing"
  | "deployment";

export interface QuantizationConceptAnchor {
  href: string;
  label: string;
}

export interface QuantizationLearningNode {
  id: QuantizationLearningNodeId;
  href: string;
  shortTitle: string;
  mapLabel: string;
  region: "표현" | "Scale" | "대상" | "배포";
  track: QuantizationLearningTrack;
  form: "explanation" | "decision" | "lookup";
  parentHref: string;
  parentLabel: string;
  question: string;
  closure: string;
  anchors?: readonly QuantizationConceptAnchor[];
}

export const QUANTIZATION_LEARNING_NODES: readonly QuantizationLearningNode[] = [
  {
    id: "quantizer-contract",
    href: "/cs/ai/quantization#overview",
    shortTitle: "양자화 기초",
    mapLabel: "실수 → code → 근사값",
    region: "표현",
    track: "concept",
    form: "explanation",
    parentHref: "/cs/ai?sub=ai-practical-compression",
    parentLabel: "모델 경량화",
    question: "실수 하나는 어떤 규칙으로 유한한 code가 되고, 어디에서 오차가 생길까요?",
    closure: "Affine quantizer는 scale로 실수 축을 나누고 zero-point를 더한 뒤 round·clip합니다. Range 안에서는 rounding, 밖에서는 clipping이 오차를 만듭니다.",
  },
  {
    id: "ptq-calibration",
    href: "/cs/ai/ptq-calibration#overview",
    shortTitle: "PTQ",
    mapLabel: "관측 → scale → 검증",
    region: "Scale",
    track: "concept",
    form: "explanation",
    parentHref: "/cs/ai/quantization#error-shape",
    parentLabel: "양자화 기초 · rounding과 clipping",
    question: "학습이 끝난 checkpoint에서 어느 scale을 골라야 실제 입력의 오차를 통제할 수 있을까요?",
    closure: "PTQ는 checkpoint를 고정한 채 calibration 표본으로 scale을 정하고, 별도 validation에서 layer·traffic slice별 포화와 task regression을 확인합니다.",
  },
  {
    id: "formats-granularity",
    href: "/cs/ai/quantization-formats-and-granularity#overview",
    shortTitle: "형식·단위",
    mapLabel: "bit 형식 × scale 공유 범위",
    region: "표현",
    track: "concept",
    form: "explanation",
    parentHref: "/cs/ai/quantization#format-boundary",
    parentLabel: "양자화 기초 · 숫자 형식의 경계",
    question: "같은 bit 수라도 숫자 형식과 scale 공유 범위가 artifact를 어떻게 바꿀까요?",
    closure: "Bit 형식은 code의 배치와 dynamic range를 정하고, granularity는 scale 하나를 공유하는 원소 범위를 정합니다. 공유 범위를 좁히면 국소 오차는 줄 수 있지만 metadata와 kernel 제약이 늘어납니다.",
  },
  {
    id: "qat",
    href: "/cs/ai/quantization-aware-training#overview",
    shortTitle: "QAT",
    mapLabel: "fake quant → loss → STE",
    region: "Scale",
    track: "concept",
    form: "explanation",
    parentHref: "/cs/ai/ptq-calibration#quantization-axes",
    parentLabel: "PTQ · 오차를 다루는 시점",
    question: "PTQ만으로 품질을 지키기 어려울 때 학습 과정에 저정밀 오차를 어떻게 넣을까요?",
    closure: "QAT는 float master weight를 유지하면서 forward에 fake quantization을 넣고, backward에는 STE를 사용합니다. 최종 판정은 fake graph가 아니라 변환된 artifact에서 다시 합니다.",
  },
  {
    id: "weight-only",
    href: "/cs/ai/weight-only-quantization#overview",
    shortTitle: "Weight-only",
    mapLabel: "weight 압축 · activation 유지",
    region: "대상",
    track: "concept",
    form: "explanation",
    parentHref: "/cs/ai/ptq-calibration#quantization-axes",
    parentLabel: "PTQ · weight와 activation",
    question: "Weight만 낮은 bit로 줄일 때 어떤 오차를 기준으로 GPTQ·AWQ 같은 후보를 비교해야 할까요?",
    closure: "Weight-only quantization은 activation을 높은 정밀도로 남기고 calibration 입력에서 layer output 차이를 줄입니다. Method·숫자 형식·실행 profile·container·kernel은 서로 다른 계약입니다.",
  },
  {
    id: "activation-smoothing",
    href: "/cs/ai/smoothquant-activation-smoothing#overview",
    shortTitle: "SmoothQuant",
    mapLabel: "activation outlier → weight로 이동",
    region: "대상",
    track: "concept",
    form: "explanation",
    parentHref: "/cs/ai/ptq-calibration#dynamic-static-outliers",
    parentLabel: "PTQ · activation outlier",
    question: "Activation의 큰 channel이 INT8 눈금을 독차지할 때 행렬곱을 유지하면서 난이도를 옮길 수 있을까요?",
    closure: "SmoothQuant는 입력 channel을 s로 나누고 대응 weight 행에 s를 곱해 float 행렬곱을 유지합니다. 보정 표본과 흡수 가능한 앞 연산이 맞아야 추가 실행 비용 없이 W8A8 artifact를 만들 수 있습니다.",
  },
  {
    id: "deployment",
    href: "/cs/ai/quantized-model-deployment#overview",
    shortTitle: "배포",
    mapLabel: "artifact → VRAM → kernel → release",
    region: "배포",
    track: "practice",
    form: "decision",
    parentHref: "/cs/ai/weight-only-quantization#artifact-boundary",
    parentLabel: "Weight-only · artifact와 kernel 경계",
    question: "선택한 quantized artifact가 대상 GPU와 workload에서 실제로 들어가고 빨라지는지 어떻게 판정할까요?",
    closure: "배포 판단은 weight payload에서 끝나지 않습니다. Metadata·request state·workspace·headroom을 합산하고, 지원 kernel이 실제 trace에서 차지한 비율과 품질 gate를 함께 측정해야 합니다.",
    anchors: [
      { href: "/cs/ai/quantization#affine-map", label: "code·scale 복원 규칙" },
      { href: "/cs/ai/ptq-calibration#release", label: "scale·artifact release 경계" },
      { href: "/cs/ai/quantization-formats-and-granularity#granularity", label: "형식·scale metadata" },
      { href: "/cs/ai/weight-only-quantization#artifact-boundary", label: "method·container·kernel 분리" },
    ],
  },
] as const;

export function getQuantizationLearningNode(id: QuantizationLearningNodeId) {
  const node = QUANTIZATION_LEARNING_NODES.find((candidate) => candidate.id === id);
  if (!node) throw new Error(`양자화 학습 노드를 찾을 수 없습니다: ${id}`);
  return node;
}

export function getQuantizationLearningTrackNodes(track: QuantizationLearningTrack) {
  return QUANTIZATION_LEARNING_NODES.filter((node) => node.track === track);
}
