import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = ["전체", "입력", "병렬 검증", "Consensus", "Operations", "Proof", "Engine", "등록"] as const;

const NOTES = [
  "Slot processing이 parent state를 이미 352까지 전진시켰다고 가정합니다. Prysm은 Fulu block 352를 consensus state transition, execution payload 판정, data availability의 세 경계로 검증한 뒤 fork-choice 후보로 등록합니다.",
  "설명용 입력은 state.slot=352, latest header=351, proposer=17인 Fulu state와 같은 slot·parent·proposer를 가리키는 signed block입니다. 실제 chain block이나 측정 결과가 아닙니다.",
  "Prysm v7.3.1의 validateExecutionAndConsensus는 consensus transition과 Engine API 호출을 errgroup으로 동시에 실행합니다. 두 경로가 모두 끝나야 다음 단계로 갑니다.",
  "Consensus 경로는 header, withdrawals와 payload 문맥, RANDAO, Eth1 data, fork별 operations, sync aggregate를 순서대로 같은 working state에 적용합니다.",
  "Fulu는 Electra operation 경로를 사용합니다. proposer slashing부터 attestation·deposit·exit·BLS change를 거쳐 execution requests를 deposit→withdrawal→consolidation 순으로 적용합니다.",
  "모든 handler 뒤 계산한 full post-state root를 block.state_root와 비교하고, proposer·RANDAO·attestation·BLS-change signature batch를 검증합니다. 이어서 data availability도 별도로 확인합니다.",
  "설명 장면에서는 Engine API가 SYNCING을 반환합니다. Payload를 INVALID라고 판정한 것이 아니라 아직 확정하지 못한 상태이므로 isValidPayload=false를 남기되 block 전체를 즉시 버리지는 않습니다.",
  "Consensus와 data availability가 통과한 block은 fork-choice에 execution-optimistic 후보로 들어갑니다. 이후 VALID이면 optimistic 표시를 해제하고, INVALID이면 해당 block과 영향을 받은 후손을 제거합니다. 후보 등록은 head나 finality 확정이 아닙니다.",
] as const;

const RECEIPTS = [
  "state@352 + signed block@352 → consensus·execution·DA → fork-choice candidate",
  "Fulu · slot 352 · proposer 17 · parent header 351",
  "consensus transition ∥ engine_newPayloadV4 · 둘 다 완료되어야 합류",
  "header → withdrawals/payload → RANDAO → Eth1 → operations → sync aggregate",
  "slashings → attestations → deposits/exits → BLS change → execution requests",
  "HTR(post-state)=block.state_root · BLS batch valid · data available",
  "Engine=SYNCING → execution validity 미확정 · optimistic=true",
  "InsertNode → 후속 VALID이면 확정 / INVALID이면 block·descendants 제거",
] as const;

type CardProps = {
  step: string;
  title: string;
  reads: string;
  writes: string;
  active?: boolean;
  done?: boolean;
};

function Card({ step, title, reads, writes, active = false, done = false }: CardProps) {
  return (
    <li className={`min-w-0 border-l-2 bg-background p-3 ${active ? "border-primary ring-1 ring-inset ring-primary" : done ? "border-foreground/45" : "border-border text-muted-foreground"}`}>
      <div className="flex items-start justify-between gap-2">
        <strong className="break-keep text-[11px] leading-4 sm:text-xs sm:leading-5">{title}</strong>
        <span className="shrink-0 font-mono text-[8px] font-black text-primary">{step}</span>
      </div>
      <p className="mt-2 break-keep text-[9px] leading-4"><span className="font-bold text-muted-foreground">읽음</span> · {reads}</p>
      <p className="break-keep text-[9px] leading-4"><span className="font-bold text-muted-foreground">결과</span> · {writes}</p>
    </li>
  );
}

function InputCard({ active = false }: { active?: boolean }) {
  return (
    <section className={`min-w-0 bg-background p-3 sm:p-4 ${active ? "ring-2 ring-inset ring-primary" : ""}`}>
      <span className="font-mono text-[9px] font-black text-primary">INPUT · SLOT 352</span>
      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-[10px] leading-4 sm:text-xs sm:leading-5">
        <div><dt className="text-muted-foreground">Fork</dt><dd className="font-bold">Fulu</dd></div>
        <div><dt className="text-muted-foreground">Proposer</dt><dd className="font-bold">17</dd></div>
        <div><dt className="text-muted-foreground">Pre-state</dt><dd className="font-bold">slot 352</dd></div>
        <div><dt className="text-muted-foreground">Parent</dt><dd className="font-bold">header 351</dd></div>
      </dl>
    </section>
  );
}

function ParallelCard({ active = false }: { active?: boolean }) {
  return (
    <section className={`min-w-0 bg-background p-3 sm:p-4 ${active ? "ring-2 ring-inset ring-primary" : ""}`}>
      <span className="font-mono text-[9px] font-black text-primary">PARALLEL BOUNDARY</span>
      <div className="mt-3 grid gap-px bg-border p-px text-[10px] leading-4 sm:grid-cols-2 sm:text-xs sm:leading-5">
        <div className="bg-background p-2 sm:p-2.5"><strong className="block whitespace-nowrap text-[11px]">Consensus</strong><span className="whitespace-nowrap text-[10px] text-muted-foreground">State transition</span></div>
        <div className="bg-background p-2 sm:p-2.5"><strong className="block whitespace-nowrap text-[11px]">Execution</strong><span className="whitespace-nowrap text-[10px] text-muted-foreground">newPayload V4</span></div>
      </div>
      <p className="mt-3 break-keep text-[10px] leading-4 text-muted-foreground sm:text-xs sm:leading-5">같은 block을 독립적으로 판정한 뒤 errgroup에서 합류</p>
    </section>
  );
}

function ResultCard({ active = false }: { active?: boolean }) {
  return (
    <section className={`min-w-0 bg-background p-3 sm:p-4 ${active ? "ring-2 ring-inset ring-primary" : ""}`}>
      <span className="font-mono text-[9px] font-black text-primary">OUTPUT · CANDIDATE</span>
      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-[10px] leading-4 sm:text-xs sm:leading-5">
        <div><dt className="text-muted-foreground">Consensus</dt><dd className="font-bold">valid</dd></div>
        <div><dt className="text-muted-foreground">Engine</dt><dd className="font-bold">SYNCING</dd></div>
        <div><dt className="text-muted-foreground">DA</dt><dd className="font-bold">available</dd></div>
        <div><dt className="text-muted-foreground">Fork choice</dt><dd className="font-bold">optimistic</dd></div>
      </dl>
    </section>
  );
}

function ConsensusStages({ active }: { active: number }) {
  return (
    <ol className="grid gap-2 lg:grid-cols-4">
      <Card step="01" title="Header" reads="slot · proposer · parent · body root" writes="latest header" active={active === 3} done={active > 3} />
      <Card step="02" title="Payload 문맥 · RANDAO" reads="parent hash · time · prevRandao · reveal" writes="payload header · randao mix" active={active === 3} done={active > 3} />
      <Card step="03" title="Operations" reads="bounded operation lists · requests" writes="validator · participation · queues" active={active === 4} done={active > 4} />
      <Card step="04" title="Proof · DA" reads="post-state · signatures · blobs" writes="root parity · sig batch · availability" active={active === 5} done={active > 5} />
    </ol>
  );
}

function MobileScene({ active }: { active: number }) {
  if (active === 0) {
    return (
      <ol className="grid gap-px bg-border p-px text-xs leading-5 lg:hidden" aria-label="Fulu block 처리 전체 흐름">
        <li className="bg-background p-3"><span className="font-mono text-[9px] font-black text-primary">BLOCK@352</span><strong className="mt-1 block">Parent state와 signed block</strong></li>
        <li className="bg-background p-3"><span className="font-mono text-[9px] font-black text-primary">VALIDATE</span><strong className="mt-1 block">Consensus ∥ Engine → Data availability</strong></li>
        <li className="bg-background p-3"><span className="font-mono text-[9px] font-black text-primary">ADMIT</span><strong className="mt-1 block">Execution-optimistic fork-choice 후보</strong></li>
      </ol>
    );
  }
  if (active === 1) return <div className="lg:hidden"><InputCard active /></div>;
  if (active === 2) return <div className="lg:hidden"><ParallelCard active /></div>;
  if (active === 7) return <div className="lg:hidden"><ResultCard active /></div>;
  if (active === 6) {
    return (
      <div className="grid gap-px bg-border p-px lg:hidden">
        <Card step="EL" title="Engine API" reads="payload · versioned hashes · parent root · requests" writes="SYNCING → optimistic" active />
      </div>
    );
  }
  return (
    <div className="grid gap-px bg-border p-px lg:hidden">
      {active === 3 && <Card step="01–02" title="Consensus handlers" reads="header · payload context · RANDAO" writes="candidate state mutation" active />}
      {active === 4 && <Card step="03" title="Fork별 Operations" reads="slashings · attestations · requests" writes="validator · participation · queues" active />}
      {active === 5 && <Card step="04" title="Proof · Data availability" reads="post-state · signatures · blobs" writes="root parity · sig batch · availability" active />}
    </div>
  );
}

export default function PrysmBlockProcessingFlowViz() {
  const scenes = useAnimatedScenes(SCENES.length, 9500, { loop: false });
  const active = scenes.active;

  return (
    <VizFrame
      eyebrow="개념 경로 · Fulu block 352"
      title="같은 블록을 Consensus와 Execution이 나누어 검증합니다"
      description="Parent state에서 post-state를 만들고, Engine 판정과 data availability를 합쳐 fork-choice 후보로 등록하는 경계를 추적합니다."
      note="Slot·proposer 번호는 흐름을 설명하기 위한 예시입니다. 함수 순서와 SYNCING 처리 경계는 Prysm v7.3.1 source에서 확인했으며 지연 시간은 측정하지 않았습니다."
      canvasClassName="px-2 py-2 sm:p-5"
      documentFlow
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-prysm-block-processing-scene={active}
        tabIndex={0}
        role="group"
        aria-label="Fulu block 352가 consensus와 execution 검증을 거쳐 optimistic 후보가 되는 여덟 장면"
        onKeyDown={scenes.onKeyDown}
        className="scroll-mt-20 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div className="overflow-x-auto" aria-label="블록 처리의 여덟 장면">
          <div className="grid min-w-[352px] grid-cols-8 gap-px bg-border p-px lg:min-w-0">
            {SCENES.map((scene, index) => (
              <button type="button" key={scene} aria-pressed={index === active} onClick={() => scenes.setActive(index)} className={`min-h-11 min-w-11 bg-background px-0.5 py-1 text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary lg:min-w-0 lg:py-2 ${index === active ? "text-primary" : index < active ? "text-foreground" : "text-muted-foreground"}`}>
                <span className="block font-mono text-[8px] font-black">{String(index + 1).padStart(2, "0")}</span>
                <strong className="mt-1 hidden break-keep text-[8px] leading-3 lg:block">{scene}</strong>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-2 flex h-[15.5rem] items-center sm:mt-3 lg:block lg:h-auto [&>*]:w-full">
          <MobileScene active={active} />
          <div className="hidden gap-px bg-border p-px lg:grid lg:grid-cols-[1fr_1fr_1fr]" aria-label="입력, 병렬 검증, 등록 결과">
            <InputCard active={active === 1} />
            <ParallelCard active={active === 2 || active === 6} />
            <ResultCard active={active === 7} />
          </div>
          <div className="mt-2 hidden bg-border p-px lg:block" aria-label="Consensus block transition과 증명 단계">
            <ConsensusStages active={active} />
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
