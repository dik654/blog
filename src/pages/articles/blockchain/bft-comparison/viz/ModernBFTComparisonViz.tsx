import type { ReactNode } from "react";

import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import ResponsiveVizTable from "@/components/viz/ResponsiveVizTable";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

type ProtocolState = {
  now: string;
  evidence: string;
  pending: string;
};

type TraceState = {
  title: string;
  pbft: ProtocolState;
  hotstuff: ProtocolState;
  autobahn: ProtocolState;
};

const TRACE_LABELS = ["요청 제안", "인증", "커밋", "주 노드 장애", "복구"] as const;

const TRACE_STATES: readonly TraceState[] = [
  {
    title: "Alice의 요청 T1이 들어왔지만, 어느 방식에서도 아직 실행 결과는 확정되지 않았습니다.",
    pbft: {
      now: "주 노드가 view 7·순번 42·T1 해시를 담은 PRE-PREPARE를 보냅니다.",
      evidence: "유효한 주 노드의 제안 1개",
      pending: "PREPARE 정족수도 커밋 증거도 없습니다.",
    },
    hotstuff: {
      now: "주 노드가 QC9를 부모 증거로 삼아 T1을 담은 B10을 제안합니다.",
      evidence: "부모 B9를 지지하는 QC9",
      pending: "B10 자체는 아직 인증되지 않았습니다.",
    },
    autobahn: {
      now: "복제본 A가 T1을 자신의 7번 car에 담아 lane A로 전파합니다.",
      evidence: "앞 car A6의 PoA와 A6을 가리키는 해시",
      pending: "A7은 아직 가용성 인증도 순서도 없습니다.",
    },
  },
  {
    title: "같은 값에 표가 모이지만, 세 프로토콜의 인증서가 증명하는 범위는 서로 다릅니다.",
    pbft: {
      now: "PRE-PREPARE와 서로 다른 backup의 PREPARE 2개가 맞아 prepared 상태가 됩니다.",
      evidence: "prepared(view 7, seq 42, digest T1)",
      pending: "다른 복제본의 COMMIT까지 확인하지 않았습니다.",
    },
    hotstuff: {
      now: "서로 다른 복제본의 표 3개가 모여 B10의 QC10이 됩니다.",
      evidence: "QC10(B10) · 2f+1표",
      pending: "QC 하나만으로 B10을 커밋하지 않습니다.",
    },
    autobahn: {
      now: "A7에 f+1=2표가 모여 PoA가 되고, A7이 인증된 lane tip이 됩니다.",
      evidence: "PoA(A7) · 적어도 한 정상 복제본이 데이터를 보유",
      pending: "PoA는 T1의 전역 순서나 커밋을 증명하지 않습니다.",
    },
  },
  {
    title: "클라이언트가 성공으로 볼 수 있는 경계는 단순한 '표를 받음'보다 뒤에 있습니다.",
    pbft: {
      now: "같은 view·순번·해시의 COMMIT 3개를 받아 T1을 locally committed로 만듭니다.",
      evidence: "local-commit certificate · 2f+1 COMMIT",
      pending: "다른 복제본의 실행·클라이언트 응답은 별도 확인 대상입니다.",
    },
    hotstuff: {
      now: "B11·B12·B13이 바로 앞 부모 QC를 이어 three-chain을 만들면 B10을 커밋합니다.",
      evidence: "연속 부모 관계와 QC10·QC11·QC12",
      pending: "QC 숫자만 연속이거나 형제 블록이면 three-chain이 아닙니다.",
    },
    autobahn: {
      now: "Lane tip cut이 CommitQC를 얻고, 빠진 데이터를 동기화한 뒤 lane들을 결정적으로 섞습니다.",
      evidence: "CommitQC(slot s, cut)와 각 tip의 PoA",
      pending: "CommitQC만 있고 tip history를 받지 못하면 실행은 아직 끝나지 않습니다.",
    },
  },
  {
    title: "다음 제안을 못 받은 같은 장애에서도, 새 주 노드에게 넘기는 안전 증거가 다릅니다.",
    pbft: {
      now: "복제본이 stable checkpoint와 prepared certificate를 VIEW-CHANGE에 담습니다.",
      evidence: "서로 다른 복제본 2f+1곳의 VIEW-CHANGE",
      pending: "Timeout만으로 이전 prepared 요청을 지울 수 없습니다.",
    },
    hotstuff: {
      now: "Pacemaker가 view를 올리고 복제본은 자신이 본 highest QC를 새 주 노드에게 보냅니다.",
      evidence: "NEW-VIEW 2f+1개와 그 안의 highest QC",
      pending: "Pacemaker는 lock·safe-vote 규칙을 대신하지 않습니다.",
    },
    autobahn: {
      now: "복제본이 slot·view·highQC·highProp을 담은 Timeout을 전파합니다. Lane은 계속 자랄 수 있습니다.",
      evidence: "Timeout 2f+1개로 만든 TC",
      pending: "TC 자체는 cut의 CommitQC가 아닙니다.",
    },
  },
  {
    title: "복구란 새 번호를 붙이는 일이 아니라, 이전에 커밋됐을 수 있는 값을 보존해 다시 제안하는 일입니다.",
    pbft: {
      now: "새 주 노드가 VIEW-CHANGE 증거에서 안전한 순번표를 만든 뒤 NEW-VIEW를 보냅니다.",
      evidence: "Checkpoint 이후 prepared 요청을 보존한 NEW-VIEW",
      pending: "빠진 요청 본문과 실행 상태는 별도로 복구해야 합니다.",
    },
    hotstuff: {
      now: "새 주 노드가 가장 높은 유효 QC의 블록을 잇고, 복제본은 lock과 safe-vote 조건을 다시 검사합니다.",
      evidence: "highest QC와 그 QC가 가리키는 부모 가지",
      pending: "더 높은 숫자만 적힌 위조 QC는 사용할 수 없습니다.",
    },
    autobahn: {
      now: "TC의 highQC와 f+1회 나타난 highProp을 비교해 이길 proposal을 재제안합니다.",
      evidence: "Fast·slow path 모두에서 커밋됐을 수 있는 cut을 보존",
      pending: "새 cut을 커밋한 뒤에도 누락된 lane history 동기화가 남을 수 있습니다.",
    },
  },
] as const;

const TRACE_NOTES = TRACE_STATES.map((state) =>
  `${state.title} PBFT: ${state.pbft.evidence} (${state.pbft.pending}) HotStuff: ${state.hotstuff.evidence} (${state.hotstuff.pending}) Autobahn: ${state.autobahn.evidence} (${state.autobahn.pending})`,
);

function StateBand({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-px bg-border p-px">
      <strong className="bg-background px-3 pt-2.5 text-[10px] leading-5 text-muted-foreground">{label}</strong>
      <p className="min-w-0 break-keep bg-background px-3 pb-3 text-xs font-semibold leading-5">{children}</p>
    </div>
  );
}

function ProtocolColumn({ name, state }: { name: string; state: ProtocolState }) {
  return (
    <section className="min-w-0 border border-border bg-background">
      <header className="border-b border-border px-3 py-2.5">
        <h4 className="text-sm font-black text-foreground">{name}</h4>
      </header>
      <div className="space-y-px">
        <StateBand label="현재 동작">{state.now}</StateBand>
        <StateBand label="생긴 증거">{state.evidence}</StateBand>
        <StateBand label="아직 아님">{state.pending}</StateBand>
      </div>
    </section>
  );
}

function SceneProgress({ active, total }: { active: number; total: number }) {
  return (
    <div className="mt-4 grid gap-1" style={{ gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))` }} aria-hidden="true">
      {Array.from({ length: total }, (_, index) => <div key={index} className={`h-2 ${index <= active ? "bg-primary" : "bg-border"}`} />)}
    </div>
  );
}

export function BFTSameTraceViz() {
  const scenes = useAnimatedScenes(TRACE_LABELS.length, 6200, { loop: false });
  const state = TRACE_STATES[scenes.active];

  return (
    <VizFrame
      eyebrow="같은 조건 · n=4, f=1 · 요청 T1"
      title="같은 요청과 같은 주 노드 장애를 세 번 따라갑니다"
      description="단계마다 현재 동작, 새로 생긴 증거, 아직 증명되지 않은 경계를 나란히 비교합니다."
      note="PBFT·HotStuff·Autobahn 논문의 메시지 규칙을 하나의 설명용 시나리오에 맞춘 그림입니다. 프로토콜 사이의 왕복 수나 처리량 비교 결과가 아닙니다."
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div id={scenes.playbackId} data-viz-live-only tabIndex={0} role="group" aria-label="BFT 세 프로토콜의 동일 요청과 장애 비교" onKeyDown={scenes.onKeyDown} className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
        <div data-viz-scene-stage className="min-h-[1110px] sm:min-h-[1040px] lg:min-h-[990px] xl:min-h-[510px]">
          <p className="text-[10px] font-black text-primary">{String(scenes.active + 1).padStart(2, "0")} · {TRACE_LABELS[scenes.active]}</p>
          <h4 className="mt-2 min-h-14 break-keep text-base font-bold leading-7">{state.title}</h4>
          <div className="mt-3 grid min-w-0 gap-3 xl:grid-cols-3">
            <ProtocolColumn name="PBFT" state={state.pbft} />
            <ProtocolColumn name="HotStuff" state={state.hotstuff} />
            <ProtocolColumn name="Autobahn" state={state.autobahn} />
          </div>
          <SceneProgress active={scenes.active} total={TRACE_LABELS.length} />
        </div>
        <AnimatedSceneControls {...scenes} labels={TRACE_LABELS} controlLabels={TRACE_LABELS} playLabel="동일 장애 비교 재생" />
      </div>
      <StaticSceneList labels={TRACE_LABELS} notes={TRACE_NOTES} />
    </VizFrame>
  );
}

const LANE_LABELS = ["Car 제안", "PoA", "Cut 제안", "Cut 커밋", "동기화·실행"] as const;

const LANE_STATES = [
  {
    title: "각 복제본은 다른 복제본을 기다리지 않고 자기 lane에 data proposal을 냅니다.",
    state: "A7(T1) → parent A6 · B5 → B4 · C8 → C7 · D6 → D5",
    evidence: "새 car에는 직전 car의 해시와 직전 PoA가 들어갑니다.",
    boundary: "서로 다른 복제본은 같은 시각에 서로 다른 lane tip을 볼 수 있습니다.",
  },
  {
    title: "A7에 f+1=2표가 모이면 적어도 한 정상 복제본이 A7을 갖고 있다는 PoA가 됩니다.",
    state: "PoA(A7) = VoteA + VoteB · certified tip A7",
    evidence: "순서대로 투표하므로 A7의 PoA는 A0…A7 history의 가용성 근거가 됩니다.",
    boundary: "Byzantine lane은 fork할 수 있으며 PoA는 전역 일관성을 만들지 않습니다.",
  },
  {
    title: "Slot의 주 노드는 자신이 본 각 lane의 최신 certified tip을 cut으로 제안합니다.",
    state: "cut s = [A7, B5, C8, D6]",
    evidence: "각 tip 참조와 PoA를 한 proposal에 넣어 긴 backlog를 짧게 가리킵니다.",
    boundary: "복제본은 빠진 tip history를 비동기로 받으면서도 cut에 투표할 수 있습니다.",
  },
  {
    title: "Slow path에서는 PrepareQC 뒤 Confirm-Ack 2f+1개가 CommitQC가 됩니다.",
    state: "PrepareQC(s, cut) → Confirm-Ack ×3 → CommitQC(s, cut)",
    evidence: "Gracious interval의 fast path는 모든 n개의 Prepare vote로 Confirm 단계를 생략할 수 있습니다.",
    boundary: "PoA와 PrepareQC와 CommitQC는 서로 다른 사실을 증명합니다.",
  },
  {
    title: "각 복제본이 cut까지의 빠진 history를 받은 뒤 같은 zipping 규칙으로 요청을 실행합니다.",
    state: "SYNC missing suffix → zip(A history, B history, C history, D history)",
    evidence: "last-commit보다 뒤인 각 lane의 gap-free suffix만 새 로그에 넣습니다.",
    boundary: "Cut 커밋과 payload 동기화, 결정적 실행, 클라이언트 응답은 각각 확인해야 합니다.",
  },
] as const;

const LANE_NOTES = LANE_STATES.map((state) => `${state.title} ${state.evidence} ${state.boundary}`);

export function AutobahnLaneCutViz() {
  const scenes = useAnimatedScenes(LANE_LABELS.length, 6200, { loop: false });
  const state = LANE_STATES[scenes.active];

  return (
    <VizFrame
      eyebrow="Autobahn 확대 · 데이터 전파와 순서 결정 분리"
      title="PoA가 데이터를 가리키고 CommitQC가 cut의 순서를 확정합니다"
      description="가용성 인증, 합의 인증, payload 동기화와 실행을 한 단계로 합치지 않습니다."
      note="Autobahn v4 §5.1–5.3과 Figure 2–4를 바탕으로 n=4, f=1에 맞춘 설명용 값입니다."
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div id={scenes.playbackId} data-viz-live-only tabIndex={0} role="group" aria-label="Autobahn lane과 cut의 다섯 단계" onKeyDown={scenes.onKeyDown} className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
        <div data-viz-scene-stage className="min-h-[420px]">
          <p className="text-[10px] font-black text-primary">{String(scenes.active + 1).padStart(2, "0")} · {LANE_LABELS[scenes.active]}</p>
          <h4 className="mt-2 min-h-14 break-keep text-base font-bold leading-7">{state.title}</h4>
          <div className="mt-3 space-y-px">
            <StateBand label="현재 상태">{state.state}</StateBand>
            <StateBand label="증거의 역할">{state.evidence}</StateBand>
            <StateBand label="구분할 경계">{state.boundary}</StateBand>
          </div>
          <SceneProgress active={scenes.active} total={LANE_LABELS.length} />
        </div>
        <AnimatedSceneControls {...scenes} labels={LANE_LABELS} controlLabels={LANE_LABELS} playLabel="Autobahn 흐름 재생" />
      </div>
      <StaticSceneList labels={LANE_LABELS} notes={LANE_NOTES} />
    </VizFrame>
  );
}

const COMPARISON_ROWS = [
  ["데이터가 들어오는 곳", "주 노드의 batch", "주 노드의 block", "복제본별 lane car"],
  ["첫 인증의 뜻", "Prepared: 같은 순번·요청을 지지", "QC: 한 block을 2f+1표가 지지", "PoA: data를 정상 복제본 한 곳 이상이 보유"],
  ["커밋 경계", "2f+1 COMMIT을 로컬에서 확인", "연속 부모 QC의 three-chain", "Cut의 CommitQC 뒤 history 동기화·결정적 실행"],
  ["장애 때 넘기는 상태", "Checkpoint·prepared certificate", "Highest QC·locked branch", "TC의 highQC·f+1 highProp과 계속 자라는 lanes"],
  ["직접 재야 할 비용", "Phase별 bytes·서명 검증·view-change 지연", "QC chain latency·payload bytes·pacemaker recovery", "Car/PoA 비용·cut latency·SYNC bytes·backlog 회복"],
  ["이 표로 알 수 없는 것", "현대 구현의 고정 성능", "모든 변형의 동일한 chain length", "다른 장비에서도 논문 수치가 유지된다는 보장"],
] as const;

export function BFTAxisTableViz() {
  return (
    <ResponsiveVizTable
      columns={["비교축", "PBFT", "HotStuff", "Autobahn"]}
      rows={COMPARISON_ROWS}
      desktopMinWidthClassName="min-w-[920px]"
    />
  );
}
