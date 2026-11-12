import SceneShell from "./SceneShell";

/**
 * 본문 대응: #on-vs-off-policy — 같은 환경 상호작용을 몇 번까지 다시 쓰는가.
 * On-policy: θ_k가 trajectory 2,048개를 뽑아 몇 epoch update한 뒤 버리고, θ_(k+1)이 다시 뽑는다.
 * Off-policy: replay buffer(최대 100만 개)에 과거 policy들의 trajectory가 쌓이고,
 * 새 상호작용 없이 minibatch를 계속 뽑는다. 데이터를 만든 policy와 현재 policy가 멀수록 왜곡.
 * GRPO: 같은 prompt에서 현재 policy로 completion 여러 개를 매 update마다 새로 뽑는다(on-policy 쪽).
 * epoch 수·completion 수·칸 개수는 본문에 없어 그림의 칸은 개수를 뜻하지 않는다(가정).
 */
const SCENES = [
  {
    label: "On-policy ① 현재 policy가 직접 뽑기",
    summary: "θk → trajectory 2,048개",
    note: "On-policy는 update에 쓰는 trajectory를 지금 update하려는 policy θk 자신이 만들어야 합니다. θk로 환경과 상호작용해 trajectory 2,048개를 뽑습니다(rollout).",
  },
  {
    label: "On-policy ② 몇 epoch 쓰고 버리기",
    summary: "update 뒤 batch 폐기",
    note: "그 batch로 update를 몇 epoch 반복하면 policy는 이미 θk+1로 바뀌었습니다. batch는 θk가 만든 데이터라 버리고, 다음 update는 θk+1로 새로 뽑아야 합니다. 상호작용 한 번당 얻는 gradient step이 적어 표본 효율이 낮습니다.",
  },
  {
    label: "Off-policy ① replay buffer에 쌓기",
    summary: "과거 trajectory 최대 100만 개",
    note: "Off-policy는 과거의 자신이나 별도 behavior policy가 만든 trajectory도 씁니다. 여러 시점의 policy가 만든 데이터가 replay buffer에 최대 100만 개까지 쌓입니다.",
  },
  {
    label: "Off-policy ② 같은 데이터를 반복해서 뽑기",
    summary: "transition 하나를 수백~수천 번까지",
    note: "새 상호작용 없이 buffer에서 minibatch를 계속 뽑아 update합니다. 같은 transition 하나가 수백~수천 번 재사용될 수 있어 환경 상호작용당 update 수가 늘어납니다.",
  },
  {
    label: "Off-policy ③ 오래된 데이터의 대가",
    summary: "만든 policy ≠ 지금 policy",
    note: "buffer에는 지금 θk가 만든 데이터 옆에 θ1, θ2 같은 이전 policy가 만든 데이터도 남아 있습니다. 그 policy와 지금 policy의 차이가 커질수록 update 방향이 왜곡됩니다.",
  },
  {
    label: "GRPO의 group sampling",
    summary: "매 update마다 새로 뽑음 → on-policy 쪽",
    note: "GRPO는 같은 prompt에서 현재 policy로 completion 여러 개를 한 번에 뽑아 그 그룹 안에서 상대 advantage(그룹 평균보다 얼마나 나은지)를 계산합니다. 이 completion들은 매 update마다 현재 policy로 새로 뽑히므로 on-policy 쪽 사례입니다.",
  },
] as const;

const W = 360;
const TOP = 22;
const H = 176;
const INK = "#334155";
const MUTED = "#94a3b8";
const ACCENT = "#2563eb";
const OLD = "#d97706";
const BAD = "#b91c1c";

function Box({ x, y, w, h, title, sub, stroke = INK, dashed = false }: { x: number; y: number; w: number; h: number; title: string; sub?: string; stroke?: string; dashed?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8} fill="none" stroke={stroke} strokeWidth={1} strokeDasharray={dashed ? "4 3" : undefined} />
      <text x={x + w / 2} y={y + (sub ? h / 2 - 3 : h / 2 + 4)} textAnchor="middle" fontSize={12} fontWeight={700} fill={stroke}>
        {title}
      </text>
      {sub && (
        <text x={x + w / 2} y={y + h / 2 + 13} textAnchor="middle" fontSize={10} fill="#64748b">
          {sub}
        </text>
      )}
    </g>
  );
}

function Arrow({ x1, y1, x2, y2, label, color = INK, labelY }: { x1: number; y1: number; x2: number; y2: number; label?: string; color?: string; labelY?: number }) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const head = 6;
  const p1 = `${x2 - head * Math.cos(angle - 0.45)},${y2 - head * Math.sin(angle - 0.45)}`;
  const p2 = `${x2 - head * Math.cos(angle + 0.45)},${y2 - head * Math.sin(angle + 0.45)}`;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} />
      <polygon points={`${x2},${y2} ${p1} ${p2}`} fill={color} />
      {label && (
        <text x={(x1 + x2) / 2} y={labelY ?? (y1 + y2) / 2 - 6} textAnchor="middle" fontSize={10} fill={color}>
          {label}
        </text>
      )}
    </g>
  );
}

/** 칸 하나 = trajectory 묶음 하나. 개수는 실제 비율이 아닙니다. */
function Chips({ x, y, cols, rows, colorAt, crossed = false }: { x: number; y: number; cols: number; rows: number; colorAt: (col: number, row: number) => string; crossed?: boolean }) {
  const size = 12;
  const gap = 4;
  const cells = Array.from({ length: cols * rows }, (_, i) => ({ col: i % cols, row: Math.floor(i / cols) }));
  const right = x + cols * (size + gap) - gap;
  const bottom = y + rows * (size + gap) - gap;
  return (
    <g>
      {cells.map(({ col, row }) => (
        <rect key={`${col}-${row}`} x={x + col * (size + gap)} y={y + row * (size + gap)} width={size} height={size} rx={2} fill={colorAt(col, row)} opacity={crossed ? 0.35 : 0.85} />
      ))}
      {crossed && (
        <>
          <line x1={x - 3} y1={y - 3} x2={right + 3} y2={bottom + 3} stroke={BAD} strokeWidth={1.25} />
          <line x1={right + 3} y1={y - 3} x2={x - 3} y2={bottom + 3} stroke={BAD} strokeWidth={1.25} />
        </>
      )}
    </g>
  );
}

function OnPolicy({ step }: { step: 0 | 1 }) {
  return (
    <g>
      <Box x={14} y={66} w={86} h={52} title={step === 0 ? "policy θk" : "policy θk+1"} sub={step === 0 ? "지금 update할 것" : "update 직후"} stroke={ACCENT} />
      <Box x={200} y={46} w={146} h={92} title="" stroke={step === 1 ? MUTED : INK} dashed={step === 1} />
      <text x={273} y={64} textAnchor="middle" fontSize={11} fontWeight={700} fill={step === 1 ? MUTED : INK}>
        batch · trajectory 2,048개
      </text>
      <Chips x={225} y={76} cols={6} rows={3} colorAt={() => ACCENT} crossed={step === 1} />
      <text x={273} y={130} textAnchor="middle" fontSize={10} fill="#64748b">
        θk가 만든 데이터
      </text>
      {step === 0 ? (
        <Arrow x1={100} y1={92} x2={196} y2={92} label="rollout" color={ACCENT} />
      ) : (
        <>
          <Arrow x1={196} y1={110} x2={104} y2={110} label="update × 몇 epoch" labelY={128} />
          <text x={273} y={160} textAnchor="middle" fontSize={11} fontWeight={700} fill={BAD}>
            폐기 → θk+1로 새로 rollout
          </text>
        </>
      )}
      <text x={14} y={186} fontSize={10} fill="#64748b">
        칸 개수는 그림을 위한 가정입니다. epoch 수는 본문에 없습니다.
      </text>
    </g>
  );
}

function OffPolicy({ step }: { step: 0 | 1 | 2 }) {
  // 열 = 데이터를 만든 policy 시점. 왼쪽일수록 오래된 policy.
  const ages = ["θ1", "θ2", "…", "θk"];
  const colorAt = (col: number) => {
    const age = Math.floor(col / 2);
    if (step === 2) return age === 3 ? ACCENT : OLD;
    return age === 3 ? ACCENT : "#64748b";
  };
  const picked = step >= 1;
  return (
    <g>
      <Box x={14} y={66} w={86} h={52} title="policy θk" sub="지금 policy" stroke={ACCENT} />
      <rect x={150} y={40} width={196} height={110} rx={8} fill="none" stroke={INK} strokeWidth={1} />
      <text x={248} y={57} textAnchor="middle" fontSize={11} fontWeight={700} fill={INK}>
        replay buffer · 최대 100만 개
      </text>
      <Chips x={184} y={68} cols={8} rows={3} colorAt={(col) => colorAt(col)} />
      {ages.map((age, i) => (
        <text key={age} x={184 + i * 32 + 14} y={132} textAnchor="middle" fontSize={10} fill={step === 2 && i < 3 ? OLD : "#64748b"}>
          {age}
        </text>
      ))}
      <text x={248} y={145} textAnchor="middle" fontSize={9} fill="#64748b">
        ← 오래된 policy가 만든 것 · 최근 →
      </text>
      {picked && <rect x={180} y={64} width={36} height={52} rx={4} fill="none" stroke={step === 2 ? OLD : ACCENT} strokeWidth={1.25} />}
      {picked ? (
        <Arrow x1={176} y1={92} x2={104} y2={92} labelY={108} label="minibatch" color={step === 2 ? OLD : ACCENT} />
      ) : (
        <Arrow x1={100} y1={92} x2={146} y2={92} color={MUTED} />
      )}
      <text x={14} y={176} fontSize={11} fontWeight={700} fill={step === 2 ? BAD : INK}>
        {step === 0 && "새 trajectory는 버리지 않고 buffer에 쌓임"}
        {step === 1 && "새 상호작용 없이 같은 칸을 다시 뽑아 update"}
        {step === 2 && "θ1이 만든 데이터 ↔ 지금 θk: 차이가 클수록 왜곡"}
      </text>
      <text x={14} y={192} fontSize={10} fill="#64748b">
        칸 개수와 θ 표시는 그림을 위한 가정입니다.
      </text>
    </g>
  );
}

function Grpo() {
  const ys = [44, 74, 104, 134];
  return (
    <g>
      <Box x={14} y={66} w={70} h={52} title="prompt" sub="같은 질문" />
      <Box x={104} y={66} w={70} h={52} title="θk" sub="현재 policy" stroke={ACCENT} />
      <Arrow x1={84} y1={92} x2={100} y2={92} />
      {ys.map((y, i) => (
        <g key={y}>
          <Arrow x1={174} y1={92} x2={198} y2={y + 10} color={ACCENT} />
          <rect x={200} y={y} width={74} height={20} rx={4} fill="none" stroke={ACCENT} strokeWidth={1} />
          <text x={237} y={y + 14} textAnchor="middle" fontSize={10} fill={ACCENT}>
            {`completion ${i + 1}`}
          </text>
        </g>
      ))}
      <Box x={284} y={60} w={66} h={64} title="그룹 평균" sub="과 비교" />
      <Arrow x1={274} y1={92} x2={282} y2={92} />
      <text x={316} y={140} textAnchor="middle" fontSize={10} fill="#64748b">
        상대 advantage
      </text>
      <text x={14} y={176} fontSize={11} fontWeight={700} fill={ACCENT}>
        update 뒤에는 θk+1로 다시 뽑음
      </text>
      <text x={14} y={192} fontSize={10} fill="#64748b">
        completion 4개는 그림을 위한 가정입니다(본문: 여러 개).
      </text>
    </g>
  );
}

export default function OnOffPolicyDataViz() {
  return (
    <SceneShell
      eyebrow="데이터를 몇 번 다시 쓰나"
      title="On-policy는 뽑아 쓰고 버리고, Off-policy는 쌓아 두고 다시 씁니다"
      description="왼쪽 상자가 policy, 오른쪽이 update에 쓰는 데이터입니다. θ 뒤의 숫자는 몇 번째 update의 policy인지를 뜻합니다."
      ariaLabel="On-policy와 off-policy의 데이터 사용과 GRPO group sampling"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 ${TOP} ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {active === 0 && <OnPolicy step={0} />}
          {active === 1 && <OnPolicy step={1} />}
          {active === 2 && <OffPolicy step={0} />}
          {active === 3 && <OffPolicy step={1} />}
          {active === 4 && <OffPolicy step={2} />}
          {active === 5 && <Grpo />}
        </svg>
      )}
    />
  );
}
