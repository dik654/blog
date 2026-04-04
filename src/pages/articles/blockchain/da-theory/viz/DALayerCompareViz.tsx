import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = ['#6366f1', '#10b981', '#f59e0b'];
const LAYERS = [
  { label: 'Celestia', sub: '2D RS + Tendermint', color: C[0] },
  { label: 'EigenDA', sub: 'ETH restaking', color: C[1] },
  { label: 'Avail', sub: 'KZG + App chains', color: C[2] },
];
const STEPS = [
  { label: '세 가지 DA 레이어 비교', body: 'DA 레이어는 블록체인의 데이터 가용성만 전담하는 모듈러 인프라입니다.' },
  { label: 'Celestia: 최초의 모듈러 DA', body: 'Celestia는 2D RS 코딩 + Tendermint 합의로 DA를 제공합니다.' },
  { label: 'EigenDA: 이더리움 재스테이킹 기반', body: 'EigenDA는 ETH 재스테이킹 오퍼레이터들이 DA를 제공합니다.' },
  { label: 'Avail: 앱체인 최적화 DA', body: 'Avail은 KZG 커밋먼트 + 앱체인 전용 DA를 제공합니다.' },
];
const BX = [80, 230, 380], BY = 45, BW = 110, BH = 38;

export default function DALayerCompareViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 130" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* DA Layer label */}
          <text x={240} y={16} textAnchor="middle" fontSize={10}
            fill="var(--muted-foreground)">Data Availability Layers</text>
          {LAYERS.map((l, i) => {
            const active = step === i + 1;
            return (
              <motion.g key={l.label}
                animate={{ opacity: step === 0 || active ? 1 : 0.2 }}>
                <rect x={BX[i] - BW / 2} y={BY - BH / 2} width={BW} height={BH}
                  rx={6} fill={active ? `${l.color}20` : `${l.color}08`}
                  stroke={l.color} strokeWidth={active ? 2 : 1} />
                <text x={BX[i]} y={BY} textAnchor="middle" fontSize={10}
                  fontWeight={600} fill={l.color}>{l.label}</text>
                <text x={BX[i]} y={BY + 12} textAnchor="middle" fontSize={10}
                  fill="var(--muted-foreground)">{l.sub}</text>
                {active && (
                  <motion.circle cx={BX[i]} cy={BY - BH / 2 - 8} r={4}
                    fill={l.color} initial={{ scale: 0 }} animate={{ scale: 1 }}
                    style={{ filter: `drop-shadow(0 0 4px ${l.color}88)` }} />
                )}
              </motion.g>
            );
          })}
          {/* rollup connection */}
          <rect x={140} y={90} width={200} height={26} rx={5}
            fill={`${C[0]}06`} stroke={C[0]} strokeWidth={0.8} />
          <text x={240} y={107} textAnchor="middle" fontSize={10}
            fill="var(--muted-foreground)">Rollup / App Chain</text>
          {LAYERS.map((l, i) => (
            <line key={i} x1={BX[i]} y1={BY + BH / 2} x2={240} y2={90}
              stroke={l.color} strokeWidth={0.6} strokeDasharray="3 2" opacity={0.3} />
          ))}
        </svg>
      )}
    </StepViz>
  );
}
