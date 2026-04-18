import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';

export default function EnsembleEvolutionViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 640 340" className="w-full h-auto" style={{ maxWidth: 820 }}>
        <text x={320} y={22} textAnchor="middle" fontSize={15} fontWeight={700}
          fill="var(--foreground)">Decision Tree → Ensemble 진화 3단계</text>

        {/* Stage 1: Single Decision Tree */}
        <ModuleBox x={20} y={48} w={180} h={52} label="Decision Tree" sub="단일 트리" color="#94a3b8" />
        <text x={110} y={118} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          해석 쉬움, 과적합 심함
        </text>
        <text x={110} y={132} textAnchor="middle" fontSize={9} fill="#ef4444">
          높은 분산 + 높은 편향
        </text>

        {/* Arrow 1→2 */}
        <line x1={208} y1={74} x2={228} y2={74} stroke="var(--border)" strokeWidth={1.5} markerEnd="url(#arrow)" />

        {/* Stage 2: Bagging / Random Forest */}
        <ModuleBox x={235} y={48} w={180} h={52} label="Random Forest" sub="Bagging 앙상블" color="#3b82f6" />
        <text x={325} y={118} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          독립 트리 N개 → 평균/투표
        </text>
        <text x={325} y={132} textAnchor="middle" fontSize={9} fill="#3b82f6">
          분산 감소 ↓ (편향 유지)
        </text>

        {/* Arrow 2→3 */}
        <line x1={423} y1={74} x2={443} y2={74} stroke="var(--border)" strokeWidth={1.5} markerEnd="url(#arrow)" />

        {/* Stage 3: Boosting / GBM */}
        <ModuleBox x={450} y={48} w={180} h={52} label="Gradient Boosting" sub="Boosting 앙상블" color="#10b981" />
        <text x={540} y={118} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          순차 트리 → 잔차 학습
        </text>
        <text x={540} y={132} textAnchor="middle" fontSize={9} fill="#10b981">
          편향 감소 ↓ (분산도 관리)
        </text>

        {/* Bagging vs Boosting 비교 */}
        <rect x={40} y={158} width={260} height={160} rx={10}
          fill="#3b82f6" fillOpacity={0.05} stroke="#3b82f6" strokeWidth={1.2} />
        <text x={170} y={178} textAnchor="middle" fontSize={12} fontWeight={700} fill="#3b82f6">
          Bagging (병렬)
        </text>
        {/* 병렬 트리 시각화 */}
        {[0, 1, 2, 3].map(i => (
          <g key={`bag-${i}`}>
            <DataBox x={55 + i * 60} y={190} w={50} h={28} label={`Tree ${i + 1}`} color="#3b82f6" />
          </g>
        ))}
        <text x={170} y={240} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          독립적 — Bootstrap 샘플링
        </text>
        <ActionBox x={120} y={256} w={100} h={32} label="평균/투표" sub="aggregation" color="#3b82f6" />
        <text x={170} y={305} textAnchor="middle" fontSize={8} fill="#3b82f6">
          Var(avg) = σ²/N → 트리 수 ↑ 분산 ↓
        </text>

        <rect x={340} y={158} width={260} height={160} rx={10}
          fill="#10b981" fillOpacity={0.05} stroke="#10b981" strokeWidth={1.2} />
        <text x={470} y={178} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10b981">
          Boosting (순차)
        </text>
        {/* 순차 트리 시각화 — 화살표로 연결 */}
        {[0, 1, 2, 3].map(i => (
          <g key={`boost-${i}`}>
            <DataBox x={355 + i * 60} y={190} w={50} h={28} label={`Tree ${i + 1}`} color="#10b981" />
            {i < 3 && (
              <line x1={410 + i * 60} y1={204} x2={418 + i * 60} y2={204}
                stroke="#10b981" strokeWidth={1} markerEnd="url(#arrowG)" />
            )}
          </g>
        ))}
        <text x={470} y={240} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          순차적 — 이전 오차를 학습
        </text>
        <ActionBox x={420} y={256} w={100} h={32} label="가중 합산" sub="additive model" color="#10b981" />
        <text x={470} y={305} textAnchor="middle" fontSize={8} fill="#10b981">
          F_m = F_(m-1) + η·h_m → 잔차 ↓ 편향 ↓
        </text>

        {/* Arrow markers */}
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX={8} refY={5}
            markerWidth={6} markerHeight={6} orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--border)" />
          </marker>
          <marker id="arrowG" viewBox="0 0 10 10" refX={8} refY={5}
            markerWidth={5} markerHeight={5} orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
