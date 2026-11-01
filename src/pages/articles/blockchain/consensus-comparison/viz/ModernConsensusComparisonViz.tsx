import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import ResponsiveVizTable from "@/components/viz/ResponsiveVizTable";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const FAMILY_ROWS = [
  ["Classical BFT", "고정 validator와 voting power", "Proposal과 quorum certificate", "전제 안에서 충돌 결정을 금지"],
  ["DAG-BFT", "고정 또는 epoch validator", "Data certificate와 anchor order", "Order certificate는 결정적일 수 있음"],
  ["Nakamoto PoW", "열린 참여와 hash power", "유효한 누적 work chain", "확인 깊이에 따라 reorg 위험 감소"],
  ["Sampling", "설계별 peer 집합과 표본", "반복 poll의 선호와 confidence", "Parameter와 전제에 따른 오류 확률"],
] as const;

export function ConsensusFamilyMatrixViz() {
  return <VizFrame
    eyebrow="비교 전에 맞출 네 질문"
    title="이름이 아니라 참가 자격·영향력·증거·완료 의미를 나란히 놓습니다"
    description="같은 ‘합의’라는 이름을 써도 무엇을 세고 무엇을 완료로 부르는지가 다릅니다."
    note="각 행은 계열의 공통 골격입니다. 개별 프로토콜의 validator 교체, finality gadget, leader rule과 복구 절차는 해당 글에서 다시 확인해야 합니다."
    documentFlow
    canvasClassName="p-0"
  >
    <ResponsiveVizTable columns={["계열", "누가 영향력을 갖는가", "무슨 증거로 결정하는가", "완료의 의미"]} rows={FAMILY_ROWS} desktopMinWidthClassName="min-w-[900px]" />
  </VizFrame>;
}

const TRACE_LABELS = ["요청", "참가", "전파", "증거", "판정", "서비스"] as const;
const TRACE_HEADINGS = [
  "사용자가 같은 송금 요청을 제출합니다",
  "각 계열은 먼저 영향력을 셀 대상을 정합니다",
  "요청과 표가 서로 다른 방식으로 퍼집니다",
  "같은 요청을 지지하는 증거의 모양이 달라집니다",
  "합의 계층이 말할 수 있는 완료 지점에 도달합니다",
  "상태 실행과 사용자 통지는 다시 확인해야 합니다",
] as const;
const TRACE_DETAILS = [
  "아직 어느 node도 이 요청의 순서나 결과를 확정하지 않았습니다.",
  "Validator 수·stake·hash power·peer sample을 한 숫자로 섞지 않습니다.",
  "받았다는 사실은 검증·정족수·chain 선택·반복 poll을 대신하지 않습니다.",
  "QC, DAG anchor, cumulative work, sampling confidence는 서로 바꿔 쓸 수 없는 증거입니다.",
  "결정적 certificate와 확인 깊이, 로컬 sampling decision의 의미를 따로 기록합니다.",
  "합의 결과가 생겨도 deterministic apply, state root, client receipt는 별도 단계입니다.",
] as const;

type TraceFamily = {
  name: string;
  influence: string;
  states: readonly string[];
  evidence: readonly string[];
};

const TRACE_FAMILIES: readonly TraceFamily[] = [
  {
    name: "Classical BFT",
    influence: "고정 validator · 3f+1 또는 weighted committee",
    states: ["mempool 접수", "committee 확인", "proposal·vote", "QC·lock", "commit", "state apply"],
    evidence: ["로컬 접수", "membership snapshot", "서명된 vote", "quorum certificate", "commit certificate", "state root·reply"],
  },
  {
    name: "DAG-BFT",
    influence: "epoch validator · data와 order 역할 분리",
    states: ["worker 접수", "epoch 확인", "batch·vertex", "data cert·anchor", "linear order", "payload apply"],
    evidence: ["로컬 접수", "epoch membership", "batch digest와 parents", "availability·anchor evidence", "ordered prefix", "payload·state receipt"],
  },
  {
    name: "Nakamoto PoW",
    influence: "열린 miner · hash power",
    states: ["mempool 접수", "work 경쟁", "block relay", "chainwork", "k confirmations", "wallet 반영"],
    evidence: ["로컬 접수", "유효 PoW", "유효 block", "가장 큰 누적 work", "depth와 reorg model", "canonical state·policy"],
  },
  {
    name: "Sampling",
    influence: "반복해서 뽑은 peer 표본",
    states: ["후보 접수", "sample 대상", "반복 poll", "선호·confidence", "local decision", "state apply"],
    evidence: ["로컬 접수", "sampling rule", "poll responses", "연속·누적 confidence", "parameter 아래 decision", "state root·reply"],
  },
] as const;

const TRACE_NOTES = TRACE_LABELS.map((label, index) => `${label}. ${TRACE_HEADINGS[index]} ${TRACE_DETAILS[index]}`);

export function ConsensusRequestTraceViz() {
  const scenes = useAnimatedScenes(TRACE_LABELS.length, 7200, { loop: false });
  const active = scenes.active;

  return <VizFrame
    eyebrow="같은 요청 · 서로 다른 합의 증거"
    title="송금 하나가 네 계열에서 어디까지 가야 완료로 보이는지 추적합니다"
    description="장면을 넘기면 각 계열의 현재 상태와 그 상태를 증명하는 자료가 함께 바뀝니다."
    note="설명을 위한 공통 요청입니다. 실제 protocol은 membership 변경, proposer 선택, transaction validity와 state execution을 각기 다르게 구현합니다."
    documentFlow
    canvasClassName="p-3 sm:p-6"
  >
    <div id={scenes.playbackId} tabIndex={0} onKeyDown={scenes.onKeyDown} className="outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label="합의 계열별 요청 처리 장면 탐색기">
      <div data-viz-live-only className="space-y-4">
        <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-6">
          {TRACE_LABELS.map((label, index) => <div key={label} className={`border px-1 py-2 text-center text-[9px] font-black transition-colors duration-300 ${index === active ? "border-primary bg-primary/10" : index < active ? "border-foreground/30 bg-background" : "border-border bg-background text-muted-foreground"}`}>{index + 1}. {label}</div>)}
        </div>
        <div className="border border-border bg-background p-4">
          <p className="text-[10px] font-black text-primary">장면 {active + 1} / {TRACE_LABELS.length}</p>
          <h4 className="mt-2 break-keep text-base font-black leading-6">{TRACE_HEADINGS[active]}</h4>
          <p className="mt-2 break-keep text-xs leading-6 text-muted-foreground">{TRACE_DETAILS[active]}</p>
        </div>
        <div className="space-y-3">
          {TRACE_FAMILIES.map((family) => <div key={family.name} className="border border-border bg-background p-4">
            <div className="grid min-w-0 grid-cols-[5.75rem_minmax(0,1fr)] items-start gap-3 sm:grid-cols-[7.5rem_minmax(0,1fr)]">
              <div>
                <h5 className="text-xs font-black">{family.name}</h5>
                <p className="mt-1 break-keep text-[9px] leading-4 text-muted-foreground">{family.influence}</p>
              </div>
              <div className="min-w-0">
                <div className="relative h-1.5 bg-border/60" aria-label={`${family.name} 진행 ${active + 1}/${TRACE_LABELS.length}`}>
                  <span className="absolute inset-y-0 left-0 bg-primary transition-[width] duration-500" style={{ width: `${((active + 1) / TRACE_LABELS.length) * 100}%` }} />
                  <span className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 border border-primary bg-background transition-[left] duration-500" style={{ left: `${((active + 0.5) / TRACE_LABELS.length) * 100}%` }} />
                </div>
                <div className="mt-3 grid min-w-0 grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-2">
                  <div className="border-l-2 border-primary pl-2"><p className="text-[9px] font-bold text-muted-foreground">현재 상태</p><p className="mt-1 break-keep text-xs font-black">{family.states[active]}</p></div>
                  <div className="border-l border-border pl-2"><p className="text-[9px] font-bold text-muted-foreground">확인할 증거</p><p className="mt-1 break-keep text-xs font-semibold">{family.evidence[active]}</p></div>
                </div>
              </div>
            </div>
          </div>)}
        </div>
        <AnimatedSceneControls {...scenes} labels={TRACE_LABELS} controlLabels={TRACE_LABELS} playLabel="네 경로 재생" compact />
      </div>
      <StaticSceneList labels={TRACE_LABELS} notes={TRACE_NOTES} />
    </div>
  </VizFrame>;
}

const FAULT_LABELS = ["정상", "분리", "분리 중", "연결 복구", "다시 완료"] as const;
const FAULT_HEADINGS = [
  "모든 참가자가 같은 network view를 공유합니다",
  "Network가 두 집합으로 갈라집니다",
  "같은 partition도 계열마다 다른 중간 상태를 만듭니다",
  "연결이 돌아와도 즉시 같은 완료 상태가 되지는 않습니다",
  "복구가 끝났다는 증거를 계열별로 다시 확인합니다",
] as const;

const FAULT_STATES = [
  { classical: ["vote 전달 가능", "정상 QC 경로"], dag: ["batch와 vertex 전달", "data·order 경로 모두 진행"], pow: ["한 canonical tip", "누적 work가 한 방향으로 증가"], sampling: ["표본이 전체 view를 반영", "선호 confidence 증가"] },
  { classical: ["양쪽의 quorum power를 계산", "quorum 없는 쪽은 정지"], dag: ["각 side에서 vertex가 생길 수 있음", "anchor quorum은 별도"], pow: ["양쪽에서 block을 만들 수 있음", "두 branch가 동시에 자람"], sampling: ["표본 pool이 편향될 수 있음", "독립성·adversary 전제 점검"] },
  { classical: ["정족수가 없으면 commit 없음", "정지는 safety 실패가 아님"], dag: ["data certificate와 order가 갈릴 수 있음", "certificate를 finality로 승격 금지"], pow: ["각 side의 local tip가 달라짐", "낮은 depth 거래는 reorg 가능"], sampling: ["서로 다른 local confidence 가능", "오류 한계는 parameter에 의존"] },
  { classical: ["timeout·새 leader·상태 동기화", "stale vote를 거절"], dag: ["누락 vertex·payload fetch", "anchor와 order를 다시 계산"], pow: ["두 branch의 누적 work 비교", "덜 무거운 branch를 되돌림"], sampling: ["반복 poll로 선호를 재수렴", "구현별 conflict 처리 확인"] },
  { classical: ["새 commit certificate", "state root와 client reply 확인"], dag: ["공통 ordered prefix", "payload apply receipt 확인"], pow: ["선택 chain과 새 confirmation depth", "reorg된 요청 재확인"], sampling: ["local decision과 network 상태", "parameter·실측 오류를 분리"] },
] as const;

const FAULT_NOTES = FAULT_LABELS.map((label, index) => `${label}. ${FAULT_HEADINGS[index]} Classical BFT, DAG-BFT, Nakamoto PoW, sampling 계열의 중간 상태와 복구 증거를 따로 확인합니다.`);
const FAULT_FAMILIES = [["classical", "Classical BFT"], ["dag", "DAG-BFT"], ["pow", "Nakamoto PoW"], ["sampling", "Sampling"]] as const;

export function ConsensusFaultTraceViz() {
  const scenes = useAnimatedScenes(FAULT_LABELS.length, 7600, { loop: false });
  const active = scenes.active;
  const state = FAULT_STATES[active];

  return <VizFrame
    eyebrow="같은 network partition · 다른 복구 의미"
    title="멈춤·branch 경쟁·표본 편향을 하나의 장애 이름으로 뭉개지 않습니다"
    description="분리부터 복구까지 넘기며 각 계열에서 어떤 상태가 남고 무엇을 다시 증명해야 하는지 봅니다."
    note="이 그림은 공통 장애 질문을 만드는 지도입니다. 개별 protocol의 quorum, mining, sampling parameter와 rollback 규칙을 대신하지 않습니다."
    documentFlow
    canvasClassName="p-3 sm:p-6"
  >
    <div id={scenes.playbackId} tabIndex={0} onKeyDown={scenes.onKeyDown} className="outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label="합의 계열별 network partition 복구 장면 탐색기">
      <div data-viz-live-only className="space-y-4">
        <div className="grid grid-cols-5 gap-1.5">
          {FAULT_LABELS.map((label, index) => <div key={label} className={`border px-1 py-2 text-center text-[9px] font-black ${index === active ? "border-primary bg-primary/10" : index < active ? "border-foreground/30 bg-background" : "border-border bg-background text-muted-foreground"}`}>{index + 1}. {label}</div>)}
        </div>
        <div className="border border-border bg-background p-4">
          <p className="text-[10px] font-black text-primary">장면 {active + 1} / {FAULT_LABELS.length}</p>
          <h4 className="mt-2 break-keep text-base font-black leading-6">{FAULT_HEADINGS[active]}</h4>
          <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-center text-[10px] font-black">
            <div className="border border-border py-3">Network A</div>
            <div className={`h-px w-8 ${active === 0 || active >= 3 ? "bg-primary" : "border-t border-dashed border-destructive"}`} />
            <div className="border border-border py-3">Network B</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {FAULT_FAMILIES.map(([key, label]) => {
            const lines = state[key];
            return <div key={key} className="border border-border bg-background p-4">
              <h5 className="text-xs font-black">{label}</h5>
              <p className="mt-3 border-l-2 border-primary pl-3 text-xs font-semibold leading-5">{lines[0]}</p>
              <p className="mt-2 break-keep pl-3 text-[10px] leading-5 text-muted-foreground">{lines[1]}</p>
            </div>;
          })}
        </div>
        <AnimatedSceneControls {...scenes} labels={FAULT_LABELS} controlLabels={FAULT_LABELS} playLabel="분리와 복구 재생" compact />
      </div>
      <StaticSceneList labels={FAULT_LABELS} notes={FAULT_NOTES} />
    </div>
  </VizFrame>;
}

const LATENCY_CASES = [
  { name: "후보 A", values: [10, 120, 80, 30], labels: ["batch 10", "data 120", "order 80", "execute 30"], note: "Data 전달이 가장 긴 구간" },
  { name: "후보 B", values: [60, 50, 120, 10], labels: ["batch 60", "data 50", "order 120", "execute 10"], note: "Batch 대기와 order round가 긴 구간" },
] as const;
const LATENCY_COLORS = ["bg-primary", "bg-foreground/75", "bg-primary/45", "bg-muted-foreground/45"] as const;

export function ConsensusLatencyPathViz() {
  return <VizFrame
    eyebrow="같은 240ms · 다른 병목"
    title="총합만 같아도 어디서 기다렸는지 알면 바꿔야 할 계층이 달라집니다"
    description="같은 client 위치와 payload를 가정한 설명용 critical path입니다."
    note="실제 data와 order가 겹쳐 실행되면 단순 합이 아니라 계측한 critical path만 셉니다. Queue, finality policy와 tail percentile도 별도로 기록해야 합니다."
    documentFlow
    canvasClassName="p-4 sm:p-6"
  >
    <div className="space-y-6">
      {LATENCY_CASES.map((candidate) => {
        const total = candidate.values.reduce((sum, value) => sum + value, 0);
        return <div key={candidate.name} className="border border-border bg-background p-4">
          <div className="flex items-start justify-between gap-4">
            <div><h4 className="text-xs font-black">{candidate.name}</h4><p className="mt-1 text-[10px] text-muted-foreground">{candidate.note}</p></div>
            <strong className="font-mono text-sm">{total}ms</strong>
          </div>
          <div className="mt-4 flex h-10 w-full overflow-hidden border border-border">
            {candidate.values.map((value, index) => <div key={candidate.labels[index]} className={`flex min-w-0 items-center justify-center px-1 text-center text-[9px] font-black text-background ${LATENCY_COLORS[index]}`} style={{ width: `${(value / total) * 100}%` }} title={`${candidate.labels[index]}ms`}><span className="break-keep">{candidate.labels[index]}</span></div>)}
          </div>
        </div>;
      })}
      <div className="grid grid-cols-2 gap-px bg-border p-px text-center text-xs">
        <div className="bg-background p-3"><p className="text-[9px] text-muted-foreground">A를 먼저 볼 계층</p><strong className="mt-1 block">전파·storage·fan-out</strong></div>
        <div className="bg-background p-3"><p className="text-[9px] text-muted-foreground">B를 먼저 볼 계층</p><strong className="mt-1 block">batch·round·timeout</strong></div>
      </div>
    </div>
  </VizFrame>;
}

const SELECTION_STEPS = [
  ["1", "영향력", "누가 vote·work·sample을 만들고 Sybil을 어떻게 제한하는가"],
  ["2", "실패", "Crash·Byzantine·partition 중 무엇을 견뎌야 하는가"],
  ["3", "완료", "Certificate·confirmation depth·local decision 중 무엇을 고객 약속으로 쓰는가"],
  ["4", "실험", "같은 payload·부하·장애에서 conflict 0 뒤 latency·cost·recovery를 잰다"],
] as const;

export function ConsensusSelectionFlowViz() {
  return <VizFrame
    eyebrow="선택 순서"
    title="성능 숫자보다 먼저 네 결정을 확정합니다"
    description="앞 질문의 답이 달라지면 뒤의 후보군과 측정 지표도 달라집니다."
    documentFlow
    canvasClassName="p-4 sm:p-6"
  >
    <div className="grid gap-3">
      {SELECTION_STEPS.map(([n, title, detail], index) => <div key={n} className="grid min-w-0 grid-cols-[2.5rem_minmax(0,1fr)] border border-border bg-background">
        <div className={`flex items-center justify-center font-mono text-xs font-black ${index === 3 ? "bg-primary text-primary-foreground" : "border-r border-border text-primary"}`}>{n.padStart(2, "0")}</div>
        <div className="min-w-0 p-3 sm:grid sm:grid-cols-[5rem_minmax(0,1fr)] sm:items-center sm:gap-3">
          <strong className="text-xs">{title}</strong>
          <p className="mt-1 break-keep text-[10px] leading-5 text-muted-foreground sm:mt-0">{detail}</p>
        </div>
      </div>)}
    </div>
  </VizFrame>;
}
