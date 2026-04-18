import { motion } from 'framer-motion';
import { ANTI_C, FIX_C, DEBUG_C, CHECK_C } from './AntiPatternsDetailVizData';

export function AntiPattern1to3Step() {
  const items = [
    { num: '1', bad: '과도한 지시 (500 토큰)', fix: '상위 3개만', c: ANTI_C },
    { num: '2', bad: '"욕설 하지 마"', fix: '"정중한 어조 유지"', c: '#f97316' },
    { num: '3', bad: '"도움되는 어시스턴트"', fix: '"15년 Python 엔지니어"', c: CHECK_C },
  ];
  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10} fontWeight={700} fill={ANTI_C}>안티패턴 1-3</text>
      {items.map((it, i) => (
        <motion.g key={it.num} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }}>
          <circle cx={30} cy={38 + i * 42} r={10} fill={it.c + '18'} stroke={it.c} strokeWidth={1} />
          <text x={30} y={42 + i * 42} textAnchor="middle" fontSize={9} fontWeight={700} fill={it.c}>{it.num}</text>
          <rect x={50} y={26 + i * 42} width={180} height={20} rx={4} fill={ANTI_C + '10'} stroke={ANTI_C} strokeWidth={0.5} />
          <text x={55} y={40 + i * 42} fontSize={8} fill={ANTI_C}>{it.bad}</text>
          <text x={238} y={40 + i * 42} fontSize={9} fill="var(--muted-foreground)">→</text>
          <rect x={250} y={26 + i * 42} width={200} height={20} rx={4} fill={FIX_C + '10'} stroke={FIX_C} strokeWidth={0.5} />
          <text x={255} y={40 + i * 42} fontSize={8} fill={FIX_C}>{it.fix}</text>
        </motion.g>
      ))}
    </g>
  );
}

export function AntiPattern4to7Step() {
  const items = [
    { num: '4', bad: '형식 미지정', fix: '"3줄, 각 50자, 번호"' },
    { num: '5', bad: '예시 부재', fix: '2-3개 입출력 쌍' },
    { num: '6', bad: '컨텍스트 과잉', fix: '필요 정보만 (relevant)' },
    { num: '7', bad: '히스토리 오염', fix: '중요 지시 재주입' },
  ];
  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10} fontWeight={700} fill={ANTI_C}>안티패턴 4-7</text>
      {items.map((it, i) => (
        <motion.g key={it.num} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
          <circle cx={30} cy={36 + i * 34} r={9} fill={ANTI_C + '15'} stroke={ANTI_C} strokeWidth={0.8} />
          <text x={30} y={40 + i * 34} textAnchor="middle" fontSize={9} fontWeight={700} fill={ANTI_C}>{it.num}</text>
          <rect x={50} y={24 + i * 34} width={165} height={20} rx={4} fill={ANTI_C + '08'} stroke={ANTI_C} strokeWidth={0.5} />
          <text x={55} y={38 + i * 34} fontSize={8} fill={ANTI_C}>{it.bad}</text>
          <text x={222} y={38 + i * 34} fontSize={9} fill="var(--muted-foreground)">→</text>
          <rect x={235} y={24 + i * 34} width={220} height={20} rx={4} fill={FIX_C + '08'} stroke={FIX_C} strokeWidth={0.5} />
          <text x={240} y={38 + i * 34} fontSize={8} fill={FIX_C}>{it.fix}</text>
        </motion.g>
      ))}
    </g>
  );
}

export function AntiPattern8to10Step() {
  const items = [
    { num: '8', bad: 'temp=1.0 (사실 검색)', fix: '사실=0, 창의=0.7-1.0' },
    { num: '9', bad: '편향된 Few-shot', fix: '다양성 + 엣지 케이스' },
    { num: '10', bad: '"JSON으로 줘"', fix: '스키마 + 예시 동시' },
  ];
  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10} fontWeight={700} fill={ANTI_C}>안티패턴 8-10</text>
      {items.map((it, i) => (
        <motion.g key={it.num} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }}>
          <circle cx={30} cy={42 + i * 42} r={10} fill={ANTI_C + '15'} stroke={ANTI_C} strokeWidth={0.8} />
          <text x={30} y={46 + i * 42} textAnchor="middle" fontSize={9} fontWeight={700} fill={ANTI_C}>{it.num}</text>
          <rect x={50} y={28 + i * 42} width={180} height={22} rx={4} fill={ANTI_C + '08'} stroke={ANTI_C} strokeWidth={0.5} />
          <text x={55} y={44 + i * 42} fontSize={8} fill={ANTI_C}>{it.bad}</text>
          <text x={238} y={44 + i * 42} fontSize={9} fill="var(--muted-foreground)">→</text>
          <rect x={250} y={28 + i * 42} width={210} height={22} rx={4} fill={FIX_C + '08'} stroke={FIX_C} strokeWidth={0.5} />
          <text x={255} y={44 + i * 42} fontSize={8} fill={FIX_C}>{it.fix}</text>
        </motion.g>
      ))}
    </g>
  );
}

export function OutputInconsistencyStep() {
  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10} fontWeight={700} fill={DEBUG_C}>문제 1-2: 불일치 + Hallucination</text>
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
        <rect x={20} y={26} width={210} height={60} rx={6} fill={ANTI_C + '08'} stroke={ANTI_C} strokeWidth={1} />
        <text x={125} y={42} textAnchor="middle" fontSize={9} fontWeight={600} fill={ANTI_C}>출력 불일치</text>
        <text x={30} y={58} fontSize={8} fill="var(--muted-foreground)">원인: temp 높음, 모호한 지시</text>
        <text x={30} y={72} fontSize={8} fill={FIX_C}>해결: temp=0, Few-shot, 형식 명시</text>
      </motion.g>
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <rect x={250} y={26} width={210} height={60} rx={6} fill={CHECK_C + '08'} stroke={CHECK_C} strokeWidth={1} />
        <text x={355} y={42} textAnchor="middle" fontSize={9} fontWeight={600} fill={CHECK_C}>Hallucination</text>
        <text x={260} y={58} fontSize={8} fill="var(--muted-foreground)">원인: 모르는 영역</text>
        <text x={260} y={72} fontSize={8} fill={FIX_C}>해결: RAG + "모른다" 허용</text>
      </motion.g>
    </g>
  );
}

export function IgnoreWasteStep() {
  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10} fontWeight={700} fill={DEBUG_C}>문제 3-5</text>
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
        <rect x={20} y={26} width={140} height={55} rx={5} fill={ANTI_C + '08'} stroke={ANTI_C} strokeWidth={0.5} />
        <text x={90} y={42} textAnchor="middle" fontSize={8.5} fontWeight={600} fill={ANTI_C}>지시 무시</text>
        <text x={30} y={58} fontSize={7.5} fill={FIX_C}>System 강화</text>
        <text x={30} y={70} fontSize={7.5} fill={FIX_C}>지시 반복</text>
      </motion.g>
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <rect x={170} y={26} width={140} height={55} rx={5} fill={CHECK_C + '08'} stroke={CHECK_C} strokeWidth={0.5} />
        <text x={240} y={42} textAnchor="middle" fontSize={8.5} fontWeight={600} fill={CHECK_C}>토큰 낭비</text>
        <text x={180} y={58} fontSize={7.5} fill={FIX_C}>max_tokens</text>
        <text x={180} y={70} fontSize={7.5} fill={FIX_C}>"N단어 이내"</text>
      </motion.g>
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <rect x={320} y={26} width={140} height={55} rx={5} fill={DEBUG_C + '08'} stroke={DEBUG_C} strokeWidth={0.5} />
        <text x={390} y={42} textAnchor="middle" fontSize={8.5} fontWeight={600} fill={DEBUG_C}>금지 회피</text>
        <text x={330} y={58} fontSize={7.5} fill={FIX_C}>정당 컨텍스트</text>
        <text x={330} y={70} fontSize={7.5} fill={FIX_C}>역할 재설정</text>
      </motion.g>
    </g>
  );
}

export function DebugChecklistStep() {
  const steps = ['최소 프롬프트 시작', '단계적 지시 추가', '각 단계 관찰', 'A/B 테스트', '실패 분석'];
  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10} fontWeight={700} fill={DEBUG_C}>디버깅 5단계 + 프로덕션 체크리스트</text>
      {steps.map((s, i) => (
        <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
          <circle cx={40} cy={32 + i * 22} r={8} fill={DEBUG_C + '15'} stroke={DEBUG_C} strokeWidth={0.8} />
          <text x={40} y={36 + i * 22} textAnchor="middle" fontSize={8} fontWeight={700} fill={DEBUG_C}>{i + 1}</text>
          <text x={58} y={36 + i * 22} fontSize={8.5} fill="var(--foreground)">{s}</text>
          {i < 4 && <line x1={40} y1={40 + i * 22} x2={40} y2={46 + i * 22} stroke={DEBUG_C} strokeWidth={0.5} />}
        </motion.g>
      ))}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <rect x={200} y={26} width={260} height={105} rx={6} fill={CHECK_C + '08'} stroke={CHECK_C} strokeWidth={0.5} />
        <text x={330} y={42} textAnchor="middle" fontSize={8.5} fontWeight={600} fill={CHECK_C}>프로덕션 체크</text>
        <text x={210} y={58} fontSize={7.5} fill="var(--muted-foreground)">Temperature 적절 | 형식 명시</text>
        <text x={210} y={72} fontSize={7.5} fill="var(--muted-foreground)">Error handling | max_tokens</text>
        <text x={210} y={86} fontSize={7.5} fill="var(--muted-foreground)">Rate limiting | 비용 모니터링</text>
        <text x={210} y={100} fontSize={7.5} fill="var(--muted-foreground)">품질 평가 | Fallback 전략</text>
      </motion.g>
    </g>
  );
}
