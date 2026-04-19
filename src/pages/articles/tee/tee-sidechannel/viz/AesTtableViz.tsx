import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, DataBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C_TBL = '#6366f1';
const C_KEY = '#ef4444';
const C_FIX = '#10b981';

const STEPS = [
  {
    label: 'AES T-table 구현 — 4KB × 4개 lookup',
    body: 'state[i] = T0[s ^ k0] ^ T1[s ^ k1] ^ T2[s ^ k2] ^ T3[s ^ k3].\n각 round마다 key에 따라 다른 cache line 접근 → 누출 발생.',
  },
  {
    label: '공격 — Flush+Reload로 어떤 line이 access됐는지 측정',
    body: '특정 평문으로 암호화를 유도, 공격자는 T-table cache set 관찰.\n수만~수백만 plaintext로 통계 분석 → key byte 복구.',
  },
  {
    label: '복구 시간 — 약 10⁶ encryption, 수 분',
    body: '128-bit AES 키 전체 복구가 분 단위 가능.\nOpenSSL과거 구현이 이 패턴이었다.',
  },
  {
    label: '대응 — AES-NI / Bit-sliced AES',
    body: 'AES-NI: 하드웨어 명령, table lookup 자체 없음.\nBit-sliced AES: 모든 bit를 병렬 처리 → constant-time.',
  },
];

export default function AesTtableViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {[0, 1, 2, 3].map((i) => {
                const x = 40 + i * 110;
                return (
                  <g key={i}>
                    <DataBox x={x} y={20} w={90} h={28} label={`T${i} (4KB)`} color={C_TBL} outlined />
                    <line x1={x + 45} y1={48} x2={x + 45} y2={80} stroke={C_TBL} strokeWidth={0.7} />
                    <text x={x + 45} y={94} textAnchor="middle" fontSize={9} fill={C_TBL}>
                      T{i}[s^k{i}]
                    </text>
                  </g>
                );
              })}
              <ActionBox x={140} y={110} w={200} h={36} label="state ^= T0 ^ T1 ^ T2 ^ T3" sub="round 진행" color={C_KEY} />
              <text x={240} y={170} textAnchor="middle" fontSize={9} fill={C_KEY}>
                key byte → cache line 접근 패턴 결정
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={20} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={C_KEY}>
                T-table cache set 관찰
              </text>
              {Array.from({ length: 16 }).map((_, i) => {
                const x = 40 + i * 25;
                const hot = [3, 11].includes(i);
                return (
                  <motion.rect key={i} x={x} y={40} width={20} height={26} rx={3}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                    fill={hot ? C_KEY : `${C_TBL}30`} />
                );
              })}
              <ActionBox x={140} y={84} w={200} h={32} label="Flush+Reload (1 line/probe)" color={C_KEY} />
              <text x={240} y={140} textAnchor="middle" fontSize={9} fill={C_KEY}>
                특정 라인이 hot → key byte 후보 좁히기
              </text>
              <text x={240} y={158} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                통계 분석 → byte 단위 key 복구
              </text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={30} textAnchor="middle" fontSize={10} fontWeight={700} fill={C_KEY}>
                ~10⁶ encryptions → 128-bit AES key
              </text>
              <rect x={40} y={50} width={400} height={20} rx={4} fill={`${C_KEY}15`} stroke={C_KEY} />
              <motion.rect x={40} y={50} height={20} rx={4} fill={C_KEY}
                initial={{ width: 0 }} animate={{ width: 400 }} transition={{ duration: 1.2 }} />
              <text x={240} y={64} textAnchor="middle" fontSize={9} fontWeight={700} fill="white">
                key 복구 진행
              </text>
              <text x={240} y={100} textAnchor="middle" fontSize={9} fill={C_KEY}>
                실전: 수 분 내 완료 (단일 코어)
              </text>
              <text x={240} y={140} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                OpenSSL 과거 구현이 이 패턴이었다 — 현재는 AES-NI로 교체
              </text>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <DataBox x={40} y={30} w={180} h={32} label="AES-NI 하드웨어 명령" color={C_FIX} outlined />
              <text x={130} y={78} textAnchor="middle" fontSize={9} fill={C_FIX}>
                table lookup 없음
              </text>
              <DataBox x={260} y={30} w={180} h={32} label="Bit-sliced AES" color={C_FIX} outlined />
              <text x={350} y={78} textAnchor="middle" fontSize={9} fill={C_FIX}>
                bit-parallel constant-time
              </text>
              <DataBox x={120} y={120} w={240} h={32} label="Table을 cache line 경계에 정렬 안 함" color={C_FIX} outlined />
              <text x={240} y={180} textAnchor="middle" fontSize={9} fill={C_FIX}>
                현대 crypto 라이브러리는 모두 적용 완료
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
