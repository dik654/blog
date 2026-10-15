import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 mechanism: stage s(0~3)는 microbatch j를 time slot s+j에 처리한다.
 * 그래서 첫 microbatch가 마지막 stage에 닿기 전(채우기)과 마지막 microbatch가 빠지는 동안(비우기)
 * 칸이 비고, 그 빈칸이 (p−1)/(m+p−1)이다. 본문 사례 PP 4 · 80 layer(stage마다 20)를 그대로 쓴다.
 */
const P = 4;

interface Scene {
  label: string;
  m: number;
  /** 이 장면에서 보여 줄 slot 범위(1-indexed, 포함). 나머지는 흐리게 */
  focus: [number, number];
  /** 접어서 그릴 때 앞·뒤에 보일 slot 수 */
  fold?: number;
  decode?: boolean;
  note: string;
}

const SCENES: readonly Scene[] = [
  {
    label: "batch 통째 · m = 1",
    m: 1,
    focus: [1, 4],
    note: "batch를 쪼개지 않으면 한 slot에 한 stage만 일합니다. 4행 × 4열 16칸 중 12칸이 비어 GPU 네 장이 평균 75% 쉽니다.",
  },
  {
    label: "m = 8 · 채우기",
    m: 8,
    focus: [1, 3],
    note: "microbatch 1이 stage 3에 닿기까지 slot 1~3에서 계단 아래가 빕니다. 빈칸은 3 + 2 + 1 = 6칸입니다.",
  },
  {
    label: "m = 8 · 모두 바쁨",
    m: 8,
    focus: [4, 8],
    note: "slot 4~8에서는 네 stage가 모두 서로 다른 microbatch를 처리합니다. 이 구간에는 빈칸이 없습니다.",
  },
  {
    label: "m = 8 · 비우기",
    m: 8,
    focus: [9, 11],
    note: "마지막 microbatch 8이 빠져나가는 slot 9~11에서 계단 위가 비어 6칸이 더해집니다. 44칸 중 12칸, 3/11 ≈ 27%가 bubble입니다.",
  },
  {
    label: "m = 32 · 열 35개",
    m: 32,
    focus: [1, 35],
    fold: 6,
    note: "microbatch를 32개로 늘려도 채우기·비우기 빈칸은 여전히 6 + 6 = 12칸입니다. 전체가 4 × 35 = 140칸으로 늘어 비율은 3/35 ≈ 8.6%로 줄어듭니다.",
  },
  {
    label: "decode · token 하나",
    m: 1,
    focus: [1, 4],
    decode: true,
    note: "decode에서 한 sequence의 다음 token은 stage 0→1→2→3을 차례로 지나야 나옵니다. 칸 네 개와 경계 hop 세 번이 직렬로 이어지므로 microbatch로 이 지연을 숨길 수 없습니다.",
  },
];

/** stage s가 slot t(1-indexed)에 처리하는 microbatch 번호, 없으면 0 */
const cellMb = (s: number, t: number, m: number) => {
  const j = t - s;
  return j >= 1 && j <= m ? j : 0;
};

export default function PipelineBubbleGridViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4600);
  const scene = SCENES[scenes.active];
  const reduced = scenes.reducedMotion;
  const slots = scene.m + P - 1;
  const total = P * slots;
  const empty = P * (P - 1);
  const shownSlots: (number | "gap")[] = scene.fold
    ? [...Array.from({ length: scene.fold }, (_, i) => i + 1), "gap", ...Array.from({ length: scene.fold }, (_, i) => slots - scene.fold! + i + 1)]
    : Array.from({ length: slots }, (_, i) => i + 1);
  const inFocus = (t: number) => t >= scene.focus[0] && t <= scene.focus[1];
  const order = (t: number) => (scene.fold ? 0 : Math.max(0, t - scene.focus[0]));
  const delay = (t: number) => (reduced ? 0 : 0.25 + order(t) * 0.35);
  let countedEmpty = 0;
  for (let t = scene.focus[0]; t <= scene.focus[1]; t++) for (let s = 0; s < P; s++) if (!cellMb(s, t, scene.m)) countedEmpty++;

  return (
    <VizFrame
      eyebrow="Pipeline bubble"
      title="microbatch가 계단처럼 흘러 채우기와 비우기에 빈칸이 생깁니다"
      description="행은 stage(GPU), 열은 time slot입니다. 칸의 숫자는 그 slot에 그 stage가 처리하는 microbatch이고, 점선 칸은 GPU가 노는 bubble입니다."
      note="PP 4 · 80 layer(stage마다 20 layer)는 본문 사례입니다. 모든 stage의 처리 시간이 같고 stage 사이 전송 시간은 칸에 넣지 않았다는 본문 식의 가정을 따릅니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="PP 4에서 microbatch 수에 따른 bubble 칸"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div key={scenes.active} className="flex shrink-0 flex-col">
          <h4 className="text-base font-bold">{scene.label}</h4>

          <div className="mt-3 overflow-x-auto">
            <div
              className="grid min-w-[19rem] gap-1"
              style={{ gridTemplateColumns: `3.4rem repeat(${shownSlots.length}, minmax(1.25rem, 1fr))` }}
            >
              <span />
              {shownSlots.map((t, i) => (
                <span key={i} className="text-center font-mono text-[10px] text-muted-foreground">
                  {t === "gap" ? "⋯" : t}
                </span>
              ))}
              {Array.from({ length: P }, (_, s) => (
                <div key={s} className="contents">
                  <span className="text-[11px] font-bold leading-7">stage {s}</span>
                  {shownSlots.map((t, i) => {
                    if (t === "gap") {
                      return (
                        <span key={i} className="flex h-7 items-center justify-center text-[10px] text-muted-foreground">
                          ⋯
                        </span>
                      );
                    }
                    const mb = cellMb(s, t, scene.m);
                    const lit = inFocus(t) || (!scene.fold && t < scene.focus[0]);
                    const decodePath = scene.decode && mb === 1;
                    if (!mb) {
                      return (
                        <motion.span
                          key={i}
                          className="h-7 rounded-sm border border-dashed border-[#d97706]"
                          initial={{ opacity: 0.15 }}
                          animate={{ opacity: lit && !scene.decode ? 1 : 0.25, backgroundColor: lit && !scene.decode && inFocus(t) ? "rgba(253,230,138,0.55)" : "rgba(253,230,138,0)" }}
                          transition={{ delay: delay(t), duration: reduced ? 0 : 0.3 }}
                        />
                      );
                    }
                    return (
                      <motion.span
                        key={i}
                        className={`flex h-7 items-center justify-center rounded-sm border text-[10px] font-bold ${
                          decodePath ? "border-[#16a34a]" : "border-[#2563eb]"
                        }`}
                        initial={{ backgroundColor: "rgba(37,99,235,0)", color: "rgba(37,99,235,0)" }}
                        animate={{
                          backgroundColor: lit ? (decodePath ? "rgba(22,163,74,1)" : "rgba(37,99,235,1)") : "rgba(37,99,235,0.12)",
                          color: lit ? "rgba(255,255,255,1)" : "rgba(37,99,235,0.6)",
                        }}
                        transition={{ delay: delay(t), duration: reduced ? 0 : 0.3 }}
                      >
                        {mb}
                      </motion.span>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-xs sm:grid-cols-4">
            <div>
              <dt className="text-muted-foreground">전체 칸</dt>
              <dd className="font-bold text-foreground">
                {P} × {slots} = {total}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">{scene.decode ? "직렬 hop" : "이 장면에서 센 빈칸"}</dt>
              <dd className="font-bold text-[#b45309]">{scene.decode ? "3번" : `${countedEmpty}칸`}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">bubble 전체</dt>
              <dd className="font-bold text-[#b45309]">
                {empty} / {total}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">(p−1)/(m+p−1)</dt>
              <dd className="font-bold text-foreground">
                3/{slots} ≈ {((3 / slots) * 100).toFixed(1)}%
              </dd>
            </div>
          </dl>

          <p className="mt-3 min-h-[11rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[10rem] sm:min-h-[3.5rem]">
            {scene.note}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES.map((s) => s.label)} />
      </div>
    </VizFrame>
  );
}
