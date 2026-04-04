import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';

const STEPS = [
  { label: 'EVM 바이트코드 입력', body: 'Solidity 컴파일 결과인 EVM 바이트코드를 수신합니다.' },
  { label: 'asmjit IR 변환', body: '옵코드를 분석하여 내부 IR(Intermediate Repr.)로 변환합니다.' },
  { label: '레지스터 할당 & 최적화', body: '스택 연산을 레지스터로 매핑하고 불필요한 검사를 제거합니다.' },
  { label: 'x86 네이티브 코드 출력', body: '최적화된 네이티브 기계어를 캐시에 저장합니다.' },
];

const BOXES = [
  { x: 20, label: 'Bytecode', c: '#8b5cf6' },
  { x: 120, label: 'IR', c: '#0ea5e9' },
  { x: 220, label: 'Optimized', c: '#10b981' },
  { x: 320, label: 'x86 Native', c: '#f59e0b' },
];

export default function JITCompileViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <div className="w-full">
        <svg viewBox="0 0 440 100" className="w-full max-w-xl mx-auto" style={{ height: 'auto' }}>
          {BOXES.map((b, i) => {
            const active = i === step;
            const passed = i <= step;
            return (
              <motion.g key={i} animate={{ opacity: passed ? 1 : 0.2 }}
                transition={{ duration: 0.3 }}>
                <rect x={b.x} y={30} width={80} height={32} rx={6}
                  fill={b.c + (active ? '20' : '08')} stroke={b.c}
                  strokeWidth={active ? 1.5 : 0.7}
                  strokeOpacity={active ? 0.8 : 0.2} />
                <text x={b.x + 40} y={50} textAnchor="middle"
                  fontSize={9} fontWeight={600} fill={b.c}>{b.label}</text>
                {i < 3 && (
                  <motion.line x1={b.x + 82} y1={46} x2={BOXES[i + 1].x - 2} y2={46}
                    stroke={passed && i < step ? b.c : 'currentColor'}
                    strokeWidth={1} strokeOpacity={passed && i < step ? 0.5 : 0.1}
                    markerEnd="url(#jitarr)" />
                )}
              </motion.g>
            );
          })}
          {/* speedup label */}
          <text x={220} y={82} textAnchor="middle" fontSize={9}
            fill="#10b981" fillOpacity={0.5}>
            Interpreter 대비 2.01x 속도 향상
          </text>
          <defs>
            <marker id="jitarr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
              <path d="M0,0 L5,2.5 L0,5 Z" fill="currentColor" fillOpacity={0.3} />
            </marker>
          </defs>
        </svg>
          {onOpenCode && (
            <div className="flex items-center gap-2 mt-3 justify-end">
              <CodeViewButton onClick={() => onOpenCode('monad-jit-compile')} />
              <span className="text-[10px] text-muted-foreground">소스 보기</span>
            </div>
          )}
        </div>
      )}
    </StepViz>
  );
}
