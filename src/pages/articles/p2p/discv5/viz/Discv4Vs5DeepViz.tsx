import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { v4: '#94a3b8', v5: '#10b981', enr: '#6366f1', dist: '#f59e0b', priv: '#ec4899', split: '#a78bfa' };

const STEPS = [
  {
    label: '7가지 차이 — 한눈에',
    body: '노드 레코드 / 세션 / FINDNODE / 토픽 / 확장 / 핸드셰이크 / 공격 방어.\n모두 discv5에서 강화.',
  },
  {
    label: 'ENR — Signed extensible record',
    body: 'discv4: (IP, ID) 튜플.\ndiscv5: ENR — id/secp256k1/ip/udp/tcp/eth/attnets, signed + versioned.\nDNS 친화 (base64 encoded).',
  },
  {
    label: 'Distance 계산',
    body: 'node_id = keccak256(pubkey).\ndistance = A XOR B.\nlog_distance = ceil(log2(distance + 1)) ∈ [0, 256].',
  },
  {
    label: 'FINDNODE 개선 — privacy',
    body: 'discv4: "Find nodes near pubkey X" → 대상 노출.\ndiscv5: "Give nodes at distance [253, 254, 255]" → 대상 비공개.\n공격자가 라우팅 구조 파악 어려움.',
  },
  {
    label: 'Response 분할',
    body: 'Single UDP packet ≤ 1280 B.\n다수 ENR 전송 시 분할.\nRespCount로 전체 개수 알림.\ntotalNodesResponseLimit = 5.',
  },
  {
    label: 'Bucket refresh + dead node 정리',
    body: '매 30초마다 lookup.\nENR 유효성 확인 (Ping/Pong).\n응답 없는 노드 routing table에서 제거.',
  },
];

export default function Discv4Vs5DeepViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                7가지 항목 비교
              </text>
              {[
                { y: 40, k: '노드 레코드', v4: '(IP, ID)', v5: 'ENR' },
                { y: 65, k: '세션 암호화', v4: '없음', v5: 'AES-GCM' },
                { y: 90, k: 'FINDNODE', v4: 'pubkey', v5: 'distances' },
                { y: 115, k: 'Topic 광고', v4: '없음', v5: 'TALKREQ' },
                { y: 140, k: 'Extension proto', v4: '없음', v5: '지원' },
                { y: 165, k: '핸드셰이크', v4: 'Ping/Pong', v5: 'WHOAREYOU' },
                { y: 190, k: '공격 방어', v4: '약함', v5: '강함' },
              ].map((row, i) => (
                <g key={i}>
                  <text x={20} y={row.y + 8} fontSize={9} fill="var(--foreground)">
                    {row.k}
                  </text>
                  <text x={200} y={row.y + 8} fontSize={9} fill={C.v4}>
                    {row.v4}
                  </text>
                  <text x={340} y={row.y + 8} fontSize={9} fontWeight={600} fill={C.v5}>
                    {row.v5}
                  </text>
                  {i < 6 && (
                    <line x1={20} y1={row.y + 16} x2={460} y2={row.y + 16} stroke="var(--border)" strokeWidth={0.4} />
                  )}
                </g>
              ))}
              <text x={200} y={32} fontSize={9} fontWeight={600} fill={C.v4}>discv4</text>
              <text x={340} y={32} fontSize={9} fontWeight={600} fill={C.v5}>discv5</text>
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.enr}>
                ENR (Ethereum Node Record, EIP-778)
              </text>
              <DataBox x={20} y={45} w={140} h={32} label="id" sub='"v4" scheme' color={C.enr} outlined />
              <DataBox x={170} y={45} w={140} h={32} label="secp256k1" sub="공개키" color={C.enr} outlined />
              <DataBox x={320} y={45} w={140} h={32} label="ip / udp / tcp" sub="endpoints" color={C.enr} outlined />
              <DataBox x={20} y={88} w={140} h={32} label="eth" sub="fork info" color={C.enr} outlined />
              <DataBox x={170} y={88} w={140} h={32} label="attnets" sub="att subnets" color={C.enr} outlined />
              <DataBox x={320} y={88} w={140} h={32} label="syncnets" sub="sync subnets" color={C.enr} outlined />
              <DataBox x={120} y={130} w={240} h={32} label="signature (Ed25519 or secp256k1)" color={C.enr} outlined />
              <text x={240} y={185} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                Signed (변조 불가) + Versioned (seq) + Extensible + DNS-friendly.
              </text>
              <text x={240} y={210} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                discv4는 단순 (IP, ID) — 추가 메타데이터 표현 불가.
              </text>
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.dist}>
                Distance 계산
              </text>
              <ActionBox x={50} y={45} w={170} h={50} label="node_id" sub="keccak256(pubkey)" color={C.dist} />
              <ActionBox x={260} y={45} w={170} h={50} label="distance" sub="A XOR B (256-bit)" color={C.dist} />
              <ActionBox x={150} y={120} w={180} h={50} label="log_distance" sub="ceil(log2(d+1)) ∈ [0,256]" color={C.dist} />
              <text x={240} y={200} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                FINDNODE distance는 0~256 정수 — 256개 버킷 대응.
              </text>
              <text x={240} y={222} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                distance=0은 "give me your own ENR" 의미.
              </text>
            </motion.g>
          )}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.priv}>
                FINDNODE — privacy 개선
              </text>
              <AlertBox x={20} y={45} w={200} h={55} label="discv4" sub='"near pubkey X"' color={C.v4} />
              <ModuleBox x={260} y={45} w={200} h={55} label="discv5" sub='"distance [253,254,255]"' color={C.v5} />
              <text x={120} y={125} textAnchor="middle" fontSize={9} fill={C.v4}>
                대상 pubkey 노출
              </text>
              <text x={120} y={143} textAnchor="middle" fontSize={9} fill={C.v4}>
                → 누가 누구 찾는지 파악
              </text>
              <text x={360} y={125} textAnchor="middle" fontSize={9} fill={C.v5}>
                대상 미공개
              </text>
              <text x={360} y={143} textAnchor="middle" fontSize={9} fill={C.v5}>
                → 라우팅 구조 추론 어려움
              </text>
              <text x={240} y={195} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                lookupDistances: target에 대한 인접 거리 3개 [logdist, logdist±1].
              </text>
              <text x={240} y={215} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                여러 distance에 매핑되는 노드들 모두 응답 → target 직접 노출 안 됨.
              </text>
            </motion.g>
          )}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.split}>
                Response 분할 (NODES)
              </text>
              <StatusBox x={120} y={45} w={240} h={50} label="≤ 1280 B / packet" sub="UDP 단편화 회피" color={C.split} progress={0.85} />
              <DataBox x={20} y={115} w={140} h={42} label="Packet 1" sub="RespCount=3" color={C.split} outlined />
              <DataBox x={170} y={115} w={140} h={42} label="Packet 2" sub="…" color={C.split} outlined />
              <DataBox x={320} y={115} w={140} h={42} label="Packet 3" sub="마지막" color={C.split} outlined />
              <text x={240} y={185} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                첫 응답의 RespCount → 클라이언트가 총 패킷 수 파악.
              </text>
              <text x={240} y={210} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                totalNodesResponseLimit = 5 → 분할 상한.
              </text>
            </motion.g>
          )}
          {step === 5 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.v5}>
                Bucket Refresh — health check
              </text>
              <ActionBox x={20} y={45} w={140} h={50} label="매 30초" sub="주기적 lookup" color={C.v5} />
              <ActionBox x={170} y={45} w={140} h={50} label="ENR 유효성" sub="Ping/Pong" color={C.v5} />
              <ActionBox x={320} y={45} w={140} h={50} label="dead 제거" sub="응답 없으면 evict" color={C.v5} />
              <motion.line x1={160} y1={70} x2={170} y2={70} stroke="var(--muted-foreground)" strokeWidth={1.5}
                markerEnd="url(#br-arr)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} />
              <motion.line x1={310} y1={70} x2={320} y2={70} stroke="var(--muted-foreground)" strokeWidth={1.5}
                markerEnd="url(#br-arr)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} />
              <defs>
                <marker id="br-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                  <path d="M0,0 L6,3 L0,6 z" fill="var(--muted-foreground)" />
                </marker>
              </defs>
              <text x={240} y={130} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
                routing table을 항상 살아있는 노드로 유지.
              </text>
              <text x={240} y={155} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                lookup 효율 + churn에 강함.
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
