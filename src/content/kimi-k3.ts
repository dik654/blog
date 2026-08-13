export const KIMI_K3_SOURCE = {
  label: "Moonshot AI — Kimi K3 official repository and technical report",
  href: "https://github.com/MoonshotAI/Kimi-K3",
} as const;

/**
 * Kimi K3 공개 구성값의 단일 원본.
 * 리포트가 갱신되면 이 manifest와 근거 링크를 먼저 수정하고 본문은 이를 렌더링한다.
 */
export const KIMI_K3_CONFIG = [
  ["전체 / 활성 파라미터", "2.8T / 104B"],
  ["레이어", "93 (dense 1)"],
  ["Attention 구성", "69 KDA + 24 Gated MLA"],
  ["Hidden / heads", "7,168 / 96"],
  ["Routed experts", "896 중 token당 16"],
  ["Shared experts", "2"],
  ["Latent / expert hidden", "3,584 / 3,072"],
  ["Context", "1,048,576 tokens"],
  ["Vocabulary", "160K"],
  ["QAT", "MXFP4 weights / MXFP8 activations"],
] as const;

export const KIMI_K3_AXES = [
  {
    id: "sequence",
    label: "Sequence length",
    mechanism: "3× KDA + 1× Gated MLA",
    boundary: "fixed recurrent state와 주기적 global interaction을 결합",
  },
  {
    id: "depth",
    label: "Network depth",
    mechanism: "Block Attention Residuals",
    boundary: "이전 block 표현을 learned weight로 선택",
  },
  {
    id: "width",
    label: "Model width",
    mechanism: "Stable LatentMoE",
    boundary: "full-width shared path와 compact routed path를 분리",
  },
] as const;
