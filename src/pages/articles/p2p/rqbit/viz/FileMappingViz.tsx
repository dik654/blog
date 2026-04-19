import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';

const STEPS = [
  { label: 'Multi-file 토렌트: 연속 바이트 스트림으로 취급' },
  { label: 'Piece가 파일 경계를 넘는 경우의 매핑' },
  { label: '쓰기: piece_idx → 파일 오프셋 계산 + 분할 write' },
  { label: 'HTTP Range 스트리밍: byte 범위 → piece 범위 변환' },
  { label: 'I/O 최적화: pread/pwrite + pre-allocate + mmap' },
  { label: 'FastResume: bitfield + checksum 저장으로 재검증 skip' },
];

const FILES = [
  { label: 'A.mp4', sub: '3 GB', color: '#6366f1' },
  { label: 'B.srt', sub: '20 KB', color: '#10b981' },
  { label: 'C.mp3', sub: '5 MB', color: '#f59e0b' },
];

const MAPPING = [
  { label: 'Piece 0', sub: 'A.mp4 [0..1MB]', color: '#6366f1' },
  { label: 'Piece 3072', sub: 'A.mp4 끝 + B.srt 시작', color: '#ec4899' },
  { label: 'Piece 3073', sub: 'B.srt 끝 + C.mp3 시작', color: '#ec4899' },
  { label: 'Piece N', sub: 'C.mp3 [..끝]', color: '#f59e0b' },
];

const OPTS = [
  { label: 'pread/pwrite', sub: 'positional I/O, FD 공유', color: '#6366f1' },
  { label: 'pre-allocate', sub: 'fallocate, fragmentation 방지', color: '#10b981' },
  { label: 'mmap', sub: 'OS 캐시 자동 관리', color: '#3b82f6' },
  { label: 'Direct I/O', sub: 'OS 캐시 우회 (대용량)', color: '#f59e0b' },
];

export default function FileMappingViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <>
              <text x={240} y={20} textAnchor="middle" fontSize={10} fontWeight={700} fill="#6366f1">
                연속 바이트 스트림 (logical view)
              </text>
              <motion.rect x={20} y={40} width={440} height={28} rx={4} fill="#6366f110" stroke="#6366f1" strokeWidth={1}
                initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} style={{ transformOrigin: 'left' }} />
              <text x={240} y={58} textAnchor="middle" fontSize={9} fill="#6366f1">byte 0 ─────────────────────► byte total</text>
              <text x={240} y={95} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                매핑되는 실제 파일 (physical):
              </text>
              {FILES.map((f, i) => (
                <motion.g key={f.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}>
                  <ModuleBox x={20 + i * 155} y={120} w={140} h={60} label={f.label} sub={f.sub} color={f.color} />
                </motion.g>
              ))}
            </>
          )}

          {step === 1 && MAPPING.map((m, i) => (
            <motion.g key={m.label} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}>
              <ActionBox x={40} y={20 + i * 50} w={400} h={40} label={m.label} sub={m.sub} color={m.color} />
            </motion.g>
          ))}

          {step === 2 && (
            <>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <DataBox x={20} y={70} w={120} h={60} label="(piece, offset, data)" color="#6366f1" outlined />
              </motion.g>
              <motion.line x1={145} y1={100} x2={195} y2={100} stroke="#10b981" strokeWidth={1.5} markerEnd="url(#a2)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 }} />
              <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
                <ActionBox x={200} y={70} w={120} h={60} label="map → files" sub="byte range 분할" color="#10b981" />
              </motion.g>
              <motion.line x1={325} y1={100} x2={375} y2={100} stroke="#f59e0b" strokeWidth={1.5} markerEnd="url(#a2)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5 }} />
              <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }}>
                <DataBox x={380} y={70} w={80} h={60} label="pwrite" sub="N files" color="#f59e0b" outlined />
              </motion.g>
              <defs>
                <marker id="a2" markerWidth={8} markerHeight={8} refX={6} refY={3} orient="auto">
                  <polygon points="0 0, 8 3, 0 6" fill="var(--muted-foreground)" />
                </marker>
              </defs>
            </>
          )}

          {step === 3 && (
            <>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <DataBox x={20} y={20} w={440} h={32} label="GET /stream  Range: bytes=1000000-2000000" color="#6366f1" outlined />
              </motion.g>
              {[
                { label: 'start_piece = floor(start / piece_size)', color: '#3b82f6' },
                { label: 'end_piece = floor(end / piece_size)', color: '#3b82f6' },
                { label: 'wait until pieces ready', color: '#f59e0b' },
                { label: 'serve bytes from mapped files', color: '#10b981' },
              ].map((s, i) => (
                <motion.g key={s.label} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.08 }}>
                  <ActionBox x={40} y={68 + i * 36} w={400} h={28} label={s.label} color={s.color} />
                </motion.g>
              ))}
            </>
          )}

          {step === 4 && OPTS.map((o, i) => (
            <motion.g key={o.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08 }}>
              <ModuleBox x={20 + (i % 2) * 230} y={30 + Math.floor(i / 2) * 90}
                w={210} h={70} label={o.label} sub={o.sub} color={o.color} />
            </motion.g>
          ))}

          {step === 5 && (
            <>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <DataBox x={150} y={20} w={180} h={36} label="resume.dat" sub="bitfield + checksum" color="#10b981" outlined />
              </motion.g>
              {[
                { label: '비트필드', sub: '보유 piece 비트맵', color: '#6366f1' },
                { label: '파일 체크섬', sub: '변조 탐지', color: '#3b82f6' },
                { label: '진행 위치', sub: '재개 지점', color: '#f59e0b' },
              ].map((b, i) => (
                <motion.g key={b.label} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.08 }}>
                  <ActionBox x={20 + i * 155} y={80} w={140} h={50} label={b.label} sub={b.sub} color={b.color} />
                </motion.g>
              ))}
              <motion.text x={240} y={170} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                checksum 일치 → 재검증 skip / 불일치 → 전체 재검증
              </motion.text>
            </>
          )}
        </svg>
      )}
    </StepViz>
  );
}
