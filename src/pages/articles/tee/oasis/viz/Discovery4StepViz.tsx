import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, DataBox } from '@/components/viz/boxes';

const STEPS = [
  { label: '1. Bootstrap nodes (seed)', body: '/dnsaddr/bootstrap.oasis.dev/p2p/12D3Koo... 등 하드코딩.\n네트워크 진입점, 첫 peer 풀 확보용.' },
  { label: '2. Registry-based discovery', body: 'Consensus 의 Registry 에 등록된 노드 리스트 사용.\nrole=runtimeID 필터로 관련 peer 만 연결.' },
  { label: '3. Kademlia DHT', body: 'libp2p-kad-dht 로 peer 주소 분산 저장.\nFindPeer(targetID) 로 multiaddr 조회.' },
  { label: '4. Peer Exchange (GossipSub)', body: 'Mesh 안 peer 들이 서로 다른 peer 정보 교환.\nPeer Scoring 으로 nefarious peer 차단.' },
];

const STAGES = [
  { name: 'Bootstrap',  sub: 'DNS seed',     color: '#6366f1', y: 50  },
  { name: 'Registry',   sub: 'on-chain',     color: '#10b981', y: 95  },
  { name: 'Kad DHT',    sub: 'distributed',  color: '#f59e0b', y: 140 },
  { name: 'PeerExch',   sub: 'gossipsub',    color: '#a855f7', y: 185 },
];

export default function Discovery4StepViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Local node */}
          <ModuleBox x={20} y={110} w={120} h={50}
            label="Local node" sub="bootstrapping" color="#3b82f6" />

          {STAGES.map((s, i) => {
            const active = step === i;
            const done = step > i;
            return (
              <g key={s.name}>
                <motion.g animate={{ opacity: active ? 1 : done ? 0.65 : 0.3 }}>
                  <ActionBox x={180} y={s.y} w={130} h={32}
                    label={s.name} sub={s.sub} color={s.color} />
                </motion.g>
                {/* arrow from local */}
                <motion.line x1={140} y1={135} x2={180} y2={s.y + 16}
                  stroke={done || active ? s.color : 'var(--border)'} strokeWidth={1.2}
                  strokeDasharray={done || active ? '0' : '3,3'}
                  initial={{ pathLength: 0 }} animate={{ pathLength: done || active ? 1 : 0 }} />

                {/* result */}
                {(active || done) && (
                  <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <DataBox x={330} y={s.y + 5} w={130} h={22}
                      label={
                        i === 0 ? '+ seed peers'
                        : i === 1 ? '+ runtime peers'
                        : i === 2 ? '+ random peers'
                        : '+ mesh peers'
                      }
                      color={s.color} outlined={active} />
                  </motion.g>
                )}
              </g>
            );
          })}

          {/* peer pool indicator */}
          <text x={395} y={20} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
            peer pool 누적
          </text>
          <motion.rect x={345} y={28} width={100} height={14} rx={3}
            fill="var(--border)" opacity={0.3} />
          <motion.rect x={345} y={28} width={(step + 1) * 25} height={14} rx={3}
            fill="#10b981"
            animate={{ width: (step + 1) * 25 }}
            transition={{ duration: 0.4 }} />
        </svg>
      )}
    </StepViz>
  );
}
