import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const STEPS = [
  { label: 'Goal: 단일 wake 에서 최대 진행' },
  { label: '1. Timeouts first' },
  { label: '2. Handler drives outbound' },
  { label: '3-4. Active negotiations' },
  { label: '5. Shutdown check' },
  { label: '6-8. Muxer events' },
  { label: '왜 loop + continue?' },
  { label: '왜 Handler → Muxer 순서?' },
];

const ORDER = [
  { y: 25, label: '1. check_timeouts()', color: '#ef4444' },
  { y: 50, label: '2. handler.poll(cx)', color: '#6366f1' },
  { y: 75, label: '3. progress_negotiating_out', color: '#f59e0b' },
  { y: 100, label: '4. progress_negotiating_in', color: '#f59e0b' },
  { y: 125, label: '5. shutdown_check (idle)', color: '#94a3b8' },
  { y: 150, label: '6. muxer.poll(cx)', color: '#10b981' },
  { y: 175, label: '7. muxer.poll_outbound(cx)', color: '#10b981' },
  { y: 200, label: '8. muxer.poll_inbound(cx)', color: '#10b981' },
];

export default function PollLoopDesignViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Highlight the relevant orders */}
          {step <= 5 && (
            <g>
              {ORDER.map((o, i) => {
                const idx = i + 1;
                const focus = step === 0
                  ? true
                  : step === 1 ? idx === 1
                  : step === 2 ? idx === 2
                  : step === 3 ? idx === 3 || idx === 4
                  : step === 4 ? idx === 5
                  : idx >= 6;
                return (
                  <motion.g key={o.y} initial={{ opacity: 0 }}
                    animate={{ opacity: focus ? 1 : 0.18 }} transition={{ duration: 0.3 }}>
                    <rect x={30} y={o.y} width={420} height={20} rx={3}
                      fill={o.color + '0a'} stroke={o.color + (focus ? '60' : '20')} strokeWidth={0.7} />
                    <text x={50} y={o.y + 14} fontSize={9.5} fontWeight={focus ? 700 : 500} fill={o.color}
                      style={{ fontFamily: 'monospace' }}>{o.label}</text>
                  </motion.g>
                );
              })}
            </g>
          )}

          {/* Step 6: why loop+continue */}
          {step === 6 && (
            <g>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                왜 loop + continue?
              </text>
              <ActionBox x={20} y={45} w={130} h={42} label="progress 1" sub="Handler 응답" color="#6366f1" />
              <motion.line initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 }}
                x1={150} y1={66} x2={180} y2={66} stroke="#94a3b8" strokeWidth={1.4} markerEnd="url(#par)" />
              <ActionBox x={180} y={45} w={130} h={42} label="trigger" sub="새 stream 요청" color="#f59e0b" />
              <motion.line initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.4 }}
                x1={310} y1={66} x2={340} y2={66} stroke="#94a3b8" strokeWidth={1.4} markerEnd="url(#par)" />
              <ActionBox x={340} y={45} w={120} h={42} label="muxer alloc" sub="단일 wake 처리" color="#10b981" />

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                <rect x={50} y={120} width={380} height={36} rx={6}
                  fill="#10b9810a" stroke="#10b981" strokeWidth={0.8} />
                <text x={240} y={138} textAnchor="middle" fontSize={10} fontWeight={700} fill="#10b981">
                  한 progress → 다음 progress 유발 가능
                </text>
                <text x={240} y={152} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                  continue → 우선순위 높은 단계 재실행, starvation 방지
                </text>
              </motion.g>
              <AlertBox x={50} y={170} w={380} h={42} label="Fair scheduling" sub="모든 단계 공평하게 진행 기회 확보" color="#ec4899" />
              <defs>
                <marker id="par" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
                  <polygon points="0 0,6 2.5,0 5" fill="#94a3b8" />
                </marker>
              </defs>
            </g>
          )}

          {/* Step 7: handler → muxer order */}
          {step === 7 && (
            <g>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                Handler → Muxer 순서가 중요한 이유
              </text>
              <ModuleBox x={30} y={50} w={130} h={50} label="Handler" sub="새 stream 필요?" color="#6366f1" />
              <motion.line initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 }}
                x1={160} y1={75} x2={310} y2={75} stroke="#94a3b8" strokeWidth={1.5} markerEnd="url(#por)" />
              <text x={235} y={68} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">결정</text>
              <ModuleBox x={310} y={50} w={140} h={50} label="Muxer" sub="실제 stream 할당" color="#10b981" />

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                <rect x={50} y={130} width={380} height={32} rx={5}
                  fill="#10b9810a" stroke="#10b981" strokeWidth={0.7} />
                <text x={240} y={150} textAnchor="middle" fontSize={9.5} fontWeight={700} fill="#10b981">
                  ✓ Handler 먼저 → 한 wake 에서 stream 할당까지
                </text>
              </motion.g>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
                <rect x={50} y={170} width={380} height={32} rx={5}
                  fill="#ef44440a" stroke="#ef4444" strokeWidth={0.7} strokeDasharray="3 2" />
                <text x={240} y={190} textAnchor="middle" fontSize={9.5} fontWeight={700} fill="#ef4444">
                  ✗ 반대 순서 → muxer 가 빈 할당, 다음 wake 까지 대기 (한 사이클 낭비)
                </text>
              </motion.g>
              <defs>
                <marker id="por" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
                  <polygon points="0 0,6 2.5,0 5" fill="#94a3b8" />
                </marker>
              </defs>
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
