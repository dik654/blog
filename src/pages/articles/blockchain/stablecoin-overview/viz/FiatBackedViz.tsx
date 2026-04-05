import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';

export default function FiatBackedViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 260" className="w-full h-auto" style={{ maxWidth: 640 }}>
        <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700}
          fill="var(--foreground)">Fiat-backed Stablecoin — 1:1 백업 구조</text>

        <defs>
          <marker id="fb-arr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
            <path d="M0,0 L4,2.5 L0,5" fill="#3b82f6" />
          </marker>
        </defs>

        {/* User */}
        <ActionBox x={30} y={50} w={90} h={40}
          label="사용자"
          sub="USD 입금"
          color="#3b82f6" />

        {/* Issuer */}
        <ModuleBox x={150} y={45} w={110} h={50}
          label="Issuer"
          sub="Circle / Tether"
          color="#f59e0b" />

        {/* Bank */}
        <ModuleBox x={290} y={45} w={110} h={50}
          label="은행 + MMF"
          sub="BNY, BlackRock"
          color="#6b7280" />

        {/* Treasury */}
        <DataBox x={30} y={160} w={110} h={35}
          label="US Treasury Bills"
          sub="80% 준비금"
          color="#10b981" />
        <DataBox x={150} y={160} w={110} h={35}
          label="Cash"
          sub="10% 준비금"
          color="#10b981" />
        <DataBox x={270} y={160} w={110} h={35}
          label="Repo agreements"
          sub="10% 준비금"
          color="#10b981" />

        {/* Token */}
        <ActionBox x={410} y={50} w={60} h={40}
          label="USDC / USDT"
          sub="1:1 발행"
          color="#3b82f6" />

        {/* 화살표 */}
        <line x1={120} y1={70} x2={150} y2={70} stroke="#3b82f6" strokeWidth={1.2} markerEnd="url(#fb-arr)" />
        <line x1={260} y1={70} x2={290} y2={70} stroke="#3b82f6" strokeWidth={1.2} markerEnd="url(#fb-arr)" />
        <line x1={205} y1={95} x2={85} y2={160} stroke="#10b981" strokeWidth={1} strokeDasharray="3 2" />
        <line x1={345} y1={95} x2={325} y2={160} stroke="#10b981" strokeWidth={1} strokeDasharray="3 2" />

        {/* User ← Token */}
        <path d="M 450 90 Q 455 120 120 90" stroke="#10b981" strokeWidth={1.5}
          fill="none" markerEnd="url(#fb-arr)" strokeDasharray="4 3" />
        <text x={285} y={118} textAnchor="middle" fontSize={7} fill="#10b981">발행된 토큰</text>

        {/* 비율 라벨 */}
        <text x={205} y={220} textAnchor="middle" fontSize={10} fontWeight={700}
          fill="#10b981">총 준비금 = 유통 토큰 × 1.0+</text>

        <text x={240} y={245} textAnchor="middle" fontSize={7}
          fill="var(--muted-foreground)">사용자 USD → 은행 → 토큰 발행 · 환급은 역순</text>
      </svg>
    </div>
  );
}
