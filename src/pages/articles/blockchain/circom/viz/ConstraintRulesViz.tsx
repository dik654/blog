import { useState } from 'react';
import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const COLORS = {
  A: '#6366f1',
  B: '#10b981',
  C: '#f59e0b',
  aux: '#ec4899',
  linear: '#8b5cf6',
  optimize: '#06b6d4',
};

const STEPS = [
  {
    label: '1. c <== a * b — 단일 R1CS',
    body: '가장 단순한 곱셈 제약. A=a, B=b, C=c 로 바로 하나의 R1CS 행이 만들어진다.',
  },
  {
    label: '2. c <== a + b — 선형 흡수 (R1CS 0개)',
    body: '덧셈만 있는 식은 Rank-1 곱 구조가 필요 없다. Circom 은 LC(선형 결합) 객체로만 기록하고, R1CS 제약은 발생하지 않는다.',
  },
  {
    label: '3. c <== (a+b) * (d+e) — 단일 R1CS',
    body: 'A, B 열 각각에 LC 를 그대로 넣을 수 있으므로 여전히 한 줄 제약으로 충분하다. 선형 결합이 "1급 객체"인 이점이 드러나는 케이스.',
  },
  {
    label: '4. c <== a * b + d — 2 R1CS (aux 도입)',
    body: '곱셈 결과에 선형 항이 더해지면 Rank-1 을 유지하기 위해 중간 시그널 aux 를 둔다. aux = a*b (R1CS 1), c = aux + d (선형 — 결국 C 열에 흡수).',
  },
  {
    label: '5. c <== a * b * d — 2 R1CS (삼중 곱)',
    body: '곱이 세 번 겹치면 두 번째 곱도 Rank-1 로 쪼개야 한다. aux = a*b, c = aux*d. 항상 "곱 하나당 제약 하나" 규칙이 지켜진다.',
  },
  {
    label: '6. DAG 최적화 — 선형 소거로 c 제거',
    body: 'd === a+b+c, c === 2b 두 제약 중 뒤 제약은 순수 선형. c 를 대체식으로 흡수하면 d = a + 3b 로 축약되고 c 컬럼 자체가 사라진다.',
  },
];

// R1CS matrix panel: 3 columns (A, B, C) with signal coefficients
interface Row {
  a: Array<[string, string]>;
  b: Array<[string, string]>;
  c: Array<[string, string]>;
  label: string;
}

function MatrixPanel({
  circom,
  rows,
  note,
  noteColor,
  strike,
}: {
  circom: string[];
  rows: Row[];
  note?: string;
  noteColor?: string;
  strike?: { col: 'A' | 'B' | 'C'; signal: string };
}) {
  const colX = { A: 180, B: 280, C: 380 };
  const rowH = 54;
  const startY = 46;

  return (
    <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      {/* Left: Circom source */}
      <motion.rect
        x={14} y={30} width={140} height={90} rx={8}
        initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        fill="#1114" stroke="#8888" strokeWidth={0.8}
      />
      <text x={24} y={48} fontSize={8.5} fill="#888" fontFamily="monospace">circom</text>
      {circom.map((line, i) => (
        <motion.text
          key={i} x={24} y={68 + i * 16} fontSize={10.5} fontFamily="monospace"
          fill="#eaeaea" fontWeight={600}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.15 + i * 0.08 }}
        >
          {line}
        </motion.text>
      ))}

      {/* Right: R1CS header */}
      <text x={colX.A + 30} y={28} textAnchor="middle" fontSize={11}
        fontWeight={700} fill={COLORS.A}>A · s</text>
      <text x={colX.B + 30} y={28} textAnchor="middle" fontSize={11}
        fontWeight={700} fill={COLORS.B}>B · s</text>
      <text x={colX.C + 30} y={28} textAnchor="middle" fontSize={11}
        fontWeight={700} fill={COLORS.C}>C · s</text>

      <text x={colX.A + 75} y={28} textAnchor="middle" fontSize={13}
        fontWeight={700} fill="#666">×</text>
      <text x={colX.B + 75} y={28} textAnchor="middle" fontSize={13}
        fontWeight={700} fill="#666">=</text>

      {/* Rows */}
      {rows.map((r, ri) => {
        const y = startY + ri * rowH;
        return (
          <g key={ri}>
            <motion.text
              x={165} y={y + 24} textAnchor="end" fontSize={9}
              fontFamily="monospace" fill="#888" fontWeight={600}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.25 + ri * 0.2 }}
            >
              {r.label}
            </motion.text>

            {(['A', 'B', 'C'] as const).map((col, ci) => {
              const entries = r[col.toLowerCase() as 'a' | 'b' | 'c'];
              const x = colX[col];
              const color = col === 'A' ? COLORS.A : col === 'B' ? COLORS.B : COLORS.C;
              return (
                <g key={col}>
                  <motion.rect
                    x={x} y={y} width={60} height={36} rx={5}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + ri * 0.2 + ci * 0.06 }}
                    fill={`${color}1a`} stroke={color} strokeWidth={1.1}
                  />
                  {entries.length === 0 ? (
                    <text x={x + 30} y={y + 22} textAnchor="middle" fontSize={10}
                      fontFamily="monospace" fill={color} opacity={0.45}>0</text>
                  ) : (
                    entries.map((e, ei) => {
                      const yy = y + 14 + ei * 13;
                      const isStruck = strike && strike.col === col && e[1] === strike.signal;
                      return (
                        <g key={ei}>
                          <motion.text
                            x={x + 30} y={yy} textAnchor="middle" fontSize={9.5}
                            fontFamily="monospace" fill={color} fontWeight={600}
                            initial={{ opacity: 0 }} animate={{ opacity: isStruck ? 0.4 : 1 }}
                            transition={{ delay: 0.4 + ri * 0.2 + ci * 0.06 + ei * 0.05 }}
                          >
                            {e[0] === '1' ? e[1] : `${e[0]}·${e[1]}`}
                          </motion.text>
                          {isStruck && (
                            <motion.line
                              x1={x + 6} y1={yy - 3} x2={x + 54} y2={yy - 3}
                              stroke={color} strokeWidth={1.2}
                              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                              transition={{ delay: 1.2, duration: 0.5 }}
                            />
                          )}
                        </g>
                      );
                    })
                  )}
                </g>
              );
            })}
          </g>
        );
      })}

      {/* Constraint count badge */}
      <motion.rect
        x={14} y={134} width={140} height={30} rx={6}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        fill={`${noteColor || COLORS.optimize}18`}
        stroke={noteColor || COLORS.optimize} strokeWidth={1}
        strokeDasharray={note?.includes('0개') ? '3 2' : undefined}
      />
      <text x={84} y={153} textAnchor="middle" fontSize={9.5}
        fontFamily="monospace" fontWeight={700}
        fill={noteColor || COLORS.optimize}>
        {note}
      </text>

      {/* R1CS equation hint */}
      <text x={295} y={224} textAnchor="middle" fontSize={9}
        fontFamily="monospace" fill="#888">
        &#8826;A,s&#8827; × &#8826;B,s&#8827; = &#8826;C,s&#8827;
      </text>
    </svg>
  );
}

// Optimize panel: start with 2 rows, strike c column, collapse to a + 3b
function OptimizePanel({ step }: { step: number }) {
  // step: 0 = initial 2 rows, 1 = strike c, 2 = collapsed
  const rows: Row[] = [
    {
      label: 'r1: d ===',
      a: [['1', 'a'], ['1', 'b'], ['1', 'c']],
      b: [['1', '1']],
      c: [['1', 'd']],
    },
    {
      label: 'r2: c ===',
      a: [['2', 'b']],
      b: [['1', '1']],
      c: [['1', 'c']],
    },
  ];
  const collapsedRows: Row[] = [
    {
      label: 'd ===',
      a: [['1', 'a'], ['3', 'b']],
      b: [['1', '1']],
      c: [['1', 'd']],
    },
  ];

  if (step < 2) {
    return (
      <MatrixPanel
        circom={['d === a+b+c;', 'c === 2*b;']}
        rows={rows}
        note={step === 0 ? '2 R1CS (최적화 전)' : '선형 소거 진행중…'}
        noteColor={step === 0 ? COLORS.C : COLORS.linear}
        strike={step === 1 ? { col: 'A', signal: 'c' } : undefined}
      />
    );
  }
  return (
    <MatrixPanel
      circom={['// c 제거됨', 'd = a + 3b']}
      rows={collapsedRows}
      note="1 R1CS (최적화 후)"
      noteColor={COLORS.optimize}
    />
  );
}

// Wrap OptimizePanel with a mini-step button inside final step
function OptimizeStep() {
  const [s, setS] = useState(0);
  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <OptimizePanel step={s} />
      <div className="flex gap-2">
        {['초기 (2 제약)', '선형 소거', '최적화 완료'].map((lbl, i) => (
          <button
            key={i}
            onClick={() => setS(i)}
            className={`px-3 py-1 text-xs rounded border transition-colors cursor-pointer ${
              s === i
                ? 'bg-primary text-primary-foreground border-primary'
                : 'hover:bg-accent'
            }`}
          >
            {lbl}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ConstraintRulesViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        if (step === 0) {
          return (
            <MatrixPanel
              circom={['c <== a * b;']}
              rows={[{
                label: 'r1:',
                a: [['1', 'a']],
                b: [['1', 'b']],
                c: [['1', 'c']],
              }]}
              note="1 R1CS 제약"
              noteColor={COLORS.A}
            />
          );
        }
        if (step === 1) {
          return (
            <MatrixPanel
              circom={['c <== a + b;']}
              rows={[{
                label: 'LC만:',
                a: [],
                b: [],
                c: [['1', 'a'], ['1', 'b'], ['-1', 'c']],
              }]}
              note="0 R1CS · 선형 흡수"
              noteColor={COLORS.linear}
            />
          );
        }
        if (step === 2) {
          return (
            <MatrixPanel
              circom={['c <== (a+b)', '     * (d+e);']}
              rows={[{
                label: 'r1:',
                a: [['1', 'a'], ['1', 'b']],
                b: [['1', 'd'], ['1', 'e']],
                c: [['1', 'c']],
              }]}
              note="1 R1CS (LC 병합)"
              noteColor={COLORS.A}
            />
          );
        }
        if (step === 3) {
          return (
            <MatrixPanel
              circom={['c <== a*b + d;']}
              rows={[
                {
                  label: 'r1:',
                  a: [['1', 'a']],
                  b: [['1', 'b']],
                  c: [['1', 'aux']],
                },
                {
                  label: 'r2 (선형):',
                  a: [['1', 'aux'], ['1', 'd']],
                  b: [['1', '1']],
                  c: [['1', 'c']],
                },
              ]}
              note="2 R1CS · aux 도입"
              noteColor={COLORS.aux}
            />
          );
        }
        if (step === 4) {
          return (
            <MatrixPanel
              circom={['c <== a*b*d;']}
              rows={[
                {
                  label: 'r1:',
                  a: [['1', 'a']],
                  b: [['1', 'b']],
                  c: [['1', 'aux']],
                },
                {
                  label: 'r2:',
                  a: [['1', 'aux']],
                  b: [['1', 'd']],
                  c: [['1', 'c']],
                },
              ]}
              note="2 R1CS · 삼중 곱"
              noteColor={COLORS.aux}
            />
          );
        }
        return <OptimizeStep />;
      }}
    </StepViz>
  );
}
