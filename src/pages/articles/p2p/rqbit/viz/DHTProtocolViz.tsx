import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';

const STEPS = [
  { label: 'BEP-5 RPC 4종: ping / find_node / get_peers / announce_peer' },
  { label: 'Node ID 160bit + Token 시스템 (DoS 방지)' },
  { label: 'Bootstrap nodes: 초기 진입점 4종' },
  { label: '토렌트 다운로드 7단계 (DHT 관점)' },
  { label: 'rqbit 특화 vs libtorrent 비교' },
];

const RPCS = [
  { label: 'ping', sub: '생존 확인', color: '#6366f1' },
  { label: 'find_node', sub: 'target 근처 노드', color: '#3b82f6' },
  { label: 'get_peers', sub: 'infohash → peers/nodes', color: '#10b981' },
  { label: 'announce_peer', sub: '나 다운로드 중 알림', color: '#f59e0b' },
];

const ID_TOK = [
  { label: 'Node ID', sub: '160-bit (SHA-1 size)', color: '#6366f1' },
  { label: 'Random ID', sub: '일반적', color: '#3b82f6' },
  { label: 'IP-derived', sub: '권장 (security)', color: '#10b981' },
  { label: 'Token', sub: 'SHA-1(secret || peer_ip)', color: '#f59e0b' },
  { label: 'Token TTL', sub: '10분 짧은 수명', color: '#ec4899' },
  { label: 'announce_peer', sub: 'Token 검증 필수', color: '#8b5cf6' },
];

const BOOTS = [
  'router.bittorrent.com:6881',
  'dht.transmissionbt.com:6881',
  'router.utorrent.com:6881',
  'dht.libtorrent.org:25401',
];

const FLOW = [
  '1. .torrent에서 infohash 추출',
  '2. DHT bootstrap',
  '3. iterative get_peers(infohash)',
  '4. peer IP 수집',
  '5. BT wire protocol로 연결',
  '6. announce_peer (자기 광고)',
  '7. 다른 peer가 DHT로 나를 발견',
];

const COMPARE = [
  { label: 'BucketTree', sub: 'rqbit: 동적 구조', color: '#10b981' },
  { label: '160 fixed array', sub: 'libtorrent 전통', color: '#94a3b8' },
  { label: 'IPv4/IPv6 dual', sub: 'rqbit: 이중 스택', color: '#3b82f6' },
  { label: 'DashMap concurrent', sub: 'rqbit: 락프리', color: '#6366f1' },
  { label: 'tokio async I/O', sub: 'rqbit: 비동기', color: '#f59e0b' },
  { label: 'Rust safety', sub: 'C++ 복잡성 제거', color: '#ec4899' },
];

export default function DHTProtocolViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && RPCS.map((r, i) => (
            <motion.g key={r.label} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}>
              <ModuleBox x={50} y={20 + i * 50} w={380} h={42} label={r.label} sub={r.sub} color={r.color} />
            </motion.g>
          ))}

          {step === 1 && ID_TOK.map((t, i) => (
            <motion.g key={t.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.07 }}>
              <DataBox x={20 + (i % 3) * 150} y={30 + Math.floor(i / 3) * 90}
                w={140} h={70} label={t.label} sub={t.sub}
                color={t.color} outlined />
            </motion.g>
          ))}

          {step === 2 && (
            <>
              <text x={240} y={20} textAnchor="middle" fontSize={10} fontWeight={700} fill="#6366f1">
                Bootstrap Nodes (초기 DHT 진입)
              </text>
              {BOOTS.map((b, i) => (
                <motion.g key={b} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}>
                  <ActionBox x={40} y={40 + i * 40} w={400} h={32} label={b} color="#3b82f6" />
                </motion.g>
              ))}
              <motion.text x={240} y={205} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                여기서 시작 → find_node로 라우팅 테이블 확장
              </motion.text>
            </>
          )}

          {step === 3 && FLOW.map((f, i) => (
            <motion.g key={f} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}>
              <ActionBox x={40} y={15 + i * 28} w={400} h={24} label={f}
                color={i < 3 ? '#3b82f6' : i < 5 ? '#10b981' : '#f59e0b'} />
            </motion.g>
          ))}

          {step === 4 && COMPARE.map((c, i) => (
            <motion.g key={c.label} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}>
              <DataBox x={20 + (i % 3) * 150} y={30 + Math.floor(i / 3) * 90}
                w={140} h={70} label={c.label} sub={c.sub} color={c.color} outlined />
            </motion.g>
          ))}
        </svg>
      )}
    </StepViz>
  );
}
