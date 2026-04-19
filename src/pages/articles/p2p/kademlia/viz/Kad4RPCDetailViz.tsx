import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, DataBox, ModuleBox, StatusBox } from '@/components/viz/boxes';

const C = {
  ping: '#6366f1',
  store: '#10b981',
  findNode: '#f59e0b',
  findValue: '#8b5cf6',
  proto: '#0ea5e9',
  complexity: '#ef4444',
};

const STEPS = [
  {
    label: '1. PING — 노드 생존 확인',
    body: 'Liveness check, NAT keep-alive, Bootstrap 확인. 응답 PONG에는 보낸 노드 ID가 포함되어 인증된다.',
  },
  {
    label: '2. STORE(key, value) — DHT 값 저장',
    body: 'Content advertisement에 사용. TTL 24시간 기본, 메모리 또는 디스크에 저장한다.',
  },
  {
    label: '3. FIND_NODE(target) — k개 가까운 노드 반환',
    body: 'Peer discovery + Routing table population. XOR 거리 기반으로 k개 {id, IP, port}를 반환한다.',
  },
  {
    label: '4. FIND_VALUE(key) — 값 또는 가까운 노드',
    body: '값이 있으면 즉시 value, 없으면 k개의 가까운 노드를 반환한다. iterative 조회로 수렴한다.',
  },
  {
    label: '프로토콜 특성',
    body: 'UDP 기반, Stateless messages, Request ID로 매칭, Sender ID 포함하여 인증.',
  },
  {
    label: '복잡도: O(log n) rounds',
    body: '라운드당 α(=3)개 메시지 → 총 O(α · log n) ≈ O(log n). 100만 노드도 ~20 rounds.',
  },
];

export default function Kad4RPCDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="k4arr" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
              <path d="M0,0 L7,3.5 L0,7 Z" fill="#94a3b8" />
            </marker>
          </defs>

          {step <= 3 && (
            <>
              {/* Two nodes A and B */}
              <circle cx={70} cy={70} r={22}
                fill={[C.ping, C.store, C.findNode, C.findValue][step] + '20'}
                stroke={[C.ping, C.store, C.findNode, C.findValue][step]} strokeWidth={1.5} />
              <text x={70} y={74} textAnchor="middle" fontSize={11} fontWeight={700}
                fill={[C.ping, C.store, C.findNode, C.findValue][step]}>A</text>
              <text x={70} y={104} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">querier</text>

              <circle cx={410} cy={70} r={22}
                fill={[C.ping, C.store, C.findNode, C.findValue][step] + '20'}
                stroke={[C.ping, C.store, C.findNode, C.findValue][step]} strokeWidth={1.5} />
              <text x={410} y={74} textAnchor="middle" fontSize={11} fontWeight={700}
                fill={[C.ping, C.store, C.findNode, C.findValue][step]}>B</text>
              <text x={410} y={104} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">peer</text>

              {/* Request */}
              <motion.line key={`req-${step}`}
                x1={94} y1={62} x2={386} y2={62}
                stroke={[C.ping, C.store, C.findNode, C.findValue][step]} strokeWidth={1.6}
                markerEnd="url(#k4arr)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.5 }} />
              <motion.text key={`reql-${step}`} x={240} y={54} textAnchor="middle"
                fontSize={10} fontWeight={700}
                fill={[C.ping, C.store, C.findNode, C.findValue][step]}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                {['PING', 'STORE(key, value)', 'FIND_NODE(target)', 'FIND_VALUE(key)'][step]}
              </motion.text>

              {/* Response */}
              <motion.line key={`res-${step}`}
                x1={386} y1={82} x2={94} y2={82}
                stroke={[C.ping, C.store, C.findNode, C.findValue][step]} strokeWidth={1.4}
                strokeDasharray="5 3" markerEnd="url(#k4arr)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1, opacity: 0.7 }}
                transition={{ duration: 0.5, delay: 0.4 }} />
              <motion.text key={`resl-${step}`} x={240} y={97} textAnchor="middle"
                fontSize={10}
                fill={[C.ping, C.store, C.findNode, C.findValue][step]}
                fillOpacity={0.85}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                {['PONG (B의 ID)', 'ACK (저장 완료)', 'k개 {id, IP, port}', 'value 또는 k개 노드'][step]}
              </motion.text>

              {/* Use cases */}
              <motion.g key={`uc-${step}`}
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}>
                <text x={240} y={140} textAnchor="middle" fontSize={9} fontWeight={600}
                  fill="var(--muted-foreground)">용도</text>
                {(() => {
                  const uses = [
                    ['Liveness check', 'NAT keep-alive', 'Bootstrap'],
                    ['DHT value 저장', 'Content advert', 'TTL 24h'],
                    ['Peer discovery', 'Routing table 채움', 'k=20 기본'],
                    ['DHT value 조회', 'iterative 수렴', 'value or k nodes'],
                  ][step];
                  return uses.map((u, i) => (
                    <DataBox key={i} x={70 + i * 120} y={155} w={108} h={26}
                      label={u} color={[C.ping, C.store, C.findNode, C.findValue][step]} outlined />
                  ));
                })()}
              </motion.g>

              {/* TTL/notes for STORE */}
              {step === 1 && (
                <motion.text x={240} y={210} textAnchor="middle" fontSize={9}
                  fill="var(--muted-foreground)"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                  저장 위치: 메모리 또는 디스크
                </motion.text>
              )}
              {step === 3 && (
                <motion.text x={240} y={210} textAnchor="middle" fontSize={9}
                  fill="var(--muted-foreground)"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                  값 hit 시 즉시 종료, miss 시 다음 hop으로
                </motion.text>
              )}
            </>
          )}

          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
              <text x={240} y={28} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">프로토콜 4가지 특성</text>
              <ModuleBox x={30} y={50} w={100} h={50} label="UDP 기반" sub="L4 transport" color={C.proto} />
              <ModuleBox x={140} y={50} w={100} h={50} label="Stateless" sub="message 단위" color={C.proto} />
              <ModuleBox x={250} y={50} w={100} h={50} label="Request ID" sub="응답 매칭" color={C.proto} />
              <ModuleBox x={360} y={50} w={100} h={50} label="Sender ID" sub="신원 인증" color={C.proto} />

              <text x={240} y={130} textAnchor="middle" fontSize={10} fontWeight={600}
                fill="var(--muted-foreground)">특성 → 효과</text>
              <ActionBox x={30} y={148} w={130} h={36} label="저오버헤드"
                sub="connectionless" color="#22c55e" />
              <ActionBox x={175} y={148} w={130} h={36} label="단순 재시도"
                sub="state 없음" color="#22c55e" />
              <ActionBox x={320} y={148} w={130} h={36} label="동시 질의 가능"
                sub="ID로 구분" color="#22c55e" />
              <text x={240} y={206} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">α=3 동시 RPC를 단순하게 구현 가능한 이유</text>
            </motion.g>
          )}

          {step === 5 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
              <text x={240} y={28} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">복잡도 분석</text>
              <StatusBox x={30} y={50} w={130} h={52} label="Time"
                sub="O(log n) rounds" color={C.complexity} progress={0.3} />
              <StatusBox x={175} y={50} w={130} h={52} label="Per round"
                sub="α = 3 messages" color="#0ea5e9" progress={0.15} />
              <StatusBox x={320} y={50} w={130} h={52} label="Total"
                sub="O(log n)" color="#22c55e" progress={0.4} />

              <text x={240} y={130} textAnchor="middle" fontSize={10} fontWeight={600}
                fill="var(--muted-foreground)">실제 네트워크 크기별</text>
              <DataBox x={30} y={150} w={130} h={32}
                label="1만 노드" sub="~13 rounds" color={C.complexity} outlined />
              <DataBox x={175} y={150} w={130} h={32}
                label="100만 노드" sub="~20 rounds" color={C.complexity} outlined />
              <DataBox x={320} y={150} w={130} h={32}
                label="10억 노드" sub="~30 rounds" color={C.complexity} outlined />
              <text x={240} y={205} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">로그 스케일이라 N이 커져도 거의 일정한 hop 수</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
