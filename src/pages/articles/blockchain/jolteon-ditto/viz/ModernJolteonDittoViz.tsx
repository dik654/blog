import type { ReactNode } from "react";

import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import ResponsiveVizTable from "@/components/viz/ResponsiveVizTable";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const COMMIT_LABELS = ["B10 제안", "B10 투표", "QC10", "B11 제안", "QC11", "B10 커밋"] as const;

const COMMIT_STATES = [
  { title: "Round 10의 주 노드가 Alice의 요청을 담은 B10을 제안합니다.", message: "B10 · parent QC9 · round 10", replicas: "QC9가 유효하고 B10이 그 블록을 직접 잇는지 확인합니다.", evidence: "B10은 아직 인증되지 않았습니다." },
  { title: "R0·R1·R2가 B10에 표를 보내고, 표는 다음 주 노드 L11로 모입니다.", message: "vote(B10, round 10) × 3", replicas: "n=4, f=1이므로 서로 다른 2f+1=3표가 필요합니다.", evidence: "같은 round와 블록 해시를 가리키는 표만 셉니다." },
  { title: "L11이 표 3개로 QC10을 만들고 round 11에 들어갑니다.", message: "QC10(B10)", replicas: "QC10을 보면 qchigh를 QC10까지 올립니다.", evidence: "B10은 인증됐지만 아직 커밋되지 않았습니다." },
  { title: "L11이 QC10을 부모 인증서로 넣어 B11을 제안합니다.", message: "B11 · parent QC10 · round 11", replicas: "B11이 B10을 직접 잇고 round가 정확히 하나 높은지 확인한 뒤 투표합니다.", evidence: "QC10은 B10을 지키는 one-chain lock이 됩니다." },
  { title: "다음 주 노드 L12가 B11의 표 3개로 QC11을 만듭니다.", message: "QC11(B11)", replicas: "B10과 B11은 서로 인접하고 round 10·11로 연속된 인증 블록입니다.", evidence: "두 인증 블록이 two-chain을 이룹니다." },
  { title: "QC11을 받은 복제본이 B10과 그 조상을 커밋합니다.", message: "commit(B10 and ancestors)", replicas: "B10의 요청을 정해진 순서로 실행하고 상태 결과를 확인합니다.", evidence: "커밋 규칙과 클라이언트 결과 전달은 별도 경계입니다." },
] as const;

const COMMIT_NOTES = COMMIT_STATES.map((state) => `${state.title} ${state.evidence}`);

const TIMEOUT_LABELS = ["주 노드 정지", "Timeout 전파", "TC11", "B12 제안", "안전 투표"] as const;

const TIMEOUT_STATES = [
  { title: "Round 11의 주 노드가 제안을 보내지 못해 타이머가 만료됩니다.", traffic: "새 QC 없음", owner: "각 복제본이 자신의 qchigh와 마지막 TC를 보관합니다.", guard: "타임아웃만으로 lock을 낮추거나 블록을 커밋하지 않습니다." },
  { title: "각 복제본이 round 11과 자신이 본 가장 높은 QC를 모든 복제본에게 보냅니다.", traffic: "timeout(round 11, qchigh) · 전체 전파", owner: "한 복제본의 timeout은 view 전환의 충분한 증거가 아닙니다.", guard: "같은 round에 속한 서로 다른 발신자의 메시지만 셉니다." },
  { title: "Timeout 3개가 모이면 TC11이 만들어집니다.", traffic: "TC11 = timeout 3개 + 각 qchigh", owner: "TC11은 다음 round의 제안이 따라야 할 안전 하한을 정합니다.", guard: "TC11 자체는 블록 인증서나 커밋 증거가 아닙니다." },
  { title: "L12가 TC11 안에서 가장 높은 QC를 고르고 그 블록을 잇는 B12를 제안합니다.", traffic: "B12 · TC11 · max(qchigh in TC11)", owner: "Jolteon은 TC 전체를 제안에 붙이므로 장애 뒤 제안 크기가 O(n)입니다.", guard: "주 노드가 임의로 더 낮은 QC를 고를 수 없습니다." },
  { title: "복제본은 B12의 round와 QC가 TC11이 정한 조건을 만족할 때만 투표합니다.", traffic: "B12.r = TC11.r + 1 · B12.qc ≥ TC11의 최고 QC", owner: "안전 조건을 통과한 뒤 표는 다음 주 노드에게 모입니다.", guard: "장애 round를 건너뛰어도 기존 커밋 가지보다 아래로 내려가지 않습니다." },
] as const;

const TIMEOUT_NOTES = TIMEOUT_STATES.map((state) => `${state.title} ${state.guard}`);

const FALLBACK_LABELS = ["Timeout 3개", "Proof 전파", "Ack·더 높은 QC", "MVBA 입력", "유효성 검사", "MVBA 결정", "정상 경로 복귀"] as const;

const FALLBACK_STATES = [
  { title: "같은 view의 timeout 3개를 받은 복제본이 fallback을 엽니다.", code: "if valid_timeouts(view) >= 2*f+1: fallback = true", state: "fallback=true · vcur=v+1", traffic: "Timeout에는 현재 view의 서명 조각과 qchigh가 들어 있습니다.", result: "한 복제본의 로컬 timeout만으로는 열리지 않습니다." },
  { title: "각 복제본이 새 view와 자신의 qchigh를 담은 proof 메시지를 모든 복제본에게 보냅니다.", code: "multicast(proof(vcur, qchigh))", state: "proof(vcur, qchigh)", traffic: "후보 블록을 만들기 전에 다른 정상 복제본의 잠금 상태와 비교합니다.", result: "아직 MVBA를 호출하지 않습니다." },
  { title: "받은 QC가 내 qchigh보다 낮지 않으면 ack하고, 더 낮으면 내가 아는 높은 QC를 돌려줍니다.", code: "reply(receivedQC >= qchigh ? ack : higherQC)", state: "ack share 또는 higherQC", traffic: "Proof 서명 3개가 모이거나 더 높은 QC를 하나 받으면 다음 단계로 갑니다.", result: "낮은 인증서의 가지가 후보가 되는 것을 막습니다." },
  { title: "복제본은 선택한 qchigh를 직접 잇는 후보 블록을 만들어 MVBA에 넣습니다.", code: "mvba_input(child_of(highestQC), proof_or_higherQC)", state: "B=[parent qchigh, qchigh.r+1, vcur]", traffic: "Proof 서명 또는 더 높은 QC 경로를 함께 전달합니다.", result: "각 복제본이 후보를 하나씩 낼 수 있습니다." },
  { title: "상태를 반영한 유효성 검사가 view·부모 QC·round·proof를 함께 확인합니다.", code: "external_validity(B, proof, local_qchigh)", state: "external validity(B, proof, local qchigh)", traffic: "내가 아는 qchigh보다 낮은 후보는 MVBA의 유효한 출력이 될 수 없습니다.", result: "정상 경로의 lock 안전성을 fallback에서도 이어 갑니다." },
  { title: "MVBA가 유효한 블록 B 하나를 결정하면 B와 그 조상을 커밋합니다.", code: "on_decide(B): commit(B_and_ancestors)", state: "MVBA output=B · commit ancestors", traffic: "모든 정상 복제본이 같은 출력에 도달한다는 MVBA 합의를 사용합니다.", result: "결정 블록 B의 인증서는 아직 만들어야 합니다." },
  { title: "복제본이 B의 서명 조각을 전파하고, B가 인증될 때까지 기다린 뒤 정상 경로로 돌아갑니다.", code: "vote(B); fallback=false; wait_until_certified(B)", state: "fallback=false · wait QC(B)", traffic: "vcur와 마지막 투표 round를 맞추고 다음 주 노드 경로를 엽니다.", result: "결정·인증·실행·클라이언트 결과를 한 단계로 뭉치지 않습니다." },
] as const;

const FALLBACK_NOTES = FALLBACK_STATES.map((state) => `${state.title} ${state.result}`);

function StateRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-px bg-border p-px sm:grid-cols-[9rem_minmax(0,1fr)]">
      <strong className="bg-background p-3 text-[10px] text-muted-foreground">{label}</strong>
      <p className="min-w-0 break-keep bg-background p-3 text-xs font-bold leading-5">{children}</p>
    </div>
  );
}

function SceneProgress({ active, total }: { active: number; total: number }) {
  return <div className="mt-4 grid gap-1" style={{ gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))` }} aria-hidden="true">{Array.from({ length: total }, (_, index) => <div key={index} className={`h-2 ${index <= active ? "bg-primary" : "bg-border"}`} />)}</div>;
}

export function JolteonPathViz() {
  const scenes = useAnimatedScenes(COMMIT_LABELS.length, 5800, { loop: false });
  const state = COMMIT_STATES[scenes.active];
  return (
    <VizFrame eyebrow="Jolteon 정상 경로 · n=4, f=1" title="B10은 연속된 두 인증 블록이 보일 때 커밋됩니다" description="블록 높이만 보지 않고 round, 부모 QC와 인증서가 실제로 전달되는 순서를 따라갑니다." note="Jolteon and Ditto 논문 Figure 2의 정상 경로를 Alice의 요청에 적용한 설명용 흐름입니다." documentFlow canvasClassName="p-2.5 sm:p-5">
      <div id={scenes.playbackId} data-viz-live-only tabIndex={0} role="group" aria-label="Jolteon two-chain 커밋의 여섯 단계" onKeyDown={scenes.onKeyDown} className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
        <div data-viz-scene-stage className="min-h-[34rem] sm:min-h-[21rem]">
          <p className="text-[10px] font-black text-primary">{String(scenes.active + 1).padStart(2, "0")} · {COMMIT_LABELS[scenes.active]}</p>
          <h4 className="mt-2 min-h-14 break-keep text-base font-bold leading-7">{state.title}</h4>
          <div className="mt-3 space-y-px"><StateRow label="메시지·인증서">{state.message}</StateRow><StateRow label="복제본의 판단">{state.replicas}</StateRow><StateRow label="이 단계의 결과">{state.evidence}</StateRow></div>
          <SceneProgress active={scenes.active} total={COMMIT_LABELS.length} />
        </div>
        <AnimatedSceneControls {...scenes} labels={COMMIT_LABELS} controlLabels={COMMIT_LABELS} playLabel="Jolteon 커밋 재생" />
      </div>
      <StaticSceneList labels={COMMIT_LABELS} notes={COMMIT_NOTES} />
    </VizFrame>
  );
}

export function JolteonTimeoutViz() {
  const scenes = useAnimatedScenes(TIMEOUT_LABELS.length, 6000, { loop: false });
  const state = TIMEOUT_STATES[scenes.active];
  return (
    <VizFrame eyebrow="Jolteon 장애 round · TC" title="TC는 커밋 증거가 아니라 다음 제안의 안전 하한입니다" description="Timeout 2f+1개에 들어 있는 qchigh를 모두 비교해, 장애 뒤 제안이 기존 커밋 가지보다 아래로 내려가지 못하게 합니다." documentFlow canvasClassName="p-2.5 sm:p-5">
      <div id={scenes.playbackId} data-viz-live-only tabIndex={0} role="group" aria-label="Jolteon timeout certificate의 다섯 단계" onKeyDown={scenes.onKeyDown} className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
        <div data-viz-scene-stage className="min-h-[35rem] sm:min-h-[22rem]">
          <p className="text-[10px] font-black text-primary">{String(scenes.active + 1).padStart(2, "0")} · {TIMEOUT_LABELS[scenes.active]}</p>
          <h4 className="mt-2 min-h-14 break-keep text-base font-bold leading-7">{state.title}</h4>
          <div className="mt-3 space-y-px"><StateRow label="전달되는 정보">{state.traffic}</StateRow><StateRow label="증거의 역할">{state.owner}</StateRow><StateRow label="안전 조건">{state.guard}</StateRow></div>
          <SceneProgress active={scenes.active} total={TIMEOUT_LABELS.length} />
        </div>
        <AnimatedSceneControls {...scenes} labels={TIMEOUT_LABELS} controlLabels={TIMEOUT_LABELS} playLabel="Jolteon timeout 재생" />
      </div>
      <StaticSceneList labels={TIMEOUT_LABELS} notes={TIMEOUT_NOTES} />
    </VizFrame>
  );
}

export function DittoFallbackViz() {
  const scenes = useAnimatedScenes(FALLBACK_LABELS.length, 6400, { loop: false });
  const state = FALLBACK_STATES[scenes.active];
  return (
    <VizFrame eyebrow="Ditto · 비동기 fallback" title="Timeout 뒤에도 proof와 상태 검사를 거쳐 MVBA에 들어갑니다" description="Fallback을 하나의 검은 상자로 그리지 않고, 어떤 후보가 유효해지고 결정 블록이 어떻게 정상 경로로 돌아오는지 따라갑니다." documentFlow canvasClassName="p-2.5 sm:p-5">
      <div id={scenes.playbackId} data-viz-live-only tabIndex={0} role="group" aria-label="Ditto fallback의 일곱 단계" onKeyDown={scenes.onKeyDown} className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
        <div data-viz-scene-stage className="min-h-[45rem] sm:min-h-[27rem]">
          <p className="text-[10px] font-black text-primary">{String(scenes.active + 1).padStart(2, "0")} · {FALLBACK_LABELS[scenes.active]}</p>
          <h4 className="mt-2 min-h-14 break-keep text-base font-bold leading-7">{state.title}</h4>
          <code className="mt-3 block whitespace-pre-wrap break-words border border-border bg-muted/40 p-3 text-xs font-bold leading-6">{state.code}</code>
          <div className="mt-3 space-y-px"><StateRow label="현재 상태">{state.state}</StateRow><StateRow label="메시지 흐름">{state.traffic}</StateRow><StateRow label="이 단계의 결과">{state.result}</StateRow></div>
          <SceneProgress active={scenes.active} total={FALLBACK_LABELS.length} />
        </div>
        <AnimatedSceneControls {...scenes} labels={FALLBACK_LABELS} controlLabels={FALLBACK_LABELS} playLabel="Ditto fallback 재생" />
      </div>
      <StaticSceneList labels={FALLBACK_LABELS} notes={FALLBACK_NOTES} />
    </VizFrame>
  );
}

const FAILURE_ROWS = [
  ["QC와 TC가 모두 2f+1", "역할도 같다고 오해", "QC는 블록 인증, TC는 다음 제안의 안전 하한"],
  ["인증 블록 두 개", "Round가 건너뛰거나 형제 블록", "직접 부모이며 round가 연속일 때만 커밋"],
  ["로컬 timeout 한 번", "혼자 fallback 진입", "같은 view의 timeout 2f+1개 확인"],
  ["MVBA가 B 결정", "즉시 클라이언트 성공", "B와 조상 커밋, B 재인증, 결정적 실행 확인"],
  ["Aptos v1.48.6 코드", "논문 Ditto 구현으로 단정", "고정 release의 실제 메시지만 확인하고 논문과 분리"],
];

export function JolteonDittoFailureTable() {
  return <ResponsiveVizTable columns={["관찰", "잘못된 결론", "확인할 경계"]} rows={FAILURE_ROWS} desktopMinWidthClassName="min-w-[800px]" />;
}
