import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, DataBox, ModuleBox, StatusBox } from '@/components/viz/boxes';

const C = {
  file: '#6366f1',
  table: '#10b981',
  bucket: '#f59e0b',
  node: '#8b5cf6',
  step: '#0ea5e9',
  warn: '#ef4444',
};

const STEPS = [
  {
    label: 'p2p/discover/ 디렉토리 구성',
    body: '6개 핵심 파일: common.go, lookup.go, node.go, table.go, v4_udp.go, v5_udp.go.',
  },
  {
    label: '주요 상수 — 동작 결정',
    body: 'α=3 (concurrency), bucketSize=16 (k), maxFindnodeFailures=5, seedCount=30.',
  },
  {
    label: 'Table 구조체',
    body: 'buckets[256] (XOR log-distance), nursery (bootnodes), db (persistent), rand (jitter).',
  },
  {
    label: 'bucket 구조 + Node 메타',
    body: 'bucket: entries[≤16] + replacements[]. Node: ID, IP, UDP/TCP, livenessChecks.',
  },
  {
    label: 'Lookup lifecycle 5단계',
    body: 'New lookup → Pre-populate (closest) → Query loop (advance/startQueries) → Update result → Return.',
  },
  {
    label: '핵심 메커니즘 3가지',
    body: 'nodesByDistance (sort.Search 정렬), trackRequest (실패 카운터 + evict), Refresh (30분 + jitter).',
  },
];

export default function GethDiscoveryStructureViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="gdarr" markerWidth="6" markerHeight="6" refX="5.5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="#94a3b8" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <text x={240} y={22} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">go-ethereum p2p/discover/</text>

              {/* 6 file boxes in 2 rows */}
              {[
                { f: 'common.go', sub: '공통 타입', x: 30, y: 50 },
                { f: 'lookup.go', sub: 'iterative lookup', x: 180, y: 50 },
                { f: 'node.go', sub: 'Node struct', x: 330, y: 50 },
                { f: 'table.go', sub: 'routing table', x: 30, y: 130 },
                { f: 'v4_udp.go', sub: 'UDP v4 protocol', x: 180, y: 130 },
                { f: 'v5_udp.go', sub: 'v5 protocol', x: 330, y: 130 },
              ].map((b, i) => (
                <motion.g key={i}
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * i }}>
                  <ModuleBox x={b.x} y={b.y} w={120} h={56} label={b.f} sub={b.sub}
                    color={i === 1 || i === 3 ? C.bucket : C.file} />
                </motion.g>
              ))}
              <text x={240} y={210} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">lookup.go + table.go 가 핵심 (강조)</text>
              <text x={240} y={228} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">v4와 v5는 서로 다른 wire 포맷, 같은 lookup 사용</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <text x={240} y={22} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">상수 → 어디서 사용되는가</text>

              {[
                { name: 'α = 3', sub: 'concurrency', use: 'startQueries() 한도', x: 30 },
                { name: 'bucketSize = 16', sub: 'k', use: 'result.maxElems', x: 180 },
                { name: 'maxFailures = 5', sub: '연속 실패', use: 'trackRequest evict', x: 330 },
              ].map((c, i) => (
                <motion.g key={i}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 * i }}>
                  <ModuleBox x={c.x} y={50} w={120} h={56} label={c.name} sub={c.sub} color={C.step} />
                  <line x1={c.x + 60} y1={108} x2={c.x + 60} y2={130}
                    stroke="#94a3b8" strokeWidth={1} markerEnd="url(#gdarr)" />
                  <DataBox x={c.x} y={134} w={120} h={32} label={c.use} color={C.step} outlined />
                </motion.g>
              ))}

              <text x={240} y={190} textAnchor="middle" fontSize={10} fontWeight={600}
                fill="var(--muted-foreground)">시간 상수</text>
              <DataBox x={50} y={205} w={170} h={28}
                label="seedMaxAge = 5 days" sub="DB 시드 유효기간" color={C.bucket} outlined />
              <DataBox x={260} y={205} w={170} h={28}
                label="RefreshInterval = 30 min" sub="테이블 리프레시" color={C.bucket} outlined />
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <text x={240} y={22} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">Table 구조체 — 4개 필드</text>

              <ModuleBox x={140} y={42} w={200} h={36}
                label="Table" sub="라우팅 테이블 컨테이너" color={C.table} />

              {/* Four field boxes spread out */}
              {[
                { f: 'buckets', t: '[256]bucket', sub: 'log-distance idx', x: 20, c: C.bucket },
                { f: 'nursery', t: '[]*Node', sub: 'bootnodes', x: 130, c: C.node },
                { f: 'db', t: '*nodeDB', sub: 'persistent', x: 240, c: C.file },
                { f: 'rand', t: '*rand.Rand', sub: 'jitter source', x: 350, c: C.step },
              ].map((b, i) => (
                <motion.g key={i}
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}>
                  <line x1={240} y1={78} x2={b.x + 55} y2={108}
                    stroke="#94a3b8" strokeWidth={1} strokeOpacity={0.5} />
                  <ModuleBox x={b.x} y={108} w={110} h={50} label={b.f} sub={b.t} color={b.c} />
                  <text x={b.x + 55} y={172} textAnchor="middle" fontSize={8.5}
                    fill="var(--muted-foreground)">{b.sub}</text>
                </motion.g>
              ))}

              <text x={240} y={205} textAnchor="middle" fontSize={9} fontWeight={600}
                fill="var(--muted-foreground)">256 buckets — bit-prefix log distance index</text>
              <text x={240} y={224} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">db: 재시작 시 시드 source / nursery: hardcoded fallback</text>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <text x={240} y={22} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">bucket + Node 구조</text>

              {/* bucket */}
              <ModuleBox x={20} y={50} w={210} h={36}
                label="bucket" sub="단일 distance band" color={C.bucket} />
              <DataBox x={30} y={94} w={90} h={30}
                label="entries" sub="≤ 16 nodes" color={C.bucket} outlined />
              <DataBox x={130} y={94} w={90} h={30}
                label="replacements" sub="대기 list" color={C.bucket} outlined />

              {/* Node */}
              <ModuleBox x={250} y={50} w={210} h={36}
                label="Node" sub="peer 메타데이터" color={C.node} />
              <DataBox x={258} y={94} w={68} h={30}
                label="ID" sub="enode.ID" color={C.node} outlined />
              <DataBox x={329} y={94} w={68} h={30}
                label="IP" sub="net.IP" color={C.node} outlined />
              <DataBox x={400} y={94} w={56} h={30}
                label="UDP" sub="port" color={C.node} outlined />

              <text x={355} y={146} textAnchor="middle" fontSize={9} fontWeight={600}
                fill="var(--muted-foreground)">+ TCP, livenessChecks</text>

              <text x={120} y={146} textAnchor="middle" fontSize={9} fontWeight={600}
                fill={C.warn}>entries 가득 → replacements로</text>
              <text x={120} y={162} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">entries 노드 evict 시 promote</text>

              <text x={240} y={196} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">replacements는 즉시 활성 X — eclipse 공격 완화</text>
              <text x={240} y={216} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">livenessChecks: PING 통과 횟수 — high = 신뢰</text>
            </motion.g>
          )}

          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <text x={240} y={22} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">Lookup Lifecycle 5단계</text>

              {[
                { n: '1', t: 'New lookup', s: 'target 지정', x: 18 },
                { n: '2', t: 'Pre-populate', s: 'closest 적재', x: 110 },
                { n: '3', t: 'Query loop', s: 'advance/start', x: 202 },
                { n: '4', t: 'Update result', s: 'addNodes', x: 294 },
                { n: '5', t: 'Return', s: 'k nodes', x: 386 },
              ].map((s, i) => (
                <motion.g key={i}
                  initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.12 * i }}>
                  <circle cx={s.x + 38} cy={66} r={12} fill={C.step + '25'} stroke={C.step} strokeWidth={1.4} />
                  <text x={s.x + 38} y={70} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.step}>{s.n}</text>
                  <ActionBox x={s.x} y={86} w={76} h={48} label={s.t} sub={s.s} color={C.step} />
                  {i < 4 && (
                    <line x1={s.x + 76} y1={110} x2={s.x + 92} y2={110}
                      stroke="#94a3b8" strokeWidth={1.2} markerEnd="url(#gdarr)" />
                  )}
                </motion.g>
              ))}

              <text x={240} y={160} textAnchor="middle" fontSize={10} fontWeight={600}
                fill="var(--muted-foreground)">3단계 내부: advance() + startQueries() 반복</text>

              <DataBox x={40} y={178} w={180} h={36}
                label="advance()" sub="replyCh 수신 + 분기" color={C.table} outlined />
              <DataBox x={260} y={178} w={180} h={36}
                label="startQueries()" sub="α개 고루틴 발사" color={C.table} outlined />
              <text x={240} y={228} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">루프는 새 노드 미발견 + 진행 중 0 일 때 종료</text>
            </motion.g>
          )}

          {step === 5 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <text x={240} y={22} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">3가지 핵심 메커니즘</text>

              <ModuleBox x={20} y={50} w={140} h={56}
                label="nodesByDistance" sub="정렬 + push" color={C.table} />
              <ModuleBox x={170} y={50} w={140} h={56}
                label="trackRequest" sub="실패 추적" color={C.bucket} />
              <ModuleBox x={320} y={50} w={140} h={56}
                label="Table refresh" sub="30분 jitter" color={C.step} />

              <text x={90} y={130} textAnchor="middle" fontSize={9} fontWeight={600}
                fill={C.table}>O(log n) insert</text>
              <DataBox x={20} y={144} w={140} h={28}
                label="sort.Search" sub="bin search" color={C.table} outlined />

              <text x={240} y={130} textAnchor="middle" fontSize={9} fontWeight={600}
                fill={C.bucket}>실패 → counter ↑</text>
              <DataBox x={170} y={144} w={140} h={28}
                label="evict at 5" sub="maxFailures" color={C.bucket} outlined />

              <text x={390} y={130} textAnchor="middle" fontSize={9} fontWeight={600}
                fill={C.step}>self + 3 random</text>
              <DataBox x={320} y={144} w={140} h={28}
                label="bucket 채우기" sub="다양성 확보" color={C.step} outlined />

              <text x={240} y={196} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">정렬: 매번 top-k 자동 유지 / 실패: 죽은 노드 자연 제거</text>
              <text x={240} y={216} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">refresh: bucket churn 자연 보충 + healing</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
