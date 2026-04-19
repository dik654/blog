import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox } from '@/components/viz/boxes';

const STEPS = [
  { label: 'Handshake 68바이트: pstrlen + protocol + reserved + hash + id' },
  { label: '메시지 타입 12개: choke부터 extended까지' },
  { label: '상태 머신: am_choking / am_interested / peer_choking / peer_interested' },
  { label: 'Choke 알고리즘: 10초 regular + 30초 optimistic' },
  { label: 'Piece 선택: rarest first + random first + endgame' },
];

const HANDSHAKE = [
  { label: '1B', sub: 'pstrlen=19', color: '#6366f1', w: 60 },
  { label: '19B', sub: 'BitTorrent\u00A0protocol', color: '#3b82f6', w: 110 },
  { label: '8B', sub: 'reserved', color: '#10b981', w: 70 },
  { label: '20B', sub: 'info_hash', color: '#f59e0b', w: 90 },
  { label: '20B', sub: 'peer_id', color: '#ec4899', w: 90 },
];

const MSG_TYPES = [
  { id: 0, label: 'choke', color: '#ef4444' },
  { id: 1, label: 'unchoke', color: '#10b981' },
  { id: 2, label: 'interested', color: '#3b82f6' },
  { id: 3, label: 'not int', color: '#94a3b8' },
  { id: 4, label: 'have', color: '#6366f1' },
  { id: 5, label: 'bitfield', color: '#8b5cf6' },
  { id: 6, label: 'request', color: '#f59e0b' },
  { id: 7, label: 'piece', color: '#14b8a6' },
  { id: 8, label: 'cancel', color: '#f97316' },
  { id: 9, label: 'port', color: '#ec4899' },
  { id: 20, label: 'extended', color: '#a855f7' },
];

const STATES = [
  { label: 'am_choking', sub: '나→피어 차단', color: '#ef4444', val: 1 },
  { label: 'am_interested', sub: '나→피어 관심', color: '#3b82f6', val: 0 },
  { label: 'peer_choking', sub: '피어→나 차단', color: '#ef4444', val: 1 },
  { label: 'peer_interested', sub: '피어→나 관심', color: '#10b981', val: 0 },
];

const CHOKE = [
  { label: 'Regular 10s', sub: '속도 상위 4명 unchoke', color: '#10b981' },
  { label: 'Optimistic 30s', sub: '랜덤 1명 unchoke', color: '#f59e0b' },
  { label: 'Tit-for-tat', sub: '상호 주고받음 유도', color: '#6366f1' },
];

const PICK = [
  { label: 'Rarest First', sub: '희귀 piece 우선', color: '#3b82f6' },
  { label: 'Random First', sub: '첫 piece 랜덤', color: '#8b5cf6' },
  { label: 'Endgame', sub: '마지막 다중 요청', color: '#f59e0b' },
];

export default function WireProtocolViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (() => {
            let x = 25;
            return (
              <>
                <text x={240} y={20} textAnchor="middle" fontSize={10} fontWeight={700} fill="#6366f1">
                  Handshake (68 bytes)
                </text>
                {HANDSHAKE.map((h, i) => {
                  const cx = x; x += h.w + 4;
                  return (
                    <motion.g key={h.label} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}>
                      <DataBox x={cx} y={40} w={h.w} h={50} label={h.label} sub={h.sub} color={h.color} outlined />
                    </motion.g>
                  );
                })}
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                  <text x={240} y={130} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                    이후: [4B length][1B type][payload]
                  </text>
                  <DataBox x={140} y={145} w={70} h={30} label="length" sub="4B" color="#94a3b8" outlined />
                  <DataBox x={215} y={145} w={50} h={30} label="type" sub="1B" color="#94a3b8" outlined />
                  <DataBox x={270} y={145} w={70} h={30} label="payload" color="#94a3b8" outlined />
                </motion.g>
              </>
            );
          })()}

          {step === 1 && MSG_TYPES.map((m, i) => (
            <motion.g key={m.id} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}>
              <DataBox x={20 + (i % 4) * 115} y={20 + Math.floor(i / 4) * 60} w={108} h={48}
                label={m.label} sub={`type ${m.id}`} color={m.color} outlined />
            </motion.g>
          ))}

          {step === 2 && (
            <>
              <text x={240} y={20} textAnchor="middle" fontSize={10} fontWeight={700} fill="#6366f1">
                Initial: choked, not interested
              </text>
              {STATES.map((s, i) => (
                <motion.g key={s.label} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}>
                  <StatusBox x={30 + (i % 2) * 220} y={40 + Math.floor(i / 2) * 75}
                    w={210} h={60} label={s.label} sub={s.sub} color={s.color} progress={s.val} />
                </motion.g>
              ))}
              <motion.text x={240} y={205} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                목표: 양쪽 모두 unchoke + interested
              </motion.text>
            </>
          )}

          {step === 3 && CHOKE.map((c, i) => (
            <motion.g key={c.label} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}>
              <ModuleBox x={50} y={30 + i * 60} w={380} h={48} label={c.label} sub={c.sub} color={c.color} />
            </motion.g>
          ))}

          {step === 4 && PICK.map((p, i) => (
            <motion.g key={p.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}>
              <ActionBox x={20 + i * 155} y={70} w={140} h={80} label={p.label} sub={p.sub} color={p.color} />
            </motion.g>
          ))}
        </svg>
      )}
    </StepViz>
  );
}
