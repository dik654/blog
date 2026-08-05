import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, AlertBox, DataBox, ModuleBox, StatusBox } from '@/components/viz/boxes';

const C = {
  bucket: '#6366f1',
  hit: '#10b981',
  full: '#f59e0b',
  evict: '#ef4444',
  add: '#22c55e',
  prefix: '#8b5cf6',
};

const STEPS = [
  {
    label: 'K-bucket 구조 — 거리별 버킷 배열',
    body: 'bucket[i] = 거리가 [2^i, 2^(i+1)) 범위인 노드들. log2(d) → bucket index.',
  },
  {
    label: '노드 발견 시 업데이트 분기',
    body: '이미 있으면 LRU tail로 이동, 빈 슬롯 있으면 append, 가득 차면 oldest에 PING.',
  },
  {
    label: 'PING으로 oldest 검증 → 새 노드 처리 결정',
    body: 'oldest 응답하면 그대로 유지(새 노드 drop), 응답 없으면 oldest 제거 후 새 노드 삽입.',
  },
  {
    label: 'Old node first 원칙 (Mickens 법칙)',
    body: '오래 살아있던 노드가 앞으로도 살아있을 확률이 높다 — 라우팅 테이블의 안정성 핵심.',
  },
  {
    label: '버킷 분할 최적화',
    body: '미리 160개 할당 대신 1개로 시작 → 가득 찰 때 split. 자기 prefix 포함 subtree만 split.',
  },
  {
    label: '클라이언트별 k 값',
    body: 'Bitcoin k=8, ETH discv4/v5 k=16, IPFS k=20, Libp2p k=20 — 트레이드오프에 따른 선택.',
  },
];

export default function KBucketMechanismViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="kbarr" markerWidth="6" markerHeight="6" refX="5.5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="#94a3b8" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <text x={240} y={22} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">160개 버킷 (또는 256) — 거리별 분할</text>

              {/* Bucket array */}
              {[
                { i: 0, range: '[2^0, 2^1)', x: 30 },
                { i: 1, range: '[2^1, 2^2)', x: 145 },
                { i: 2, range: '[2^2, 2^3)', x: 260 },
                { i: 159, range: '[2^159, 2^160)', x: 375 },
              ].map((b, idx) => (
                <motion.g key={idx}
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * idx }}>
                  <ModuleBox x={b.x} y={50} w={95} h={56}
                    label={`bucket[${b.i}]`} sub={b.range} color={C.bucket} />
                </motion.g>
              ))}
              <text x={240} y={120} textAnchor="middle" fontSize={11}
                fill="var(--muted-foreground)">···</text>

              {/* Each contains up to k nodes */}
              <text x={240} y={150} textAnchor="middle" fontSize={10} fontWeight={600}
                fill={C.bucket}>각 버킷: 최대 k개 노드 (보통 k=20)</text>

              {/* Show k slots in one bucket */}
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.g key={i}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + i * 0.06 }}>
                  <DataBox x={50 + i * 78} y={170} w={70} h={28}
                    label={`node ${i + 1}`} color={C.bucket} outlined />
                </motion.g>
              ))}
              <text x={240} y={220} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">d(self, target) = self XOR target → bucket index = log2(d)</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <text x={240} y={22} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">node_seen(N) — 3가지 분기</text>

              <DataBox x={180} y={42} w={120} h={36}
                label="새 노드 N 발견" color={C.bucket} outlined />

              {/* Three branches */}
              <line x1={240} y1={78} x2={90} y2={108} stroke="#94a3b8" strokeWidth={1} markerEnd="url(#kbarr)" />
              <line x1={240} y1={78} x2={240} y2={108} stroke="#94a3b8" strokeWidth={1} markerEnd="url(#kbarr)" />
              <line x1={240} y1={78} x2={395} y2={108} stroke="#94a3b8" strokeWidth={1} markerEnd="url(#kbarr)" />

              <ActionBox x={20} y={114} w={140} h={50}
                label="① 이미 존재" sub="LRU: tail로 이동" color={C.hit} />
              <ActionBox x={170} y={114} w={140} h={50}
                label="② 빈 슬롯" sub="append (tail)" color={C.add} />
              <ActionBox x={325} y={114} w={140} h={50}
                label="③ 가득 참" sub="PING oldest" color={C.full} />

              <text x={240} y={185} textAnchor="middle" fontSize={9} fontWeight={600}
                fill="var(--muted-foreground)">분기 ③ → 다음 단계로 (PING 결과에 따라 처리)</text>
              <text x={240} y={215} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">b = bucket_index(N, self) → bucket[b] 상태 검사</text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <text x={240} y={22} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">PING(oldest) → 응답 여부로 분기</text>

              {/* PING action */}
              <DataBox x={180} y={42} w={120} h={32}
                label="PING(oldest)" color={C.full} outlined />

              {/* Two outcomes */}
              <line x1={210} y1={74} x2={120} y2={108} stroke="#94a3b8" strokeWidth={1} markerEnd="url(#kbarr)" />
              <line x1={270} y1={74} x2={360} y2={108} stroke="#94a3b8" strokeWidth={1} markerEnd="url(#kbarr)" />

              <ActionBox x={40} y={114} w={170} h={48}
                label="응답 O — oldest 살아있음" sub="oldest → tail / 새 N drop" color={C.hit} />
              <ActionBox x={270} y={114} w={170} h={48}
                label="응답 X — oldest down" sub="oldest 제거 / N append" color={C.evict} />

              <text x={125} y={184} textAnchor="middle" fontSize={9} fontWeight={600}
                fill={C.hit}>안정성: 신뢰 노드 보존</text>
              <text x={355} y={184} textAnchor="middle" fontSize={9} fontWeight={600}
                fill={C.evict}>활성도: dead 노드 정리</text>
              <text x={240} y={215} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">DoS 방어: 새 노드가 무조건 들어오지 못함 (eclipse 공격 완화)</text>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <text x={240} y={22} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">왜 oldest 우선? — 생존 확률 비교</text>

              <text x={120} y={56} textAnchor="middle" fontSize={9} fontWeight={600}
                fill="var(--muted-foreground)">신규 노드 (1분 uptime)</text>
              <StatusBox x={30} y={68} w={180} h={42}
                label="앞으로 1시간 생존 확률" sub="~30% (관측치)" color={C.evict} progress={0.3} />

              <text x={355} y={56} textAnchor="middle" fontSize={9} fontWeight={600}
                fill="var(--muted-foreground)">오래된 노드 (24h uptime)</text>
              <StatusBox x={265} y={68} w={180} h={42}
                label="앞으로 1시간 생존 확률" sub="~85% (관측치)" color={C.hit} progress={0.85} />

              <text x={240} y={134} textAnchor="middle" fontSize={10} fontWeight={700}
                fill={C.prefix}>Mickens의 법칙</text>
              <text x={240} y={150} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">"The longer a node has been up,</text>
              <text x={240} y={163} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">the more likely it is to still be up."</text>

              <ActionBox x={70} y={180} w={150} h={36}
                label="라우팅 안정성 ↑" sub="churn에 강건" color={C.hit} />
              <ActionBox x={260} y={180} w={150} h={36}
                label="Sybil 저항 ↑" sub="신규 ID flood 방어" color={C.hit} />
            </motion.g>
          )}

          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <text x={240} y={22} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">단순 구현 vs 분할 최적화</text>

              <text x={120} y={56} textAnchor="middle" fontSize={9} fontWeight={600}
                fill={C.evict}>단순: 160개 미리 할당</text>
              <AlertBox x={30} y={70} w={180} h={50}
                label="대부분 빈 버킷" sub="메모리 낭비" color={C.evict} />

              <text x={355} y={56} textAnchor="middle" fontSize={9} fontWeight={600}
                fill={C.add}>최적화: 동적 split</text>
              <ActionBox x={265} y={70} w={180} h={50}
                label="bucket 1개로 시작" sub="필요 시에만 split" color={C.add} />

              <text x={240} y={140} textAnchor="middle" fontSize={10} fontWeight={600}
                fill={C.prefix}>Split 조건</text>
              <DataBox x={50} y={155} w={170} h={32}
                label="자기 prefix 포함" sub="가까운 영역만 세분" color={C.prefix} outlined />
              <DataBox x={260} y={155} w={170} h={32}
                label="버킷 가득 참" sub="full → split" color={C.prefix} outlined />
              <text x={240} y={210} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">결과: ~log2(N) 버킷만 사용 → Memory O(k · log n)</text>
            </motion.g>
          )}

          {step === 5 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <text x={240} y={22} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">실전 클라이언트별 k 값</text>

              <ModuleBox x={30} y={50} w={100} h={56} label="Bitcoin" sub="k = 8" color="#f59e0b" />
              <ModuleBox x={140} y={50} w={100} h={56} label="ETH discv4/v5" sub="k = 16" color="#6366f1" />
              <ModuleBox x={250} y={50} w={100} h={56} label="IPFS" sub="k = 20 (표준)" color="#10b981" />
              <ModuleBox x={360} y={50} w={100} h={56} label="Libp2p Kad" sub="k = 20" color="#10b981" />

              <text x={240} y={130} textAnchor="middle" fontSize={10} fontWeight={600}
                fill="var(--muted-foreground)">k 값 트레이드오프</text>

              <ActionBox x={30} y={148} w={210} h={48}
                label="작은 k (k=8)" sub="가벼운 메모리, 적은 redundancy" color={C.full} />
              <ActionBox x={250} y={148} w={210} h={48}
                label="큰 k (k=20)" sub="강한 redundancy, 메모리/네트워크 ↑" color={C.add} />
              <text x={240} y={216} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">k=20이 사실상 표준 — 적당한 redundancy + 작은 비용</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
