import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 Viz 에 한 mechanism: TP 2 로 자른 MLP layer 하나에서 각 GPU 가 행렬의 어느 조각을 들고
 * 어떤 모양의 결과를 만드는지 그린다. A(8192 × F)는 열 반쪽, B(F × 8192)는 행 반쪽을 갖고,
 * 열 조각 Y_i 는 그대로 B_i 의 입력이 되며 마지막 Z_i 두 장만 all-reduce 로 더한다.
 * 사각형의 가로·세로는 행렬의 열·행 수에 비례한다(F 는 FFN 폭, 그림에서는 h 의 1.2배로 둠).
 */
const SCENES = ["입력 복제 · weight 조각", "Column GEMM · GeLU", "Row GEMM 부분합", "All-reduce", "출력 동일"] as const;

const NOTES = [
  "같은 입력 X(2048 token × 8192)가 두 GPU 에 똑같이 놓입니다. A 는 세로로 잘라 왼쪽 열 반을 GPU 0, 오른쪽 열 반을 GPU 1 이 갖고, B 는 가로로 잘라 위 행 반과 아래 행 반을 나눠 갖습니다. 점선은 다른 GPU 의 조각입니다.",
  "X · A_i 는 2048 × F/2 의 열 조각 Y_i 입니다. GeLU 는 원소마다 적용되므로 열 조각마다 따로 적용해도 결과가 같고 통신이 없습니다.",
  "Y_i 의 열 수 F/2 가 B_i 의 행 수와 같아 그대로 곱합니다. 결과 Z_i 는 2048 × 8192 로 모양은 최종 출력과 같지만 F 의 반쪽만 더한 부분합입니다.",
  "All-reduce 가 Z0 + Z1 을 만들어 두 GPU 에 똑같이 놓습니다. 합치는 양은 2048 × 8192 × 2 byte = 33.6 MB 이고 이 MLP 에서 통신은 여기 한 번입니다.",
  "두 GPU 가 같은 Z 를 들고 다음 layer 로 갑니다. attention 도 head 를 열로, output projection 을 행으로 나눠 같은 꼴이라 layer 하나에 all-reduce 는 두 번입니다.",
] as const;

const GPU = ["#2563eb", "#0d9488"] as const;
const FILL = ["#dbeafe", "#ccfbf1"] as const;
const GHOST = "#cbd5e1";
/** 픽셀 단위: h(8192) = 40, T(2048) = 20, F = 48. */
const H = 40;
const TT = 20;
const F = 48;
const LANE_Y = [16, 116] as const;

function Mat({ x, y, w, h, label, sub, own, ghost, gpu, show = true, half }: {
  x: number; y: number; w: number; h: number; label: string; sub?: string; own?: boolean; ghost?: boolean; gpu: number; show?: boolean;
  /** 전체 행렬 중 자기 몫만 칠한다. col: 열 반쪽, row: 행 반쪽 */
  half?: "col" | "row";
}) {
  const color = GPU[gpu];
  return (
    <motion.g initial={false} animate={{ opacity: show ? 1 : 0 }} transition={{ duration: 0.3 }}>
      {half ? (
        <>
          <rect x={x} y={y} width={w} height={h} fill="none" stroke={GHOST} strokeDasharray="3 2" strokeWidth={1} />
          {half === "col" ? (
            <rect x={x + (gpu === 0 ? 0 : w / 2)} y={y} width={w / 2} height={h} fill={FILL[gpu]} stroke={color} strokeWidth={1} />
          ) : (
            <rect x={x} y={y + (gpu === 0 ? 0 : h / 2)} width={w} height={h / 2} fill={FILL[gpu]} stroke={color} strokeWidth={1} />
          )}
        </>
      ) : (
        <rect x={x} y={y} width={w} height={h} fill={ghost ? "none" : own ? FILL[gpu] : "#f1f5f9"} stroke={ghost ? GHOST : own ? color : "#64748b"} strokeDasharray={ghost ? "3 2" : undefined} strokeWidth={1} />
      )}
      <text x={x + w / 2} y={y - 4} textAnchor="middle" fontSize={9} fontWeight={700} fill={own || half ? color : "#475569"}>
        {label}
      </text>
      {sub ? (
        <text x={x + w / 2} y={y + h + 10} textAnchor="middle" fontSize={8} fill="#64748b">
          {sub}
        </text>
      ) : null}
    </motion.g>
  );
}

function Lane({ gpu, s }: { gpu: number; s: number }) {
  const y0 = LANE_Y[gpu];
  const mid = y0 + 40;
  const op = (x: number, t: string, show = true) => (
    <motion.text x={x} y={mid + 3} textAnchor="middle" fontSize={11} fill="#64748b" initial={false} animate={{ opacity: show ? 1 : 0 }}>
      {t}
    </motion.text>
  );
  const top = (h: number) => mid - h / 2;
  return (
    <g>
      <rect x={4} y={y0 - 12} width={280} height={92} rx={3} fill="none" stroke="#e2e8f0" strokeWidth={1} />
      <text x={10} y={y0} fontSize={9} fontWeight={700} fill={GPU[gpu]}>
        GPU {gpu}
      </text>
      <Mat x={14} y={top(TT)} w={H} h={TT} label="X" sub="2048×8192" gpu={gpu} />
      {op(62, "·")}
      <Mat x={70} y={top(H)} w={F} h={H} label={`A → A${gpu}`} sub="8192×F" gpu={gpu} half="col" />
      {op(126, "=", s >= 1)}
      <Mat x={134} y={top(TT)} w={F / 2} h={TT} label={`Y${gpu}`} sub="2048×F/2" gpu={gpu} own show={s >= 1} />
      <motion.text x={146} y={top(TT) + TT + 20} textAnchor="middle" fontSize={8} fontWeight={700} fill={GPU[gpu]} initial={false} animate={{ opacity: s === 1 ? 1 : 0 }}>
        GeLU 로컬
      </motion.text>
      {op(168, "·", s >= 2)}
      <Mat x={176} y={top(F)} w={H} h={F} label={`B → B${gpu}`} sub="F×8192" gpu={gpu} half="row" />
      {op(226, "=", s >= 2)}
      {/* 마지막 장면에서는 같은 자리가 all-reduce 결과 Z 로 바뀐다. */}
      <Mat x={234} y={top(TT)} w={H} h={TT} label={s >= 4 ? "Z = Z0+Z1" : `Z${gpu} 부분합`} sub="2048×8192" gpu={gpu} own={s < 4} show={s >= 2} />
    </g>
  );
}

export default function TensorAndPipelineParallelInferenceViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const s = scenes.active;
  const reduced = scenes.reducedMotion;
  const ar = s === 3;
  return (
    <VizFrame
      eyebrow="Tensor parallel MLP layer"
      title="A 는 열로, B 는 행으로 잘라 두 GEMM 사이에는 통신이 없고 끝에서 한 번만 더합니다"
      description="GPU 두 장이 hidden 8192 의 MLP 한 층을 나눠 계산합니다. 사각형의 가로·세로가 행렬의 열·행 수이고, 칠한 부분이 그 GPU 가 가진 조각입니다."
      note="TP 2 로 단순화했습니다. TP 8 이면 A 는 열 8 조각, B 는 행 8 조각이고 ring 배수는 2·7/8 입니다. FFN 폭 F 는 model 마다 달라 비율만 그렸습니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Tensor parallel MLP layer 의 column·row 분할과 all-reduce"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col">
          <h4 className="text-base font-bold">{SCENES[s]}</h4>
          <svg viewBox="0 0 290 202" className="mt-3 h-auto w-full max-w-[18.5rem]" role="img" aria-label="두 GPU 가 가진 행렬 조각">
            <Lane gpu={0} s={s} />
            <Lane gpu={1} s={s} />
            {/* all-reduce: 두 Z_i 를 잇는 양방향 선 */}
            <motion.g initial={false} animate={{ opacity: s === 3 ? 1 : s > 3 ? 0.4 : 0.15 }} transition={{ duration: reduced ? 0 : 0.3 }}>
              <line x1={279} y1={LANE_Y[0] + 52} x2={279} y2={LANE_Y[1] + 28} stroke={ar ? "#dc2626" : "#94a3b8"} strokeWidth={ar ? 1.25 : 1} strokeDasharray={ar ? undefined : "3 2"} />
              <path d={`M279 ${LANE_Y[0] + 52} l-3 6 h6 z M279 ${LANE_Y[1] + 28} l-3 -6 h6 z`} fill={ar ? "#dc2626" : "#94a3b8"} />
            </motion.g>
          </svg>
          <p className="mt-2 font-mono text-xs font-bold">
            통신 <span className={s >= 3 ? "text-[#dc2626]" : "text-[#16a34a]"}>{s < 3 ? "0 byte" : "all-reduce 1회 · 33.6 MB"}</span>
          </p>
          <p className="mt-3 min-h-[12rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[10.5rem] sm:min-h-[5.25rem]">
            {NOTES[s]}
          </p>
        </div>
        <ol className="static-reading-only mt-4 list-decimal space-y-3 pl-5 text-sm leading-6">
          {SCENES.map((label, index) => (
            <li key={label}>
              <strong>{label}</strong>: {NOTES[index]}
            </li>
          ))}
        </ol>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
