import KimiSceneShell from "./KimiSceneShell";

/**
 * 본문 대응: #balancing — m=8 token, n=4 expert, k=1 → q=mk/n=2, 목표 quantile p=1−k/n=0.75.
 * 두 expert의 margin 표본 Δ 여덟 개는 설명용 가정이다. Δ>0이면 이번 step에 선택된 것으로 둔다(가정).
 * 붐비는 expert: 정렬 6·7번째 0.5·0.8 → cutoff 0.65 → b=−0.65 → 다음 step 2개.
 * 한가한 expert: 정렬 6·7번째 −0.4·−0.2 → cutoff −0.3 → b=+0.3 → 다음 step 2개.
 */
const EXPERTS = [
  { name: "붐비는 expert", margins: [-0.9, -0.4, -0.1, 0.2, 0.3, 0.5, 0.8, 1.1], cutoff: 0.65 },
  { name: "한가한 expert", margins: [-1.2, -1.0, -0.8, -0.7, -0.5, -0.4, -0.2, -0.1], cutoff: -0.3 },
] as const;

const Q = 2;

const SCENES = [
  { label: "목표 load", summary: "q = 8 × 1 ÷ 4 = 2", note: "Token 8개가 expert 1개씩 고르면 assignment는 8개입니다. 이를 expert 4개에 고르게 나누면 expert당 목표는 2번입니다. 점 하나가 token 하나의 margin Δ(이 expert가 Top-k 경계보다 얼마나 위(+)·아래(−)에 있는지)이고, 값은 설명용입니다(가정)." },
  { label: "이번 step", summary: "선택 5번 · 0번 (목표 2)", note: "0보다 오른쪽에 있는 점을 이번 step에 선택된 token으로 둡니다(가정). 한 expert는 목표보다 3번 많고 다른 expert는 한 번도 선택되지 않았습니다." },
  { label: "0.75 quantile", summary: "cutoff 0.65 · −0.3", note: "목표 quantile 위치는 1 − k/n = 0.75입니다. 여덟 점을 정렬해 6번째와 7번째 사이(여기서는 두 값의 가운데, 가정)를 자르면 오른쪽에 정확히 2개가 남습니다. 이 cutoff의 부호를 뒤집은 값이 bias b입니다." },
  { label: "다음 step", summary: "b = −0.65 · +0.3 → 2번씩", note: "Bias는 다음 step의 Top-k 선택에만 더합니다. 같은 분포가 다시 온다고 가정하면 두 expert 모두 2번씩 선택됩니다. 선택된 expert의 output을 합칠 mixture weight는 bias가 아니라 raw score로 계산합니다." },
] as const;

const W = 360;
const LEFT = 16;
const RIGHT = W - 16;
const MIN = -1.8;
const MAX = 1.4;
const sx = (v: number) => LEFT + ((v - MIN) / (MAX - MIN)) * (RIGHT - LEFT);

function ExpertLine({ index, active }: { index: number; active: number }) {
  const expert = EXPERTS[index];
  const shift = active >= 3 ? -expert.cutoff : 0;
  const values = expert.margins.map((m) => m + shift);
  const selected = values.filter((v) => v > 0).length;
  const y = 42;
  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 text-xs">
        <span className="font-bold">{expert.name}</span>
        <span className={`font-mono font-bold ${active === 0 ? "text-muted-foreground" : selected === Q ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400"}`}>
          {active === 0 ? "선택 횟수 —" : `선택 ${selected}번`}
          {active >= 3 ? ` · b = ${shift > 0 ? "+" : "−"}${Math.abs(shift)}` : ""}
        </span>
      </div>
      <svg viewBox={`0 0 ${W} 72`} className="h-auto w-full" role="img" aria-label={`${expert.name}: ${active === 0 ? "margin 여덟 개" : `선택 ${selected}번`}`}>
        <line x1={LEFT} x2={RIGHT} y1={y} y2={y} stroke="#94a3b8" strokeWidth={1} />
        {active >= 1 && <rect x={sx(0)} y={y - 16} width={RIGHT - sx(0)} height={32} fill="#16a34a" opacity={0.08} />}
        <line x1={sx(0)} x2={sx(0)} y1={y - 18} y2={y + 18} stroke="#475569" strokeWidth={1.25} />
        <text x={sx(0)} y={y + 29} fontSize={12} textAnchor="middle" fill="#475569">0 · 선택 경계</text>
        {active === 2 && (
          <g>
            <line x1={sx(expert.cutoff)} x2={sx(expert.cutoff)} y1={y - 20} y2={y + 12} stroke="#d97706" strokeWidth={1.25} strokeDasharray="3 2" />
            <text x={sx(expert.cutoff)} y={y - 23} fontSize={12} fontWeight={700} textAnchor="middle" fill="#b45309">{`cutoff ${expert.cutoff < 0 ? "−" : ""}${Math.abs(expert.cutoff)}`}</text>
          </g>
        )}
        {values.map((v, i) => {
          const on = active >= 1 && v > 0;
          return <circle key={i} cx={sx(v)} cy={y} r={4.5} fill={on ? "#16a34a" : "none"} stroke={on ? "#16a34a" : "#64748b"} strokeWidth={1.25} className="transition-[cx] duration-500 motion-reduce:transition-none" />;
        })}
        <text x={LEFT} y={y + 29} fontSize={12} fill="#64748b">{`Δ −${Math.abs(MIN)}`}</text>
        <text x={RIGHT} y={y + 29} fontSize={12} textAnchor="end" fill="#64748b">{`Δ +${MAX}`}</text>
      </svg>
    </div>
  );
}

export default function QuantileBalanceViz() {
  return (
    <KimiSceneShell
      eyebrow="m = 8 · n = 4 · k = 1"
      title="Cutoff를 옮기면 붐비는 expert는 덜, 한가한 expert는 더 선택됩니다"
      description="Expert 네 개 중 두 개만 그렸습니다. 점 하나가 token 하나의 margin이고, 0보다 오른쪽이면 그 token이 이 expert를 고른 것으로 둡니다(가정). 초록 점이 선택입니다."
      note="다른 expert와의 겹침·tie·histogram 근사를 무시한 이상화입니다. 실제로는 매 batch load가 정확히 q가 되지 않습니다."
      ariaLabel="Quantile balancing으로 두 expert의 다음 step 선택 횟수를 목표 2로 맞추는 과정"
      scenes={SCENES}
      render={(active) => (
        <div className="mx-auto max-w-[560px] space-y-4">
          <ExpertLine index={0} active={active} />
          <ExpertLine index={1} active={active} />
        </div>
      )}
    />
  );
}
