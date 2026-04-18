import { motion } from 'framer-motion';
import { GRU_C, PEEK_C, BI_C, MODERN_C } from './VariantsDetailVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

/* Step 0: GRU — 2 gates, unified state */
export function Step0() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={10} fill="#999">
        GRU: Update Gate로 forget + input 통합
      </text>
      {/* Input */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0 }}>
        <rect x={20} y={50} width={60} height={40} rx={5}
          fill="#88888810" stroke="#888" strokeWidth={0.8} />
        <text x={50} y={68} textAnchor="middle" fontSize={9} fill="#666">[hₜ₋₁,</text>
        <text x={50} y={82} textAnchor="middle" fontSize={9} fill="#666">xₜ]</text>
      </motion.g>
      {/* Reset gate */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.15 }}>
        <line x1={80} y1={60} x2={110} y2={46} stroke={GRU_C} strokeWidth={0.8} />
        <rect x={110} y={30} width={90} height={28} rx={10}
          fill={GRU_C + '12'} stroke={GRU_C} strokeWidth={1} />
        <text x={155} y={43} textAnchor="middle" fontSize={9} fill={GRU_C} fontWeight={600}>Reset (rₜ)</text>
        <text x={155} y={55} textAnchor="middle" fontSize={8} fill={GRU_C}>이전 상태 참조량</text>
      </motion.g>
      {/* Update gate */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.3 }}>
        <line x1={80} y1={80} x2={110} y2={87} stroke={GRU_C} strokeWidth={0.8} />
        <rect x={110} y={72} width={90} height={28} rx={10}
          fill={GRU_C + '12'} stroke={GRU_C} strokeWidth={1} />
        <text x={155} y={85} textAnchor="middle" fontSize={9} fill={GRU_C} fontWeight={600}>Update (zₜ)</text>
        <text x={155} y={97} textAnchor="middle" fontSize={8} fill={GRU_C}>forget + input 통합</text>
      </motion.g>
      {/* Candidate h_tilde */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.45 }}>
        <line x1={200} y1={44} x2={230} y2={55} stroke={GRU_C} strokeWidth={0.8} />
        <rect x={230} y={40} width={80} height={28} rx={6}
          fill={GRU_C + '08'} stroke={GRU_C} strokeWidth={0.8} />
        <text x={270} y={53} textAnchor="middle" fontSize={8} fill={GRU_C}>h̃ₜ = tanh(W·</text>
        <text x={270} y={64} textAnchor="middle" fontSize={8} fill={GRU_C}>[rₜ⊙hₜ₋₁, xₜ])</text>
      </motion.g>
      {/* Final output */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.6 }}>
        <line x1={200} y1={86} x2={335} y2={86} stroke={GRU_C} strokeWidth={0.8} />
        <line x1={310} y1={54} x2={335} y2={80} stroke={GRU_C} strokeWidth={0.8} />
        <rect x={335} y={65} width={120} height={34} rx={6}
          fill={GRU_C + '18'} stroke={GRU_C} strokeWidth={1.5} />
        <text x={395} y={80} textAnchor="middle" fontSize={9} fill={GRU_C} fontWeight={600}>
          hₜ = (1-zₜ)⊙hₜ₋₁
        </text>
        <text x={395} y={94} textAnchor="middle" fontSize={9} fill={GRU_C} fontWeight={600}>
          + zₜ ⊙ h̃ₜ
        </text>
      </motion.g>
      {/* Note */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
        <rect x={110} y={115} width={260} height={28} rx={4}
          fill={GRU_C + '06'} stroke={GRU_C} strokeWidth={0.5} strokeDasharray="4 3" />
        <text x={240} y={129} textAnchor="middle" fontSize={8} fill={GRU_C}>
          zₜ 높으면 새 정보 | (1-zₜ) 높으면 이전 유지 — 하나로 제어
        </text>
        <text x={240} y={140} textAnchor="middle" fontSize={8} fill="#666">
          셀 상태 별도 없음 → 파라미터 25% 감소, 학습 20% 빠름
        </text>
      </motion.g>
    </g>
  );
}

/* Step 1: Peephole + Coupled */
export function Step1() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={10} fill="#999">
        Peephole: 게이트가 셀 상태도 참조 | Coupled: iₜ = 1 - fₜ
      </text>
      {/* Peephole section */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0 }}>
        <rect x={20} y={28} width={210} height={55} rx={6}
          fill={PEEK_C + '08'} stroke={PEEK_C} strokeWidth={1} />
        <text x={125} y={42} textAnchor="middle" fontSize={9} fill={PEEK_C} fontWeight={600}>
          Peephole (Gers 2002)
        </text>
        {/* Gate with peephole connection */}
        <rect x={35} y={50} width={60} height={24} rx={5}
          fill={PEEK_C + '15'} stroke={PEEK_C} strokeWidth={0.8} />
        <text x={65} y={66} textAnchor="middle" fontSize={8} fill={PEEK_C}>Gate</text>
        <rect x={120} y={50} width={95} height={24} rx={5}
          fill={PEEK_C + '10'} stroke={PEEK_C} strokeWidth={0.8} />
        <text x={167} y={62} textAnchor="middle" fontSize={8} fill={PEEK_C}>
          σ(W·[Cₜ₋₁,h,x]+b)
        </text>
        <text x={167} y={72} textAnchor="middle" fontSize={7} fill={PEEK_C}>↑ Cₜ₋₁ 직접 참조</text>
      </motion.g>
      {/* Coupled section */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.3 }}>
        <rect x={250} y={28} width={210} height={55} rx={6}
          fill="#ef444408" stroke="#ef4444" strokeWidth={1} />
        <text x={355} y={42} textAnchor="middle" fontSize={9} fill="#ef4444" fontWeight={600}>
          Coupled Input/Forget
        </text>
        <rect x={265} y={50} width={50} height={24} rx={5}
          fill="#ef444412" stroke="#ef4444" strokeWidth={0.8} />
        <text x={290} y={66} textAnchor="middle" fontSize={8} fill="#ef4444">fₜ</text>
        <text x={325} y={66} textAnchor="middle" fontSize={10} fill="#888">→</text>
        <rect x={340} y={50} width={105} height={24} rx={5}
          fill="#10b98112" stroke="#10b981" strokeWidth={0.8} />
        <text x={392} y={66} textAnchor="middle" fontSize={8} fill="#10b981">iₜ = 1 - fₜ</text>
      </motion.g>
      {/* Comparison table */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        {/* Headers */}
        <text x={100} y={105} textAnchor="middle" fontSize={8} fill="#888" fontWeight={600}>변형</text>
        <text x={250} y={105} textAnchor="middle" fontSize={8} fill="#888" fontWeight={600}>장점</text>
        <text x={400} y={105} textAnchor="middle" fontSize={8} fill="#888" fontWeight={600}>적용</text>
        <line x1={30} y1={110} x2={450} y2={110} stroke="#88888830" strokeWidth={0.5} />
        {/* Peephole row */}
        <text x={100} y={125} textAnchor="middle" fontSize={8} fill={PEEK_C}>Peephole</text>
        <text x={250} y={125} textAnchor="middle" fontSize={8} fill="#666">타이밍 민감 제어</text>
        <text x={400} y={125} textAnchor="middle" fontSize={8} fill="#666">음성 인식</text>
        {/* Coupled row */}
        <text x={100} y={143} textAnchor="middle" fontSize={8} fill="#ef4444">Coupled</text>
        <text x={250} y={143} textAnchor="middle" fontSize={8} fill="#666">셀 크기 일정 유지</text>
        <text x={400} y={143} textAnchor="middle" fontSize={8} fill="#666">범용 (미미한 차이)</text>
      </motion.g>
    </g>
  );
}

/* Step 2: Bidirectional + Stacked */
export function Step2() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={10} fill="#999">
        구조 확장: Bidirectional (문맥) + Stacked (깊이)
      </text>
      {/* Bidirectional section */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0 }}>
        <rect x={15} y={28} width={220} height={70} rx={6}
          fill={BI_C + '06'} stroke={BI_C} strokeWidth={0.8} />
        <text x={125} y={42} textAnchor="middle" fontSize={9} fill={BI_C} fontWeight={600}>
          Bidirectional LSTM
        </text>
        {/* Forward arrows */}
        {[0, 1, 2, 3].map(i => (
          <motion.g key={`f${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ ...sp, delay: 0.1 + i * 0.08 }}>
            <rect x={30 + i * 50} y={50} width={35} height={16} rx={4}
              fill={BI_C + '15'} stroke={BI_C} strokeWidth={0.6} />
            <text x={47 + i * 50} y={62} textAnchor="middle" fontSize={7} fill={BI_C}>h→</text>
            {i < 3 && <line x1={65 + i * 50} y1={58} x2={80 + i * 50} y2={58}
              stroke={BI_C} strokeWidth={0.6} markerEnd="url(#biArrF)" />}
          </motion.g>
        ))}
        {/* Backward arrows */}
        {[0, 1, 2, 3].map(i => (
          <motion.g key={`b${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ ...sp, delay: 0.4 + i * 0.08 }}>
            <rect x={30 + i * 50} y={74} width={35} height={16} rx={4}
              fill="#8b5cf612" stroke="#8b5cf6" strokeWidth={0.6} />
            <text x={47 + i * 50} y={86} textAnchor="middle" fontSize={7} fill="#8b5cf6">h←</text>
            {i > 0 && <line x1={30 + i * 50} y1={82} x2={65 + (i - 1) * 50} y2={82}
              stroke="#8b5cf6" strokeWidth={0.6} markerEnd="url(#biArrB)" />}
          </motion.g>
        ))}
      </motion.g>
      {/* Stacked section */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
        <rect x={255} y={28} width={210} height={70} rx={6}
          fill="#f5a62308" stroke="#f5a623" strokeWidth={0.8} />
        <text x={360} y={42} textAnchor="middle" fontSize={9} fill="#f5a623" fontWeight={600}>
          Stacked LSTM (2-4 layers)
        </text>
        {/* Layers */}
        {['Layer 1 (로컬)', 'Layer 2 (패턴)', 'Layer 3 (추상)'].map((lbl, i) => (
          <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ ...sp, delay: 0.6 + i * 0.12 }}>
            <rect x={270} y={48 + i * 16} width={180} height={14} rx={3}
              fill={`#f5a623${(10 + i * 8).toString(16)}`}
              stroke="#f5a623" strokeWidth={0.5} />
            <text x={360} y={59 + i * 16} textAnchor="middle" fontSize={8} fill="#f5a623">
              {lbl}
            </text>
          </motion.g>
        ))}
      </motion.g>
      {/* Usage notes */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
        <rect x={30} y={110} width={420} height={38} rx={5}
          fill={BI_C + '06'} stroke={BI_C} strokeWidth={0.5} strokeDasharray="4 3" />
        <text x={240} y={125} textAnchor="middle" fontSize={8} fill={BI_C}>
          Bi-LSTM: 과거+미래 문맥 → NER/POS 태깅 표준 | 파라미터 2배
        </text>
        <text x={240} y={139} textAnchor="middle" fontSize={8} fill="#f5a623">
          Stacked: 2-4 레이어 + dropout 0.2~0.5 | 깊을수록 추상 패턴 학습
        </text>
      </motion.g>
      <defs>
        <marker id="biArrF" markerWidth={5} markerHeight={3} refX={5} refY={1.5} orient="auto">
          <path d="M0,0 L5,1.5 L0,3" fill={BI_C} />
        </marker>
        <marker id="biArrB" markerWidth={5} markerHeight={3} refX={0} refY={1.5} orient="auto">
          <path d="M5,0 L0,1.5 L5,3" fill="#8b5cf6" />
        </marker>
      </defs>
    </g>
  );
}

/* Step 3: Modern successors — Mamba, RWKV, RetNet */
export function Step3() {
  const models = [
    { name: 'Mamba', year: '2023', desc: '선택적 SSM', idea: '입력별 상태 전이 동적 조정', color: MODERN_C },
    { name: 'RWKV', year: '2023', desc: 'RNN+Transformer', idea: '순차 추론 + 병렬 학습', color: '#10b981' },
    { name: 'RetNet', year: '2023', desc: '선형 어텐션', idea: 'O(n) 추론, O(n²) 학습', color: '#f59e0b' },
  ];
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={10} fill="#999">
        LSTM 게이트 아이디어의 현대적 계승
      </text>
      {/* LSTM origin — wide enough to cover all 3 arrows */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0 }}>
        <rect x={60} y={22} width={360} height={28} rx={6}
          fill="#6366f110" stroke="#6366f1" strokeWidth={1.2} />
        <text x={240} y={40} textAnchor="middle" fontSize={10} fill="#6366f1" fontWeight={700}>
          LSTM (1997) — 게이트 메커니즘
        </text>
      </motion.g>
      {/* Arrows down — from LSTM box to each model */}
      {[0, 1, 2].map(i => {
        const cx = 120 + i * 140;
        return (
          <motion.line key={i} x1={cx} y1={50} x2={cx} y2={65}
            stroke="#888" strokeWidth={0.8}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ delay: 0.3 + i * 0.1 }} />
        );
      })}
      {/* Modern models */}
      {models.map((m, i) => {
        const x = 60 + i * 140;
        return (
          <motion.g key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ ...sp, delay: 0.4 + i * 0.15 }}>
            <rect x={x} y={68} width={120} height={50} rx={6}
              fill={m.color + '10'} stroke={m.color} strokeWidth={1} />
            <text x={x + 60} y={82} textAnchor="middle" fontSize={9} fill={m.color} fontWeight={600}>
              {m.name} ({m.year})
            </text>
            <text x={x + 60} y={96} textAnchor="middle" fontSize={8} fill={m.color}>
              {m.desc}
            </text>
            <text x={x + 60} y={110} textAnchor="middle" fontSize={7} fill="#666">
              {m.idea}
            </text>
          </motion.g>
        );
      })}
      {/* Common thread */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
        <rect x={60} y={130} width={360} height={28} rx={5}
          fill={MODERN_C + '06'} stroke={MODERN_C} strokeWidth={0.6} strokeDasharray="4 3" />
        <text x={240} y={143} textAnchor="middle" fontSize={8} fill={MODERN_C} fontWeight={600}>
          공통 핵심: "선택적 기억" — 입력에 따라 정보 보존/삭제를 동적 결정
        </text>
        <text x={240} y={155} textAnchor="middle" fontSize={8} fill="#666">
          LSTM 게이트 → SSM 선택 → 선형 어텐션 — 같은 아이디어의 진화
        </text>
      </motion.g>
    </g>
  );
}
