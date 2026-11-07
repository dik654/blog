import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #parameter-contract — u32 word 8개의 포장.
 * L32=n=8, L64=n/2=4, q_j=m_2j + 2^32·m_(2j+1), INV_w=−p_0⁻¹ mod 2^w. r2는 입력 그대로.
 */
const WORDS = [0, 1, 2, 3, 4, 5, 6, 7];
const PAIRS = [0, 1, 2, 3];
const SUB = "₀₁₂₃₄₅₆₇";

const SCENES = [
  { label: "입력은 word 8개", summary: "u32 × 8", note: "GpuField는 one, r2, modulus를 각각 little-endian u32 배열로 줍니다. little-endian은 낮은 자리 word가 앞에 온다는 뜻입니다." },
  { label: "CUDA 경로", summary: "L₃₂ = 8", note: "32-bit limb를 쓰는 CUDA source는 word를 그대로 한 칸씩 옮깁니다. 칸 수는 8개로 입력과 같습니다." },
  { label: "OpenCL 경로", summary: "L₆₄ = 8 ÷ 2 = 4", note: "인접한 두 word를 64-bit limb 하나로 묶습니다. 칸 안 왼쪽 word가 아래 32bit, 오른쪽 word가 위 32bit입니다. 값은 같은 256bit이고 배열 모양만 다릅니다." },
  { label: "R²는 그대로, INV는 다시 계산", summary: "INV는 폭마다", note: "modulus를 폭 w로 포장한 가장 낮은 limb p₀가 경로마다 다르므로(테두리 칸) INV도 w=32와 w=64에서 각각 계산합니다. r2 배열은 다시 계산하지 않고 그대로 포장합니다." },
] as const;

const FOOT = [
  "아직 포장 전입니다.",
  "m₀ … m₇을 한 칸씩 그대로 씁니다.",
  "64-bit limb q₀ = m₀ + 2³²·m₁, q₁ = m₂ + 2³²·m₃, …",
  "INV_w = −p₀⁻¹ mod 2^w",
];

function Cell({ text, on, strong = false }: { text: string; on: boolean; strong?: boolean }) {
  return (
    <div className={`flex h-9 min-w-0 items-center justify-center rounded border font-mono text-xs sm:text-sm ${strong ? "border-primary bg-background font-bold text-primary" : on ? "border-border bg-background" : "border-dashed border-border/50 text-muted-foreground/50"}`}>
      {text}
    </div>
  );
}

function PairCell({ low, on, strong }: { low: number; on: boolean; strong: boolean }) {
  return (
    <div className={`col-span-2 flex h-9 min-w-0 items-center overflow-hidden rounded border font-mono text-xs sm:text-sm ${strong ? "border-primary bg-background font-bold text-primary" : on ? "border-border bg-background" : "border-dashed border-border/50 text-muted-foreground/50"}`}>
      <span className="min-w-0 flex-1 text-center">m{SUB[low]}</span>
      <span className="min-w-0 flex-1 border-l border-border/60 text-center opacity-70">m{SUB[low + 1]}</span>
    </div>
  );
}

export default function LimbPackingViz() {
  return (
    <SceneShell
      eyebrow="backend별 포장"
      title="같은 u32 word 8개가 CUDA에서는 8칸, OpenCL에서는 4칸이 됩니다"
      description="limb는 큰 수를 나눠 담는 한 칸입니다. 세 줄에서 위아래로 겹치는 칸은 같은 비트 자리입니다. 8개는 이 글의 예이고, 설명하는 경로는 commit 16d38ef의 포장 방식입니다."
      ariaLabel="u32 word 여덟 개가 CUDA 32비트 limb 여덟 개와 OpenCL 64비트 limb 네 개로 포장되는 모습"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 space-y-4">
          <div className="space-y-1.5">
            <p className="text-sm font-semibold">GpuField 입력: u32 word</p>
            <div className="grid grid-cols-8 gap-1">
              {WORDS.map((word) => <Cell key={word} text={`m${SUB[word]}`} on />)}
            </div>
          </div>
          <div className="space-y-1.5">
            <p className={`text-sm font-semibold ${active === 1 || active === 3 ? "" : "text-muted-foreground"}`}>CUDA source: 32-bit limb 8개</p>
            <div className="grid grid-cols-8 gap-1">
              {WORDS.map((word) => <Cell key={word} text={`m${SUB[word]}`} on={active === 1 || active === 3} strong={active === 3 && word === 0} />)}
            </div>
          </div>
          <div className="space-y-1.5">
            <p className={`text-sm font-semibold ${active >= 2 ? "" : "text-muted-foreground"}`}>OpenCL source: 64-bit limb 4개</p>
            <div className="grid grid-cols-8 gap-1">
              {PAIRS.map((pair) => <PairCell key={pair} low={pair * 2} on={active >= 2} strong={active === 3 && pair === 0} />)}
            </div>
          </div>
          <StableSceneStack
            active={active}
            scenes={FOOT.map((line) => <p key={line} className="font-mono text-sm text-muted-foreground">{line}</p>)}
          />
        </div>
      )}
    />
  );
}
