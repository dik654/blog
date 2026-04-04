import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';

const C1 = '#6366f1', C2 = '#10b981', C3 = '#f59e0b';
const STEP_REFS = ['jump-table', 'op-add', 'memory', 'op-sload'];
const STEP_LABELS = ['jump_table.go — JumpTable[256]', 'instructions.go — opAdd()', 'memory.go — Memory 구현', 'instructions.go — opSload/Sstore'];

const STEPS = [
  { label: '오피코드 카테고리', body: '스택, 산술, 메모리, 저장소, 흐름 제어 — 가스 비용은 자원 사용량에 비례.' },
  { label: '스택 & 산술 (저비용)', body: 'ADD=3gas, PUSH=3gas. 메모리 내 연산으로 빠르고 저렴.' },
  { label: '메모리 (중비용)', body: 'MLOAD=3gas 기본이나 확장 시 이차적 증가. 실행 중에만 존재하는 휘발성 공간.' },
  { label: '저장소 (고비용)', body: 'SSTORE=20000gas(0→nonzero). 영구 상태 변경은 모든 노드의 디스크에 기록되므로 비쌈.' },
];

const CATS = [
  { name: '스택/산술', gas: '3~5', x: 30, w: 90, color: C2 },
  { name: '메모리', gas: '3+확장', x: 140, w: 90, color: C1 },
  { name: '저장소', gas: '100~20k', x: 250, w: 90, color: C3 },
  { name: '흐름제어', gas: '8~10', x: 360, w: 55, color: C2 },
];

export default function OpcodeViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <div className="w-full">
          <svg viewBox="0 0 420 130" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <text x={15} y={105} fontSize={10} fill="var(--muted-foreground)">Gas</text>
            <line x1={40} y1={100} x2={400} y2={100} stroke="var(--border)" strokeWidth={0.6} />
            <text x={40} y={115} fontSize={10} fill="var(--muted-foreground)">저</text>
            <text x={400} y={115} textAnchor="end" fontSize={10} fill="var(--muted-foreground)">고</text>
            {CATS.map((c, i) => {
              const active = (step === 1 && i === 0) || (step === 2 && i === 1) ||
                (step === 3 && i === 2) || step === 0;
              return (
                <motion.g key={c.name} animate={{ opacity: active ? 1 : 0.2 }}>
                  <rect x={c.x} y={25} width={c.w} height={55} rx={5}
                    fill={`${c.color}${active ? '10' : '05'}`}
                    stroke={c.color} strokeWidth={active ? 1.2 : 0.5} />
                  <text x={c.x + c.w / 2} y={45} textAnchor="middle" fontSize={10} fontWeight={500} fill={c.color}>
                    {c.name}</text>
                  <text x={c.x + c.w / 2} y={60} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
                    {c.gas} gas</text>
                  {active && i < 3 && (
                    <motion.text x={c.x + c.w / 2} y={73} textAnchor="middle" fontSize={10}
                      fill="var(--muted-foreground)" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      {i === 0 ? 'ADD,MUL,PUSH' : i === 1 ? 'MLOAD,MSTORE' : 'SLOAD,SSTORE'}
                    </motion.text>
                  )}
                  <circle cx={c.x + c.w / 2} cy={100} r={3} fill={c.color} opacity={active ? 1 : 0.3} />
                </motion.g>
              );
            })}
          </svg>
          {onOpenCode && (
            <div className="flex items-center gap-2 mt-3 justify-end">
              <CodeViewButton onClick={() => onOpenCode(STEP_REFS[step])} />
              <span className="text-[10px] text-muted-foreground">{STEP_LABELS[step]}</span>
            </div>
          )}
        </div>
      )}
    </StepViz>
  );
}
