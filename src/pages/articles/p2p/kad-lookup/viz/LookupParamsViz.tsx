import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, AlertBox, DataBox, ModuleBox, StatusBox } from '@/components/viz/boxes';

const C = {
  k: '#6366f1',
  alpha: '#f59e0b',
  ttl: '#10b981',
  to: '#ef4444',
  eth: '#8b5cf6',
  ok: '#22c55e',
};

const STEPS = [
  {
    label: 'k (bucket size) — redundancy 인자',
    body: '버킷당 노드 수. ETH=16, IPFS/Libp2p=20. 클수록 redundancy ↑ 메모리 ↑.',
  },
  {
    label: 'α (concurrency) = 3',
    body: '동시 병렬 query 수. 느린/죽은 peer에 강건. α↑ 빨라지지만 대역폭 ↑.',
  },
  {
    label: 'TTL — refresh interval (1h)',
    body: '주기적 bucket refresh. 죽은 entry evict, 새 노드 발견 — 라우팅 freshness 유지.',
  },
  {
    label: 'Query timeout (500ms ~ 2s)',
    body: '너무 짧으면 slow peer miss, 너무 길면 lookup 자체가 느려짐.',
  },
  {
    label: 'Ethereum 특수 사항',
    body: '256-bit Node ID (keccak256 of pubkey), UDP 기반, 패킷 ≤ 1280 byte.',
  },
  {
    label: '성능 예상 — 10k 노드 기준',
    body: 'log2(10000) ≈ 13 hops max. 평균 200~500ms latency. α=3 병렬로 더 빠름.',
  },
];

export default function LookupParamsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <text x={240} y={22} textAnchor="middle" fontSize={11} fontWeight={700}
                fill={C.k}>k = bucket size (per distance band)</text>

              <text x={120} y={56} textAnchor="middle" fontSize={9} fontWeight={600}
                fill="var(--muted-foreground)">k=8 (Bitcoin)</text>
              <StatusBox x={30} y={68} w={180} h={36}
                label="redundancy 낮음" sub="메모리 효율적" color={C.alpha} progress={0.4} />

              <text x={355} y={56} textAnchor="middle" fontSize={9} fontWeight={600}
                fill="var(--muted-foreground)">k=20 (IPFS)</text>
              <StatusBox x={265} y={68} w={180} h={36}
                label="redundancy 높음" sub="메모리/네트워크 ↑" color={C.ok} progress={1} />

              <text x={240} y={130} textAnchor="middle" fontSize={10} fontWeight={600}
                fill="var(--muted-foreground)">Ethereum 선택: k = 16 (sweet spot)</text>

              <DataBox x={30} y={150} w={130} h={36}
                label="Bitcoin" sub="k = 8" color={C.alpha} outlined />
              <DataBox x={175} y={150} w={130} h={36}
                label="ETH discv4/5" sub="k = 16" color={C.eth} outlined />
              <DataBox x={320} y={150} w={130} h={36}
                label="IPFS / Libp2p" sub="k = 20" color={C.ok} outlined />
              <text x={240} y={210} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">k는 lookup 결과 크기와 동일 (top-k 반환)</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <text x={240} y={22} textAnchor="middle" fontSize={11} fontWeight={700}
                fill={C.alpha}>α = 3 — 동시 query 수</text>

              {/* Querier with 3 simultaneous arrows */}
              <circle cx={240} cy={120} r={26} fill={C.alpha + '20'} stroke={C.alpha} strokeWidth={1.6} />
              <text x={240} y={124} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.alpha}>Q</text>

              {[
                { x: 70, y: 60, name: 'P1' },
                { x: 410, y: 60, name: 'P2' },
                { x: 240, y: 215, name: 'P3' },
              ].map((p, i) => (
                <g key={i}>
                  <circle cx={p.x} cy={p.y} r={18} fill={C.alpha + '15'} stroke={C.alpha} strokeWidth={1.2} />
                  <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.alpha}>{p.name}</text>
                  <motion.line
                    x1={i === 2 ? 240 : (i === 0 ? 220 : 260)}
                    y1={i === 2 ? 146 : 108}
                    x2={p.x + (i === 0 ? 16 : i === 1 ? -16 : 0)}
                    y2={p.y + (i === 2 ? -16 : 14)}
                    stroke={C.alpha} strokeWidth={1.5}
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ delay: 0.2 }} />
                </g>
              ))}

              <text x={240} y={50} textAnchor="middle" fontSize={9} fontWeight={600}
                fill={C.alpha}>3개 병렬 RPC 동시 fire</text>
              <text x={240} y={232} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">α=3은 경험적 sweet spot — 빠른 응답이 lookup 진행</text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <text x={240} y={22} textAnchor="middle" fontSize={11} fontWeight={700}
                fill={C.ttl}>TTL = 1 hour — 주기적 refresh</text>

              {/* timeline */}
              <line x1={30} y1={120} x2={450} y2={120} stroke="#94a3b8" strokeWidth={1} />

              {[0, 1, 2, 3, 4].map((t) => (
                <motion.g key={t}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 * t }}>
                  <circle cx={50 + t * 100} cy={120} r={8} fill={C.ttl} />
                  <text x={50 + t * 100} y={108} textAnchor="middle" fontSize={9}
                    fontWeight={600} fill={C.ttl}>{`t=${t}h`}</text>
                  <text x={50 + t * 100} y={142} textAnchor="middle" fontSize={8}
                    fill="var(--muted-foreground)">refresh</text>
                </motion.g>
              ))}

              <text x={240} y={170} textAnchor="middle" fontSize={10} fontWeight={600}
                fill="var(--muted-foreground)">매 refresh: 죽은 entry evict + 새 노드 채움</text>
              <ActionBox x={50} y={188} w={170} h={36}
                label="Liveness 갱신" sub="PING + drop dead" color={C.ttl} />
              <ActionBox x={260} y={188} w={170} h={36}
                label="Diversity 확보" sub="random lookup ×3" color={C.ttl} />
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <text x={240} y={22} textAnchor="middle" fontSize={11} fontWeight={700}
                fill={C.to}>Query Timeout 트레이드오프</text>

              <text x={120} y={56} textAnchor="middle" fontSize={9} fontWeight={600}
                fill="var(--muted-foreground)">너무 짧음 (100ms)</text>
              <AlertBox x={30} y={68} w={180} h={56}
                label="slow peer miss" sub="lookup 품질 ↓" color={C.to} />

              <text x={355} y={56} textAnchor="middle" fontSize={9} fontWeight={600}
                fill="var(--muted-foreground)">너무 김 (5s)</text>
              <AlertBox x={265} y={68} w={180} h={56}
                label="lookup latency ↑" sub="dead peer wait" color={C.to} />

              <text x={240} y={144} textAnchor="middle" fontSize={10} fontWeight={700}
                fill={C.ok}>실전 범위: 500ms ~ 2초</text>
              <StatusBox x={140} y={158} w={200} h={42}
                label="Ethereum 기본" sub="500ms (조정 가능)" color={C.ok} progress={0.4} />
              <text x={240} y={224} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">network RTT 분포에 맞춰 조정 — geo 분산 환경 고려</text>
            </motion.g>
          )}

          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <text x={240} y={22} textAnchor="middle" fontSize={11} fontWeight={700}
                fill={C.eth}>Ethereum discv4/v5 특수 규격</text>

              <ModuleBox x={20} y={50} w={140} h={56}
                label="256-bit Node ID" sub="keccak256(pubkey)" color={C.eth} />
              <ModuleBox x={170} y={50} w={140} h={56}
                label="UDP transport" sub="connectionless" color={C.eth} />
              <ModuleBox x={320} y={50} w={140} h={56}
                label="≤ 1280 byte/pkt" sub="MTU 안전 마진" color={C.eth} />

              <text x={240} y={130} textAnchor="middle" fontSize={10} fontWeight={600}
                fill="var(--muted-foreground)">설계 이유</text>

              <DataBox x={20} y={148} w={140} h={36}
                label="ID 256-bit" sub="keccak 표준" color={C.eth} outlined />
              <DataBox x={170} y={148} w={140} h={36}
                label="UDP" sub="lightweight discovery" color={C.eth} outlined />
              <DataBox x={320} y={148} w={140} h={36}
                label="IPv6 MTU 안전" sub="fragmentation 회피" color={C.eth} outlined />
              <text x={240} y={210} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">FINDNODE 응답이 큰 경우 여러 패킷으로 분할</text>
            </motion.g>
          )}

          {step === 5 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <text x={240} y={22} textAnchor="middle" fontSize={11} fontWeight={700}
                fill={C.ok}>10k 노드 네트워크 성능 추정</text>

              <text x={30} y={60} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">Hops</text>
              <StatusBox x={80} y={46} w={370} h={28}
                label="log2(10000) ≈ 13 hops max" sub="실제 평균 ~10" color={C.k} progress={0.7} />

              <text x={30} y={92} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">RTT</text>
              <StatusBox x={80} y={78} w={370} h={28}
                label="200~500ms / hop" sub="UDP single round-trip" color={C.alpha} progress={0.4} />

              <text x={30} y={124} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">Total</text>
              <StatusBox x={80} y={110} w={370} h={28}
                label="α=3 병렬 → 4~5 effective rounds" sub="≈ 1~3초" color={C.ok} progress={0.55} />

              <text x={240} y={158} textAnchor="middle" fontSize={10} fontWeight={600}
                fill="var(--muted-foreground)">트레이드오프</text>
              <DataBox x={50} y={178} w={170} h={32}
                label="α 증가 → latency ↓" color={C.ok} outlined />
              <DataBox x={260} y={178} w={170} h={32}
                label="α 증가 → bandwidth ↑" color={C.to} outlined />
              <text x={240} y={224} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">α=3은 1MB/lookup 정도로 적당한 비용</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
