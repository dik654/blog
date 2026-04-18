import { motion } from 'framer-motion';
import { ModuleBox, DataBox } from '@/components/viz/boxes';
import { C } from './ApplicationVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

/* Step 0: 유전체 임베딩 개선 흐름 */
export function Step0() {
  return (
    <g>
      {/* 사전학습 모델 */}
      <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
        <ModuleBox x={15} y={30} w={75} h={45} label="gLM" sub="ESM-2" color={C.enc} />
      </motion.g>

      {/* 시퀀스 입력 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.1 }}>
        <line x1={90} y1={50} x2={110} y2={50} stroke={C.muted} strokeWidth={0.8} markerEnd="url(#app-arr)" />
        <DataBox x={113} y={25} w={70} h={26} label="wild-type" color={C.wt} />
        <DataBox x={113} y={58} w={70} h={26} label="변이 시퀀스" color={C.pathogenic} />
      </motion.g>

      {/* 임베딩 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.2 }}>
        <line x1={183} y1={38} x2={210} y2={38} stroke={C.wt} strokeWidth={0.8} markerEnd="url(#app-arr2)" />
        <line x1={183} y1={71} x2={210} y2={71} stroke={C.pathogenic} strokeWidth={0.8} markerEnd="url(#app-arr3)" />
      </motion.g>

      {/* Before: 겹치는 임베딩 */}
      <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...sp, delay: 0.3 }}>
        <rect x={215} y={15} width={110} height={85} rx={8} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={270} y={30} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.muted}>Before CL</text>

        {/* 겹치는 원들 */}
        <circle cx={250} cy={58} r={18} fill={`${C.wt}15`} stroke={C.wt} strokeWidth={0.8} />
        <circle cx={265} cy={62} r={18} fill={`${C.pathogenic}15`} stroke={C.pathogenic} strokeWidth={0.8} />
        <text x={250} y={55} textAnchor="middle" fontSize={7} fill={C.wt}>wt</text>
        <text x={265} y={68} textAnchor="middle" fontSize={7} fill={C.pathogenic}>mut</text>
        <text x={270} y={90} textAnchor="middle" fontSize={7} fill={C.muted}>겹침 → 구분 어려움</text>
      </motion.g>

      {/* Arrow */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.4 }}>
        <line x1={325} y1={55} x2={350} y2={55} stroke={C.loss} strokeWidth={1.2} markerEnd="url(#app-arr4)" />
        <text x={338} y={48} textAnchor="middle" fontSize={7} fontWeight={600} fill={C.loss}>CL</text>
      </motion.g>

      {/* After: 분리된 임베딩 */}
      <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...sp, delay: 0.5 }}>
        <rect x={355} y={15} width={110} height={85} rx={8} fill="var(--card)" stroke={C.benign} strokeWidth={0.8} />
        <text x={410} y={30} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.benign}>After CL</text>

        {/* 분리된 원들 */}
        <circle cx={385} cy={55} r={16} fill={`${C.wt}15`} stroke={C.wt} strokeWidth={0.8} />
        <circle cx={435} cy={70} r={16} fill={`${C.pathogenic}15`} stroke={C.pathogenic} strokeWidth={0.8} />
        <text x={385} y={52} textAnchor="middle" fontSize={7} fill={C.wt}>wt</text>
        <text x={385} y={63} textAnchor="middle" fontSize={7} fill={C.benign}>+benign</text>
        <text x={435} y={74} textAnchor="middle" fontSize={7} fill={C.pathogenic}>pathogenic</text>
        <text x={410} y={90} textAnchor="middle" fontSize={7} fill={C.benign}>명확한 분리</text>
      </motion.g>

      {/* 결과 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.6 }}>
        <rect x={120} y={115} width={240} height={22} rx={6} fill={`${C.loss}10`} stroke={C.loss} strokeWidth={0.8} />
        <text x={240} y={130} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.loss}>
          Spearman ρ: 0.45 → 0.62
        </text>
      </motion.g>

      <defs>
        <marker id="app-arr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
          <path d="M0,0 L5,2.5 L0,5 Z" fill={C.muted} />
        </marker>
        <marker id="app-arr2" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
          <path d="M0,0 L5,2.5 L0,5 Z" fill={C.wt} />
        </marker>
        <marker id="app-arr3" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
          <path d="M0,0 L5,2.5 L0,5 Z" fill={C.pathogenic} />
        </marker>
        <marker id="app-arr4" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
          <path d="M0,0 L5,2.5 L0,5 Z" fill={C.loss} />
        </marker>
      </defs>
    </g>
  );
}

/* Step 1: Cosine distance 분포 비교 */
export function Step1() {
  /* 분포 시각화: before/after 비교 */
  return (
    <g>
      {/* Before CL */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
        <rect x={20} y={15} width={210} height={140} rx={8} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={125} y={33} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.muted}>Before CL</text>

        {/* X축 */}
        <line x1={45} y1={130} x2={210} y2={130} stroke={C.muted} strokeWidth={0.5} />
        <text x={125} y={148} textAnchor="middle" fontSize={7} fill={C.muted}>cosine distance</text>

        {/* Benign 분포 (좁고 왼쪽) */}
        <motion.path d="M60,130 Q80,85 100,90 Q120,85 140,130"
          fill={`${C.benign}20`} stroke={C.benign} strokeWidth={1}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.2 }} />
        <text x={100} y={80} textAnchor="middle" fontSize={7} fill={C.benign}>benign</text>
        <text x={100} y={90} textAnchor="middle" fontSize={7} fill={C.benign}>d=0.12</text>

        {/* Pathogenic 분포 (많이 겹침) */}
        <motion.path d="M80,130 Q100,80 120,85 Q140,80 160,130"
          fill={`${C.pathogenic}15`} stroke={C.pathogenic} strokeWidth={1}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.3 }} />
        <text x={140} y={74} textAnchor="middle" fontSize={7} fill={C.pathogenic}>pathogenic</text>
        <text x={140} y={84} textAnchor="middle" fontSize={7} fill={C.pathogenic}>d=0.15</text>

        {/* 겹침 영역 표시 */}
        <text x={125} y={120} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.muted}>겹침 큼</text>
      </motion.g>

      {/* Arrow */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.4 }}>
        <line x1={235} y1={85} x2={255} y2={85} stroke={C.loss} strokeWidth={1.5} markerEnd="url(#app-dist-arr)" />
      </motion.g>

      {/* After CL */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.3 }}>
        <rect x={260} y={15} width={210} height={140} rx={8} fill="var(--card)" stroke={C.benign} strokeWidth={0.8} />
        <text x={365} y={33} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.benign}>After CL</text>

        {/* X축 */}
        <line x1={285} y1={130} x2={450} y2={130} stroke={C.muted} strokeWidth={0.5} />
        <text x={365} y={148} textAnchor="middle" fontSize={7} fill={C.muted}>cosine distance</text>

        {/* Benign 분포 (좁고 왼쪽) */}
        <motion.path d="M290,130 Q305,70 315,75 Q325,70 340,130"
          fill={`${C.benign}25`} stroke={C.benign} strokeWidth={1.2}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.45 }} />
        <text x={315} y={64} textAnchor="middle" fontSize={7} fontWeight={600} fill={C.benign}>benign</text>
        <text x={315} y={74} textAnchor="middle" fontSize={7} fill={C.benign}>d=0.05</text>

        {/* Pathogenic 분포 (오른쪽으로 이동) */}
        <motion.path d="M380,130 Q400,55 420,60 Q440,55 450,130"
          fill={`${C.pathogenic}25`} stroke={C.pathogenic} strokeWidth={1.2}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }} />
        <text x={420} y={50} textAnchor="middle" fontSize={7} fontWeight={600} fill={C.pathogenic}>pathogenic</text>
        <text x={420} y={60} textAnchor="middle" fontSize={7} fill={C.pathogenic}>d=0.23</text>

        {/* 분리 강조 */}
        <text x={365} y={120} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.benign}>명확한 분리</text>
      </motion.g>

      <defs>
        <marker id="app-dist-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={C.loss} />
        </marker>
      </defs>
    </g>
  );
}

/* Step 2: 3단계 파이프라인 */
export function Step2() {
  const stages = [
    { x: 30, label: 'Stage 1', sub: 'Contrastive\nPre-training', c: C.stage, detail: 'encoder + proj head\nSupCon / Triplet' },
    { x: 190, label: 'Stage 2', sub: 'Task Head', c: C.wt, detail: 'frozen encoder\n+ regression head' },
    { x: 350, label: 'Stage 3', sub: 'Joint\nFine-tuning', c: C.loss, detail: 'λ_cl=0.3 + λ_reg=0.7\n전체 파라미터 학습' },
  ];

  return (
    <g>
      {stages.map((s, i) => (
        <motion.g key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ ...sp, delay: i * 0.15 }}>
          <rect x={s.x} y={20} width={130} height={120} rx={10}
            fill={`${s.c}06`} stroke={s.c} strokeWidth={1} />
          <rect x={s.x} y={20} width={130} height={5} rx={2.5} fill={s.c} opacity={0.7} />

          {/* 번호 뱃지 */}
          <circle cx={s.x + 20} cy={42} r={10} fill={`${s.c}20`} stroke={s.c} strokeWidth={1} />
          <text x={s.x + 20} y={46} textAnchor="middle" fontSize={9} fontWeight={700} fill={s.c}>{i + 1}</text>

          <text x={s.x + 65} y={42} textAnchor="middle" fontSize={10} fontWeight={700} fill={s.c}>{s.label}</text>

          {/* 상세 내용 */}
          {s.sub.split('\n').map((line, li) => (
            <text key={li} x={s.x + 65} y={62 + li * 14} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">
              {line}
            </text>
          ))}

          {s.detail.split('\n').map((line, li) => (
            <text key={li} x={s.x + 65} y={100 + li * 13} textAnchor="middle" fontSize={8} fill={C.muted}>
              {line}
            </text>
          ))}

          {/* 화살표 */}
          {i < stages.length - 1 && (
            <line x1={s.x + 130} y1={80} x2={stages[i + 1].x} y2={80}
              stroke={C.muted} strokeWidth={1} markerEnd="url(#app-stage-arr)" />
          )}
        </motion.g>
      ))}

      {/* 결과 */}
      <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.5 }}>
        <rect x={100} y={155} width={280} height={22} rx={6} fill={`${C.benign}10`} stroke={C.benign} strokeWidth={0.8} />
        <text x={240} y={170} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.benign}>
          3단계가 단일 objective보다 일관되게 우수
        </text>
      </motion.g>

      <defs>
        <marker id="app-stage-arr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
          <path d="M0,0 L5,2.5 L0,5 Z" fill={C.muted} />
        </marker>
      </defs>
    </g>
  );
}

/* Step 3: 범용 적용 패턴 4단계 */
export function Step3() {
  const steps = [
    { n: '1', label: '사전학습 모델 확보', detail: 'BERT, ESM-2, ProtTrans...', c: C.enc },
    { n: '2', label: 'Pair 정의 설계', detail: 'positive/negative 기준 ← 도메인 전문성', c: C.loss },
    { n: '3', label: 'Contrastive Fine-tuning', detail: 't-SNE, kNN acc로 검증', c: C.stage },
    { n: '4', label: 'Downstream Head', detail: 'task 성능 측정', c: C.benign },
  ];

  return (
    <g>
      {steps.map((s, i) => {
        const x = 25 + i * 115;
        return (
          <motion.g key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ ...sp, delay: i * 0.12 }}>
            {/* 번호 원 */}
            <circle cx={x + 45} cy={35} r={14} fill={`${s.c}15`} stroke={s.c} strokeWidth={1.2} />
            <text x={x + 45} y={39} textAnchor="middle" fontSize={11} fontWeight={700} fill={s.c}>{s.n}</text>

            {/* 카드 */}
            <rect x={x} y={58} width={90} height={65} rx={8}
              fill={`${s.c}06`} stroke={s.c} strokeWidth={0.8} />
            <text x={x + 45} y={78} textAnchor="middle" fontSize={9} fontWeight={600} fill={s.c}>{s.label}</text>

            {s.detail.split('\n').map((line, li) => (
              <text key={li} x={x + 45} y={95 + li * 12} textAnchor="middle" fontSize={7} fill={C.muted}>{line}</text>
            ))}

            {/* 연결 화살표 */}
            {i < steps.length - 1 && (
              <line x1={x + 90} y1={90} x2={x + 115} y2={90}
                stroke={C.muted} strokeWidth={0.8} markerEnd="url(#app-gen-arr)" />
            )}
          </motion.g>
        );
      })}

      {/* 핵심 메시지 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.55 }}>
        <rect x={80} y={140} width={320} height={38} rx={8}
          fill={`${C.loss}08`} stroke={C.loss} strokeWidth={0.8} />
        <text x={240} y={157} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.loss}>
          "모델을 바꾸는 것이 아니라 학습 신호를 바꾸는 것"
        </text>
        <text x={240} y={172} textAnchor="middle" fontSize={8} fill={C.muted}>
          pair 설계 = 도메인 전문성이 필요한 유일한 지점
        </text>
      </motion.g>

      <defs>
        <marker id="app-gen-arr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
          <path d="M0,0 L5,2.5 L0,5 Z" fill={C.muted} />
        </marker>
      </defs>
    </g>
  );
}
