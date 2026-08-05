import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox, StatusBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { def: '#6366f1', flow: '#10b981', attack: '#ef4444', nat: '#f59e0b', const_: '#a78bfa' };

const STEPS = [
  {
    label: 'Bond = "최근 양방향 통신 검증"',
    body: 'Bonded 판정: 24시간 내 PING/PONG 성공.\n양방향 모두 검증 — 한 방향만으로는 부족.',
  },
  {
    label: '4-step bond establishment',
    body: '1) A → B: PING.\n2) B → A: PONG (A의 주소 확인).\n3) B → A: PING (역방향 검증).\n4) A → B: PONG.\n네 단계로 양면 확립.',
  },
  {
    label: 'IP Spoofing 방어 — 왜 필요한가',
    body: '공격자 C가 victim V의 IP로 spoofed FINDNODE.\nbond 없이 → B가 V에게 큰 NEIGHBORS 응답.\n→ V의 대역폭 소진 (amplification).',
  },
  {
    label: 'Bond requirement → 공격 차단',
    body: 'PING이 먼저 가야 함.\nspoofed IP는 PONG 못 받음 → bond 실패.\n공격자는 victim 주소로 bonded 상태 유지 불가.',
  },
  {
    label: 'NAT Traversal — Pong.To 자체 활용',
    body: 'Bob이 본 Alice의 외부 IP를 Pong.To로 알려줌.\nAlice는 여러 노드 진술을 IPTracker에 누적.\n10+ 일치 시 ENR 갱신 — STUN 불필요.',
  },
  {
    label: '주요 상수',
    body: 'bondExpiration = 24h.\nrespTimeout = 500ms.\nexpiration = 20s (패킷 TTL).\nmaxFindnodeFailures = 5 → 재bond 시도.',
  },
];

export default function BondMechanismViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 230" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.def}>
                Bond — Two-way verified communication
              </text>
              <ModuleBox x={130} y={45} w={220} h={55} label="Bond" sub="last_pong_received < 24h" color={C.def} />
              <DataBox x={70} y={120} w={150} h={32} label="A → B: 검증 완료" color={C.def} outlined />
              <DataBox x={260} y={120} w={150} h={32} label="B → A: 검증 완료" color={C.def} outlined />
              <text x={240} y={180} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
                양방향 모두 — 한 방향 PING/PONG만으로는 bond가 아니다.
              </text>
              <text x={240} y={200} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                FINDNODE/ENRRequest 전 반드시 bond 확인 (ensureBond).
              </text>
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.flow}>
                4-step Bond Establishment
              </text>
              <ActionBox x={20} y={45} w={100} h={42} label="1: PING" sub="A → B" color={C.flow} />
              <ActionBox x={130} y={45} w={100} h={42} label="2: PONG" sub="B → A" color={C.flow} />
              <ActionBox x={240} y={45} w={100} h={42} label="3: PING" sub="B → A" color={C.flow} />
              <ActionBox x={350} y={45} w={100} h={42} label="4: PONG" sub="A → B" color={C.flow} />
              <motion.line x1={120} y1={66} x2={130} y2={66} stroke={C.flow} strokeWidth={1.5}
                markerEnd="url(#arr-bf)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} />
              <motion.line x1={230} y1={66} x2={240} y2={66} stroke={C.flow} strokeWidth={1.5}
                markerEnd="url(#arr-bf)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} />
              <motion.line x1={340} y1={66} x2={350} y2={66} stroke={C.flow} strokeWidth={1.5}
                markerEnd="url(#arr-bf)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} />
              <defs>
                <marker id="arr-bf" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                  <path d="M0,0 L6,3 L0,6 z" fill={C.flow} />
                </marker>
              </defs>
              <text x={240} y={120} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
                양쪽 모두 상대 주소를 확인 — bond 양면 완성.
              </text>
              <text x={240} y={145} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                실전: 1+2 후에도 bond 인정 — 3+4는 상대가 us를 검증하는 별도 사이클.
              </text>
              <text x={240} y={165} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                respTimeout = 500ms 안에 응답 없으면 실패 처리.
              </text>
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.attack}>
                Amplification Attack (no bond 시)
              </text>
              <DataBox x={30} y={50} w={120} h={32} label="Attacker C" color={C.attack} outlined />
              <DataBox x={180} y={50} w={120} h={32} label="Server B" color={C.def} outlined />
              <DataBox x={330} y={50} w={120} h={32} label="Victim V" color={C.attack} outlined />
              <motion.line x1={150} y1={66} x2={180} y2={66} stroke={C.attack} strokeWidth={1.5}
                markerEnd="url(#arr-attack)"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} />
              <text x={165} y={56} textAnchor="middle" fontSize={7.5} fill={C.attack}>spoofed src=V</text>
              <motion.line x1={300} y1={66} x2={330} y2={66} stroke={C.attack} strokeWidth={2}
                markerEnd="url(#arr-attack-big)"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} />
              <text x={315} y={56} textAnchor="middle" fontSize={7.5} fill={C.attack}>1KB+ NEIGHBORS</text>
              <defs>
                <marker id="arr-attack" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                  <path d="M0,0 L6,3 L0,6 z" fill={C.attack} />
                </marker>
                <marker id="arr-attack-big" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                  <path d="M0,0 L8,4 L0,8 z" fill={C.attack} />
                </marker>
              </defs>
              <AlertBox x={130} y={120} w={220} h={50} label="36B request → 1264B response" sub="35x amplification" color={C.attack} />
              <text x={240} y={195} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                bond 요구가 없으면 victim의 대역폭이 폭증.
              </text>
            </motion.g>
          )}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.flow}>
                Bond requirement가 공격을 무력화
              </text>
              <DataBox x={30} y={50} w={120} h={32} label="Attacker C" color={C.attack} outlined />
              <DataBox x={180} y={50} w={120} h={32} label="Server B" color={C.def} outlined />
              <DataBox x={330} y={50} w={120} h={32} label="Victim V" color={C.def} outlined />
              <text x={165} y={94} textAnchor="middle" fontSize={9} fill={C.def}>1) PING (먼저)</text>
              <motion.line x1={150} y1={70} x2={180} y2={70} stroke={C.def} strokeWidth={1.5}
                markerEnd="url(#arr-d)"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} />
              <text x={315} y={94} textAnchor="middle" fontSize={9} fill={C.def}>2) PONG → V로 전송</text>
              <motion.line x1={300} y1={70} x2={330} y2={70} stroke={C.def} strokeWidth={1.5}
                markerEnd="url(#arr-d)"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} />
              <defs>
                <marker id="arr-d" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                  <path d="M0,0 L6,3 L0,6 z" fill={C.def} />
                </marker>
              </defs>
              <ModuleBox x={130} y={130} w={220} h={50} label="V는 PONG 못 받음" sub="공격자 C는 PONG 받지 못함" color={C.flow} />
              <text x={240} y={205} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                bond 실패 → 이후 FINDNODE도 거절. 공격 무력화.
              </text>
            </motion.g>
          )}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.nat}>
                NAT Traversal — Pong.To 자체 활용
              </text>
              <DataBox x={20} y={45} w={140} h={42} label="Alice (NAT 뒤)" sub="internal: 192.168.1.10" color={C.nat} outlined />
              <DataBox x={170} y={45} w={140} h={42} label="Bob #1" sub="external view" color={C.nat} outlined />
              <DataBox x={320} y={45} w={140} h={42} label="Bob #2" sub="external view" color={C.nat} outlined />
              <text x={90} y={108} fontSize={8} fill={C.nat}>↓ PING</text>
              <text x={240} y={108} fontSize={8} fill={C.nat}>"to: 203.0.113.5:40000"</text>
              <text x={390} y={108} fontSize={8} fill={C.nat}>"to: 203.0.113.5:40001"</text>
              <ModuleBox x={140} y={130} w={200} h={50} label="IPTracker 누적" sub="10+ 진술 일치 → 외부 IP 확정" color={C.nat} />
              <text x={240} y={205} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                STUN 서버 없이 P2P 네트워크 자체로 외부 주소 발견 → ENR 갱신.
              </text>
            </motion.g>
          )}
          {step === 5 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.const_}>
                discv4 timing constants
              </text>
              <StatusBox x={30} y={45} w={195} h={50} label="bondExpiration" sub="24 hours" color={C.const_} progress={1} />
              <StatusBox x={255} y={45} w={195} h={50} label="respTimeout" sub="500 ms" color={C.const_} progress={0.05} />
              <StatusBox x={30} y={110} w={195} h={50} label="expiration (TTL)" sub="20 seconds" color={C.const_} progress={0.2} />
              <StatusBox x={255} y={110} w={195} h={50} label="maxFindnodeFailures" sub="5 → re-bond" color={C.const_} progress={0.5} />
              <text x={240} y={195} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                24h → 충분히 길어 PING flood 방지, 충분히 짧아 stale 노드 정리.
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
