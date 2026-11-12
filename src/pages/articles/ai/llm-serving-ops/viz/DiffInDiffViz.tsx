import SceneShell from "./SceneShell";

/**
 * 본문 대응: #observability-aiops "한 번의 운영 변경이 실제로 사용자 SLI를 개선했다고 언제 말할 수 있는가?"
 * TTFT p95(ms) 값은 모두 가정. 낮을수록 좋다.
 * canary 780 → 700, control 800 → 740.
 * Δafter = 700 − 740 = −40, Δbefore = 780 − 800 = −20, Δeffect = −40 − (−20) = −20.
 * 마지막 장면: control도 800 → 720으로 canary와 같은 폭(−80) → Δafter = −20, Δeffect = 0.
 */
const CANARY = [780, 700] as const;
const CONTROL_A = [800, 740] as const;
const CONTROL_B = [800, 720] as const;

const SCENES = [
  { label: "canary만 보면", summary: "780 → 700 · −80ms", note: "변경을 적용한 canary의 TTFT만 전후로 비교하면 80ms 좋아진 것처럼 보입니다. 하지만 이 80ms에는 같은 시간대 traffic 변화도 섞여 있을 수 있습니다." },
  { label: "control도 같은 시간대에", summary: "800 → 740 · −60ms", note: "기존 설정 그대로인 control도 같은 시간대에 60ms 좋아졌습니다. 두 집단이 함께 겪은 변화가 있었다는 뜻입니다." },
  { label: "변경 후 차이", summary: "Δafter = 700 − 740 = −40", note: "변경 후 같은 시각의 두 집단을 빼면 공통 변화가 상쇄됩니다. canary가 control보다 40ms 낮습니다." },
  { label: "변경 전 차이", summary: "Δbefore = 780 − 800 = −20", note: "그런데 변경 전에도 canary 쪽이 20ms 낮았습니다. 이 차이는 변경과 무관하게 원래 있던 것입니다." },
  { label: "차이의 차이", summary: "Δeffect = −40 − (−20) = −20ms", note: "원래 있던 차이를 빼면 변경 자체가 만든 몫으로 추정되는 것은 20ms입니다. 처음 본 80ms의 4분의 1입니다." },
  { label: "control도 같은 폭이면", summary: "Δeffect = −20 − (−20) = 0", note: "control도 800 → 720으로 canary와 같은 80ms만큼 좋아졌다면 차이의 차이는 0입니다. 이때 canary의 개선은 traffic이 가벼워진 결과일 수 있습니다." },
] as const;

const CANARY_COLOR = "#2563eb";
const CONTROL_COLOR = "#64748b";
const DELTA = "#d97706";
const EFFECT = "#16a34a";
const GRID = "#e2e8f0";
const TEXT = "#475569";

const XB = 104;
const XA = 244;
const Y_TOP = 830;
const Y_BOT = 680;
const yAt = (ms: number) => 20 + ((Y_TOP - ms) / (Y_TOP - Y_BOT)) * 170;

function Bracket({ x, from, to, label, side, color, show }: { x: number; from: number; to: number; label: string; side: 1 | -1; color: string; show: boolean }) {
  const y1 = yAt(from);
  const y2 = yAt(to);
  const tick = 6 * side;
  return (
    <g opacity={show ? 1 : 0}>
      <path d={`M ${x} ${y1} h ${tick} V ${y2} h ${-tick}`} fill="none" stroke={color} strokeWidth="1.25" />
      <text x={x + tick + 4 * side} y={(y1 + y2) / 2 + 4} fontSize="15" fontWeight="700" textAnchor={side === 1 ? "start" : "end"} fill={color}>
        {label}
      </text>
    </g>
  );
}

export default function DiffInDiffViz() {
  return (
    <SceneShell
      eyebrow="Difference in differences"
      title="변경 효과는 canary와 control의 차이가 얼마나 바뀌었는지로 셉니다"
      description="canary는 새 설정을 적용한 traffic, control은 같은 시간대에 기존 설정으로 처리한 traffic입니다. 세로축은 TTFT p95(ms)이고 낮을수록 좋으므로 음수가 개선입니다. 숫자는 모두 설명용입니다(가정)."
      note="이 차이만으로 인과성이 보장되지는 않습니다. 표본 크기, 신뢰구간과 guardrail metric을 함께 봅니다."
      ariaLabel="canary와 control의 변경 전후 TTFT로 차이의 차이를 계산하는 과정"
      scenes={SCENES}
      render={(active) => {
        const control = active === 5 ? CONTROL_B : CONTROL_A;
        const showControl = active >= 1;
        const afterGap = CANARY[1] - control[1];
        const beforeGap = CANARY[0] - CONTROL_A[0];
        return (
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <svg width="22" height="8" viewBox="0 0 22 8" aria-hidden="true">
                  <line x1="0" x2="22" y1="4" y2="4" stroke={CANARY_COLOR} strokeWidth="1.25" />
                </svg>
                canary (실선)
              </span>
              <span className="inline-flex items-center gap-1.5">
                <svg width="22" height="8" viewBox="0 0 22 8" aria-hidden="true">
                  <line x1="0" x2="22" y1="4" y2="4" stroke={CONTROL_COLOR} strokeWidth="1.25" strokeDasharray="4 3" />
                </svg>
                control (점선)
              </span>
            </div>
            <svg viewBox="0 0 330 212" className="w-full max-w-sm" role="img" aria-label={SCENES[active].summary}>
              {[820, 780, 740, 700].map((ms) => (
                <g key={ms}>
                  <line x1={60} x2={300} y1={yAt(ms)} y2={yAt(ms)} stroke={GRID} strokeWidth="1" />
                  <text x={52} y={yAt(ms) + 4} fontSize="13" textAnchor="end" fill={TEXT}>
                    {ms}
                  </text>
                </g>
              ))}
              <text x={XB} y={206} fontSize="14" textAnchor="middle" fill={TEXT}>
                변경 전
              </text>
              <text x={XA} y={206} fontSize="14" textAnchor="middle" fill={TEXT}>
                변경 후
              </text>
              <g opacity={showControl ? 1 : 0}>
                <line x1={XB} x2={XA} y1={yAt(control[0])} y2={yAt(control[1])} stroke={CONTROL_COLOR} strokeWidth="1.25" strokeDasharray="5 4" />
                <circle cx={XB} cy={yAt(control[0])} r="4" fill="#ffffff" stroke={CONTROL_COLOR} strokeWidth="1.25" />
                <circle cx={XA} cy={yAt(control[1])} r="4" fill="#ffffff" stroke={CONTROL_COLOR} strokeWidth="1.25" />
              </g>
              <line x1={XB} x2={XA} y1={yAt(CANARY[0])} y2={yAt(CANARY[1])} stroke={CANARY_COLOR} strokeWidth="1.25" />
              <circle cx={XB} cy={yAt(CANARY[0])} r="4" fill={CANARY_COLOR} />
              <circle cx={XA} cy={yAt(CANARY[1])} r="4" fill={CANARY_COLOR} />
              <Bracket x={XB - 12} from={CANARY[0]} to={CONTROL_A[0]} label={`${beforeGap}`} side={-1} color={active === 4 || active === 5 ? EFFECT : DELTA} show={active >= 3} />
              <Bracket x={XA + 12} from={CANARY[1]} to={control[1]} label={`${afterGap}`} side={1} color={active === 4 || active === 5 ? EFFECT : DELTA} show={active >= 2} />
              <g opacity={active === 0 ? 1 : 0}>
                <path d={`M ${XA + 12} ${yAt(CANARY[0])} h 6 V ${yAt(CANARY[1])} h -6`} fill="none" stroke={CANARY_COLOR} strokeWidth="1.25" />
                <text x={XA + 24} y={(yAt(CANARY[0]) + yAt(CANARY[1])) / 2 + 4} fontSize="15" fontWeight="700" fill={CANARY_COLOR}>
                  −80
                </text>
              </g>
              <g opacity={active === 1 ? 1 : 0}>
                <text x={(XB + XA) / 2} y={yAt(775) - 6} fontSize="14" textAnchor="middle" fill={CONTROL_COLOR}>
                  control도 −60
                </text>
              </g>
            </svg>
          </div>
        );
      }}
    />
  );
}
