import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 사용량과 무관한 기본 금액을 늘리는 것과 사용량별 가격을 높이는 것은
 * 청구액 선을 다르게 움직인다. 본문에 수치가 없어 눈금 없이 선의 모양만 비교한다.
 */
const LEFT = 36;
const RIGHT = 336;
const BASE = 176;
const SMALL = 96;
const LARGE = 286;
const FEE_Y = 146;
const SLOPE = 0.2;
const RAISED_FEE_Y = 116;
const STEEP = 0.38;

const line = (feeY: number, slope: number, x: number) => feeY - (x - LEFT) * slope;
const BLUE = "#2563eb";
const SLATE = "#64748b";
const AMBER = "#b45309";

const SCENES = [
  { label: "요금표의 두 부분", summary: "기본 금액 + 사용량별 가격", note: "선이 세로축과 만나는 높이가 사용량과 무관한 기본 금액이고, 선의 기울기가 사용량별 가격입니다. 표시한 두 집은 사용량이 다른 경우의 예입니다(가정)." },
  { label: "기본 금액을 늘리면", summary: "선 전체가 위로", note: "두 집 모두 같은 금액만큼 오르지만 청구액이 작은 적게 쓰는 집에는 그 금액의 비중이 더 큽니다. 쓰는 양과 상관없이 들어오므로 수입은 안정되지만, 적게 쓰는 집의 부담이 커질 수 있습니다." },
  { label: "사용량별 가격을 높이면", summary: "선이 가팔라짐", note: "많이 쓰는 집일수록 더 오릅니다. 절수를 유도할 수 있지만 가구원 수가 많은 저소득 가구가 불리할 수 있습니다. 많이 쓰는 쪽 표시는 그런 집을 가정한 것입니다." },
] as const satisfies readonly { label: string; summary: string; note: string }[];

function Rise({ x, from, to, label }: { x: number; from: number; to: number; label?: string }) {
  return (
    <g>
      <line x1={x} x2={x} y1={from} y2={to} stroke={AMBER} strokeWidth={1.25} />
      <circle cx={x} cy={from} r={3} fill={SLATE} />
      <circle cx={x} cy={to} r={3} fill={BLUE} />
      {label && <text x={x} y={to - 8} textAnchor="middle" fontSize={11} fontWeight={700} fill={AMBER}>{label}</text>}
    </g>
  );
}

export default function TariffShapeViz() {
  return (
    <SceneShell
      eyebrow="요금표의 모양"
      title="기본 금액과 사용량별 가격은 다른 집을 움직입니다"
      description="가로는 한 집의 사용량, 세로는 청구액입니다. 본문에 수치가 없어 눈금 없이 모양만 그린 가정입니다. 회색이 원래 요금표, 파랑이 바뀐 요금표입니다."
      ariaLabel="기본 금액 인상과 사용량별 가격 인상이 청구액 선을 바꾸는 방식"
      scenes={SCENES}
      render={(index) => {
        const newFee = index === 1 ? RAISED_FEE_Y : FEE_Y;
        const newSlope = index === 2 ? STEEP : SLOPE;
        return (
          <svg viewBox="0 0 360 206" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[index].label}: ${SCENES[index].summary}`}>
            <line x1={LEFT} x2={RIGHT} y1={BASE} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
            <line x1={LEFT} x2={LEFT} y1={14} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
            <text x={LEFT} y={11} textAnchor="middle" fontSize={11} fill={SLATE}>청구액</text>
            <line x1={SMALL} x2={SMALL} y1={line(FEE_Y, SLOPE, SMALL)} y2={BASE} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
            <line x1={LARGE} x2={LARGE} y1={line(FEE_Y, SLOPE, LARGE)} y2={BASE} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
            <text x={SMALL} y={192} textAnchor="middle" fontSize={11} fontWeight={700} fill="currentColor">적게 쓰는 집</text>
            <text x={LARGE} y={192} textAnchor="middle" fontSize={11} fontWeight={700} fill="currentColor">많이 쓰는 집</text>
            <text x={RIGHT} y={204} textAnchor="end" fontSize={11} fill={SLATE}>사용량 →</text>
            <line x1={LEFT} x2={RIGHT} y1={FEE_Y} y2={line(FEE_Y, SLOPE, RIGHT)} stroke={SLATE} strokeWidth={1.25} strokeDasharray={index === 0 ? undefined : "4 3"} />
            {index === 0 && (
              <>
                <line x1={LEFT} x2={LEFT} y1={FEE_Y} y2={BASE} stroke={AMBER} strokeWidth={1.25} />
                <text x={LEFT + 6} y={BASE - 12} fontSize={11} fontWeight={700} fill={AMBER}>기본 금액</text>
                <text x={190} y={92} fontSize={11} fontWeight={700} fill={SLATE}>기울기 = 사용량별 가격</text>
              </>
            )}
            {index > 0 && (
              <>
                <line x1={LEFT} x2={RIGHT} y1={newFee} y2={line(newFee, newSlope, RIGHT)} stroke={BLUE} strokeWidth={1.25} />
                <Rise x={SMALL} from={line(FEE_Y, SLOPE, SMALL)} to={line(newFee, newSlope, SMALL)} label={index === 1 ? "같은 금액" : "조금"} />
                <Rise x={LARGE} from={line(FEE_Y, SLOPE, LARGE)} to={line(newFee, newSlope, LARGE)} label={index === 1 ? "같은 금액" : "많이"} />
              </>
            )}
          </svg>
        );
      }}
    />
  );
}
