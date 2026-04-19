import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox } from '@/components/viz/boxes';

const STEPS = [
  { label: 'Frame 구조 — length-prefix + CBOR payload', body: 'uint32 length (big-endian) + payload (CBOR-encoded Body).\n간단·자기설명적, 손쉬운 streaming 파싱.' },
  { label: 'Host → Runtime 메시지', body: 'HostPing · HostRPCCall · HostStorageSync · HostLocalStorageGet · HostRegistryGet.\nRuntime 이 외부 자원에 접근할 수 있도록 host 가 proxy.' },
  { label: 'Runtime → Host 메시지', body: 'RuntimeInfo · RuntimeExecuteTxBatch · RuntimeAbort · RuntimeKMStatusUpdate.\nHost 가 트랜잭션 실행을 요청하고 KM 상태 변화를 반영.' },
  { label: '핫스팟 — 4개 핵심 요청', body: 'ExecuteTxBatch / HostStorageSync / HostRPCCall (KM) / KMStatusUpdate.\n런타임 운영 중 가장 빈번하게 오가는 메시지.' },
];

const HOST_MSGS = [
  { name: 'HostPing',           color: '#6366f1' },
  { name: 'HostRPCCall',        color: '#10b981' },
  { name: 'HostStorageSync',    color: '#f59e0b' },
  { name: 'HostLocalStorage',   color: '#a855f7' },
  { name: 'HostRegistryGet',    color: '#ec4899' },
];

const RUNTIME_MSGS = [
  { name: 'RuntimeInfo',         color: '#6366f1' },
  { name: 'ExecuteTxBatch',      color: '#10b981', hot: true },
  { name: 'RuntimeAbort',        color: '#f59e0b' },
  { name: 'KMStatusUpdate',      color: '#ec4899', hot: true },
];

export default function IpcProtocolViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Frame structure (step 0) */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={70} y={20} w={80} h={32} label="length" color="#6366f1" outlined />
              <text x={110} y={66} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                uint32 BE
              </text>
              <DataBox x={155} y={20} w={260} h={32} label="payload (CBOR Body)" color="#10b981" outlined />
              <text x={285} y={66} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                self-describing, streaming-friendly
              </text>
            </motion.g>
          )}

          {/* Boxes always rendered for steps >= 1 */}
          {step >= 1 && (
            <>
              <ModuleBox x={20} y={70} w={120} h={50} label="Host" sub="Go process" color="#3b82f6" />
              <ModuleBox x={340} y={70} w={120} h={50} label="Runtime" sub="TEE process" color="#ec4899" />

              {/* Host → Runtime messages */}
              <motion.g animate={{ opacity: step === 1 || step === 3 ? 1 : 0.3 }}>
                {HOST_MSGS.map((m, i) => {
                  const y = 30 + i * 32;
                  const hot = step === 3 && (m.name === 'HostRPCCall' || m.name === 'HostStorageSync');
                  return (
                    <g key={`h-${m.name}`}>
                      <DataBox x={150} y={y} w={120} h={22}
                        label={m.name} color={m.color} outlined={hot} />
                    </g>
                  );
                })}
                {step === 1 && (
                  <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <line x1={140} y1={95} x2={150} y2={95} stroke="#3b82f6" strokeWidth={1.2} />
                    <text x={245} y={184} textAnchor="middle" fontSize={9}
                      fill="#3b82f6" fontWeight={600}>Host → Runtime</text>
                  </motion.g>
                )}
              </motion.g>
            </>
          )}

          {/* Runtime → Host messages (step 2 or 3) */}
          {(step === 2 || step === 3) && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {RUNTIME_MSGS.map((m, i) => {
                const y = 145 + i * 22;
                const hot = step === 3 && m.hot;
                return (
                  <g key={`r-${m.name}`}>
                    <DataBox x={170} y={y} w={140} h={18}
                      label={m.name} color={m.color} outlined={hot} />
                  </g>
                );
              })}
              {step === 2 && (
                <text x={245} y={142} textAnchor="middle" fontSize={9}
                  fill="#ec4899" fontWeight={600}>Runtime → Host</text>
              )}
            </motion.g>
          )}

          {/* Hot path indicator (step 3) */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <text x={240} y={20} textAnchor="middle" fontSize={10} fill="#ef4444" fontWeight={700}>
                hot-path: outlined messages dominate IO
              </text>
            </motion.g>
          )}

          <text x={240} y={228} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
            go/runtime/host/protocol — Body union over CBOR frames
          </text>
        </svg>
      )}
    </StepViz>
  );
}
