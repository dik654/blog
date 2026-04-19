import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox } from '@/components/viz/boxes';

const STEPS = [
  { label: 'Noise Framework: 패턴 선택' },
  { label: 'XX 패턴 — 양방향 신원 교환' },
  { label: 'Msg 1: → e (이니시에이터 ephemeral)' },
  { label: 'Msg 2: ← e, ee, s, es' },
  { label: 'Msg 3: → s, se (1.5 RTT)' },
  { label: 'libp2p 합의: Noise_XX_25519_ChaChaPoly_SHA256' },
];

const PATTERNS = [
  { name: 'NN', desc: 'no auth', color: '#94a3b8' },
  { name: 'NK', desc: 'server known', color: '#94a3b8' },
  { name: 'KN', desc: 'client known', color: '#94a3b8' },
  { name: 'KK', desc: 'mutual known', color: '#94a3b8' },
  { name: 'XX', desc: 'mutual transmit', color: '#ec4899' },
  { name: 'IX', desc: 'fewer RTTs', color: '#94a3b8' },
];

const DH_OPS = [
  { id: 'ee', desc: 'init eph × resp eph', color: '#10b981' },
  { id: 'es', desc: 'init eph × resp static', color: '#6366f1' },
  { id: 'se', desc: 'init static × resp eph', color: '#f59e0b' },
];

export default function NoiseFrameworkViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: Patterns grid */}
          {step === 0 && (
            <g>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                Noise 패턴 카탈로그
              </text>
              {PATTERNS.map((p, i) => (
                <motion.g key={p.name} initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                  <DataBox x={50 + (i % 3) * 130} y={45 + Math.floor(i / 3) * 60}
                    w={110} h={45} label={p.name} sub={p.desc} color={p.color} outlined={p.name === 'XX'} />
                </motion.g>
              ))}
              <text x={240} y={210} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                X = static key 전송, K = pre-known, N = none
              </text>
            </g>
          )}

          {/* Steps 1-4: Handshake messages */}
          {step >= 1 && step <= 4 && (
            <g>
              <ModuleBox x={40} y={30} w={120} h={40} label="Initiator" sub="X25519 ephemeral" color="#10b981" />
              <ModuleBox x={320} y={30} w={120} h={40} label="Responder" sub="X25519 ephemeral" color="#6366f1" />

              {/* Msg 1: → e */}
              <motion.g initial={{ opacity: 0 }}
                animate={{ opacity: step >= 2 ? 1 : 0.2 }} transition={{ duration: 0.3 }}>
                <line x1={160} y1={95} x2={320} y2={95} stroke="#10b981" strokeWidth={1.5} markerEnd="url(#arr1)" />
                <text x={240} y={88} textAnchor="middle" fontSize={9} fontWeight={600} fill="#10b981">→ e</text>
              </motion.g>

              {/* Msg 2: ← e, ee, s, es */}
              <motion.g initial={{ opacity: 0 }}
                animate={{ opacity: step >= 3 ? 1 : 0.2 }} transition={{ duration: 0.3 }}>
                <line x1={320} y1={130} x2={160} y2={130} stroke="#6366f1" strokeWidth={1.5} markerEnd="url(#arr2)" />
                <text x={240} y={123} textAnchor="middle" fontSize={9} fontWeight={600} fill="#6366f1">← e, ee, s, es</text>
              </motion.g>

              {/* Msg 3: → s, se */}
              <motion.g initial={{ opacity: 0 }}
                animate={{ opacity: step >= 4 ? 1 : 0.2 }} transition={{ duration: 0.3 }}>
                <line x1={160} y1={165} x2={320} y2={165} stroke="#f59e0b" strokeWidth={1.5} markerEnd="url(#arr3)" />
                <text x={240} y={158} textAnchor="middle" fontSize={9} fontWeight={600} fill="#f59e0b">→ s, se</text>
              </motion.g>

              {/* DH ops summary at bottom */}
              {step >= 3 && (
                <g>
                  {DH_OPS.map((op, i) => (
                    <motion.g key={op.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 + i * 0.1 }}>
                      <DataBox x={40 + i * 145} y={195} w={130} h={26}
                        label={op.id} sub={op.desc} color={op.color} />
                    </motion.g>
                  ))}
                </g>
              )}

              <defs>
                <marker id="arr1" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
                  <polygon points="0 0,6 2.5,0 5" fill="#10b981" />
                </marker>
                <marker id="arr2" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
                  <polygon points="0 0,6 2.5,0 5" fill="#6366f1" />
                </marker>
                <marker id="arr3" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
                  <polygon points="0 0,6 2.5,0 5" fill="#f59e0b" />
                </marker>
              </defs>
            </g>
          )}

          {/* Step 5: libp2p suite */}
          {step === 5 && (
            <g>
              <text x={240} y={24} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ec4899">
                Noise_XX_25519_ChaChaPoly_SHA256
              </text>
              {[
                { label: 'XX', desc: '양방향 신원 교환 패턴', color: '#ec4899' },
                { label: '25519', desc: 'X25519 Diffie-Hellman 곡선', color: '#10b981' },
                { label: 'ChaChaPoly', desc: 'ChaCha20-Poly1305 AEAD 암호화', color: '#6366f1' },
                { label: 'SHA256', desc: '핸드셰이크 해시 함수', color: '#f59e0b' },
              ].map((c, i) => (
                <motion.g key={c.label} initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }}>
                  <rect x={50} y={50 + i * 36} width={380} height={28} rx={5}
                    fill={c.color + '0a'} stroke={c.color + '50'} strokeWidth={0.7} />
                  <text x={70} y={68 + i * 36} fontSize={10} fontWeight={700} fill={c.color}>{c.label}</text>
                  <text x={170} y={68 + i * 36} fontSize={9} fill="var(--foreground)">{c.desc}</text>
                </motion.g>
              ))}
              <text x={240} y={210} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                결과: 양방향 인증 + Forward Secrecy + 1.5 RTT (TLS 1.2 보다 빠름)
              </text>
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
