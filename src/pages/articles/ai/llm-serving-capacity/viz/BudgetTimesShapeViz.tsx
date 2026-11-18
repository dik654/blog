import SceneShell from "./SceneShell";

/**
 * 본문 대응: #capacity — "토큰당 attention KV가 Qwen의 81.25%"와 "총 cache token이 Qwen의 3.63배"는
 * 같은 비율일 필요가 없다. 총 capacity = 남은 KV 예산 ÷ 토큰당 KV byte.
 * 기준 10 GiB ÷ 256 KiB = 40,960 token은 본문 TermBreakdown 예시. 208 KiB = 256 × 0.8125.
 * 예산 20 GiB는 가정. 10 GiB ÷ 208 KiB ≈ 50,412, 20 GiB ÷ 256 KiB = 81,920, 20 GiB ÷ 208 KiB ≈ 100,824.
 * 1 ÷ 0.8125 ≈ 1.23, 352,736 ÷ 97,216 ≈ 3.63, 3.63 ÷ 1.23 ≈ 2.95.
 */
const KIB_PER_GIB = 1024 * 1024;
const BASE_TOKENS = (10 * KIB_PER_GIB) / 256;

const CASES = [
  { budget: 10, perToken: 256 },
  { budget: 10, perToken: 208 },
  { budget: 20, perToken: 256 },
  { budget: 20, perToken: 208 },
] as const;

const W = 360;
const LEFT = 104;
const RIGHT = 300;
const fmt = (n: number) => n.toLocaleString("en-US");

const SCENES = [
  {
    label: "기준",
    summary: "10 GiB ÷ 256 KiB = 40,960 token",
    note: "남은 KV 예산 10 GiB를 token 하나의 KV 256 KiB로 나누면 40,960 token입니다. 총 capacity는 이렇게 두 손잡이의 나눗셈입니다.",
  },
  {
    label: "토큰당 byte만 81.25%",
    summary: "≈ 50,412 token · 1.23배",
    note: "예산은 그대로 두고 토큰당 KV만 81.25%(208 KiB)로 줄이면 token 수는 1 ÷ 0.8125 ≈ 1.23배입니다. 3.63배가 아닙니다.",
  },
  {
    label: "예산만 두 배 (가정)",
    summary: "81,920 token · 2.00배",
    note: "(가정) Weight quantization 등으로 weight를 올린 뒤 남는 KV 예산이 20 GiB가 됐다면, 토큰당 byte가 그대로여도 token 수는 두 배입니다.",
  },
  {
    label: "둘이 함께 바뀌면",
    summary: "≈ 100,824 token · 2.46배",
    note: "두 효과는 곱해집니다. 2.00 × 1.23 ≈ 2.46배로, 토큰당 비율 하나만 보고는 나오지 않는 배수입니다.",
  },
  {
    label: "본문의 두 숫자",
    summary: "3.63 ÷ 1.23 ≈ 2.95",
    note: "토큰당 81.25%로 설명되는 몫은 1.23배뿐이고, 나머지 약 2.95배는 남은 예산, Qwen의 request당 recurrent state, vision encoder·CUDA graph·workspace·TP 구성 차이가 섞인 몫입니다. 다만 본문 뒤 절은 Qwen의 97,216이 Gemma·Muse의 cache token과 같은 token 단위가 아니라고 하므로, 3.63배와 2.95배는 같은 단위끼리 잰 배수가 아닙니다.",
  },
] as const;

function Row({ y, label, value, ratio, color }: { y: number; label: string; value: string; ratio: number; color: string }) {
  return (
    <g>
      <text x={LEFT - 6} y={y + 12} textAnchor="end" fontSize={12} fill="#64748b">{label}</text>
      <rect x={LEFT} y={y} width={RIGHT - LEFT} height={16} rx={2} fill="none" stroke="#cbd5e1" strokeWidth={1} />
      <rect x={LEFT} y={y} width={Math.max(2, (RIGHT - LEFT) * ratio)} height={16} rx={2} fill={color} />
      <text x={RIGHT + 4} y={y + 12} textAnchor="start" fontSize={12} fontWeight={700} fill={color}>{value}</text>
    </g>
  );
}

export default function BudgetTimesShapeViz() {
  return (
    <SceneShell
      eyebrow="예산 ÷ 토큰당 byte"
      title="토큰당 KV가 81.25%여도 총 token은 1.23배뿐이고, 남은 예산이 따로 곱해집니다"
      description="위 막대는 남은 KV 예산(최대 20 GiB), 가운데는 token 하나의 KV byte(최대 256 KiB), 아래는 둘을 나눈 총 token 수(축 0~110,000)입니다. 마지막 장면만 배수를 비교합니다."
      note="10 GiB·256 KiB·40,960 token은 본문의 예시이고 20 GiB는 가정입니다. 81.25%와 3.63배는 본문의 Qwen 대비 값입니다."
      ariaLabel="남은 KV 예산과 토큰당 KV byte가 곱해져 총 cache token 수를 정하는 장면"
      scenes={SCENES}
      render={(active) => {
        if (active === 4) {
          return (
            <svg viewBox={`0 0 ${W} 120`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label="토큰당 byte로 설명되는 1.23배와 본문의 3.63배 비교">
              <Row y={14} label="토큰당 byte 몫" value="1.23배" ratio={1.23 / 4} color="#2563eb" />
              <Row y={46} label="본문의 총 token" value="3.63배" ratio={3.63 / 4} color="#64748b" />
              <line x1={LEFT + ((RIGHT - LEFT) * 1.23) / 4} x2={LEFT + ((RIGHT - LEFT) * 1.23) / 4} y1={10} y2={68} stroke="#d97706" strokeWidth={1} strokeDasharray="3 3" />
              <text x={(LEFT + RIGHT) / 2} y={96} textAnchor="middle" fontSize={12} fontWeight={700} fill="#b45309">나머지 몫 3.63 ÷ 1.23 ≈ 2.95배</text>
              <text x={(LEFT + RIGHT) / 2} y={112} textAnchor="middle" fontSize={12} fill="#64748b">(축: 0~4배)</text>
            </svg>
          );
        }
        const c = CASES[active];
        const tokens = Math.floor((c.budget * KIB_PER_GIB) / c.perToken);
        return (
          <svg viewBox={`0 0 ${W} 120`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`예산 ${c.budget} GiB, 토큰당 ${c.perToken} KiB, 총 ${fmt(tokens)} token`}>
            <Row y={14} label="남은 KV 예산" value={`${c.budget} GiB`} ratio={c.budget / 20} color="#64748b" />
            <Row y={46} label="토큰당 KV" value={`${c.perToken} KiB`} ratio={c.perToken / 256} color="#d97706" />
            <Row y={78} label="총 token" value={fmt(tokens)} ratio={tokens / 110000} color="#2563eb" />
            <text x={LEFT} y={112} textAnchor="start" fontSize={12} fill="#64748b">
              기준 {fmt(BASE_TOKENS)}의 {(tokens / BASE_TOKENS).toFixed(2)}배
            </text>
          </svg>
        );
      }}
    />
  );
}
