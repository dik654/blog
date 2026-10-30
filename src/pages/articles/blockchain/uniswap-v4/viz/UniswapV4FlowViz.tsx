import { useEffect, useRef } from "react";
import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = [
  "Pool 선택",
  "Unlock 시작",
  "Router callback",
  "Swap 실행",
  "Delta 기록",
  "100 token0 정산",
  "98 token1 인출",
  "원자적 완료",
] as const;

const SHORT = ["Pool", "Unlock", "Callback", "Swap", "장부", "정산", "인출", "완료"] as const;

const NOTES = [
  "Router는 currency0·currency1·fee 3000·tickSpacing·hook 주소가 모두 들어 있는 PoolKey를 보냅니다. PoolManager는 이 다섯 값을 해시한 PoolId로 한 pool의 가격·유동성 상태를 찾습니다.",
  "Router가 PoolManager.unlock(data)을 호출합니다. 중첩 unlock이 아니면 transient lock이 열립니다. 아직 token은 움직이지 않았고 router의 두 currency delta도 0입니다.",
  "PoolManager가 msg.sender인 router의 unlockCallback(data)을 호출합니다. 이후 swap·settle·take를 어떤 순서로 조합할지는 router 코드가 맡고, PoolManager는 마지막에 장부가 비었는지만 강제합니다.",
  "Router가 zeroForOne exact-input 100으로 swap을 호출합니다. 활성 flag가 있으면 beforeSwap과 afterSwap hook가 실행됩니다. 공식 fixture의 pool 계산 결과는 amount0 -100, amount1 +98입니다.",
  "PoolManager는 결과를 즉시 사용자 잔액으로 송금하지 않고 router 주소의 transient 장부에 기록합니다. 음수 -100은 token0을 내야 하는 debt, 양수 +98은 token1을 받을 수 있는 credit입니다. 미정산 currency 수는 2가 됩니다.",
  "Router는 token0을 sync하고 사용자에게서 PoolManager로 100을 전송한 뒤 settle합니다. 실제 잔액 증가 100만 인정되어 token0 delta가 -100에서 0으로 바뀌고 미정산 수는 1이 됩니다.",
  "Router가 take(token1, user, 98)를 호출합니다. Token1 98이 사용자에게 전송되고 router의 +98 credit이 0이 되어 미정산 수가 0이 됩니다.",
  "Callback이 돌아오면 unlock은 NonzeroDeltaCount가 0인지 확인하고 다시 잠급니다. 하나라도 남으면 CurrencyNotSettled로 전체 transaction이 revert되므로 pool 가격 변화와 token 전송도 함께 사라집니다.",
] as const;

const STATE = [
  { lock: "잠김", action: "PoolId 계산", d0: "0", d1: "0", count: "0", transfer: "없음" },
  { lock: "열림", action: "unlock(data)", d0: "0", d1: "0", count: "0", transfer: "없음" },
  { lock: "열림", action: "unlockCallback", d0: "0", d1: "0", count: "0", transfer: "없음" },
  { lock: "열림", action: "swap 실행", d0: "-100", d1: "+98", count: "2", transfer: "장부만 기록" },
  { lock: "열림", action: "delta 확인", d0: "-100 debt", d1: "+98 credit", count: "2", transfer: "없음" },
  { lock: "열림", action: "sync → settle", d0: "0", d1: "+98 credit", count: "1", transfer: "token0 +100" },
  { lock: "열림", action: "take", d0: "0", d1: "0", count: "0", transfer: "token1 -98" },
  { lock: "잠김", action: "zero 확인", d0: "0", d1: "0", count: "0", transfer: "transaction 확정" },
] as const;

function active(scene: number, from: number, to = from) {
  return scene >= from && scene <= to;
}

function Node({ title, detail, compact, on }: { title: string; detail: string; compact: string; on: boolean }) {
  return (
    <div className={`min-w-0 border px-1.5 py-2 transition-colors sm:px-3 sm:py-3 ${on ? "border-primary bg-primary/10" : "border-border bg-background"}`}>
      <strong className="block break-keep text-[8px] leading-4 sm:text-[11px] sm:leading-5">{title}</strong>
      <span className="mt-1 block break-keep text-[8px] leading-3 text-muted-foreground sm:hidden">{compact}</span>
      <span className="mt-1 hidden break-keep text-[9px] leading-4 text-muted-foreground sm:block">{detail}</span>
    </div>
  );
}

export default function UniswapV4FlowViz() {
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
      eyebrow="공식 v4.0.0 테스트 한 건"
      title="100 token0을 넣고 98 token1을 받기까지 계산과 송금은 서로 다른 단계로 진행됩니다"
      description="PoolManager는 pool 계산 결과를 router의 임시 debt·credit으로 기록하고, unlock이 끝나기 전에 둘 다 0인지 확인합니다."
      note="수치는 v4-core v4.0.0의 PoolManagerTest.test_swap_succeedsIfInitialized fixture입니다. 이 환경에는 Foundry가 없어 테스트를 새로 실행하지 못했고, 고정 commit의 source와 공식 기대값을 대조했습니다."
      canvasClassName="p-1.5 sm:p-5"
      documentFlow
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-uniswap-v4-scene={scenes.active}
        tabIndex={0}
        role="group"
        aria-label="Uniswap V4 exact-input 교환과 정산을 여덟 장면으로 추적"
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

          <div className="mt-3 min-h-[25rem] border-y border-border py-3 sm:min-h-[24rem] sm:py-4">
            <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-1 sm:gap-2">
              <Node title="사용자" detail="100 token0 지급 · 98 token1 수령" compact="100 입력 · 98 출력" on={active(scenes.active, 5, 6)} />
              <span aria-hidden className="text-center text-[10px] text-primary sm:text-base">→</span>
              <Node title="Swap Router" detail="unlock callback · debt 정산 · credit 인출" compact="callback · 정산 · 인출" on={active(scenes.active, 1, 7)} />
              <span aria-hidden className="text-center text-[10px] text-primary sm:text-base">⇄</span>
              <Node title="PoolManager" detail="PoolId state · hooks · transient delta · zero 검사" compact="state · hook · delta" on={active(scenes.active, 0, 7)} />
            </div>

            <div className="mt-3 grid grid-cols-3 gap-px bg-border p-px">
              <div className={`min-w-0 bg-background p-2 sm:p-3 ${scenes.active === 0 ? "ring-2 ring-inset ring-primary" : ""}`}>
                <span className="text-[7px] font-bold text-primary sm:text-[9px]">POOL IDENTITY</span>
                <p className="mt-2 break-keep text-[8px] font-bold leading-4 sm:hidden">pair · fee · spacing · hook</p>
                <p className="mt-2 hidden break-keep text-[10px] font-bold leading-5 sm:block">currency0 · currency1 · fee 3000 · tickSpacing · hooks</p>
                <p className="mt-1 break-keep text-[8px] leading-4 text-muted-foreground sm:hidden">Key hash → Pool.State</p>
                <p className="mt-1 hidden text-[9px] leading-4 text-muted-foreground sm:block">keccak256(PoolKey) → 독립 Pool.State</p>
              </div>
              <div className={`min-w-0 bg-background p-2 sm:p-3 ${scenes.active === 3 ? "ring-2 ring-inset ring-primary" : ""}`}>
                <span className="text-[7px] font-bold text-primary sm:text-[9px]">HOOK SURFACE</span>
                <p className="mt-2 break-keep text-[8px] font-bold leading-4 sm:hidden">before → swap → after</p>
                <p className="mt-2 hidden break-keep text-[10px] font-bold leading-5 sm:block">beforeSwap → pool.swap → afterSwap</p>
                <p className="mt-1 break-keep text-[8px] leading-4 text-muted-foreground sm:hidden">Flag가 callback·delta 권한 표시</p>
                <p className="mt-1 hidden break-keep text-[9px] leading-4 text-muted-foreground sm:block">주소 flag가 callback과 delta 반환 권한을 표시</p>
              </div>
              <div className={`min-w-0 bg-background p-2 sm:p-3 ${active(scenes.active, 4, 7) ? "ring-2 ring-inset ring-primary" : ""}`}>
                <span className="text-[7px] font-bold text-primary sm:text-[9px]">ROUTER DELTA LEDGER</span>
                <div className="mt-2 grid grid-cols-2 gap-1 font-mono text-[8px] sm:gap-2 sm:text-[10px]">
                  <span>token0</span><strong className={state.d0.startsWith("-") ? "text-destructive" : "text-primary"}>{state.d0}</strong>
                  <span>token1</span><strong className={state.d1.startsWith("+") ? "text-primary" : ""}>{state.d1}</strong>
                </div>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-4 gap-px bg-border p-px">
              {[
                ["LOCK", state.lock],
                ["현재 호출", state.action],
                ["미정산 currency", state.count],
                ["실제 이동", state.transfer],
              ].map(([label, value]) => (
                <div key={label} className="min-w-0 bg-background p-2 text-center sm:p-3">
                  <span className="block break-keep text-[6px] font-bold text-muted-foreground sm:text-[8px]">{label}</span>
                  <strong className="mt-1 block break-keep text-[8px] leading-3 text-primary sm:text-[10px] sm:leading-5">{value}</strong>
                </div>
              ))}
            </div>

            <p data-scene-note className="mt-3 min-h-[9rem] border-l-2 border-primary/50 pl-3 text-[9px] leading-4 text-muted-foreground sm:min-h-[6rem] sm:text-sm sm:leading-6">
              {NOTES[scenes.active]}
            </p>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} controlLabels={SCENES} playLabel="V4 교환 경로 재생" compact />
      </div>
      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}
