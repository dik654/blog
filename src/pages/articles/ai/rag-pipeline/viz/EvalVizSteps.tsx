import { motion } from 'framer-motion';
import { ModuleBox, StatusBox, AlertBox } from '@/components/viz/boxes';
import { C, METRICS } from './EvalVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

/* Step 0: 3축 평가 프레임워크 */
function ThreeAxesStep() {
  const axes = [
    { label: 'Faithfulness', desc: '환각 없음', sub: '답변 -> 컨텍스트', color: C.faith, x: 25 },
    { label: 'Answer Rel.', desc: '질문 적합성', sub: '답변 -> 질문', color: C.ans, x: 180 },
    { label: 'Context Rel.', desc: '검색 품질', sub: '컨텍스트 -> 질문', color: C.ctx, x: 335 },
  ];
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.muted}>
        RAG 평가의 3축
      </text>
      {/* 3개 축 */}
      {axes.map((a, i) => (
        <motion.g key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.12, ...sp }}>
          <rect x={a.x} y={28} width={120} height={56} rx={8}
            fill={a.color + '12'} stroke={a.color} strokeWidth={1.2} />
          <text x={a.x + 60} y={46} textAnchor="middle" fontSize={10} fontWeight={700} fill={a.color}>
            {a.label}
          </text>
          <text x={a.x + 60} y={60} textAnchor="middle" fontSize={8} fill={a.color}>
            {a.desc}
          </text>
          <text x={a.x + 60} y={76} textAnchor="middle" fontSize={7} fill={C.muted}>
            {a.sub}
          </text>
        </motion.g>
      ))}
      {/* 진단 매트릭스 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <rect x={30} y={96} width={420} height={38} rx={6}
          fill={C.muted + '06'} stroke={C.muted} strokeWidth={0.5} />
        <text x={240} y={112} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.muted}>
          병목 진단
        </text>
        <text x={120} y={126} textAnchor="middle" fontSize={7} fill={C.faith}>
          {'Faithfulness 낮음 → 생성 문제'}
        </text>
        <text x={360} y={126} textAnchor="middle" fontSize={7} fill={C.ctx}>
          {'Context 낮음 → 검색 문제'}
        </text>
      </motion.g>
    </g>
  );
}

/* Step 1: Faithfulness 측정 */
function FaithfulnessStep() {
  const claims = [
    { text: '진동 임계값은 0.5mm', grounded: true },
    { text: '베어링 마모 0.3mm 이상 교체', grounded: true },
    { text: '점검 주기 300시간 권장', grounded: true },
    { text: '윤활유 교체도 필요', grounded: false },
    { text: '총 5건의 유사 사례 있음', grounded: false },
  ];
  const grounded = claims.filter(c => c.grounded).length;
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.muted}>
        Faithfulness: 답변의 각 주장이 문서에 근거하는가?
      </text>
      {/* 주장 리스트 */}
      {claims.map((c, i) => {
        const y = 26 + i * 20;
        return (
          <motion.g key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08, ...sp }}>
            <rect x={20} y={y} width={380} height={17} rx={4}
              fill={c.grounded ? C.faith + '08' : '#ef444408'}
              stroke={c.grounded ? C.faith : '#ef4444'} strokeWidth={0.5} />
            <circle cx={30} cy={y + 8.5} r={4}
              fill={c.grounded ? C.faith : '#ef4444'} opacity={0.8} />
            <text x={30} y={y + 11.5} textAnchor="middle" fontSize={7} fill="white" fontWeight={700}>
              {c.grounded ? 'O' : 'X'}
            </text>
            <text x={42} y={y + 12} fontSize={8}
              fill={c.grounded ? 'var(--foreground)' : '#ef4444'}>{c.text}</text>
          </motion.g>
        );
      })}
      {/* 점수 계산 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <rect x={410} y={30} width={60} height={50} rx={8}
          fill={C.faith + '15'} stroke={C.faith} strokeWidth={1.2} />
        <text x={440} y={52} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.faith}>
          {(grounded / claims.length).toFixed(2)}
        </text>
        <text x={440} y={66} textAnchor="middle" fontSize={7} fill={C.muted}>
          {grounded}/{claims.length}
        </text>
      </motion.g>
      <motion.text x={240} y={140} textAnchor="middle" fontSize={8} fill="#ef4444"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        제조 현장: 0.85 미만 = 위험 -- 근거 없는 정비 지침은 사고 유발
      </motion.text>
    </g>
  );
}

/* Step 2: Answer & Context Metrics */
function MetricsDetailStep() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.muted}>
        Answer Relevance + Context Metrics
      </text>
      {/* 4개 메트릭 */}
      {METRICS.map((m, i) => {
        const y = 26 + i * 28;
        const colors = [C.faith, C.ans, C.ctx, C.ctx];
        const progress = parseFloat(m.target.replace('>', ''));
        return (
          <motion.g key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1, ...sp }}>
            <StatusBox x={15} y={y} w={120} h={24} label={m.name}
              color={colors[i]} progress={progress} />
            <text x={145} y={y + 10} fontSize={7} fill={colors[i]}>
              목표: {m.target}
            </text>
            <rect x={210} y={y + 2} width={250} height={20} rx={4}
              fill={colors[i] + '06'} stroke={colors[i]} strokeWidth={0.3} />
            <text x={220} y={y + 15} fontSize={7} fill={C.muted}>{m.desc}</text>
          </motion.g>
        );
      })}
      <motion.text x={240} y={145} textAnchor="middle" fontSize={8} fill={C.muted}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        {'Recall 낮음 → 청킹/임베딩 개선 | Precision 낮음 → 검색 임계값 조정'}
      </motion.text>
    </g>
  );
}

/* Step 3: RAGAS */
function RagasStep() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.muted}>
        RAGAS: RAG 자동 평가 프레임워크
      </text>
      {/* 입력 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
        <rect x={20} y={26} width={130} height={70} rx={8}
          fill={C.ragas + '08'} stroke={C.ragas} strokeWidth={0.8} />
        <text x={85} y={42} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.ragas}>입력 데이터</text>
        {['questions', 'answers', 'contexts', 'ground_truths'].map((f, i) => (
          <text key={i} x={30} y={54 + i * 10} fontSize={7} fill={C.muted}>- {f}</text>
        ))}
      </motion.g>
      {/* RAGAS 엔진 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, ...sp }}>
        <line x1={150} y1={61} x2={175} y2={61} stroke={C.ragas} strokeWidth={1} />
        <ModuleBox x={175} y={36} w={130} h={50} label="RAGAS Engine" sub="LLM 기반 판정" color={C.ragas} />
      </motion.g>
      {/* 출력 메트릭 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, ...sp }}>
        <line x1={305} y1={61} x2={330} y2={61} stroke={C.ragas} strokeWidth={1} />
        <rect x={330} y={26} width={140} height={70} rx={8}
          fill={C.ragas + '08'} stroke={C.ragas} strokeWidth={0.8} />
        <text x={400} y={42} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.ragas}>출력 점수</text>
        {[
          { m: 'Faithfulness', v: '0.87', c: C.faith },
          { m: 'Answer Rel.', v: '0.82', c: C.ans },
          { m: 'Context Recall', v: '0.78', c: C.ctx },
          { m: 'Context Prec.', v: '0.74', c: C.ctx },
        ].map((s, i) => (
          <g key={i}>
            <text x={340} y={55 + i * 10} fontSize={7} fill={s.c}>{s.m}</text>
            <text x={450} y={55 + i * 10} textAnchor="end" fontSize={7} fontWeight={600} fill={s.c}>{s.v}</text>
          </g>
        ))}
      </motion.g>
      {/* 비용 */}
      <motion.text x={240} y={115} textAnchor="middle" fontSize={8} fill={C.muted}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        평가 비용: 100 샘플 기준 $2~5 (GPT-4) | 대안: DeepEval, TruLens, Phoenix
      </motion.text>
      <motion.text x={240} y={132} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.ragas}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        양호 기준: Faithfulness 0.85+ / Answer 0.80+ / Context 0.75+
      </motion.text>
    </g>
  );
}

/* Step 4: 자동 평가 파이프라인 */
function AutoEvalStep() {
  const steps = [
    { label: '평가셋 구축', sub: '50~100 Q&A 쌍', color: C.faith },
    { label: 'CI/CD 통합', sub: 'PR마다 자동 실행', color: C.ans },
    { label: '회귀 감지', sub: '점수 하락 자동 확인', color: C.ctx },
    { label: 'A/B 테스트', sub: '신규 vs 기존 비교', color: C.ragas },
    { label: '대시보드', sub: '추이 시각화 + 알림', color: C.auto },
  ];
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.muted}>
        자동 평가 파이프라인 5단계
      </text>
      {steps.map((s, i) => {
        const x = 10 + i * 92;
        return (
          <motion.g key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, ...sp }}>
            {/* 번호 원 */}
            <circle cx={x + 40} cy={38} r={12} fill={s.color + '20'} stroke={s.color} strokeWidth={1} />
            <text x={x + 40} y={42} textAnchor="middle" fontSize={10} fontWeight={700} fill={s.color}>
              {i + 1}
            </text>
            {/* 라벨 */}
            <text x={x + 40} y={62} textAnchor="middle" fontSize={8} fontWeight={600} fill={s.color}>
              {s.label}
            </text>
            <text x={x + 40} y={74} textAnchor="middle" fontSize={7} fill={C.muted}>
              {s.sub}
            </text>
            {/* 연결선 */}
            {i < 4 && (
              <motion.line x1={x + 52} y1={38} x2={x + 80} y2={38}
                stroke={C.muted} strokeWidth={0.8} strokeDasharray="3 2"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ delay: 0.3 + i * 0.1 }} />
            )}
          </motion.g>
        );
      })}
      {/* 제조 포인트 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        <rect x={60} y={92} width={360} height={36} rx={6}
          fill={C.auto + '06'} stroke={C.auto} strokeWidth={0.5} strokeDasharray="4 2" />
        <text x={240} y={108} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.auto}>
          제조 현장 적용
        </text>
        <text x={240} y={122} textAnchor="middle" fontSize={7} fill={C.muted}>
          매뉴얼 업데이트 시 평가 자동 재실행 -- 품질 하락 즉시 감지
        </text>
      </motion.g>
    </g>
  );
}

export default function EvalVizSteps({ step }: { step: number }) {
  switch (step) {
    case 0: return <ThreeAxesStep />;
    case 1: return <FaithfulnessStep />;
    case 2: return <MetricsDetailStep />;
    case 3: return <RagasStep />;
    case 4: return <AutoEvalStep />;
    default: return <g />;
  }
}
