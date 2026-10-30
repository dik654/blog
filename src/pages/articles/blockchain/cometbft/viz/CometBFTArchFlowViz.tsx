import { useEffect, useRef } from "react";
import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = [
  "Committed h40",
  "RPC receive",
  "CheckTx",
  "Proposal",
  "Prevote",
  "Precommit",
  "FinalizeBlock",
  "Commit h41",
] as const;

const SHORT = ["시작", "수신", "검사", "제안", "Prevote", "Precommit", "실행", "저장"] as const;

const NOTES = [
  "높이 40의 block·CometBFT State·application state가 서로 맞습니다. Alice→Bob 10이라는 transaction bytes는 아직 어느 node에도 없습니다.",
  "한 node의 RPC가 bytes를 받습니다. tx hash는 추적 ID가 되지만, 수신 성공만으로 다른 validator가 받았거나 block에 포함됐다는 뜻은 아닙니다.",
  "Mempool이 크기·중복을 검사하고 application에 CheckTx를 보냅니다. OK이면 이 node의 후보 목록에 들어가지만 committed state는 그대로입니다.",
  "Round 0 proposer가 후보들을 모아 application의 PrepareProposal을 거친 block B41을 제안합니다. Proposal은 초안이며 아직 결정 증거가 없습니다.",
  "Validator들이 B41을 검사하고 같은 round에 prevote합니다. 3분의 2를 넘는 voting power의 prevote는 lock 근거가 되지만 commit 영수증은 아닙니다.",
  "같은 B41에 3분의 2를 넘는 precommit이 모이면 block order가 결정됩니다. 이 node에 block bytes가 없다면 먼저 받아야 하며, application 실행은 아직 남았습니다.",
  "BlockExecutor가 결정된 B41을 검증하고 application에 FinalizeBlock을 보냅니다. Application이 transaction 결과와 다음 AppHash A41을 계산합니다.",
  "Application Commit이 높이 41을 durable하게 저장하고 CometBFT가 State를 A41로 갱신합니다. 이제 committed query가 tx result를 답할 수 있습니다.",
] as const;

const STATES = [
  { tx: "없음", consensus: "h40 · commit C40", app: "AppHash A40", durable: "block·state·app h40" },
  { tx: "bytes 수신 · hash T", consensus: "변화 없음", app: "호출 없음", durable: "h40 그대로" },
  { tx: "local mempool 후보", consensus: "포함 미정", app: "CheckTx OK", durable: "h40 그대로" },
  { tx: "B41에 포함된 초안", consensus: "h41 / r0 proposal", app: "PrepareProposal", durable: "h40 그대로" },
  { tx: "B41 후보", consensus: "+2/3 prevote · lock 근거", app: "ProcessProposal 통과", durable: "h40 그대로" },
  { tx: "B41 order 결정", consensus: "+2/3 precommit · C41", app: "실행 대기", durable: "block bytes 저장 가능" },
  { tx: "ExecTxResult 계산", consensus: "C41 유지", app: "FinalizeBlock · A41", durable: "app Commit 전" },
  { tx: "committed h41", consensus: "block B41 · commit C41", app: "AppHash A41", durable: "block·state·app h41" },
] as const;

const OWNER_INDEX = [0, 0, 1, 2, 2, 2, 3, 4] as const;

const OWNERS = [
  ["RPC", "bytes 수신"],
  ["Mempool", "node-local 후보"],
  ["Consensus", "순서 결정"],
  ["Application", "상태 전이"],
  ["Stores", "durable receipt"],
] as const;

function activeAt(scene: number, from: number, to = from) {
  return scene >= from && scene <= to;
}

export default function CometBFTArchFlowViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5200, { loop: false });
  const tabsRef = useRef<HTMLDivElement>(null);
  const state = STATES[scenes.active];
  const owner = OWNER_INDEX[scenes.active];

  useEffect(() => {
    const scroller = tabsRef.current;
    const target = scroller?.querySelector<HTMLElement>('button[aria-pressed="true"]');
    if (!scroller || !target) return;
    const left = target.getBoundingClientRect().left - scroller.getBoundingClientRect().left + scroller.scrollLeft;
    scroller.scrollTo({ left: left - (scroller.clientWidth - target.offsetWidth) / 2, behavior: "auto" });
  }, [scenes.active]);

  return (
    <VizFrame
      eyebrow="CometBFT v0.40.0 · transaction 한 건"
      title="수신 영수증이 block·application의 durable receipt로 바뀌는 여덟 장면"
      description="Alice→Bob 10이라는 같은 bytes를 따라갑니다. 각 장면에서 authoritative owner와 남은 증거가 달라집니다."
      note="호출 순서는 v0.40.0 commit 0880b4d3에서 확인했습니다. 높이·hash 이름은 설명용입니다."
      canvasClassName="p-1.5 sm:p-5"
      documentFlow
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-cometbft-scene={scenes.active}
        tabIndex={0}
        role="group"
        aria-label="CometBFT transaction lifecycle을 여덟 장면으로 추적"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div data-viz-scene-stage>
          <div ref={tabsRef} className="overflow-x-auto">
            <div className="grid grid-cols-8 gap-px bg-border p-px" style={{ width: "max(100%, 620px)" }}>
              {SCENES.map((label, index) => (
                <button
                  key={label}
                  type="button"
                  aria-pressed={index === scenes.active}
                  onClick={() => scenes.setActive(index)}
                  className={`min-h-11 min-w-0 bg-background px-1 py-1 text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary lg:py-2 ${index === scenes.active ? "text-primary" : index < scenes.active ? "text-foreground" : "text-muted-foreground"}`}
                >
                  <span className="block font-mono text-[8px] font-black">{String(index + 1).padStart(2, "0")}</span>
                  <strong className="mt-1 block break-keep text-[7px] leading-3 lg:hidden">{SHORT[index]}</strong>
                  <strong className="mt-1 hidden break-keep text-[8px] leading-3 lg:block">{label}</strong>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-3 min-h-[17rem] border-y border-border py-2 sm:min-h-[22rem] sm:py-4">
            <div className="relative px-[10%] pt-6">
              <div className="absolute left-[10%] right-[10%] top-2 h-px bg-border" aria-hidden />
              <div
                data-viz-motion="authoritative owner changes"
                className="absolute top-0 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-primary bg-background transition-[left] duration-700 motion-reduce:transition-none"
                style={{ left: `${10 + owner * 20}%` }}
                aria-hidden
              />
              <div className="grid grid-cols-5 gap-1">
                {OWNERS.map(([title, detail], index) => (
                  <div key={title} className={`min-w-0 border-t-2 px-1 pt-2 text-center ${index === owner ? "border-primary text-foreground" : "border-border text-muted-foreground"}`}>
                    <strong className="block whitespace-nowrap text-[7px] leading-4 sm:text-[10px]">{title}</strong>
                    <span className="hidden break-keep text-[8px] leading-4 sm:block">{detail}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-px bg-border p-px">
              {[
                ["TRANSACTION", state.tx, activeAt(scenes.active, 1, 7)],
                ["CONSENSUS EVIDENCE", state.consensus, activeAt(scenes.active, 3, 7)],
                ["APPLICATION RECEIPT", state.app, scenes.active === 2 || activeAt(scenes.active, 6, 7)],
                ["DURABLE STATE", state.durable, scenes.active === 0 || activeAt(scenes.active, 5, 7)],
              ].map(([label, value, active]) => (
                <div key={String(label)} className={`min-w-0 bg-background p-2 sm:p-4 ${active ? "ring-2 ring-inset ring-primary" : ""}`}>
                  <span className="block break-keep text-[8px] font-bold text-muted-foreground sm:text-[9px]">{String(label)}</span>
                  <strong className="mt-2 block break-keep font-mono text-[10px] leading-5 sm:text-xs sm:leading-6">{String(value)}</strong>
                </div>
              ))}
            </div>

            <p data-scene-note className="mt-3 min-h-10 border-l-2 border-primary/50 pl-3 text-[10px] leading-5 text-muted-foreground sm:min-h-20 sm:text-sm sm:leading-6">
              {NOTES[scenes.active]}
            </p>
          </div>
        </div>

        <AnimatedSceneControls {...scenes} labels={SCENES} controlLabels={SCENES} playLabel="CometBFT transaction 경로 재생" compact />
      </div>
      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}
