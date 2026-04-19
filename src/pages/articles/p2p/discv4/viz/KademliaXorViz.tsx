import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, StatusBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { xor: '#6366f1', bucket: '#10b981', lookup: '#f59e0b', perf: '#0ea5e9' };

const STEPS = [
  {
    label: 'XOR distance — 거리 메트릭의 정의',
    body: 'd(a,b) = a XOR b.\n대칭(d(a,b)=d(b,a)) + 변형 삼각 부등식.\n동심원 없음 — 모든 노드가 동일한 거리표를 본다.',
  },
  {
    label: 'k-buckets — 256개 거리 슬롯',
    body: 'Bucket[i] = 거리 [2^i, 2^(i+1)) 의 노드 집합.\n각 버킷 최대 16개(k=16), LRU 축출.\n노드 ID 공간 2^256, 가까울수록 버킷 인덱스 큼.',
  },
  {
    label: '예시: 우리 ID 0x1234... 의 라우팅 테이블',
    body: 'Bucket[0]: 첫 비트가 다른 노드 (멀리).\nBucket[255]: 거의 같은 ID (가까이).\n실전 mainnet ≈ 16개 버킷만 채워짐.',
  },
  {
    label: 'Lookup — 가까이서 더 가까이',
    body: '1) 알고 있는 노드 중 target에 가장 가까운 3개에 FINDNODE.\n2) 각자 자기 시점의 가장 가까운 노드들 응답.\n3) 새로 알게 된 더 가까운 노드들에 다시 질의 — 수렴까지 반복.',
  },
  {
    label: '성능 — 라우팅 테이블 + lookup 비용',
    body: 'Routing table: O(k × log n) ≈ 256 노드 (mainnet).\nLookup: 3~5 라운드.\n메모리 풋프린트 작음, 지연 < 1초가 보통.',
  },
];

export default function KademliaXorViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 230" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.xor}>
                XOR 메트릭의 세 가지 속성
              </text>
              <DataBox x={30} y={50} w={130} h={42} label="대칭" sub="d(a,b) = d(b,a)" color={C.xor} outlined />
              <DataBox x={175} y={50} w={130} h={42} label="단방향 삼각" sub="d(a,c) ≤ d(a,b) ⊕ d(b,c)" color={C.xor} outlined />
              <DataBox x={320} y={50} w={130} h={42} label="동심원 없음" sub="모든 노드 같은 거리표" color={C.xor} outlined />
              <text x={240} y={130} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
                예: A=0b1010, B=0b1100 → d=0b0110 = 6
              </text>
              <text x={240} y={150} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                Euclidean과 달리 라우팅 테이블 구성이 단순 — 인덱스 = 첫 다른 비트 위치.
              </text>
              <text x={240} y={185} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                같은 거리에 여러 노드 → 부분 실패에 강함.
              </text>
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.bucket}>
                256 buckets, k=16 nodes per bucket
              </text>
              {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                <g key={i}>
                  <DataBox x={30 + i * 55} y={50} w={50} h={28} label={`B[${i}]`} color={C.bucket} outlined />
                  <text x={55 + i * 55} y={92} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
                    [2^{i},2^{i + 1})
                  </text>
                </g>
              ))}
              <text x={240} y={120} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                ... B[8] ... B[254] ...
              </text>
              <DataBox x={170} y={140} w={140} h={32} label="B[255]" sub="거리 [2^255, 2^256)" color={C.bucket} outlined />
              <text x={240} y={195} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                각 버킷 LRU eviction — 새 노드는 PING에 응답하지 않는 가장 오래된 노드를 밀어낸다.
              </text>
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                Our ID = 0x1234... 의 시점
              </text>
              <ModuleBox x={20} y={45} w={140} h={45} label="Bucket[0]" sub="첫 비트 다름 (멀리)" color={C.bucket} />
              <ModuleBox x={170} y={45} w={140} h={45} label="Bucket[127]" sub="중간 거리" color={C.bucket} />
              <ModuleBox x={320} y={45} w={140} h={45} label="Bucket[255]" sub="거의 같은 ID" color={C.bucket} />
              <text x={90} y={110} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)">
                노드 수 ≈ N/2
              </text>
              <text x={240} y={110} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)">
                노드 수 ≈ 적음
              </text>
              <text x={390} y={110} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)">
                노드 수 ≈ 거의 0
              </text>
              <text x={240} y={150} textAnchor="middle" fontSize={9.5} fill={C.bucket}>
                실전 mainnet: ~16개 버킷만 채워짐 (작은 N에서 분포 희박).
              </text>
              <text x={240} y={170} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                이 비대칭이 lookup이 O(log n)인 이유.
              </text>
            </motion.g>
          )}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.lookup}>
                "Find closest to T" — 점진적 수렴
              </text>
              <ModuleBox x={20} y={45} w={120} h={42} label="Round 1" sub="알던 3 노드에 질의" color={C.lookup} />
              <ModuleBox x={150} y={45} w={120} h={42} label="Round 2" sub="새 답으로 더 좁게" color={C.lookup} />
              <ModuleBox x={280} y={45} w={120} h={42} label="Round 3~5" sub="수렴 → top-k 반환" color={C.lookup} />
              <motion.line x1={140} y1={66} x2={150} y2={66} stroke="var(--muted-foreground)" strokeWidth={1.5}
                markerEnd="url(#arr-l)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} />
              <motion.line x1={270} y1={66} x2={280} y2={66} stroke="var(--muted-foreground)" strokeWidth={1.5}
                markerEnd="url(#arr-l)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} />
              <defs>
                <marker id="arr-l" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                  <path d="M0,0 L6,3 L0,6 z" fill="var(--muted-foreground)" />
                </marker>
              </defs>
              <text x={240} y={120} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
                매 라운드 응답에서 d(node, T)가 단조 감소하는 노드만 선별.
              </text>
              <text x={240} y={140} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                병렬 α=3 — 한 노드가 느려도 나머지 2개로 라운드 진행.
              </text>
              <text x={240} y={160} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                target에 도달 못 해도 가까운 16개를 알아냄으로써 lookup 종료.
              </text>
            </motion.g>
          )}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.perf}>
                실전 성능 수치 (Ethereum mainnet)
              </text>
              <StatusBox x={30} y={45} w={195} h={50} label="Routing table" sub="≈ 16 buckets × 16 nodes" color={C.perf} progress={0.25} />
              <StatusBox x={255} y={45} w={195} h={50} label="Lookup latency" sub="3~5 rounds, < 1초" color={C.perf} progress={0.4} />
              <StatusBox x={30} y={110} w={195} h={50} label="메모리 풋프린트" sub="≈ 256 노드 메타데이터" color={C.perf} progress={0.2} />
              <StatusBox x={255} y={110} w={195} h={50} label="대역폭" sub="≈ 1 KB/lookup" color={C.perf} progress={0.15} />
              <text x={240} y={195} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                작고 빠르다 — 라우팅 테이블 전체가 1 KB 안쪽.
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
