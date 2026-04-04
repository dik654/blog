import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const LAYERS = [
  { label: 'Register', sub: '~1 cycle', c: '#6366f1', w: 70, y: 10 },
  { label: 'Shared Mem', sub: '~5 cycle', c: '#10b981', w: 130, y: 48 },
  { label: 'L1 / L2 Cache', sub: '~30 cycle', c: '#f59e0b', w: 200, y: 86 },
  { label: 'Global (HBM)', sub: '~400 cycle', c: '#ef4444', w: 300, y: 124 },
];
const STEPS = [
  { label: '레지스터: 스레드 전용 초고속 저장소', body: '스레드 전용 255개 32-bit 레지스터. 중간 산술 결과를 저장합니다.' },
  { label: '공유 메모리: 블록 내 스레드 간 데이터 공유', body: '블록 내 공유. 48~96KB. __shared__ 키워드로 선언. 코어레싱 불필요.' },
  { label: 'L1/L2 캐시: SM 내 자동 캐싱 계층', body: 'SM당 ~128KB L1 + ~40MB L2. 하드웨어가 자동 관리합니다.' },
  { label: '글로벌 메모리: 대용량 HBM, 가장 느린 계층', body: 'GDDR6/HBM2. 8~80GB. 대역폭이 높지만 지연이 크므로 액세스 병합 필수.' },
];
const CX = 180;

export default function MemoryHierarchyViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 175" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {LAYERS.map((l, i) => {
            const x = CX - l.w / 2;
            const active = i === step;
            return (
              <motion.g key={i}
                animate={{ y: active ? -3 : 0, opacity: active ? 1 : 0.25 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                <rect x={x} y={l.y} width={l.w} height={30} rx={6}
                  fill={l.c + (active ? '22' : '08')} stroke={l.c}
                  strokeWidth={active ? 1.5 : 1} />
                <text x={CX} y={l.y + 15} textAnchor="middle" fontSize={10}
                  fontWeight={600} fill={l.c}>{l.label}</text>
                <text x={CX} y={l.y + 26} textAnchor="middle" fontSize={10}
                  fill={l.c} fillOpacity={0.5}>{l.sub}</text>
                {active && (
                  <motion.rect x={x + 3} y={l.y + 2} width={0} height={3} rx={1.5}
                    fill={l.c} fillOpacity={0.6}
                    animate={{ width: l.w - 6 }}
                    transition={{ duration: [0.2, 0.4, 0.8, 1.5][i] }} />
                )}
              </motion.g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
