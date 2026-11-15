import SceneShell from "./SceneShell";

/**
 * 본문 대응: #vault-accounting — notifyRewardAmount는 바로 송금하지 않고 시간에 따라 적립합니다.
 * 글의 설명용 가정: Vault A 기여분 0.6525 WBERA, Alice 100 / 전체 1,000, 분배 기간 내내 일정.
 * rewardPerToken 증가 = 0.6525 × 경과비율 / 1,000, Alice earned = 100 × 그 증가분.
 * 절반: 0.32625 흘려보냄 → 0.00032625/개 → 0.032625. 끝: 0.0006525/개 → 0.06525.
 * 분배 기간의 실제 길이는 글에 없으므로 가로축은 비율로만 표시합니다.
 */
const VAULT_REWARD = 0.6525;
const TOTAL_SUPPLY = 1000;
const ALICE = 100;
const ALICE_TOTAL = (VAULT_REWARD * ALICE) / TOTAL_SUPPLY;
const CLAIM_T = 1.1;
const MAX_T = 1.2;

const SCENES = [
  {
    label: "Vault A가 notify를 받은 직후",
    summary: "Alice earned 0",
    t: 0,
    claimed: false,
    note: "H43에서 0.6525 WBERA가 Vault A에 notify됐지만 Alice 몫은 아직 0입니다. Vault는 이 양을 분배 기간에 나눠 흘려보낼 속도(rewardRate)만 다시 정합니다. 실제 chain에서는 남은 양과 새 notify가 합쳐지지만 여기서는 이 한 건만 떼어 봅니다.",
  },
  {
    label: "분배 기간 절반 경과",
    summary: "0.032625 WBERA 적립",
    t: 0.5,
    claimed: false,
    note: "0.6525의 절반인 0.32625가 흘러나왔습니다. receipt token 1개당 누적 보상(rewardPerToken)은 0.32625 ÷ 1,000 = 0.00032625 늘었고, Alice의 earned는 이 차이에 지분 100을 곱한 0.032625입니다. 지갑에는 아직 들어오지 않았습니다.",
  },
  {
    label: "분배 기간 끝",
    summary: "0.06525 WBERA 적립",
    t: 1,
    claimed: false,
    note: "0.6525가 모두 흘러나와 rewardPerToken 증가분은 0.0006525, Alice earned는 100 × 0.0006525 = 0.06525입니다. 나머지 900개 지분 몫은 0.58725입니다. 이것도 적립된 청구 가능량이지 아직 송금은 아닙니다.",
  },
  {
    label: "Alice가 claim",
    summary: "earned 0 · 지갑 +0.06525",
    t: CLAIM_T,
    claimed: true,
    note: "claim transfer가 일어나야 earned가 0으로 돌아가고 Alice의 WBERA balance가 0.06525 늘어납니다. notify, 적립, claim은 서로 다른 시점의 상태입니다. Solidity 반올림은 글과 같이 생략했습니다.",
  },
] as const;

type Scene = (typeof SCENES)[number];

const W = 360;
const H = 176;
const LEFT = 52;
const RIGHT = W - 16;
const TOP = 22;
const BASE = 128;
const x = (t: number) => LEFT + (t / MAX_T) * (RIGHT - LEFT);
const y = (value: number) => BASE - (value / ALICE_TOTAL) * (BASE - TOP);

const fmt = (value: number) => (value === 0 ? "0" : value.toFixed(8).replace(/0+$/, ""));

function earnedAt(t: number, claimed: boolean) {
  if (claimed && t >= CLAIM_T) return 0;
  return ALICE_TOTAL * Math.min(t, 1);
}

function Stat({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="min-w-0 rounded-lg border border-border bg-background px-2 py-2 sm:px-3">
      <p className="break-keep text-[10px] leading-4 text-muted-foreground sm:text-xs">{label}</p>
      <p className={`mt-1 font-mono text-xs sm:text-sm ${strong ? "font-bold text-primary" : "font-semibold"}`}>{value}</p>
    </div>
  );
}

function Chart({ scene }: { scene: Scene }) {
  const t = scene.t;
  const reached = Math.min(t, 1);
  const solid = [
    `M ${x(0)} ${y(0)}`,
    `L ${x(reached)} ${y(ALICE_TOTAL * reached)}`,
    ...(t > 1 ? [`L ${x(CLAIM_T)} ${y(ALICE_TOTAL)}`] : []),
    ...(scene.claimed ? [`L ${x(CLAIM_T)} ${y(0)}`] : []),
  ].join(" ");
  const dot = earnedAt(t, scene.claimed);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[460px]" role="img" aria-label={`${scene.label}: Alice earned ${fmt(dot)} WBERA`}>
      <line x1={LEFT} x2={RIGHT} y1={BASE} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
      <line x1={LEFT} x2={LEFT} y1={TOP - 6} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
      <line x1={LEFT} x2={RIGHT} y1={y(ALICE_TOTAL)} y2={y(ALICE_TOTAL)} stroke="#cbd5e1" strokeWidth={1} strokeDasharray="3 3" />
      <text x={LEFT - 6} y={y(ALICE_TOTAL) + 4} textAnchor="end" fontSize={11} fill="#64748b">0.06525</text>
      <text x={LEFT - 6} y={BASE + 4} textAnchor="end" fontSize={11} fill="#64748b">0</text>
      <line x1={x(1)} x2={x(1)} y1={TOP - 6} y2={BASE} stroke="#cbd5e1" strokeWidth={1} strokeDasharray="2 3" />
      <path d={`M ${x(0)} ${y(0)} L ${x(1)} ${y(ALICE_TOTAL)} L ${x(MAX_T)} ${y(ALICE_TOTAL)}`} fill="none" stroke="#cbd5e1" strokeWidth={1} strokeDasharray="4 3" />
      <path d={solid} fill="none" stroke="#2563eb" strokeWidth={1.25} />
      <line x1={x(t)} x2={x(t)} y1={TOP - 6} y2={BASE} stroke="#d97706" strokeWidth={1} />
      <circle cx={x(t)} cy={y(dot)} r={4} fill="#2563eb" />
      <text x={x(0)} y={BASE + 16} textAnchor="start" fontSize={11} fill="#64748b">notify</text>
      <text x={x(0.5)} y={BASE + 16} textAnchor="middle" fontSize={11} fill="#64748b">절반</text>
      <text x={x(1)} y={BASE + 16} textAnchor="middle" fontSize={11} fill="#64748b">기간 끝</text>
      <text x={x(CLAIM_T)} y={BASE + 30} textAnchor="middle" fontSize={11} fill="#64748b">claim</text>
      <text x={LEFT + 4} y={TOP - 10} fontSize={11} fill="#2563eb" fontWeight={700}>Alice earned (WBERA)</text>
      <text x={RIGHT} y={BASE + 46} textAnchor="end" fontSize={11} fill="#64748b">분배 기간 경과 (길이는 글에 없음)</text>
    </svg>
  );
}

export default function VaultAccrualViz() {
  return (
    <SceneShell
      eyebrow="Reward Vault의 시간 분배"
      title="notify된 0.6525 WBERA는 기간에 걸쳐 Alice 몫으로 쌓입니다"
      description="글의 설명용 가정(가정)을 그대로 씁니다: Vault A 기여분 0.6525 WBERA, Alice 100 / 전체 1,000 receipt token이 분배 기간 내내 일정, 다른 notify·stake 변화 없음. 가로축은 기간의 비율이며 실제 기간 길이는 글에 없습니다."
      ariaLabel="Vault A notify 이후 Alice의 earned가 분배 기간에 따라 0에서 0.06525 WBERA까지 늘고 claim 때 지갑으로 옮겨지는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const streamed = VAULT_REWARD * Math.min(scene.t, 1);
        const perToken = streamed / TOTAL_SUPPLY;
        const earned = earnedAt(scene.t, scene.claimed);
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <Stat label="Vault A에 남은 미분배 양" value={fmt(VAULT_REWARD - streamed)} />
              <Stat label="1개당 누적 보상(rewardPerToken) 증가분" value={fmt(perToken)} />
              <Stat label="Alice earned (미청구 적립)" value={fmt(earned)} strong />
              <Stat label="Alice 지갑 WBERA 증가" value={scene.claimed ? fmt(ALICE_TOTAL) : "0"} />
            </div>
            <div className="mt-3">
              <Chart scene={scene} />
            </div>
          </div>
        );
      }}
    />
  );
}
