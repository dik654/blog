import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, DataBox } from '@/components/viz/boxes';

const C = {
  host: '#6366f1',
  mb: '#f59e0b',
  asp: '#8b5cf6',
  shared: '#0ea5e9',
};

const STEPS = [
  { label: '① Host가 mailbox 레지스터에 명령 ID 기입', body: 'iowrite32(cmd, SEV_CMDRESP_REG)' },
  { label: '② Doorbell — ASP 깨우기', body: 'iowrite32(1, SEV_CMD_READY)' },
  { label: '③ Host polling — 응답 대기 (타임아웃 5초)', body: 'SEV_STATUS 비트 SEV_READY 검사' },
  { label: '④ ASP가 mailbox 읽고 명령 처리', body: '큰 데이터는 shared DRAM buffer로 전달' },
  { label: '⑤ ASP 결과 기입 + status 비트 셋', body: 'Host가 status 읽고 결과 반환' },
];

export default function HostASPMailboxViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <ModuleBox x={20} y={26} w={140} h={50} label="Host (Linux KVM)" sub="sev-dev.c" color={C.host} />
          <ModuleBox x={170} y={26} w={140} h={50} label="Mailbox + MMIO" sub="SEV_*_REG" color={C.mb} />
          <ModuleBox x={320} y={26} w={140} h={50} label="ASP" sub="ARM A5 firmware" color={C.asp} />

          {/* Step arrows */}
          {[
            { from: 'h', to: 'm', y: 100, label: 'cmd ID 기입', step: 0, color: C.host },
            { from: 'h', to: 'm', y: 124, label: 'doorbell = 1', step: 1, color: C.host },
            { from: 'm', to: 'a', y: 148, label: 'ASP wake → recv', step: 3, color: C.asp },
            { from: 'a', to: 'm', y: 172, label: 'result + status', step: 4, color: C.asp },
            { from: 'm', to: 'h', y: 196, label: 'host polls SEV_READY', step: 2, color: C.host },
          ].map((a, i) => {
            const visible = step >= a.step;
            const xStart = a.from === 'h' ? 90 : a.from === 'm' ? 240 : 390;
            const xEnd = a.to === 'h' ? 90 : a.to === 'm' ? 240 : 390;
            return (
              <motion.g key={i} animate={{ opacity: visible ? 1 : 0.15 }}>
                <motion.line x1={xStart} y1={a.y} x2={xEnd} y2={a.y}
                  stroke={a.color} strokeWidth={1.2} markerEnd={`url(#mb${i})`}
                  initial={{ pathLength: 0 }} animate={{ pathLength: visible ? 1 : 0 }} transition={{ duration: 0.4 }} />
                <text x={(xStart + xEnd) / 2} y={a.y - 4} textAnchor="middle" fontSize={8.5} fontWeight={600} fill={a.color}>{a.label}</text>
                <defs>
                  <marker id={`mb${i}`} markerWidth={5} markerHeight={5} refX={4} refY={2.5} orient="auto">
                    <polygon points="0 0, 5 2.5, 0 5" fill={a.color} />
                  </marker>
                </defs>
              </motion.g>
            );
          })}

          {/* Shared buffer */}
          <motion.g animate={{ opacity: step >= 3 ? 1 : 0.2 }}>
            <DataBox x={20} y={216} w={440} h={20} label="Shared DRAM buffer (대용량 데이터: cert, session, page bytes)" color={C.shared} outlined />
          </motion.g>

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ActionBox x={20} y={84} w={140} h={14} label="while (timeout--)" color={C.host} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
