import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, AlertBox, DataBox } from '@/components/viz/boxes';

const ATK = '#ef4444';
const TARGET = '#f59e0b';
const SOFT = '#6366f1';

const STEPS = [
  { label: 'Sybil Attack', body: '한 공격자가 수천~수만 개의 가짜 노드 ID를 생성. 라우팅 테이블 점유율로 네트워크 의사결정을 흔든다.' },
  { label: 'Eclipse Attack', body: '특정 victim의 모든 peer 슬롯을 공격자 노드로 대체. victim은 네트워크 전체를 공격자만 통해 본다.' },
  { label: 'Routing Table Poisoning', body: 'k-bucket에 가짜 노드 주입. 점진적으로 정직 노드를 밀어낸다 — slow eclipse.' },
  { label: 'ID Grinding', body: '특정 target ID와 가까운 node ID를 brute-force로 생성. eclipse pre-positioning 단계.' },
  { label: 'DoS / Amplification', body: 'FINDNODE flood, packet amplification (discv4 취약). 자원 고갈로 정상 동작 차단.' },
  { label: 'Message Manipulation', body: '응답에 거짓 노드 정보를 섞거나 메시지를 forward하지 않음. routing 무결성 파괴.' },
];

const ATTACKS: Array<{ key: string; label: string; sub: string; target: string }> = [
  { key: 'sybil', label: 'Sybil', sub: '다수 가짜 ID', target: '전체 테이블' },
  { key: 'eclipse', label: 'Eclipse', sub: 'victim 격리', target: '단일 victim' },
  { key: 'poison', label: 'Poisoning', sub: 'k-bucket 주입', target: 'routing table' },
  { key: 'grind', label: 'ID Grind', sub: 'ID brute-force', target: 'pre-eclipse' },
  { key: 'dos', label: 'DoS', sub: 'flood / amplify', target: '대역폭 / CPU' },
  { key: 'msg', label: 'Msg Manip.', sub: '거짓 routing 응답', target: 'lookup 무결성' },
];

export default function AttackLandscapeViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Center: DHT Network */}
          <ModuleBox x={195} y={92} w={90} h={36} label="DHT Network" sub="discv4 / Kademlia" color={SOFT} />

          {/* 6 attacks arranged around center */}
          {ATTACKS.map((a, i) => {
            const cols = 3;
            const col = i % cols;
            const row = Math.floor(i / cols);
            const x = 30 + col * 145;
            const y = row === 0 ? 18 : 162;
            const active = step === i;
            const dimmed = step !== i && step >= 0;
            return (
              <motion.g key={a.key}
                initial={{ opacity: 0, y: row === 0 ? -6 : 6 }}
                animate={{ opacity: dimmed ? 0.3 : 1, y: 0 }}
                transition={{ delay: i * 0.04 }}>
                <AlertBox x={x} y={y} w={120} h={40}
                  label={a.label} sub={a.sub} color={ATK} />
                {active && (
                  <motion.line
                    x1={x + 60} y1={row === 0 ? y + 40 : y}
                    x2={240} y2={row === 0 ? 92 : 128}
                    stroke={ATK} strokeWidth={1.2} strokeDasharray="3 2"
                    initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} />
                )}
                {active && (
                  <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <DataBox
                      x={x + 10} y={row === 0 ? y + 46 : y - 26}
                      w={100} h={20}
                      label={a.target} color={TARGET} outlined />
                  </motion.g>
                )}
              </motion.g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
