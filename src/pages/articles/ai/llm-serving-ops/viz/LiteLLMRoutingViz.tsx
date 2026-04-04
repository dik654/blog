import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.2, duration: 0.5 };

const PROVIDERS = [
  { label: 'OpenAI', y: 20, color: '#10b981' },
  { label: 'Anthropic', y: 68, color: '#f59e0b' },
  { label: 'vLLM (self)', y: 116, color: '#6366f1' },
];

const STEPS = [
  { label: '요청 수신', body: 'OpenAI-compatible API 엔드포인트로 요청 도착\n모든 클라이언트가 동일한 인터페이스 사용' },
  { label: '모델 라우팅', body: 'model_list config에서 매칭되는 모델 탐색\nstrategy: least-busy / usage-based-routing' },
  { label: 'Provider 호출', body: '선택된 프로바이더로 요청 전달\n타임아웃·재시도 설정 적용' },
  { label: '폴백 처리', body: 'Primary 실패 시 fallbacks 목록 순회\n자동으로 다음 프로바이더 시도' },
  { label: '응답 + 비용 기록', body: '토큰 사용량·비용 DB에 기록\n→ 예산 초과 시 차단 또는 저비용 모델로 전환' },
];

export default function LiteLLMRoutingViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 540 170" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Request */}
          <rect x={15} y={55} width={75} height={36} rx={5}
            fill="#3b82f608" stroke="#3b82f6" strokeWidth={step === 0 ? 2 : 0.8} />
          <text x={52} y={77} textAnchor="middle" fontSize={11} fill="#3b82f6">요청</text>

          {/* LiteLLM */}
          <motion.g animate={{ opacity: step >= 1 ? 1 : 0.3 }} transition={sp}>
            <rect x={140} y={35} width={130} height={80} rx={6}
              fill={step >= 1 && step <= 2 ? '#3b82f615' : '#3b82f608'}
              stroke="#3b82f6" strokeWidth={step >= 1 && step <= 2 ? 2 : 0.8} />
            <text x={205} y={60} textAnchor="middle" fontSize={12} fontWeight={700} fill="#3b82f6">LiteLLM</text>
            <text x={205} y={78} textAnchor="middle" fontSize={10} fill="#3b82f6" opacity={0.7}>Proxy</text>
            <text x={205} y={96} textAnchor="middle" fontSize={10} fill="#3b82f6" opacity={0.5}>
              {step === 1 ? 'routing...' : step === 3 ? 'fallback...' : step === 4 ? '비용 기록' : ''}
            </text>
          </motion.g>

          <line x1={92} y1={73} x2={138} y2={73} stroke="var(--muted-foreground)" strokeWidth={0.8}
            markerEnd="url(#arrGray)" opacity={step >= 1 ? 0.6 : 0.2} />

          {/* Providers */}
          {PROVIDERS.map((p, i) => {
            const targeted = step === 2 && i === 2;
            const fallback = step === 3 && i === 1;
            const failed = step === 3 && i === 2;
            return (
              <motion.g key={p.label} animate={{ opacity: step >= 2 ? 1 : 0.2 }} transition={sp}>
                <rect x={330} y={p.y} width={90} height={34} rx={5}
                  fill={targeted || fallback ? `${p.color}18` : failed ? '#ef444415' : `${p.color}08`}
                  stroke={failed ? '#ef4444' : p.color}
                  strokeWidth={targeted || fallback ? 2 : 0.8} />
                <text x={375} y={p.y + 21} textAnchor="middle" fontSize={11}
                  fill={failed ? '#ef4444' : p.color} fontWeight={targeted || fallback ? 700 : 400}>
                  {p.label}{failed ? ' ✗' : ''}
                </text>
                <line x1={272} y1={73} x2={328} y2={p.y + 17}
                  stroke={targeted || fallback ? p.color : 'var(--muted-foreground)'}
                  strokeWidth={targeted || fallback ? 1.5 : 0.6}
                  strokeDasharray={targeted || fallback ? '' : '3 2'}
                  opacity={step >= 2 ? 0.6 : 0.15} />
              </motion.g>
            );
          })}

          {/* Cost tracking */}
          {step >= 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <rect x={435} y={60} width={90} height={28} rx={4}
                fill="#f59e0b10" stroke="#f59e0b" strokeWidth={1} />
              <text x={480} y={78} textAnchor="middle" fontSize={10} fill="#f59e0b">$0.003 / req</text>
            </motion.g>
          )}

          <defs>
            <marker id="arrGray" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="var(--muted-foreground)" />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
