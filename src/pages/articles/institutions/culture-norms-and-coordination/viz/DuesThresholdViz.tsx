import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 칸 하나가 2만원. 8칸째 뒤의 선이 청소비 16만원.
 * 10×2=20(4 남음), 8×2=16(0), 7×2=14(2 부족). 이후 장면은 부족분 처리 순서와 가능한 경로.
 */
const CELL_W = 30;
const GAP = 3;
const X0 = 16;
const cx = (index: number) => X0 + index * (CELL_W + GAP);
const LINE_X = cx(8) - GAP / 2;

const SCENES = [
  { label: "모두 납부", summary: "10×2 = 20만원 → 4만원 남음", paid: 10, result: "16만원을 내고 4만원 남음", color: "#16a34a", steps: [] as string[], note: "남은 4만원을 넘길지 돌려줄지는 3절에서 비워 두었습니다. 초록 칸 두 개가 그 돈입니다." },
  { label: "2곳 미납", summary: "8×2 = 16만원 → 남는 돈 0", paid: 8, result: "청소비만 충당", color: "#2563eb", steps: [], note: "모인 돈의 끝이 청소비 선에 정확히 닿습니다. 남는 돈이 없어 다음 한 곳이 곧바로 부족으로 이어집니다." },
  { label: "3곳 미납", summary: "7×2 = 14만원 → 2만원 부족", paid: 7, result: "2만원 부족", color: "#dc2626", steps: [], note: "세 번째 가게도 내지 않으면 선까지 한 칸이 빕니다. 그 빈칸이 부족한 2만원입니다." },
  { label: "부족분을 다루는 순서", summary: "담당자가 먼저 확인합니다", paid: 7, result: "2만원 부족", color: "#dc2626", steps: ["납부기록과 지급일 대조", "입금 연결 오류나 일시적 어려움 확인", "당사자에게 설명할 기회", "임시로 낼 사람·돌려받는 방법을 문서로"], note: "돈을 걷는 담당자가 처리하는 순서입니다. 확인과 설명 기회가 먼저입니다." },
  { label: "청소를 줄인다면", summary: "가능한 경로일 뿐입니다", paid: 7, result: "2만원 부족", color: "#dc2626", steps: ["청소를 줄임", "거리를 함께 쓰는 모두에게 결과가 나타남", "다음 달 납부가 더 줄어들 수도 있음"], note: "이 방향은 가정의 가능한 경로이며 실제 결과는 서비스 만족도·소득·관계에 따라 달라집니다." },
] as const;

export default function DuesThresholdViz() {
  return (
    <SceneShell
      eyebrow="(가정) 청소비 선"
      title="납부 한 곳의 차이가 딱 맞던 돈을 부족으로 바꿉니다"
      description="칸 하나가 한 곳의 2만원, 세로선이 청소비 16만원입니다. 금액은 글의 가정입니다."
      ariaLabel="납부 가게 수에 따라 모인 돈과 청소비 16만원 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const steps: readonly string[] = scene.steps;
        return (
          <div key={scene.label} className="min-w-0">
            <svg viewBox="0 0 360 112" className="mx-auto h-auto w-full max-w-[560px] text-foreground" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              <text x={LINE_X} y={18} textAnchor="middle" fontSize={12.5} fontWeight={700} fill="currentColor">청소비 16만원</text>
              {Array.from({ length: 10 }, (_, index) => {
                const paid = index < scene.paid;
                const surplus = paid && index >= 8;
                const gap = !paid && index < 8;
                return (
                  <g key={index}>
                    <rect
                      x={cx(index)}
                      y={30}
                      width={CELL_W}
                      height={36}
                      rx={3}
                      fill={paid ? (surplus ? "#16a34a" : "#2563eb") : "none"}
                      stroke={paid ? "none" : gap ? "#dc2626" : "#94a3b8"}
                      strokeWidth={1}
                      strokeDasharray={paid ? undefined : "3 3"}
                    />
                    <text x={cx(index) + CELL_W / 2} y={52} textAnchor="middle" fontSize={12} fill={paid ? "#ffffff" : gap ? "#dc2626" : "#64748b"}>
                      {paid ? "2만" : gap ? "부족" : "미납"}
                    </text>
                  </g>
                );
              })}
              <line x1={LINE_X} x2={LINE_X} y1={24} y2={72} stroke="currentColor" strokeWidth={1.25} />
              <text x={X0} y={92} fontSize={13} fill="currentColor">모인 돈 {scene.paid * 2}만원</text>
              <text x={344} y={92} textAnchor="end" fontSize={13} fontWeight={700} fill={scene.color}>{scene.result}</text>
            </svg>
            {steps.length > 0 && (
              <ol className="mt-3 grid gap-1.5 text-xs leading-5 sm:grid-flow-col sm:auto-cols-fr">
                {steps.map((step, index) => (
                  <li key={step} className={`rounded-md border px-3 py-1.5 ${active === 4 && index === 2 ? "border-dashed border-[#d97706]" : "border-border"}`}>
                    <span className="mr-1 font-mono font-bold text-primary">{index + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            )}
          </div>
        );
      }}
    />
  );
}
