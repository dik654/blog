import { useEffect, useRef } from "react";
import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = [
  "두 구간",
  "현재 보유량",
  "교환 시작",
  "첫 구간 이동",
  "경계 통과",
  "둘째 구간 이동",
  "대금 확인",
  "최종 장부",
] as const;

const SHORT = ["구간", "보유량", "시작", "1차", "경계", "2차", "결제", "장부"] as const;

const NOTES = [
  "Alice는 √P=1~3에 유동성 60을, Bob은 2.5~3.5에 유동성 40을 둡니다. 현재 √P=2에서는 Alice의 60만 교환에 참여합니다.",
  "Alice의 position은 현재 token0 10과 token1 60으로 보입니다. 가격이 오른쪽으로 갈수록 token0이 줄고 token1이 늘지만, 이 값은 pool의 별도 token 상자가 아니라 range와 L에서 계산한 몫입니다.",
  "교환자는 token1 40을 정확입력으로 보냅니다. 0.3% 수수료를 제외한 양이 가격을 오른쪽으로 움직이고, 다음 initialized tick인 √P=2.5가 첫 목표가 됩니다.",
  "활성 유동성 60에서 순입력 30이 √P를 2→2.5로 옮깁니다. 이 단계의 token0 출력은 6이고, 경계까지 필요한 총입력은 수수료를 포함해 약 30.0903입니다.",
  "√P=2.5에 도착하면 Bob의 lower tick을 통과합니다. tick의 바깥쪽 누적값을 뒤집고 liquidityNet +40을 적용해 다음 단계의 활성 유동성이 60→100으로 바뀝니다.",
  "남은 총입력 약 9.9097에서 수수료를 떼고 순입력 9.88을 사용합니다. 유동성 100에서 √P는 2.5→2.5988로 움직이고 token0 약 1.5207이 더 나옵니다.",
  "Pool은 token0 총 7.5207을 먼저 보낸 뒤 callback으로 token1 대금을 받습니다. 호출 전보다 token1 잔액이 40만큼 늘지 않으면 전체 transaction이 revert되어 가격·tick·fee 변화도 남지 않습니다.",
  "성공하면 √P=2.5988, 활성 유동성 100, token0 출력 약 7.5207, 총 수수료 0.12가 남습니다. Alice 몫은 약 0.1081, Bob 몫은 약 0.0119이지만 position의 tokensOwed는 다음 갱신 때 누적됩니다.",
] as const;

const SQRT_PRICE = [2, 2, 2, 2.5, 2.5, 2.5988, 2.5988, 2.5988] as const;
const ACTIVE_L = [60, 60, 60, 60, 100, 100, 100, 100] as const;

const METRICS = [
  ["입력", "0", "출력", "0", "수수료", "0"],
  ["Alice", "x 10 · y 60", "활성 L", "60", "Bob", "대기"],
  ["남은 입력", "40", "첫 목표", "√P 2.5", "활성 L", "60"],
  ["사용 입력", "30.0903", "누적 출력", "6.0000", "누적 수수료", "0.0903"],
  ["liquidityNet", "+40", "활성 L", "100", "경계", "√P 2.5"],
  ["남은 입력", "0", "누적 출력", "7.5207", "누적 수수료", "0.1200"],
  ["callback 납부", "40 token1", "받은 양", "7.5207 token0", "미납", "전체 revert"],
  ["최종 √P", "2.5988", "활성 L", "100", "fee growth", "두 구간에 배분"],
] as const;

function pct(value: number) {
  return `${((value - 1) / 2.5) * 100}%`;
}

function PoolRangeTrack({ scene }: { scene: number }) {
  const price = SQRT_PRICE[scene];
  return (
    <div className="border-y border-border py-4" aria-label="Alice와 Bob의 가격 구간과 현재 제곱근 가격">
      <div className="relative mx-4 h-28 sm:mx-8">
        <div className="absolute inset-x-0 top-14 h-px bg-border" />
        <div className="absolute top-4 h-5 border border-primary/70 bg-primary/10" style={{ left: pct(1), width: `calc(${pct(3)} - ${pct(1)})` }}>
          <span className="absolute left-1 top-0.5 whitespace-nowrap text-[9px] font-bold text-primary">Alice · L 60</span>
        </div>
        <div className="absolute top-9 h-5 border border-foreground/35 bg-muted" style={{ left: pct(2.5), width: `calc(${pct(3.5)} - ${pct(2.5)})` }}>
          <span className="absolute right-1 top-0.5 whitespace-nowrap text-[9px] font-bold">Bob · L 40</span>
        </div>
        {[1, 2, 2.5, 3, 3.5].map((value) => (
          <div key={value} className="absolute top-12 -translate-x-1/2" style={{ left: pct(value) }}>
            <span className="block h-5 border-l border-border" />
            <span className="mt-1 block font-mono text-[8px] text-muted-foreground">{value}</span>
          </div>
        ))}
        <div className="absolute top-10 -translate-x-1/2" style={{ left: pct(price) }}>
          <span className="block h-9 border-l-2 border-destructive" />
          <strong className="absolute left-1/2 top-9 -translate-x-1/2 whitespace-nowrap font-mono text-[9px] text-destructive">√P {price}</strong>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-px bg-border p-px text-center text-[9px] leading-4 sm:text-xs sm:leading-5">
        {[0, 1, 2].map((index) => (
          <div key={METRICS[scene][index * 2]} className="min-w-0 bg-background px-2 py-3">
            <span className="block break-keep text-muted-foreground">{METRICS[scene][index * 2]}</span>
            <strong className="mt-1 block break-keep text-primary">{METRICS[scene][index * 2 + 1]}</strong>
          </div>
        ))}
      </div>
      <p className="mt-3 text-center font-mono text-[10px] font-bold">현재 교환에 쓰이는 유동성 · {ACTIVE_L[scene]}</p>
    </div>
  );
}

export function UniswapV3LifecycleViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5200, { loop: false });
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroller = tabsRef.current;
    const target = scroller?.querySelector<HTMLElement>('button[aria-pressed="true"]');
    if (!scroller || !target) return;
    const left = target.getBoundingClientRect().left - scroller.getBoundingClientRect().left + scroller.scrollLeft;
    scroller.scrollTo({ left: left - (scroller.clientWidth - target.offsetWidth) / 2, behavior: "auto" });
  }, [scenes.active]);

  return (
    <VizFrame
      eyebrow="한 번의 교환 · 설명용 연속값"
      title="40 token1이 두 가격 구간을 지나면 활성 유동성과 수수료 몫이 중간에 바뀝니다"
      description="같은 pool 안에서도 현재 가격을 덮는 position만 이번 계산에 참여합니다."
      note="숫자는 알고리즘을 따라가기 위한 연속값 예시입니다. 실제 core는 tick 격자, Q64.96·Q128 정수와 방향별 반올림을 사용합니다."
      canvasClassName="p-1.5 sm:p-5"
      documentFlow
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-uniswap-v3-scene={scenes.active}
        tabIndex={0}
        role="group"
        aria-label="두 구간을 지나는 Uniswap V3 정확입력 교환을 여덟 장면으로 추적"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div data-viz-scene-stage>
          <div ref={tabsRef} className="overflow-x-auto">
            <div className="grid grid-cols-8 gap-px bg-border p-px" style={{ width: "max(100%, 620px)" }}>
              {SCENES.map((scene, index) => (
                <button
                  type="button"
                  key={scene}
                  aria-pressed={index === scenes.active}
                  onClick={() => scenes.setActive(index)}
                  className={`min-h-11 min-w-0 bg-background px-1 py-1 text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary lg:py-2 ${index === scenes.active ? "text-primary" : index < scenes.active ? "text-foreground" : "text-muted-foreground"}`}
                >
                  <span className="block font-mono text-[8px] font-black">{String(index + 1).padStart(2, "0")}</span>
                  <strong className="mt-1 block break-keep text-[7px] leading-3 lg:hidden">{SHORT[index]}</strong>
                  <strong className="mt-1 hidden break-keep text-[8px] leading-3 lg:block">{scene}</strong>
                </button>
              ))}
            </div>
          </div>
          <div className="mt-2 sm:mt-3"><PoolRangeTrack scene={scenes.active} /></div>
          <p data-scene-note className="mt-2 min-h-[10rem] border-l-2 border-primary/50 pl-2.5 text-[10px] leading-4 text-muted-foreground sm:mt-3 sm:min-h-[6.5rem] sm:pl-4 sm:text-sm sm:leading-6">
            {NOTES[scenes.active]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} controlLabels={SCENES} playLabel="Uniswap V3 교환 경로 재생" compact />
      </div>
      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}

export function PriceEncodingViz() {
  const rows = [
    ["사람이 읽는 가격", "P = token1 / token0", "방향과 decimals를 먼저 고정"],
    ["간격을 찾는 번호", "P ≈ 1.0001ⁱ", "tick i는 정수 가격 눈금"],
    ["계산에 저장하는 값", "⌊√P × 2⁹⁶⌋", "Q64.96 정수로 amount 계산"],
    ["유동성이 바뀌는 경계", "initialized tick", "tick spacing 배수만 position 경계"],
  ] as const;

  return (
    <VizFrame
      eyebrow="같은 가격을 보는 네 관점"
      title="UI 가격, tick, 저장된 제곱근 가격과 유동성 경계는 같은 값의 서로 다른 표현입니다"
      description="아무 tick이나 지나갈 수 있지만 position이 시작하거나 끝나는 tick은 spacing 제약을 받습니다."
      canvasClassName="p-2 sm:p-5"
    >
      <div className="overflow-x-auto">
        <div className="grid grid-cols-4 gap-px bg-border p-px" style={{ width: "max(100%, 720px)" }}>
          {rows.map(([role, value, detail], index) => (
            <div key={role} className="relative min-w-0 bg-background p-4">
              <span className="font-mono text-[9px] font-black text-primary">0{index + 1}</span>
              <strong className="mt-3 block break-keep text-xs leading-5">{role}</strong>
              <code className="mt-3 block break-words border-y border-border py-2 text-[10px]">{value}</code>
              <p className="mt-2 break-keep text-[10px] leading-5 text-muted-foreground">{detail}</p>
              {index < rows.length - 1 ? <span aria-hidden className="absolute -right-1 top-1/2 z-10 h-2 w-2 -translate-y-1/2 rotate-45 border-r border-t border-primary bg-background" /> : null}
            </div>
          ))}
        </div>
      </div>
    </VizFrame>
  );
}
