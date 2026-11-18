import SceneShell from "./TxpoolSceneShell";

/**
 * 본문 대응: #canonical-update "Reorg에서는 new branch의 state와 mined set을 pool에 먼저 적용합니다…".
 * Old branch에만 있던 거래 → pooled 형식 복원(blob이면 sidecar 재결합) → add_external_transactions → 새 canonical state에서 재검증.
 * 블록 수, 거래 X와 각 블록의 거래 배치는 설명용 가정. old-only = old mined − new mined = {T7}.
 */
const OLD_MINED: readonly string[] = ["T7", "X"];
const NEW_MINED: readonly string[] = ["X"];
const OLD_ONLY = OLD_MINED.filter((tx) => !NEW_MINED.includes(tx));

const ACCENT = "#2563eb";
const OLD = "#d97706";
const MUTED = "#94a3b8";
const TEXT = "#64748b";

const SCENES = [
  {
    label: "old branch가 canonical",
    summary: "T7 포함 · pool에서 제거됨",
    note: "처음에는 위쪽 branch가 canonical이고 그 block이 T7과 X를 포함했습니다(배치는 가정). 정상 commit이었으므로 pool은 T7을 이미 제거했습니다.",
  },
  {
    label: "reorg: new branch로 바뀜",
    summary: "new branch를 먼저 반영",
    note: "아래쪽 branch가 canonical이 되면 pool은 new branch의 state와 mined set을 먼저 적용합니다. 위쪽 branch의 block은 더 이상 canonical이 아닙니다.",
  },
  {
    label: "old-only를 고름",
    summary: `old mined − new mined = ${OLD_ONLY.join(", ")}`,
    note: "X는 두 branch 모두에 포함됐으므로 여전히 mined입니다. old branch에만 있던 T7만 다시 pool로 돌아갈 후보가 됩니다.",
  },
  {
    label: "복원 뒤 다시 검증",
    summary: "예전 판정을 복사하지 않음",
    note: "T7을 consensus 형식에서 pooled 형식으로 복원하고, blob 거래였다면 sidecar를 다시 결합한 뒤 add_external_transactions 경로로 보냅니다. 한 번 valid였다는 사실을 쓰지 않고 새 canonical state에서 다시 검증합니다.",
  },
] as const;

function Block({ x, y, label, txs, color, solid, highlight }: { x: number; y: number; label: string; txs: readonly string[]; color: string; solid: boolean; highlight: string | null }) {
  return (
    <g>
      <rect x={x} y={y} width={92} height={46} rx={6} fill={solid ? color : "none"} fillOpacity={solid ? 0.1 : 0} stroke={solid ? color : MUTED} strokeWidth={1} strokeDasharray={solid ? undefined : "4 3"} />
      <text x={x + 46} y={y + 17} textAnchor="middle" fontSize={11} fontWeight={700} fill={solid ? color : TEXT}>{label}</text>
      <text x={x + 46} y={y + 35} textAnchor="middle" fontSize={11} fontFamily="monospace" fill={TEXT}>
        {txs.map((tx, index) => (
          <tspan key={tx} fill={tx === highlight ? OLD : TEXT} fontWeight={tx === highlight ? 700 : 400}>{`${index > 0 ? " · " : ""}${tx}`}</tspan>
        ))}
        {txs.length === 0 ? "—" : null}
      </text>
    </g>
  );
}

function ReorgFigure({ active }: { active: number }) {
  const oldCanonical = active === 0;
  const pick = active >= 2 ? OLD_ONLY[0] : null;
  const steps: readonly string[] = ["pooled 형식 복원 (+sidecar)", "add_external_transactions", "새 state로 재검증 → 분류"];
  return (
    <div className="min-w-0">
      <svg viewBox="0 0 360 170" className="mx-auto h-auto w-full max-w-[460px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
        <rect x={8} y={62} width={70} height={46} rx={6} fill="none" stroke={TEXT} strokeWidth={1} />
        <text x={43} y={82} textAnchor="middle" fontSize={11} fontWeight={700} fill={TEXT}>공통 조상</text>
        <text x={43} y={98} textAnchor="middle" fontSize={10} fill={TEXT}>block</text>
        <path d="M78 76 L118 34" stroke={oldCanonical ? OLD : MUTED} strokeWidth={1} strokeDasharray={oldCanonical ? undefined : "4 3"} fill="none" />
        <path d="M78 94 L118 136" stroke={oldCanonical ? MUTED : ACCENT} strokeWidth={1} fill="none" />
        <text x={124} y={10} fontSize={10.5} fill={oldCanonical ? OLD : TEXT}>{oldCanonical ? "old branch · canonical" : "old branch · 밀려남"}</text>
        <Block x={118} y={14} label="old 1" txs={OLD_MINED} color={OLD} solid={oldCanonical} highlight={pick} />
        <text x={124} y={166} fontSize={10.5} fill={oldCanonical ? TEXT : ACCENT}>{oldCanonical ? "new branch" : "new branch · canonical"}</text>
        <Block x={118} y={110} label="new 1" txs={NEW_MINED} color={ACCENT} solid={!oldCanonical} highlight={null} />
        <path d="M210 133 L236 133" stroke={oldCanonical ? MUTED : ACCENT} strokeWidth={1} />
        <Block x={236} y={110} label="new 2" txs={[]} color={ACCENT} solid={!oldCanonical} highlight={null} />
        <g opacity={active >= 2 ? 1 : 0}>
          <rect x={236} y={14} width={116} height={46} rx={6} fill={OLD} fillOpacity={0.12} stroke={OLD} strokeWidth={1.25} />
          <text x={294} y={33} textAnchor="middle" fontSize={11} fontWeight={700} fill={OLD}>old-only</text>
          <text x={294} y={50} textAnchor="middle" fontSize={11} fontFamily="monospace" fill={OLD}>{OLD_ONLY.join(", ")}</text>
          <path d="M210 37 L236 37" stroke={OLD} strokeWidth={1} />
        </g>
      </svg>
      <ol className="mt-3 grid grid-cols-1 gap-2 text-xs leading-5 sm:grid-cols-3">
        {steps.map((step, index) => (
          <li key={step} className={`rounded-md border px-3 py-2 ${active === 3 ? "border-primary bg-primary/10 text-foreground" : "border-border text-muted-foreground"}`}>
            <span className="font-mono text-[10px] font-bold">{`0${index + 1}`}</span> <span className="break-words">{step}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function ReorgOldOnlyViz() {
  return (
    <SceneShell
      eyebrow="reorg · old-only 재주입"
      title="Reorg 뒤에는 old branch에만 있던 거래만 다시 검증합니다"
      description="위쪽이 밀려나는 old branch, 아래쪽이 새 canonical branch입니다. block 수와 거래 X, 각 block의 거래 배치는 설명용 가정입니다."
      ariaLabel="reorg에서 new branch를 먼저 반영하고 old branch에만 있던 T7을 복원해 다시 검증하는 과정"
      scenes={SCENES}
      render={(active) => <ReorgFigure active={active} />}
    />
  );
}
