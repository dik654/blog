import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { setup: '#8b5cf6', cm: '#3b82f6', open: '#10b981', vfy: '#ef4444' };

const STEPS = [
  { label: 'Trusted Setup -- SRS 생성', body: '비밀 beta로 G1, G2 위 거듭제곱 점을 생성한 뒤 beta를 삭제. 이후 모든 커밋/검증에 SRS만 사용한다.' },
  { label: 'Commit -- p(x) -> G1 점', body: '다항식 계수와 SRS_G1을 MSM(다중 스칼라 곱)으로 결합. 결과는 G1 점 하나 = 48바이트.' },
  { label: 'Open -- witness 다항식 계산', body: '인수정리로 (p(x)-v)/(x-z) 가 다항식이면 p(z)=v. witness를 G1 점으로 커밋하면 증명 완성.' },
  { label: 'Verify -- Pairing Check O(1)', body: '페어링 2회로 인수정리 등식을 확인. 다항식 크기와 무관하게 상수 시간 검증.' },
];

/* Step 0: Trusted Setup */
function SetupDiagram() {
  const powers = ['G1', 'beta*G1', 'beta^2*G1', '...', 'beta^d*G1'];
  const x0 = 40, gap = 82, y = 60, pw = 72, ph = 28;
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
      <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700}
        fill="var(--foreground)">Trusted Setup: SRS 생성</text>

      {/* secret beta box */}
      <motion.g initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.1 }}>
        <rect x={180} y={28} width={120} height={26} rx={13}
          fill={`${C.setup}12`} stroke={C.setup} strokeWidth={1} />
        <text x={240} y={45} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.setup}>
          {'beta <- Fr (비밀)'}
        </text>
      </motion.g>

      {/* arrow down */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.2 }}>
        <line x1={240} y1={56} x2={240} y2={y - 2} stroke={C.setup} strokeWidth={0.7}
          markerEnd="url(#kzg-arr)" />
      </motion.g>

      {/* SRS G1 powers */}
      {powers.map((p, i) => (
        <motion.g key={p} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          transition={{ ...sp, delay: 0.25 + i * 0.06 }}>
          <rect x={x0 + i * gap} y={y} width={pw} height={ph} rx={6}
            fill={`${C.setup}10`} stroke={C.setup} strokeWidth={0.7} />
          <text x={x0 + i * gap + pw / 2} y={y + ph / 2 + 4} textAnchor="middle"
            fontSize={p === '...' ? 12 : 8} fontWeight={600} fill={C.setup}>{p}</text>
        </motion.g>
      ))}
      <text x={x0 - 4} y={y + ph + 14} fontSize={8} fill="var(--muted-foreground)">
        SRS_G1 (d+1 개 점)
      </text>

      {/* SRS G2 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.6 }}>
        <rect x={x0} y={y + ph + 22} width={pw} height={ph} rx={6}
          fill={`${C.cm}10`} stroke={C.cm} strokeWidth={0.7} />
        <text x={x0 + pw / 2} y={y + ph + 22 + ph / 2 + 4} textAnchor="middle"
          fontSize={8} fontWeight={600} fill={C.cm}>G2</text>
        <rect x={x0 + gap} y={y + ph + 22} width={pw} height={ph} rx={6}
          fill={`${C.cm}10`} stroke={C.cm} strokeWidth={0.7} />
        <text x={x0 + gap + pw / 2} y={y + ph + 22 + ph / 2 + 4} textAnchor="middle"
          fontSize={8} fontWeight={600} fill={C.cm}>beta*G2</text>
        <text x={x0 + 2 * gap + 10} y={y + ph + 22 + ph / 2 + 4}
          fontSize={8} fill="var(--muted-foreground)">SRS_G2 (2개)</text>
      </motion.g>

      {/* delete beta */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={{ ...sp, delay: 0.75 }}>
        <rect x={300} y={y + ph + 22} width={140} height={ph} rx={14}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.6} strokeDasharray="4 3" />
        <text x={370} y={y + ph + 22 + ph / 2 + 4} textAnchor="middle"
          fontSize={8} fontWeight={600} fill="var(--muted-foreground)">beta 삭제 → universal SRS</text>
      </motion.g>

      <defs>
        <marker id="kzg-arr" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
          <polygon points="0 0, 6 2, 0 4" fill={C.setup} opacity={0.6} />
        </marker>
      </defs>
    </motion.g>
  );
}

/* Step 1: Commit */
function CommitDiagram() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
      <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700}
        fill="var(--foreground)">{'Commit: p(x) → G1 점 1개'}</text>

      {/* polynomial box */}
      <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.1 }}>
        <rect x={20} y={34} width={130} height={40} rx={8}
          fill="var(--card)" stroke={C.cm} strokeWidth={0.8} />
        <rect x={20} y={34} width={130} height={5} fill={C.cm} opacity={0.85}
          clipPath="url(#cm-clip1)" />
        <text x={85} y={55} textAnchor="middle" fontSize={9} fontWeight={600}
          fill="var(--foreground)">p(x) = c0 + c1*x + ... + cn*x^n</text>
        <text x={85} y={68} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          다항식 계수
        </text>
      </motion.g>

      {/* SRS box */}
      <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.15 }}>
        <rect x={20} y={84} width={130} height={36} rx={8}
          fill={`${C.setup}08`} stroke={C.setup} strokeWidth={0.6} />
        <text x={85} y={105} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.setup}>
          SRS_G1
        </text>
        <text x={85} y={116} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
          [G1, beta*G1, ..., beta^d*G1]
        </text>
      </motion.g>

      {/* arrows to MSM */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.25 }}>
        <line x1={152} y1={54} x2={195} y2={70} stroke={C.cm} strokeWidth={0.7} markerEnd="url(#cm2-arr)" />
        <line x1={152} y1={102} x2={195} y2={85} stroke={C.setup} strokeWidth={0.7} markerEnd="url(#cm2-arr)" />
      </motion.g>

      {/* MSM operation box */}
      <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ ...sp, delay: 0.3 }}>
        <rect x={198} y={56} width={100} height={42} rx={8}
          fill="var(--card)" stroke={C.cm} strokeWidth={1} />
        <rect x={198} y={56} width={3.5} height={42} rx={0} fill={C.cm}
          clipPath="url(#cm-clip2)" />
        <text x={248} y={76} textAnchor="middle" fontSize={11} fontWeight={700}
          fill="var(--foreground)">MSM</text>
        <text x={248} y={92} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          다중 스칼라 곱
        </text>
      </motion.g>

      {/* arrow to result */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.45 }}>
        <line x1={300} y1={77} x2={350} y2={77} stroke={C.cm} strokeWidth={1} markerEnd="url(#cm2-arr2)" />
      </motion.g>

      {/* result: C = [p(beta)]_1 */}
      <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ ...sp, delay: 0.5 }}>
        <rect x={354} y={52} width={116} height={50} rx={8}
          fill={`${C.cm}15`} stroke={C.cm} strokeWidth={1.5} />
        <text x={412} y={72} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.cm}>
          C = [p(beta)]1
        </text>
        <text x={412} y={90} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          G1 점 1개 = 48B
        </text>
      </motion.g>

      {/* binding note */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={{ ...sp, delay: 0.65 }}>
        <rect x={120} y={130} width={250} height={22} rx={11}
          fill={`${C.cm}08`} stroke={C.cm} strokeWidth={0.6} />
        <text x={245} y={145} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.cm}>
          바인딩: DLog 가정으로 다른 p'(x)에서 같은 C 불가
        </text>
      </motion.g>

      <defs>
        <clipPath id="cm-clip1"><rect x={20} y={34} width={130} height={40} rx={8} /></clipPath>
        <clipPath id="cm-clip2"><rect x={198} y={56} width={100} height={42} rx={8} /></clipPath>
        <marker id="cm2-arr" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
          <polygon points="0 0, 6 2, 0 4" fill="var(--muted-foreground)" opacity={0.5} />
        </marker>
        <marker id="cm2-arr2" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
          <polygon points="0 0, 6 2, 0 4" fill={C.cm} opacity={0.7} />
        </marker>
      </defs>
    </motion.g>
  );
}

/* Step 2: Open */
function OpenDiagram() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
      <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700}
        fill="var(--foreground)">Open: witness 다항식으로 p(z)=v 증명</text>

      {/* claim box */}
      <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.1 }}>
        <rect x={20} y={34} width={100} height={34} rx={17}
          fill={`${C.open}12`} stroke={C.open} strokeWidth={1} />
        <text x={70} y={55} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.open}>
          p(z) = v
        </text>
      </motion.g>

      {/* arrow */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.2 }}>
        <line x1={122} y1={51} x2={155} y2={51} stroke={C.open} strokeWidth={0.7}
          markerEnd="url(#op2-arr)" />
      </motion.g>

      {/* factor theorem box */}
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.25 }}>
        <rect x={158} y={32} width={180} height={42} rx={8}
          fill="var(--card)" stroke={C.open} strokeWidth={0.8} />
        <text x={248} y={50} textAnchor="middle" fontSize={10} fontWeight={600}
          fill="var(--foreground)">w(x) = (p(x)-v) / (x-z)</text>
        <text x={248} y={66} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          인수정리: 나누어떨어지면 p(z)=v
        </text>
      </motion.g>

      {/* arrow to MSM */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.4 }}>
        <line x1={340} y1={53} x2={370} y2={53} stroke="var(--muted-foreground)" strokeWidth={0.7}
          markerEnd="url(#op2-arr)" />
      </motion.g>

      {/* W result */}
      <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ ...sp, delay: 0.45 }}>
        <rect x={374} y={32} width={96} height={42} rx={8}
          fill={`${C.open}15`} stroke={C.open} strokeWidth={1.5} />
        <text x={422} y={50} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.open}>
          W = [w(beta)]1
        </text>
        <text x={422} y={66} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          G1 점 = 48B
        </text>
      </motion.g>

      {/* equivalence note */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={{ ...sp, delay: 0.6 }}>
        <rect x={60} y={90} width={360} height={44} rx={8}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.6} />
        <text x={240} y={108} textAnchor="middle" fontSize={9} fontWeight={600}
          fill="var(--foreground)">
          {'w(x)가 다항식 ⟺ (x-z) | (p(x)-v) ⟺ p(z) = v'}
        </text>
        <text x={240} y={126} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          증명 크기: G1 점 1개 = 48바이트 (다항식 크기와 무관, 상수)
        </text>
      </motion.g>

      <defs>
        <marker id="op2-arr" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
          <polygon points="0 0, 6 2, 0 4" fill={C.open} opacity={0.6} />
        </marker>
      </defs>
    </motion.g>
  );
}

/* Step 3: Verify — Pairing */
function VerifyDiagram() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
      <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700}
        fill="var(--foreground)">Verify: Pairing Check O(1)</text>

      {/* Left pairing */}
      <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.1 }}>
        <rect x={20} y={32} width={90} height={30} rx={6}
          fill={`${C.cm}10`} stroke={C.cm} strokeWidth={0.7} />
        <text x={65} y={51} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.cm}>
          C - v*G1
        </text>
      </motion.g>
      <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.15 }}>
        <rect x={20} y={70} width={90} height={30} rx={6}
          fill={`${C.setup}10`} stroke={C.setup} strokeWidth={0.7} />
        <text x={65} y={89} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.setup}>
          G2
        </text>
      </motion.g>

      {/* pairing 1 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.25 }}>
        <line x1={112} y1={47} x2={140} y2={60} stroke={C.vfy} strokeWidth={0.7} markerEnd="url(#vfy-arr)" />
        <line x1={112} y1={85} x2={140} y2={72} stroke={C.vfy} strokeWidth={0.7} markerEnd="url(#vfy-arr)" />
      </motion.g>
      <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ ...sp, delay: 0.3 }}>
        <rect x={142} y={50} width={50} height={32} rx={16}
          fill={`${C.vfy}12`} stroke={C.vfy} strokeWidth={1} />
        <text x={167} y={70} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.vfy}>e( )</text>
      </motion.g>

      {/* == */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.35 }}>
        <text x={210} y={70} textAnchor="middle" fontSize={14} fontWeight={700} fill={C.vfy}>==</text>
      </motion.g>

      {/* Right pairing */}
      <motion.g initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.2 }}>
        <rect x={300} y={32} width={90} height={30} rx={6}
          fill={`${C.open}10`} stroke={C.open} strokeWidth={0.7} />
        <text x={345} y={51} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.open}>
          W
        </text>
      </motion.g>
      <motion.g initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.25 }}>
        <rect x={300} y={70} width={90} height={30} rx={6}
          fill={`${C.setup}10`} stroke={C.setup} strokeWidth={0.7} />
        <text x={345} y={89} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.setup}>
          beta*G2 - z*G2
        </text>
      </motion.g>

      {/* pairing 2 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.35 }}>
        <line x1={392} y1={47} x2={420} y2={60} stroke={C.vfy} strokeWidth={0.7} markerEnd="url(#vfy-arr)" />
        <line x1={392} y1={85} x2={420} y2={72} stroke={C.vfy} strokeWidth={0.7} markerEnd="url(#vfy-arr)" />
      </motion.g>
      <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ ...sp, delay: 0.4 }}>
        <rect x={422} y={50} width={50} height={32} rx={16}
          fill={`${C.vfy}12`} stroke={C.vfy} strokeWidth={1} />
        <text x={447} y={70} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.vfy}>e( )</text>
      </motion.g>

      {/* factor theorem equivalence */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.55 }}>
        <rect x={80} y={110} width={320} height={36} rx={8}
          fill="var(--card)" stroke={C.vfy} strokeWidth={0.7} />
        <text x={240} y={126} textAnchor="middle" fontSize={9} fontWeight={600}
          fill="var(--foreground)">
          p(beta) - v == w(beta) * (beta - z)
        </text>
        <text x={240} y={140} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          인수정리 등식 -- 페어링 2회, BLS12-381 기준 ~2ms
        </text>
      </motion.g>

      <defs>
        <marker id="vfy-arr" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
          <polygon points="0 0, 6 2, 0 4" fill={C.vfy} opacity={0.6} />
        </marker>
      </defs>
    </motion.g>
  );
}

export default function KZG10FlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 490 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <SetupDiagram />}
          {step === 1 && <CommitDiagram />}
          {step === 2 && <OpenDiagram />}
          {step === 3 && <VerifyDiagram />}
        </svg>
      )}
    </StepViz>
  );
}
