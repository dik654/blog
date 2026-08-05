import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox } from '@/components/viz/boxes';

const C = {
  sw: '#0ea5e9',     // sky
  hw: '#10b981',     // emerald
  highlight: '#a855f7', // violet
  warn: '#f59e0b',   // amber
};

const STEPS = [
  { label: 'Grid → GPU 전체 (Device)', body: 'Grid 하나는 GPU 디바이스 한 대 전체에 매핑된다.\n커널 호출이 GPU의 전체 자원을 점유.' },
  { label: 'Block → SM (Streaming Multiprocessor)', body: '각 Block은 SM 하나에 통째로 배정.\n동시에 여러 Block이 같은 SM에서 살 수 있다.' },
  { label: 'Warp → SM 내부 워프 스케줄러', body: 'SM 내 워프 스케줄러가 Warp를 단위로 명령 발행.\n레이턴시 숨김의 핵심.' },
  { label: 'Thread → CUDA 코어 1개', body: '각 Thread는 결국 CUDA 코어 1개에서 실행.\n레지스터 파일은 SM 안에서 분배.' },
  { label: '핵심 결과: 같은 Block은 같은 SM', body: '공유 메모리(shared memory) 접근이 가능한 이유.\nBlock 간 통신은 글로벌 메모리 + 동기화 필요.' },
];

const PAIRS: { sw: string; hw: string; swSub?: string; hwSub?: string }[] = [
  { sw: 'Grid',   hw: 'Device (GPU)',  swSub: '커널 호출 1회',    hwSub: 'H100: SM 132개' },
  { sw: 'Block',  hw: 'SM',            swSub: '~1024 스레드',     hwSub: '워프 스케줄러 4개' },
  { sw: 'Warp',   hw: 'Warp Scheduler', swSub: '32 스레드',        hwSub: '명령 발행 단위' },
  { sw: 'Thread', hw: 'CUDA Core',     swSub: 'threadIdx',        hwSub: 'FP32/INT32 실행' },
];

function PairStep({ idx }: { idx: number }) {
  return (
    <g>
      <text x={130} y={14} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.sw}>소프트웨어 계층</text>
      <text x={350} y={14} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.hw}>하드웨어</text>
      {PAIRS.map((p, i) => {
        const active = i === idx;
        const opacity = active ? 1 : 0.25;
        const y = 26 + i * 30;
        return (
          <g key={i} opacity={opacity} style={{ transition: 'opacity 0.3s' }}>
            <ModuleBox x={40} y={y} w={170} h={26} label={p.sw} sub={p.swSub} color={C.sw} />
            <line x1={215} y1={y + 13} x2={265} y2={y + 13}
              stroke={active ? C.highlight : 'var(--border)'} strokeWidth={active ? 1.2 : 0.5}
              markerEnd={`url(#${active ? 'arrMapA' : 'arrMapI'})`} />
            <ModuleBox x={270} y={y} w={170} h={26} label={p.hw} sub={p.hwSub} color={C.hw} />
          </g>
        );
      })}
      <defs>
        <marker id="arrMapA" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
          <path d="M0,0 L6,3 L0,6" fill={C.highlight} />
        </marker>
        <marker id="arrMapI" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
          <path d="M0,0 L6,3 L0,6" fill="var(--border)" />
        </marker>
      </defs>
    </g>
  );
}

function CoreInsight() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.highlight}>
        Block은 SM 1개에 통째 배정 → 공유 메모리 접근 가능
      </text>
      <motion.g initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
        <rect x={40} y={28} width={180} height={70} rx={8} fill={C.hw + '08'} stroke={C.hw} strokeWidth={0.8} />
        <text x={130} y={44} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.hw}>SM (Streaming Multiprocessor)</text>
        <rect x={55} y={52} width={70} height={24} rx={4} fill={C.sw + '15'} stroke={C.sw} strokeWidth={0.6} />
        <text x={90} y={67} textAnchor="middle" fontSize={8} fill={C.sw}>Block A</text>
        <rect x={135} y={52} width={70} height={24} rx={4} fill={C.sw + '15'} stroke={C.sw} strokeWidth={0.6} />
        <text x={170} y={67} textAnchor="middle" fontSize={8} fill={C.sw}>Block B</text>
        <text x={130} y={92} textAnchor="middle" fontSize={7.5} fill={C.hw}>shared memory 공유</text>
      </motion.g>
      <motion.g initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: 0.2 }}>
        <rect x={260} y={28} width={180} height={70} rx={8} fill={C.warn + '08'} stroke={C.warn} strokeWidth={0.8} strokeDasharray="3 2" />
        <text x={350} y={44} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.warn}>Block 간</text>
        <text x={350} y={62} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">shared memory 불가</text>
        <text x={350} y={76} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">global mem + sync 필요</text>
        <text x={350} y={92} textAnchor="middle" fontSize={7} fill={C.warn}>레이턴시 100x 차이</text>
      </motion.g>
      <motion.line x1={220} y1={64} x2={260} y2={64} stroke={C.highlight} strokeWidth={1}
        strokeDasharray="2 2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} />
    </g>
  );
}

const R = [
  () => <PairStep idx={0} />,
  () => <PairStep idx={1} />,
  () => <PairStep idx={2} />,
  () => <PairStep idx={3} />,
  () => <CoreInsight />,
];

export default function MappingViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => { const S = R[step]; return <svg viewBox="0 0 480 160" className="w-full max-w-2xl"><S /></svg>; }}
    </StepViz>
  );
}
