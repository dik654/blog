import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, DataBox } from '@/components/viz/boxes';

const C = {
  app: '#6366f1',
  guest: '#0ea5e9',
  host: '#f59e0b',
  asp: '#8b5cf6',
};

const STEPS = [
  { label: '① App: /dev/sev-guest 오픈 + ioctl', body: 'SNP_GET_REPORT 호출 — nonce(64B) 전달' },
  { label: '② Guest kernel — Guest Message 구성', body: 'snp_report_req에 user_data 채움 + VMPCK HMAC' },
  { label: '③ GHCB로 Host에 SNP_GUEST_REQ 송신', body: 'VMGEXIT — host는 본문 못 읽음 (암호화)' },
  { label: '④ Host → ASP 전달, ASP가 VCEK로 서명', body: 'measurement, TCB, nonce 포함된 보고서 생성' },
  { label: '⑤ Guest message queue로 응답 수신 → 복호화', body: 'Sequence counter 증가 → replay 방어' },
];

export default function GuestReportRequestViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <ModuleBox x={20} y={26} w={100} h={42} label="App" sub="userspace" color={C.app} />
          <ModuleBox x={140} y={26} w={100} h={42} label="Guest Kernel" sub="sev-guest.c" color={C.guest} />
          <ModuleBox x={260} y={26} w={100} h={42} label="Host (KVM)" sub="passthrough" color={C.host} />
          <ModuleBox x={380} y={26} w={80} h={42} label="ASP" sub="sign" color={C.asp} />

          {[
            { from: 0, to: 1, color: C.app, label: 'ioctl SNP_GET_REPORT', y: 92 },
            { from: 1, to: 2, color: C.guest, label: 'GHCB SNP_GUEST_REQ + HMAC', y: 124 },
            { from: 2, to: 3, color: C.host, label: 'mailbox → ASP', y: 156 },
            { from: 3, to: 2, color: C.asp, label: 'signed report (VCEK)', y: 188, reverse: true },
            { from: 1, to: 0, color: C.guest, label: 'copy_to_user(report)', y: 220, reverse: true },
          ].map((arrow, i) => {
            const visible = step >= i;
            const xStart = [70, 190, 310, 420][arrow.from];
            const xEnd = [70, 190, 310, 420][arrow.to];
            return (
              <motion.g key={i} animate={{ opacity: visible ? 1 : 0.15 }}>
                <motion.line x1={xStart} y1={arrow.y} x2={xEnd} y2={arrow.y}
                  stroke={arrow.color} strokeWidth={1.2} markerEnd={`url(#gr${arrow.reverse ? 'r' : 'f'}${i})`}
                  initial={{ pathLength: 0 }} animate={{ pathLength: visible ? 1 : 0 }}
                  transition={{ duration: 0.4 }} />
                <text x={(xStart + xEnd) / 2} y={arrow.y - 4} textAnchor="middle" fontSize={8.5} fill={arrow.color} fontWeight={600}>{arrow.label}</text>
                <defs>
                  <marker id={`gr${arrow.reverse ? 'r' : 'f'}${i}`} markerWidth={5} markerHeight={5} refX={4} refY={2.5} orient="auto">
                    <polygon points="0 0, 5 2.5, 0 5" fill={arrow.color} />
                  </marker>
                </defs>
              </motion.g>
            );
          })}

          {step >= 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={140} y={76} w={100} h={12} label="VMPCK key" color={C.guest} outlined />
            </motion.g>
          )}
          {step >= 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ActionBox x={140} y={224} w={100} h={12} label="seq++ replay 방어" color={C.guest} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
