import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox } from '@/components/viz/boxes';

const STEPS = [
  { label: 'multistream-select 핸드셰이크' },
  { label: 'Step 1: /multistream/1.0.0 합의' },
  { label: 'Step 2: 선호 프로토콜 제안' },
  { label: 'Step 3: 미지원 시 fallback' },
  { label: '장단점 + Protocol Select 개선' },
];

export default function MultistreamSelectViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Always show endpoints */}
          <ModuleBox x={20} y={30} w={120} h={36} label="Initiator" color="#10b981" />
          <ModuleBox x={340} y={30} w={120} h={36} label="Responder" color="#6366f1" />

          {/* Step 0: full handshake summary */}
          {step === 0 && (
            <g>
              {[
                { y: 95, dir: 1, label: '/multistream/1.0.0', color: '#10b981' },
                { y: 120, dir: -1, label: '/multistream/1.0.0 OK', color: '#6366f1' },
                { y: 155, dir: 1, label: '/noise/0.1.0', color: '#10b981' },
                { y: 180, dir: -1, label: '/noise/0.1.0 OK', color: '#6366f1' },
              ].map((m, i) => (
                <motion.g key={m.y} initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }} transition={{ delay: i * 0.15 }}>
                  <line x1={m.dir > 0 ? 140 : 340} y1={m.y}
                    x2={m.dir > 0 ? 340 : 140} y2={m.y}
                    stroke={m.color} strokeWidth={1.4} markerEnd={m.dir > 0 ? 'url(#mr)' : 'url(#ml)'} />
                  <text x={240} y={m.y - 4} textAnchor="middle" fontSize={9}
                    fontWeight={600} fill={m.color}>{m.label}</text>
                </motion.g>
              ))}
              <text x={240} y={220} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                LP-encoded 프로토콜 이름을 inline 협상
              </text>
            </g>
          )}

          {/* Step 1: ms version exchange */}
          {step === 1 && (
            <g>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <line x1={140} y1={95} x2={340} y2={95}
                  stroke="#10b981" strokeWidth={1.6} markerEnd="url(#mr)" />
                <text x={240} y={88} textAnchor="middle" fontSize={10} fontWeight={700} fill="#10b981">
                  → "/multistream/1.0.0"
                </text>
              </motion.g>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                <line x1={340} y1={130} x2={140} y2={130}
                  stroke="#6366f1" strokeWidth={1.6} markerEnd="url(#ml)" />
                <text x={240} y={123} textAnchor="middle" fontSize={10} fontWeight={700} fill="#6366f1">
                  ← "/multistream/1.0.0" (OK)
                </text>
              </motion.g>
              <text x={240} y={195} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                양측이 multistream 버전 1.0.0 합의
              </text>
            </g>
          )}

          {/* Step 2: propose protocol */}
          {step === 2 && (
            <g>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <line x1={140} y1={95} x2={340} y2={95}
                  stroke="#10b981" strokeWidth={1.6} markerEnd="url(#mr)" />
                <text x={240} y={88} textAnchor="middle" fontSize={10} fontWeight={700} fill="#10b981">
                  → "/noise/0.1.0"
                </text>
              </motion.g>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                <line x1={340} y1={130} x2={140} y2={130}
                  stroke="#10b981" strokeWidth={1.6} markerEnd="url(#ml)" />
                <text x={240} y={123} textAnchor="middle" fontSize={10} fontWeight={700} fill="#10b981">
                  ← "/noise/0.1.0" (OK)
                </text>
              </motion.g>
              <text x={240} y={195} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                Initiator 가 가장 선호하는 프로토콜 1개부터 제안 (lazy)
              </text>
            </g>
          )}

          {/* Step 3: na fallback */}
          {step === 3 && (
            <g>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <line x1={140} y1={95} x2={340} y2={95}
                  stroke="#10b981" strokeWidth={1.6} markerEnd="url(#mr)" />
                <text x={240} y={88} textAnchor="middle" fontSize={10} fontWeight={700} fill="#10b981">
                  → "/noise/0.1.0"
                </text>
              </motion.g>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <line x1={340} y1={120} x2={140} y2={120}
                  stroke="#ef4444" strokeWidth={1.6} markerEnd="url(#me)" />
                <text x={240} y={113} textAnchor="middle" fontSize={10} fontWeight={700} fill="#ef4444">
                  ← "na" (not available)
                </text>
              </motion.g>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                <line x1={140} y1={155} x2={340} y2={155}
                  stroke="#f59e0b" strokeWidth={1.6} markerEnd="url(#mr)" />
                <text x={240} y={148} textAnchor="middle" fontSize={10} fontWeight={700} fill="#f59e0b">
                  → "/plaintext/2.0.0" (재시도)
                </text>
              </motion.g>
              <text x={240} y={210} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                각 시도 = 1 RTT 추가 — 흐름은 단순하지만 RTT 오버헤드
              </text>
            </g>
          )}

          {/* Step 4: pros/cons */}
          {step === 4 && (
            <g>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                Multistream-Select 평가
              </text>
              {[
                { y: 50, label: '✓ Inline 협상', desc: '연결 stream 위에서 즉시', color: '#10b981' },
                { y: 80, label: '✓ Forward-compatible', desc: '새 프로토콜 추가 자유', color: '#10b981' },
                { y: 110, label: '✗ RTT 오버헤드', desc: '프로토콜당 1 RTT', color: '#ef4444' },
                { y: 140, label: '✗ String 파싱', desc: 'LP-encoded 텍스트', color: '#ef4444' },
                { y: 175, label: '→ Protocol Select (2022)', desc: 'Combined 협상으로 단일 RTT, ms-select fallback', color: '#6366f1' },
              ].map((s, i) => (
                <motion.g key={s.y} initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                  <rect x={40} y={s.y} width={400} height={26} rx={4}
                    fill={s.color + '0a'} stroke={s.color + '50'} strokeWidth={0.7} />
                  <text x={56} y={s.y + 16} fontSize={9.5} fontWeight={700} fill={s.color}>{s.label}</text>
                  <text x={180} y={s.y + 16} fontSize={8.5} fill="var(--muted-foreground)">{s.desc}</text>
                </motion.g>
              ))}
            </g>
          )}

          <defs>
            <marker id="mr" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
              <polygon points="0 0,6 2.5,0 5" fill="#10b981" />
            </marker>
            <marker id="ml" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
              <polygon points="0 0,6 2.5,0 5" fill="#6366f1" />
            </marker>
            <marker id="me" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
              <polygon points="0 0,6 2.5,0 5" fill="#ef4444" />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
