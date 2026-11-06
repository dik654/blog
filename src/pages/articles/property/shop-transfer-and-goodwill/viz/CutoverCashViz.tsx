import SceneShell from "./SceneShell";
import SvgArrow from "./SvgArrow";

/**
 * 본문 대응: #mechanism 마지막 문단과 #limits 마지막 문단 — 주문일과 입금일이 달라 인수일을 넘는 정산·환불.
 * 마지막 거래일과 첫 거래일로 매출과 비용을 가른다. 주문의 개수와 간격은 설명용이며 금액은 본문에 없습니다.
 */
const W = 340;
const H = 196;
const CUT = 170;
const ROW_A = 62;
const ROW_B = 98;
const ROW_C = 134;
const ROW_D = 170;

const ACCENT = "#2563eb";
const FAIL = "#dc2626";
const WARN = "#b45309";
const DIM = "#94a3b8";
const TEXT = "#64748b";

const SCENES = [
  { label: "날짜가 한쪽에 몰린 주문", summary: "주문일 ≠ 입금일", note: "카드와 배달 대금은 주문한 날 바로 들어오지 않습니다. 그래도 주문과 입금이 모두 인수일의 한쪽에 있으면 누구 몫인지 헷갈리지 않습니다." },
  { label: "인수일을 넘는 입금", summary: "주문은 전, 입금은 후", note: "인수 전에 받은 주문의 대금이 인수 뒤에 들어옵니다. 입금일만 보면 새 점주 때의 돈처럼 보이므로 누가 맡는지 계약에서 미리 정합니다." },
  { label: "인수일을 넘는 환불", summary: "주문은 전, 환불은 후", note: "환불은 돈이 반대로 나갑니다. 인수 전 주문의 환불이 인수 뒤에 생기면 누가 부담할지도 같은 자리에서 정합니다." },
  { label: "기록을 가르는 선", summary: "마지막 거래일 · 첫 거래일", note: "명의만 바꾸고 채무 정산을 놓치지 않도록 마지막 거래일과 인수 이후의 첫 거래일을 정해 매출과 비용을 갈라 기록합니다." },
] as const;

function Order({ y, from, to, color, dim, refund = false }: { y: number; from: number; to: number; color: string; dim: boolean; refund?: boolean }) {
  const tint = dim ? DIM : color;
  return (
    <g>
      <circle cx={from} cy={y} r={4} fill={tint} />
      <SvgArrow x1={from + 5} y1={y} x2={to} y2={y} color={tint} dashed={refund} />
      <text x={from} y={y - 8} fontSize={12} fontWeight={dim ? 400 : 700} fill={dim ? TEXT : color}>주문</text>
      <text x={to} y={y - 8} textAnchor="end" fontSize={12} fontWeight={dim ? 400 : 700} fill={dim ? TEXT : color}>{refund ? "환불" : "입금"}</text>
    </g>
  );
}

function Stage({ step }: { step: number }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[step].label}: ${SCENES[step].summary}`}>
      <text x={CUT - 10} y={18} textAnchor="end" fontSize={13} fontWeight={700} fill={TEXT}>{step === 3 ? "마지막 거래일" : "인수 전"}</text>
      <text x={CUT + 10} y={18} fontSize={13} fontWeight={700} fill={TEXT}>{step === 3 ? "첫 거래일" : "인수 후"}</text>
      <line x1={CUT} x2={CUT} y1={6} y2={H - 4} stroke={step === 3 ? ACCENT : TEXT} strokeWidth={1.25} />

      <Order y={ROW_A} from={22} to={140} color={ACCENT} dim={step !== 0} />
      <Order y={ROW_C} from={200} to={320} color={ACCENT} dim={step !== 0} />
      <Order y={ROW_B} from={70} to={270} color={FAIL} dim={step !== 1} />
      <Order y={ROW_D} from={40} to={300} color={WARN} dim={step !== 2} refund />

      {step === 3 && (
        <g>
          <text x={CUT - 10} y={36} textAnchor="end" fontSize={13} fontWeight={700} fill={ACCENT}>인수 전 매출·비용</text>
          <text x={CUT + 10} y={36} fontSize={13} fontWeight={700} fill={ACCENT}>인수 후 매출·비용</text>
        </g>
      )}
    </svg>
  );
}

export default function CutoverCashViz() {
  return (
    <SceneShell
      eyebrow="인수일 경계"
      title="주문과 입금 사이에 인수일이 끼면 누구 돈인지가 날짜만으로 정해지지 않습니다"
      description="세로선이 인수일이고 줄 하나가 주문 한 건입니다. 건수와 간격은 설명용이며 금액은 본문에 없어 적지 않았습니다."
      ariaLabel="인수일 전후로 주문과 입금, 환불이 걸치는 경우와 마지막 거래일로 기록을 가르는 그림"
      scenes={SCENES}
      render={(active) => <Stage step={active} />}
    />
  );
}
