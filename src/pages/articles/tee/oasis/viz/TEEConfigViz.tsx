import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'TEE 선택 모드', body: 'auto: 하드웨어 TEE 사용 가능하면 자동 선택.\nhardware: 하드웨어 TEE 강제.\nnone: TEE 비활성화 (개발용).' },
  { label: 'TEE 종류 & 신원', body: 'TEEKindNone(0): TEE 없음.\nTEEKindSGX(1): Intel SGX.\n엔클레이브 신원은 MRENCLAVE(코드 해시)와 MRSIGNER(서명자 해시)로 식별.' },
  { label: '엔클레이브 신원 (EnclaveIdentity)', body: 'MrEnclave: 엔클레이브 코드 전체의 해시 — 무결성 검증.\nMrSigner: 서명자 키의 해시 — 개발자 신원 확인.' },
  { label: 'RA-TLS 보안 채널', body: 'TLS 인증서에 SGX Quote 첨부 → 상대방이 Quote 검증 후 TLS 연결 수립.\n키 매니저 ↔ 컴퓨트 워커 간 보안 채널.' },
];

const BLOCKS = [
  { label: 'auto', sub: '자동', x: 70, color: '#6366f1' },
  { label: 'hardware', sub: 'SGX 강제', x: 175, color: '#6366f1' },
  { label: 'none', sub: '비활성화', x: 280, color: '#6366f1' },
];

export default function TEEConfigViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 540 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* TEE Modes row */}
          {BLOCKS.map((b, i) => (
            <g key={b.label}>
              <motion.rect x={b.x - 42} y={15} width={84} height={38} rx={6}
                fill={step === 0 ? `${b.color}18` : `${b.color}06`}
                stroke={step === 0 ? b.color : `${b.color}30`}
                strokeWidth={step === 0 ? 1.8 : 0.6}
                animate={{ opacity: step === 0 ? 1 : 0.25 }} />
              <text x={b.x} y={33} textAnchor="middle" fontSize={10} fontWeight={600}
                fill={step === 0 ? b.color : 'var(--muted-foreground)'}>{b.label}</text>
              <text x={b.x} y={47} textAnchor="middle" fontSize={10}
                fill="var(--muted-foreground)">{b.sub}</text>
            </g>
          ))}

          {/* Enclave Identity block */}
          <motion.rect x={350} y={15} width={170} height={38} rx={6}
            fill={step === 1 || step === 2 ? '#10b98118' : '#10b98106'}
            stroke={step === 1 || step === 2 ? '#10b981' : '#10b98130'}
            strokeWidth={step === 1 || step === 2 ? 1.8 : 0.6}
            animate={{ opacity: step === 1 || step === 2 ? 1 : 0.25 }} />
          <text x={435} y={30} textAnchor="middle" fontSize={10} fontWeight={600}
            fill={step === 2 ? '#10b981' : 'var(--muted-foreground)'}>MRENCLAVE</text>
          <text x={435} y={46} textAnchor="middle" fontSize={10}
            fill={step === 2 ? '#10b981' : 'var(--muted-foreground)'}>MRSIGNER</text>

          {/* RA-TLS section */}
          <motion.rect x={80} y={80} width={380} height={60} rx={8}
            fill={step === 3 ? '#f59e0b14' : '#f59e0b06'}
            stroke={step === 3 ? '#f59e0b' : '#f59e0b20'}
            strokeWidth={step === 3 ? 2 : 0.6}
            animate={{ opacity: step === 3 ? 1 : 0.2 }} />
          <text x={270} y={102} textAnchor="middle" fontSize={11} fontWeight={700}
            fill={step === 3 ? '#f59e0b' : 'var(--muted-foreground)'}>RA-TLS</text>
          {['TLS cert + SGX Quote', '→ Quote 검증', '→ 보안 채널'].map((t, i) => (
            <text key={t} x={130 + i * 120} y={128} textAnchor="middle" fontSize={10}
              fill="var(--muted-foreground)">{t}</text>
          ))}
        </svg>
      )}
    </StepViz>
  );
}
