import { motion } from 'framer-motion';
import { COLORS as C } from './NeuralDeepVizData';

const fade = (d: number) => ({
  initial: { opacity: 0, y: 4 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay: d },
});

/* Step 0: CBOW vs Skip-gram */
export function Step0() {
  const contextWords = ['the', 'sat', 'on', 'mat'];

  return (
    <g>
      <motion.text x={240} y={14} textAnchor="middle" fontSize={12} fontWeight={700}
        fill={C.hi} {...fade(0)}>
        CBOW vs Skip-gram
      </motion.text>

      {/* CBOW 쪽 */}
      <motion.g {...fade(0.2)}>
        <text x={120} y={32} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.ok}>
          CBOW
        </text>
        {/* 맥락 단어들 */}
        {contextWords.map((w, i) => {
          const y = 40 + i * 20;
          return (
            <g key={`ctx-${i}`}>
              <rect x={30} y={y} width={55} height={16} rx={3}
                fill={`${C.ok}12`} stroke={`${C.ok}30`} strokeWidth={0.5} />
              <text x={57} y={y + 12} textAnchor="middle" fontSize={8} fill={C.ok}>{w}</text>
              <line x1={88} y1={y + 8} x2={130} y2={78}
                stroke={`${C.ok}30`} strokeWidth={0.5} />
            </g>
          );
        })}
        {/* 타겟 */}
        <rect x={130} y={68} width={50} height={20} rx={4}
          fill={`${C.hi}15`} stroke={C.hi} strokeWidth={1} />
        <text x={155} y={82} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.hi}>cat</text>
        <text x={120} y={128} textAnchor="middle" fontSize={8} fill={C.m}>
          주변 → 중심 예측
        </text>
        <text x={120} y={140} textAnchor="middle" fontSize={7} fill={C.ok}>빈도 높은 단어에 강함</text>
      </motion.g>

      {/* 구분선 */}
      <motion.line x1={238} y1={28} x2={238} y2={145} stroke={`${C.m}20`} strokeWidth={0.5}
        strokeDasharray="3 2" {...fade(0.4)} />

      {/* Skip-gram 쪽 */}
      <motion.g {...fade(0.5)}>
        <text x={360} y={32} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.gold}>
          Skip-gram
        </text>
        {/* 타겟 */}
        <rect x={335} y={68} width={50} height={20} rx={4}
          fill={`${C.hi}15`} stroke={C.hi} strokeWidth={1} />
        <text x={360} y={82} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.hi}>cat</text>
        {/* 예측 대상들 */}
        {contextWords.map((w, i) => {
          const y = 40 + i * 20;
          return (
            <g key={`pred-${i}`}>
              <line x1={388} y1={78} x2={400} y2={y + 8}
                stroke={`${C.gold}30`} strokeWidth={0.5} />
              <rect x={400} y={y} width={55} height={16} rx={3}
                fill={`${C.gold}12`} stroke={`${C.gold}30`} strokeWidth={0.5} />
              <text x={427} y={y + 12} textAnchor="middle" fontSize={8} fill={C.gold}>{w}</text>
            </g>
          );
        })}
        <text x={360} y={128} textAnchor="middle" fontSize={8} fill={C.m}>
          중심 → 주변 예측
        </text>
        <text x={360} y={140} textAnchor="middle" fontSize={7} fill={C.gold}>희귀 단어에 강함</text>
      </motion.g>
    </g>
  );
}

/* Step 1: Negative Sampling */
export function Step1() {
  return (
    <g>
      <motion.text x={240} y={14} textAnchor="middle" fontSize={12} fontWeight={700}
        fill={C.warn} {...fade(0)}>
        Negative Sampling: softmax 대체
      </motion.text>

      {/* 왼쪽: softmax 문제 */}
      <motion.g {...fade(0.2)}>
        <rect x={15} y={26} width={200} height={55} rx={6}
          fill={`${C.warn}08`} stroke={`${C.warn}25`} strokeWidth={0.6} />
        <text x={115} y={42} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.warn}>
          Full Softmax 문제
        </text>
        <text x={115} y={57} textAnchor="middle" fontSize={8} fill={C.m}>
          분모: Σ exp(v_w'·v_c) over V
        </text>
        <text x={115} y={70} textAnchor="middle" fontSize={8} fill={C.warn}>
          V=100K → 매 학습 step마다 10만 계산
        </text>
      </motion.g>

      {/* 화살표 */}
      <motion.g {...fade(0.5)}>
        <line x1={220} y1={53} x2={248} y2={53} stroke={`${C.m}50`} strokeWidth={0.8} />
        <polygon points="248,50 254,53 248,56" fill={`${C.m}50`} />
      </motion.g>

      {/* 오른쪽: negative sampling 해결 */}
      <motion.g {...fade(0.6)}>
        <rect x={260} y={26} width={205} height={55} rx={6}
          fill={`${C.ok}08`} stroke={`${C.ok}25`} strokeWidth={0.6} />
        <text x={362} y={42} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.ok}>
          Negative Sampling
        </text>
        <text x={362} y={57} textAnchor="middle" fontSize={8} fill={C.m}>
          k개 "아닌 단어"만 샘플 (k=5~20)
        </text>
        <text x={362} y={70} textAnchor="middle" fontSize={8} fill={C.ok}>
          이진 분류로 변환 → 수천 배 가속
        </text>
      </motion.g>

      {/* 양성/음성 예시 */}
      <motion.g {...fade(0.9)}>
        <rect x={40} y={90} width={400} height={56} rx={6}
          fill={`${C.hi}06`} stroke={`${C.hi}18`} strokeWidth={0.5} />
        {/* 양성 */}
        <circle cx={70} cy={108} r={8} fill={`${C.ok}25`} stroke={C.ok} strokeWidth={0.8} />
        <text x={70} y={111} textAnchor="middle" fontSize={7} fontWeight={600} fill={C.ok}>+</text>
        <text x={84} y={111} fontSize={8} fill={C.m}>(cat, sat) → 유사하게</text>
        {/* 음성 */}
        <circle cx={70} cy={130} r={8} fill={`${C.warn}25`} stroke={C.warn} strokeWidth={0.8} />
        <text x={70} y={133} textAnchor="middle" fontSize={7} fontWeight={600} fill={C.warn}>-</text>
        <text x={84} y={133} fontSize={8} fill={C.m}>(cat, random_word) → 멀어지게</text>
        {/* 손실함수 */}
        <text x={320} y={116} textAnchor="middle" fontSize={8} fill={C.hi} fontWeight={500}>
          L = log σ(v_w·v_c)
        </text>
        <text x={320} y={132} textAnchor="middle" fontSize={8} fill={C.hi}>
          + Σ log σ(-v_neg·v_c)
        </text>
      </motion.g>
    </g>
  );
}

/* Step 2: GloVe & FastText */
export function Step2() {
  return (
    <g>
      <motion.text x={240} y={14} textAnchor="middle" fontSize={12} fontWeight={700}
        fill={C.ok} {...fade(0)}>
        GloVe & FastText
      </motion.text>

      {/* GloVe */}
      <motion.g {...fade(0.2)}>
        <rect x={15} y={26} width={215} height={68} rx={6}
          fill={`${C.hi}08`} stroke={`${C.hi}30`} strokeWidth={0.6} />
        <text x={122} y={42} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.hi}>
          GloVe (2014)
        </text>
        <text x={122} y={58} textAnchor="middle" fontSize={8} fill={C.m}>
          동시발생 행렬 + SGD 최적화
        </text>
        <text x={122} y={72} textAnchor="middle" fontSize={7} fill={C.hi}>
          J = Σ f(X_ij)·(w_i·w_j + b - log X_ij)²
        </text>
        <text x={122} y={86} textAnchor="middle" fontSize={8} fill={C.ok}>
          통계 + 추론 하이브리드
        </text>
      </motion.g>

      {/* FastText */}
      <motion.g {...fade(0.5)}>
        <rect x={250} y={26} width={215} height={68} rx={6}
          fill={`${C.gold}08`} stroke={`${C.gold}30`} strokeWidth={0.6} />
        <text x={357} y={42} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.gold}>
          FastText (2016)
        </text>
        <text x={357} y={58} textAnchor="middle" fontSize={8} fill={C.m}>
          서브워드 n-gram 사용
        </text>
        {/* 서브워드 분해 시각화 */}
        <text x={357} y={74} textAnchor="middle" fontSize={8} fill={C.gold}>
          "unhappy" → un + hap + happy + ppy
        </text>
        <text x={357} y={88} textAnchor="middle" fontSize={8} fill={C.ok}>
          OOV(미등록어) 처리 가능
        </text>
      </motion.g>

      {/* 하단: 핵심 차이 */}
      <motion.g {...fade(0.9)}>
        <rect x={15} y={104} width={450} height={44} rx={5}
          fill={`${C.ok}06`} stroke={`${C.ok}18`} strokeWidth={0.4} />
        <text x={240} y={120} textAnchor="middle" fontSize={9} fill={C.ok} fontWeight={500}>
          Word2Vec: 지역 맥락만 | GloVe: 전역 통계 결합 | FastText: 형태소 분석 내장
        </text>
        <text x={240} y={138} textAnchor="middle" fontSize={8} fill={C.m}>
          형태론이 풍부한 언어(한국어, 터키어 등)에서 FastText가 특히 효과적
        </text>
      </motion.g>
    </g>
  );
}

/* Step 3: 임베딩 벡터 산술 */
export function Step3() {
  return (
    <g>
      <motion.text x={240} y={14} textAnchor="middle" fontSize={12} fontWeight={700}
        fill={C.hi} {...fade(0)}>
        임베딩의 핵심: 벡터 산술
      </motion.text>

      {/* 왕 - 남자 + 여자 = 여왕 시각화 */}
      <motion.g {...fade(0.3)}>
        {/* 2D 공간 */}
        <line x1={40} y1={130} x2={40} y2={30} stroke={`${C.m}25`} strokeWidth={0.6} />
        <line x1={40} y1={130} x2={230} y2={130} stroke={`${C.m}25`} strokeWidth={0.6} />

        {/* 점들 */}
        {[
          { w: 'man', x: 80, y: 105, c: C.hi },
          { w: 'woman', x: 80, y: 55, c: C.ok },
          { w: 'king', x: 180, y: 105, c: C.gold },
          { w: 'queen', x: 180, y: 55, c: C.warn },
        ].map((p, i) => (
          <motion.g key={p.w} {...fade(0.4 + i * 0.15)}>
            <circle cx={p.x} cy={p.y} r={4} fill={`${p.c}40`} stroke={p.c} strokeWidth={1} />
            <text x={p.x} y={p.y - 8} textAnchor="middle" fontSize={9} fontWeight={600} fill={p.c}>
              {p.w}
            </text>
          </motion.g>
        ))}

        {/* 관계 화살표 */}
        <motion.g {...fade(0.9)}>
          {/* 수직: 성별 */}
          <line x1={80} y1={100} x2={80} y2={62} stroke={C.ok} strokeWidth={0.8} strokeDasharray="3 2" />
          <line x1={180} y1={100} x2={180} y2={62} stroke={C.ok} strokeWidth={0.8} strokeDasharray="3 2" />
          <text x={68} y={82} fontSize={7} fill={C.ok} transform="rotate(-90 68 82)">성별</text>

          {/* 수평: 왕족 */}
          <line x1={88} y1={105} x2={172} y2={105} stroke={C.gold} strokeWidth={0.8} strokeDasharray="3 2" />
          <line x1={88} y1={55} x2={172} y2={55} stroke={C.gold} strokeWidth={0.8} strokeDasharray="3 2" />
          <text x={130} y={115} textAnchor="middle" fontSize={7} fill={C.gold}>왕족</text>
        </motion.g>
      </motion.g>

      {/* 오른쪽: 수식 */}
      <motion.g {...fade(1.0)}>
        <rect x={252} y={28} width={213} height={68} rx={6}
          fill={`${C.hi}08`} stroke={`${C.hi}25`} strokeWidth={0.6} />
        <text x={358} y={48} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.hi}>
          king - man + woman
        </text>
        <text x={358} y={66} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.warn}>
          ≈ queen
        </text>
        <text x={358} y={84} textAnchor="middle" fontSize={8} fill={C.m}>
          의미 관계가 벡터 연산으로 표현됨
        </text>
      </motion.g>

      {/* 시대 구분 */}
      <motion.g {...fade(1.3)}>
        <rect x={252} y={105} width={213} height={40} rx={5}
          fill={`${C.gold}06`} stroke={`${C.gold}18`} strokeWidth={0.4} />
        <text x={358} y={120} textAnchor="middle" fontSize={8} fill={C.gold} fontWeight={500}>
          2013-17: 정적 임베딩 (Word2Vec, GloVe)
        </text>
        <text x={358} y={136} textAnchor="middle" fontSize={8} fill={C.hi} fontWeight={500}>
          2018+: 문맥 임베딩 (BERT, GPT)
        </text>
      </motion.g>
    </g>
  );
}
