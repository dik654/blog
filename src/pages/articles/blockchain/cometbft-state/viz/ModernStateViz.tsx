import { useEffect, useRef } from "react";
import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = [
  "B42 저장",
  "F42 저장",
  "A42 Commit",
  "State 저장 전 종료",
  "ABCI Info",
  "높이 분류",
  "F42 복구",
  "State만 재구성",
  "높이 43 재개",
] as const;

type StoreKey = "block" | "result" | "state" | "app";

const STATES: readonly {
  method: string;
  owner: string;
  block: string;
  result: string;
  state: string;
  app: string;
  decision: string;
  changed: readonly StoreKey[];
}[] = [
  { method: "BlockStore.SaveBlock", owner: "Consensus State", block: "B42 · tx T1 · seen commit", result: "F41", state: "S41 · AppHash X41", app: "A41 · AppHash X41", decision: "합의된 B42 원본과 commit을 먼저 영속화합니다.", changed: ["block"] },
  { method: "SaveFinalizeBlockResponse(42)", owner: "BlockExecutor · State Store DB", block: "B42", result: "F42 · AppHash X42", state: "S41 · AppHash X41", app: "A41 · AppHash X41", decision: "FinalizeBlock 응답을 애플리케이션 Commit보다 먼저 저장합니다.", changed: ["result"] },
  { method: "ABCI Commit", owner: "Application", block: "B42", result: "F42 · AppHash X42", state: "S41 · AppHash X41", app: "A42 · AppHash X42", decision: "Alice 잔액 감소와 Bob 잔액 증가를 application DB에 영속화합니다.", changed: ["app"] },
  { method: "process crash", owner: "운영체제 · process 경계", block: "B42", result: "F42 · AppHash X42", state: "S41 · AppHash X41", app: "A42 · AppHash X42", decision: "State Store의 State snapshot만 한 높이 뒤에 남았습니다.", changed: [] },
  { method: "Query.Info", owner: "Handshaker → Application", block: "Hb=42", result: "F42 보존", state: "Hs=41 · X41", app: "Ha=42 · X42", decision: "재시작 시 application이 보고한 높이와 hash를 별도로 읽습니다.", changed: ["app"] },
  { method: "ReplayBlocksWithContext", owner: "Handshaker", block: "Hb=42", result: "F42 보존", state: "Hs=41", app: "Ha=42", decision: "Hb=Hs+1이고 Ha=Hb이므로 ‘Commit 뒤 State 저장 전 종료’ 분기입니다.", changed: ["block", "state", "app"] },
  { method: "LoadLastFinalizeBlockResponse(42)", owner: "State Store", block: "B42", result: "F42 · X42 읽음", state: "S41", app: "A42 · X42", decision: "높이가 일치하는 마지막 응답을 복구 입력으로 꺼냅니다.", changed: ["result"] },
  { method: "newMockProxyApp(F42) → replayBlock", owner: "Handshaker · BlockExecutor", block: "B42 재사용", result: "F42 재사용", state: "S42 · AppHash X42", app: "A42 · 변경 없음", decision: "실제 application을 다시 실행하지 않고 State snapshot만 재구성합니다.", changed: ["state"] },
  { method: "assertAppHashEqualsOneFromState", owner: "Handshaker", block: "B42 · 다음은 B43", result: "F42", state: "S42 · X42", app: "A42 · X42", decision: "State와 application hash가 같을 때만 높이 43의 합의를 시작합니다.", changed: ["state", "app"] },
] as const;

const NOTES = [
  "B42에는 alice→bob 10 transaction T1이 들어 있습니다. BlockStore는 block bytes·parts·seen commit을 연속 높이로 보존합니다.",
  "F42는 별도 서버가 아니라 State Store와 같은 DB에 저장되는 FinalizeBlock 응답입니다. 설정상 높이별 응답을 버려도 crash recovery용 마지막 응답은 항상 SetSync로 남깁니다.",
  "Application은 Commit이 반환되기 전에 자체 DB를 영속화해야 합니다. 이 시점부터 T1을 실제 application에 다시 적용하면 잔액이 두 번 바뀔 수 있습니다.",
  "ApplyBlock은 이 다음에 state.AppHash를 X42로 바꾸고 State를 저장하려 했지만 그 전에 process가 종료됐습니다. 여러 저장소를 묶는 단일 transaction은 없습니다.",
  "재시작한 Handshaker는 ABCI Info로 Ha와 X42를 읽고, local BlockStore의 Hb와 State의 Hs를 따로 읽습니다.",
  "코드는 app≤block, state≤block≤state+1을 먼저 검사합니다. 이 범위를 벗어난 조합은 높은 쪽을 정답으로 선택하지 않고 error 또는 panic으로 중단합니다.",
  "저장된 마지막 FinalizeBlock 응답의 height가 42인지 검사합니다. 응답이 없거나 다른 height면 mock replay를 진행하지 않습니다.",
  "Mock application은 F42를 되돌려 줍니다. replayBlock은 B42로 validator·parameter·results hash와 State를 계산하지만 application DB에는 T1을 다시 쓰지 않습니다.",
  "최종 AppHash가 application의 X42와 맞아야 handshake가 끝납니다. 이 검사는 height만 같고 서로 다른 상태인 경우를 막습니다.",
] as const;

function StoreCell({ label, value, active }: { label: string; value: string; active: boolean }) {
  return (
    <div className={`min-w-0 border p-2.5 ${active ? "border-primary bg-primary/10" : "border-border bg-background"}`}>
      <span className="block text-[9px] font-black text-muted-foreground">{label}</span>
      <strong className="mt-1 block break-keep text-[10px] leading-5 sm:text-xs">{value}</strong>
    </div>
  );
}

export function StateRecoveryViz() {
  const scenes = useAnimatedScenes(SCENES.length, 7800, { loop: false });
  const tabsRef = useRef<HTMLDivElement>(null);
  const state = STATES[scenes.active];
  const active = (key: StoreKey) => state.changed.includes(key);

  useEffect(() => {
    const scroller = tabsRef.current;
    const selected = scroller?.querySelector<HTMLElement>('button[aria-pressed="true"]');
    if (!scroller || !selected) return;
    const left = selected.getBoundingClientRect().left - scroller.getBoundingClientRect().left + scroller.scrollLeft;
    scroller.scrollTo({ left: left - (scroller.clientWidth - selected.offsetWidth) / 2, behavior: "auto" });
  }, [scenes.active]);

  return (
    <VizFrame
      eyebrow="CometBFT v0.40.0 · 재시작 한 건"
      title="B42를 처리하던 node가 State 저장 직전에 종료된 경로를 추적합니다"
      description="Block, FinalizeBlock 응답, State snapshot과 application DB를 서로 다른 durable receipt로 표시합니다."
      note="저장·복구 순서는 content commit 0880b4d3의 consensus/state.go, state/execution.go와 consensus/replay.go에 맞췄습니다."
      canvasClassName="p-1.5 sm:p-5"
      documentFlow
    >
      <div id={scenes.playbackId} data-viz-live-only data-cometbft-state-scene={scenes.active} tabIndex={0} role="group" aria-label="Block 42 Commit 뒤 State 저장 전에 종료된 node의 복구를 아홉 장면으로 추적" onKeyDown={scenes.onKeyDown} className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
        <div data-viz-scene-stage>
          <div ref={tabsRef} className="overflow-x-auto">
            <div className="grid grid-cols-9 gap-px bg-border p-px" style={{ width: "max(100%, 720px)" }}>
              {SCENES.map((label, index) => (
                <button key={label} type="button" aria-pressed={index === scenes.active} onClick={() => scenes.setActive(index)} className={`min-h-11 min-w-0 bg-background px-1 py-1 text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${index === scenes.active ? "text-primary" : index < scenes.active ? "text-foreground" : "text-muted-foreground"}`}>
                  <span className="block font-mono text-[8px] font-black">{String(index + 1).padStart(2, "0")}</span>
                  <strong className="mt-1 block break-keep text-[8px] leading-3">{label}</strong>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-3 min-h-[31rem] border-y border-border py-3 sm:min-h-[32rem] sm:py-4">
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <section className="border border-border bg-background p-2.5 sm:p-3" aria-label="CometBFT가 소유한 local records">
                <span className="text-[9px] font-black text-muted-foreground">COMETBFT DB</span>
                <div className="mt-2 grid gap-1.5">
                  <StoreCell label="BLOCK STORE" value={state.block} active={active("block")} />
                  <StoreCell label="FINALIZE RESULT" value={state.result} active={active("result")} />
                  <StoreCell label="STATE SNAPSHOT" value={state.state} active={active("state")} />
                </div>
              </section>

              <section className="border border-border bg-background p-2.5 sm:p-3" aria-label="application database state">
                <span className="text-[9px] font-black text-muted-foreground">APPLICATION DB</span>
                <div className="mt-2 grid gap-1.5">
                  <StoreCell label="COMMITTED STATE" value={state.app} active={active("app")} />
                  <div className="min-h-[7.25rem] border border-dashed border-border p-2.5">
                    <span className="text-[9px] font-black text-muted-foreground">T1 EFFECT</span>
                    <p className="mt-2 break-keep text-[10px] font-bold leading-5 sm:text-xs">{scenes.active >= 2 ? "Alice −10 · Bob +10" : "아직 A41에 반영되지 않음"}</p>
                  </div>
                </div>
              </section>
            </div>

            <div className="mt-3 grid grid-cols-[5.5rem_minmax(0,1fr)] gap-px bg-border p-px sm:grid-cols-[8.5rem_minmax(0,1fr)]">
              <div className="bg-background p-3 text-[9px] font-bold text-muted-foreground">현재 호출</div>
              <div className="min-w-0 bg-background p-3 text-[10px] font-bold leading-5 sm:text-xs">{state.method} · {state.owner}</div>
            </div>
            <div className="mt-px grid grid-cols-[5.5rem_minmax(0,1fr)] gap-px bg-border p-px sm:grid-cols-[8.5rem_minmax(0,1fr)]">
              <div className="bg-background p-3 text-[9px] font-bold text-muted-foreground">판정</div>
              <div className="min-w-0 bg-background p-3 text-[10px] font-bold leading-5 sm:text-xs">{state.decision}</div>
            </div>
            <p data-scene-note className="mt-3 min-h-[5rem] border-l-2 border-primary/50 pl-3 text-[10px] leading-5 text-muted-foreground sm:min-h-[6rem] sm:text-sm sm:leading-6">{NOTES[scenes.active]}</p>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} controlLabels={SCENES} playLabel="State 복구 단계 재생" compact />
      </div>
      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}

const RECOVERY_ROWS = [
  ["B=S · A=B", "AppHash 비교", "모두 같으면 재개"],
  ["B=S · A<B", "실제 app에 A+1…B replay", "State는 이미 B"],
  ["B=S+1 · A=S", "마지막 block을 실제 app으로 replay", "App과 State를 B로"],
  ["B=S+1 · A=B", "저장한 F_B로 mock replay", "State만 B로"],
  ["A>B 또는 B>S+1", "진행 금지", "error 또는 panic"],
] as const;

export function RecoveryDecisionViz() {
  return (
    <figure data-viz="cometbft-recovery-decision" className="not-prose my-8 border-y border-border py-5">
      <figcaption><p className="text-xs font-bold text-primary">세 높이로 고르는 replay owner</p><p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">B는 BlockStore, S는 State, A는 application의 높이입니다. 높이가 같아도 마지막에는 AppHash를 대조합니다.</p></figcaption>
      <div data-viz-canvas className="mt-5 grid gap-px bg-border p-px">
        {RECOVERY_ROWS.map(([condition, action, end]) => (
          <div key={condition} className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-px bg-border sm:grid-cols-[10rem_minmax(0,1fr)_12rem]">
            <strong className="bg-background p-3 font-mono text-[10px] leading-5 text-primary sm:text-xs">{condition}</strong>
            <span className="bg-background p-3 text-[10px] font-bold leading-5 sm:text-xs">{action}</span>
            <span className="col-span-2 bg-background p-3 text-[10px] leading-5 text-muted-foreground sm:col-span-1 sm:text-xs">{end}</span>
          </div>
        ))}
      </div>
    </figure>
  );
}

export function StateSyncBoundaryViz() {
  const steps = [["신뢰 기준", "trust height·hash·period"], ["Light client", "h·h+1·h+2 header 검증"], ["Snapshot", "application에 chunk 적용"], ["검증", "height·AppHash·app version 비교"], ["Bootstrap", "State와 seen commit 저장"], ["전진", "block sync로 다음 높이 처리"]] as const;
  return (
    <figure data-viz="cometbft-state-sync-boundary" className="not-prose my-8 border-y border-border py-5">
      <figcaption><p className="text-xs font-bold text-primary">새 node의 state sync</p><p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">로컬 crash replay와 달리 외부 snapshot을 받으므로 trusted header 검증이 먼저 필요합니다.</p></figcaption>
      <ol data-viz-canvas className="mt-5 grid gap-px bg-border p-px sm:grid-cols-3">
        {steps.map(([title, detail], index) => (
          <li key={title} className="min-w-0 bg-background p-3"><span className="font-mono text-[9px] font-black text-primary">{String(index + 1).padStart(2, "0")}</span><strong className="mt-2 block break-keep text-xs">{title}</strong><p className="mt-1 break-keep text-[10px] leading-5 text-muted-foreground sm:text-xs">{detail}</p></li>
        ))}
      </ol>
    </figure>
  );
}
