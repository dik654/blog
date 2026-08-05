import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, StatusBox } from '@/components/viz/boxes';

const DEF = '#10b981';
const SOFT = '#6366f1';
const WARN = '#f59e0b';

const STEPS = [
  { label: 'IP Quota — 서브넷 한도', body: '같은 /24에서 bucket당 2개, table 전체 10개. 단일 ISP/데이터센터 점유를 차단.' },
  { label: 'Revalidation — 죽은 노드 제거', body: '주기적 PING으로 health check. 응답 없으면 빠르게 evict — 공격 노드 잔존 시간 단축.' },
  { label: 'Bucket Filling — 다중 검증', body: '신규 노드 추가 시 IP 한도, 시그니처, blacklist를 동시 검증. 통과해야 슬롯 진입.' },
  { label: 'Endpoint Proof — PING-PONG', body: 'FINDNODE 이전에 PING-PONG 왕복 증명. UDP 응답 가능 = 주소 위조 차단.' },
  { label: 'Bucket Refresh — 다양성 유지', body: '버킷마다 1시간 주기로 random ID lookup. 정체된 슬롯을 강제로 갱신.' },
  { label: 'Defense in Depth', body: '5개 layer가 겹쳐 동작. 한 layer만 깨도 attack 비용/시간이 비대칭으로 증가.' },
];

const LAYERS = [
  { key: 'ip', label: 'IP Quota', sub: '/24: bucket 2 · table 10', color: DEF },
  { key: 'rev', label: 'Revalidation', sub: '주기 PING + evict', color: DEF },
  { key: 'fill', label: 'Bucket Filling', sub: 'multi-check 통과', color: DEF },
  { key: 'proof', label: 'Endpoint Proof', sub: 'PING-PONG 왕복', color: DEF },
  { key: 'ref', label: 'Bucket Refresh', sub: '1h 주기 random lookup', color: DEF },
];

export default function EthDefenseViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 230" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Top: Attacker */}
          <ModuleBox x={20} y={18} w={100} h={32} label="Attacker" sub="Sybils / Eclipse 시도" color={WARN} />

          {/* Right: Routing Table */}
          <ModuleBox x={360} y={18} w={100} h={32} label="Routing Table" sub="k-buckets" color={SOFT} />

          {/* Defense layers vertical */}
          {LAYERS.map((l, i) => {
            const y = 70 + i * 28;
            const active = step === i;
            const passed = step > i;
            const fill = active ? 1 : passed ? 1 : 0.3;
            return (
              <motion.g key={l.key}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}>
                <ActionBox x={130} y={y} w={220} h={22}
                  label={l.label} sub={l.sub} color={l.color} />
                {/* Stop indicator on left */}
                <motion.circle
                  cx={120} cy={y + 11} r={4}
                  fill={active ? '#ef4444' : passed ? DEF : 'var(--border)'}
                  animate={{ opacity: fill }}
                  transition={{ duration: 0.3 }} />
                {/* Arrow line from attacker through layer */}
                <motion.line
                  x1={120} y1={y + 11} x2={130} y2={y + 11}
                  stroke={active ? '#ef4444' : 'var(--border)'} strokeWidth={1} />
              </motion.g>
            );
          })}

          {/* Right-side progress (step 5) */}
          {step >= 5 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <StatusBox x={355} y={170} w={110} h={42}
                label="Defense in Depth" sub="multi-layer" color={DEF} progress={1} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
