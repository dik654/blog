import { motion } from 'framer-motion';
import { C } from './ScalingDetailVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
const MF = 'ui-monospace,monospace';

export function Step0() {
  return (
    <g>
      <text x={20} y={16} fontSize={9} fontWeight={600} fill={C.kaplan}>Kaplan 2020 -- 멱법칙 정식화</text>
      {/* Three factors */}
      {[
        { label: 'N', desc: '파라미터 수', alpha: '0.076', color: C.kaplan },
        { label: 'D', desc: '데이터 토큰', alpha: '0.095', color: C.chin },
        { label: 'C', desc: '연산량 FLOPs', alpha: '0.050', color: C.llama },
      ].map((f, i) => (
        <motion.g key={i} initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...sp, delay: i * 0.12 }}>
          <rect x={20 + i * 130} y={28} width={120} height={44} rx={5}
            fill={`${f.color}10`} stroke={f.color} strokeWidth={1} />
          <text x={80 + i * 130} y={44} textAnchor="middle" fontSize={12}
            fontWeight={700} fontFamily={MF} fill={f.color}>{f.label}</text>
          <text x={80 + i * 130} y={58} textAnchor="middle" fontSize={8}
            fill={C.muted}>{f.desc}</text>
          <text x={80 + i * 130} y={68} textAnchor="middle" fontSize={7}
            fontFamily={MF} fill={f.color}>α={f.alpha}</text>
        </motion.g>
      ))}
      {/* Formula */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.4 }}>
        <rect x={20} y={82} width={440} height={24} rx={4}
          fill={`${C.kaplan}08`} stroke={C.kaplan} strokeWidth={0.8} />
        <text x={240} y={98} textAnchor="middle" fontSize={9} fontFamily={MF}
          fontWeight={600} fill={C.kaplan}>
          L(N,D,C) = a·N^(-α) + b·D^(-β) + c·C^(-γ)
        </text>
      </motion.g>
      {/* Conclusions */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.6 }}>
        <text x={20} y={126} fontSize={8} fill={C.kaplan}>
          • 손실은 N, D, C의 멱법칙으로 예측 가능
        </text>
        <text x={20} y={140} fontSize={8} fill={C.muted}>
          • 세 요인 중 하나라도 부족하면 병목 — GPT-3 학습 계획의 기반
        </text>
      </motion.g>
    </g>
  );
}

export function Step1() {
  const models = [
    { name: 'GPT-3', params: '175B', data: '300B', ratio: '1:1.7', status: 'undertrained', color: C.emerg },
    { name: 'Chinchilla', params: '70B', data: '1.4T', ratio: '1:20', status: 'optimal', color: C.chin },
  ];
  return (
    <g>
      <text x={20} y={16} fontSize={9} fontWeight={600} fill={C.chin}>Chinchilla 2022 -- 최적 N:D 비율</text>
      {/* Optimal formula */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.1 }}>
        <rect x={20} y={28} width={220} height={34} rx={4}
          fill={`${C.chin}10`} stroke={C.chin} strokeWidth={1} />
        <text x={130} y={42} textAnchor="middle" fontSize={8} fontFamily={MF}
          fontWeight={600} fill={C.chin}>
          N_opt ∝ C^0.5, D_opt ∝ C^0.5
        </text>
        <text x={130} y={56} textAnchor="middle" fontSize={8} fill={C.chin}>
          최적 비율: N : D = 1 : 20
        </text>
      </motion.g>
      {/* Model comparison */}
      {models.map((m, i) => {
        const y = 74 + i * 36;
        const isOpt = m.status === 'optimal';
        return (
          <motion.g key={i} initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...sp, delay: 0.3 + i * 0.15 }}>
            <rect x={20} y={y} width={430} height={28} rx={4}
              fill={isOpt ? `${C.chin}10` : `${C.emerg}08`}
              stroke={isOpt ? C.chin : C.emerg}
              strokeWidth={isOpt ? 1.2 : 0.8} />
            <text x={30} y={y + 18} fontSize={9} fontWeight={700}
              fill={m.color}>{m.name}</text>
            <text x={110} y={y + 18} fontSize={8} fontFamily={MF} fill={C.muted}>
              {m.params} params
            </text>
            <text x={210} y={y + 18} fontSize={8} fontFamily={MF} fill={C.muted}>
              {m.data} tokens
            </text>
            <text x={310} y={y + 18} fontSize={8} fontFamily={MF}
              fontWeight={600} fill={m.color}>
              {m.ratio}
            </text>
            <text x={370} y={y + 18} fontSize={8} fontWeight={600}
              fill={m.color}>{m.status}</text>
          </motion.g>
        );
      })}
      {/* Insight */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.7 }}>
        <rect x={80} y={148} width={300} height={0} rx={0} />
      </motion.g>
    </g>
  );
}

export function Step2() {
  return (
    <g>
      <text x={20} y={16} fontSize={9} fontWeight={600} fill={C.llama}>LLaMA와 데이터 반복</text>
      {/* LLaMA stats */}
      <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.1 }}>
        <rect x={20} y={28} width={200} height={50} rx={5}
          fill={`${C.llama}10`} stroke={C.llama} strokeWidth={1} />
        <text x={30} y={44} fontSize={8} fontWeight={600} fill={C.llama}>LLaMA-2 (7B)</text>
        <text x={30} y={58} fontSize={8} fontFamily={MF} fill={C.muted}>
          2T tokens (286x 비율)
        </text>
        <text x={30} y={72} fontSize={7} fill={C.llama}>
          Chinchilla(1:20)보다 14배 더 많은 데이터
        </text>
      </motion.g>
      {/* Trade-off */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.3 }}>
        <line x1={220} y1={53} x2={260} y2={53} stroke={C.llama} strokeWidth={1} />
        <polygon points="258,49 266,53 258,57" fill={C.llama} />
        <rect x={270} y={28} width={190} height={50} rx={5}
          fill={`${C.llama}08`} stroke={C.llama} strokeWidth={0.8} strokeDasharray="4 2" />
        <text x={365} y={44} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.llama}>
          전략적 선택
        </text>
        <text x={280} y={58} fontSize={7} fill={C.muted}>
          작은 모델 + 과도 학습
        </text>
        <text x={280} y={72} fontSize={7} fill={C.llama}>
          = 배포 시 추론 비용 절감
        </text>
      </motion.g>
      {/* Data repetition */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
        <rect x={20} y={92} width={440} height={40} rx={4}
          fill={`${C.prac}08`} stroke={C.prac} strokeWidth={0.8} />
        <text x={30} y={108} fontSize={8} fontWeight={600} fill={C.prac}>
          Data Repetition (Muennighoff 2023)
        </text>
        <text x={30} y={122} fontSize={8} fill={C.muted}>
          4 epochs까지 효과 유지 → 이후 감소. 독점 데이터 시대의 대안.
        </text>
      </motion.g>
    </g>
  );
}

export function Step3() {
  const abilities = [
    { name: 'Few-shot', desc: '몇 개 예시로 태스크 수행' },
    { name: 'Chain-of-Thought', desc: '단계적 추론' },
    { name: '산술 계산', desc: '자릿수 연산' },
  ];
  return (
    <g>
      <text x={20} y={16} fontSize={9} fontWeight={600} fill={C.emerg}>Emergent Abilities -- 임계 크기 효과</text>
      {/* Emergence visualization */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.1 }}>
        {/* X axis: model size */}
        <line x1={40} y1={90} x2={240} y2={90} stroke={C.muted} strokeWidth={0.5} />
        <text x={140} y={102} textAnchor="middle" fontSize={7} fill={C.muted}>모델 크기 →</text>
        {/* Y axis: ability */}
        <line x1={40} y1={30} x2={40} y2={90} stroke={C.muted} strokeWidth={0.5} />
        <text x={18} y={60} fontSize={7} fill={C.muted} transform="rotate(-90,18,60)">성능</text>
        {/* Flat then jump curve */}
        <motion.path
          d="M 40,85 L 100,84 L 120,82 L 140,75 L 150,50 L 160,38 L 200,35 L 240,34"
          fill="none" stroke={C.emerg} strokeWidth={2}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 1.0, ease: 'easeOut' }} />
        {/* Threshold marker */}
        <line x1={145} y1={28} x2={145} y2={92} stroke={C.emerg}
          strokeWidth={0.8} strokeDasharray="3 2" />
        <text x={145} y={26} textAnchor="middle" fontSize={7} fontWeight={600}
          fill={C.emerg}>임계점</text>
      </motion.g>
      {/* Abilities list */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.6 }}>
        {abilities.map((a, i) => {
          const y = 30 + i * 26;
          return (
            <g key={i}>
              <rect x={270} y={y} width={190} height={20} rx={3}
                fill={`${C.emerg}08`} stroke={C.emerg} strokeWidth={0.6} />
              <text x={280} y={y + 14} fontSize={8} fontWeight={600} fill={C.emerg}>
                {a.name}
              </text>
              <text x={370} y={y + 14} fontSize={7} fill={C.muted}>{a.desc}</text>
            </g>
          );
        })}
      </motion.g>
      {/* Practical */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.8 }}>
        <rect x={20} y={118} width={440} height={30} rx={4}
          fill={`${C.prac}08`} stroke={C.prac} strokeWidth={0.6} />
        <text x={30} y={132} fontSize={8} fontWeight={600} fill={C.prac}>실무 의미:</text>
        <text x={110} y={132} fontSize={8} fill={C.muted}>
          loss curve 예측 + 최적 N:D 결정 + compute ROI 평가
        </text>
        <text x={30} y={144} fontSize={7} fill={C.prac}>
          Scaling laws = LLM 경쟁의 전략적 도구
        </text>
      </motion.g>
    </g>
  );
}
