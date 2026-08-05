import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, DataBox, ModuleBox } from '@/components/viz/boxes';

const C = {
  init: '#6366f1',
  pick: '#f59e0b',
  send: '#10b981',
  recv: '#8b5cf6',
  update: '#0ea5e9',
  term: '#ef4444',
  ok: '#22c55e',
};

const STEPS = [
  {
    label: '초기화 — shortlist + queried + waiting',
    body: 'shortlist = routing_table.closest_k(target). closest = shortlist[0]. queried, waiting = {}.',
  },
  {
    label: '후보 선택 — α개 unasked + unwaiting',
    body: 'candidates = shortlist[:k]에서 queried/waiting 제외 상위 α=3개. 비었고 waiting도 0이면 break.',
  },
  {
    label: '병렬 FIND_NODE 전송',
    body: '각 candidate에 send_findnode(target). waiting에 추가 — 응답 대기 중 표시.',
  },
  {
    label: '응답 수신 + 상태 전이',
    body: 'wait_for_response(500ms). waiting에서 빼고 queried에 추가. timeout 시 continue.',
  },
  {
    label: 'shortlist 갱신 — 거리순 정렬 삽입',
    body: '새 노드를 distance(target) 기준 정렬 삽입. 이미 본 노드는 skip.',
  },
  {
    label: '진전 체크 → 반복 또는 종료',
    body: 'new_closest < closest면 계속. 아니면 len(queried) ≥ k 시 break. 최종 shortlist[:k] 반환.',
  },
];

export default function LookupFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="lfarr" markerWidth="6" markerHeight="6" refX="5.5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="#94a3b8" />
            </marker>
          </defs>

          {/* Left sidebar: step progression */}
          {[
            { n: '1', y: 36, c: step === 0 ? C.init : '#94a3b8' },
            { n: '2', y: 76, c: step === 1 ? C.pick : '#94a3b8' },
            { n: '3', y: 116, c: step === 2 ? C.send : '#94a3b8' },
            { n: '4', y: 156, c: step === 3 ? C.recv : '#94a3b8' },
            { n: '5', y: 196, c: step === 4 ? C.update : '#94a3b8' },
          ].map((s, i) => (
            <g key={i}>
              <circle cx={22} cy={s.y} r={10}
                fill={i === step ? s.c + '30' : 'transparent'}
                stroke={s.c} strokeWidth={1.4} />
              <text x={22} y={s.y + 3.5} textAnchor="middle" fontSize={9}
                fontWeight={700} fill={s.c}>{s.n}</text>
              {i < 4 && (
                <line x1={22} y1={s.y + 10} x2={22} y2={s.y + 30}
                  stroke="#94a3b8" strokeOpacity={0.3} strokeWidth={1} />
              )}
            </g>
          ))}

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <text x={260} y={22} textAnchor="middle" fontSize={11} fontWeight={700}
                fill={C.init}>lookup(target, k=16, α=3) 초기화</text>

              <ModuleBox x={60} y={50} w={170} h={56}
                label="shortlist" sub="closest_k(target) from local" color={C.init} />
              <ModuleBox x={260} y={50} w={90} h={56}
                label="queried" sub="{}" color={C.init} />
              <ModuleBox x={370} y={50} w={90} h={56}
                label="waiting" sub="{}" color={C.init} />

              <text x={260} y={130} textAnchor="middle" fontSize={10} fontWeight={600}
                fill="var(--muted-foreground)">초기 closest = shortlist[0]</text>

              {/* shortlist example nodes */}
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.g key={i}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 * i }}>
                  <DataBox x={60 + i * 74} y={150} w={66} h={30}
                    label={`n${i + 1}`} sub={`d=2^${13 - i}`} color={C.init} outlined />
                </motion.g>
              ))}
              <text x={260} y={205} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">거리 작은 순 정렬 (n1이 가장 가까움)</text>
              <text x={260} y={225} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">초기 shortlist = routing table의 k개 closest</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <text x={260} y={22} textAnchor="middle" fontSize={11} fontWeight={700}
                fill={C.pick}>candidates = unasked ∩ unwaiting [:α]</text>

              {/* shortlist with color-coding */}
              <text x={50} y={58} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">shortlist</text>
              {[
                { name: 'n1', state: 'queried' },
                { name: 'n2', state: 'waiting' },
                { name: 'n3', state: 'fresh' },
                { name: 'n4', state: 'fresh' },
                { name: 'n5', state: 'fresh' },
                { name: 'n6', state: 'fresh' },
                { name: 'n7', state: 'fresh' },
              ].map((n, i) => {
                const color = n.state === 'queried' ? '#94a3b8'
                  : n.state === 'waiting' ? C.recv : C.pick;
                const outlined = n.state === 'fresh' && i < 5;
                return (
                  <motion.g key={i}
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.08 * i }}>
                    <DataBox x={50 + i * 60} y={72} w={52} h={32}
                      label={n.name} sub={n.state} color={color} outlined={outlined} />
                  </motion.g>
                );
              })}

              {/* Highlight n3, n4, n5 as candidates */}
              <motion.rect x={170} y={68} width={176} height={40} rx={6}
                fill="none" stroke={C.pick} strokeWidth={2} strokeDasharray="4 3"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} />
              <motion.text x={260} y={58} textAnchor="middle" fontSize={10} fontWeight={700}
                fill={C.pick}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}>
                ↓ α=3 선택
              </motion.text>

              <text x={260} y={145} textAnchor="middle" fontSize={10} fontWeight={600}
                fill="var(--muted-foreground)">종료 조건</text>
              <DataBox x={60} y={165} w={400} h={36}
                label="candidates=[] AND waiting=[] → break" color={C.term} outlined />
              <text x={260} y={220} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">모든 후보 탐색 완료 + 응답 대기 없음 → 루프 탈출</text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <text x={260} y={22} textAnchor="middle" fontSize={11} fontWeight={700}
                fill={C.send}>for node in candidates: send_findnode(node, target)</text>

              <circle cx={120} cy={120} r={24} fill={C.send + '20'} stroke={C.send} strokeWidth={1.6} />
              <text x={120} y={124} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.send}>Q</text>

              {[
                { x: 300, y: 60, name: 'n3' },
                { x: 400, y: 120, name: 'n4' },
                { x: 300, y: 200, name: 'n5' },
              ].map((n, i) => (
                <g key={i}>
                  <circle cx={n.x} cy={n.y} r={18} fill={C.send + '15'} stroke={C.send} strokeWidth={1.2} />
                  <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.send}>{n.name}</text>
                  <motion.line
                    x1={144} y1={120 + (i === 0 ? -10 : i === 2 ? 10 : 0)}
                    x2={n.x - 18} y2={n.y}
                    stroke={C.send} strokeWidth={1.5} markerEnd="url(#lfarr)"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ delay: 0.2 + i * 0.08 }} />
                </g>
              ))}

              <text x={260} y={42} textAnchor="middle" fontSize={9} fontWeight={600}
                fill={C.send}>FIND_NODE(target) × α개 동시</text>
              <text x={260} y={230} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">waiting.add(node) for each</text>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <text x={260} y={22} textAnchor="middle" fontSize={11} fontWeight={700}
                fill={C.recv}>response = wait_for_response(500ms)</text>

              <ActionBox x={60} y={50} w={180} h={48}
                label="응답 수신" sub="response.from, nodes" color={C.recv} />
              <ActionBox x={270} y={50} w={180} h={48}
                label="Timeout (500ms)" sub="continue (다음 라운드)" color={C.term} />

              <text x={260} y={120} textAnchor="middle" fontSize={10} fontWeight={600}
                fill="var(--muted-foreground)">수신 후 상태 전이</text>

              <DataBox x={60} y={140} w={180} h={36}
                label="waiting.remove(response.from)" color={C.update} outlined />
              <DataBox x={270} y={140} w={180} h={36}
                label="queried.add(response.from)" color={C.update} outlined />

              <text x={260} y={200} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">timeout은 continue — 해당 노드는 여전히 waiting</text>
              <text x={260} y={220} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">다른 노드 응답이 먼저 오면 계속 진행</text>
            </motion.g>
          )}

          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <text x={260} y={22} textAnchor="middle" fontSize={11} fontWeight={700}
                fill={C.update}>response.nodes → shortlist 정렬 삽입</text>

              {/* Before */}
              <text x={100} y={58} textAnchor="middle" fontSize={9} fontWeight={600}
                fill="var(--muted-foreground)">Before</text>
              {[
                { n: 'n1', d: 2 },
                { n: 'n3', d: 5 },
                { n: 'n4', d: 8 },
              ].map((x, i) => (
                <DataBox key={i} x={50 + i * 50} y={70} w={44} h={28}
                  label={x.n} sub={`d=${x.d}`} color={C.update} outlined />
              ))}

              {/* New response */}
              <text x={260} y={58} textAnchor="middle" fontSize={9} fontWeight={600}
                fill={C.recv}>+ response.nodes</text>
              {[
                { n: 'n8', d: 3 },
                { n: 'n9', d: 6 },
              ].map((x, i) => (
                <motion.g key={i}
                  initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}>
                  <DataBox x={220 + i * 50} y={70} w={44} h={28}
                    label={x.n} sub={`d=${x.d}`} color={C.recv} outlined />
                </motion.g>
              ))}

              {/* After */}
              <text x={260} y={128} textAnchor="middle" fontSize={9} fontWeight={600}
                fill={C.ok}>After (정렬)</text>
              {[
                { n: 'n1', d: 2, c: C.update },
                { n: 'n8', d: 3, c: C.recv },
                { n: 'n3', d: 5, c: C.update },
                { n: 'n9', d: 6, c: C.recv },
                { n: 'n4', d: 8, c: C.update },
              ].map((x, i) => (
                <motion.g key={i}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 + i * 0.08 }}>
                  <DataBox x={50 + i * 80} y={145} w={72} h={32}
                    label={x.n} sub={`d=${x.d}`} color={x.c} outlined />
                </motion.g>
              ))}
              <text x={260} y={200} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">이미 queried/shortlist에 있는 노드는 skip</text>
              <text x={260} y={220} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">shortlist는 항상 target과의 거리순 유지</text>
            </motion.g>
          )}

          {step === 5 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <text x={260} y={22} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">진전 검사 → 루프 또는 종료</text>

              <DataBox x={180} y={44} w={160} h={36}
                label="new_closest = shortlist[0]" color={C.update} outlined />

              <line x1={210} y1={80} x2={100} y2={110} stroke="#94a3b8" strokeWidth={1} markerEnd="url(#lfarr)" />
              <line x1={310} y1={80} x2={420} y2={110} stroke="#94a3b8" strokeWidth={1} markerEnd="url(#lfarr)" />

              <ActionBox x={45} y={118} w={160} h={48}
                label="더 가까워짐" sub="closest 갱신 → loop" color={C.ok} />
              <ActionBox x={315} y={118} w={160} h={48}
                label="진전 없음" sub="len(queried) ≥ k → break" color={C.term} />

              <text x={260} y={188} textAnchor="middle" fontSize={10} fontWeight={700}
                fill={C.ok}>return shortlist[:k]</text>
              <text x={260} y={212} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">진전 없어도 k개 전부 queried 될 때까지 지속 (완전 탐색)</text>
              <text x={260} y={230} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">최종 결과: target에 가장 가까운 k개 노드</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
