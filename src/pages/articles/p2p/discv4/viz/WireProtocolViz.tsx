import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox, StatusBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = {
  mac: '#6366f1',
  sig: '#10b981',
  rlp: '#f59e0b',
  ok: '#22c55e',
  bad: '#ef4444',
};

const STEPS = [
  {
    label: 'Wire layout — 4 segments, 1280B 한계',
    body: 'MAC(32) + Signature(65) + Type(1) + RLP(가변) = 헤더 98B.\n총 ≤ 1280 B — UDP 단편화 회피.',
  },
  {
    label: '6 packet types',
    body: '0x01 Ping / 0x02 Pong / 0x03 Findnode / 0x04 Neighbors / 0x05 ENRRequest / 0x06 ENRResponse.\nType 1바이트로 분기.',
  },
  {
    label: 'MAC vs Signature 역할 분리',
    body: 'MAC = keccak256(sig+type+payload) — 손상된 패킷 즉시 폐기.\nSignature = ECDSA on keccak256(type+payload) — 발신자 인증.\n무결성 ≠ 인증.',
  },
  {
    label: 'RLP — Ethereum 표준 직렬화',
    body: 'Length-prefixed, self-describing.\n예: Ping = [version, from_endpoint, to_endpoint, expiration, enr_seq].',
  },
  {
    label: 'Stateless 보안 속성',
    body: 'O confidentiality (no encryption) — 평문.\nO replay 약함 (expiration 20s만).\n→ discv5가 confidentiality + session 추가.',
  },
];

export default function WireProtocolViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 230" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                discv4 packet (UDP payload)
              </text>
              <ModuleBox x={20} y={45} w={70} h={55} label="MAC" sub="32 B" color={C.mac} />
              <ModuleBox x={100} y={45} w={130} h={55} label="Signature" sub="65 B" color={C.sig} />
              <ModuleBox x={240} y={45} w={50} h={55} label="Type" sub="1 B" color={C.rlp} />
              <ModuleBox x={300} y={45} w={160} h={55} label="RLP Payload" sub="variable" color={C.rlp} />
              <StatusBox x={120} y={130} w={240} h={50} label="Total ≤ 1280 B" sub="UDP MTU 안전 마진" color={C.mac} progress={0.85} />
              <text x={240} y={205} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                헤더 98B + 페이로드 가변. NEIGHBORS가 가장 큼.
              </text>
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.rlp}>
                6 Packet Types — Type byte로 분기
              </text>
              <DataBox x={20} y={45} w={140} h={32} label="0x01 Ping" sub="liveness" color={C.sig} outlined />
              <DataBox x={170} y={45} w={140} h={32} label="0x02 Pong" sub="reply + To addr" color={C.sig} outlined />
              <DataBox x={320} y={45} w={140} h={32} label="0x03 Findnode" sub="lookup" color={C.rlp} outlined />
              <DataBox x={20} y={88} w={140} h={32} label="0x04 Neighbors" sub="≤12 노드" color={C.rlp} outlined />
              <DataBox x={170} y={88} w={140} h={32} label="0x05 ENRRequest" sub="record req" color={C.mac} outlined />
              <DataBox x={320} y={88} w={140} h={32} label="0x06 ENRResponse" sub="record reply" color={C.mac} outlined />
              <text x={240} y={155} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
                3쌍 (request/response) — 모든 디스커버리는 이 6개로.
              </text>
              <text x={240} y={180} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                Type 디코딩 후 sigdata[1:]를 패킷별 구조체로 RLP 디코딩.
              </text>
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                MAC vs Signature — 두 가지 다른 일
              </text>
              <ModuleBox x={20} y={45} w={200} h={55} label="MAC (32B)" sub="keccak256(sig + type + payload)" color={C.mac} />
              <text x={120} y={120} textAnchor="middle" fontSize={9} fill={C.mac}>
                목적: 무결성
              </text>
              <text x={120} y={138} textAnchor="middle" fontSize={9} fill={C.mac}>
                실패 → 즉시 폐기
              </text>
              <text x={120} y={156} textAnchor="middle" fontSize={9} fill={C.mac}>
                ecrecover 비용 절약
              </text>
              <ModuleBox x={260} y={45} w={200} h={55} label="Signature (65B)" sub="ECDSA on keccak256(type+payload)" color={C.sig} />
              <text x={360} y={120} textAnchor="middle" fontSize={9} fill={C.sig}>
                목적: 발신자 인증
              </text>
              <text x={360} y={138} textAnchor="middle" fontSize={9} fill={C.sig}>
                ecrecover → pubkey
              </text>
              <text x={360} y={156} textAnchor="middle" fontSize={9} fill={C.sig}>
                node_id 도출
              </text>
              <text x={240} y={195} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                두 단계 검증 — 가벼운 무결성 → 비싼 인증.
              </text>
            </motion.g>
          )}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.rlp}>
                RLP — Recursive Length Prefix
              </text>
              <ActionBox x={20} y={45} w={200} h={50} label="self-describing" sub="length prefix로 구조 표현" color={C.rlp} />
              <ActionBox x={260} y={45} w={200} h={50} label="Ethereum 표준 encoding" sub="모든 P2P/EVM에서 사용" color={C.rlp} />
              <text x={240} y={120} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
                예: Ping payload
              </text>
              <DataBox x={60} y={135} w={360} h={32} label="[version, from_ep, to_ep, expiration, enr_seq]" color={C.rlp} outlined />
              <text x={240} y={195} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                인코딩: 0xf8 [length] [items...] — 가변 길이를 prefix로 알림.
              </text>
            </motion.g>
          )}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                보안 체크리스트
              </text>
              <DataBox x={30} y={45} w={195} h={32} label="Stateless" sub="✓ 세션 상태 없음" color={C.ok} outlined />
              <DataBox x={255} y={45} w={195} h={32} label="Sender authentication" sub="✓ 서명으로 보장" color={C.ok} outlined />
              <DataBox x={30} y={88} w={195} h={32} label="Integrity" sub="✓ MAC으로 보장" color={C.ok} outlined />
              <AlertBox x={255} y={88} w={195} h={32} label="Confidentiality" sub="✗ 평문 — 도청 가능" color={C.bad} />
              <AlertBox x={30} y={130} w={195} h={32} label="Replay protection" sub="△ expiration 20s만" color={C.bad} />
              <AlertBox x={255} y={130} w={195} h={32} label="Encryption" sub="✗ 없음" color={C.bad} />
              <text x={240} y={190} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
                → discv5가 confidentiality + replay 강화.
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
