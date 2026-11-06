import LaneStrip from "./LaneStrip";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #names — 표의 역할을 포함 관계로 놓는다. 위쪽 또는 왼쪽은 작업표, 나머지는 실행 장치.
 * Grid 1개 ⊃ block 3개 ⊃ thread 4개씩 = 12개, 그중 10개만 배열 접근. Warp 단위는 32.
 * SM 2개와 block 배치는 그림의 가정.
 */
const FOCUS = ["thread", "block", "grid", "sm", "warp"] as const;
type Focus = (typeof FOCUS)[number];

const SCENES = [
  { label: "Thread", summary: "12 threads · 10개만 배열 접근", note: "배열 위치를 맡는 논리적 작업 하나가 thread입니다. 점선 점 두 개는 만들어졌지만 배열에 접근하지 않는 10번·11번 후보입니다." },
  { label: "Thread block", summary: "block 3개 × thread 4개", note: "함께 배치되어 협력하는 묶음이 block입니다. 같은 block의 thread는 shared memory라는 공동 공간과 block barrier라는 대기 지점을 사용할 수 있습니다." },
  { label: "Grid", summary: "한 번 제출한 작업표 전체", note: "이번 grid는 block 3개입니다. 장치에서 실행하는 함수인 kernel 하나를 이 작업표로 제출합니다. 여기까지가 작업을 나누는 쪽입니다." },
  { label: "SM", summary: "block을 실제로 실행하는 처리 구역", note: "장치의 scheduler가 자원에 여유가 있는 SM에 block을 배치합니다. 그림의 SM 두 개와 배치는 가정입니다. Thread가 물리 연산기 하나에 영구 고정되는 구조는 아닙니다." },
  { label: "Warp와 lane", summary: "block 안 thread를 32개 단위로", note: "명령을 함께 진행하는 실행 묶음이 warp이고 그 안의 위치가 lane입니다. 실행하는 쪽의 줄 하나가 warp 하나의 32 lane이고 칠한 칸이 thread 4개입니다. 같은 명령을 여러 thread에 적용하는 방식을 SIMT라고 부릅니다." },
] as const;

const PLACED = [
  { sm: "SM A", blocks: [0, 2] },
  { sm: "SM B", blocks: [1] },
] as const;

const BLUE = "#2563eb";

function box(on: boolean) {
  return on ? "border-primary" : "border-border/70";
}

export default function ExecutionMapViz() {
  return (
    <SceneShell
      eyebrow="이름의 포함 관계"
      title="Grid 안에 block, block 안에 thread가 들고 실행은 SM 위의 warp가 맡습니다"
      description="작업을 나누는 쪽은 열 칸 사례의 작업표이고, 실제로 실행하는 쪽은 그 block이 장치에서 놓이는 자리입니다. 점 안의 숫자는 그 thread가 맡는 배열 번호이며 block 안 번호와 다릅니다. 장면마다 이름 하나에 테두리를 칩니다."
      note="작업표의 수는 본문의 열 칸 사례이고, SM 수와 block 배치는 포함 관계를 보이려는 가정입니다."
      ariaLabel="grid, block, thread의 포함 관계와 SM, warp, lane의 실행 구조"
      scenes={SCENES}
      render={(active) => {
        const focus: Focus = FOCUS.slice(active, active + 1)[0] ?? "thread";
        return (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-semibold text-muted-foreground">작업을 나누는 쪽</p>
              <div className={`rounded-lg border p-2 ${box(focus === "grid")}`}>
                <p className="mb-2 text-xs font-semibold">Grid · kernel 한 번 제출</p>
                <div className="space-y-2">
                  {[0, 1, 2].map((block) => (
                    <div key={block} className={`flex items-center justify-between gap-2 rounded-lg border px-2 py-1 ${box(focus === "block")}`}>
                      <span className="text-xs font-semibold">Block {block}</span>
                      <span className="flex gap-1.5">
                        {[0, 1, 2, 3].map((thread) => {
                          const used = block * 4 + thread < 10;
                          return (
                            <span
                              key={thread}
                              className={`flex h-7 w-7 items-center justify-center rounded-full border font-mono text-xs ${focus === "thread" ? "border-primary" : "border-border"} ${used ? "bg-muted font-semibold" : "border-dashed text-muted-foreground"}`}
                            >
                              {block * 4 + thread}
                            </span>
                          );
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold text-muted-foreground">실제로 실행하는 쪽</p>
              <div className="space-y-2">
                {PLACED.map((place) => (
                  <div key={place.sm} className={`rounded-lg border p-2 ${box(focus === "sm")}`}>
                    <p className="mb-2 text-xs font-semibold">{place.sm}</p>
                    <div className="space-y-2">
                      {place.blocks.map((block) => (
                        <div key={block} className="grid grid-cols-[3.25rem_minmax(0,1fr)] items-center gap-1">
                          <span className="text-xs text-muted-foreground">Block {block}</span>
                          <div className={`rounded-sm border p-px ${focus === "warp" ? "border-primary" : "border-transparent"}`}>
                            <LaneStrip colorOf={(lane) => (lane < 4 ? BLUE : null)} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
