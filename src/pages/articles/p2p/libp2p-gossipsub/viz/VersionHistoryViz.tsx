import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox } from '@/components/viz/boxes';

const STEPS = [
  { label: 'GossipSub 버전 진화 (v1.0 → v1.2)' },
  { label: 'v1.0 (2019) — Mesh-based pub/sub' },
  { label: 'v1.1 (2020) — Peer Scoring + Eth2' },
  { label: 'v1.2 (2023) — IDONTWANT 최적화' },
  { label: 'Message Types (5종 + Control)' },
  { label: 'Configuration Constants — D family' },
  { label: 'Application Examples' },
];

const VERSIONS = [
  { ver: 'v1.0', year: 2019, color: '#94a3b8', desc: 'Mesh + IHAVE/IWANT 기본 전파' },
  { ver: 'v1.1', year: 2020, color: '#10b981', desc: 'Peer Scoring + Sybil/Eclipse 방어, Eth2 채택' },
  { ver: 'v1.2', year: 2023, color: '#ec4899', desc: 'IDONTWANT 메시지 + 중복 감소' },
];

const FEATURES_V10 = [
  { label: 'Mesh-based pub/sub', color: '#10b981' },
  { label: 'IHAVE/IWANT gossip', color: '#6366f1' },
  { label: '기본 메시지 전파', color: '#f59e0b' },
];

const FEATURES_V11 = [
  { label: 'Peer Scoring 시스템', color: '#10b981' },
  { label: 'Adaptive gossip emission', color: '#6366f1' },
  { label: 'Sybil / Eclipse 방어', color: '#ef4444' },
  { label: 'Ethereum 2.0 채택', color: '#ec4899' },
];

const FEATURES_V12 = [
  { label: 'IDONTWANT 메시지', color: '#10b981' },
  { label: 'Bandwidth 최적화', color: '#6366f1' },
  { label: '중복 메시지 감소', color: '#f59e0b' },
  { label: 'Episub 병합 고려', color: '#ec4899' },
];

const MSG_TYPES = [
  { name: 'SUBSCRIBE', color: '#10b981' },
  { name: 'UNSUBSCRIBE', color: '#94a3b8' },
  { name: 'PUBLISH', color: '#ec4899' },
  { name: 'GRAFT', color: '#6366f1' },
  { name: 'PRUNE', color: '#ef4444' },
];

const CTRL_TYPES = [
  { name: 'IHAVE', desc: '"이런 메시지 가지고 있어"', color: '#6366f1' },
  { name: 'IWANT', desc: '"그 메시지 나한테도"', color: '#ec4899' },
  { name: 'IDONTWANT (v1.2)', desc: '"그거 이미 있으니 보내지마"', color: '#10b981' },
];

const CONSTANTS = [
  { name: 'D', val: '6', desc: 'target mesh peers', color: '#10b981' },
  { name: 'D_lo', val: '4', desc: 'minimum mesh', color: '#6366f1' },
  { name: 'D_hi', val: '12', desc: 'maximum mesh', color: '#ef4444' },
  { name: 'D_lazy', val: '6', desc: 'gossip peers', color: '#f59e0b' },
  { name: 'heartbeat', val: '1s', desc: '주기', color: '#ec4899' },
  { name: 'seen_ttl', val: '120s', desc: 'duplicate cache', color: '#8b5cf6' },
];

const APPS = [
  { name: 'Eth2 Beacon Chain', items: ['beacon_block', 'beacon_attestation_*', 'voluntary_exit', 'proposer_slashing'], color: '#6366f1' },
  { name: 'Filecoin', items: ['storage deals', 'market messages'], color: '#10b981' },
  { name: 'Polkadot', items: ['consensus messages'], color: '#ec4899' },
];

export default function VersionHistoryViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: timeline */}
          {step === 0 && (
            <g>
              <line x1={50} y1={120} x2={430} y2={120} stroke="#94a3b8" strokeWidth={0.8} />
              {VERSIONS.map((v, i) => (
                <motion.g key={v.ver} initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.2 }}>
                  <circle cx={90 + i * 150} cy={120} r={8} fill={v.color} />
                  <ModuleBox x={30 + i * 150} y={45} w={120} h={50} label={v.ver} sub={`${v.year}`} color={v.color} />
                  <text x={90 + i * 150} y={155} textAnchor="middle" fontSize={9}
                    fill="var(--muted-foreground)" style={{ width: 120 }}>{v.desc.split(',')[0]}</text>
                  <text x={90 + i * 150} y={170} textAnchor="middle" fontSize={9}
                    fill="var(--muted-foreground)">{v.desc.split(',')[1] || ''}</text>
                </motion.g>
              ))}
            </g>
          )}

          {/* Steps 1-3: each version detail */}
          {step >= 1 && step <= 3 && (() => {
            const v = VERSIONS[step - 1];
            const features = step === 1 ? FEATURES_V10 : step === 2 ? FEATURES_V11 : FEATURES_V12;
            return (
              <g>
                <ModuleBox x={170} y={20} w={140} h={42} label={`GossipSub ${v.ver}`} sub={`${v.year}`} color={v.color} />
                {features.map((f, i) => (
                  <motion.g key={f.label} initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }}>
                    <rect x={50} y={85 + i * 36} width={380} height={28} rx={4}
                      fill={f.color + '0a'} stroke={f.color + '60'} strokeWidth={0.7} />
                    <text x={70} y={103 + i * 36} fontSize={10} fontWeight={600} fill={f.color}>{f.label}</text>
                  </motion.g>
                ))}
              </g>
            );
          })()}

          {/* Step 4: message types */}
          {step === 4 && (
            <g>
              <text x={120} y={20} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">Main</text>
              <text x={350} y={20} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">Control</text>
              {MSG_TYPES.map((m, i) => (
                <motion.g key={m.name} initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
                  <rect x={20} y={36 + i * 36} width={200} height={28} rx={4}
                    fill={m.color + '0a'} stroke={m.color + '60'} strokeWidth={0.7} />
                  <text x={36} y={54 + i * 36} fontSize={9.5} fontWeight={700} fill={m.color}>{m.name}</text>
                </motion.g>
              ))}
              {CTRL_TYPES.map((c, i) => (
                <motion.g key={c.name} initial={{ opacity: 0, x: 6 }}
                  animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                  <rect x={245} y={36 + i * 50} width={215} height={42} rx={4}
                    fill={c.color + '0a'} stroke={c.color + '60'} strokeWidth={0.7} />
                  <text x={261} y={54 + i * 50} fontSize={9.5} fontWeight={700} fill={c.color}>{c.name}</text>
                  <text x={261} y={68 + i * 50} fontSize={8.5} fill="var(--muted-foreground)">{c.desc}</text>
                </motion.g>
              ))}
            </g>
          )}

          {/* Step 5: constants */}
          {step === 5 && (
            <g>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                D-family Configuration
              </text>
              {CONSTANTS.map((c, i) => (
                <motion.g key={c.name} initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 }}>
                  <rect x={20 + (i % 2) * 230} y={42 + Math.floor(i / 2) * 50}
                    width={220} height={42} rx={5}
                    fill={c.color + '0a'} stroke={c.color + '50'} strokeWidth={0.7} />
                  <text x={36 + (i % 2) * 230} y={62 + Math.floor(i / 2) * 50}
                    fontSize={10} fontWeight={700} fill={c.color}>{c.name} = {c.val}</text>
                  <text x={36 + (i % 2) * 230} y={76 + Math.floor(i / 2) * 50}
                    fontSize={8.5} fill="var(--muted-foreground)">{c.desc}</text>
                </motion.g>
              ))}
            </g>
          )}

          {/* Step 6: apps */}
          {step === 6 && (
            <g>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                Application Examples
              </text>
              {APPS.map((a, i) => (
                <motion.g key={a.name} initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }}>
                  <rect x={20} y={45 + i * 60} width={440} height={50} rx={6}
                    fill={a.color + '0a'} stroke={a.color + '50'} strokeWidth={0.7} />
                  <text x={36} y={66 + i * 60} fontSize={10} fontWeight={700} fill={a.color}>{a.name}</text>
                  <text x={36} y={82 + i * 60} fontSize={9} fill="var(--muted-foreground)">
                    {a.items.join(' · ')}
                  </text>
                </motion.g>
              ))}
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
