import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #case — 37칸 × 32명 = 1,184칸을 256칸 단위로 올려 1,280칸을 예약하고 96칸이 남는다.
 * 막대 전체가 1,280칸이고 가로 길이는 칸 수에 비례한다.
 */
const NEEDED = 37 * 32;
const UNIT = 256;
const CHUNKS = Math.ceil(NEEDED / UNIT);
const RESERVED = CHUNKS * UNIT;
const LEFT = 12;
const BAR = 336;
const SCALE = BAR / RESERVED;
const TOP = 46;
const HEIGHT = 34;

export default function ReservationRoundingViz() {
  const neededEnd = LEFT + NEEDED * SCALE;
  return (
    <VizFrame
      eyebrow="배정 단위"
      title="1,184칸이 필요해도 256칸 단위로 받으면 1,280칸을 잡습니다"
      description="한 사람당 37칸을 쓰는 일을 32명분 예약합니다. 막대 길이는 칸 수에 비례하고, 칸막이로 나눈 한 토막이 공간을 내어 주는 단위 256칸입니다."
      note="1,184÷256=4.625라 단위 5개로 올립니다. 공식 문서의 계산 사례이며 속도 측정값이 아닙니다."
    >
      <svg viewBox="0 0 360 132" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label="필요한 1,184칸과 예약한 1,280칸, 남는 96칸">
        <text x={LEFT} y={20} fontSize={12} fontWeight={700} fill="#2563eb">37×32 = 1,184칸 필요</text>
        <line x1={LEFT} x2={neededEnd} y1={32} y2={32} stroke="#2563eb" strokeWidth={1} />
        <line x1={LEFT} x2={LEFT} y1={28} y2={36} stroke="#2563eb" strokeWidth={1} />
        <line x1={neededEnd} x2={neededEnd} y1={28} y2={36} stroke="#2563eb" strokeWidth={1} />
        <text x={LEFT + BAR} y={20} fontSize={12} fontWeight={700} fill="#d97706" textAnchor="end">96칸 남음</text>
        <rect x={LEFT} y={TOP} width={NEEDED * SCALE} height={HEIGHT} fill="#2563eb" opacity={0.25} />
        <rect x={neededEnd} y={TOP} width={(RESERVED - NEEDED) * SCALE} height={HEIGHT} fill="none" stroke="#d97706" strokeWidth={1} strokeDasharray="3 3" />
        {Array.from({ length: CHUNKS }, (_, chunk) => (
          <g key={chunk}>
            <rect x={LEFT + chunk * UNIT * SCALE} y={TOP} width={UNIT * SCALE} height={HEIGHT} fill="none" stroke="#64748b" strokeWidth={1} />
            <text x={LEFT + (chunk === CHUNKS - 1 ? chunk * UNIT + (NEEDED - chunk * UNIT) / 2 : (chunk + 0.5) * UNIT) * SCALE} y={TOP + 22} fontSize={12} textAnchor="middle" fill="#64748b">256</text>
          </g>
        ))}
        <line x1={LEFT} x2={LEFT + BAR} y1={92} y2={92} stroke="#64748b" strokeWidth={1} />
        <line x1={LEFT} x2={LEFT} y1={88} y2={96} stroke="#64748b" strokeWidth={1} />
        <line x1={LEFT + BAR} x2={LEFT + BAR} y1={88} y2={96} stroke="#64748b" strokeWidth={1} />
        <text x={180} y={114} fontSize={12} fontWeight={700} textAnchor="middle" fill="#64748b">256칸 × 5 = 1,280칸 예약</text>
      </svg>
    </VizFrame>
  );
}
