import SceneShell from "./SceneShell";

/**
 * 본문 대응: #need 첫 문단 — 시간 격자가 거칠면 실제로 넘은 장벽을 놓칠 수 있다.
 * (가정) 예시 경로 33점, 장벽 70(축 숫자는 표시하지 않음). 0부터 센 11·12·13번째 점(72·76·71)이 장벽 위.
 * 관찰 4번(8·16·24·32번째 점) → 모두 장벽 아래, 관찰 16번(짝수 번째 점) → 12번째 점 76이 장벽 위.
 */
const PATH = [40, 43, 41, 46, 50, 48, 53, 57, 55, 61, 66, 72, 76, 71, 64, 60, 58, 61, 57, 52, 55, 59, 56, 60, 62, 58, 63, 65, 61, 64, 66, 63, 60] as const;
const PATH_LIST: readonly number[] = PATH;
const BARRIER = 70;
const COARSE: readonly number[] = [8, 16, 24, 32];
const FINE: readonly number[] = Array.from({ length: 16 }, (_, i) => (i + 1) * 2);

const SCENES = [
  { label: "실제로 움직인 길", summary: "한 번 장벽 위로 올라갔다 내려옴", grid: null, note: "(가정) 가격이 정한 선을 넘었는지에 따라 지급이 바뀌는 장벽 옵션입니다. 이 예시 경로는 중간에 잠깐 장벽 위로 올라갔다가 다시 내려옵니다." },
  { label: "관찰 네 번", summary: "네 점 모두 장벽 아래 → '안 넘음'", grid: "coarse", note: "컴퓨터는 격자 시점의 가격만 만듭니다. 네 번만 보면 네 점이 모두 선 아래라 경로가 장벽을 넘지 않은 것으로 계산됩니다." },
  { label: "관찰 열여섯 번", summary: "한 점이 장벽 위 → '넘음'", grid: "fine", note: "같은 경로를 더 촘촘히 보면 장벽 위의 점이 잡힙니다. 격자 간격만 바꿨는데 판정이 갈리므로, 시간 간격 오차를 경로 생성 오차와 따로 시험합니다." },
] as const;

const W = 360;
const H = 196;
const LEFT = 16;
const RIGHT = 56;
const TOP = 16;
const BOTTOM = 166;
const x = (i: number) => LEFT + (i / (PATH_LIST.length - 1)) * (W - LEFT - RIGHT);
const y = (v: number) => BOTTOM - ((v - 30) / (85 - 30)) * (BOTTOM - TOP);

export default function BarrierGridViz() {
  return (
    <SceneShell
      eyebrow="시간 격자"
      title="드문드문 보면 넘은 장벽을 놓칠 수 있습니다"
      description="가로는 시간, 세로는 가격이며 빨간 선이 장벽입니다. 경로 모양과 장벽 위치는 원리를 보이기 위한 예시라 축 숫자를 적지 않았습니다(가정)."
      ariaLabel="같은 경로를 관찰 4번과 16번으로 볼 때 장벽 통과 판정이 달라지는 예시"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const points = scene.grid === "coarse" ? COARSE : scene.grid === "fine" ? FINE : [];
        const crossed = points.some((i) => PATH_LIST[i] > BARRIER);
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <line x1={LEFT} x2={W - RIGHT} y1={y(BARRIER)} y2={y(BARRIER)} stroke="#dc2626" strokeWidth={1.25} />
            <text x={W - RIGHT + 6} y={y(BARRIER) + 4} fontSize={11} fontWeight={700} fill="#dc2626">장벽</text>
            <polyline
              points={PATH_LIST.map((v, i) => `${x(i)},${y(v)}`).join(" ")}
              fill="none"
              stroke="#94a3b8"
              strokeWidth={1.25}
              strokeDasharray={active === 0 ? undefined : "3 2"}
            />
            {points.map((i) => (
              <g key={i}>
                <line x1={x(i)} x2={x(i)} y1={y(PATH_LIST[i])} y2={BOTTOM} stroke="#cbd5e1" strokeWidth={1} />
                <circle cx={x(i)} cy={y(PATH_LIST[i])} r={4} fill={PATH_LIST[i] > BARRIER ? "#dc2626" : "#2563eb"} />
              </g>
            ))}
            <line x1={LEFT} x2={W - RIGHT} y1={BOTTOM} y2={BOTTOM} stroke="#94a3b8" strokeWidth={1} />
            <text x={LEFT} y={BOTTOM + 18} fontSize={11} fill="#64748b">시작</text>
            <text x={W - RIGHT} y={BOTTOM + 18} textAnchor="end" fontSize={11} fill="#64748b">만기</text>
            {active > 0 && (
              <text x={(LEFT + W - RIGHT) / 2} y={BOTTOM + 18} textAnchor="middle" fontSize={11} fontWeight={700} fill={crossed ? "#dc2626" : "#2563eb"}>
                관찰 {points.length}번 → {crossed ? "넘음" : "안 넘음"}
              </text>
            )}
          </svg>
        );
      }}
    />
  );
}
