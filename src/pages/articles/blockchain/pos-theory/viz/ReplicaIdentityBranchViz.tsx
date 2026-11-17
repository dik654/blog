import SceneShell from "./SceneShell";

/**
 * 본문 대응: #porep — 같은 raw data 한 벌로 replica 여러 개의 보상을 받는 공격을 줄이려면
 * claimed replica마다 committed representation이 달라야 한다. R_i = E(D, i), C_D = C(D), C_{R_i} = C(R_i).
 * 장면 1은 identity가 encoding에 들어가지 않는 반례(가정), 장면 2·3은 본문 식 그대로.
 */
const SCENES = [
  {
    label: "identity가 없다면 (가정)",
    summary: "두 주장 → 같은 표현 하나",
    note: "Encoding이 data D만 입력으로 받는다고 가정해 봅니다. 두 replica를 주장해도 committed representation이 같으므로 저장된 한 벌이 두 주장 모두에 답할 수 있습니다. 본문이 말하는, raw data 한 벌로 replica 여러 개의 보상을 받는 공격입니다.",
  },
  {
    label: "identity를 encoding에 넣기",
    summary: "R₁ = E(D, 1) · R₂ = E(D, 2)",
    note: "Filecoin sealing은 sector data와 provider·sector·protocol randomness에서 replica identity를 만들고, 그 identity로 encoding합니다. 같은 D라도 identity가 다르면 encoded replica R₁과 R₂가 갈라집니다.",
  },
  {
    label: "commitment 비교",
    summary: "C(D) 공유 · C(R₁) ≠ C(R₂)",
    note: "원본 commitment C(D)는 같은 D면 모든 replica가 공유합니다. Replica commitment는 identity마다 달라야 첫 장면의 공격, 즉 한 벌을 여러 replica로 우기는 dedup 공격을 막습니다. Verifier는 proof가 C(D)·C(R)·public inputs를 같은 instance로 묶는지 확인하며, 물리 disk 위치를 직접 보지는 않습니다.",
  },
] as const;

const W = 360;
const H = 210;

function Box({ x, y, w, h, title, sub, tone = "base" }: { x: number; y: number; w: number; h: number; title: string; sub?: string; tone?: "base" | "accent" | "warn" | "muted" }) {
  const stroke = tone === "accent" ? "#2563eb" : tone === "warn" ? "#dc2626" : tone === "muted" ? "#cbd5e1" : "#64748b";
  const fill = tone === "muted" ? "#f8fafc" : "#ffffff";
  const color = tone === "accent" ? "#1d4ed8" : tone === "warn" ? "#b91c1c" : tone === "muted" ? "#94a3b8" : "#0f172a";
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={6} fill={fill} stroke={stroke} strokeWidth={1} />
      <text x={x + w / 2} y={sub ? y + h / 2 - 2 : y + h / 2 + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill={color}>{title}</text>
      {sub && <text x={x + w / 2} y={y + h / 2 + 12} textAnchor="middle" fontSize={9} fill="#64748b">{sub}</text>}
    </g>
  );
}

function Arrow({ x1, y1, x2, y2, color = "#94a3b8" }: { x1: number; y1: number; x2: number; y2: number; color?: string }) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const ax = x2 - 6 * Math.cos(angle - 0.4);
  const ay = y2 - 6 * Math.sin(angle - 0.4);
  const bx = x2 - 6 * Math.cos(angle + 0.4);
  const by = y2 - 6 * Math.sin(angle + 0.4);
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} />
      <path d={`M ${x2} ${y2} L ${ax} ${ay} L ${bx} ${by} Z`} fill={color} />
    </g>
  );
}

export default function ReplicaIdentityBranchViz() {
  return (
    <SceneShell
      eyebrow="PoRep · 같은 data D, 두 replica"
      title="replica identity가 encoding에 들어가야 두 복제본의 commitment가 갈라집니다"
      description="Commitment는 data를 짧은 값 하나로 고정해 나중에 바꿔치기할 수 없게 하는 값입니다. 첫 장면은 identity를 빼면 어떻게 되는지 보이는 반례(가정)입니다."
      ariaLabel="replica identity 유무에 따라 같은 data의 두 replica commitment가 같거나 달라지는 과정"
      scenes={SCENES}
      render={(active) => {
        const top = 34;
        const bottom = 134;
        const rowH = 42;
        if (active === 0) {
          return (
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[0].label}: ${SCENES[0].summary}`}>
              <Box x={8} y={84} w={70} h={rowH} title="data D" sub="raw 한 벌" />
              <Arrow x1={78} y1={105} x2={128} y2={105} />
              <Box x={130} y={84} w={84} h={rowH} title="E(D)" sub="identity 없음" tone="warn" />
              <Arrow x1={214} y1={105} x2={248} y2={105} />
              <Box x={250} y={84} w={100} h={rowH} title="C(R)" sub="값 하나" tone="warn" />
              <Box x={250} y={top - 22} w={100} h={30} title="replica 주장 1" tone="muted" />
              <Box x={250} y={bottom + 34} w={100} h={30} title="replica 주장 2" tone="muted" />
              <Arrow x1={300} y1={top + 8} x2={300} y2={82} color="#dc2626" />
              <Arrow x1={300} y1={bottom + 34} x2={300} y2={128} color="#dc2626" />
              <text x={130} y={top - 2} fontSize={10} fontWeight={700} fill="#b91c1c">두 주장이 같은 표현을 가리킴</text>
              <text x={130} y={bottom + 54} fontSize={10} fill="#64748b">저장은 한 벌</text>
            </svg>
          );
        }
        const showCommD = active === 2;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <Box x={8} y={84} w={70} h={rowH} title="data D" sub="같은 bytes" />
            <Arrow x1={78} y1={100} x2={128} y2={top + 21} />
            <Arrow x1={78} y1={110} x2={128} y2={bottom + 21} />
            <text x={92} y={70} textAnchor="middle" fontSize={9} fontWeight={700} fill="#2563eb">id 1</text>
            <text x={92} y={150} textAnchor="middle" fontSize={9} fontWeight={700} fill="#2563eb">id 2</text>
            <Box x={130} y={top} w={84} h={rowH} title="R₁ = E(D, 1)" tone="accent" />
            <Box x={130} y={bottom} w={84} h={rowH} title="R₂ = E(D, 2)" tone="accent" />
            <Arrow x1={214} y1={top + 21} x2={248} y2={top + 21} color={showCommD ? "#2563eb" : "#cbd5e1"} />
            <Arrow x1={214} y1={bottom + 21} x2={248} y2={bottom + 21} color={showCommD ? "#2563eb" : "#cbd5e1"} />
            <Box x={250} y={top} w={100} h={rowH} title="C(R₁)" sub={showCommD ? "replica 1 전용" : "다음 장면"} tone={showCommD ? "accent" : "muted"} />
            <Box x={250} y={bottom} w={100} h={rowH} title="C(R₂)" sub={showCommD ? "replica 2 전용" : "다음 장면"} tone={showCommD ? "accent" : "muted"} />
            {showCommD && (
              <>
                <text x={300} y={(top + rowH + bottom) / 2 + 5} textAnchor="middle" fontSize={14} fontWeight={700} fill="#2563eb">≠</text>
                <Box x={8} y={168} w={70} h={34} title="C(D)" sub="공유" />
                <Arrow x1={43} y1={126} x2={43} y2={166} />
              </>
            )}
            {!showCommD && <text x={8} y={196} fontSize={10} fill="#64748b">identity = provider·sector·ticket 등</text>}
          </svg>
        );
      }}
    />
  );
}
