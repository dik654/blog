import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #kernel-trick — 같은 세 행렬 φ(Q)·φ(K)ᵀ·V를 어느 쪽부터 묶느냐가 중간 결과의 모양을 바꾼다.
 * 순서 A: φ(Q)φ(K)ᵀ → n×n 유사도 표(n²칸). 순서 B: φ(K)ᵀV → d×d(d=128이면 16,384칸).
 * n=1,000 → n²=1,000,000, n=1,000,000 → n²=10¹². 도형은 모양만 나타내며 축척이 아니다.
 */
const SCENES = [
  {
    label: "순서 A · 유사도 표부터",
    summary: "중간 결과 n×n",
    note: "φ(Q)와 φ(K)ᵀ를 먼저 곱하면 query n개 × key n개의 유사도 표가 생깁니다. 이 표를 채우는 것이 O(n²)이고, 그다음에야 V를 곱합니다.",
  },
  {
    label: "순서 B · φ(K)ᵀV부터",
    summary: "중간 결과 d×d",
    note: "곱셈의 결합법칙으로 괄호만 옮겨 φ(K)ᵀ와 V를 먼저 묶으면 중간 결과는 d×d 하나입니다. Query는 이 결과 하나만 읽으면 되므로 전체 비용이 O(n)이 됩니다.",
  },
  {
    label: "n을 늘려 봅니다",
    summary: "d×d는 16,384칸 그대로",
    note: "d=128이면 순서 B의 중간 결과는 n과 상관없이 128×128 = 16,384칸입니다. 순서 A의 표는 n=1,000에서 100만 칸, n=100만에서 1조 칸으로 n²을 따라 커집니다.",
  },
] as const;

const AMBER = "#d97706";
const SKY = "#0284c7";
const SLATE = "#64748b";
const LINE = "#94a3b8";

function Matrix({ x, y, w, h, label, dims, color }: { x: number; y: number; w: number; h: number; label: string; dims: string; color: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={2} fill={color} fillOpacity={0.14} stroke={color} strokeWidth={1} />
      <text x={x + w / 2} y={146} textAnchor="middle" fontSize={11} fontWeight={700} fill={color}>{label}</text>
      <text x={x + w / 2} y={160} textAnchor="middle" fontSize={10} fill={SLATE}>{dims}</text>
    </g>
  );
}

function Op({ x, text }: { x: number; text: string }) {
  return <text x={x} y={84} textAnchor="middle" fontSize={13} fill={SLATE}>{text}</text>;
}

function OrderDiagram({ order }: { order: "A" | "B" }) {
  const isA = order === "A";
  const color = isA ? AMBER : SKY;
  return (
    <svg viewBox="0 0 360 170" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={isA ? "φ(Q)와 φ(K)ᵀ를 먼저 곱해 n×n 표를 만드는 순서" : "φ(K)ᵀ와 V를 먼저 곱해 d×d 행렬을 만드는 순서"}>
      <rect x={isA ? 28 : 70} y={22} width={isA ? 150 : 146} height={112} rx={6} fill="none" stroke={color} strokeWidth={1.25} strokeDasharray="4 3" />
      <text x={isA ? 103 : 143} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={color}>먼저 곱하는 묶음</text>
      <Matrix x={36} y={30} w={20} h={100} label="φ(Q)" dims="n×d" color={isA ? color : SLATE} />
      <Op x={64} text="×" />
      <Matrix x={74} y={70} w={100} h={20} label="φ(K)ᵀ" dims="d×n" color={color} />
      <Op x={182} text="×" />
      <Matrix x={190} y={30} w={20} h={100} label="V" dims="n×d" color={isA ? SLATE : color} />
      {isA ? (
        <>
          {/* 순서 A의 n×n 표는 φ(Q)φ(K)ᵀ 묶음에서 나오므로 화살표를 V가 아니라 묶음 상자에서 출발시킨다. */}
          <path d="M178 34 Q214 4 248 32" fill="none" stroke={LINE} strokeWidth={1} />
          <path d="M241 31 L248 32 L245 25" fill="none" stroke={LINE} strokeWidth={1} />
        </>
      ) : (
        <>
          <line x1={222} x2={244} y1={80} y2={80} stroke={LINE} strokeWidth={1} />
          <path d="M240 76 L246 80 L240 84" fill="none" stroke={LINE} strokeWidth={1} />
        </>
      )}
      {isA ? (
        <>
          <rect x={252} y={30} width={100} height={100} rx={2} fill={color} fillOpacity={0.14} stroke={color} strokeWidth={1.25} />
          <text x={302} y={84} textAnchor="middle" fontSize={11} fontWeight={700} fill={color}>n×n 표</text>
          <text x={302} y={146} textAnchor="middle" fontSize={11} fontWeight={700} fill={color}>중간 결과</text>
          <text x={302} y={160} textAnchor="middle" fontSize={10} fill={SLATE}>n이 크면 같이 커짐</text>
        </>
      ) : (
        <>
          <rect x={292} y={70} width={20} height={20} rx={2} fill={color} fillOpacity={0.14} stroke={color} strokeWidth={1.25} />
          <text x={302} y={110} textAnchor="middle" fontSize={11} fontWeight={700} fill={color}>d×d</text>
          <text x={302} y={146} textAnchor="middle" fontSize={11} fontWeight={700} fill={color}>중간 결과</text>
          <text x={302} y={160} textAnchor="middle" fontSize={10} fill={SLATE}>n과 무관</text>
        </>
      )}
    </svg>
  );
}

const ROWS = [
  { n: "n = 1,000", a: "100만 칸", b: "16,384칸" },
  { n: "n = 100만", a: "1조 칸", b: "16,384칸" },
] as const;

function GrowthTable() {
  return (
    <div className="min-w-0 text-xs sm:text-sm">
      <div className="grid grid-cols-[5.5rem_minmax(0,1fr)_minmax(0,1fr)] gap-2 border-b border-border pb-2 font-semibold sm:grid-cols-[7rem_minmax(0,1fr)_minmax(0,1fr)]">
        <span className="text-muted-foreground">query 수</span>
        <span className="text-amber-700 dark:text-amber-400">순서 A · n×n</span>
        <span className="text-sky-700 dark:text-sky-400">순서 B · d×d</span>
      </div>
      {ROWS.map((row) => (
        <div key={row.n} className="grid grid-cols-[5.5rem_minmax(0,1fr)_minmax(0,1fr)] gap-2 border-b border-border/60 py-3 sm:grid-cols-[7rem_minmax(0,1fr)_minmax(0,1fr)]">
          <span className="font-mono">{row.n}</span>
          <span className="font-mono text-amber-700 dark:text-amber-400">{row.a}</span>
          <span className="font-mono font-bold text-sky-700 dark:text-sky-400">{row.b}</span>
        </div>
      ))}
      <p className="mt-3 text-xs leading-5 text-muted-foreground">순서 B에서 n이 늘면 φ(K)ᵀV를 만들 때 더해지는 key-value 쌍의 수만 늘어납니다.</p>
    </div>
  );
}

export default function KernelOrderViz() {
  return (
    <SceneShell
      eyebrow="곱셈 순서 바꾸기"
      title="괄호 위치만 옮겨도 중간 결과가 n×n에서 d×d로 바뀝니다"
      description="n은 token(=query) 수, d는 feature 차원(여기서는 128)입니다. φ는 Q와 K를 양수 값으로 바꿔 내적이 유사도 역할을 하게 만드는 kernel feature map입니다. 도형은 행렬의 모양만 나타내며 크기 비율은 축척이 아닙니다."
      ariaLabel="φ(Q)·φ(K)ᵀ·V를 묶는 두 순서와 중간 결과 크기 비교"
      scenes={SCENES}
      render={(active) => (
        <StableSceneStack active={active} scenes={[<OrderDiagram key="a" order="A" />, <OrderDiagram key="b" order="B" />, <GrowthTable key="g" />]} />
      )}
    />
  );
}
