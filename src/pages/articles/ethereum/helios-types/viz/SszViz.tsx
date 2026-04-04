import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'SSZ: Simple Serialize (고정 크기 우선)', body: 'RLP과 달리 고정 크기 필드는 바로 연결한다' },
  { label: '고정 크기: u64(8B), B256(32B) 직접 배치', body: 'BeaconBlockHeader: 8+8+32+32+32 = 112B' },
  { label: '가변 크기: offset(4B) + 뒤쪽에 데이터', body: 'Vec<B256>는 offset으로 위치를 가리킨다' },
  { label: 'hash_tree_root: 바이너리 Merkle 트리', body: '32B 청크로 나누어 재귀 해싱 → 루트 해시' },
];

const C = { fixed: '#6366f1', var: '#10b981', merkle: '#f59e0b' };

export default function SszViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <motion.g key={step} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
            {step === 0 && (
              <g>
                <rect x={60} y={40} width={160} height={50} rx={8} fill={C.fixed + '15'} stroke={C.fixed} strokeWidth={1.5} />
                <text x={140} y={60} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.fixed}>SSZ</text>
                <text x={140} y={78} textAnchor="middle" fontSize={10} fill={C.fixed} fillOpacity={0.6}>Simple Serialize</text>
                <rect x={260} y={40} width={160} height={50} rx={8} fill="#ef4444" fillOpacity={0.1} stroke="#ef4444" strokeWidth={1} strokeDasharray="4 2" />
                <text x={340} y={60} textAnchor="middle" fontSize={11} fontWeight={600} fill="#ef4444">RLP</text>
                <text x={340} y={78} textAnchor="middle" fontSize={10} fill="#ef4444" fillOpacity={0.6}>Reth EL에서 사용</text>
              </g>
            )}
            {step === 1 && (
              <g>
                {['slot 8B', 'proposer 8B', 'parent 32B', 'state 32B', 'body 32B'].map((t, i) => (
                  <g key={t}>
                    <rect x={30 + i * 85} y={50} width={80} height={30} rx={6}
                      fill={C.fixed + '15'} stroke={C.fixed} strokeWidth={1} />
                    <text x={70 + i * 85} y={70} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.fixed}>{t}</text>
                  </g>
                ))}
                <text x={240} y={105} textAnchor="middle" fontSize={10} fill={C.fixed} fillOpacity={0.5}>연속 배치 — 파싱 O(1)</text>
              </g>
            )}
            {step === 2 && (
              <g>
                <rect x={60} y={45} width={100} height={36} rx={8} fill={C.fixed + '15'} stroke={C.fixed} strokeWidth={1.5} />
                <text x={110} y={68} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.fixed}>fixed fields</text>
                <rect x={180} y={45} width={80} height={36} rx={8} fill={C.var + '15'} stroke={C.var} strokeWidth={1.5} />
                <text x={220} y={68} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.var}>offset</text>
                <motion.line x1={260} y1={63} x2={290} y2={63} stroke={C.var} strokeWidth={1.5} strokeDasharray="4 2"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
                <rect x={290} y={45} width={140} height={36} rx={8} fill={C.var + '15'} stroke={C.var} strokeWidth={1.5} />
                <text x={360} y={68} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.var}>variable data</text>
              </g>
            )}
            {step === 3 && (
              <g>
                {['chunk0', 'chunk1', 'chunk2', 'chunk3'].map((t, i) => (
                  <rect key={t} x={80 + i * 80} y={65} width={70} height={24} rx={4}
                    fill={C.merkle + '15'} stroke={C.merkle} strokeWidth={1} />
                ))}
                {['H(0,1)', 'H(2,3)'].map((t, i) => (
                  <g key={t}>
                    <rect x={120 + i * 160} y={35} width={70} height={24} rx={4}
                      fill={C.merkle + '25'} stroke={C.merkle} strokeWidth={1.5} />
                    <text x={155 + i * 160} y={51} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.merkle}>{t}</text>
                  </g>
                ))}
                <rect x={195} y={5} width={90} height={24} rx={4} fill={C.merkle + '35'} stroke={C.merkle} strokeWidth={2} />
                <text x={240} y={21} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.merkle}>root</text>
              </g>
            )}
          </motion.g>
          <text x={240} y={125} textAnchor="middle" fontSize={10} fill="currentColor" fillOpacity={0.4}>
            {['CL: SSZ, EL: RLP', '고정 크기 연속 배치', '가변 크기 offset 방식', 'hash_tree_root Merkle'][step]}
          </text>
        </svg>
      )}
    </StepViz>
  );
}
