/**
 * 본문 대응: 여섯 모델의 config.json 값과 그 값으로 계산한 다섯 숫자.
 * 모든 계산 가정은 본문 3·4·6절의 CalculationWalkthrough와 같다.
 * - 노드: RTX PRO 6000 Server Edition 96GB × 8, 장당 1,597 GB/s, NVLink 없음.
 * - 쓸 수 있는 메모리: 장당 96GB의 90%(86.4GB), 노드 691.2GB. activation·CUDA graph 작업 공간은 따로 빼지 않았다.
 * - 에이전트 하나 = 128K(131,072) token 문맥. KV는 BF16(원소 2 byte) 기준.
 */
export interface ArchitectureRow {
  /** 화면에 쓰는 모델 이름 */
  model: string;
  /** 구조 분류 — 행 이름 */
  family: string;
  /** 서빙에 쓰는 체크포인트 크기(GB, 10진). HF API 파일 합계 */
  weightGb: number;
  weightFormat: string;
  /** token 하나가 쓰는 활성 파라미터를 1 byte(FP8 상당)로 읽을 때의 GB — 단일 스트림 바이트 */
  activeGbFp8: number;
  /** 동시 64 요청이 한 step에 읽는 routed expert 비율(%) — dense는 100 */
  expertReadAt64: number;
  /** 128K 에이전트 하나의 KV+state(GB, 논리 크기) */
  agentGb: number;
  /** TP8에서 같은 KV가 몇 장에 겹쳐 놓이는지 */
  tp8Replication: number;
  /** 고를 만한 배치 */
  layout: string;
  /** TP8일 때 token 하나가 거치는 all-reduce 수 = 2 × 층 */
  tp8Syncs: number;
  /** PP 경계에서 token 하나가 넘기는 hidden state(byte) */
  ppBytes: number;
  /** 8장 노드 기본 설정의 128K 에이전트 수(계산) */
  agentsBase: number;
  /** 배치를 바꾼 뒤(FP8 KV·DCP 또는 장당 복제본)의 128K 에이전트 수(계산) */
  agentsTuned: number;
  tunedLabel: string;
  /** 노드 2대(16장)로 늘렸을 때의 128K 에이전트 수(계산). null이면 숫자 대신 twoNodeLabel만 쓴다 */
  agentsTwoNodes: number | null;
  twoNodeLabel: string;
}

/** 장당 86.4GB(가정) × 8. 실측 KV 용량과 비교해 보수적인 쪽으로 맞춘 값이다(본문 3절). */
export const NODE_USABLE_GB = 691.2;
/** 장당 97,887 MiB(=102.6GB, 10진) × 8. nvidia-smi가 보고하는 실제 용량이다. */
export const NODE_RAW_GB = 821;

export const ROWS: readonly ArchitectureRow[] = [
  {
    model: "Llama 3.1 405B",
    family: "dense + GQA",
    weightGb: 487.3,
    weightFormat: "FP8",
    activeGbFp8: 405.9,
    expertReadAt64: 100,
    agentGb: 67.6,
    tp8Replication: 1,
    layout: "TP8",
    tp8Syncs: 252,
    ppBytes: 32768,
    agentsBase: 3.0,
    agentsTuned: 6.0,
    tunedLabel: "FP8 KV",
    agentsTwoNodes: 26.5,
    twoNodeLabel: "PP2, FP8 KV",
  },
  {
    model: "Qwen3-235B-A22B",
    family: "MoE + GQA",
    weightGb: 239.0,
    weightFormat: "FP8",
    activeGbFp8: 22,
    expertReadAt64: 98.4,
    agentGb: 25.2,
    tp8Replication: 2,
    layout: "TP8 · TP4×2",
    tp8Syncs: 188,
    ppBytes: 8192,
    agentsBase: 9.0,
    agentsTuned: 17.9,
    tunedLabel: "FP8 KV",
    agentsTwoNodes: 45.3,
    twoNodeLabel: "PP2, FP8 KV",
  },
  {
    model: "Kimi K2.5",
    family: "MoE + MLA",
    weightGb: 595.2,
    weightFormat: "INT4",
    activeGbFp8: 32,
    expertReadAt64: 74.0,
    agentGb: 9.2,
    tp8Replication: 8,
    layout: "TP8 + DCP8",
    tp8Syncs: 122,
    ppBytes: 14336,
    agentsBase: 1.3,
    agentsTuned: 20.8,
    tunedLabel: "FP8 KV+DCP8",
    agentsTwoNodes: 171,
    twoNodeLabel: "PP2, FP8+DCP8",
  },
  {
    model: "Kimi K3",
    family: "MoE + KDA/MLA",
    weightGb: 1561.0,
    weightFormat: "MXFP4",
    activeGbFp8: 104,
    expertReadAt64: 68.4,
    agentGb: 4.1,
    tp8Replication: 8,
    layout: "16장 필요",
    tp8Syncs: 186,
    ppBytes: 14336,
    agentsBase: 0,
    agentsTuned: 0,
    tunedLabel: "8장에 안 들어감",
    agentsTwoNodes: null,
    twoNodeLabel: "16장 TP16 가동 보고",
  },
  {
    model: "Qwen3.6-35B-A3B",
    family: "MoE + DeltaNet",
    weightGb: 37.5,
    weightFormat: "FP8",
    activeGbFp8: 3,
    expertReadAt64: 86.9,
    agentGb: 2.75,
    tp8Replication: 4,
    layout: "1장 × 복제 8",
    tp8Syncs: 80,
    ppBytes: 4096,
    agentsBase: 142,
    agentsTuned: 142,
    tunedLabel: "장마다 복제본",
    agentsTwoNodes: 284,
    twoNodeLabel: "복제본 16",
  },
  {
    model: "gpt-oss-120b",
    family: "MoE + SWA",
    weightGb: 65.2,
    weightFormat: "MXFP4",
    activeGbFp8: 5.1,
    expertReadAt64: 86.9,
    agentGb: 4.8,
    tp8Replication: 1,
    layout: "1장 × 복제 8",
    tp8Syncs: 72,
    ppBytes: 5760,
    agentsBase: 35,
    agentsTuned: 35,
    tunedLabel: "장마다 복제본",
    agentsTwoNodes: 70,
    twoNodeLabel: "복제본 16",
  },
];

/** Kimi K2.5: routed expert 384개, token마다 8개. batch B에서 한 층이 읽는 expert 수의 기대값 */
export const K25_EXPERTS = 384;
export const K25_TOPK = 8;
export function expectedExperts(E: number, k: number, B: number) {
  return E * (1 - (1 - k / E) ** B);
}
