import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';

const STEPS = [
  { label: 'PeerId = hash(libp2p pubkey)' },
  { label: '1) Noise static keypair 생성 (X25519)' },
  { label: '2) libp2p key로 Noise pubkey 서명' },
  { label: '3) Handshake에 서명 + libp2p pubkey 첨부' },
  { label: '검증: peer_id 매칭 + 서명 검증' },
  { label: '왜? 장기 신원과 세션 키 분리 = 유연성' },
];

export default function PeerIdBindingViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: PeerId = hash */}
          {step === 0 && (
            <g>
              <DataBox x={50} y={60} w={140} h={50} label="libp2p pubkey" sub="Ed25519 / RSA / Secp256k1" color="#6366f1" outlined />
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                <line x1={195} y1={85} x2={290} y2={85} stroke="#94a3b8" strokeWidth={1.4} markerEnd="url(#arr0)" />
                <text x={240} y={78} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">multihash</text>
              </motion.g>
              <DataBox x={295} y={60} w={140} h={50} label="PeerId" sub="self-sovereign identity" color="#ec4899" outlined />
              <text x={240} y={150} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">
                PeerId 는 곧 신원 — 중앙 CA 불필요
              </text>
              <text x={240} y={170} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                다중 키 타입을 멀티해시로 통일 인코딩
              </text>
              <defs>
                <marker id="arr0" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
                  <polygon points="0 0,6 2.5,0 5" fill="#94a3b8" />
                </marker>
              </defs>
            </g>
          )}

          {/* Steps 1-3: Handshake construction */}
          {step >= 1 && step <= 3 && (
            <g>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                Noise Handshake Payload 구성
              </text>

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: step >= 1 ? 1 : 0.2 }}>
                <ActionBox x={30} y={50} w={130} h={42} label="Noise static" sub="X25519 keypair 생성" color="#10b981" />
              </motion.g>

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: step >= 2 ? 1 : 0.2 }}>
                <line x1={160} y1={71} x2={200} y2={71} stroke="#94a3b8" strokeWidth={1.2} markerEnd="url(#arr1)" />
                <ActionBox x={200} y={50} w={130} h={42} label="Sign(noise_pub)" sub="libp2p key로 서명" color="#6366f1" />
              </motion.g>

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: step >= 3 ? 1 : 0.2 }}>
                <line x1={330} y1={71} x2={350} y2={71} stroke="#94a3b8" strokeWidth={1.2} markerEnd="url(#arr1)" />
                <ActionBox x={350} y={50} w={100} h={42} label="Payload" sub="signed identity" color="#ec4899" />
              </motion.g>

              {/* Payload box */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: step >= 3 ? 1 : 0.15 }}>
                <rect x={70} y={120} width={340} height={90} rx={8}
                  fill="#ec489908" stroke="#ec4899" strokeWidth={0.8} strokeDasharray="3 2" />
                <text x={240} y={138} textAnchor="middle" fontSize={10} fontWeight={700} fill="#ec4899">
                  Handshake Payload
                </text>
                <text x={90} y={158} fontSize={9} fill="var(--foreground)">• signature (libp2p key signed noise pubkey)</text>
                <text x={90} y={174} fontSize={9} fill="var(--foreground)">• libp2p_pubkey (long-term identity)</text>
                <text x={90} y={190} fontSize={9} fill="var(--foreground)">• noise_static_pubkey (session)</text>
              </motion.g>

              <defs>
                <marker id="arr1" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
                  <polygon points="0 0,6 2.5,0 5" fill="#94a3b8" />
                </marker>
              </defs>
            </g>
          )}

          {/* Step 4: Verification */}
          {step === 4 && (
            <g>
              <ModuleBox x={30} y={30} w={140} h={50} label="Receiver" sub="payload 수신" color="#6366f1" />
              {[
                { y: 100, label: 'extract libp2p_pubkey', color: '#10b981' },
                { y: 130, label: 'compute peer_id = hash(pubkey)', color: '#6366f1' },
                { y: 160, label: 'verify signature on noise_pub', color: '#f59e0b' },
                { y: 190, label: '✓ peer_id authenticated', color: '#ec4899' },
              ].map((s, i) => (
                <motion.g key={s.y} initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }}>
                  <rect x={200} y={s.y} width={250} height={22} rx={4}
                    fill={s.color + '0a'} stroke={s.color + '50'} strokeWidth={0.7} />
                  <text x={215} y={s.y + 14} fontSize={9} fontWeight={600} fill={s.color}>{s.label}</text>
                </motion.g>
              ))}
            </g>
          )}

          {/* Step 5: Why design */}
          {step === 5 && (
            <g>
              <text x={240} y={22} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                키 분리 설계의 이점
              </text>
              {[
                { label: '장기 신원 = libp2p key', desc: '여러 세션을 가로질러 유지', color: '#ec4899' },
                { label: '세션 키 = Noise key', desc: '핸드셰이크마다 새로 생성', color: '#10b981' },
                { label: 'Forward Secrecy', desc: '세션 키 노출되어도 과거 세션 안전', color: '#6366f1' },
                { label: '암호 업그레이드', desc: '신원 유지하며 Noise 알고리즘 교체', color: '#f59e0b' },
              ].map((c, i) => (
                <motion.g key={c.label} initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                  <rect x={40} y={50 + i * 42} width={400} height={34} rx={5}
                    fill={c.color + '0a'} stroke={c.color + '50'} strokeWidth={0.7} />
                  <text x={56} y={66 + i * 42} fontSize={10} fontWeight={700} fill={c.color}>{c.label}</text>
                  <text x={56} y={78 + i * 42} fontSize={8.5} fill="var(--muted-foreground)">{c.desc}</text>
                </motion.g>
              ))}
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
