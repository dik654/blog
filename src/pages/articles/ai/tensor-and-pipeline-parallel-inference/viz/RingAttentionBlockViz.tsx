import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #sequence-context-parallel — Ring Attention 의 context-parallel prefill
 * 한 mechanism: GPU i 는 query block Q_i 를 계속 들고, step s 에는 KV block (i − s) mod 4 를 받아 부분 attention 을 누적한다.
 * 4 step 이 지나면 4 × 4 = 16 칸(query block × KV block)이 모두 한 번씩 계산된다.
 * 숨기기 조건 c ≥ F/B: 계산 4dc²/F 와 전송 4cd/B 의 비는 c ÷ (F/B). NVLink 300 GB/s 면 F/B ≈ 1000, IB 12.5 GB/s 면 ≈ 25000 token.
 */
const N = 4;
const GPU = ["#2563eb", "#0d9488", "#d97706", "#7c3aed"] as const;
const FILL = ["#dbeafe", "#ccfbf1", "#fef3c7", "#ede9fe"] as const;
const kvAt = (gpu: number, step: number) => (((gpu - step) % N) + N) % N;

interface Scene {
  label: string;
  step: number;
  note: string;
}

const SCENES: readonly Scene[] = [
  { label: "sequence 를 4 block 으로", step: -1, note: "긴 prompt 를 GPU 4 장 수만큼 block 4개로 자릅니다. GPU i 는 block i 의 Q·K·V 를 로컬 projection 으로 만듭니다. 아래 격자는 행이 query block, 열이 KV block 이고 아직 계산한 칸이 없습니다." },
  { label: "step 0 · 자기 KV", step: 0, note: "모든 GPU 가 자기 KV block 으로 부분 attention 을 계산합니다. 격자의 대각선 4칸이 찹니다. 계산하는 동안 들고 있는 KV block 을 오른쪽 이웃으로 보냅니다." },
  { label: "step 1 · 왼쪽 이웃의 KV", step: 1, note: "GPU i 는 GPU i−1 이 보낸 KV block 을 받아 계산하고 running max m 과 분모 l 을 갱신합니다. 각 행에 두 번째 칸이 찹니다." },
  { label: "step 2", step: 2, note: "KV block 이 한 칸 더 돌아 각 GPU 가 세 번째 KV block 을 봅니다. 어느 GPU 도 전체 sequence 를 한꺼번에 들지 않습니다." },
  { label: "step 3 · 한 바퀴", step: 3, note: "네 번째 step 에서 16칸이 모두 찹니다. 각 query block 이 모든 KV block 을 한 번씩 본 셈이라 결과는 전체 attention 과 같습니다. 그 뒤 O/l 로 정규화합니다." },
  { label: "전송이 숨는 조건", step: 3, note: "한 step 안에서 계산은 c² 에, 전송은 c 에 비례하므로 block 이 클수록 계산이 전송을 덮습니다. 비가 c ÷ (F/B) 라 NVLink 에서는 c ≈ 1000 이 경계이고 IB 에서는 c = 1000 이면 전송이 계산의 25 배입니다." },
];

function Ring({ step }: { step: number }) {
  const pos = [
    { x: 85, y: 20 },
    { x: 145, y: 80 },
    { x: 85, y: 140 },
    { x: 25, y: 80 },
  ];
  return (
    <svg viewBox="0 0 170 160" className="h-auto w-full max-w-[11rem]" role="img" aria-label="GPU 4 장의 ring 과 들고 있는 KV block">
      {pos.map((p, i) => {
        const n = pos[(i + 1) % N];
        return (
          <line key={`e${i}`} x1={p.x} y1={p.y} x2={n.x} y2={n.y} stroke={step >= 0 ? "#64748b" : "#cbd5e1"} strokeWidth={1} strokeDasharray={step >= 0 ? undefined : "3 2"} />
        );
      })}
      {pos.map((p, i) => {
        const kv = step >= 0 ? kvAt(i, step) : i;
        return (
          <g key={i}>
            <rect x={p.x - 23} y={p.y - 15} width={46} height={30} rx={3} fill="#ffffff" stroke={GPU[i]} strokeWidth={1} />
            <text x={p.x} y={p.y - 4} textAnchor="middle" fontSize={8} fontWeight={700} fill={GPU[i]}>
              GPU {i} · Q{i}
            </text>
            <motion.rect
              key={`${kv}-${step}`}
              x={p.x - 13}
              y={p.y + 1}
              width={26}
              height={11}
              rx={2}
              fill={FILL[kv]}
              stroke={GPU[kv]}
              strokeWidth={1}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35 }}
            />
            <text x={p.x} y={p.y + 10} textAnchor="middle" fontSize={8} fontWeight={700} fill="#334155">
              KV{kv}
            </text>
          </g>
        );
      })}
      <text x={85} y={84} textAnchor="middle" fontSize={8} fill="#64748b">
        → 이웃으로
      </text>
    </svg>
  );
}

function Grid({ step, reduced }: { step: number; reduced: boolean }) {
  return (
    <div>
      <div className="grid grid-cols-[3rem_repeat(4,minmax(0,2.25rem))] gap-1">
        <span />
        {Array.from({ length: N }, (_, j) => (
          <span key={j} className="text-center font-mono text-[10px] font-bold" style={{ color: GPU[j] }}>
            KV{j}
          </span>
        ))}
        {Array.from({ length: N }, (_, i) => (
          <div key={i} className="contents">
            <span className="font-mono text-[10px] font-bold leading-7" style={{ color: GPU[i] }}>
              Q{i}
            </span>
            {Array.from({ length: N }, (_, j) => {
              const doneAt = (((i - j) % N) + N) % N;
              const done = step >= doneAt;
              const now = step === doneAt;
              return (
                <motion.span
                  key={j}
                  className="flex h-7 items-center justify-center rounded-[2px] border font-mono text-[9px] font-bold"
                  initial={false}
                  animate={{ backgroundColor: done ? (now ? GPU[j] : FILL[j]) : "rgba(0,0,0,0)", borderColor: done ? GPU[j] : "#cbd5e1", color: now ? "#ffffff" : "#334155" }}
                  transition={{ duration: reduced ? 0 : 0.3 }}
                >
                  {done ? `s${doneAt}` : ""}
                </motion.span>
              );
            })}
          </div>
        ))}
      </div>
      <p className="mt-2 font-mono text-[11px] font-bold text-foreground">
        계산한 칸 {step < 0 ? 0 : (step + 1) * N} / 16 · 행마다 {step < 0 ? 0 : step + 1} / 4
      </p>
    </div>
  );
}

const HIDE = [
  { name: "NVLink · c = 2,000", compute: 2, transfer: 1, verdict: "전송이 계산 뒤에 숨음" },
  { name: "NVLink · c = 500", compute: 0.5, transfer: 1, verdict: "계산이 끝나고 전송을 기다림" },
  { name: "InfiniBand · c = 1,000", compute: 0.04, transfer: 1, verdict: "전송이 계산의 25배" },
] as const;

function HideBars() {
  return (
    <div className="space-y-2.5">
      {HIDE.map((r) => (
        <div key={r.name}>
          <div className="flex flex-wrap items-baseline justify-between gap-x-2 text-[11px]">
            <span className="font-bold text-foreground">{r.name}</span>
            <span className="text-muted-foreground">{r.verdict}</span>
          </div>
          <div className="mt-1 space-y-[3px]">
            <div className="flex items-center gap-2">
              <span className="w-8 shrink-0 text-[10px] text-muted-foreground">계산</span>
              <span className="block h-3 rounded-[2px] bg-[#2563eb]" style={{ width: `${Math.max(r.compute / 2, 0.012) * 80}%` }} />
            </div>
            <div className="flex items-center gap-2">
              <span className="w-8 shrink-0 text-[10px] text-muted-foreground">전송</span>
              <span className="block h-3 rounded-[2px] border border-[#dc2626] bg-[#fee2e2]" style={{ width: `${(r.transfer / 2) * 80}%` }} />
            </div>
          </div>
        </div>
      ))}
      <p className="font-mono text-[11px] font-bold text-foreground">계산 ÷ 전송 = c ÷ (F/B) · NVLink F/B ≈ 1,000 · IB ≈ 25,000</p>
    </div>
  );
}

export default function RingAttentionBlockViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4400);
  const scene = SCENES[scenes.active];
  const reduced = scenes.reducedMotion;
  const last = scenes.active === SCENES.length - 1;

  return (
    <VizFrame
      eyebrow="Ring Attention"
      title="query block 은 제자리에 두고 KV block 이 ring 을 한 바퀴 돌아 16칸을 채웁니다"
      description="왼쪽은 GPU 4 장과 지금 들고 있는 KV block, 오른쪽 격자는 query block × KV block 쌍입니다. 칸의 s 숫자가 그 쌍을 계산한 step 입니다."
      note="block 4개는 설명용입니다. 숨기기 조건의 F/B 는 본문이 인용한 Ring Attention 논문의 A100 예시이고 막대는 전송 시간을 1로 둔 비율입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Ring Attention 의 KV block 순환"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col">
          <h4 className="text-base font-bold">{scene.label}</h4>
          <div className="mt-3 grid items-center gap-4 sm:grid-cols-[11rem_minmax(0,1fr)]">
            <Ring step={scene.step} />
            <StableSceneStack
              active={last ? 1 : 0}
              scenes={[<Grid key="g" step={scene.step} reduced={reduced} />, <HideBars key="h" />]}
            />
          </div>
          <p className="mt-4 min-h-[10.5rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[9rem] sm:min-h-[3.5rem]">
            {scene.note}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES.map((s) => s.label)} />
      </div>
    </VizFrame>
  );
}
