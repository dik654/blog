import { DataBox, ActionBox } from '@/components/viz/boxes';

export default function MergeSummaryViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 330" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">Summary 병합 — 연쇄 압축 (시간축)</text>

        {/* 타임라인 */}
        <line x1={50} y1={120} x2={510} y2={120} stroke="var(--foreground)" strokeWidth={1} />

        {/* 1차 압축 */}
        <circle cx={140} cy={120} r={8} fill="#3b82f6" />
        <text x={140} y={148} textAnchor="middle" fontSize={9} fontWeight={700} fill="#3b82f6">1차</text>
        <line x1={140} y1={86} x2={140} y2={112} stroke="#3b82f6" strokeWidth={0.8} />
        <rect x={84} y={54} width={112} height={32} rx={4}
          fill="#3b82f6" fillOpacity={0.1} stroke="#3b82f6" strokeWidth={0.5} />
        <text x={140} y={70} textAnchor="middle" fontSize={9} fontWeight={600} fill="#3b82f6">Summary A</text>
        <text x={140} y={81} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)">30턴 요약</text>

        {/* 2차 압축 */}
        <circle cx={300} cy={120} r={8} fill="#f59e0b" />
        <text x={300} y={148} textAnchor="middle" fontSize={9} fontWeight={700} fill="#f59e0b">2차</text>
        <line x1={300} y1={86} x2={300} y2={112} stroke="#f59e0b" strokeWidth={0.8} />
        <rect x={244} y={54} width={112} height={32} rx={4}
          fill="#f59e0b" fillOpacity={0.1} stroke="#f59e0b" strokeWidth={0.5} />
        <text x={300} y={70} textAnchor="middle" fontSize={9} fontWeight={600} fill="#f59e0b">Summary B</text>
        <text x={300} y={81} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)">A + 새 30턴</text>

        {/* 3차 압축 */}
        <circle cx={460} cy={120} r={8} fill="#10b981" />
        <text x={460} y={148} textAnchor="middle" fontSize={9} fontWeight={700} fill="#10b981">3차</text>
        <line x1={460} y1={86} x2={460} y2={112} stroke="#10b981" strokeWidth={0.8} />
        <rect x={404} y={54} width={112} height={32} rx={4}
          fill="#10b981" fillOpacity={0.1} stroke="#10b981" strokeWidth={0.5} />
        <text x={460} y={70} textAnchor="middle" fontSize={9} fontWeight={600} fill="#10b981">Summary C</text>
        <text x={460} y={81} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)">B + 새 30턴</text>

        {/* 병합 화살표 */}
        <path d="M 196 70 Q 248 42 244 70" stroke="#f59e0b" strokeWidth={1}
          fill="none" strokeDasharray="2 2" />
        <path d="M 356 70 Q 408 42 404 70" stroke="#10b981" strokeWidth={1}
          fill="none" strokeDasharray="2 2" />

        {/* 병합 로직 */}
        <rect x={40} y={176} width={480} height={140} rx={8}
          fill="var(--muted)" opacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={280} y={198} textAnchor="middle" fontSize={11} fontWeight={700}
          fill="var(--foreground)">merge_compact_summaries() 필드별 전략</text>

        <g transform="translate(58, 214)">
          <text x={0} y={12} fontSize={9.5} fontWeight={600} fill="var(--foreground)">scope:</text>
          <text x={82} y={12} fontSize={9.5} fill="var(--muted-foreground)">문자열 결합 (range accumulation)</text>

          <text x={0} y={28} fontSize={9.5} fontWeight={600} fill="var(--foreground)">current_work:</text>
          <text x={112} y={28} fontSize={9.5} fill="var(--muted-foreground)">최신값 우선 (staleness 방지)</text>

          <text x={0} y={44} fontSize={9.5} fontWeight={600} fill="var(--foreground)">tool_usage:</text>
          <text x={100} y={44} fontSize={9.5} fill="var(--muted-foreground)">카운터 누적 (Read: 45 + 30 = 75)</text>

          <text x={0} y={60} fontSize={9.5} fontWeight={600} fill="var(--foreground)">timeline:</text>
          <text x={82} y={60} fontSize={9.5} fill="var(--muted-foreground)">시간순 merge sort · 50개 상한</text>

          <text x={0} y={76} fontSize={9.5} fontWeight={600} fill="var(--foreground)">pending:</text>
          <text x={76} y={76} fontSize={9.5} fill="var(--muted-foreground)">합집합 (set union)</text>

          <text x={0} y={92} fontSize={9.5} fontWeight={700} fill="#10b981">결과:</text>
          <text x={64} y={92} fontSize={9.5} fill="var(--muted-foreground)">무한 대화 가능 (메타데이터만 누적)</text>
        </g>
      </svg>
    </div>
  );
}
