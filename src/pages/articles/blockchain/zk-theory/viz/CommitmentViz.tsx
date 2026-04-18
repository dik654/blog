import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { cm: '#6366f1', op: '#10b981', bd: '#f59e0b', hi: '#8b5cf6' };

const STEPS = [
  { label: 'Pedersen 커밋먼트 — 세팅', body: '소수 p=23 위 군에서 독립 생성원 g, h를 공개. log_g(h)를 모르면 바인딩이 성립하고, 알면 위조가 가능해진다.' },
  { label: '① Commit — C = g^m * h^r', body: '메시지 m과 랜덤 블라인딩 팩터 r로 커밋값 C를 계산한 뒤 공개. m과 r은 비밀로 유지.' },
  { label: '② Open — (m, r) 공개', body: '검증자에게 m, r을 전달하면 C와 대조해서 일치를 확인. 다른 값으로 같은 C를 만들 수 없다.' },
  { label: '두 가지 성질', body: '은닉(Hiding): r이 균일하면 C에서 m을 유추 불가. 바인딩(Binding): 같은 C에 다른 m을 넣으려면 DLP를 풀어야 한다.' },
];

/* Step 0: Setup — show p, q, g, h as parameter boxes */
function SetupDiagram() {
  const params = [
    { label: 'p = 23', sub: '소수 모듈러스', x: 30 },
    { label: 'q = 11', sub: '|G| = q', x: 140 },
    { label: 'g = 2', sub: '생성원 1', x: 250 },
    { label: 'h = 3', sub: '생성원 2', x: 360 },
  ];
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
      <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={700}
        fill="var(--foreground)">공개 파라미터</text>
      {params.map((p, i) => (
        <motion.g key={p.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ ...sp, delay: i * 0.08 }}>
          <rect x={p.x} y={32} width={90} height={42} rx={8}
            fill={`${C.cm}10`} stroke={C.cm} strokeWidth={0.8} />
          <text x={p.x + 45} y={52} textAnchor="middle"
            fontSize={12} fontWeight={700} fill={C.cm}>{p.label}</text>
          <text x={p.x + 45} y={66} textAnchor="middle"
            fontSize={8} fill="var(--muted-foreground)">{p.sub}</text>
        </motion.g>
      ))}
      {/* DLP assumption box */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
        <rect x={80} y={90} width={320} height={36} rx={8}
          fill="var(--card)" stroke={C.hi} strokeWidth={0.8} strokeDasharray="4 3" />
        <text x={240} y={106} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.hi}>
          log_g(h) = ? — 이산로그 관계를 아무도 모름
        </text>
        <text x={240} y={120} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          DLP 가정 하에서 바인딩 성립 / 관계를 알면 위조 가능
        </text>
      </motion.g>
    </motion.g>
  );
}

/* Step 1: Commit — show computation flow */
function CommitDiagram() {
  const boxW = 70, boxH = 40;
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
      <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700}
        fill="var(--foreground)">C = g^m * h^r mod p</text>
      {/* m and r inputs */}
      <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.1 }}>
        <rect x={20} y={30} width={boxW} height={boxH} rx={boxH / 2}
          fill={`${C.op}12`} stroke={C.op} strokeWidth={1} />
        <text x={55} y={48} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.op}>m = 7</text>
        <text x={55} y={62} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">메시지</text>
      </motion.g>
      <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.15 }}>
        <rect x={20} y={84} width={boxW} height={boxH} rx={boxH / 2}
          fill={`${C.cm}12`} stroke={C.cm} strokeWidth={1} />
        <text x={55} y={102} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.cm}>r = 4</text>
        <text x={55} y={116} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">랜덤</text>
      </motion.g>

      {/* arrows from inputs to computation */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.25 }}>
        <line x1={92} y1={50} x2={140} y2={65} stroke={C.op} strokeWidth={0.8} markerEnd="url(#cm-arr)" />
        <line x1={92} y1={104} x2={140} y2={85} stroke={C.cm} strokeWidth={0.8} markerEnd="url(#cm-arr)" />
      </motion.g>

      {/* computation chain boxes */}
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.3 }}>
        <rect x={142} y={52} width={76} height={48} rx={6}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.6} />
        <text x={180} y={70} textAnchor="middle" fontSize={9} fontWeight={600}
          fill="var(--foreground)">2^7 * 3^4</text>
        <text x={180} y={84} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          128 * 81
        </text>
        <text x={180} y={96} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          mod 23
        </text>
      </motion.g>

      {/* arrow to result */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.45 }}>
        <line x1={220} y1={76} x2={270} y2={76} stroke="var(--muted-foreground)" strokeWidth={0.8}
          markerEnd="url(#cm-arr)" />
      </motion.g>

      {/* result box */}
      <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ ...sp, delay: 0.5 }}>
        <rect x={272} y={52} width={80} height={48} rx={8}
          fill={`${C.op}15`} stroke={C.op} strokeWidth={1.5} />
        <text x={312} y={72} textAnchor="middle" fontSize={16} fontWeight={700} fill={C.op}>C = 6</text>
        <text x={312} y={90} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">커밋값 공개</text>
      </motion.g>

      {/* lock icon (비공개 label) */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={{ ...sp, delay: 0.6 }}>
        <rect x={375} y={60} width={90} height={30} rx={15}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.6} strokeDasharray="3 2" />
        <text x={420} y={79} textAnchor="middle" fontSize={8} fontWeight={600}
          fill="var(--muted-foreground)">m, r 비공개</text>
      </motion.g>

      <defs>
        <marker id="cm-arr" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
          <polygon points="0 0, 6 2, 0 4" fill="var(--muted-foreground)" opacity={0.6} />
        </marker>
      </defs>
    </motion.g>
  );
}

/* Step 2: Open — verification flow */
function OpenDiagram() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
      <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700}
        fill="var(--foreground)">Open: 검증자에게 (m, r) 전달</text>

      {/* Prover sends m, r */}
      <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.1 }}>
        <rect x={20} y={36} width={90} height={44} rx={8}
          fill="var(--card)" stroke={C.bd} strokeWidth={0.8} />
        <rect x={20} y={36} width={90} height={5} rx={0} fill={C.bd} opacity={0.85}
          clipPath="url(#op-clip1)" />
        <text x={65} y={58} textAnchor="middle" fontSize={10} fontWeight={600}
          fill="var(--foreground)">증명자</text>
        <text x={65} y={72} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          m=7, r=4 전달
        </text>
      </motion.g>

      {/* arrow */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.25 }}>
        <line x1={112} y1={58} x2={175} y2={58} stroke={C.bd} strokeWidth={1}
          markerEnd="url(#op-arr)" />
        <rect x={126} y={44} width={40} height={16} rx={4}
          fill="var(--card)" stroke={C.bd} strokeWidth={0.5} />
        <text x={146} y={55} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.bd}>
          (7, 4)
        </text>
      </motion.g>

      {/* Verifier checks */}
      <motion.g initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.3 }}>
        <rect x={178} y={36} width={130} height={44} rx={8}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.6} />
        <rect x={178} y={36} width={3.5} height={44} rx={0} fill={C.bd}
          clipPath="url(#op-clip2)" />
        <text x={243} y={54} textAnchor="middle" fontSize={9} fontWeight={600}
          fill="var(--foreground)">검증 계산</text>
        <text x={243} y={68} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          2^7 * 3^4 mod 23 = ?
        </text>
      </motion.g>

      {/* arrow to check */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.45 }}>
        <line x1={310} y1={58} x2={350} y2={58} stroke="var(--muted-foreground)" strokeWidth={0.8}
          markerEnd="url(#op-arr)" />
      </motion.g>

      {/* result check */}
      <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ ...sp, delay: 0.5 }}>
        <rect x={352} y={36} width={110} height={44} rx={8}
          fill={`${C.op}12`} stroke={C.op} strokeWidth={1.2} />
        <text x={407} y={55} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.op}>
          6 == C ?
        </text>
        <text x={407} y={72} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.op}>
          OK
        </text>
      </motion.g>

      {/* binding note */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={{ ...sp, delay: 0.65 }}>
        <rect x={100} y={100} width={280} height={26} rx={13}
          fill={`${C.bd}10`} stroke={C.bd} strokeWidth={0.7} />
        <text x={240} y={117} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.bd}>
          다른 (m', r')로 같은 C=6을 만들 수 없다 — 바인딩
        </text>
      </motion.g>

      <defs>
        <clipPath id="op-clip1"><rect x={20} y={36} width={90} height={44} rx={8} /></clipPath>
        <clipPath id="op-clip2"><rect x={178} y={36} width={130} height={44} rx={6} /></clipPath>
        <marker id="op-arr" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
          <polygon points="0 0, 6 2, 0 4" fill={C.bd} opacity={0.6} />
        </marker>
      </defs>
    </motion.g>
  );
}

/* Step 3: Hiding + Binding properties side by side */
function PropertiesDiagram() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
      <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700}
        fill="var(--foreground)">은닉(Hiding) + 바인딩(Binding)</text>

      {/* Hiding side */}
      <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.1 }}>
        <rect x={20} y={32} width={210} height={90} rx={8}
          fill="var(--card)" stroke={C.cm} strokeWidth={0.8} />
        <rect x={20} y={32} width={210} height={5} fill={C.cm} opacity={0.85}
          clipPath="url(#hi-clip1)" />
        <text x={125} y={52} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.cm}>
          은닉 (Hiding)
        </text>
        {/* C box */}
        <rect x={40} y={62} width={50} height={24} rx={12}
          fill={`${C.cm}12`} stroke={C.cm} strokeWidth={0.6} />
        <text x={65} y={78} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.cm}>C = 6</text>
        {/* arrow with question mark */}
        <line x1={94} y1={74} x2={120} y2={74} stroke={C.cm} strokeWidth={0.8}
          markerEnd="url(#hi-arr)" />
        <text x={107} y={68} textAnchor="middle" fontSize={10} fill={C.cm}>?</text>
        {/* m = ? box */}
        <rect x={124} y={62} width={50} height={24} rx={12}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.6} strokeDasharray="3 2" />
        <text x={149} y={78} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">m = ?</text>
        {/* explanation */}
        <text x={125} y={100} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          r 균일 랜덤 → C도 균일 분포
        </text>
        <text x={125} y={112} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.cm}>
          정보이론적 안전 (무한 계산도 불가)
        </text>
      </motion.g>

      {/* Binding side */}
      <motion.g initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.25 }}>
        <rect x={250} y={32} width={220} height={90} rx={8}
          fill="var(--card)" stroke={C.hi} strokeWidth={0.8} />
        <rect x={250} y={32} width={220} height={5} fill={C.hi} opacity={0.85}
          clipPath="url(#hi-clip2)" />
        <text x={360} y={52} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.hi}>
          바인딩 (Binding)
        </text>
        {/* equation flow */}
        <rect x={268} y={62} width={184} height={24} rx={6}
          fill={`${C.hi}08`} stroke={C.hi} strokeWidth={0.5} />
        <text x={360} y={78} textAnchor="middle" fontSize={9} fontWeight={500} fill={C.hi}>
          g^(m-m') = h^(r'-r) → log_g(h) 필요
        </text>
        <text x={360} y={100} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          이산로그 문제(DLP)를 풀어야 위조 가능
        </text>
        <text x={360} y={112} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.hi}>
          계산적 안전 (다항 시간 내 불가)
        </text>
      </motion.g>

      <defs>
        <clipPath id="hi-clip1"><rect x={20} y={32} width={210} height={90} rx={8} /></clipPath>
        <clipPath id="hi-clip2"><rect x={250} y={32} width={220} height={90} rx={8} /></clipPath>
        <marker id="hi-arr" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
          <polygon points="0 0, 6 2, 0 4" fill={C.cm} opacity={0.6} />
        </marker>
      </defs>
    </motion.g>
  );
}

export default function CommitmentViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 490 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <SetupDiagram />}
          {step === 1 && <CommitDiagram />}
          {step === 2 && <OpenDiagram />}
          {step === 3 && <PropertiesDiagram />}
        </svg>
      )}
    </StepViz>
  );
}
