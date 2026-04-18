import { motion } from 'framer-motion';
import { COLORS } from './AppsDetailVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

/* ── Step 0: 검색 & 분류 ── */
export function SearchClassify() {
  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10}
        fontWeight={700} fill="var(--foreground)">
        Semantic Search + 분류
      </text>

      {/* Semantic Search flow */}
      <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.1 }}>
        <rect x={15} y={22} width={218} height={68} rx={6}
          fill={`${COLORS.search}06`} stroke={COLORS.search} strokeWidth={0.6} />
        <text x={124} y={34} textAnchor="middle" fontSize={9}
          fontWeight={700} fill={COLORS.search}>Semantic Search (RAG)</text>

        {/* Query */}
        <rect x={25} y={40} width={55} height={20} rx={10}
          fill={`${COLORS.search}15`} stroke={COLORS.search} strokeWidth={0.8} />
        <text x={52} y={53} textAnchor="middle" fontSize={7.5}
          fontWeight={600} fill={COLORS.search}>Query</text>

        {/* Arrow */}
        <motion.line x1={82} y1={50} x2={98} y2={50}
          stroke={COLORS.dim} strokeWidth={0.8}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ ...sp, delay: 0.2 }} />

        {/* Encode */}
        <rect x={100} y={40} width={50} height={20} rx={4}
          fill={`${COLORS.search}10`} stroke={COLORS.search} strokeWidth={0.5} />
        <text x={125} y={53} textAnchor="middle" fontSize={7}
          fill={COLORS.search}>encode</text>

        {/* Arrow */}
        <motion.line x1={152} y1={50} x2={168} y2={50}
          stroke={COLORS.dim} strokeWidth={0.8}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ ...sp, delay: 0.3 }} />

        {/* Vector DB */}
        <rect x={170} y={38} width={55} height={24} rx={4}
          fill={`${COLORS.classify}10`} stroke={COLORS.classify} strokeWidth={0.8} />
        <text x={197} y={48} textAnchor="middle" fontSize={7}
          fontWeight={600} fill={COLORS.classify}>VectorDB</text>
        <text x={197} y={58} textAnchor="middle" fontSize={6.5}
          fill="var(--muted-foreground)">cosine top-k</text>

        {/* Results */}
        <text x={124} y={80} textAnchor="middle" fontSize={7}
          fill="var(--muted-foreground)">Pinecone, Weaviate, Chroma</text>
      </motion.g>

      {/* Classification flow */}
      <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.4 }}>
        <rect x={248} y={22} width={218} height={68} rx={6}
          fill={`${COLORS.classify}06`} stroke={COLORS.classify} strokeWidth={0.6} />
        <text x={357} y={34} textAnchor="middle" fontSize={9}
          fontWeight={700} fill={COLORS.classify}>분류 (Classification)</text>

        {/* Embedding input */}
        <rect x={258} y={42} width={60} height={18} rx={9}
          fill={`${COLORS.search}12`} stroke={COLORS.search} strokeWidth={0.8} />
        <text x={288} y={54} textAnchor="middle" fontSize={7}
          fontWeight={600} fill={COLORS.search}>embedding</text>

        {/* Arrow */}
        <motion.line x1={320} y1={51} x2={338} y2={51}
          stroke={COLORS.dim} strokeWidth={0.8}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ ...sp, delay: 0.5 }} />

        {/* Classifier */}
        <rect x={340} y={42} width={55} height={18} rx={4}
          fill={`${COLORS.classify}10`} stroke={COLORS.classify} strokeWidth={0.5} />
        <text x={367} y={54} textAnchor="middle" fontSize={7}
          fill={COLORS.classify}>classifier</text>

        {/* Labels */}
        {['감정분석', '스팸', '의도'].map((l, i) => (
          <motion.g key={l} initial={{ opacity: 0, x: 3 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...sp, delay: 0.55 + i * 0.06 }}>
            <rect x={258 + i * 68} y={66} width={62} height={16} rx={8}
              fill={`${COLORS.classify}08`} stroke={COLORS.classify} strokeWidth={0.4} />
            <text x={289 + i * 68} y={77} textAnchor="middle" fontSize={7}
              fill={COLORS.classify}>{l}</text>
          </motion.g>
        ))}
      </motion.g>

      {/* Code example */}
      <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.7 }}>
        <rect x={40} y={98} width={400} height={48} rx={5}
          fill="var(--border)" fillOpacity={0.08} />
        <text x={240} y={112} textAnchor="middle" fontSize={7.5}
          fontFamily="monospace" fill="var(--muted-foreground)">
          model = SentenceTransformer('all-MiniLM-L6-v2')
        </text>
        <text x={240} y={124} textAnchor="middle" fontSize={7.5}
          fontFamily="monospace" fill="var(--muted-foreground)">
          embeddings = model.encode(corpus)  # (N, 384)
        </text>
        <text x={240} y={136} textAnchor="middle" fontSize={7.5}
          fontFamily="monospace" fill="var(--muted-foreground)">
          similarities = cosine_similarity([query_emb], embeddings)
        </text>
      </motion.g>
    </g>
  );
}

/* ── Step 1: 클러스터링 & 추천 ── */
export function ClusterRecommend() {
  // Cluster visualization
  const clusters = [
    { cx: 100, cy: 60, points: [[85, 48], [95, 68], [110, 55], [105, 72], [88, 60]], color: COLORS.search },
    { cx: 200, cy: 55, points: [[185, 48], [195, 62], [210, 50], [205, 65], [192, 55]], color: COLORS.classify },
    { cx: 150, cy: 105, points: [[135, 98], [148, 112], [158, 100], [162, 110], [140, 108]], color: COLORS.cluster },
  ];

  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10}
        fontWeight={700} fill="var(--foreground)">
        클러스터링 + 추천 시스템
      </text>

      {/* Clustering */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.1 }}>
        <rect x={15} y={22} width={230} height={110} rx={6}
          fill={`${COLORS.cluster}04`} stroke={COLORS.cluster} strokeWidth={0.5} />
        <text x={130} y={34} textAnchor="middle" fontSize={9}
          fontWeight={700} fill={COLORS.cluster}>K-means / DBSCAN</text>

        {clusters.map((cl, ci) => (
          <motion.g key={ci} initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...sp, delay: 0.2 + ci * 0.1 }}>
            {/* Cluster boundary (circle) */}
            <circle cx={cl.cx} cy={cl.cy} r={28}
              fill={`${cl.color}08`} stroke={cl.color} strokeWidth={0.5}
              strokeDasharray="3 2" />
            {/* Points */}
            {cl.points.map((p, pi) => (
              <motion.circle key={pi} cx={p[0]} cy={p[1]} r={3}
                fill={cl.color} fillOpacity={0.6}
                initial={{ r: 0 }} animate={{ r: 3 }}
                transition={{ ...sp, delay: 0.3 + ci * 0.1 + pi * 0.03 }} />
            ))}
          </motion.g>
        ))}

        <text x={130} y={126} textAnchor="middle" fontSize={7}
          fill="var(--muted-foreground)">문서 그룹화, 유사 사용자 탐색</text>
      </motion.g>

      {/* Recommendation */}
      <motion.g initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.5 }}>
        <rect x={260} y={22} width={205} height={110} rx={6}
          fill={`${COLORS.classify}04`} stroke={COLORS.classify} strokeWidth={0.5} />
        <text x={362} y={34} textAnchor="middle" fontSize={9}
          fontWeight={700} fill={COLORS.classify}>추천 시스템</text>

        {/* User embedding */}
        <rect x={275} y={44} width={65} height={22} rx={11}
          fill={`${COLORS.search}12`} stroke={COLORS.search} strokeWidth={0.8} />
        <text x={307} y={58} textAnchor="middle" fontSize={8}
          fontWeight={600} fill={COLORS.search}>User</text>

        {/* dot product */}
        <motion.line x1={342} y1={55} x2={360} y2={55}
          stroke={COLORS.dim} strokeWidth={0.8}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ ...sp, delay: 0.6 }} />
        <text x={351} y={50} textAnchor="middle" fontSize={8}
          fill={COLORS.dim}>dot</text>

        {/* Item embeddings */}
        {['Movie A', 'Movie B', 'Movie C'].map((item, i) => (
          <motion.g key={item} initial={{ opacity: 0, x: 5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...sp, delay: 0.65 + i * 0.08 }}>
            <rect x={365} y={42 + i * 22} width={65} height={18} rx={9}
              fill={`${COLORS.classify}${i === 0 ? '20' : '10'}`}
              stroke={COLORS.classify} strokeWidth={i === 0 ? 1 : 0.5} />
            <text x={397} y={54 + i * 22} textAnchor="middle" fontSize={7}
              fontWeight={i === 0 ? 600 : 400}
              fill={COLORS.classify}>{item}</text>
          </motion.g>
        ))}

        {/* Score */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ ...sp, delay: 0.9 }}>
          <text x={445} y={56} textAnchor="middle" fontSize={7}
            fontWeight={700} fill={COLORS.cluster}>0.92</text>
          <text x={445} y={78} textAnchor="middle" fontSize={7}
            fill="var(--muted-foreground)">0.61</text>
          <text x={445} y={100} textAnchor="middle" fontSize={7}
            fill="var(--muted-foreground)">0.35</text>
        </motion.g>

        {/* Platforms */}
        <text x={362} y={126} textAnchor="middle" fontSize={7}
          fill="var(--muted-foreground)">Netflix, Amazon, YouTube</text>
      </motion.g>
    </g>
  );
}

/* ── Step 2: 번역 & 이상탐지 ── */
export function TranslateAnomaly() {
  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10}
        fontWeight={700} fill="var(--foreground)">
        Cross-lingual Embedding + 이상 탐지
      </text>

      {/* Cross-lingual */}
      <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.1 }}>
        <rect x={15} y={22} width={220} height={80} rx={6}
          fill={`${COLORS.translate}06`} stroke={COLORS.translate} strokeWidth={0.6} />
        <text x={125} y={34} textAnchor="middle" fontSize={9}
          fontWeight={700} fill={COLORS.translate}>Cross-lingual Embeddings</text>

        {/* Shared space */}
        <rect x={30} y={40} width={190} height={50} rx={5}
          fill={`${COLORS.translate}04`} stroke={COLORS.translate} strokeWidth={0.4}
          strokeDasharray="3 2" />
        <text x={125} y={52} textAnchor="middle" fontSize={7.5}
          fill={COLORS.translate}>공유 벡터 공간</text>

        {/* EN words */}
        <motion.g initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}
          transition={{ ...sp, delay: 0.2 }}>
          <circle cx={60} cy={70} r={14}
            fill={`${COLORS.search}15`} stroke={COLORS.search} strokeWidth={0.8} />
          <text x={60} y={73} textAnchor="middle" fontSize={7}
            fontWeight={600} fill={COLORS.search}>cat</text>
        </motion.g>

        <motion.g initial={{ opacity: 0, x: 5 }} animate={{ opacity: 1, x: 0 }}
          transition={{ ...sp, delay: 0.3 }}>
          <circle cx={110} cy={72} r={14}
            fill={`${COLORS.classify}15`} stroke={COLORS.classify} strokeWidth={0.8} />
          <text x={110} y={75} textAnchor="middle" fontSize={7}
            fontWeight={600} fill={COLORS.classify}>neko</text>
        </motion.g>

        {/* Near arrow */}
        <motion.line x1={74} y1={70} x2={96} y2={72}
          stroke={COLORS.cluster} strokeWidth={1} strokeDasharray="2 2"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ ...sp, delay: 0.35 }} />
        <text x={85} y={64} textAnchor="middle" fontSize={6.5}
          fill={COLORS.cluster}>close!</text>

        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ ...sp, delay: 0.4 }}>
          <circle cx={170} cy={68} r={14}
            fill={`${COLORS.cluster}15`} stroke={COLORS.cluster} strokeWidth={0.8} />
          <text x={170} y={71} textAnchor="middle" fontSize={7}
            fontWeight={600} fill={COLORS.cluster}>gato</text>
        </motion.g>

        <text x={125} y={98} textAnchor="middle" fontSize={7}
          fill="var(--muted-foreground)">mBERT, XLM-R → zero-shot 번역</text>
      </motion.g>

      {/* Anomaly detection */}
      <motion.g initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.5 }}>
        <rect x={250} y={22} width={218} height={80} rx={6}
          fill={`${COLORS.anomaly}06`} stroke={COLORS.anomaly} strokeWidth={0.6} />
        <text x={359} y={34} textAnchor="middle" fontSize={9}
          fontWeight={700} fill={COLORS.anomaly}>이상 탐지 (Anomaly)</text>

        {/* Normal distribution cluster */}
        <ellipse cx={340} cy={65} rx={45} ry={22}
          fill={`${COLORS.cluster}10`} stroke={COLORS.cluster} strokeWidth={0.6}
          strokeDasharray="3 2" />
        <text x={340} y={60} textAnchor="middle" fontSize={7}
          fill={COLORS.cluster}>정상 분포</text>

        {/* Normal points */}
        {[[325, 65], [335, 58], [345, 70], [355, 62], [338, 74]].map((p, i) => (
          <motion.circle key={i} cx={p[0]} cy={p[1]} r={2.5}
            fill={COLORS.cluster} fillOpacity={0.5}
            initial={{ r: 0 }} animate={{ r: 2.5 }}
            transition={{ ...sp, delay: 0.55 + i * 0.04 }} />
        ))}

        {/* Anomaly point (far away) */}
        <motion.g initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...sp, delay: 0.8 }}>
          <circle cx={430} cy={45} r={4}
            fill={COLORS.anomaly} fillOpacity={0.7}
            stroke={COLORS.anomaly} strokeWidth={1} />
          <motion.line x1={385} y1={60} x2={426} y2={47}
            stroke={COLORS.anomaly} strokeWidth={0.8} strokeDasharray="3 2"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ ...sp, delay: 0.85 }} />
          <text x={440} y={40} fontSize={7}
            fontWeight={700} fill={COLORS.anomaly}>anomaly!</text>
          <text x={440} y={50} fontSize={6.5}
            fill="var(--muted-foreground)">거리 큰 샘플</text>
        </motion.g>

        <text x={359} y={98} textAnchor="middle" fontSize={7}
          fill="var(--muted-foreground)">정상 임베딩 분포 학습 → 거리 기반 탐지</text>
      </motion.g>

      {/* Connection line */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.9 }}>
        <rect x={100} y={110} width={280} height={36} rx={5}
          fill="var(--border)" fillOpacity={0.08} />
        <text x={240} y={124} textAnchor="middle" fontSize={8}
          fontWeight={600} fill="var(--foreground)">
          임베딩 = 범용 feature → 어떤 ML 파이프라인에든 투입 가능
        </text>
        <text x={240} y={138} textAnchor="middle" fontSize={7.5}
          fill="var(--muted-foreground)">
          Word2Vec이 증명한 "분포 가설 → 선형 벡터 공간" 통찰이 근간
        </text>
      </motion.g>
    </g>
  );
}

/* ── Step 3: 품질 평가 ── */
export function QualityEvaluation() {
  const intrinsic = [
    { name: 'Word Similarity', desc: 'WS353, SimLex', icon: '~' },
    { name: 'Analogy', desc: 'Google, BATS', icon: '=' },
    { name: 'Visualization', desc: 't-SNE, UMAP', icon: 'o' },
  ];
  const extrinsic = [
    { name: 'Downstream Task', desc: '실제 사용 맥락' },
    { name: 'GLUE / SuperGLUE', desc: '표준 벤치마크' },
    { name: 'Domain-specific', desc: '의료, 법률 등' },
  ];

  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10}
        fontWeight={700} fill="var(--foreground)">
        임베딩 품질 평가 -- Intrinsic vs Extrinsic
      </text>

      {/* Intrinsic */}
      <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.1 }}>
        <rect x={15} y={22} width={218} height={100} rx={6}
          fill={`${COLORS.search}06`} stroke={COLORS.search} strokeWidth={0.6} />
        <text x={124} y={36} textAnchor="middle" fontSize={9}
          fontWeight={700} fill={COLORS.search}>Intrinsic Evaluation</text>
        <text x={124} y={48} textAnchor="middle" fontSize={7.5}
          fill="var(--muted-foreground)">임베딩 자체 품질 측정</text>

        {intrinsic.map((item, i) => (
          <motion.g key={item.name} initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...sp, delay: 0.2 + i * 0.1 }}>
            <rect x={25} y={55 + i * 20} width={198} height={17} rx={4}
              fill={`${COLORS.search}08`} stroke={COLORS.search} strokeWidth={0.3} />
            <text x={38} y={66 + i * 20} fontSize={8}
              fontWeight={600} fill={COLORS.search}>{item.name}</text>
            <text x={218} y={66 + i * 20} textAnchor="end" fontSize={7}
              fill="var(--muted-foreground)">{item.desc}</text>
          </motion.g>
        ))}
      </motion.g>

      {/* Extrinsic */}
      <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.45 }}>
        <rect x={248} y={22} width={218} height={100} rx={6}
          fill={`${COLORS.classify}06`} stroke={COLORS.classify} strokeWidth={0.6} />
        <text x={357} y={36} textAnchor="middle" fontSize={9}
          fontWeight={700} fill={COLORS.classify}>Extrinsic Evaluation</text>
        <text x={357} y={48} textAnchor="middle" fontSize={7.5}
          fill="var(--muted-foreground)">실제 태스크 성능 측정</text>

        {extrinsic.map((item, i) => (
          <motion.g key={item.name} initial={{ opacity: 0, x: 5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...sp, delay: 0.55 + i * 0.1 }}>
            <rect x={258} y={55 + i * 20} width={198} height={17} rx={4}
              fill={`${COLORS.classify}08`} stroke={COLORS.classify} strokeWidth={0.3} />
            <text x={270} y={66 + i * 20} fontSize={8}
              fontWeight={600} fill={COLORS.classify}>{item.name}</text>
            <text x={450} y={66 + i * 20} textAnchor="end" fontSize={7}
              fill="var(--muted-foreground)">{item.desc}</text>
          </motion.g>
        ))}
      </motion.g>

      {/* Key insight */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.85 }}>
        <rect x={60} y={130} width={360} height={18} rx={4}
          fill={`${COLORS.cluster}10`} stroke={COLORS.cluster} strokeWidth={0.5} />
        <text x={240} y={143} textAnchor="middle" fontSize={8}
          fontWeight={600} fill={COLORS.cluster}>
          Intrinsic 점수가 높아도 Extrinsic에서 성능이 낮을 수 있음 -- 실제 태스크 검증 필수
        </text>
      </motion.g>
    </g>
  );
}
