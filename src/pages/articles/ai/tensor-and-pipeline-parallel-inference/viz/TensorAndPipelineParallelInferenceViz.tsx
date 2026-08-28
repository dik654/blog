import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 Viz 에 한 mechanism: TP 로 자른 MLP layer 하나가 column GEMM → GeLU → row GEMM → all-reduce 를
 * 지나며 GPU 두 장이 무엇을 들고 무엇을 주고받는지. stage 높이는 고정이고 SVG 내부만 바뀐다.
 */
const SCENES = ["입력 복제", "Column GEMM · GeLU", "Row GEMM 부분합", "All-reduce", "출력 동일"] as const;

const NOTES = [
  "같은 입력 X (2048 token × 8192, FP16 = 33.6 MB) 가 두 GPU 에 똑같이 놓입니다. weight A 는 열로, B 는 행으로 반씩 나뉘어 있습니다.",
  "각 GPU 가 자기 열 조각으로 X·A_i 를 계산하고 GeLU 를 그 자리에서 적용합니다. 열 조각끼리는 독립이라 통신이 없습니다.",
  "GeLU 결과 Y_i 가 행 조각 B_i 와 곱해져 부분합 Z_i 가 됩니다. 두 부분합은 각각 33.6 MB 이고 아직 서로 다릅니다.",
  "All-reduce 가 Z_1 + Z_2 를 만들어 두 GPU 에 똑같이 놓습니다. ring 이면 GPU 당 2(p−1)/p × 33.6 MB 를 내보내고, 이 단계만이 이 layer 의 통신입니다.",
  "두 GPU 가 같은 Z 를 들고 다음 layer 로 갑니다. attention 블록도 같은 꼴이라 layer 하나에 all-reduce 는 정확히 두 번입니다.",
] as const;

const GPU_Y = [40, 170] as const;

function Block({
  x,
  y,
  w,
  h,
  label,
  sub,
  state,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sub?: string;
  state: "idle" | "active" | "done";
}) {
  const stroke = state === "idle" ? "var(--border)" : "var(--primary)";
  const fillOpacity = state === "active" ? 0.18 : state === "done" ? 0.08 : 0;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="var(--primary)" fillOpacity={fillOpacity} stroke={stroke} strokeWidth="1" strokeDasharray={state === "idle" ? "3 2" : undefined} />
      <text x={x + w / 2} y={y + (sub ? 16 : 22)} fontSize="10" fontWeight="700" textAnchor="middle" fill="currentColor" className="text-foreground">
        {label}
      </text>
      {sub && (
        <text x={x + w / 2} y={y + 30} fontSize="9" textAnchor="middle" fill="currentColor" className="text-muted-foreground">
          {sub}
        </text>
      )}
    </g>
  );
}

function Arrow({ x1, y1, x2, y2, active }: { x1: number; y1: number; x2: number; y2: number; active: boolean }) {
  return (
    <path
      d={`M${x1} ${y1}L${x2} ${y2}`}
      stroke={active ? "var(--primary)" : "var(--border)"}
      strokeWidth="1"
      fill="none"
      markerEnd={active ? "url(#tp-arrow-head)" : undefined}
    />
  );
}

function GpuRow({ index, s }: { index: number; s: number }) {
  const y = GPU_Y[index];
  const i = index + 1;
  const st = (scene: number): "idle" | "active" | "done" => (s < scene ? "idle" : s === scene ? "active" : "done");
  return (
    <g>
      <text x={16} y={y - 8} fontSize="10" fontWeight="700" fill="currentColor" className="text-muted-foreground">
        GPU {index}
      </text>
      <rect x={16} y={y} width={608} height={92} fill="none" stroke="var(--border)" strokeWidth="1" />
      <Block x={28} y={y + 26} w={72} h={40} label="X" sub="33.6 MB" state={st(0)} />
      <Arrow x1={100} y1={y + 46} x2={128} y2={y + 46} active={s >= 1} />
      <Block x={128} y={y + 26} w={96} h={40} label={`X·A${i}`} sub="column 조각" state={st(1)} />
      <Arrow x1={224} y1={y + 46} x2={252} y2={y + 46} active={s >= 1} />
      <Block x={252} y={y + 26} w={64} h={40} label="GeLU" sub="local" state={st(1)} />
      <Arrow x1={316} y1={y + 46} x2={344} y2={y + 46} active={s >= 2} />
      <Block x={344} y={y + 26} w={96} h={40} label={`Y${i}·B${i}`} sub="row 부분합" state={st(2)} />
      <Arrow x1={440} y1={y + 46} x2={468} y2={y + 46} active={s >= 3} />
      <Block x={468} y={y + 26} w={64} h={40} label={`Z${i}`} sub="33.6 MB" state={st(2)} />
      <Arrow x1={532} y1={y + 46} x2={560} y2={y + 46} active={s >= 4} />
      <Block x={560} y={y + 26} w={56} h={40} label="Z" sub={s >= 4 ? "동일" : "?"} state={st(4)} />
    </g>
  );
}

export default function TensorAndPipelineParallelInferenceViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2800);
  const s = scenes.active;
  return (
    <VizFrame
      eyebrow="Tensor parallel MLP layer"
      title="TP 는 열로 자른 GEMM 과 행으로 자른 GEMM 사이에 통신이 없고 마지막 all-reduce 한 번만 보냅니다"
      description="GPU 두 장이 hidden 8192 의 MLP 한 층을 나눠 계산하는 다섯 단계입니다. 실선은 로컬 흐름, 두 GPU 를 잇는 선은 all-reduce 입니다."
      note="TP 2 로 단순화했으며 TP 8 이면 조각이 8 개이고 all-reduce 의 ring 배수는 2·7/8 입니다. byte 는 token 2048 · hidden 8192 · FP16 의 계산 예시입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Tensor parallel MLP layer 의 column·row 분할과 all-reduce"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(33rem,calc(100dvh-15rem))] min-h-[26rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Layer step · {String(s + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[s]}</h4>
          <svg viewBox="0 0 640 290" className="mt-4 h-auto w-full" aria-hidden="true">
            <defs>
              <marker id="tp-arrow-head" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M0 0L8 4L0 8Z" fill="var(--primary)" />
              </marker>
            </defs>
            <GpuRow index={0} s={s} />
            <GpuRow index={1} s={s} />
            <path
              d="M500 106V170"
              stroke={s === 3 ? "var(--primary)" : "var(--border)"}
              strokeWidth="1"
              strokeDasharray={s === 3 ? undefined : "3 2"}
              fill="none"
            />
            <path
              d="M500 106 l-4 8 h8 z M500 170 l-4 -8 h8 z"
              fill={s === 3 ? "var(--primary)" : "var(--border)"}
            />
            <text x={508} y={142} fontSize="9" fill="currentColor" className={s === 3 ? "text-foreground" : "text-muted-foreground"}>
              {s === 3 ? "all-reduce Z1+Z2" : "all-reduce"}
            </text>
            <text x={16} y={282} fontSize="10" fill="currentColor" className="text-foreground">
              {s === 0 && "weight: A = [A1, A2] (열), B = [B1; B2] (행)"}
              {s === 1 && "통신 0 byte · GeLU(X·A1), GeLU(X·A2) 는 독립"}
              {s === 2 && "통신 0 byte · Z1 = Y1·B1, Z2 = Y2·B2 는 아직 부분합"}
              {s === 3 && "GPU 당 송신 2(p−1)/p × 33.6 MB → p=2: 33.6 MB, p=8: 58.7 MB"}
              {s === 4 && "layer 당 all-reduce 2 회 (attention 1 + MLP 1)"}
            </text>
          </svg>
          <p className="mt-6 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[s]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
