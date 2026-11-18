import PlotMap, { type PlotId, type PlotState } from "./PlotMap";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case 3절 첫 문단과 7절 첫 문단 — 네 구획 A·B·C·D에서
 * P 동쪽 → T 포함·R 북쪽 순서로 후보를 줄여 B를 특정하고, ‘아난드의 것’을 경작권 5년으로 바꿉니다.
 * 4 → 2 → 1의 중간 개수(2)는 그림 배치(가정)에서 나온 값이며 본문은 중간 개수를 정하지 않습니다.
 */
const SCENES: readonly {
  label: string;
  summary: string;
  note: string;
  states: Record<PlotId, PlotState>;
  marks: Partial<Record<PlotId, string>>;
  eastLine: boolean;
  tag?: string;
  record: string;
}[] = [
  {
    label: "기록 문장 그대로",
    summary: "후보 4구획이 모두 열려 있음",
    note: "‘옆’이 어느 쪽, 어느 거리인지, 나무가 경계인지 땅 안의 물건인지 문장에 없습니다. 그래서 A·B·C·D 어느 구획도 지울 근거가 없습니다.",
    states: { A: "open", B: "open", C: "open", D: "open" },
    marks: {},
    eastLine: false,
    record: "연못 옆 나무의 땅은 아난드의 것",
  },
  {
    label: "관계 1 · P의 동쪽",
    summary: "4구획 → B·D (그림 배치 기준)",
    note: "‘옆’을 ‘P의 동쪽’이라는 방향 관계로 바꾸면 연못 서쪽의 A·C가 빠집니다. 관계 하나가 후보를 줄이지만 아직 하나로 정하지는 못합니다.",
    states: { A: "out", B: "open", C: "out", D: "open" },
    marks: { A: "P 서쪽", C: "P 서쪽" },
    eastLine: true,
    record: "P의 동쪽인 구획",
  },
  {
    label: "관계 2·3 · T 포함, R 북쪽",
    summary: "B·D → B 하나",
    note: "나무 T를 경계가 아니라 구획 안의 물건으로 정하고(T 포함), 길 R 북쪽이라는 관계를 더하면 D가 빠지고 B 하나가 남습니다.",
    states: { A: "out", B: "chosen", C: "out", D: "out" },
    marks: { A: "P 서쪽", C: "P 서쪽", D: "T 없음 · R 남쪽" },
    eastLine: true,
    record: "P의 동쪽이면서 T를 포함하고 R 북쪽인 B 구획",
  },
  {
    label: "권리 종류 붙이기",
    summary: "‘아난드의 것’ → 경작권 5년",
    note: "땅을 특정해도 ‘것’이 경작권 5년인지 영구 처분권인지는 따로 정해야 합니다. 7절은 경작권 5년이라는 권리 종류와 시작 시점을 함께 적습니다.",
    states: { A: "out", B: "chosen", C: "out", D: "out" },
    marks: { A: "P 서쪽", C: "P 서쪽", D: "T 없음 · R 남쪽" },
    eastLine: true,
    tag: "경작권 5년",
    record: "B 구획 · 아난드의 경작권 5년(영구 처분권 아님) · 시작 시점 기록",
  },
];

export default function PlotNarrowingViz() {
  return (
    <SceneShell
      eyebrow="한정 관계로 후보 좁히기"
      title="관계를 하나씩 붙이면 네 구획이 B 하나로 줄어듭니다"
      description="한정자는 대상을 특정하는 성질이나 관계입니다. 여기서는 연못 P·나무 T·길 R과의 관계가 그 일을 합니다. 구획과 표식의 배치는 설명을 위한 가정이며 실제 나이야 문헌의 토지 기록이 아닙니다."
      ariaLabel="네 구획 A, B, C, D가 P 동쪽, T 포함, R 북쪽 관계로 B 하나로 좁혀지고 권리 종류가 붙는 과정"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        return (
          <div className="min-w-0">
            <PlotMap
              states={scene.states}
              marks={scene.marks}
              treeIn="B"
              eastLine={scene.eastLine}
              tag={scene.tag}
              ariaLabel={`${scene.label}: ${scene.summary}`}
            />
            <p className="mt-3 rounded-lg border border-border px-3 py-2 text-sm leading-6">
              <span className="mr-2 text-xs font-bold text-muted-foreground">기록 문장</span>
              {scene.record}
            </p>
          </div>
        );
      }}
    />
  );
}
