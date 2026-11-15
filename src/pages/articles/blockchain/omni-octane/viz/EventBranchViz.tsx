import SceneShell from "./SceneShell";

/**
 * 본문 대응: #event-release — FCU 성공 뒤 등록 processor의 address·topics로 EP101 logs를 가져와 log index 순 정렬,
 * event마다 CacheMultiStore branch에서 실행, 성공이면 parent state에 Write, error·panic이면 branch를 버리고 다음 event.
 * 관찰 5개 중 4개 Write(ExplainedFormula 가정과 같음). 실패 위치 L2는 그림을 위한 가정.
 */
const EVENTS = ["L0", "L1", "L2", "L3", "L4"] as const;
const FAILED = 2;

const SCENES = [
  {
    label: "Log 가져와 정렬",
    summary: "EP101 logs 5개 · log index 순",
    done: 0,
    note: "FCU가 성공하면 Octane은 등록된 processor의 address·topics로 EP101의 logs를 가져와 log index 순으로 줄 세웁니다. 이때 execution head는 이미 EP101이고, 아래 parent state에는 아직 어떤 event effect도 없습니다.",
  },
  {
    label: "성공한 branch는 합칩니다",
    summary: "L0 · L1 → Write",
    done: 2,
    note: "각 event는 parent state의 사본처럼 쓰는 CacheMultiStore branch 위에서 실행됩니다. Processor가 성공하면 그 branch의 변경을 parent state에 씁니다(Write).",
  },
  {
    label: "실패한 branch만 버립니다",
    summary: "L2 error·panic → 버림",
    done: 3,
    note: "L2 processor가 error나 panic을 내면(가정) 그 branch의 변경만 버립니다. 이미 합친 L0·L1은 그대로 남고, 처리는 멈추지 않고 다음 event로 넘어갑니다.",
  },
  {
    label: "끝까지 진행합니다",
    summary: "Write 4 / 관찰 5 = 0.8 · 실패 1",
    done: 5,
    note: "L3·L4도 각자 branch에서 성공해 합쳐집니다. Block 전체가 all-or-nothing이 아니라 event 하나만 빠진 결과입니다. 0.8은 block 성공률이 아니며, 실패 event의 block·log index·processor를 따로 남겨야 이 빠짐을 찾을 수 있습니다.",
  },
] as const;

export default function EventBranchViz() {
  return (
    <SceneShell
      eyebrow="EP101 logs · event별 branch"
      title="Event 하나가 실패해도 그 branch만 버리고 다음 event로 갑니다"
      description="한 줄이 log 하나입니다. 다섯 개 중 네 개가 성공하는 숫자는 아래 수식의 가정과 같고, 실패한 것이 L2라는 위치는 그림을 위한 가정입니다."
      ariaLabel="EP101 log 다섯 개를 event별 branch에서 처리해 네 개만 parent state에 쓰는 과정"
      scenes={SCENES}
      render={(active) => {
        const done = SCENES[active].done;
        const written = EVENTS.filter((_, i) => i < done && i !== FAILED);
        return (
          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 rounded-lg border border-border bg-background px-3 py-2 text-[11px] sm:text-xs">
              <span className="font-semibold text-muted-foreground">execution head</span>
              <span className="font-mono font-bold">EP101 (FCU 성공 뒤 고정)</span>
            </div>
            <div className="mt-3 grid gap-1.5">
              {EVENTS.map((ev, i) => {
                const processed = i < done;
                const failed = processed && i === FAILED;
                const current = i === done - 1;
                const status = !processed ? "대기" : failed ? "error·panic → branch 버림" : "성공 → parent에 Write";
                const color = !processed ? "#94a3b8" : failed ? "#dc2626" : "#059669";
                return (
                  <div
                    key={ev}
                    className={`grid grid-cols-[2.4rem_minmax(0,1fr)] items-center gap-2 rounded-md border px-2.5 py-1.5 text-[11px] sm:text-xs ${failed ? "border-dashed" : ""}`}
                    style={{ borderColor: processed ? color : "#e2e8f0", borderWidth: current ? 1.25 : 1 }}
                  >
                    <span className="font-mono font-bold">{ev}</span>
                    <span className="min-w-0 break-keep" style={{ color: processed ? color : undefined }}>
                      <span className={processed ? "font-semibold" : "text-muted-foreground"}>{status}</span>
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 rounded-lg border border-border bg-background px-3 py-2 text-[11px] leading-5 sm:text-xs">
              <p className="font-semibold text-muted-foreground">parent state에 합쳐진 event</p>
              <p className="mt-1 font-mono font-bold">{written.length === 0 ? "없음" : written.join(" · ")}</p>
              <p className="mt-1 font-mono text-muted-foreground">Write {written.length} / 관찰 {EVENTS.length}</p>
            </div>
          </div>
        );
      }}
    />
  );
}
