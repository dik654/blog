import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { mac: '#6366f1', sig: '#10b981', type: '#f59e0b', payload: '#a78bfa', verify: '#0ea5e9' };

const STEPS = [
  {
    label: '4-필드 레이아웃 — 헤더 98B + 가변 페이로드',
    body: 'MAC(32) | Signature(65) | Type(1) | RLP Payload(variable).\n총 1280B 상한, 일반적으로 200~400B.',
  },
  {
    label: 'MAC = keccak256(sig + payload) — 무결성 게이트',
    body: '맨 먼저 검증되는 필드. 손상된 패킷을 즉시 버린다.\n암호학적 인증은 Signature 담당, MAC은 단순 무결성 게이트.',
  },
  {
    label: 'Signature: ECDSA on keccak256(type + payload)',
    body: 'secp256k1 65바이트 서명.\n수신자가 ecrecover로 발신자 공개키 복원 — 별도 from 필드 불필요.',
  },
  {
    label: '검증 흐름: MAC → ecrecover → node_id',
    body: '1) hash(sig+payload) ?= mac_field.\n2) recover(sig) → pubkey.\n3) keccak256(pubkey)[12:] → node_id.\n3 단계로 self-authenticating.',
  },
  {
    label: '왜 핸드셰이크가 없는가',
    body: '패킷 자체가 인증을 갖는다 — 세션 상태 불필요.\n양면: stateless 단순함 vs replay/encryption 부재.',
  },
];

export default function Discv4PacketStructViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 230" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                discv4 wire packet (헤더 98B)
              </text>
              <ModuleBox x={20} y={50} w={70} h={60} label="MAC" sub="32 B" color={C.mac} />
              <ModuleBox x={100} y={50} w={130} h={60} label="Signature" sub="65 B (ECDSA)" color={C.sig} />
              <ModuleBox x={240} y={50} w={50} h={60} label="Type" sub="1 B" color={C.type} />
              <ModuleBox x={300} y={50} w={160} h={60} label="RLP Payload" sub="variable, ≤ 1182 B" color={C.payload} />
              <text x={55} y={135} textAnchor="middle" fontSize={8} fill={C.mac}>keccak256</text>
              <text x={165} y={135} textAnchor="middle" fontSize={8} fill={C.sig}>secp256k1</text>
              <text x={265} y={135} textAnchor="middle" fontSize={8} fill={C.type}>0x01~06</text>
              <text x={380} y={135} textAnchor="middle" fontSize={8} fill={C.payload}>구조체 RLP</text>
              <text x={240} y={170} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
                총 ≤ 1280 B (UDP 단편화 회피).
              </text>
              <text x={240} y={188} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                NEIGHBORS 응답이 가장 큼 — 12 노드 × ~79B ≈ 1264B.
              </text>
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.mac}>
                MAC 계산 — 무결성 게이트
              </text>
              <DataBox x={50} y={50} w={130} h={36} label="Signature (65B)" color={C.sig} outlined />
              <text x={195} y={72} fontSize={14} fill="var(--muted-foreground)">+</text>
              <DataBox x={210} y={50} w={70} h={36} label="Type" color={C.type} outlined />
              <text x={285} y={72} fontSize={14} fill="var(--muted-foreground)">+</text>
              <DataBox x={300} y={50} w={130} h={36} label="Payload" color={C.payload} outlined />
              <motion.path d="M 240 95 L 240 120" stroke={C.mac} strokeWidth={1.5}
                markerEnd="url(#arr-mac)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2, duration: 0.4 }} />
              <defs>
                <marker id="arr-mac" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                  <path d="M0,0 L6,3 L0,6 z" fill={C.mac} />
                </marker>
              </defs>
              <text x={300} y={112} fontSize={9} fill={C.mac}>keccak256(...)</text>
              <ModuleBox x={170} y={130} w={140} h={45} label="MAC (32 bytes)" sub="앞 32B에 기록" color={C.mac} />
              <text x={240} y={200} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                수신 측: MAC 재계산 → 불일치면 즉시 폐기. ecrecover 비용을 아낀다.
              </text>
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.sig}>
                Signature — 발신자 인증
              </text>
              <DataBox x={50} y={50} w={150} h={36} label="keccak256(type + payload)" color={C.sig} outlined />
              <ActionBox x={220} y={50} w={210} h={36} label="ECDSA.sign(priv_key, hash)" color={C.sig} />
              <ModuleBox x={170} y={110} w={140} h={50} label="65 byte signature" sub="r(32) + s(32) + v(1)" color={C.sig} />
              <text x={50} y={195} fontSize={9} fill="var(--muted-foreground)">검증 측:</text>
              <text x={50} y={210} fontSize={9} fontFamily="monospace" fill={C.verify}>
                pubkey = ecrecover(hash, sig)  →  node_id = keccak256(pubkey)[12:]
              </text>
            </motion.g>
          )}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.verify}>
                3단계 self-authenticating verification
              </text>
              <ActionBox x={20} y={50} w={140} h={50} label="Step 1: MAC 검증" sub="hash(sig+payload) ?= mac" color={C.mac} />
              <ActionBox x={170} y={50} w={140} h={50} label="Step 2: ecrecover" sub="sig → pubkey" color={C.sig} />
              <ActionBox x={320} y={50} w={140} h={50} label="Step 3: node_id" sub="keccak256(pubkey)[12:]" color={C.verify} />
              <motion.line x1={160} y1={75} x2={170} y2={75} stroke="var(--muted-foreground)" strokeWidth={1.5}
                markerEnd="url(#arr-step)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} />
              <motion.line x1={310} y1={75} x2={320} y2={75} stroke="var(--muted-foreground)" strokeWidth={1.5}
                markerEnd="url(#arr-step)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} />
              <defs>
                <marker id="arr-step" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                  <path d="M0,0 L6,3 L0,6 z" fill="var(--muted-foreground)" />
                </marker>
              </defs>
              <text x={240} y={140} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
                실패하면 패킷 폐기 — 3단계 모두 수신자가 단독 수행.
              </text>
              <text x={240} y={160} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                별도 from 필드 불필요 — 서명이 발신자 정보를 자체적으로 운반.
              </text>
            </motion.g>
          )}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                Stateless의 양면
              </text>
              <ModuleBox x={30} y={45} w={195} h={55} label="장점" sub="세션 없음, 단순함" color="#10b981" />
              <text x={45} y={115} fontSize={9} fill="#10b981">+ 1000줄로 구현 가능</text>
              <text x={45} y={130} fontSize={9} fill="#10b981">+ 메모리 풋프린트 작음</text>
              <text x={45} y={145} fontSize={9} fill="#10b981">+ 부분 통신 손실에 강함</text>
              <ModuleBox x={255} y={45} w={195} h={55} label="단점" sub="암호화/리플레이 부재" color="#ef4444" />
              <text x={270} y={115} fontSize={9} fill="#ef4444">- 모든 패킷 평문 (도청 가능)</text>
              <text x={270} y={130} fontSize={9} fill="#ef4444">- expiration 외 리플레이 방어 없음</text>
              <text x={270} y={145} fontSize={9} fill="#ef4444">- 토픽 광고 불가</text>
              <text x={240} y={195} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                discv5 = 같은 stateless 패킷 위에 세션 레이어 추가.
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
