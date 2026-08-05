import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const STEPS = [
  { label: '핵심 개념: 블록 단위 + Wantlist + Haves + Ledger' },
  { label: '메시지 5종: WANT_HAVE / WANT_BLOCK / HAVE / DONT_HAVE / BLOCK' },
  { label: '세션 기반 fetching: 같은 DAG의 인접 블록 추적' },
  { label: 'Peer 선택 알고리즘: latency + success rate + top-k + broadcast' },
  { label: 'Ledger 공정성: debt ratio = sent / (received + 1)' },
  { label: 'BitTorrent vs Bitswap 비교' },
];

const CONCEPTS = [
  { label: 'Block-level', sub: '파일이 아닌 블록', color: '#6366f1' },
  { label: 'Wantlist', sub: '내가 원함', color: '#3b82f6' },
  { label: 'Haves', sub: '내가 보유', color: '#10b981' },
  { label: 'Ledger', sub: 'tit-for-tat', color: '#f59e0b' },
];

const MSGS = [
  { label: 'WANT_HAVE', sub: '경량 질의', color: '#3b82f6' },
  { label: 'WANT_BLOCK', sub: '데이터 요청', color: '#6366f1' },
  { label: 'HAVE', sub: '보유 응답', color: '#10b981' },
  { label: 'DONT_HAVE', sub: '미보유 응답', color: '#94a3b8' },
  { label: 'BLOCK', sub: '실제 데이터', color: '#f59e0b' },
];

const PICK = [
  { label: 'Latency 추적', sub: '응답시간 측정', color: '#3b82f6' },
  { label: 'Success rate', sub: '성공 비율', color: '#10b981' },
  { label: 'Top-k priority', sub: '상위 우선 요청', color: '#6366f1' },
  { label: 'Broadcast', sub: 'not found 시 전체', color: '#f59e0b' },
];

const COMPARE = [
  { side: 'BitTorrent', items: ['File-centric', 'Choke/unchoke', 'Piece bitfield', 'Tracker 의존'], color: '#3b82f6' },
  { side: 'Bitswap', items: ['Block-centric (CID)', 'Fine-grained', 'DHT discovery', 'Multi-session'], color: '#10b981' },
];

export default function BitswapDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && CONCEPTS.map((c, i) => (
            <motion.g key={c.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08 }}>
              <ModuleBox x={30 + (i % 2) * 220} y={40 + Math.floor(i / 2) * 80}
                w={200} h={60} label={c.label} sub={c.sub} color={c.color} />
            </motion.g>
          ))}

          {step === 1 && MSGS.map((m, i) => (
            <motion.g key={m.label} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}>
              <DataBox x={30 + (i % 3) * 145} y={30 + Math.floor(i / 3) * 90}
                w={135} h={70} label={m.label} sub={m.sub} color={m.color} outlined />
            </motion.g>
          ))}

          {step === 2 && (
            <>
              <text x={240} y={20} textAnchor="middle" fontSize={10} fontWeight={700} fill="#6366f1">
                1 Session = 1 DAG 요청
              </text>
              {[
                { label: '같은 DAG → 인접 블록 확률 큼', color: '#3b82f6' },
                { label: '추가 discovery 불필요', color: '#10b981' },
                { label: '반응 빠른 peer 우선순위', color: '#f59e0b' },
                { label: 'related CID 자동 추적', color: '#6366f1' },
              ].map((b, i) => (
                <motion.g key={b.label} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}>
                  <ActionBox x={40} y={45 + i * 40} w={400} h={32} label={b.label} color={b.color} />
                </motion.g>
              ))}
            </>
          )}

          {step === 3 && PICK.map((p, i) => (
            <motion.g key={p.label} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}>
              <ModuleBox x={30 + (i % 2) * 220} y={40 + Math.floor(i / 2) * 80}
                w={200} h={60} label={p.label} sub={p.sub} color={p.color} />
            </motion.g>
          ))}

          {step === 4 && (
            <>
              <text x={240} y={20} textAnchor="middle" fontSize={10} fontWeight={700} fill="#6366f1">
                debt ratio = sent_bytes / (received_bytes + 1)
              </text>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                <DataBox x={20} y={50} w={140} h={70} label="ratio 낮음" sub="공정 교환" color="#10b981" outlined />
              </motion.g>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
                <DataBox x={170} y={50} w={140} h={70} label="ratio 높음" sub="너무 많이 보냄" color="#f59e0b" outlined />
              </motion.g>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <AlertBox x={320} y={50} w={140} h={70} label="ratio 매우 높음" sub="응답 느려짐 / 무시" color="#ef4444" />
              </motion.g>
              <motion.text x={240} y={155} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                목표: free-rider 방지
              </motion.text>
            </>
          )}

          {step === 5 && COMPARE.map((c, ci) => (
            <motion.g key={c.side} initial={{ opacity: 0, x: ci === 0 ? -8 : 8 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: ci * 0.15 }}>
              <text x={ci === 0 ? 100 : 360} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={c.color}>
                {c.side}
              </text>
              {c.items.map((it, i) => (
                <DataBox key={it} x={ci === 0 ? 20 : 280} y={35 + i * 42} w={180} h={36}
                  label={it} color={c.color} outlined />
              ))}
            </motion.g>
          ))}
        </svg>
      )}
    </StepViz>
  );
}
