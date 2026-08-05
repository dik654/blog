import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox, StatusBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { amp: '#ef4444', def: '#10b981', split: '#6366f1', priv: '#f59e0b', impl: '#a78bfa' };

const STEPS = [
  {
    label: 'DDoS Amplification 위험 — 14배 증폭',
    body: 'FINDNODE ≈ 170 B (헤더 97 + pubkey 64 + ts 8).\nNeighbors ≈ 2400 B (1280 × 2 분할).\n→ 비율 ~14x.',
  },
  {
    label: '공격 시나리오',
    body: 'attacker가 victim IP로 spoofed FINDNODE 송신.\nServer가 victim에게 큰 응답 flooding.\n→ victim 대역폭 소진.',
  },
  {
    label: 'Bond requirement → 차단',
    body: 'unbonded 요청은 verifyFindnode에서 거절.\nbond는 24시간 내 PING/PONG 성공이 조건.\nspoofed src는 PONG 못 받음 → bond 불가.',
  },
  {
    label: 'Packet 분할 — 12 노드/패킷',
    body: 'Max UDP = 1280 B, node entry ≈ 90 B → 12개/패킷.\nbucketSize=16이므로 12+4 또는 12+12 = 2 packets.',
  },
  {
    label: 'Privacy: discv4 vs discv5',
    body: 'discv4: target = pubkey (64B) — 임의 키로 구조 파악 가능.\ndiscv5: target = log-distance 배열 — 대상 비공개.',
  },
  {
    label: '구현 노트 — 거리 정렬 + pending 매칭',
    body: 'XOR distance 256-bit, target 기준 sort.\nTop-k(=16) 반환.\npending request tracker로 응답-요청 매칭, duplicate 처리.',
  },
];

export default function FindnodeSecurityViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 230" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.amp}>
                Amplification 14x
              </text>
              <DataBox x={50} y={50} w={120} h={42} label="FINDNODE" sub="≈ 170 B" color={C.amp} outlined />
              <text x={195} y={75} fontSize={14} fill="var(--muted-foreground)">→</text>
              <DataBox x={220} y={50} w={210} h={42} label="Neighbors" sub="≈ 2400 B (1280 × 2)" color={C.amp} outlined />
              <StatusBox x={120} y={120} w={240} h={50} label="14x amplification" sub="작은 요청 → 큰 응답" color={C.amp} progress={1} />
              <text x={240} y={195} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                bond requirement가 없으면 victim에게 14배 폭탄.
              </text>
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.amp}>
                공격 시나리오 (no bond)
              </text>
              <DataBox x={20} y={50} w={120} h={42} label="Attacker" sub="src IP를 V로 위조" color={C.amp} outlined />
              <DataBox x={180} y={50} w={120} h={42} label="Server" sub="bond 검사 안 함" color={C.amp} outlined />
              <DataBox x={340} y={50} w={120} h={42} label="Victim" sub="공격 대상" color={C.amp} outlined />
              <motion.line x1={140} y1={70} x2={180} y2={70} stroke={C.amp} strokeWidth={1.5}
                markerEnd="url(#a-fs)"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} />
              <text x={160} y={62} textAnchor="middle" fontSize={7.5} fill={C.amp}>170B</text>
              <motion.line x1={300} y1={70} x2={340} y2={70} stroke={C.amp} strokeWidth={2.5}
                markerEnd="url(#a-fs-big)"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} />
              <text x={320} y={62} textAnchor="middle" fontSize={7.5} fill={C.amp}>2400B</text>
              <defs>
                <marker id="a-fs" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                  <path d="M0,0 L6,3 L0,6 z" fill={C.amp} />
                </marker>
                <marker id="a-fs-big" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                  <path d="M0,0 L8,4 L0,8 z" fill={C.amp} />
                </marker>
              </defs>
              <AlertBox x={130} y={130} w={220} h={50} label="대역폭 소진" sub="공격자 송신 < victim 수신 14x" color={C.amp} />
              <text x={240} y={205} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                전형적 reflection/amplification DDoS.
              </text>
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.def}>
                Bond requirement = 차단
              </text>
              <ActionBox x={20} y={45} w={140} h={50} label="verifyFindnode" sub="bond 확인 단계" color={C.def} />
              <ActionBox x={170} y={45} w={140} h={50} label="bond 검사" sub="last_pong < 24h?" color={C.def} />
              <ActionBox x={320} y={45} w={140} h={50} label="없으면 거절" sub="응답 없이 폐기" color={C.def} />
              <motion.line x1={160} y1={70} x2={170} y2={70} stroke="var(--muted-foreground)" strokeWidth={1.5}
                markerEnd="url(#fs-arr)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} />
              <motion.line x1={310} y1={70} x2={320} y2={70} stroke="var(--muted-foreground)" strokeWidth={1.5}
                markerEnd="url(#fs-arr)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} />
              <defs>
                <marker id="fs-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                  <path d="M0,0 L6,3 L0,6 z" fill="var(--muted-foreground)" />
                </marker>
              </defs>
              <text x={240} y={130} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
                spoofed src → PONG 도달 못 함 → bond 못 만듦.
              </text>
              <text x={240} y={155} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                → 공격자는 bonded 상태 유지가 불가능 → 응답을 받을 수 없음.
              </text>
              <text x={240} y={185} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                Spoofing 자체가 무용지물.
              </text>
            </motion.g>
          )}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.split}>
                12 nodes per packet
              </text>
              <ModuleBox x={20} y={45} w={140} h={50} label="Max UDP" sub="1280 B" color={C.split} />
              <ModuleBox x={170} y={45} w={140} h={50} label="Node entry" sub="≈ 90 B (IP+port+pubkey)" color={C.split} />
              <ModuleBox x={320} y={45} w={140} h={50} label="MaxNeighbors" sub="12 / packet" color={C.split} />
              <text x={240} y={130} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
                bucketSize=16 → 12 + 4 = 2 packets (또는 12 + 12).
              </text>
              <DataBox x={120} y={155} w={120} h={32} label="Packet 1: 12 nodes" color={C.split} outlined />
              <DataBox x={250} y={155} w={120} h={32} label="Packet 2: 4 nodes" color={C.split} outlined />
              <text x={240} y={210} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                응답 측: 12 도달 시 즉시 send + 버퍼 초기화.
              </text>
            </motion.g>
          )}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.priv}>
                Privacy: target spec 차이
              </text>
              <ModuleBox x={20} y={45} w={200} h={55} label="discv4" sub="target = pubkey (64B)" color={C.priv} />
              <ModuleBox x={260} y={45} w={200} h={55} label="discv5" sub="target = log-distance 배열" color="#10b981" />
              <text x={120} y={120} textAnchor="middle" fontSize={9} fill={C.priv}>임의 pubkey로 lookup</text>
              <text x={120} y={138} textAnchor="middle" fontSize={9} fill={C.priv}>→ 라우팅 구조 파악</text>
              <text x={120} y={156} textAnchor="middle" fontSize={9} fill={C.priv}>→ Privacy 위반</text>
              <text x={360} y={120} textAnchor="middle" fontSize={9} fill="#10b981">"거리 [253, 254] 노드"</text>
              <text x={360} y={138} textAnchor="middle" fontSize={9} fill="#10b981">→ 대상 미공개</text>
              <text x={360} y={156} textAnchor="middle" fontSize={9} fill="#10b981">→ 구조 추론 어려움</text>
              <text x={240} y={195} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                discv5의 distance 기반 query는 명시적 privacy 개선.
              </text>
            </motion.g>
          )}
          {step === 5 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.impl}>
                Implementation Notes
              </text>
              <DataBox x={20} y={45} w={200} h={42} label="XOR distance" sub="256-bit, target 기준 sort" color={C.impl} outlined />
              <DataBox x={260} y={45} w={200} h={42} label="Closest-first" sub="top-k=16 반환" color={C.impl} outlined />
              <DataBox x={20} y={100} w={200} h={42} label="Pending tracker" sub="응답-요청 매칭" color={C.impl} outlined />
              <DataBox x={260} y={100} w={200} h={42} label="Duplicate handling" sub="hash로 중복 응답 식별" color={C.impl} outlined />
              <text x={240} y={170} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                replyMatcher 콜백이 requestDone=false면 큐에 남음 — 분할 응답 누적.
              </text>
              <text x={240} y={190} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                타임아웃이어도 reply가 있으면 성공 처리 (관용적 설계).
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
