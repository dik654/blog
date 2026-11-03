import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import ResponsiveVizTable from "@/components/viz/ResponsiveVizTable";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const NORMAL_LABELS = ["요청", "순번 배정", "준비 확인", "커밋 확인", "순서대로 실행", "결과 확인"] as const;

type ReplicaId = "r0" | "r1" | "r2" | "r3";

const NORMAL_STATES: readonly {
  action: string;
  client: string;
  condition: string;
  replicas: Record<ReplicaId, string>;
  changed: readonly ReplicaId[];
}[] = [
  {
    action: "클라이언트가 타임스탬프 71을 붙인 송금 요청을 현재 주 노드 R0에 보냅니다.",
    client: "Alice → Bob · 10 · 아직 확정된 결과 없음",
    condition: "복제본 4대 중 임의로 잘못 동작할 수 있는 복제본은 최대 1대입니다.",
    replicas: { r0: "view 0의 주 노드 · 요청 수신", r1: "대기", r2: "대기", r3: "응답 지연" },
    changed: ["r0"],
  },
  {
    action: "R0가 요청을 view 0의 sequence 42에 배정하고 요청 해시 dA를 함께 보냅니다.",
    client: "REQUEST(Alice→Bob 10, t=71)",
    condition: "백업은 서명·view·sequence·해시·watermark와 같은 자리에 다른 값이 없음을 확인합니다.",
    replicas: { r0: "PRE-PREPARE (0, 42, dA)", r1: "제안 승인", r2: "제안 승인", r3: "메시지 미도착" },
    changed: ["r0", "r1", "r2"],
  },
  {
    action: "R1과 R2가 같은 (view, sequence, digest)를 봤다고 서로 알립니다.",
    client: "아직 기다리는 중",
    condition: "n=4, f=1에서는 PRE-PREPARE와 서로 다른 백업의 PREPARE 2개가 모이면 prepared입니다.",
    replicas: { r0: "R1·R2 PREPARE 확인 → prepared", r1: "R1·R2 PREPARE 확인 → prepared", r2: "R1·R2 PREPARE 확인 → prepared", r3: "응답 지연" },
    changed: ["r0", "r1", "r2"],
  },
  {
    action: "prepared 상태가 된 R0·R1·R2가 COMMIT을 보내고 같은 증거 3개를 모읍니다.",
    client: "아직 기다리는 중",
    condition: "로컬 prepared와 서로 다른 복제본의 COMMIT 2f+1개가 함께 있어야 committed-local입니다.",
    replicas: { r0: "COMMIT 3개 → committed-local", r1: "COMMIT 3개 → committed-local", r2: "COMMIT 3개 → committed-local", r3: "응답 지연" },
    changed: ["r0", "r1", "r2"],
  },
  {
    action: "각 복제본은 41번까지 실행한 뒤에야 42번 송금을 상태 기계에 적용합니다.",
    client: "아직 일치하는 실행 결과를 모으는 중",
    condition: "메시지가 도착한 순서와 애플리케이션이 실행하는 순서는 다를 수 있습니다.",
    replicas: { r0: "sequence 42 실행 · Bob +10", r1: "sequence 42 실행 · Bob +10", r2: "sequence 42 실행 · Bob +10", r3: "아직 따라잡는 중" },
    changed: ["r0", "r1", "r2"],
  },
  {
    action: "클라이언트는 같은 타임스탬프와 결과를 담은 서로 다른 응답 2개를 받은 뒤 성공으로 판단합니다.",
    client: "R0·R1의 같은 결과 2개 = f+1 · 요청 완료",
    condition: "복제본의 committed-local과 클라이언트가 받아들이는 결과는 서로 다른 판정입니다.",
    replicas: { r0: "REPLY(t=71, result=성공)", r1: "REPLY(t=71, result=성공)", r2: "REPLY(t=71, result=성공)", r3: "늦게 복구 가능" },
    changed: ["r0", "r1", "r2"],
  },
] as const;

const NORMAL_NOTES = NORMAL_STATES.map((state) => `${state.action} ${state.condition}`);

const RECOVERY_LABELS = ["주 노드 정지", "변경 요청", "새 view 구성", "합의 재개", "기록 정리", "복제본 복구"] as const;

const RECOVERY_STATES = [
  {
    title: "R0가 sequence 42를 제안한 뒤 멈췄습니다",
    evidence: "R1·R2에는 (view 0, sequence 42, dA)의 prepared certificate가 남아 있습니다.",
    decision: "실행하지 못한 복제본도 증거를 버리지 않습니다.",
  },
  {
    title: "타이머가 만료된 복제본들이 view 1로 이동합니다",
    evidence: "R1은 자기 것을 포함해 유효한 VIEW-CHANGE 3개를 모읍니다.",
    decision: "view 1의 주 노드는 R1입니다. 타임아웃 하나만으로 이전 증거를 덮어쓰지 않습니다.",
  },
  {
    title: "R1이 각 sequence의 다음 값을 계산합니다",
    evidence: "42번에는 V에 포함된 가장 높은 view의 prepared 값 dA를, 빈 43번에는 null 요청을 넣습니다.",
    decision: "백업도 같은 V에서 O를 다시 계산해 NEW-VIEW를 검증합니다.",
  },
  {
    title: "복제본들이 view 1에서 같은 값을 다시 확인합니다",
    evidence: "42번 dA와 43번 null이 새 PRE-PREPARE가 되어 PREPARE·COMMIT을 다시 거칩니다.",
    decision: "이미 실행한 클라이언트 요청은 마지막 타임스탬프와 응답 기록으로 중복 실행하지 않습니다.",
  },
  {
    title: "sequence 100의 상태 해시 3개가 일치합니다",
    evidence: "CHECKPOINT(100, stateDigest)를 서로 다른 복제본 3대에서 받으면 stable checkpoint가 됩니다.",
    decision: "low watermark를 100으로 올리고 100 이하의 프로토콜 기록을 지울 수 있습니다.",
  },
  {
    title: "뒤처진 R3가 인증된 상태에서 다시 시작합니다",
    evidence: "R3는 체크포인트 서명자에게 상태를 받고 해시를 확인한 뒤 100 이후 요청을 재생합니다.",
    decision: "로컬 스냅샷 하나만 믿고 복구 완료로 판단하지 않습니다.",
  },
] as const;

const RECOVERY_NOTES = RECOVERY_STATES.map((state) => `${state.title} ${state.evidence} ${state.decision}`);

function ReplicaCard({ id, value, active }: { id: ReplicaId; value: string; active: boolean }) {
  const labels: Record<ReplicaId, string> = { r0: "R0 · 주 노드", r1: "R1 · 백업", r2: "R2 · 백업", r3: "R3 · 지연" };
  return (
    <div className={`min-w-0 border bg-background p-3 ${active ? "border-primary" : "border-border"}`}>
      <p className={`text-[10px] font-black ${active ? "text-primary" : "text-muted-foreground"}`}>{labels[id]}</p>
      <p className="mt-2 break-keep text-xs font-bold leading-5">{value}</p>
    </div>
  );
}

export function PbftNormalViz() {
  const scenes = useAnimatedScenes(NORMAL_LABELS.length, 5600, { loop: false });
  const state = NORMAL_STATES[scenes.active];
  return (
    <VizFrame
      eyebrow="PBFT 정상 경로 · n=4, f=1"
      title="송금 한 건이 제안에서 클라이언트 확인까지 가는 과정"
      description="같은 요청이 어느 순번에 놓였는지, 복제본은 언제 실행할 수 있는지, 클라이언트는 언제 성공으로 받아들이는지를 나눠 봅니다."
      note="설명용 사례입니다. 성능 수치가 아니라 OSDI 1999 §4의 판정 조건을 4개 복제본에 대입한 결과입니다."
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div id={scenes.playbackId} data-viz-live-only tabIndex={0} role="group" aria-label="PBFT 요청 한 건의 여섯 단계" onKeyDown={scenes.onKeyDown} className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
        <div data-viz-scene-stage className="min-h-[35rem] sm:min-h-[22.25rem]">
          <div className="border-y border-border py-3">
            <p className="text-[10px] font-black text-muted-foreground">현재 동작</p>
            <p className="mt-1 min-h-12 break-keep text-sm font-bold leading-6">{state.action}</p>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-4">
            {(Object.keys(state.replicas) as ReplicaId[]).map((id) => <ReplicaCard key={id} id={id} value={state.replicas[id]} active={state.changed.includes(id)} />)}
          </div>
          <div className="mt-3 grid gap-px bg-border p-px sm:grid-cols-[8rem_minmax(0,1fr)]">
            <strong className="bg-background p-3 text-[10px] text-muted-foreground">클라이언트</strong>
            <p className="min-w-0 break-keep bg-background p-3 text-xs font-bold leading-5">{state.client}</p>
            <strong className="bg-background p-3 text-[10px] text-muted-foreground">통과 조건</strong>
            <p className="min-w-0 break-keep bg-background p-3 text-xs font-bold leading-5">{state.condition}</p>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={NORMAL_LABELS} controlLabels={NORMAL_LABELS} playLabel="PBFT 정상 경로 재생" />
      </div>
      <StaticSceneList labels={NORMAL_LABELS} notes={NORMAL_NOTES} />
    </VizFrame>
  );
}

const PREDICATE_LABELS = ["제안 확인", "PREPARE 계산", "COMMIT 전송", "COMMIT 계산", "순서 실행"] as const;

const PREDICATE_STATES = [
  {
    code: "has_request(m) && has_preprepare(m, view, sequence)",
    question: "요청 본문과 주 노드의 제안이 같은 자리입니까?",
    evidence: ["요청 m", "PRE-PREPARE(0, 42, dA)", "D(m) = dA"],
    count: "개수를 세기 전 단계",
    result: "서명·view·sequence·digest·watermark가 맞으므로 제안을 로그에 넣습니다.",
  },
  {
    code: "distinct_matching_prepares(view, sequence, digest) >= 2 * f",
    question: "서로 다른 백업이 같은 제안을 보았습니까?",
    evidence: ["R1: PREPARE(0, 42, dA)", "R2: PREPARE(0, 42, dA)"],
    count: "2개 ≥ 2f = 2개",
    result: "요청·PRE-PREPARE와 이 두 표가 함께 있으므로 prepared입니다.",
  },
  {
    code: "if prepared(m, view, sequence): send_commit(view, sequence, digest)",
    question: "이 복제본이 COMMIT을 보낼 자격을 얻었습니까?",
    evidence: ["로컬 prepared = 참", "아직 실행하지 않음"],
    count: "조건 통과",
    result: "COMMIT을 보냅니다. COMMIT 전송 자체는 실행이나 사용자 성공이 아닙니다.",
  },
  {
    code: "prepared(...) && distinct_matching_commits(...) >= 2 * f + 1",
    question: "같은 증거가 다음 view에도 남을 만큼 퍼졌습니까?",
    evidence: ["로컬 prepared", "R0·R1·R2의 COMMIT"],
    count: "3개 ≥ 2f+1 = 3개",
    result: "committed-local입니다. COMMIT 세 개만 있고 로컬 prepared가 없으면 실패입니다.",
  },
  {
    code: "execute_after_all_lower_sequences(sequence)",
    question: "지금 sequence 42를 상태 기계에 적용해도 됩니까?",
    evidence: ["committed-local(42)", "sequence 0…41 실행 완료"],
    count: "두 조건 모두 통과",
    result: "42번 요청을 실행하고 결과를 클라이언트에게 보냅니다.",
  },
] as const;

const PREDICATE_NOTES = PREDICATE_STATES.map(
  (state) => `${state.question} ${state.count}. ${state.result}`,
);

export function PbftPredicateViz() {
  const scenes = useAnimatedScenes(PREDICATE_LABELS.length, 6200, { loop: false });
  const state = PREDICATE_STATES[scenes.active];

  return (
    <VizFrame
      eyebrow="OSDI 1999 §4.2 · 판정 의사코드"
      title="코드는 표를 세기 전에 무엇을 함께 확인하는지부터 말합니다"
      description="한 줄씩 실행하면서 현재 질문, 실제 증거, n=4·f=1의 계산과 판정 결과를 같은 화면에서 연결합니다."
      note="같은 발신자의 중복 메시지는 한 번만 셉니다. 모든 PREPARE와 COMMIT은 같은 view·sequence·digest를 가리켜야 합니다."
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        tabIndex={0}
        role="group"
        aria-label="PBFT 판정 의사코드 다섯 단계"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div data-viz-scene-stage className="min-h-[38rem] border-y border-border py-4 sm:min-h-[23rem]">
          <p className="text-[10px] font-black text-primary">
            {String(scenes.active + 1).padStart(2, "0")} · {PREDICATE_LABELS[scenes.active]}
          </p>
          <h4 className="mt-2 break-keep text-base font-bold leading-7">{state.question}</h4>
          <code className="mt-3 block whitespace-pre-wrap break-words border border-border bg-muted/40 p-3 text-xs font-bold leading-6">
            {state.code}
          </code>
          <div className="mt-3 grid gap-px bg-border p-px sm:grid-cols-[8rem_minmax(0,1fr)]">
            <strong className="bg-background p-3 text-[10px] text-muted-foreground">로컬에 있는 증거</strong>
            <ul className="min-w-0 space-y-1 bg-background p-3 text-xs font-bold leading-5">
              {state.evidence.map((item) => <li key={item} className="break-keep">· {item}</li>)}
            </ul>
            <strong className="bg-background p-3 text-[10px] text-muted-foreground">이번 계산</strong>
            <p className="min-w-0 break-keep bg-background p-3 text-xs font-bold leading-5">{state.count}</p>
            <strong className="bg-background p-3 text-[10px] text-muted-foreground">다음 상태</strong>
            <p className="min-w-0 break-keep bg-background p-3 text-xs font-bold leading-5">{state.result}</p>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={PREDICATE_LABELS} controlLabels={PREDICATE_LABELS} playLabel="PBFT 판정 의사코드 재생" />
      </div>
      <StaticSceneList labels={PREDICATE_LABELS} notes={PREDICATE_NOTES} />
    </VizFrame>
  );
}

export function PbftRecoveryViz() {
  const scenes = useAnimatedScenes(RECOVERY_LABELS.length, 6000, { loop: false });
  const state = RECOVERY_STATES[scenes.active];
  return (
    <VizFrame
      eyebrow="PBFT 복구 경로 · OSDI 1999 단순화 절차"
      title="주 노드가 멈춰도 준비된 값은 다음 view로 넘어갑니다"
      description="뷰 변경, 빈 순번 채우기, 안정 체크포인트와 뒤처진 복제본의 상태 복구를 한 흐름으로 연결합니다."
      note="2002년 확장판은 P·Q 집합과 VIEW-CHANGE-ACK를 추가합니다. 이 그림은 1999년 OSDI 논문 §4.3–4.4의 단순화된 절차만 설명합니다."
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div id={scenes.playbackId} data-viz-live-only tabIndex={0} role="group" aria-label="PBFT 주 노드 장애부터 복제본 복구까지 여섯 단계" onKeyDown={scenes.onKeyDown} className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
        <div data-viz-scene-stage className="min-h-[25.75rem] border-y border-border py-4 sm:min-h-[16.75rem]">
          <p className="text-[10px] font-black text-primary">{String(scenes.active + 1).padStart(2, "0")} · {RECOVERY_LABELS[scenes.active]}</p>
          <h4 className="mt-2 break-keep text-base font-bold leading-7">{state.title}</h4>
          <div className="mt-4 grid gap-px bg-border p-px sm:grid-cols-[8rem_minmax(0,1fr)]">
            <strong className="bg-background p-3 text-[10px] text-muted-foreground">남아 있는 증거</strong>
            <p className="min-w-0 break-keep bg-background p-3 text-xs font-bold leading-5">{state.evidence}</p>
            <strong className="bg-background p-3 text-[10px] text-muted-foreground">다음 판단</strong>
            <p className="min-w-0 break-keep bg-background p-3 text-xs font-bold leading-5">{state.decision}</p>
          </div>
          <div className="mt-4 grid grid-cols-4 gap-1" aria-hidden="true">
            {[0, 1, 2, 3].map((replica) => <div key={replica} className={`h-2 ${replica <= Math.min(2, scenes.active) ? "bg-primary" : "bg-border"}`} />)}
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={RECOVERY_LABELS} controlLabels={RECOVERY_LABELS} playLabel="PBFT 복구 경로 재생" />
      </div>
      <StaticSceneList labels={RECOVERY_LABELS} notes={RECOVERY_NOTES} />
    </VizFrame>
  );
}

const PBFT_TEST_ROWS = [
  ["같은 순번에 서로 다른 해시", "R0가 dA와 dB를 나눠 보냄", "정상 복제본 둘이 서로 다른 값을 prepared로 만들지 않음"],
  ["COMMIT만 3개", "로컬 PRE-PREPARE·PREPARE 없음", "committed-local 아님 · 상태를 실행하지 않음"],
  ["주 노드 장애", "prepared dA와 빈 순번이 섞인 VIEW-CHANGE 3개", "dA를 보존하고 빈 순번에는 null 요청을 넣음"],
  ["복제본 재시작", "체크포인트 증거와 상태 해시", "상태를 검증하고 이후 요청을 재생한 뒤 복귀"],
];

export function PbftTestTable() {
  return <ResponsiveVizTable columns={["장애 사례", "주입할 입력", "반드시 지켜야 할 결과"]} rows={PBFT_TEST_ROWS} desktopMinWidthClassName="min-w-[760px]" />;
}
