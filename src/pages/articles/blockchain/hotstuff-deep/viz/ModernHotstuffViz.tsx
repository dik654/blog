import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import ResponsiveVizTable from "@/components/viz/ResponsiveVizTable";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const CHAIN_LABELS = ["B10 제안", "QC10 생성", "B11 연결", "B12에서 lock", "B13에서 commit", "결과 실행"] as const;

type BlockState = {
  name: string;
  request: string;
  justify: string;
  status: string;
};

const CHAIN_STATES: readonly {
  action: string;
  blocks: readonly BlockState[];
  evidence: string;
  result: string;
}[] = [
  {
    action: "view 10의 주 노드가 Alice의 송금을 담은 B10을 제안합니다.",
    blocks: [{ name: "B10", request: "Alice → Bob · 10", justify: "부모: B9", status: "제안" }],
    evidence: "아직 QC가 없으므로 B10은 제안일 뿐입니다.",
    result: "실행하지 않음",
  },
  {
    action: "R0·R1·R2가 같은 B10과 view 10에 투표해 QC10을 만듭니다.",
    blocks: [{ name: "B10", request: "Alice → Bob · 10", justify: "QC10 · 3표", status: "인증" }],
    evidence: "n=4, f=1에서는 서로 다른 복제본의 유효한 표 3개가 QC를 만듭니다.",
    result: "QC 하나만으로는 commit 아님",
  },
  {
    action: "view 11의 주 노드는 QC10을 근거로 B10의 자식 B11을 제안합니다.",
    blocks: [
      { name: "B10", request: "Alice → Bob · 10", justify: "QC10", status: "부모" },
      { name: "B11", request: "다음 요청", justify: "justify: QC10", status: "one-chain" },
    ],
    evidence: "B11의 justify QC가 바로 부모 B10을 가리킵니다.",
    result: "B10은 아직 commit 아님",
  },
  {
    action: "B12가 QC11을 들고 B11에 직접 연결되면 two-chain이 생기고 lock이 전진합니다.",
    blocks: [
      { name: "B10", request: "Alice → Bob · 10", justify: "QC10", status: "잠금" },
      { name: "B11", request: "다음 요청", justify: "QC11", status: "직접 부모" },
      { name: "B12", request: "다음 요청", justify: "justify: QC11", status: "two-chain" },
    ],
    evidence: "B12와 B11의 직접 연결을 확인하면 B11의 justify인 QC10으로 B10을 잠급니다.",
    result: "B10을 잠금 · 아직 commit은 아님",
  },
  {
    action: "B13이 QC12를 들고 B12에 직접 연결되면 B10부터 이어진 three-chain이 완성됩니다.",
    blocks: [
      { name: "B10", request: "Alice → Bob · 10", justify: "QC10", status: "commit" },
      { name: "B11", request: "다음 요청", justify: "QC11", status: "연결" },
      { name: "B12", request: "다음 요청", justify: "QC12", status: "연결" },
      { name: "B13", request: "다음 요청", justify: "justify: QC12", status: "three-chain" },
    ],
    evidence: "B11·B12·B13의 justify QC가 각각 바로 앞 블록을 가리켜야 합니다.",
    result: "가장 오래된 B10을 commit",
  },
  {
    action: "복제본은 커밋된 가지의 요청을 순서대로 실행하고 같은 결과를 클라이언트에게 보냅니다.",
    blocks: [
      { name: "B10", request: "Alice → Bob · 10", justify: "상태 전이 완료", status: "실행" },
      { name: "B11", request: "다음 요청", justify: "commit 대기", status: "후속" },
      { name: "B12", request: "다음 요청", justify: "commit 대기", status: "후속" },
      { name: "B13", request: "다음 요청", justify: "head", status: "후속" },
    ],
    evidence: "QC와 블록 본문을 검증한 뒤 같은 순서로 상태 기계를 실행합니다.",
    result: "Bob 잔액 +10 · 일치 응답 f+1개 확인",
  },
];

const CHAIN_NOTES = CHAIN_STATES.map((state) => `${state.action} ${state.result}.`);

const RECOVERY_LABELS = ["주 노드 지연", "view 이동", "최고 QC 수집", "안전한 제안", "표 수집", "처리 재개"] as const;

const RECOVERY_STATES = [
  {
    title: "view 13의 주 노드가 제안을 보내지 않습니다.",
    pacemaker: "각 복제본의 타이머가 끝나 다음 view로 이동합니다.",
    safety: "타이머가 끝나도 lockedQC와 highestQC는 지우지 않습니다.",
  },
  {
    title: "정상 복제본이 view 14를 시작합니다.",
    pacemaker: "NEW-VIEW에 자신이 가진 가장 높은 QC를 담아 새 주 노드에게 보냅니다.",
    safety: "서로 다른 view의 표를 한 QC로 합치지 않습니다.",
  },
  {
    title: "새 주 노드가 NEW-VIEW 3개를 모읍니다.",
    pacemaker: "n=4, f=1에서 먼저 도착한 유효한 3개 중 가장 높은 QC12를 고릅니다.",
    safety: "QC의 서명, view, 블록 해시와 조상 관계를 다시 검증합니다.",
  },
  {
    title: "새 주 노드는 QC12가 인증한 B12의 자식 B13'을 제안합니다.",
    pacemaker: "정상 복제본이 같은 view로 모이면 실제 메시지 지연 속도로 진행할 수 있습니다.",
    safety: "복제본은 제안이 lock을 연장하거나 더 높은 QC로 정당화됐을 때만 투표합니다.",
  },
  {
    title: "복제본 3대의 표가 view 14의 새 QC를 만듭니다.",
    pacemaker: "주 노드가 표를 모아 하나의 QC로 만들어 다시 배포합니다.",
    safety: "주 노드 한 곳이 표를 모으지만 표의 발신자와 도메인은 그대로 검증합니다.",
  },
  {
    title: "QC 사슬이 다시 자라면서 밀린 요청이 처리됩니다.",
    pacemaker: "GST 뒤 정상 주 노드와 안정된 통신이 이어지면 프로토콜이 전진합니다.",
    safety: "GST 전 처리가 멈출 수는 있어도 충돌한 블록을 함께 commit해서는 안 됩니다.",
  },
] as const;

const RECOVERY_NOTES = RECOVERY_STATES.map((state) => `${state.pacemaker} ${state.safety}`);

function BlockCard({ block, active }: { block: BlockState; active: boolean }) {
  return (
    <div className={`min-w-0 border p-3 ${active ? "border-primary bg-primary/5" : "border-border bg-background"}`}>
      <div className="flex items-center justify-between gap-2">
        <strong className="text-sm">{block.name}</strong>
        <span className={`text-[10px] font-black ${active ? "text-primary" : "text-muted-foreground"}`}>{block.status}</span>
      </div>
      <p className="mt-2 break-keep text-xs font-bold leading-5">{block.request}</p>
      <p className="mt-1 break-keep text-[11px] leading-5 text-muted-foreground">{block.justify}</p>
    </div>
  );
}

export function HotstuffChainViz() {
  const scenes = useAnimatedScenes(CHAIN_LABELS.length, 5600, { loop: false });
  const state = CHAIN_STATES[scenes.active];
  return (
    <VizFrame
      eyebrow="Chained HotStuff · n=4, f=1"
      title="B10은 세 개의 후속 연결을 확인한 뒤에야 커밋됩니다"
      description="QC 하나가 생기는 순간과 lock이 이동하는 순간, 가장 오래된 블록이 commit되는 순간을 나눠 봅니다."
      note="OSDI 1999 PBFT의 Alice 송금 사례를 그대로 이어 사용한 설명용 흐름입니다."
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        tabIndex={0}
        role="group"
        aria-label="HotStuff QC 사슬의 여섯 단계"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div data-viz-scene-stage className="min-h-[43rem] sm:min-h-[24rem]">
          <p className="min-h-12 border-y border-border py-3 text-sm font-bold leading-6">{state.action}</p>
          <div className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-4">
            {state.blocks.map((block, index) => (
              <BlockCard key={block.name} block={block} active={index === state.blocks.length - 1 || block.status === "commit"} />
            ))}
          </div>
          <div className="mt-3 grid gap-px bg-border p-px sm:grid-cols-[8rem_minmax(0,1fr)]">
            <strong className="bg-background p-3 text-[10px] text-muted-foreground">현재 증거</strong>
            <p className="min-w-0 break-keep bg-background p-3 text-xs font-bold leading-5">{state.evidence}</p>
            <strong className="bg-background p-3 text-[10px] text-muted-foreground">지금 가능한 일</strong>
            <p className="min-w-0 break-keep bg-background p-3 text-xs font-bold leading-5">{state.result}</p>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={CHAIN_LABELS} controlLabels={CHAIN_LABELS} playLabel="HotStuff 사슬 재생" />
      </div>
      <StaticSceneList labels={CHAIN_LABELS} notes={CHAIN_NOTES} />
    </VizFrame>
  );
}

export function HotstuffRecoveryViz() {
  const scenes = useAnimatedScenes(RECOVERY_LABELS.length, 6000, { loop: false });
  const state = RECOVERY_STATES[scenes.active];
  return (
    <VizFrame
      eyebrow="주 노드 교체 · 안전성과 진행 분리"
      title="Pacemaker는 view를 옮기고, QC와 lock은 안전한 가지를 고릅니다"
      description="타임아웃 자체가 lock을 해제하는 것이 아닙니다. 새 주 노드는 NEW-VIEW에서 가장 높은 QC를 골라 그 가지를 연장합니다."
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        tabIndex={0}
        role="group"
        aria-label="HotStuff 주 노드 교체의 여섯 단계"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div data-viz-scene-stage className="min-h-[30rem] border-y border-border py-4 sm:min-h-[18rem]">
          <p className="text-[10px] font-black text-primary">{String(scenes.active + 1).padStart(2, "0")} · {RECOVERY_LABELS[scenes.active]}</p>
          <h4 className="mt-2 min-h-14 break-keep text-base font-bold leading-7">{state.title}</h4>
          <div className="mt-3 grid gap-px bg-border p-px sm:grid-cols-2">
            <div className="bg-background p-3">
              <strong className="text-[10px] text-muted-foreground">진행을 다시 여는 동작</strong>
              <p className="mt-2 break-keep text-xs font-bold leading-5">{state.pacemaker}</p>
            </div>
            <div className="bg-background p-3">
              <strong className="text-[10px] text-muted-foreground">끝까지 지킬 조건</strong>
              <p className="mt-2 break-keep text-xs font-bold leading-5">{state.safety}</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-6 gap-1" aria-hidden="true">
            {RECOVERY_LABELS.map((label, index) => (
              <div key={label} className={`h-2 ${index <= scenes.active ? "bg-primary" : "bg-border"}`} />
            ))}
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={RECOVERY_LABELS} controlLabels={RECOVERY_LABELS} playLabel="HotStuff 복구 재생" />
      </div>
      <StaticSceneList labels={RECOVERY_LABELS} notes={RECOVERY_NOTES} />
    </VizFrame>
  );
}

const SAFE_VOTE_LABELS = ["QC 검증", "잠금 가지 연장", "낮은 QC의 갈림길", "높은 QC의 갈림길"] as const;

const SAFE_VOTE_STATES = [
  {
    code: "verify(proposal.justifyQC)",
    proposal: "제안 B12 · justify QC11 · lockedQC11",
    extends: "아직 계산하지 않음",
    higher: "아직 계산하지 않음",
    verdict: "QC의 위원회·view·블록 해시·결합 서명이 유효해야 다음 검사를 합니다.",
  },
  {
    code: "extendsLockedBranch = isDescendant(B12, lockedBlock)",
    proposal: "B12의 부모가 잠긴 B11",
    extends: "참 · 같은 가지를 직접 연장",
    higher: "검사하지 않아도 됨",
    verdict: "안전성 조건을 만족하므로 B12에 투표할 수 있습니다.",
  },
  {
    code: "extends || justifyQC.view > lockedQC.view",
    proposal: "갈라진 C12 · justify QC10 · lockedQC11",
    extends: "거짓 · B11의 자손이 아님",
    higher: "거짓 · view 10 > view 11이 아님",
    verdict: "두 조건이 모두 거짓이므로 C12에 투표하지 않습니다.",
  },
  {
    code: "verify(QC12) && (false || 12 > 11)",
    proposal: "갈라진 C13 · 유효한 justify QC12 · lockedQC11",
    extends: "거짓 · 기존 가지와 충돌",
    higher: "참 · 유효한 QC view 12가 lock view 11보다 높음",
    verdict: "더 높은 정당화 증거가 있으므로 C13을 검토하고 투표할 수 있습니다.",
  },
] as const;

const SAFE_VOTE_NOTES = SAFE_VOTE_STATES.map((state) => `${state.proposal}. ${state.verdict}`);

export function HotstuffSafeVoteViz() {
  const scenes = useAnimatedScenes(SAFE_VOTE_LABELS.length, 6800, { loop: false });
  const state = SAFE_VOTE_STATES[scenes.active];

  return (
    <VizFrame
      eyebrow="HotStuff §4.1 · safeNode 판정"
      title="갈라진 블록은 더 높은 유효한 QC가 있을 때만 다시 검토합니다"
      description="의사코드의 각 조건을 같은 가지, 낮은 QC의 갈림길, 높은 QC의 갈림길에 차례로 대입합니다."
      note="view 숫자만 높다고 통과하지 않습니다. justify QC 자체의 서명과 블록 조상 관계를 먼저 검증합니다."
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div id={scenes.playbackId} data-viz-live-only tabIndex={0} role="group" aria-label="HotStuff 안전한 투표 판정 네 단계" onKeyDown={scenes.onKeyDown} className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
        <div data-viz-scene-stage className="min-h-[34rem] border-y border-border py-4 sm:min-h-[22rem]">
          <p className="text-[10px] font-black text-primary">{String(scenes.active + 1).padStart(2, "0")} · {SAFE_VOTE_LABELS[scenes.active]}</p>
          <h4 className="mt-2 break-keep text-base font-bold leading-7">{state.proposal}</h4>
          <code className="mt-3 block whitespace-pre-wrap break-words border border-border bg-muted/40 p-3 text-xs font-bold leading-6">{state.code}</code>
          <div className="mt-3 grid gap-px bg-border p-px sm:grid-cols-[8rem_minmax(0,1fr)]">
            <strong className="bg-background p-3 text-[10px] text-muted-foreground">잠금 가지 연장</strong>
            <p className="min-w-0 break-keep bg-background p-3 text-xs font-bold leading-5">{state.extends}</p>
            <strong className="bg-background p-3 text-[10px] text-muted-foreground">더 높은 QC</strong>
            <p className="min-w-0 break-keep bg-background p-3 text-xs font-bold leading-5">{state.higher}</p>
            <strong className="bg-background p-3 text-[10px] text-muted-foreground">판정</strong>
            <p className="min-w-0 break-keep bg-background p-3 text-xs font-bold leading-5">{state.verdict}</p>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={SAFE_VOTE_LABELS} controlLabels={SAFE_VOTE_LABELS} playLabel="HotStuff 안전 투표 판정 재생" />
      </div>
      <StaticSceneList labels={SAFE_VOTE_LABELS} notes={SAFE_VOTE_NOTES} />
    </VizFrame>
  );
}

const FAILURE_ROWS = [
  ["더 높은 view 숫자만 있음", "유효한 QC 서명과 블록 조상 관계가 없음", "투표하지 않음"],
  ["B13이 B11을 건너뜀", "QC가 바로 앞 부모를 가리키지 않음", "three-chain으로 세지 않음"],
  ["주 노드 연속 장애", "GST 전 view만 계속 바뀜", "충돌 commit은 0 · 처리는 멈출 수 있음"],
  ["재시작 뒤 블록 본문 없음", "QC만 있고 payload와 부모 블록이 없음", "상태 동기화 전 실행 금지"],
];

export function HotstuffFailureTable() {
  return (
    <ResponsiveVizTable
      columns={["장애 사례", "관찰할 상태", "안전한 처리"]}
      rows={FAILURE_ROWS}
      desktopMinWidthClassName="min-w-[720px]"
    />
  );
}
