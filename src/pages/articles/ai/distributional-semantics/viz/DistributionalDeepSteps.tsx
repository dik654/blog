import { motion } from 'framer-motion';
import { COLORS as C } from './DistributionalDeepVizData';

const fade = (d: number) => ({
  initial: { opacity: 0, y: 4 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay: d },
});

/* Step 0: 분포 가설 — 맥락 공유 시각화 */
export function Step0() {
  const sentences = [
    { words: ['고양이가', '매트에', '앉았다'], hi: 0 },
    { words: ['강아지가', '매트에', '앉았다'], hi: 0 },
  ];
  return (
    <g>
      <motion.text x={240} y={18} textAnchor="middle" fontSize={12} fontWeight={700}
        fill={C.hi} {...fade(0)}>
        같은 맥락 → 같은 의미
      </motion.text>

      {/* 두 문장 나란히 */}
      {sentences.map((s, si) => (
        <motion.g key={si} {...fade(0.2 + si * 0.3)}>
          {s.words.map((w, wi) => {
            const x = 80 + wi * 130;
            const y = 38 + si * 42;
            const isTarget = wi === s.hi;
            return (
              <g key={wi}>
                <rect x={x} y={y} width={110} height={26} rx={5}
                  fill={isTarget ? `${C.hi}18` : '#80808008'}
                  stroke={isTarget ? C.hi : '#555'} strokeWidth={isTarget ? 1.5 : 0.6} />
                <text x={x + 55} y={y + 17} textAnchor="middle" fontSize={11}
                  fill={isTarget ? C.hi : 'currentColor'} fontWeight={isTarget ? 700 : 400}>
                  {w}
                </text>
              </g>
            );
          })}
        </motion.g>
      ))}

      {/* 맥락 일치 브래킷 */}
      <motion.g {...fade(0.8)}>
        <line x1={210} y1={64} x2={210} y2={80} stroke={C.ok} strokeWidth={1} strokeDasharray="3 2" />
        <line x1={340} y1={64} x2={340} y2={80} stroke={C.ok} strokeWidth={1} strokeDasharray="3 2" />
        <text x={275} y={76} textAnchor="middle" fontSize={9} fill={C.ok} fontWeight={600}>
          공유 맥락
        </text>
      </motion.g>

      {/* 결론 화살표 */}
      <motion.g {...fade(1.1)}>
        <line x1={135} y1={56} x2={135} y2={78} stroke={C.hi} strokeWidth={1} strokeDasharray="3 2" />
        <rect x={60} y={114} width={360} height={28} rx={6}
          fill={`${C.hi}10`} stroke={`${C.hi}30`} strokeWidth={0.6} />
        <text x={240} y={132} textAnchor="middle" fontSize={11} fill={C.hi} fontWeight={600}>
          "고양이" ≈ "강아지" — 맥락 벡터가 유사하므로 의미도 유사
        </text>
      </motion.g>
    </g>
  );
}

/* Step 1: PPMI 공식 시각화 */
export function Step1() {
  return (
    <g>
      <motion.text x={240} y={18} textAnchor="middle" fontSize={12} fontWeight={700}
        fill={C.ok} {...fade(0)}>
        PPMI: 우연 vs 의미적 동시발생
      </motion.text>

      {/* PMI 공식 박스 */}
      <motion.g {...fade(0.2)}>
        <rect x={30} y={30} width={200} height={50} rx={6}
          fill={`${C.hi}10`} stroke={`${C.hi}30`} strokeWidth={0.6} />
        <text x={130} y={50} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.hi}>
          PMI(w, c)
        </text>
        <text x={130} y={68} textAnchor="middle" fontSize={10} fill={C.m}>
          = log( P(w,c) / P(w)·P(c) )
        </text>
      </motion.g>

      {/* 화살표 */}
      <motion.g {...fade(0.4)}>
        <line x1={235} y1={55} x2={255} y2={55} stroke={`${C.m}60`} strokeWidth={0.8} />
        <polygon points="255,52 260,55 255,58" fill={`${C.m}60`} />
      </motion.g>

      {/* PPMI 박스 */}
      <motion.g {...fade(0.5)}>
        <rect x={265} y={30} width={185} height={50} rx={6}
          fill={`${C.ok}10`} stroke={`${C.ok}30`} strokeWidth={0.6} />
        <text x={357} y={50} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.ok}>
          PPMI = max(PMI, 0)
        </text>
        <text x={357} y={68} textAnchor="middle" fontSize={10} fill={C.m}>
          음수 → 0 (반연관 제거)
        </text>
      </motion.g>

      {/* 예시 바 차트 */}
      <motion.g {...fade(0.8)}>
        <text x={60} y={100} fontSize={9} fill={C.m}>PMI 값 분포:</text>
        {[
          { label: '(나, 고양이)', val: 1.4, pmi: 1.4 },
          { label: '(는, 를)', val: -0.5, pmi: 0 },
          { label: '(고양이, 좋아한다)', val: 0.7, pmi: 0.7 },
        ].map((d, i) => {
          const y = 108 + i * 16;
          const barW = Math.abs(d.val) * 60;
          const isNeg = d.val < 0;
          return (
            <g key={i}>
              <text x={150} y={y + 10} textAnchor="end" fontSize={8} fill={C.m}>{d.label}</text>
              <rect x={160} y={y} width={barW} height={12} rx={2}
                fill={isNeg ? `${C.warn}30` : `${C.ok}30`}
                stroke={isNeg ? C.warn : C.ok} strokeWidth={0.5} />
              <text x={165 + barW} y={y + 10} fontSize={8} fill={isNeg ? C.warn : C.ok}>
                {d.val.toFixed(1)} → PPMI: {d.pmi}
              </text>
            </g>
          );
        })}
      </motion.g>
    </g>
  );
}

/* Step 2: 코사인 유사도 시각화 — 벡터 각도 */
export function Step2() {
  return (
    <g>
      <motion.text x={240} y={18} textAnchor="middle" fontSize={12} fontWeight={700}
        fill={C.gold} {...fade(0)}>
        코사인 유사도: 벡터 사이 각도
      </motion.text>

      {/* 좌표축 */}
      <motion.g {...fade(0.2)}>
        <line x1={80} y1={130} x2={80} y2={35} stroke={`${C.m}40`} strokeWidth={0.8} />
        <line x1={80} y1={130} x2={230} y2={130} stroke={`${C.m}40`} strokeWidth={0.8} />
        <text x={235} y={134} fontSize={8} fill={C.m}>차원 1</text>
        <text x={72} y={33} fontSize={8} fill={C.m}>차원 2</text>
      </motion.g>

      {/* 벡터 A (고양이) */}
      <motion.g {...fade(0.4)}>
        <line x1={80} y1={130} x2={190} y2={55} stroke={C.hi} strokeWidth={1.5} />
        <circle cx={190} cy={55} r={3} fill={C.hi} />
        <text x={196} y={52} fontSize={9} fontWeight={600} fill={C.hi}>고양이</text>
      </motion.g>

      {/* 벡터 B (강아지) — 가까운 각도 */}
      <motion.g {...fade(0.6)}>
        <line x1={80} y1={130} x2={200} y2={75} stroke={C.ok} strokeWidth={1.5} />
        <circle cx={200} cy={75} r={3} fill={C.ok} />
        <text x={206} y={72} fontSize={9} fontWeight={600} fill={C.ok}>강아지</text>
      </motion.g>

      {/* 벡터 C (자동차) — 먼 각도 */}
      <motion.g {...fade(0.8)}>
        <line x1={80} y1={130} x2={210} y2={118} stroke={C.warn} strokeWidth={1.5} />
        <circle cx={210} cy={118} r={3} fill={C.warn} />
        <text x={216} y={116} fontSize={9} fontWeight={600} fill={C.warn}>자동차</text>
      </motion.g>

      {/* 각도 표시 */}
      <motion.g {...fade(1.0)}>
        <path d="M 100,120 A 20,20 0 0,0 96,110" fill="none" stroke={C.hi} strokeWidth={0.7} />
        <rect x={106} y={102} width={36} height={13} rx={3} fill="var(--card)" stroke={C.hi} strokeWidth={0.4} />
        <text x={124} y={112} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.hi}>θ 작음</text>
      </motion.g>

      {/* 수식 + 유사도 결과 */}
      <motion.g {...fade(1.2)}>
        <rect x={270} y={32} width={195} height={110} rx={6}
          fill={`${C.gold}08`} stroke={`${C.gold}25`} strokeWidth={0.6} />
        <text x={367} y={52} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.gold}>
          sim = (w₁ · w₂) / (|w₁|×|w₂|)
        </text>
        <line x1={285} y1={60} x2={450} y2={60} stroke={`${C.m}20`} strokeWidth={0.5} />
        {[
          { a: '고양이', b: '강아지', sim: '0.92', c: C.ok },
          { a: '고양이', b: '자동차', sim: '0.15', c: C.warn },
        ].map((r, i) => (
          <g key={i}>
            <text x={290} y={80 + i * 24} fontSize={9} fill={C.m}>
              {r.a} ↔ {r.b}
            </text>
            <rect x={390} y={69 + i * 24} width={55} height={16} rx={3}
              fill={`${r.c}15`} stroke={`${r.c}40`} strokeWidth={0.5} />
            <text x={417} y={81 + i * 24} textAnchor="middle" fontSize={10} fontWeight={600} fill={r.c}>
              {r.sim}
            </text>
          </g>
        ))}
        <text x={367} y={132} textAnchor="middle" fontSize={8} fill={C.m}>
          크기 무시, 방향만 비교 → 빈도 편향 제거
        </text>
      </motion.g>
    </g>
  );
}

/* Step 3: 진화 타임라인 */
export function Step3() {
  const eras = [
    { label: 'Classical', year: '~2012', items: ['TF-IDF', 'PPMI+SVD', 'LSA'], c: C.warn, x: 20 },
    { label: 'Neural Static', year: '2013-17', items: ['Word2Vec', 'GloVe', 'FastText'], c: C.ok, x: 180 },
    { label: 'Contextual', year: '2018+', items: ['ELMo', 'BERT', 'GPT'], c: C.hi, x: 340 },
  ];

  return (
    <g>
      <motion.text x={240} y={18} textAnchor="middle" fontSize={12} fontWeight={700}
        fill={C.hi} {...fade(0)}>
        분산 의미론의 진화
      </motion.text>

      {/* 타임라인 축 */}
      <motion.g {...fade(0.2)}>
        <line x1={30} y1={44} x2={460} y2={44} stroke={`${C.m}30`} strokeWidth={1} />
      </motion.g>

      {/* 각 시대 */}
      {eras.map((e, i) => (
        <motion.g key={e.label} {...fade(0.3 + i * 0.3)}>
          {/* 점 */}
          <circle cx={e.x + 60} cy={44} r={5} fill={`${e.c}30`} stroke={e.c} strokeWidth={1.2} />
          {/* 연도 */}
          <text x={e.x + 60} y={38} textAnchor="middle" fontSize={8} fill={e.c} fontWeight={600}>
            {e.year}
          </text>
          {/* 카드 */}
          <rect x={e.x} y={56} width={120} height={80} rx={6}
            fill={`${e.c}08`} stroke={`${e.c}30`} strokeWidth={0.6} />
          <text x={e.x + 60} y={74} textAnchor="middle" fontSize={10} fontWeight={600} fill={e.c}>
            {e.label}
          </text>
          {e.items.map((item, j) => (
            <text key={j} x={e.x + 60} y={90 + j * 14} textAnchor="middle"
              fontSize={9} fill={C.m}>
              {item}
            </text>
          ))}
        </motion.g>
      ))}

      {/* 화살표들 */}
      {[0, 1].map(i => (
        <motion.g key={`arrow-${i}`} {...fade(0.6 + i * 0.3)}>
          <line x1={eras[i].x + 124} y1={96} x2={eras[i + 1].x - 4} y2={96}
            stroke={`${C.m}40`} strokeWidth={0.8} />
          <polygon points={`${eras[i + 1].x - 4},93 ${eras[i + 1].x},96 ${eras[i + 1].x - 4},99`}
            fill={`${C.m}40`} />
        </motion.g>
      ))}

      {/* 핵심 */}
      <motion.g {...fade(1.2)}>
        <text x={240} y={148} textAnchor="middle" fontSize={9} fill={C.hi} fontWeight={500}>
          분포 가설은 동일 — 구현 방식이 통계 → 추론 → 문맥별 추론으로 진화
        </text>
      </motion.g>
    </g>
  );
}
