import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { int: '#6366f1', fs: '#f59e0b', ni: '#10b981', rom: '#8b5cf6' };

const STEPS = [
  { label: '대화형 Sigma 프로토콜 (3-move)', body: 'P가 커밋 a를 보내고, V가 랜덤 챌린지 e를 생성, P가 응답 z를 보내는 3단계 프로토콜. V가 온라인이어야 하므로 블록체인에서 사용 불가.' },
  { label: 'Fiat-Shamir: e = H(a, stmt)', body: 'V의 랜덤 챌린지를 해시 함수로 대체. 커밋 a가 정해진 뒤에만 e가 결정되므로 조작이 불가능하다.' },
  { label: '비대화형 증명 pi = (a, z)', body: '증명자가 혼자 a, e, z를 모두 계산하고 (a, z)만 전송. 검증자는 같은 해시로 e를 복원해 검증한다.' },
  { label: 'Random Oracle Model (ROM)', body: 'H를 완전한 랜덤 함수로 모델링하면, 대화형과 동일한 건전성이 보장된다. 실제 구현에서는 SHA-256이나 Poseidon을 사용.' },
];

/* Step 0: Interactive 3-move protocol diagram */
function InteractiveDiagram() {
  const pX = 50, vX = 370, arrowY0 = 48, arrowGap = 32;
  const boxW = 80, boxH = 44;
  const moves = [
    { from: pX + boxW, to: vX, y: arrowY0, label: 'a = g^r', sub: '커밋', color: C.int, dir: 1 },
    { from: vX, to: pX + boxW, y: arrowY0 + arrowGap, label: 'e <- random', sub: '챌린지', color: '#ef4444', dir: -1 },
    { from: pX + boxW, to: vX, y: arrowY0 + arrowGap * 2, label: 'z = r + e*x', sub: '응답', color: C.int, dir: 1 },
  ];
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
      {/* P box */}
      <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
        <rect x={pX} y={28} width={boxW} height={boxH} rx={8}
          fill="var(--card)" stroke={C.int} strokeWidth={1} />
        <rect x={pX} y={28} width={boxW} height={5} rx={0} fill={C.int} opacity={0.85}
          clipPath="url(#fs-pclip)" />
        <text x={pX + boxW / 2} y={55} textAnchor="middle" fontSize={11} fontWeight={700}
          fill="var(--foreground)">증명자 P</text>
        <text x={pX + boxW / 2} y={67} textAnchor="middle" fontSize={8}
          fill="var(--muted-foreground)">비밀 x 보유</text>
      </motion.g>

      {/* V box */}
      <motion.g initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
        <rect x={vX} y={28} width={boxW} height={boxH} rx={8}
          fill="var(--card)" stroke="#ef4444" strokeWidth={1} />
        <rect x={vX} y={28} width={boxW} height={5} rx={0} fill="#ef4444" opacity={0.85}
          clipPath="url(#fs-vclip)" />
        <text x={vX + boxW / 2} y={55} textAnchor="middle" fontSize={11} fontWeight={700}
          fill="var(--foreground)">검증자 V</text>
        <text x={vX + boxW / 2} y={67} textAnchor="middle" fontSize={8}
          fill="var(--muted-foreground)">온라인 필요</text>
      </motion.g>

      {/* 3 arrows */}
      {moves.map((m, i) => {
        const midX = (m.from + m.to) / 2;
        return (
          <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ ...sp, delay: 0.15 + i * 0.12 }}>
            <line x1={m.from + (m.dir > 0 ? 4 : -4)} y1={m.y}
              x2={m.to + (m.dir > 0 ? -4 : 4)} y2={m.y}
              stroke={m.color} strokeWidth={0.8} markerEnd={`url(#fs-arr-${i})`} />
            <rect x={midX - 44} y={m.y - 18} width={88} height={16} rx={4}
              fill="var(--card)" stroke={m.color} strokeWidth={0.5} />
            <text x={midX} y={m.y - 7} textAnchor="middle" fontSize={8} fontWeight={600}
              fill={m.color}>{m.label}</text>
            <text x={midX} y={m.y + 12} textAnchor="middle" fontSize={7}
              fill="var(--muted-foreground)">{m.sub}</text>
          </motion.g>
        );
      })}

      {/* verification box at bottom */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={{ ...sp, delay: 0.6 }}>
        <rect x={140} y={132} width={200} height={22} rx={11}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.6} strokeDasharray="4 3" />
        <text x={240} y={147} textAnchor="middle" fontSize={8} fontWeight={600}
          fill="var(--muted-foreground)">V 온라인 필요 → 블록체인에서 사용 불가</text>
      </motion.g>

      <defs>
        <clipPath id="fs-pclip"><rect x={pX} y={28} width={boxW} height={boxH} rx={8} /></clipPath>
        <clipPath id="fs-vclip"><rect x={vX} y={28} width={boxW} height={boxH} rx={8} /></clipPath>
        {moves.map((m, i) => (
          <marker key={i} id={`fs-arr-${i}`} markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
            <polygon points="0 0, 6 2, 0 4" fill={m.color} opacity={0.6} />
          </marker>
        ))}
      </defs>
    </motion.g>
  );
}

/* Step 1: Fiat-Shamir transform */
function FiatShamirDiagram() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
      <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700}
        fill="var(--foreground)">Fiat-Shamir 변환: V의 챌린지를 해시로 대체</text>

      {/* input: a + statement */}
      <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.1 }}>
        <rect x={20} y={36} width={60} height={32} rx={16}
          fill={`${C.int}12`} stroke={C.int} strokeWidth={0.8} />
        <text x={50} y={56} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.int}>a</text>
      </motion.g>
      <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.15 }}>
        <rect x={20} y={78} width={60} height={32} rx={16}
          fill={`${C.int}12`} stroke={C.int} strokeWidth={0.8} />
        <text x={50} y={98} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.int}>g, y</text>
      </motion.g>

      {/* arrows to hash */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.25 }}>
        <line x1={82} y1={52} x2={130} y2={68} stroke={C.int} strokeWidth={0.7} markerEnd="url(#fs2-arr)" />
        <line x1={82} y1={94} x2={130} y2={80} stroke={C.int} strokeWidth={0.7} markerEnd="url(#fs2-arr)" />
      </motion.g>

      {/* hash function box */}
      <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ ...sp, delay: 0.3 }}>
        <rect x={132} y={52} width={100} height={44} rx={8}
          fill="var(--card)" stroke={C.fs} strokeWidth={1.2} />
        <rect x={132} y={52} width={3.5} height={44} rx={0} fill={C.fs}
          clipPath="url(#fs2-hclip)" />
        <text x={182} y={72} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.fs}>H( )</text>
        <text x={182} y={88} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          SHA-256 등
        </text>
      </motion.g>

      {/* arrow to e */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.45 }}>
        <line x1={234} y1={74} x2={290} y2={74} stroke={C.fs} strokeWidth={1} markerEnd="url(#fs2-arr2)" />
        <rect x={248} y={62} width={30} height={14} rx={3}
          fill="var(--card)" stroke={C.fs} strokeWidth={0.4} />
        <text x={263} y={72} textAnchor="middle" fontSize={7} fill={C.fs}>mod q</text>
      </motion.g>

      {/* e result */}
      <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ ...sp, delay: 0.5 }}>
        <rect x={292} y={54} width={70} height={40} rx={20}
          fill={`${C.fs}15`} stroke={C.fs} strokeWidth={1.5} />
        <text x={327} y={72} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.fs}>e</text>
        <text x={327} y={86} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">챌린지</text>
      </motion.g>

      {/* key insight */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={{ ...sp, delay: 0.65 }}>
        <rect x={90} y={118} width={300} height={26} rx={13}
          fill={`${C.fs}10`} stroke={C.fs} strokeWidth={0.7} />
        <text x={240} y={135} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.fs}>
          a 결정 뒤에만 e 결정 → 챌린지 조작 불가
        </text>
      </motion.g>

      <defs>
        <clipPath id="fs2-hclip"><rect x={132} y={52} width={100} height={44} rx={8} /></clipPath>
        <marker id="fs2-arr" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
          <polygon points="0 0, 6 2, 0 4" fill={C.int} opacity={0.6} />
        </marker>
        <marker id="fs2-arr2" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
          <polygon points="0 0, 6 2, 0 4" fill={C.fs} opacity={0.6} />
        </marker>
      </defs>
    </motion.g>
  );
}

/* Step 2: Non-interactive proof flow */
function NonInteractiveDiagram() {
  const steps = [
    { label: 'r <- Zq', sub: '랜덤 선택', color: C.ni },
    { label: 'a = g^r', sub: '커밋 계산', color: C.ni },
    { label: 'e = H(...)', sub: '자체 챌린지', color: C.fs },
    { label: 'z = r+e*x', sub: '응답 계산', color: C.ni },
  ];
  const x0 = 24, gap = 108, y = 42, w = 80, h = 38;
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
      <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700}
        fill="var(--foreground)">증명자 단독 생성: pi = (a, z)</text>

      {steps.map((s, i) => {
        const cx = x0 + i * gap;
        return (
          <g key={i}>
            {i > 0 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.1 + i * 0.1 }}>
                <line x1={cx - gap + w + 4} y1={y + h / 2}
                  x2={cx - 4} y2={y + h / 2}
                  stroke="var(--muted-foreground)" strokeWidth={0.7} markerEnd="url(#ni-arr)" />
              </motion.g>
            )}
            <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              transition={{ ...sp, delay: i * 0.1 }}>
              <rect x={cx} y={y} width={w} height={h} rx={6}
                fill="var(--card)" stroke={s.color} strokeWidth={0.8} />
              <rect x={cx} y={y} width={3.5} height={h} rx={0} fill={s.color}
                clipPath={`url(#ni-clip-${i})`} />
              <text x={cx + w / 2 + 2} y={y + h / 2 - 2} textAnchor="middle"
                fontSize={10} fontWeight={600} fill="var(--foreground)">{s.label}</text>
              <text x={cx + w / 2 + 2} y={y + h / 2 + 12} textAnchor="middle"
                fontSize={8} fill="var(--muted-foreground)">{s.sub}</text>
            </motion.g>
          </g>
        );
      })}

      {/* output: pi = (a, z) */}
      <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ ...sp, delay: 0.55 }}>
        <line x1={x0 + 3 * gap + w + 4} y1={y + h / 2} x2={x0 + 3 * gap + w + 28} y2={y + h / 2}
          stroke={C.ni} strokeWidth={1} markerEnd="url(#ni-arr2)" />
        <rect x={x0 + 3 * gap + w + 4} y={y + h + 8} width={55} height={26} rx={13}
          fill={`${C.ni}15`} stroke={C.ni} strokeWidth={1.2} />
        <text x={x0 + 3 * gap + w + 31} y={y + h + 25} textAnchor="middle"
          fontSize={10} fontWeight={700} fill={C.ni}>pi</text>
      </motion.g>

      {/* verifier note */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={{ ...sp, delay: 0.7 }}>
        <rect x={80} y={110} width={320} height={26} rx={13}
          fill={`${C.ni}08`} stroke={C.ni} strokeWidth={0.6} />
        <text x={240} y={127} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.ni}>
          검증자: e' = H(g||y||a) 복원 → g^z == a * y^e' 확인
        </text>
      </motion.g>

      <defs>
        {steps.map((_, i) => (
          <clipPath key={i} id={`ni-clip-${i}`}>
            <rect x={x0 + i * gap} y={y} width={80} height={h} rx={6} />
          </clipPath>
        ))}
        <marker id="ni-arr" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
          <polygon points="0 0, 6 2, 0 4" fill="var(--muted-foreground)" opacity={0.5} />
        </marker>
        <marker id="ni-arr2" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
          <polygon points="0 0, 6 2, 0 4" fill={C.ni} opacity={0.7} />
        </marker>
      </defs>
    </motion.g>
  );
}

/* Step 3: ROM assumption */
function ROMDiagram() {
  const hashImpls = [
    { label: 'SHA-256', x: 80 },
    { label: 'BLAKE2', x: 200 },
    { label: 'Poseidon', x: 320 },
  ];
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
      <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700}
        fill="var(--foreground)">Random Oracle Model (ROM)</text>

      {/* Random Oracle concept */}
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.1 }}>
        <rect x={130} y={30} width={220} height={46} rx={8}
          fill="var(--card)" stroke={C.rom} strokeWidth={1} />
        <rect x={130} y={30} width={220} height={5} fill={C.rom} opacity={0.85}
          clipPath="url(#rom-clip)" />
        <text x={240} y={52} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.rom}>
          H(x) = truly random
        </text>
        <text x={240} y={68} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          같은 입력 → 같은 출력, 그 외 완전 무작위
        </text>
      </motion.g>

      {/* arrow down */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.3 }}>
        <line x1={240} y1={78} x2={240} y2={94} stroke={C.rom} strokeWidth={0.8}
          markerEnd="url(#rom-arr)" />
        <text x={240} y={90} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          실제 구현
        </text>
      </motion.g>

      {/* implementation boxes */}
      {hashImpls.map((h, i) => (
        <motion.g key={h.label} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          transition={{ ...sp, delay: 0.35 + i * 0.08 }}>
          <rect x={h.x} y={100} width={90} height={32} rx={16}
            fill={`${C.rom}10`} stroke={C.rom} strokeWidth={0.7} />
          <text x={h.x + 45} y={120} textAnchor="middle"
            fontSize={10} fontWeight={600} fill={C.rom}>{h.label}</text>
        </motion.g>
      ))}

      {/* soundness note */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={{ ...sp, delay: 0.6 }}>
        <rect x={80} y={142} width={320} height={20} rx={10}
          fill={`${C.ni}10`} stroke={C.ni} strokeWidth={0.6} />
        <text x={240} y={156} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.ni}>
          ROM 하에서 대화형과 동일한 건전성 보장
        </text>
      </motion.g>

      <defs>
        <clipPath id="rom-clip"><rect x={130} y={30} width={220} height={46} rx={8} /></clipPath>
        <marker id="rom-arr" markerWidth="6" markerHeight="4" refX="3" refY="2" orient="auto">
          <polygon points="0 0, 6 2, 0 4" fill={C.rom} opacity={0.6} />
        </marker>
      </defs>
    </motion.g>
  );
}

export default function FiatShamirViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 490 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <InteractiveDiagram />}
          {step === 1 && <FiatShamirDiagram />}
          {step === 2 && <NonInteractiveDiagram />}
          {step === 3 && <ROMDiagram />}
        </svg>
      )}
    </StepViz>
  );
}
