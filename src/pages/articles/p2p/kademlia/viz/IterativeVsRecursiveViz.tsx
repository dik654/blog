import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, AlertBox, DataBox, StatusBox } from '@/components/viz/boxes';

const C = {
  iter: '#10b981',
  rec: '#f59e0b',
  warn: '#ef4444',
  ok: '#22c55e',
  info: '#6366f1',
};

const STEPS = [
  {
    label: 'Iterative — querier가 모든 hop 직접 관리',
    body: 'A → B → A → C → A → D 패턴. 각 hop마다 RTT가 발생하지만 모든 응답이 querier로 돌아온다.',
  },
  {
    label: 'Recursive — 노드 간 query 전달',
    body: 'A → B → C → D → A 패턴. forwarding으로 hop 수는 적지만 NAT/장애에 약하다.',
  },
  {
    label: '왜 Kademlia는 Iterative를 선택했나',
    body: 'NAT 뒤 노드 지원, 병렬 조회 단순화, 명확한 failure handling — robustness 우선.',
  },
  {
    label: '수렴 조건 3가지',
    body: '① 더 가까운 노드 없음, ② 상위 k개 모두 응답, ③ Maximum iterations (safety net).',
  },
  {
    label: 'Latency 계산',
    body: '각 iteration ≈ 100~500ms RTT. log N rounds. N=10^6 → ~20 iter → 일반적으로 2~10초.',
  },
];

export default function IterativeVsRecursiveViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="ivrarr" markerWidth="6" markerHeight="6" refX="5.5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="#94a3b8" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700}
                fill={C.iter}>Iterative — Kademlia 방식</text>

              {/* Querier A */}
              <circle cx={240} cy={120} r={26} fill={C.iter + '20'} stroke={C.iter} strokeWidth={1.6} />
              <text x={240} y={117} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.iter}>A</text>
              <text x={240} y={130} textAnchor="middle" fontSize={8} fill={C.iter}>querier</text>

              {/* B, C, D peers */}
              {[
                { name: 'B', x: 70, y: 60 },
                { name: 'C', x: 410, y: 60 },
                { name: 'D', x: 70, y: 200 },
              ].map((n, i) => (
                <g key={i}>
                  <circle cx={n.x} cy={n.y} r={20} fill={C.iter + '15'} stroke={C.iter} strokeWidth={1.2} />
                  <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.iter}>{n.name}</text>
                </g>
              ))}

              {/* Three round-trips A↔B, A↔C, A↔D animated sequentially */}
              {[
                { x1: 218, y1: 110, x2: 90, y2: 70, label: '① FIND', mid: { x: 145, y: 78 } },
                { x1: 262, y1: 110, x2: 390, y2: 70, label: '② FIND', mid: { x: 335, y: 78 } },
                { x1: 218, y1: 130, x2: 90, y2: 192, label: '③ FIND', mid: { x: 145, y: 168 } },
              ].map((p, i) => (
                <motion.g key={i}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.4 }}>
                  <line x1={p.x1} y1={p.y1} x2={p.x2} y2={p.y2}
                    stroke={C.iter} strokeWidth={1.4} markerEnd="url(#ivrarr)" />
                  <line x1={p.x2 + 4} y1={p.y2 + 8} x2={p.x1 - 6} y2={p.y1 + 8}
                    stroke={C.iter} strokeWidth={1.2} strokeDasharray="4 3" markerEnd="url(#ivrarr)" />
                  <text x={p.mid.x} y={p.mid.y} textAnchor="middle" fontSize={9}
                    fontWeight={600} fill={C.iter}>{p.label}</text>
                </motion.g>
              ))}
              <text x={240} y={228} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">A가 B, C, D 각각 round-trip — 모든 응답이 A로 수렴</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700}
                fill={C.rec}>Recursive — Chord 방식</text>

              {/* Linear chain A → B → C → D */}
              {[
                { name: 'A', x: 60 },
                { name: 'B', x: 175 },
                { name: 'C', x: 290 },
                { name: 'D', x: 405 },
              ].map((n, i) => (
                <g key={i}>
                  <circle cx={n.x} cy={120} r={22} fill={C.rec + '20'} stroke={C.rec} strokeWidth={1.4} />
                  <text x={n.x} y={124} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.rec}>{n.name}</text>
                </g>
              ))}

              {/* forward arrows */}
              {[0, 1, 2].map((i) => (
                <motion.g key={i}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.3 }}>
                  <line x1={82 + i * 115} y1={115} x2={153 + i * 115} y2={115}
                    stroke={C.rec} strokeWidth={1.4} markerEnd="url(#ivrarr)" />
                  <text x={117 + i * 115} y={107} textAnchor="middle" fontSize={9}
                    fontWeight={600} fill={C.rec}>FIND</text>
                </motion.g>
              ))}

              {/* Direct return from D to A */}
              <motion.path
                d="M 405 142 Q 240 200 60 142"
                fill="none" stroke={C.rec} strokeWidth={1.4} strokeDasharray="5 3"
                markerEnd="url(#ivrarr)"
                initial={{ opacity: 0, pathLength: 0 }} animate={{ opacity: 0.85, pathLength: 1 }}
                transition={{ delay: 1.2, duration: 0.6 }} />
              <motion.text x={240} y={195} textAnchor="middle" fontSize={9}
                fontWeight={600} fill={C.rec}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}>
                D → A 직접 응답 (forwarding 결과)
              </motion.text>
              <text x={240} y={228} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">전체 hop 수는 적지만 중간 노드 장애에 취약</text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">Kademlia가 Iterative를 선택한 3가지 이유</text>

              {/* Three reason boxes */}
              <ActionBox x={30} y={42} w={140} h={48}
                label="NAT 친화적" sub="P2P에 흔한 환경" color={C.iter} />
              <ActionBox x={180} y={42} w={140} h={48}
                label="병렬 조회 단순" sub="α=3 동시 RPC" color={C.iter} />
              <ActionBox x={330} y={42} w={140} h={48}
                label="Failure 명확" sub="A가 timeout 직접 감지" color={C.iter} />

              {/* Recursive issue boxes */}
              <text x={240} y={120} textAnchor="middle" fontSize={10} fontWeight={600}
                fill={C.warn}>Recursive의 문제점</text>
              <AlertBox x={30} y={135} w={140} h={48}
                label="NAT 뒤 노드" sub="중간 노드 미수신" color={C.warn} />
              <AlertBox x={180} y={135} w={140} h={48}
                label="중간 노드 down" sub="chain 끊김" color={C.warn} />
              <AlertBox x={330} y={135} w={140} h={48}
                label="병렬화 복잡" sub="state 분산" color={C.warn} />
              <text x={240} y={208} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">P2P 환경의 노드 churn에서 robustness 우선</text>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <text x={240} y={22} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">수렴 조건 (셋 중 하나라도 충족 시 종료)</text>

              <DataBox x={30} y={50} w={140} h={36}
                label="① 진전 없음" sub="더 가까운 노드 X" color={C.ok} outlined />
              <DataBox x={180} y={50} w={140} h={36}
                label="② Top-k 응답" sub="k개 모두 reply" color={C.info} outlined />
              <DataBox x={330} y={50} w={140} h={36}
                label="③ Timeout" sub="safety net" color={C.warn} outlined />

              <text x={240} y={115} textAnchor="middle" fontSize={10} fontWeight={600}
                fill="var(--muted-foreground)">루프 진행 시각화</text>

              {/* Round indicator */}
              {[0, 1, 2, 3].map((r) => (
                <motion.g key={r}
                  initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + r * 0.18 }}>
                  <rect x={50 + r * 100} y={135} width={80} height={36} rx={6}
                    fill={C.iter + '15'} stroke={C.iter} strokeWidth={1} />
                  <text x={90 + r * 100} y={152} textAnchor="middle" fontSize={9}
                    fontWeight={700} fill={C.iter}>round {r + 1}</text>
                  <text x={90 + r * 100} y={164} textAnchor="middle" fontSize={8}
                    fill={C.iter} fillOpacity={0.7}>α=3 RPC</text>
                </motion.g>
              ))}
              <text x={240} y={196} textAnchor="middle" fontSize={9}
                fill={C.warn}>round 4 후 새 노드 미발견 → ① 충족 → 종료</text>
              <text x={240} y={216} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">평균 거리 절반씩 줄어 log n rounds로 수렴</text>
            </motion.g>
          )}

          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <text x={240} y={22} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">실전 Latency: 네트워크별 비교</text>

              <text x={30} y={56} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">단일 RPC</text>
              <StatusBox x={100} y={42} w={350} h={30}
                label="100~500ms RTT" sub="UDP 1 round-trip" color={C.info} progress={0.3} />

              <text x={30} y={94} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">총 lookup</text>
              <StatusBox x={100} y={80} w={350} h={30}
                label="log n × RTT" sub="2~10초 (10^6 노드)" color={C.iter} progress={0.6} />

              <text x={240} y={132} textAnchor="middle" fontSize={10} fontWeight={600}
                fill="var(--muted-foreground)">실제 DHT별 lookup 시간</text>

              <DataBox x={30} y={148} w={130} h={30}
                label="IPFS DHT" sub="5~30초" color={C.warn} outlined />
              <DataBox x={175} y={148} w={130} h={30}
                label="discv5 (ETH)" sub="1~5초" color={C.ok} outlined />
              <DataBox x={320} y={148} w={130} h={30}
                label="BitTorrent" sub="10~60초" color={C.warn} outlined />
              <text x={240} y={200} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">α 증가 → 빨라지지만 대역폭 비용 ↑</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
