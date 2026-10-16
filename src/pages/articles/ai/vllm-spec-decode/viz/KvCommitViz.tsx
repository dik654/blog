import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 글 4 · 계산 완료 3에서 [마지막 확정 토큰 + 후보 A·B·B·A] 다섯 위치를 한 번에 검증한다.
 * 한 mechanism: 검증 forward는 다섯 위치 모두 KV를 쓰므로 계산 완료 길이가 잠정 8이 되고,
 * 거부 2를 빼 6으로 되돌린다. 글은 4 + 수락 2 + 교체 1 = 7이라 마지막 자리(위치 6)는 KV가 없다.
 */
const POSITIONS = [0, 1, 2, 3, 4, 5, 6, 7] as const;
const PREFIX = ["①", "②", "③", "④"] as const;
const CANDIDATES = ["A", "B", "B", "A"] as const;

type Text = { token: string; kind: "prefix" | "cand" | "ok" | "rej" | "drop" | "new" } | null;
type Kv = "none" | "old" | "fresh" | "kept" | "void";

interface Scene {
  label: string;
  inputs: boolean;
  logits: boolean;
  verdict: boolean;
  rollback: boolean;
  textLen: number;
  computed: string;
  note: string;
}

const SCENES: readonly Scene[] = [
  {
    label: "글 4 · KV 3",
    inputs: false,
    logits: false,
    verdict: false,
    rollback: false,
    textLen: 4,
    computed: "3",
    note: "확정된 글은 네 자리이고 KV는 앞 세 자리(위치 0~2)만 있습니다. 위치 3의 ④는 지난 회차에 정해졌지만 아직 입력으로 넣은 적이 없습니다.",
  },
  {
    label: "입력 5칸 · 점수 주소 [0..4]",
    inputs: true,
    logits: true,
    verdict: false,
    rollback: false,
    textLen: 4,
    computed: "3",
    note: "④와 후보 A·B·B·A를 한 번에 넣습니다. 점수 0은 위치 3에서 나와 위치 4의 A를 판단합니다. 점수 0~3은 후보 네 개, 점수 4는 보너스용으로 한 칸씩 밀려 읽습니다.",
  },
  {
    label: "검증 forward · KV 잠정 8",
    inputs: true,
    logits: true,
    verdict: false,
    rollback: false,
    textLen: 4,
    computed: "3 + 5 = 8",
    note: "forward는 입력 다섯 위치마다 K/V를 씁니다. 판정 전이라 위치 3~7이 모두 계산된 것으로 세어져 계산 완료 길이가 잠정 8이 됩니다.",
  },
  {
    label: "판정 · 수락 2 · 거부 2",
    inputs: true,
    logits: true,
    verdict: true,
    rollback: false,
    textLen: 4,
    computed: "8",
    note: "A·B를 수락하고 셋째 B에서 첫 거부가 납니다. 넷째 A는 판단하지 않고 버립니다. num_accepted=3−1=2, num_rejected=4−2=2입니다.",
  },
  {
    label: "되돌림 · 글 7 · KV 6",
    inputs: true,
    logits: false,
    verdict: true,
    rollback: true,
    textLen: 7,
    computed: "8 − 2 = 6",
    note: "계산 완료 길이에서 거부 2를 빼 6이 됩니다. 글은 4 + 수락 2 + 교체 A 1 = 7입니다. 위치 6의 새 A는 KV가 없고, 셋째 B가 남긴 KV를 대신 쓰지 않습니다. 다음 계산은 위치 6에서 시작합니다.",
  },
];

function textAt(scene: Scene, p: number): Text {
  if (p < 4) return { token: PREFIX[p], kind: "prefix" };
  const c = p - 4;
  if (!scene.inputs) return null;
  if (scene.rollback) {
    if (c < 2) return { token: CANDIDATES[c], kind: "ok" };
    if (c === 2) return { token: "A", kind: "new" };
    return null;
  }
  if (!scene.verdict) return { token: CANDIDATES[c], kind: "cand" };
  return { token: CANDIDATES[c], kind: c < 2 ? "ok" : c === 2 ? "rej" : "drop" };
}

function kvAt(scene: Scene, step: number, p: number): Kv {
  if (p < 3) return "old";
  if (step < 2) return "none";
  if (!scene.rollback) return "fresh";
  return p < 6 ? "kept" : "void";
}

const TEXT_STYLE: Record<NonNullable<Text>["kind"], string> = {
  prefix: "border-[#64748b] bg-[#f1f5f9] text-[#0f172a] dark:bg-[#1e293b] dark:text-[#e2e8f0]",
  cand: "border-[#d97706] bg-[#fef3c7] text-[#78350f]",
  ok: "border-[#2563eb] bg-[#dbeafe] text-[#1e3a8a]",
  rej: "border-[#dc2626] bg-transparent text-[#dc2626] line-through",
  drop: "border-dashed border-[#94a3b8] bg-transparent text-[#94a3b8] line-through",
  new: "border-[#16a34a] bg-[#dcfce7] text-[#14532d]",
};

const KV_STYLE: Record<Kv, string> = {
  none: "border-dashed border-border text-transparent",
  old: "border-[#64748b] bg-[#e2e8f0] text-[#334155] dark:bg-[#334155] dark:text-[#e2e8f0]",
  fresh: "border-[#d97706] bg-[#fde68a] text-[#78350f]",
  kept: "border-[#2563eb] bg-[#2563eb] text-white",
  void: "border-dashed border-[#dc2626] bg-transparent text-[#dc2626] line-through",
};

export default function KvCommitViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4600);
  const step = scenes.active;
  const scene = SCENES[step];
  const reduced = scenes.reducedMotion;
  const cols = "grid-cols-[3.2rem_repeat(8,minmax(0,1fr))] sm:grid-cols-[4.5rem_repeat(8,minmax(0,1fr))]";
  const validKv = POSITIONS.filter((p) => ["old", "kept"].includes(kvAt(scene, step, p))).length;
  const kvCount = step >= 2 && !scene.rollback ? 8 : validKv;

  return (
    <VizFrame
      eyebrow="Verify forward · KV rollback"
      title="검증은 다섯 위치의 KV를 쓰고, 거부 수만큼 계산 완료 길이를 되돌립니다"
      description="가로는 토큰 위치 0~7입니다. 위 줄은 글, 가운데 줄은 그 위치의 KV, 아래 줄은 이번 forward에 넣은 입력과 점수 주소입니다."
      note="logits_indices=[0,1,2,3,4], target_logits_indices=[0,1,2,3], bonus=[4]는 단일 요청 기준입니다. 늦은 출력·빈자리·선점이 없는 동기 경로입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="검증 forward 뒤 글 길이와 KV 길이"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col">
          <h4 className="text-base font-bold">{scene.label}</h4>

          <div className="mt-3 space-y-1.5">
            <div className={`grid ${cols} items-center gap-1`}>
              <span className="text-[10px] font-bold text-muted-foreground">위치</span>
              {POSITIONS.map((p) => (
                <span key={p} className="text-center font-mono text-[10px] text-muted-foreground">
                  {p}
                </span>
              ))}
            </div>

            <div className={`grid ${cols} items-center gap-1`}>
              <span className="text-[11px] font-bold">글</span>
              {POSITIONS.map((p) => {
                const t = textAt(scene, p);
                return t ? (
                  <motion.div
                    key={`${p}-${t.kind}-${t.token}`}
                    className={`flex h-8 items-center justify-center rounded-sm border font-mono text-xs font-bold ${TEXT_STYLE[t.kind]}`}
                    initial={reduced ? false : { opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: reduced ? 0 : 0.3, delay: reduced ? 0 : (p - 3) * 0.05 }}
                  >
                    {t.token}
                  </motion.div>
                ) : (
                  <div key={p} className="h-8 rounded-sm border border-dashed border-border" />
                );
              })}
            </div>

            <div className={`grid ${cols} items-center gap-1`}>
              <span className="text-[11px] font-bold">KV</span>
              {POSITIONS.map((p) => {
                const kv = kvAt(scene, step, p);
                return (
                  <motion.div
                    key={`${p}-${kv}`}
                    className={`flex h-8 items-center justify-center rounded-sm border font-mono text-[10px] font-bold ${KV_STYLE[kv]}`}
                    initial={reduced || kv === "old" ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: reduced ? 0 : 0.35, delay: reduced ? 0 : Math.max(0, p - 3) * 0.12 }}
                  >
                    {kv === "none" ? "·" : "KV"}
                  </motion.div>
                );
              })}
            </div>

            <div className={`grid ${cols} items-center gap-1 border-t border-border pt-1.5`}>
              <span className="text-[11px] font-bold text-muted-foreground">입력</span>
              {POSITIONS.map((p) => {
                const on = scene.inputs && p >= 3;
                return (
                  <div
                    key={p}
                    className={`flex h-7 items-center justify-center rounded-sm text-[11px] font-black ${on ? "bg-[#475569] text-white" : "text-transparent"}`}
                  >
                    {on ? (p === 3 ? "④" : CANDIDATES[p - 4]) : "·"}
                  </div>
                );
              })}
            </div>

            <div className={`grid ${cols} items-center gap-1`}>
              <span className="text-[10px] font-bold text-muted-foreground">점수 주소</span>
              {POSITIONS.map((p) => {
                const idx = p - 3;
                const on = scene.logits && p >= 3;
                return (
                  <div key={p} className="flex h-9 flex-col items-center justify-center font-mono text-[10px] leading-4">
                    {on ? (
                      <>
                        <span className={`font-bold ${idx === 4 ? "text-[#16a34a]" : "text-[#2563eb]"}`}>{idx}</span>
                        <span className="text-muted-foreground">{idx === 4 ? "보너스" : `→${p + 1}`}</span>
                      </>
                    ) : (
                      <span className="text-transparent">·</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <dl className="mt-3 grid grid-cols-3 gap-2 font-mono text-xs">
            <div>
              <dt className="text-muted-foreground">글 길이</dt>
              <dd className="font-bold">{scene.textLen}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">계산 완료 길이</dt>
              <dd className="font-bold text-[#2563eb]">{scene.computed}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">KV 칸</dt>
              <dd className="font-bold">{kvCount}</dd>
            </div>
          </dl>

          <p className="mt-3 min-h-[10.5rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[9rem] sm:min-h-[3.5rem]">
            {scene.note}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES.map((s) => s.label)} />
      </div>
    </VizFrame>
  );
}
