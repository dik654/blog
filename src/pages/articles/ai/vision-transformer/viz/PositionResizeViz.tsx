import SceneShell from "./SceneShell";

/**
 * 본문 대응: #position-resize — 224px·P=16 checkpoint의 14×14 position grid를 384px 입력의 24×24 grid로 옮긴다.
 * 224÷16 = 14 → 196 + [CLS] = 197, 384÷16 = 24 → 576 + [CLS] = 577.
 * Class token을 떼고, patch position만 2D 보간한 뒤 다시 붙인다.
 */
const OLD = 14;
const NEW = 24;
const OLD_LEN = OLD * OLD + 1;
const NEW_LEN = NEW * NEW + 1;

const ACCENT = "#2563eb";
const CLS = "#d97706";
const TEXT = "#64748b";
const NEW_C = "#059669";

const SCENES = [
  {
    label: "길이가 맞지 않습니다",
    summary: "197 ≠ 577",
    note: "Checkpoint는 224÷16 = 14, 14×14 = 196에 [CLS]를 더한 197개 position을 갖습니다. 384px 입력은 384÷16 = 24, 24×24 = 576에 [CLS]까지 577개라 그대로 더할 수 없습니다.",
  },
  {
    label: "[CLS]를 떼고 격자로 되돌립니다",
    summary: "197 = 1 + 14×14",
    note: "[CLS] position은 image의 어느 칸에도 속하지 않아 따로 떼어 둡니다. 남은 196개를 14×14 격자로 다시 세우면 칸마다 D차원 position vector가 하나씩 있습니다.",
  },
  {
    label: "격자를 24×24로 보간합니다",
    summary: "14×14 → 24×24",
    note: "같은 image 범위에 24×24 칸을 놓고(가정: 두 격자를 같은 범위에 맞춤) 새 칸 값을 주변 기존 값으로 계산합니다. 보간법 선택은 실무 글의 몫이고, 보간은 기존 위치 신호를 옮길 뿐 새 위치 관계를 학습하지 않습니다.",
  },
  {
    label: "다시 붙입니다",
    summary: "1 + 576 = 577",
    note: "떼어 둔 [CLS] position을 맨 앞에 다시 붙이면 577개가 되어 384px 입력의 token 수와 맞습니다.",
  },
] as const;

function Strip({ y, len, label, color }: { y: number; len: number; label: string; color: string }) {
  const width = (len / NEW_LEN) * 290;
  return (
    <g>
      <text x={20} y={y - 6} fontSize={11} fontWeight={700} fill={TEXT}>{label}</text>
      <rect x={20} y={y} width={6} height={16} fill={CLS} />
      <rect x={28} y={y} width={width - 8} height={16} fill={color} fillOpacity={0.3} stroke={color} strokeWidth={1} />
      <text x={20 + width + 6} y={y + 12} fontSize={11} fontWeight={700} fill={color}>{len}</text>
    </g>
  );
}

function Grid({ x, y, size, n, color, opacity }: { x: number; y: number; size: number; n: number; color: string; opacity: number }) {
  const c = size / n;
  return (
    <g>
      <rect x={x} y={y} width={size} height={size} fill={color} fillOpacity={opacity} stroke={color} strokeWidth={1} />
      {Array.from({ length: n - 1 }, (_, i) => (
        <g key={i}>
          <line x1={x + (i + 1) * c} x2={x + (i + 1) * c} y1={y} y2={y + size} stroke={color} strokeWidth={0.5} strokeOpacity={0.6} />
          <line x1={x} x2={x + size} y1={y + (i + 1) * c} y2={y + (i + 1) * c} stroke={color} strokeWidth={0.5} strokeOpacity={0.6} />
        </g>
      ))}
    </g>
  );
}

function Scene({ active }: { active: number }) {
  if (active === 0) {
    return (
      <g>
        <Strip y={50} len={OLD_LEN} label="checkpoint position (224px)" color={ACCENT} />
        <Strip y={118} len={NEW_LEN} label="384px 입력의 token" color={NEW_C} />
        <rect x={20} y={164} width={8} height={8} fill={CLS} />
        <text x={34} y={172} fontSize={10} fill={TEXT}>맨 앞 칸 = [CLS]</text>
      </g>
    );
  }
  if (active === 1) {
    return (
      <g>
        <rect x={20} y={40} width={22} height={22} fill={CLS} fillOpacity={0.8} />
        <text x={31} y={80} textAnchor="middle" fontSize={10} fill={CLS}>[CLS]</text>
        <text x={31} y={94} textAnchor="middle" fontSize={10} fill={CLS}>따로 보관</text>
        <Grid x={150} y={30} size={140} n={OLD} color={ACCENT} opacity={0.12} />
        <text x={150} y={22} fontSize={11} fontWeight={700} fill={ACCENT}>196 → 14 × 14</text>
        <text x={150} y={188} fontSize={10} fill={TEXT}>칸마다 position vector 1개</text>
      </g>
    );
  }
  if (active === 2) {
    // 확대 상자: 기존 칸 열 3~4, 행 2~3을 70px/기존 칸으로 그린다. 새 칸 한 변 = 14/24 기존 칸.
    const zx = 200;
    const zy = 34;
    const unit = 70;
    const u = (col: number) => zx + (col - 3) * unit;
    const v = (row: number) => zy + (row - 2) * unit;
    const step = OLD / NEW;
    const newCols = [6, 7, 8].map((k) => k * step).filter((c) => c > 3 && c < 5);
    const newRows = [4, 5, 6].map((k) => k * step).filter((r) => r > 2 && r < 4);
    return (
      <g>
        <Grid x={20} y={34} size={140} n={OLD} color={ACCENT} opacity={0.12} />
        <text x={20} y={24} fontSize={11} fontWeight={700} fill={ACCENT}>기존 14×14</text>
        <rect x={50} y={54} width={20} height={20} fill="none" stroke={NEW_C} strokeWidth={1.25} />
        <line x1={70} y1={54} x2={zx} y2={zy} stroke={NEW_C} strokeWidth={1} strokeDasharray="3 2" />
        <line x1={70} y1={74} x2={zx} y2={zy + 2 * unit} stroke={NEW_C} strokeWidth={1} strokeDasharray="3 2" />
        <text x={zx} y={24} fontSize={11} fontWeight={700} fill={NEW_C}>확대: 기존 칸 4개</text>
        <rect x={zx} y={zy} width={2 * unit} height={2 * unit} fill={ACCENT} fillOpacity={0.08} stroke={ACCENT} strokeWidth={1.25} />
        <line x1={u(4)} x2={u(4)} y1={zy} y2={zy + 2 * unit} stroke={ACCENT} strokeWidth={1.25} />
        <line x1={zx} x2={zx + 2 * unit} y1={v(3)} y2={v(3)} stroke={ACCENT} strokeWidth={1.25} />
        {newCols.map((c) => (
          <line key={`c${c}`} x1={u(c)} x2={u(c)} y1={zy} y2={zy + 2 * unit} stroke={NEW_C} strokeWidth={1} strokeDasharray="4 2" />
        ))}
        {newRows.map((r) => (
          <line key={`r${r}`} x1={zx} x2={zx + 2 * unit} y1={v(r)} y2={v(r)} stroke={NEW_C} strokeWidth={1} strokeDasharray="4 2" />
        ))}
        <rect x={u(7 * step)} y={v(5 * step)} width={step * unit} height={step * unit} fill={NEW_C} fillOpacity={0.45} />
        {[3.5, 4.5].map((c) =>
          [2.5, 3.5].map((r) => <circle key={`${c}-${r}`} cx={u(c)} cy={v(r)} r={4} fill={ACCENT} />),
        )}
        <text x={20} y={194} fontSize={10} fill={TEXT}>파란 점 = 기존 칸 값 · 초록 칸 = 새 24×24 칸 하나</text>
      </g>
    );
  }
  return (
    <g>
      <rect x={20} y={60} width={22} height={22} fill={CLS} fillOpacity={0.8} />
      <text x={31} y={100} textAnchor="middle" fontSize={10} fill={CLS}>[CLS]</text>
      <text x={56} y={76} fontSize={14} fontWeight={700} fill={TEXT}>+</text>
      <Grid x={80} y={30} size={120} n={NEW} color={NEW_C} opacity={0.12} />
      <text x={80} y={22} fontSize={11} fontWeight={700} fill={NEW_C}>24 × 24 = 576</text>
      <text x={220} y={80} fontSize={14} fontWeight={700} fill={TEXT}>=</text>
      <text x={240} y={80} fontSize={16} fontWeight={700} fill={NEW_C}>{NEW_LEN}</text>
      <text x={240} y={98} fontSize={10} fill={TEXT}>384px 입력과 같은 길이</text>
    </g>
  );
}

export default function PositionResizeViz() {
  return (
    <SceneShell
      eyebrow="Position grid 옮기기"
      title="224px용 position 197개를 384px 입력에 맞추는 순서"
      description="격자 한 칸이 16×16 patch 한 자리이고, 칸마다 그 자리의 position vector가 있습니다."
      ariaLabel="Class token을 떼고 14×14 position grid를 24×24로 보간한 뒤 다시 붙이는 과정"
      scenes={SCENES}
      render={(active) => (
        <svg
          viewBox="0 0 360 200"
          className="mx-auto h-auto w-full max-w-[560px]"
          role="img"
          aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}
        >
          <Scene active={active} />
        </svg>
      )}
    />
  );
}
