import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #hook-permission-boundary — hook 주소의 하위 14비트 flag layout.
 * 근거: 이 글의 "Hook 주소의 14개 flag" 코드 보기(Hooks.sol, v4.0.0 commit e50237c).
 * 비트 13~4 = lifecycle callback 10개, 비트 3~0 = delta 반환 권한 4개.
 */
const FLAGS = [
  { bit: 13, short: "init 전", name: "BEFORE_INITIALIZE" },
  { bit: 12, short: "init 후", name: "AFTER_INITIALIZE" },
  { bit: 11, short: "추가 전", name: "BEFORE_ADD_LIQUIDITY" },
  { bit: 10, short: "추가 후", name: "AFTER_ADD_LIQUIDITY" },
  { bit: 9, short: "제거 전", name: "BEFORE_REMOVE_LIQUIDITY" },
  { bit: 8, short: "제거 후", name: "AFTER_REMOVE_LIQUIDITY" },
  { bit: 7, short: "swap 전", name: "BEFORE_SWAP" },
  { bit: 6, short: "swap 후", name: "AFTER_SWAP" },
  { bit: 5, short: "donate 전", name: "BEFORE_DONATE" },
  { bit: 4, short: "donate 후", name: "AFTER_DONATE" },
  { bit: 3, short: "swap 전 Δ", name: "BEFORE_SWAP_RETURNS_DELTA" },
  { bit: 2, short: "swap 후 Δ", name: "AFTER_SWAP_RETURNS_DELTA" },
  { bit: 1, short: "추가 후 Δ", name: "AFTER_ADD_LIQUIDITY_RETURNS_DELTA" },
  { bit: 0, short: "제거 후 Δ", name: "AFTER_REMOVE_LIQUIDITY_RETURNS_DELTA" },
] as const;

const FLAG_BITS = FLAGS.length;
const ADDRESS_BITS = 160;
const UPPER_BITS = ADDRESS_BITS - FLAG_BITS;

const SCENES = [
  {
    label: "주소 끝 14비트만 읽습니다",
    values: false,
    summary: `160비트 중 하위 ${FLAG_BITS}비트`,
    focus: "all",
    on: [] as readonly number[],
    result: `Mask = (1 << 14) − 1 · 상위 ${UPPER_BITS}비트는 flag로 쓰지 않음`,
    note: `Hook 주소는 160비트 값입니다. Core는 그중 맨 아래 ${FLAG_BITS}비트만 permission 표로 읽고, 나머지 ${UPPER_BITS}비트는 flag로 해석하지 않습니다. 칸 하나가 켜고(1) 끄는(0) 스위치 하나입니다.`,
  },
  {
    label: "비트 13~4: 어느 시점에 부를지",
    values: false,
    summary: "callback 지점 10개",
    focus: "callback",
    on: [] as readonly number[],
    result: "initialize · 유동성 추가 · 유동성 제거 · swap · donate × 전/후",
    note: "위쪽 10비트는 initialize, 유동성 추가와 제거, swap, donate 각각의 앞과 뒤입니다. 켜진 칸의 시점에서만 PoolManager가 hook 함수를 호출합니다.",
  },
  {
    label: "비트 3~0: delta를 바꿔 돌려줄 권한",
    values: false,
    summary: "Δ 반환 flag 4개",
    focus: "delta",
    on: [] as readonly number[],
    result: "Δ = router가 내거나 받을 금액을 적는 장부 값(delta)",
    note: "아래 4비트가 켜져 있으면 hook가 swap이나 유동성 변경의 delta를 보완해 반환할 수 있습니다. 시점 스위치와 달리 이 칸은 회계 결과에 영향을 주는 표면을 엽니다.",
  },
  {
    label: "예: swap 앞뒤만 켠 hook (가정)",
    values: true,
    summary: "비트 7·6 = 1",
    focus: "all",
    on: [7, 6] as readonly number[],
    result: "swap: beforeSwap → pool.swap → afterSwap · 다른 시점은 호출 없음",
    note: "주소 끝 14비트가 00000011000000이면 swap 앞뒤 callback만 켜집니다. 유동성 추가나 donate에서는 이 hook를 부르지 않고, Δ 칸이 꺼져 있으니 delta를 바꿔 돌려줄 수도 없습니다.",
  },
  {
    label: "Callback 없이 Δ만 켜면 유효하지 않습니다",
    values: true,
    summary: "비트 3 = 1, 비트 7 = 0",
    focus: "all",
    on: [3] as readonly number[],
    result: "isValidHookAddress → false · 유효한 hook 주소가 아님",
    note: "swap 전 Δ 권한(비트 3)을 켜면서 swap 전 callback(비트 7)을 끄면 그 권한을 쓸 시점이 없습니다. 공식 Hooks.sol은 이런 조합을 유효하지 않은 hook 주소로 판정합니다.",
  },
  {
    label: "Core가 확인하는 것은 여기까지",
    values: true,
    summary: "flag 조합 · selector",
    focus: "all",
    on: [7, 6] as readonly number[],
    result: "가격 정책 · 접근 권한 · 업그레이드 안전성은 판정하지 않음",
    note: "PoolManager는 flag 조합과 callback이 올바른 selector를 반환하는지만 확인합니다. 켜진 칸 안에서 hook가 무엇을 하는지는 hook와 통합자의 책임입니다. Hook 주소도 PoolKey의 일부라서 hook를 바꾸면 다른 PoolId가 됩니다.",
  },
] as const;

const CALLBACK = "#2563eb";
const DELTA = "#d97706";

function BitCell({ flag, scene }: { flag: (typeof FLAGS)[number]; scene: (typeof SCENES)[number] }) {
  const isDelta = flag.bit <= 3;
  const color = isDelta ? DELTA : CALLBACK;
  const inFocus = scene.focus === "all" || (scene.focus === "delta") === isDelta;
  const showValues = scene.values;
  const on = scene.on.includes(flag.bit);
  return (
    <div
      title={flag.name}
      className={`flex min-w-0 flex-col items-center rounded-[4px] border px-0.5 py-1.5 text-center ${isDelta ? "border-dashed" : ""}`}
      style={{
        borderColor: inFocus ? color : "#cbd5e1",
        backgroundColor: on ? color : "transparent",
        opacity: inFocus ? 1 : 0.35,
      }}
    >
      <span className={`font-mono text-[9px] ${on ? "text-white" : "text-muted-foreground"}`}>{flag.bit}</span>
      <span className={`mt-0.5 font-mono text-sm font-bold leading-5 ${on ? "text-white" : ""}`}>{showValues ? (on ? "1" : "0") : "·"}</span>
      <span className={`mt-0.5 break-keep text-[9px] leading-3 sm:text-[10px] ${on ? "text-white" : "text-muted-foreground"}`}>{flag.short}</span>
    </div>
  );
}

function Diagram({ active }: { active: number }) {
  const scene = SCENES[active];
  return (
    <div className="min-w-0">
      <div className="flex min-w-0 items-stretch gap-1 font-mono text-[10px]">
        <div className="flex min-w-0 flex-1 items-center justify-center rounded-[4px] border border-border bg-muted/40 px-2 py-1.5 text-muted-foreground">
          상위 {UPPER_BITS}비트 · flag 아님
        </div>
        <div className="flex flex-none items-center justify-center rounded-[4px] border px-2 py-1.5 font-bold" style={{ borderColor: CALLBACK, color: CALLBACK }}>
          하위 {FLAG_BITS}비트 ↓
        </div>
      </div>
      <div className="mt-2 grid grid-cols-7 gap-1 sm:grid-cols-14">
        {FLAGS.map((flag) => <BitCell key={flag.bit} flag={flag} scene={scene} />)}
      </div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5"><span className="inline-block size-3 rounded-[3px] border" style={{ borderColor: CALLBACK }} />실선: callback 시점(비트 13~4)</span>
        <span className="flex items-center gap-1.5"><span className="inline-block size-3 rounded-[3px] border border-dashed" style={{ borderColor: DELTA }} />점선: Δ(delta) 반환 권한(비트 3~0)</span>
        <span className="flex items-center gap-1.5"><span className="inline-block size-3 rounded-[3px]" style={{ backgroundColor: CALLBACK }} />채운 칸 = 1(켜짐), 빈 칸 = 0</span>
      </div>
    </div>
  );
}

export default function HookFlagBitsViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5200);
  const labels = SCENES.map((scene) => scene.label);
  return (
    <VizFrame
      eyebrow="Hook 주소 = 스위치 판"
      title="주소 끝 14칸이 어느 시점에 hook를 부를지 정합니다"
      description="칸 하나가 한 비트입니다. 왼쪽이 비트 13, 오른쪽이 비트 0이며 배치는 이 글의 Hooks.sol 코드 보기(v4.0.0)와 같습니다."
      note="장면 4~6의 비트 조합은 읽기 위한 예시입니다(가정). 실제 hook마다 켜진 칸은 다릅니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Hook 주소 하위 14비트가 callback 시점과 delta 반환 권한을 나타내는 방식"
        onKeyDown={scenes.onKeyDown}
        className="flex min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div data-viz-live-only className="min-w-0">
          <StableSceneStack
            active={scenes.active}
            scenes={SCENES.map((scene) => (
              <div key={scene.label} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <h4 className="break-keep text-base font-bold">{scene.label}</h4>
                <span className="font-mono text-sm font-bold text-primary">{scene.summary}</span>
              </div>
            ))}
          />
          <div className="mt-4 min-w-0"><Diagram active={scenes.active} /></div>
          <StableSceneStack
            active={scenes.active}
            className="mt-3"
            scenes={SCENES.map((scene) => (
              <p key={scene.label} className="break-keep border border-border px-3 py-2 font-mono text-[11px] leading-5 sm:text-xs">{scene.result}</p>
            ))}
          />
          <StableSceneStack
            active={scenes.active}
            className="mt-4"
            scenes={SCENES.map((scene) => (
              <p key={scene.label} className="border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">{scene.note}</p>
            ))}
          />
        </div>
        <AnimatedSceneControls {...scenes} labels={labels} />
        <StaticSceneList labels={labels} notes={SCENES.map((scene) => `${scene.result} — ${scene.note}`)} />
      </div>
    </VizFrame>
  );
}
