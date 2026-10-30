import { useEffect, useRef } from "react";
import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = [
  "높이 시작",
  "제안 지연",
  "Nil prevote",
  "다음 round",
  "B41 제안",
  "B41 lock",
  "B41 commit",
  "상충 vote",
] as const;

const NOTES = [
  "높이 41, round 0이 시작됩니다. A 40·B 35·C 25의 validator power와 proposer A가 고정되고, receiveRoutine 한 곳이 peer message·내부 message·timeout을 차례로 처리합니다.",
  "A의 proposal이 제한 시간 안에 완성되지 않았습니다. timeout event는 h41/r0/Propose 좌표와 함께 queue에서 처리되고, 현재 좌표보다 오래된 timer가 아닌지 확인한 뒤 Prevote로 이동합니다.",
  "완성된 proposal이 없으므로 A와 B가 nil에 prevote합니다. 같은 h41/r0의 nil power가 75가 되어 +2/3를 넘지만 특정 block의 lock은 만들지 않습니다.",
  "A와 B의 nil precommit이 75가 되면 round 0에서 block을 결정하지 않았다는 증거가 생깁니다. timeout 뒤 round 1로 이동하고 proposer priority가 바뀌어 B가 새 proposer가 됩니다.",
  "B가 B41과 block parts를 보내고 application의 ProcessProposal이 수락합니다. Proposal과 part가 모두 모여야 node는 B41을 가리키는 prevote를 만들 수 있습니다.",
  "A와 B가 같은 h41/r1/B41에 prevote해 75/100이 됩니다. node는 B41을 ValidBlock으로 보존하고 LockedRound=1, LockedBlock=B41로 갱신한 뒤 B41에 precommit합니다.",
  "같은 h41/r1/B41 precommit이 75/100이 되면 enterCommit이 실행됩니다. block parts도 가지고 있으면 tryFinalizeCommit으로 넘어가고, 다음 높이의 state와 LastCommit을 준비합니다.",
  "같은 height·round·vote type에서 A가 다른 BlockID에도 서명한 사실을 처리 중 발견하면 기존 vote를 덮어쓰지 않습니다. 두 signed vote는 evidence pool로 분리되고 B41의 Commit 증거는 그대로 검증됩니다.",
] as const;

const STATES = [
  { hrs: "41 / 0 / NewRound", input: "start height", proposer: "A", proposal: "없음", prevote: "—", precommit: "—", lock: "없음", result: "round 0 시작" },
  { hrs: "41 / 0 / Propose", input: "timeout · h41/r0/Propose", proposer: "A", proposal: "미완성", prevote: "—", precommit: "—", lock: "없음", result: "Prevote로 이동" },
  { hrs: "41 / 0 / Prevote", input: "A 40 + B 35", proposer: "A", proposal: "없음", prevote: "nil · 75/100", precommit: "—", lock: "없음", result: "+2/3 nil" },
  { hrs: "41 / 1 / NewRound", input: "nil precommit · 75/100", proposer: "B", proposal: "초기화", prevote: "r0 nil", precommit: "r0 nil · 75/100", lock: "없음", result: "round 1" },
  { hrs: "41 / 1 / Propose", input: "Proposal + BlockParts", proposer: "B", proposal: "B41 · ProcessProposal OK", prevote: "준비", precommit: "—", lock: "없음", result: "B41 완성" },
  { hrs: "41 / 1 / Precommit", input: "prevote B41 · 75/100", proposer: "B", proposal: "B41", prevote: "A+B · 75/100", precommit: "B41 서명", lock: "B41 · round 1", result: "POL + lock" },
  { hrs: "41 / 1 / Commit", input: "precommit B41 · 75/100", proposer: "B", proposal: "B41 + parts 보유", prevote: "A+B · 75/100", precommit: "A+B · 75/100", lock: "B41", result: "B41 결정" },
  { hrs: "41 / 1 / Commit", input: "A의 상충 precommit", proposer: "B", proposal: "B41", prevote: "Commit 유지", precommit: "HB41 ↔ 다른 BlockID", lock: "B41", result: "Evidence로 분리" },
] as const;

function Fact({ label, value, active = false }: { label: string; value: string; active?: boolean }) {
  return (
    <div className={`min-w-0 border p-2.5 sm:p-3 ${active ? "border-primary bg-primary/10" : "border-border bg-background"}`}>
      <span className="block text-[8px] font-bold text-muted-foreground sm:text-[9px]">{label}</span>
      <strong className="mt-1 block break-keep text-[10px] leading-5 sm:text-xs">{value}</strong>
    </div>
  );
}

export default function CometBFTConsensusTraceViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5600, { loop: false });
  const tabsRef = useRef<HTMLDivElement>(null);
  const state = STATES[scenes.active];

  useEffect(() => {
    const scroller = tabsRef.current;
    const target = scroller?.querySelector<HTMLElement>('button[aria-pressed="true"]');
    if (!scroller || !target) return;
    const left = target.getBoundingClientRect().left - scroller.getBoundingClientRect().left + scroller.scrollLeft;
    scroller.scrollTo({ left: left - (scroller.clientWidth - target.offsetWidth) / 2, behavior: "auto" });
  }, [scenes.active]);

  return (
    <VizFrame
      eyebrow="CometBFT v0.40.0 · 한 높이의 상태 전이"
      title="제안이 늦은 round 0에서 B41을 결정하는 round 1까지"
      description="화살표 이름보다 입력 event, 현재 H/R/S, signed power, lock과 남은 증거가 실제로 어떻게 바뀌는지 따라갑니다."
      note="B41·validator 이름과 power는 설명용 예시입니다. 상태 전이와 함수는 commit 0880b4d3의 공식 소스로 확인했습니다."
      canvasClassName="p-1.5 sm:p-5"
      documentFlow
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-cometbft-consensus-scene={scenes.active}
        tabIndex={0}
        role="group"
        aria-label="높이 41의 round 변경과 lock과 commit을 여덟 장면으로 추적"
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
                  className={`min-h-11 min-w-0 bg-background px-1 py-1 text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${index === scenes.active ? "text-primary" : index < scenes.active ? "text-foreground" : "text-muted-foreground"}`}
                >
                  <span className="block font-mono text-[8px] font-black">{String(index + 1).padStart(2, "0")}</span>
                  <strong className="mt-1 block break-keep text-[8px] leading-3">{label}</strong>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-3 min-h-[26rem] border-y border-border py-3 sm:min-h-[29rem] sm:py-4">
            <div className="grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-4">
              <Fact label="현재 H / R / S" value={state.hrs} active />
              <Fact label="이번 입력" value={state.input} />
              <Fact label="현재 proposer" value={state.proposer} />
              <Fact label="proposal" value={state.proposal} />
            </div>

            <div className="my-3 grid grid-cols-[minmax(0,1fr)_3.5rem_minmax(0,1fr)] items-stretch gap-2 sm:grid-cols-[minmax(0,1fr)_5rem_minmax(0,1fr)]">
              <div className="border border-border bg-background p-3">
                <span className="text-[8px] font-bold text-muted-foreground sm:text-[9px]">SIGNED VOTE SET</span>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <Fact label="PREVOTE" value={state.prevote} active={scenes.active === 2 || scenes.active === 5} />
                  <Fact label="PRECOMMIT" value={state.precommit} active={scenes.active === 3 || scenes.active >= 6} />
                </div>
              </div>
              <div className="flex items-center justify-center border-y border-border text-center font-mono text-[9px] font-bold text-muted-foreground">
                queue<br />→<br />owner
              </div>
              <div className="border border-border bg-background p-3">
                <span className="text-[8px] font-bold text-muted-foreground sm:text-[9px]">ROUND STATE</span>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <Fact label="LOCK" value={state.lock} active={scenes.active === 5} />
                  <Fact label="남긴 결과" value={state.result} active={scenes.active >= 6} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-px bg-border p-px sm:grid-cols-[7rem_minmax(0,1fr)]">
              <div className="bg-background p-3 text-[8px] font-bold text-muted-foreground sm:text-[9px]">판단 근거</div>
              <div className="min-w-0 bg-background p-3 font-mono text-[10px] font-bold leading-5 text-primary sm:text-xs">
                {scenes.active <= 1 ? "좌표가 맞는 event만 다음 step을 호출" : scenes.active <= 3 ? "nil도 signed power로 계산" : scenes.active === 4 ? "완성된 block + application 수락" : scenes.active === 5 ? "+2/3 prevote → POL · lock" : scenes.active === 6 ? "+2/3 precommit + block 보유" : "같은 H/R/type · 다른 BlockID"}
              </div>
            </div>

            <p data-scene-note className="mt-3 min-h-[6.5rem] border-l-2 border-primary/50 pl-3 text-[10px] leading-5 text-muted-foreground sm:min-h-[7rem] sm:text-sm sm:leading-6">
              {NOTES[scenes.active]}
            </p>
          </div>
        </div>

        <AnimatedSceneControls {...scenes} labels={SCENES} controlLabels={SCENES} playLabel="높이 41 합의 경로 재생" compact />
      </div>
      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}
