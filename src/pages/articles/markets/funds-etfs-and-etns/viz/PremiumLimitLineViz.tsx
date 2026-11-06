import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 순자산가치(ETN은 지표가치) 1만 원 상품의 괴리율 선.
 * 괴리율 = |시장가격 − 가치| ÷ 가치. 100÷1만=1%.
 * 2026-10-09 현재: 국내 2%·그 2배 4%, 해외 5%·그 2배 10%(본문의 "2배" 규칙으로 계산).
 * 2020-05-18 보도자료: 국내 3%·6%, 해외 6%·12%.
 */
type Limits = { lp: number; watch: number; lpName: string; watchName: string };

const SCENES = [
  { label: "1만100원의 괴리율", summary: "100 ÷ 1만 = 1%", note: "괴리율은 시장가격에서 가치를 뺀 값을 그 가치로 나눈 비율입니다. 앞 사례의 1만100원은 국내 2%, 해외 5% 선 안쪽입니다. 그 선은 다음 장면에서 그립니다." },
  { label: "규정의 두 선", summary: "국내 2%·4% · 해외 5%·10%", note: "LP는 2%(해외 5%)를 넘지 않게 호가를 내야 합니다. 장 종료 때 그 2배 이상이면 거래소가 지정을 예고할 수 있습니다. 해외 10%는 2배 규칙으로 계산했습니다." },
  { label: "아래로 벗어나도 같습니다", summary: "음수면 절댓값", note: "음수이면 절댓값을 쓰므로 가격이 가치보다 낮은 쪽에도 같은 거리에 선이 생깁니다. 왼쪽 가격은 1만 원 상품으로 계산했습니다." },
  { label: "2020년의 값", summary: "국내 3%·6% · 해외 6%·12%", note: "금융위원회 2020년 5월 18일 보도자료의 의무 범위와 투자유의 기준입니다. 지금의 2%·5% 조문에는 2026년 8월·9월 개정 표시가 붙어 있습니다." },
] as const;

const NOW_NAMES = { lpName: "LP 선", watchName: "예고" };
const OLD_NAMES = { lpName: "의무 범위", watchName: "투자유의 기준" };
const NOW: Record<"home" | "abroad", Limits> = { home: { lp: 2, watch: 4, ...NOW_NAMES }, abroad: { lp: 5, watch: 10, ...NOW_NAMES } };
const OLD: Record<"home" | "abroad", Limits> = { home: { lp: 3, watch: 6, ...OLD_NAMES }, abroad: { lp: 6, watch: 12, ...OLD_NAMES } };

const ACCENT = "#2563eb";
const AMBER = "#d97706";
const RED = "#dc2626";
const GRAY = "#64748b";
const MUTED = "#94a3b8";
const X = (percent: number) => 170 + (percent / 13) * 165;
const price = (percent: number) => {
  const value = 10000 + percent * 100;
  return value >= 10000 ? `1만${value === 10000 ? "" : value - 10000}` : `${value}`;
};

function Rail({ y, name, limits, mirror, showLimits }: { y: number; name: string; limits: Limits; mirror: boolean; showLimits: boolean }) {
  const segments = (sign: number) => (
    <g key={sign}>
      <line x1={X(0)} x2={X(sign * limits.lp)} y1={y} y2={y} stroke={ACCENT} strokeWidth={1.25} />
      <line x1={X(sign * limits.lp)} x2={X(sign * limits.watch)} y1={y} y2={y} stroke={AMBER} strokeWidth={1.25} />
      <line x1={X(sign * limits.watch)} x2={X(sign * 13)} y1={y} y2={y} stroke={RED} strokeWidth={1.25} />
      <line x1={X(sign * limits.lp)} x2={X(sign * limits.lp)} y1={y - 7} y2={y + 7} stroke={AMBER} strokeWidth={1.25} />
      <line x1={X(sign * limits.watch)} x2={X(sign * limits.watch)} y1={y - 7} y2={y + 7} stroke={RED} strokeWidth={1.25} />
    </g>
  );
  const upperAnchor = limits.lp >= 5 ? "end" : "start";
  return (
    <g>
      <text x={0} y={y - 26} fontSize={12} fontWeight={700} fill="currentColor">{name}</text>
      {showLimits ? (
        <g>
          {segments(1)}
          {mirror && segments(-1)}
          <text x={X(limits.lp)} y={y - 11} textAnchor={upperAnchor} fontSize={11} fontWeight={700} fill={AMBER}>{limits.lpName} {limits.lp}% · {price(limits.lp)}</text>
          <text x={X(limits.watch)} y={y + 19} textAnchor={limits.watch <= 4 ? "start" : "end"} fontSize={11} fontWeight={700} fill={RED}>{limits.watchName} {limits.watch}% · {price(limits.watch)}</text>
          {mirror && (
            <g>
              <text x={X(-limits.lp)} y={y - 11} textAnchor="end" fontSize={11} fontWeight={700} fill={AMBER}>−{limits.lp}% · {price(-limits.lp)}</text>
              <text x={X(-limits.watch)} y={y + 19} textAnchor={limits.watch <= 4 ? "end" : "start"} fontSize={11} fontWeight={700} fill={RED}>−{limits.watch}% · {price(-limits.watch)}</text>
            </g>
          )}
        </g>
      ) : (
        <line x1={X(-13)} x2={X(13)} y1={y} y2={y} stroke={MUTED} strokeWidth={1} />
      )}
      <line x1={X(0)} x2={X(0)} y1={y - 9} y2={y + 9} stroke={GRAY} strokeWidth={1} />
    </g>
  );
}

export default function PremiumLimitLineViz() {
  return (
    <SceneShell
      eyebrow="괴리율의 선"
      title="1만 원짜리 상품에서 가격이 어디까지 벌어지면 선을 넘는지 봅니다"
      description="가운데가 순자산가치(ETN은 지표가치) 1만 원입니다. 파랑은 유동성공급자(LP) 호가 선 안, 주황은 그 밖, 빨강은 투자유의종목 지정 예고 기준 이상입니다."
      note="한국거래소 규정이며 현재 값은 2026-10-09 기준입니다."
      ariaLabel="국내와 해외 기초자산 상품의 괴리율 기준선을 1만 원 상품 가격으로 표시"
      scenes={SCENES}
      render={(active) => {
        const limits = active === 3 ? OLD : NOW;
        const showLimits = active > 0;
        const mirror = active === 2;
        return (
          <svg viewBox="0 0 340 168" className="mx-auto h-auto w-full max-w-[560px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <Rail y={50} name="국내 기초자산" limits={limits.home} mirror={mirror} showLimits={showLimits} />
            <Rail y={122} name="해외 기초자산" limits={limits.abroad} mirror={mirror} showLimits={showLimits} />
            {active === 0 && (
              <g>
                <circle cx={X(1)} cy={50} r={4} fill={ACCENT} />
                <text x={X(1) + 8} y={39} fontSize={12} fontWeight={700} fill={ACCENT}>1만100 · 1%</text>
                <circle cx={X(1)} cy={122} r={4} fill={ACCENT} />
                <text x={X(1) + 8} y={111} fontSize={12} fontWeight={700} fill={ACCENT}>1만100 · 1%</text>
              </g>
            )}
            <text x={X(0)} y={162} textAnchor="middle" fontSize={11} fill={GRAY}>가치 1만 원</text>
          </svg>
        );
      }}
    />
  );
}
