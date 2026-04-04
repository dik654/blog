import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = ['#6366f1', '#10b981', '#f59e0b'];
const STEPS = [
  { label: 'EIP-4844: Blob 트랜잭션 도입', body: 'EIP-4844는 롤업용 저비용 데이터 공간(Blob)을 이더리움에 도입합니다.' },
  { label: 'Blob: 128KB 데이터 + KZG 커밋먼트', body: '각 Blob은 ~128KB. KZG 커밋먼트로 데이터 무결성을 보장합니다.' },
  { label: 'Proto-Danksharding 구조', body: 'Proto-Danksharding은 블록당 3-6 Blob을 허용합니다. ~30일 후 pruning.' },
  { label: 'Full Danksharding으로의 확장', body: 'Full Danksharding은 2D KZG + DAS로 수백 Blob까지 확장합니다.' },
];

export default function EIP4844Viz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 140" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Block structure */}
          <rect x={30} y={30} width={200} height={80} rx={6}
            fill={`${C[0]}06`} stroke={C[0]} strokeWidth={1} />
          <text x={130} y={22} textAnchor="middle" fontSize={10}
            fontWeight={600} fill="var(--foreground)">Ethereum Block</text>
          {/* execution payload */}
          <rect x={40} y={38} width={85} height={24} rx={4}
            fill={`${C[0]}10`} stroke={C[0]} strokeWidth={0.8} />
          <text x={82} y={53} textAnchor="middle" fontSize={10}
            fontWeight={600} fill={C[0]}>Execution</text>
          {/* consensus */}
          <rect x={135} y={38} width={85} height={24} rx={4}
            fill={`${C[1]}10`} stroke={C[1]} strokeWidth={0.8} />
          <text x={177} y={53} textAnchor="middle" fontSize={10}
            fontWeight={600} fill={C[1]}>Consensus</text>
          {/* blob area */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
              {[0, 1, 2].map((i) => (
                <g key={i}>
                  <rect x={40 + i * 62} y={70} width={52} height={30} rx={4}
                    fill={`${C[2]}15`} stroke={C[2]} strokeWidth={1.2} />
                  <text x={66 + i * 62} y={88} textAnchor="middle" fontSize={10}
                    fontWeight={600} fill={C[2]}>Blob {i + 1}</text>
                  <text x={66 + i * 62} y={96} textAnchor="middle" fontSize={10}
                    fill="var(--muted-foreground)">~128KB</text>
                </g>
              ))}
            </motion.g>
          )}
          {/* KZG commitment */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}>
              <rect x={250} y={70} width={90} height={30} rx={4}
                fill={`${C[1]}10`} stroke={C[1]} strokeWidth={1} />
              <text x={295} y={86} textAnchor="middle" fontSize={10}
                fontWeight={600} fill={C[1]}>KZG Commit</text>
              <text x={295} y={95} textAnchor="middle" fontSize={10}
                fill="var(--muted-foreground)">헤더에 포함</text>
            </motion.g>
          )}
          {/* proto-danksharding label */}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={260} y={30} width={100} height={24} rx={4}
                fill={`${C[0]}10`} stroke={C[0]} strokeWidth={1.2} />
              <text x={310} y={44} textAnchor="middle" fontSize={10}
                fontWeight={600} fill={C[0]}>Proto-Danksharding</text>
              <text x={310} y={20} textAnchor="middle" fontSize={10}
                fill="var(--muted-foreground)">3-6 Blobs/block</text>
            </motion.g>
          )}
          {/* full danksharding */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={250} y={110} width={120} height={22} rx={4}
                fill={`${C[2]}15`} stroke={C[2]} strokeWidth={1.2} />
              <text x={310} y={124} textAnchor="middle" fontSize={10}
                fontWeight={600} fill={C[2]}>Full Danksharding</text>
              <text x={310} y={134} textAnchor="middle" fontSize={10}
                fill="var(--muted-foreground)">2D KZG + DAS</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
