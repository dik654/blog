import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = {
  pa: '#6366f1',
  keyid: '#f59e0b',
  realPa: '#10b981',
  seam: '#8b5cf6',
  td: '#ec4899',
  shared: '#0ea5e9',
  muted: 'var(--muted-foreground)',
};

const STEPS = [
  {
    label: 'PA Layout: KeyID bits를 상위에 배치',
    body: '48-bit PA = [KeyID bits | Original PA bits]. 상위 N bits가 KeyID, 나머지가 실제 물리 주소. 메모리 컨트롤러가 KeyID로 키 선택.',
  },
  {
    label: 'KeyID 매핑 예시',
    body: 'KeyID 0 = TME(또는 평문) · KeyID 1~15 = TDX 또는 일반 암호화. 4-bit KeyID면 16개 TD 동시 운용 가능.',
  },
  {
    label: 'TDX TD 생성: 4단계 SEAMCALL',
    body: '1) TDH_MNG_CREATE → KeyID + 키 생성  2) TDH_MNG_ADDCX → 페이지 추가 + MRTD 갱신  3) TDH_MNG_INIT → MRTD 확정  4) TDH_VP_ENTER → 실행.',
  },
  {
    label: 'GPAW & Shared Bit',
    body: 'GPAW(Guest PA Width) 48/52-bit. Shared bit 설정 시 평문 (I/O용). Private pages는 MKTME 암호화. 명시적 sharing만 허용.',
  },
  {
    label: '보안 보장: SEAM 독점 통제',
    body: 'KeyID는 SEAM만 할당. 키는 하드웨어 RNG 생성. VMM도 키 조회 불가. TD ↔ Host 메모리 공유는 명시적(shared bit).',
  },
];

function PaLayout() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.pa}>
        Physical Address Layout (48-bit)
      </text>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <text x={20} y={36} fontSize={9} fontWeight={700} fill={C.muted}>Before MKTME:</text>
        <rect x={140} y={26} width={300} height={18} rx={3} fill={`${C.realPa}25`} stroke={C.realPa} strokeWidth={0.8} />
        <text x={290} y={38} textAnchor="middle" fontSize={9} fontFamily="monospace" fontWeight={700} fill={C.realPa}>
          PA[47:0]
        </text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <text x={20} y={70} fontSize={9} fontWeight={700} fill={C.muted}>After MKTME:</text>
        <rect x={140} y={60} width={80} height={18} rx={3} fill={`${C.keyid}30`} stroke={C.keyid} strokeWidth={1} />
        <text x={180} y={72} textAnchor="middle" fontSize={9} fontFamily="monospace" fontWeight={700} fill={C.keyid}>
          KeyID
        </text>
        <rect x={222} y={60} width={218} height={18} rx={3} fill={`${C.realPa}25`} stroke={C.realPa} strokeWidth={0.8} />
        <text x={331} y={72} textAnchor="middle" fontSize={9} fontFamily="monospace" fontWeight={700} fill={C.realPa}>
          Real PA bits
        </text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <text x={180} y={94} textAnchor="middle" fontSize={8} fill={C.muted}>↑ 상위 N bits</text>
        <text x={331} y={94} textAnchor="middle" fontSize={8} fill={C.muted}>↑ 나머지</text>
        <text x={240} y={114} textAnchor="middle" fontSize={9} fill={C.muted}>
          메모리 컨트롤러: KeyID로 AES-XTS-256 키 선택 → 자동 암복호화
        </text>
      </motion.g>
    </g>
  );
}

function KeyIdMapping() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.keyid}>
        KeyID 매핑 — 4-bit KeyID 예시
      </text>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <rect x={20} y={26} width={440} height={24} rx={4}
          fill={`${C.pa}10`} stroke={C.pa} strokeWidth={0.8} />
        <text x={32} y={42} fontSize={9} fontFamily="monospace" fontWeight={700} fill={C.pa}>
          PA = 0x7000_0000_1000  → KeyID = 7, Real PA = 0x000_0000_1000
        </text>
      </motion.g>
      {[
        { id: '0', use: 'TME (또는 평문)', color: C.muted },
        { id: '1~3', use: '일반 암호화', color: C.realPa },
        { id: '4~15', use: 'TDX TD 전용', color: C.td },
      ].map((m, i) => (
        <motion.g key={m.id} initial={{ opacity: 0, x: -3 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 + i * 0.1 }}>
          <rect x={20} y={62 + i * 22} width={440} height={18} rx={3}
            fill={`${m.color}15`} stroke={`${m.color}50`} strokeWidth={0.6} />
          <text x={32} y={75 + i * 22} fontSize={9.5} fontFamily="monospace" fontWeight={700} fill={m.color}>
            KeyID = {m.id}
          </text>
          <text x={140} y={75 + i * 22} fontSize={9} fill={C.muted}>{m.use}</text>
        </motion.g>
      ))}
    </g>
  );
}

interface CallStep { call: string; action: string; color: string; }

const CALLS: CallStep[] = [
  { call: 'TDH_MNG_CREATE', action: 'SEAM이 KeyID 할당 + AES-XTS-256 random key 생성', color: C.seam },
  { call: 'TDH_MNG_ADDCX', action: 'TD 페이지 추가 → SEAM이 MKTME 키 config + MRTD 갱신', color: C.td },
  { call: 'TDH_MNG_INIT', action: 'TD initialization 완료 → MRTD 확정', color: C.realPa },
  { call: 'TDH_VP_ENTER', action: 'TD VCPU 실행 시작 → CPU 자동 KeyID 전환', color: C.shared },
];

function SeamcallFlow() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.seam}>
        TDX TD 생성 — 4 SEAMCALL 흐름
      </text>
      {CALLS.map((c, i) => (
        <motion.g key={c.call} initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.12 }}>
          <rect x={20} y={26 + i * 26} width={440} height={22} rx={4}
            fill={`${c.color}10`} stroke={c.color} strokeWidth={0.8} />
          <circle cx={36} cy={37 + i * 26} r={9} fill={c.color} />
          <text x={36} y={41 + i * 26} textAnchor="middle" fontSize={10} fontWeight={700} fill="#fff">
            {i + 1}
          </text>
          <text x={56} y={36 + i * 26} fontSize={9} fontFamily="monospace" fontWeight={700} fill={c.color}>
            {c.call}
          </text>
          <text x={56} y={46 + i * 26} fontSize={8} fill={C.muted}>{c.action}</text>
        </motion.g>
      ))}
    </g>
  );
}

function GpawShared() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
        GPAW &amp; Shared Bit
      </text>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <rect x={20} y={26} width={210} height={70} rx={6}
          fill={`${C.td}10`} stroke={C.td} strokeWidth={1} />
        <text x={125} y={44} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.td}>
          Private Pages
        </text>
        <text x={125} y={62} textAnchor="middle" fontSize={9} fill={C.muted}>shared bit = 0</text>
        <text x={125} y={76} textAnchor="middle" fontSize={9} fill={C.muted}>MKTME 암호화</text>
        <text x={125} y={90} textAnchor="middle" fontSize={8.5} fill={C.td}>TD 전용</text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <rect x={250} y={26} width={210} height={70} rx={6}
          fill={`${C.shared}10`} stroke={C.shared} strokeWidth={1} />
        <text x={355} y={44} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.shared}>
          Shared Pages
        </text>
        <text x={355} y={62} textAnchor="middle" fontSize={9} fill={C.muted}>shared bit = 1</text>
        <text x={355} y={76} textAnchor="middle" fontSize={9} fill={C.muted}>평문</text>
        <text x={355} y={90} textAnchor="middle" fontSize={8.5} fill={C.shared}>I/O · DMA용</text>
      </motion.g>
      <motion.text x={240} y={114} textAnchor="middle" fontSize={9} fill={C.muted}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        GPAW = 48 또는 52-bit (Guest Physical Address Width)
      </motion.text>
    </g>
  );
}

const SECURITY = [
  { item: 'KeyID 할당', who: 'SEAM 독점', color: C.seam },
  { item: 'Key 생성', who: 'HW RNG', color: C.realPa },
  { item: 'Key 조회', who: 'VMM 불가', color: C.td },
  { item: 'Memory sharing', who: '명시적 (shared bit)', color: C.shared },
];

function SecurityGuarantees() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.seam}>
        보안 보장 — SEAM이 모든 키 통제
      </text>
      {SECURITY.map((s, i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const x = 20 + col * 225;
        const y = 30 + row * 42;
        return (
          <motion.g key={s.item} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}>
            <rect x={x} y={y} width={215} height={36} rx={5}
              fill={`${s.color}10`} stroke={s.color} strokeWidth={0.8} />
            <text x={x + 12} y={y + 16} fontSize={10} fontWeight={700} fill={s.color}>{s.item}</text>
            <text x={x + 12} y={y + 28} fontSize={9} fill={C.muted}>→ {s.who}</text>
          </motion.g>
        );
      })}
    </g>
  );
}

export default function MktmeDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 130" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <PaLayout />}
          {step === 1 && <KeyIdMapping />}
          {step === 2 && <SeamcallFlow />}
          {step === 3 && <GpawShared />}
          {step === 4 && <SecurityGuarantees />}
        </svg>
      )}
    </StepViz>
  );
}
