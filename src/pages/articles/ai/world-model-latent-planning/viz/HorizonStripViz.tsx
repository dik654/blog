import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — H는 내다보는 단계, K는 먼저 실행하는 행동 수.
 * 실제 두 행동 동안: K=1이면 계획·관측 2번(예측 4×2×2=16번), K=2이면 1번(예측 8번).
 * 9절 부록 D: H=5 block 전체 실행, block당 환경 행동 5개 → 5×5 = 25 timestep.
 */
interface Row {
  title: string;
  offset: number;
  cells: readonly ("run" | "look")[];
}

interface Scene {
  label: string;
  summary: string;
  note: string;
  rows: readonly Row[];
  stat: string;
}

const SCENES: readonly Scene[] = [
  {
    label: "이 글의 가정: H=2, K=1",
    summary: "두 칸을 보고 한 칸만 실행",
    rows: [
      { title: "첫 계획", offset: 0, cells: ["run", "look"] },
      { title: "둘째 계획(새 관측에서)", offset: 1, cells: ["run", "look"] },
    ],
    stat: "실제 행동 2번 동안 계획 2번 · 실행 뒤 관측 2번 · 예측 16번",
    note: "H는 미래를 몇 단계 볼지, K는 계획을 실행할 때 몇 행동을 먼저 쓸지입니다. 칠한 칸만 실제로 실행하고 점선 칸은 모델 안에서만 봅니다. 한 칸 실행하고 관측한 뒤 바로 다시 계획합니다. 예측 횟수는 네 후보 × 두 단계 × 계획 2번입니다.",
  },
  {
    label: "K를 H와 같게: H=2, K=2",
    summary: "두 칸을 다 실행한 뒤 관측",
    rows: [
      { title: "첫 계획", offset: 0, cells: ["run", "run"] },
      { title: "", offset: 2, cells: [] },
    ],
    stat: "실제 행동 2번 동안 계획 1번 · 실행 뒤 관측 1번 · 예측 8번",
    note: "계획 전체를 실행한 뒤에야 다시 관측합니다. 본문 사례라면 1.6에 도착한 뒤에야 예측 2와의 차이를 봅니다. 계획 비용은 적지만 도중 오차를 반영하는 빈도도 줄어드는 교환입니다.",
  },
];

const LEWM_NOTE = "9절에서 볼 LeWM 논문 부록 D의 Planning solver 설정은 H=5개 행동 block 전체를 실행합니다. 한 block이 환경 행동 5개여서 5×5 = 25 환경 timestep입니다. 이 글의 H=2·K=1 가정과 다르며, 본문 사례의 수를 그대로 옮길 수 없습니다.";

const ALL = [
  ...SCENES,
  { label: "LeWM 논문 설정의 경우", summary: "5 block × 5 = 25 timestep", rows: [], stat: "", note: LEWM_NOTE },
] as const;

function Cell({ kind }: { kind: "run" | "look" | "gap" }) {
  if (kind === "gap") return <span className="h-9" />;
  return (
    <span className={`flex h-9 items-center justify-center rounded border text-xs ${kind === "run" ? "border-blue-600 bg-blue-600 font-bold text-white" : "border-dashed border-blue-600 text-blue-700 dark:text-blue-300"}`}>
      {kind === "run" ? "실행" : "예측만"}
    </span>
  );
}

export default function HorizonStripViz() {
  return (
    <SceneShell
      eyebrow="H와 K"
      title="미래를 몇 칸 보는지와 몇 칸 실행한 뒤 다시 보는지는 다른 선택입니다"
      description="가로가 시간이고 칸 하나가 행동 하나입니다. 칠한 칸은 실제 실행, 점선 칸은 모델 안의 예측입니다."
      note="예측 횟수는 네 후보를 매번 전부 펼친다고 놓은 계산입니다(가정). 실제 탐색의 호출 수와 다를 수 있습니다."
      ariaLabel="예측 길이 H와 실행 길이 K의 조합에 따른 계획과 관측 시점"
      scenes={ALL}
      render={(active) => {
        const scene = SCENES[active];
        if (!scene) {
          return (
            <div>
              <p className="mb-2 text-xs font-semibold">칸 하나가 환경 행동 하나 · 다섯 칸 묶음이 block 하나</p>
              <div className="grid grid-cols-5 gap-2">
                {[0, 1, 2, 3, 4].map((block) => (
                  <div key={block} className="grid grid-cols-5 gap-px rounded border border-border p-1">
                    {[0, 1, 2, 3, 4].map((step) => <span key={step} className="h-6 rounded-[1px] bg-blue-600" />)}
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs font-semibold">block 5개를 모두 실행한 뒤 다시 관측 · 환경 행동 25번</p>
            </div>
          );
        }
        return (
          <div>
            <div className="space-y-3">
              {scene.rows.map((row, index) => (
                <div key={index} className="min-h-[3.75rem]">
                  <p className="mb-1 min-h-5 text-xs font-semibold">{row.title}</p>
                  {row.cells.length > 0 && (
                    <div className="grid grid-cols-3 gap-1">
                      {Array.from({ length: row.offset }, (_, gap) => <Cell key={`g${gap}`} kind="gap" />)}
                      {row.cells.map((cell, cellIndex) => <Cell key={cellIndex} kind={cell} />)}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-1 grid grid-cols-3 gap-1 text-center text-xs text-muted-foreground">
              <span>행동 1</span>
              <span>행동 2</span>
              <span>그다음</span>
            </div>
            <p className="mt-3 text-xs font-semibold">{scene.stat}</p>
          </div>
        );
      }}
    />
  );
}
