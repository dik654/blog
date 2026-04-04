import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'consensus_rpc: CL 비콘 API 엔드포인트', body: '/eth/v1/beacon/* 경로 — 헤더, 업데이트 요청' },
  { label: 'execution_rpc: EL JSON-RPC 엔드포인트', body: 'eth_getProof, eth_getCode 등 증명 요청' },
  { label: 'Reth: 자기 자신이 두 API를 제공', body: 'EL: 8545, Engine API: 8551 (CL 연동)' },
];

const C = { cl: '#6366f1', el: '#10b981', reth: '#f59e0b' };

export default function RpcEndpointsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <motion.g key={step} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
            {step === 0 && (
              <g>
                <rect x={60} y={40} width={150} height={50} rx={8} fill={C.cl + '15'} stroke={C.cl} strokeWidth={1.5} />
                <text x={135} y={60} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.cl}>Helios</text>
                <text x={135} y={78} textAnchor="middle" fontSize={10} fill={C.cl} fillOpacity={0.6}>consensus client</text>
                <motion.line x1={210} y1={65} x2={260} y2={65} stroke={C.cl} strokeWidth={1.5}
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
                <rect x={260} y={40} width={170} height={50} rx={8} fill={C.cl + '15'} stroke={C.cl} strokeWidth={1.5} />
                <text x={345} y={60} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.cl}>CL Beacon API</text>
                <text x={345} y={78} textAnchor="middle" fontSize={10} fill={C.cl} fillOpacity={0.6}>/eth/v1/beacon/*</text>
              </g>
            )}
            {step === 1 && (
              <g>
                <rect x={60} y={40} width={150} height={50} rx={8} fill={C.el + '15'} stroke={C.el} strokeWidth={1.5} />
                <text x={135} y={60} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.el}>Helios</text>
                <text x={135} y={78} textAnchor="middle" fontSize={10} fill={C.el} fillOpacity={0.6}>execution layer</text>
                <motion.line x1={210} y1={65} x2={260} y2={65} stroke={C.el} strokeWidth={1.5}
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
                <rect x={260} y={40} width={170} height={50} rx={8} fill={C.el + '15'} stroke={C.el} strokeWidth={1.5} />
                <text x={345} y={60} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.el}>EL JSON-RPC</text>
                <text x={345} y={78} textAnchor="middle" fontSize={10} fill={C.el} fillOpacity={0.6}>eth_getProof 등</text>
              </g>
            )}
            {step === 2 && (
              <g>
                <rect x={130} y={35} width={220} height={60} rx={8} fill={C.reth + '15'} stroke={C.reth} strokeWidth={1.5} />
                <text x={240} y={55} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.reth}>Reth (풀노드)</text>
                <text x={240} y={72} textAnchor="middle" fontSize={10} fill={C.reth} fillOpacity={0.6}>EL: 8545 · Engine: 8551</text>
                <text x={240} y={86} textAnchor="middle" fontSize={10} fill={C.reth} fillOpacity={0.5}>자체 API 제공 → 외부 의존 없음</text>
              </g>
            )}
          </motion.g>
          <text x={240} y={125} textAnchor="middle" fontSize={10} fill="currentColor" fillOpacity={0.4}>
            {['CL API로 헤더·업데이트 수신', 'EL API로 증명 요청', 'Reth: 두 역할을 자체 수행'][step]}
          </text>
        </svg>
      )}
    </StepViz>
  );
}
