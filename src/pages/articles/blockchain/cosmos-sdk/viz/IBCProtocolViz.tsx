import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const NODES = [
  { id: 'appA', label: '체인 A (App)', color: '#6366f1', x: 0 },
  { id: 'ibcA', label: 'IBC A', color: '#0ea5e9', x: 60 },
  { id: 'lcA', label: 'LC A', color: '#10b981', x: 120 },
  { id: 'relay', label: '릴레이어', color: '#f59e0b', x: 180 },
  { id: 'lcB', label: 'LC B', color: '#10b981', x: 240 },
  { id: 'ibcB', label: 'IBC B', color: '#8b5cf6', x: 300 },
  { id: 'appB', label: '체인 B (App)', color: '#ef4444', x: 360 },
];
const W = 55, H = 32;

const STEPS = [
  { label: '패킷 전송', body: '체인 A의 앱이 IBC 모듈을 통해 패킷을 커밋합니다.' },
  { label: '릴레이어 중계', body: '릴레이어가 체인 A의 이벤트를 감지하고 증명과 함께 체인 B로 전달합니다.' },
  { label: '증명 검증 & 수신', body: '체인 B의 Light Client가 증명을 검증하고 앱에 패킷을 전달합니다.' },
  { label: 'Acknowledgement', body: '체인 B가 Ack를 작성하면 릴레이어가 체인 A로 돌려보내 완료합니다.' },
];

const LABELS = ['SendPacket', '패킷 커밋', '이벤트 감지', '증명+패킷', '증명 검증', 'OnRecvPacket'];

const visRange = (step: number): [number, number] => {
  if (step === 0) return [0, 2];
  if (step === 1) return [2, 4];
  if (step === 2) return [4, 6];
  return [0, 6];
};

export default function IBCProtocolViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const [lo, hi] = visRange(step);
        return (
          <svg viewBox="0 0 565 70" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            {NODES.map((n, i) => {
              const show = step === 3 || (i >= lo && i <= hi);
              return (
                <motion.g key={n.id} animate={{ opacity: show ? 1 : 0.1 }}>
                  {i > 0 && (
                    <motion.g animate={{ opacity: show && (step === 3 || (i - 1 >= lo && i <= hi)) ? 0.8 : 0 }}>
                      <line x1={NODES[i - 1].x + W} y1={H / 2 + 12} x2={n.x} y2={H / 2 + 12}
                        stroke="#888" strokeWidth={1} strokeDasharray="3 2" />
                      {i - 1 < LABELS.length && (
                        <text x={(NODES[i - 1].x + W + n.x) / 2} y={9}
                          textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">{LABELS[i - 1]}</text>
                      )}
                    </motion.g>
                  )}
                  <motion.rect x={n.x + 2} y={12} width={W - 4} height={H} rx={5}
                    animate={{ fill: `${n.color}18`, stroke: n.color, strokeWidth: show ? 1.6 : 0.6 }} />
                  <text x={n.x + W / 2} y={32} textAnchor="middle"
                    fontSize={8} fontWeight={600} fill={n.color}>{n.label}</text>
                </motion.g>
              );
            })}
            {step === 3 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.6 }}>
                <line x1={NODES[6].x + W / 2} y1={H + 14} x2={NODES[5].x + W / 2} y2={H + 14}
                  stroke="#ef4444" strokeWidth={1.2} strokeDasharray="4 2" markerEnd="url(#ack)" />
                <text x={370} y={H + 24} fontSize={9} fill="#ef4444">Ack</text>
              </motion.g>
            )}
          <defs>
            <marker id="ack" markerWidth="5" markerHeight="4" refX="4" refY="2" orient="auto">
              <path d="M0,0 L5,2 L0,4" fill="var(--muted-foreground)" opacity={0.5} />
            </marker>
          </defs>
        </svg>
        );
      }}
    </StepViz>
  );
}
