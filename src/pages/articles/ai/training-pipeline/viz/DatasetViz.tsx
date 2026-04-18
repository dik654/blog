import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';
import { STEPS, COLORS, sp } from './DatasetVizData';

export default function DatasetViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 230" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="arrDs" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {/* Step 0: Dataset basic structure */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ModuleBox x={160} y={10} w={200} h={50} label="CustomDataset" sub="(Dataset 상속)" color={COLORS.dataset} />
              {/* __init__ */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.1 }}>
                <ActionBox x={30} y={80} w={130} h={40} label="__init__(self)" sub="데이터 경로, 변환 저장" color={COLORS.dataset} />
              </motion.g>
              {/* __len__ */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.2 }}>
                <ActionBox x={180} y={80} w={130} h={40} label="__len__(self)" sub="return len(self.data)" color={COLORS.dataset} />
              </motion.g>
              {/* __getitem__ */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.3 }}>
                <ActionBox x={330} y={80} w={150} h={40} label="__getitem__(idx)" sub="로드 + 전처리 + 반환" color={COLORS.image} />
              </motion.g>
              {/* Connection lines */}
              <line x1={260} y1={62} x2={95} y2={78} stroke="var(--border)" strokeWidth={1} />
              <line x1={260} y1={62} x2={245} y2={78} stroke="var(--border)" strokeWidth={1} />
              <line x1={260} y1={62} x2={405} y2={78} stroke="var(--border)" strokeWidth={1} />
              {/* getitem detail */}
              <rect x={100} y={145} width={320} height={55} rx={8} fill={COLORS.image} fillOpacity={0.06}
                stroke={COLORS.image} strokeWidth={1} />
              <text x={260} y={164} textAnchor="middle" fontSize={10} fontWeight={600} fill={COLORS.image}>
                __getitem__ 내부 흐름
              </text>
              <text x={260} y={182} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                파일 읽기 → transform 적용 → (feature_tensor, label) 반환
              </text>
            </motion.g>
          )}

          {/* Step 1: DataLoader wrapping */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <DataBox x={20} y={60} w={100} h={34} label="Dataset" sub="N개 샘플" color={COLORS.dataset} />
              <motion.line x1={124} y1={77} x2={165} y2={77} stroke={COLORS.loader} strokeWidth={2}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ ...sp, duration: 0.4 }}
                markerEnd="url(#arrDs)" />
              <ModuleBox x={170} y={48} w={180} h={56} label="DataLoader" sub="배치 생성 엔진" color={COLORS.loader} />
              <motion.line x1={354} y1={77} x2={395} y2={77} stroke={COLORS.loader} strokeWidth={2}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ ...sp, duration: 0.4, delay: 0.2 }}
                markerEnd="url(#arrDs)" />
              {/* Mini-batches output */}
              {[0, 1, 2].map((i) => (
                <motion.g key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: 0.3 + i * 0.1 }}>
                  <DataBox x={400} y={38 + i * 30} w={90} h={24} label={`Batch ${i + 1}`}
                    sub={`${32} samples`} color={COLORS.loader} outlined />
                </motion.g>
              ))}
              {/* 4 params */}
              {[
                { label: 'batch_size=32', color: COLORS.loader },
                { label: 'shuffle=True', color: COLORS.image },
                { label: 'num_workers=4', color: COLORS.worker },
                { label: 'pin_memory=True', color: COLORS.pin },
              ].map((p, i) => (
                <motion.g key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ ...sp, delay: 0.2 + i * 0.08 }}>
                  <rect x={80 + i * 100} y={130} width={92} height={22} rx={11}
                    fill={p.color} fillOpacity={0.1} stroke={p.color} strokeWidth={0.8} />
                  <text x={126 + i * 100} y={145} textAnchor="middle" fontSize={8} fontWeight={600} fill={p.color}>
                    {p.label}
                  </text>
                </motion.g>
              ))}
              <text x={260} y={180} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                이 4가지 설정이 학습 속도를 결정
              </text>
            </motion.g>
          )}

          {/* Step 2: Workers & pin_memory */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* CPU workers */}
              <text x={120} y={24} textAnchor="middle" fontSize={11} fontWeight={700} fill={COLORS.worker}>
                CPU Workers
              </text>
              {[0, 1, 2, 3].map((i) => (
                <motion.g key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ ...sp, delay: i * 0.1 }}>
                  <ActionBox x={30 + i * 55} y={34} w={50} h={34} label={`W${i}`} sub="prefetch" color={COLORS.worker} />
                </motion.g>
              ))}
              {/* Arrow to pinned memory */}
              <motion.line x1={140} y1={72} x2={140} y2={95} stroke={COLORS.worker} strokeWidth={1.5}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ ...sp, delay: 0.4 }}
                markerEnd="url(#arrDs)" />
              {/* Pinned Memory */}
              <rect x={60} y={100} width={160} height={36} rx={8} fill={COLORS.pin} fillOpacity={0.08}
                stroke={COLORS.pin} strokeWidth={1.2} />
              <text x={140} y={117} textAnchor="middle" fontSize={10} fontWeight={600} fill={COLORS.pin}>
                Pinned Memory (CPU)
              </text>
              <text x={140} y={130} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">페이지 잠금 → DMA 전송</text>
              {/* Arrow to GPU */}
              <motion.line x1={224} y1={118} x2={300} y2={118} stroke={COLORS.pin} strokeWidth={1.5}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ ...sp, delay: 0.6 }}
                markerEnd="url(#arrDs)" />
              {/* GPU */}
              <rect x={305} y={90} width={180} height={56} rx={10} fill={COLORS.image} fillOpacity={0.08}
                stroke={COLORS.image} strokeWidth={1.5} />
              <text x={395} y={112} textAnchor="middle" fontSize={11} fontWeight={700} fill={COLORS.image}>GPU</text>
              <text x={395} y={128} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                .to(device) — 비동기 복사
              </text>
              {/* Comparison bars */}
              <text x={80} y={168} fontSize={9} fontWeight={600} fill="var(--foreground)">num_workers=0</text>
              <rect x={210} y={158} width={250} height={12} rx={4} fill="var(--border)" opacity={0.2} />
              <motion.rect x={210} y={158} width={0} height={12} rx={4} fill={COLORS.worker} opacity={0.3}
                animate={{ width: 250 }} transition={{ ...sp, duration: 1 }} />
              <text x={80} y={192} fontSize={9} fontWeight={600} fill="var(--foreground)">num_workers=4</text>
              <rect x={210} y={182} width={250} height={12} rx={4} fill="var(--border)" opacity={0.2} />
              <motion.rect x={210} y={182} width={0} height={12} rx={4} fill={COLORS.worker} opacity={0.7}
                animate={{ width: 100 }} transition={{ ...sp, duration: 0.6 }} />
              <text x={320} y={192} fontSize={8} fill={COLORS.worker} fontWeight={600}>2.5x 빠름</text>
            </motion.g>
          )}

          {/* Step 3: Domain-specific patterns */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {[
                {
                  label: 'Image', sub: 'PIL → transforms → tensor',
                  detail: 'Resize + Aug + Normalize',
                  color: COLORS.image, x: 15, y: 25,
                },
                {
                  label: 'Tabular', sub: 'DataFrame → row indexing',
                  detail: 'df.iloc[idx].values → float32',
                  color: COLORS.table, x: 185, y: 25,
                },
                {
                  label: 'Text', sub: 'tokenizer → ids + mask',
                  detail: 'padding, truncation, max_len',
                  color: COLORS.text, x: 355, y: 25,
                },
              ].map((d, i) => (
                <motion.g key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ ...sp, delay: i * 0.15 }}>
                  <rect x={d.x} y={d.y} width={155} height={90} rx={8}
                    fill={d.color} fillOpacity={0.06} stroke={d.color} strokeWidth={1.2} />
                  <text x={d.x + 78} y={d.y + 20} textAnchor="middle"
                    fontSize={12} fontWeight={700} fill={d.color}>{d.label}</text>
                  <line x1={d.x + 10} y1={d.y + 28} x2={d.x + 145} y2={d.y + 28}
                    stroke={d.color} strokeOpacity={0.3} strokeWidth={0.6} />
                  <text x={d.x + 78} y={d.y + 46} textAnchor="middle"
                    fontSize={9} fontWeight={600} fill="var(--foreground)">{d.sub}</text>
                  <rect x={d.x + 10} y={d.y + 56} width={135} height={24} rx={5}
                    fill="var(--muted)" fillOpacity={0.2} />
                  <text x={d.x + 78} y={d.y + 72} textAnchor="middle"
                    fontSize={8} fill="var(--muted-foreground)">{d.detail}</text>
                </motion.g>
              ))}
              <text x={260} y={145} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                핵심: __getitem__에서 전처리를 수행 — 도메인마다 패턴이 다르다
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
