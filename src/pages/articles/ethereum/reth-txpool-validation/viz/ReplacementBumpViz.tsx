import SceneShell from "./SceneShell";

/**
 * 본문 대응: #experiment 03(Replacement flood) — 같은 sender·nonce 후보를 bump 경계 아래·같음·위로 보낸다.
 * 기존 수수료 10, bump 10%는 그림을 위한 가정 → 경계 10 × 1.1 = 11. 후보 10.5 / 11 / 12.
 */
const OLD_FEE = 10;
const BUMP_PERCENT = 10;
const LIMIT = (OLD_FEE * (100 + BUMP_PERCENT)) / 100;
const MIN_FEE = 9;
const MAX_FEE = 13;
const X0 = 24;
const X1 = 336;
const fx = (fee: number) => X0 + ((fee - MIN_FEE) / (MAX_FEE - MIN_FEE)) * (X1 - X0);
const TICKS = [9, 10, 11, 12, 13] as const;

const SCENES = [
  {
    label: "기존 후보와 교체 경계",
    short: "경계",
    summary: `수수료 ${OLD_FEE} → 경계 ${LIMIT}`,
    candidate: null as number | null,
    slot: `${OLD_FEE}`,
    note: `Alice의 nonce 7 자리에 수수료 ${OLD_FEE}인 거래가 있다고 해 봅니다(가정). price bump는 같은 자리를 빼앗으려면 기존 수수료보다 정한 비율만큼 더 내야 한다는 규칙이고, bump ${BUMP_PERCENT}%(가정)이면 경계는 ${OLD_FEE} × 1.1 = ${LIMIT}입니다.`,
  },
  {
    label: "경계 아래 · 10.5",
    short: "아래 10.5",
    summary: "교체 거절 · 기존 10 유지",
    candidate: 10.5,
    slot: `${OLD_FEE}`,
    note: "10.5는 기존보다 높지만 경계 11에 못 미칩니다. 새 후보는 거절되고 자리에는 여전히 하나만 남습니다.",
  },
  {
    label: "경계와 같음 · 11",
    short: "같음 11",
    summary: "기준 구현의 결과를 고정",
    candidate: LIMIT,
    slot: "10 또는 11",
    note: "경계값과 딱 같은 후보가 들어가는지 빠지는지는 이 글이 정하지 않습니다. 기준 구현의 결과를 receipt에 남기고 후보 구현이 같은 결과를 내는지 대조합니다. 어느 쪽이든 자리는 하나입니다.",
  },
  {
    label: "경계 위 · 12",
    short: "위 12",
    summary: "교체 · 기존 10 제거",
    candidate: 12,
    slot: "12",
    note: "12는 경계를 넘으므로 기존 거래를 밀어내고 자리를 차지합니다. 아래·같음·위를 아무리 반복해도 같은 sender·nonce 자리에는 하나만 남아야 하고, 메모리도 한도 안에 있어야 합니다.",
  },
] as const;

function Line({ active }: { active: number }) {
  const scene = SCENES[active];
  const cand = scene.candidate;
  const candColor = cand === null ? "#64748b" : cand < LIMIT ? "#dc2626" : cand > LIMIT ? "#16a34a" : "#d97706";
  return (
    <svg viewBox="0 0 360 120" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
      <rect x={X0} y={40} width={fx(LIMIT) - X0} height={26} fill="#dc2626" fillOpacity={0.08} />
      <rect x={fx(LIMIT)} y={40} width={X1 - fx(LIMIT)} height={26} fill="#16a34a" fillOpacity={0.08} />
      <text x={(X0 + fx(LIMIT)) / 2} y={57} textAnchor="middle" fontSize={10} fill="#dc2626">교체 거절</text>
      <text x={(fx(LIMIT) + X1) / 2} y={57} textAnchor="middle" fontSize={10} fill="#16a34a">교체</text>
      <line x1={X0} x2={X1} y1={66} y2={66} stroke="#94a3b8" strokeWidth={1} />
      {TICKS.map((tick) => (
        <g key={tick}>
          <line x1={fx(tick)} x2={fx(tick)} y1={66} y2={71} stroke="#94a3b8" strokeWidth={1} />
          <text x={fx(tick)} y={84} textAnchor="middle" fontSize={10} fill="#64748b">{tick}</text>
        </g>
      ))}
      <line x1={fx(LIMIT)} x2={fx(LIMIT)} y1={30} y2={66} stroke="#d97706" strokeWidth={1.25} strokeDasharray="4 3" />
      <text x={fx(LIMIT)} y={24} textAnchor="middle" fontSize={10} fontWeight={700} fill="#d97706">경계 {LIMIT}</text>
      <circle cx={fx(OLD_FEE)} cy={66} r={5} fill="#64748b" />
      <text x={fx(OLD_FEE)} y={102} textAnchor="middle" fontSize={10} fill="#64748b">기존</text>
      {cand !== null ? (
        <>
          <circle cx={fx(cand)} cy={66} r={6} fill="none" stroke={candColor} strokeWidth={1.25} />
          <text x={fx(cand)} y={116} textAnchor="middle" fontSize={10} fontWeight={700} fill={candColor}>새 후보 {cand}</text>
        </>
      ) : null}
      <text x={X1} y={102} textAnchor="end" fontSize={9} fill="#94a3b8">수수료(가정 단위)</text>
    </svg>
  );
}

export default function ReplacementBumpViz() {
  return (
    <SceneShell
      eyebrow="실험 03 · 교체 경계"
      title="같은 nonce 후보는 bump 경계를 넘을 때만 자리를 바꿉니다"
      description="가로축은 수수료입니다. 기존 수수료 10과 bump 10%는 그림을 위한 가정이며, 실제 비율은 실험에서 고정한 PriceBumpConfig를 따릅니다."
      ariaLabel="기존 수수료 10과 교체 경계 11을 기준으로 새 후보 10.5, 11, 12의 교체 여부"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <Line active={active} />
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-md border border-border bg-background px-3 py-2 text-xs sm:text-sm">
            <span className="text-muted-foreground">Alice · nonce 7 자리</span>
            <span className="font-mono font-bold">수수료 {SCENES[active].slot}</span>
            <span className="text-muted-foreground">남은 거래 1건</span>
          </div>
        </div>
      )}
    />
  );
}
