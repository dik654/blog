import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'Initial 암호화', body: '연결 시작 패킷도 HKDF 파생 키로 암호화. 완전 평문 전송 불가.' },
  { label: 'Handshake 암호화', body: 'TLS 핸드셰이크 진행 중 중간 키로 보호. 서버 인증서도 암호화.' },
  { label: '1-RTT 데이터 암호화', body: '핸드셰이크 완료 후 AEAD(AES-GCM/ChaCha20)로 페이로드 암호화.' },
  { label: 'Header Protection', body: '패킷 번호를 별도 키로 암호화. 트래픽 분석 공격 방어.' },
];

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const LEVELS = [
  { label: 'Initial', c: '#64748b', y: 20 },
  { label: 'Handshake', c: '#f59e0b', y: 60 },
  { label: '1-RTT', c: '#10b981', y: 100 },
  { label: 'Header Protection', c: '#6366f1', y: 140 },
];

export default function SecurityViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 400 170" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {LEVELS.map((lv, i) => (
            <motion.g key={i} animate={{ opacity: i === step ? 1 : 0.2 }} transition={sp}>
              <rect x={30} y={lv.y} width={340} height={30} rx={5}
                fill={lv.c + '12'} stroke={lv.c} strokeWidth={i === step ? 1.5 : 1} />
              <text x={50} y={lv.y + 19} fontSize={10} fontWeight={600} fill={lv.c}>{lv.label}</text>
              {/* Lock icon */}
              <rect x={330} y={lv.y + 8} width={14} height={12} rx={2}
                fill={lv.c + '30'} stroke={lv.c} strokeWidth={1} />
              <motion.path
                d={`M${334},${lv.y + 8} v-4 a4,4 0 0 1 8,0 v4`}
                fill="none" stroke={lv.c} strokeWidth={1.2}
                animate={{ pathLength: i <= step ? 1 : 0 }}
                transition={{ duration: 0.4 }}
              />
              {/* Encryption detail */}
              {i === step && (
                <motion.text x={200} y={lv.y + 19} textAnchor="middle" fontSize={10}
                  fill={lv.c} initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}>
                  {['HKDF 파생 키', 'TLS 중간 키', 'AEAD 암호화', '패킷 번호 마스킹'][i]}
                </motion.text>
              )}
            </motion.g>
          ))}
        </svg>
      )}
    </StepViz>
  );
}
