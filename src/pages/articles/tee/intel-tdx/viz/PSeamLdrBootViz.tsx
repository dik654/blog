import { motion } from 'framer-motion';

const BIOS = '#f59e0b';
const LDR = '#8b5cf6';
const MOD = '#10b981';
const UPD = '#3b82f6';

interface Step { num: number; actor: string; action: string; color: string; }

const BOOT: Step[] = [
  { num: 1, actor: 'BIOS', action: 'SEAMRR 영역 예약 (pre-boot memory layout)', color: BIOS },
  { num: 2, actor: 'BIOS', action: 'P-SEAMLDR 로드 (BIOS 서명 ACM)', color: BIOS },
  { num: 3, actor: 'P-SEAMLDR', action: 'TD Module 바이너리 서명 검증', color: LDR },
  { num: 4, actor: 'P-SEAMLDR', action: '서명 통과 → SEAMRR에 TD Module 로드', color: LDR },
  { num: 5, actor: 'TD Module', action: '초기화 (TDH.SYS.LP.INIT)', color: MOD },
  { num: 6, actor: 'OS', action: 'TDX 사용 준비 완료', color: MOD },
];

const UPDATE: Step[] = [
  { num: 1, actor: 'Admin', action: 'TDH.SYS.UPDATE 명령 발행', color: UPD },
  { num: 2, actor: 'P-SEAMLDR', action: '새 TD Module 서명 검증', color: LDR },
  { num: 3, actor: 'P-SEAMLDR', action: '교체 (기존 TD 상태 마이그레이션)', color: LDR },
  { num: 4, actor: 'TD', action: '실행 중인 TD 영향 없음', color: MOD },
];

export default function PSeamLdrBootViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 410" className="w-full h-auto" style={{ maxWidth: 680 }}>
        <text x={240} y={18} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">P-SEAMLDR — 부팅 시퀀스 + 런타임 업그레이드</text>

        {/* Boot section header */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}>
          <rect x={20} y={32} width={440} height={20} rx={4}
            fill={BIOS} fillOpacity={0.18} stroke={BIOS} strokeWidth={0.8} />
          <text x={240} y={46} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={BIOS}>
            부팅 시퀀스 — Root of Trust 체인
          </text>
        </motion.g>

        {BOOT.map((s, i) => (
          <motion.g key={i}
            initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.12 + i * 0.1 }}>
            <rect x={20} y={58 + i * 30} width={440} height={26} rx={4}
              fill={s.color} fillOpacity={0.06} stroke={s.color} strokeWidth={0.5} />
            <rect x={20} y={58 + i * 30} width={3.5} height={26} fill={s.color} />

            <circle cx={42} cy={71 + i * 30} r={9} fill={s.color} />
            <text x={42} y={74 + i * 30} textAnchor="middle"
              fontSize={9} fontWeight={700} fill="white">
              {s.num}
            </text>

            <rect x={58} y={64 + i * 30} width={75} height={14} rx={2}
              fill={s.color} fillOpacity={0.18} stroke={s.color} strokeWidth={0.4} />
            <text x={95} y={73 + i * 30} textAnchor="middle"
              fontSize={7} fontWeight={700} fill={s.color}>
              {s.actor}
            </text>

            <text x={140} y={73 + i * 30} fontSize={7.5} fill="var(--muted-foreground)">
              {s.action}
            </text>
          </motion.g>
        ))}

        {/* Update section header */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }}>
          <rect x={20} y={246} width={440} height={20} rx={4}
            fill={UPD} fillOpacity={0.18} stroke={UPD} strokeWidth={0.8} />
          <text x={240} y={260} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={UPD}>
            런타임 업그레이드 — Seamless TD Module 교체
          </text>
        </motion.g>

        {UPDATE.map((s, i) => (
          <motion.g key={i}
            initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.85 + i * 0.1 }}>
            <rect x={20} y={272 + i * 30} width={440} height={26} rx={4}
              fill={s.color} fillOpacity={0.06} stroke={s.color} strokeWidth={0.5} />
            <rect x={20} y={272 + i * 30} width={3.5} height={26} fill={s.color} />

            <circle cx={42} cy={285 + i * 30} r={9} fill={s.color} />
            <text x={42} y={288 + i * 30} textAnchor="middle"
              fontSize={9} fontWeight={700} fill="white">
              {s.num}
            </text>

            <rect x={58} y={278 + i * 30} width={75} height={14} rx={2}
              fill={s.color} fillOpacity={0.18} stroke={s.color} strokeWidth={0.4} />
            <text x={95} y={287 + i * 30} textAnchor="middle"
              fontSize={7} fontWeight={700} fill={s.color}>
              {s.actor}
            </text>

            <text x={140} y={287 + i * 30} fontSize={7.5} fill="var(--muted-foreground)">
              {s.action}
            </text>
          </motion.g>
        ))}

        {/* Bottom note */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}>
          <text x={240} y={406} textAnchor="middle" fontSize={7.5}
            fill="var(--muted-foreground)">
            Intel 보안 패치 배포 시 TCB 업그레이드가 seamless — 실행 중 TD 영향 없음
          </text>
        </motion.g>
      </svg>
    </div>
  );
}
