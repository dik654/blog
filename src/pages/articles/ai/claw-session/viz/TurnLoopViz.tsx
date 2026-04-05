import { ActionBox, AlertBox } from '@/components/viz/boxes';

export default function TurnLoopViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 380" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">run_turn() — 8단계 에이전트 루프</text>

        <defs>
          <marker id="tl-arr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
            <path d="M0,0 L4,2.5 L0,5" fill="#3b82f6" />
          </marker>
        </defs>

        {[
          { label: '1. 사용자 메시지 추가', color: '#3b82f6' },
          { label: '2. 컨텍스트 체크 (compact?)', color: '#f59e0b' },
          { label: '3. API 호출 (streaming)', color: '#8b5cf6' },
          { label: '4. 스트림 파싱', color: '#8b5cf6' },
          { label: '5. Assistant 응답 기록', color: '#3b82f6' },
          { label: '6. tool_use 추출', color: '#10b981' },
          { label: '7. 병렬 도구 실행', color: '#10b981' },
          { label: '8. tool_result 추가', color: '#3b82f6' },
        ].map((step, i) => (
          <g key={i}>
            <rect x={70} y={54 + i * 36} width={420} height={30} rx={4}
              fill={step.color} fillOpacity={0.1} stroke={step.color} strokeWidth={0.8} />
            <rect x={70} y={54 + i * 36} width={4} height={30} fill={step.color} rx={1} />
            <text x={90} y={73 + i * 36} fontSize={10.5} fontWeight={600}
              fill={step.color}>{step.label}</text>
            {i < 7 && (
              <line x1={280} y1={84 + i * 36} x2={280} y2={90 + i * 36}
                stroke="#3b82f6" strokeWidth={1} markerEnd="url(#tl-arr)" />
            )}
          </g>
        ))}

        {/* 루프 체크 */}
        <path d="M 495 226 Q 532 178 532 106 Q 532 62 495 70" stroke="#ef4444"
          strokeWidth={1.5} fill="none" strokeDasharray="4 2" markerEnd="url(#tl-arr)" />
        <text x={546} y={154} fontSize={9} fontWeight={600} fill="#ef4444"
          transform="rotate(90 546 154)">tool_use 있으면 루프</text>

        {/* 종료 조건 */}
        <AlertBox x={70} y={342} w={420} h={30}
          label="종료: tool_use 없음 (최대 25턴)"
          sub=""
          color="#ef4444" />
      </svg>
    </div>
  );
}
