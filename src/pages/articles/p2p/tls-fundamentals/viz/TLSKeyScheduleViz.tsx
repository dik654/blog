import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = {
  early: '#f59e0b',
  hs: '#6366f1',
  master: '#10b981',
  up: '#8b5cf6',
  ext: '#ec4899',
  exp: '#0ea5e9',
};

const STEPS = [
  {
    label: '1: Early Secret (PSK 기반)',
    body: 'PSK (없으면 0x00...00) → Extract → early_secret.\nExpand 로 client_early_key 도출 — 0-RTT 데이터 암호화에 사용.',
  },
  {
    label: '2: Handshake Secret (ECDHE)',
    body: 'shared = x25519(eph, peer_pub).\nearly → derived → Extract(derived, shared) = hs_secret.\nclient/server hs traffic 키로 핸드셰이크 메시지 암호화.',
  },
  {
    label: '3: Master Secret (애플리케이션)',
    body: 'hs → derived2 → Extract(derived2, 0) = master.\nclient/server app traffic 키 — 핸드셰이크 후 앱 데이터 AEAD.',
  },
  {
    label: '4: Key Update (PFS 강화)',
    body: 'new_key = Expand(current_key, "traffic upd", "").\nKeyUpdate 메시지로 즉시 전환 + 이전 키 삭제 → forward secrecy.',
  },
];

const lvl = (x: number, y: number, color: string, label: string, sub: string) => (
  <DataBox x={x} y={y} w={140} h={36} label={label} sub={sub} color={color} outlined />
);

export default function TLSKeyScheduleViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="ks-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 z" fill={C.exp} />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={250} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.early}>
                Early Secret (선택적, PSK 있을 때)
              </text>
              {lvl(20, 50, C.early, 'PSK', 'or 0x00...00')}
              <ActionBox x={180} y={48} w={140} h={42} label="Extract" sub="HKDF salt=0" color={C.ext} />
              {lvl(340, 50, C.early, 'early_secret', '32B')}
              <motion.line x1={160} y1={68} x2={180} y2={68} stroke={C.ext} strokeWidth={1.2}
                markerEnd="url(#ks-arr)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} />
              <motion.line x1={320} y1={68} x2={340} y2={68} stroke={C.ext} strokeWidth={1.2}
                markerEnd="url(#ks-arr)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} />

              <ActionBox x={180} y={120} w={140} h={42} label="Expand" sub='"c e traffic" + CH' color={C.exp} />
              {lvl(340, 122, C.early, 'client_early_key', '0-RTT 데이터')}
              <motion.line x1={250} y1={86} x2={250} y2={120} stroke={C.exp} strokeWidth={1.2}
                markerEnd="url(#ks-arr)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} />
              <motion.line x1={320} y1={140} x2={340} y2={140} stroke={C.exp} strokeWidth={1.2}
                markerEnd="url(#ks-arr)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} />
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={250} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.hs}>
                Handshake Secret (ECDHE)
              </text>
              {lvl(20, 45, C.hs, 'shared', 'x25519')}
              {lvl(20, 90, C.early, 'early_secret', '이전 단계')}
              <ActionBox x={180} y={45} w={140} h={42} label="derive" sub='Expand "derived"' color={C.exp} />
              <ActionBox x={180} y={92} w={140} h={42} label="Extract" sub="salt=derived, ikm=shared" color={C.ext} />
              {lvl(340, 70, C.hs, 'hs_secret', '32B')}

              {[0, 1].map((i) => (
                <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 + 0.2 * i }}>
                  <ActionBox x={180} y={150 + i * 0} w={140} h={36}
                    label={i === 0 ? 'c hs traffic' : 's hs traffic'} color={C.exp} />
                </motion.g>
              ))}
              {lvl(20, 150, C.hs, 'client_hs_key', '핸드셰이크 암호화')}
              {lvl(340, 150, C.hs, 'server_hs_key', '핸드셰이크 암호화')}
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={250} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.master}>
                Master Secret (앱 데이터)
              </text>
              {lvl(20, 50, C.hs, 'hs_secret', '이전 단계')}
              <ActionBox x={180} y={48} w={140} h={42} label="derive" color={C.exp} />
              <ActionBox x={180} y={100} w={140} h={42} label="Extract" sub="ikm=0" color={C.ext} />
              {lvl(340, 70, C.master, 'master_secret', '32B')}

              {lvl(50, 165, C.master, 'client_app_key', 'AEAD')}
              {lvl(310, 165, C.master, 'server_app_key', 'AEAD')}
              <motion.line x1={250} y1={142} x2={120} y2={165} stroke={C.exp} strokeWidth={1} strokeDasharray="3 3"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} />
              <motion.line x1={250} y1={142} x2={380} y2={165} stroke={C.exp} strokeWidth={1} strokeDasharray="3 3"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} />
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={250} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.up}>
                Key Update — 주기적 갱신
              </text>
              {lvl(20, 60, C.master, 'current_key', 'app traffic')}
              <ActionBox x={180} y={58} w={140} h={42} label='Expand "upd"' color={C.exp} />
              {lvl(340, 60, C.up, 'new_key', '교체')}

              <motion.line x1={160} y1={78} x2={180} y2={78} stroke={C.exp} strokeWidth={1.2}
                markerEnd="url(#ks-arr)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} />
              <motion.line x1={320} y1={78} x2={340} y2={78} stroke={C.exp} strokeWidth={1.2}
                markerEnd="url(#ks-arr)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} />

              <ModuleBox x={130} y={130} w={240} h={50} label="KeyUpdate 메시지" sub="이전 키 삭제 → PFS 강화" color={C.up} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
