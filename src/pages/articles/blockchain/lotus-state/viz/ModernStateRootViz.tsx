import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["R0 열기", "주소 해석", "record 읽기", "A 수정", "B 되돌림", "층 합치기", "R1 봉인"] as const;

const SCENES = [
  {
    title: "State root R0는 전체 상태가 아니라, 상태 그래프에 들어가는 첫 주소입니다",
    detail: "현재 network version 29는 StateTree version 5를 선택합니다. R0에서 version·Actors HAMT root·Info CID를 읽어 같은 schema로 그래프를 엽니다.",
    input: "R0 · network v29",
    overlay: "base layer 1개",
    actor: "아직 읽지 않음",
    output: "StateTree v5 opened",
    receipt: "root + version context",
  },
  {
    title: "사용자 주소를 현재 Init actor의 ID 주소로 먼저 바꿉니다",
    detail: "이미 ID 주소면 그대로 쓰고, robust·delegated 주소라면 Init actor mapping에서 f0100을 찾습니다. 찾지 못하면 actor HAMT를 임의 주소로 뒤지지 않고 실패합니다.",
    input: "robust address",
    overlay: "resolve cache @ top",
    actor: "ID key f0100",
    output: "f0100",
    receipt: "resolved in R0 context",
  },
  {
    title: "f0100의 record는 상세 상태를 Head CID 아래에 따로 둡니다",
    detail: "현재 v5 record는 Code·Head·Nonce·Balance·선택적 DelegatedAddress를 가집니다. Head 아래 actor별 state와 HAMT·AMT는 Code·bundle에 맞는 schema로 읽습니다.",
    input: "Actors HAMT[f0100]",
    overlay: "cache copy in base layer",
    actor: "nonce 7 · balance 25 FIL",
    output: "Head H_A → child DAG",
    receipt: "actor record @ R0",
  },
  {
    title: "Snapshot A에서 nonce를 8로 바꿔도 R0는 아직 바뀌지 않습니다",
    detail: "Snapshot()이 새 overlay를 올리고 SetActor가 A에 수정본을 씁니다. 조회는 맨 위 층부터 내려가므로 8을 보지만, Actors HAMT와 state root는 아직 R0입니다.",
    input: "Snapshot A · SetActor",
    overlay: "base → A{nonce 8}",
    actor: "조회값 nonce 8",
    output: "R0 unchanged",
    receipt: "in-memory mutation only",
  },
  {
    title: "중첩 B의 삭제를 Revert하면 A의 nonce 8은 남습니다",
    detail: "B에서 DeleteActor를 기록한 뒤 Revert()를 호출하면 B를 버리고 같은 깊이에 빈 B′를 만듭니다. A는 아래 층이므로 보존되고 조회값은 다시 nonce 8입니다.",
    input: "B{delete f0100}",
    overlay: "base → A{8} → B′{}",
    actor: "nonce 8 restored",
    output: "B deletion discarded",
    receipt: "top layer replaced",
  },
  {
    title: "Flush 전에 B′와 A를 차례로 합쳐 층을 하나만 남깁니다",
    detail: "ClearSnapshot() 한 번은 B′를 A에, 다음 한 번은 A를 base에 합칩니다. Lotus Flush는 snapshot 층이 둘 이상 남아 있으면 오류를 반환합니다.",
    input: "ClearSnapshot × 2",
    overlay: "base{nonce 8} only",
    actor: "surviving update f0100=8",
    output: "flushable layer count 1",
    receipt: "nested scopes closed",
  },
  {
    title: "Flush는 살아남은 record만 HAMT에 적용하고 새 StateRoot R1을 만듭니다",
    detail: "Actors HAMT root A1을 만든 뒤 version 5·A1·Info CID를 DAG-CBOR로 저장합니다. R1은 같은 그래프를 재현하는 봉인이지, chain 채택이나 finality 영수증은 아닙니다.",
    input: "base HAMT + f0100 nonce 8",
    overlay: "all scopes closed",
    actor: "record committed",
    output: "R1 = CID(v5, A1, Info)",
    receipt: "candidate state root R1",
  },
] as const;

const NOTES = SCENES.map((scene, index) => `${LABELS[index]}. ${scene.title} ${scene.detail} 결과는 ${scene.receipt}입니다.`);

export default function ModernStateRootViz() {
  const scenes = useAnimatedScenes(SCENES.length, 8200, { loop: false });
  const scene = SCENES[scenes.active];

  return <VizFrame
    eyebrow="f0100 · nonce 7→8 · nested revert"
    title="StateTree는 원본을 바로 고치지 않고, 살아남은 변경만 새 root로 묶습니다"
    description="R0을 연 시점부터 주소 해석, record 조회, 중첩 snapshot, revert, merge, R1 생성까지 한 변경을 따라갑니다."
    note="예제의 R1은 local flush 결과입니다. Tipset 실행·consensus adoption·finality는 이 장면 바깥의 별도 단계입니다."
    documentFlow
    canvasClassName="p-3 sm:p-6"
  >
    <div id={scenes.playbackId} tabIndex={0} onKeyDown={scenes.onKeyDown} className="outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label="Lotus StateTree snapshot과 root 전이 장면 탐색기">
      <div data-viz-live-only className="space-y-4">
        <div data-viz-scene-stage className="space-y-4">
          <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-7">
            {LABELS.map((label, index) => <div key={label} className={`border px-1 py-2 text-center text-[9px] font-black ${index === scenes.active ? "border-primary bg-primary/10" : index < scenes.active ? "border-foreground/30 bg-background" : "border-border bg-background text-muted-foreground"}`}>{index + 1}. {label}</div>)}
          </div>
          <div className="grid gap-px bg-border p-px lg:grid-cols-[minmax(0,1.4fr)_minmax(13rem,0.6fr)]">
            <div className="bg-background p-4 sm:p-5"><p className="text-[10px] font-black text-primary">현재 변화 · {LABELS[scenes.active]}</p><h4 className="mt-2 break-keep text-base font-black leading-6 sm:text-lg">{scene.title}</h4><p className="mt-2 break-keep text-xs leading-6 text-muted-foreground">{scene.detail}</p></div>
            <div className="bg-background p-4 sm:p-5"><p className="text-[9px] font-bold text-muted-foreground">이 단계의 확인 기록</p><p className="mt-2 border-l-2 border-primary pl-3 font-mono text-xs font-black leading-5">{scene.receipt}</p><p className="mt-4 text-[9px] leading-5 text-muted-foreground">읽기 결과·overlay·root 생성을 같은 완료로 부르지 않습니다.</p></div>
          </div>
          <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
            {[["입력", scene.input], ["snapshot stack", scene.overlay], ["actor 상태", scene.actor], ["출력", scene.output]].map(([label, value], index) => <article key={label} className={`min-w-0 border bg-background p-3 ${index === 3 ? "border-primary/60" : "border-border"}`}><p className="text-[9px] font-bold text-muted-foreground">{label}</p><p className="mt-2 break-keep font-mono text-[10px] font-black leading-5 sm:text-xs">{value}</p></article>)}
          </div>
          <div className="flex gap-1" aria-hidden="true">{LABELS.map((label, index) => <span key={label} className={`h-1.5 flex-1 ${index <= scenes.active ? "bg-primary" : "bg-border"}`} />)}</div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="StateTree snapshot·root 경로 재생" compact />
      </div>
      <StaticSceneList labels={LABELS} notes={NOTES} />
    </div>
  </VizFrame>;
}

const ACTOR_LABELS = ["주소", "ID", "record", "Head"] as const;
const ACTOR_SCENES = [
  {
    title: "사용자가 건넨 주소만으로는 Actors HAMT의 key를 아직 모릅니다",
    detail: "f1·f2·f3·f4 같은 주소는 현재 state의 Init actor 주소표를 거쳐 ID 주소로 바꿔야 합니다.",
    address: "robust / delegated address",
    lookup: "Init actor mapping 대기",
    record: "읽지 않음",
    child: "읽지 않음",
  },
  {
    title: "현재 R0의 Init actor에서 ID 주소 f0100을 찾습니다",
    detail: "이미 ID 주소면 그대로 사용합니다. 주소표에 없다면 임의의 HAMT key를 추측하지 않고 actor-not-found로 멈춥니다.",
    address: "robust address",
    lookup: "R0 → Init.Head → f0100",
    record: "Actors[f0100] 대기",
    child: "읽지 않음",
  },
  {
    title: "Actors HAMT에서 f0100의 다섯 필드를 읽습니다",
    detail: "StateTree v5의 actor record는 Code·Head·Nonce·Balance와 선택적인 DelegatedAddress를 가집니다.",
    address: "f0100",
    lookup: "Actors HAMT key",
    record: "Code C_account · Head H_A · nonce 7 · 25 FIL · f4?",
    child: "H_A 해석 대기",
  },
  {
    title: "Code CID가 정한 actor schema로 Head 아래 상태를 엽니다",
    detail: "Head H_A는 account actor의 상세 상태를 가리킵니다. 다른 actor라면 그 schema와 child HAMT·AMT 구조도 달라질 수 있습니다.",
    address: "f0100",
    lookup: "Code C_account → bundle schema",
    record: "nonce 7 · balance 25 FIL",
    child: "H_A → actor state DAG",
  },
] as const;
const ACTOR_NOTES = ACTOR_SCENES.map((scene, index) => `${index + 1}. ${scene.title} ${scene.detail}`);

export function ActorRecordPathViz() {
  const scenes = useAnimatedScenes(ACTOR_SCENES.length, 7000, { loop: false });
  const scene = ACTOR_SCENES[scenes.active];

  return <VizFrame
    eyebrow="robust address → f0100 → actor record → Head"
    title="주소 하나를 actor 상태까지 따라갑니다"
    description="주소 해석과 record 조회, Head 아래 상태 해석은 서로 다른 단계입니다."
    note="StateTree v5 record의 다섯 필드는 Lotus v1.38.3의 고정된 소스 구조를 따릅니다."
    documentFlow
    canvasClassName="p-3 sm:p-6"
  >
    <div id={scenes.playbackId} tabIndex={0} onKeyDown={scenes.onKeyDown} className="outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label="Lotus actor 주소와 record 탐색 장면 탐색기">
      <div data-viz-live-only className="space-y-4">
        <div data-viz-scene-stage className="space-y-4">
          <div className="border border-border bg-background p-4">
            <p className="text-[10px] font-black text-primary">현재 단계 · {ACTOR_LABELS[scenes.active]}</p>
            <h4 className="mt-2 break-keep text-base font-black leading-6 sm:text-lg">{scene.title}</h4>
            <p className="mt-2 break-keep text-xs leading-6 text-muted-foreground">{scene.detail}</p>
          </div>
          <div className="grid gap-px bg-border p-px sm:grid-cols-2">
            {[["요청 주소", scene.address], ["주소 해석", scene.lookup], ["actor record", scene.record], ["Head 아래 상태", scene.child]].map(([label, value], index) => <article key={label} className={`min-w-0 bg-background p-4 ${index === scenes.active ? "ring-1 ring-inset ring-primary" : ""}`}><p className="text-[9px] font-bold text-muted-foreground">{label}</p><p className="mt-2 break-keep font-mono text-[10px] font-black leading-5 sm:text-xs">{value}</p></article>)}
          </div>
          <div className="flex gap-1" aria-hidden="true">{ACTOR_LABELS.map((label, index) => <span key={label} className={`h-1.5 flex-1 ${index <= scenes.active ? "bg-primary" : "bg-border"}`} />)}</div>
        </div>
        <AnimatedSceneControls {...scenes} labels={ACTOR_LABELS} controlLabels={ACTOR_LABELS} playLabel="Actor record 탐색 경로 재생" compact />
      </div>
      <StaticSceneList labels={ACTOR_LABELS} notes={ACTOR_NOTES} />
    </div>
  </VizFrame>;
}

const TRIE_LABELS = ["입력", "HAMT", "AMT", "검증"] as const;
const TRIE_SCENES = [
  {
    title: "HAMT는 key bytes를, AMT는 정수 index를 입력으로 받습니다",
    detail: "두 구조 모두 비어 있는 전체 배열을 저장하지 않고 bitfield와 compact pointer로 존재하는 갈래만 기록합니다.",
    hamt: "key bytes → hash 대기",
    amt: "index 42",
    path: "아직 없음",
    verdict: "version·bit width 필요",
  },
  {
    title: "HAMT는 key hash를 level당 w bit씩 나눠 갈래를 고릅니다",
    detail: "256-bit hash와 bit width 5라면 모든 bit를 소비하는 path 조각의 상한은 ceil(256/5)=52입니다. 실제 조회는 leaf나 bucket에서 더 일찍 끝날 수 있습니다.",
    hamt: "hash(key) · 256 bit",
    amt: "index 42",
    path: "HAMT: q0, q1, … · 최대 52조각",
    verdict: "실제 node I/O 횟수 아님",
  },
  {
    title: "AMT는 정수 index 자체를 낮은 bit부터 나눕니다",
    detail: "42는 8진수 52입니다. Bit width 3이면 첫 갈래는 2, 다음 갈래는 5입니다. 이 path만으로 slot이 실제로 존재한다고 말할 수는 없습니다.",
    hamt: "hash path 유지",
    amt: "42 = (52)₈",
    path: "AMT: 2 → 5",
    verdict: "bitfield 존재 여부 확인 필요",
  },
  {
    title: "같은 값도 hash·bit width·bucket·codec이 다르면 다른 root가 됩니다",
    detail: "‘HAMT’나 ‘AMT’라는 이름만 맞추지 않습니다. Actor bundle과 library generation이 정한 매개변수로 같은 path와 CID가 나오는지 확인합니다.",
    hamt: "hash · width · bucket · codec",
    amt: "width · height · encoding",
    path: "매개변수가 root identity에 포함",
    verdict: "다르면 호환 실패",
  },
] as const;
const TRIE_NOTES = TRIE_SCENES.map((scene, index) => `${index + 1}. ${scene.title} ${scene.detail}`);

export function HamtAmtPathViz() {
  const scenes = useAnimatedScenes(TRIE_SCENES.length, 7200, { loop: false });
  const scene = TRIE_SCENES[scenes.active];

  return <VizFrame
    eyebrow="HAMT key hash · AMT integer index"
    title="HAMT와 AMT는 같은 trie가 아니라, path를 만드는 입력이 다릅니다"
    description="256/5와 index 42 예제를 실제 갈래 선택으로 바꿔 봅니다."
    note="깊이 상한과 실제 node 조회 횟수는 다릅니다."
    documentFlow
    canvasClassName="p-3 sm:p-6"
  >
    <div id={scenes.playbackId} tabIndex={0} onKeyDown={scenes.onKeyDown} className="outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label="HAMT와 AMT 경로 계산 장면 탐색기">
      <div data-viz-live-only className="space-y-4">
        <div data-viz-scene-stage className="space-y-4">
          <div className="border border-border bg-background p-4">
            <p className="text-[10px] font-black text-primary">현재 계산 · {TRIE_LABELS[scenes.active]}</p>
            <h4 className="mt-2 break-keep text-base font-black leading-6 sm:text-lg">{scene.title}</h4>
            <p className="mt-2 break-keep text-xs leading-6 text-muted-foreground">{scene.detail}</p>
          </div>
          <div className="grid gap-px bg-border p-px sm:grid-cols-2">
            <article className="min-w-0 bg-background p-4"><p className="text-[9px] font-bold text-muted-foreground">HAMT 입력</p><p className="mt-2 break-keep font-mono text-xs font-black leading-5">{scene.hamt}</p></article>
            <article className="min-w-0 bg-background p-4"><p className="text-[9px] font-bold text-muted-foreground">AMT 입력</p><p className="mt-2 break-keep font-mono text-xs font-black leading-5">{scene.amt}</p></article>
            <article className="min-w-0 bg-background p-4"><p className="text-[9px] font-bold text-muted-foreground">선택한 path</p><p className="mt-2 break-keep font-mono text-xs font-black leading-5 text-primary">{scene.path}</p></article>
            <article className="min-w-0 bg-background p-4"><p className="text-[9px] font-bold text-muted-foreground">해석 경계</p><p className="mt-2 break-keep text-xs font-black leading-5">{scene.verdict}</p></article>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={TRIE_LABELS} controlLabels={TRIE_LABELS} playLabel="HAMT·AMT path 계산 재생" compact />
      </div>
      <StaticSceneList labels={TRIE_LABELS} notes={TRIE_NOTES} />
    </div>
  </VizFrame>;
}

const SNAPSHOT_LABELS = ["R0", "A", "B", "revert", "merge", "flush"] as const;
const SNAPSHOT_SCENES = [
  { title: "R0에서 f0100의 nonce는 7입니다", detail: "Snapshot layer는 base 하나뿐이며 Actors HAMT와 top-level StateRoot 모두 R0을 가리킵니다.", stack: "base{R0 · nonce 7}", lookup: "7", root: "R0", action: "Snapshot A 생성" },
  { title: "A에서 nonce를 8로 바꾸면 조회값만 먼저 달라집니다", detail: "SetActor는 맨 위 A layer에 수정 record를 씁니다. Top-first lookup은 8을 보지만 R0의 HAMT는 아직 바뀌지 않습니다.", stack: "base{7} → A{8}", lookup: "8", root: "R0", action: "Snapshot B 생성" },
  { title: "B에서 f0100을 삭제하면 맨 위 삭제 표시가 8을 가립니다", detail: "B의 DeleteActor는 아래 A를 지우지 않습니다. Lookup이 B를 먼저 만나 actor-not-found를 반환할 뿐입니다.", stack: "base{7} → A{8} → B{delete}", lookup: "actor-not-found", root: "R0", action: "B 되돌리기" },
  { title: "Revert는 B를 버리고 같은 깊이에 빈 B′를 만듭니다", detail: "A는 그대로 남으므로 조회값은 다시 nonce 8입니다. 아직 layer가 셋이라 바로 Flush할 수는 없습니다.", stack: "base{7} → A{8} → B′{}", lookup: "8", root: "R0", action: "ClearSnapshot × 2" },
  { title: "ClearSnapshot은 맨 위 layer를 바로 아래 layer에 합칩니다", detail: "B′를 A에, 이어서 A를 base에 합치면 surviving update가 base layer 하나에 남습니다.", stack: "base{nonce 8}", lookup: "8", root: "R0", action: "Flush" },
  { title: "Flush가 surviving update를 HAMT에 적용하고 R1을 만듭니다", detail: "새 Actors root A1과 version·Info CID를 StateRoot로 저장합니다. R1은 local state graph의 root이며 chain 채택은 별도입니다.", stack: "base{committed nonce 8}", lookup: "8", root: "R1 = CID(v5,A1,Info)", action: "완료" },
] as const;
const SNAPSHOT_NOTES = SNAPSHOT_SCENES.map((scene, index) => `${index + 1}. ${scene.title} ${scene.detail}`);

export function SnapshotStackViz() {
  const scenes = useAnimatedScenes(SNAPSHOT_SCENES.length, 7600, { loop: false });
  const scene = SNAPSHOT_SCENES[scenes.active];

  return <VizFrame
    eyebrow="base R0 · A{nonce 8} · B{delete}"
    title="조회값, 변경층, state root는 서로 다른 시점에 바뀝니다"
    description="중첩 snapshot을 되돌리고 합친 뒤 Flush하기까지 세 상태를 나눠 봅니다."
    note="Lotus v1.38.3의 Flush는 snapshot layer가 하나가 아니면 오류를 반환합니다."
    documentFlow
    canvasClassName="p-3 sm:p-6"
  >
    <div id={scenes.playbackId} tabIndex={0} onKeyDown={scenes.onKeyDown} className="outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label="Lotus StateTree snapshot stack 장면 탐색기">
      <div data-viz-live-only className="space-y-4">
        <div data-viz-scene-stage className="space-y-4">
          <div className="border border-border bg-background p-4">
            <p className="text-[10px] font-black text-primary">현재 변화 · {SNAPSHOT_LABELS[scenes.active]}</p>
            <h4 className="mt-2 break-keep text-base font-black leading-6 sm:text-lg">{scene.title}</h4>
            <p className="mt-2 break-keep text-xs leading-6 text-muted-foreground">{scene.detail}</p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[["snapshot stack", scene.stack], ["현재 조회값", scene.lookup], ["top-level root", scene.root], ["다음 동작", scene.action]].map(([label, value], index) => <article key={label} className={`min-w-0 border bg-background p-3 ${index === 2 ? "border-primary/60" : "border-border"}`}><p className="text-[9px] font-bold text-muted-foreground">{label}</p><p className="mt-2 break-keep font-mono text-[10px] font-black leading-5 sm:text-xs">{value}</p></article>)}
          </div>
          <div className="flex gap-1" aria-hidden="true">{SNAPSHOT_LABELS.map((label, index) => <span key={label} className={`h-1.5 flex-1 ${index <= scenes.active ? "bg-primary" : "bg-border"}`} />)}</div>
        </div>
        <AnimatedSceneControls {...scenes} labels={SNAPSHOT_LABELS} controlLabels={SNAPSHOT_LABELS} playLabel="Snapshot stack 전이 재생" compact />
      </div>
      <StaticSceneList labels={SNAPSHOT_LABELS} notes={SNAPSHOT_NOTES} />
    </div>
  </VizFrame>;
}

const FAILURE_LABELS = ["version", "schema", "block", "stack", "경계"] as const;
const FAILURE_SCENES = [
  { title: "지원하지 않는 StateTree version이면 root를 열지 않습니다", detail: "VersionForNetwork와 LoadStateTree가 이해하는 generation이 아니면 임의의 최신 형식으로 해석하지 않고 오류로 멈춥니다.", input: "unknown version", check: "version switch", output: "load error" },
  { title: "Code CID와 actor bundle이 맞지 않으면 Head를 decode하지 않습니다", detail: "같은 CBOR bytes라도 다른 actor schema로 읽으면 필드 의미가 달라질 수 있습니다. Code와 활성 bundle이 해석자를 고릅니다.", input: "Head H_A + wrong schema", check: "Code · bundle", output: "decode 거부" },
  { title: "CID가 가리킨 child block이 없으면 완전한 상태라고 말하지 않습니다", detail: "Content address를 알고 있다는 사실과 bytes를 실제로 읽었다는 사실은 다릅니다. Missing block을 빈 collection으로 대신하지 않습니다.", input: "child CID · bytes 없음", check: "blockstore lookup", output: "missing block" },
  { title: "Snapshot layer가 남아 있으면 Flush하지 않습니다", detail: "Lotus v1.38.3은 layer가 하나가 아닐 때 ‘snapshots on the stack’ 오류를 반환합니다. 어느 nested scope가 살아남는지 먼저 확정해야 합니다.", input: "base → A → B′", check: "layers.length === 1", output: "flush error" },
  { title: "R1을 만들었다고 chain이 R1을 채택한 것은 아닙니다", detail: "Flush 결과는 local candidate state root입니다. Tipset execution result, canonical head와 finality는 상위 체인 처리에서 따로 확인합니다.", input: "candidate R1", check: "chain context", output: "local root only" },
] as const;
const FAILURE_NOTES = FAILURE_SCENES.map((scene, index) => `${index + 1}. ${scene.title} ${scene.detail}`);

export function StateFailureBoundaryViz() {
  const scenes = useAnimatedScenes(FAILURE_SCENES.length, 7200, { loop: false });
  const scene = FAILURE_SCENES[scenes.active];

  return <VizFrame
    eyebrow="잘못 읽지 않고 멈추는 다섯 경계"
    title="StateTree는 모르는 상태를 추측하지 않습니다"
    description="Version·schema·block·snapshot stack·chain 채택을 각각 확인합니다."
    note="오류를 반환하는 것과 이미 publish된 chain state를 되돌리는 것은 다른 문제입니다."
    documentFlow
    canvasClassName="p-3 sm:p-6"
  >
    <div id={scenes.playbackId} tabIndex={0} onKeyDown={scenes.onKeyDown} className="outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label="Lotus StateTree 실패 경계 장면 탐색기">
      <div data-viz-live-only className="space-y-4">
        <div data-viz-scene-stage className="space-y-4">
          <div className="border border-border bg-background p-4">
            <p className="text-[10px] font-black text-primary">검사 지점 · {FAILURE_LABELS[scenes.active]}</p>
            <h4 className="mt-2 break-keep text-base font-black leading-6 sm:text-lg">{scene.title}</h4>
            <p className="mt-2 break-keep text-xs leading-6 text-muted-foreground">{scene.detail}</p>
          </div>
          <div className="grid grid-cols-1 items-stretch gap-1 sm:grid-cols-[minmax(0,1fr)_1.5rem_minmax(0,1fr)_1.5rem_minmax(0,1fr)]">
            <div className="min-w-0 border border-border bg-background p-3"><p className="text-[9px] font-bold text-muted-foreground">입력</p><p className="mt-2 break-keep font-mono text-[9px] font-black leading-4 sm:text-xs">{scene.input}</p></div>
            <div className="grid rotate-90 place-items-center text-muted-foreground sm:rotate-0" aria-hidden="true">→</div>
            <div className="min-w-0 border border-foreground/30 bg-background p-3"><p className="text-[9px] font-bold text-muted-foreground">검사</p><p className="mt-2 break-keep font-mono text-[9px] font-black leading-4 sm:text-xs">{scene.check}</p></div>
            <div className="grid rotate-90 place-items-center text-muted-foreground sm:rotate-0" aria-hidden="true">→</div>
            <div className="min-w-0 border border-primary/60 bg-background p-3"><p className="text-[9px] font-bold text-muted-foreground">결과</p><p className="mt-2 break-keep font-mono text-[9px] font-black leading-4 text-primary sm:text-xs">{scene.output}</p></div>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={FAILURE_LABELS} controlLabels={FAILURE_LABELS} playLabel="StateTree 실패 경계 재생" compact />
      </div>
      <StaticSceneList labels={FAILURE_LABELS} notes={FAILURE_NOTES} />
    </div>
  </VizFrame>;
}
