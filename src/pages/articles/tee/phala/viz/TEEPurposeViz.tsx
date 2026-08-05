import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, AlertBox } from '@/components/viz/boxes';

const STEPS = [
  { label: '목적 1: Off-chain computation 신뢰성 — Oracle 결과를 TEE 안에서 실행해 위변조 차단' },
  { label: '목적 2: 기밀 데이터 처리 — 민감 입력은 TEE 내부 평문, 결과만 on-chain' },
  { label: '목적 3: AI 모델 실행 — LLM 추론과 프롬프트·API 키 보호' },
  { label: '목적 4: Heavy compute off-chain — gas/TPS 한계 우회, 결과만 commit' },
  { label: '한계 인식 — Intel TCB 의존, SGX HW 진입장벽, 사이드채널 위험' },
];

const PURPOSES = [
  {
    title: 'Off-chain computation 신뢰성',
    rows: [
      { kind: 'in',  text: 'External API call (HTTPS)' },
      { kind: 'tee', text: 'TEE 안에서 결과 처리 + 서명' },
      { kind: 'out', text: 'Signed result → on-chain commit' },
    ],
    color: '#6366f1',
    note: 'Chainlink + committee 대안 — 단일 TEE 노드도 신뢰 가능',
  },
  {
    title: '기밀 데이터 처리',
    rows: [
      { kind: 'in',  text: 'Medical / Financial input (encrypted)' },
      { kind: 'tee', text: 'TEE에서만 평문 처리' },
      { kind: 'out', text: 'Aggregated result on-chain' },
    ],
    color: '#10b981',
    note: '입력은 블록체인에 노출되지 않음 — GDPR/HIPAA 준수 가능',
  },
  {
    title: 'AI 모델 실행',
    rows: [
      { kind: 'in',  text: 'Prompt + API key (encrypted)' },
      { kind: 'tee', text: 'LLM inference inside enclave' },
      { kind: 'out', text: 'Encrypted response + signed proof' },
    ],
    color: '#f59e0b',
    note: 'Privacy-preserving AI agent — Phala가 2024 핵심 비전으로 채택',
  },
  {
    title: 'Heavy compute off-chain',
    rows: [
      { kind: 'in',  text: '복잡 연산 (gas 한계 초과)' },
      { kind: 'tee', text: 'TEE에서 자유롭게 실행' },
      { kind: 'out', text: 'Hash/root만 on-chain commit' },
    ],
    color: '#0ea5e9',
    note: 'Optimistic rollup의 대안 — TEE 서명으로 즉시 확정',
  },
];

const LIMITS = [
  { label: 'Intel 의존', sub: 'TCB 신뢰 필요', color: '#ef4444' },
  { label: 'SGX 요구', sub: 'HW 진입 장벽', color: '#ef4444' },
  { label: '사이드채널', sub: '캐시 timing 공격', color: '#ef4444' },
];

const KIND_COLORS: Record<string, string> = { in: '#6b7280', tee: '#10b981', out: '#6366f1' };

export default function TEEPurposeViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step < 4 && (() => {
            const p = PURPOSES[step];
            return (<g>
              <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill={p.color}>
                {p.title}
              </text>
              {p.rows.map((r, i) => {
                const c = KIND_COLORS[r.kind];
                return (
                  <motion.g key={i}
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.15 }}>
                    <rect x={60} y={42 + i * 38} width={400} height={28} rx={5}
                      fill={`${c}12`} stroke={`${c}50`} strokeWidth={0.8} />
                    <rect x={60} y={42 + i * 38} width={4} height={28} fill={c} />
                    <text x={80} y={60 + i * 38} fontSize={8.5} fontWeight={700} fill={c}
                      style={{ fontFamily: 'monospace' }}>{r.kind.toUpperCase()}</text>
                    <text x={120} y={60 + i * 38} fontSize={10} fill="var(--foreground)">{r.text}</text>
                  </motion.g>
                );
              })}
              <text x={260} y={180} textAnchor="middle" fontSize={9.5}
                fill="var(--muted-foreground)" fontStyle="italic">{p.note}</text>
            </g>);
          })()}
          {step === 4 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ef4444">
              한계 인식
            </text>
            {LIMITS.map((l, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.12 }}>
                <AlertBox x={40 + i * 155} y={60} w={140} h={60} label={l.label} sub={l.sub} color={l.color} />
              </motion.g>
            ))}
            <text x={260} y={150} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
              "TEE는 만능이 아니다" — Multi-party + ZKP와 결합 트렌드
            </text>
            <text x={260} y={170} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
              Defense-in-depth: TEE + on-chain consensus + 다중 워커 검증
            </text>
          </g>)}
        </svg>
      )}
    </StepViz>
  );
}
