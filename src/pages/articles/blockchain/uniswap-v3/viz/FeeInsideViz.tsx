import SceneShell from "./SceneShell";

/**
 * 본문 대응: #position-nft — 수수료 0.12가 두 step에서 생기고, 유동성 1당 누적값에서 range 밖 몫을 빼서 나눈다.
 * step1: 총입력 30/0.997 ≈ 30.0903, 수수료 ≈ 0.0903, 활성 L 60 → 유동성 1당 ≈ 0.001505
 * step2: 총입력 ≈ 9.9097, 수수료 ≈ 0.0297, 활성 L 100 → 유동성 1당 ≈ 0.000297
 * Alice(√P 1~3): 두 step 모두 안 → 0.001802 × 60 ≈ 0.1081
 * Bob(√P 2.5~3.5): step1은 lower 아래 → 0.000297 × 40 ≈ 0.0119
 */
const FEE1 = (30 / 0.997) * 0.003;
const FEE2 = (40 - 30 / 0.997) * 0.003;
const G1 = FEE1 / 60;
const G2 = FEE2 / 100;
const ALICE = (G1 + G2) * 60;
const BOB = G2 * 40;

const fmt = (value: number, digits: number) => value.toFixed(digits);

const W = 360;
const H = 244;
const AX_L = 30;
const AX_R = 340;
const S_MIN = 1;
const S_MAX = 3.5;
const sx = (s: number) => AX_L + ((s - S_MIN) / (S_MAX - S_MIN)) * (AX_R - AX_L);

const BAR_L = 30;
const BAR_W = 250;
const gx = (g: number) => BAR_L + (g / (G1 + G2)) * BAR_W;

const STEP1 = "#2563eb";
const STEP2 = "#d97706";
const OUT = "#94a3b8";

const SCENES = [
  {
    label: "수수료는 step마다 생깁니다",
    summary: `${fmt(FEE1, 4)} + ${fmt(FEE2, 4)} = 0.1200`,
    note: "첫 step(√P 2→2.5)에서는 활성 유동성 60일 때 약 0.0903, 경계를 넘은 둘째 step(2.5→2.5988)에서는 활성 유동성 100일 때 약 0.0297이 생깁니다.",
  },
  {
    label: "유동성 1당으로 global에 쌓습니다",
    summary: `f_global 증가 ≈ ${fmt(G1 + G2, 6)}`,
    note: `Pool은 수수료를 그때의 활성 유동성으로 나눠 f_global에 더합니다. 첫 step은 0.0903/60 ≈ ${fmt(G1, 6)}, 둘째 step은 0.0297/100 ≈ ${fmt(G2, 6)}입니다. 같은 수수료라도 유동성이 많을 때 생기면 1당 몫이 작습니다.`,
  },
  {
    label: "Alice: 빼낼 바깥 몫이 없습니다",
    summary: `${fmt(G1 + G2, 6)} × 60 ≈ ${fmt(ALICE, 4)}`,
    note: "범위 아래·위에서 생긴 몫을 f_below·f_above, 범위 안 몫을 f_inside라 합니다. Alice 범위 1~3은 두 step을 모두 덮으므로 f_below와 f_above가 0이고 f_inside가 f_global 증가분 전체입니다. 여기에 L 60을 곱하면 본문의 약 0.1081입니다.",
  },
  {
    label: "Bob: 첫 step은 lower 아래 몫입니다",
    summary: `${fmt(G2, 6)} × 40 ≈ ${fmt(BOB, 4)}`,
    note: `Bob 범위는 2.5에서 시작하므로 첫 step의 ${fmt(G1, 6)}은 그의 lower 경계 아래(f_below)에서 생긴 몫입니다. 이를 빼면 f_inside는 둘째 step의 ${fmt(G2, 6)}뿐이고, L 40을 곱하면 약 0.0119입니다. 두 몫을 더하면 0.12입니다.`,
  },
] as const;

function GrowthRow({
  y,
  label,
  insideFirst,
  dim,
  result,
}: {
  y: number;
  label: string;
  insideFirst: boolean;
  dim: boolean;
  result: string;
}) {
  return (
    <g opacity={dim ? 0.25 : 1}>
      <text x={BAR_L} y={y - 5} fontSize={12} fontWeight={700} fill="#64748b">{label}</text>
      <rect x={gx(0)} y={y} width={gx(G1) - gx(0)} height={16} fill={insideFirst ? STEP1 : "none"} stroke={insideFirst ? STEP1 : OUT} strokeDasharray={insideFirst ? undefined : "3 2"} opacity={insideFirst ? 0.85 : 1} />
      {!insideFirst && (
        <text x={(gx(0) + gx(G1)) / 2} y={y + 12} textAnchor="middle" fontSize={11} fill="#64748b">f_below · 빼냄</text>
      )}
      <rect x={gx(G1)} y={y} width={gx(G1 + G2) - gx(G1)} height={16} fill={STEP2} opacity={0.85} />
      <text x={BAR_L + BAR_W + 6} y={y + 12.5} fontSize={12} fontWeight={700} fill="#2563eb">{result}</text>
    </g>
  );
}

export default function FeeInsideViz() {
  return (
    <SceneShell
      eyebrow="수수료 0.12 나누기 · 설명용 연속값"
      title="같은 누적값에서 range 밖 몫을 빼면 position별 수수료가 남습니다"
      description="위는 √P 축 위의 두 step과 두 범위, 아래는 유동성 1당 누적값(f_global)입니다. 이 교환 직전 누적값과 f_last를 0으로 두고 증가분만 보며(가정), Q128 배율은 생략했습니다."
      ariaLabel="두 step의 수수료가 유동성 1당 누적값으로 쌓이고 Alice와 Bob의 range 안 몫으로 나뉘는 과정"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <line x1={AX_L} x2={AX_R} y1={34} y2={34} stroke="#94a3b8" strokeWidth={1} />
          {[1, 2, 2.5, 3, 3.5].map((t) => (
            <text key={t} x={sx(t)} y={50} textAnchor="middle" fontSize={11} fill="#64748b">{t}</text>
          ))}
          <rect x={sx(2)} y={26} width={sx(2.5) - sx(2)} height={8} fill={STEP1} />
          <rect x={sx(2.5)} y={26} width={sx(2.5988) - sx(2.5)} height={8} fill={STEP2} />
          <text x={sx(2.25)} y={22} textAnchor="middle" fontSize={11} fontWeight={700} fill={STEP1}>step1</text>
          <text x={sx(2.5988) + 3} y={22} fontSize={11} fontWeight={700} fill={STEP2}>step2</text>
          <g opacity={active === 3 ? 0.3 : 1}>
            <rect x={sx(1)} y={58} width={sx(3) - sx(1)} height={15} fill="none" stroke={STEP1} strokeWidth={1} />
            <text x={sx(1) + 4} y={69.5} fontSize={11} fontWeight={700} fill={STEP1}>Alice 1~3 · L 60</text>
          </g>
          <g opacity={active === 2 ? 0.3 : 1}>
            <rect x={sx(2.5)} y={78} width={sx(3.5) - sx(2.5)} height={15} fill="none" stroke="#64748b" strokeWidth={1} />
            <text x={sx(3.5) - 4} y={89.5} textAnchor="end" fontSize={11} fontWeight={700} fill="#64748b">Bob 2.5~3.5 · L 40</text>
          </g>
          <g opacity={active === 0 ? 0.25 : 1}>
            <text x={BAR_L} y={116} fontSize={12} fontWeight={700} fill="#64748b">f_global 증가 (유동성 1당)</text>
            <rect x={gx(0)} y={121} width={gx(G1) - gx(0)} height={16} fill={STEP1} opacity={0.85} />
            <rect x={gx(G1)} y={121} width={gx(G1 + G2) - gx(G1)} height={16} fill={STEP2} opacity={0.85} />
            <text x={(gx(0) + gx(G1)) / 2} y={133} textAnchor="middle" fontSize={11} fill="#ffffff">{fmt(G1, 6)}</text>
            <text x={BAR_L + BAR_W + 6} y={133.5} fontSize={11} fill="#475569">+{fmt(G2, 6)}</text>
          </g>
          <GrowthRow y={170} label="Alice f_inside × 60" insideFirst dim={active < 2 || active === 3} result={`≈ ${fmt(ALICE, 4)}`} />
          <GrowthRow y={220} label="Bob f_inside × 40" insideFirst={false} dim={active !== 3} result={`≈ ${fmt(BOB, 4)}`} />
        </svg>
      )}
    />
  );
}
