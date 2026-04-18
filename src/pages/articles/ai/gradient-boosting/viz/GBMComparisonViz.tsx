import { ModuleBox, DataBox } from '@/components/viz/boxes';

export default function GBMComparisonViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 640 380" className="w-full h-auto" style={{ maxWidth: 820 }}>
        <text x={320} y={22} textAnchor="middle" fontSize={15} fontWeight={700}
          fill="var(--foreground)">3대 GBM 선택 가이드</text>

        {/* 데이터 크기 축 */}
        <text x={320} y={46} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">데이터 특성에 따른 최적 선택</text>

        {/* XGBoost */}
        <rect x={20} y={62} width={190} height={190} rx={12}
          fill="#3b82f6" fillOpacity={0.04} stroke="#3b82f6" strokeWidth={1.5} />
        <ModuleBox x={45} y={70} w={140} h={40} label="XGBoost" sub="범용 표준" color="#3b82f6" />
        {[
          { label: '트리 성장', value: 'Level-wise' },
          { label: '정규화', value: 'L1 + L2 + γ' },
          { label: '결측 처리', value: '자동 (학습 분할)' },
          { label: '범주형', value: 'One-hot 필요' },
          { label: 'GPU', value: '지원 (hist)' },
          { label: '속도', value: '중간' },
        ].map((row, i) => (
          <g key={i}>
            <text x={30} y={128 + i * 18} fontSize={8} fontWeight={600}
              fill="var(--muted-foreground)">{row.label}</text>
            <text x={200} y={128 + i * 18} textAnchor="end" fontSize={8}
              fill="#3b82f6">{row.value}</text>
          </g>
        ))}
        <DataBox x={55} y={232} w={120} h={14} label="" color="#3b82f6" />
        <text x={115} y={243} textAnchor="middle" fontSize={8} fontWeight={700}
          fill="#3b82f6">안정성 중시</text>

        {/* LightGBM */}
        <rect x={225} y={62} width={190} height={190} rx={12}
          fill="#10b981" fillOpacity={0.04} stroke="#10b981" strokeWidth={1.5} />
        <ModuleBox x={250} y={70} w={140} h={40} label="LightGBM" sub="속도 최적" color="#10b981" />
        {[
          { label: '트리 성장', value: 'Leaf-wise' },
          { label: '샘플링', value: 'GOSS + EFB' },
          { label: '결측 처리', value: '자동' },
          { label: '범주형', value: '직접 지원' },
          { label: 'GPU', value: '지원' },
          { label: '속도', value: '가장 빠름' },
        ].map((row, i) => (
          <g key={i}>
            <text x={235} y={128 + i * 18} fontSize={8} fontWeight={600}
              fill="var(--muted-foreground)">{row.label}</text>
            <text x={405} y={128 + i * 18} textAnchor="end" fontSize={8}
              fill="#10b981">{row.value}</text>
          </g>
        ))}
        <DataBox x={260} y={232} w={120} h={14} label="" color="#10b981" />
        <text x={320} y={243} textAnchor="middle" fontSize={8} fontWeight={700}
          fill="#10b981">대용량 + 속도</text>

        {/* CatBoost */}
        <rect x={430} y={62} width={190} height={190} rx={12}
          fill="#8b5cf6" fillOpacity={0.04} stroke="#8b5cf6" strokeWidth={1.5} />
        <ModuleBox x={455} y={70} w={140} h={40} label="CatBoost" sub="범주형 특화" color="#8b5cf6" />
        {[
          { label: '트리 성장', value: 'Symmetric' },
          { label: '부스팅', value: 'Ordered' },
          { label: '결측 처리', value: '자동' },
          { label: '범주형', value: 'Ordered TS (최강)' },
          { label: 'GPU', value: '네이티브 지원' },
          { label: '속도', value: '빠름 (GPU 시)' },
        ].map((row, i) => (
          <g key={i}>
            <text x={440} y={128 + i * 18} fontSize={8} fontWeight={600}
              fill="var(--muted-foreground)">{row.label}</text>
            <text x={610} y={128 + i * 18} textAnchor="end" fontSize={8}
              fill="#8b5cf6">{row.value}</text>
          </g>
        ))}
        <DataBox x={465} y={232} w={120} h={14} label="" color="#8b5cf6" />
        <text x={525} y={243} textAnchor="middle" fontSize={8} fontWeight={700}
          fill="#8b5cf6">범주형 많을 때</text>

        {/* 하단 선택 가이드 */}
        <rect x={20} y={270} width={600} height={100} rx={10}
          fill="var(--muted)" fillOpacity={0.1} stroke="var(--border)" strokeWidth={0.8} />
        <text x={320} y={290} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">실전 선택 기준</text>

        {[
          { cond: '데이터 &gt; 100만 행', pick: 'LightGBM', reason: 'GOSS+EFB로 속도 우위', color: '#10b981' },
          { cond: '범주형 피처 50%+', pick: 'CatBoost', reason: 'Ordered TS가 최적', color: '#8b5cf6' },
          { cond: '범용 / 소규모', pick: 'XGBoost', reason: '가장 안정적, 문서 풍부', color: '#3b82f6' },
          { cond: '앙상블 다양성', pick: '3개 혼합', reason: '서로 다른 오차 패턴 → 보완', color: '#f59e0b' },
        ].map((g, i) => (
          <g key={i}>
            <text x={40} y={312 + i * 16} fontSize={9} fill="var(--foreground)">{g.cond}</text>
            <text x={260} y={312 + i * 16} fontSize={9} fontWeight={700} fill={g.color}>
              → {g.pick}
            </text>
            <text x={400} y={312 + i * 16} fontSize={8} fill="var(--muted-foreground)">
              {g.reason}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
