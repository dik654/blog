import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  {
    label: '① Keccak in-circuit의 고통',
    body: '64-bit word를 31-bit 필드 위에서 표현하려면 비트 단위로 쪼개야 한다.\nXOR/AND/NOT 한 번마다 제약이 쌓여 1 hash ≈ 30K+ constraints.',
  },
  {
    label: '② Keccak vs Poseidon2 제약 수',
    body: 'Algebraic hash는 필드 연산(+, -, ×, x^d)만 쓰므로 constraint 비용이 수십~수백 수준.\n로그스케일로 봐도 Keccak이 압도적으로 무겁다.',
  },
  {
    label: '③ ZK-friendly Hash 후보',
    body: 'Poseidon2가 가장 인기 — S-box degree 최소화, 라운드 감소, Plonky3 기본 선택.\nRescue는 학계 출신, Griffin은 신규 설계, Tip5는 Starknet이 채택.',
  },
  {
    label: '④ 사용 위치 4군데',
    body: 'Merkle tree / Fiat-Shamir transform / 커밋먼트 스킴 / 회로 내부 PRF.\nAlgebraic hash는 circuit 빠르지만 on-chain 느림 — 대부분 시스템은 prover 비용 우선.',
  },
];

const KECCAK = '#ef4444';
const POS = '#10b981';
const RES = '#6366f1';
const GRI = '#8b5cf6';
const TIP = '#f59e0b';

function Step1() {
  // 64-bit word split into bits over 31-bit field + XOR gate
  const bits = Array.from({ length: 16 }, (_, i) => i);
  return (
    <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      {/* 64-bit word box */}
      <motion.rect x={20} y={20} width={200} height={28} rx={4}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        fill={KECCAK + '14'} stroke={KECCAK} strokeWidth={1} />
      <text x={120} y={38} textAnchor="middle" fontSize={10} fontWeight={700} fill={KECCAK}>
        Keccak 64-bit word
      </text>

      {/* Arrow: bit decomposition */}
      <motion.line x1={120} y1={52} x2={120} y2={78}
        stroke={KECCAK} strokeWidth={1} strokeDasharray="3 2"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 }} />
      <text x={132} y={68} fontSize={8} fill={KECCAK + 'cc'}>bit decomp</text>

      {/* 16 bit cells on 31-bit field */}
      {bits.map((i) => (
        <motion.g key={i}
          initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + i * 0.02 }}>
          <rect x={22 + i * 12.4} y={82} width={11} height={14} rx={2}
            fill={KECCAK + '08'} stroke={KECCAK + '60'} strokeWidth={0.6} />
          <text x={27.5 + i * 12.4} y={92} textAnchor="middle" fontSize={7} fill={KECCAK}>
            {i % 2}
          </text>
        </motion.g>
      ))}
      <text x={225} y={92} fontSize={8} fill={KECCAK + '99'}>… 64 bits</text>

      {/* Field annotation */}
      <text x={20} y={112} fontSize={8} fill="#94a3b8">on 31-bit field (BabyBear)</text>

      {/* XOR gate */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
        <rect x={280} y={22} width={90} height={28} rx={4}
          fill={KECCAK + '14'} stroke={KECCAK} strokeWidth={1} />
        <text x={325} y={40} textAnchor="middle" fontSize={10} fontWeight={700} fill={KECCAK}>
          XOR / AND / NOT
        </text>
        <text x={325} y={62} textAnchor="middle" fontSize={8} fill={KECCAK + 'cc'}>
          logical ops
        </text>

        <rect x={280} y={82} width={90} height={28} rx={4}
          fill={KECCAK + '22'} stroke={KECCAK} strokeWidth={1.2} />
        <text x={325} y={100} textAnchor="middle" fontSize={10} fontWeight={700} fill={KECCAK}>
          30K+ constraints
        </text>
      </motion.g>

      {/* Result row */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
        <text x={20} y={150} fontSize={9} fill="#475569">
          1 Keccak hash = bit-level proof → prover 치명적
        </text>
        <text x={20} y={168} fontSize={9} fill={KECCAK + 'cc'}>
          해법: 필드 위 연산만 쓰는 algebraic hash로 교체
        </text>
      </motion.g>
    </svg>
  );
}

function Step2() {
  // Horizontal bar chart log-scale
  const items = [
    { name: 'Keccak-256', cost: 30000, color: KECCAK, width: 380 },
    { name: 'Poseidon2',  cost: 120,   color: POS,    width: 380 * (Math.log10(120) / Math.log10(30000)) },
  ];
  return (
    <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={20} y={22} fontSize={10} fontWeight={700} fill="#64748b">
        BabyBear 회로 내 1 hash 제약 수 (log scale)
      </text>
      {items.map((it, i) => {
        const y = 50 + i * 60;
        return (
          <g key={it.name}>
            <text x={20} y={y - 6} fontSize={10} fontWeight={700} fill={it.color}>
              {it.name}
            </text>
            <rect x={20} y={y} width={380} height={24} rx={3}
              fill={it.color + '08'} stroke={it.color + '30'} strokeWidth={0.5} />
            <motion.rect x={20} y={y} height={24} rx={3}
              initial={{ width: 0 }} animate={{ width: it.width }}
              transition={{ delay: 0.2 + i * 0.2, duration: 0.6 }}
              fill={it.color + '33'} stroke={it.color} strokeWidth={1} />
            <motion.text x={28 + it.width} y={y + 16} fontSize={10} fontWeight={700} fill={it.color}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.8 + i * 0.2 }}>
              ~{it.cost.toLocaleString()} constraints
            </motion.text>
          </g>
        );
      })}

      {/* Ratio callout */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}>
        <rect x={20} y={170} width={440} height={22} rx={4}
          fill={POS + '10'} stroke={POS + '60'} strokeWidth={0.8} />
        <text x={240} y={185} textAnchor="middle" fontSize={9} fontWeight={700} fill={POS}>
          Poseidon2는 Keccak보다 약 250× 저렴 — prover 시간 결정적 차이
        </text>
      </motion.g>
    </svg>
  );
}

function Step3() {
  const cards = [
    { name: 'Poseidon2', tag: 'most popular',   color: POS, note: 'Plonky3 기본 선택' },
    { name: 'Rescue',    tag: 'academic',       color: RES, note: 'Rescue-Prime 계열' },
    { name: 'Griffin',   tag: 'newer',          color: GRI, note: 'Anemoi와 함께 신규' },
    { name: 'Tip5',      tag: "Starknet's pick",color: TIP, note: 'Twin-ish 필드 최적화' },
  ];
  return (
    <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={20} y={22} fontSize={10} fontWeight={700} fill="#64748b">
        ZK-friendly Hash 후보
      </text>
      {cards.map((c, i) => {
        const x = 20 + (i % 2) * 230;
        const y = 40 + Math.floor(i / 2) * 78;
        const highlight = c.name === 'Poseidon2';
        return (
          <motion.g key={c.name}
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.1 }}>
            <rect x={x} y={y} width={210} height={64} rx={6}
              fill={c.color + (highlight ? '20' : '10')}
              stroke={c.color}
              strokeWidth={highlight ? 1.6 : 0.8} />
            <text x={x + 12} y={y + 20} fontSize={12} fontWeight={800} fill={c.color}>
              {c.name}
            </text>
            <rect x={x + 12} y={y + 28} width={80} height={14} rx={3}
              fill={c.color + '22'} stroke={c.color + '60'} strokeWidth={0.5} />
            <text x={x + 52} y={y + 38} textAnchor="middle" fontSize={8} fontWeight={700} fill={c.color}>
              {c.tag}
            </text>
            <text x={x + 12} y={y + 56} fontSize={8} fill="#64748b">
              {c.note}
            </text>
            {highlight && (
              <motion.circle cx={x + 196} cy={y + 12} r={4}
                initial={{ scale: 0 }} animate={{ scale: [0, 1.3, 1] }}
                transition={{ delay: 0.6, duration: 0.5 }}
                fill={c.color} />
            )}
          </motion.g>
        );
      })}
    </svg>
  );
}

function Step4() {
  const uses = [
    { name: 'Merkle tree',       sub: 'field element leaves',     color: POS },
    { name: 'Fiat-Shamir',       sub: 'interactive → non-interactive', color: RES },
    { name: 'Commitment',        sub: 'PCS, vector commit',       color: GRI },
    { name: 'In-circuit PRF',    sub: 'recursive proof 내부',     color: TIP },
  ];
  return (
    <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={20} y={22} fontSize={10} fontWeight={700} fill="#64748b">
        ZK 시스템 내 사용 위치
      </text>
      {/* Central hub */}
      <motion.circle cx={240} cy={110} r={22}
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1 }}
        fill={POS + '20'} stroke={POS} strokeWidth={1.4} />
      <text x={240} y={108} textAnchor="middle" fontSize={8} fontWeight={800} fill={POS}>
        Algebraic
      </text>
      <text x={240} y={118} textAnchor="middle" fontSize={8} fontWeight={800} fill={POS}>
        Hash
      </text>

      {uses.map((u, i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const x = col === 0 ? 20 : 330;
        const y = 50 + row * 78;
        const cx = col === 0 ? x + 130 : x;
        const cy = y + 24;
        return (
          <motion.g key={u.name}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.25 + i * 0.12 }}>
            <line x1={cx} y1={cy} x2={240} y2={110}
              stroke={u.color} strokeWidth={0.8} strokeDasharray="3 2" opacity={0.55} />
            <rect x={x} y={y} width={130} height={48} rx={5}
              fill={u.color + '12'} stroke={u.color} strokeWidth={1} />
            <text x={x + 65} y={y + 20} textAnchor="middle" fontSize={10} fontWeight={700} fill={u.color}>
              {u.name}
            </text>
            <text x={x + 65} y={y + 36} textAnchor="middle" fontSize={7.5} fill="#64748b">
              {u.sub}
            </text>
          </motion.g>
        );
      })}

      {/* Tradeoff strip */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}>
        <rect x={20} y={178} width={440} height={16} rx={3}
          fill="#64748b11" stroke="#64748b55" strokeWidth={0.6} strokeDasharray="2 2" />
        <text x={240} y={190} textAnchor="middle" fontSize={8} fontWeight={700} fill="#475569">
          circuit 빠름 · on-chain 느림 → 대부분 시스템이 prover 비용 우선
        </text>
      </motion.g>
    </svg>
  );
}

export default function ZkFriendlyHashViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        if (step === 0) return <Step1 />;
        if (step === 1) return <Step2 />;
        if (step === 2) return <Step3 />;
        return <Step4 />;
      }}
    </StepViz>
  );
}
