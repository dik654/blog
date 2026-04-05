import { DataBox, ActionBox } from '@/components/viz/boxes';

export default function ReadWriteViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 280" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">edit_file — 고유성 보장 메커니즘</text>

        {/* 입력 */}
        <DataBox x={30} y={66} w={140} h={48}
          label="old_string"
          sub="대체 대상 문자열"
          color="#3b82f6" />

        <ActionBox x={210} y={66} w={140} h={48}
          label="content.matches()"
          sub="발견 횟수 카운트"
          color="#f59e0b" />

        {/* 결과 분기 */}
        <DataBox x={390} y={38} w={140} h={34}
          label="0 matches"
          sub="Err: not found"
          color="#ef4444" />

        <DataBox x={390} y={78} w={140} h={34}
          label="1 match"
          sub="Ok: replace"
          color="#10b981" />

        <DataBox x={390} y={118} w={140} h={34}
          label="2+ matches"
          sub="Err: 모호함"
          color="#ef4444" />

        <defs>
          <marker id="rw-arr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
            <path d="M0,0 L4,2.5 L0,5" fill="#3b82f6" />
          </marker>
        </defs>

        <line x1={170} y1={90} x2={210} y2={90} stroke="#3b82f6" strokeWidth={1.2} markerEnd="url(#rw-arr)" />
        <line x1={350} y1={90} x2={390} y2={55} stroke="#ef4444" strokeWidth={1} strokeDasharray="3 2" markerEnd="url(#rw-arr)" />
        <line x1={350} y1={90} x2={390} y2={95} stroke="#10b981" strokeWidth={1.5} markerEnd="url(#rw-arr)" />
        <line x1={350} y1={90} x2={390} y2={135} stroke="#ef4444" strokeWidth={1} strokeDasharray="3 2" markerEnd="url(#rw-arr)" />

        {/* 왜 모호하면 거부? */}
        <rect x={30} y={172} width={500} height={92} rx={8}
          fill="var(--muted)" opacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={280} y={194} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">왜 2+ 매칭을 거부하는가</text>

        <text x={48} y={216} fontSize={9.5} fontWeight={600} fill="#ef4444">위험:</text>
        <text x={92} y={216} fontSize={9.5} fill="var(--muted-foreground)">LLM이 의도한 위치와 다른 곳 수정 가능</text>

        <text x={48} y={234} fontSize={9.5} fontWeight={600} fill="#10b981">대안:</text>
        <text x={92} y={234} fontSize={9.5} fill="var(--muted-foreground)">더 많은 컨텍스트 추가 또는 replace_all=true</text>

        <text x={48} y={252} fontSize={9.5} fontWeight={600} fill="#3b82f6">효과:</text>
        <text x={92} y={252} fontSize={9.5} fill="var(--muted-foreground)">잘못된 위치 수정 버그 사실상 제거</text>
      </svg>
    </div>
  );
}
