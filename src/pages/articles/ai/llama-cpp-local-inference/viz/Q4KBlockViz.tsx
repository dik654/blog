import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: Weights.tsx #k-quant-block — Q4_K super-block 하나(가중치 256개)
 * 한 mechanism: 256칸을 32칸 작은 블록 8개로 나누고, 작은 블록마다 6비트 sc·m 한 쌍,
 * 블록 전체에 f16 d·dmin 한 쌍을 붙인다. 값은 x = d·sc·q − dmin·m으로 되돌린다.
 * 4 + 12 + 128 = 144 byte(값당 4.5비트).
 */
const SCENES = ["가중치 256개", "작은 블록 8개", "sc·m 6비트 16개", "값 하나 복원", "byte 합계", "8B 모델 전체"] as const;

const NOTES = [
  "super-block 하나는 가중치 256개입니다. 한 칸이 가중치 하나이고 16 × 16칸입니다. F16으로 두면 칸마다 2 byte라 512 byte입니다.",
  "256칸을 32칸씩 작은 블록 8개로 나눕니다. 격자에서는 두 줄이 작은 블록 하나입니다. 칸마다 남는 것은 0~15의 4비트 정수 q 하나라 128 byte입니다.",
  "작은 블록마다 배율 sc와 빼는 값 m이 하나씩, 모두 16개 붙습니다. 각각 6비트라 16 × 6 = 96비트 = 12 byte입니다. 맨 위 d·dmin은 블록 전체에 하나씩 f16으로 4 byte입니다.",
  "3번 작은 블록의 칸 하나를 되돌립니다. q = 15, 그 블록의 sc = 2, m = 1, 블록 전체 d = 0.5, dmin = 0.25이면 0.5 × 2 × 15 − 0.25 × 1 = 14.75입니다.",
  "d·dmin 4 + sc·m 12 + 값 128 = 144 byte입니다. 같은 256개를 Q8_0(32개마다 34 byte)로 두면 272, F16이면 512 byte입니다.",
  "Llama 3.1 8B의 가중치 8.03 × 10⁹개 전부를 각 형식으로 둔다고 가정한 크기입니다. 실제 파일은 텐서마다 형식을 섞어 이 값과 다릅니다.",
] as const;

const SUB = ["#bfdbfe", "#93c5fd"] as const;
const SUB_BORDER = "#2563eb";
const SCALE = { border: "#d97706", fill: "#fef3c7", text: "#78350f" };
const SUPER = { border: "#7c3aed", fill: "#ede9fe", text: "#4c1d95" };
const FOCUS_SUB = 2;
const FOCUS_CELL = 5;

const TOTALS = [
  { name: "F16", bytes: 512, bits: "16", model: "16.06 GB" },
  { name: "Q8_0", bytes: 272, bits: "8.5", model: "8.53 GB" },
  { name: "Q4_K", bytes: 144, bits: "4.5", model: "4.52 GB" },
] as const;

function BlockGrid({ step, reduced }: { step: number; reduced: boolean }) {
  const split = step >= 1;
  const scales = step >= 2;
  const focus = step === 3;
  return (
    <div>
      <div className="mb-1.5 flex min-h-6 items-center gap-1.5">
        {scales ? (
          <>
            {["d", "dmin"].map((n) => (
              <span
                key={n}
                className="rounded-sm border px-1.5 py-0.5 font-mono text-[10px] font-bold"
                style={{ borderColor: SUPER.border, backgroundColor: SUPER.fill, color: SUPER.text }}
              >
                {n} f16{focus ? (n === "d" ? " = 0.5" : " = 0.25") : ""}
              </span>
            ))}
            <span className="text-[10px] text-muted-foreground">블록 전체 4 byte</span>
          </>
        ) : (
          <span className="text-[10px] text-muted-foreground">16 × 16 = 256칸</span>
        )}
      </div>
      <div className="grid gap-[3px] sm:grid-cols-2 sm:gap-x-4">
        {Array.from({ length: 8 }, (_, s) => (
          <div key={s} className="grid grid-cols-[minmax(0,12rem)_4.5rem] items-center gap-1.5">
            <div
              className="grid grid-cols-16 gap-px rounded-[2px] border p-px"
              style={{ borderColor: split ? SUB_BORDER : "transparent", opacity: focus && s !== FOCUS_SUB ? 0.35 : 1 }}
            >
              {Array.from({ length: 32 }, (_, c) => {
                const hit = focus && s === FOCUS_SUB && c === FOCUS_CELL;
                return (
                  <motion.span
                    key={c}
                    className="block aspect-square rounded-[1px]"
                    initial={false}
                    animate={{ backgroundColor: hit ? "#f59e0b" : split ? SUB[s % 2] : "#e2e8f0" }}
                    transition={{ duration: reduced ? 0 : 0.25, delay: reduced ? 0 : split && step === 1 ? s * 0.08 : 0 }}
                  />
                );
              })}
            </div>
            <div className="flex items-center gap-1">
              {scales ? (
                <>
                  <motion.span
                    className="rounded-[2px] border px-1 font-mono text-[9px] font-bold leading-4"
                    style={{ borderColor: SCALE.border, backgroundColor: SCALE.fill, color: SCALE.text }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: focus && s !== FOCUS_SUB ? 0.35 : 1 }}
                    transition={{ duration: reduced ? 0 : 0.25, delay: reduced ? 0 : step === 2 ? s * 0.08 : 0 }}
                  >
                    {focus && s === FOCUS_SUB ? "sc=2" : "sc"}
                  </motion.span>
                  <motion.span
                    className="rounded-[2px] border px-1 font-mono text-[9px] font-bold leading-4"
                    style={{ borderColor: SCALE.border, backgroundColor: SCALE.fill, color: SCALE.text }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: focus && s !== FOCUS_SUB ? 0.35 : 1 }}
                    transition={{ duration: reduced ? 0 : 0.25, delay: reduced ? 0 : step === 2 ? s * 0.08 + 0.04 : 0 }}
                  >
                    {focus && s === FOCUS_SUB ? "m=1" : "m"}
                  </motion.span>
                </>
              ) : split ? (
                <span className="font-mono text-[10px] font-bold text-[#1e3a8a]">#{s + 1} · 32</span>
              ) : null}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-2 min-h-[2.5rem] font-mono text-[11px] font-bold text-foreground">
        {step === 0 && "256칸 × 2 byte = 512 byte"}
        {step === 1 && "작은 블록 8 × 32칸 · q 4비트 × 256 = 128 byte"}
        {step === 2 && "sc·m 16개 × 6비트 = 12 byte · d·dmin 4 byte"}
        {step === 3 && (
          <>
            x = d·sc·q − dmin·m = 0.5 × 2 × <span className="text-[#b45309]">15</span> − 0.25 × 1 = 14.75
          </>
        )}
      </p>
    </div>
  );
}

function ByteBars({ model }: { model: boolean }) {
  return (
    <ul className="space-y-3">
      {TOTALS.map((row) => (
        <li key={row.name} className="min-w-0">
          <div className="flex items-baseline justify-between text-xs">
            <span className="font-bold text-foreground">
              {row.name} · {row.bits}비트
            </span>
            <span className="font-mono font-bold text-foreground">{model ? row.model : `${row.bytes} byte`}</span>
          </div>
          <div className="mt-1 flex h-4 w-full overflow-hidden rounded-sm border border-dashed border-muted-foreground/50">
            {row.name === "Q4_K" && !model ? (
              <>
                <span className="h-full" style={{ width: `${(4 / 512) * 100}%`, backgroundColor: SUPER.border }} />
                <span className="h-full" style={{ width: `${(12 / 512) * 100}%`, backgroundColor: SCALE.border }} />
                <span className="h-full" style={{ width: `${(128 / 512) * 100}%`, backgroundColor: SUB_BORDER }} />
              </>
            ) : (
              <span className="h-full" style={{ width: `${(row.bytes / 512) * 100}%`, backgroundColor: "#94a3b8" }} />
            )}
          </div>
        </li>
      ))}
      {!model ? <li className="text-[11px] text-muted-foreground">Q4_K 막대: 보라 d·dmin 4 · 주황 sc·m 12 · 파랑 값 128</li> : null}
    </ul>
  );
}

export default function Q4KBlockViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const step = scenes.active;
  const reduced = scenes.reducedMotion;
  // 장면 1~4는 같은 격자의 상태 변화, 5·6은 막대 비교다.
  const nodes = [
    <BlockGrid key="grid" step={Math.min(step, 3)} reduced={reduced || step > 3} />,
    <ByteBars key="b" model={false} />,
    <ByteBars key="m" model />,
  ];

  return (
    <VizFrame
      eyebrow="GGUF K-quant block"
      title="256칸을 32칸 작은 블록 8개로 나누고 배율은 6비트로 붙입니다"
      description="격자 한 칸이 가중치 하나, 두 줄이 작은 블록 하나입니다. 주황 칸은 작은 블록의 sc·m, 보라 칸은 블록 전체의 d·dmin입니다."
      note="복원 장면의 q·sc·m·d·dmin 값은 설명용 예시입니다. 마지막 장면은 모든 텐서를 한 형식으로 둔다는 가정의 계산입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Q4_K super-block의 칸 배치"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-1 text-base font-bold">{SCENES[step]}</h4>
          <StableSceneStack active={step <= 3 ? 0 : step - 3} scenes={nodes} className="mt-3 max-w-xl" />
          <p className="mt-4 min-h-[10.5rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[9rem] sm:min-h-[3.5rem]">
            {NOTES[step]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
