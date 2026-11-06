import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: names 절 — AA 등급(20/60/180)과 2026-11-03 기준 공급자 P25 범위의 위치 관계.
 * 저가 17~43, 폐쇄형 프런티어 75~95, 고속 110~290.
 */
const W = 360;
const LEFT = 12;
const RIGHT = 12;
const MAX = 300;
const x = (value: number) => LEFT + (value / MAX) * (W - LEFT - RIGHT);

const TIERS = [
  { v: 20, label: "1등급 20", anchor: "start", dx: -18 },
  { v: 60, label: "2등급 60", anchor: "start", dx: -4 },
  { v: 180, label: "3등급 180", anchor: "middle", dx: 0 },
] as const;

const RANGES = [
  { from: 17, to: 43, y: 40, name: "저가 공급자 17~43", labelX: x(60) + 7, labelY: 50 },
  { from: 75, to: 95, y: 78, name: "폐쇄형 API 75~95", labelX: x(95) + 6, labelY: 88 },
  { from: 110, to: 290, y: 130, name: "고속 공급자 110~290", labelX: x(180) + 7, labelY: 122 },
] as const;

export default function MarketTierAxisViz() {
  return (
    <VizFrame
      eyebrow="등급과 시장"
      title="등급의 하한은 공급자 속도 범위 위에 이렇게 놓입니다"
      description="가로축은 P25 출력 속도(tok/s), 곧 요청을 느린 순으로 세웠을 때 하위 25퍼센트 지점의 속도입니다. 세로 점선이 등급의 속도 하한, 막대가 공급자 무리의 P25 범위입니다."
      note="저가·고속은 1T급 오픈 MoE를 파는 공급자이고, 폐쇄형 API는 폐쇄형 프런티어 모델 API이며 범위는 2026년 11월 3일 기준입니다. 2등급에 가까운 모델 제작사 직영·중간 공급자는 범위 수치가 없어 그리지 않았으므로 60 근처의 빈자리를 공급자가 없다는 뜻으로 읽으면 안 됩니다. 3등급 결과는 공개 데이터에 아직 없습니다."
    >
      <svg viewBox={`0 0 ${W} 186`} className="mx-auto h-auto w-full max-w-[640px]" role="img" aria-label="등급 하한 20, 60, 180과 공급자 P25 범위를 같은 속도 축에 놓은 그림">
        {TIERS.map((tier) => (
          <g key={tier.v}>
            <line x1={x(tier.v)} x2={x(tier.v)} y1={20} y2={160} stroke="#b45309" strokeWidth={1} strokeDasharray="4 3" />
            <text x={x(tier.v) + tier.dx} y={13} textAnchor={tier.anchor} fontSize={11} fontWeight={700} fill="#b45309">{tier.label}</text>
          </g>
        ))}
        {RANGES.map((range) => (
          <g key={range.name}>
            <text x={range.labelX} y={range.labelY} fontSize={11} fontWeight={600} fill="#64748b">{range.name}</text>
            <rect x={x(range.from)} y={range.y} width={x(range.to) - x(range.from)} height={14} rx={2} fill="#64748b" opacity={0.75} />
          </g>
        ))}
        <line x1={LEFT} x2={W - RIGHT} y1={160} y2={160} stroke="#94a3b8" strokeWidth={1} />
        {[0, 100, 200, 300].map((tick) => (
          <text key={tick} x={x(tick)} y={176} textAnchor={tick === 0 ? "start" : tick === 300 ? "end" : "middle"} fontSize={11} fill="#64748b">{tick}</text>
        ))}
      </svg>
    </VizFrame>
  );
}
