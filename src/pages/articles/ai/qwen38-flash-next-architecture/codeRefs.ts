import type { CodeRef } from "@/components/code/types";
import modularPy from "./codebase/transformers/src/transformers/models/qwen4_exp/modular_qwen4_exp.py?raw";
import configPy from "./codebase/transformers/src/transformers/models/qwen4_exp/configuration_qwen4_exp.py?raw";

const MODULAR = "transformers/src/transformers/models/qwen4_exp/modular_qwen4_exp.py";
const CONFIG = "transformers/src/transformers/models/qwen4_exp/configuration_qwen4_exp.py";

export const codeRefs: Record<string, CodeRef> = {
  "layer-schedule": {
    path: CONFIG,
    code: configPy,
    lang: "python",
    highlight: [166, 186],
    desc: "문제: 48개 layer 중 어디에 선형 mixer를 두고 어디에 희소 attention을 둘지 config만 보고 확정해야 합니다.\n\n해결: __post_init__이 full_attention_interval로 layer_types를 생성하고, 체크포인트가 물려준 full_attention 표기를 qwen_sparse_attention으로 다시 씁니다.",
    annotations: [
      { lines: [175, 179], color: "sky", note: "(i+1) % 4 가 0이 아니면 linear_attention — 4번째 층마다 희소 attention이 들어갑니다" },
      { lines: [180, 184], color: "amber", note: "공개 config의 full_attention 표기를 qwen_sparse_attention으로 교체합니다. 이름은 full이지만 실제로는 indexer가 붙은 층입니다" },
      { lines: [171, 173], color: "emerald", note: "PLE가 켜지면 conv state가 1개가 아니라 3개 — GatedDeltaNet·PLE conv·n-gram context를 따로 잡습니다" },
    ],
  },
  "qsa-indexer": {
    path: MODULAR,
    code: modularPy,
    lang: "python",
    highlight: [388, 476],
    desc: "문제: 262,144 토큰을 전부 보는 attention은 decode마다 전체 K/V를 읽어야 합니다.\n\n해결: 가벼운 indexer가 4토큰씩 압축한 블록 키로 점수를 매겨 상위 512블록만 고르고, 그 결과를 causal mask에 덧씌워 원본 K/V의 일부만 읽게 합니다.",
    annotations: [
      { lines: [402, 411], color: "sky", note: "index_qk_proj 한 번으로 query 4개 head와 공유 key 1개 head를 함께 뽑습니다" },
      { lines: [436, 445], color: "violet", note: "연속 4토큰의 raw key를 FP32로 평균내고 정규화한 뒤, 블록 첫 토큰 위치의 RoPE를 적용합니다" },
      { lines: [447, 450], color: "emerald", note: "head별 점수에 ReLU를 걸어 더합니다. 음수 기여를 0으로 눌러 head 하나가 반대 방향으로 끌어내리지 못하게 합니다" },
      { lines: [452, 458], color: "amber", note: "상위 block_topk(=2048/4=512)개를 고른 뒤 블록을 토큰으로 되펼치고, 아직 4개가 안 찬 꼬리 토큰을 붙입니다" },
      { lines: [461, 474], color: "rose", note: "선택 결과는 값이 아니라 mask입니다. softmax와 value 집계는 압축 키가 아닌 원본 K/V로 수행됩니다" },
    ],
  },
  "qsa-validation": {
    path: CONFIG,
    code: configPy,
    lang: "python",
    highlight: [207, 232],
    desc: "문제: indexer 설정이 하나라도 어긋나면 선택된 토큰 수와 예산이 조용히 달라집니다.\n\n해결: config가 다섯 필드를 묶어 검사하고, key head 1개·예산의 배수 조건·RoPE 차원 조건을 실패로 만들어 잘못된 조합을 막습니다.",
    annotations: [
      { lines: [214, 222], color: "sky", note: "다섯 QSA 필드는 전부 있거나 전부 없어야 합니다. 하나라도 빠지면 어떤 층이 희소인지 판정할 수 없습니다" },
      { lines: [223, 226], color: "amber", note: "indexer_kv_heads는 1로 고정이고, budget은 compress_ratio로 나누어떨어져야 합니다(2048 ÷ 4 = 512)" },
      { lines: [227, 232], color: "rose", note: "attention의 rotary 차원(256 × 0.25 = 64)이 indexer head 차원 128을 넘으면 같은 위치 정보를 쓸 수 없어 거부합니다" },
    ],
  },
  "gated-residual": {
    path: MODULAR,
    code: modularPy,
    lang: "python",
    highlight: [531, 559],
    desc: "문제: residual stream이 하나뿐이면 층마다 같은 통로에 모든 블록 출력이 누적됩니다.\n\n해결: stream을 hc_count(=4)개로 늘리고, 블록 입력은 저랭크 게이트로 섞은 평균을, 블록 출력은 stream별 주입 계수를 곱해 되돌립니다.",
    annotations: [
      { lines: [536, 539], color: "sky", note: "group_size=hidden_size인 RMSNorm — 4개 stream을 각각 정규화합니다. 저랭크 mixer는 10240→320→10240" },
      { lines: [550, 556], color: "emerald", note: "silu로 한 번, sigmoid로 한 번 — 게이트는 0~1이고 stream 평균이 블록 입력이 됩니다" },
      { lines: [557, 559], color: "amber", note: "주입 계수는 2×sigmoid라 0~2 범위입니다. 1보다 크면 증폭, 작으면 감쇠로 stream마다 다르게 되돌립니다" },
    ],
  },
  "ngram-embedding": {
    path: MODULAR,
    code: modularPy,
    lang: "python",
    highlight: [659, 707],
    desc: "문제: 토큰 하나의 임베딩만으로는 직전 한두 토큰이 만드는 어휘 조합을 구분하기 어렵습니다.\n\n해결: 직전 토큰들을 곱수와 XOR로 섞어 해시하고, head마다 서로 다른 소수로 나눈 나머지를 행 번호로 써서 n-gram 전용 임베딩 표를 조회합니다.",
    annotations: [
      { lines: [663, 667], color: "sky", note: "직전 ngram_size-1(=2)개 토큰을 conv state 슬롯에 보관합니다. 별도 자료구조 없이 cache를 재사용합니다" },
      { lines: [684, 694], color: "violet", note: "bigram·trigram마다 shift한 토큰 id에 곱수를 곱하고 XOR로 섞습니다. 곱수는 seed에서 결정적으로 생성됩니다" },
      { lines: [695, 698], color: "emerald", note: "head별 소수로 나눈 나머지에 offset을 더합니다. 표 하나를 16개 head가 겹치지 않게 나눠 씁니다" },
      { lines: [700, 707], color: "amber", note: "조회는 토큰당 16행뿐입니다. 표 전체가 GPU에 있을 필요가 없다는 사실이 여기서 나옵니다" },
    ],
  },
  "ple-layer": {
    path: MODULAR,
    code: modularPy,
    lang: "python",
    highlight: [763, 785],
    desc: "문제: n-gram 임베딩을 그대로 더하면 어휘 신호가 문맥과 무관하게 항상 같은 세기로 들어갑니다.\n\n해결: 현재 stream 상태를 query로, n-gram 임베딩을 key/value로 써서 stream마다 게이트를 계산한 뒤 dilated depthwise convolution으로 국소 문맥을 더합니다.",
    annotations: [
      { lines: [769, 773], color: "sky", note: "key는 stream 수만큼, value는 hidden 하나로 투영합니다. stream마다 다른 게이트를 받습니다" },
      { lines: [774, 776], color: "violet", note: "내적을 √hidden으로 나눈 뒤 부호를 지켜 제곱근을 취합니다. 큰 값의 기울기를 눌러 게이트가 포화하지 않게 합니다" },
      { lines: [781, 784], color: "amber", note: "dilation=3, kernel=4인 depthwise conv — 상태 길이는 (4-1)×3 = 9 토큰입니다" },
    ],
  },
  "decoder-layer": {
    path: MODULAR,
    code: modularPy,
    lang: "python",
    highlight: [801, 838],
    desc: "문제: 선형 layer와 희소 attention layer, MoE, PLE, 4갈래 stream이 한 층에서 어떤 순서로 만나는지 흩어진 설명만으로는 확정할 수 없습니다.\n\n해결: decoder layer 하나의 forward가 순서를 그대로 보여 줍니다. mix → 블록 → 주입을 attention과 MoE에서 각각 한 번씩 반복합니다.",
    annotations: [
      { lines: [809, 812], color: "violet", note: "PLE는 해당 층에만 있고, 4갈래로 넓힌 상태에 그대로 더해집니다" },
      { lines: [813, 819], color: "sky", note: "attention 앞에서 stream을 섞어 입력을 만들고, 층 종류에 따라 GatedDeltaNet 또는 희소 attention을 호출합니다" },
      { lines: [821, 823], color: "emerald", note: "블록 출력에 stream별 주입 계수를 곱해 원래 4갈래 상태에 되돌립니다" },
      { lines: [825, 830], color: "amber", note: "MoE 앞에서 같은 절차를 한 번 더 반복합니다. 층마다 gated residual이 두 벌 필요한 이유입니다" },
    ],
  },
};
