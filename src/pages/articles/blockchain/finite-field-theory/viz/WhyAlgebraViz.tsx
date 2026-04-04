import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C1 = '#6366f1', C2 = '#ef4444', C3 = '#10b981';

const STEPS = [
  { label: '왜 대수 구조가 필요한가?',
    body: 'ZKP는 "비밀을 알고 있다"를 수학적으로 증명. 연산이 예측 가능하게 동작해야 증명이 성립.' },
  { label: '일반 정수의 문제',
    body: '3 / 2 = 1.5 — 정수가 아닌 값. 컴퓨터에서 소수점은 오차를 만든다. 닫힌 산술이 안 된다.' },
  { label: '유한체가 해결',
    body: 'F7 = {0,1,2,3,4,5,6} — 어떤 연산도 0~6 안. mod 연산으로 닫힘. 나눗셈도 정확히 동작.' },
  { label: '공리의 계층',
    body: '이 닫힌 산술이 성립하는 규칙을 정리한 것이 군 -> 환 -> 체. 체가 ZKP의 핵심 무대.' },
];

export default function WhyAlgebraViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 420 130" className="w-full max-w-2xl"
          style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={110} y={30} width={200} height={70} rx={8}
                fill={`${C1}10`} stroke={C1} strokeWidth={1} />
              <text x={210} y={58} textAnchor="middle" fontSize={11}
                fontWeight={600} fill={C1}>ZKP</text>
              <text x={210} y={76} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">연산 결과가 항상 같은 집합 안에 있어야</text>
              <text x={210} y={90} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">증명이 성립</text>
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={60} y={30} width={130} height={60} rx={6}
                fill={`${C2}10`} stroke={C2} strokeWidth={1} />
              <text x={125} y={55} textAnchor="middle" fontSize={10}
                fontWeight={500} fill={C2}>3 / 2 = 1.5</text>
              <text x={125} y={72} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">정수 아님!</text>
              <text x={260} y={62} fontSize={10}
                fill="var(--muted-foreground)">닫힘 실패</text>
              <line x1={195} y1={60} x2={245} y2={60}
                stroke={C2} strokeWidth={0.8} />
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={80} y={20} width={260} height={90} rx={8}
                fill={`${C3}08`} stroke={C3} strokeWidth={1} />
              <text x={210} y={42} textAnchor="middle" fontSize={10}
                fontWeight={600} fill={C3}>
                F7 = {'{'} 0, 1, 2, 3, 4, 5, 6 {'}'}
              </text>
              <text x={210} y={62} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">
                3 + 4 = 7 mod 7 = 0 (닫힘)
              </text>
              <text x={210} y={78} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">
                6 / 3 = 6 x 5 = 30 mod 7 = 2 (나눗셈 가능)
              </text>
              <text x={210} y={100} textAnchor="middle" fontSize={9}
                fill={C3} fontWeight={500}>모든 연산 정확</text>
            </motion.g>
          )}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {[
                { label: '군', y: 90, c: C1 },
                { label: '환', y: 60, c: '#8b5cf6' },
                { label: '체', y: 30, c: C3 },
              ].map((s, i) => (
                <g key={s.label}>
                  <rect x={160} y={s.y} width={100} height={22} rx={4}
                    fill={`${s.c}12`} stroke={s.c} strokeWidth={1} />
                  <text x={210} y={s.y + 15} textAnchor="middle"
                    fontSize={10} fontWeight={500} fill={s.c}>
                    {s.label}
                  </text>
                  {i < 2 && (
                    <line x1={210} y1={s.y} x2={210} y2={s.y - 8}
                      stroke="var(--border)" strokeWidth={0.8} />
                  )}
                </g>
              ))}
              <text x={280} y={48} fontSize={9} fill={C3}
                fontWeight={500}>ZKP 무대</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
