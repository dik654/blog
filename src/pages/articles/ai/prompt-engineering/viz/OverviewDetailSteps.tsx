import { motion } from 'framer-motion';
import { PRINCIPLE_C, EXAMPLE_C, HISTORY_C, ERA_C } from './OverviewDetailVizData';

/* ── Principles Steps ── */

export function ClarityContextStep() {
  const items = [
    { num: '1', title: 'Clarity', bad: '"좋은 글 써줘"', good: '"500자, 3섹션, 각 150자"', y: 18 },
    { num: '2', title: 'Context', bad: '"요약해줘"', good: '"e-commerce 제품 설명 요약"', y: 82 },
  ];
  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10} fontWeight={700} fill={PRINCIPLE_C}>
        명확성 + 컨텍스트
      </text>
      {items.map((it, i) => (
        <motion.g key={it.num} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.15 }}>
          <circle cx={30} cy={it.y + 20} r={12} fill={PRINCIPLE_C + '18'} stroke={PRINCIPLE_C} strokeWidth={1} />
          <text x={30} y={it.y + 24} textAnchor="middle" fontSize={10} fontWeight={700} fill={PRINCIPLE_C}>{it.num}</text>
          <text x={52} y={it.y + 18} fontSize={10} fontWeight={600} fill="var(--foreground)">{it.title}</text>
          <rect x={52} y={it.y + 26} width={170} height={22} rx={4} fill="#ef444415" stroke="#ef4444" strokeWidth={0.5} />
          <text x={60} y={it.y + 40} fontSize={8} fill="#ef4444">Bad: {it.bad}</text>
          <rect x={240} y={it.y + 26} width={210} height={22} rx={4} fill="#10b98115" stroke="#10b981" strokeWidth={0.5} />
          <text x={248} y={it.y + 40} fontSize={8} fill="#10b981">Good: {it.good}</text>
        </motion.g>
      ))}
    </g>
  );
}

export function ExamplesRoleStep() {
  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10} fontWeight={700} fill={PRINCIPLE_C}>
        예시 제공 + 역할 부여
      </text>
      <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <rect x={20} y={24} width={200} height={60} rx={6} fill={EXAMPLE_C + '10'} stroke={EXAMPLE_C} strokeWidth={1} />
        <circle cx={36} cy={36} r={8} fill={EXAMPLE_C + '20'} stroke={EXAMPLE_C} strokeWidth={1} />
        <text x={36} y={40} textAnchor="middle" fontSize={9} fontWeight={700} fill={EXAMPLE_C}>3</text>
        <text x={50} y={40} fontSize={9} fontWeight={600} fill="var(--foreground)">Examples (Few-shot)</text>
        <text x={30} y={56} fontSize={8} fill="var(--muted-foreground)">입출력 쌍 + 엣지 케이스</text>
        <text x={30} y={68} fontSize={8} fill="var(--muted-foreground)">1-shot만으로 형식 일관성 ↑</text>
      </motion.g>
      <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <rect x={240} y={24} width={220} height={60} rx={6} fill={HISTORY_C + '10'} stroke={HISTORY_C} strokeWidth={1} />
        <circle cx={256} cy={36} r={8} fill={HISTORY_C + '20'} stroke={HISTORY_C} strokeWidth={1} />
        <text x={256} y={40} textAnchor="middle" fontSize={9} fontWeight={700} fill={HISTORY_C}>4</text>
        <text x={270} y={40} fontSize={9} fontWeight={600} fill="var(--foreground)">Role Assignment</text>
        <text x={250} y={56} fontSize={8} fill="var(--muted-foreground)">"경험 많은 Python 개발자"</text>
        <text x={250} y={68} fontSize={8} fill="var(--muted-foreground)">전문성·어조·관점 고정 → 일관성</text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <rect x={80} y={95} width={320} height={45} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={240} y={112} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">
          예시의 구조가 라벨 정확도보다 중요 (Min et al. 2022)
        </text>
        <text x={240} y={128} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          LLM은 해당 도메인 학습 데이터를 우선 참조하게 됨
        </text>
      </motion.g>
    </g>
  );
}

export function StructureIterationStep() {
  const items = [
    { num: '5', title: 'Structure', desc: '번호·불릿·XML 태그', sub: '지시/컨텍스트/질문 구분', x: 20 },
    { num: '6', title: 'Iteration', desc: '초안 → 테스트 → 개선', sub: 'A/B 테스트로 비교', x: 260 },
  ];
  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10} fontWeight={700} fill={PRINCIPLE_C}>
        구조화 + 반복 개선
      </text>
      {items.map((it, i) => (
        <motion.g key={it.num} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.15 }}>
          <rect x={it.x} y={28} width={200} height={70} rx={6} fill={PRINCIPLE_C + '08'} stroke={PRINCIPLE_C} strokeWidth={1} />
          <circle cx={it.x + 16} cy={42} r={10} fill={PRINCIPLE_C + '20'} stroke={PRINCIPLE_C} strokeWidth={1} />
          <text x={it.x + 16} y={46} textAnchor="middle" fontSize={10} fontWeight={700} fill={PRINCIPLE_C}>{it.num}</text>
          <text x={it.x + 32} y={46} fontSize={10} fontWeight={600} fill="var(--foreground)">{it.title}</text>
          <text x={it.x + 10} y={66} fontSize={8.5} fill="var(--muted-foreground)">{it.desc}</text>
          <text x={it.x + 10} y={82} fontSize={8.5} fill="var(--muted-foreground)">{it.sub}</text>
        </motion.g>
      ))}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
        <line x1={220} y1={63} x2={260} y2={63} stroke="var(--border)" strokeWidth={1} strokeDasharray="3 2" />
        <text x={240} y={58} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">순환</text>
      </motion.g>
    </g>
  );
}

export function TemplateBlocksStep() {
  const blocks = [
    { label: '시스템 메시지', desc: '역할·배경·제약', c: PRINCIPLE_C },
    { label: '컨텍스트', desc: '배경 지식·참고', c: EXAMPLE_C },
    { label: '지시', desc: '구체적 태스크', c: HISTORY_C },
    { label: 'Few-shot', desc: 'Input→Output', c: '#8b5cf6' },
    { label: '입력', desc: '실제 질문/데이터', c: '#06b6d4' },
    { label: '출력 형식', desc: 'JSON/XML 스키마', c: ERA_C },
  ];
  return (
    <g>
      <text x={240} y={10} textAnchor="middle" fontSize={10} fontWeight={700} fill={PRINCIPLE_C}>
        LLM 입력 6-블록 템플릿
      </text>
      {blocks.map((b, i) => (
        <motion.g key={b.label} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.08 }}>
          <rect x={30} y={20 + i * 22} width={130} height={18} rx={4}
            fill={b.c + '15'} stroke={b.c} strokeWidth={0.8} />
          <text x={95} y={33 + i * 22} textAnchor="middle" fontSize={8.5} fontWeight={600} fill={b.c}>{b.label}</text>
          <line x1={165} y1={29 + i * 22} x2={195} y2={29 + i * 22}
            stroke="var(--border)" strokeWidth={0.5} strokeDasharray="2 2" />
          <text x={200} y={33 + i * 22} fontSize={8} fill="var(--muted-foreground)">{b.desc}</text>
          {i < 5 && (
            <line x1={95} y1={38 + i * 22} x2={95} y2={42 + i * 22}
              stroke="var(--border)" strokeWidth={0.5} />
          )}
        </motion.g>
      ))}
    </g>
  );
}

/* ── History Steps ── */

export function EarlyEraStep() {
  const events = [
    { year: '2018', label: 'GPT-1', desc: 'fine-tuning 필수', c: '#94a3b8' },
    { year: '2019', label: 'GPT-2', desc: 'zero-shot 가능성', c: '#64748b' },
    { year: '2020', label: 'GPT-3', desc: 'In-context learning 혁명', c: HISTORY_C },
  ];
  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10} fontWeight={700} fill={HISTORY_C}>
        2018-2020: In-context Learning 혁명
      </text>
      {events.map((e, i) => (
        <motion.g key={e.year} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.15 }}>
          <rect x={30} y={26 + i * 38} width={420} height={30} rx={5}
            fill={e.c + '10'} stroke={e.c} strokeWidth={i === 2 ? 1.5 : 0.5} />
          <text x={50} y={45 + i * 38} fontSize={10} fontWeight={700} fill={e.c}>{e.year}</text>
          <text x={100} y={45 + i * 38} fontSize={9.5} fontWeight={600} fill="var(--foreground)">{e.label}</text>
          <text x={200} y={45 + i * 38} fontSize={8.5} fill="var(--muted-foreground)">{e.desc}</text>
        </motion.g>
      ))}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <text x={240} y={148} textAnchor="middle" fontSize={8} fill={HISTORY_C}>
          Brown et al. 2020: 예시 몇 개로 fine-tuning 대체 → "prompt engineering" 용어 등장
        </text>
      </motion.g>
    </g>
  );
}

export function CoTEraStep() {
  const events = [
    { year: '2021', label: 'Instruction Tuning', desc: 'T0, Flan-T5' },
    { year: '2022', label: 'Chain-of-Thought', desc: 'GSM8K 17.9% → 56.9%' },
    { year: '2022', label: 'ChatGPT', desc: 'RLHF로 지시 따르기 강화' },
  ];
  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10} fontWeight={700} fill={ERA_C}>
        2021-2022: CoT + ChatGPT
      </text>
      {events.map((e, i) => (
        <motion.g key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.15 }}>
          <rect x={30} y={26 + i * 38} width={420} height={30} rx={5}
            fill={ERA_C + '08'} stroke={ERA_C} strokeWidth={0.5} />
          <text x={50} y={45 + i * 38} fontSize={10} fontWeight={700} fill={ERA_C}>{e.year}</text>
          <text x={100} y={45 + i * 38} fontSize={9.5} fontWeight={600} fill="var(--foreground)">{e.label}</text>
          <text x={260} y={45 + i * 38} fontSize={8.5} fill="var(--muted-foreground)">{e.desc}</text>
        </motion.g>
      ))}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <text x={240} y={148} textAnchor="middle" fontSize={8} fill={ERA_C}>
          "Let's think step by step" 한 줄로 수학 성능 3배 향상
        </text>
      </motion.g>
    </g>
  );
}

export function AgentEraStep() {
  const items = [
    { label: 'Tree of Thoughts', c: '#8b5cf6' },
    { label: 'ReAct', c: '#06b6d4' },
    { label: 'Self-Refine', c: EXAMPLE_C },
    { label: 'Tool use', c: HISTORY_C },
    { label: 'XML Prompting', c: PRINCIPLE_C },
    { label: 'Structured Output', c: ERA_C },
  ];
  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10} fontWeight={700} fill={EXAMPLE_C}>
        2023-2024: 고급 기법 + Agent 시대
      </text>
      {items.map((it, i) => {
        const col = i < 3 ? 0 : 1;
        const row = i % 3;
        const x = 40 + col * 230;
        const y = 28 + row * 36;
        return (
          <motion.g key={it.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08 }}>
            <rect x={x} y={y} width={190} height={28} rx={5}
              fill={it.c + '12'} stroke={it.c} strokeWidth={0.8} />
            <text x={x + 95} y={y + 18} textAnchor="middle" fontSize={9} fontWeight={600} fill={it.c}>{it.label}</text>
          </motion.g>
        );
      })}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <text x={240} y={148} textAnchor="middle" fontSize={8} fontWeight={600} fill="var(--muted-foreground)">
          2023: 추론 깊이 확장 → 2024: 도구 + 멀티스텝 결합
        </text>
      </motion.g>
    </g>
  );
}

export function CurrentStateStep() {
  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10} fontWeight={700} fill={PRINCIPLE_C}>
        현재: System Prompt 중심
      </text>
      <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <rect x={30} y={28} width={420} height={45} rx={6}
          fill={PRINCIPLE_C + '10'} stroke={PRINCIPLE_C} strokeWidth={1.5} />
        <text x={240} y={48} textAnchor="middle" fontSize={11} fontWeight={700} fill={PRINCIPLE_C}>
          System Prompt &gt; User Prompt
        </text>
        <text x={240} y={64} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)">
          모든 턴에 적용 — Output format 제어가 파이프라인 자동화 핵심
        </text>
      </motion.g>
      <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <rect x={30} y={84} width={200} height={55} rx={6}
          fill={EXAMPLE_C + '08'} stroke={EXAMPLE_C} strokeWidth={0.5} />
        <text x={130} y={102} textAnchor="middle" fontSize={9} fontWeight={600} fill={EXAMPLE_C}>
          모델 크기 의존 ↑
        </text>
        <text x={130} y={118} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          성능 = 모델 규모 × 프롬프트
        </text>
      </motion.g>
      <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <rect x={250} y={84} width={200} height={55} rx={6}
          fill={HISTORY_C + '08'} stroke={HISTORY_C} strokeWidth={0.5} />
        <text x={350} y={102} textAnchor="middle" fontSize={9} fontWeight={600} fill={HISTORY_C}>
          Production은 여전히 PE
        </text>
        <text x={350} y={118} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          6대 원칙 적용 → 2-3배 차이
        </text>
      </motion.g>
    </g>
  );
}
