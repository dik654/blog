import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 mechanism: MacUnit 하나를 감싼 PE 한 칸이 PEControl.dataflow 비트로
 * weight 를 고정할지(WS) partial sum 을 고정할지(OS) 배선만 바꾸고, c1·c2
 * 이중 레지스터가 propagate/compute 역할을 매 사이클 뒤집어(flip) 파이프라인을
 * 끊지 않는 과정. 마지막 장면은 이 고정이 곧 재사용(K)이며 I_PE = 2K/w 로
 * 이어짐을 보여준다. stage 높이는 모든 장면의 최대 필요 크기로 고정하고
 * control row 는 그 아래 고정 row 에 둔다.
 */

const SCENES = [
  "PE 유휴 · 고정된 값 없음",
  "Weight-Stationary · weight 고정",
  "Output-Stationary · partial sum 고정",
  "flip · c1 ↔ c2 역할 교대",
  "재사용 K → I_PE = 2K/w",
] as const;

const NOTES = [
  "PE 안에서 실제로 계산하는 것은 MacUnit 하나뿐입니다. out_d = in_c.mac(in_a, in_b). 지금은 PEControl.dataflow 도 c1·c2 도 아직 아무 값도 고정하지 않은 상태입니다.",
  "dataflow = WS(1) 이면 weight 가 c1(또는 c2)에 고정되고, activation 이 흐르는 사이클마다 같은 weight 로 mac 을 수행합니다. 결과는 out_b 로 즉시 다음 PE 에 넘어가 이 PE 안에는 남지 않습니다 — weight 하나를 K 번 재사용하는 것이 곧 다음 장면의 I_PE 입니다.",
  "dataflow = OS(0) 이면 partial sum 이 c1(또는 c2)에 고정되고, weight 와 activation 이 함께 흘러 그 위에 쌓입니다. propagate 신호가 켜지기 전까지 out_c 로는 아무 것도 나가지 않습니다.",
  "한쪽 레지스터가 propagate(내보내는 중)이면 다른 쪽은 compute(누적 중)입니다. last_s 가 직전 사이클의 propagate 값을 기억해 flip = (last_s ≠ prop) 을 계산하고, 역할이 막 뒤집힌 그 사이클에만 shift_offset 을 적용해 반올림이 두 번 적용되는 걸 막습니다.",
  "weight 를 K 사이클 동안 고정해 두고 매 사이클 새 activation 과 곱하면, 메모리 접근 1회(weight 1개)당 연산 2K 번을 얻습니다 — I_PE = 2K/w. K 가 커질수록 이 PE 는 roofline 오른쪽(compute-bound)으로 움직입니다. GPU 에서 tile 크기로 조절하던 재사용을 여기서는 배선으로 고정한 것뿐입니다.",
] as const;

const VIEW_W = 460;
const VIEW_H = 200;
const MAC = { x: 165, y: 100, w: 130, h: 36 };
const REG1 = { x: 170, y: 34, w: 56, h: 30 };
const REG2 = { x: 234, y: 34, w: 56, h: 30 };
const MAC_MID_Y = MAC.y + MAC.h / 2;
const LOOP_X = REG1.x + REG1.w / 2;
const LOAD_X = 200;
const FLOW_X = 350;

function rightArrowHead(x2: number, y: number) {
  return `${x2 - 8},${y - 4} ${x2 - 8},${y + 4} ${x2},${y}`;
}
function downArrowHead(x: number, y2: number) {
  return `${x - 4},${y2 - 8} ${x + 4},${y2 - 8} ${x},${y2}`;
}
function upArrowHead(x: number, y1: number) {
  return `${x - 4},${y1 + 8} ${x + 4},${y1 + 8} ${x},${y1}`;
}

type CoreVariant = "idle" | "ws" | "os" | "intensity";

interface CoreConfig {
  dataflowLabel: string;
  loadOn: boolean;
  loadLabel: string;
  flowOn: boolean;
  flowLabel: string;
  activationOn: boolean;
  activationLabel: string;
  loopDir: "down" | "up" | "none";
  loopLabel: string;
  outNextOn: boolean;
  outNextLabel: string;
  outDrainOn: boolean;
  outDrainGated: boolean;
  outDrainLabel: string;
  reg1Active: boolean;
  reg1Caption: string;
  reg2Caption: string;
}

const CORE_CONFIG: Record<CoreVariant, CoreConfig> = {
  idle: {
    dataflowLabel: "PEControl.dataflow · 미설정",
    loadOn: false,
    loadLabel: "d",
    flowOn: false,
    flowLabel: "b",
    activationOn: false,
    activationLabel: "a",
    loopDir: "none",
    loopLabel: "",
    outNextOn: false,
    outNextLabel: "out_b",
    outDrainOn: false,
    outDrainGated: false,
    outDrainLabel: "out_c",
    reg1Active: false,
    reg1Caption: "empty",
    reg2Caption: "empty",
  },
  ws: {
    dataflowLabel: "PEControl.dataflow = 1 (WS)",
    loadOn: true,
    loadLabel: "weight · 1회 적재",
    flowOn: false,
    flowLabel: "b",
    activationOn: true,
    activationLabel: "activation · 매 사이클",
    loopDir: "down",
    loopLabel: "재사용",
    outNextOn: true,
    outNextLabel: "out_b · 즉시",
    outDrainOn: false,
    outDrainGated: false,
    outDrainLabel: "out_c",
    reg1Active: true,
    reg1Caption: "weight 고정",
    reg2Caption: "대기",
  },
  os: {
    dataflowLabel: "PEControl.dataflow = 0 (OS)",
    loadOn: false,
    loadLabel: "d",
    flowOn: true,
    flowLabel: "weight · 매 사이클",
    activationOn: true,
    activationLabel: "activation · 매 사이클",
    loopDir: "up",
    loopLabel: "누적",
    outNextOn: false,
    outNextLabel: "out_b · 통과",
    outDrainOn: false,
    outDrainGated: true,
    outDrainLabel: "out_c · propagate 대기",
    reg1Active: true,
    reg1Caption: "partial sum 고정",
    reg2Caption: "대기",
  },
  intensity: {
    dataflowLabel: "PEControl.dataflow = 1 (WS)",
    loadOn: true,
    loadLabel: "weight · K=64 동안 고정",
    flowOn: false,
    flowLabel: "b",
    activationOn: true,
    activationLabel: "activation · 매 사이클",
    loopDir: "down",
    loopLabel: "재사용 ×64",
    outNextOn: true,
    outNextLabel: "out_b · 즉시",
    outDrainOn: false,
    outDrainGated: false,
    outDrainLabel: "out_c",
    reg1Active: true,
    reg1Caption: "weight 고정",
    reg2Caption: "대기",
  },
};

/** PE 한 칸: MacUnit + c1·c2. 장면마다 어느 경로가 켜져 있는지만 바뀐다. */
function PeCoreDiagram({ variant }: { variant: CoreVariant }) {
  const c = CORE_CONFIG[variant];
  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      className="h-auto w-full min-w-[24rem]"
      role="img"
      aria-label={`PE 배선 · ${c.dataflowLabel}`}
    >
      {/* d → c1 적재 경로 */}
      <line
        x1={LOAD_X}
        y1={6}
        x2={LOAD_X}
        y2={REG1.y - 2}
        className={c.loadOn ? "stroke-primary" : "stroke-border"}
        strokeWidth={c.loadOn ? 1.25 : 1}
        strokeDasharray={c.loadOn ? undefined : "3 3"}
        strokeOpacity={c.loadOn ? 1 : 0.5}
      />
      <polygon
        points={downArrowHead(LOAD_X, REG1.y - 2)}
        className={c.loadOn ? "fill-primary" : "fill-border"}
        opacity={c.loadOn ? 1 : 0.5}
      />
      <text
        x={LOAD_X + 6}
        y={16}
        fontSize={8}
        fontWeight={c.loadOn ? 700 : 400}
        className={c.loadOn ? "fill-foreground" : "fill-muted-foreground"}
      >
        {c.loadLabel}
      </text>

      {/* b → MacUnit 직행 경로(레지스터 우회) */}
      <line
        x1={FLOW_X}
        y1={6}
        x2={FLOW_X}
        y2={MAC.y - 2}
        className={c.flowOn ? "stroke-primary" : "stroke-border"}
        strokeWidth={c.flowOn ? 1.25 : 1}
        strokeDasharray={c.flowOn ? undefined : "3 3"}
        strokeOpacity={c.flowOn ? 1 : 0.5}
      />
      <polygon
        points={downArrowHead(FLOW_X, MAC.y - 2)}
        className={c.flowOn ? "fill-primary" : "fill-border"}
        opacity={c.flowOn ? 1 : 0.5}
      />
      <text
        x={FLOW_X - 30}
        y={16}
        fontSize={8}
        fontWeight={c.flowOn ? 700 : 400}
        className={c.flowOn ? "fill-foreground" : "fill-muted-foreground"}
      >
        {c.flowLabel}
      </text>

      {/* c1 · c2 이중 레지스터 */}
      <rect
        x={REG1.x}
        y={REG1.y}
        width={REG1.w}
        height={REG1.h}
        rx={8}
        className={c.reg1Active ? "fill-primary/15 stroke-primary" : "fill-muted/40 stroke-border"}
        strokeWidth={c.reg1Active ? 1.25 : 1}
        strokeDasharray={c.reg1Active ? undefined : "3 3"}
      />
      <text x={REG1.x + REG1.w / 2} y={REG1.y + REG1.h / 2 + 4} textAnchor="middle" fontSize={11} fontWeight={700} className="fill-foreground font-mono">
        c1
      </text>
      <text x={REG1.x - 8} y={REG1.y + REG1.h / 2 + 3} textAnchor="end" fontSize={8} className={c.reg1Active ? "fill-foreground" : "fill-muted-foreground"}>
        {c.reg1Caption}
      </text>

      <rect
        x={REG2.x}
        y={REG2.y}
        width={REG2.w}
        height={REG2.h}
        rx={8}
        className="fill-muted/40 stroke-border"
        strokeWidth={1}
        strokeDasharray="3 3"
      />
      <text x={REG2.x + REG2.w / 2} y={REG2.y + REG2.h / 2 + 4} textAnchor="middle" fontSize={11} fontWeight={700} className="fill-foreground font-mono">
        c2
      </text>
      <text x={REG2.x + REG2.w + 8} y={REG2.y + REG2.h / 2 + 3} textAnchor="start" fontSize={8} className="fill-muted-foreground">
        {c.reg2Caption}
      </text>

      {/* c1 ↔ MacUnit 연결: WS 는 아래로(재사용), OS 는 위로(누적) */}
      {c.loopDir !== "none" ? (
        <>
          <line
            x1={LOOP_X}
            y1={c.loopDir === "down" ? 66 : 98}
            x2={LOOP_X}
            y2={c.loopDir === "down" ? 98 : 66}
            className="stroke-primary"
            strokeWidth={1.25}
          />
          <polygon
            points={c.loopDir === "down" ? downArrowHead(LOOP_X, 98) : upArrowHead(LOOP_X, 66)}
            className="fill-primary"
          />
          <text x={LOOP_X + 6} y={85} fontSize={8} fontWeight={700} className="fill-primary">
            {c.loopLabel}
          </text>
        </>
      ) : (
        <line x1={LOOP_X} y1={66} x2={LOOP_X} y2={98} className="stroke-border" strokeWidth={1} strokeDasharray="3 3" strokeOpacity={0.5} />
      )}

      {/* MacUnit */}
      <rect x={MAC.x} y={MAC.y} width={MAC.w} height={MAC.h} rx={8} className="fill-none stroke-border" strokeWidth={1} />
      <text x={MAC.x + MAC.w / 2} y={MAC.y + 16} textAnchor="middle" fontSize={11} fontWeight={700} className="fill-foreground">
        MacUnit
      </text>
      <text x={MAC.x + MAC.w / 2} y={MAC.y + 28} textAnchor="middle" fontSize={7} className="fill-muted-foreground font-mono">
        in_c.mac(in_a,in_b)
      </text>

      {/* activation: 왼쪽에서 MacUnit 으로 */}
      <line
        x1={20}
        y1={MAC_MID_Y}
        x2={MAC.x - 2}
        y2={MAC_MID_Y}
        className={c.activationOn ? "stroke-primary" : "stroke-border"}
        strokeWidth={c.activationOn ? 1.25 : 1}
        strokeDasharray={c.activationOn ? undefined : "3 3"}
        strokeOpacity={c.activationOn ? 1 : 0.5}
      />
      <polygon
        points={rightArrowHead(MAC.x - 2, MAC_MID_Y)}
        className={c.activationOn ? "fill-primary" : "fill-border"}
        opacity={c.activationOn ? 1 : 0.5}
      />
      <text x={20} y={MAC_MID_Y - 8} fontSize={8} fontWeight={c.activationOn ? 700 : 400} className={c.activationOn ? "fill-foreground" : "fill-muted-foreground"}>
        {c.activationLabel}
      </text>

      {/* out_b: 다음 PE 로 */}
      <line
        x1={MAC.x + MAC.w + 2}
        y1={MAC_MID_Y}
        x2={430}
        y2={MAC_MID_Y}
        className={c.outNextOn ? "stroke-primary" : "stroke-border"}
        strokeWidth={c.outNextOn ? 1.25 : 1}
        strokeDasharray={c.outNextOn ? undefined : "3 3"}
        strokeOpacity={c.outNextOn ? 1 : 0.5}
      />
      <polygon
        points={rightArrowHead(430, MAC_MID_Y)}
        className={c.outNextOn ? "fill-primary" : "fill-border"}
        opacity={c.outNextOn ? 1 : 0.5}
      />
      <text x={MAC.x + MAC.w + 6} y={MAC_MID_Y - 8} fontSize={8} fontWeight={c.outNextOn ? 700 : 400} className={c.outNextOn ? "fill-foreground" : "fill-muted-foreground"}>
        {c.outNextLabel}
      </text>

      {/* out_c: 아래로(drain), OS 에서는 propagate 대기 gate */}
      <line
        x1={230}
        y1={MAC.y + MAC.h + 2}
        x2={230}
        y2={186}
        className={c.outDrainOn ? "stroke-primary" : c.outDrainGated ? "stroke-amber-600" : "stroke-border"}
        strokeWidth={c.outDrainOn ? 1.25 : 1}
        strokeDasharray={c.outDrainOn ? undefined : "3 3"}
        strokeOpacity={c.outDrainOn ? 1 : c.outDrainGated ? 0.9 : 0.5}
      />
      <polygon
        points={downArrowHead(230, 186)}
        className={c.outDrainOn ? "fill-primary" : c.outDrainGated ? "fill-amber-600" : "fill-border"}
        opacity={c.outDrainOn || c.outDrainGated ? 1 : 0.5}
      />
      {c.outDrainGated && (
        <>
          <rect x={218} y={150} width={26} height={14} rx={3} className="fill-none stroke-amber-600" strokeWidth={1} />
          <text x={231} y={160} textAnchor="middle" fontSize={7} fontWeight={700} className="fill-amber-700">
            gate
          </text>
        </>
      )}
      <text x={238} y={180} fontSize={8} fontWeight={c.outDrainOn ? 700 : 400} className={c.outDrainOn ? "fill-foreground" : c.outDrainGated ? "fill-amber-700" : "fill-muted-foreground"}>
        {c.outDrainLabel}
      </text>
    </svg>
  );
}

/** flip 장면 전용: 두 matmul 사이에서 c1·c2 의 propagate/compute 역할이 바뀌는 순간 */
function FlipDiagram() {
  return (
    <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="h-auto w-full min-w-[24rem]" role="img" aria-label="c1·c2 flip: propagate·compute 역할 교대">
      <line x1={230} y1={30} x2={230} y2={170} className="stroke-border" strokeWidth={1} strokeDasharray="3 3" />
      <rect x={205} y={90} width={50} height={20} rx={4} className="fill-primary/10 stroke-primary" strokeWidth={1.25} />
      <text x={230} y={103} textAnchor="middle" fontSize={9} fontWeight={700} className="fill-primary">
        flip=1
      </text>

      <text x={115} y={22} textAnchor="middle" fontSize={9} fontWeight={700} className="fill-foreground">
        matmul A · 이전 사이클
      </text>
      <rect x={45} y={40} width={100} height={34} rx={8} className="fill-primary/20 stroke-primary" strokeWidth={1.25} />
      <text x={95} y={61} textAnchor="middle" fontSize={10} fontWeight={700} className="fill-foreground">
        c1 · propagate
      </text>
      <line x1={145} y1={57} x2={195} y2={57} className="stroke-primary" strokeWidth={1.25} />
      <polygon points={rightArrowHead(195, 57)} className="fill-primary" />
      <text x={148} y={50} fontSize={7} className="fill-primary">
        → out_c
      </text>

      <rect x={45} y={100} width={100} height={34} rx={8} className="fill-muted/40 stroke-border" strokeWidth={1} />
      <text x={95} y={121} textAnchor="middle" fontSize={10} fontWeight={700} className="fill-foreground">
        c2 · compute
      </text>
      <text x={95} y={148} textAnchor="middle" fontSize={8} className="fill-muted-foreground">
        누적 중
      </text>

      <text x={345} y={22} textAnchor="middle" fontSize={9} fontWeight={700} className="fill-foreground">
        matmul B · flip 이후
      </text>
      <rect x={315} y={40} width={100} height={34} rx={8} className="fill-muted/40 stroke-border" strokeWidth={1} />
      <text x={365} y={61} textAnchor="middle" fontSize={10} fontWeight={700} className="fill-foreground">
        c1 · compute
      </text>
      <text x={365} y={88} textAnchor="middle" fontSize={8} className="fill-muted-foreground">
        누적 중
      </text>

      <rect x={315} y={100} width={100} height={34} rx={8} className="fill-primary/20 stroke-primary" strokeWidth={1.25} />
      <text x={365} y={121} textAnchor="middle" fontSize={10} fontWeight={700} className="fill-foreground">
        c2 · propagate
      </text>
      <line x1={415} y1={117} x2={445} y2={117} className="stroke-primary" strokeWidth={1.25} />
      <polygon points={rightArrowHead(445, 117)} className="fill-primary" />
      <text x={400} y={110} fontSize={7} className="fill-primary">
        → out_c
      </text>

      <text x={230} y={185} textAnchor="middle" fontSize={8} className="fill-muted-foreground">
        double-buffer: 한쪽이 나가는 동안 다른 쪽이 쌓입니다
      </text>
    </svg>
  );
}

function IdleAux() {
  return (
    <div className="mt-4 border border-border p-3">
      <p className="text-[11px] font-bold text-muted-foreground">c1 = ? · c2 = ? · dataflow = ?</p>
      <p className="mt-1 text-[11px] text-muted-foreground">
        회로 자체는 이미 다 놓여 있습니다. 다음 두 장면이 같은 MacUnit 을 두고 배선만 바꿉니다.
      </p>
    </div>
  );
}

function WsAux() {
  const cycles = ["a1", "a2", "a3", "a4"];
  return (
    <div className="mt-4 border border-border p-3">
      <p className="text-[11px] font-bold text-muted-foreground">activation 스트림 · weight 는 c1 에 고정된 채 재사용</p>
      <div className="mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-1.5 font-mono text-[11px]">
        {cycles.map((a, i) => (
          <span key={a} className="flex items-center gap-1.5">
            <span className="border border-primary/60 bg-primary/10 px-2 py-1">{a} × weight</span>
            <span className="text-muted-foreground">→ out_b</span>
            {i < cycles.length - 1 && <span className="text-muted-foreground">·</span>}
          </span>
        ))}
      </div>
      <p className="mt-2 text-[11px] text-muted-foreground">재사용 횟수 K = 4 · 매 사이클 즉시 출력, 누적 대기 없음</p>
    </div>
  );
}

function OsAux() {
  const cycles = [3, 7, 12, 18];
  return (
    <div className="mt-4 border border-border p-3">
      <p className="text-[11px] font-bold text-muted-foreground">c1 안의 partial sum · propagate = 0 (아직 out_c 없음)</p>
      <div className="mt-2 grid grid-cols-4 gap-2">
        {cycles.map((v, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div className="flex h-16 w-full items-end border border-border bg-muted/20">
              <div className="w-full bg-primary/60" style={{ height: `${(v / 18) * 100}%` }} />
            </div>
            <span className="font-mono text-[10px] text-muted-foreground">
              t{i + 1}: {v}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-2 text-[11px] text-muted-foreground">weight·activation 이 4 사이클 동안 흘러 지나가며 같은 c1 위에 쌓인 예시 값입니다.</p>
    </div>
  );
}

function FlipAux() {
  return (
    <div className="mt-4 grid gap-2 sm:grid-cols-2">
      <div className="border border-border p-2 font-mono text-[11px]">
        <p className="font-bold text-muted-foreground">matmul A</p>
        <p className="mt-1 text-muted-foreground">last_s=0, prop=0 → flip=0</p>
        <p className="text-muted-foreground">shift_offset = 0</p>
      </div>
      <div className="border border-primary/60 bg-primary/5 p-2 font-mono text-[11px]">
        <p className="font-bold text-foreground">flip 사이클</p>
        <p className="mt-1 text-foreground">last_s=0, prop=1 → flip=1</p>
        <p className="text-foreground">shift_offset = shift(이 사이클만)</p>
      </div>
    </div>
  );
}

function IntensityAux() {
  const points = [
    { k: 4, i: 8 },
    { k: 16, i: 32 },
    { k: 64, i: 128 },
  ];
  return (
    <div className="mt-4 border border-border p-3">
      <p className="text-[11px] font-bold text-muted-foreground">I_PE = 2K / w (int8, w = 1B)</p>
      <div className="mt-2 grid grid-cols-3 gap-3">
        {points.map((pt) => (
          <div key={pt.k} className="flex flex-col items-center gap-1">
            <div className="flex h-16 w-full items-end border border-border bg-muted/20">
              <div className={`w-full ${pt.k === 64 ? "bg-primary" : "bg-primary/40"}`} style={{ height: `${(pt.i / 128) * 100}%` }} />
            </div>
            <span className="font-mono text-[10px] text-muted-foreground">
              K={pt.k} · I≈{pt.i}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-2 text-[11px] text-muted-foreground">K 가 커질수록(같은 weight 를 더 오래 붙잡을수록) roofline 오른쪽(compute-bound)으로 이동합니다.</p>
    </div>
  );
}

const CORE_VARIANT_BY_SCENE: readonly (CoreVariant | "flip")[] = ["idle", "ws", "os", "flip", "intensity"];
const AUX_BY_SCENE = [<IdleAux key="idle" />, <WsAux key="ws" />, <OsAux key="os" />, <FlipAux key="flip" />, <IntensityAux key="intensity" />];

export default function GemminiPeMacDataflowViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2800);
  const variant = CORE_VARIANT_BY_SCENE[scenes.active];
  const isFlip = variant === "flip";

  return (
    <VizFrame
      eyebrow="Gemmini PE · MAC dataflow"
      title="같은 MacUnit 을 감싼 배선만 바꿔 weight 를 고정할지 partial sum 을 고정할지 정합니다"
      description="PE 한 칸 안에는 MacUnit 하나와 c1·c2 레지스터 두 개뿐입니다. PEControl.dataflow 비트가 이 레지스터에 weight 를 고정할지(WS) partial sum 을 고정할지(OS) 정하고, propagate·compute 역할은 매 사이클 c1·c2 사이를 오갈 수 있습니다."
      note="값은 예시(K=4, K=64, 누적 3→7→12→18)이며 실제 PE.scala 의 포트 이름(in_a/in_b/in_c/out_b/out_c)과 dataflow 비트 의미만 그대로 따랐습니다. Mesh 전체의 배선과 accType 폭 변환은 생략했습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="PE 한 칸: MacUnit 을 이중 레지스터로 감싸 데이터플로우를 전환합니다"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(36rem,calc(100dvh-15rem))] min-h-[28rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(scenes.active + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scenes.active]}</h4>

          {!isFlip && <p className="mt-3 font-mono text-[11px] font-bold text-primary">{CORE_CONFIG[variant as CoreVariant].dataflowLabel}</p>}

          <div className="mt-2 w-full min-w-0 overflow-x-auto">
            {isFlip ? <FlipDiagram /> : <PeCoreDiagram variant={variant as CoreVariant} />}
          </div>

          {!isFlip && (
            <div className="mt-2 flex flex-wrap gap-4 font-mono text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="inline-block h-2 w-2 border border-primary bg-primary/35" /> 고정/흐름 중
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block h-2 w-2 border border-dashed border-border" /> 비활성
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block h-2 w-2 border border-dashed border-amber-600" /> propagate 대기
              </span>
            </div>
          )}

          {AUX_BY_SCENE[scenes.active]}

          <p className="mt-4 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[scenes.active]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
