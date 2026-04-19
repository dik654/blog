import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, DataBox } from '@/components/viz/boxes';

const STEPS = [
  { label: 'Ethereum eth_call — 익명·서명 불필요', body: '일반 view function 은 누구나 호출 가능.\nmsg.sender = 0x0 (또는 클라이언트 지정 가짜).' },
  { label: 'Sapphire 기밀 view — signed query 필요', body: 'sapphire.wrap(signer) 가 SignedQueryEnvelope 생성.\n호출자 서명 포함 → msg.sender 인증.' },
  { label: 'Runtime: envelope 검증 + msg.sender 설정', body: '서명 검증 → msg.sender = signer.address.\nview function 실행 (상태 변경 없음).' },
  { label: '결과를 shared secret 으로 암호화 반환', body: 'returnData 도 암호화.\n"내 데이터만 보기" 패턴 — 호출자만 평문 획득.' },
];

export default function SignedQueryViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: ethereum baseline */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={20}  y={50} w={130} h={50} label="Client" sub="anonymous" color="#94a3b8" />
              <ModuleBox x={330} y={50} w={130} h={50} label="Ethereum" sub="eth_call" color="#94a3b8" />
              <motion.line x1={150} y1={75} x2={330} y2={75}
                stroke="#94a3b8" strokeWidth={1.2}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
              <DataBox x={170} y={120} w={140} h={28}
                label="msg.sender = 0x0" color="#94a3b8" outlined />
              <text x={240} y={175} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                서명 없음 → 신원 검증 불가
              </text>
            </motion.g>
          )}

          {/* Step 1: sapphire signed query */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={20}  y={50} w={130} h={50}
                label="Client" sub="signer wrapped" color="#10b981" />
              <ActionBox x={170} y={56} w={150} h={42}
                label="SignedQueryEnvelope" color="#3b82f6" />
              <ModuleBox x={340} y={50} w={130} h={50}
                label="Sapphire" sub="(SGX)" color="#ec4899" />
              <motion.line x1={150} y1={75} x2={170} y2={75}
                stroke="#10b981" strokeWidth={1.2}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
              <motion.line x1={320} y1={75} x2={340} y2={75}
                stroke="#3b82f6" strokeWidth={1.2}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 }} />
              <DataBox x={170} y={120} w={150} h={28}
                label="signer.signature" color="#3b82f6" outlined />
              <text x={245} y={175} textAnchor="middle" fontSize={9} fill="#3b82f6" fontWeight={600}>
                Auth: signature = Authentication
              </text>
            </motion.g>
          )}

          {/* Step 2: runtime verify */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {[
                { name: 'verify sig',          x: 25,  color: '#10b981' },
                { name: 'set msg.sender',      x: 170, color: '#3b82f6' },
                { name: 'view fn execute',     x: 315, color: '#a855f7' },
              ].map((p, i) => (
                <motion.g key={p.name}
                  initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.15 }}>
                  <ActionBox x={p.x} y={70} w={140} h={42} label={p.name} color={p.color} />
                  {i < 2 && (
                    <line x1={p.x + 140} y1={91} x2={p.x + 145} y2={91}
                      stroke={p.color} strokeWidth={1.2} />
                  )}
                </motion.g>
              ))}
              <DataBox x={150} y={130} w={180} h={28}
                label="msg.sender = signer.addr" color="#3b82f6" outlined />
              <text x={240} y={175} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                권한 검증 후 view 실행 (상태 변경 없음)
              </text>
            </motion.g>
          )}

          {/* Step 3: encrypted return */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={20}  y={50} w={130} h={50} label="Client" color="#10b981" />
              <ModuleBox x={330} y={50} w={130} h={50} label="Sapphire" color="#ec4899" />
              <motion.line x1={330} y1={75} x2={150} y2={75}
                stroke="#a855f7" strokeWidth={1.5}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
              <DataBox x={170} y={120} w={150} h={28}
                label="encrypted result" color="#a855f7" outlined />
              <text x={240} y={175} textAnchor="middle" fontSize={9} fill="#a855f7" fontWeight={600}>
                호출자만 shared secret 으로 복호화 가능
              </text>
              <text x={240} y={195} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                "내 데이터만 보기" 패턴 — privacy-preserving view
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
