import SceneShell from "./SceneShell";

/**
 * 본문 대응: #need(5절).
 * 장바구니를 한 서버 메모리에만 두면 다음 요청이 다른 서버로 갔을 때 사라져 보인다.
 * 실행 자원은 언제든 교체될 수 있다고 보고 세션·파일을 공유 저장소에 둔다.
 * 대가: 네트워크 호출 지연, 저장소 장애가 새 병목, 재시도 때 같은 작업이 두 번 실행돼도 안전해야 한다.
 */
const W = 360;
const H = 236;

const USER = { x: 8, y: 88, w: 62, h: 34 };
const LB = { x: 96, y: 88, w: 72, h: 34 };
const A = { x: 196, y: 18, w: 104, h: 62 };
const B = { x: 196, y: 108, w: 104, h: 62 };
const STORE = { x: 196, y: 192, w: 156, h: 36 };

const BLUE = "#2563eb";
const GREY = "#94a3b8";
const RED = "#dc2626";
const AMBER = "#d97706";
const GREEN = "#059669";

type Mem = { text: string; color: string };

type Frame = {
  target: "A" | "B";
  memA: Mem;
  memB: Mem;
  store: Mem | null;
  replacedA: boolean;
  cost: boolean;
};

const EMPTY: Mem = { text: "비어 있음", color: GREY };
const CART: Mem = { text: "장바구니", color: BLUE };
const NONE_STATE: Mem = { text: "처리만 함", color: GREY };

const FRAMES: readonly Frame[] = [
  { target: "A", memA: CART, memB: EMPTY, store: null, replacedA: false, cost: false },
  { target: "B", memA: CART, memB: { text: "장바구니 없음", color: RED }, store: null, replacedA: false, cost: false },
  { target: "B", memA: NONE_STATE, memB: NONE_STATE, store: { text: "장바구니", color: BLUE }, replacedA: false, cost: false },
  { target: "A", memA: NONE_STATE, memB: NONE_STATE, store: { text: "장바구니 그대로", color: GREEN }, replacedA: true, cost: false },
  { target: "B", memA: NONE_STATE, memB: NONE_STATE, store: { text: "장애 나면 새 병목", color: AMBER }, replacedA: false, cost: true },
];

const SCENES = [
  {
    label: "요청 1: 서버 A가 장바구니를 기억",
    summary: "상태 = 서버 A 메모리",
    note: "첫 요청이 서버 A로 가서 장바구니를 A의 메모리에 담았습니다. 이 상태로는 장바구니가 서버 A 한 대에만 있습니다.",
  },
  {
    label: "요청 2가 서버 B로 가면",
    summary: "B에는 없음 → 사라져 보임",
    note: "다음 요청이 다른 서버 B로 가면 B의 메모리에는 장바구니가 없습니다. 데이터는 A에 남아 있지만 사용자에게는 사라진 것처럼 보입니다.",
  },
  {
    label: "상태를 공유 저장소로 옮기면",
    summary: "A·B 모두 같은 장바구니를 읽음",
    note: "세션과 파일을 공유 저장소나 데이터 서비스에 두면 요청이 어느 서버로 가든 같은 장바구니를 읽습니다. 서버는 요청을 처리만 하고 상태를 들고 있지 않습니다.",
  },
  {
    label: "서버 A가 교체돼도",
    summary: "실행 자원은 바뀌고 상태는 남음",
    note: "실행 자원은 언제든 교체될 수 있다고 봅니다. 서버 A가 새 서버로 바뀌어도 장바구니는 저장소에 있으므로 그대로 이어집니다. 그래서 복제본을 늘리거나 바꾸기가 안전해집니다.",
  },
  {
    label: "밖으로 옮긴 대가",
    summary: "왕복 지연 · 저장소 장애 · 재시도",
    note: "요청마다 저장소를 다녀오는 네트워크 지연이 붙고, 저장소 장애가 새 병목이 됩니다. 캐시와 지속 데이터의 경계를 정하고, 재시도로 같은 작업이 두 번 실행돼도 결과가 한 번과 같게 만듭니다.",
  },
] as const;

function Box({ box, label, stroke, dashed = false }: { box: typeof A; label: string; stroke: string; dashed?: boolean }) {
  return (
    <g>
      <rect x={box.x} y={box.y} width={box.w} height={box.h} rx={8} fill="none" stroke={stroke} strokeWidth={1.25} strokeDasharray={dashed ? "4 3" : undefined} />
      <text x={box.x + box.w / 2} y={box.y + (box.h > 40 ? 16 : box.h / 2 + 4)} textAnchor="middle" fontSize={12} fontWeight={700} fill="#334155">
        {label}
      </text>
    </g>
  );
}

function Memory({ box, mem }: { box: typeof A; mem: Mem }) {
  return (
    <g>
      <rect x={box.x + 10} y={box.y + 26} width={box.w - 20} height={26} rx={6} fill="none" stroke={mem.color} strokeWidth={1} />
      <text x={box.x + 16} y={box.y + 36} fontSize={9} fill="#64748b">
        메모리
      </text>
      <text x={box.x + box.w / 2} y={box.y + 47} textAnchor="middle" fontSize={11} fontWeight={700} fill={mem.color}>
        {mem.text}
      </text>
    </g>
  );
}

function Arrow({ d, color, label, lx, ly, uid }: { d: string; color: string; label?: string; lx?: number; ly?: number; uid: number }) {
  return (
    <g>
      <path d={d} fill="none" stroke={color} strokeWidth={1.25} markerEnd={color === BLUE ? `url(#so-arrow-blue-${uid})` : `url(#so-arrow-grey-${uid})`} />
      {label && (
        <text x={lx} y={ly} fontSize={10} fill={color === BLUE ? "#1d4ed8" : "#64748b"}>
          {label}
        </text>
      )}
    </g>
  );
}

function Picture({ frame, uid }: { frame: Frame; uid: number }) {
  const toA = frame.target === "A";
  const lbMid = LB.y + LB.h / 2;
  const storeOn = frame.store !== null;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[460px]" role="img" aria-label="사용자 요청이 요청 분배를 거쳐 서버 A나 B로 가고 상태를 메모리 또는 공유 저장소에 두는 그림">
      <defs>
        <marker id={`so-arrow-blue-${uid}`} viewBox="0 0 8 8" refX={7} refY={4} markerWidth={7} markerHeight={7} orient="auto">
          <path d="M0 0 L8 4 L0 8 z" fill={BLUE} />
        </marker>
        <marker id={`so-arrow-grey-${uid}`} viewBox="0 0 8 8" refX={7} refY={4} markerWidth={7} markerHeight={7} orient="auto">
          <path d="M0 0 L8 4 L0 8 z" fill={GREY} />
        </marker>
      </defs>
      <Box box={USER} label="사용자" stroke={GREY} />
      <Box box={LB} label="요청 분배" stroke={GREY} />
      <Box box={A} label={frame.replacedA ? "새 서버 A" : "서버 A"} stroke={toA ? BLUE : GREY} dashed={frame.replacedA} />
      <Box box={B} label="서버 B" stroke={toA ? GREY : BLUE} />
      <Memory box={A} mem={frame.memA} />
      <Memory box={B} mem={frame.memB} />

      <Arrow uid={uid} d={`M${USER.x + USER.w} ${lbMid} L${LB.x - 2} ${lbMid}`} color={BLUE} label={frame.cost ? "재시도: 같은 요청 2번" : undefined} lx={USER.x + 2} ly={USER.y + USER.h + 14} />
      <Arrow uid={uid} d={`M${LB.x + LB.w} ${lbMid - 6} L${A.x - 2} ${A.y + A.h / 2}`} color={toA ? BLUE : GREY} />
      <Arrow uid={uid} d={`M${LB.x + LB.w} ${lbMid + 6} L${B.x - 2} ${B.y + B.h / 2}`} color={toA ? GREY : BLUE} />

      {storeOn ? (
        <g>
          <path d={`M${A.x + A.w} ${A.y + A.h / 2} L${STORE.x + STORE.w - 14} ${A.y + A.h / 2} L${STORE.x + STORE.w - 14} ${STORE.y - 2}`} fill="none" stroke={toA ? BLUE : GREY} strokeWidth={1} strokeDasharray={toA ? undefined : "3 3"} />
          <path d={`M${B.x + B.w} ${B.y + B.h / 2} L${STORE.x + STORE.w - 32} ${B.y + B.h / 2} L${STORE.x + STORE.w - 32} ${STORE.y - 2}`} fill="none" stroke={toA ? GREY : BLUE} strokeWidth={1} strokeDasharray={toA ? "3 3" : undefined} />
        </g>
      ) : null}
      <rect
        x={STORE.x}
        y={STORE.y}
        width={STORE.w}
        height={STORE.h}
        rx={8}
        fill="none"
        stroke={storeOn && frame.store ? frame.store.color : GREY}
        strokeWidth={storeOn ? 1.25 : 1}
        strokeDasharray={storeOn ? undefined : "4 3"}
        opacity={storeOn ? 1 : 0.5}
      />
      <text x={STORE.x + 10} y={STORE.y + 15} fontSize={10} fill="#64748b">
        공유 저장소
      </text>
      <text x={STORE.x + 10} y={STORE.y + 29} fontSize={11} fontWeight={700} fill={storeOn && frame.store ? frame.store.color : GREY}>
        {storeOn && frame.store ? frame.store.text : "아직 쓰지 않음"}
      </text>

      {frame.cost && (
        <g>
          <text x={8} y={160} fontSize={11} fontWeight={700} fill={AMBER}>
            요청마다 저장소 왕복
          </text>
          <text x={8} y={174} fontSize={11} fill="#475569">
            = 네트워크 호출 지연
          </text>
          <text x={8} y={198} fontSize={11} fontWeight={700} fill={AMBER}>
            같은 작업이 두 번 실행돼도
          </text>
          <text x={8} y={212} fontSize={11} fill="#475569">
            결과는 한 번 실행과 같게
          </text>
        </g>
      )}
      {frame.target === "B" && !storeOn && (
        <text x={8} y={176} fontSize={11} fontWeight={700} fill={RED}>
          사용자 눈에는 장바구니가 사라짐
        </text>
      )}
      {frame.replacedA && (
        <text x={8} y={176} fontSize={11} fontWeight={700} fill={GREEN}>
          서버가 바뀌어도 상태는 남음
        </text>
      )}
    </svg>
  );
}

export default function StateOutsideViz() {
  return (
    <SceneShell
      eyebrow="상태의 위치"
      title="장바구니를 서버 안에 두면 다음 요청에서 사라져 보입니다"
      description="같은 일을 하는 서버(복제본) 두 대가 요청을 나눠 받습니다. 파란 선이 이번 요청이 지나간 길이고, 상자 안 칸이 그 서버의 메모리입니다."
      ariaLabel="상태를 서버 메모리에 둘 때와 공유 저장소에 둘 때, 서버 교체와 그 대가를 차례로 비교"
      scenes={SCENES}
      render={(active) => <Picture uid={active} frame={FRAMES[active] ?? FRAMES[0]} />}
    />
  );
}
