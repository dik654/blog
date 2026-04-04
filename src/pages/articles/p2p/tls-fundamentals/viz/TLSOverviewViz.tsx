import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'TLS 1.2 핸드셰이크', body: '2-RTT 필요. ClientHello → ServerHello → 키 교환 → Finished. 레거시 암호(RC4, CBC) 허용.' },
  { label: 'TLS 1.3 핸드셰이크', body: '1-RTT로 단축. 첫 메시지에 key_share 포함. ECDHE 필수, 레거시 암호 전면 제거.' },
  { label: '비교: 성능 & 보안', body: '1.3은 RTT 절반 + 위험한 알고리즘 제거. 0-RTT 재연결까지 지원.' },
];

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { old: '#ef4444', neo: '#6366f1', ok: '#10b981', warn: '#f59e0b' };

export default function TLSOverviewViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 460 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* TLS 1.2 */}
          <motion.g animate={{ opacity: step === 1 ? 0.15 : 1, x: step === 2 ? -6 : 0 }} transition={sp}>
            <text x={100} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.old}>TLS 1.2</text>
            {[
              { y: 22, label: 'ClientHello', c: C.old },
              { y: 50, label: 'ServerHello + Cert', c: C.old },
              { y: 78, label: 'Key Exchange', c: C.warn },
              { y: 106, label: 'Finished', c: C.old },
            ].map((r, i) => (
              <g key={i}>
                <rect x={20} y={r.y} width={160} height={22} rx={4} fill={r.c + '12'} stroke={r.c} strokeWidth={1.2} />
                <text x={100} y={r.y + 14} textAnchor="middle" fontSize={10} fontWeight={600} fill={r.c}>{r.label}</text>
              </g>
            ))}
            <text x={100} y={145} textAnchor="middle" fontSize={10} fill={C.old} fontWeight={600}>2-RTT</text>
          </motion.g>
          {/* TLS 1.3 */}
          <motion.g animate={{ opacity: step === 0 ? 0.15 : 1, x: step === 2 ? 6 : 0 }} transition={sp}>
            <text x={360} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.neo}>TLS 1.3</text>
            {[
              { y: 22, label: 'ClientHello + key_share', c: C.neo },
              { y: 50, label: 'ServerHello + Encrypted', c: C.ok },
              { y: 78, label: 'Finished', c: C.neo },
            ].map((r, i) => (
              <g key={i}>
                <rect x={260} y={r.y} width={200} height={22} rx={4} fill={r.c + '12'} stroke={r.c} strokeWidth={1.2} />
                <text x={360} y={r.y + 14} textAnchor="middle" fontSize={10} fontWeight={600} fill={r.c}>{r.label}</text>
              </g>
            ))}
            <text x={360} y={118} textAnchor="middle" fontSize={10} fill={C.neo} fontWeight={600}>1-RTT</text>
          </motion.g>
          {/* Comparison badges */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={20} y={132} width={160} height={16} rx={3} fill={C.old + '15'} stroke={C.old} strokeWidth={1} />
              <text x={100} y={143} textAnchor="middle" fontSize={10} fill={C.old}>RC4, CBC, SHA-1 허용</text>
              <rect x={260} y={132} width={200} height={16} rx={3} fill={C.ok + '15'} stroke={C.ok} strokeWidth={1} />
              <text x={360} y={143} textAnchor="middle" fontSize={10} fill={C.ok}>AEAD 전용 (AES-GCM, ChaCha20)</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
