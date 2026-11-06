import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source-update — 목록 [0, 5, 5, 7]을 평균으로 읽고, 고칠 때는
 * normalizeGradient_가 거짓이면 출현마다 g, 참이면 g/4를 더한다.
 * 기록값: g 첫 성분 ≈ 0.00353369, 행 5의 변화 ≈ 0.00706720.
 * 지도 쪽 막대는 같은 g를 가정해 배율만 비교한 것이다.
 */
const OCCURRENCES = [0, 5, 5, 7];
const ROWS = [0, 5, 7];
const MAX_UNITS = 2;

const SCENES = [
  { label: "읽기는 평균", summary: "(4, 0.75)", note: "입력 행 네 항을 평균해 숨은 값을 만듭니다. 여기까지는 두 경로가 같습니다. 그 값으로 손실을 계산하면 고칠 양 g(state.grad)가 준비됩니다.", scale: null, unit: "" },
  { label: "비지도: 나누지 않음", summary: "출현마다 g, 행 5는 2g", note: "이번 비지도 모드에서는 normalizeGradient_가 거짓입니다. 목록을 돌며 g를 그대로 더하므로 두 번 등장한 행 5는 2g만큼 바뀝니다.", scale: 1, unit: "g" },
  { label: "지도: 목록 길이로 나눔", summary: "출현마다 g/4, 행 5는 2g/4", note: "지도 학습 모드에서는 먼저 g를 4로 나눕니다. 2/4는 8절 평균 미분 계수와 같은 비율입니다. 막대는 같은 g를 넣었다고 가정해 배율만 비교한 것으로, 지도 학습을 실행해 얻은 값은 아닙니다.", scale: 0.25, unit: "g" },
  { label: "한 단계 기록값", summary: "행 5 변화 ≈ 2g", note: "softmax 손실·학습률 0.1의 별도 한 단계에서 기록한 값입니다. 2 × g와의 차이는 마지막 자리의 float32 반올림입니다. 말뭉치 전체 학습을 재현한 것은 아닙니다.", scale: null, unit: "" },
] as const;

export default function UpdateScaleViz() {
  return (
    <SceneShell
      eyebrow="읽기와 고치기"
      title="평균으로 읽어도 고칠 때는 평균으로 나누지 않을 수 있습니다"
      description="위 칸은 run이 읽는 전체 행 번호 목록입니다. 아래 막대는 행마다 더해지는 수정량을 g 단위로 그렸습니다. g는 손실이 돌려준 수정량입니다."
      ariaLabel="평균으로 읽은 뒤 비지도와 지도 경로에서 행별 수정량이 달라지는 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-3">
            <div className="grid grid-cols-4 gap-1.5">
              {OCCURRENCES.map((row, index) => (
                <div key={index} className={`rounded-md border py-1.5 text-center ${row === 5 ? "border-blue-600 bg-blue-500/10" : "border-border bg-background"}`}>
                  <span className="block text-sm font-bold">행 {row}</span>
                  <span className={`block font-mono text-[11px] text-muted-foreground ${scene.scale === null ? "invisible" : ""}`}>+{scene.scale === 0.25 ? "g/4" : "g"}</span>
                </div>
              ))}
            </div>
            {active === 3 ? (
              <div className="space-y-2 rounded-md border border-border bg-background p-3 font-mono text-xs sm:text-sm">
                <p className="flex justify-between gap-2"><span>g 첫 성분</span><strong>0.00353369</strong></p>
                <p className="flex justify-between gap-2"><span>행 5 첫 성분 변화</span><strong className="text-blue-700 dark:text-blue-400">0.00706720</strong></p>
                <p className="flex justify-between gap-2 text-muted-foreground"><span>2 × g</span><span>0.00706738</span></p>
              </div>
            ) : (
              <div className="space-y-2">
                {ROWS.map((row) => {
                  const count = OCCURRENCES.filter((value) => value === row).length;
                  const units = scene.scale === null ? 0 : count * scene.scale;
                  return (
                    <div key={row} className="grid grid-cols-[3rem_minmax(0,1fr)_3.5rem] items-center gap-2 text-xs sm:text-sm">
                      <span className="font-bold">행 {row}</span>
                      <div className="h-4 rounded-sm bg-muted/40">
                        <div className="h-full rounded-sm" style={{ width: `${(units / MAX_UNITS) * 100}%`, backgroundColor: scene.scale === 0.25 ? "#d97706" : "#2563eb" }} />
                      </div>
                      <span className="text-right font-mono">{scene.scale === null ? "−" : scene.scale === 0.25 ? (count === 1 ? "g/4" : `${count}g/4`) : count === 1 ? "g" : `${count}g`}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      }}
    />
  );
}
