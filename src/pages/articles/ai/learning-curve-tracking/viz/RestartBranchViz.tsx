import SceneShell from "./SceneShell";

/**
 * 본문 대응: curve-terms(Attempt)·boundary 절.
 * 과거 체크포인트에서 복구하면 모델 진척은 마지막 관측보다 뒤로 가고, 소비한 토큰과 시간은 되돌아가지 않는다.
 * 본문에 숫자가 없으므로 점의 위치와 막대 길이는 설명용 배치입니다(가정).
 */
const SCENES = [
  {
    label: "원래 실행이 관측을 남깁니다",
    summary: "시도 1 · 체크포인트 저장",
    note: "가로축은 모델 진척(갱신 수)입니다. 시도 1이 관측 네 개를 남기고, 두 번째 관측 무렵의 모델 상태를 체크포인트로 저장했다고 둡니다(가정).",
  },
  {
    label: "멈춘 뒤 과거 상태로 복구합니다",
    summary: "진척이 뒤로 갑니다",
    note: "시도 1이 멈추고 저장해 둔 과거 체크포인트에서 다시 시작하면, 복구된 모델의 진척 좌표는 마지막 관측보다 뒤로 갈 수 있습니다. 이 그림처럼 체크포인트 뒤에 관측이 더 쌓여 있었다면 그렇습니다.",
  },
  {
    label: "덮어쓰지 않고 분기로 잇습니다",
    summary: "시도 2 = 새 경로",
    note: "다시 시작한 실행은 체크포인트에서 갈라지는 새 경로(시도 2)로 연결합니다. 시도 1이 체크포인트 뒤에 남긴 관측도 지우거나 덮어쓰지 않습니다.",
  },
  {
    label: "소비량은 되돌아가지 않습니다",
    summary: "다시 처리한 구간도 비용",
    note: "모델 진척은 뒤로 갔지만 이미 쓴 토큰과 시간은 그대로 남습니다. 체크포인트에서 멈춘 자리까지는 같은 자료를 두 번 처리한 셈이며, 그 비용을 없애지 않고 따로 적습니다.",
  },
] as const;

const W = 360;
const H = 206;
const L = 54;
const ROW1 = 44;
const ROW2 = 96;
const CKPT = 120;
const STOP = 250;
const OBS1 = [80, 120, 170, 220] as const;
const OBS2 = [170, 220, 270, 320] as const;
const END2 = 330;

const C1 = "#2563eb";
const C2 = "#16a34a";
const MUTED = "#94a3b8";
const INK = "#334155";
const STOPC = "#dc2626";

/** 아래 막대: 실제로 흘러간 순서대로 소비한 양(설명용 축척) */
const BAR_Y = 158;
const SCALE = 0.62;
const SEG1 = (STOP - L) * SCALE;
const REDO = (STOP - CKPT) * SCALE;
const SEG2 = (END2 - CKPT) * SCALE;

export default function RestartBranchViz() {
  return (
    <SceneShell
      eyebrow="복구와 재시도"
      title="과거 상태에서 다시 시작한 실행은 새 경로로 남깁니다"
      description="체크포인트는 학습 중에 저장해 둔 모델 상태이고, 시도(attempt)는 복구와 재시도를 구별하는 실제 실행 기록입니다. 점 위치와 막대 길이는 설명용입니다(가정)."
      ariaLabel="과거 체크포인트에서 복구한 실행을 분기로 기록하고 소비량을 따로 남기는 과정"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <text x={4} y={ROW1 + 4} fontSize={12} fontWeight={700} fill={C1}>
            시도 1
          </text>
          <line x1={L} x2={active >= 1 ? STOP : OBS1[3] + 14} y1={ROW1} y2={ROW1} stroke={C1} strokeWidth={1.25} />
          {OBS1.map((p) => (
            <circle key={p} cx={p} cy={ROW1} r={4} fill="#ffffff" stroke={C1} strokeWidth={1.25} />
          ))}
          <rect x={CKPT - 6} y={ROW1 - 18} width={12} height={8} rx={1} fill={INK} />
          <text x={CKPT} y={ROW1 - 22} textAnchor="middle" fontSize={11} fill={INK}>
            체크포인트
          </text>
          {active >= 1 && (
            <g>
              <text x={STOP} y={ROW1 + 4} textAnchor="middle" fontSize={15} fontWeight={700} fill={STOPC}>
                ✕
              </text>
              <text x={STOP + 10} y={ROW1 - 8} fontSize={11} fill={STOPC}>
                멈춤
              </text>
            </g>
          )}
          {active === 1 && (
            <g>
              <path d={`M ${STOP - 6} ${ROW1 + 12} Q ${(STOP + CKPT) / 2} ${ROW1 + 40} ${CKPT + 6} ${ROW1 + 12}`} fill="none" stroke={STOPC} strokeWidth={1} strokeDasharray="3 3" />
              <text x={(STOP + CKPT) / 2} y={ROW1 + 44} textAnchor="middle" fontSize={12} fill={STOPC}>
                복구하면 진척이 여기로 돌아감
              </text>
            </g>
          )}
          {active >= 2 && (
            <g>
              <text x={4} y={ROW2 + 4} fontSize={12} fontWeight={700} fill={C2}>
                시도 2
              </text>
              <line x1={CKPT} y1={ROW1 + 6} x2={CKPT} y2={ROW2} stroke={C2} strokeWidth={1} strokeDasharray="3 3" />
              <line x1={CKPT} x2={END2} y1={ROW2} y2={ROW2} stroke={C2} strokeWidth={1.25} />
              {OBS2.map((p) => (
                <circle key={p} cx={p} cy={ROW2} r={4} fill="#ffffff" stroke={C2} strokeWidth={1.25} />
              ))}
              <text x={CKPT + 6} y={ROW2 - 8} fontSize={11} fill={C2}>
                체크포인트에서 갈라짐
              </text>
            </g>
          )}
          <line x1={L} x2={W - 8} y1={ROW2 + 22} y2={ROW2 + 22} stroke={MUTED} strokeWidth={1} />
          <text x={W - 8} y={ROW2 + 34} textAnchor="end" fontSize={11} fill="#64748b">
            모델 진척(갱신 수) →
          </text>
          {active === 3 && (
            <g>
              <text x={4} y={BAR_Y - 8} fontSize={11} fill={INK}>
                실제로 쓴 토큰·시간 (흘러간 순서대로)
              </text>
              <rect x={L} y={BAR_Y} width={SEG1} height={12} fill={C1} opacity={0.75} />
              <rect x={L + SEG1} y={BAR_Y} width={REDO} height={12} fill={STOPC} opacity={0.75} />
              <rect x={L + SEG1 + REDO} y={BAR_Y} width={SEG2 - REDO} height={12} fill={C2} opacity={0.75} />
              <text x={L + SEG1 / 2} y={BAR_Y + 26} textAnchor="middle" fontSize={11} fill={C1}>
                시도 1
              </text>
              <text x={L + SEG1 + REDO / 2} y={BAR_Y + 26} textAnchor="middle" fontSize={11} fill={STOPC}>
                시도 2: 다시 처리
              </text>
              <text x={L + SEG1 + REDO + (SEG2 - REDO) / 2} y={BAR_Y + 42} textAnchor="middle" fontSize={11} fill={C2}>
                시도 2: 새 구간
              </text>
            </g>
          )}
        </svg>
      )}
    />
  );
}
