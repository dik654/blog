import SyncSceneShell from "./SyncSceneShell";

/**
 * 본문 대응: #full-sync — c_sync = min(c_headers, c_bodies, c_execution, c_finish).
 * 글의 예: headers 1,008 · bodies 1,008 · execution 1,005 · finish 1,005 → 1,005.
 * 칸 하나 = block 하나. 1,000까지는 사례의 로컬 canonical(저장 완료)이라 칸으로 그리지 않는다.
 */
const BLOCKS = [1001, 1002, 1003, 1004, 1005, 1006, 1007, 1008] as const;

const STAGES = [
  { name: "Headers", checkpoint: 1008 },
  { name: "Bodies", checkpoint: 1008 },
  { name: "Execution", checkpoint: 1005 },
  { name: "Finish", checkpoint: 1005 },
] as const;

const COMMON = Math.min(...STAGES.map((stage) => stage.checkpoint));

const SCENES = [
  {
    label: "다운로드 쪽 stage",
    summary: "c_headers = c_bodies = 1,008",
    visible: 2,
    note: "Headers와 bodies는 1,008까지 연속으로 확보했습니다. 칸 하나가 block 하나이고, 1,000까지는 사례에서 이미 실행·검증·저장을 마친 로컬 canonical입니다.",
  },
  {
    label: "실행 쪽 stage",
    summary: "c_execution = c_finish = 1,005",
    visible: 4,
    note: "Execution과 finish는 1,005에서 멈춰 있습니다. 다음 stage는 앞 stage가 검증한 연속 범위만 소비하며, 1,006–1,008 칸은 아직 이 두 stage가 처리하지 않았습니다.",
  },
  {
    label: "공통 checkpoint",
    summary: `min(1008, 1008, 1005, 1005) = ${COMMON.toLocaleString("en-US")}`,
    visible: 4,
    note: "네 stage가 모두 채운 가장 높은 열이 1,005입니다. Live handoff와 다음 consumer가 신뢰할 수 있는 공통 prefix는 여기까지이며, 다운로드 높이 1,008을 실행 높이로 보고하면 안 됩니다.",
  },
] as const;

export default function StageCheckpointViz() {
  return (
    <SyncSceneShell
      eyebrow="Stage checkpoint"
      title="가장 늦은 stage가 공통 진척을 정합니다"
      description="한 줄이 stage 하나, 칸 하나가 block 하나입니다. 채운 칸은 그 stage가 결과와 함께 commit한 연속 block입니다. 숫자는 글의 식에 쓴 예이며, 식과 같이 네 stage만 놓았습니다."
      ariaLabel="Headers와 Bodies는 1,008, Execution과 Finish는 1,005까지 진행해 공통 checkpoint가 1,005가 되는 세 장면"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const showCommon = active === SCENES.length - 1;
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-[4.5rem_minmax(0,1fr)_3rem] items-end gap-x-2 sm:grid-cols-[5.5rem_minmax(0,1fr)_3.5rem]">
              <span />
              <div className="grid grid-cols-8 gap-0.5">
                {BLOCKS.map((block) => (
                  <span
                    key={block}
                    className={`text-center font-mono text-[9px] leading-4 sm:text-[10px] ${showCommon && block === COMMON ? "font-bold text-primary" : "text-muted-foreground"}`}
                  >
                    {String(block).slice(-2)}
                  </span>
                ))}
              </div>
              <span className="text-right text-[9px] leading-4 text-muted-foreground sm:text-[10px]">checkpoint</span>
            </div>
            <div className="mt-1 space-y-1.5">
              {STAGES.map((stage, row) => {
                const shown = row < scene.visible;
                return (
                  <div key={stage.name} className="grid grid-cols-[4.5rem_minmax(0,1fr)_3rem] items-center gap-x-2 sm:grid-cols-[5.5rem_minmax(0,1fr)_3.5rem]">
                    <span className={`text-xs ${shown ? "font-semibold" : "text-muted-foreground/50"}`}>{stage.name}</span>
                    <div className="grid grid-cols-8 gap-0.5">
                      {BLOCKS.map((block) => {
                        const filled = shown && block <= stage.checkpoint;
                        const beyondCommon = showCommon && block > COMMON && filled;
                        return (
                          <span
                            key={block}
                            className={`h-6 rounded-sm border ${
                              filled
                                ? beyondCommon
                                  ? "border-[#94a3b8] bg-[#94a3b8]/40"
                                  : "border-[#2563eb] bg-[#2563eb]/70"
                                : "border-dashed border-border bg-transparent"
                            } ${showCommon && block === COMMON ? "ring-1 ring-primary" : ""}`}
                          />
                        );
                      })}
                    </div>
                    <span className={`text-right font-mono text-xs ${shown ? "font-bold" : "text-muted-foreground/50"}`}>{shown ? stage.checkpoint.toLocaleString("en-US") : "−"}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 grid grid-cols-[4.5rem_minmax(0,1fr)_3rem] items-center gap-x-2 sm:grid-cols-[5.5rem_minmax(0,1fr)_3.5rem]">
              <span className={`text-xs font-bold ${showCommon ? "text-primary" : "text-muted-foreground/50"}`}>c_sync</span>
              <span className={`break-keep text-[10px] leading-4 sm:text-xs ${showCommon ? "text-foreground" : "invisible"}`} aria-hidden={!showCommon}>
                네 줄이 모두 채운 열까지 · 회색 1,006–1,008은 그 stage에만 있고 아직 공통 진척이 아님
              </span>
              <span className={`text-right font-mono text-xs font-bold ${showCommon ? "text-primary" : "text-muted-foreground/50"}`}>{showCommon ? COMMON.toLocaleString("en-US") : "?"}</span>
            </div>
            <p className="mt-2 text-[10px] leading-4 text-muted-foreground">열 머리 01–08은 block 1,001–1,008의 끝 두 자리입니다.</p>
          </div>
        );
      }}
    />
  );
}
