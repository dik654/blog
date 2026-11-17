import SceneShell from "./SceneShell";

/**
 * 본문 대응: #risk-refresh-edd 간접 지분 식 b = Π s_j, #identity-beneficial-owner의 확인 순서.
 * 한울무역 ← 법인 A 60%, A ← 김민지 50% → 0.60 × 0.50 = 0.30.
 * 25% 기준과 지분→실질 지배→대표 순서는 2026-11-02 현재 국내 안내와 적용 법령을 다시 확인하는 전제입니다.
 */
const SHARE_A = 0.6;
const SHARE_KIM = 0.5;
const INDIRECT = SHARE_A * SHARE_KIM;
const THRESHOLD = 0.25;

const SCENES = [
  {
    label: "등기 대표만 보면",
    summary: "한울무역 ↔ 대표자",
    note: "등기 대표만 확인하면 법인을 실제로 지배하는 사람을 놓칠 수 있습니다. 처음부터 ‘대표자=실제소유자’로 치환하지 않습니다.",
  },
  {
    label: "지분 사슬",
    summary: "김민지 → 법인 A → 한울무역",
    note: "법인 A가 한울무역 지분 60%를, 김민지가 법인 A 지분 50%를 보유합니다. 법인마다 source·기준일과 직접 지분을 따로 남깁니다.",
  },
  {
    label: "A의 몫",
    summary: "한울무역 지분의 60%",
    note: "막대 전체가 한울무역 지분 100%이고 법인 A가 직접 가진 몫이 60%입니다. 나머지 40%의 보유자는 글에 나오지 않습니다.",
  },
  {
    label: "김민지의 몫",
    summary: "0.60 × 0.50 = 0.30",
    note: "김민지는 A의 절반을 가졌으므로 A 몫 60%의 절반, 즉 한울무역 지분 30%에 간접으로 닿습니다. 한 경로의 단계별 지분을 곱한 값입니다.",
  },
  {
    label: "25% 기준과 비교",
    summary: "30% > 25% → 지분 기준 단계",
    note: "국내 순서는 지분 기준 자연인부터 찾습니다. 간접 30%는 25% 기준선을 넘으므로 이 단계에서 김민지를 확인합니다. 기준과 순서는 2026-11-02 현재 법령으로 다시 확인합니다.",
  },
  {
    label: "지분 기준 자연인이 없다면",
    summary: "실질 지배자 → 대표자 (가정)",
    note: "지분 기준 자연인이 없거나 불명확하면 실질 지배자를, 그래도 확인할 수 없으면 대표자를 확인하고, 어디서 멈췄는지 resolution path로 기록합니다.",
  },
] as const;

const BAR_X = 20;
const BAR_W = 320;
const BAR_Y = 96;
const BAR_H = 22;
const px = (ratio: number) => BAR_X + ratio * BAR_W;

function Node({ x, label, active, strong }: { x: number; label: string; active: boolean; strong?: boolean }) {
  return (
    <g opacity={active ? 1 : 0.3}>
      <rect x={x} y={20} width={92} height={30} rx={8} fill={strong ? "#2563eb" : "none"} stroke={strong ? "#2563eb" : "#64748b"} strokeWidth={1} strokeDasharray={active ? undefined : "4 3"} />
      <text x={x + 46} y={39} fontSize={12} textAnchor="middle" fontWeight={600} fill={strong ? "#ffffff" : "currentColor"}>{label}</text>
    </g>
  );
}

function Arrow({ x1, x2, label, active }: { x1: number; x2: number; label: string; active: boolean }) {
  return (
    <g opacity={active ? 1 : 0.25}>
      <line x1={x1} x2={x2 - 6} y1={35} y2={35} stroke="#64748b" strokeWidth={1} />
      <path d={`M${x2 - 7} 31 L${x2} 35 L${x2 - 7} 39`} fill="none" stroke="#64748b" strokeWidth={1} />
      <text x={(x1 + x2) / 2} y={28} fontSize={11} textAnchor="middle" fontWeight={700} fill="#d97706">{active ? label : "?"}</text>
    </g>
  );
}

const STEPS = ["① 지분 기준 자연인", "② 실질 지배자", "③ 대표자"] as const;

export default function OwnershipChainViz() {
  return (
    <SceneShell
      eyebrow="간접 지분 · 실제소유자 확인 순서"
      title="지분 사슬을 따라 단계별 지분을 곱하면 자연인의 간접 지분이 나옵니다"
      description="실제소유자(beneficial owner)는 법인을 최종적으로 소유·지배하는 자연인입니다. 막대 전체는 한울무역 지분 100%이고, 수치는 글의 한울무역 사례 그대로입니다."
      note="모든 지분은 같은 기준일의 비율이라는 전제입니다. nominee·voting agreement 같은 별도 지배 근거는 계산과 따로 검토합니다."
      ariaLabel="한울무역 지분 사슬에서 김민지의 간접 지분 30퍼센트를 계산하고 실제소유자 확인 순서와 비교"
      scenes={SCENES}
      render={(active) => {
        const chain = active >= 1;
        return (
          <svg viewBox="0 0 360 214" className="mx-auto h-auto w-full max-w-[480px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <g opacity={active === 5 ? 0.25 : 1}>
            <Node x={4} label="김민지" active={chain} strong={active >= 3 && active <= 4} />
            <Arrow x1={96} x2={134} label="50%" active={chain} />
            <Node x={134} label="법인 A" active={chain} />
            <Arrow x1={226} x2={264} label="60%" active={chain} />
            <Node x={264} label="한울무역" active />
            {active === 0 ? (
              <g>
                <line x1={310} x2={310} y1={50} y2={66} stroke="#64748b" strokeWidth={1} />
                <rect x={264} y={66} width={92} height={22} rx={6} fill="none" stroke="#64748b" strokeWidth={1} />
                <text x={310} y={81} fontSize={11} textAnchor="middle" fill="currentColor">등기 대표</text>
                <text x={20} y={80} fontSize={11} fill="#94a3b8">지분 사슬은 아직 안 봄</text>
              </g>
            ) : null}

            {active >= 2 ? (
              <g>
                <text x={BAR_X + BAR_W} y={BAR_Y - 6} fontSize={11} textAnchor="end" fill="#64748b">한울무역 지분 100%</text>
                <rect x={BAR_X} y={BAR_Y} width={BAR_W} height={BAR_H} rx={4} fill="none" stroke="#94a3b8" strokeWidth={1} />
                <rect x={BAR_X} y={BAR_Y} width={SHARE_A * BAR_W} height={BAR_H} rx={4} fill="#94a3b8" fillOpacity={0.35} stroke="#64748b" strokeWidth={1} />
                <text x={px(SHARE_A) - 4} y={BAR_Y + 15} fontSize={11} textAnchor="end" fill="currentColor">A 60%</text>
                <text x={(px(SHARE_A) + BAR_X + BAR_W) / 2} y={BAR_Y + 15} fontSize={11} textAnchor="middle" fill="#94a3b8">나머지 40%</text>
                {active >= 3 ? (
                  <>
                    <rect x={BAR_X} y={BAR_Y} width={INDIRECT * BAR_W} height={BAR_H} rx={4} fill="#2563eb" />
                    <text x={BAR_X + 6} y={BAR_Y + 15} fontSize={11} fontWeight={700} fill="#ffffff">김민지 30%</text>
                    <text x={px(INDIRECT) / 2 + BAR_X / 2} y={BAR_Y + BAR_H + 14} fontSize={11} textAnchor="middle" fill="#2563eb">A 몫의 절반</text>
                  </>
                ) : null}
                {active >= 4 ? (
                  <>
                    <line x1={px(THRESHOLD)} x2={px(THRESHOLD)} y1={BAR_Y - 14} y2={BAR_Y + BAR_H + 4} stroke="#dc2626" strokeWidth={1.25} strokeDasharray="3 2" />
                    <text x={px(THRESHOLD) + 4} y={BAR_Y - 6} fontSize={11} fill="#dc2626">25% 기준</text>
                  </>
                ) : null}
              </g>
            ) : null}

            </g>

            {active >= 4 ? (
              <g>
                {STEPS.map((step, index) => {
                  const x = 4 + index * 120;
                  const on = active === 4 ? index === 0 : index > 0;
                  const passed = active === 5 && index < 2;
                  return (
                    <g key={step}>
                      <rect x={x} y={156} width={110} height={30} rx={8} fill={on && !passed ? "#2563eb" : "none"} stroke={on ? "#2563eb" : "#94a3b8"} strokeWidth={1} strokeDasharray={on ? undefined : "4 3"} />
                      <text x={x + 55} y={175} fontSize={11} textAnchor="middle" fontWeight={600} fill={on && !passed ? "#ffffff" : on ? "#2563eb" : "#94a3b8"}>{step}</text>
                      {index < 2 ? <path d={`M${x + 111} 171 L${x + 119} 171`} stroke="#94a3b8" strokeWidth={1} /> : null}
                    </g>
                  );
                })}
                <text x={4} y={204} fontSize={11} fill="#64748b">
                  {active === 4 ? "①에서 김민지 30% 확인 · 별도 지배 근거는 따로 검토" : "①이 없거나 불명확 → ② → 그래도 불가 → ③ (가정)"}
                </text>
              </g>
            ) : null}
          </svg>
        );
      }}
    />
  );
}
