import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const STEPS = [
  { label: '3단계 NAT Traversal 전략' },
  { label: 'Stage 1: AutoNAT — 자가 진단' },
  { label: 'Stage 2: Circuit Relay v2 — 중계' },
  { label: 'Stage 3: DCUtR — 직접 업그레이드' },
  { label: 'NAT 타입별 성공률' },
];

const NAT_RATES = [
  { name: 'Cone NAT', rate: '90%+', color: '#10b981', w: 360 * 0.9 },
  { name: 'Port-restricted', rate: '70%+', color: '#f59e0b', w: 360 * 0.7 },
  { name: 'Symmetric', rate: '10-20%', color: '#ef4444', w: 360 * 0.15 },
];

export default function NatStrategyViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: Pipeline overview */}
          {step === 0 && (
            <g>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                NAT Traversal Pipeline
              </text>
              {[
                { x: 30, label: 'AutoNAT', sub: 'NAT 탐지', color: '#6366f1' },
                { x: 180, label: 'Relay v2', sub: '중계 fallback', color: '#f59e0b' },
                { x: 330, label: 'DCUtR', sub: '직접 업그레이드', color: '#10b981' },
              ].map((s, i) => (
                <motion.g key={s.label} initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}>
                  <ModuleBox x={s.x} y={70} w={120} h={50} label={s.label} sub={s.sub} color={s.color} />
                  {i < 2 && (
                    <line x1={s.x + 120} y1={95} x2={s.x + 150} y2={95}
                      stroke="#94a3b8" strokeWidth={1.4} markerEnd="url(#nrr)" />
                  )}
                </motion.g>
              ))}
              <text x={240} y={170} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
                Detect → Fallback → Upgrade
              </text>
              <text x={240} y={188} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                실패 시 Relay 유지 (낮은 QoS 로 동작)
              </text>
              <defs>
                <marker id="nrr" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
                  <polygon points="0 0,6 2.5,0 5" fill="#94a3b8" />
                </marker>
              </defs>
            </g>
          )}

          {/* Step 1: AutoNAT */}
          {step === 1 && (
            <g>
              <ModuleBox x={30} y={50} w={120} h={45} label="Local Peer" sub="자가 진단 시작" color="#6366f1" />
              <ActionBox x={180} y={50} w={120} h={45} label="Dial 요청" sub="다른 peer 에게" color="#f59e0b" />
              <ModuleBox x={330} y={50} w={120} h={45} label="Remote Peer" sub="observed addr 회신" color="#10b981" />

              {[
                { y: 130, label: 'Public', desc: '직접 접근 가능', color: '#10b981' },
                { y: 165, label: 'Private', desc: 'NAT/firewall 뒤', color: '#f59e0b' },
                { y: 200, label: 'Unknown', desc: '불확실 (재시도)', color: '#94a3b8' },
              ].map((s, i) => (
                <motion.g key={s.label} initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }}>
                  <rect x={60} y={s.y} width={360} height={26} rx={5}
                    fill={s.color + '0a'} stroke={s.color + '50'} strokeWidth={0.7} />
                  <text x={75} y={s.y + 16} fontSize={10} fontWeight={700} fill={s.color}>{s.label}</text>
                  <text x={170} y={s.y + 16} fontSize={9} fill="var(--muted-foreground)">{s.desc}</text>
                </motion.g>
              ))}
            </g>
          )}

          {/* Step 2: Relay */}
          {step === 2 && (
            <g>
              <ModuleBox x={20} y={70} w={100} h={50} label="Peer A" sub="NAT 뒤" color="#6366f1" />
              <ModuleBox x={190} y={50} w={100} h={50} label="Relay R" sub="public node" color="#f59e0b" />
              <ModuleBox x={360} y={70} w={100} h={50} label="Peer B" sub="NAT 뒤" color="#10b981" />

              <motion.line initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 }}
                x1={120} y1={95} x2={190} y2={75} stroke="#f59e0b" strokeWidth={1.6} markerEnd="url(#rar)" />
              <motion.line initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.4 }}
                x1={290} y1={75} x2={360} y2={95} stroke="#f59e0b" strokeWidth={1.6} markerEnd="url(#rar)" />

              <text x={240} y={150} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                /libp2p/circuit/relay/0.2.0/hop · /stop
              </text>

              {[
                { x: 20, label: '128 reservations', color: '#6366f1' },
                { x: 130, label: '120s TTL', color: '#10b981' },
                { x: 215, label: '128 KiB/s', color: '#f59e0b' },
                { x: 305, label: '2 MiB/conn', color: '#ec4899' },
              ].map((c) => (
                <g key={c.label}>
                  <rect x={c.x + 10} y={185} width={100} height={22} rx={4}
                    fill={c.color + '0a'} stroke={c.color + '50'} strokeWidth={0.7} />
                  <text x={c.x + 60} y={200} textAnchor="middle" fontSize={9}
                    fontWeight={600} fill={c.color}>{c.label}</text>
                </g>
              ))}
              <defs>
                <marker id="rar" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
                  <polygon points="0 0,6 2.5,0 5" fill="#f59e0b" />
                </marker>
              </defs>
            </g>
          )}

          {/* Step 3: DCUtR */}
          {step === 3 && (
            <g>
              <ModuleBox x={20} y={70} w={100} h={50} label="Peer A" color="#6366f1" />
              <ModuleBox x={360} y={70} w={100} h={50} label="Peer B" color="#10b981" />

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                <line x1={120} y1={85} x2={360} y2={85} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 2" />
                <text x={240} y={80} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">via R: CONNECT (candidates 교환)</text>
              </motion.g>

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                <line x1={120} y1={108} x2={360} y2={108} stroke="#10b981" strokeWidth={1.8} markerEnd="url(#dar)" />
                <line x1={360} y1={120} x2={120} y2={120} stroke="#10b981" strokeWidth={1.8} markerEnd="url(#dar)" />
                <text x={240} y={140} textAnchor="middle" fontSize={9} fontWeight={600} fill="#10b981">
                  Simultaneous Dial (NAT 홀 생성)
                </text>
              </motion.g>

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                <rect x={100} y={170} width={280} height={42} rx={6}
                  fill="#10b9810a" stroke="#10b981" strokeWidth={0.8} />
                <text x={240} y={188} textAnchor="middle" fontSize={10} fontWeight={700} fill="#10b981">
                  Direct Connection 수립
                </text>
                <text x={240} y={203} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                  지연: ~100ms (Relay) → &lt;10ms (Direct)
                </text>
              </motion.g>

              <defs>
                <marker id="dar" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
                  <polygon points="0 0,6 2.5,0 5" fill="#10b981" />
                </marker>
              </defs>
            </g>
          )}

          {/* Step 4: Success rates */}
          {step === 4 && (
            <g>
              <text x={240} y={22} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                NAT 타입별 Hole Punching 성공률
              </text>
              {NAT_RATES.map((r, i) => (
                <motion.g key={r.name} initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }} transition={{ delay: i * 0.18, duration: 0.5 }}
                  style={{ transformOrigin: 'left center' }}>
                  <text x={50} y={66 + i * 50} fontSize={10} fontWeight={600} fill={r.color}>
                    {r.name}
                  </text>
                  <rect x={50} y={72 + i * 50} width={360} height={14} rx={3}
                    fill="var(--border)" opacity={0.3} />
                  <rect x={50} y={72 + i * 50} width={r.w} height={14} rx={3} fill={r.color} opacity={0.8} />
                  <text x={420} y={84 + i * 50} fontSize={10} fontWeight={700} fill={r.color}>{r.rate}</text>
                </motion.g>
              ))}
              <AlertBox x={60} y={205} w={360} h={28} label="Symmetric NAT" sub="Relay 유지 필수 — QUIC over UDP 유리" color="#ef4444" />
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
