import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison — 『순자』 예론의 욕망·한정된 물자·다툼·분배 기준을 곡물 100자루에 대입.
 * 요구가 100을 얼마나 넘는지는 글이 정하지 않았으므로 점선 칸은 끝을 닫지 않습니다.
 */
const GROUPS = [
  { until: 50, color: "#2563eb", label: "공통 식량 50" },
  { until: 70, color: "#16a34a", label: "추가 돌봄 20" },
  { until: 90, color: "#b45309", label: "다음 철 씨앗 20" },
  { until: 100, color: "#475569", label: "운영 10" },
] as const;

const SCENES = [
  { label: "요구가 곡물보다 큽니다", summary: "요구 > 100자루", note: "칸 하나가 한 자루입니다. 사람에게는 욕망이 있고 곡물은 100자루로 한정됩니다. 점선은 100을 넘는 요구이며, 얼마나 넘는지는 글이 정하지 않아 끝을 닫지 않았습니다." },
  { label: "기준이 없으면", summary: "다 얻지 못함 → 다툼", note: "『순자』 예론은 원하는 것을 다 얻지 못하면 다툼이 생긴다고 설명합니다. 아직 어느 칸이 누구 몫인지 정해져 있지 않습니다." },
  { label: "기준과 경계를 세웁니다", summary: "누가 얼마, 왜 기다리는지 공개", note: "예론은 옛 왕이 분배의 기준과 경계를 세워 욕망과 물자가 함께 자라게 했다고 설명합니다. 3절의 장부(가정)에 대입하면 예는 누가 얼마를 받고 왜 기다릴지를 공개하는 형식입니다." },
  { label: "『논어』와 합치지 않습니다", summary: "같은 예, 다른 질문", note: "『순자』는 왜 예가 생기는지를, 『논어』는 덕과 예로 이끌 때의 효과를 말합니다. 둘을 하나의 유가 공식으로 합치면 인간 본성과 교육, 정치 권력에 대한 차이를 놓칩니다." },
] as const;

const SIZE = 15;
const GAP = 2;
const STEP = SIZE + GAP;

function Grid({ colored, showExcess }: { colored: boolean; showExcess: boolean }) {
  const width = STEP * 10 + 70;
  const height = STEP * 10;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="mx-auto block h-auto w-full max-w-[230px] sm:max-w-[300px]" role="img" aria-label={colored ? "곡물 100칸을 50, 20, 20, 10으로 나눔" : "곡물 100칸과 그보다 큰 요구"}>
      {Array.from({ length: 100 }, (_, index) => {
        const group = GROUPS.find((item) => index < item.until);
        return (
          <rect
            key={index}
            x={(index % 10) * STEP}
            y={Math.floor(index / 10) * STEP}
            width={SIZE}
            height={SIZE}
            rx={2}
            fill={colored && group ? group.color : "#94a3b8"}
          />
        );
      })}
      {showExcess && (
        <>
          <path d={`M ${width} 0 H ${STEP * 10 + 4} V ${height - GAP} H ${width}`} fill="none" stroke="#dc2626" strokeWidth={1} strokeDasharray="4 3" />
          <text x={STEP * 10 + 36} y={height / 2 - 4} textAnchor="middle" fontSize={11} fontWeight={700} fill="#dc2626">넘는 요구</text>
          <text x={STEP * 10 + 36} y={height / 2 + 12} textAnchor="middle" fontSize={11} fill="#dc2626">크기 미정</text>
        </>
      )}
    </svg>
  );
}

function SidePanel({ scene }: { scene: number }) {
  if (scene === 2) {
    return (
      <ul className="space-y-1.5 text-xs">
        {GROUPS.map((group) => (
          <li key={group.label} className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: group.color }} />
            {group.label}
          </li>
        ))}
        <li className="pt-2 leading-5 text-muted-foreground">점선의 요구: 왜 기다리는지 공개</li>
      </ul>
    );
  }
  return (
    <ol className="space-y-1.5 text-xs leading-5">
      <li className={scene === 0 ? "font-bold" : "text-muted-foreground"}>1. 욕망이 있습니다</li>
      <li className={scene === 0 ? "font-bold" : "text-muted-foreground"}>2. 물자는 100자루입니다</li>
      <li className={scene === 1 ? "font-bold text-red-700 dark:text-red-400" : "text-muted-foreground/60"}>3. 다 얻지 못하면 다툼</li>
    </ol>
  );
}

function SourceMap() {
  const cards = [
    { source: "『순자』 예론", question: "왜 예가 생기나", answer: "욕망과 한정된 물자의 충돌을 다루려고 기준과 경계를 세웁니다." },
    { source: "『논어』 위정편", question: "덕과 예로 이끌면 어떻게 되나", answer: "부끄러움을 알고 스스로 바로잡는다고, 정령·형벌과 대비합니다." },
  ];
  return (
    <div className="min-w-0">
      <div className="mx-auto w-fit rounded-lg border border-primary/60 bg-background px-4 py-1.5 text-sm font-bold">예(禮)</div>
      <p className="mt-2 text-center text-xs text-muted-foreground">한 줄로 잇지 않고 따로 묻습니다</p>
      <div className="mt-2 grid min-w-0 gap-3 sm:grid-cols-2">
        {cards.map((card) => (
          <div key={card.source} className="min-w-0 rounded-lg border border-border bg-background p-3">
            <p className="text-sm font-bold">{card.source}</p>
            <p className="mt-1 text-xs font-semibold text-primary">{card.question}</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">{card.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ScarcityBoundaryViz() {
  return (
    <SceneShell
      eyebrow="왜 예가 필요한가"
      title="요구가 100자루를 넘을 때 『순자』의 예가 하는 일"
      description="『순자』 예론의 설명을 이 글의 곡물 100자루 예(가정)에 대입합니다."
      ariaLabel="요구가 곡물 100자루를 넘을 때 분배 기준과 경계를 세우는 과정, 그리고 논어와의 차이"
      scenes={SCENES}
      render={(active) => (
        <StableSceneStack
          active={active}
          scenes={SCENES.map((scene, index) =>
            index === 3 ? (
              <SourceMap key={scene.label} />
            ) : (
              <div key={scene.label} className="grid min-w-0 items-center gap-4 sm:grid-cols-[minmax(0,1fr)_12rem]">
                <Grid colored={index === 2} showExcess />
                <SidePanel scene={index} />
              </div>
            ),
          )}
        />
      )}
    />
  );
}
