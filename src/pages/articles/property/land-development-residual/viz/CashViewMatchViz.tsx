import SceneShell from "./SceneShell";
import SvgArrow from "./SvgArrow";

/**
 * 본문 대응: #mechanism 마지막 문단 — RICS 부록 B1.2.8~9의 사업 현금과 자기자본 현금 구분,
 * 그리고 이 글의 금융비 포함 70억·정액 이익 15억에 임의의 할인율을 덧붙이지 않는다는 한계.
 */
const W = 340;
const H = 190;
const ACCENT = "#2563eb";
const DIM = "#94a3b8";
const TEXT = "#64748b";
const FAIL = "#dc2626";

const LEFT = { x: 8, w: 132, h: 46 };
const TOP_Y = 8;
const LOW_Y = 72;
const MID = { x: 178, y: 18, w: 154, h: 54 };
const RATE = { x: 178, y: 126, w: 154, h: 54 };

const SCENES = [
  { label: "사업 현금으로 평가", summary: "차입·이자 제외", note: "차입금과 이자를 제외한 사업 현금을 사업의 목표 수익률로 평가합니다. 빌린 돈이 있는지와 상관없이 사업이 만드는 돈을 보는 쪽입니다." },
  { label: "자기자본 현금으로 평가", summary: "차입·상환·이자 반영", note: "차입·상환·이자를 반영한 자기자본 현금을 그 위험에 맞춰 평가합니다. 들어오는 현금의 범위가 달라지면 맞춰 쓰는 수익률도 달라집니다." },
  { label: "이 글의 숫자", summary: "할인율을 덧붙이지 않음", note: "이 글의 70억 원에는 이미 금융비가 들어 있고 목표 이익 15억 원은 정액입니다. 여기에 임의의 할인율을 덧붙여 완성된 평가로 처리하지 않습니다." },
] as const;

function Box({ x, y, w, h, text, color, dashed = false, strong = false }: { x: number; y: number; w: number; h: number; text: string; color: string; dashed?: boolean; strong?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8} fill="none" stroke={color} strokeWidth={strong ? 1.25 : 1} strokeDasharray={dashed ? "3 3" : undefined} />
      <text x={x + w / 2} y={y + h / 2 + 5} textAnchor="middle" fontSize={13} fontWeight={700} fill={color === DIM ? TEXT : color}>{text}</text>
    </g>
  );
}

function Stage({ step }: { step: number }) {
  if (step === 2) {
    return (
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[500px]" role="img" aria-label={`${SCENES[step].label}: ${SCENES[step].summary}`}>
        <Box x={LEFT.x} y={TOP_Y} w={LEFT.w} h={LEFT.h} text="금융비 포함 70억" color={TEXT} />
        <Box x={LEFT.x} y={LOW_Y} w={LEFT.w} h={LEFT.h} text="정액 이익 15억" color={TEXT} />
        <SvgArrow x1={LEFT.x + LEFT.w} y1={TOP_Y + LEFT.h / 2} x2={MID.x} y2={MID.y + 18} color={DIM} dashed />
        <SvgArrow x1={LEFT.x + LEFT.w} y1={LOW_Y + LEFT.h / 2} x2={MID.x} y2={MID.y + 36} color={DIM} dashed />
        <Box x={MID.x} y={MID.y} w={MID.w} h={MID.h} text="✕ 임의의 할인율" color={FAIL} dashed strong />
        <SvgArrow x1={MID.x + MID.w / 2} y1={MID.y + MID.h} x2={RATE.x + RATE.w / 2} y2={RATE.y} color={FAIL} dashed />
        <Box x={RATE.x} y={RATE.y} w={RATE.w} h={RATE.h} text="완성된 평가 아님" color={FAIL} strong />
      </svg>
    );
  }
  const equity = step === 1;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[500px]" role="img" aria-label={`${SCENES[step].label}: ${SCENES[step].summary}`}>
      <Box x={LEFT.x} y={TOP_Y} w={LEFT.w} h={LEFT.h} text="사업의 수입·지출" color={ACCENT} strong />
      <Box x={LEFT.x} y={LOW_Y} w={LEFT.w} h={LEFT.h} text={equity ? "차입·상환·이자" : "✕ 차입·이자"} color={equity ? ACCENT : DIM} dashed={!equity} strong={equity} />
      <SvgArrow x1={LEFT.x + LEFT.w} y1={TOP_Y + LEFT.h / 2} x2={MID.x} y2={MID.y + 18} color={ACCENT} />
      {equity ? (
        <SvgArrow x1={LEFT.x + LEFT.w} y1={LOW_Y + LEFT.h / 2} x2={MID.x} y2={MID.y + 40} color={ACCENT} />
      ) : (
        <text x={LEFT.x} y={LOW_Y + LEFT.h + 18} fontSize={13} fill={TEXT}>이 현금에 넣지 않음</text>
      )}
      <Box x={MID.x} y={MID.y} w={MID.w} h={MID.h} text={equity ? "자기자본 현금" : "사업 현금"} color={ACCENT} strong />
      <SvgArrow x1={MID.x + MID.w / 2} y1={MID.y + MID.h} x2={RATE.x + RATE.w / 2} y2={RATE.y} color={ACCENT} />
      <text x={MID.x + MID.w / 2 - 8} y={MID.y + MID.h + 32} textAnchor="end" fontSize={13} fill={TEXT}>짝을 맞춰 평가</text>
      <Box x={RATE.x} y={RATE.y} w={RATE.w} h={RATE.h} text={equity ? "그 위험에 맞춘 수익률" : "사업의 목표 수익률"} color={ACCENT} strong />
    </svg>
  );
}

export default function CashViewMatchViz() {
  return (
    <SceneShell
      eyebrow="누구의 돈인가"
      title="어느 현금을 볼지 정해야 그에 맞는 수익률이 정해집니다"
      description="왼쪽이 넣을 돈, 오른쪽 위가 평가할 현금, 오른쪽 아래가 짝이 되는 수익률입니다. RICS 부록 B1.2.8~9의 구분이며 할인율 숫자는 본문에 없어 적지 않았습니다."
      ariaLabel="사업 현금과 자기자본 현금이 각각 어떤 돈을 넣고 어떤 수익률과 짝을 이루는지 보여 주는 그림"
      scenes={SCENES}
      render={(active) => <Stage step={active} />}
    />
  );
}
