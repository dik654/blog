import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { id: '#6366f1', net: '#10b981', ext: '#f59e0b', sign: '#a78bfa', size: '#0ea5e9' };

const STEPS = [
  {
    label: 'ENR 표준 키 — Identity / Endpoint / Extension',
    body: 'EIP-778이 정의한 키 스킴.\nidentity 2개, endpoint 6개, 확장 자유.',
  },
  {
    label: 'Identity 키 — id / secp256k1',
    body: '"id" = "v4" — 사용 중인 ID 스킴.\n"secp256k1" = 33B compressed pubkey — 검증 키이자 node_id 원천.',
  },
  {
    label: 'Endpoint 키 — IPv4/IPv6 + TCP/UDP',
    body: '"ip"/"ip6", "tcp"/"tcp6", "udp"/"udp6".\nNAT 뒤 노드는 LocalNode가 IPTracker로 외부 IP 추정 후 채움.',
  },
  {
    label: 'Ethereum 확장 — eth / attnets / syncnets',
    body: '"eth" = fork_hash + fork_next (EIP-2124).\n"attnets" = attestation subnet bitfield (Eth2).\n"syncnets" = sync committee bitfield.',
  },
  {
    label: '서명 + 검증 흐름',
    body: 'sign: ECDSA(priv, keccak256(RLP([seq, k1,v1,...]))).\n검증 6단계: RLP decode → id 확인 → pubkey 추출 → sig 검증 → ≤300B → 키 정렬.',
  },
  {
    label: '300B 한계와 배포 채널',
    body: 'UDP 안전 마진 — 일반 ~150B.\n배포: DNS(EIP-1459) / PING-PONG으로 seq 교환 / discv5 TALK.',
  },
];

export default function EnrKeysViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 230" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                ENR = signed key/value record (EIP-778)
              </text>
              <ModuleBox x={20} y={45} w={140} h={50} label="Identity" sub="id, secp256k1" color={C.id} />
              <ModuleBox x={170} y={45} w={140} h={50} label="Endpoint" sub="ip, tcp, udp (×2)" color={C.net} />
              <ModuleBox x={320} y={45} w={140} h={50} label="Extension" sub="eth, attnets, ..." color={C.ext} />
              <text x={240} y={130} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
                키는 사전순 정렬 필수 — 디코딩 시 무결성 검증 조건.
              </text>
              <text x={240} y={150} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                레코드 = RLP([sig, seq, k1, v1, k2, v2, ...]).
              </text>
              <text x={240} y={185} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                ≤ 300 B (UDP 안전 마진), 일반 ~150 B.
              </text>
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.id}>
                Identity Keys
              </text>
              <DataBox x={50} y={50} w={170} h={42} label='"id"' sub='"v4" (스킴 식별자)' color={C.id} outlined />
              <DataBox x={260} y={50} w={170} h={42} label='"secp256k1"' sub="33B compressed pubkey" color={C.id} outlined />
              <text x={135} y={120} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                현재는 v4만, 미래에 v5 등 확장 여지.
              </text>
              <text x={345} y={120} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                node_id = keccak256(uncompressed_pubkey)[12:]
              </text>
              <ActionBox x={120} y={155} w={240} h={42} label="검증과 ID 도출 모두 이 키 하나로" sub="signature 검증 + node_id 계산" color={C.id} />
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.net}>
                Endpoint Keys (IPv4 + IPv6)
              </text>
              <DataBox x={20} y={45} w={120} h={32} label='"ip" (4B)' color={C.net} outlined />
              <DataBox x={150} y={45} w={120} h={32} label='"tcp"' color={C.net} outlined />
              <DataBox x={280} y={45} w={120} h={32} label='"udp"' color={C.net} outlined />
              <DataBox x={20} y={88} w={120} h={32} label='"ip6" (16B)' color={C.net} outlined />
              <DataBox x={150} y={88} w={120} h={32} label='"tcp6"' color={C.net} outlined />
              <DataBox x={280} y={88} w={120} h={32} label='"udp6"' color={C.net} outlined />
              <text x={240} y={150} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
                NAT 뒤 노드는 자기 IP를 모름.
              </text>
              <text x={240} y={170} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                LocalNode가 Pong.To로 받은 외부 IP를 IPTracker에 누적.
              </text>
              <text x={240} y={190} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                10+ 진술 일치 시 ENR 갱신 — STUN 없이 외부 IP 발견.
              </text>
            </motion.g>
          )}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.ext}>
                Ethereum Extension Keys
              </text>
              <ModuleBox x={20} y={45} w={140} h={55} label='"eth" (EIP-2124)' sub="[fork_hash, fork_next]" color={C.ext} />
              <ModuleBox x={170} y={45} w={140} h={55} label='"attnets"' sub="attestation subnets bitfield" color={C.ext} />
              <ModuleBox x={320} y={45} w={140} h={55} label='"syncnets"' sub="sync committee bitfield" color={C.ext} />
              <text x={240} y={125} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                eth: 동일 fork 노드만 골라내기 — Eth1/Eth2 호환성 게이트.
              </text>
              <text x={240} y={145} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                attnets/syncnets: validator가 구독 중인 서브넷 광고 — 효율적 peer 매칭.
              </text>
              <text x={240} y={185} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                custom 키 자유 — 임의 prefix로 확장 가능.
              </text>
            </motion.g>
          )}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.sign}>
                Signing & Validation (v4 scheme)
              </text>
              <ActionBox x={20} y={45} w={140} h={50} label="record_no_sig" sub="RLP([seq, k1, v1, ...])" color={C.sign} />
              <ActionBox x={170} y={45} w={140} h={50} label="hash" sub="keccak256(record_no_sig)" color={C.sign} />
              <ActionBox x={320} y={45} w={140} h={50} label="ECDSA.sign" sub="priv key" color={C.sign} />
              <text x={240} y={120} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                검증: RLP decode → id 확인 → pubkey 추출 → 서명 검증 → ≤300B → 키 정렬 검증.
              </text>
              <DataBox x={20} y={140} w={140} h={32} label="1) decode RLP" color={C.sign} outlined />
              <DataBox x={170} y={140} w={140} h={32} label="2~4) crypto" color={C.sign} outlined />
              <DataBox x={320} y={140} w={140} h={32} label="5~6) format" color={C.sign} outlined />
              <text x={240} y={195} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                여섯 검사 모두 통과 → 신뢰 가능한 record. 변조 시 sig 검증 단계에서 탈락.
              </text>
            </motion.g>
          )}
          {step === 5 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.size}>
                300B 한계 + 3가지 배포 채널
              </text>
              <StatusBox x={120} y={45} w={240} h={50} label="ENR size" sub="~150B 사용 / 300B 상한" color={C.size} progress={0.5} />
              <ModuleBox x={20} y={120} w={140} h={50} label="DNS (EIP-1459)" sub="ENR tree" color={C.size} />
              <ModuleBox x={170} y={120} w={140} h={50} label="PING/PONG" sub="seq 교환 → 갱신 트리거" color={C.size} />
              <ModuleBox x={320} y={120} w={140} h={50} label="discv5 TALK" sub="요청 시 전송" color={C.size} />
              <text x={240} y={195} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                seq 비교로만 갱신 트리거 — 매번 전체 ENR 보내지 않음.
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
