import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';

const STEPS = [
  {
    label: 'Step 1 — INIT: 토큰 생성 시작',
    body: 'Realm Guest가 RSI_ATTESTATION_TOKEN_INIT 호출.\n사용자 nonce(challenge[8]) 64B 전달 → replay 방어.\nRMM이 토큰 총 크기를 res.a0로 반환.',
  },
  {
    label: 'Step 2 — CONTINUE: chunk 전송 루프',
    body: 'RSI_ATTESTATION_TOKEN_CONTINUE를 PAGE_SIZE 단위로 반복.\nRealm 측 token_buf의 PA를 RMM에 전달 → RMM이 직접 채움.\n2단계 호출 이유: 토큰 크기가 1페이지 초과 가능 (REM + Platform Token).',
  },
  {
    label: 'Step 3 — Token 완성',
    body: 'offset이 total_size에 도달하면 종료.\nRealm은 완성된 CCA Attestation Token(CBOR + COSE)을 보유.\n검증자에게 전송 → IAK·RAK 체인으로 신뢰 확인.',
  },
];

export default function RsiTokenFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full h-auto" style={{ maxWidth: 640 }}>
          <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700}
            fill="#10b981">RSI Attestation Token — INIT + CONTINUE</text>

          <defs>
            <marker id="rtf-arr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
              <path d="M0,0 L4,2.5 L0,5" fill="#8b5cf6" />
            </marker>
          </defs>

          <ModuleBox x={20} y={40} w={120} h={60}
            label="Realm Guest" sub="RSI 호출자" color="#10b981" />
          <ModuleBox x={340} y={40} w={120} h={60}
            label="RMM" sub="EL2 Realm" color="#f59e0b" />

          {/* INIT */}
          {step >= 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}>
              <line x1={140} y1={60} x2={340} y2={60}
                stroke={step === 0 ? '#10b981' : '#94a3b8'} strokeWidth={1.4}
                markerEnd="url(#rtf-arr)" />
              <text x={240} y={54} textAnchor="middle" fontSize={8} fontWeight={700}
                fill="#10b981">RSI_ATTESTATION_TOKEN_INIT</text>
              <text x={240} y={73} textAnchor="middle" fontSize={7}
                fill="var(--muted-foreground)">challenge[0..7] (64B nonce)</text>
            </motion.g>
          )}

          {/* CONTINUE loop */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}>
              <line x1={140} y1={88} x2={340} y2={88}
                stroke={step === 1 ? '#10b981' : '#94a3b8'} strokeWidth={1.4}
                markerEnd="url(#rtf-arr)" />
              <text x={240} y={84} textAnchor="middle" fontSize={8} fontWeight={700}
                fill="#10b981">RSI_ATTESTATION_TOKEN_CONTINUE × N</text>
              <text x={240} y={97} textAnchor="middle" fontSize={7}
                fill="var(--muted-foreground)">granule_pa, offset, chunk = PAGE_SIZE</text>
            </motion.g>
          )}

          {/* Token */}
          <DataBox x={170} y={130} w={140} h={32}
            label="Token Buffer" sub={step >= 2 ? '완성됨' : '채워지는 중'}
            color={step >= 2 ? '#10b981' : '#f59e0b'} outlined />

          {step >= 2 && (
            <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}>
              <ActionBox x={170} y={175} w={140} h={32}
                label="외부 Verifier 전송" sub="CBOR + COSE_Sign1" color="#8b5cf6" />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
