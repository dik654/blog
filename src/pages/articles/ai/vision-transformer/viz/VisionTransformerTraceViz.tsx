import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["Patch 나누기", "Token 투영", "순서 넣기", "Encoder 읽기"] as const;

const NOTES = [
  "224px 한 변을 16px 간격으로 나누면 세로 14칸, 가로 14칸입니다. 그래서 patch는 196개입니다.",
  "Patch 하나에는 16×16×3=768개 값이 있습니다. 모든 patch가 같은 projection을 거쳐 D차원 token이 됩니다.",
  "196개 patch token 앞에 [CLS] 하나를 붙이고 각 자리에 position embedding을 더하면 sequence 길이는 197입니다.",
  "Transformer encoder는 길이 197을 유지하며 token 사이 관계를 갱신합니다. 마지막에는 [CLS] 출력 하나를 K개 class logit으로 바꿉니다.",
] as const;

const STATIC_STEPS = [
  ["Patch 나누기", "224÷16=14 · 14×14=196 patches"],
  ["Token 투영", "patch 1개=16×16×3=768 values · shared projection → D=768"],
  ["순서 넣기", "196 patch tokens + [CLS] 1개 + position → [B,197,768]"],
  ["Encoder 읽기", "[B,197,768] → Transformer encoder → [B,197,768] → [B,K] logits"],
] as const;

function ImageGrid({ active }: { active: number }) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-bold text-muted-foreground">입력 image</p>
      <div
        className={`mt-3 grid aspect-square w-full max-w-[8.5rem] grid-cols-[repeat(14,minmax(0,1fr))] border transition-colors duration-500 ${
          active === 0 ? "border-primary" : "border-border"
        }`}
        aria-label="14행 14열 patch grid"
      >
        {Array.from({ length: 196 }, (_, index) => (
          <span
            key={index}
            className={`border-b border-r border-border/35 last:border-r-0 ${
              active === 0 && index === 15 ? "bg-primary" : "bg-background"
            }`}
          />
        ))}
      </div>
      <code className="mt-3 block text-[13px]">224×224×3</code>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">P=16 · 14×14칸</p>
    </div>
  );
}

function Projection({ active }: { active: number }) {
  return (
    <div className={`min-w-0 border-l-2 pl-3 transition-colors duration-500 ${active === 1 ? "border-primary" : "border-border"}`}>
      <p className="text-xs font-bold text-muted-foreground">Patch 하나</p>
      <code className="mt-3 block break-words text-[13px]">16×16×3</code>
      <strong className="mt-1 block font-mono text-xl">= 768</strong>
      <div className="my-3 h-px bg-border" />
      <p className="text-xs font-bold text-muted-foreground">모두 같은 E 사용</p>
      <code className={`mt-2 block text-[13px] ${active === 1 ? "text-primary" : "text-foreground"}`}>768 → D=768</code>
    </div>
  );
}

function Sequence({ active }: { active: number }) {
  const tokens = ["[CLS]", "p₁+pos₁", "p₂+pos₂", "…", "p₁₉₆+pos₁₉₆"];
  return (
    <div className="min-w-0">
      <p className="text-xs font-bold text-muted-foreground">Encoder input</p>
      <ol className="mt-3 space-y-1">
        {tokens.map((token, index) => (
          <li
            key={token}
            className={`flex min-h-8 items-center justify-between gap-2 border-b px-2 font-mono text-xs transition-colors duration-500 ${
              active === 2 && index === 0
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground"
            }`}
          >
            <span>{token}</span>
            {index < 3 && <span className="text-[11px]">D</span>}
          </li>
        ))}
      </ol>
      <code className="mt-3 block text-[13px]">[B,197,768]</code>
    </div>
  );
}

function Encoder({ active }: { active: number }) {
  return (
    <div className={`min-w-0 border-y py-3 transition-colors duration-500 ${active === 3 ? "border-primary" : "border-border"}`}>
      <p className="text-xs font-bold text-muted-foreground">Transformer encoder</p>
      <ol className="mt-3 space-y-2 text-xs">
        <li className="border-l border-border pl-2">attention</li>
        <li className="border-l border-border pl-2">MLP</li>
        <li className="border-l border-border pl-2">× L blocks</li>
      </ol>
      <div className="my-3 h-px bg-border" />
      <code className="block text-xs">[CLS] → head</code>
      <strong className={`mt-1 block text-base ${active === 3 ? "text-primary" : "text-foreground"}`}>K class logits</strong>
    </div>
  );
}

function Connector({ active }: { active: boolean }) {
  return (
    <div aria-hidden="true" className="relative hidden h-px w-4 bg-border lg:block">
      <motion.span
        className="absolute -top-1 left-0 size-2 rounded-full bg-primary"
        initial={false}
        animate={{ x: active ? 8 : 0, opacity: active ? 1 : 0.25 }}
        transition={{ duration: 0.75, ease: "easeInOut" }}
      />
    </div>
  );
}

function DesktopTrace({ active }: { active: number }) {
  return (
    <div className="hidden sm:block">
      <div className="relative mb-7">
        <div className="absolute left-[12.5%] right-[12.5%] top-[.42rem] h-px bg-border" />
        <motion.span
          aria-hidden="true"
          className="absolute top-0 size-3 -translate-x-1/2 rounded-full bg-primary"
          initial={false}
          animate={{ left: `${12.5 + active * 25}%` }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        />
        <ol className="relative grid grid-cols-4 gap-2 pt-6 text-center">
          {LABELS.map((label, index) => (
            <li key={label} className={`break-keep text-xs font-bold leading-5 ${index === active ? "text-foreground" : "text-muted-foreground"}`}>
              {label}
            </li>
          ))}
        </ol>
      </div>

      <div className="grid min-w-0 items-center gap-3 lg:grid-cols-[minmax(0,.95fr)_1rem_minmax(0,.95fr)_1rem_minmax(0,1.2fr)_1rem_minmax(0,1fr)]">
        <ImageGrid active={active} />
        <Connector active={active >= 1} />
        <Projection active={active} />
        <Connector active={active >= 2} />
        <Sequence active={active} />
        <Connector active={active >= 3} />
        <Encoder active={active} />
      </div>
    </div>
  );
}

function MobileTrace({ active }: { active: number }) {
  return (
    <ol className="space-y-px bg-border p-px sm:hidden">
      {STATIC_STEPS.map(([title, detail], index) => (
        <li key={title} className={`bg-background px-3 py-3 ${index === active ? "border-l-2 border-primary" : "border-l-2 border-transparent"}`}>
          <span className="font-mono text-[11px] font-black text-primary">{String(index + 1).padStart(2, "0")}</span>
          <strong className="ml-2 break-keep text-sm">{title}</strong>
          <code className="mt-1 block break-words text-xs leading-5 text-muted-foreground">{detail}</code>
        </li>
      ))}
    </ol>
  );
}

export default function VisionTransformerTraceViz() {
  const controls = useAnimatedScenes(LABELS.length, 5200, { loop: false, autoPlay: false });

  return (
    <VizFrame
      eyebrow="이미지 하나 추적"
      title="224×224×3 이미지가 길이 197의 token sequence로 바뀝니다"
      description="재생하거나 장면을 고른 뒤, 같은 이미지의 shape가 어디에서 바뀌는지 왼쪽부터 따라갑니다."
      className="my-8 !block !h-auto !max-h-none !overflow-visible"
      canvasClassName="!h-auto !max-h-none !flex-none !overflow-visible"
    >
      <div
        id={controls.playbackId}
        data-viz-id="vision-transformer-shape-trace"
        tabIndex={0}
        onKeyDown={controls.onKeyDown}
        className="min-w-0 outline-none focus-visible:ring-2 focus-visible:ring-primary sm:!min-h-0 [&_[data-viz-controls]>p]:hidden"
      >
        <div data-viz-live-only role="img" aria-label={`${LABELS[controls.active]}: ${NOTES[controls.active]}`}>
          <MobileTrace active={controls.active} />
          <DesktopTrace active={controls.active} />
          <p className="mt-5 min-h-24 border-l-2 border-primary/50 pl-3 text-sm leading-6 text-muted-foreground sm:min-h-12">
            {NOTES[controls.active]}
          </p>
        </div>
        <AnimatedSceneControls labels={LABELS} {...controls} />
        <ol className="static-reading-only mt-4 divide-y divide-border border-y border-border text-sm leading-6">
          {STATIC_STEPS.map(([title, detail], index) => (
            <li key={title} className="grid gap-1 py-3 sm:grid-cols-[8rem_minmax(0,1fr)]">
              <strong>{index + 1}. {title}</strong>
              <code className="break-words text-xs text-muted-foreground">{detail}</code>
            </li>
          ))}
        </ol>
      </div>
    </VizFrame>
  );
}
