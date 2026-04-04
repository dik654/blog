import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'Rust 소스코드', body: 'Guest 프로그램을 표준 Rust로 작성합니다.' },
  { label: 'LLVM 컴파일', body: 'rustc가 LLVM riscv32im 백엔드로 크로스 컴파일합니다.' },
  { label: 'ELF 바이너리', body: '.text(코드)와 .rodata(상수) 섹션으로 구성된 ELF 생성.' },
  { label: 'ELF 로드', body: 'Program 구조체에 명령어와 초기 메모리를 매핑합니다.' },
  { label: '실행', body: 'Executor가 PC=0x200000부터 명령어를 순차 실행합니다.' },
  { label: '추적 생성', body: '모든 사이클의 레지스터/메모리 변화를 기록합니다.' },
];

const NODES = [
  { label: 'Rust 소스', sub: 'main.rs', color: '#6366f1' },
  { label: 'LLVM', sub: 'riscv32im', color: '#818cf8' },
  { label: 'RISC-V ELF', sub: '.text+.rodata', color: '#10b981' },
  { label: 'ELF 로더', sub: 'Program', color: '#f59e0b' },
  { label: 'Executor', sub: '명령어 실행', color: '#8b5cf6' },
  { label: 'Trace', sub: '증명용 추적', color: '#ec4899' },
];

const EDGES = ['rustc', '크로스 컴파일', 'include_bytes!', 'PC=0x200000', '사이클 기록'];

export default function BuildPipelineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 760 80" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="bp-arr" viewBox="0 0 6 6" refX={5} refY={3}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M0 0L6 3L0 6z" fill="#888" />
            </marker>
          </defs>
          {NODES.map((n, i) => {
            const x = i * 103;
            const active = i === step;
            const done = i < step;
            return (
              <g key={i}>
                {i > 0 && (
                  <motion.line x1={x - 6} y1={40} x2={x + 2} y2={40}
                    stroke={done || active ? NODES[i].color : '#555'}
                    strokeWidth={1.5} markerEnd="url(#bp-arr)"
                    animate={{ opacity: done || active ? 0.9 : 0.15 }}
                  />
                )}
                <motion.rect x={x + 4} y={12} width={94} height={56} rx={8}
                  fill={n.color}
                  animate={{ opacity: active ? 1 : done ? 0.5 : 0.15 }}
                  transition={{ duration: 0.3 }}
                />
                <text x={x + 51} y={35} textAnchor="middle"
                  fontSize={11} fontWeight={700} fill="white"
                  style={{ opacity: active ? 1 : done ? 0.7 : 0.3 }}>
                  {n.label}
                </text>
                <text x={x + 51} y={50} textAnchor="middle"
                  fontSize={10} fill="white" opacity={0.6}
                  style={{ opacity: active ? 1 : done ? 0.5 : 0.2 }}>
                  {n.sub}
                </text>
                {i > 0 && (
                  <text x={x - 2} y={30} textAnchor="middle"
                    fontSize={10} fill="var(--muted-foreground)"
                    style={{ opacity: done || active ? 0.7 : 0.15 }}>
                    {EDGES[i - 1]}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
