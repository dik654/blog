import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, DataBox, StatusBox } from '@/components/viz/boxes';

const STEPS = [
  {
    label: 'SWIM 라운드 1: Direct Probe',
    body: '매 T초마다 랜덤 노드 M 선택 → ping 전송 (timeout T\').\n응답 있으면 alive.',
  },
  {
    label: 'SWIM 라운드 2: Indirect Probe',
    body: 'Timeout 시 K명에게 ping-req 위임. 한 명이라도 M에 도달하면 alive.\n로컬 단일 경로 실패를 false positive로 처리하지 않음.',
  },
  {
    label: 'SWIM 라운드 3: Suspect → Dead',
    body: 'Indirect 모두 실패 → suspect. Suspect timeout(T\'\') 후 dead 마킹.\n멤버십 변경은 일반 메시지에 piggyback.',
  },
  {
    label: 'SWIM 성능 프로필',
    body: '500 nodes + 10% churn에서 false positive 거의 0.\n탐지 시간 2-3초, 노드당 메시지 O(log N).',
  },
  {
    label: 'HyParView + PlumTree 결합',
    body: 'HyParView는 Active/Passive 이중 뷰로 멤버십, PlumTree는 spanning tree로 broadcast.\nScuttlebutt, Riak 등에서 활용.',
  },
];

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = {
  alive: '#22c55e',
  probe: '#0ea5e9',
  suspect: '#f59e0b',
  dead: '#ef4444',
  hp: '#10b981',
  pt: '#6366f1',
};

export default function SwimDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-3xl" style={{ height: 'auto' }}>
          {step <= 2 && (
            <>
              {/* Self node */}
              <circle cx={70} cy={120} r={20}
                fill={C.probe + '15'} stroke={C.probe} strokeWidth={1.5} />
              <text x={70} y={124} textAnchor="middle" fontSize={10} fontWeight={700}
                fill={C.probe}>self</text>
              <text x={70} y={150} textAnchor="middle" fontSize={8}
                fill="var(--muted-foreground)">prober</text>

              {/* K helper nodes */}
              {[0, 1, 2].map((i) => {
                const y = 60 + i * 60;
                const x = 230;
                const visible = step >= 1;
                return (
                  <motion.g key={`k-${i}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: visible ? 1 : 0 }} transition={sp}>
                    <circle cx={x} cy={y} r={14}
                      fill={C.probe + '10'} stroke={C.probe} strokeWidth={1} />
                    <text x={x} y={y + 4} textAnchor="middle" fontSize={9}
                      fontWeight={600} fill={C.probe}>K{i + 1}</text>
                  </motion.g>
                );
              })}

              {/* Target M */}
              <motion.g
                animate={{
                  scale: 1,
                }}
                transition={sp}>
                <circle cx={400} cy={120} r={22}
                  fill={
                    step === 0 ? '#64748b15' : step === 1 ? C.suspect + '20' : C.dead + '20'
                  }
                  stroke={step === 0 ? '#64748b' : step === 1 ? C.suspect : C.dead}
                  strokeWidth={1.5} />
                <text x={400} y={122} textAnchor="middle" fontSize={10}
                  fontWeight={700} fill={step === 0 ? '#64748b' : step === 1 ? C.suspect : C.dead}>
                  M
                </text>
                <text x={400} y={154} textAnchor="middle" fontSize={8}
                  fill="var(--muted-foreground)">
                  {step === 0 ? 'target' : step === 1 ? 'suspect' : 'dead'}
                </text>
              </motion.g>

              {/* Direct ping (always shown) */}
              <motion.line x1={92} y1={120} x2={378} y2={120}
                stroke={C.probe} strokeWidth={1.4}
                strokeDasharray={step === 0 ? '0' : '3 4'}
                strokeOpacity={step === 0 ? 0.9 : 0.3}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.5 }} />
              <text x={235} y={114} textAnchor="middle" fontSize={8}
                fill={C.probe} opacity={step === 0 ? 1 : 0.4}>ping (T')</text>
              {step === 0 && (
                <motion.circle cx={235} cy={120} r={4} fill={C.probe}
                  initial={{ cx: 92 }} animate={{ cx: 378 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} />
              )}
              {step >= 1 && (
                <text x={235} y={130} textAnchor="middle" fontSize={8}
                  fill={C.dead}>✗ timeout</text>
              )}

              {/* Indirect probes */}
              {step >= 1 &&
                [0, 1, 2].map((i) => {
                  const y = 60 + i * 60;
                  return (
                    <motion.g key={`ind-${i}`}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 + i * 0.05 }}>
                      <line x1={92} y1={120} x2={216} y2={y}
                        stroke={C.probe} strokeWidth={1} strokeOpacity={0.6} />
                      <line x1={244} y1={y} x2={378} y2={120}
                        stroke={step === 1 ? C.suspect : C.dead}
                        strokeWidth={1} strokeDasharray="3 3" strokeOpacity={0.5} />
                    </motion.g>
                  );
                })}
              {step === 1 && (
                <text x={150} y={84} fontSize={8} fill={C.probe}>ping-req → K</text>
              )}
              {step === 2 && (
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <text x={235} y={210} textAnchor="middle" fontSize={9}
                    fontWeight={600} fill={C.dead}>모두 실패 → suspect → dead</text>
                </motion.g>
              )}

              {/* State badge bottom-right */}
              <DataBox x={310} y={196} w={150} h={28}
                label={
                  step === 0 ? 'state: alive' : step === 1 ? 'state: suspect' : 'state: dead'
                }
                sub={step === 0 ? 'T\' 대기 중' : step === 1 ? 'indirect 진행' : 'piggyback 전파'}
                color={step === 0 ? C.alive : step === 1 ? C.suspect : C.dead}
                outlined />
            </>
          )}

          {step === 3 && (
            <>
              <text x={240} y={26} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">SWIM 성능 측정 (Gupta et al. 2002)</text>

              {/* 3 stats */}
              <StatusBox x={30} y={50} w={140} h={56}
                label="False Positive" sub="500 nodes / 10% churn"
                color={C.alive} progress={0.02} />
              <StatusBox x={180} y={50} w={140} h={56}
                label="Detection Time" sub="2 ~ 3 sec"
                color={C.probe} progress={0.6} />
              <StatusBox x={330} y={50} w={140} h={56}
                label="Msg overhead" sub="O(log N) / node"
                color={C.hp} progress={0.4} />

              {/* Adoption list */}
              <text x={30} y={140} fontSize={10} fontWeight={700}
                fill="var(--foreground)">실무 채택</text>
              {[
                { name: 'Consul', org: 'HashiCorp', c: C.probe },
                { name: 'Serf', org: 'HashiCorp', c: C.probe },
                { name: 'Cassandra', org: 'Apache', c: C.alive },
                { name: 'Docker Swarm', org: 'Docker', c: C.suspect },
              ].map((p, i) => (
                <motion.g key={p.name} initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.07 }}>
                  <DataBox x={30 + i * 110} y={155} w={100} h={56}
                    label={p.name} sub={p.org} color={p.c} outlined />
                </motion.g>
              ))}
              <text x={240} y={228} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">
                Heartbeat O(N) → Random Probe O(1)
              </text>
            </>
          )}

          {step === 4 && (
            <>
              <text x={240} y={26} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">HyParView (멤버십) + PlumTree (broadcast)</text>

              {/* HyParView side */}
              <ActionBox x={30} y={50} w={170} h={36}
                label="HyParView (2007)" sub="Hybrid Partial View" color={C.hp} />
              <DataBox x={30} y={96} w={80} h={28}
                label="Active" sub="TCP, small" color={C.hp} outlined />
              <DataBox x={120} y={96} w={80} h={28}
                label="Passive" sub="backup" color={C.hp} />
              <text x={115} y={144} textAnchor="middle" fontSize={8}
                fill="var(--muted-foreground)">Shuffle: 주기 교환</text>

              {/* Vertical separator */}
              <line x1={240} y1={50} x2={240} y2={228}
                stroke="var(--border)" strokeWidth={0.6} strokeDasharray="3 3" />

              {/* PlumTree side */}
              <ActionBox x={280} y={50} w={170} h={36}
                label="PlumTree (Leitao 2007)" sub="Push-Lazy-Push" color={C.pt} />
              <DataBox x={280} y={96} w={80} h={28}
                label="Eager" sub="tree, full msg" color={C.pt} outlined />
              <DataBox x={370} y={96} w={80} h={28}
                label="Lazy" sub="IHAVE only" color={C.pt} />
              <text x={365} y={144} textAnchor="middle" fontSize={8}
                fill="var(--muted-foreground)">tree repair on miss</text>

              {/* Combined output */}
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}>
                <line x1={115} y1={158} x2={115} y2={178}
                  stroke={C.hp} strokeWidth={1} strokeDasharray="2 2" />
                <line x1={365} y1={158} x2={365} y2={178}
                  stroke={C.pt} strokeWidth={1} strokeDasharray="2 2" />
                <line x1={115} y1={178} x2={365} y2={178}
                  stroke="var(--muted-foreground)" strokeWidth={0.7} opacity={0.6} />
                <DataBox x={150} y={184} w={180} h={36}
                  label="HyParView + PlumTree" sub="Scuttlebutt · Riak" color="#a855f7" outlined />
              </motion.g>
            </>
          )}
        </svg>
      )}
    </StepViz>
  );
}
