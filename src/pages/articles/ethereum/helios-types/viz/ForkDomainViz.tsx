import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'Fork: 포크 버전(4B) + epoch', body: 'previous_version + current_version + epoch' },
  { label: 'ForkData: 포크 버전 + genesis_validators_root', body: 'SSZ hash_tree_root(ForkData) → fork_data_root' },
  { label: 'Domain: 타입(4B) + fork_data_root(28B)', body: 'DOMAIN_SYNC_COMMITTEE = 0x07000000 등' },
  { label: 'compute_signing_root(msg, domain)', body: 'hash_tree_root(SigningData { msg_root, domain })' },
];

const C = { fork: '#6366f1', data: '#10b981', domain: '#f59e0b', sign: '#8b5cf6' };

export default function ForkDomainViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <motion.g key={step} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
            {step === 0 && (
              <g>
                <rect x={100} y={40} width={280} height={50} rx={8} fill={C.fork + '15'} stroke={C.fork} strokeWidth={1.5} />
                <text x={240} y={58} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.fork}>Fork</text>
                <text x={240} y={78} textAnchor="middle" fontSize={10} fill={C.fork} fillOpacity={0.6}>prev_ver + curr_ver + epoch</text>
              </g>
            )}
            {step === 1 && (
              <g>
                <rect x={60} y={40} width={160} height={40} rx={8} fill={C.fork + '15'} stroke={C.fork} strokeWidth={1.5} />
                <text x={140} y={65} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.fork}>fork_version</text>
                <rect x={260} y={40} width={160} height={40} rx={8} fill={C.data + '15'} stroke={C.data} strokeWidth={1.5} />
                <text x={340} y={58} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.data}>genesis_val_root</text>
                <text x={340} y={72} textAnchor="middle" fontSize={9} fill={C.data} fillOpacity={0.6}>→ ForkData</text>
              </g>
            )}
            {step === 2 && (
              <g>
                <rect x={80} y={35} width={320} height={55} rx={8} fill={C.domain + '15'} stroke={C.domain} strokeWidth={1.5} />
                <text x={240} y={55} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.domain}>Domain (32 bytes)</text>
                <text x={240} y={73} textAnchor="middle" fontSize={10} fill={C.domain} fillOpacity={0.6}>type(4B) + fork_data_root(28B)</text>
                <text x={240} y={86} textAnchor="middle" fontSize={9} fill={C.domain} fillOpacity={0.4}>리플레이 공격 방지: 포크별 도메인 분리</text>
              </g>
            )}
            {step === 3 && (
              <g>
                <rect x={80} y={35} width={320} height={55} rx={8} fill={C.sign + '15'} stroke={C.sign} strokeWidth={1.5} />
                <text x={240} y={55} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.sign}>compute_signing_root</text>
                <text x={240} y={73} textAnchor="middle" fontSize={10} fill={C.sign} fillOpacity={0.6}>hash_tree_root(msg_root, domain)</text>
                <text x={240} y={86} textAnchor="middle" fontSize={9} fill={C.sign} fillOpacity={0.4}>BLS 서명의 메시지 = signing_root</text>
              </g>
            )}
          </motion.g>
          <text x={240} y={125} textAnchor="middle" fontSize={10} fill="currentColor" fillOpacity={0.4}>
            {['포크 버전 관리', 'ForkData SSZ 해싱', '도메인 분리 → 리플레이 방지', '서명 루트 계산'][step]}
          </text>
        </svg>
      )}
    </StepViz>
  );
}
