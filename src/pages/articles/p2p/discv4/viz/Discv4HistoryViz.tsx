import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, AlertBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { goal: '#6366f1', kad: '#10b981', eth: '#f59e0b', limit: '#ef4444' };

const STEPS = [
  {
    label: '설계 목표 — 탈중앙 P2P 디스커버리',
    body: '2016년, Ethereum이 Bittorrent와 다른 점을 풀어야 했다.\n중앙 부트스트랩 서버 없이, UDP 위에서, Sybil에 강한 노드 발견.',
  },
  {
    label: '기반: Kademlia DHT (2002)',
    body: 'Maymounkov & Mazières가 정의한 XOR 거리 메트릭.\nk-buckets(k=16), O(log n) lookup, 확률적 라우팅.',
  },
  {
    label: 'Ethereum 특화 변형',
    body: '256-bit node ID = Keccak(pubkey).\n패킷마다 ECDSA 서명 — 발신자 자동 인증.\nUDP 1280B 한계 + 30303 포트.',
  },
  {
    label: '6가지 패킷 타입',
    body: 'PING / PONG: 생존 확인.\nFINDNODE / NEIGHBORS: Kademlia 검색.\nENRREQUEST / ENRRESPONSE: 노드 레코드 교환.',
  },
  {
    label: '한계 — discv5에서 풀린다',
    body: '서명만, 암호화 없음.\nFINDNODE 36B → NEIGHBORS 1KB+ 증폭.\n토픽 디스커버리 부재.',
  },
];

export default function Discv4HistoryViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.goal}>
                discv4 = Ethereum 노드 발견 (2016~)
              </text>
              <DataBox x={30} y={50} w={120} h={40} label="No central server" sub="탈중앙" color={C.goal} outlined />
              <DataBox x={180} y={50} w={120} h={40} label="UDP, stateless" sub="빠르고 가벼움" color={C.goal} outlined />
              <DataBox x={330} y={50} w={120} h={40} label="Sybil 저항" sub="암호화 ID" color={C.goal} outlined />
              <text x={240} y={130} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
                ▼ 이 세 목표를 만족하는 베이스 알고리즘이 필요했다.
              </text>
              <ModuleBox x={170} y={150} w={140} h={45} label="Kademlia DHT" sub="2002, MIT" color={C.kad} />
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.kad}>
                Kademlia 핵심 4가지
              </text>
              <DataBox x={30} y={50} w={195} h={36} label="XOR distance" sub="d(a,b) = a ⊕ b" color={C.kad} outlined />
              <DataBox x={255} y={50} w={195} h={36} label="k-buckets (k=16)" sub="LRU eviction" color={C.kad} outlined />
              <DataBox x={30} y={100} w={195} h={36} label="O(log n) lookup" sub="3~5 rounds 충분" color={C.kad} outlined />
              <DataBox x={255} y={100} w={195} h={36} label="확률적 라우팅" sub="견고함, 부분 실패 허용" color={C.kad} outlined />
              <text x={240} y={170} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                XOR이 핵심 — 거리에 방향 없음. 두 노드가 같은 거리표를 본다.
              </text>
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.eth}>
                Kademlia → discv4 변형 포인트
              </text>
              <ModuleBox x={30} y={45} w={195} h={50} label="256-bit node ID" sub="Keccak(pubkey)" color={C.eth} />
              <ModuleBox x={255} y={45} w={195} h={50} label="ECDSA per packet" sub="발신자 자동 도출" color={C.eth} />
              <ModuleBox x={30} y={110} w={195} h={50} label="1280B 패킷 상한" sub="UDP MTU 안전 마진" color={C.eth} />
              <ModuleBox x={255} y={110} w={195} h={50} label="UDP/30303" sub="기본 디스커버리 포트" color={C.eth} />
              <text x={240} y={185} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                서명이 핸드셰이크를 대체한다 — stateless 유지가 가능한 이유.
              </text>
            </motion.g>
          )}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.eth}>
                6가지 패킷 타입
              </text>
              <DataBox x={30} y={45} w={130} h={32} label="0x01 PING" sub="liveness" color={C.eth} outlined />
              <DataBox x={175} y={45} w={130} h={32} label="0x02 PONG" sub="reply" color={C.eth} outlined />
              <DataBox x={320} y={45} w={130} h={32} label="0x03 FINDNODE" sub="lookup" color={C.eth} outlined />
              <DataBox x={30} y={90} w={130} h={32} label="0x04 NEIGHBORS" sub="reply (≤12)" color={C.eth} outlined />
              <DataBox x={175} y={90} w={130} h={32} label="0x05 ENRREQUEST" sub="record req" color={C.eth} outlined />
              <DataBox x={320} y={90} w={130} h={32} label="0x06 ENRRESPONSE" sub="record reply" color={C.eth} outlined />
              <text x={240} y={155} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
                PING/PONG = bond, FINDNODE/NEIGHBORS = 검색, ENR* = 메타데이터.
              </text>
              <text x={240} y={175} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                3쌍의 요청-응답으로 모든 디스커버리가 끝난다.
              </text>
            </motion.g>
          )}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.limit}>
                discv4의 한계 → discv5가 푼다
              </text>
              <AlertBox x={30} y={45} w={195} h={50} label="No encryption" sub="평문 — signed only" color={C.limit} />
              <AlertBox x={255} y={45} w={195} h={50} label="Amplification" sub="36B → 1KB+ 응답" color={C.limit} />
              <AlertBox x={30} y={110} w={195} h={50} label="No topic discovery" sub="서비스 광고 불가" color={C.limit} />
              <AlertBox x={255} y={110} w={195} h={50} label="Eclipse attack" sub="k-bucket 조작 여지" color={C.limit} />
              <text x={240} y={185} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                네 가지 모두 discv5에서 명시적 완화 — WHOAREYOU + AES-GCM + 거리 기반 FINDNODE.
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
