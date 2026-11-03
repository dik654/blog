import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const TRACE_LABELS = ["업로드", "등록", "배정", "계산", "제출", "포함", "확인", "전달"] as const;
const TRACE_SCENES = [
  {
    owner: "사용자 → Curio 시장 API",
    title: "파일 D7과 원하는 보관 조건을 보냅니다",
    detail: "받았다는 응답은 업로드 접수 증거입니다. 아직 sector도, 온체인 보관 상태도 없습니다.",
    db: "piece D7 · uploaded",
    storage: "piece bytes D7",
    chain: "변화 없음",
    receipt: "upload receipt",
  },
  {
    owner: "Curio · HarmonyDB",
    title: "Piece와 sector 42의 파이프라인 상태를 기록합니다",
    detail: "업로드 상태와 작업 상태는 DB가 소유합니다. task row는 아직 owner_id가 없는 대기 상태입니다.",
    db: "task 701 · owner_id=NULL",
    storage: "piece D7 · sector 42 예정",
    chain: "변화 없음",
    receipt: "task id 701",
  },
  {
    owner: "Curio · HarmonyTask",
    title: "실행 가능한 노드 하나가 task 701을 가져갑니다",
    detail: "자원·CanAccept 검사를 통과한 뒤 SQL claim이 owner_id를 한 노드에만 배정합니다.",
    db: "task 701 · owner_id=27",
    storage: "scratch 경로 예약",
    chain: "변화 없음",
    receipt: "claim owner 27",
  },
  {
    owner: "Curio worker · 저장 경로",
    title: "작업 단계를 수행하고 commitment와 proof를 만듭니다",
    detail: "계산 결과가 생겨도 체인에 포함된 것은 아닙니다. 외부 효과 전에는 stillOwned를 다시 확인합니다.",
    db: "after_tree_r=true",
    storage: "CommD · CommR · PoRep",
    chain: "제출 전",
    receipt: "artifact digests",
  },
  {
    owner: "Curio message task → Lotus RPC",
    title: "sector 42의 메시지를 현재 체인 문맥에 제출합니다",
    detail: "메시지 CID는 제출 식별자입니다. Lotus가 요청을 받은 사실과 canonical chain 포함은 다릅니다.",
    db: "task_commit_msg=884",
    storage: "sector artifact 보존",
    chain: "message CID M42",
    receipt: "submit receipt M42",
  },
  {
    owner: "Lotus node · ChainStore / StateManager",
    title: "블록을 검증·실행해 메시지 결과를 체인 상태에 반영합니다",
    detail: "Lotus는 검증된 tipset과 state·receipt root를 소유합니다. Curio의 task row를 대신 소유하지 않습니다.",
    db: "message wait · included",
    storage: "sector 42 유지",
    chain: "tipset T · receipt R42",
    receipt: "inclusion evidence",
  },
  {
    owner: "Curio chain watcher",
    title: "체인 영수증과 actor state를 읽어 로컬 파이프라인을 전진시킵니다",
    detail: "Reorg 가능 구간과 최종 확인 정책을 구분합니다. task 성공만으로 actor state를 추측하지 않습니다.",
    db: "after_commit_msg_success=true",
    storage: "sealed sector 42",
    chain: "actor state · active",
    receipt: "chain confirmation",
  },
  {
    owner: "Curio retrieval 경로 → 사용자",
    title: "인덱스와 저장 경로에서 파일을 찾아 bytes를 돌려줍니다",
    detail: "보관 증명과 실제 전달은 별도 서비스 상태입니다. 받은 bytes의 CID를 확인해야 사용자 작업이 끝납니다.",
    db: "retrieval request · complete",
    storage: "piece D7 read",
    chain: "활성 상태 참조",
    receipt: "verified bytes",
  },
] as const;

const TRACE_NOTES = TRACE_SCENES.map((scene, index) => `${TRACE_LABELS[index]}. ${scene.title} ${scene.detail} 현재 증거는 ${scene.receipt}입니다.`);

export function LotusSuiteTraceViz() {
  const scenes = useAnimatedScenes(TRACE_SCENES.length, 8200, { loop: false });
  const active = scenes.active;
  const scene = TRACE_SCENES[active];

  return <VizFrame
    eyebrow="파일 D7 · sector 42 · message M42"
    title="사용자 파일이 로컬 작업과 체인 영수증을 거쳐 다시 전달되는 길을 따라갑니다"
    description="장면을 넘기면 현재 소유자, 세 상태 원장과 완료 증거가 함께 바뀝니다."
    note="D7·42·701·M42는 상태 경계를 설명하기 위한 식별자입니다. 처리 시간과 성공률은 측정값이 아닙니다."
    documentFlow
    canvasClassName="p-3 sm:p-6"
  >
    <div id={scenes.playbackId} tabIndex={0} onKeyDown={scenes.onKeyDown} className="outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label="Lotus와 Curio의 파일 보관 흐름 장면 탐색기">
      <div data-viz-live-only className="space-y-4">
        <div data-viz-scene-stage className="min-h-[47rem] space-y-4 sm:min-h-[26rem]">
          <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-8">
            {TRACE_LABELS.map((label, index) => <div key={label} className={`border px-1 py-2 text-center text-[9px] font-black transition-colors duration-300 ${index === active ? "border-primary bg-primary/10" : index < active ? "border-foreground/30 bg-background" : "border-border bg-background text-muted-foreground"}`}>{index + 1}. {label}</div>)}
          </div>

          <div className="grid gap-px bg-border p-px lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
            <div className="bg-background p-4 sm:p-5">
              <p className="text-[10px] font-black text-primary">현재 소유자 · {scene.owner}</p>
              <h4 className="mt-2 break-keep text-base font-black leading-6 sm:text-lg">{scene.title}</h4>
              <p className="mt-2 break-keep text-xs leading-6 text-muted-foreground">{scene.detail}</p>
              <div className="mt-5 h-1.5 bg-border/70" aria-label={`전체 진행 ${active + 1}/${TRACE_SCENES.length}`}>
                <div className="h-full bg-primary transition-[width] duration-500" style={{ width: `${((active + 1) / TRACE_SCENES.length) * 100}%` }} />
              </div>
            </div>
            <div className="bg-background p-4 sm:p-5">
              <p className="text-[9px] font-bold text-muted-foreground">현재 단계의 완료 증거</p>
              <p className="mt-2 border-l-2 border-primary pl-3 font-mono text-sm font-black">{scene.receipt}</p>
              <p className="mt-4 text-[9px] leading-5 text-muted-foreground">이 증거는 다음 단계의 입력일 뿐, 뒤 단계의 완료를 대신하지 않습니다.</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["HarmonyDB", "작업·owner·retry", scene.db],
              ["저장 경로", "piece·sector 산출물", scene.storage],
              ["Lotus 체인", "tipset·state·receipt", scene.chain],
            ].map(([name, role, value], index) => <div key={name} className={`relative min-w-0 border bg-background p-4 ${value === "변화 없음" || value === "제출 전" ? "border-border" : "border-primary/50"}`}>
              <span className={`absolute -left-1 top-5 size-2 ${index <= Math.min(active, 2) ? "bg-primary" : "bg-border"}`} />
              <p className="text-[9px] font-bold text-muted-foreground">{role}</p>
              <h5 className="mt-1 text-xs font-black">{name}</h5>
              <p className="mt-3 break-words font-mono text-[10px] leading-5">{value}</p>
            </div>)}
          </div>
        </div>

        <AnimatedSceneControls {...scenes} labels={TRACE_LABELS} controlLabels={TRACE_LABELS} playLabel="파일 경로 재생" compact />
      </div>
      <StaticSceneList labels={TRACE_LABELS} notes={TRACE_NOTES} />
    </div>
  </VizFrame>;
}

const OWNER_ROWS = [
  ["체인 노드", "Lotus", "ChainStore · StateManager", "검증된 tipset · state/receipt root", "Filecoin network"],
  ["작업 제어", "Curio HarmonyTask", "HarmonyDB", "task · owner_id · retry · history", "Curio cluster"],
  ["계산·보관", "Curio task node", "piece·scratch·sector 경로", "CommD · CommR · proof · bytes", "storage host"],
  ["서비스 결과", "시장·retrieval 경로", "요청·인덱스·전달 기록", "업로드·검색·검증된 bytes", "client boundary"],
] as const;

export function LotusOwnershipMapViz() {
  return <VizFrame
    eyebrow="서비스 관점 ↔ 상태·자원 관점"
    title="같은 요청을 처리해도 각 상태의 authoritative writer는 하나씩 다릅니다"
    description="프로세스 이름, 영속 상태, 그 상태가 증명하는 사실을 한 줄씩 맞춥니다."
    note="실제 배치는 한 장비에 합치거나 여러 장비로 나눌 수 있습니다. 배치가 바뀌어도 상태 소유권과 완료 증거는 분리해 기록해야 합니다."
    documentFlow
    canvasClassName="p-3 sm:p-6"
  >
    <div className="space-y-3">
      {OWNER_ROWS.map(([view, process, state, evidence, boundary], index) => <div key={view} className="grid min-w-0 gap-px bg-border p-px sm:grid-cols-[5.5rem_7.5rem_minmax(0,1fr)] lg:grid-cols-[6rem_8rem_minmax(0,1fr)_minmax(0,1fr)_7rem]">
        <div className="bg-background p-3"><p className="text-[9px] text-muted-foreground">관점 {index + 1}</p><strong className="mt-1 block text-xs">{view}</strong></div>
        <div className="bg-background p-3"><p className="text-[9px] text-muted-foreground">실행 주체</p><strong className="mt-1 block break-keep text-xs">{process}</strong></div>
        <div className="bg-background p-3"><p className="text-[9px] text-muted-foreground">영속 상태</p><p className="mt-1 break-keep text-xs font-semibold">{state}</p></div>
        <div className="hidden bg-background p-3 lg:block"><p className="text-[9px] text-muted-foreground">확인 가능한 사실</p><p className="mt-1 break-keep text-xs font-semibold">{evidence}</p></div>
        <div className="hidden bg-background p-3 text-right lg:block"><p className="text-[9px] text-muted-foreground">장애 경계</p><p className="mt-1 text-xs font-semibold">{boundary}</p></div>
        <div className="bg-background p-3 sm:col-span-3 lg:hidden"><p className="text-[9px] text-muted-foreground">확인 가능한 사실 · 장애 경계</p><p className="mt-1 break-keep text-xs font-semibold">{evidence} · {boundary}</p></div>
      </div>)}
    </div>
  </VizFrame>;
}

const TASK_LABELS = ["대기", "검사", "claim", "실행", "기록", "재개"] as const;
const TASK_SCENES = [
  { title: "작업은 owner가 없는 DB 행으로 시작합니다", row: "id=701 · owner_id=NULL · retries=0", machine: "아직 없음", result: "pending", detail: "Adder는 작업을 실행하지 않고 HarmonyDB에 등록합니다." },
  { title: "각 노드는 실행 가능 여부를 계산합니다", row: "id=701 · owner_id=NULL · retries=0", machine: "CPU·RAM·GPU·storage · CanAccept", result: "eligible nodes", detail: "자원이 부족하거나 task별 CanAccept가 거절하면 행은 대기에 남습니다." },
  { title: "경쟁한 노드 중 하나만 owner가 됩니다", row: "id=701 · owner_id=27 · retries=0", machine: "node 27", result: "claimed", detail: "FOR UPDATE SKIP LOCKED와 owner_id 갱신이 한 트랜잭션에서 일어납니다." },
  { title: "작업은 현재 소유권을 확인하며 외부 효과를 만듭니다", row: "id=701 · owner_id=27 · retries=0", machine: "node 27 · Do()", result: "running", detail: "stillOwned가 false라면 single-writer 효과를 계속 만들면 안 됩니다." },
  { title: "성공과 실패는 서로 다른 DB 전이가 됩니다", row: "성공: row 삭제 / 실패: owner_id=NULL · retries=1", machine: "history에 실행자·시간·결과", result: "complete or retry", detail: "성공은 active table에서 지우고 history에 남깁니다. 재시도 가능한 실패는 소유권을 풉니다." },
  { title: "프로세스가 다시 떠도 DB 상태에서 이어갑니다", row: "미완료 row 또는 history receipt", machine: "recovery path", result: "resume from evidence", detail: "재시작이 계산 결과를 자동으로 증명하지는 않습니다. task별 artifact와 chain receipt를 다시 대조합니다." },
] as const;
const TASK_NOTES = TASK_SCENES.map((scene, index) => `${TASK_LABELS[index]}. ${scene.title} ${scene.detail} DB 상태는 ${scene.row}입니다.`);

export function CurioTaskLifecycleViz() {
  const scenes = useAnimatedScenes(TASK_SCENES.length, 7600, { loop: false });
  const active = scenes.active;
  const scene = TASK_SCENES[active];

  return <VizFrame
    eyebrow="HarmonyTask · task 701"
    title="대기 행 하나가 한 노드에 배정되고 성공·재시도 기록으로 바뀝니다"
    description="장식용 큐가 아니라 실제 owner_id와 history 상태 전이를 따라갑니다."
    note="상태 전이는 Curio v1.29.0의 HarmonyTask 코드에서 확인했습니다. 개별 sealing task의 산출물 검증은 해당 task 구현이 추가로 책임집니다."
    documentFlow
    canvasClassName="p-3 sm:p-6"
  >
    <div id={scenes.playbackId} tabIndex={0} onKeyDown={scenes.onKeyDown} className="outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label="Curio HarmonyTask 상태 전이 장면 탐색기">
      <div data-viz-live-only className="space-y-4">
        <div data-viz-scene-stage className="min-h-[28rem] space-y-4 sm:min-h-[19rem]">
          <div className="flex items-center gap-1">
            {TASK_LABELS.map((label, index) => <div key={label} className="flex min-w-0 flex-1 items-center gap-1">
              <span className={`flex size-7 shrink-0 items-center justify-center rounded-full border text-[9px] font-black ${index === active ? "border-primary bg-primary text-primary-foreground" : index < active ? "border-foreground/40 bg-background" : "border-border bg-background text-muted-foreground"}`}>{index + 1}</span>
              {index < TASK_LABELS.length - 1 && <span className={`h-px min-w-0 flex-1 ${index < active ? "bg-primary" : "bg-border"}`} />}
            </div>)}
          </div>

          <div className="border border-border bg-background p-4 sm:p-5">
            <p className="text-[10px] font-black text-primary">{active + 1}. {TASK_LABELS[active]}</p>
            <h4 className="mt-2 break-keep text-base font-black leading-6">{scene.title}</h4>
            <p className="mt-2 break-keep text-xs leading-6 text-muted-foreground">{scene.detail}</p>
            <div className="mt-4 grid gap-px bg-border p-px sm:grid-cols-3">
              <div className="bg-background p-3"><p className="text-[9px] text-muted-foreground">harmony_task</p><p className="mt-1 break-words font-mono text-[10px] font-bold leading-5">{scene.row}</p></div>
              <div className="bg-background p-3"><p className="text-[9px] text-muted-foreground">실행 주체·조건</p><p className="mt-1 break-keep text-[10px] font-bold leading-5">{scene.machine}</p></div>
              <div className="bg-background p-3"><p className="text-[9px] text-muted-foreground">현재 판정</p><p className="mt-1 font-mono text-[10px] font-black leading-5 text-primary">{scene.result}</p></div>
            </div>
          </div>
        </div>

        <AnimatedSceneControls {...scenes} labels={TASK_LABELS} controlLabels={TASK_LABELS} playLabel="작업 상태 재생" compact />
      </div>
      <StaticSceneList labels={TASK_LABELS} notes={TASK_NOTES} />
    </div>
  </VizFrame>;
}

const COMPLETION_STEPS = [
  ["01", "업로드", "Piece bytes와 CID를 받음", "sector 생성 아님"],
  ["02", "계산", "CommD·CommR·proof 산출물", "체인 포함 아님"],
  ["03", "제출", "message CID와 전송 결과", "actor state 변경 아님"],
  ["04", "체인", "tipset receipt와 actor state", "retrieval 성공 아님"],
  ["05", "전달", "사용자가 받은 bytes의 CID 확인", "서비스 완료"],
] as const;

export function LotusCompletionBoundaryViz() {
  return <VizFrame
    eyebrow="다섯 완료 상태"
    title="앞 단계의 성공을 뒤 단계의 성공으로 바꾸어 부르지 않습니다"
    description="각 상태는 다음 단계가 소비할 증거를 만들지만, 나중 상태를 대신하지 않습니다."
    documentFlow
    canvasClassName="p-3 sm:p-6"
  >
    <div className="relative grid gap-3">
      <div className="absolute bottom-5 left-[1.1rem] top-5 w-px bg-border sm:left-[2rem]" aria-hidden="true" />
      {COMPLETION_STEPS.map(([n, title, proof, boundary], index) => <div key={n} className="relative grid grid-cols-[2.25rem_minmax(0,1fr)] gap-3 sm:grid-cols-[4rem_6rem_minmax(0,1fr)_minmax(0,0.8fr)] sm:items-center">
        <div className={`z-10 flex size-9 items-center justify-center rounded-full border font-mono text-[9px] font-black sm:mx-auto ${index === COMPLETION_STEPS.length - 1 ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background"}`}>{n}</div>
        <strong className="hidden text-xs sm:block">{title}</strong>
        <div className="min-w-0 border border-border bg-background p-3"><p className="text-[9px] text-muted-foreground sm:hidden">{title}</p><p className="mt-1 break-keep text-xs font-semibold">{proof}</p></div>
        <div className="col-start-2 -mt-2 border-l-2 border-destructive/50 pl-3 text-[10px] font-semibold leading-5 text-muted-foreground sm:col-start-auto sm:mt-0">≠ {boundary}</div>
      </div>)}
    </div>
  </VizFrame>;
}

const RELEASE_ROWS = [
  ["Lotus", "v1.38.3 · 29d72bd", "chain DB·RPC·F3·network profile", "이전 DB 호환 binary"],
  ["Curio", "v1.29.0 · 409a2ab", "HarmonyDB schema·task code·market path", "migration 전 snapshot·이전 app"],
  ["Proof", "FFI·parameters·sector profile", "CommD·CommR·proof 호환", "이전 검증된 parameter bundle"],
] as const;

export function LotusReleaseBundleViz() {
  return <VizFrame
    eyebrow="2026-11-01 기준 고정 조합"
    title="프로그램 하나가 아니라 서로 맞물린 버전 묶음을 canary로 검증합니다"
    description="각 행은 바꿀 상태, 실패했을 때 되돌릴 대상과 함께 기록합니다."
    note="Lotus v1.38.3과 Curio v1.29.0의 기능 존재는 공식 릴리스로 확인했습니다. 이 조합의 처리량·가용성은 이 글에서 측정하지 않았습니다."
    documentFlow
    canvasClassName="p-3 sm:p-6"
  >
    <div className="grid gap-px bg-border p-px">
      {RELEASE_ROWS.map(([component, version, state, rollback]) => <div key={component} className="grid min-w-0 gap-px bg-border sm:grid-cols-[5rem_10rem_minmax(0,1fr)_minmax(0,1fr)]">
        <div className="bg-background p-3"><strong className="text-xs">{component}</strong></div>
        <div className="bg-background p-3"><p className="break-words font-mono text-[10px] font-bold">{version}</p></div>
        <div className="bg-background p-3"><p className="text-[9px] text-muted-foreground">변경되는 상태</p><p className="mt-1 break-keep text-[10px] font-semibold leading-5">{state}</p></div>
        <div className="bg-background p-3"><p className="text-[9px] text-muted-foreground">되돌릴 대상</p><p className="mt-1 break-keep text-[10px] font-semibold leading-5">{rollback}</p></div>
      </div>)}
    </div>
  </VizFrame>;
}

export default LotusSuiteTraceViz;
