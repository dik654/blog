import { motion } from 'framer-motion';
import { ModuleBox, DataBox, StatusBox } from '@/components/viz/boxes';
import { C, MODELS, DBS } from './EmbeddingVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

/* Step 0: 임베딩 모델 비교 */
function ModelCompareStep() {
  const colX = [20, 130, 240, 310, 380];
  const headers = ['모델', '차원', '언어', 'MTEB'];
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.muted}>
        임베딩 모델 비교 (MTEB 벤치마크)
      </text>
      {/* 헤더 */}
      <rect x={10} y={20} width={460} height={18} rx={3} fill={C.muted + '10'} />
      {headers.map((h, i) => (
        <text key={i} x={colX[i]} y={33} fontSize={8} fontWeight={600} fill={C.muted}>{h}</text>
      ))}
      {/* 모델 행 */}
      {MODELS.map((m, i) => {
        const y = 44 + i * 24;
        const isBest = i === 0;
        return (
          <motion.g key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1, ...sp }}>
            {isBest && <rect x={10} y={y - 4} width={460} height={20} rx={3} fill={C.model + '08'} />}
            <text x={colX[0]} y={y + 10} fontSize={9} fontWeight={isBest ? 700 : 500}
              fill={isBest ? C.model : C.muted}>{m.name}</text>
            <text x={colX[1]} y={y + 10} fontSize={9} fill={C.muted}>{m.dim}</text>
            <text x={colX[2]} y={y + 10} fontSize={9} fill={C.muted}>{m.lang}</text>
            {/* Score bar */}
            <rect x={colX[3]} y={y + 2} width={70} height={10} rx={3} fill={C.muted + '10'} />
            <motion.rect x={colX[3]} y={y + 2} width={0} height={10} rx={3}
              fill={isBest ? C.model : C.model + '60'}
              animate={{ width: m.score * 70 }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }} />
            <text x={colX[3] + 74} y={y + 10} fontSize={7} fill={C.model}>{m.score}</text>
          </motion.g>
        );
      })}
      <motion.text x={240} y={145} textAnchor="middle" fontSize={8} fill={C.model}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        한국어 + 영어 혼용: E5/BGE multilingual 추천
      </motion.text>
    </g>
  );
}

/* Step 1: 텍스트 → 벡터 변환 */
function EmbeddingProcessStep() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.muted}>
        텍스트 → 벡터 변환 과정
      </text>
      {/* 입력 텍스트 */}
      <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
        <rect x={10} y={28} width={100} height={28} rx={5}
          fill={C.muted + '10'} stroke={C.muted} strokeWidth={0.8} />
        <text x={60} y={46} textAnchor="middle" fontSize={8} fill={C.muted}>CNC 진동 대응</text>
      </motion.g>
      {/* 토크나이저 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15, ...sp }}>
        <line x1={110} y1={42} x2={125} y2={42} stroke={C.model} strokeWidth={0.8} />
        <rect x={125} y={28} width={68} height={28} rx={5}
          fill={C.model + '12'} stroke={C.model} strokeWidth={1} />
        <text x={159} y={40} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.model}>Tokenizer</text>
        <text x={159} y={50} textAnchor="middle" fontSize={7} fill={C.muted}>[101,7823,...]</text>
      </motion.g>
      {/* Transformer 인코더 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, ...sp }}>
        <line x1={193} y1={42} x2={210} y2={42} stroke={C.model} strokeWidth={0.8} />
        <rect x={210} y={22} width={90} height={40} rx={6}
          fill={C.model + '15'} stroke={C.model} strokeWidth={1.2} />
        <text x={255} y={40} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.model}>Transformer</text>
        <text x={255} y={52} textAnchor="middle" fontSize={7} fill={C.muted}>Encoder</text>
      </motion.g>
      {/* Pooling */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45, ...sp }}>
        <line x1={300} y1={42} x2={315} y2={42} stroke={C.vector} strokeWidth={0.8} />
        <rect x={315} y={28} width={70} height={28} rx={5}
          fill={C.vector + '12'} stroke={C.vector} strokeWidth={1} />
        <text x={350} y={40} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.vector}>Pooling</text>
        <text x={350} y={50} textAnchor="middle" fontSize={7} fill={C.muted}>mean/CLS</text>
      </motion.g>
      {/* 출력 벡터 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, ...sp }}>
        <line x1={385} y1={42} x2={400} y2={42} stroke={C.vector} strokeWidth={0.8} />
        <rect x={400} y={26} width={68} height={32} rx={14}
          fill={C.vector + '15'} stroke={C.vector} strokeWidth={1.5} />
        <text x={434} y={40} textAnchor="middle" fontSize={8} fontWeight={700} fill={C.vector}>v</text>
        <text x={434} y={50} textAnchor="middle" fontSize={7} fill={C.vector}>1024d</text>
      </motion.g>
      {/* 하단 배치 처리 안내 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        <rect x={60} y={78} width={360} height={44} rx={6}
          fill={C.vector + '06'} stroke={C.vector} strokeWidth={0.5} strokeDasharray="4 2" />
        <text x={240} y={94} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.vector}>
          배치 처리: GPU에서 256~512 청크를 한 번에 인코딩
        </text>
        <text x={240} y={110} textAnchor="middle" fontSize={7} fill={C.muted}>
          L2 정규화 후 코사인 유사도 = 단순 내적 -- 검색 효율 극대화
        </text>
      </motion.g>
    </g>
  );
}

/* Step 2: 벡터 DB 비교 */
function VectorDBStep() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.muted}>
        벡터 DB 비교
      </text>
      {DBS.map((db, i) => {
        const y = 26 + i * 38;
        const colors = [C.model, C.db, C.index];
        return (
          <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.12, ...sp }}>
            <ModuleBox x={15} y={y} w={90} h={32} label={db.name} sub={db.type} color={colors[i]} />
            <StatusBox x={120} y={y} w={100} h={32} label="규모"
              sub={db.scale} color={colors[i]} progress={i === 0 ? 0.7 : i === 1 ? 0.2 : 1} />
            <rect x={235} y={y + 2} width={220} height={28} rx={5}
              fill={colors[i] + '08'} stroke={colors[i]} strokeWidth={0.5} />
            <text x={345} y={y + 20} textAnchor="middle" fontSize={8} fill={colors[i]}>{db.note}</text>
          </motion.g>
        );
      })}
      <motion.text x={240} y={145} textAnchor="middle" fontSize={8} fill={C.muted}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        프로토타입: Chroma | 프로덕션 소규모: FAISS | 대규모: Milvus
      </motion.text>
    </g>
  );
}

/* Step 3: HNSW vs IVF */
function IndexStep() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.muted}>
        인덱싱 전략: HNSW vs IVF
      </text>
      {/* HNSW - 그래프 */}
      <motion.g initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
        <rect x={15} y={26} width={210} height={88} rx={8}
          fill={C.index + '06'} stroke={C.index} strokeWidth={0.8} />
        <text x={120} y={40} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.index}>HNSW</text>
        {/* 그래프 노드 */}
        {[[60, 58], [120, 50], [80, 85], [150, 78], [180, 58], [40, 72]].map(([nx, ny], i) => (
          <motion.circle key={i} cx={nx} cy={ny} r={5}
            fill={C.index + '30'} stroke={C.index} strokeWidth={0.8}
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ delay: 0.2 + i * 0.05 }} />
        ))}
        {/* 그래프 간선 */}
        {[[60, 58, 120, 50], [120, 50, 150, 78], [80, 85, 150, 78], [60, 58, 80, 85],
          [150, 78, 180, 58], [120, 50, 180, 58], [40, 72, 60, 58], [40, 72, 80, 85]].map(([x1, y1, x2, y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={C.index} strokeWidth={0.5} opacity={0.4} />
        ))}
        <text x={120} y={106} textAnchor="middle" fontSize={7} fill={C.index}>지연: ~5ms | 메모리: 2~3x</text>
      </motion.g>
      {/* IVF - 클러스터 */}
      <motion.g initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, ...sp }}>
        <rect x={255} y={26} width={210} height={88} rx={8}
          fill={C.db + '06'} stroke={C.db} strokeWidth={0.8} />
        <text x={360} y={40} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.db}>IVF</text>
        {/* 클러스터 원 */}
        {[[300, 70, 25], [360, 65, 30], [420, 75, 20]].map(([cx, cy, r], i) => (
          <motion.g key={i} initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ delay: 0.3 + i * 0.08 }}>
            <circle cx={cx} cy={cy} r={r} fill={C.db + '12'} stroke={C.db} strokeWidth={0.8} />
            <text x={cx} y={cy + 3} textAnchor="middle" fontSize={7} fill={C.db}>C{i + 1}</text>
          </motion.g>
        ))}
        <text x={360} y={106} textAnchor="middle" fontSize={7} fill={C.db}>지연: ~8ms | 메모리: 1x</text>
      </motion.g>
      <motion.text x={240} y={135} textAnchor="middle" fontSize={8} fill={C.muted}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        속도 우선: HNSW | 메모리 우선: IVF + PQ (Product Quantization)
      </motion.text>
    </g>
  );
}

/* Step 4: 차원 vs 속도 */
function DimensionStep() {
  const dims = [
    { dim: 256, mem: '1GB', speed: '2ms', quality: 0.92 },
    { dim: 512, mem: '2GB', speed: '3ms', quality: 0.95 },
    { dim: 768, mem: '3GB', speed: '5ms', quality: 0.97 },
    { dim: 1024, mem: '4GB', speed: '7ms', quality: 0.99 },
  ];
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.muted}>
        차원 vs 메모리 vs 검색 품질 (100만 벡터 기준)
      </text>
      {/* 헤더 */}
      <rect x={20} y={22} width={440} height={16} rx={3} fill={C.muted + '10'} />
      {['차원', '메모리', '지연', '품질 (상대)'].map((h, i) => (
        <text key={i} x={[55, 155, 255, 380][i]} y={33} textAnchor="middle"
          fontSize={8} fontWeight={600} fill={C.muted}>{h}</text>
      ))}
      {dims.map((d, i) => {
        const y = 44 + i * 22;
        return (
          <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}>
            <text x={55} y={y + 14} textAnchor="middle" fontSize={9} fontWeight={600}
              fill={C.vector}>{d.dim}</text>
            <text x={155} y={y + 14} textAnchor="middle" fontSize={9} fill={C.tradeoff}>{d.mem}</text>
            <text x={255} y={y + 14} textAnchor="middle" fontSize={9} fill={C.tradeoff}>{d.speed}</text>
            {/* 품질 바 */}
            <rect x={330} y={y + 5} width={100} height={10} rx={3} fill={C.muted + '10'} />
            <motion.rect x={330} y={y + 5} width={0} height={10} rx={3}
              fill={C.vector + '60'}
              animate={{ width: d.quality * 100 }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }} />
            <text x={436} y={y + 14} fontSize={7} fill={C.vector}>{d.quality}</text>
          </motion.g>
        );
      })}
      <motion.text x={240} y={140} textAnchor="middle" fontSize={8} fill={C.vector}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        Matryoshka 임베딩: 1024d → 256d 축소 시 성능 95% 유지
      </motion.text>
    </g>
  );
}

export default function EmbeddingVizSteps({ step }: { step: number }) {
  switch (step) {
    case 0: return <ModelCompareStep />;
    case 1: return <EmbeddingProcessStep />;
    case 2: return <VectorDBStep />;
    case 3: return <IndexStep />;
    case 4: return <DimensionStep />;
    default: return <g />;
  }
}
