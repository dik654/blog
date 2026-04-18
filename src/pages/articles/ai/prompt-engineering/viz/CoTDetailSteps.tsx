import { motion } from 'framer-motion';
import { COT_C, SC_C, TOT_C, THEORY_C } from './CoTDetailVizData';

export function StandardVsZeroStep() {
  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10} fontWeight={700} fill={COT_C}>Standard vs Zero-shot CoT</text>
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
        <rect x={20} y={24} width={210} height={55} rx={6} fill="#94a3b818" stroke="#94a3b8" strokeWidth={1} />
        <text x={125} y={40} textAnchor="middle" fontSize={9} fontWeight={600} fill="#94a3b8">Standard</text>
        <text x={30} y={56} fontSize={8} fill="var(--muted-foreground)">Q: 3 + 2 = ?</text>
        <text x={30} y={68} fontSize={8} fill="var(--muted-foreground)">A: 5 (직접 답)</text>
      </motion.g>
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <rect x={250} y={24} width={210} height={55} rx={6} fill={COT_C + '10'} stroke={COT_C} strokeWidth={1.5} />
        <text x={355} y={40} textAnchor="middle" fontSize={9} fontWeight={700} fill={COT_C}>Zero-shot CoT</text>
        <text x={260} y={56} fontSize={8} fill="var(--muted-foreground)">"Let's think step by step"</text>
        <text x={260} y={68} fontSize={8} fill={COT_C}>→ 중간 추론 과정 생성</text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <rect x={60} y={95} width={360} height={45} rx={6} fill={SC_C + '08'} stroke={SC_C} strokeWidth={0.5} />
        <text x={240} y={112} textAnchor="middle" fontSize={8.5} fill="var(--foreground)">Kojima et al. 2022: 한 줄 추가만으로 추론 유도</text>
        <text x={240} y={128} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">Tom starts with 3 → buys 2 more → 3+2=5 → answer is 5</text>
      </motion.g>
    </g>
  );
}

export function FewShotCoTSCStep() {
  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10} fontWeight={700} fill={SC_C}>Few-shot CoT + Self-Consistency</text>
      <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}>
        <rect x={20} y={28} width={210} height={50} rx={6} fill={COT_C + '10'} stroke={COT_C} strokeWidth={1} />
        <text x={125} y={44} textAnchor="middle" fontSize={9} fontWeight={600} fill={COT_C}>Few-shot CoT</text>
        <text x={30} y={60} fontSize={8} fill="var(--muted-foreground)">풀이 포함 예시 제공 → 안정적 추론</text>
        <text x={30} y={72} fontSize={8} fill="var(--muted-foreground)">형식 학습 + 추론 패턴 학습</text>
      </motion.g>
      <motion.g initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
        <rect x={250} y={28} width={210} height={50} rx={6} fill={SC_C + '10'} stroke={SC_C} strokeWidth={1} />
        <text x={355} y={44} textAnchor="middle" fontSize={9} fontWeight={600} fill={SC_C}>Self-Consistency</text>
        <text x={260} y={60} fontSize={8} fill="var(--muted-foreground)">N번 샘플링 (temp=0.7)</text>
        <text x={260} y={72} fontSize={8} fill={SC_C}>다수결 → +10% 정확도</text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <line x1={230} y1={53} x2={250} y2={53} stroke="var(--border)" strokeWidth={1} strokeDasharray="3 2" />
        <rect x={100} y={92} width={280} height={50} rx={6} fill={TOT_C + '08'} stroke={TOT_C} strokeWidth={0.5} />
        <text x={240} y={110} textAnchor="middle" fontSize={9} fontWeight={600} fill={TOT_C}>GSM8K 수학 문제 성능 비교</text>
        <text x={240} y={128} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">Standard 17.9% → CoT 56.9% → SC 74.4%</text>
      </motion.g>
    </g>
  );
}

export function ToTReActStep() {
  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10} fontWeight={700} fill={TOT_C}>Tree of Thoughts + ReAct</text>
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
        <rect x={20} y={26} width={210} height={55} rx={6} fill={TOT_C + '10'} stroke={TOT_C} strokeWidth={1} />
        <text x={125} y={42} textAnchor="middle" fontSize={9} fontWeight={600} fill={TOT_C}>Tree of Thoughts</text>
        <text x={30} y={56} fontSize={8} fill="var(--muted-foreground)">여러 path 트리 탐색</text>
        <text x={30} y={68} fontSize={8} fill="var(--muted-foreground)">중간 평가·가지치기 (BFS/DFS)</text>
      </motion.g>
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <rect x={250} y={26} width={210} height={55} rx={6} fill={THEORY_C + '10'} stroke={THEORY_C} strokeWidth={1} />
        <text x={355} y={42} textAnchor="middle" fontSize={9} fontWeight={600} fill={THEORY_C}>ReAct (Yao 2022)</text>
        <text x={260} y={56} fontSize={8} fill="var(--muted-foreground)">Thought → Action → Observation</text>
        <text x={260} y={68} fontSize={8} fill="var(--muted-foreground)">도구 사용과 결합 → Agent 기반</text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <rect x={40} y={95} width={400} height={45} rx={6} fill={SC_C + '08'} stroke={SC_C} strokeWidth={0.5} />
        <text x={240} y={112} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">모델 크기별 효과</text>
        <text x={240} y={128} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">{'< 60B: CoT 효과 미미 | ≥ 60B: 크게 향상 → "emergent ability"'}</text>
      </motion.g>
    </g>
  );
}

export function ComputeDecompStep() {
  const items = [
    { label: 'Compute Allocation', desc: '중간 token = 추가 forward pass', c: COT_C },
    { label: 'Decomposition', desc: '큰 문제 → 작은 단계 분해', c: SC_C },
  ];
  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10} fontWeight={700} fill={COT_C}>효과 원인: Compute + Decomposition</text>
      {items.map((it, i) => (
        <motion.g key={it.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}>
          <rect x={40} y={30 + i * 55} width={400} height={42} rx={6} fill={it.c + '10'} stroke={it.c} strokeWidth={1} />
          <text x={240} y={48 + i * 55} textAnchor="middle" fontSize={10} fontWeight={600} fill={it.c}>{it.label}</text>
          <text x={240} y={64 + i * 55} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)">{it.desc}</text>
        </motion.g>
      ))}
    </g>
  );
}

export function AttentionEmergentStep() {
  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10} fontWeight={700} fill={SC_C}>Attention Focus + Emergent</text>
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
        <rect x={20} y={26} width={210} height={50} rx={6} fill={SC_C + '10'} stroke={SC_C} strokeWidth={1} />
        <text x={125} y={42} textAnchor="middle" fontSize={9} fontWeight={600} fill={SC_C}>Attention Focus</text>
        <text x={30} y={58} fontSize={8} fill="var(--muted-foreground)">중간 답안 → Working memory 역할</text>
        <text x={30} y={70} fontSize={8} fill="var(--muted-foreground)">에러 전파 줄임</text>
      </motion.g>
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <rect x={250} y={26} width={210} height={50} rx={6} fill={THEORY_C + '10'} stroke={THEORY_C} strokeWidth={1} />
        <text x={355} y={42} textAnchor="middle" fontSize={9} fontWeight={600} fill={THEORY_C}>Emergent Behavior</text>
        <text x={260} y={58} fontSize={8} fill="var(--muted-foreground)">큰 모델에서만 나타남</text>
        <text x={260} y={70} fontSize={8} fill={THEORY_C}>{'< 60B: 미미 | ≥ 60B: 급증'}</text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <rect x={60} y={90} width={360} height={48} rx={6} fill={TOT_C + '08'} stroke={TOT_C} strokeWidth={0.5} />
        <text x={240} y={108} textAnchor="middle" fontSize={9} fontWeight={600} fill={TOT_C}>Training Data Alignment</text>
        <text x={240} y={124} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">인간 reasoning 텍스트에서 학습 → CoT = in-distribution</text>
      </motion.g>
    </g>
  );
}

export function LimitsStep() {
  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10} fontWeight={700} fill={THEORY_C}>한계 + 보완 기법</text>
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
        <rect x={20} y={26} width={200} height={70} rx={6} fill={THEORY_C + '08'} stroke={THEORY_C} strokeWidth={1} />
        <text x={120} y={42} textAnchor="middle" fontSize={9} fontWeight={600} fill={THEORY_C}>한계</text>
        <text x={30} y={58} fontSize={8} fill="var(--muted-foreground)">잘못된 추론 (confident errors)</text>
        <text x={30} y={70} fontSize={8} fill="var(--muted-foreground)">계산 오류 여전</text>
        <text x={30} y={82} fontSize={8} fill="var(--muted-foreground)">토큰 비용 10배+ 증가</text>
      </motion.g>
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <rect x={240} y={26} width={220} height={70} rx={6} fill={SC_C + '08'} stroke={SC_C} strokeWidth={1} />
        <text x={350} y={42} textAnchor="middle" fontSize={9} fontWeight={600} fill={SC_C}>보완 기법</text>
        <text x={250} y={58} fontSize={8} fill="var(--muted-foreground)">CoT + Calculator/Code interpreter</text>
        <text x={250} y={70} fontSize={8} fill="var(--muted-foreground)">Self-Verify (최종 검증 단계)</text>
        <text x={250} y={82} fontSize={8} fill="var(--muted-foreground)">RAG + PAL (코드 추론)</text>
      </motion.g>
    </g>
  );
}
