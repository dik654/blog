import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';

export default function GaugeViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 300" className="w-full h-auto" style={{ maxWidth: 640 }}>
        <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700}
          fill="var(--foreground)">Curve veTokenomics — Gauge · veCRV · Bribes</text>

        <defs>
          <marker id="gauge-arr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
            <path d="M0,0 L4,2.5 L0,5" fill="#3b82f6" />
          </marker>
        </defs>

        {/* LP */}
        <ActionBox x={20} y={50} w={100} h={35}
          label="User (LP)"
          sub="Pool에 예치"
          color="#3b82f6" />

        {/* LP Token */}
        <DataBox x={140} y={52} w={80} h={30}
          label="LP Token"
          sub="Pool 지분"
          color="#10b981" />

        {/* Gauge */}
        <ModuleBox x={240} y={45} w={100} h={45}
          label="Gauge"
          sub="CRV 분배기"
          color="#8b5cf6" />

        {/* CRV Rewards */}
        <DataBox x={360} y={52} w={100} h={30}
          label="CRV 보상"
          sub="inflation_rate"
          color="#f59e0b" />

        {/* 화살표 상단 */}
        <line x1={120} y1={67} x2={140} y2={67} stroke="#3b82f6" strokeWidth={1.2} markerEnd="url(#gauge-arr)" />
        <line x1={220} y1={67} x2={240} y2={67} stroke="#3b82f6" strokeWidth={1.2} markerEnd="url(#gauge-arr)" />
        <line x1={340} y1={67} x2={360} y2={67} stroke="#f59e0b" strokeWidth={1.2} markerEnd="url(#gauge-arr)" />

        {/* veCRV flow */}
        <ActionBox x={20} y={135} w={100} h={35}
          label="CRV 보유자"
          sub="lock 선택"
          color="#ef4444" />

        <ActionBox x={140} y={135} w={100} h={35}
          label="VotingEscrow"
          sub="4년 최대 lock"
          color="#8b5cf6" />

        <DataBox x={260} y={137} w={90} h={30}
          label="veCRV"
          sub="voting power"
          color="#8b5cf6" />

        <line x1={120} y1={152} x2={140} y2={152} stroke="#3b82f6" strokeWidth={1.2} markerEnd="url(#gauge-arr)" />
        <line x1={240} y1={152} x2={260} y2={152} stroke="#3b82f6" strokeWidth={1.2} markerEnd="url(#gauge-arr)" />

        {/* Vote for Gauge */}
        <ActionBox x={370} y={135} w={90} h={35}
          label="Vote"
          sub="gauge weight"
          color="#10b981" />

        <line x1={350} y1={152} x2={370} y2={152} stroke="#3b82f6" strokeWidth={1.2} markerEnd="url(#gauge-arr)" />

        {/* Vote → Gauge (화살표 위로) */}
        <path d="M 415 135 Q 420 110 330 90" stroke="#10b981" strokeWidth={1.2}
          fill="none" strokeDasharray="3 2" markerEnd="url(#gauge-arr)" />
        <text x={420} y={115} textAnchor="middle" fontSize={7} fill="#10b981">결정</text>

        {/* Bribes */}
        <rect x={20} y={210} width={440} height={65} rx={8}
          fill="#f59e0b" fillOpacity={0.08} stroke="#f59e0b" strokeWidth={1} strokeDasharray="4 3" />
        <text x={240} y={228} textAnchor="middle" fontSize={10} fontWeight={700}
          fill="#f59e0b">Bribes Market — 프로젝트들이 veCRV 투표 구매</text>

        <text x={55} y={250} textAnchor="middle" fontSize={8} fontWeight={600} fill="var(--foreground)">Project</text>
        <text x={55} y={263} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">BAL 토큰</text>

        <line x1={85} y1={255} x2={135} y2={255} stroke="#f59e0b" strokeWidth={1} markerEnd="url(#gauge-arr)" />

        <text x={165} y={250} textAnchor="middle" fontSize={8} fontWeight={600} fill="var(--foreground)">Votium</text>
        <text x={165} y={263} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">bribe 취합</text>

        <line x1={195} y1={255} x2={245} y2={255} stroke="#f59e0b" strokeWidth={1} markerEnd="url(#gauge-arr)" />

        <text x={280} y={250} textAnchor="middle" fontSize={8} fontWeight={600} fill="var(--foreground)">Convex</text>
        <text x={280} y={263} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">veCRV 독점</text>

        <line x1={310} y1={255} x2={360} y2={255} stroke="#f59e0b" strokeWidth={1} markerEnd="url(#gauge-arr)" />

        <text x={400} y={250} textAnchor="middle" fontSize={8} fontWeight={600} fill="var(--foreground)">Gauge Vote</text>
        <text x={400} y={263} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">CRV 보상 유도</text>

        <text x={240} y={290} textAnchor="middle" fontSize={7}
          fill="var(--muted-foreground)">Curve Wars — 프로토콜들의 유동성 경쟁</text>
      </svg>
    </div>
  );
}
