import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source-clock — delta 부호로 다음 목표의 기준을 고르는 분기(time.c 184–189행).
 * 이전 목표 10000, 시작 10400, 처리 20 µs(가정).
 * 음수: 10000 − (−10000) = 20000. 양수: 10420 + 10000 = 20420.
 */
const W = 360;
const H = 144;
const AXIS_Y = 96;
const near = (us: number) => 14 + ((us - 10000) / 500) * 150;
const far = (us: number) => 196 + ((us - 19950) / 500) * 150;
const NEG = "#2563eb";
const POS = "#d97706";
const MUTED = "#64748b";

const SCENES = [
  { label: "두 경우에 공통인 사건", summary: "목표 10000 → 시작 10400 → 끝 10420", neg: false, pos: false, note: "10400 µs에 시작해 20 µs를 쓰고 10420 µs에 콜백을 마칩니다." },
  { label: "delta가 음수이면", summary: "10000 − (−10000) = 20000", neg: true, pos: false, note: "이전 목표에서 잽니다. 늦은 시간이 계산에 들어가지 않습니다." },
  { label: "delta가 양수이면", summary: "10420 + 10000 = 20420", neg: false, pos: true, note: "콜백이 끝난 뒤의 현재 시각에서 잽니다. 늦은 400 µs와 처리 20 µs가 들어갑니다." },
  { label: "같은 크기, 다른 기준", summary: "20420 − 20000 = 420 µs", neg: true, pos: true, note: "지연의 크기는 둘 다 10000인데 기준 시각이 달라 420 µs 벌어집니다." },
] as const;

export default function RescheduleBranchViz() {
  return (
    <SceneShell
      eyebrow="SDK의 다음 목표 계산"
      title="delta 부호가 다음 목표의 출발점을 고릅니다"
      description="earliest_target은 이전 목표 시각, delta는 부호 있는 지연입니다. 가로축은 µs이며 가운데 시간은 생략했습니다."
      note="콜백이 true를 반환해 저장된 지연을 쓰는 경우입니다. 10400 µs 시작과 20 µs 처리는 본문의 가정이며 보드에서 잰 값이 아닙니다."
      ariaLabel="delta 부호에 따라 다음 목표가 20000과 20420으로 갈리는 시간축"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <div className="mb-2 grid gap-2 font-mono text-xs leading-5 sm:grid-cols-2">
              <p className={`rounded-md border px-2 py-1 ${scene.neg ? "border-blue-600 font-semibold" : "border-border text-muted-foreground"}`}>delta &lt; 0 → earliest_target − delta</p>
              <p className={`rounded-md border px-2 py-1 ${scene.pos ? "border-amber-600 font-semibold" : "border-border text-muted-foreground"}`}>delta &gt; 0 → 현재 시각 + delta</p>
            </div>
            <svg viewBox={`0 14 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              <line x1={near(10000) - 6} x2={near(10500) + 6} y1={AXIS_Y} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} />
              <text x={(near(10500) + far(19950)) / 2} y={AXIS_Y + 4} textAnchor="middle" fontSize={12} fill={MUTED}>⋯</text>
              <line x1={far(19950)} x2={far(20450) + 6} y1={AXIS_Y} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} />

              <rect x={near(10000) - 4} y={AXIS_Y - 4} width={8} height={8} transform={`rotate(45 ${near(10000)} ${AXIS_Y})`} fill={MUTED} />
              <text x={near(10000) - 6} y={AXIS_Y - 20} fontSize={10.5} fontWeight={700} fill={MUTED}>목표 10000</text>
              <circle cx={near(10400)} cy={AXIS_Y} r={3.5} fill="#ffffff" stroke={MUTED} strokeWidth={1} />
              <text x={near(10400) + 2} y={AXIS_Y - 20} textAnchor="end" fontSize={10.5} fill={MUTED}>시작 10400</text>
              <circle cx={near(10420)} cy={AXIS_Y} r={3.5} fill={MUTED} />
              <text x={near(10420) + 2} y={AXIS_Y + 20} textAnchor="end" fontSize={10.5} fill={MUTED}>끝 10420</text>

              {scene.neg && (
                <>
                  <path d={`M${near(10000) + 4} ${AXIS_Y - 34} Q${(near(10000) + far(20000)) / 2} ${AXIS_Y - 92} ${far(20000)} ${AXIS_Y - 34}`} fill="none" stroke={NEG} strokeWidth={1.25} />
                  <path d={`M${far(20000) - 6} ${AXIS_Y - 42} L${far(20000)} ${AXIS_Y - 34} L${far(20000) + 3} ${AXIS_Y - 43}`} fill="none" stroke={NEG} strokeWidth={1.25} />
                  <text x={(near(10000) + far(20000)) / 2} y={AXIS_Y - 70} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={NEG}>이전 목표 + 10000</text>
                  <rect x={far(20000) - 4} y={AXIS_Y - 4} width={8} height={8} transform={`rotate(45 ${far(20000)} ${AXIS_Y})`} fill={NEG} />
                  <text x={far(20000)} y={AXIS_Y - 20} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={NEG}>20000</text>
                </>
              )}
              {scene.pos && (
                <>
                  <path d={`M${near(10420) + 4} ${AXIS_Y + 7} Q${(near(10420) + far(20420)) / 2} ${AXIS_Y + 66} ${far(20420)} ${AXIS_Y + 7}`} fill="none" stroke={POS} strokeWidth={1.25} />
                  <path d={`M${far(20420) - 8} ${AXIS_Y + 12} L${far(20420)} ${AXIS_Y + 7} L${far(20420) - 1} ${AXIS_Y + 16}`} fill="none" stroke={POS} strokeWidth={1.25} />
                  <text x={(near(10420) + far(20420)) / 2} y={AXIS_Y + 54} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={POS}>현재 시각 + 10000</text>
                  <rect x={far(20420) - 4} y={AXIS_Y - 4} width={8} height={8} transform={`rotate(45 ${far(20420)} ${AXIS_Y})`} fill={POS} />
                  <text x={far(20420) + 10} y={AXIS_Y - 20} textAnchor="end" fontSize={10.5} fontWeight={700} fill={POS}>20420</text>
                </>
              )}
            </svg>
          </div>
        );
      }}
    />
  );
}
