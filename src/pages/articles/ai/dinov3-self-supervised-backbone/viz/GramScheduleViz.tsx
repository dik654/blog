import SceneShell from "./SceneShell";

/**
 * 본문 대응: GramAnchoring.tsx #gram-teacher — 시작 시점·최초 기준·갱신 시점은 서로 다른 값.
 * 기본 학습 100만 스텝 → refinement에서 Gram 손실 켬. 최초 기준은 이른 teacher(보고서 비교: 10만·20만 비슷, 100만 더 나쁨).
 * refinement 시작 후 1만 스텝마다 Gram teacher ← EMA teacher, 최대 3회.
 */
const X0 = 24;
const X_END = 250;
const PER_10K = (X_END - X0) / 100; // 기본 학습 축: 1만 스텝당 px
const xAt = (tenK: number) => X0 + tenK * PER_10K;
const AXIS_Y = 92;

const SCENES = [
  {
    label: "기본 학습 100만 스텝",
    summary: "Gram 손실 없음",
    note: "앞 절의 세 항으로만 100만 번 갱신합니다. 앞에서 본 대로 20만 번 부근 이후에는 dense 평가가 나빠집니다. 붉은 띠는 그 구간을 가리킬 뿐 하락 폭을 나타내지 않습니다.",
  },
  {
    label: "최초 기준은 이른 체크포인트",
    summary: "10만·20만 비슷 · 100만 더 나쁨",
    note: "Gram 손실을 켜는 시점은 100만 번 뒤지만, 처음 붙잡을 관계 구조는 dense 특성이 더 좋았던 이른 teacher에서 가져옵니다. 늦은 100만 번째 모델을 기준으로 삼으면 이미 흐려진 관계까지 붙잡습니다.",
  },
  {
    label: "refinement에서 Gram 손실을 켭니다",
    summary: "켜는 시점 = 100만 이후",
    note: "계산량을 아끼려고 Gram 손실은 기본 학습이 끝난 뒤의 refinement 단계에서만 켭니다. 이때 비교 대상은 이른 체크포인트의 패치 유사도 행렬입니다.",
  },
  {
    label: "1만 스텝마다 기준 갱신",
    summary: "Gram teacher ← EMA teacher · 최대 3회",
    note: "refinement가 시작된 뒤 1만 스텝마다 Gram teacher를 현재 EMA teacher와 같은 값으로 맞춥니다. 공개 설정은 이 갱신을 최대 세 번 합니다. 갱신 사이에는 Gram teacher가 고정입니다.",
  },
] as const;

const UPDATES = [
  { at: "시작", text: "이른 teacher가 기준" },
  { at: "+1만", text: "EMA 값으로 갱신 1" },
  { at: "+2만", text: "EMA 값으로 갱신 2" },
  { at: "+3만", text: "EMA 값으로 갱신 3" },
] as const;

const MUTED = "#64748b";
const EARLY = "#2563eb";
const BAD = "#dc2626";
const GRAM = "#7c3aed";

export default function GramScheduleViz() {
  return (
    <SceneShell
      eyebrow="Gram teacher 일정"
      title="켜는 시점, 처음 기준, 갱신 시점은 서로 다릅니다"
      description="위 축은 기본 학습 0~100만 스텝을 같은 간격으로 그렸습니다. 아래 칸은 100만 번 이후 refinement 단계를 따로 늘려 그린 것이며, 이 단계의 전체 길이는 본문에 없어서 그리지 않았습니다."
      ariaLabel="Gram anchoring의 시작 시점, 최초 기준 체크포인트, 갱신 시점"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <svg viewBox="0 0 340 168" className="mx-auto block h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {/* 20만 이후 dense 평가 하락 구간 */}
            <rect x={xAt(20)} y={AXIS_Y - 14} width={xAt(100) - xAt(20)} height={8} fill={BAD} fillOpacity={0.18} />
            <text x={xAt(20)} y={AXIS_Y - 20} fontSize={12} fill={BAD}>
              20만 부근 이후 dense 평가 하락
            </text>

            {/* 기본 학습 축 */}
            <line x1={X0} y1={AXIS_Y} x2={X_END} y2={AXIS_Y} stroke={MUTED} strokeWidth={1.25} />
            {/* refinement 구간: 다른 축척 */}
            <line x1={X_END} y1={AXIS_Y} x2={326} y2={AXIS_Y} stroke={active >= 2 ? GRAM : MUTED} strokeWidth={1.25} strokeDasharray={active >= 2 ? undefined : "3 3"} />
            <line x1={X_END - 3} y1={AXIS_Y - 6} x2={X_END + 3} y2={AXIS_Y + 6} stroke={MUTED} strokeWidth={1} />
            <text x={316} y={AXIS_Y + 54} textAnchor="end" fontSize={13} fill={active >= 2 ? GRAM : MUTED} fontWeight={active >= 2 ? 700 : 400}>
              refinement
            </text>
            <text x={316} y={AXIS_Y + 70} textAnchor="end" fontSize={12} fill={MUTED}>
              {active >= 2 ? "Gram 손실 켬" : "아래 칸"}
            </text>

            {[0, 10, 20, 100].map((t) => (
              <g key={t}>
                <line x1={xAt(t)} y1={AXIS_Y - 4} x2={xAt(t)} y2={AXIS_Y + 4} stroke={MUTED} strokeWidth={1} />
                <text x={xAt(t) + (t === 0 ? -6 : t === 10 ? -2 : t === 20 ? 2 : 0)} y={AXIS_Y + 18} textAnchor={t === 0 || t === 10 ? "end" : t === 20 ? "start" : "middle"} fontSize={12} fill={MUTED}>
                  {t === 0 ? "0" : `${t}만`}
                </text>
              </g>
            ))}

            {/* 장면 2~: 이른 체크포인트와 100만 체크포인트 비교 */}
            {active >= 1 && (
              <g>
                {[10, 20].map((t) => (
                  <circle key={t} cx={xAt(t)} cy={AXIS_Y} r={5} fill={EARLY} />
                ))}
                <text x={xAt(10) - 6} y={AXIS_Y + 36} fontSize={13} fontWeight={700} fill={EARLY}>
                  10만·20만: 비슷
                </text>
                <circle cx={xAt(100)} cy={AXIS_Y} r={5} fill="none" stroke={BAD} strokeWidth={1.25} />
                <text x={xAt(100) + 6} y={AXIS_Y + 36} textAnchor="end" fontSize={13} fontWeight={700} fill={BAD}>
                  100만: 더 나쁨
                </text>
              </g>
            )}

            {/* 장면 3~: 이른 기준이 refinement로 넘어감 */}
            {active >= 2 && (
              <path
                d={`M ${xAt(15)} ${AXIS_Y - 30} C ${xAt(40)} 22, ${xAt(90)} 22, ${X_END + 6} ${AXIS_Y - 8}`}
                fill="none"
                stroke={EARLY}
                strokeWidth={1.25}
                markerEnd="url(#gram-arrow)"
              />
            )}
            {active >= 2 && (
              <text x={xAt(54)} y={26} textAnchor="middle" fontSize={12} fill={EARLY}>
                이른 체크포인트의 관계를 기준으로
              </text>
            )}
            <defs>
              <marker id="gram-arrow" viewBox="0 0 8 8" refX={7} refY={4} markerWidth={7} markerHeight={7} orient="auto">
                <path d="M0 0 L8 4 L0 8 z" fill={EARLY} />
              </marker>
            </defs>
          </svg>

          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {UPDATES.map((u, i) => {
              const on = active >= 3 || (active === 2 && i === 0);
              return (
                <div
                  key={u.at}
                  className={`flex h-16 min-w-0 flex-col justify-center rounded-md border px-2 text-center text-xs leading-5 ${
                    on ? "border-violet-600 bg-violet-600/10" : "border-dashed border-border"
                  }`}
                >
                  <span className={`font-mono font-bold ${on ? "text-violet-700 dark:text-violet-400" : "text-muted-foreground"}`}>
                    {i === 0 ? "100만 (시작)" : `100만 ${u.at}`}
                  </span>
                  <span className={on ? "" : "text-muted-foreground/70"}>{on ? u.text : "아직 없음"}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    />
  );
}
