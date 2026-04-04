import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'FileDB: 체크포인트를 디스크에 저장', body: 'data_dir/checkpoint.ssz — 마지막 검증된 헤더' },
  { label: '재시작 시 디스크에서 체크포인트 로드', body: 'Weak Subjectivity 기간 내면 재사용 가능' },
  { label: '없으면 하드코딩 or API에서 가져옴', body: 'Network enum에 기본 체크포인트 하드코딩' },
];

const C = { disk: '#6366f1', load: '#10b981', fallback: '#f59e0b' };

export default function FileDbViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <motion.g key={step} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
            {step === 0 && (
              <g>
                <rect x={60} y={40} width={160} height={50} rx={8} fill={C.disk + '15'} stroke={C.disk} strokeWidth={1.5} />
                <text x={140} y={60} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.disk}>LightClientStore</text>
                <text x={140} y={78} textAnchor="middle" fontSize={10} fill={C.disk} fillOpacity={0.6}>메모리</text>
                <motion.line x1={220} y1={65} x2={260} y2={65} stroke={C.disk} strokeWidth={1.5}
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
                <rect x={260} y={40} width={170} height={50} rx={8} fill={C.disk + '15'} stroke={C.disk} strokeWidth={1.5} />
                <text x={345} y={60} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.disk}>checkpoint.ssz</text>
                <text x={345} y={78} textAnchor="middle" fontSize={10} fill={C.disk} fillOpacity={0.6}>디스크 영속 저장</text>
              </g>
            )}
            {step === 1 && (
              <g>
                <rect x={60} y={40} width={170} height={50} rx={8} fill={C.load + '15'} stroke={C.load} strokeWidth={1.5} />
                <text x={145} y={58} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.load}>checkpoint.ssz</text>
                <text x={145} y={76} textAnchor="middle" fontSize={10} fill={C.load} fillOpacity={0.6}>WS 기간 내?</text>
                <motion.line x1={230} y1={65} x2={260} y2={65} stroke={C.load} strokeWidth={1.5}
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
                <rect x={260} y={40} width={170} height={50} rx={8} fill={C.load + '15'} stroke={C.load} strokeWidth={1.5} />
                <text x={345} y={60} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.load}>Store 초기화</text>
                <text x={345} y={78} textAnchor="middle" fontSize={10} fill={C.load} fillOpacity={0.6}>빠른 재시작</text>
              </g>
            )}
            {step === 2 && (
              <g>
                <rect x={40} y={40} width={130} height={46} rx={8} fill={C.fallback + '15'} stroke={C.fallback} strokeWidth={1.5} />
                <text x={105} y={58} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.fallback}>하드코딩</text>
                <text x={105} y={74} textAnchor="middle" fontSize={9} fill={C.fallback} fillOpacity={0.6}>Network 내장</text>
                <rect x={190} y={40} width={130} height={46} rx={8} fill={C.fallback + '15'} stroke={C.fallback} strokeWidth={1.5} />
                <text x={255} y={58} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.fallback}>Beacon API</text>
                <text x={255} y={74} textAnchor="middle" fontSize={9} fill={C.fallback} fillOpacity={0.6}>HTTP 요청</text>
                <rect x={340} y={40} width={100} height={46} rx={8} fill={C.fallback + '15'} stroke={C.fallback} strokeWidth={1.5} />
                <text x={390} y={58} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.fallback}>사용자</text>
                <text x={390} y={74} textAnchor="middle" fontSize={9} fill={C.fallback} fillOpacity={0.6}>CLI 지정</text>
              </g>
            )}
          </motion.g>
          <text x={240} y={125} textAnchor="middle" fontSize={10} fill="currentColor" fillOpacity={0.4}>
            {['Reth: MDBX 수백GB', '재시작 O(초) — 풀 동기화 불필요', '3가지 체크포인트 소스'][step]}
          </text>
        </svg>
      )}
    </StepViz>
  );
}
