import { useEffect, useRef } from "react";
import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = [
  "균형 pool",
  "Rate 정규화",
  "A와 D",
  "1,000 입력",
  "새 y 계산",
  "Fee 적용",
  "최소 출력 검사",
  "교환 확정",
] as const;

const SHORT = ["Pool", "Rate", "A·D", "입력", "y", "Fee", "검사", "확정"] as const;

const NOTES = [
  "공식 plain-token 테스트 fixture는 token0과 token1을 각각 1,500,000개 예치합니다. 사용자가 보는 A는 2000이고 기본 fee는 0.01%입니다. 이 수치는 모든 Curve pool의 공통 설정이 아닙니다.",
  "Contract는 raw balance를 바로 수학식에 넣지 않습니다. Token별 decimals 보정과 oracle 또는 ERC-4626 rate를 읽고 xpᵢ=rateᵢ×balanceᵢ/1e18로 공통 단위 잔액을 만듭니다. Plain 18-decimal token 둘의 rate가 1이면 xp도 1,500,000씩입니다.",
  "현재 block.timestamp에 해당하는 A를 읽고 기존 xp에서 D를 반복 계산합니다. 균형 fixture에서는 첫 추정인 합계 3,000,000에서 바로 수렴합니다. A는 균형 부근 곡선을 평평하게 하지만 token의 외부 peg를 보증하지 않습니다.",
  "Bob이 token0 1,000개를 보냅니다. _transfer_in은 요청값이 아니라 pool이 실제 받은 dx를 확인합니다. Rate가 1이므로 새 normalized x는 1,501,000입니다.",
  "get_y는 D=3,000,000을 그대로 유지하는 token1 잔액을 정수 반복으로 찾습니다. 여덟 번 뒤 y는 약 1,499,000.0003331668입니다. 따라서 fee 전 출력은 1 wei를 보수적으로 뺀 약 999.9996668332입니다.",
  "균형에 가까워 dynamic fee는 기본 0.01%입니다. 약 0.0999999667 token1을 빼면 최종 dy는 약 999.8996668665입니다. Fee와 1 wei 반올림은 contract 결과의 일부입니다.",
  "Execution 시점의 dy가 사용자가 보낸 min_dy 이상인지 확인합니다. min_dy가 이 값보다 1 wei만 커도 출력 전송 전에 transaction 전체가 revert됩니다. 앞서 본 quote는 상태가 바뀌지 않는다는 보장이 아닙니다.",
  "검사를 통과하면 token1 dy를 receiver에게 전송하고 TokenExchange event를 남깁니다. 입력 전송, rate·A·balance snapshot, 정수 계산, fee, min_dy 검사와 출력 전송이 한 transaction의 성공 또는 실패로 묶입니다.",
] as const;

const STATE = [
  { raw: "1.5M / 1.5M", xp: "아직 계산 전", amp: "A=2000", invariant: "—", x: "—", y: "—", output: "—", effect: "없음" },
  { raw: "1.5M / 1.5M", xp: "1.5M / 1.5M", amp: "A=2000", invariant: "—", x: "—", y: "—", output: "—", effect: "rate snapshot" },
  { raw: "1.5M / 1.5M", xp: "1.5M / 1.5M", amp: "A=2000", invariant: "D=3.0M", x: "—", y: "—", output: "—", effect: "D 수렴" },
  { raw: "+1,000 token0", xp: "1.5M / 1.5M", amp: "A=2000", invariant: "D=3.0M", x: "1.501M", y: "—", output: "—", effect: "transfer-in" },
  { raw: "+1,000 token0", xp: "1.5M / 1.5M", amp: "A=2000", invariant: "D=3.0M", x: "1.501M", y: "1.499000000333M", output: "gross 999.999666", effect: "8회 수렴" },
  { raw: "+1,000 token0", xp: "1.5M / 1.5M", amp: "A=2000", invariant: "D=3.0M", x: "1.501M", y: "1.499000000333M", output: "999.899666", effect: "fee -0.099999" },
  { raw: "+1,000 token0", xp: "execution snapshot", amp: "A=2000", invariant: "D=3.0M", x: "1.501M", y: "계산 완료", output: "dy ≥ min_dy", effect: "통과 또는 revert" },
  { raw: "pool 잔액 갱신", xp: "다음 거래가 재계산", amp: "A=2000", invariant: "이 거래의 D", x: "입력 반영", y: "출력 반영", output: "999.899666", effect: "token1 전송" },
] as const;

function isActive(scene: number, start: number, end = start) {
  return scene >= start && scene <= end;
}

function FlowNode({ title, compact, detail, active }: { title: string; compact: string; detail: string; active: boolean }) {
  return (
    <div className={`min-w-0 border px-1.5 py-2 transition-colors sm:px-3 sm:py-3 ${active ? "border-primary bg-primary/10" : "border-border bg-background"}`}>
      <strong className="block break-keep text-[8px] leading-4 sm:text-[11px] sm:leading-5">{title}</strong>
      <span className="mt-1 block break-keep text-[7px] leading-3 text-muted-foreground sm:hidden">{compact}</span>
      <span className="mt-1 hidden break-keep text-[9px] leading-4 text-muted-foreground sm:block">{detail}</span>
    </div>
  );
}

export default function ModernCurveStableViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5000, { loop: false });
  const tabsRef = useRef<HTMLDivElement>(null);
  const state = STATE[scenes.active];

  useEffect(() => {
    const scroller = tabsRef.current;
    const target = scroller?.querySelector<HTMLElement>('button[aria-pressed="true"]');
    if (!scroller || !target) return;
    const left = target.getBoundingClientRect().left - scroller.getBoundingClientRect().left + scroller.scrollLeft;
    scroller.scrollTo({ left: left - (scroller.clientWidth - target.offsetWidth) / 2, behavior: "auto" });
  }, [scenes.active]);

  return (
    <VizFrame
      eyebrow="공식 StableSwap-NG plain-token fixture"
      title="1,000 token0이 약 999.899666 token1이 되기까지 상태와 계산을 함께 추적합니다"
      description="교환은 raw 잔액을 바로 곡선에 넣는 일이 아닙니다. Rate·A·D·정수 반복·fee·min_dy가 한 execution snapshot에서 이어집니다."
      note="Commit 2abe778f의 fixture와 contract 식을 고정한 source trace입니다. 표시한 수치는 같은 정수 연산을 재생한 값이며 이 환경에서 Titanoboa contract test를 새로 실행한 측정값은 아닙니다."
      canvasClassName="p-1.5 sm:p-5"
      documentFlow
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-curve-stable-scene={scenes.active}
        tabIndex={0}
        role="group"
        aria-label="Curve StableSwap 한 교환을 여덟 장면으로 추적"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div data-viz-scene-stage>
          <div ref={tabsRef} className="overflow-x-auto">
            <div className="grid grid-cols-8 gap-px bg-border p-px" style={{ width: "max(100%, 620px)" }}>
              {SCENES.map((label, index) => (
                <button
                  key={label}
                  type="button"
                  aria-pressed={index === scenes.active}
                  onClick={() => scenes.setActive(index)}
                  className={`min-h-11 min-w-0 bg-background px-1 py-1 text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary lg:py-2 ${index === scenes.active ? "text-primary" : index < scenes.active ? "text-foreground" : "text-muted-foreground"}`}
                >
                  <span className="block font-mono text-[8px] font-black">{String(index + 1).padStart(2, "0")}</span>
                  <strong className="mt-1 block break-keep text-[7px] leading-3 lg:hidden">{SHORT[index]}</strong>
                  <strong className="mt-1 hidden break-keep text-[8px] leading-3 lg:block">{label}</strong>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-3 min-h-[31rem] border-y border-border py-3 sm:min-h-[27rem] sm:py-4">
            <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] items-center gap-1 sm:gap-2">
              <FlowNode title="Bob" compact="1,000 입력" detail="token0 1,000 지급 · min_dy 지정" active={isActive(scenes.active, 3, 7)} />
              <span aria-hidden className="text-center text-[9px] text-primary sm:text-base">→</span>
              <FlowNode title="Pool 계약" compact="현재 상태" detail="balance · rate · A · fee snapshot" active={isActive(scenes.active, 0, 7)} />
              <span aria-hidden className="text-center text-[9px] text-primary sm:text-base">→</span>
              <FlowNode title="Invariant" compact="D · y" detail="get_D · get_y · integer convergence" active={isActive(scenes.active, 2, 5)} />
              <span aria-hidden className="text-center text-[9px] text-primary sm:text-base">→</span>
              <FlowNode title="Receiver" compact="999.899666" detail="min_dy 통과 뒤 token1 수령" active={scenes.active === 7} />
            </div>

            <div className="mt-3 grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-4">
              {[
                ["RAW BALANCE", state.raw, isActive(scenes.active, 0, 3)],
                ["NORMALIZED xp", state.xp, isActive(scenes.active, 1, 5)],
                ["PARAMETER", state.amp, isActive(scenes.active, 2, 6)],
                ["INVARIANT", state.invariant, isActive(scenes.active, 2, 6)],
              ].map(([label, value, active]) => (
                <div key={String(label)} className={`min-w-0 bg-background p-2 sm:p-3 ${active ? "ring-2 ring-inset ring-primary" : ""}`}>
                  <span className="block break-keep text-[7px] font-bold text-muted-foreground sm:text-[9px]">{String(label)}</span>
                  <strong className="mt-1 block break-keep font-mono text-[8px] leading-4 text-primary sm:text-[10px] sm:leading-5">{String(value)}</strong>
                </div>
              ))}
            </div>

            <div className="mt-px grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-4">
              {[
                ["NEW x", state.x],
                ["SOLVED y", state.y],
                ["USER OUTPUT", state.output],
                ["EFFECT", state.effect],
              ].map(([label, value]) => (
                <div key={label} className="min-w-0 bg-background p-2 sm:p-3">
                  <span className="block break-keep text-[7px] font-bold text-muted-foreground sm:text-[9px]">{label}</span>
                  <strong className="mt-1 block break-keep font-mono text-[8px] leading-4 sm:text-[10px] sm:leading-5">{value}</strong>
                </div>
              ))}
            </div>

            <p data-scene-note className="mt-3 min-h-[11rem] border-l-2 border-primary/50 pl-3 text-[9px] leading-4 text-muted-foreground sm:min-h-[7rem] sm:text-sm sm:leading-6">
              {NOTES[scenes.active]}
            </p>
          </div>
        </div>

        <AnimatedSceneControls {...scenes} labels={SCENES} controlLabels={SCENES} playLabel="StableSwap 교환 경로 재생" compact />
      </div>
      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}
