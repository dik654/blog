import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture 두 문단(정적 → 엣지 캐시, 동적 → 부하 분산 → 둘 이상의 장애 단위 앱, 주문 → 관리형 다중 장소 DB,
 * 메일·이미지 → 큐) + #case 둘째 문단(한 대의 큰 서버는 서버나 장소 장애가 전체 중단).
 * 장애 단위 두 곳은 "둘 이상"의 최소 경우를 그린 가정이다.
 */
type Part = "user" | "edge" | "lb" | "unitA" | "unitB" | "db" | "queue" | "worker";
type Edge = "static" | "toLb" | "toA" | "toB" | "aDb" | "bDb" | "aQueue" | "queueWorker";

const SCENES = [
  {
    label: "한 대의 큰 서버",
    summary: "장소 하나가 멈추면 전체 중단",
    note: "3절의 출발점입니다. 앱과 로컬 데이터베이스가 한 서버, 한 장소에 있어 그 서버나 장소의 장애가 곧 전체 중단입니다.",
    on: [] as Part[],
    lines: [] as Edge[],
  },
  {
    label: "정적 파일은 엣지 캐시에서",
    summary: "사용자 → 가까운 사본",
    note: "엣지 캐시는 사용자 가까운 곳에 파일 사본을 두는 캐시입니다. 정적 파일은 앱 서버까지 가지 않고 여기서 전달됩니다.",
    on: ["user", "edge"] as Part[],
    lines: ["static"] as Edge[],
  },
  {
    label: "동적 요청은 두 장애 단위로",
    summary: "부하 분산 → 앱 A·앱 B",
    note: "부하 분산 장치가 요청을 서로 따로 고장 나는 두 단위의 앱에 나눕니다. 앱은 요청 사이의 기억을 자기 안에 두지 않는(상태 없는) 앱이고, 주문 데이터는 관리형 다중 장소 데이터베이스에 둡니다.",
    on: ["user", "lb", "unitA", "unitB", "db"] as Part[],
    lines: ["toLb", "toA", "toB", "aDb", "bDb"] as Edge[],
  },
  {
    label: "장애 단위 A가 멈추면",
    summary: "요청은 앱 B로",
    note: "한 단위가 사라져도 다른 단위의 앱이 남아 있으므로, 큰 서버 한 대처럼 전체가 함께 멈추지는 않습니다. 1절 문제가 견디라고 한 범위도 한 지역 안의 건물 장애였습니다.",
    on: ["user", "lb", "unitB", "db"] as Part[],
    lines: ["toLb", "toB", "bDb"] as Edge[],
  },
  {
    label: "급하지 않은 작업은 큐로",
    summary: "작업자가 느려도 앞 요청은 계속",
    note: "메일·이미지 처리는 큐에 넣고 작업자가 따로 가져가 처리합니다. 작업자가 잠시 느려져도 앞의 요청 경로는 함께 쓰러지지 않고, 실패한 항목은 다시 처리할 수 있습니다.",
    on: ["user", "lb", "unitA", "unitB", "db", "queue", "worker"] as Part[],
    lines: ["toLb", "toA", "toB", "aDb", "bDb", "aQueue", "queueWorker"] as Edge[],
  },
] as const;

const BLUE = "#2563eb";
const MUTED = "#94a3b8";
const TEXT = "#64748b";
const RED = "#dc2626";

type Rect = readonly [number, number, number, number];
interface Layout {
  w: number;
  h: number;
  cls: string;
  box: Record<Part, Rect>;
  paths: Record<Edge, string>;
  singlePath: string;
  single: Rect;
  singleNote: readonly [number, number];
}

/** 640px 이상은 가로 배치, 그보다 좁으면 같은 부품을 세로로 쌓아 글자를 줄이지 않습니다. */
const WIDE: Layout = {
  w: 480,
  h: 222,
  cls: "hidden sm:block",
  box: {
    user: [12, 128, 76, 40],
    edge: [120, 26, 110, 44],
    lb: [120, 128, 110, 40],
    unitA: [250, 84, 112, 60],
    unitB: [250, 150, 112, 60],
    db: [388, 84, 82, 126],
    queue: [250, 22, 118, 40],
    worker: [388, 22, 82, 40],
  },
  paths: {
    static: "M88 136 L120 50",
    toLb: "M88 148 L120 148",
    toA: "M230 142 L250 114",
    toB: "M230 154 L250 178",
    aDb: "M362 116 L388 116",
    bDb: "M362 178 L388 178",
    aQueue: "M344 84 L344 62",
    queueWorker: "M368 42 L388 42",
  },
  singlePath: "M88 148 L250 148",
  single: [250, 84, 220, 120],
  singleNote: [360, 190],
};

const NARROW: Layout = {
  w: 300,
  h: 300,
  cls: "sm:hidden",
  box: {
    user: [100, 4, 100, 34],
    edge: [12, 60, 120, 42],
    lb: [168, 60, 120, 42],
    unitA: [12, 124, 132, 48],
    unitB: [156, 124, 132, 48],
    db: [12, 192, 276, 40],
    queue: [12, 252, 132, 44],
    worker: [156, 252, 132, 44],
  },
  paths: {
    static: "M130 38 L72 60",
    toLb: "M170 38 L228 60",
    toA: "M228 102 L78 124",
    toB: "M228 102 L222 124",
    aDb: "M60 172 L60 192",
    bDb: "M222 172 L222 192",
    aQueue: "M12 148 L4 148 L4 274 L12 274",
    queueWorker: "M144 274 L156 274",
  },
  singlePath: "M150 38 L150 60",
  single: [12, 60, 276, 172],
  singleNote: [150, 206],
};

function Box({ rect, label, sub, state }: { rect: Rect; label: string; sub?: string; state: "on" | "off" | "fail" | "slow" }) {
  const [x, y, w, h] = rect;
  const stroke = state === "on" ? BLUE : state === "fail" ? RED : state === "slow" ? "#d97706" : MUTED;
  const fill = state === "on" ? BLUE : state === "fail" ? RED : state === "slow" ? "#d97706" : TEXT;
  return (
    <g opacity={state === "off" ? 0.4 : 1}>
      <rect x={x} y={y} width={w} height={h} rx={6} fill="none" stroke={stroke} strokeWidth={state === "off" ? 1 : 1.25} strokeDasharray={state === "fail" ? "4 3" : undefined} />
      <text x={x + w / 2} y={sub ? y + h / 2 - 3 : y + h / 2 + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill={fill}>{label}</text>
      {sub && <text x={x + w / 2} y={y + h / 2 + 13} textAnchor="middle" fontSize={11} fill={fill}>{sub}</text>}
    </g>
  );
}

function Diagram({ layout, active }: { layout: Layout; active: number }) {
  const scene = SCENES[active];
  const single = active === 0;
  const state = (part: Part): "on" | "off" | "fail" | "slow" => {
    if (part === "unitA" && active === 3) return "fail";
    if (part === "worker" && active === 4) return "slow";
    return (scene.on as readonly Part[]).includes(part) ? "on" : "off";
  };
  const { box } = layout;
  return (
    <svg viewBox={`0 0 ${layout.w} ${layout.h}`} className={`mx-auto h-auto w-full max-w-[640px] ${layout.cls}`} role="img" aria-label={`${scene.label}: ${scene.summary}`}>
      <Box rect={box.user} label="사용자" state={single || state("user") === "on" ? "on" : "off"} />
      {single ? (
        <g>
          <path d={layout.singlePath} stroke={BLUE} strokeWidth={1.25} fill="none" />
          <Box rect={layout.single} label="큰 서버 1대" sub="앱 + 로컬 DB · 한 장소" state="fail" />
          <text x={layout.singleNote[0]} y={layout.singleNote[1]} textAnchor="middle" fontSize={12} fontWeight={700} fill={RED}>장소 장애 → 전체 중단</text>
        </g>
      ) : (
        <g>
          {(Object.keys(layout.paths) as Edge[]).map((edge) => {
            const used = (scene.lines as readonly Edge[]).includes(edge);
            const broken = active === 3 && (edge === "toA" || edge === "aDb");
            return (
              <path
                key={edge}
                d={layout.paths[edge]}
                fill="none"
                stroke={broken ? RED : used ? BLUE : MUTED}
                strokeWidth={used ? 1.25 : 1}
                strokeDasharray={used ? undefined : "3 3"}
                opacity={used || broken ? 1 : 0.5}
              />
            );
          })}
          <Box rect={box.edge} label="엣지 캐시" sub="정적 파일" state={state("edge")} />
          <Box rect={box.lb} label="부하 분산" state={state("lb")} />
          <Box rect={box.unitA} label="장애 단위 A" sub={active === 3 ? "멈춤" : "앱 (상태 없음)"} state={state("unitA")} />
          <Box rect={box.unitB} label="장애 단위 B" sub="앱 (상태 없음)" state={state("unitB")} />
          <Box rect={box.db} label="주문 DB" sub="관리형 다중 장소" state={state("db")} />
          <Box rect={box.queue} label="큐" sub="메일·이미지 작업" state={state("queue")} />
          <Box rect={box.worker} label="작업자" sub={active === 4 ? "잠시 느림" : undefined} state={state("worker")} />
        </g>
      )}
    </svg>
  );
}

export default function RequestPathFailureViz() {
  return (
    <SceneShell
      eyebrow="요청 경로와 실패 경계"
      title="부품을 나누면 한 곳의 장애가 전체로 번지지 않습니다"
      description="파란 선은 이 장면에서 실제로 쓰이는 경로입니다. 장애 단위는 가용 영역처럼 한 지역 안에서 서로 따로 고장 나는 묶음이며, 두 곳은 ‘둘 이상’을 가장 작게 그린 가정입니다."
      ariaLabel="한 대의 큰 서버에서 엣지 캐시, 부하 분산, 두 장애 단위, 큐로 나눈 구조와 장애 시 요청 경로"
      scenes={SCENES}
      render={(active) => (
        <>
          <Diagram layout={WIDE} active={active} />
          <Diagram layout={NARROW} active={active} />
        </>
      )}
    />
  );
}
