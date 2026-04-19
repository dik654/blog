import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.18, duration: 0.5 };
const C = {
  hdr: '#94a3b8',
  ver: '#a855f7',
  dcid: '#0ea5e9',
  scid: '#10b981',
  rest: '#64748b',
  pathA: '#0ea5e9',
  pathB: '#f59e0b',
  pathC: '#10b981',
};

const STEPS = [
  {
    label: 'QUIC Long Header — DCID 와 SCID 가 핵심',
    body: 'DCID 는 수신자(서버) 의 식별자, SCID 는 송신자(클라이언트) 자신의 식별자. 첫 패킷부터 노출.',
  },
  {
    label: 'CID 는 0~20 바이트 — 보통 8 바이트 랜덤',
    body: '서버가 발급하고 충돌 방지로 충분한 엔트로피를 갖는다. 추측 어려운 값.',
  },
  {
    label: 'NEW_CONNECTION_ID — 다중 CID 발급',
    body: '서버가 추가 CID 를 미리 알려둠. 클라이언트는 경로마다 다른 CID 를 쓸 수 있다.',
  },
  {
    label: '경로별 CID — linkability 방지',
    body: 'WiFi/4G/VPN 각 경로에 다른 CID 를 사용. 관찰자가 같은 사용자의 트래픽임을 잇기 어렵다.',
  },
];

interface FieldProps { x: number; w: number; label: string; sub: string; color: string; highlight?: boolean; }

function Field({ x, w, label, sub, color, highlight }: FieldProps) {
  return (
    <motion.g
      initial={{ opacity: 0.5 }}
      animate={{ opacity: highlight ? 1 : 0.55 }}
      transition={sp}>
      <rect x={x} y={30} width={w} height={36} rx={4}
        fill={`${color}${highlight ? '25' : '12'}`}
        stroke={color} strokeWidth={highlight ? 1.2 : 0.6} />
      <text x={x + w / 2} y={48} textAnchor="middle" fontSize={9} fontWeight={600} fill={color}>
        {label}
      </text>
      <text x={x + w / 2} y={60} textAnchor="middle" fontSize={7.5} fill={color} opacity={0.8}>
        {sub}
      </text>
    </motion.g>
  );
}

export default function ConnectionIdViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {(step === 0 || step === 1) && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">
                QUIC Long Header
              </text>
              <Field x={20} w={50} label="Flags" sub="1 byte" color={C.hdr} />
              <Field x={75} w={70} label="Version" sub="4 bytes" color={C.ver} />
              <Field x={150} w={140} label="DCID" sub="length + value" color={C.dcid}
                highlight />
              <Field x={295} w={140} label="SCID" sub="length + value" color={C.scid}
                highlight />

              {step === 1 && (
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                  <DataBox x={150} y={90} w={140} h={28}
                    label="0xa3 b1 c8 7f e2 4d 91 6e" sub="8 bytes (typical)" color={C.dcid}
                    outlined />
                  <DataBox x={295} y={90} w={140} h={28}
                    label="0x12 89 d4 56 7e 33 a0 18" sub="8 bytes random" color={C.scid}
                    outlined />
                  <text x={240} y={140} textAnchor="middle" fontSize={9} fill="#9ca3af">
                    길이 0~20, 보통 8. 추측 어려움이 핵심.
                  </text>
                </motion.g>
              )}
              {step === 0 && (
                <text x={240} y={140} textAnchor="middle" fontSize={9} fill="#9ca3af">
                  IP/포트가 아닌 CID 가 stable 식별자
                </text>
              )}
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ModuleBox x={20} y={70} w={90} h={48} label="Server" color={C.scid} />
              <ModuleBox x={370} y={70} w={90} h={48} label="Client" color={C.dcid} />

              <motion.path d="M 110 94 L 370 94"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6 }}
                stroke={C.scid} strokeWidth={1.4} fill="none" markerEnd="url(#cida)" />
              <defs>
                <marker id="cida" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
                  <polygon points="0 0, 6 3, 0 6" fill={C.scid} />
                </marker>
              </defs>
              <text x={240} y={88} textAnchor="middle" fontSize={9} fill={C.scid} fontWeight={600}>
                NEW_CONNECTION_ID frame
              </text>
              <DataBox x={155} y={20} w={170} h={32}
                label="CID_B, CID_C, CID_D, ..." sub="여러 후보 미리 발급" color={C.scid} outlined />
              <text x={240} y={150} textAnchor="middle" fontSize={9} fill="#9ca3af">
                클라이언트는 보유한 CID 풀에서 골라 사용
              </text>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ModuleBox x={370} y={75} w={90} h={48} label="Server" color="#94a3b8" />
              {[
                { y: 20, color: C.pathA, label: 'WiFi path', cid: 'CID_A' },
                { y: 75, color: C.pathB, label: '4G path', cid: 'CID_B' },
                { y: 130, color: C.pathC, label: 'VPN path', cid: 'CID_C' },
              ].map((p, i) => (
                <motion.g key={p.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.15 }}>
                  <DataBox x={20} y={p.y} w={130} h={26}
                    label={p.label} sub={p.cid} color={p.color} outlined />
                  <line x1={150} y1={p.y + 13} x2={370} y2={99}
                    stroke={p.color} strokeWidth={1} strokeDasharray="3 2" />
                </motion.g>
              ))}
              <text x={240} y={185} textAnchor="middle" fontSize={9} fill="#9ca3af">
                옵저버: CID 가 다르므로 같은 연결로 묶기 어려움
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
