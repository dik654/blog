import { motion } from 'framer-motion';
import { COLORS as C } from './DimDeepVizData';

const fade = (d: number) => ({
  initial: { opacity: 0, y: 4 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay: d },
});

/* Step 0: Truncated SVD 시각화 */
export function Step0() {
  return (
    <g>
      <motion.text x={240} y={16} textAnchor="middle" fontSize={12} fontWeight={700}
        fill={C.hi} {...fade(0)}>
        Truncated SVD: 상위 k개만 유지
      </motion.text>

      {/* M 행렬 */}
      <motion.g {...fade(0.2)}>
        <rect x={15} y={30} width={55} height={65} rx={4}
          fill={`${C.warn}12`} stroke={C.warn} strokeWidth={0.8} />
        <text x={42} y={67} textAnchor="middle" fontSize={13} fontWeight={600} fill={C.warn}>M</text>
        <text x={42} y={106} textAnchor="middle" fontSize={8} fill={C.m}>V x V</text>
      </motion.g>

      <motion.text x={80} y={66} fontSize={14} fill={C.m} {...fade(0.3)}>≈</motion.text>

      {/* U_k */}
      <motion.g {...fade(0.4)}>
        <rect x={95} y={30} width={35} height={65} rx={4}
          fill={`${C.hi}12`} stroke={C.hi} strokeWidth={0.8} />
        <text x={112} y={67} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.hi}>U</text>
        <text x={112} y={106} textAnchor="middle" fontSize={8} fill={C.hi}>V x k</text>
        <text x={112} y={116} textAnchor="middle" fontSize={7} fill={C.m}>단어 임베딩</text>
      </motion.g>

      <motion.text x={140} y={66} fontSize={10} fill={C.m} {...fade(0.5)}>·</motion.text>

      {/* Sigma_k */}
      <motion.g {...fade(0.5)}>
        <rect x={150} y={40} width={35} height={35} rx={4}
          fill={`${C.gold}12`} stroke={C.gold} strokeWidth={0.8} />
        <text x={167} y={62} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.gold}>Σ</text>
        <text x={167} y={106} textAnchor="middle" fontSize={8} fill={C.gold}>k x k</text>
      </motion.g>

      <motion.text x={195} y={66} fontSize={10} fill={C.m} {...fade(0.6)}>·</motion.text>

      {/* V_k^T */}
      <motion.g {...fade(0.6)}>
        <rect x={205} y={40} width={65} height={35} rx={4}
          fill={`${C.ok}12`} stroke={C.ok} strokeWidth={0.8} />
        <text x={237} y={62} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.ok}>Vᵀ</text>
        <text x={237} y={106} textAnchor="middle" fontSize={8} fill={C.ok}>k x V</text>
      </motion.g>

      {/* 오른쪽: 특이값 감소 그래프 */}
      <motion.g {...fade(0.8)}>
        <rect x={290} y={26} width={178} height={100} rx={6}
          fill={`${C.hi}06`} stroke={`${C.hi}20`} strokeWidth={0.5} />
        <text x={379} y={42} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.hi}>
          특이값 크기 (감소)
        </text>
        {/* 바 차트: 특이값들 */}
        {[80, 55, 30, 15, 8, 4, 2, 1].map((h, i) => {
          const barH = h * 0.55;
          const x = 308 + i * 18;
          const kept = i < 3;
          return (
            <g key={i}>
              <rect x={x} y={110 - barH} width={12} height={barH} rx={1.5}
                fill={kept ? `${C.hi}40` : '#80808015'}
                stroke={kept ? C.hi : '#55555530'} strokeWidth={0.5} />
            </g>
          );
        })}
        {/* k 경계선 */}
        <line x1={361} y1={50} x2={361} y2={112} stroke={C.warn} strokeWidth={0.8} strokeDasharray="3 2" />
        <text x={345} y={120} fontSize={7} fill={C.warn}>k=3</text>
        <text x={370} y={120} fontSize={7} fill={C.m}>버림</text>
      </motion.g>

      {/* 하단 요약 */}
      <motion.g {...fade(1.1)}>
        <rect x={15} y={130} width={453} height={20} rx={4}
          fill={`${C.ok}08`} stroke={`${C.ok}20`} strokeWidth={0.4} />
        <text x={240} y={144} textAnchor="middle" fontSize={9} fill={C.ok} fontWeight={500}>
          U_k의 각 행 = 단어의 밀집 임베딩 (V차원 → k차원으로 압축)
        </text>
      </motion.g>
    </g>
  );
}

/* Step 1: 계산 복잡도 & 대안 알고리즘 */
export function Step1() {
  const methods = [
    { name: 'Naive SVD', cost: 'O(V³)', bar: 140, c: C.warn },
    { name: 'Sparse SVD', cost: 'O(V²·k)', bar: 90, c: C.gold },
    { name: 'Randomized', cost: 'O(V·k²)', bar: 50, c: C.ok },
    { name: 'Lanczos', cost: 'O(V·k·iter)', bar: 45, c: C.ok },
  ];

  return (
    <g>
      <motion.text x={240} y={16} textAnchor="middle" fontSize={12} fontWeight={700}
        fill={C.warn} {...fade(0)}>
        계산 복잡도와 가속 알고리즘
      </motion.text>

      {/* 복잡도 바 차트 */}
      {methods.map((m, i) => {
        const y = 30 + i * 24;
        return (
          <motion.g key={m.name} {...fade(0.2 + i * 0.2)}>
            <text x={95} y={y + 14} textAnchor="end" fontSize={9} fill={C.m}>{m.name}</text>
            <rect x={100} y={y + 2} width={m.bar} height={15} rx={3}
              fill={`${m.c}20`} stroke={`${m.c}50`} strokeWidth={0.5} />
            <text x={105 + m.bar} y={y + 14} fontSize={9} fontWeight={500} fill={m.c}>
              {m.cost}
            </text>
          </motion.g>
        );
      })}

      {/* 대안 기법 카드 */}
      <motion.g {...fade(1.0)}>
        <rect x={20} y={128} width={440} height={22} rx={4}
          fill={`${C.hi}08`} stroke={`${C.hi}20`} strokeWidth={0.5} />
        <text x={240} y={143} textAnchor="middle" fontSize={9} fill={C.hi}>
          대안: PCA (선형) | NMF (비음수) | Autoencoder (비선형) | t-SNE/UMAP (시각화 전용)
        </text>
      </motion.g>
    </g>
  );
}

/* Step 2: k 선택 — 정보 vs 노이즈 */
export function Step2() {
  /* 가상 정보 보존률 그래프 포인트 */
  const points = [
    { k: 50, v: 60 }, { k: 100, v: 78 }, { k: 200, v: 90 },
    { k: 300, v: 95 }, { k: 500, v: 97 }, { k: 1000, v: 98 },
  ];
  const graphL = 60;
  const graphR = 420;
  const graphT = 40;
  const graphB = 110;

  const px = (k: number) => graphL + ((k - 50) / 950) * (graphR - graphL);
  const py = (v: number) => graphB - ((v - 50) / 50) * (graphB - graphT);

  const pathD = points.map((p, i) =>
    `${i === 0 ? 'M' : 'L'} ${px(p.k).toFixed(1)},${py(p.v).toFixed(1)}`
  ).join(' ');

  return (
    <g>
      <motion.text x={240} y={16} textAnchor="middle" fontSize={12} fontWeight={700}
        fill={C.gold} {...fade(0)}>
        k 선택: 정보 보존 vs 과적합
      </motion.text>

      {/* 축 */}
      <motion.g {...fade(0.2)}>
        <line x1={graphL} y1={graphB} x2={graphR} y2={graphB} stroke={`${C.m}40`} strokeWidth={0.7} />
        <line x1={graphL} y1={graphB} x2={graphL} y2={graphT - 5} stroke={`${C.m}40`} strokeWidth={0.7} />
        <text x={240} y={126} textAnchor="middle" fontSize={8} fill={C.m}>차원 수 k</text>
        <text x={42} y={75} textAnchor="middle" fontSize={8} fill={C.m} transform="rotate(-90 42 75)">보존률 %</text>
      </motion.g>

      {/* 곡선 */}
      <motion.path d={pathD} fill="none" stroke={C.hi} strokeWidth={1.5}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 1, delay: 0.4 }} />

      {/* 데이터 점 */}
      {points.map((p, i) => (
        <motion.g key={i} {...fade(0.5 + i * 0.1)}>
          <circle cx={px(p.k)} cy={py(p.v)} r={2.5}
            fill={p.k === 300 ? C.gold : C.hi} stroke="white" strokeWidth={0.5} />
          {(p.k === 300 || p.k === 50 || p.k === 1000) && (
            <text x={p.k === 50 ? px(p.k) + 30 : px(p.k)} y={py(p.v) - 8}
              textAnchor={p.k === 50 ? 'start' : 'middle'} fontSize={7}
              fill={p.k === 300 ? C.gold : C.m} fontWeight={p.k === 300 ? 700 : 400}>
              k={p.k} ({p.v}%)
            </text>
          )}
        </motion.g>
      ))}

      {/* k=300 강조 영역 */}
      <motion.g {...fade(1.0)}>
        <rect x={px(250)} y={graphT - 5} width={px(350) - px(250)} height={graphB - graphT + 10} rx={3}
          fill={`${C.gold}10`} stroke={C.gold} strokeWidth={0.8} strokeDasharray="4 2" />
        <text x={px(300)} y={graphB + 14} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.gold}>
          sweet spot
        </text>
      </motion.g>

      {/* 하단 설명 */}
      <motion.g {...fade(1.2)}>
        <rect x={60} y={132} width={360} height={18} rx={3}
          fill={`${C.gold}08`} stroke={`${C.gold}20`} strokeWidth={0.4} />
        <text x={240} y={145} textAnchor="middle" fontSize={8} fill={C.gold}>
          k 너무 작으면 정보 손실 | 너무 크면 희소성·과적합 | Word2Vec도 k ≈ 300
        </text>
      </motion.g>
    </g>
  );
}

/* Step 3: 통계 vs 신경망 비교 표 */
export function Step3() {
  const rows = [
    { label: '계산', svd: '일괄 (one-shot)', w2v: '반복 (SGD)', glove: '하이브리드' },
    { label: '통계', svd: '전역 (global)', w2v: '지역 (local)', glove: '전역+지역' },
    { label: '결정론', svd: '결정론적', w2v: '확률적', glove: '확률적' },
    { label: '해석', svd: '수학적 명확', w2v: '과제 특화', glove: '둘 다' },
  ];

  return (
    <g>
      <motion.text x={240} y={16} textAnchor="middle" fontSize={12} fontWeight={700}
        fill={C.ok} {...fade(0)}>
        통계 방법 vs 신경망 방법
      </motion.text>

      {/* 헤더 */}
      <motion.g {...fade(0.2)}>
        <text x={28} y={38} fontSize={9} fontWeight={600} fill={C.m}>구분</text>
        <rect x={80} y={26} width={110} height={18} rx={3}
          fill={`${C.warn}10`} stroke={`${C.warn}25`} strokeWidth={0.5} />
        <text x={135} y={39} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.warn}>SVD / LSA</text>
        <rect x={200} y={26} width={110} height={18} rx={3}
          fill={`${C.ok}10`} stroke={`${C.ok}25`} strokeWidth={0.5} />
        <text x={255} y={39} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.ok}>Word2Vec</text>
        <rect x={320} y={26} width={110} height={18} rx={3}
          fill={`${C.hi}10`} stroke={`${C.hi}25`} strokeWidth={0.5} />
        <text x={375} y={39} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.hi}>GloVe</text>
      </motion.g>

      {/* 행 */}
      {rows.map((r, i) => {
        const y = 50 + i * 22;
        return (
          <motion.g key={r.label} {...fade(0.4 + i * 0.15)}>
            <line x1={20} y1={y} x2={440} y2={y} stroke={`${C.m}12`} strokeWidth={0.4} />
            <text x={28} y={y + 14} fontSize={9} fontWeight={500} fill={C.m}>{r.label}</text>
            <text x={135} y={y + 14} textAnchor="middle" fontSize={8} fill={C.warn}>{r.svd}</text>
            <text x={255} y={y + 14} textAnchor="middle" fontSize={8} fill={C.ok}>{r.w2v}</text>
            <text x={375} y={y + 14} textAnchor="middle" fontSize={8} fill={C.hi}>{r.glove}</text>
          </motion.g>
        );
      })}

      {/* GloVe 결론 */}
      <motion.g {...fade(1.0)}>
        <rect x={50} y={140} width={380} height={14} rx={3}
          fill={`${C.hi}08`} stroke={`${C.hi}18`} strokeWidth={0.4} />
        <text x={240} y={151} textAnchor="middle" fontSize={8} fill={C.hi} fontWeight={500}>
          GloVe: J = Σ f(X_ij)·(w_i·w_j + b_i + b_j - log X_ij)² — 동시발생 행렬 + SGD
        </text>
      </motion.g>
    </g>
  );
}
