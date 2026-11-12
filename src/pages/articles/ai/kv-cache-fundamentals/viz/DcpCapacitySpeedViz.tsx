import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #parallel-budget — 커뮤니티 위키의 Kimi K2.5 8장 기록.
 * 담을 수 있는 token: BF16·DCP1 약 19만, FP8·DCP1 약 44.9만, FP8·DCP8·gpu-util 0.93 3,621,504.
 * 20만 token 칸으로 나누면 0.95 · 2.245 · 18.1칸. 단일 요청 속도는 90 · 79 · 65 tok/s.
 */
const REQUEST = 200_000;
const SLOTS = 19;
const SPEED_MAX = 100;

const CONFIGS = [
  { name: "BF16 · DCP 없음", tokens: 190_000, slotsText: "0.95", speed: 90 },
  { name: "FP8 · DCP 없음", tokens: 449_000, slotsText: "2.2", speed: 79 },
  { name: "FP8 · DCP 8", tokens: 3_621_504, slotsText: "18.1", speed: 65 },
] as const;

const SCENES = [
  {
    label: "BF16 · DCP 없음",
    summary: "약 19만 token · 90 tok/s",
    shown: 1,
    note: "칸 하나가 20만 token 요청 하나입니다. 19만 ÷ 20만 = 0.95칸이라 요청 하나 수준에서 공간이 끝납니다. 이때 단일 요청 속도는 90 tok/s입니다.",
  },
  {
    label: "FP8 KV로 바꾸기",
    summary: "약 44.9만 token · 79 tok/s",
    shown: 2,
    note: "숫자 하나가 2byte에서 1byte가 되어 담는 양이 약 2.2칸으로 늘었습니다. 단순 2배(1.9칸)보다 조금 많은 이유는 위키에 적혀 있지 않습니다. 속도는 90에서 79 tok/s로 내려갑니다. 여기까지는 DCP를 켜지 않았습니다.",
  },
  {
    label: "DCP 8까지 켜기",
    summary: "3,621,504 token ≈ 18칸 · 65 tok/s",
    shown: 3,
    note: "DCP는 같은 latent를 든 rank들이 token 축을 나눠 갖게 하는 설정입니다. 이 조건에서는 vLLM이 쓸 GPU 메모리 상한 비율인 gpu-util도 0.93으로 두었습니다. 칸은 약 18.1개로 늘고, 속도의 DCP 몫은 79에서 65 tok/s입니다.",
  },
  {
    label: "DCP 없는 긴 문맥 보고",
    summary: "150K 문맥 · 6~7 tok/s 보고",
    shown: 4,
    note: "DCP 없이 150K 문맥에서는 6~7 tok/s로 무너졌다는 보고도 있습니다. 문맥 길이가 위 세 줄과 같다는 정보가 없어 같은 막대로 그리지 않고 따로 표시했습니다.",
  },
] as const;

function SlotRow({ tokens, on, strong }: { tokens: number; on: boolean; strong: boolean }) {
  const filled = tokens / REQUEST;
  return (
    <svg viewBox={`0 0 ${SLOTS * 12} 14`} className="block h-3.5 w-full" preserveAspectRatio="none" aria-hidden>
      {Array.from({ length: SLOTS }, (_, i) => {
        const part = on ? Math.max(0, Math.min(1, filled - i)) : 0;
        return (
          <g key={i}>
            <rect x={i * 12 + 1} y={1} width={10} height={12} rx={1.5} fill="none" stroke="#94a3b8" strokeWidth={0.75} />
            {part > 0 && <rect x={i * 12 + 1} y={1} width={10 * part} height={12} rx={1.5} fill={strong ? "#2563eb" : "#93c5fd"} />}
          </g>
        );
      })}
    </svg>
  );
}

export default function DcpCapacitySpeedViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4600);
  const labels = SCENES.map((scene) => scene.label);
  const shown = SCENES[scenes.active].shown;

  return (
    <VizFrame
      eyebrow="담는 양과 속도"
      title="FP8과 DCP로 담는 요청은 늘고 단일 요청 속도는 내려갑니다"
      description="Kimi K2.5를 GPU 8장에서 돌린 커뮤니티 기록입니다. DCP(decode context parallel)는 같은 latent를 든 GPU들이 token 축을 나눠 갖는 설정이고, DCP 8은 8장에 나눈다는 뜻입니다. 위는 20만 token 요청을 몇 개 담는지, 아래는 같은 세 조건에서 요청 하나가 초당 만드는 token 수(tok/s)입니다."
      note="위키 수치는 디스코드 대화를 정리한 것이라 장비 조건이 일부 빠져 있습니다. DCP drift 버그(vllm#41623)는 2026-11-03 기준 열려 있습니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="BF16, FP8, FP8과 DCP 8에서 담을 수 있는 20만 token 요청 수와 단일 요청 속도 비교"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <StableSceneStack
          active={scenes.active}
          scenes={SCENES.map((scene) => (
            <div key={scene.label} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h4 className="text-base font-bold">{scene.label}</h4>
              <span className="font-mono text-sm font-bold text-primary">{scene.summary}</span>
            </div>
          ))}
        />

        <div className="mt-3 min-w-0 space-y-3 sm:mt-4 sm:space-y-5">
          <div>
            <p className="text-xs font-bold text-muted-foreground">담을 수 있는 양 · 칸 하나 = 20만 token 요청 하나</p>
            <div className="mt-1.5 space-y-1.5 sm:mt-2 sm:space-y-2">
              {CONFIGS.map((config, index) => {
                const on = index < shown;
                const strong = index === Math.min(shown, 3) - 1 && shown <= 3;
                return (
                  <div key={config.name} className={`grid grid-cols-[5.5rem_minmax(0,1fr)_3rem] items-center gap-2 text-xs sm:grid-cols-[7.5rem_minmax(0,1fr)_3.5rem] ${on ? "" : "opacity-40"}`}>
                    <span className={strong ? "font-bold" : "text-muted-foreground"}>{config.name}</span>
                    <SlotRow tokens={config.tokens} on={on} strong={strong} />
                    <span className="text-right font-mono">{on ? config.slotsText : "−"}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold text-muted-foreground">단일 요청 속도 · tok/s (0~100)</p>
            <div className="mt-1.5 space-y-1.5 sm:mt-2 sm:space-y-2">
              {CONFIGS.map((config, index) => {
                const on = index < shown;
                const strong = index === Math.min(shown, 3) - 1 && shown <= 3;
                return (
                  <div key={config.name} className={`grid grid-cols-[5.5rem_minmax(0,1fr)_3rem] items-center gap-2 text-xs sm:grid-cols-[7.5rem_minmax(0,1fr)_3.5rem] ${on ? "" : "opacity-40"}`}>
                    <span className={strong ? "font-bold" : "text-muted-foreground"}>{config.name}</span>
                    <div className="h-3.5 min-w-0 rounded-sm bg-muted/40">
                      <div
                        className="h-full rounded-sm transition-[width] duration-300 motion-reduce:transition-none"
                        style={{ width: on ? `${(config.speed / SPEED_MAX) * 100}%` : "0%", backgroundColor: strong ? "#d97706" : "#fcd34d" }}
                      />
                    </div>
                    <span className="text-right font-mono">{on ? config.speed : "−"}</span>
                  </div>
                );
              })}
              <div className={`grid grid-cols-[5.5rem_minmax(0,1fr)_3rem] items-center gap-2 text-xs sm:grid-cols-[7.5rem_minmax(0,1fr)_3.5rem] ${shown === 4 ? "" : "opacity-0"}`} aria-hidden={shown !== 4}>
                <span className="font-bold">150K · DCP 없음</span>
                <div className="relative h-3.5 min-w-0 rounded-sm border border-dashed border-red-600/70">
                  <div className="absolute inset-y-0 rounded-sm" style={{ left: "6%", width: "1%", backgroundColor: "#dc2626" }} />
                </div>
                <span className="text-right font-mono">6~7</span>
              </div>
            </div>
          </div>
        </div>

        <StableSceneStack
          active={scenes.active}
          className="mt-4"
          scenes={SCENES.map((scene) => (
            <p key={scene.label} className="border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
              {scene.note}
            </p>
          ))}
        />
        <AnimatedSceneControls {...scenes} labels={labels} />
        <StaticSceneList labels={labels} notes={SCENES.map((scene) => scene.note)} />
      </div>
    </VizFrame>
  );
}
