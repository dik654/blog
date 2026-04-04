import { motion } from 'framer-motion';
import { ActionBox, DataBox, ModuleBox } from '@/components/viz/boxes';
import { C } from './ConstructionVizData';

/* Step 0: 반복 제곱 과정 */
export function StepSquaring() {
  const vals = ['x', 'x\u00B2', 'x\u2074', 'x\u2078', '...', 'y'];
  return (<g>
    <defs><marker id="sq-a" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
      <path d="M0,0 L6,3 L0,6" fill={C.sq} /></marker></defs>
    {vals.map((v, i) => {
      const x = 8 + i * 68;
      return (
        <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}>
          <circle cx={x + 24} cy={45} r={18} fill={`${C.sq}12`}
            stroke={i === vals.length - 1 ? C.pf : C.sq} strokeWidth={1} />
          <text x={x + 24} y={49} textAnchor="middle" fontSize={11} fontWeight={600}
            fill={i === vals.length - 1 ? C.pf : C.sq}>{v}</text>
          {i < vals.length - 1 && (
            <line x1={x + 42} y1={45} x2={x + 54} y2={45}
              stroke={C.sq} strokeWidth={0.7} markerEnd="url(#sq-a)" />
          )}
        </motion.g>
      );
    })}
    <motion.text x={210} y={85} textAnchor="middle" fontSize={11} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      mod N (RSA 그룹) — phi(N) 모르면 단축 불가
    </motion.text>
    <motion.text x={210} y={100} textAnchor="middle" fontSize={11} fill={C.sq}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
      T번 순차 제곱이 유일한 경로
    </motion.text>
  </g>);
}

/* Step 1: Wesolowski 증명 */
export function StepWesolowski() {
  return (<g>
    <ModuleBox x={10} y={15} w={100} h={44} label="증명자" sub="pi = x^(2^T/l)" color={C.sq} />
    <ModuleBox x={310} y={15} w={100} h={44} label="검증자" sub="l 선택, 검증" color={C.vf} />
    <motion.line x1={110} y1={37} x2={310} y2={37}
      stroke={C.pf} strokeWidth={1} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }} />
    <motion.text x={210} y={32} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.pf}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      proof pi 전송
    </motion.text>
    <DataBox x={145} y={72} w={130} h={28} label="pi^l * x^r == y ?" color={C.vf} />
    <motion.text x={210} y={115} textAnchor="middle" fontSize={11} fill={C.pf}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      증명 1개, 지수 연산 2번으로 검증 완료
    </motion.text>
  </g>);
}

/* Step 2: Pietrzak 재귀 반분할 */
export function StepPietrzak() {
  const levels = [
    { w: 360, label: 'T 스텝', y: 12 },
    { w: 170, label: 'T/2', y: 52 },
    { w: 75, label: 'T/4', y: 92 },
  ];
  return (<g>
    {levels.map((lv, i) => {
      const x = 210 - lv.w / 2;
      return (
        <motion.g key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.2 }}>
          <rect x={x} y={lv.y} width={lv.w} height={26} rx={5}
            fill={`${C.pf}10`} stroke={C.pf} strokeWidth={0.8} />
          <text x={210} y={lv.y + 17} textAnchor="middle" fontSize={11} fontWeight={600}
            fill={C.pf}>{lv.label}</text>
          {i < levels.length - 1 && (
            <ActionBox x={170} y={lv.y + 26} w={80} h={20}
              label={`mu${i + 1} 공개`} color={C.vf} />
          )}
        </motion.g>
      );
    })}
    <text x={210} y={128} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      재귀 반분할 → 증명 크기 O(log T)
    </text>
  </g>);
}
