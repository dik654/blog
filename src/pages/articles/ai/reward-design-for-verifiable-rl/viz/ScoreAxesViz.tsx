import SceneShell from "./SceneShell";

/**
 * 본문 대응: #names — sparse/dense는 빈도, outcome/process는 채점 대상이고,
 * 중간 검사는 일부 단계에만 둘 수도 있어 두 분류가 완전히 같지는 않습니다.
 * 여섯 행동은 5절의 가정이고, 일부 단계로 고른 2·5번은 그림을 위한 가정입니다.
 */
const SLOTS = ["행동1", "행동2", "행동3", "행동4", "행동5", "행동6", "결과"] as const;

const SCENES = [
  { label: "Sparse outcome", summary: "최종 결과를 한 번 채점", marks: [6], often: "드묾: 한 번", target: "마지막 결과", note: "작업이 끝난 뒤 결과에만 점수를 줍니다. 앞의 행동 여섯 개에는 점수가 찍히지 않습니다." },
  { label: "Dense process", summary: "중간 행동을 자주 검사", marks: [0, 1, 2, 3, 4, 5], often: "자주: 단계마다", target: "중간 행동", note: "행동마다 검사해 점수를 줍니다. 빈도와 대상이 앞 장면과 동시에 바뀌어 두 축이 하나처럼 보이기 쉽습니다." },
  { label: "일부 단계만 process", summary: "대상은 그대로, 빈도만 줄임", marks: [1, 4], often: "일부 단계 (2·5번, 가정)", target: "중간 행동", note: "대상은 여전히 중간 행동인데 자주 주지는 않습니다. 그래서 process가 곧 dense는 아니고, 두 분류는 완전히 같지 않습니다." },
] as const;

const BOX_W = 44;
const STEP = 50;
const LEFT = 6;

export default function ScoreAxesViz() {
  return (
    <SceneShell
      eyebrow="빈도와 대상"
      title="점수를 언제 주는지와 무엇에 주는지는 따로 움직입니다"
      description="5절의 여섯 행동과 최종 결과를 한 줄로 놓았습니다 (가정). 위의 점이 점수를 주는 자리입니다."
      ariaLabel="여섯 행동과 최종 결과 가운데 점수를 주는 자리의 세 가지 경우"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const marks: readonly number[] = scene.marks;
        return (
          <div className="min-w-0">
            <svg viewBox="0 0 360 76" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              {SLOTS.map((slot, index) => {
                const x = LEFT + index * STEP;
                const marked = marks.includes(index);
                const isResult = index === SLOTS.length - 1;
                return (
                  <g key={slot}>
                    {marked && <circle cx={x + BOX_W / 2} cy={14} r={7} fill="#2563eb" />}
                    <line x1={x + BOX_W / 2} y1={22} x2={x + BOX_W / 2} y2={36} stroke={marked ? "#2563eb" : "none"} strokeWidth={1} />
                    <rect x={x} y={36} width={BOX_W} height={34} rx={5} fill="none" stroke={marked ? "#2563eb" : "#94a3b8"} strokeWidth={marked ? 1.25 : 1} strokeDasharray={isResult ? "4 3" : undefined} />
                    <text x={x + BOX_W / 2} y={57} textAnchor="middle" fontSize={11} fontWeight={marked ? 700 : 400} fill={marked ? "#2563eb" : "#64748b"}>{slot}</text>
                  </g>
                );
              })}
            </svg>
            <dl className="mt-3 grid grid-cols-[3rem_minmax(0,1fr)] gap-x-2 gap-y-1 text-sm">
              <dt className="text-muted-foreground">빈도</dt><dd className="min-w-0 font-semibold">{scene.often}</dd>
              <dt className="text-muted-foreground">대상</dt><dd className="min-w-0 font-semibold">{scene.target}</dd>
            </dl>
          </div>
        );
      }}
    />
  );
}
