import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 저장 latent c = 1·2·3·4, K = (0,c), V = (c,2c), 질문 q = (1,0).
 * 한 mechanism: 펼친 순서는 K 4개·V 4개(숫자 16개)를 만든 뒤 합치고,
 * 흡수한 순서는 W_Kᵀq = 0으로 점수를 내고 c를 먼저 평균(2.5)한 뒤 W_V = (1,2)를 한 번 곱한다. 출력은 둘 다 (2.5, 5).
 * 위치 회전(RoPE)은 넣지 않은 계산이다.
 */
const C = [1, 2, 3, 4] as const;

interface Scene {
  label: string;
  step: number;
  note: string;
}

const SCENES: readonly Scene[] = [
  { label: "저장된 latent 4칸", step: 0, note: "두 순서 모두 같은 저장 기록에서 출발합니다. 위치마다 숫자 하나인 latent c = 1·2·3·4입니다." },
  {
    label: "점수 · 0 네 개",
    step: 1,
    note: "왼쪽은 K = (0,c)를 네 개 만들고 q = (1,0)과 내적해 0을 얻습니다. 오른쪽은 W_Kᵀq = 0을 먼저 만들고 c와 곱해 같은 0을 얻습니다. 점수가 같으니 비율은 모두 1/4입니다.",
  },
  {
    label: "왼쪽만 · V 네 개 펼침",
    step: 2,
    note: "펼친 순서는 V = (c,2c)도 위치마다 만들어 (1,2)·(2,4)·(3,6)·(4,8)이 됩니다. 오른쪽은 아직 latent 네 칸 그대로입니다.",
  },
  {
    label: "합치기 · 같은 (2.5, 5)",
    step: 3,
    note: "왼쪽은 V 네 개를 1/4씩 더해 (2.5, 5)입니다. 오른쪽은 c를 먼저 평균해 2.5를 얻고 W_V = (1,2)를 한 번 곱해 (2.5, 5)입니다.",
  },
  {
    label: "비교 · 숫자 16개 vs 4개",
    step: 4,
    note: "펼친 순서는 K·V 숫자 16개를 만들었고 흡수한 순서는 latent 4개만 읽었습니다. 출력은 같지만 질문 변환·출력 변환 계산과 kernel 비용은 남습니다.",
  },
];

const BLUE = "#2563eb";
const AMBER = "#d97706";

function Cell({ v, color, on, delay, reduced, strong = false }: { v: string; color: string; on: boolean; delay: number; reduced: boolean; strong?: boolean }) {
  return (
    <motion.span
      className="inline-flex h-7 min-w-[2.1rem] items-center justify-center rounded-sm border px-1 font-mono text-[11px] font-bold"
      initial={false}
      animate={{
        opacity: on ? 1 : 0.18,
        backgroundColor: on ? (strong ? color : `${color}22`) : "rgba(0,0,0,0)",
        borderColor: on ? color : "#cbd5e1",
        color: on && strong ? "#ffffff" : on ? "#0f172a" : "#94a3b8",
      }}
      transition={{ duration: reduced ? 0 : 0.3, delay: reduced ? 0 : delay }}
    >
      {v}
    </motion.span>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[3.4rem_minmax(0,1fr)] items-center gap-1.5">
      <span className="text-[10px] font-bold text-muted-foreground">{label}</span>
      <div className="flex min-w-0 flex-wrap items-center gap-1">{children}</div>
    </div>
  );
}

export default function MlaAbsorbViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4600);
  const scene = SCENES[scenes.active];
  const s = scene.step;
  const reduced = scenes.reducedMotion;

  return (
    <VizFrame
      eyebrow="MLA absorption"
      title="K/V를 펼친 뒤 합치든, latent를 먼저 합친 뒤 한 번 변환하든 출력은 (2.5, 5)입니다"
      description="왼쪽은 위치마다 K와 V를 펼치는 순서, 오른쪽은 변환을 질문과 출력 쪽으로 옮긴 순서입니다. 칸 하나가 숫자 하나입니다."
      note="W_K = (0,1), W_V = (1,2)인 한 head 사례이며 위치 회전(RoPE)은 넣지 않았습니다. 회전용 기록은 다음 절에서 따로 봅니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="펼친 순서와 흡수한 순서의 계산 비교"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col">
          <h4 className="text-base font-bold">{scene.label}</h4>

          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <div className="min-w-0 space-y-1.5 rounded-sm border border-border p-2">
              <p className="text-[11px] font-bold text-[#d97706]">펼친 뒤 합치기</p>
              <Row label="latent c">
                {C.map((c) => (
                  <Cell key={c} v={String(c)} color="#64748b" on delay={0} reduced={reduced} />
                ))}
              </Row>
              <Row label="K=(0,c)">
                {C.map((c, i) => (
                  <Cell key={c} v={`0,${c}`} color={AMBER} on={s >= 1} delay={i * 0.08} reduced={reduced} />
                ))}
              </Row>
              <Row label="q·K">
                {C.map((c, i) => (
                  <Cell key={c} v="0" color={AMBER} on={s >= 1} delay={0.4 + i * 0.08} reduced={reduced} />
                ))}
              </Row>
              <Row label="V=(c,2c)">
                {C.map((c, i) => (
                  <Cell key={c} v={`${c},${2 * c}`} color={AMBER} on={s >= 2} delay={i * 0.08} reduced={reduced} />
                ))}
              </Row>
              <Row label="Σ¼·V">
                <Cell v="2.5, 5" color={AMBER} on={s >= 3} delay={0.3} reduced={reduced} strong />
              </Row>
            </div>

            <div className="min-w-0 space-y-1.5 rounded-sm border border-border p-2">
              <p className="text-[11px] font-bold text-[#2563eb]">흡수한 순서</p>
              <Row label="latent c">
                {C.map((c) => (
                  <Cell key={c} v={String(c)} color="#64748b" on delay={0} reduced={reduced} />
                ))}
              </Row>
              <Row label="W_Kᵀq">
                <Cell v="0" color={BLUE} on={s >= 1} delay={0} reduced={reduced} />
                <span className="text-[10px] text-muted-foreground">(0,1)·(1,0) 한 번</span>
              </Row>
              <Row label="0·c">
                {C.map((c, i) => (
                  <Cell key={c} v="0" color={BLUE} on={s >= 1} delay={0.4 + i * 0.08} reduced={reduced} />
                ))}
              </Row>
              <Row label="Σ¼·c">
                <Cell v="2.5" color={BLUE} on={s >= 3} delay={0} reduced={reduced} />
                <span className="text-[10px] text-muted-foreground">(1+2+3+4)/4</span>
              </Row>
              <Row label="×W_V">
                <Cell v="2.5, 5" color={BLUE} on={s >= 3} delay={0.5} reduced={reduced} strong />
                <span className="text-[10px] text-muted-foreground">2.5×(1,2)</span>
              </Row>
            </div>
          </div>

          <dl className="mt-3 grid grid-cols-3 gap-2 font-mono text-xs">
            <div>
              <dt className="text-muted-foreground">비율</dt>
              <dd className="font-bold">{s >= 1 ? "¼·¼·¼·¼" : "—"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">펼친 K·V 숫자</dt>
              <dd className="font-bold text-[#d97706]">{s >= 2 ? "8 + 8 = 16" : s >= 1 ? "8" : "0"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">흡수 쪽 읽기</dt>
              <dd className="font-bold text-[#2563eb]">latent 4</dd>
            </div>
          </dl>

          <p className="mt-3 min-h-[9rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[7.5rem] sm:min-h-[3.5rem]">
            {scene.note}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES.map((s) => s.label)} />
      </div>
    </VizFrame>
  );
}
