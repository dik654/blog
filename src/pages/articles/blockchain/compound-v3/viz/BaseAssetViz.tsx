import { ModuleBox, DataBox } from '@/components/viz/boxes';

export default function BaseAssetViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 260" className="w-full h-auto" style={{ maxWidth: 640 }}>
        <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700}
          fill="var(--foreground)">Comet USDC Market 구조</text>

        {/* Base Asset */}
        <rect x={150} y={40} width={180} height={50} rx={8}
          fill="#3b82f6" fillOpacity={0.15} stroke="#3b82f6" strokeWidth={1.5} />
        <text x={240} y={62} textAnchor="middle" fontSize={11} fontWeight={700} fill="#3b82f6">
          Base Asset: USDC
        </text>
        <text x={240} y={78} textAnchor="middle" fontSize={8}
          fill="var(--muted-foreground)">예치 이자 발생 · 차입 가능</text>

        {/* Separator */}
        <line x1={50} y1={115} x2={430} y2={115} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="3 2" />
        <text x={240} y={108} textAnchor="middle" fontSize={8} fontWeight={600}
          fill="var(--muted-foreground)">↑ 차입 자산 (1개만) · 담보 자산 (여러개) ↓</text>

        {/* Collateral assets */}
        <DataBox x={30} y={140} w={82} h={35}
          label="WETH"
          sub="LTV 83%"
          color="#10b981" />
        <DataBox x={122} y={140} w={82} h={35}
          label="WBTC"
          sub="LTV 70%"
          color="#f59e0b" />
        <DataBox x={214} y={140} w={82} h={35}
          label="LINK"
          sub="LTV 67%"
          color="#8b5cf6" />
        <DataBox x={306} y={140} w={82} h={35}
          label="UNI"
          sub="LTV 64%"
          color="#ec4899" />
        <DataBox x={398} y={140} w={52} h={35}
          label="COMP"
          sub="LTV 60%"
          color="#6b7280" />

        <text x={240} y={195} textAnchor="middle" fontSize={8} fontWeight={600}
          fill="var(--foreground)">Collateral Assets (이자 없음, 담보만)</text>

        {/* 사용 방식 */}
        <rect x={60} y={210} width={360} height={40} rx={6}
          fill="var(--muted)" opacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={240} y={228} textAnchor="middle" fontSize={9} fontWeight={600}
          fill="var(--foreground)">사용 사례</text>
        <text x={240} y={243} textAnchor="middle" fontSize={8}
          fill="var(--muted-foreground)">WETH 예치 → USDC 차입 (단방향) · 역할 명확히 분리</text>
      </svg>
    </div>
  );
}
