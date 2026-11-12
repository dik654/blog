import SceneShell from "./SceneShell";

/**
 * 본문 대응: #qlora 두 번째 식의 해석 — "Base storage가 16-bit에서 4-bit로 줄어도 activation이 peak의 절반이면
 * 전체 memory가 4배 줄지 않습니다."
 * peak를 100으로 두고 activation 50, 나머지 50을 base 저장으로 둡니다(가정, metadata·adapter·workspace는 0으로 둠).
 * 4-bit base = 50 × 4/16 = 12.5 → 합 62.5. 기대 25(100 ÷ 4) 대신 62.5, 실제 감소는 100 ÷ 62.5 = 1.6배.
 */
const BASE16 = 50;
const ACT = 50;
const BASE4 = (BASE16 * 4) / 16;
const TOTAL4 = BASE4 + ACT;
const NAIVE = (BASE16 + ACT) / 4;
const MAX = 100;

const SCENES = [
  {
    label: "16-bit base일 때",
    summary: "base 50 + activation 50 = 100",
    note: "Peak를 100으로 두고, 글의 조건대로 activation이 절반인 50, 나머지 절반을 base 저장으로 둡니다(가정). Metadata·adapter state·workspace는 단순화를 위해 0으로 둡니다.",
  },
  {
    label: "Base만 4-bit로",
    summary: "12.5 + 50 = 62.5",
    note: "Scalar당 bit가 16에서 4로 줄면 base 저장 항은 50 × 4/16 = 12.5가 됩니다. Activation은 base bit와 무관하게 50 그대로 남습니다.",
  },
  {
    label: "4배가 아니라 1.6배",
    summary: "기대 25 · 실제 62.5",
    note: "전체가 4배 줄기를 기대하면 25지만 실제 합은 62.5이고, 100 ÷ 62.5 = 1.6배 감소입니다. 줄어든 것은 base 항뿐이므로 먼저 장부에서 가장 큰 항을 확인해야 합니다.",
  },
] as const;

const W = 300;
const LEFT = 84;
const RIGHT = 16;
const BAR_H = 26;
const sx = (value: number) => ((W - LEFT - RIGHT) * value) / MAX;

function StackRow({ y, label, base, act, baseLabel }: { y: number; label: string; base: number; act: number; baseLabel: string }) {
  return (
    <g>
      <text x={LEFT - 8} y={y + BAR_H / 2 + 4} textAnchor="end" fontSize={11} fontWeight={700} fill="#334155">
        {label}
      </text>
      <rect x={LEFT} y={y} width={sx(base)} height={BAR_H} fill="#64748b" />
      <rect x={LEFT + sx(base)} y={y} width={sx(act)} height={BAR_H} fill="#d97706" />
      <text x={LEFT + sx(base) / 2} y={y + BAR_H / 2 + 4} textAnchor="middle" fontSize={10} fontWeight={700} fill="#ffffff">
        {baseLabel}
      </text>
      <text x={LEFT + sx(base) + sx(act) / 2} y={y + BAR_H / 2 + 4} textAnchor="middle" fontSize={10} fontWeight={700} fill="#ffffff">
        activation 50
      </text>
      <text x={LEFT + sx(base + act) + 4} y={y - 4} textAnchor="end" fontSize={10} fill="#475569">
        합 {base + act}
      </text>
    </g>
  );
}

export default function QloraPeakShareViz() {
  return (
    <SceneShell
      eyebrow="Peak memory 장부"
      title="Base를 4배 줄여도 peak는 4배 줄지 않습니다"
      description="막대 길이는 peak를 100으로 둔 상대값입니다. 회색은 base 저장, 주황은 activation입니다. activation이 peak의 절반이라는 글의 조건 외의 배분은 가정입니다."
      ariaLabel="16비트 base와 4비트 base에서 base 저장과 activation이 만드는 peak memory 비교"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <svg viewBox={`0 0 ${W} 150`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <StackRow y={22} label="16-bit base" base={BASE16} act={ACT} baseLabel="base 50" />
            {active >= 1 && <StackRow y={78} label="4-bit base" base={BASE4} act={ACT} baseLabel="" />}
            {active >= 1 && (
              <text x={LEFT + sx(BASE4) / 2} y={78 + BAR_H + 14} textAnchor="middle" fontSize={10} fill="#475569">
                base 12.5
              </text>
            )}
            {active === 2 && (
              <g>
                <line x1={LEFT + sx(NAIVE)} x2={LEFT + sx(NAIVE)} y1={70} y2={112} stroke="#dc2626" strokeWidth={1.25} strokeDasharray="3 3" />
                <text x={LEFT + sx(NAIVE) + 4} y={128} fontSize={10} fill="#dc2626">
                  4배 기대 {NAIVE}
                </text>
              </g>
            )}
          </svg>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><rect width="10" height="10" fill="#64748b" /></svg>
              base 저장
            </span>
            <span className="inline-flex items-center gap-1">
              <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><rect width="10" height="10" fill="#d97706" /></svg>
              activation
            </span>
            <span>{active === 2 ? `감소 ${(MAX / TOTAL4).toFixed(1)}배` : `peak ${active === 0 ? MAX : TOTAL4}`}</span>
          </div>
        </div>
      )}
    />
  );
}
