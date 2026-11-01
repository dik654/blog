import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const TRACE_LABELS = ["접수", "선출", "제안", "묶음", "검증", "실행", "head", "확정"] as const;
const TRACE_SCENES = [
  {
    owner: "Lotus message pool",
    title: "Alice의 5 FIL 송금이 후보 메시지로 들어옵니다",
    detail: "노드가 서명과 nonce·수수료 조건을 확인해 보관합니다. 아직 블록이나 체인 상태는 바뀌지 않았습니다.",
    request: "Alice → Bob · 5 FIL",
    block: "없음",
    chain: "EC head · T100",
    finality: "F3 prefix · T96",
    evidence: "message CID",
  },
  {
    owner: "storage provider · election proof",
    title: "QAP 지분과 VRF 결과가 이번 epoch의 win count를 정합니다",
    detail: "지분 10%, 기대 leader 5이면 λ=0.5입니다. 일정표가 아니라 0회·1회·여러 회가 가능한 확률 추첨입니다.",
    request: "message pool에 대기",
    block: "WinCount · j=1",
    chain: "EC head · T100",
    finality: "F3 prefix · T96",
    evidence: "VRF proof + power 기준 상태",
  },
  {
    owner: "선출된 provider",
    title: "Provider A가 부모 T100을 잇는 block A를 만듭니다",
    detail: "Block A는 송금 메시지와 election proof·WinningPoSt·부모 commitments를 담습니다. 생성만으로 유효하지는 않습니다.",
    request: "message M5 포함",
    block: "A · epoch 101 · parent T100",
    chain: "EC head · T100",
    finality: "F3 prefix · T96",
    evidence: "block CID A",
  },
  {
    owner: "Lotus · tipset construction",
    title: "같은 부모를 가리키는 A와 B를 한 tipset 후보로 묶습니다",
    detail: "같은 epoch라도 다른 부모를 가리키는 C는 별도 fork입니다. NewTipSet은 높이·부모를 확인하고 ticket 순으로 정렬합니다.",
    request: "M5는 A에만 있음",
    block: "T101 = {A, B} · C는 분리",
    chain: "EC head · T100",
    finality: "F3 prefix · T96",
    evidence: "candidate tipset key",
  },
  {
    owner: "Lotus · FilecoinEC.ValidateBlock",
    title: "각 block을 부모 문맥과 proof·message까지 검증합니다",
    detail: "높이·시각·parent weight를 먼저 확인하고 miner·election·서명·beacon·ticket·WinningPoSt 검사를 병렬로 기다립니다.",
    request: "M5의 message root 확인",
    block: "A valid · B valid · C valid fork",
    chain: "유효 후보 두 갈래",
    finality: "F3 prefix · T96",
    evidence: "validation result",
  },
  {
    owner: "Lotus · StateManager / VM",
    title: "T101의 메시지를 한 부모 상태에서 순서대로 실행합니다",
    detail: "중복 메시지를 제거한 tipset 전체 실행 결과가 state root와 receipt root가 됩니다. A만 따로 실행한 결과가 최종 tipset 상태는 아닙니다.",
    request: "Alice −5 · Bob +5",
    block: "T101 state/receipt commitments",
    chain: "후보 상태 계산 완료",
    finality: "F3 prefix · T96",
    evidence: "state root + receipt",
  },
  {
    owner: "Lotus · chain weight / ChainStore",
    title: "완전히 유효한 branch 가운데 누적 weight가 큰 쪽을 local head로 바꿉니다",
    detail: "Parent weight, network QAP와 tipset win count를 고정 정수 산술로 계산합니다. 더 무거운 valid branch가 오면 정상 reorg가 가능합니다.",
    request: "M5 · EC head에 포함",
    block: "T101 selected",
    chain: "EC head · T101",
    finality: "F3 prefix · T96",
    evidence: "head-change apply",
  },
  {
    owner: "F3 · 별도 finality protocol",
    title: "F3 certificate가 EC chain의 한 prefix를 되돌릴 수 없게 고정합니다",
    detail: "EC는 새 head를 계속 만들지만 이미 F3로 확정된 prefix와 충돌하는 분기는 선택할 수 없습니다. Head와 finality는 다른 포인터입니다.",
    request: "M5 · 확정 prefix에 포함",
    block: "T101 certificate 확인",
    chain: "EC head · T104",
    finality: "F3 prefix · T101",
    evidence: "finality certificate",
  },
] as const;

const TRACE_NOTES = TRACE_SCENES.map((scene, index) => `${TRACE_LABELS[index]}. ${scene.title} ${scene.detail} 이 단계의 증거는 ${scene.evidence}입니다.`);

export function ExpectedConsensusTraceViz() {
  const scenes = useAnimatedScenes(TRACE_SCENES.length, 8200, { loop: false });
  const scene = TRACE_SCENES[scenes.active];

  return <VizFrame
    eyebrow="Alice → Bob · 5 FIL"
    title="메시지 하나가 후보에서 EC head를 거쳐 F3 확정 prefix에 들어가는 과정을 따라갑니다"
    description="장면마다 상태를 쓰는 주체와 증거가 함께 바뀝니다. 접수·포함·현재 head·최종성은 같은 완료 상태가 아닙니다."
    note="T96·T100·T101·T104는 상태 경계를 설명하기 위한 tipset 식별자입니다. 처리 시간과 성공률을 뜻하지 않습니다."
    documentFlow
    canvasClassName="p-3 sm:p-6"
  >
    <div id={scenes.playbackId} tabIndex={0} onKeyDown={scenes.onKeyDown} className="outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label="Filecoin Expected Consensus 요청 흐름 장면 탐색기">
      <div data-viz-live-only className="space-y-4">
        <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-8">
          {TRACE_LABELS.map((label, index) => <div key={label} className={`border px-1 py-2 text-center text-[9px] font-black transition-colors duration-300 ${index === scenes.active ? "border-primary bg-primary/10" : index < scenes.active ? "border-foreground/30 bg-background" : "border-border bg-background text-muted-foreground"}`}>{index + 1}. {label}</div>)}
        </div>

        <div className="grid gap-px bg-border p-px lg:grid-cols-[minmax(0,1.35fr)_minmax(15rem,0.65fr)]">
          <div className="bg-background p-4 sm:p-5">
            <p className="text-[10px] font-black text-primary">현재 상태 소유자 · {scene.owner}</p>
            <h4 className="mt-2 break-keep text-base font-black leading-6 sm:text-lg">{scene.title}</h4>
            <p className="mt-2 break-keep text-xs leading-6 text-muted-foreground">{scene.detail}</p>
            <div className="mt-3 border-t border-border pt-3 sm:hidden">
              <p className="text-[9px] font-bold text-muted-foreground">현재 단계의 증거</p>
              <p className="mt-1 border-l-2 border-primary pl-2 font-mono text-xs font-black">{scene.evidence}</p>
            </div>
            <div className="mt-5 h-1.5 bg-border/70" aria-label={`전체 진행 ${scenes.active + 1}/${TRACE_SCENES.length}`}>
              <div className="h-full bg-primary transition-[width] duration-500" style={{ width: `${((scenes.active + 1) / TRACE_SCENES.length) * 100}%` }} />
            </div>
          </div>
          <div className="hidden bg-background p-4 sm:block sm:p-5">
            <p className="text-[9px] font-bold text-muted-foreground">현재 단계가 남기는 증거</p>
            <p className="mt-2 border-l-2 border-primary pl-3 font-mono text-sm font-black">{scene.evidence}</p>
            <p className="mt-4 text-[9px] leading-5 text-muted-foreground">이 증거는 바로 다음 판단의 입력입니다. 뒤 단계의 성공을 대신하지 않습니다.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
          {[
            ["요청", scene.request],
            ["block·tipset", scene.block],
            ["EC local head", scene.chain],
            ["F3 확정 prefix", scene.finality],
          ].map(([label, value], index) => <div key={label} className={`relative min-w-0 border bg-background p-3 ${index === Math.min(3, Math.floor(scenes.active / 2)) ? "border-primary/60" : "border-border"}`}>
            <span className={`absolute -left-1 top-4 size-2 ${index <= Math.floor(scenes.active / 2) ? "bg-primary" : "bg-border"}`} />
            <p className="text-[9px] font-bold text-muted-foreground">{label}</p>
            <p className="mt-2 break-keep font-mono text-[10px] font-bold leading-5">{value}</p>
          </div>)}
        </div>

        <AnimatedSceneControls {...scenes} labels={TRACE_LABELS} controlLabels={TRACE_LABELS} playLabel="전체 경로 재생" compact />
      </div>
      <StaticSceneList labels={TRACE_LABELS} notes={TRACE_NOTES} />
    </div>
  </VizFrame>;
}

const DISTRIBUTION = [
  { wins: "0회", probability: 60.65, width: "60.65%", meaning: "이번 epoch에는 block을 만들지 않음" },
  { wins: "1회", probability: 30.33, width: "30.33%", meaning: "WinCount 1인 block을 제안할 수 있음" },
  { wins: "2회", probability: 7.58, width: "7.58%", meaning: "한 block이 두 wins를 주장함" },
  { wins: "3회 이상", probability: 1.44, width: "1.44%", meaning: "작지만 0이 아닌 꼬리 확률" },
] as const;

export function SortitionDistributionViz() {
  return <VizFrame
    eyebrow="E=5 · provider QAP 10% · λ=0.5"
    title="10% 지분은 열 번에 한 번인 일정표가 아니라 epoch마다 다시 뽑는 분포입니다"
    description="아래 백분율은 수식을 읽기 위한 실수 근삿값입니다. 실제 Lotus는 VRF hash와 Q.256 고정소수점 inverse CDF를 사용합니다."
    note="표시값은 P(0)·P(1)·P(2)와 나머지 꼬리 확률을 반올림했습니다. Lotus의 MaxWinCount는 3×BlocksPerEpoch입니다."
    documentFlow
    canvasClassName="p-3 sm:p-6"
  >
    <div className="grid gap-5 lg:grid-cols-[minmax(13rem,0.7fr)_minmax(0,1.3fr)] lg:items-center">
      <div className="relative mx-auto flex aspect-square w-full max-w-[17rem] items-center justify-center rounded-full border border-border bg-background p-6">
        <div className="absolute inset-[15%] rounded-full border border-dashed border-border" />
        <div className="relative text-center">
          <p className="text-[10px] font-bold text-muted-foreground">한 provider의 rate</p>
          <p className="mt-2 font-mono text-3xl font-black text-primary">λ = 0.5</p>
          <p className="mt-2 text-xs font-semibold">5 × 10%</p>
        </div>
        {["VRF", "QAP", "E=5"].map((label, index) => <span key={label} className={`absolute rounded-full border bg-background px-2 py-1 text-[9px] font-black ${index === 0 ? "left-2 top-1/2" : index === 1 ? "right-2 top-1/4" : "bottom-3 right-10"}`}>{label}</span>)}
      </div>
      <div className="space-y-3">
        {DISTRIBUTION.map((row) => <div key={row.wins} className="grid grid-cols-[4.5rem_minmax(0,1fr)] items-center gap-3">
          <div><strong className="text-xs">{row.wins}</strong><p className="font-mono text-[10px] text-muted-foreground">{row.probability.toFixed(2)}%</p></div>
          <div className="min-w-0">
            <div className="h-5 border border-border bg-background p-0.5"><div className="h-full min-w-[2px] bg-primary" style={{ width: row.width }} /></div>
            <p className="mt-1 break-keep text-[9px] leading-4 text-muted-foreground">{row.meaning}</p>
          </div>
        </div>)}
      </div>
    </div>
  </VizFrame>;
}

export function TipsetCompatibilityViz() {
  return <VizFrame
    eyebrow="epoch 101 · 후보 blocks A, B, C"
    title="같은 시각에 도착해도 같은 부모를 가리키는 blocks만 한 tipset 후보가 됩니다"
    description="생성자에서 확인하는 구조 조건과 각 block의 전체 유효성 검사를 분리해서 봅니다."
    note="Lotus v1.38.3 NewTipSet은 non-empty·ticket·height·parents를 검사하고 ticket/CID 순으로 정렬합니다. State·receipt·proof·message commitments는 전체 validation 문맥에서 확인합니다."
    documentFlow
    canvasClassName="p-3 sm:p-6"
  >
    <div className="space-y-5">
      <div className="grid gap-3 md:grid-cols-[minmax(7rem,0.55fr)_2rem_minmax(0,1.45fr)] md:items-center">
        <div className="border border-foreground/40 bg-background p-4 text-center"><p className="text-[9px] text-muted-foreground">부모 tipset</p><strong className="mt-1 block font-mono text-sm">T100</strong></div>
        <div className="hidden h-px bg-border md:block" />
        <div className="grid grid-cols-2 gap-3">
          {[["A", "parent T100 · h101"], ["B", "parent T100 · h101"]].map(([name, detail]) => <div key={name} className="border border-primary/60 bg-primary/5 p-4 text-center"><span className="mx-auto flex size-8 items-center justify-center rounded-full bg-primary font-mono text-xs font-black text-primary-foreground">{name}</span><p className="mt-2 font-mono text-[9px]">{detail}</p></div>)}
          <div className="col-span-2 border-l-2 border-primary pl-3 text-xs font-black">T101 = {"{A, B}"} 후보</div>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-[minmax(7rem,0.55fr)_2rem_minmax(0,1.45fr)] md:items-center">
        <div className="border border-border bg-background p-4 text-center"><p className="text-[9px] text-muted-foreground">다른 부모</p><strong className="mt-1 block font-mono text-sm">T100′</strong></div>
        <div className="hidden h-px border-t border-dashed border-border md:block" />
        <div className="grid grid-cols-[minmax(7rem,0.55fr)_minmax(0,1fr)] gap-3">
          <div className="border border-border bg-background p-4 text-center"><span className="mx-auto flex size-8 items-center justify-center rounded-full border border-border font-mono text-xs font-black">C</span><p className="mt-2 font-mono text-[9px]">parent T100′ · h101</p></div>
          <div className="border border-dashed border-border p-4 text-xs leading-5 text-muted-foreground"><strong className="text-foreground">별도 fork</strong><br />높이가 같아도 A·B와 합치지 않습니다.</div>
        </div>
      </div>
      <div className="grid gap-px bg-border p-px sm:grid-cols-2">
        <div className="bg-background p-4"><p className="text-[9px] font-bold text-primary">NewTipSet이 직접 확인</p><p className="mt-2 break-keep text-xs font-semibold leading-5">block 존재 · ticket 존재 · 같은 height · 같은 parents · 결정적 정렬</p></div>
        <div className="bg-background p-4"><p className="text-[9px] font-bold text-muted-foreground">그 뒤 전체 validation이 확인</p><p className="mt-2 break-keep text-xs font-semibold leading-5">Parent weight, election, WinningPoSt, signature, beacon, messages와 commitments</p></div>
      </div>
    </div>
  </VizFrame>;
}

const CHECKS = [
  ["동기 문맥", "parent tipset · lookback · height · timestamp · parent weight"],
  ["miner", "eligible power · slashed 상태"],
  ["winner", "election VRF · recomputed WinCount"],
  ["서명", "worker address · block signature"],
  ["무작위성", "beacon values · ticket VRF"],
  ["저장 증명", "WinningPoSt"],
  ["공통 검사", "message roots · message validity"],
] as const;

export function BlockValidationViz() {
  return <VizFrame
    eyebrow="Lotus v1.38.3 · FilecoinEC.ValidateBlock"
    title="빠른 부모 문맥 검사를 통과한 뒤 독립 검사를 함께 기다립니다"
    description="한 검사만 성공했다고 후보가 되는 것이 아닙니다. 모든 future가 성공해야 valid block으로 반환합니다."
    documentFlow
    canvasClassName="p-3 sm:p-6"
  >
    <div className="grid gap-5 lg:grid-cols-[9rem_minmax(0,1fr)_9rem] lg:items-center">
      <div className="border border-foreground/40 bg-background p-4 text-center"><span className="mx-auto flex size-10 items-center justify-center rounded-full bg-foreground font-mono text-xs font-black text-background">A</span><p className="mt-2 text-[10px] font-bold">수신 block</p></div>
      <div className="space-y-3">
        <div className="border border-primary/60 bg-primary/5 p-3"><p className="text-[9px] font-bold text-primary">먼저 중단할 수 있는 검사</p><p className="mt-1 break-keep text-xs font-semibold">{CHECKS[0][1]}</p></div>
        <div className="relative grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          <div className="absolute left-4 right-4 top-0 hidden h-px bg-border sm:block" aria-hidden="true" />
          {CHECKS.slice(1).map(([label, detail]) => <div key={label} className="relative border border-border bg-background p-3"><span className="absolute -top-1 left-3 size-2 bg-primary" /><p className="text-[9px] font-black text-primary">{label}</p><p className="mt-1 break-keep text-[10px] font-semibold leading-5">{detail}</p></div>)}
        </div>
      </div>
      <div className="grid gap-2">
        <div className="border border-primary bg-primary p-3 text-center text-primary-foreground"><p className="text-[9px] font-bold">모두 성공</p><strong className="mt-1 block text-xs">valid candidate</strong></div>
        <div className="border border-destructive/50 bg-background p-3 text-center"><p className="text-[9px] font-bold text-destructive">하나라도 실패</p><strong className="mt-1 block text-xs">reject</strong></div>
      </div>
    </div>
  </VizFrame>;
}

const HEAD_LABELS = ["기존 head", "경쟁 branch", "reorg", "null epoch", "F3 fence"] as const;
const HEAD_SCENES = [
  { title: "Branch X의 T101이 현재 EC head입니다", detail: "송금 M5의 receipt는 head 기준으로 보이지만 아직 F3 확정 prefix 밖입니다.", x: "head", y: "candidate", f3: "T98", epoch: "101", action: "apply X" },
  { title: "Branch Y가 유효한 T102′를 더해 더 무거워집니다", detail: "Y의 block도 전체 validation을 통과해야 합니다. Invalid-heavy branch는 비교 대상이 아닙니다.", x: "old head", y: "heavier", f3: "T98", epoch: "102", action: "compare weight" },
  { title: "공통 조상 뒤 X를 revert하고 Y를 apply합니다", detail: "M5가 Y에 없다면 잔액과 receipt도 새 head 기준으로 되돌아갑니다. 이것은 EC의 정상 동작입니다.", x: "reverted", y: "head", f3: "T98", epoch: "102", action: "revert X → apply Y" },
  { title: "다음 epoch에 block이 없어도 시간은 전진합니다", detail: "빈 tipset을 만들지 않습니다. 다음 block은 height를 건너뛰고 timestamp·cron/state 효과가 null 수를 반영합니다.", x: "reverted", y: "head · no block at 103", f3: "T98", epoch: "103", action: "null epoch" },
  { title: "F3가 T102′까지 확정하면 이후 EC head는 그 prefix를 이어야 합니다", detail: "F3가 멈춰도 EC는 진행할 수 있지만 새로운 finality certificate가 생겼다고 표시하면 안 됩니다.", x: "discarded", y: "head · extends finalized prefix", f3: "T102′", epoch: "104", action: "finality fence" },
] as const;
const HEAD_NOTES = HEAD_SCENES.map((scene, index) => `${HEAD_LABELS[index]}. ${scene.title} ${scene.detail}`);

export function HeadChangeTraceViz() {
  const scenes = useAnimatedScenes(HEAD_SCENES.length, 8600, { loop: false });
  const scene = HEAD_SCENES[scenes.active];

  return <VizFrame
    eyebrow="유효 branch 변화 · reorg · null epoch · F3"
    title="EC head는 바뀔 수 있지만 F3로 확정된 prefix 앞쪽은 되돌리지 않습니다"
    description="장면을 넘기면 두 branch의 지위, 현재 epoch와 finality fence가 실제 상태로 바뀝니다."
    note="F3는 go-f3 v0.8.15 README 기준 2025-04-29 epoch 4920480에 Filecoin mainnet에서 활성화됐습니다. 이 그림은 고정 확정 시간을 약속하지 않습니다."
    documentFlow
    canvasClassName="p-3 sm:p-6"
  >
    <div id={scenes.playbackId} tabIndex={0} onKeyDown={scenes.onKeyDown} className="outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label="EC head와 F3 확정 prefix 변화 장면 탐색기">
      <div data-viz-live-only className="space-y-4">
        <div className="grid gap-px bg-border p-px sm:grid-cols-[6rem_minmax(0,1fr)_8rem]">
          <div className="bg-background p-3"><p className="text-[9px] text-muted-foreground">현재 epoch</p><strong className="mt-1 block font-mono text-lg">{scene.epoch}</strong></div>
          <div className="bg-background p-3 sm:p-4"><p className="text-[9px] font-bold text-primary">{scenes.active + 1}. {HEAD_LABELS[scenes.active]}</p><h4 className="mt-1 break-keep text-sm font-black leading-6">{scene.title}</h4><p className="mt-1 break-keep text-[10px] leading-5 text-muted-foreground">{scene.detail}</p></div>
          <div className="bg-background p-3"><p className="text-[9px] text-muted-foreground">상태 전이</p><strong className="mt-1 block break-keep font-mono text-[10px] leading-5">{scene.action}</strong></div>
        </div>

        <div className="relative overflow-hidden border border-border bg-background p-4 sm:p-6">
          <div className="absolute bottom-4 left-[4.4rem] top-4 w-px bg-foreground/30 sm:left-[6.5rem]" aria-hidden="true" />
          <div className="grid grid-cols-[4rem_minmax(0,1fr)] gap-4 sm:grid-cols-[6rem_minmax(0,1fr)]">
            <div className="space-y-10 py-2 text-right font-mono text-[9px] text-muted-foreground"><p>T98</p><p>T100</p><p>101+</p></div>
            <div className="space-y-5">
              <div className="flex items-center gap-2"><span className="size-3 rounded-full bg-foreground" /><strong className="text-[10px]">공통 prefix</strong><span className="ml-auto border border-primary/60 px-2 py-1 font-mono text-[9px] font-black text-primary">F3 · {scene.f3}</span></div>
              <div className="ml-1 h-5 border-l border-foreground/30" />
              <div className="grid grid-cols-2 gap-3">
                <div className={`min-w-0 border p-3 transition-colors duration-300 ${scene.x === "head" ? "border-primary bg-primary/10" : "border-border bg-muted/20 text-muted-foreground"}`}><p className="text-[9px] font-black">branch X</p><p className="mt-1 break-keep font-mono text-[9px]">T101 · M5 receipt</p><p className="mt-2 text-[9px] font-bold">{scene.x}</p></div>
                <div className={`min-w-0 border p-3 transition-colors duration-300 ${scene.y.includes("head") || scene.y === "heavier" ? "border-primary bg-primary/10" : "border-border bg-background"}`}><p className="text-[9px] font-black">branch Y</p><p className="mt-1 break-keep font-mono text-[9px]">T101′ → T102′</p><p className="mt-2 text-[9px] font-bold">{scene.y}</p></div>
              </div>
            </div>
          </div>
        </div>

        <AnimatedSceneControls {...scenes} labels={HEAD_LABELS} controlLabels={HEAD_LABELS} playLabel="head 변화 재생" compact />
      </div>
      <StaticSceneList labels={HEAD_LABELS} notes={HEAD_NOTES} />
    </div>
  </VizFrame>;
}

export default ExpectedConsensusTraceViz;
