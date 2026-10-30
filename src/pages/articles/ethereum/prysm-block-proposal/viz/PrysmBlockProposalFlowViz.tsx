import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = ["전체", "Duty", "RANDAO", "Parent", "조립", "Root", "Sign", "Publish"] as const;

const NOTES = [
  "Slot 353의 Fulu proposal은 validator client와 beacon node가 나누어 수행합니다. Validator client는 duty와 key를 소유하고, beacon node는 parent 선택·operation pool·execution payload·state transition을 소유합니다.",
  "설명용 Fulu state의 proposer_lookahead[353 mod 32] = proposer_lookahead[1]은 validator 17입니다. Fulu에서는 현재·다음 epoch의 proposer를 request 시점에 다시 추첨하지 않고 state lookahead에서 읽습니다.",
  "Validator client는 epoch 11과 DOMAIN_RANDAO의 signing root를 validator 17의 key로 서명합니다. 이 reveal과 graffiti를 /eth/v3/validator/blocks/353 요청에 넣습니다.",
  "Beacon node는 syncing·optimistic 상태가 아닌지 확인하고 fork choice를 갱신합니다. GetProposerHead가 고른 parent P352의 state를 slot 353까지 전진시켜 조립 기준을 고정합니다.",
  "Prysm은 consensus operation 수집과 execution payload 경로를 겹쳐 진행합니다. Execution 쪽은 local payload와 허용된 builder bid를 비교하고, consensus 쪽은 attestation·slashing·deposit·exit·sync aggregate 등을 채웁니다.",
  "조립한 candidate block으로 같은 transition을 실행해 post-state의 hash-tree-root를 계산하고 block.state_root에 채웁니다. 이 root가 들어간 뒤 block identity가 완성됩니다.",
  "Validator client는 proposer domain으로 완성된 block을 한 번 서명합니다. SlashableProposalCheck가 같은 key·slot의 충돌 proposal을 막은 뒤 signed bytes를 제출 대상으로 고정합니다.",
  "Beacon node는 signed block을 자체 receive 경로와 gossip으로 보내고 Fulu sidecar도 함께 전파합니다. 성공 응답의 block root는 제출 identity이며 head·채택·finality 보장은 아닙니다.",
] as const;

const RECEIPTS = [
  "lookahead → RANDAO request → parent → consensus ∥ execution → state root → one signature → gossip",
  "state.proposer_lookahead[1] = validator 17",
  "Sign(epoch 11, DOMAIN_RANDAO) → block production request",
  "UpdateHead → proposer parent P352 → state@353",
  "consensus pools ∥ local/builder payload → Fulu body",
  "HTR(transition(state@353, candidate)) → candidate.state_root",
  "proposer signature + slashing-protection record → fixed signed bytes",
  "signed block + sidecars → local receive ∥ gossip → block root receipt",
] as const;

type Stage = {
  label: string;
  owner: string;
  input: string;
  output: string;
};

const STAGES: readonly Stage[] = [
  { label: "Duty", owner: "State · VC", input: "slot 353 · lookahead[1]", output: "proposer 17" },
  { label: "RANDAO", owner: "Validator client", input: "epoch 11 · key 17", output: "signed reveal" },
  { label: "Parent", owner: "Beacon node", input: "fork-choice head", output: "P352 · state@353" },
  { label: "조립", owner: "Beacon node · EL", input: "pools · local/builder", output: "Fulu candidate" },
  { label: "Root", owner: "State transition", input: "state@353 · candidate", output: "post-state root" },
  { label: "Sign", owner: "Validator client", input: "block root · key 17", output: "signed bytes" },
  { label: "Publish", owner: "Beacon node · P2P", input: "block · sidecars", output: "block root receipt" },
] as const;

function StageCard({ stage, index, active }: { stage: Stage; index: number; active: number }) {
  const selected = active === index + 1;
  const completed = active === 0 || active > index + 1;
  return (
    <li className={`relative min-w-0 border-l-2 bg-background p-3 ${selected ? "border-primary ring-1 ring-inset ring-primary" : completed ? "border-foreground/45" : "border-border text-muted-foreground"}`}>
      <div className="flex items-start justify-between gap-2">
        <strong className="break-keep text-[11px] leading-4 sm:text-xs sm:leading-5">{stage.label}</strong>
        <span className="shrink-0 font-mono text-[8px] font-black text-primary">{String(index + 1).padStart(2, "0")}</span>
      </div>
      <p className="mt-2 break-keep text-[9px] leading-4 text-muted-foreground">{stage.owner}</p>
      <p className="mt-2 break-keep text-[9px] leading-4"><span className="font-bold">입력</span> · {stage.input}</p>
      <p className="break-keep text-[9px] leading-4"><span className="font-bold">결과</span> · {stage.output}</p>
      {index < STAGES.length - 1 && <span aria-hidden className="absolute -right-2 top-1/2 z-10 hidden -translate-y-1/2 bg-background px-0.5 text-xs text-muted-foreground xl:block">→</span>}
    </li>
  );
}

function MobileScene({ active }: { active: number }) {
  if (active === 0) {
    return (
      <div className="grid gap-px bg-border p-px lg:hidden" aria-label="블록 제안 전체 흐름">
        {[
          ["권한", "lookahead[1] → proposer 17"],
          ["조립", "parent + consensus pools ∥ execution payload"],
          ["Commit", "state root → one signature → publish"],
        ].map(([label, value]) => (
          <div key={label} className="bg-background p-3">
            <span className="font-mono text-[9px] font-black text-primary">{label}</span>
            <strong className="mt-1 block break-keep text-xs leading-5">{value}</strong>
          </div>
        ))}
      </div>
    );
  }
  const stage = STAGES[active - 1];
  return (
    <div className="bg-border p-px lg:hidden">
      <StageCard stage={stage} index={active - 1} active={active} />
      {active === 4 && (
        <div className="grid grid-cols-2 gap-px bg-border pt-px text-[10px] leading-4">
          <div className="bg-background p-3"><strong className="block">Consensus</strong><span className="text-muted-foreground">operation pools</span></div>
          <div className="bg-background p-3"><strong className="block">Execution</strong><span className="text-muted-foreground">local ∥ builder</span></div>
        </div>
      )}
    </div>
  );
}

export default function PrysmBlockProposalFlowViz() {
  const scenes = useAnimatedScenes(SCENES.length, 9500, { loop: false });
  const active = scenes.active;

  return (
    <VizFrame
      eyebrow="개념 경로 · Fulu proposal 353"
      title="제안 권한부터 전파까지 하나의 블록 identity를 완성합니다"
      description="Validator client와 beacon node가 각자 소유한 상태를 넘겨받아 signed block 하나를 만드는 경계를 추적합니다."
      note="Slot·validator·parent 값은 설명용입니다. 함수 순서와 Fulu 경계는 Prysm v7.3.1 source에서 확인했으며 제안 지연은 측정하지 않았습니다."
      canvasClassName="px-2 py-2 sm:p-5"
      documentFlow
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-prysm-block-proposal-scene={active}
        tabIndex={0}
        role="group"
        aria-label="Fulu slot 353의 proposer duty가 signed block 전파로 이어지는 여덟 장면"
        onKeyDown={scenes.onKeyDown}
        className="scroll-mt-20 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div className="overflow-x-auto" aria-label="블록 제안의 여덟 장면">
          <div className="grid min-w-[352px] grid-cols-8 gap-px bg-border p-px lg:min-w-0">
            {SCENES.map((scene, index) => (
              <button
                type="button"
                key={scene}
                aria-pressed={index === active}
                onClick={() => scenes.setActive(index)}
                className={`min-h-11 min-w-11 bg-background px-0.5 py-1 text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary lg:min-w-0 lg:py-2 ${index === active ? "text-primary" : index < active ? "text-foreground" : "text-muted-foreground"}`}
              >
                <span className="block font-mono text-[8px] font-black">{String(index + 1).padStart(2, "0")}</span>
                <strong className="mt-1 hidden break-keep text-[8px] leading-3 lg:block">{scene}</strong>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-2 flex h-[15.5rem] items-center sm:mt-3 lg:block lg:h-auto [&>*]:w-full">
          <MobileScene active={active} />
          <ol className="hidden gap-px bg-border p-px lg:grid lg:grid-cols-7" aria-label="Duty부터 publish까지 이어지는 실제 상태 소유자">
            {STAGES.map((stage, index) => <StageCard key={stage.label} stage={stage} index={index} active={active} />)}
          </ol>
          <div className="mt-2 hidden grid-cols-2 gap-px bg-border p-px lg:grid" aria-label="Block 조립의 병렬 입력">
            <div className={`bg-background p-3 ${active === 4 ? "ring-1 ring-inset ring-primary" : ""}`}><strong className="text-xs">Consensus body</strong><p className="mt-1 text-[10px] leading-4 text-muted-foreground">attestations · slashings · deposits · exits · sync aggregate</p></div>
            <div className={`bg-background p-3 ${active === 4 ? "ring-1 ring-inset ring-primary" : ""}`}><strong className="text-xs">Execution data</strong><p className="mt-1 text-[10px] leading-4 text-muted-foreground">local payload와 builder bid 중 policy를 통과한 결과</p></div>
          </div>
        </div>

        <div className="mt-2 grid min-h-[6.75rem] grid-cols-[0.62fr_1.38fr] gap-px bg-border p-px sm:mt-3 sm:min-h-[7.5rem]">
          <div className="min-h-[6.25rem] min-w-0 bg-background p-3">
            <span className="text-[9px] font-bold text-muted-foreground sm:text-[10px]">현재 장면</span>
            <strong className="mt-1 block break-keep text-xs leading-5 sm:text-sm">{SCENES[active]}</strong>
          </div>
          <div className="min-h-[6.25rem] min-w-0 bg-background p-3">
            <span className="text-[9px] font-bold text-muted-foreground sm:text-[10px]">상태 변화</span>
            <strong className="mt-1 block break-keep text-[10px] leading-4 text-primary sm:text-sm sm:leading-5">{RECEIPTS[active]}</strong>
          </div>
        </div>

        <p data-scene-note className="mt-1 min-h-[7.5rem] border-l-2 border-primary/50 pl-3 text-[11px] leading-[1.125rem] text-muted-foreground sm:mt-3 sm:pl-4 sm:text-sm sm:leading-6">{NOTES[active]}</p>
        <AnimatedSceneControls {...scenes} labels={SCENES} controlLabels={SCENES} playLabel="재생" className="mt-0 sm:mt-4" compact />
      </div>
      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}
