import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = {
  prover: '#6366f1',
  verifier: '#3b82f6',
  oracle: '#8b5cf6',
  query: '#f59e0b',
  bcs: '#ec4899',
  aurora: '#10b981',
  ligero: '#8b5cf6',
  fractal: '#f59e0b',
  marlin: '#3b82f6',
  warn: '#ef4444',
};

const STEPS = [
  {
    label: '① Interactive Proof — Prover ↔ Verifier 메시지 교환',
    body:
      'IP(Interactive Proof): Prover와 Verifier가 다중 라운드 메시지 교환.\n' +
      '문제: 메시지 전체를 송신 → bandwidth 비효율.',
  },
  {
    label: '② Oracle 도입 — Verifier 가 일부 위치만 query',
    body:
      'IOP: Prover의 메시지가 "oracle"이 됨.\n' +
      'Verifier는 전체를 받지 않고 특정 위치만 query.\n' +
      '→ bandwidth O(n)에서 O(log n) 수준으로 감소.',
  },
  {
    label: '③ PCP vs IP vs IOP — 3-way 비교',
    body:
      'PCP: 단일 static proof + 상수 query (강력하지만 비효율).\n' +
      'IP : 메시지 전체 송신, 다중 라운드 (bandwidth 많음).\n' +
      'IOP: 다중 oracle + query → 효율 + 라운드 활용.',
  },
  {
    label: '④ BCS Transform — IOP → NIZK (zkSNARK)',
    body:
      'Oracle → Merkle commit (root만 송신).\n' +
      'Challenge → Fiat-Shamir hash (해시 체인으로 결정론적).\n' +
      'Query → Merkle path (개방 증명).\n' +
      '→ 비상호작용 zkSNARK 완성.',
  },
  {
    label: '⑤ 4 IOP 프로토콜 비교 — Aurora / Ligero / Fractal / Marlin',
    body:
      'Aurora (2019, FRI): proof O(log² n), verifier O(log² n).\n' +
      'Ligero (2017, Direct LDT): proof O(√n), verifier O(n).\n' +
      'Fractal (2020, FRI+recursion): preprocessing SNARK.\n' +
      'Marlin (2019): universal preprocessing SNARK.',
  },
];

export default function IOPDefinitionViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-3xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ModuleBox x={30} y={30} w={110} h={50} label="Prover" sub="P" color={C.prover} />
              <ModuleBox x={340} y={30} w={110} h={50} label="Verifier" sub="V" color={C.verifier} />
              {[0, 1, 2].map((i) => (
                <g key={i}>
                  <motion.line
                    x1={140} y1={100 + i * 28} x2={340} y2={100 + i * 28}
                    stroke={C.prover} strokeWidth={1.2} markerEnd="url(#arrP)"
                    initial={{ opacity: 0, pathLength: 0 }}
                    animate={{ opacity: 1, pathLength: 1 }}
                    transition={{ ...sp, delay: 0.1 + i * 0.15 }}
                  />
                  <motion.text
                    x={240} y={96 + i * 28} textAnchor="middle"
                    fontSize={9} fill={C.prover}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ ...sp, delay: 0.2 + i * 0.15 }}
                  >
                    msg_{i + 1} (전체 송신)
                  </motion.text>
                </g>
              ))}
              <defs>
                <marker id="arrP" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
                  <path d="M0,0 L5,2.5 L0,5 z" fill={C.prover} />
                </marker>
              </defs>
              <text x={240} y={205} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                IP: 메시지 전체 송신 → bandwidth 비효율
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ModuleBox x={30} y={30} w={110} h={50} label="Prover" sub="oracle 생성" color={C.prover} />
              <ModuleBox x={340} y={30} w={110} h={50} label="Verifier" sub="query만" color={C.verifier} />
              {/* oracle row */}
              <text x={155} y={115} fontSize={9} fill={C.oracle}>oracle π:</text>
              {Array.from({ length: 12 }).map((_, i) => {
                const queried = i === 2 || i === 7 || i === 10;
                return (
                  <motion.rect
                    key={i}
                    x={195 + i * 14} y={105} width={12} height={14} rx={2}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      fill: queried ? `${C.query}55` : `${C.oracle}1a`,
                      stroke: queried ? C.query : C.oracle,
                    }}
                    transition={{ ...sp, delay: 0.05 * i }}
                    strokeWidth={queried ? 1.4 : 0.6}
                  />
                );
              })}
              {/* query arrows */}
              {[2, 7, 10].map((idx, k) => (
                <motion.g key={idx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ ...sp, delay: 0.7 + k * 0.12 }}>
                  <line x1={395} y1={80} x2={201 + idx * 14} y2={104}
                    stroke={C.query} strokeWidth={0.8} strokeDasharray="2 2" />
                  <text x={201 + idx * 14} y={100} textAnchor="middle" fontSize={7.5} fill={C.query}>
                    π[{idx}]
                  </text>
                </motion.g>
              ))}
              <text x={240} y={155} textAnchor="middle" fontSize={9} fill={C.oracle}>
                Prover → oracle (전체 송신 X)
              </text>
              <text x={240} y={170} textAnchor="middle" fontSize={9} fill={C.query}>
                Verifier → query 위치만 receive
              </text>
              <text x={240} y={205} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                bandwidth: O(n) → O(query 수)
              </text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* PCP card */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.05 }}>
                <rect x={20} y={20} width={140} height={180} rx={8}
                  fill="#0ea5e911" stroke="#0ea5e9" strokeWidth={1} />
                <text x={90} y={42} textAnchor="middle" fontSize={11} fontWeight={700} fill="#0ea5e9">PCP</text>
                <text x={90} y={58} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">Probabilistic CP</text>
                <text x={32} y={88} fontSize={9} fill="var(--foreground)">proof : 단일 static</text>
                <text x={32} y={108} fontSize={9} fill="var(--foreground)">size  : O(n) 큼</text>
                <text x={32} y={128} fontSize={9} fill="var(--foreground)">query : 상수 (3~)</text>
                <text x={32} y={148} fontSize={9} fill="var(--foreground)">round : 1</text>
                <text x={32} y={172} fontSize={8.5} fill="#0ea5e9">강력하지만 비효율</text>
              </motion.g>
              {/* IP card */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.15 }}>
                <rect x={170} y={20} width={140} height={180} rx={8}
                  fill={`${C.prover}11`} stroke={C.prover} strokeWidth={1} />
                <text x={240} y={42} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.prover}>IP</text>
                <text x={240} y={58} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">Interactive Proof</text>
                <text x={182} y={88} fontSize={9} fill="var(--foreground)">proof : 메시지 전체</text>
                <text x={182} y={108} fontSize={9} fill="var(--foreground)">size  : O(n) 큼</text>
                <text x={182} y={128} fontSize={9} fill="var(--foreground)">query : 전체 read</text>
                <text x={182} y={148} fontSize={9} fill="var(--foreground)">round : 다중</text>
                <text x={182} y={172} fontSize={8.5} fill={C.prover}>bandwidth 비효율</text>
              </motion.g>
              {/* IOP card */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.25 }}>
                <rect x={320} y={20} width={140} height={180} rx={8}
                  fill={`${C.aurora}11`} stroke={C.aurora} strokeWidth={1.4} />
                <text x={390} y={42} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.aurora}>IOP</text>
                <text x={390} y={58} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">Interactive Oracle</text>
                <text x={332} y={88} fontSize={9} fill="var(--foreground)">proof : 다중 oracle</text>
                <text x={332} y={108} fontSize={9} fill="var(--foreground)">size  : 작음</text>
                <text x={332} y={128} fontSize={9} fill="var(--foreground)">query : 일부 위치</text>
                <text x={332} y={148} fontSize={9} fill="var(--foreground)">round : 다중</text>
                <text x={332} y={172} fontSize={8.5} fill={C.aurora}>효율 + 라운드 활용</text>
              </motion.g>
              <text x={240} y={228} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                IOP = IP + Oracle (PCP의 query 효율 + IP의 round 구조)
              </text>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.bcs}>
                BCS Transform: IOP → zkSNARK
              </text>
              {/* left: IOP side */}
              <DataBox x={20} y={45} w={120} h={28} label="oracle πᵢ" color={C.oracle} />
              <DataBox x={20} y={95} w={120} h={28} label="verifier challenge" color={C.query} />
              <DataBox x={20} y={145} w={120} h={28} label="query position" color={C.query} />
              {/* arrows */}
              {[60, 110, 160].map((y, i) => (
                <motion.g key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: 0.15 + i * 0.12 }}>
                  <line x1={140} y1={y} x2={310} y2={y}
                    stroke={C.bcs} strokeWidth={1} markerEnd="url(#arrBcs)" />
                  <text x={225} y={y - 4} textAnchor="middle" fontSize={8} fill={C.bcs}>
                    {['Merkle commit', 'Fiat-Shamir hash', 'Merkle path open'][i]}
                  </text>
                </motion.g>
              ))}
              {/* right: NIZK side */}
              <DataBox x={310} y={45} w={150} h={28} label="root_i (32B)" color={C.aurora} />
              <DataBox x={310} y={95} w={150} h={28} label="cₖ = H(state ∥ root)" color={C.aurora} />
              <DataBox x={310} y={145} w={150} h={28} label="merkle_path(cₖ)" color={C.aurora} />
              <defs>
                <marker id="arrBcs" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
                  <path d="M0,0 L5,2.5 L0,5 z" fill={C.bcs} />
                </marker>
              </defs>
              <text x={240} y={205} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                결과: 비상호작용 zkSNARK (블록체인 사용 가능)
              </text>
            </motion.g>
          )}

          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* header */}
              <text x={20} y={22} fontSize={9} fontWeight={700} fill="var(--muted-foreground)">프로토콜</text>
              <text x={150} y={22} fontSize={9} fontWeight={700} fill="var(--muted-foreground)">기법</text>
              <text x={250} y={22} fontSize={9} fontWeight={700} fill="var(--muted-foreground)">proof</text>
              <text x={335} y={22} fontSize={9} fontWeight={700} fill="var(--muted-foreground)">prover</text>
              <text x={410} y={22} fontSize={9} fontWeight={700} fill="var(--muted-foreground)">verifier</text>
              <line x1={15} y1={28} x2={465} y2={28} stroke="var(--border)" strokeWidth={0.6} />
              {[
                { name: 'Aurora', tech: 'FRI', proof: 'O(log² n)', prover: 'O(n log n)', verifier: 'O(log² n)', color: C.aurora, year: '2019' },
                { name: 'Ligero', tech: 'Direct LDT', proof: 'O(√n)', prover: 'O(n log n)', verifier: 'O(n)', color: C.ligero, year: '2017' },
                { name: 'Fractal', tech: 'FRI+recursion', proof: 'O(log² n)', prover: 'O(n log n)', verifier: 'O(log² n)', color: C.fractal, year: '2020' },
                { name: 'Marlin', tech: 'Preprocessing', proof: 'O(log n)', prover: 'O(n log n)', verifier: 'O(log n)', color: C.marlin, year: '2019' },
              ].map((r, i) => (
                <motion.g key={r.name}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: 0.05 + i * 0.1 }}>
                  <rect x={15} y={36 + i * 38} width={450} height={32} rx={6}
                    fill={`${r.color}10`} stroke={r.color} strokeWidth={0.7} />
                  <text x={20} y={56 + i * 38} fontSize={10} fontWeight={700} fill={r.color}>{r.name}</text>
                  <text x={20} y={66 + i * 38} fontSize={7.5} fill="var(--muted-foreground)">{r.year}</text>
                  <text x={150} y={58 + i * 38} fontSize={9} fill="var(--foreground)">{r.tech}</text>
                  <text x={250} y={58 + i * 38} fontSize={9} fill="var(--foreground)">{r.proof}</text>
                  <text x={335} y={58 + i * 38} fontSize={9} fill="var(--foreground)">{r.prover}</text>
                  <text x={410} y={58 + i * 38} fontSize={9} fill="var(--foreground)">{r.verifier}</text>
                </motion.g>
              ))}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
