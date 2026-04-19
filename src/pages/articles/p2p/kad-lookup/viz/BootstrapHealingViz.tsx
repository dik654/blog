import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, AlertBox, DataBox, ModuleBox, StatusBox } from '@/components/viz/boxes';

const C = {
  problem: '#ef4444',
  boot: '#6366f1',
  dns: '#10b981',
  db: '#f59e0b',
  self: '#8b5cf6',
  random: '#0ea5e9',
  heal: '#22c55e',
};

const STEPS = [
  {
    label: 'Bootstrap 문제 — 아무도 모르는 상태',
    body: '새 노드가 네트워크에 연결하려면 최소 1개의 known peer가 필요하다.',
  },
  {
    label: '해결책 1: Hardcoded Bootnodes',
    body: '클라이언트에 내장된 공개 노드 리스트. Ethereum 예: EF, Nethermind 등 enode URL.',
  },
  {
    label: '해결책 2: DNS Discovery (EIP-1459)',
    body: 'enrtree://... URL → DNS TXT records에 ENR 리스트. 동적 갱신, 검열 내성.',
  },
  {
    label: '해결책 3: Persistent DB',
    body: 'seedCount=30, seedMaxAge=5d. 이전 세션 노드를 DB에서 재사용.',
  },
  {
    label: 'Bootstrap 이후: Self + Random Lookup',
    body: 'self lookup으로 이웃 발견, random lookup ×3으로 다양한 distance 범위 커버.',
  },
  {
    label: 'Refresh cycle — Jitter + Trigger',
    body: '15~30분 랜덤 타이머 (thundering herd 방지). Timer/Empty bucket/Lookup failure 트리거.',
  },
  {
    label: 'Peer Churn Handling — Network Healing',
    body: '일일 온라인 ~5000, 평균 uptime 12h. Refresh + DB fallback으로 자동 복구.',
  },
];

export default function BootstrapHealingViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="bharr" markerWidth="6" markerHeight="6" refX="5.5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="#94a3b8" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <text x={240} y={22} textAnchor="middle" fontSize={11} fontWeight={700}
                fill={C.problem}>Chicken-and-egg 문제</text>

              <circle cx={120} cy={130} r={30} fill={C.problem + '20'} stroke={C.problem} strokeWidth={1.8} />
              <text x={120} y={128} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.problem}>N</text>
              <text x={120} y={142} textAnchor="middle" fontSize={8} fill={C.problem}>new node</text>

              <text x={280} y={70} fontSize={9} fontWeight={700} fill={C.problem}>peer 목록 = ∅</text>
              <AlertBox x={250} y={82} w={200} h={36}
                label="query 전송 불가" sub="목표 IP 모름" color={C.problem} />
              <AlertBox x={250} y={128} w={200} h={36}
                label="routing table 비어있음" sub="bucket 채울 수 없음" color={C.problem} />

              <text x={240} y={200} textAnchor="middle" fontSize={9} fontWeight={600}
                fill={C.problem}>필요: 최소 1개 known peer (IP:port)</text>
              <text x={240} y={220} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">→ 3가지 해결책 (bootnodes / DNS / DB)</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <text x={240} y={22} textAnchor="middle" fontSize={11} fontWeight={700}
                fill={C.boot}>Hardcoded Bootnodes</text>

              <ModuleBox x={140} y={42} w={200} h={36}
                label="Client binary" sub="내장 enode list" color={C.boot} />

              <line x1={240} y1={78} x2={120} y2={110} stroke="#94a3b8" strokeWidth={1} markerEnd="url(#bharr)" />
              <line x1={240} y1={78} x2={240} y2={110} stroke="#94a3b8" strokeWidth={1} markerEnd="url(#bharr)" />
              <line x1={240} y1={78} x2={360} y2={110} stroke="#94a3b8" strokeWidth={1} markerEnd="url(#bharr)" />

              <DataBox x={40} y={118} w={160} h={48}
                label="EF node" sub="18.138.108.67:30303" color={C.boot} outlined />
              <DataBox x={160} y={118} w={160} h={48}
                label="Nethermind" sub="3.209.45.79:30303" color={C.boot} outlined />
              <DataBox x={280} y={118} w={160} h={48}
                label="기타 staker" sub="여러 enode URL" color={C.boot} outlined />

              <text x={240} y={192} textAnchor="middle" fontSize={9} fontWeight={600}
                fill={C.problem}>장단점</text>
              <text x={240} y={208} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">+ 즉시 연결, 가장 단순 / − 내장 노드 down 시 network 분리</text>
              <text x={240} y={224} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">− 클라이언트 업그레이드 없이 갱신 불가</text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <text x={240} y={22} textAnchor="middle" fontSize={11} fontWeight={700}
                fill={C.dns}>DNS Discovery (EIP-1459)</text>

              <ModuleBox x={30} y={50} w={140} h={56}
                label="enrtree://..." sub="루트 URL" color={C.dns} />
              <ModuleBox x={180} y={50} w={140} h={56}
                label="DNS TXT record" sub="tree 구조" color={C.dns} />
              <ModuleBox x={330} y={50} w={140} h={56}
                label="ENR list" sub="수백 개 노드" color={C.dns} />

              <line x1={170} y1={78} x2={180} y2={78} stroke="#94a3b8" strokeWidth={1} markerEnd="url(#bharr)" />
              <line x1={320} y1={78} x2={330} y2={78} stroke="#94a3b8" strokeWidth={1} markerEnd="url(#bharr)" />

              <text x={240} y={134} textAnchor="middle" fontSize={10} fontWeight={600}
                fill="var(--muted-foreground)">장점</text>
              <ActionBox x={30} y={150} w={210} h={48}
                label="동적 노드 리스트" sub="클라이언트 재시작 불필요" color={C.dns} />
              <ActionBox x={250} y={150} w={210} h={48}
                label="검열 내성" sub="DNS 여러 resolver" color={C.dns} />
              <text x={240} y={218} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">ENR = Ethereum Node Record (signed, versioned)</text>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <text x={240} y={22} textAnchor="middle" fontSize={11} fontWeight={700}
                fill={C.db}>Persistent DB — 이전 세션 재사용</text>

              <ModuleBox x={170} y={42} w={140} h={52}
                label="nodeDB (LevelDB)" sub="disk-persistent" color={C.db} />

              <line x1={240} y1={94} x2={240} y2={120} stroke="#94a3b8" strokeWidth={1} markerEnd="url(#bharr)" />

              <DataBox x={100} y={128} w={120} h={40}
                label="seedCount = 30" sub="최대 시드 개수" color={C.db} outlined />
              <DataBox x={260} y={128} w={120} h={40}
                label="seedMaxAge = 5d" sub="유효 기간" color={C.db} outlined />

              <text x={240} y={190} textAnchor="middle" fontSize={9} fontWeight={600}
                fill="var(--muted-foreground)">loadSeedNodes() 동작</text>
              <text x={240} y={208} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">DB 30개 + bootnodes (nursery) 합쳐 초기 라우팅 구성</text>
              <text x={240} y={225} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">5일 이상 안 본 노드는 폐기 — churn 고려</text>
            </motion.g>
          )}

          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <text x={240} y={22} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">Bootstrap 이후 lookup 전략</text>

              <ActionBox x={30} y={50} w={180} h={52}
                label="1. Self lookup" sub="target = own Node ID" color={C.self} />
              <ActionBox x={270} y={50} w={180} h={52}
                label="2. Random lookup × 3" sub="랜덤 Node ID target" color={C.random} />

              <line x1={210} y1={76} x2={270} y2={76} stroke="#94a3b8" strokeWidth={1} markerEnd="url(#bharr)" />

              <text x={120} y={130} textAnchor="middle" fontSize={9} fontWeight={600}
                fill={C.self}>목적</text>
              <DataBox x={30} y={144} w={180} h={36}
                label="이웃 발견 (가까운 버킷)" sub="자기 ID 근처 채움" color={C.self} outlined />

              <text x={360} y={130} textAnchor="middle" fontSize={9} fontWeight={600}
                fill={C.random}>목적</text>
              <DataBox x={270} y={144} w={180} h={36}
                label="다양성 확보 (먼 버킷)" sub="distance 전 범위 커버" color={C.random} outlined />

              <text x={240} y={210} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">self만 하면 자기 prefix 근처만 채워짐 → random 필수</text>
              <text x={240} y={228} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">doRefresh()는 매 refresh마다 이 패턴 반복</text>
            </motion.g>
          )}

          {step === 5 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <text x={240} y={22} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">Refresh Cycle — Jitter + Trigger</text>

              {/* Timeline */}
              <text x={30} y={60} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">타이머</text>
              <StatusBox x={80} y={46} w={370} h={30}
                label="15 ~ 30분 랜덤 jitter" sub="thundering herd 방지" color={C.self} progress={0.5} />

              <text x={240} y={100} textAnchor="middle" fontSize={10} fontWeight={600}
                fill="var(--muted-foreground)">Trigger 4가지</text>

              {[
                { t: 'Timer expiry', s: '15~30분 주기', x: 20 },
                { t: 'Bucket empty', s: '긴급 healing', x: 140 },
                { t: 'Lookup failure', s: 'churn 감지', x: 260 },
                { t: 'Manual', s: 'RPC/CLI', x: 380 },
              ].map((tr, i) => (
                <motion.g key={i}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 * i }}>
                  <ActionBox x={tr.x} y={118} w={105} h={48} label={tr.t} sub={tr.s} color={C.heal} />
                </motion.g>
              ))}

              <text x={240} y={184} textAnchor="middle" fontSize={9} fontWeight={600}
                fill={C.problem}>Jitter 없으면</text>
              <AlertBox x={50} y={198} w={380} h={30}
                label="전체 노드 동시 refresh → 네트워크 burst" sub="load spike" color={C.problem} />
            </motion.g>
          )}

          {step === 6 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <text x={240} y={22} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">Ethereum Peer Churn 통계</text>

              <text x={30} y={60} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">daily 온라인</text>
              <StatusBox x={110} y={46} w={340} h={30}
                label="≈ 5,000 nodes" sub="전체 수만 중" color={C.boot} progress={0.3} />

              <text x={30} y={92} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">avg uptime</text>
              <StatusBox x={110} y={78} w={340} h={30}
                label="≈ 12 시간" sub="churn ~2x/day" color={C.problem} progress={0.5} />

              <text x={240} y={130} textAnchor="middle" fontSize={10} fontWeight={600}
                fill="var(--muted-foreground)">복구 전략</text>
              <ActionBox x={20} y={148} w={145} h={48}
                label="Aggressive refresh" sub="30분 주기" color={C.heal} />
              <ActionBox x={172} y={148} w={145} h={48}
                label="DB fallback" sub="재시작 복구" color={C.heal} />
              <ActionBox x={324} y={148} w={145} h={48}
                label="DNS / bootnodes" sub="partition healing" color={C.heal} />
              <text x={240} y={216} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">노드 대량 disconnect 시 → re-bootstrap 자동 시작</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
