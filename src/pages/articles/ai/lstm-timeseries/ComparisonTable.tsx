const ROWS = [
  { feature: '장기 의존성', lstm: '셀 상태로 보존 (수백 스텝)', transformer: 'Self-Attention (무제한)', winner: 'transformer' },
  { feature: '병렬 학습', lstm: '순차 처리 (느림)', transformer: '완전 병렬 (빠름)', winner: 'transformer' },
  { feature: '소규모 데이터', lstm: '적은 파라미터로 학습 가능', transformer: '대규모 데이터 필요', winner: 'lstm' },
  { feature: '실시간 스트리밍', lstm: '토큰 단위 순차 처리', transformer: '전체 윈도우 재계산', winner: 'lstm' },
  { feature: '메모리 사용', lstm: 'O(1) 고정 상태', transformer: 'O(n²) Attention 행렬', winner: 'lstm' },
  { feature: '해석 가능성', lstm: '게이트 값 분석 가능', transformer: 'Attention 맵 시각화', winner: 'draw' },
  { feature: '다변량 처리', lstm: '입력 차원 확장', transformer: '임베딩 + Positional', winner: 'draw' },
];

export default function ComparisonTable() {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border/50">
            <th className="text-left px-3 py-2 text-foreground/50 font-medium">항목</th>
            <th className="text-left px-3 py-2 text-indigo-400 font-medium">LSTM</th>
            <th className="text-left px-3 py-2 text-emerald-400 font-medium">Transformer</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r) => (
            <tr key={r.feature} className="border-b border-border/20 last:border-0">
              <td className="px-3 py-2 text-foreground/60 font-medium">{r.feature}</td>
              <td className="px-3 py-2 text-foreground/70" style={{
                background: r.winner === 'lstm' ? '#6366f108' : undefined,
              }}>
                {r.winner === 'lstm' && <span className="text-indigo-400 mr-1">*</span>}
                {r.lstm}
              </td>
              <td className="px-3 py-2 text-foreground/70" style={{
                background: r.winner === 'transformer' ? '#10b98108' : undefined,
              }}>
                {r.winner === 'transformer' && <span className="text-emerald-400 mr-1">*</span>}
                {r.transformer}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
