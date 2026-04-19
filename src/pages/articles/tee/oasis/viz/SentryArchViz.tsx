import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, AlertBox } from '@/components/viz/boxes';

const STEPS = [
  { label: 'Sentry 토폴로지 — 검증인 보호 프록시', body: 'Sentry: 공개 IP, P2P broadcast.\nValidator: 비공개, sentry 만 신뢰.' },
  { label: 'config — sentry 측', body: 'sentry.enabled: true.\nupstream_addresses: 검증인 pubkey@IP:port.' },
  { label: 'config — validator 측', body: 'p2p.parent_node.private_peer_ids: sentry pubkey 목록.\nsentry 만 인바운드 허용.' },
  { label: 'DDoS 시 — sentry 만 영향, 검증인 안전', body: '공격 트래픽이 sentry 에 흡수.\nsentry 1개 다운돼도 다른 sentry 가 대체.' },
];

export default function SentryArchViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Internet */}
          <ModuleBox x={20} y={20} w={130} h={40}
            label="Internet" sub="P2P broadcast" color="#94a3b8" />

          {/* Sentries */}
          <ModuleBox x={170} y={75} w={90} h={50}
            label="Sentry 1" sub="public IP" color="#3b82f6" />
          <ModuleBox x={270} y={75} w={90} h={50}
            label="Sentry 2" sub="public IP" color="#3b82f6" />
          <ModuleBox x={370} y={75} w={90} h={50}
            label="Sentry 3" sub="public IP" color="#3b82f6" />

          {/* private network barrier */}
          <line x1={20} y1={150} x2={460} y2={150}
            stroke="#ec4899" strokeWidth={1} strokeDasharray="6,4" opacity={0.5} />
          <text x={20} y={146} fontSize={9} fill="#ec4899" fontWeight={600}>
            private network barrier
          </text>

          {/* Validator */}
          <ModuleBox x={170} y={170} w={290} h={50}
            label="Validator" sub="private IP — sentry 만 신뢰" color="#a855f7" />

          {/* connections */}
          {(step === 0 || step === 3) && (
            <>
              <motion.line x1={85} y1={60} x2={215} y2={75}
                stroke="#94a3b8" strokeWidth={1}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
              <motion.line x1={85} y1={60} x2={315} y2={75}
                stroke="#94a3b8" strokeWidth={1}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
              <motion.line x1={85} y1={60} x2={415} y2={75}
                stroke="#94a3b8" strokeWidth={1}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
              {/* sentry → validator */}
              <motion.line x1={215} y1={125} x2={250} y2={170}
                stroke="#3b82f6" strokeWidth={1.2}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 }} />
              <motion.line x1={315} y1={125} x2={315} y2={170}
                stroke="#3b82f6" strokeWidth={1.2}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 }} />
              <motion.line x1={415} y1={125} x2={380} y2={170}
                stroke="#3b82f6" strokeWidth={1.2}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.4 }} />
            </>
          )}

          {/* Step 1: sentry config */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={20}  y={170} w={140} h={28}
                label="enabled: true" color="#3b82f6" outlined />
              <DataBox x={20}  y={205} w={140} h={28}
                label="upstream → val" color="#3b82f6" outlined />
              <text x={90} y={155} textAnchor="middle" fontSize={9} fill="#3b82f6" fontWeight={600}>
                sentry config
              </text>
            </motion.g>
          )}

          {/* Step 2: validator config */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={20}  y={170} w={140} h={28}
                label="parent_node:" color="#a855f7" outlined />
              <DataBox x={20}  y={205} w={140} h={28}
                label="private_peer_ids" color="#a855f7" outlined />
              <text x={90} y={155} textAnchor="middle" fontSize={9} fill="#a855f7" fontWeight={600}>
                validator config
              </text>
            </motion.g>
          )}

          {/* Step 3: DDoS */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <AlertBox x={170} y={130} w={290} h={28}
                label="DDoS hits sentries — validator unaffected" color="#ef4444" />
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.circle key={i} cx={50 + i * 28} cy={45} r={3}
                  fill="#ef4444"
                  animate={{ y: [0, 30] }}
                  transition={{ duration: 1, delay: i * 0.1, repeat: Infinity }} />
              ))}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
