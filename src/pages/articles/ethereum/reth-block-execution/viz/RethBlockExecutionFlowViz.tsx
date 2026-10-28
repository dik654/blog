import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const labels = ["입력", "환경", "사전", "송금 1", "송금 2", "사후", "결과", "검증"] as const;

const notes = [
  "부모 상태에서 Alice 10 ETH, Bob 0 ETH, Carol 0 ETH를 읽고, 본문 순서가 고정된 단순 송금 두 건을 받습니다.",
  "Header와 ChainSpec으로 활성 fork, base fee, beneficiary, gas limit과 system-call context를 구성합니다. 아직 거래는 실행하지 않았습니다.",
  "활성 fork가 요구하는 blockhashes·beacon-root 같은 사전 system call을 먼저 적용합니다. 세 사용자 잔액 표에는 이 별도 계정 변화가 보이지 않습니다.",
  "첫 송금이 Alice에서 Bob으로 3 ETH를 옮기고 Alice가 21,000 gas의 0.000021 ETH를 냅니다. 첫 영수증의 cumulative gas는 21,000입니다.",
  "둘째 송금은 첫 결과의 Bob 잔액 3 ETH를 읽습니다. Bob이 Carol에게 2 ETH와 0.000021 ETH의 gas를 내며 cumulative gas는 42,000이 됩니다.",
  "본문이 끝난 뒤 fork가 요구하는 requests·withdrawals·reward 같은 사후 변경을 적용합니다. 적용 항목은 block 시각과 ChainSpec에 따라 달라집니다.",
  "Reth는 ordered receipts·requests·gas와 바뀐 계정의 original/present 값·reverts가 든 BundleState를 돌려줍니다. 이 단계는 아직 output을 검증하지 않았습니다.",
  "별도 consensus·payload validation이 gas used, receipts root, logs bloom, requests/BAL hash와 state root를 header의 약속과 비교합니다. 하나라도 다르면 canonical publish 전에 거절합니다.",
] as const;

const balances = [
  ["10.000000", "0.000000", "0.000000"],
  ["10.000000", "0.000000", "0.000000"],
  ["10.000000", "0.000000", "0.000000"],
  ["6.999979", "3.000000", "0.000000"],
  ["6.999979", "0.999979", "2.000000"],
  ["6.999979", "0.999979", "2.000000"],
  ["6.999979", "0.999979", "2.000000"],
  ["6.999979", "0.999979", "2.000000"],
] as const;

const activeDetail = [
  ["Parent state", "body order: Alice→Bob, Bob→Carol"],
  ["EvmEnv + context", "fork · base fee 1 gwei · gas limit"],
  ["Pre execution", "system account changes"],
  ["Receipt 0", "success · cumulative gas 21,000"],
  ["Receipt 1", "success · cumulative gas 42,000"],
  ["Post execution", "requests · withdrawals · reward"],
  ["BlockExecutionOutput", "result + BundleState"],
  ["Accept or reject", "header commitments와 대조"],
] as const;

export default function RethBlockExecutionFlowViz() {
  const scenes = useAnimatedScenes(labels.length, 9800, { loop: false });
  const active = scenes.active;
  const [alice, bob, carol] = balances[active];

  return (
    <VizFrame
      eyebrow="개념 경로 · 같은 블록의 두 송금"
      title="앞 거래의 결과가 다음 거래의 입력이 되고, 실행 뒤 별도 검증이 이어집니다"
      description="세 계정의 잔액과 cumulative gas를 고정해 입력·환경 구성·사전 변경·두 송금·사후 변경·결과 묶음·검증을 여덟 장면으로 따라갑니다."
      note="금액과 gas는 실행 순서를 설명하기 위한 fixture입니다. 대상 네트워크의 처리량·수수료 측정값이 아니며, system account 변화는 세 사용자 잔액 표에서 생략합니다."
      canvasClassName="flex flex-col justify-center px-2 py-0 sm:px-5 sm:py-0"
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-reth-block-execution-scene={active}
        tabIndex={0}
        role="group"
        aria-label="Reth가 부모 상태에서 블록을 실행하고 결과를 검증하는 과정"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div className="grid grid-cols-8 gap-1">
          {labels.map((label, index) => (
            <div key={label} className="min-w-0 text-center">
              <span className={`block h-1 ${index === active ? "bg-primary" : index < active ? "bg-primary/35" : "bg-border"}`} />
              <span className={`mt-1 block break-keep font-mono text-[8px] font-black ${index === active ? "text-foreground" : "text-muted-foreground"}`}>
                {String(index + 1).padStart(2, "0")}
                <span className="hidden md:inline"> · {label}</span>
              </span>
            </div>
          ))}
        </div>

        <div className="mt-3 border-y border-border py-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-mono text-[9px] font-black text-primary">{activeDetail[active][0]}</p>
              <p className="mt-1 break-keep text-xs font-bold leading-5">{activeDetail[active][1]}</p>
            </div>
            <span className={`shrink-0 border px-2 py-1 font-mono text-[9px] font-bold ${active === labels.length - 1 ? "border-emerald-500 text-emerald-700" : "border-border text-muted-foreground"}`}>
              {active === labels.length - 1 ? "검증 중" : "임시 실행"}
            </span>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-px bg-border p-px text-center">
          {[
            ["Alice", alice],
            ["Bob", bob],
            ["Carol", carol],
          ].map(([name, value]) => (
            <div key={name} className="min-w-0 bg-background px-2 py-3">
              <strong className="text-xs">{name}</strong>
              <span className="mt-1 block break-all font-mono text-[10px] text-primary sm:text-xs">{value}</span>
              <span className="block text-[9px] text-muted-foreground">ETH</span>
            </div>
          ))}
        </div>

        <div className="mt-3 grid grid-cols-[minmax(0,1fr)_2.5rem_minmax(0,1fr)] items-stretch gap-2 text-center">
          <div className={`border px-2 py-3 ${active === 3 ? "border-primary" : "border-border"}`}>
            <strong className="block break-keep text-xs">Alice → Bob · 3 ETH</strong>
            <span className="mt-1 block text-[9px] leading-4 text-muted-foreground">gas 21,000 · fee 0.000021</span>
          </div>
          <div className="flex items-center justify-center text-primary" aria-hidden>→</div>
          <div className={`border px-2 py-3 ${active === 4 ? "border-primary" : "border-border"}`}>
            <strong className="block break-keep text-xs">Bob → Carol · 2 ETH</strong>
            <span className="mt-1 block text-[9px] leading-4 text-muted-foreground">gas 21,000 · fee 0.000021</span>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-px bg-border p-px text-[10px] leading-4">
          <div className="bg-background p-2"><strong className="block text-xs">Receipts</strong><span className="text-muted-foreground">{active < 3 ? "0" : active === 3 ? "1" : "2"}건</span></div>
          <div className="bg-background p-2"><strong className="block text-xs">Gas used</strong><span className="text-muted-foreground">{active < 3 ? "0" : active === 3 ? "21,000" : "42,000"}</span></div>
          <div className="bg-background p-2"><strong className="block text-xs">State</strong><span className="text-muted-foreground">{active < 3 ? "parent" : active < 6 ? "overlay" : "bundle"}</span></div>
        </div>

        <p data-scene-note className="mt-3 h-32 border-l-2 border-primary/50 pl-3 text-xs leading-5 text-muted-foreground sm:h-auto sm:min-h-16 sm:pl-4 sm:text-sm sm:leading-6">
          <strong className="mb-1 block font-mono text-[9px] text-primary">{String(active + 1).padStart(2, "0")}/{String(labels.length).padStart(2, "0")} · {labels[active]}</strong>
          {notes[active]}
        </p>

        <AnimatedSceneControls
          {...scenes}
          labels={labels}
          controlLabels={["입력", "환경", "사전", "송금1", "송금2", "사후", "결과", "검증"]}
          playLabel="Block Execution 경로 재생"
          className="sticky bottom-0 mt-0 bg-background/95 sm:static sm:!min-h-0 sm:!border-t-0 sm:bg-transparent sm:!pt-2 [&>p]:hidden [&_[data-viz-desktop-controls]]:gap-1 [&_[data-viz-desktop-controls]>button]:min-w-0 [&_[data-viz-desktop-controls]>button]:px-1 [&_[data-viz-desktop-controls]>button]:py-1 [&_[data-viz-desktop-controls]>button:last-child]:w-20"
        />
      </div>
      <StaticSceneList labels={labels} notes={notes} />
    </VizFrame>
  );
}
