import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 손실 300만 원, 자기부담금 20만 원을 먼저 빼면 280만 원, 지급 한도 230만 원(모두 가정).
 * 지급 230, 가입자 20 + 50 = 70. 20명이면 4,600만 원, 최초 6,000만 원과의 차이 1,400만 원(= 70 × 20).
 */
const X0 = 15;
const WIDTH = 330;
const UNIT = WIDTH / 300;
const BLUE = "#2563eb";
const AMBER = "#d97706";

type Seg = { amount: number; fill: string; label: string; text?: string; dashed?: boolean };

const SCENES = [
  { label: "실제 손실", summary: "손실 300만 원", note: "첫 사례의 300만 원은 보험금으로 약정된 금액이었습니다. 이제 같은 크기의 실제 손실에 다른 계약을 적용합니다(가정). 막대 전체가 손실 300만 원입니다." },
  { label: "자기부담금을 먼저 뺍니다", summary: "300 − 20 = 280만 원", note: "자기부담금은 가입자가 먼저 부담하는 금액입니다. 왼쪽 20만 원이 가입자 몫으로 떨어지고 계산 대상은 280만 원이 됩니다." },
  { label: "지급 한도를 적용합니다", summary: "280만 원 중 230만 원만 지급", note: "보상 한도는 지급액의 최대값입니다. 280만 원이 230만 원을 넘으므로 230만 원에서 끊기고, 넘친 50만 원은 지급되지 않습니다." },
  { label: "두 갈래로 나뉜 결과", summary: "지급 230 · 가입자 70만 원", note: "가입자에게 남는 손실은 양 끝 칸의 합, 20 + 50 = 70만 원입니다. 이 적용 순서는 설명용이며 계약별로 다를 수 있으니 실제로는 약관의 계산 순서를 읽습니다." },
  { label: "20명이 겪으면", summary: "지급 4,600만 · 가입자 1,400만 원", note: "지급은 최초의 6천만 원보다 1,400만 원 적지만 그만큼(70만 원 × 20명) 가입자에게 손실이 더 남습니다. 낮은 보험료만으로 유리한 계약인지 판단하기 어려운 이유입니다." },
] as const;

function Bar({ y, caption, segs, unit = UNIT }: { y: number; caption: string; segs: readonly Seg[]; unit?: number }) {
  const starts = segs.map((_, index) => segs.slice(0, index).reduce<number>((sum, seg) => sum + seg.amount, 0));
  return (
    <g>
      <text x={X0} y={y - 6} fontSize={13} fontWeight={700} fill="#64748b">{caption}</text>
      {segs.map((seg, index) => {
        const x = X0 + starts[index] * unit;
        const w = seg.amount * unit;
        return (
          <g key={`${seg.label}-${index}`}>
            <rect x={x + 0.5} y={y + 0.5} width={w - 1} height={25} rx={2} fill={seg.dashed ? "none" : seg.fill} stroke={seg.dashed ? seg.fill : "none"} strokeWidth={1} strokeDasharray={seg.dashed ? "4 3" : undefined} />
            <text x={x + w / 2} y={y + 18} textAnchor="middle" fontSize={13} fontWeight={700} fill={seg.text ?? "#ffffff"}>{seg.label}</text>
          </g>
        );
      })}
    </g>
  );
}

const ROW_LOSS: readonly Seg[] = [{ amount: 300, fill: "#64748b", label: "손실 300만 원" }];
const ROW_DEDUCT: readonly Seg[] = [
  { amount: 20, fill: AMBER, label: "20" },
  { amount: 280, fill: BLUE, label: "계산 대상 280만 원", dashed: true, text: BLUE },
];
const ROW_CAP: readonly Seg[] = [
  { amount: 20, fill: AMBER, label: "20" },
  { amount: 230, fill: BLUE, label: "지급 230만 원" },
  { amount: 50, fill: AMBER, label: "50" },
];
const ROW_FIRST: readonly Seg[] = [{ amount: 6000, fill: "#64748b", label: "지급 6,000만 원" }];
const ROW_NEXT: readonly Seg[] = [
  { amount: 4600, fill: BLUE, label: "지급 4,600만 원" },
  { amount: 1400, fill: AMBER, label: "1,400만" },
];

export default function DeductibleCapViz() {
  return (
    <SceneShell
      eyebrow="계약 계산"
      title="같은 300만 원 손실이 지급 230만 원과 부담 70만 원으로 갈립니다"
      description="막대 폭은 금액에 비례하고 단위는 만 원입니다. 자기부담금 20만 원과 지급 한도 230만 원은 설명용 가정입니다."
      ariaLabel="손실 300만 원에서 자기부담금과 지급 한도를 차례로 적용해 지급 230만 원과 가입자 부담 70만 원으로 나누고 20명으로 늘리는 계산"
      scenes={SCENES}
      render={(scene) => (
        <svg viewBox="0 0 360 214" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[scene].label}: ${SCENES[scene].summary}`}>
          {scene < 4 ? (
            <>
              <Bar y={22} caption="1. 실제 손실" segs={ROW_LOSS} />
              {scene >= 1 && <Bar y={82} caption="2. 자기부담금 20만 원 먼저" segs={ROW_DEDUCT} />}
              {scene >= 2 && <Bar y={142} caption="3. 지급 한도 230만 원에서 끊기" segs={ROW_CAP} />}
              {scene === 3 && <text x={X0 + WIDTH} y={192} textAnchor="end" fontSize={13} fontWeight={700} fill={AMBER}>가입자 몫 20 + 50 = 70만 원</text>}
            </>
          ) : (
            <>
              <Bar y={32} caption="최초 조건, 20명 × 300만 원" segs={ROW_FIRST} unit={WIDTH / 6000} />
              <Bar y={102} caption="이 계약, 20명 × 230만 원" segs={ROW_NEXT} unit={WIDTH / 6000} />
              <text x={X0 + WIDTH} y={152} textAnchor="end" fontSize={13} fontWeight={700} fill={AMBER}>가입자에게 더 남는 손실 1,400만 원</text>
            </>
          )}
        </svg>
      )}
    />
  );
}
