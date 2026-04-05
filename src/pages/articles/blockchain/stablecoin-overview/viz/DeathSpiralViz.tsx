import { ActionBox, AlertBox, DataBox } from '@/components/viz/boxes';

export default function DeathSpiralViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 320" className="w-full h-auto" style={{ maxWidth: 640 }}>
        <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700}
          fill="var(--foreground)">Terra/UST Death Spiral — 2022년 5월</text>

        <defs>
          <marker id="ds-arr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
            <path d="M0,0 L4,2.5 L0,5" fill="#ef4444" />
          </marker>
        </defs>

        {/* 순환 구조 */}
        <AlertBox x={30} y={50} w={120} h={45}
          label="1. UST 디페그"
          sub="$1 → $0.98"
          color="#ef4444" />

        <AlertBox x={180} y={50} w={120} h={45}
          label="2. 공포 매도"
          sub="UST → LUNA (burn)"
          color="#ef4444" />

        <AlertBox x={330} y={50} w={120} h={45}
          label="3. LUNA 공급 급증"
          sub="mint inflation"
          color="#ef4444" />

        <AlertBox x={330} y={135} w={120} h={45}
          label="4. LUNA 가격 폭락"
          sub="$80 → $0.10"
          color="#ef4444" />

        <AlertBox x={180} y={135} w={120} h={45}
          label="5. UST burn 소용없음"
          sub="LUNA 가치 상실"
          color="#ef4444" />

        <AlertBox x={30} y={135} w={120} h={45}
          label="6. UST 더 하락"
          sub="$0.98 → $0.30"
          color="#ef4444" />

        {/* 순환 화살표 */}
        <line x1={150} y1={72} x2={180} y2={72} stroke="#ef4444" strokeWidth={1.5} markerEnd="url(#ds-arr)" />
        <line x1={300} y1={72} x2={330} y2={72} stroke="#ef4444" strokeWidth={1.5} markerEnd="url(#ds-arr)" />
        <line x1={390} y1={95} x2={390} y2={135} stroke="#ef4444" strokeWidth={1.5} markerEnd="url(#ds-arr)" />
        <line x1={330} y1={157} x2={300} y2={157} stroke="#ef4444" strokeWidth={1.5} markerEnd="url(#ds-arr)" />
        <line x1={180} y1={157} x2={150} y2={157} stroke="#ef4444" strokeWidth={1.5} markerEnd="url(#ds-arr)" />

        {/* 순환 표시 */}
        <line x1={90} y1={135} x2={90} y2={95} stroke="#ef4444" strokeWidth={1.5} markerEnd="url(#ds-arr)" />

        <text x={240} y={205} textAnchor="middle" fontSize={9} fontWeight={700}
          fill="#ef4444">→ 순환 반복 → 3일 만에 $40B 증발</text>

        {/* 타임라인 */}
        <rect x={30} y={220} width={420} height={70} rx={8}
          fill="#ef4444" fillOpacity={0.08} stroke="#ef4444" strokeWidth={1} />
        <text x={240} y={238} textAnchor="middle" fontSize={9} fontWeight={700}
          fill="#ef4444">타임라인 (2022년 5월)</text>

        <g transform="translate(40, 248)">
          <text x={0} y={10} fontSize={7} fontWeight={600} fill="var(--foreground)">Day 1 (5/10):</text>
          <text x={70} y={10} fontSize={7} fill="var(--muted-foreground)">UST $0.985 (minor depeg)</text>

          <text x={0} y={22} fontSize={7} fontWeight={600} fill="var(--foreground)">Day 2 (5/11):</text>
          <text x={70} y={22} fontSize={7} fill="var(--muted-foreground)">UST $0.67, LUNA $30</text>

          <text x={0} y={34} fontSize={7} fontWeight={600} fill="var(--foreground)">Day 3 (5/12):</text>
          <text x={70} y={34} fontSize={7} fill="var(--muted-foreground)">UST $0.30, LUNA $0.10 (99% 하락)</text>

          <text x={210} y={10} fontSize={7} fontWeight={600} fill="var(--foreground)">Day 4 (5/13):</text>
          <text x={280} y={10} fontSize={7} fill="var(--muted-foreground)">UST $0.10, LUNA $0.000001</text>

          <text x={210} y={22} fontSize={7} fontWeight={600} fill="var(--foreground)">결과:</text>
          <text x={280} y={22} fontSize={7} fill="var(--muted-foreground)">시스템 중단, $40B 증발</text>

          <text x={210} y={34} fontSize={7} fontWeight={600} fill="var(--foreground)">교훈:</text>
          <text x={280} y={34} fontSize={7} fill="var(--muted-foreground)">담보 없는 신뢰 = zero 가치</text>
        </g>
      </svg>
    </div>
  );
}
