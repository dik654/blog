import { motion } from 'framer-motion';

const HOST = '#ef4444';
const SEAM = '#8b5cf6';
const REG = '#3b82f6';
const ERR = '#f59e0b';

interface Step { num: number; title: string; detail: string; color: string; }

const FLOW: Step[] = [
  { num: 1, title: 'CPU가 VMX Root 상태 저장', detail: '현재 레지스터 + VMCS save', color: HOST },
  { num: 2, title: 'SEAM 모드 진입', detail: 'SEAMRR에서 TD Module 코드 fetch', color: SEAM },
  { num: 3, title: '입력 파라미터 검증', detail: 'PAMT 상태 검사 + arg 범위 체크', color: SEAM },
  { num: 4, title: '요청된 TDH 함수 실행', detail: 'TDH.MNG.CREATE / TDH.MEM.PAGE.ADD 등', color: SEAM },
  { num: 5, title: 'SEAMRET → VMX Root 복귀', detail: 'L1D flush + IBPB + state restore', color: HOST },
  { num: 6, title: 'RAX에 결과 코드 반환', detail: '0=성공 / 0x8000_xxxx=에러', color: REG },
];

export default function SeamcallFlowViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 400" className="w-full h-auto" style={{ maxWidth: 680 }}>
        <text x={240} y={18} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">SEAMCALL / SEAMRET — 명령 흐름 + 레지스터 규약</text>

        {/* ABI box */}
        <motion.g initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <rect x={20} y={32} width={440} height={56} rx={6}
            fill={REG} fillOpacity={0.08} stroke={REG} strokeWidth={1} />
          <text x={32} y={48} fontSize={9} fontWeight={700} fill={REG}>
            __seamcall ABI (arch/x86/virt/vmx/tdx/seamcall.S)
          </text>

          <rect x={32} y={56} width={195} height={26} rx={4}
            fill={REG} fillOpacity={0.1} stroke={REG} strokeWidth={0.4} />
          <text x={42} y={68} fontSize={7} fontWeight={700} fill={REG}>
            Input
          </text>
          <text x={42} y={78} fontSize={7} fontFamily="monospace" fill={REG}>
            RAX = TDH function ID
          </text>
          <text x={130} y={78} fontSize={7} fontFamily="monospace" fill={REG}>
            RCX·RDX·R8-R11 = args
          </text>

          <rect x={235} y={56} width={213} height={26} rx={4}
            fill={SEAM} fillOpacity={0.1} stroke={SEAM} strokeWidth={0.4} />
          <text x={245} y={68} fontSize={7} fontWeight={700} fill={SEAM}>
            Output (after SEAMRET)
          </text>
          <text x={245} y={78} fontSize={7} fontFamily="monospace" fill={SEAM}>
            RAX = completion status
          </text>
          <text x={365} y={78} fontSize={7} fontFamily="monospace" fill={SEAM}>
            R8-R11 = 결과
          </text>
        </motion.g>

        {/* Flow steps */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <text x={30} y={108} fontSize={9} fontWeight={700} fill="var(--foreground)">
            CPU 실행 시퀀스
          </text>
        </motion.g>

        {FLOW.map((s, i) => (
          <motion.g key={i}
            initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}>
            <rect x={20} y={116 + i * 38} width={440} height={32} rx={5}
              fill={s.color} fillOpacity={0.06} stroke={s.color} strokeWidth={0.5} />
            <rect x={20} y={116 + i * 38} width={3.5} height={32} fill={s.color} />

            <circle cx={42} cy={132 + i * 38} r={10} fill={s.color} />
            <text x={42} y={136 + i * 38} textAnchor="middle"
              fontSize={9.5} fontWeight={700} fill="white">
              {s.num}
            </text>

            <text x={60} y={130 + i * 38} fontSize={8.5} fontWeight={700} fill={s.color}>
              {s.title}
            </text>
            <text x={60} y={142 + i * 38} fontSize={7} fill="var(--muted-foreground)">
              {s.detail}
            </text>
          </motion.g>
        ))}

        {/* Failure example */}
        <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.95 }}>
          <rect x={30} y={356} width={420} height={36} rx={6}
            fill={ERR} fillOpacity={0.08} stroke={ERR} strokeWidth={0.6} strokeDasharray="3 2" />
          <text x={240} y={373} textAnchor="middle" fontSize={8.5} fontWeight={700} fill={ERR}>
            실패 예시
          </text>
          <text x={240} y={386} textAnchor="middle"
            fontSize={7.5} fontFamily="monospace" fill={ERR}>
            RAX = 0x8000_0001_0000_0001 → ENTROPY_FAIL (TD 키 생성 엔트로피 부족)
          </text>
        </motion.g>
      </svg>
    </div>
  );
}
