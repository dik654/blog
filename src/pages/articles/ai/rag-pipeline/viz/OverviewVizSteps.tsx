import { motion } from 'framer-motion';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';
import { C } from './OverviewVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

/* Step 0: RAG 개념 — 환각 문제와 해법 */
function RagConceptStep() {
  return (
    <g>
      {/* LLM 단독 */}
      <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
        <ModuleBox x={10} y={10} w={100} h={50} label="LLM 단독" sub="학습 데이터만 참조" color={C.alert} />
        <AlertBox x={10} y={72} w={100} h={36} label="환각 발생" sub="근거 없는 답변" color={C.alert} />
      </motion.g>
      {/* 화살표 → RAG */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <line x1={120} y1={50} x2={155} y2={50} stroke={C.muted} strokeWidth={1} strokeDasharray="3 2" />
        <text x={137} y={44} textAnchor="middle" fontSize={7} fill={C.muted}>vs</text>
      </motion.g>
      {/* RAG 파이프라인 */}
      <motion.g initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, ...sp }}>
        <rect x={160} y={6} width={310} height={108} rx={10}
          fill={C.gen + '06'} stroke={C.gen} strokeWidth={0.8} strokeDasharray="5 3" />
        <text x={315} y={20} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.gen}>RAG 파이프라인</text>
        <DataBox x={170} y={30} w={72} h={30} label="질문" sub="사용자 입력" color={C.doc} />
        <ActionBox x={252} y={30} w={78} h={30} label="검색" sub="관련 문서 탐색" color={C.retrieve} />
        <DataBox x={340} y={30} w={72} h={30} label="문서" sub="외부 지식" color={C.embed} />
        <ActionBox x={252} y={72} w={78} h={30} label="생성" sub="근거 기반 답변" color={C.gen} />
        {/* 흐름 화살표 */}
        <line x1={242} y1={45} x2={252} y2={45} stroke={C.muted} strokeWidth={0.8} />
        <line x1={330} y1={45} x2={340} y2={45} stroke={C.muted} strokeWidth={0.8} />
        <line x1={291} y1={60} x2={291} y2={72} stroke={C.muted} strokeWidth={0.8} />
      </motion.g>
      {/* 하단 설명 */}
      <motion.text x={240} y={135} textAnchor="middle" fontSize={8} fill={C.muted}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        외부 지식을 검색해서 LLM 응답에 주입 -- 환각 방지의 핵심 전략
      </motion.text>
    </g>
  );
}

/* Step 1: 5단계 파이프라인 흐름 */
function PipelineStep() {
  const stages = [
    { label: '문서 수집', icon: 'D', color: C.doc, x: 10 },
    { label: '청킹', icon: 'C', color: C.chunk, x: 105 },
    { label: '임베딩', icon: 'E', color: C.embed, x: 200 },
    { label: '검색', icon: 'R', color: C.retrieve, x: 295 },
    { label: '생성', icon: 'G', color: C.gen, x: 390 },
  ];
  return (
    <g>
      {/* 오프라인/온라인 구분 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <rect x={5} y={20} width={280} height={80} rx={8}
          fill={C.doc + '06'} stroke={C.doc} strokeWidth={0.5} strokeDasharray="4 2" />
        <text x={145} y={34} textAnchor="middle" fontSize={7} fontWeight={600} fill={C.doc}>
          Offline (사전 준비)
        </text>
        <rect x={285} y={20} width={190} height={80} rx={8}
          fill={C.retrieve + '06'} stroke={C.retrieve} strokeWidth={0.5} strokeDasharray="4 2" />
        <text x={380} y={34} textAnchor="middle" fontSize={7} fontWeight={600} fill={C.retrieve}>
          Online (실시간)
        </text>
      </motion.g>
      {/* 5개 단계 박스 */}
      {stages.map((s, i) => (
        <motion.g key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, ...sp }}>
          <rect x={s.x} y={44} width={82} height={44} rx={7}
            fill={s.color + '15'} stroke={s.color} strokeWidth={1.2} />
          <text x={s.x + 41} y={62} textAnchor="middle" fontSize={11} fontWeight={700} fill={s.color}>
            {s.icon}
          </text>
          <text x={s.x + 41} y={78} textAnchor="middle" fontSize={9} fontWeight={500} fill={s.color}>
            {s.label}
          </text>
          {i < 4 && (
            <motion.line x1={s.x + 82} y1={66} x2={stages[i + 1].x} y2={66}
              stroke={C.muted} strokeWidth={1} markerEnd="url(#pipeArrow)"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ delay: 0.3 + i * 0.1 }} />
          )}
        </motion.g>
      ))}
      <motion.text x={240} y={130} textAnchor="middle" fontSize={8} fill={C.muted}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        각 단계의 품질이 최종 답변 품질을 결정 -- 약한 고리가 전체를 무너뜨림
      </motion.text>
      <defs>
        <marker id="pipeArrow" viewBox="0 0 6 6" refX={5} refY={3} markerWidth={5} markerHeight={5} orient="auto">
          <path d="M0,0 L6,3 L0,6" fill={C.muted} />
        </marker>
      </defs>
    </g>
  );
}

/* Step 2: RAG vs Fine-tuning 비교 */
function CompareStep() {
  const rows = [
    { aspect: '지식 업데이트', rag: '즉시 (문서 교체)', ft: '재학습 필요', winner: 'rag' },
    { aspect: '출처 추적', rag: '가능 (문서 인용)', ft: '불가능', winner: 'rag' },
    { aspect: '추론 비용', rag: '검색 + 생성', ft: '생성만', winner: 'ft' },
    { aspect: '환각 제어', rag: '컨텍스트 근거', ft: '여전히 발생', winner: 'rag' },
    { aspect: '응답 일관성', rag: '검색 의존적', ft: '학습 반영', winner: 'ft' },
  ];
  return (
    <g>
      {/* 헤더 */}
      <rect x={10} y={8} width={460} height={18} rx={4} fill={C.muted + '10'} />
      <text x={90} y={20} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.muted}>비교 항목</text>
      <text x={240} y={20} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.embed}>RAG</text>
      <text x={390} y={20} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.alert}>Fine-tuning</text>
      {/* 행 */}
      {rows.map((r, i) => {
        const y = 30 + i * 20;
        return (
          <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: i * 0.08 }}>
            {r.winner === 'rag' && (
              <rect x={155} y={y} width={170} height={17} rx={3} fill={C.embed + '10'} />
            )}
            {r.winner === 'ft' && (
              <rect x={305} y={y} width={170} height={17} rx={3} fill={C.alert + '08'} />
            )}
            <text x={90} y={y + 12} textAnchor="middle" fontSize={8} fill={C.muted}>{r.aspect}</text>
            <text x={240} y={y + 12} textAnchor="middle" fontSize={8} fill={C.embed}>{r.rag}</text>
            <text x={390} y={y + 12} textAnchor="middle" fontSize={8} fill={C.alert}>{r.ft}</text>
          </motion.g>
        );
      })}
      <motion.text x={240} y={145} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.gen}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        실전: RAG 먼저 적용 -- 부족하면 RAG + LoRA 결합
      </motion.text>
    </g>
  );
}

/* Step 3: 제조 도메인 RAG 시나리오 */
function ManufacturingStep() {
  return (
    <g>
      {/* 사용자 질문 */}
      <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
        <DataBox x={10} y={10} w={140} h={34} label="작업자 질문" sub="CNC 진동 0.5mm 초과 시?" color={C.doc} outlined />
      </motion.g>
      {/* 검색 단계 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, ...sp }}>
        <line x1={150} y1={27} x2={170} y2={27} stroke={C.muted} strokeWidth={0.8} />
        <ActionBox x={170} y={10} w={85} h={34} label="문서 검색" sub="매뉴얼 3건 매칭" color={C.retrieve} />
      </motion.g>
      {/* 검색된 문서들 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35, ...sp }}>
        <line x1={255} y1={27} x2={275} y2={27} stroke={C.muted} strokeWidth={0.8} />
        {['설비 매뉴얼 p.42', '정비 이력서 #2847', '작업 표준서 v3.1'].map((doc, i) => (
          <g key={i}>
            <rect x={275} y={i * 22 + 4} width={110} height={18} rx={4}
              fill={C.embed + '12'} stroke={C.embed} strokeWidth={0.6} />
            <text x={330} y={i * 22 + 16} textAnchor="middle" fontSize={7} fill={C.embed}>{doc}</text>
          </g>
        ))}
      </motion.g>
      {/* LLM 생성 */}
      <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, ...sp }}>
        <rect x={10} y={76} width={460} height={58} rx={8}
          fill={C.gen + '08'} stroke={C.gen} strokeWidth={1} />
        <text x={240} y={92} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.gen}>
          LLM 생성 답변
        </text>
        <text x={20} y={108} fontSize={8} fill="var(--foreground)">
          1. 주축 정지 후 클램프 고정 상태 확인 [출처: 매뉴얼 p.42]
        </text>
        <text x={20} y={122} fontSize={8} fill="var(--foreground)">
          2. 베어링 마모도 점검 - 0.3mm 이상이면 교체 [출처: 정비 이력서 #2847]
        </text>
      </motion.g>
    </g>
  );
}

export default function OverviewVizSteps({ step }: { step: number }) {
  switch (step) {
    case 0: return <RagConceptStep />;
    case 1: return <PipelineStep />;
    case 2: return <CompareStep />;
    case 3: return <ManufacturingStep />;
    default: return <g />;
  }
}
