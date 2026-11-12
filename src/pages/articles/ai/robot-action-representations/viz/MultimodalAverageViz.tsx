import SceneShell from "./SceneShell";

/**
 * 본문 대응: #diffusion-and-flow-heads 첫 문단 — 두 정답(왼쪽으로 돌아 잡기·오른쪽으로 돌아 잡기)이
 * 함께 그럴듯하면 regression은 둘의 평균을, diffusion·flow head는 분포에서 뽑은 표본 하나를 낸다.
 * 위에서 내려다본 작업대. 두 경로는 같은 출발점에서 컵의 왼쪽·오른쪽 옆으로 가는 2차 곡선(가정)이고,
 * 평균 경로는 두 곡선을 점마다 평균한 것이다: 제어점 (110+250)/2 = 180, 끝점 (150+210)/2 = 180.
 */
const START = { x: 180, y: 172 };
const CUP = { x: 180, y: 70, r: 22 };
const LEFT = { cx: 100, cy: 116, ex: 148, ey: 70 };
const RIGHT = { cx: 260, cy: 116, ex: 212, ey: 70 };
const AVG = { cx: (LEFT.cx + RIGHT.cx) / 2, cy: (LEFT.cy + RIGHT.cy) / 2, ex: (LEFT.ex + RIGHT.ex) / 2, ey: (LEFT.ey + RIGHT.ey) / 2 };

const path = (p: { cx: number; cy: number; ex: number; ey: number }) => `M${START.x} ${START.y} Q${p.cx} ${p.cy} ${p.ex} ${p.ey}`;

const SCENES = [
  {
    label: "정답이 두 갈래",
    summary: "왼쪽으로 돌기 · 오른쪽으로 돌기",
    note: "같은 장면에서 컵을 왼쪽으로 돌아 잡는 action과 오른쪽으로 돌아 잡는 action이 둘 다 그럴듯합니다. 두 회색 경로가 그 두 정답입니다(경로 모양은 가정).",
  },
  {
    label: "Regression: 평균 하나",
    summary: "(왼쪽 + 오른쪽) ÷ 2",
    note: "Action 값 하나를 직접 맞히는 regression policy는 두 정답의 평균을 냅니다. 점마다 평균하면 가운데 경로가 되는데, 이 경로는 어느 시연에도 없고 컵 쪽으로 곧장 갑니다. 글이 말하는 '어색한 action'입니다.",
  },
  {
    label: "Diffusion·flow: 표본 하나",
    summary: "뽑을 때마다 한 갈래 쪽 action",
    note: "Diffusion Policy와 π0의 flow head는 평균 대신 조건부 분포(같은 관측에서 나올 수 있는 action들의 분포)에서 표본을 뽑습니다. 표본 하나는 두 갈래 가운데 한쪽을 따릅니다. 어느 쪽이 얼마나 자주 나오는지는 이 그림이 정하지 않습니다.",
  },
] as const;

export default function MultimodalAverageViz() {
  return (
    <SceneShell
      eyebrow="평균 vs 표본"
      title="두 정답의 평균은 어느 정답도 아닙니다"
      description="작업대를 위에서 내려다본 그림입니다. Regression은 정답 값 하나를 직접 맞히는 방식, 표본은 분포에서 하나를 뽑아 낸 action입니다."
      note="경로 모양과 위치는 설명용 가정입니다. Action chunk 하나를 손끝 경로 하나로 줄여 그렸습니다."
      ariaLabel="컵을 왼쪽 또는 오른쪽으로 돌아 잡는 두 정답, 그 평균 경로, 분포에서 뽑은 표본 경로"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 200" className="mx-auto h-auto w-full max-w-[420px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <circle cx={CUP.x} cy={CUP.y} r={CUP.r} fill="#f1f5f9" stroke="#64748b" strokeWidth={1} />
          <text x={CUP.x} y={CUP.y - CUP.r - 6} textAnchor="middle" fontSize={11} fontWeight={700} fill="#475569">컵</text>
          <path d={path(LEFT)} fill="none" stroke={active === 2 ? "#2563eb" : "#94a3b8"} strokeWidth={active === 2 ? 1.25 : 1} strokeDasharray={active === 1 ? "4 3" : undefined} />
          <path d={path(RIGHT)} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray={active === 0 ? undefined : "4 3"} />
          <circle cx={LEFT.ex} cy={LEFT.ey} r={3.5} fill={active === 2 ? "#2563eb" : "#94a3b8"} />
          <circle cx={RIGHT.ex} cy={RIGHT.ey} r={3.5} fill="#94a3b8" />
          <text x={58} y={108} textAnchor="middle" fontSize={11} fill="#475569">왼쪽 정답</text>
          <text x={302} y={108} textAnchor="middle" fontSize={11} fill="#475569">오른쪽 정답</text>
          {active === 1 && (
            <>
              <path d={path(AVG)} fill="none" stroke="#dc2626" strokeWidth={1.25} />
              <circle cx={AVG.ex} cy={AVG.ey} r={3.5} fill="#dc2626" />
              <text x={AVG.cx + 8} y={136} fontSize={11} fontWeight={700} fill="#dc2626">평균 경로</text>
              <text x={CUP.x} y={22} textAnchor="middle" fontSize={11} fill="#dc2626">어느 시연에도 없는 가운데 길</text>
            </>
          )}
          {active === 2 && (
            <text x={CUP.x} y={22} textAnchor="middle" fontSize={11} fill="#2563eb">이번 표본: 왼쪽 갈래 (다음 표본은 오른쪽일 수 있음)</text>
          )}
          <circle cx={START.x} cy={START.y} r={4.5} fill="#0f172a" />
          <text x={START.x + 10} y={START.y + 4} fontSize={11} fill="#475569">그리퍼 출발점</text>
        </svg>
      )}
    />
  );
}
