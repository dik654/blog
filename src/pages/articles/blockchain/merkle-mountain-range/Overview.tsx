import { motion } from 'framer-motion';
import StepViz from '../../../../components/ui/step-viz';

const C = { blue: '#60a5fa', orange: '#f97316', green: '#22c55e', purple: '#a78bfa' };

const STEPS = [
  { label: '초기 MMR: 소수의 원소와 피크들', body: '원소가 추가될 때마다 이진 트리 구조가 점진적으로 형성됩니다. 동일 높이의 피크가 2개 이상이면 자동으로 병합됩니다. 현재 3개의 피크가 존재합니다.' },
  { label: '새 원소 추가: 피크 병합 과정', body: '새 리프가 추가되면 오른쪽에 배치됩니다. 동일 높이의 인접 피크가 있으면 해시를 합쳐 상위 노드를 생성하며, 이 과정이 재귀적으로 반복됩니다.' },
  { label: '완성된 MMR: 다수의 피크 구조', body: 'MMR은 여러 개의 피크(peak)를 가지는 "산맥" 형태를 이룹니다. 모든 피크의 해시를 결합(peak bagging)하여 단일 루트 해시를 생성합니다.' },
];

function Node({ x, y, label, color, highlight, r = 14 }: {
  x: number; y: number; label: string; color: string; highlight: boolean; r?: number;
}) {
  return (
    <motion.g initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
      <circle cx={x} cy={y} r={r}
        fill={highlight ? `${color}33` : `${color}15`}
        stroke={color} strokeWidth={highlight ? 2.5 : 1.5} />
      <text x={x} y={y + 4} textAnchor="middle" fontSize={8} fontWeight={600} fill={color}>
        {label}
      </text>
    </motion.g>
  );
}

function Edge({ x1, y1, x2, y2, color, dashed }: {
  x1: number; y1: number; x2: number; y2: number; color: string; dashed?: boolean;
}) {
  return (
    <motion.line x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={color} strokeWidth={1.2}
      strokeDasharray={dashed ? '4 2' : 'none'}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
      transition={{ duration: 0.4 }} />
  );
}

function PeakLabel({ x, y, show }: { x: number; y: number; show: boolean }) {
  return (
    <motion.text x={x} y={y - 20} textAnchor="middle" fontSize={7} fontWeight={700}
      fill={C.orange} initial={{ opacity: 0 }} animate={{ opacity: show ? 1 : 0 }}
      transition={{ duration: 0.3 }}>
      peak
    </motion.text>
  );
}

function MMRViz() {
  return (
    <StepViz steps={STEPS}>
      {(step: number) => (
        <svg viewBox="0 0 440 180" className="w-full max-w-[540px]" role="img">
          {/* Step 0: initial MMR with 7 leaves — peaks at positions 7(h=2), 10(h=1), 11(h=0) */}
          {/* Leaves */}
          <Node x={40} y={150} label="1" color={C.blue} highlight={false} />
          <Node x={80} y={150} label="2" color={C.blue} highlight={false} />
          <Edge x1={60} y1={110} x2={40} y2={136} color={C.blue} />
          <Edge x1={60} y1={110} x2={80} y2={136} color={C.blue} />
          <Node x={60} y={110} label="3" color={C.blue} highlight={false} />

          <Node x={120} y={150} label="4" color={C.blue} highlight={false} />
          <Node x={160} y={150} label="5" color={C.blue} highlight={false} />
          <Edge x1={140} y1={110} x2={120} y2={136} color={C.blue} />
          <Edge x1={140} y1={110} x2={160} y2={136} color={C.blue} />
          <Node x={140} y={110} label="6" color={C.blue} highlight={false} />

          <Edge x1={100} y1={70} x2={60} y2={96} color={C.blue} />
          <Edge x1={100} y1={70} x2={140} y2={96} color={C.blue} />
          <Node x={100} y={70} label="7" color={C.orange} highlight={step === 0} />
          <PeakLabel x={100} y={70} show={step === 0 || step === 2} />

          <Node x={220} y={150} label="8" color={C.blue} highlight={false} />
          <Node x={260} y={150} label="9" color={C.blue} highlight={false} />
          <Edge x1={240} y1={110} x2={220} y2={136} color={C.blue} />
          <Edge x1={240} y1={110} x2={260} y2={136} color={C.blue} />
          <Node x={240} y={110} label="10" color={C.orange} highlight={step === 0} />
          <PeakLabel x={240} y={110} show={step === 0} />

          <Node x={300} y={150} label="11" color={C.orange} highlight={step === 0} />
          <PeakLabel x={300} y={150} show={step === 0} />

          {/* Step 1: new element 12 added, merges with peak 11 */}
          {step >= 1 && (
            <>
              <Node x={340} y={150} label="12" color={C.green} highlight={step === 1} />
              <Edge x1={320} y1={110} x2={300} y2={136} color={C.green} />
              <Edge x1={320} y1={110} x2={340} y2={136} color={C.green} />
              <Node x={320} y={110} label="13" color={C.green} highlight={step === 1} />
              <motion.text x={340} y={166} textAnchor="middle" fontSize={7} fill={C.green}
                initial={{ opacity: 0 }} animate={{ opacity: step === 1 ? 1 : 0 }}>
                new!
              </motion.text>
            </>
          )}

          {/* Step 2: further merge — 10+13 merge to 14, then 7+14 merge to 15 */}
          {step >= 2 && (
            <>
              <Edge x1={280} y1={70} x2={240} y2={96} color={C.purple} />
              <Edge x1={280} y1={70} x2={320} y2={96} color={C.purple} />
              <Node x={280} y={70} label="14" color={C.purple} highlight={step === 2} />
              <PeakLabel x={280} y={70} show={step === 2} />

              <Edge x1={190} y1={35} x2={100} y2={56} color={C.purple} dashed />
              <Edge x1={190} y1={35} x2={280} y2={56} color={C.purple} dashed />
              <motion.rect x={150} y={20} width={80} height={22} rx={6}
                fill={`${C.purple}18`} stroke={C.purple} strokeWidth={1.5}
                strokeDasharray="4 2"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
              <motion.text x={190} y={35} textAnchor="middle" fontSize={8} fontWeight={700}
                fill={C.purple} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                bag peaks → root
              </motion.text>
            </>
          )}
        </svg>
      )}
    </StepViz>
  );
}

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Merkle Mountain Range 개요</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>Merkle Mountain Range (MMR)</strong>는 추가 전용(append-only) 환경에 최적화된 머클 트리의 변형입니다.
          기존 머클 트리가 고정된 크기의 데이터셋에 대해 설계된 반면, MMR은 데이터가 지속적으로 추가되는 시나리오에서
          효율적인 증명을 제공합니다.
        </p>
        <p>
          MMR은 여러 개의 완전 이진 트리(피크)로 구성된 "산맥" 형태를 이루며, 새로운 원소가 추가될 때마다
          동일 높이의 피크들이 병합되어 더 큰 트리를 형성합니다. 이 구조는 블록체인에서 특히 유용합니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">주요 활용 사례</h3>
        <ul>
          <li><strong>FlyClient</strong> — 경량 클라이언트를 위한 효율적인 블록 히스토리 증명</li>
          <li><strong>Grin (Mimblewimble)</strong> — UTXO 집합의 효율적 관리 및 pruning</li>
          <li><strong>Polkadot BEEFY</strong> — 크로스체인 라이트 클라이언트 증명</li>
        </ul>

        <MMRViz />

        <p>
          MMR의 핵심 아이디어는 간단합니다. 새 원소를 오른쪽에 추가하고, 동일 높이의 인접 피크가 있으면
          병합합니다. 이 과정이 재귀적으로 반복되며, 최종적으로 모든 피크의 해시를 결합하여 하나의 루트를
          생성합니다.
        </p>
      </div>
    </section>
  );
}
