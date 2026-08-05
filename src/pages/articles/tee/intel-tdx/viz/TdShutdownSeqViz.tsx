import { motion } from 'framer-motion';

const FLUSH = '#f59e0b';
const KEY = '#8b5cf6';
const CLEAN = '#10b981';
const WARN = '#ef4444';

interface Step { num: number; api: string; effect: string; color: string; }

const STEPS: Step[] = [
  { num: 1, api: 'TDH.VP.FLUSH', effect: '각 vCPU 캐시 flush', color: FLUSH },
  { num: 2, api: 'TDH.MNG.VPFLUSHDONE', effect: '플러시 완료 확인', color: FLUSH },
  { num: 3, api: 'TDH.PHYMEM.PAGE.WBINVD', effect: '물리 메모리 쓰기 플러시', color: FLUSH },
  { num: 4, api: 'TDH.MNG.KEY.FREEID', effect: 'MKTME 키 슬롯 반환', color: KEY },
  { num: 5, api: 'TDH.PHYMEM.PAGE.RECLAIM', effect: '페이지 회수 (zero 초기화)', color: CLEAN },
  { num: 6, api: 'TDH.MNG.KEYCONFIG', effect: '새 TD용 키 재할당 가능', color: KEY },
];

export default function TdShutdownSeqViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 360" className="w-full h-auto" style={{ maxWidth: 680 }}>
        <text x={240} y={18} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">TD 종료 시퀀스 — 키 격리 + 페이지 회수</text>

        {STEPS.map((s, i) => (
          <motion.g key={i}
            initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 + i * 0.12 }}>
            <rect x={20} y={36 + i * 38} width={440} height={32} rx={5}
              fill={s.color} fillOpacity={0.08} stroke={s.color} strokeWidth={0.6} />
            <rect x={20} y={36 + i * 38} width={3.5} height={32} fill={s.color} />

            <circle cx={42} cy={52 + i * 38} r={10} fill={s.color} />
            <text x={42} y={56 + i * 38} textAnchor="middle"
              fontSize={9.5} fontWeight={700} fill="white">
              {s.num}
            </text>

            <rect x={60} y={42 + i * 38} width={170} height={20} rx={3}
              fill={s.color} fillOpacity={0.18} stroke={s.color} strokeWidth={0.4} />
            <text x={145} y={56 + i * 38} textAnchor="middle"
              fontSize={8} fontFamily="monospace" fontWeight={700} fill={s.color}>
              {s.api}
            </text>

            <text x={240} y={56 + i * 38} fontSize={7.5} fill="var(--muted-foreground)">
              {s.effect}
            </text>
          </motion.g>
        ))}

        {/* Warning */}
        <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.95 }}>
          <rect x={30} y={278} width={420} height={70} rx={8}
            fill={WARN} fillOpacity={0.06} stroke={WARN} strokeWidth={1} strokeDasharray="3 2" />
          <text x={240} y={296} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={WARN}>
            순서 의존성 — 위반 시 TD 격리 깨짐
          </text>

          {[
            'KEY.FREEID 전에 반드시 모든 페이지 WBINVD',
            '캐시에 남은 평문이 다른 TD로 유출 가능',
            '이 과정 생략 시 SEAMCALL이 ENTROPY_FAIL 반환',
          ].map((line, i) => (
            <motion.text key={i}
              x={240} y={314 + i * 11} textAnchor="middle"
              fontSize={7} fill={WARN}
              initial={{ opacity: 0, x: -3 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.05 + i * 0.06 }}>
              {line}
            </motion.text>
          ))}
        </motion.g>
      </svg>
    </div>
  );
}
