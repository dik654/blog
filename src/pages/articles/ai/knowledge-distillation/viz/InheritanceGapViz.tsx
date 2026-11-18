import SceneShell from "./KdSceneShell";

/**
 * 본문 대응: self-distillation #inheritance-audit — R = ΔA − ΔQ.
 * 본문 예: ΔA = +5%p, ΔQ = −1%p → R = 5 − (−1) = 6%p.
 * 가로축 = frozen holdout에서 잰 직전 세대 대비 변화(%p).
 */
const AGREE = "#2563eb";
const QUALITY = "#d97706";
const GAP = "#dc2626";
const AXIS = "#64748b";
const INK = "#334155";

interface Scene {
  label: string;
  summary: string;
  note: string;
  dA: number | null;
  dQ: number | null;
  showGap: boolean;
}

const SCENES: readonly Scene[] = [
  {
    label: "닮음 변화 ΔA",
    summary: "+5%p",
    note: "새 student가 teacher와 같은 답을 낸 비율(agreement)이 직전 세대보다 5%p 올랐습니다.",
    dA: 5,
    dQ: null,
    showGap: false,
  },
  {
    label: "정답 품질 변화 ΔQ",
    summary: "−1%p",
    note: "같은 holdout에서 정답과 맞춘 비율(accuracy)은 1%p 내렸습니다. agreement가 올라도 student와 teacher가 함께 틀릴 수 있으니 품질은 따로 재야 합니다.",
    dA: 5,
    dQ: -1,
    showGap: false,
  },
  {
    label: "간격 R = ΔA − ΔQ",
    summary: "5 − (−1) = 6%p",
    note: "ΔQ가 음수라 빼면 오히려 더해져 R은 6%p입니다. 닮음은 늘었는데 정답에서는 멀어진 강한 경고입니다. 다만 R 하나로 bias가 실제로 옮겨졌다는 인과를 증명하지는 않으며, 평균과 worst slice에서 함께 계산합니다.",
    dA: 5,
    dQ: -1,
    showGap: true,
  },
];

const MIN = -2;
const MAX = 6;
const LEFT = 64;
const RIGHT = 344;
const toX = (v: number) => LEFT + ((v - MIN) / (MAX - MIN)) * (RIGHT - LEFT);
const TICKS: readonly number[] = [-2, -1, 0, 1, 2, 3, 4, 5, 6];

function Bar({ y, value, color, label }: { y: number; value: number | null; color: string; label: string }) {
  const zero = toX(0);
  return (
    <g>
      <text x="6" y={y + 13} fontSize="12" fontWeight="700" fill={INK}>
        {label}
      </text>
      {value === null ? (
        <text x={zero + 6} y={y + 13} fontSize="11" fill={AXIS}>
          다음 장면
        </text>
      ) : (
        <>
          <rect x={Math.min(zero, toX(value))} y={y} width={Math.abs(toX(value) - zero)} height="18" rx="3" fill={color} />
          <text
            x={value >= 0 ? toX(value) + 5 : toX(value) - 5}
            y={y + 13}
            textAnchor={value >= 0 ? "start" : "end"}
            fontSize="11"
            fontWeight="700"
            fill={color}
          >
            {value > 0 ? `+${value}` : value < 0 ? `−${Math.abs(value)}` : "0"}
          </text>
        </>
      )}
    </g>
  );
}

export default function InheritanceGapViz() {
  return (
    <SceneShell
      eyebrow="상속 간격"
      title="닮음이 오른 만큼 정답 품질이 따라왔는지 잽니다"
      description="파란 막대는 teacher와 일치한 비율의 변화(ΔA), 주황 막대는 정답 품질의 변화(ΔQ)입니다. 둘 다 같은 frozen holdout에서 직전 세대 대비 percentage-point(%p)로 잽니다. 빨간 구간이 그 차이 R입니다."
      ariaLabel="agreement 5퍼센트포인트 상승과 accuracy 1퍼센트포인트 하락 사이의 간격 6퍼센트포인트"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const gapFrom = scene.dQ ?? 0;
        const gapTo = scene.dA ?? 0;
        const gapValue = gapTo - gapFrom;
        return (
          <svg viewBox="0 0 360 170" className="mx-auto w-full max-w-lg" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <line x1={toX(0)} y1="8" x2={toX(0)} y2="132" stroke={AXIS} strokeWidth="1" />
            <Bar y={16} value={scene.dA} color={AGREE} label="ΔA" />
            <Bar y={56} value={scene.dQ} color={QUALITY} label="ΔQ" />
            <text x="6" y="109" fontSize="12" fontWeight="700" fill={INK}>
              R
            </text>
            {scene.showGap ? (
              <g>
                <line x1={toX(gapFrom)} y1="84" x2={toX(gapFrom)} y2="112" stroke={GAP} strokeWidth="1" strokeDasharray="3 3" />
                <line x1={toX(gapTo)} y1="36" x2={toX(gapTo)} y2="112" stroke={GAP} strokeWidth="1" strokeDasharray="3 3" />
                <line x1={toX(gapFrom)} y1="104" x2={toX(gapTo)} y2="104" stroke={GAP} strokeWidth="1.25" />
                <line x1={toX(gapFrom)} y1="98" x2={toX(gapFrom)} y2="110" stroke={GAP} strokeWidth="1.25" />
                <line x1={toX(gapTo)} y1="98" x2={toX(gapTo)} y2="110" stroke={GAP} strokeWidth="1.25" />
                <text x={(toX(gapFrom) + toX(gapTo)) / 2} y="124" textAnchor="middle" fontSize="12" fontWeight="700" fill={GAP}>
                  {`R = ${gapValue}%p`}
                </text>
              </g>
            ) : (
              <text x={toX(0) + 6} y="109" fontSize="11" fill={AXIS}>
                두 변화를 본 뒤 계산
              </text>
            )}
            <line x1={LEFT} y1="140" x2={RIGHT} y2="140" stroke={AXIS} strokeWidth="1" />
            {TICKS.map((t) => (
              <g key={t}>
                <line x1={toX(t)} y1="137" x2={toX(t)} y2="143" stroke={AXIS} strokeWidth="1" />
                <text x={toX(t)} y="156" textAnchor="middle" fontSize="11" fill={AXIS}>
                  {t < 0 ? `−${Math.abs(t)}` : `${t}`}
                </text>
              </g>
            ))}
            <text x={RIGHT} y="168" textAnchor="end" fontSize="11" fill={AXIS}>
              직전 세대 대비 변화(%p)
            </text>
          </svg>
        );
      }}
    />
  );
}
