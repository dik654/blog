import SceneShell, { type ShellScene } from "./SceneShell";

/**
 * 본문 대응: #judicial-review — 긴장, 층을 나누는 답, 그 답이 성립할 조건.
 * 부채꼴 폭은 해석의 폭을 뜻하는 표시이며 잰 값이 아니다.
 */
const SCENES: readonly ShellScene[] = [
  { label: "긴장", summary: "뽑히지 않은 쪽이 뒤집음", note: "선거로 뽑히지 않은 소수가 다수의 대표가 만든 법을 무효로 만듭니다. 층이 하나뿐이면 한쪽 뜻을 다른 쪽 뜻으로 뒤집는 것처럼 보입니다." },
  { label: "층을 나눈 답", summary: "근거는 더 앞선 더 큰 합의", note: "지금의 다수가 정한 것을 뒤집는 근거가 더 앞선 시점의 더 큰 합의, 곧 헌법이라는 설명입니다. 이 설명에서 심사 기관은 자기 뜻을 관철하지 않고 그 합의를 대신 읽습니다." },
  { label: "조건이 깨질 때", summary: "읽는 자리 → 정하는 자리", note: "이 답은 헌법의 선이 읽는 사람에 따라 크게 달라지지 않아야 성립합니다. 해석의 폭이 넓어질수록 그 기관은 스스로 정하는 자리에 가까워지고 1절의 신호도 함께 흐려집니다." },
];

const BLUE = "#2563eb";
const RED = "#dc2626";
const GRAY = "#64748b";

export default function JudicialLayerViz() {
  return (
    <SceneShell
      eyebrow="층 나누기"
      title="법을 뒤집는 근거를 한 층 위에 두는 답과 그 조건"
      description="위 칸은 헌법, 아래 칸은 지금의 다수가 만든 법, 가운데는 위헌심사 기관입니다. 부채꼴 폭과 아래 점의 위치는 해석의 폭을 뜻하는 표시이며 잰 값이 아닙니다."
      ariaLabel="위헌심사의 정당성을 헌법이라는 앞선 합의에서 찾는 설명과 그 조건"
      scenes={SCENES}
      render={(active) => {
        const hasLayer = active > 0;
        const spread = active === 2 ? 118 : 14;
        const fanColor = active === 2 ? RED : BLUE;
        return (
          <div>
            <svg viewBox="0 0 340 198" className="mx-auto h-auto w-full max-w-[520px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              <defs>
                <marker id="judicial-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                  <path d="M0 0L7 3.5L0 7Z" fill={GRAY} />
                </marker>
              </defs>
              <rect
                x={20}
                y={4}
                width={300}
                height={40}
                rx={8}
                fill={hasLayer ? `${BLUE}14` : "none"}
                stroke={hasLayer ? BLUE : GRAY}
                strokeWidth={1}
                strokeDasharray={hasLayer ? undefined : "4 3"}
              />
              <text x={170} y={29} textAnchor="middle" fontSize={12.5} fontWeight={700} fill={hasLayer ? BLUE : GRAY}>
                {hasLayer ? "헌법 · 더 앞선 시점의 더 큰 합의" : "근거가 되는 위층을 아직 나누지 않음"}
              </text>

              {hasLayer && (
                <polygon
                  points={`${170 - spread},44 ${170 + spread},44 ${170 + 26},84 ${170 - 26},84`}
                  fill={`${fanColor}22`}
                  stroke={fanColor}
                  strokeWidth={1}
                />
              )}

              <rect x={92} y={84} width={156} height={46} rx={8} fill="#64748b14" stroke={GRAY} strokeWidth={1} />
              <text x={170} y={103} textAnchor="middle" fontSize={13} fontWeight={700} fill="currentColor">심사 기관</text>
              <text x={170} y={121} textAnchor="middle" fontSize={11} fill={GRAY}>선거로 뽑히지 않은 소수</text>

              <line x1={170} y1={130} x2={170} y2={153} stroke={GRAY} strokeWidth={1.25} markerEnd="url(#judicial-arrow)" />
              <text x={180} y={146} fontSize={11} fontWeight={700} fill={GRAY}>무효로 만듦</text>

              <rect x={20} y={154} width={300} height={40} rx={8} fill="#64748b14" stroke={GRAY} strokeWidth={1} />
              <text x={170} y={179} textAnchor="middle" fontSize={12.5} fontWeight={700} fill="currentColor">법 · 지금의 다수가 대표를 통해 정함</text>
            </svg>

            <div className="mx-auto mt-3 max-w-[520px]">
              <div className="flex justify-between text-xs font-semibold">
                <span className={active === 1 ? "text-foreground" : "text-muted-foreground"}>합의를 읽는 자리</span>
                <span className={active === 2 ? "text-foreground" : "text-muted-foreground"}>스스로 정하는 자리</span>
              </div>
              <div className="relative mt-2 h-3">
                <div className="absolute inset-x-0 top-1/2 h-px bg-border" />
                {hasLayer && (
                  <span
                    className="absolute top-0 h-3 w-3 rounded-full border border-background transition-[left] duration-300 motion-reduce:transition-none"
                    style={{ left: active === 2 ? "calc(82% - 6px)" : "calc(8% - 6px)", backgroundColor: fanColor }}
                  />
                )}
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
