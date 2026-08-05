import { motion } from 'framer-motion';

const PRIV = '#10b981';
const SHARED = '#f59e0b';
const BIT = '#8b5cf6';

export default function GpaLayoutViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 320" className="w-full h-auto" style={{ maxWidth: 680 }}>
        <text x={240} y={18} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">TD Guest Physical Address — Shared bit 인코딩</text>

        {/* Layout bar */}
        <motion.g initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <text x={30} y={42} fontSize={9} fontWeight={700} fill="var(--foreground)">
            GPA 비트 레이아웃 (GPAW=48 또는 52, TD_PARAMS로 결정)
          </text>
        </motion.g>

        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
          <rect x={30} y={50} width={50} height={36} rx={4}
            fill={BIT} fillOpacity={0.18} stroke={BIT} strokeWidth={1.2} />
          <text x={55} y={68} textAnchor="middle" fontSize={9} fontWeight={700} fill={BIT}>
            S
          </text>
          <text x={55} y={80} textAnchor="middle" fontSize={6.5} fill="var(--muted-foreground)">
            bit GPAW-1
          </text>
        </motion.g>

        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
          <rect x={80} y={50} width={370} height={36} rx={4}
            fill="#3b82f6" fillOpacity={0.1} stroke="#3b82f6" strokeWidth={1} />
          <text x={265} y={68} textAnchor="middle" fontSize={9} fontWeight={700} fill="#3b82f6">
            실제 GPA (47비트)
          </text>
          <text x={265} y={80} textAnchor="middle" fontSize={6.5} fill="var(--muted-foreground)">
            S-EPT 또는 일반 EPT walk 대상
          </text>
        </motion.g>

        <text x={55} y={98} textAnchor="middle" fontSize={6.5} fontFamily="monospace" fill={BIT}>Shared bit</text>

        {/* Two paths */}
        <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
          <rect x={20} y={120} width={210} height={90} rx={8}
            fill={PRIV} fillOpacity={0.1} stroke={PRIV} strokeWidth={1.2} />
          <text x={125} y={140} textAnchor="middle" fontSize={10} fontWeight={700} fill={PRIV}>
            S = 0 → Private GPA
          </text>
          <text x={125} y={156} textAnchor="middle" fontSize={7.5} fontFamily="monospace" fill={PRIV}>
            void *p = (void *)0x1000;
          </text>

          <rect x={32} y={166} width={186} height={16} rx={3}
            fill={PRIV} fillOpacity={0.18} />
          <text x={125} y={177} textAnchor="middle" fontSize={7} fill={PRIV}>
            S-EPT 매핑 (TD Module 관리)
          </text>
          <rect x={32} y={185} width={186} height={16} rx={3}
            fill={PRIV} fillOpacity={0.18} />
          <text x={125} y={196} textAnchor="middle" fontSize={7} fill={PRIV}>
            TD KeyID로 암호화 · Host 접근 불가
          </text>
        </motion.g>

        <motion.g initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
          <rect x={250} y={120} width={210} height={90} rx={8}
            fill={SHARED} fillOpacity={0.1} stroke={SHARED} strokeWidth={1.2} />
          <text x={355} y={140} textAnchor="middle" fontSize={10} fontWeight={700} fill={SHARED}>
            S = 1 → Shared GPA
          </text>
          <text x={355} y={156} textAnchor="middle" fontSize={7.5} fontFamily="monospace" fill={SHARED}>
            void *p = (void *)(1ULL&lt;&lt;47 | 0x1000);
          </text>

          <rect x={262} y={166} width={186} height={16} rx={3}
            fill={SHARED} fillOpacity={0.18} />
          <text x={355} y={177} textAnchor="middle" fontSize={7} fill={SHARED}>
            일반 EPT (VMM 관리)
          </text>
          <rect x={262} y={185} width={186} height={16} rx={3}
            fill={SHARED} fillOpacity={0.18} />
          <text x={355} y={196} textAnchor="middle" fontSize={7} fill={SHARED}>
            KeyID 0 (Host 공유 키) · virtio·DMA 용
          </text>
        </motion.g>

        {/* Lookup steps */}
        <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}>
          <rect x={30} y={230} width={420} height={75} rx={8}
            fill="var(--muted)" opacity={0.25} stroke="var(--border)" strokeWidth={0.5} />
          <text x={240} y={248} textAnchor="middle" fontSize={9} fontWeight={700} fill="var(--foreground)">
            CPU 메모리 접근 시 흐름
          </text>

          {[
            '1. GPA의 Shared bit 검사 (GPAW-1 비트)',
            '2. S=0 → S-EPT walk (TD Module 페이지 테이블)',
            '3. S=1 → 일반 EPT walk (Host 페이지 테이블)',
            '4. HPA 획득 → MKTME가 해당 KeyID로 자동 암/복호화',
          ].map((line, i) => (
            <motion.text key={i} x={45} y={264 + i * 11} fontSize={7.5}
              fill="var(--muted-foreground)"
              initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.75 + i * 0.06 }}>
              {line}
            </motion.text>
          ))}
        </motion.g>
      </svg>
    </div>
  );
}
