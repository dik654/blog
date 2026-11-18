import SceneShell from "./SceneShell";

/**
 * 본문 대응: #finalization-pruning Safety — 전체 96에서 충돌하는 두 quorum이 각각 64이면
 * 64 + 64 − 96 = 32만큼은 반드시 양쪽에 겹친다. Q2를 Q1에서 가장 멀리 놓아도 [32, 96]이 된다.
 */
const TOTAL = 96;
const LEFT = 20;
const RIGHT = 380;
const UNIT = (RIGHT - LEFT) / TOTAL;
const ux = (value: number) => LEFT + value * UNIT;

const ACCENT = "#2563eb";
const SECOND = "#d97706";
const OVERLAP = "#dc2626";
const MUTED = "#64748b";
const LINE = "#94a3b8";

const SCENES = [
  { label: "Q1 = 64", summary: "96 중 64", q2: null, note: "Q1은 한 finality vote를 지지한 stake 집합입니다. 전체 활성 잔액 96 가운데 2/3인 64를 차지합니다. 집합을 한 줄 구간으로 펼친 것은 크기를 보기 위한 표현입니다(가정)." },
  { label: "Q2를 가장 멀리 놓으면", summary: "64 + 64 − 96 = 32", q2: [32, 96] as const, note: "Q2는 Q1과 양립할 수 없는 vote를 지지한 다른 64입니다. Q1과 최대한 떨어지도록 오른쪽 끝에 붙여도 96 안에 64를 놓으려면 32만큼은 Q1 구간과 겹칩니다." },
  { label: "다른 배치 (가정)", summary: "겹침 48 ≥ 32", q2: [16, 80] as const, note: "Q2를 다르게 놓으면 겹침은 더 커질 뿐 32보다 작아지지 않습니다. 16에서 80까지 놓은 이 배치는 하한을 보이려는 예시입니다(가정)." },
  { label: "겹친 32가 남기는 것", summary: "최소 32 · 전체의 1/3", q2: [32, 96] as const, note: "겹친 최소 32 balance는 양쪽 vote에 모두 서명했으므로 slashable evidence가 남는 하한입니다. Evidence가 남는다는 것과 즉시 발견·처벌된다는 것은 다르며, data availability나 영구 보관을 보장하지도 않습니다." },
] as const;

function Segment({ y, from, to, color, label }: { y: number; from: number; to: number; color: string; label: string }) {
  return (
    <g>
      <rect x={ux(from)} y={y} width={(to - from) * UNIT} height={20} rx={4} fill={color} fillOpacity={0.18} stroke={color} strokeWidth={1} />
      <text x={ux(from) + 8} y={y + 15} fontSize={13} fontWeight={700} fill={color}>
        {label}
      </text>
    </g>
  );
}

export default function QuorumOverlapViz() {
  return (
    <SceneShell
      eyebrow="Accountable safety"
      title="두 quorum이 64씩이면 적어도 32는 양쪽에 겹칩니다"
      description="가로 막대 하나가 같은 validator set의 활성 잔액 96입니다. 파란 구간은 Q1, 주황 구간은 Q2, 빨간 테두리가 양쪽 vote에 모두 들어간 stake입니다."
      ariaLabel="전체 96 안에 64짜리 두 quorum을 놓을 때 생기는 최소 겹침 32"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const q2 = scene.q2;
        const overlapFrom = q2 ? Math.max(0, q2[0]) : 0;
        const overlapTo = q2 ? Math.min(64, q2[1]) : 0;
        return (
          <svg viewBox="0 0 400 180" className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={LEFT} y={16} fontSize={13} fill={MUTED}>
              전체 활성 잔액 W = 96
            </text>
            <rect x={LEFT} y={24} width={RIGHT - LEFT} height={16} rx={4} fill="none" stroke={LINE} strokeWidth={1} />
            {[0, 32, 64, 96].map((tick) => (
              <g key={tick}>
                <line x1={ux(tick)} x2={ux(tick)} y1={40} y2={150} stroke={LINE} strokeWidth={1} strokeDasharray="2 4" />
                <text x={ux(tick)} y={170} textAnchor="middle" fontSize={13} fill={MUTED}>
                  {tick}
                </text>
              </g>
            ))}
            <Segment y={60} from={0} to={64} color={ACCENT} label="Q1 · 64" />
            {q2 && <Segment y={96} from={q2[0]} to={q2[1]} color={SECOND} label="Q2 · 64" />}
            {q2 && (
              <g>
                <rect
                  x={ux(overlapFrom)}
                  y={54}
                  width={(overlapTo - overlapFrom) * UNIT}
                  height={68}
                  rx={4}
                  fill="none"
                  stroke={OVERLAP}
                  strokeWidth={1.25}
                  strokeDasharray={active === 2 ? "4 3" : undefined}
                />
                <text x={(ux(overlapFrom) + ux(overlapTo)) / 2} y={142} textAnchor="middle" fontSize={13} fontWeight={700} fill={OVERLAP}>
                  겹침 {overlapTo - overlapFrom}
                </text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
