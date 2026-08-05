import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const STEPS = [
  { label: '계층: Torrent → Files + Pieces → Chunks(16KB)' },
  { label: 'Piece size 가변 vs Block(chunk) 고정 16KB' },
  { label: 'Bitfield: 1 bit per piece, 보유 여부 비트맵' },
  { label: 'Request 흐름 8단계: bitfield→request→piece→verify→have' },
  { label: 'PieceTracker / ChunkTracker 데이터 구조' },
  { label: '해시 검증 + Endgame 모드' },
];

const HIER = [
  { label: 'Torrent', sub: '루트', color: '#6366f1', x: 200, y: 20, w: 80 },
  { label: 'File 1', sub: '', color: '#3b82f6', x: 20, y: 70, w: 80 },
  { label: 'File N', sub: 'multi', color: '#3b82f6', x: 110, y: 70, w: 80 },
  { label: 'Piece 0', sub: '256KB~1MB', color: '#10b981', x: 230, y: 70, w: 100 },
  { label: 'Piece N', sub: '...', color: '#10b981', x: 340, y: 70, w: 100 },
  { label: 'Chunk 0', sub: '16KB', color: '#f59e0b', x: 230, y: 140, w: 70 },
  { label: 'Chunk 1', sub: '16KB', color: '#f59e0b', x: 305, y: 140, w: 70 },
  { label: 'Chunk N', sub: '16KB', color: '#f59e0b', x: 380, y: 140, w: 70 },
];

const SIZES = [
  { label: 'Piece size', sub: '16KB ~ 16MB (가변)', color: '#10b981' },
  { label: 'Small torrent', sub: '16-256KB piece', color: '#3b82f6' },
  { label: 'Large torrent', sub: '1-16MB piece', color: '#6366f1' },
  { label: 'Block (chunk)', sub: '항상 16384 bytes', color: '#f59e0b' },
];

const FLOW = [
  '1. Peer가 bitfield 송신',
  '2. interested piece 계산 (rarest first)',
  '3. REQUEST(piece, offset, 16KB)',
  '4. PIECE(piece, offset, data) 수신',
  '5. chunk buffer 저장',
  '6. piece 완성 → SHA-1 검증',
  '7. hash valid → 디스크 쓰기',
  '8. HAVE 브로드캐스트',
];

export default function PieceStructureViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <>
              {HIER.map((h, i) => (
                <motion.g key={h.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}>
                  <ModuleBox x={h.x} y={h.y} w={h.w} h={40} label={h.label} sub={h.sub} color={h.color} />
                </motion.g>
              ))}
              {[[240, 60, 60, 70], [240, 60, 150, 70], [240, 60, 280, 70], [240, 60, 390, 70],
                [280, 110, 265, 140], [280, 110, 340, 140], [280, 110, 415, 140]].map((c, i) => (
                  <motion.line key={i} x1={c[0]} y1={c[1]} x2={c[2]} y2={c[3]}
                    stroke="var(--muted-foreground)" strokeWidth={0.5} strokeDasharray="2 2" opacity={0.4}
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.4 }} />
                ))}
            </>
          )}

          {step === 1 && SIZES.map((s, i) => (
            <motion.g key={s.label} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}>
              <ModuleBox x={50} y={20 + i * 50} w={380} h={40} label={s.label} sub={s.sub} color={s.color} />
            </motion.g>
          ))}

          {step === 2 && (
            <>
              <text x={240} y={20} textAnchor="middle" fontSize={10} fontWeight={700} fill="#6366f1">
                Bitfield: 10110010 → have pieces 0, 2, 3, 6
              </text>
              {[1, 0, 1, 1, 0, 0, 1, 0].map((b, i) => (
                <motion.g key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}>
                  <rect x={50 + i * 48} y={50} width={42} height={42} rx={4}
                    fill={b ? '#10b98122' : '#94a3b815'}
                    stroke={b ? '#10b981' : '#94a3b8'} strokeWidth={1} />
                  <text x={71 + i * 48} y={76} textAnchor="middle" fontSize={14} fontWeight={700}
                    fill={b ? '#10b981' : '#94a3b8'}>{b}</text>
                  <text x={71 + i * 48} y={108} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                    P{i}
                  </text>
                </motion.g>
              ))}
              <text x={240} y={150} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                각 비트 1 = 보유, 0 = 미보유
              </text>
            </>
          )}

          {step === 3 && FLOW.map((f, i) => (
            <motion.g key={f} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}>
              <ActionBox x={20 + (i % 2) * 230} y={20 + Math.floor(i / 2) * 50}
                w={220} h={40} label={f} color={i < 4 ? '#3b82f6' : '#10b981'} />
            </motion.g>
          ))}

          {step === 4 && (
            <>
              <text x={240} y={20} textAnchor="middle" fontSize={10} fontWeight={700} fill="#6366f1">
                rqbit Tracker 구조
              </text>
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                <ModuleBox x={20} y={40} w={210} h={140} label="PieceTracker" sub="HashMap<idx, PieceState>" color="#6366f1" />
                <DataBox x={35} y={80} w={180} h={26} label="status: InProgress/Complete" color="#3b82f6" outlined />
                <DataBox x={35} y={112} w={180} h={26} label="chunks_received: Vec<bool>" color="#3b82f6" outlined />
                <DataBox x={35} y={144} w={180} h={26} label="buffer: Option<Vec<u8>>" color="#3b82f6" outlined />
              </motion.g>
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <ModuleBox x={250} y={40} w={210} h={140} label="ChunkTracker" sub="per-piece chunks" color="#10b981" />
                <DataBox x={265} y={80} w={180} h={26} label="fine-grained progress" color="#3b82f6" outlined />
                <DataBox x={265} y={112} w={180} h={26} label="16KB block 단위" color="#3b82f6" outlined />
                <DataBox x={265} y={144} w={180} h={26} label="endgame trigger" color="#f59e0b" outlined />
              </motion.g>
            </>
          )}

          {step === 5 && (
            <>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <ActionBox x={20} y={20} w={210} h={50} label="expected = piece_hashes[idx]" sub="from .torrent" color="#6366f1" />
                <ActionBox x={250} y={20} w={210} h={50} label="actual = SHA1(piece_data)" sub="recompute" color="#10b981" />
              </motion.g>
              <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
                <AlertBox x={20} y={85} w={210} h={50} label="Mismatch → discard" sub="re-request, peer score 감점" color="#ef4444" />
                <DataBox x={250} y={85} w={210} h={50} label="Match → write disk" sub="HAVE 브로드캐스트" color="#10b981" outlined />
              </motion.g>
              <motion.g initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                <ModuleBox x={50} y={150} w={380} h={50} label="Endgame Mode" sub="마지막 piece 수개 → 모든 peer 동시 요청, 먼저 응답 수락 + CANCEL" color="#f59e0b" />
              </motion.g>
            </>
          )}
        </svg>
      )}
    </StepViz>
  );
}
