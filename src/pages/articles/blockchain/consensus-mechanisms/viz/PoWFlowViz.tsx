import {
  DistributedFrame,
  Flow,
} from "../../distributed-systems/viz/DistributedVizPrimitives";
import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

export default function PoWFlowViz() {
  return (
    <DistributedFrame
      eyebrow="PoW chain"
      title="Proof를 찾는 것과 canonical history를 고르는 것은 다른 단계다"
      description="유효한 block 두 개가 동시에 전파될 수 있으므로 node는 proof 검증 뒤 누적 work 기반 fork choice를 적용합니다."
      note="Confirmation 수는 reorg probability에 대한 운영 정책이지 절대 finality theorem이 아닙니다."
    >
      <Flow
        steps={[
          { label: "01 propose", title: "Target proof 발견", body: "Miner가 유효한 block header와 transaction body를 전파합니다." },
          { label: "02 validate", title: "모든 규칙 재검증", body: "Node가 hash target·parent·transaction·state-transition 규칙을 독립 검사합니다." },
          { label: "03 select", title: "누적 work 비교", body: "경쟁 branch 가운데 chainwork가 더 큰 valid branch를 canonical head로 봅니다." },
          { label: "04 confirm", title: "Reorg 위험 추적", body: "후속 work가 쌓일수록 뒤집힐 확률은 낮아지지만 0이라고 단정하지 않습니다." },
        ]}
      />
    </DistributedFrame>
  );
}

const VERIFY_LABELS = ["입력", "부모", "거래", "해시", "타깃", "선택"] as const;
const VERIFY_SCENES = [
  {
    code: "input(P, X, proof, T=16)",
    heading: "후보 X를 받았다고 바로 장부에 쓰지 않습니다",
    detail: "부모 P, 잔액 100에서 10을 보내는 후보 X, 계산 증거와 설명용 target을 검증 대기 상태로 둡니다.",
    candidate: "X · 검증 대기",
    ledger: "잔액 100 · 그대로",
    proof: "아직 세지 않음",
    decision: "head=P",
  },
  {
    code: "require X.parent == hash(P)",
    heading: "먼저 X가 현재 부모 P에 제대로 이어지는지 봅니다",
    detail: "부모가 다르면 거래 계산이나 hash 조건을 보기 전에 이 경로에서 거절합니다.",
    candidate: "부모 P · 일치",
    ledger: "잔액 100 · 그대로",
    proof: "아직 세지 않음",
    decision: "head=P",
  },
  {
    code: "state1 = apply(state0,\n  X.transactions)",
    heading: "거래를 순서대로 실행해 잔액 90을 다시 계산합니다",
    detail: "많은 계산을 했더라도 잔액을 120으로 만드는 잘못된 후보라면 여기서 거절합니다.",
    candidate: "거래 규칙 · 통과",
    ledger: "100−10=90",
    proof: "아직 세지 않음",
    decision: "head=P",
  },
  {
    code: "h = hash(encode(X.header))",
    heading: "합의한 인코딩으로 같은 header hash를 다시 만듭니다",
    detail: "설명용 8비트 결과를 11이라고 놓습니다. 입력 byte가 달라지면 이 결과도 달라집니다.",
    candidate: "header byte · 고정",
    ledger: "후보 상태 90",
    proof: "h=11",
    decision: "아직 선택 안 함",
  },
  {
    code: "require h < T  // 11 < 16",
    heading: "Hash 11이 target 16보다 작으므로 proof를 인정합니다",
    detail: "이 한 번의 proof는 후보가 유효하다는 조건 중 하나입니다. 영구 확정을 뜻하지 않습니다.",
    candidate: "X · valid",
    ledger: "후보 상태 90",
    proof: "11<16 · 통과",
    decision: "fork choice 대기",
  },
  {
    code: "chainwork[X] = chainwork[P] + work(T)\nhead = best_valid_branch()",
    heading: "유효한 가지의 누적 작업량을 갱신해 현재 head를 고릅니다",
    detail: "X가 현재 가장 큰 누적 작업량을 가졌다고 놓습니다. 뒤에 더 큰 가지가 오면 head가 바뀔 수 있습니다.",
    candidate: "X · valid branch",
    ledger: "X를 따르면 90",
    proof: "누적 work 증가",
    decision: "현재 head=X",
  },
] as const;

const VERIFY_NOTES = VERIFY_LABELS.map((label, index) => `${label}. ${VERIFY_SCENES[index].heading} ${VERIFY_SCENES[index].detail}`);

export function PoWVerificationPseudocodeViz() {
  const scenes = useAnimatedScenes(VERIFY_SCENES.length, 6800, { loop: false });
  const scene = VERIFY_SCENES[scenes.active];

  return <VizFrame
    eyebrow="의사코드가 움직이는 검증 장부"
    title="코드 한 줄을 실행할 때 후보·잔액·증거·head가 어떻게 바뀌는지 봅니다"
    description="부모 확인부터 현재 가지 선택까지 한 줄씩 넘기며, 실패하면 어느 상태가 아직 바뀌지 않았는지도 함께 확인합니다."
    note="H=11과 T=16은 계산 흐름을 보여주기 위한 8비트 가정입니다. 실제 Bitcoin header·target·chainwork 규격은 고정 원문에 귀속합니다."
    documentFlow
    canvasClassName="p-3 sm:p-6"
  >
    <div id={scenes.playbackId} tabIndex={0} onKeyDown={scenes.onKeyDown} className="outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label="PoW 검증 의사코드 장면 탐색기">
      <div data-viz-live-only className="space-y-4">
        <div data-viz-scene-stage className="min-h-[32.5rem] space-y-4 sm:min-h-[21.25rem]">
          <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-6">
            {VERIFY_LABELS.map((label, index) => <div key={label} className={`border px-1 py-2 text-center text-[9px] font-black ${index === scenes.active ? "border-primary bg-primary/10" : index < scenes.active ? "border-foreground/30 bg-background" : "border-border bg-background text-muted-foreground"}`}>{index + 1}. {label}</div>)}
          </div>
          <div className="border border-border bg-foreground p-4 text-background">
            <p className="text-[10px] font-black text-primary-foreground/70">실행 중인 의사코드 · {scenes.active + 1}/{VERIFY_SCENES.length}</p>
            <code className="mt-2 block whitespace-pre-wrap break-words font-mono text-xs font-bold leading-6 sm:text-sm">{scene.code}</code>
          </div>
          <div className="border border-border bg-background p-4">
            <h4 className="break-keep text-base font-black leading-6">{scene.heading}</h4>
            <p className="mt-2 break-keep text-xs leading-6 text-muted-foreground">{scene.detail}</p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              ["후보", scene.candidate],
              ["장부", scene.ledger],
              ["계산 증거", scene.proof],
              ["현재 선택", scene.decision],
            ].map(([label, value]) => <div key={label} className="min-w-0 border border-border bg-background p-3">
              <p className="text-[9px] font-bold text-muted-foreground">{label}</p>
              <p className="mt-1 break-keep text-xs font-black leading-5">{value}</p>
            </div>)}
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={VERIFY_LABELS} controlLabels={VERIFY_LABELS} playLabel="검증 절차 재생" compact />
      </div>
      <StaticSceneList labels={VERIFY_LABELS} notes={VERIFY_NOTES} />
    </div>
  </VizFrame>;
}
