import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, AlertBox, DataBox, ModuleBox } from '@/components/viz/boxes';

const STEPS = [
  {
    label: 'Sybil Attack',
    body: '많은 가짜 노드 생성 → 네트워크 장악.\n방어: peer scoring · IP throttling · resource-based identity (PoW/PoS) · admission control.',
  },
  {
    label: 'Eclipse Attack',
    body: '피해 노드의 모든 연결을 공격자로 치환 → 정보 격리.\n방어: diverse peer selection · anchor peers · random walk.',
  },
  {
    label: 'Message Flooding',
    body: '대량 메시지 발송으로 bandwidth 소진.\n방어: rate limiting · message size limits · scoring + blacklist.',
  },
  {
    label: 'Invalid Message Injection',
    body: '잘못된 서명/형식 주입.\n방어: validator hooks · invalid msg penalty · topic-level validation.',
  },
  {
    label: 'Censorship',
    body: '특정 메시지 전파 차단.\n방어: redundant gossip paths · self-healing mesh · flood publishing.',
  },
  {
    label: 'Ethereum Beacon Chain 사례',
    body: 'Slashable: double/surround vote → slashing proof.\nSpam: per-topic limits · attestation aggregation · gossipsub scoring.\nHealth: mesh diameter · topic coverage · peer diversity.',
  },
];

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = {
  attack: '#ef4444',
  defense: '#22c55e',
  victim: '#0ea5e9',
  warn: '#f59e0b',
  eth: '#6366f1',
};

const ATTACKS = [
  { key: 'Sybil', defs: ['Peer scoring', 'IP throttling', 'PoW/PoS identity', 'Admission ctrl'] },
  { key: 'Eclipse', defs: ['Diverse peers', 'Anchor peers', 'Random walk'] },
  { key: 'Flooding', defs: ['Rate limit', 'Msg size limit', 'Score + blacklist'] },
  { key: 'Invalid Msg', defs: ['Validator hooks', 'Invalid penalty', 'Topic validation'] },
  { key: 'Censorship', defs: ['Redundant paths', 'Self-healing mesh', 'Flood publishing'] },
];

export default function AttackDefenseViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-3xl" style={{ height: 'auto' }}>
          {step <= 4 && (
            <>
              {/* Top: attack scenario */}
              <text x={240} y={22} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">{ATTACKS[step].key} 시나리오</text>

              {/* Sybil — many attacker nodes */}
              {step === 0 &&
                Array.from({ length: 8 }).map((_, i) => {
                  const angle = (i / 8) * Math.PI * 2;
                  const x = 130 + Math.cos(angle) * 50;
                  const y = 90 + Math.sin(angle) * 35;
                  return (
                    <motion.g key={i} initial={{ scale: 0 }} animate={{ scale: 1 }}
                      style={{ transformOrigin: `${x}px ${y}px` }}
                      transition={{ delay: 0.05 * i, ...sp }}>
                      <circle cx={x} cy={y} r={7}
                        fill={C.attack + '20'} stroke={C.attack} strokeWidth={1} />
                      <text x={x} y={y + 3} textAnchor="middle" fontSize={6.5}
                        fontWeight={700} fill={C.attack}>S</text>
                    </motion.g>
                  );
                })}

              {/* Eclipse — victim surrounded */}
              {step === 1 && (
                <>
                  <circle cx={130} cy={90} r={14}
                    fill={C.victim + '15'} stroke={C.victim} strokeWidth={1.5} />
                  <text x={130} y={94} textAnchor="middle" fontSize={9} fontWeight={700}
                    fill={C.victim}>V</text>
                  {Array.from({ length: 6 }).map((_, i) => {
                    const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
                    const x = 130 + Math.cos(angle) * 45;
                    const y = 90 + Math.sin(angle) * 30;
                    return (
                      <motion.g key={i} initial={{ scale: 0 }} animate={{ scale: 1 }}
                        style={{ transformOrigin: `${x}px ${y}px` }}
                        transition={{ delay: 0.05 * i, ...sp }}>
                        <line x1={130} y1={90} x2={x} y2={y}
                          stroke={C.attack} strokeWidth={0.8} strokeOpacity={0.6} />
                        <circle cx={x} cy={y} r={6}
                          fill={C.attack + '20'} stroke={C.attack} strokeWidth={1} />
                      </motion.g>
                    );
                  })}
                </>
              )}

              {/* Flooding — many arrows */}
              {step === 2 && (
                <>
                  <circle cx={70} cy={90} r={12}
                    fill={C.attack + '15'} stroke={C.attack} strokeWidth={1.3} />
                  <text x={70} y={94} textAnchor="middle" fontSize={8.5}
                    fontWeight={700} fill={C.attack}>A</text>
                  <circle cx={210} cy={90} r={14}
                    fill={C.victim + '15'} stroke={C.victim} strokeWidth={1.3} />
                  <text x={210} y={94} textAnchor="middle" fontSize={9}
                    fontWeight={700} fill={C.victim}>V</text>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <motion.line key={i} x1={84} y1={90 + (i - 3) * 4} x2={196}
                      y2={90 + (i - 3) * 4} stroke={C.attack} strokeWidth={1}
                      strokeOpacity={0.7}
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.08 }} />
                  ))}
                </>
              )}

              {/* Invalid msg */}
              {step === 3 && (
                <>
                  <circle cx={70} cy={90} r={12}
                    fill={C.attack + '15'} stroke={C.attack} strokeWidth={1.3} />
                  <text x={70} y={94} textAnchor="middle" fontSize={8.5}
                    fontWeight={700} fill={C.attack}>A</text>
                  <line x1={84} y1={90} x2={196} y2={90}
                    stroke={C.attack} strokeWidth={1.4} strokeDasharray="4 3" />
                  <DataBox x={120} y={70} w={50} h={24}
                    label="bad sig" color={C.attack} outlined />
                  <ActionBox x={210} y={62} w={70} h={56}
                    label="Validator" sub="reject" color={C.defense} />
                </>
              )}

              {/* Censorship */}
              {step === 4 && (
                <>
                  {[
                    { x: 70, y: 60, c: C.victim },
                    { x: 70, y: 120, c: C.victim },
                    { x: 290, y: 90, c: C.victim },
                  ].map((n, i) => (
                    <g key={i}>
                      <circle cx={n.x} cy={n.y} r={10}
                        fill={n.c + '15'} stroke={n.c} strokeWidth={1.2} />
                    </g>
                  ))}
                  {/* censoring node in middle */}
                  <circle cx={180} cy={90} r={14}
                    fill={C.attack + '15'} stroke={C.attack} strokeWidth={1.3} />
                  <text x={180} y={94} textAnchor="middle" fontSize={9}
                    fontWeight={700} fill={C.attack}>X</text>
                  <line x1={80} y1={62} x2={166} y2={86}
                    stroke={C.attack} strokeWidth={1} strokeDasharray="3 3" opacity={0.6} />
                  <line x1={80} y1={118} x2={166} y2={94}
                    stroke={C.attack} strokeWidth={1} strokeDasharray="3 3" opacity={0.6} />
                  <line x1={194} y1={90} x2={278} y2={90}
                    stroke={C.attack} strokeWidth={1} strokeDasharray="3 3" opacity={0.6} />
                  {/* alt path */}
                  <motion.path d="M 80 60 Q 180 30 290 90" fill="none"
                    stroke={C.defense} strokeWidth={1.4}
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: 0.4 }} />
                  <text x={185} y={32} fontSize={8} fill={C.defense}>redundant gossip</text>
                </>
              )}

              {/* Attack label */}
              <AlertBox x={310} y={56} w={150} h={50}
                label={ATTACKS[step].key + ' Attack'}
                sub="네트워크 무력화 시도" color={C.attack} />

              {/* Defenses */}
              <text x={30} y={170} fontSize={10} fontWeight={700}
                fill={C.defense}>방어 메커니즘</text>
              {ATTACKS[step].defs.map((d, i) => (
                <motion.g key={d} initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.07 }}>
                  <DataBox x={30 + i * 110} y={185} w={100} h={30}
                    label={d} color={C.defense} outlined />
                </motion.g>
              ))}
            </>
          )}

          {step === 5 && (
            <>
              <text x={240} y={22} textAnchor="middle" fontSize={11} fontWeight={700}
                fill={C.eth}>Ethereum Beacon Chain 적용 사례</text>

              {/* Three lanes */}
              <ModuleBox x={20} y={42} w={140} h={40}
                label="Slashable Offenses" sub="penalty + propagate" color={C.attack} />
              <ModuleBox x={170} y={42} w={140} h={40}
                label="Spam Prevention" sub="rate + score" color={C.warn} />
              <ModuleBox x={320} y={42} w={140} h={40}
                label="Network Health" sub="metrics + tuning" color={C.defense} />

              {/* Items per lane */}
              {[
                { x: 20, items: ['Double vote', 'Surround vote', 'Slashing proof'], c: C.attack },
                {
                  x: 170,
                  items: ['Per-topic limits', 'Attestation aggr.', 'Gossipsub scoring'],
                  c: C.warn,
                },
                {
                  x: 320,
                  items: ['Mesh diameter', 'Topic coverage', 'Peer diversity'],
                  c: C.defense,
                },
              ].map((col, i) => (
                <motion.g key={i} initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.08 }}>
                  {col.items.map((it, j) => (
                    <g key={j}>
                      <circle cx={col.x + 12} cy={102 + j * 22} r={2.5} fill={col.c} />
                      <text x={col.x + 22} y={106 + j * 22} fontSize={9}
                        fill="var(--muted-foreground)">{it}</text>
                    </g>
                  ))}
                </motion.g>
              ))}

              {/* Tuning knobs */}
              <text x={240} y={186} textAnchor="middle" fontSize={9} fontWeight={700}
                fill="var(--foreground)">실무 튜닝 트레이드오프</text>
              {[
                { k: 'D (fanout)', l: 'perf', r: 'BW' },
                { k: 'Heartbeat', l: 'freq', r: 'overhead' },
                { k: 'Score wts', l: 'FP', r: 'security' },
                { k: 'Cache TTL', l: 'mem', r: 'dedup' },
              ].map((t, i) => (
                <g key={t.k}>
                  <text x={30 + i * 110 + 50} y={204} textAnchor="middle"
                    fontSize={8.5} fontWeight={600} fill={C.eth}>{t.k}</text>
                  <text x={30 + i * 110 + 50} y={222} textAnchor="middle"
                    fontSize={8} fill="var(--muted-foreground)">
                    {t.l} ⇄ {t.r}
                  </text>
                </g>
              ))}
            </>
          )}
        </svg>
      )}
    </StepViz>
  );
}
