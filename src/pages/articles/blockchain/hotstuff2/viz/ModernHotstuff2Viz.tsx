import type { ReactNode } from "react";

import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import ResponsiveVizTable from "@/components/viz/ResponsiveVizTable";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const COMMIT_LABELS = ["B20 제안", "첫 표 수집", "C20 생성", "두 번째 표", "다음 view", "B20 커밋"] as const;

const COMMIT_STATES = [
  {
    title: "view 20의 주 노드가 B19의 인증서를 이어 B20을 제안합니다.",
    leader: "proposal: B20 · parent B19 · C19(B19)",
    replicas: "각 복제본은 부모 인증서가 자신의 lock보다 낮지 않은지 확인합니다.",
    evidence: "B20에는 Alice → Bob · 10 요청이 들어 있습니다.",
    result: "아직 인증되지 않음",
  },
  {
    title: "R0·R1·R2가 같은 B20과 view 20에 첫 번째 표를 보냅니다.",
    leader: "서로 다른 유효한 vote 3개를 수집합니다.",
    replicas: "n=4, t=1이므로 2t+1=3표가 필요합니다.",
    evidence: "모든 표는 B20의 해시와 view 20을 가리켜야 합니다.",
    result: "첫 정족수 충족",
  },
  {
    title: "주 노드가 첫 표 3개를 C20(B20)으로 묶어 prepare를 보냅니다.",
    leader: "prepare: C20(B20)",
    replicas: "인증서를 검증하고 B20을 새 lock으로 기록합니다.",
    evidence: "C20(B20)은 B20이 인증됐다는 증거입니다.",
    result: "B20 인증 · 아직 커밋 아님",
  },
  {
    title: "복제본은 C20(B20)을 확인했다는 두 번째 표를 view 21의 주 노드에게 보냅니다.",
    leader: "다음 주 노드가 vote2 3개를 수집합니다.",
    replicas: "vote2는 블록이 아니라 C20(B20)을 다시 인증합니다.",
    evidence: "3표가 모이면 C20(C20(B20))이라는 이중 인증서가 됩니다.",
    result: "view 20의 이중 인증서 생성",
  },
  {
    title: "view 21의 주 노드는 직전 view의 이중 인증서를 들고 기다림 없이 진입합니다.",
    leader: "proposal: B21 · C20(B20) · C20(C20(B20))",
    replicas: "직전 view의 이중 인증서와 B20을 잇는 B21을 검증합니다.",
    evidence: "직전 view의 증거이므로 더 높은 숨은 lock이 있을 수 없습니다.",
    result: "빠른 진입 경로",
  },
  {
    title: "복제본은 B21 제안을 받아들이며 이중 인증서가 가리키는 B20을 커밋합니다.",
    leader: "다음 블록 B21의 합의를 계속 진행합니다.",
    replicas: "B20과 그 조상의 요청을 순서대로 실행합니다.",
    evidence: "커밋 뒤에도 블록 본문과 상태 전이 결과를 확인해야 합니다.",
    result: "Bob 잔액 +10",
  },
] as const;

const COMMIT_NOTES = COMMIT_STATES.map((state) => `${state.title} ${state.result}.`);

const ENTRY_LABELS = ["이중 인증서 없음", "view 이동", "잠금 보고", "시간 경계", "가장 높은 인증서", "처리 재개"] as const;

const ENTRY_STATES = [
  {
    title: "직전 view의 이중 인증서 없이 view 22로 넘어갑니다.",
    timing: "이전 주 노드가 멈췄거나 증거를 일부 복제본에게만 보냈을 수 있습니다.",
    message: "새 주 노드는 곧바로 안전한 부모를 확정할 수 없습니다.",
    safety: "타임아웃만으로 기존 lock을 지우지 않습니다.",
  },
  {
    title: "Pacemaker가 timeout certificate로 복제본을 view 22에 모읍니다.",
    timing: "정상 복제본이 같은 view에 들어오는 최대 차이를 Ppc로 둡니다.",
    message: "View 이동 증거와 합의의 lock 증거는 서로 다른 역할을 합니다.",
    safety: "View 번호가 커졌다는 사실만으로 새 블록에 투표하지 않습니다.",
  },
  {
    title: "각 복제본이 자신이 가진 가장 높은 잠금 인증서를 새 주 노드에게 보냅니다.",
    timing: "주 노드는 첫 2t+1개만 받고 바로 제안하지 않습니다.",
    message: "보고서 전체를 다음 제안에 붙이는 status certificate도 만들지 않습니다.",
    safety: "늦게 들어온 정상 복제본이 더 높은 lock을 갖고 있을 가능성을 남겨 둡니다.",
  },
  {
    title: "새 주 노드는 Ppc + Δ가 지날 때까지 기다립니다.",
    timing: "GST 뒤라면 이 시간 안에 모든 정상 복제본의 잠금 보고가 도착합니다.",
    message: "시간을 써서 전체 보고서를 방송하는 제곱 통신을 피합니다.",
    safety: "GST 전에는 처리가 멈출 수 있지만 충돌한 블록을 함께 커밋해서는 안 됩니다.",
  },
  {
    title: "도착한 보고에서 가장 높은 유효 인증서 하나를 고릅니다.",
    timing: "이 인증서가 모든 정상 lock보다 낮지 않다는 것을 시간 경계가 보장합니다.",
    message: "제안에는 보고서 묶음이 아니라 선택한 인증서만 넣습니다.",
    safety: "복제본은 제안의 인증서가 자기 lock보다 낮지 않은지 다시 확인합니다.",
  },
  {
    title: "선택한 인증서의 블록을 연장해 새 제안을 보내고 두 단계 합의를 재개합니다.",
    timing: "느린 진입은 Ppc + Δ가 지난 뒤에 제안을 시작합니다.",
    message: "한 view의 메시지는 계속 주 노드↔복제본 형태로 선형 크기를 유지합니다.",
    safety: "다음 view에 이중 인증서를 넘기면 다시 빠른 진입 경로로 돌아갑니다.",
  },
] as const;

const ENTRY_NOTES = ENTRY_STATES.map((state) => `${state.title} ${state.safety}`);

function EvidenceRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-px bg-border p-px sm:grid-cols-[9rem_minmax(0,1fr)]">
      <strong className="bg-background p-3 text-[10px] text-muted-foreground">{label}</strong>
      <p className="min-w-0 break-keep bg-background p-3 text-xs font-bold leading-5">{children}</p>
    </div>
  );
}

export function Hotstuff2CommitViz() {
  const scenes = useAnimatedScenes(COMMIT_LABELS.length, 5600, { loop: false });
  const state = COMMIT_STATES[scenes.active];
  return (
    <VizFrame
      eyebrow="HotStuff-2 · n=4, t=1"
      title="B20은 두 번의 정족수 확인을 거쳐 다음 view에서 커밋됩니다"
      description="블록 인증서와 이중 인증서를 같은 것으로 보지 않고, 어느 주 노드가 어떤 표를 모으는지 따라갑니다."
      note="HotStuff-2 논문 Figure 1을 Alice의 송금 사례에 적용한 설명용 흐름입니다."
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        tabIndex={0}
        role="group"
        aria-label="HotStuff-2 커밋의 여섯 단계"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div data-viz-scene-stage>
          <p className="min-h-14 border-y border-border py-3 text-sm font-bold leading-6">{state.title}</p>
          <div className="mt-3 grid gap-px bg-border p-px sm:grid-cols-2">
            <div className="bg-background p-3">
              <strong className="text-[10px] text-muted-foreground">주 노드</strong>
              <p className="mt-2 break-keep text-xs font-bold leading-5">{state.leader}</p>
            </div>
            <div className="bg-background p-3">
              <strong className="text-[10px] text-muted-foreground">복제본</strong>
              <p className="mt-2 break-keep text-xs font-bold leading-5">{state.replicas}</p>
            </div>
          </div>
          <div className="mt-3 space-y-px">
            <EvidenceRow label="현재 증거">{state.evidence}</EvidenceRow>
            <EvidenceRow label="지금 가능한 일">{state.result}</EvidenceRow>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={COMMIT_LABELS} controlLabels={COMMIT_LABELS} playLabel="HotStuff-2 커밋 재생" />
      </div>
      <StaticSceneList labels={COMMIT_LABELS} notes={COMMIT_NOTES} />
    </VizFrame>
  );
}

export function Hotstuff2EntryViz() {
  const scenes = useAnimatedScenes(ENTRY_LABELS.length, 6200, { loop: false });
  const state = ENTRY_STATES[scenes.active];
  return (
    <VizFrame
      eyebrow="느린 view 진입 · 시간과 증거의 교환"
      title="이중 인증서가 없으면 모든 정상 lock이 도착할 시간을 기다립니다"
      description="첫 2t+1개 보고서로 곧바로 제안하거나 보고서 묶음을 방송하지 않습니다. 시간 경계 뒤 가장 높은 인증서 하나만 고릅니다."
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        tabIndex={0}
        role="group"
        aria-label="HotStuff-2 느린 view 진입의 여섯 단계"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div data-viz-scene-stage>
          <p className="text-[10px] font-black text-primary">{String(scenes.active + 1).padStart(2, "0")} · {ENTRY_LABELS[scenes.active]}</p>
          <h4 className="mt-2 min-h-14 break-keep text-base font-bold leading-7">{state.title}</h4>
          <div className="mt-3 space-y-px">
            <EvidenceRow label="시간 조건">{state.timing}</EvidenceRow>
            <EvidenceRow label="전달하는 정보">{state.message}</EvidenceRow>
            <EvidenceRow label="지킬 안전 조건">{state.safety}</EvidenceRow>
          </div>
          <div className="mt-4 grid grid-cols-6 gap-1" aria-hidden="true">
            {ENTRY_LABELS.map((label, index) => (
              <div key={label} className={`h-2 ${index <= scenes.active ? "bg-primary" : "bg-border"}`} />
            ))}
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={ENTRY_LABELS} controlLabels={ENTRY_LABELS} playLabel="느린 view 진입 재생" />
      </div>
      <StaticSceneList labels={ENTRY_LABELS} notes={ENTRY_NOTES} />
    </VizFrame>
  );
}

const FAILURE_ROWS = [
  ["첫 2t+1개 lock만 받고 제안", "늦은 정상 복제본에 더 높은 lock이 있을 수 있음", "Ppc + Δ 경과 전 제안 금지"],
  ["보고서 2t+1개를 제안에 첨부", "각 제안의 전달량이 O(n²)로 커짐", "가장 높은 인증서 하나만 첨부"],
  ["직전 view의 이중 인증서", "더 높은 숨은 lock이 존재할 수 없음", "기다림 없이 다음 view 진입"],
  ["인증서만 있고 블록 본문 없음", "요청과 부모 블록을 실행할 수 없음", "본문 동기화와 해시 검증 뒤 실행"],
];

export function Hotstuff2FailureTable() {
  return (
    <ResponsiveVizTable
      columns={["상황", "문제", "안전한 처리"]}
      rows={FAILURE_ROWS}
      desktopMinWidthClassName="min-w-[760px]"
    />
  );
}
