import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { mux: '#6366f1', portal: '#10b981', cl: '#f59e0b', el: '#a78bfa', libp2p: '#0ea5e9', design: '#ec4899' };

const STEPS = [
  {
    label: 'discv5 = Multiplexing UDP channel',
    body: '하나의 discv5 연결 위에 여러 application protocol 실행.\n방화벽 1포트만 오픈, NAT 통과 용이, 세션 재사용.',
  },
  {
    label: 'Portal Network — light client data',
    body: 'Protocol ID = "portal".\nState / History / Beacon 데이터 배포.\nKademlia DHT로 content lookup.\n경량 클라이언트가 RPC 없이 데이터 접근.',
  },
  {
    label: 'Consensus Layer — Eth2 discovery',
    body: 'Sync committee 노드 찾기.\nAttestation subnet 노드 찾기.\nattnets/syncnets ENR field와 연동.',
  },
  {
    label: 'Execution Layer — peer 선택',
    body: 'ENR 기반 peer selection.\nTopic-based filtering (eth fork ID 매칭).\nfork 분기 시 자동 노드 격리.',
  },
  {
    label: 'LibP2P 통합',
    body: 'libp2p이 discv5를 peer discovery로 사용.\nKad-DHT 기반 peer routing.\nIPFS, Filecoin 등 광범위 활용.',
  },
  {
    label: 'Message flow + 설계 원칙',
    body: 'TALKREQ {protocol, payload} → TALKRESP {payload}.\n1 RTT 응답.\nStateless / small payload / discv5 세션 위에 / protocol ID로 확장.',
  },
];

export default function TalkProtocolsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 230" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.mux}>
                discv5 as multiplexing UDP channel
              </text>
              <ModuleBox x={170} y={45} w={140} h={50} label="discv5 session" sub="암호화된 UDP" color={C.mux} />
              <DataBox x={20} y={120} w={100} h={42} label="Portal" color={C.portal} outlined />
              <DataBox x={130} y={120} w={100} h={42} label="Eth2 disc" color={C.cl} outlined />
              <DataBox x={240} y={120} w={100} h={42} label="Eth1 disc" color={C.el} outlined />
              <DataBox x={350} y={120} w={100} h={42} label="libp2p" color={C.libp2p} outlined />
              <motion.line x1={70} y1={120} x2={210} y2={95} stroke="var(--muted-foreground)" strokeWidth={0.8}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} />
              <motion.line x1={180} y1={120} x2={230} y2={95} stroke="var(--muted-foreground)" strokeWidth={0.8}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} />
              <motion.line x1={290} y1={120} x2={250} y2={95} stroke="var(--muted-foreground)" strokeWidth={0.8}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} />
              <motion.line x1={400} y1={120} x2={270} y2={95} stroke="var(--muted-foreground)" strokeWidth={0.8}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} />
              <text x={240} y={195} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                4가지 장점: 1포트 / NAT 통과 / 세션 재사용 / 디스커버리 통합.
              </text>
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.portal}>
                Portal Network — "portal" protocol
              </text>
              <ModuleBox x={20} y={45} w={140} h={55} label="state network" sub="Ethereum state" color={C.portal} />
              <ModuleBox x={170} y={45} w={140} h={55} label="history network" sub="block headers, bodies" color={C.portal} />
              <ModuleBox x={320} y={45} w={140} h={55} label="beacon network" sub="consensus data" color={C.portal} />
              <text x={240} y={130} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
                Content lookup via Kademlia DHT — content_id 가까운 노드가 보관.
              </text>
              <text x={240} y={155} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                경량 클라이언트(Helios 등)가 자기 데이터 직접 가져옴 — RPC 의존 제거.
              </text>
              <text x={240} y={195} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                "discv5의 가장 활발한 응용 사례".
              </text>
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.cl}>
                Consensus Layer (Eth2)
              </text>
              <ActionBox x={20} y={45} w={200} h={50} label="Sync committee discovery" sub="syncnets bitfield 매칭" color={C.cl} />
              <ActionBox x={260} y={45} w={200} h={50} label="Attestation subnet" sub="attnets bitfield 매칭" color={C.cl} />
              <DataBox x={120} y={120} w={240} h={42} label="ENR.attnets / syncnets" sub="bit set = subscribed" color={C.cl} outlined />
              <text x={240} y={195} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                validator가 자기 subnet 광고 → 같은 subnet 노드를 효율적으로 찾음.
              </text>
            </motion.g>
          )}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.el}>
                Execution Layer (Eth1)
              </text>
              <ActionBox x={20} y={45} w={200} h={50} label="ENR-based selection" sub="fork ID 매칭 우선" color={C.el} />
              <ActionBox x={260} y={45} w={200} h={50} label="Topic filtering" sub="eth field로 분류" color={C.el} />
              <DataBox x={120} y={120} w={240} h={42} label="ENR.eth = [fork_hash, fork_next]" color={C.el} outlined />
              <text x={240} y={195} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                fork 분기 시 자동 격리 — 호환되지 않는 노드 연결 회피.
              </text>
            </motion.g>
          )}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.libp2p}>
                LibP2P 통합
              </text>
              <ModuleBox x={170} y={45} w={140} h={50} label="libp2p host" sub="multistream" color={C.libp2p} />
              <DataBox x={20} y={130} w={100} h={42} label="IPFS" color={C.libp2p} outlined />
              <DataBox x={130} y={130} w={100} h={42} label="Filecoin" color={C.libp2p} outlined />
              <DataBox x={240} y={130} w={100} h={42} label="Gnosis" color={C.libp2p} outlined />
              <DataBox x={350} y={130} w={100} h={42} label="기타" color={C.libp2p} outlined />
              <motion.line x1={70} y1={130} x2={210} y2={95} stroke="var(--muted-foreground)" strokeWidth={0.8} />
              <motion.line x1={180} y1={130} x2={230} y2={95} stroke="var(--muted-foreground)" strokeWidth={0.8} />
              <motion.line x1={290} y1={130} x2={250} y2={95} stroke="var(--muted-foreground)" strokeWidth={0.8} />
              <motion.line x1={400} y1={130} x2={270} y2={95} stroke="var(--muted-foreground)" strokeWidth={0.8} />
              <text x={240} y={205} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                libp2p이 peer discovery로 discv5 채택 → 광범위 채택.
              </text>
            </motion.g>
          )}
          {step === 5 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.design}>
                Message flow + 설계 원칙
              </text>
              <DataBox x={20} y={45} w={200} h={42} label="TALKREQ" sub="{protocol, payload}" color={C.design} outlined />
              <DataBox x={260} y={45} w={200} h={42} label="TALKRESP" sub="{payload}" color={C.design} outlined />
              <StatusBox x={120} y={100} w={240} h={50} label="1 RTT 응답" sub="discv5 세션 위에서" color={C.design} progress={1} />
              <text x={50} y={185} fontSize={9} fill="var(--muted-foreground)">- Stateless preferred</text>
              <text x={50} y={200} fontSize={9} fill="var(--muted-foreground)">- Small payloads (packet limit)</text>
              <text x={260} y={185} fontSize={9} fill="var(--muted-foreground)">- Independent of discv5 state</text>
              <text x={260} y={200} fontSize={9} fill="var(--muted-foreground)">- Extensible via protocol ID</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
