import { ModuleBox, DataBox } from '@/components/viz/boxes';

export default function EModeViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 280" className="w-full h-auto" style={{ maxWidth: 640 }}>
        <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700}
          fill="var(--foreground)">E-Mode vs 일반 모드 — LTV 비교</text>

        {/* 일반 모드 */}
        <text x={120} y={45} textAnchor="middle" fontSize={10} fontWeight={600}
          fill="var(--foreground)">일반 모드</text>

        {/* 바 그래프 */}
        <rect x={40} y={60} width={160} height={30} fill="var(--muted)" opacity={0.4} rx={4} />
        <rect x={40} y={60} width={Math.round(160 * 0.72)} height={30} fill="#3b82f6" opacity={0.6} rx={4} />
        <text x={120} y={80} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">72% LTV</text>

        <text x={120} y={105} textAnchor="middle" fontSize={7}
          fill="var(--muted-foreground)">wstETH 담보</text>

        {/* E-Mode */}
        <text x={360} y={45} textAnchor="middle" fontSize={10} fontWeight={600}
          fill="#10b981">E-Mode (ETH category)</text>

        <rect x={280} y={60} width={160} height={30} fill="var(--muted)" opacity={0.4} rx={4} />
        <rect x={280} y={60} width={Math.round(160 * 0.93)} height={30} fill="#10b981" rx={4} />
        <text x={360} y={80} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">93% LTV</text>

        <text x={360} y={105} textAnchor="middle" fontSize={7}
          fill="var(--muted-foreground)">wstETH 담보 (correlated)</text>

        {/* 차이 효과 */}
        <rect x={40} y={125} width={400} height={45} rx={8}
          fill="#10b981" fillOpacity={0.1} stroke="#10b981" strokeWidth={1} />
        <text x={240} y={145} textAnchor="middle" fontSize={10} fontWeight={700}
          fill="#10b981">레버리지 효과: 72% → 93% = 약 4.9배 증폭</text>
        <text x={240} y={160} textAnchor="middle" fontSize={8}
          fill="var(--muted-foreground)">Looping 전략: stETH → 93% 차입 → stETH 재구매 → ...</text>

        {/* Isolation Mode 비교 */}
        <text x={240} y={195} textAnchor="middle" fontSize={10} fontWeight={600}
          fill="var(--foreground)">Isolation Mode (신규/위험 자산)</text>

        <g transform="translate(40, 210)">
          <rect x={0} y={0} width={195} height={55} rx={6}
            fill="#f59e0b" fillOpacity={0.1} stroke="#f59e0b" strokeWidth={0.8} />
          <text x={97.5} y={15} textAnchor="middle" fontSize={8} fontWeight={700} fill="#f59e0b">
            특징
          </text>
          <text x={97.5} y={28} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
            ✓ 다른 담보 동시 사용 불가
          </text>
          <text x={97.5} y={38} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
            ✓ 지정 stablecoin만 차입
          </text>
          <text x={97.5} y={48} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
            ✓ Debt Ceiling 있음
          </text>
        </g>

        <g transform="translate(245, 210)">
          <rect x={0} y={0} width={195} height={55} rx={6}
            fill="#ef4444" fillOpacity={0.1} stroke="#ef4444" strokeWidth={0.8} />
          <text x={97.5} y={15} textAnchor="middle" fontSize={8} fontWeight={700} fill="#ef4444">
            목적
          </text>
          <text x={97.5} y={28} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
            리스크 격리
          </text>
          <text x={97.5} y={38} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
            exploit 발생해도
          </text>
          <text x={97.5} y={48} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
            단일 자산만 영향
          </text>
        </g>
      </svg>
    </div>
  );
}
