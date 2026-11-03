import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import ResponsiveVizTable from "@/components/viz/ResponsiveVizTable";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const COMMIT_LABELS = ["제안", "첫 참조", "지지 정족수", "인증", "인증서 정족수", "직접 확정"] as const;

const COMMIT_SCENES = [
  { title: "라운드 r에서 지도자 블록 L이 거래를 제안합니다", detail: "L은 작성자 서명과 부모 정족수 검증을 통과한 블록입니다. 아직 다음 검증자의 지지는 없습니다.", proposal: "L · 제안됨", support: "0/3", certificates: "0/3", result: "미결정" },
  { title: "r+1의 A 블록이 같은 자리에서 L을 처음 지지합니다", detail: "부모 참조 하나는 한 작성자의 표입니다. A가 만든 다른 블록이 있어도 A의 투표권은 한 번만 셉니다.", proposal: "L · 제안됨", support: "A = 1/3", certificates: "0/3", result: "미결정" },
  { title: "r+1의 A·B·C가 L을 처음 지지해 첫 정족수를 만듭니다", detail: "n=4, f=1의 설명용 동일 투표권에서는 2f+1=3명이 필요합니다.", proposal: "L · 제안됨", support: "A·B·C = 3/3", certificates: "0/3", result: "L 인증 가능" },
  { title: "지지 정족수 3개가 L을 인증하지만 아직 직접 확정은 아닙니다", detail: "첫 정족수는 같은 자리의 충돌 블록이 또 인증되지 못하게 합니다. 다음 라운드의 확인이 하나 더 필요합니다.", proposal: "L · 인증됨", support: "3/3 · 통과", certificates: "0/3", result: "첫 문턱 통과" },
  { title: "r+2의 A·B·C 블록이 각각 L의 지지 정족수를 인과 과거에 담습니다", detail: "이 세 블록이 L에 대한 서로 다른 작성자의 암묵적 인증서가 됩니다.", proposal: "L · 인증됨", support: "3/3", certificates: "A·B·C = 3/3", result: "직접 확정 가능" },
  { title: "인증서 블록 3개를 확인한 뒤 L을 직접 확정합니다", detail: "제안→지지·인증→인증서 확인이라는 세 메시지 지연을 거쳤습니다. 이제 L의 자리를 commit으로 표시합니다.", proposal: "L · 직접 확정", support: "3/3", certificates: "3/3 · 통과", result: "commit L" },
] as const;

const COMMIT_NOTES = COMMIT_LABELS.map((label, index) => `${label}. ${COMMIT_SCENES[index].title} ${COMMIT_SCENES[index].detail}`);

function EvidenceNode({ label, value, active, complete }: { label: string; value: string; active?: boolean; complete?: boolean }) {
  return (
    <div className={`min-w-0 border p-3 ${active ? "border-primary bg-primary text-primary-foreground" : complete ? "border-primary bg-primary/10" : "border-border bg-background"}`}>
      <p className={`text-[9px] font-black ${active ? "text-primary-foreground/75" : "text-muted-foreground"}`}>{label}</p>
      <p className="mt-1 break-keep text-xs font-black leading-5">{value}</p>
    </div>
  );
}

function FlowArrow() {
  return (
    <div aria-hidden="true" className="flex h-7 items-center justify-center text-lg font-black text-primary sm:h-auto sm:w-8 sm:shrink-0">
      <span className="sm:hidden">↓</span><span className="hidden sm:inline">→</span>
    </div>
  );
}

export function MysticetiCommitTraceViz() {
  const scenes = useAnimatedScenes(COMMIT_SCENES.length, 6500, { loop: false });
  const scene = COMMIT_SCENES[scenes.active];
  const supportCount = Math.min(3, scenes.active === 0 ? 0 : scenes.active === 1 ? 1 : 3);
  const certificateCount = scenes.active >= 4 ? 3 : 0;

  return (
    <VizFrame
      eyebrow="설명용 동일 투표권 · n=4 · f=1 · Q=3"
      title="한 블록은 지지 정족수와 인증서 정족수를 차례로 넘습니다"
      description="제안 L이 직접 확정되기까지 두 문턱을 여섯 장면으로 나눠 봅니다."
      note="실제 구현은 사람 수가 아니라 서로 다른 작성자의 투표권을 합산합니다. 블록 검증을 이미 통과했다는 전제입니다."
      documentFlow
      canvasClassName="p-3 sm:p-6"
    >
      <div id={scenes.playbackId} data-viz-live-only tabIndex={0} role="group" aria-label="Mysticeti 제안 블록이 두 정족수를 거쳐 직접 확정되는 여섯 단계" onKeyDown={scenes.onKeyDown} className="outline-none focus-visible:ring-2 focus-visible:ring-primary">
        <div data-viz-scene-stage className="min-h-[45rem] sm:min-h-[22rem]">
          <p className="text-[10px] font-black text-primary">{String(scenes.active + 1).padStart(2, "0")} · {COMMIT_LABELS[scenes.active]}</p>
          <h4 className="mt-2 min-h-14 break-keep text-base font-black leading-7">{scene.title}</h4>
          <p className="mt-1 min-h-16 text-xs font-semibold leading-6 text-muted-foreground sm:min-h-12">{scene.detail}</p>

          <div className="mt-4 flex flex-col sm:flex-row sm:items-stretch">
            <div className={`flex-1 border-2 p-4 ${scenes.active === 0 ? "border-primary bg-primary text-primary-foreground" : "border-primary bg-primary/10"}`}>
              <p className="text-[9px] font-black opacity-70">라운드 r · 제안</p>
              <p className="mt-2 text-lg font-black">L</p>
              <p className="mt-1 text-[10px] font-semibold">서명 블록 · 거래 포함</p>
            </div>
            <FlowArrow />
            <div className={`flex-[1.35] border-2 p-4 ${scenes.active >= 1 && scenes.active <= 3 ? "border-primary bg-primary/10" : supportCount === 3 ? "border-primary bg-primary/5" : "border-border bg-background"}`}>
              <p className="text-[9px] font-black text-muted-foreground">라운드 r+1 · 첫 지지</p>
              <div className="mt-3 grid grid-cols-4 gap-1">
                {["A", "B", "C", "D"].map((author, index) => <span key={author} className={`border py-2 text-center text-[10px] font-black ${index < supportCount ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground"}`}>{author}</span>)}
              </div>
              <p className="mt-2 text-[10px] font-semibold">{supportCount}/3 · {supportCount === 3 ? "L 인증" : "정족수 대기"}</p>
            </div>
            <FlowArrow />
            <div className={`flex-[1.35] border-2 p-4 ${scenes.active >= 4 ? "border-primary bg-primary/10" : "border-border bg-background"}`}>
              <p className="text-[9px] font-black text-muted-foreground">라운드 r+2 · 인증서 블록</p>
              <div className="mt-3 grid grid-cols-4 gap-1">
                {["A", "B", "C", "D"].map((author, index) => <span key={author} className={`border py-2 text-center text-[10px] font-black ${index < certificateCount ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground"}`}>{author}</span>)}
              </div>
              <p className="mt-2 text-[10px] font-semibold">{certificateCount}/3 · {certificateCount === 3 ? "직접 확정 가능" : "아직 없음"}</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <EvidenceNode label="제안 상태" value={scene.proposal} complete={scenes.active > 0} />
            <EvidenceNode label="첫 지지" value={scene.support} complete={supportCount === 3} />
            <EvidenceNode label="인증서 블록" value={scene.certificates} complete={certificateCount === 3} />
            <EvidenceNode label="현재 결론" value={scene.result} active={scenes.active === 5} />
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={COMMIT_LABELS} controlLabels={COMMIT_LABELS} playLabel="Mysticeti 직접 확정 과정 재생" />
      </div>
      <StaticSceneList labels={COMMIT_LABELS} notes={COMMIT_NOTES} />
    </VizFrame>
  );
}

const DECISION_LABELS = ["L3 미결정", "L4 확정", "앞에서 검사", "장벽 정지", "L3 간접 결정", "출력 재개"] as const;

const DECISION_SCENES = [
  { code: "status[L3] = try_direct_decide(L3)", heading: "L3에는 commit도 skip도 할 만큼 증거가 없어 undecided로 남습니다", detail: "증거가 부족하다는 이유로 임의로 건너뛰지 않습니다.", statuses: ["commit L1", "skip L2", "undecided L3", "대기 L4"], output: "L1 · L2" },
  { code: "status[L4] = try_direct_decide(L4)", heading: "더 새로운 L4는 인증서 정족수를 얻어 직접 commit됩니다", detail: "계산상 L4가 결정됐어도 앞의 L3은 여전히 미결정입니다.", statuses: ["commit L1", "skip L2", "undecided L3", "commit L4"], output: "L1 · L2" },
  { code: "for status in oldest_first(statuses):", heading: "결정 결과를 가장 오래된 L1부터 차례로 검사합니다", detail: "새로운 slot부터 계산한 결과를 외부에 내보낼 때는 오래된 순서로 다시 읽습니다.", statuses: ["commit L1", "skip L2", "undecided L3", "commit L4"], output: "L1 · L2" },
  { code: "if status == UNDECIDED: break", heading: "L3에서 멈추므로 뒤의 commit L4도 아직 외부화하지 않습니다", detail: "L3의 미래 결정이 이미 공개한 순서 앞에 끼어드는 일을 막습니다.", statuses: ["commit L1", "skip L2", "undecided L3", "commit L4 · 보류"], output: "L1 · L2 · 여기서 정지" },
  { code: "status[L3] = decide_from_anchor(L4, L3)", heading: "확정된 anchor L4가 L3의 인증 경로를 품어 L3을 간접 commit합니다", detail: "인증 경로가 없다는 규칙상 증거였다면 L3은 간접 skip이 됩니다.", statuses: ["commit L1", "skip L2", "commit L3", "commit L4"], output: "L1 · L2 · L3 · L4" },
  { code: "emit(linearize_unseen_ancestors(L1..L4))", heading: "연속 결정 구간이 열리면 아직 내보내지 않은 인과 조상만 차례로 출력합니다", detail: "skip L2는 자리를 비우고, commit L1·L3·L4의 sub-DAG는 중복 없이 안정된 순서로 나갑니다.", statuses: ["commit L1", "skip L2", "commit L3", "commit L4"], output: "L1 과거→L1→L3 과거→L3→L4 나머지→L4" },
] as const;

const DECISION_NOTES = DECISION_LABELS.map((label, index) => `${label}. ${DECISION_SCENES[index].heading} ${DECISION_SCENES[index].detail}`);

export function MysticetiDecisionPseudocodeViz() {
  const scenes = useAnimatedScenes(DECISION_SCENES.length, 6800, { loop: false });
  const scene = DECISION_SCENES[scenes.active];
  return (
    <VizFrame
      eyebrow="UniversalCommitter 의사코드 · 상태와 함께 읽기"
      title="뒤에서 commit이 보여도 앞의 undecided 자리에서 출력을 멈춥니다"
      description="L3 미결정과 L4 직접 확정이 함께 있을 때, 연속 결정 구간이 어떻게 열리는지 추적합니다."
      note="함수 이름은 논문과 고정 구현의 역할을 설명하기 위한 의사코드입니다. 실제 구현은 여러 committer와 투표권·ProtocolConfig를 함께 사용합니다."
      documentFlow
      canvasClassName="p-3 sm:p-6"
    >
      <div id={scenes.playbackId} data-viz-live-only tabIndex={0} role="group" aria-label="Mysticeti 미결정 장벽과 간접 결정을 실행하는 의사코드 여섯 단계" onKeyDown={scenes.onKeyDown} className="outline-none focus-visible:ring-2 focus-visible:ring-primary">
        <div data-viz-scene-stage className="min-h-[36rem] space-y-4 sm:min-h-[26rem]">
          <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-6">
            {DECISION_LABELS.map((label, index) => <div key={label} className={`border px-1 py-2 text-center text-[9px] font-black ${index === scenes.active ? "border-primary bg-primary/10" : index < scenes.active ? "border-foreground/30 bg-background" : "border-border bg-background text-muted-foreground"}`}>{index + 1}. {label}</div>)}
          </div>
          <div className="border border-border bg-foreground p-4 text-background">
            <p className="text-[10px] font-black text-primary-foreground/70">실행 중인 의사코드 · {scenes.active + 1}/{DECISION_SCENES.length}</p>
            <code className="mt-2 block break-words font-mono text-[11px] font-bold leading-6 sm:text-sm">{scene.code}</code>
          </div>
          <div className="border border-border bg-background p-4">
            <h4 className="break-keep text-base font-black leading-7">{scene.heading}</h4>
            <p className="mt-2 break-keep text-xs leading-6 text-muted-foreground">{scene.detail}</p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {scene.statuses.map((status, index) => {
              const blocked = status.includes("undecided") || status.includes("보류");
              const committed = status.includes("commit") && !status.includes("보류");
              return <div key={`${index}-${status}`} className={`min-w-0 border p-3 ${blocked ? "border-destructive bg-destructive/10" : committed ? "border-primary bg-primary/10" : "border-border bg-background"}`}><p className="text-[9px] font-bold text-muted-foreground">L{index + 1}</p><p className="mt-1 break-keep text-xs font-black leading-5">{status.replace(` L${index + 1}`, "")}</p></div>;
            })}
          </div>
          <div className="border border-primary bg-primary/10 p-4">
            <p className="text-[9px] font-black text-primary">현재 외부화할 수 있는 순서</p>
            <p className="mt-1 break-keep text-xs font-black leading-6">{scene.output}</p>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={DECISION_LABELS} controlLabels={DECISION_LABELS} playLabel="Mysticeti 결정 절차 재생" compact />
      </div>
      <StaticSceneList labels={DECISION_LABELS} notes={DECISION_NOTES} />
    </VizFrame>
  );
}

const EVIDENCE_ROWS = [
  ["서명 블록 수신", "서명·epoch·round·부모 정족수", "이 블록을 DAG 입력으로 받아도 됨", "지도자 확정"],
  ["지도자 자리 결정", "commit 또는 skip의 정족수 증거", "연속 결정 구간 안에서 순서를 정할 수 있음", "거래 실행 성공"],
  ["sub-DAG 출력", "commit된 지도자와 아직 안 나온 인과 조상", "합의 consumer가 처리할 안정된 블록 순서", "애플리케이션 상태 반영"],
  ["빠른 실행 결과", "거래 표·충돌 배제·실행 결과", "해당 fast path의 실행 응답", "합의 체크포인트 인증"],
  ["체크포인트 인증", "정족수가 확인한 effects/checkpoint", "문서가 정의한 settlement finality 증거", "모든 외부 시스템의 부수 효과"],
] as const;

export function MysticetiEvidenceBoundaryViz() {
  return (
    <VizFrame eyebrow="같은 거래에 여러 완료 상태가 있습니다" title="무엇을 확인했는지에 따라 말할 수 있는 결론이 달라집니다" description="블록 수신부터 합의 순서, 실행, 체크포인트까지 증거를 한 줄로 합치지 않습니다." documentFlow canvasClassName="p-0">
      <ResponsiveVizTable columns={["관찰한 상태", "필요한 증거", "여기까지 말할 수 있음", "아직 말할 수 없음"]} rows={EVIDENCE_ROWS} desktopMinWidthClassName="min-w-[960px]" />
    </VizFrame>
  );
}
