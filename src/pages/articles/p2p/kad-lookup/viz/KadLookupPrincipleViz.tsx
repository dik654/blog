import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, AlertBox, DataBox, ModuleBox, StatusBox } from '@/components/viz/boxes';

const C = {
  state: '#6366f1',
  query: '#10b981',
  alpha: '#f59e0b',
  k: '#8b5cf6',
  warn: '#ef4444',
  ok: '#22c55e',
};

const STEPS = [
  {
    label: '입력과 초기 상태',
    body: 'Input: target ID. State: shortlist = 로컬 테이블의 가까운 k개, asked={}, seen=shortlist 초기 노드들.',
  },
  {
    label: '루프: α개 미질의 노드 선택 → 병렬 FIND_NODE',
    body: '매 라운드 shortlist에서 unasked α=3개 선택, FIND_NODE(target) 동시 전송.',
  },
  {
    label: '응답 처리: shortlist 갱신 + 수렴 검사',
    body: '응답 k개 노드를 shortlist에 병합 (XOR 거리 정렬). 더 가까운 노드 없으면 종료.',
  },
  {
    label: '수렴 분석',
    body: '각 라운드 평균 거리 절반 → O(log n) rounds. 1M 노드 ≈ 20 rounds.',
  },
  {
    label: 'Ethereum 실전 파라미터',
    body: 'α=3, k=16 (bucketSize), seedCount=30, maxFindnodeFailures=5.',
  },
  {
    label: 'α 트레이드오프와 보안 고려',
    body: '높은 α: 빠르지만 대역폭 ↑. α=3은 경험적 sweet spot. Sybil/Eclipse/DoS 방어 필요.',
  },
];

export default function KadLookupPrincipleViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="klparr" markerWidth="6" markerHeight="6" refX="5.5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="#94a3b8" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <text x={240} y={22} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">입력 → 초기 State 구성</text>

              {/* Input */}
              <DataBox x={170} y={42} w={140} h={36}
                label="target ID" sub="ex: 0x7fa3..." color={C.k} outlined />

              <line x1={240} y1={78} x2={240} y2={100} stroke="#94a3b8" strokeWidth={1} markerEnd="url(#klparr)" />

              {/* State */}
              <ModuleBox x={20} y={108} w={140} h={56}
                label="shortlist" sub="local table k개" color={C.state} />
              <ModuleBox x={170} y={108} w={140} h={56}
                label="asked" sub="질의한 노드 set" color={C.state} />
              <ModuleBox x={320} y={108} w={140} h={56}
                label="seen" sub="발견한 노드 set" color={C.state} />

              <text x={240} y={186} textAnchor="middle" fontSize={10} fontWeight={600}
                fill="var(--muted-foreground)">초기값</text>
              <text x={90} y={205} textAnchor="middle" fontSize={9}
                fill={C.state} fillOpacity={0.85}>routing_table.closest_k(target)</text>
              <text x={240} y={205} textAnchor="middle" fontSize={9}
                fill={C.state} fillOpacity={0.85}>{`{}`} (empty)</text>
              <text x={390} y={205} textAnchor="middle" fontSize={9}
                fill={C.state} fillOpacity={0.85}>shortlist 노드들</text>
              <text x={240} y={228} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">3개 set이 루프 종료까지 갱신됨</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <text x={240} y={22} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">α=3 동시 RPC 라운드</text>

              {/* Querier center */}
              <circle cx={240} cy={120} r={28} fill={C.alpha + '20'} stroke={C.alpha} strokeWidth={1.6} />
              <text x={240} y={124} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.alpha}>Q</text>

              {/* α=3 peers */}
              {[
                { name: 'P1', x: 70, y: 60 },
                { name: 'P2', x: 410, y: 60 },
                { name: 'P3', x: 240, y: 215 },
              ].map((p, i) => (
                <g key={i}>
                  <circle cx={p.x} cy={p.y} r={20} fill={C.query + '15'} stroke={C.query} strokeWidth={1.2} />
                  <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.query}>{p.name}</text>
                </g>
              ))}

              {/* All α arrows fire simultaneously */}
              {[
                { x1: 222, y1: 108, x2: 90, y2: 70 },
                { x1: 258, y1: 108, x2: 390, y2: 70 },
                { x1: 240, y1: 148, x2: 240, y2: 195 },
              ].map((p, i) => (
                <motion.line key={i}
                  x1={p.x1} y1={p.y1} x2={p.x2} y2={p.y2}
                  stroke={C.query} strokeWidth={1.6} markerEnd="url(#klparr)"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }} />
              ))}

              <motion.text x={240} y={42} textAnchor="middle" fontSize={10} fontWeight={700}
                fill={C.alpha}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                FIND_NODE(target) ×3 동시 전송
              </motion.text>
              <text x={240} y={232} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">매 라운드 shortlist[:k]에서 unasked α개 선택</text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <text x={240} y={22} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">응답 → shortlist 병합 → 수렴 검사</text>

              <ActionBox x={20} y={50} w={130} h={40}
                label="① 응답 수신" sub="k nodes 회수" color={C.query} />
              <ActionBox x={170} y={50} w={140} h={40}
                label="② shortlist 병합" sub="XOR 거리 정렬" color={C.state} />
              <ActionBox x={330} y={50} w={130} h={40}
                label="③ 수렴 검사" sub="더 가까움?" color={C.alpha} />

              {/* Arrows linking */}
              <line x1={150} y1={70} x2={170} y2={70} stroke="#94a3b8" strokeWidth={1} markerEnd="url(#klparr)" />
              <line x1={310} y1={70} x2={330} y2={70} stroke="#94a3b8" strokeWidth={1} markerEnd="url(#klparr)" />

              {/* Outcome */}
              <line x1={395} y1={90} x2={140} y2={120} stroke="#94a3b8" strokeWidth={1} markerEnd="url(#klparr)" />
              <line x1={395} y1={90} x2={395} y2={140} stroke="#94a3b8" strokeWidth={1} markerEnd="url(#klparr)" />

              <ActionBox x={50} y={130} w={180} h={48}
                label="더 가까운 노드 발견" sub="다음 라운드로" color={C.ok} />
              <ActionBox x={290} y={130} w={170} h={48}
                label="진전 없음" sub="terminate (return shortlist)" color={C.warn} />

              <text x={240} y={205} textAnchor="middle" fontSize={9} fontWeight={600}
                fill="var(--muted-foreground)">정렬 후 상위 k개만 유지 → maxElems 초과 노드는 자동 탈락</text>
              <text x={240} y={222} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">shortlist는 점점 더 가까운 노드들로 수렴</text>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <text x={240} y={22} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">평균 거리: 라운드마다 절반</text>

              {/* 4 round bars - decreasing distance */}
              {[
                { r: 1, dist: '2^160', progress: 1.0 },
                { r: 2, dist: '2^159', progress: 0.5 },
                { r: 3, dist: '2^158', progress: 0.25 },
                { r: 4, dist: '~target', progress: 0.05 },
              ].map((b, i) => (
                <motion.g key={i}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 * i }}>
                  <text x={30} y={66 + i * 32} fontSize={9} fontWeight={600}
                    fill="var(--muted-foreground)">round {b.r}</text>
                  <StatusBox x={70} y={50 + i * 32} w={380} h={26}
                    label={`d ≈ ${b.dist}`} sub="" color={C.alpha} progress={b.progress} />
                </motion.g>
              ))}

              <text x={240} y={200} textAnchor="middle" fontSize={10} fontWeight={700}
                fill={C.k}>O(log n) rounds 보장</text>
              <text x={240} y={222} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">N=10^6 → ~20 rounds → α 병렬화로 4~5 effective rounds</text>
            </motion.g>
          )}

          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <text x={240} y={22} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">go-ethereum discv4 파라미터</text>

              <ModuleBox x={20} y={50} w={100} h={56}
                label="α = 3" sub="concurrency" color={C.alpha} />
              <ModuleBox x={130} y={50} w={100} h={56}
                label="k = 16" sub="bucketSize" color={C.k} />
              <ModuleBox x={240} y={50} w={100} h={56}
                label="seedCount" sub="= 30 (DB)" color={C.state} />
              <ModuleBox x={350} y={50} w={110} h={56}
                label="maxFailures" sub="= 5 (evict)" color={C.warn} />

              <text x={240} y={130} textAnchor="middle" fontSize={10} fontWeight={600}
                fill="var(--muted-foreground)">파라미터 → 동작</text>

              <ActionBox x={20} y={148} w={140} h={48}
                label="α=3 → α 고루틴" sub="advance() loop" color={C.query} />
              <ActionBox x={170} y={148} w={140} h={48}
                label="k=16 → result top" sub="nodesByDistance" color={C.query} />
              <ActionBox x={320} y={148} w={140} h={48}
                label="seed 30 → bootstrap" sub="loadSeedNodes" color={C.query} />
              <text x={240} y={216} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">상수가 lookup struct 동작과 직접 연결됨</text>
            </motion.g>
          )}

          {step === 5 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <text x={240} y={22} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">α 선택과 보안 고려</text>

              <text x={120} y={56} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.warn}>α=1 (직렬)</text>
              <StatusBox x={30} y={68} w={180} h={36}
                label="느림" sub="대역폭 효율적" color={C.warn} progress={0.2} />

              <text x={355} y={56} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.warn}>α=10 (과병렬)</text>
              <StatusBox x={265} y={68} w={180} h={36}
                label="빠르지만" sub="대역폭 폭증" color={C.warn} progress={0.95} />

              <text x={240} y={120} textAnchor="middle" fontSize={10} fontWeight={700}
                fill={C.ok}>α=3 — sweet spot</text>

              <text x={240} y={142} textAnchor="middle" fontSize={10} fontWeight={600}
                fill="var(--muted-foreground)">동시 고려할 보안 위협</text>
              <AlertBox x={30} y={156} w={130} h={42}
                label="Sybil" sub="가짜 ID flood" color={C.warn} />
              <AlertBox x={175} y={156} w={130} h={42}
                label="Eclipse" sub="단일 peer set 점령" color={C.warn} />
              <AlertBox x={320} y={156} w={130} h={42}
                label="DoS" sub="query rate flood" color={C.warn} />
              <text x={240} y={220} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">discv5는 ENR 서명, NodeID PoW로 일부 완화</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
