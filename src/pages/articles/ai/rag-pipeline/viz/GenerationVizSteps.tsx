import { motion } from 'framer-motion';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';
import { C } from './GenerationVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

/* Step 0: 프롬프트 구조 */
function PromptStructureStep() {
  const sections = [
    { label: 'System', desc: '역할 + 규칙 정의', h: 24, color: C.system },
    { label: 'Context', desc: '검색된 문서 3~5건', h: 38, color: C.context },
    { label: 'Question', desc: '사용자 질문', h: 22, color: C.cite },
  ];
  let cy = 24;
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.muted}>
        프롬프트 구조: System + Context + Question
      </text>
      {/* 프롬프트 외곽 */}
      <rect x={60} y={20} width={360} height={100} rx={8}
        fill="var(--card)" stroke="var(--border)" strokeWidth={0.8} />
      {sections.map((s, i) => {
        const y = cy;
        cy += s.h + 4;
        return (
          <motion.g key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.12, ...sp }}>
            <rect x={68} y={y} width={344} height={s.h} rx={4}
              fill={s.color + '10'} stroke={s.color} strokeWidth={0.8} />
            <rect x={68} y={y} width={4} height={s.h} rx={2} fill={s.color} />
            <text x={82} y={y + s.h / 2 + 4} fontSize={9} fontWeight={700} fill={s.color}>
              {s.label}
            </text>
            <text x={160} y={y + s.h / 2 + 4} fontSize={8} fill={C.muted}>{s.desc}</text>
          </motion.g>
        );
      })}
      {/* Lost-in-the-middle */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <rect x={60} y={128} width={360} height={20} rx={4}
          fill={C.cite + '08'} stroke={C.cite} strokeWidth={0.5} strokeDasharray="3 2" />
        <text x={240} y={141} textAnchor="middle" fontSize={8} fill={C.cite}>
          핵심 문서를 프롬프트 시작/끝에 배치 -- Lost-in-the-middle 방지
        </text>
      </motion.g>
    </g>
  );
}

/* Step 1: System Prompt 설계 */
function SystemPromptStep() {
  const rules = [
    { key: '역할', value: '"당신은 제조 설비 전문가입니다"' },
    { key: '근거', value: '"제공된 문서만으로 답변하세요"' },
    { key: '환각 방지', value: '"문서에 없으면 \'정보 없음\'으로 답변"' },
    { key: '출처', value: '"각 문장에 [출처N] 태그 포함"' },
    { key: '형식', value: '"1)원인 2)조치 3)예방 순서로 구성"' },
    { key: '언어', value: '"한국어 답변, 전문 용어 영문 병기"' },
  ];
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.muted}>
        System Prompt 설계 요소
      </text>
      {rules.map((r, i) => (
        <motion.g key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.08, ...sp }}>
          <rect x={20} y={22 + i * 20} width={440} height={17} rx={4}
            fill={C.system + '06'} stroke={C.system} strokeWidth={0.3} />
          <rect x={20} y={22 + i * 20} width={3} height={17} rx={1.5} fill={C.system} />
          <text x={32} y={34 + i * 20} fontSize={8} fontWeight={700} fill={C.system}>{r.key}</text>
          <text x={100} y={34 + i * 20} fontSize={8} fill={C.muted}>{r.value}</text>
        </motion.g>
      ))}
      <motion.text x={240} y={148} textAnchor="middle" fontSize={8} fill={C.system}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        명확한 규칙 = 환각 감소 + 일관된 출력 형식
      </motion.text>
    </g>
  );
}

/* Step 2: Context Window 관리 */
function ContextWindowStep() {
  const budget = [
    { label: 'System', tokens: 200, color: C.system },
    { label: 'Context', tokens: 3000, color: C.context },
    { label: 'Question', tokens: 100, color: C.cite },
    { label: 'Answer', tokens: 1000, color: C.gen },
  ];
  const total = budget.reduce((s, b) => s + b.tokens, 0);
  const barW = 400;
  let bx = 40;
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.muted}>
        Context Window 토큰 예산 배분
      </text>
      {/* 스택 바 */}
      {budget.map((b, i) => {
        const w = (b.tokens / total) * barW;
        const x = bx;
        bx += w;
        return (
          <motion.g key={i} initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            style={{ transformOrigin: `${x}px 40px` }}
            transition={{ delay: i * 0.12, ...sp }}>
            <rect x={x} y={28} width={w} height={30} rx={i === 0 ? 5 : i === budget.length - 1 ? 5 : 0}
              fill={b.color + '20'} stroke={b.color} strokeWidth={0.8} />
            <text x={x + w / 2} y={42} textAnchor="middle" fontSize={8} fontWeight={600}
              fill={b.color}>{b.label}</text>
            <text x={x + w / 2} y={54} textAnchor="middle" fontSize={7} fill={C.muted}>
              {b.tokens}t
            </text>
          </motion.g>
        );
      })}
      {/* 전략 비교 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        {[
          { name: 'Stuffing', desc: '모든 문서 삽입 (소량)', y: 76, color: C.context },
          { name: 'Map-Reduce', desc: '각 문서별 답변 → 종합', y: 98, color: C.gen },
          { name: 'Refine', desc: '문서 순차 정제', y: 120, color: C.cite },
        ].map((s, i) => (
          <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.55 + i * 0.08 }}>
            <rect x={40} y={s.y} width={80} height={18} rx={4}
              fill={s.color + '12'} stroke={s.color} strokeWidth={0.8} />
            <text x={80} y={s.y + 12} textAnchor="middle" fontSize={8} fontWeight={600}
              fill={s.color}>{s.name}</text>
            <text x={130} y={s.y + 12} fontSize={7} fill={C.muted}>{s.desc}</text>
          </motion.g>
        ))}
      </motion.g>
    </g>
  );
}

/* Step 3: Cited 응답 */
function CitedResponseStep() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.muted}>
        Cited 응답: 출처 추적 가능한 답변 생성
      </text>
      {/* 생성된 답변 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
        <rect x={20} y={26} width={440} height={70} rx={8}
          fill={C.gen + '06'} stroke={C.gen} strokeWidth={1} />
        <text x={30} y={42} fontSize={8} fill="var(--foreground)">
          진동 임계값 0.5mm 초과 시 즉시 주축 정지가 필요합니다.
        </text>
        <rect x={370} y={32} width={42} height={14} rx={7}
          fill={C.cite + '20'} stroke={C.cite} strokeWidth={0.8} />
        <text x={391} y={42} textAnchor="middle" fontSize={7} fontWeight={700} fill={C.cite}>[출처1]</text>

        <text x={30} y={60} fontSize={8} fill="var(--foreground)">
          베어링 마모도 점검 후 0.3mm 이상이면 교체 조치합니다.
        </text>
        <rect x={370} y={50} width={42} height={14} rx={7}
          fill={C.cite + '20'} stroke={C.cite} strokeWidth={0.8} />
        <text x={391} y={60} textAnchor="middle" fontSize={7} fontWeight={700} fill={C.cite}>[출처2]</text>

        <text x={30} y={78} fontSize={8} fill="var(--foreground)">
          정기 점검 주기를 500시간에서 300시간으로 단축 권장.
        </text>
        <rect x={370} y={68} width={42} height={14} rx={7}
          fill={C.cite + '20'} stroke={C.cite} strokeWidth={0.8} />
        <text x={391} y={78} textAnchor="middle" fontSize={7} fontWeight={700} fill={C.cite}>[출처3]</text>
      </motion.g>
      {/* 출처 매핑 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        {[
          { id: '[출처1]', ref: '설비 매뉴얼 p.42', y: 108 },
          { id: '[출처2]', ref: '정비 이력서 #2847', y: 122 },
          { id: '[출처3]', ref: '작업 표준서 v3.1, 4.2절', y: 136 },
        ].map((s, i) => (
          <g key={i}>
            <text x={30} y={s.y} fontSize={7} fontWeight={700} fill={C.cite}>{s.id}</text>
            <text x={80} y={s.y} fontSize={7} fill={C.muted}>{s.ref}</text>
          </g>
        ))}
      </motion.g>
      {/* 경고 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <AlertBox x={300} y={104} w={160} h={36} label="인용 없는 문장"
          sub="환각 가능성 경고" color={C.window} />
      </motion.g>
    </g>
  );
}

export default function GenerationVizSteps({ step }: { step: number }) {
  switch (step) {
    case 0: return <PromptStructureStep />;
    case 1: return <SystemPromptStep />;
    case 2: return <ContextWindowStep />;
    case 3: return <CitedResponseStep />;
    default: return <g />;
  }
}
