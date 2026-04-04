import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const IN = [[1,0,1,2,1],[0,1,2,0,1],[1,2,1,0,2],[2,0,1,1,0],[1,1,0,2,1]];
const K = [[1,0,-1],[1,0,-1],[1,0,-1]];
const conv = (r: number, c: number) => {
  let s = 0; for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) s += IN[r+i][c+j] * K[i][j]; return s;
};
const OUT = Array.from({ length: 3 }, (_, r) => Array.from({ length: 3 }, (_, c) => conv(r, c)));

const POS: (null | { r: number; c: number })[] = [
  null, { r: 0, c: 0 }, { r: 0, c: 1 }, { r: 0, c: 2 }, { r: 1, c: 0 }, null,
];
const FILLED = [0, 1, 2, 3, 4, 9];
const C = 22;

const STEPS = [
  { label: '입력과 커널 준비' },
  { label: '위치 (0,0) — 첫 합성곱' },
  { label: '→ stride=1 이동 (0,1)' },
  { label: '→ 첫 행 끝 (0,2)' },
  { label: '↓ 다음 행 시작 (1,0)' },
  { label: '3×3 특징 맵 완성' },
];
const BODY = [
  '5×5 입력 + 3×3 에지 커널',
  '좌상단 원소별 곱의 합 = -2',
  '오른쪽 1칸 슬라이딩, 출력=1',
  '첫 행 마지막, 출력=0',
  '다음 행 왼쪽 끝, 출력=-1',
  '9위치 순회 완성',
];

export default function ConvKernelViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const pos = POS[step];
        const filled = FILLED[step];
        return (
          <svg viewBox="0 0 500 150" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <text x={55} y={12} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--foreground)">입력 (5×5)</text>
            {IN.map((row, r) => row.map((v, c) => (
              <g key={`i${r}${c}`}>
                <rect x={c*C} y={20+r*C} width={C} height={C} fill="color-mix(in oklch, var(--muted) 30%, transparent)" stroke="var(--border)" strokeWidth={0.5} />
                <text x={c*C+C/2} y={20+r*C+C/2+3} textAnchor="middle" fontSize={11} fill="var(--foreground)">{v}</text>
              </g>
            )))}
            {pos && (
              <motion.rect animate={{ x: pos.c * C, y: 20 + pos.r * C }}
                transition={{ type: 'spring', bounce: 0.15, duration: 0.45 }}
                width={3*C} height={3*C} rx={3} fill="#6366f118" stroke="#6366f1" strokeWidth={1.5} />
            )}
            <text x={160} y={12} textAnchor="middle" fontSize={11} fontWeight={600} fill="#6366f1">커널</text>
            {K.map((row, r) => row.map((v, c) => (
              <g key={`k${r}${c}`}>
                <rect x={128+c*18} y={20+r*18} width={18} height={18} fill="#6366f10a" stroke="#6366f130" strokeWidth={0.5} />
                <text x={128+c*18+9} y={20+r*18+12} textAnchor="middle" fontSize={11} fill="#6366f1" fontWeight={600}>{v}</text>
              </g>
            )))}
            <defs><marker id="ca" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
              <path d="M0,0 L6,2 L0,4" fill="var(--muted-foreground)" /></marker></defs>
            <line x1={200} y1={60} x2={228} y2={60} stroke="var(--muted-foreground)" strokeWidth={1.5} markerEnd="url(#ca)" />
            <text x={300} y={12} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--foreground)">출력 (3×3)</text>
            {OUT.map((row, r) => row.map((v, c) => {
              const idx = r * 3 + c;
              const show = idx < filled;
              const active = pos?.r === r && pos?.c === c;
              return (
                <g key={`o${r}${c}`}>
                  <motion.rect x={267+c*C} y={20+r*C} width={C} height={C}
                    animate={{
                      fill: active ? '#22c55e30' : show ? '#22c55e12' : 'color-mix(in oklch, var(--muted) 20%, transparent)',
                      stroke: active ? '#22c55e' : show ? '#22c55e50' : 'var(--border)',
                      strokeWidth: active ? 2 : 0.5,
                    }} transition={{ duration: 0.3 }} />
                  {show && (
                    <motion.text x={267+c*C+C/2} y={20+r*C+C/2+3} textAnchor="middle" fontSize={11} fontWeight={600}
                      initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
                      style={{ fill: active ? '#22c55e' : 'var(--foreground)' }}>{v}</motion.text>
                  )}
                </g>
              );
            }))}
            <motion.text x={360} y={70} fontSize={11}
              fill="var(--muted-foreground)"
              initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}
              key={step}>{BODY[step]}</motion.text>
          </svg>
        );
      }}
    </StepViz>
  );
}
