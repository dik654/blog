import { motion } from 'framer-motion';
import { SHOT_C, DIVERSITY_C, ICL_C, THEORY_C } from './FewShotDetailVizData';

export function NshotStep() {
  const shots = [
    { n: '0-shot', score: '67.5', w: 40, c: '#94a3b8' },
    { n: '1-shot', score: '71.9', w: 80, c: SHOT_C },
    { n: '3-5 shot', score: '표준', w: 120, c: DIVERSITY_C },
    { n: '10+ shot', score: '체감', w: 130, c: ICL_C },
  ];
  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10} fontWeight={700} fill={SHOT_C}>N-shot: 0→1이 가장 큰 점프</text>
      {shots.map((s, i) => (
        <motion.g key={s.n} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
          <text x={30} y={38 + i * 32} fontSize={9} fontWeight={600} fill={s.c}>{s.n}</text>
          <rect x={110} y={26 + i * 32} width={s.w * 2.5} height={18} rx={4} fill={s.c + '20'} stroke={s.c} strokeWidth={0.8} />
          <text x={115 + s.w * 2.5} y={38 + i * 32} fontSize={8} fill="var(--muted-foreground)">{s.score}</text>
          {i === 0 && <text x={400} y={38} fontSize={7} fill={THEORY_C}>+4.4</text>}
          {i === 1 && <text x={400} y={70} fontSize={7} fill={DIVERSITY_C}>최적</text>}
        </motion.g>
      ))}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <text x={240} y={152} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">GPT-3 SuperGLUE: 0→1 shot에서 +4.4, 이후 수확 체감</text>
      </motion.g>
    </g>
  );
}

export function DiversityStep() {
  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10} fontWeight={700} fill={DIVERSITY_C}>다양성 + 형식 일관성</text>
      <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}>
        <rect x={20} y={24} width={200} height={70} rx={6} fill={THEORY_C + '08'} stroke={THEORY_C} strokeWidth={1} />
        <text x={120} y={38} textAnchor="middle" fontSize={9} fontWeight={600} fill={THEORY_C}>나쁜 예 (편향)</text>
        <text x={30} y={54} fontSize={8} fill="var(--muted-foreground)">1. "좋은 영화" → 긍정</text>
        <text x={30} y={66} fontSize={8} fill="var(--muted-foreground)">2. "재밌었다" → 긍정</text>
        <text x={30} y={78} fontSize={8} fill="var(--muted-foreground)">3. "추천합니다" → 긍정 (모두 긍정!)</text>
      </motion.g>
      <motion.g initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
        <rect x={240} y={24} width={220} height={70} rx={6} fill={DIVERSITY_C + '08'} stroke={DIVERSITY_C} strokeWidth={1} />
        <text x={350} y={38} textAnchor="middle" fontSize={9} fontWeight={600} fill={DIVERSITY_C}>좋은 예 (다양성)</text>
        <text x={250} y={54} fontSize={8} fill="var(--muted-foreground)">1. "최고 영화" → 긍정</text>
        <text x={250} y={66} fontSize={8} fill="var(--muted-foreground)">2. "지루한 2시간" → 부정</text>
        <text x={250} y={78} fontSize={8} fill="var(--muted-foreground)">3. "그럭저럭" → 중립 (균형!)</text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <rect x={60} y={104} width={360} height={22} rx={4} fill={SHOT_C + '10'} stroke={SHOT_C} strokeWidth={0.5} />
        <text x={240} y={119} textAnchor="middle" fontSize={8.5} fill={SHOT_C}>형식 통일: 라벨 이름 + 구분자 일관성 유지</text>
      </motion.g>
    </g>
  );
}

export function OrderBiasStep() {
  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10} fontWeight={700} fill={ICL_C}>순서 효과 + 동적 선택</text>
      <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <rect x={20} y={28} width={210} height={55} rx={6} fill={ICL_C + '10'} stroke={ICL_C} strokeWidth={1} />
        <text x={125} y={44} textAnchor="middle" fontSize={9} fontWeight={600} fill={ICL_C}>Recency Bias</text>
        <text x={30} y={60} fontSize={8} fill="var(--muted-foreground)">LLM은 최근 예시에 더 영향</text>
        <text x={30} y={72} fontSize={8} fill="var(--muted-foreground)">대표 예시를 마지막에 배치</text>
      </motion.g>
      <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <rect x={250} y={28} width={210} height={55} rx={6} fill={DIVERSITY_C + '10'} stroke={DIVERSITY_C} strokeWidth={1} />
        <text x={355} y={44} textAnchor="middle" fontSize={9} fontWeight={600} fill={DIVERSITY_C}>Dynamic Retrieval</text>
        <text x={260} y={60} fontSize={8} fill="var(--muted-foreground)">k-NN 임베딩으로 유사 예시 검색</text>
        <text x={260} y={72} fontSize={8} fill="var(--muted-foreground)">질문마다 최적 조합 자동 선택</text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <rect x={60} y={100} width={360} height={24} rx={4} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={240} y={116} textAnchor="middle" fontSize={8.5} fill="var(--foreground)">
          A/B 테스트로 최적 순서 탐색 → Dynamic prompting
        </text>
      </motion.g>
    </g>
  );
}

export function BayesianStep() {
  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10} fontWeight={700} fill={SHOT_C}>ICL 이론: Meta-Learning + Gradient</text>
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
        <rect x={20} y={28} width={210} height={65} rx={6} fill={SHOT_C + '10'} stroke={SHOT_C} strokeWidth={1} />
        <text x={125} y={44} textAnchor="middle" fontSize={9} fontWeight={600} fill={SHOT_C}>Bayesian Meta-Learning</text>
        <text x={30} y={60} fontSize={8} fill="var(--muted-foreground)">사전학습 = 태스크 분포 학습</text>
        <text x={30} y={72} fontSize={8} fill="var(--muted-foreground)">ICL = 특정 태스크 추론</text>
        <text x={30} y={84} fontSize={8} fill="var(--muted-foreground)">예시 = task descriptor</text>
      </motion.g>
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <rect x={250} y={28} width={210} height={65} rx={6} fill={ICL_C + '10'} stroke={ICL_C} strokeWidth={1} />
        <text x={355} y={44} textAnchor="middle" fontSize={9} fontWeight={600} fill={ICL_C}>Gradient Simulation</text>
        <text x={260} y={60} fontSize={8} fill="var(--muted-foreground)">Attention = implicit gradient</text>
        <text x={260} y={72} fontSize={8} fill="var(--muted-foreground)">각 예시 = 1-step 업데이트</text>
        <text x={260} y={84} fontSize={8} fill="var(--muted-foreground)">Akyurek 2022, Von Oswald 2023</text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <text x={240} y={115} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">
          파라미터 업데이트 없음 — purely attention/forward-pass 기반
        </text>
      </motion.g>
    </g>
  );
}

export function InductionStep() {
  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10} fontWeight={700} fill={DIVERSITY_C}>Induction Heads + 형식 &gt; 라벨</text>
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
        <rect x={20} y={28} width={200} height={55} rx={6} fill={DIVERSITY_C + '10'} stroke={DIVERSITY_C} strokeWidth={1} />
        <text x={120} y={44} textAnchor="middle" fontSize={9} fontWeight={600} fill={DIVERSITY_C}>Induction Heads</text>
        <text x={30} y={60} fontSize={8} fill="var(--muted-foreground)">Olsson 2022 (Anthropic)</text>
        <text x={30} y={72} fontSize={8} fill="var(--muted-foreground)">A→B, C→D 매핑 패턴 복사</text>
      </motion.g>
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <rect x={240} y={28} width={220} height={55} rx={6} fill={THEORY_C + '10'} stroke={THEORY_C} strokeWidth={1.5} />
        <text x={350} y={44} textAnchor="middle" fontSize={9} fontWeight={700} fill={THEORY_C}>Min et al. 2022</text>
        <text x={250} y={60} fontSize={8} fill={THEORY_C}>라벨 랜덤 셔플해도 성능 유지!</text>
        <text x={250} y={72} fontSize={8} fill="var(--muted-foreground)">형식/분포가 라벨보다 중요</text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <rect x={60} y={100} width={360} height={22} rx={4} fill={ICL_C + '10'} stroke={ICL_C} strokeWidth={0.5} />
        <text x={240} y={115} textAnchor="middle" fontSize={8.5} fontWeight={600} fill={ICL_C}>예시의 "구조"가 진짜 역할 수행</text>
      </motion.g>
    </g>
  );
}

export function ClaudeFewShotStep() {
  const bars = [
    { label: '0-shot', val: 67.5, c: '#94a3b8' },
    { label: '1-shot', val: 71.9, c: SHOT_C },
    { label: '32-shot', val: 73.2, c: DIVERSITY_C },
  ];
  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10} fontWeight={700} fill={SHOT_C}>Claude Few-shot + 성능 비교</text>
      {bars.map((b, i) => (
        <motion.g key={b.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }}>
          <text x={30} y={42 + i * 28} fontSize={9} fontWeight={600} fill={b.c}>{b.label}</text>
          <rect x={100} y={30 + i * 28} width={(b.val - 60) * 20} height={16} rx={3} fill={b.c + '25'} stroke={b.c} strokeWidth={0.8} />
          <text x={105 + (b.val - 60) * 20} y={42 + i * 28} fontSize={8} fill="var(--muted-foreground)">{b.val}</text>
        </motion.g>
      ))}
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <rect x={30} y={110} width={420} height={35} rx={6} fill={DIVERSITY_C + '08'} stroke={DIVERSITY_C} strokeWidth={0.5} />
        <text x={240} y={126} textAnchor="middle" fontSize={9} fontWeight={600} fill={DIVERSITY_C}>Claude: XML 태그로 예시 구분</text>
        <text x={240} y={138} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">{'<example>...</example> + System prompt에 배치'}</text>
      </motion.g>
    </g>
  );
}
