import SceneShell from "./SceneShell";

/**
 * 본문 대응: #names — 평가절하의 예 "금 1에 통화 5가 아니라 6.25".
 * 금 막대를 통화 단위로 자릅니다. 숫자가 커질수록 통화 한 단위가 받는 금 조각은 작아집니다.
 * 산수: 1/5=0.2, 1/6.25=0.16, 80×5=400, 80×6.25=500.
 */
const SCENES = [
  { label: "평가절하 전", summary: "통화 1 = 금 0.2", note: "금 1을 통화 5로 나누면 통화 한 단위의 몫은 금 0.2입니다." },
  { label: "평가절하 후", summary: "통화 1 = 금 0.16", note: "같은 금 1에 통화 6.25를 주면 한 단위의 몫은 0.16으로 작아집니다. 숫자가 커졌는데 통화의 공식 가치는 낮아진 것입니다." },
  { label: "3절 장부에 넣기", summary: "금 80 × 6.25 = 500", note: "금 80으로 5:1이면 통화 400까지만 받칩니다. 비율이 6.25면 80×6.25=500으로 통화 전체에 닿습니다. 금이 늘어난 것이 아니라 약속의 값이 바뀐 것입니다." },
] as const;

const W = 320;
const H = 132;
const BAR_X = 4;
const BAR_W = W - 8;
const GOLD = "#d97706";
const MUTED = "#64748b";
const BLUE = "#2563eb";

function Slices({ count, label, each }: { count: number; label: string; each: string }) {
  const step = BAR_W / count;
  const cuts = Array.from({ length: Math.ceil(count) - 1 }, (_, i) => BAR_X + (i + 1) * step);
  return (
    <>
      <text x={BAR_X} y={16} fontSize={13} fontWeight={700} fill={GOLD}>금 1</text>
      <rect x={BAR_X} y={24} width={BAR_W} height={44} rx={2} fill={GOLD} fillOpacity={0.18} stroke={GOLD} strokeWidth={1} />
      <rect x={BAR_X} y={24} width={step} height={44} rx={2} fill={GOLD} />
      {cuts.map((x) => (
        <line key={x} x1={x} x2={x} y1={24} y2={68} stroke={GOLD} strokeWidth={1} />
      ))}
      <text x={BAR_X} y={92} fontSize={13} fontWeight={700} fill={MUTED}>{label}</text>
      <path d={`M${BAR_X} 102 V110 H${BAR_X + step} V102`} fill="none" stroke={BLUE} strokeWidth={1.25} />
      <text x={BAR_X} y={127} fontSize={13} fontWeight={700} fill={BLUE}>{each}</text>
    </>
  );
}

function Backing() {
  const scale = BAR_W / 500;
  const row = (y: number, name: string, covered: number) => (
    <g>
      <text x={BAR_X} y={y - 6} fontSize={13} fontWeight={700} fill={MUTED}>{name}</text>
      <rect x={BAR_X} y={y} width={BAR_W} height={26} rx={2} fill="none" stroke={MUTED} strokeWidth={1} strokeDasharray="3 3" />
      <rect x={BAR_X} y={y} width={covered * scale} height={26} rx={2} fill={GOLD} />
      <text x={BAR_X + 8} y={y + 18} fontSize={13} fontWeight={700} fill="#ffffff">금이 받치는 통화 {covered}</text>
    </g>
  );
  return (
    <>
      {row(22, "금 80 · 약속 5:1", 400)}
      {row(88, "금 80 · 약속 6.25:1", 500)}
    </>
  );
}

export default function DevaluationRatioViz() {
  return (
    <SceneShell
      eyebrow="평가절하"
      title="금 1에 주는 통화가 늘면 통화 한 단위의 몫이 줄어듭니다"
      description="5가 6.25로 커졌는데 왜 가치를 낮췄다고 할까요? 금 막대를 통화 단위로 잘라 진한 칸 하나가 통화 1의 몫입니다."
      note="금 100, 통화 500, 비율 5와 6.25는 설명용 가정이며, 실제 평가절하 비율이 이렇게 정해졌다는 뜻은 아닙니다."
      ariaLabel="금 1에 주는 통화가 5에서 6.25로 늘 때 통화 한 단위의 금 몫 변화"
      scenes={SCENES}
      render={(index) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={`${SCENES[index].label}: ${SCENES[index].summary}`}>
          {index === 0 && <Slices count={5} label="통화 5칸으로 자름" each="진한 칸 = 통화 1 = 금 0.2" />}
          {index === 1 && <Slices count={6.25} label="통화 6.25칸으로 자름" each="진한 칸 = 통화 1 = 금 0.16" />}
          {index === 2 && <Backing />}
        </svg>
      )}
    />
  );
}
