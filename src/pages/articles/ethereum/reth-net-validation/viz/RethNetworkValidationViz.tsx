import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = ["입력 고정", "후보", "Handshake", "자료 경로", "장애", "Rollback", "결정"] as const;
const NOTES = [
  "Base와 candidate에 Reth commit·features·network config·ChainSpec, discovery 응답, clock·random seed와 fault schedule을 같은 run manifest로 고정합니다.",
  "같은 endpoint와 node record에서 candidate 수, dial 순서와 pending slot 변화를 비교합니다. Signed record가 active session을 뜻한다고 판정하지 않습니다.",
  "ECIES identity, Hello ID, capability 교집합, 선택한 ETH version과 Status outcome을 한 session receipt로 비교합니다.",
  "같은 announcement·request/response corpus를 보내 accepted message, duplicate·unsolicited rejection, inflight와 queue 회수를 대조합니다.",
  "Identity mismatch, no shared capability, Status 무응답·wrong genesis, oversized frame와 slow consumer를 한 경계씩 주입합니다. 종료 이유와 자원 정리가 달라지면 실패입니다.",
  "Candidate를 격리하고 binary·features·network config를 기준선으로 되돌립니다. 같은 fixture를 다시 통과하고 active·pending·buffer가 기준선으로 돌아와야 복구가 끝납니다.",
  "정합성·bounded resource·restart·rollback이 모두 같을 때만 latency·CPU·memory를 비교합니다. 대상 환경 결과가 없으면 결정은 proposed로 남깁니다.",
] as const;

const GATES = [
  ["MANIFEST", "release·config·chain"],
  ["CANDIDATE", "record·dial·pending"],
  ["HANDSHAKE", "identity·cap·Status"],
  ["DATA", "announce·request·queue"],
  ["FAULT", "reason·cleanup"],
  ["ROLLBACK", "baseline replay"],
  ["ADR", "adopt·reject"],
] as const;

export default function RethNetworkValidationViz() {
  const scenes = useAnimatedScenes(SCENES.length, 10000, { loop: false });
  const active = scenes.active;
  const warning = active === 4;

  return (
    <VizFrame
      eyebrow="실무 경로 · Reth 네트워크 변경 검증"
      title="같은 연결을 재생해 결과·자원 회수·되돌리기를 함께 비교합니다"
      description="빠른 handshake보다 먼저 identity, 선택 version, Status, accepted message와 slot 회수가 같은지 확인합니다."
      note="이 화면은 격리한 test node용 검증 절차입니다. 대상 환경의 latency와 복구 시간은 아직 측정하지 않았습니다."
      canvasClassName="px-2 py-2 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-reth-network-validation-scene={active}
        tabIndex={0}
        role="group"
        aria-label="Reth 네트워크 변경을 입력 고정부터 rollback과 ADR까지 검증하는 일곱 단계"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div className="grid grid-cols-7 gap-px bg-border p-px" aria-label="네트워크 변경 검증 전체 단계">
          {GATES.map(([title], index) => (
            <div key={title} className={`min-w-0 bg-background py-2 text-center ${index === active ? warning ? "text-amber-700 dark:text-amber-300" : "text-primary" : index < active ? "text-foreground" : "text-muted-foreground"}`}>
              <span className="block font-mono text-[8px] font-black">{String(index + 1).padStart(2, "0")}</span>
              <strong className="mt-1 hidden break-keep text-[8px] leading-3 sm:block lg:text-[9px]">{title}</strong>
            </div>
          ))}
        </div>

        <section className="mt-3 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-stretch gap-2 border border-border bg-background p-3 sm:min-h-[11rem] sm:gap-3 sm:p-4">
          <div className="min-w-0 border border-border p-2 sm:p-3">
            <span className="font-mono text-[9px] font-black text-muted-foreground">BASE</span>
            <strong className="mt-2 block break-keep text-xs sm:text-sm">고정한 기준 구현</strong>
            <span className="mt-2 block break-keep text-[9px] leading-4 text-muted-foreground sm:text-[10px]">run_id · session receipt · resource counters</span>
            <span className="mt-2 block break-keep text-[10px] font-bold text-primary">expected outcome</span>
          </div>
          <div className="flex items-center text-center font-mono text-[10px] font-black text-primary">{active === 5 ? "복구" : "대조"}</div>
          <div className={`min-w-0 border p-2 sm:p-3 ${warning ? "border-amber-500/70" : "border-primary/45"}`}>
            <span className="font-mono text-[9px] font-black text-muted-foreground">CANDIDATE</span>
            <strong className="mt-2 block break-keep text-xs sm:text-sm">
              {active < 4 ? "같은 연결 독립 실행" : active === 4 ? "격리·증거 보존" : active === 5 ? "기준선으로 rollback" : "채택 조건 판정"}
            </strong>
            <span className="mt-2 block break-keep text-[9px] leading-4 text-muted-foreground sm:text-[10px]">{GATES[active][1]}</span>
            <span className={`mt-2 block break-keep text-[10px] font-bold ${warning ? "text-amber-700 dark:text-amber-300" : "text-primary"}`}>{active < 4 ? "receipt 수집 중" : active === 4 ? "잘못된 active·잔류 자원 금지" : active === 5 ? "전체 fixture 재통과" : "proposed 또는 rejected"}</span>
          </div>
        </section>

        <p data-scene-note className="mt-3 min-h-24 border-l-2 border-primary/50 pl-3 text-xs leading-5 text-muted-foreground sm:min-h-20 sm:pl-4 sm:text-sm sm:leading-6">{NOTES[active]}</p>
        <AnimatedSceneControls
          {...scenes}
          labels={SCENES}
          controlLabels={["입력", "후보", "Handshake", "자료", "장애", "복구", "결정"]}
          playLabel="검증 절차 재생"
          className="mt-0 sm:mt-4 [&_[data-viz-desktop-controls]>button]:min-w-0 [&_[data-viz-desktop-controls]>button:last-child]:w-24"
        />
      </div>
      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}
