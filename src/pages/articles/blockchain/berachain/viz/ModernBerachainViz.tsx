import { useEffect, useRef } from "react";
import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = [
  "기준 상태",
  "블록 제안",
  "블록 확정",
  "다음 블록",
  "시스템 호출",
  "Vault 배분",
  "시간 분배",
  "사용자 적립",
  "청구",
] as const;

type Lane = "consensus" | "execution" | "allocation" | "vault" | "receipt";

const STATES: readonly {
  action: string;
  consensus: string;
  execution: string;
  allocation: string;
  vault: string;
  receipt: string;
  changed: readonly Lane[];
}[] = [
  {
    action: "아직 H42 제안 전",
    consensus: "V의 BERA stake는 active-set 진입과 block 제안 확률에 참여",
    execution: "H42 payload 없음 · PoL system transaction 없음",
    allocation: "V의 active allocation · Vault A 50% / Vault B 50%",
    vault: "Alice 100 / 전체 1,000 receipt units · 미청구 reward 0",
    receipt: "출발 상태만 확인 · 수치는 흐름을 추적하기 위한 가정",
    changed: ["consensus", "allocation", "vault"],
  },
  {
    action: "CometBFT round r이 V를 H42 proposer로 선택",
    consensus: "V가 BeaconKit으로 H42를 제안 · timeout이면 같은 height의 다음 round로 이동",
    execution: "BeaconKit이 Bera-Reth에 Engine API payload 요청 · 첫 withdrawal은 protocol inflation",
    allocation: "V의 BeraChef weight는 아직 reward로 실행되지 않음",
    vault: "Alice 미청구 reward 0",
    receipt: "제안은 아직 확정이 아님 · payload와 consensus vote를 따로 검증",
    changed: ["consensus", "execution", "receipt"],
  },
  {
    action: "2/3 초과 precommit → H42 commit",
    consensus: "H42와 proposer V가 확정 · BERA stake 경로가 block production에 쓰임",
    execution: "H42 execution payload와 state root가 확정",
    allocation: "V가 H42를 만들었다는 사실만 확정 · H42 보상 배분은 아직 실행 전",
    vault: "Alice 미청구 reward 0",
    receipt: "H42 commit은 합의 영수증 · Reward Vault 적립 영수증이 아님",
    changed: ["consensus", "execution", "receipt"],
  },
  {
    action: "Bera-Reth가 H43의 transaction 0을 합성",
    consensus: "H43 proposal context가 previous proposer pubkey=V를 전달",
    execution: "SYSTEM_ADDRESS → Distributor.distributeFor(V) · nonce=42 · tx type 0x7e",
    allocation: "H43의 첫 transaction이 H42 proposer 보상을 처리",
    vault: "아직 notify 전",
    receipt: "현재 block의 제안자 보상이 아니라 이전 block V의 보상",
    changed: ["consensus", "execution", "allocation", "receipt"],
  },
  {
    action: "PoL system call 실행",
    consensus: "H43 후보 block은 PoL transaction이 없거나 index 0이 아니면 검증 실패",
    execution: "BlockRewardController · operator base 0.4 / vault path 1.305 WBERA",
    allocation: "BeraChef가 ready가 아니면 vault path는 0 · base path는 별도",
    vault: "Alice 미청구 reward 0",
    receipt: "PoL receipt가 생겨도 H43 commit 전에는 durable하지 않음",
    changed: ["consensus", "execution", "allocation", "receipt"],
  },
  {
    action: "Distributor가 active allocation으로 WBERA 전달",
    consensus: "Consensus vote는 allocation weight를 정하지 않음",
    execution: "설명용 조건: DES 0% · vault path 1.305 WBERA",
    allocation: "Vault A 50% → 0.6525 WBERA · Vault B 50% → 0.6525 WBERA",
    vault: "Vault A가 notifyRewardAmount(V, 0.6525)를 받음",
    receipt: "Distributed event와 allowance·notify 상태를 같은 H43에서 확인",
    changed: ["execution", "allocation", "vault", "receipt"],
  },
  {
    action: "Reward Vault가 새 reward를 기존 잔여분과 합침",
    consensus: "H42 finality는 이미 끝났으며 vault 시간 분배와 무관",
    execution: "H43 commit 뒤 PoL state가 durable",
    allocation: "한 block의 0.6525 WBERA가 Vault A의 reward pool에 추가",
    vault: "즉시 Alice balance에 더하지 않고 rewardRate·periodFinish·rewardPerToken을 갱신",
    receipt: "notify 성공과 사용자 claim 가능량은 서로 다른 시점의 상태",
    changed: ["execution", "vault", "receipt"],
  },
  {
    action: "설명용 분배 기간이 모두 경과",
    consensus: "추가 consensus 결정 없음",
    execution: "추가 system call이 없다면 한 block 기여분을 고립해 계산 가능",
    allocation: "Vault A 기여분 0.6525 WBERA",
    vault: "Alice 지분 100/1,000=10% → 기여분 0.06525 WBERA 적립",
    receipt: "실제 chain에서는 매 block notify·stake 변화·반올림이 누적되므로 earned()를 조회",
    changed: ["allocation", "vault", "receipt"],
  },
  {
    action: "Alice가 Vault A reward를 청구",
    consensus: "H42 commit과 H43 commit을 별도 block evidence로 보존",
    execution: "RewardVault가 현재 reward token인 WBERA를 Alice에게 전송",
    allocation: "잔여 legacy BGT allowance가 있으면 BERA로 redeem한 뒤 WBERA로 합산",
    vault: "Alice의 unclaimed reward 감소 · WBERA balance 증가",
    receipt: "완료 판단: H42 proposer + H43 PoL receipt + Vault accounting + claim transfer",
    changed: ["consensus", "execution", "allocation", "vault", "receipt"],
  },
] as const;

const NOTES = [
  "설명용 fixture입니다. V의 Reward Vault allocation은 A 50%, B 50%이고 DES는 0%입니다. Alice는 Vault A 전체 1,000 units 중 100 units를 분배 기간 내내 유지합니다.",
  "BERA stake는 active set과 proposer probability에 쓰입니다. 제안자가 payload를 만들었다고 block이나 reward가 확정된 것은 아닙니다.",
  "CometBFT commit은 H42의 ordering과 state를 확정합니다. Reward allocation은 그 결과를 입력으로 받는 다음 state transition입니다.",
  "BRIP-0004 이후 Bera-Reth는 H43의 첫 transaction을 protocol이 직접 만듭니다. 인자는 H43 제안자가 아니라 H42의 proposer pubkey입니다.",
  "Current contract snapshot은 operator base 0.4 WBERA와 Reward Vault path 1.305 WBERA를 분리합니다. BeraChef가 준비되지 않으면 vault 몫은 0이 될 수 있습니다.",
  "Distributor는 선택적 Dedicated Emission Stream을 먼저 처리한 뒤 BeraChef weight를 적용합니다. 이 fixture에서는 DES를 0으로 두어 50% allocation만 계산합니다.",
  "notifyRewardAmount는 0.6525 WBERA를 Alice에게 즉시 송금하지 않습니다. 남은 reward와 합쳐 시간당 rate를 다시 정합니다.",
  "0.06525 WBERA는 한 block 기여분만 고립한 계산입니다. 실제 earned()는 경과 시간, totalSupply, 기존 reward와 새 notify를 모두 반영합니다.",
  "2026년 7월 이후 새 Reward Vault emission은 WBERA입니다. BGT는 deprecated 상태이며 legacy allowance를 WBERA claim으로 정리하는 호환 경로만 남아 있습니다.",
] as const;

const laneClass = (active: boolean) =>
  `grid min-w-0 grid-cols-[5.2rem_minmax(0,1fr)] gap-px border bg-border sm:grid-cols-[8.4rem_minmax(0,1fr)] ${active ? "border-l-4 border-primary" : "border-border"}`;

function StateLane({ label, value, active }: { label: string; value: string; active: boolean }) {
  return (
    <div className={laneClass(active)}>
      <div className={`bg-background p-2 text-[8px] font-black sm:p-3 sm:text-[10px] ${active ? "text-primary" : "text-muted-foreground"}`}>{label}</div>
      <strong className="min-w-0 break-keep bg-background p-2 text-[9px] leading-5 sm:p-3 sm:text-xs sm:leading-6">{value}</strong>
    </div>
  );
}

export function BerachainRewardLifecycleViz() {
  const scenes = useAnimatedScenes(SCENES.length, 7600, { loop: false });
  const tabsRef = useRef<HTMLDivElement>(null);
  const state = STATES[scenes.active];
  const active = (lane: Lane) => state.changed.includes(lane);

  useEffect(() => {
    const scroller = tabsRef.current;
    if (!scroller) return;
    const keepSelectedVisible = () => {
      const selected = scroller.querySelector<HTMLElement>('button[aria-pressed="true"]');
      if (!selected) return;
      const left = selected.getBoundingClientRect().left - scroller.getBoundingClientRect().left + scroller.scrollLeft;
      scroller.scrollTo({ left: left - (scroller.clientWidth - selected.offsetWidth) / 2, behavior: "auto" });
    };
    keepSelectedVisible();
    const observer = new ResizeObserver(keepSelectedVisible);
    observer.observe(scroller);
    return () => observer.disconnect();
  }, [scenes.active]);

  return (
    <VizFrame
      eyebrow="Berachain · block H42의 보상 한 건"
      title="제안자의 보상은 다음 블록 첫 transaction에서 vault로 들어갑니다"
      description="Consensus·Bera-Reth system call·BeraChef allocation·Reward Vault accounting이 같은 사건을 서로 다른 상태로 처리합니다."
      note="수치는 설명용 fixture입니다. 제어 순서는 BeaconKit v1.4.1, Bera-Reth v1.4.4, contracts commit 70e392fc와 docs commit ec5709d5에 맞췄습니다."
      canvasClassName="p-1.5 sm:p-5"
      documentFlow
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-berachain-scene={scenes.active}
        tabIndex={0}
        role="group"
        aria-label="Berachain block H42의 확정부터 다음 block system transaction과 사용자 WBERA claim까지 아홉 장면으로 추적"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div data-viz-scene-stage>
          <div ref={tabsRef} className="overflow-x-auto">
            <div className="grid grid-cols-9 gap-px bg-border p-px" style={{ width: "max(100%, 756px)" }}>
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

          <div className="mt-3 border-y border-border py-3 sm:py-4">
            <div className="grid gap-1.5">
              <StateLane label="CONSENSUS" value={state.consensus} active={active("consensus")} />
              <StateLane label="Bera-Reth · EVM" value={state.execution} active={active("execution")} />
              <StateLane label="BeraChef" value={state.allocation} active={active("allocation")} />
              <StateLane label="REWARD VAULT" value={state.vault} active={active("vault")} />
            </div>
            <div className="mt-2 grid grid-cols-[5.2rem_minmax(0,1fr)] gap-px bg-border p-px sm:grid-cols-[8.4rem_minmax(0,1fr)]">
              <div className="bg-background p-2 text-[8px] font-bold text-muted-foreground sm:p-3 sm:text-[10px]">현재 동작</div>
              <div className="min-w-0 break-keep bg-background p-2 text-[9px] font-bold leading-5 sm:p-3 sm:text-xs">{state.action}</div>
            </div>
            <div className={`mt-2 border-l-2 p-2.5 ${active("receipt") ? "border-primary bg-primary/10" : "border-border bg-background"}`}>
              <span className="text-[8px] font-black text-muted-foreground sm:text-[9px]">이 장면에서 확인한 사실</span>
              <p className="mt-1 break-keep text-[9px] font-bold leading-5 sm:text-xs sm:leading-6">{state.receipt}</p>
            </div>
            <p data-scene-note className="mt-3 min-h-[5.5rem] border-l-2 border-primary/50 pl-3 text-[9px] leading-5 text-muted-foreground sm:min-h-[6.5rem] sm:text-sm sm:leading-6">{NOTES[scenes.active]}</p>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} controlLabels={SCENES} playLabel="Berachain reward lifecycle 재생" compact />
      </div>
      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}

const BOUNDARIES = [
  ["제안자 선택", "CometBFT validator set · BERA stake", "누가 block을 제안할 확률을 갖는가", "BeraChef allocation weight"],
  ["Block 확정", "prevote·precommit · 2/3 초과 commit", "H42 ordering과 application state", "사용자 WBERA claim"],
  ["보상 호출", "H43 transaction 0 · SYSTEM_ADDRESS", "H42 proposer V의 Distributor 호출", "H43 proposer의 보상"],
  ["Vault 배분", "DES → BeraChef active allocation", "어느 whitelisted vault가 얼마를 받는가", "Alice가 즉시 받은 양"],
  ["사용자 적립", "rewardRate · rewardPerToken · earned", "시간과 stake share에 따른 claimable amount", "Consensus finality"],
] as const;

export function BerachainBoundaryViz() {
  return (
    <figure data-viz="berachain-state-boundaries" className="not-prose my-8 border-y border-border py-5">
      <figcaption>
        <p className="text-xs font-bold text-primary">다섯 결정은 연결되지만 같은 상태가 아닙니다</p>
        <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">각 단계에서 무엇을 확정했는지와 아직 확정하지 못한 것을 나눠야 합니다.</p>
      </figcaption>
      <div data-viz-canvas className="mt-5 grid gap-px bg-border p-px">
        <div className="hidden grid-cols-[9rem_minmax(0,1.2fr)_minmax(0,1.2fr)_minmax(0,1fr)] gap-px bg-border text-[10px] font-black text-muted-foreground lg:grid">
          <span className="bg-background p-3">결정</span><span className="bg-background p-3">정본</span><span className="bg-background p-3">여기서 확정</span><span className="bg-background p-3">아직 미확정</span>
        </div>
        {BOUNDARIES.map(([decision, owner, confirms, notYet]) => (
          <section key={decision} className="grid gap-px bg-border lg:grid-cols-[9rem_minmax(0,1.2fr)_minmax(0,1.2fr)_minmax(0,1fr)]">
            <strong className="bg-background p-3 text-xs leading-5 text-primary">{decision}</strong>
            <span className="bg-background p-3 text-xs font-bold leading-5">{owner}</span>
            <span className="bg-background p-3 text-xs leading-5">{confirms}</span>
            <span className="bg-background p-3 text-xs leading-5 text-muted-foreground">{notYet}</span>
          </section>
        ))}
      </div>
    </figure>
  );
}

const FAILURES = [
  ["H42 제안 timeout", "같은 height의 다음 CometBFT round", "H42 미확정 · V 보상 근거 없음"],
  ["H43 첫 PoL tx 누락·위치 오류", "Bera-Reth pre-execution validation 실패", "후보 block 거절"],
  ["BeraChef not ready", "base 0.4는 operator path · vault rewardRate 0", "Vault notify 없음"],
  ["Allocation이 없거나 inactive", "baseline을 읽고, 유효하지 않으면 default fallback", "임의의 과거 weight를 사용하지 않음"],
  ["Vault totalSupply=0", "reward를 undistributedRewards에 보관", "첫 stake 뒤 rate 설정"],
  ["Claim 전 legacy BGT allowance 존재", "BGT→BERA redeem→WBERA wrap", "사용자는 WBERA로 수령"],
] as const;

export function BerachainFailureViz() {
  return (
    <figure data-viz="berachain-failure-boundaries" className="not-prose my-8 border-y border-border py-5">
      <figcaption>
        <p className="text-xs font-bold text-primary">실패해도 모든 단계가 같은 방식으로 0이 되지는 않습니다</p>
        <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">어느 상태가 남고 어느 fallback이 선택되는지 source 기준으로 구분합니다.</p>
      </figcaption>
      <div data-viz-canvas className="mt-5 grid gap-px bg-border p-px">
        {FAILURES.map(([failure, behavior, result], index) => (
          <section key={failure} className="grid gap-px bg-border md:grid-cols-[2.7rem_12rem_minmax(0,1.35fr)_minmax(0,1fr)]">
            <span className="bg-background p-3 font-mono text-[10px] font-black text-primary">{String(index + 1).padStart(2, "0")}</span>
            <strong className="bg-background p-3 text-xs leading-5">{failure}</strong>
            <span className="bg-background p-3 text-xs leading-5 text-muted-foreground">{behavior}</span>
            <span className="bg-background p-3 text-xs font-bold leading-5">{result}</span>
          </section>
        ))}
      </div>
    </figure>
  );
}

export default BerachainRewardLifecycleViz;
