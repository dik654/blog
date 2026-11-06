import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 가정 모형 x′=x+a, 시작 0, 목표 2. 두 행동 후보 네 개.
 * [−1,−1] → −2, (−2−2)²=16 / [−1,+1] → 0, 4 / [+1,−1] → 0, 4 / [+1,+1] → 2, 0.
 * 네 후보 × 두 단계 = 예측 8번(본문 7절 의사코드의 이중 반복).
 */
const X0 = 50;
const STEP = 88;
const Y_MID = 100;
const UNIT = 36;
const INK = "#64748b";
const LINE = "#94a3b8";
const BLUE = "#2563eb";
const GREEN = "#16a34a";
const AMBER = "#d97706";

const PATHS = [
  { name: "[−1, −1]", points: [0, -1, -2], cost: "(−2−2)² = 16" },
  { name: "[−1, +1]", points: [0, -1, 0], cost: "(0−2)² = 4" },
  { name: "[+1, −1]", points: [0, 1, 0], cost: "(0−2)² = 4" },
  { name: "[+1, +1]", points: [0, 1, 2], cost: "(2−2)² = 0" },
] as const;

const SCENES = [
  { label: "왼쪽, 왼쪽", summary: "마지막 −2 · 비용 16", note: "시작 위치 0에서 −1을 두 번 더하면 −2입니다. 목표 2까지의 거리 4를 제곱해 비용 16이 됩니다." },
  { label: "왼쪽, 오른쪽", summary: "마지막 0 · 비용 4", note: "한 번 물러났다가 돌아오면 마지막은 0입니다. 목표까지 거리 2의 제곱이 비용 4입니다." },
  { label: "오른쪽, 왼쪽", summary: "마지막 0 · 비용 4", note: "지나온 길은 앞 장면과 다르지만 마지막 위치는 같은 0이고 비용도 4로 같습니다. 이 비용은 마지막 위치만 봅니다." },
  { label: "오른쪽, 오른쪽", summary: "마지막 2 · 비용 0", note: "마지막 위치가 목표 2와 같아 비용이 0입니다. 네 후보 중 가장 작습니다." },
  { label: "아직 움직이지 않았습니다", summary: "후보 4개 × 2단계 = 예측 8번", note: "네 줄 모두 가정 모형 안에서 계산한 예측입니다. 실제 물체는 그대로 0에 있습니다. 후보 수와 예측 길이를 늘리면 더 많은 미래를 비교할 수 있지만 모델 호출과 메모리, 계획 시간이 함께 늘어납니다." },
] as const;

const py = (x: number) => Y_MID - x * UNIT;
const sx = (s: number) => X0 + s * STEP;

export default function CandidateTreeViz() {
  return (
    <SceneShell
      eyebrow="네 후보를 펼치기"
      title="두 번의 이동이 만드는 네 길과 목표까지의 거리"
      description="가로는 행동 횟수, 세로는 위치입니다. 초록 점선이 목표 위치 2이고, 주황 선이 마지막 위치에서 목표까지의 거리입니다. 수는 물리 단위를 뺀 1차원 가정입니다."
      ariaLabel="네 행동 후보의 위치 변화와 목표까지의 제곱거리"
      scenes={SCENES}
      render={(active) => {
        const current = active < 4 ? (PATHS.slice(active, active + 1)[0] ?? null) : null;
        const end = current ? current.points[2] : null;
        return (
          <svg viewBox="0 0 360 204" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {[-2, -1, 0, 1, 2].map((x) => (
              <g key={x}>
                <line x1={X0} x2={sx(2) + 16} y1={py(x)} y2={py(x)} stroke={x === 2 ? GREEN : LINE} strokeWidth={1} strokeDasharray={x === 2 ? "4 3" : "1 4"} />
                <text x={X0 - 10} y={py(x) + 4} textAnchor="end" fontSize={12} fill={x === 2 ? GREEN : INK}>{x > 0 ? `+${x}` : x < 0 ? `−${-x}` : "0"}</text>
              </g>
            ))}
            <text x={sx(2) + 20} y={py(2) + 4} fontSize={12} fontWeight={700} fill={GREEN}>목표 2</text>
            {[0, 1, 2].map((s) => (
              <text key={s} x={sx(s)} y={196} textAnchor="middle" fontSize={12} fill={INK}>{s === 0 ? "시작" : `행동 ${s}번째`}</text>
            ))}
            {PATHS.map((path) => {
              const on = current === null || path === current;
              return (
                <polyline
                  key={path.name}
                  points={path.points.map((x, s) => `${sx(s)},${py(x)}`).join(" ")}
                  fill="none"
                  stroke={on ? BLUE : LINE}
                  strokeWidth={on ? 1.25 : 1}
                  opacity={on ? 1 : 0.4}
                />
              );
            })}
            {PATHS.flatMap((path) =>
              path.points.map((x, s) => {
                const on = current === null || path === current;
                return <circle key={`${path.name}-${s}`} cx={sx(s)} cy={py(x)} r={on ? 3.5 : 2.5} fill={on ? BLUE : LINE} opacity={on ? 1 : 0.4} />;
              }),
            )}
            {end !== null && end !== 2 && (
              <line x1={sx(2) + 8} x2={sx(2) + 8} y1={py(end)} y2={py(2)} stroke={AMBER} strokeWidth={1.25} />
            )}
            {current && (
              <text x={sx(2) + 20} y={end === 2 ? py(2) + 22 : py(end ?? 0) + 4} fontSize={12} fontWeight={700} fill={AMBER}>
                {current.cost}
              </text>
            )}
            {current === null && (
              <>
                <text x={sx(2) + 20} y={py(2) + 22} fontSize={12} fill={INK}>[+1,+1] 0</text>
                <text x={sx(2) + 20} y={py(0) - 4} fontSize={12} fill={INK}>[−1,+1] 4</text>
                <text x={sx(2) + 20} y={py(0) + 12} fontSize={12} fill={INK}>[+1,−1] 4</text>
                <text x={sx(2) + 20} y={py(-2) + 4} fontSize={12} fill={INK}>[−1,−1] 16</text>
              </>
            )}
          </svg>
        );
      }}
    />
  );
}
