import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import ResponsiveVizTable from "@/components/viz/ResponsiveVizTable";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const TRACE_LABELS = ["배치 생성", "바이트 저장", "헤더 생성", "헤더 투표", "인증서 생성", "누락 복구"] as const;

const TRACE_STATES = [
  {
    title: "Worker A가 거래 T1을 배치 d7로 묶고 해시를 계산합니다.",
    action: "d7의 원문 바이트와 digest가 A의 worker 저장소에 생깁니다.",
    evidence: "A가 d7을 받았다는 로컬 기록뿐입니다.",
    pending: "다른 검증자가 d7을 보관한다는 증거는 아직 없습니다.",
  },
  {
    title: "Worker A가 d7 바이트를 같은 번호의 동료 workers에게 보냅니다.",
    action: "A·B·C의 저장 확인 power가 정족수에 닿으면 A의 primary에 (d7, worker 0)을 알립니다.",
    evidence: "배치 전파와 저장 확인이 끝났습니다.",
    pending: "Primary header와 availability certificate는 아직 없습니다.",
  },
  {
    title: "Primary A가 d7의 위치와 직전 라운드 인증서를 헤더 H8에 넣습니다.",
    action: "H8은 epoch·round·author·payload {(d7, w0)}·parents를 하나의 digest로 묶습니다.",
    evidence: "A가 서명한 헤더가 생겼습니다.",
    pending: "작성자 서명 하나는 정족수 인증서가 아닙니다.",
  },
  {
    title: "다른 primaries가 부모 인증서와 d7의 로컬 보관 여부를 확인합니다.",
    action: "검증을 통과한 B와 C는 같은 H8 digest에 서명한 vote를 A에게 보냅니다.",
    evidence: "A·B·C의 서로 다른 유효 vote가 모였습니다.",
    pending: "같은 author·round의 다른 헤더에는 두 번째 vote를 보내면 안 됩니다.",
  },
  {
    title: "Primary A가 정족수 vote를 집계해 Cert(H8)을 만듭니다.",
    action: "인증서는 H8과 signer bitmap·집계 서명을 담아 DAG가 참조할 작은 vertex가 됩니다.",
    evidence: "정상 검증자 f+1명 이상이 H8과 d7을 확인했다는 회수 근거가 생겼습니다.",
    pending: "인증서는 d7의 전체 순서나 실행 성공을 정하지 않습니다.",
  },
  {
    title: "검증자 D가 Cert(H8)은 받았지만 d7 바이트가 없다고 가정합니다.",
    action: "D는 인증서와 parents를 검증하고 (d7, worker 0) 경로에서 바이트를 받아 hash를 다시 계산합니다.",
    evidence: "digest가 일치하면 d7을 ordering 계층에 넘길 수 있습니다.",
    pending: "바이트를 끝내 찾지 못하면 실행을 추측하지 않고 이 경계에서 멈춥니다.",
  },
] as const;

const TRACE_NOTES = TRACE_STATES.map((state) => `${state.title} ${state.action} ${state.evidence} ${state.pending}`);

function activeClass(active: boolean, complete = false) {
  if (active) return "border-primary bg-primary text-primary-foreground";
  if (complete) return "border-primary/45 bg-primary/10 text-foreground";
  return "border-border bg-background text-muted-foreground";
}

function Progress({ active }: { active: number }) {
  return (
    <div className="mt-4 grid grid-cols-6 gap-1" aria-hidden="true">
      {TRACE_LABELS.map((label, index) => (
        <span key={label} className={`h-1.5 ${index <= active ? "bg-primary" : "bg-border"}`} />
      ))}
    </div>
  );
}

function ValidatorLane({ name, active, scene }: { name: "A" | "B" | "C" | "D"; active: boolean; scene: number }) {
  const index = ["A", "B", "C", "D"].indexOf(name);
  const workerHasBytes = scene === 0 ? name === "A" : scene >= 1 && (name !== "D" || scene >= 5);
  const primaryVoted = scene >= 3 && index <= 2;

  return (
    <div className={`min-w-0 border p-2 transition-colors duration-200 ${activeClass(active)}`}>
      <div className="flex items-center justify-between gap-1">
        <span className="text-[10px] font-black">검증자 {name}</span>
        <span className={`h-2 w-2 rounded-full ${active ? "bg-primary-foreground" : workerHasBytes ? "bg-primary" : "bg-border"}`} />
      </div>
      <div className={`mt-2 border px-1.5 py-2 text-center text-[9px] font-bold leading-4 ${workerHasBytes ? "border-current/40" : "border-border/50 opacity-40"}`}>
        Worker {name}0<br />{workerHasBytes ? "d7 저장" : "d7 없음"}
      </div>
      <div className={`mt-1 border px-1.5 py-2 text-center text-[9px] font-bold leading-4 ${primaryVoted ? "border-current/40" : "border-border/50"}`}>
        Primary {name}<br />{primaryVoted ? "H8 vote" : name === "A" && scene >= 2 ? "H8 작성" : "대기"}
      </div>
    </div>
  );
}

export function NarwhalBatchTraceViz() {
  const scenes = useAnimatedScenes(TRACE_LABELS.length, 6000, { loop: false });
  const state = TRACE_STATES[scenes.active];

  return (
    <VizFrame
      eyebrow="한 배치 추적 · n=4, f=1"
      title="d7이 인증서가 되고 D에게 복구되기까지"
      note="근거: Narwhal v4와 보관 종료된 e67f915. 현재 Sui 합의 구현은 아닙니다."
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        tabIndex={0}
        role="group"
        aria-label="Narwhal에서 배치 d7이 저장되고 인증서가 되는 여섯 단계"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div data-viz-scene-stage className="min-h-[715px] sm:min-h-[520px]">
          <p className="text-[10px] font-black text-primary">{String(scenes.active + 1).padStart(2, "0")} · {TRACE_LABELS[scenes.active]}</p>
          <h4 className="mt-2 min-h-14 break-keep text-base font-bold leading-7">{state.title}</h4>

          <div className="mt-3 grid grid-cols-4 gap-1.5">
            {(["A", "B", "C", "D"] as const).map((name, index) => (
              <ValidatorLane
                key={name}
                name={name}
                scene={scenes.active}
                active={
                  (scenes.active === 0 && name === "A") ||
                  (scenes.active === 1 && index <= 2) ||
                  (scenes.active === 2 && name === "A") ||
                  (scenes.active === 3 && index <= 2) ||
                  (scenes.active === 5 && (name === "B" || name === "D"))
                }
              />
            ))}
          </div>

          <div className="mt-2 grid grid-cols-3 gap-1.5 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-stretch sm:gap-2">
            <div className={activeClass(scenes.active <= 1, scenes.active > 1) + " border p-2.5"}>
              <p className="text-[9px] font-black">DATA PLANE</p>
              <p className="mt-1 break-keep text-[9px] font-bold leading-4 sm:text-[11px] sm:leading-5">d7 원문 · hash · worker 0</p>
            </div>
            <span className="hidden self-center text-center text-xs font-black text-muted-foreground sm:block">→</span>
            <div className={activeClass(scenes.active === 2 || scenes.active === 3, scenes.active > 3) + " border p-2.5"}>
              <p className="text-[9px] font-black">HEADER H8</p>
              <p className="mt-1 break-keep text-[9px] font-bold leading-4 sm:text-[11px] sm:leading-5">e7 · r8 · A · d7→w0 · parents</p>
            </div>
            <span className="hidden self-center text-center text-xs font-black text-muted-foreground sm:block">→</span>
            <div className={activeClass(scenes.active === 4, scenes.active > 4) + " border p-2.5"}>
              <p className="text-[9px] font-black">CERT(H8)</p>
              <p className="mt-1 break-keep text-[9px] font-bold leading-4 sm:text-[11px] sm:leading-5">H8 · signer A/B/C · 집계 서명</p>
            </div>
          </div>

          <div className="mt-2 grid gap-2 sm:grid-cols-3">
            <div className="min-w-0 border border-border bg-background p-3">
              <p className="text-[10px] font-semibold text-muted-foreground">지금 일어나는 일</p>
              <p className="mt-1 break-keep text-xs font-semibold leading-5">{state.action}</p>
            </div>
            <div className="min-w-0 border border-border bg-background p-3">
              <p className="text-[10px] font-semibold text-muted-foreground">새로 생긴 증거</p>
              <p className="mt-1 break-keep text-xs font-semibold leading-5">{state.evidence}</p>
            </div>
            <div className="min-w-0 border border-border bg-background p-3">
              <p className="text-[10px] font-semibold text-muted-foreground">아직 확정되지 않음</p>
              <p className="mt-1 break-keep text-xs font-semibold leading-5">{state.pending}</p>
            </div>
          </div>
          <Progress active={scenes.active} />
        </div>
        <AnimatedSceneControls {...scenes} labels={TRACE_LABELS} controlLabels={TRACE_LABELS} playLabel="d7 처리 과정 재생" />
      </div>
      <StaticSceneList labels={TRACE_LABELS} notes={TRACE_NOTES} />
    </VizFrame>
  );
}

const VERIFY_LABELS = ["원문 저장", "저장 정족수", "헤더 작성", "누락 회수", "이중 투표 차단"] as const;

const VERIFY_STATES = [
  {
    title: "Worker가 배치 원문을 저장하고 내용으로 식별할 digest를 만듭니다.",
    code: "digest = hash(batch); store[(digest, worker_id)] = batch",
    input: "T1을 포함한 d7 원문과 worker 0이라는 저장 위치입니다.",
    output: "(d7, worker 0)으로 바이트를 찾고 다시 검증할 수 있습니다.",
    guard: "로컬 저장 하나는 원격 가용성이나 header 인증을 뜻하지 않습니다.",
  },
  {
    title: "동료 worker의 저장 확인 power가 정족수에 닿을 때까지 기다립니다.",
    code: "if ack_power >= quorum: notify_primary(digest, worker_id)",
    input: "A·B·C처럼 서로 다른 검증자의 저장 확인과 voting power입니다.",
    output: "Primary가 d7의 위치를 header payload에 넣을 수 있습니다.",
    guard: "저장 확인 정족수와 primary vote 정족수는 서로 다른 단계입니다.",
  },
  {
    title: "Primary는 원문 대신 위치와 직전 라운드 부모를 하나의 digest로 묶습니다.",
    code: "header = sign(epoch, round, author, payload, parents)",
    input: "Epoch·round·작성자·(d7, w0)·직전 round certificates입니다.",
    output: "서명된 H8이 생겨 다른 primaries가 같은 내용을 검증할 수 있습니다.",
    guard: "작성자 서명 하나는 availability certificate가 아닙니다.",
  },
  {
    title: "부모 인증서나 payload가 없으면 투표를 멈추고 먼저 가져옵니다.",
    code: "if missing_parents(H8) or missing_payload(H8): suspend_and_fetch(H8)",
    input: "Local certificate store와 payload_store[(d7, worker 0)]의 조회 결과입니다.",
    output: "가져온 부모와 d7의 digest를 확인한 뒤 같은 H8 처리를 재개합니다.",
    guard: "Digest만 보고 원문이 있는 척 투표하지 않습니다.",
  },
  {
    title: "같은 작성자·round의 다른 digest에 이미 투표했다면 두 번째 표를 거부합니다.",
    code: "if voted_other(author, round): reject(); else: vote(H8)",
    input: "저장된 이전 vote의 author·round·header digest와 새 H8입니다.",
    output: "검증을 통과한 한 header에만 이 primary의 표가 남습니다.",
    guard: "중복 signer나 충돌한 두 header의 표를 함께 정족수로 세지 않습니다.",
  },
] as const;

const VERIFY_NOTES = VERIFY_STATES.map((state) => `${state.title} ${state.output} ${state.guard}`);

export function NarwhalVerificationPseudocodeViz() {
  const scenes = useAnimatedScenes(VERIFY_LABELS.length, 6200, { loop: false });
  const state = VERIFY_STATES[scenes.active];

  return (
    <VizFrame
      eyebrow="검증 절차 · 의사코드와 상태를 함께 읽기"
      title="저장 확인과 header 투표는 서로 다른 문턱입니다"
      description="코드 한 줄이 어떤 저장 상태를 읽고, 어떤 다음 상태만 허용하는지 다섯 장면으로 연결합니다."
      note="보관 종료된 MystenLabs/narwhal e67f915의 worker·primary 경계를 설명용 의사코드로 줄인 것입니다. 현재 Sui 구현과 동일하다는 뜻은 아닙니다."
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div id={scenes.playbackId} data-viz-live-only tabIndex={0} role="group" aria-label="Narwhal 저장과 header 투표 검증의 다섯 단계" onKeyDown={scenes.onKeyDown} className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
        <div data-viz-scene-stage className="min-h-[560px] sm:min-h-[410px]">
          <p className="text-[10px] font-black text-primary">{String(scenes.active + 1).padStart(2, "0")} · {VERIFY_LABELS[scenes.active]}</p>
          <h4 className="mt-2 min-h-14 break-keep text-base font-bold leading-7">{state.title}</h4>
          <code className="mt-3 block whitespace-pre-wrap break-words border border-border bg-muted/40 p-3 text-xs font-bold leading-6">{state.code}</code>
          <div className="mt-3 grid gap-px border border-border bg-border p-px sm:grid-cols-3">
            <div className="bg-background p-3"><p className="text-[10px] font-semibold text-muted-foreground">확인하는 입력</p><p className="mt-1 break-keep text-xs font-semibold leading-5">{state.input}</p></div>
            <div className="bg-background p-3"><p className="text-[10px] font-semibold text-muted-foreground">새로 생긴 상태</p><p className="mt-1 break-keep text-xs font-semibold leading-5">{state.output}</p></div>
            <div className="bg-background p-3"><p className="text-[10px] font-semibold text-muted-foreground">넘지 않는 경계</p><p className="mt-1 break-keep text-xs font-semibold leading-5">{state.guard}</p></div>
          </div>
          <div className="mt-4 grid grid-cols-5 gap-1" aria-hidden="true">{VERIFY_LABELS.map((label, index) => <span key={label} className={`h-1.5 ${index <= scenes.active ? "bg-primary" : "bg-border"}`} />)}</div>
        </div>
        <AnimatedSceneControls {...scenes} labels={VERIFY_LABELS} controlLabels={VERIFY_LABELS} playLabel="Narwhal 검증 의사코드 재생" />
      </div>
      <StaticSceneList labels={VERIFY_LABELS} notes={VERIFY_NOTES} />
    </VizFrame>
  );
}

const FAILURE_ROWS = [
  ["부모 인증서 누락", "header.parents가 local store에 없음", "인증서를 가져온 뒤 같은 헤더를 다시 처리", "부모가 없는데 vote"],
  ["배치 바이트 누락", "payload_store[(d7, worker 0)]가 없음", "worker 0 경로로 d7을 받아 hash 확인", "digest만 보고 vote"],
  ["같은 author·round의 다른 헤더", "저장된 vote digest와 새 vote digest가 다름", "두 번째 vote를 거부", "서로 다른 두 헤더에 서명"],
] as const;

export function NarwhalFailureViz() {
  return (
    <VizFrame
      eyebrow="실패 경로"
      title="검증할 자료가 없으면 투표하지 않고, 가져온 뒤 같은 헤더를 다시 처리합니다"
      description="보관된 구현의 Core와 Synchronizer가 헤더 처리를 멈추는 세 가지 대표 조건입니다."
      documentFlow
      canvasClassName="p-0"
    >
      <ResponsiveVizTable
        columns={["멈추는 이유", "확인한 상태", "다음 동작", "금지되는 지름길"]}
        rows={FAILURE_ROWS}
        desktopMinWidthClassName="min-w-[880px]"
      />
    </VizFrame>
  );
}

const STATE_ROWS = [
  ["Received", "한 worker가 d7 원문 보관", "로컬 수신", "원격 저장·인증"],
  ["Stored quorum", "worker 저장 확인 power가 정족수 도달", "primary에 (d7, w0) 전달", "헤더 인증서"],
  ["Certified", "같은 H8의 primary vote 정족수", "H8과 d7의 회수 근거", "전체 순서·실행"],
  ["Ordered", "별도 합의가 DAG를 결정적으로 펼침", "d7의 실행 위치", "상태 전이 성공"],
  ["Executed", "중복 제거·검증·상태 전이", "새 state root와 실행 결과", "외부 백업·영구 보존"],
] as const;

export function NarwhalStateViz() {
  return (
    <VizFrame
      eyebrow="상태 경계"
      title="같은 d7이라도 저장·인증·정렬·실행은 서로 다른 완료 상태입니다"
      description="앞 단계의 성공을 뒤 단계의 성공으로 바꾸어 기록하지 않습니다."
      documentFlow
      canvasClassName="p-0"
    >
      <ResponsiveVizTable
        columns={["상태", "근거", "여기까지 보장", "아직 보장하지 않음"]}
        rows={STATE_ROWS}
        desktopMinWidthClassName="min-w-[820px]"
      />
    </VizFrame>
  );
}
