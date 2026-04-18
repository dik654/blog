import { motion } from 'framer-motion';
import { C } from './SupervisedVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

/* Step 0: SupCon vs SimCLR positive 선택 차이 */
export function Step0() {
  return (
    <g>
      {/* SimCLR 영역 */}
      <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
        <rect x={20} y={15} width={200} height={170} rx={10} fill={`${C.self}05`} stroke={C.self} strokeWidth={1} />
        <text x={120} y={35} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.self}>SimCLR</text>

        {/* Anchor */}
        <circle cx={80} cy={85} r={14} fill={`${C.self}20`} stroke={C.self} strokeWidth={1.5} />
        <text x={80} y={82} textAnchor="middle" fontSize={8} fontWeight={700} fill={C.self}>x</text>
        <text x={80} y={94} textAnchor="middle" fontSize={7} fill={C.muted}>anchor</text>

        {/* 1개 positive */}
        <motion.circle cx={140} cy={65} r={12} fill={`${C.pos}20`} stroke={C.pos} strokeWidth={1.2}
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ ...sp, delay: 0.2 }} />
        <text x={140} y={69} textAnchor="middle" fontSize={7} fontWeight={600} fill={C.pos}>aug</text>

        <line x1={93} y1={80} x2={128} y2={69} stroke={C.pos} strokeWidth={1} strokeDasharray="3 2" />

        {/* Negative들 */}
        {[{ cx: 130, cy: 120 }, { cx: 160, cy: 105 }, { cx: 170, cy: 135 }].map((n, i) => (
          <motion.circle key={i} cx={n.cx} cy={n.cy} r={8} fill={`${C.neg}15`} stroke={C.neg} strokeWidth={0.8}
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ ...sp, delay: 0.3 + i * 0.05 }} />
        ))}
        <text x={120} y={160} textAnchor="middle" fontSize={8} fill={C.muted}>positive = 1쌍</text>
      </motion.g>

      {/* vs */}
      <motion.text x={240} y={100} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.muted}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.3 }}>vs</motion.text>

      {/* SupCon 영역 */}
      <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ ...sp, delay: 0.15 }}>
        <rect x={260} y={15} width={200} height={170} rx={10} fill={`${C.sup}05`} stroke={C.sup} strokeWidth={1} />
        <text x={360} y={35} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.sup}>SupCon</text>

        {/* Anchor */}
        <circle cx={310} cy={85} r={14} fill={`${C.sup}20`} stroke={C.sup} strokeWidth={1.5} />
        <text x={310} y={82} textAnchor="middle" fontSize={8} fontWeight={700} fill={C.sup}>x</text>
        <text x={310} y={94} textAnchor="middle" fontSize={7} fill={C.muted}>anchor</text>

        {/* 여러 positive (같은 클래스) */}
        {[{ cx: 360, cy: 60 }, { cx: 380, cy: 85 }, { cx: 355, cy: 110 }].map((p, i) => (
          <motion.g key={i}>
            <motion.circle cx={p.cx} cy={p.cy} r={12} fill={`${C.pos}20`} stroke={C.pos} strokeWidth={1.2}
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ ...sp, delay: 0.25 + i * 0.08 }} />
            <text x={p.cx} y={p.cy + 4} textAnchor="middle" fontSize={7} fontWeight={600} fill={C.pos}>same</text>
            <line x1={323} y1={85} x2={p.cx - 10} y2={p.cy}
              stroke={C.pos} strokeWidth={0.8} strokeDasharray="3 2" />
          </motion.g>
        ))}

        {/* Negative */}
        <motion.circle cx={420} cy={130} r={8} fill={`${C.neg}15`} stroke={C.neg} strokeWidth={0.8}
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ ...sp, delay: 0.5 }} />

        <text x={360} y={160} textAnchor="middle" fontSize={8} fill={C.sup}>positive = 같은 클래스 전부</text>
      </motion.g>
    </g>
  );
}

/* Step 1: SupCon Loss 수식 시각화 */
export function Step1() {
  return (
    <g>
      {/* 수식 박스 */}
      <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
        <rect x={30} y={15} width={420} height={42} rx={8} fill={`${C.sup}08`} stroke={C.sup} strokeWidth={1} />
        <text x={240} y={33} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.sup}>
          L_i = -1/|P(i)| · Σ log( exp(sim(z_i, z_p)/τ) / Σ exp(sim(z_i, z_k)/τ) )
        </text>
        <text x={240} y={50} textAnchor="middle" fontSize={8} fill={C.muted}>
          P(i) = 같은 클래스 집합, 분모 = i 제외 전체
        </text>
      </motion.g>

      {/* 시각적 설명: anchor와 3개 positive */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.2 }}>
        {/* Anchor */}
        <circle cx={100} cy={110} r={18} fill={`${C.sup}20`} stroke={C.sup} strokeWidth={1.5} />
        <text x={100} y={107} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.sup}>z_i</text>
        <text x={100} y={120} textAnchor="middle" fontSize={7} fill={C.muted}>anchor</text>
      </motion.g>

      {/* Positive들: 각각 개별 log */}
      {[
        { cx: 200, cy: 80, label: 'z_p1', delay: 0.3 },
        { cx: 220, cy: 115, label: 'z_p2', delay: 0.4 },
        { cx: 195, cy: 145, label: 'z_p3', delay: 0.5 },
      ].map((p, i) => (
        <motion.g key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ ...sp, delay: p.delay }}>
          <circle cx={p.cx} cy={p.cy} r={14} fill={`${C.pos}20`} stroke={C.pos} strokeWidth={1} />
          <text x={p.cx} y={p.cy + 4} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.pos}>{p.label}</text>
          <line x1={118} y1={110} x2={p.cx - 14} y2={p.cy}
            stroke={C.pos} strokeWidth={0.8} />
        </motion.g>
      ))}

      {/* 개별 log 설명 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.6 }}>
        <rect x={280} y={70} width={175} height={85} rx={8} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={368} y={88} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.sup}>각 positive마다 개별 log</text>
        <text x={368} y={104} textAnchor="middle" fontSize={8} fill={C.pos}>log(sim(z_i, z_p1) / Σ)</text>
        <text x={368} y={118} textAnchor="middle" fontSize={8} fill={C.pos}>log(sim(z_i, z_p2) / Σ)</text>
        <text x={368} y={132} textAnchor="middle" fontSize={8} fill={C.pos}>log(sim(z_i, z_p3) / Σ)</text>
        <text x={368} y={148} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.muted}>→ 평균으로 합산</text>
      </motion.g>

      <motion.text x={240} y={185} textAnchor="middle" fontSize={8} fill={C.muted}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.7 }}>
        모든 positive를 균등하게 당김 → 클래스 내 분산 최소화
      </motion.text>
    </g>
  );
}

/* Step 2: CE vs SupCon 노이즈 강건성 */
export function Step2() {
  const bars = [
    { noise: '0%', ce: 95.0, sc: 96.0 },
    { noise: '20%', ce: 87.0, sc: 93.5 },
    { noise: '40%', ce: 72.0, sc: 88.0 },
  ];

  return (
    <g>
      <motion.text x={240} y={20} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.muted}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
        CIFAR-10 정확도 — 라벨 노이즈 비율별
      </motion.text>

      {/* 범례 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.1 }}>
        <rect x={330} y={28} width={12} height={10} rx={2} fill={`${C.ce}40`} />
        <text x={348} y={37} fontSize={8} fill={C.ce}>CrossEntropy</text>
        <rect x={330} y={42} width={12} height={10} rx={2} fill={`${C.sup}40`} />
        <text x={348} y={51} fontSize={8} fill={C.sup}>SupCon</text>
      </motion.g>

      {bars.map((b, i) => {
        const y = 60 + i * 52;
        const ceW = (b.ce / 100) * 280;
        const scW = (b.sc / 100) * 280;
        return (
          <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ ...sp, delay: 0.2 + i * 0.15 }}>
            {/* 노이즈 라벨 */}
            <text x={65} y={y + 14} textAnchor="end" fontSize={9} fontWeight={600} fill={C.muted}>noise {b.noise}</text>

            {/* CE 바 */}
            <motion.rect x={75} y={y} rx={3} height={14} fill={`${C.ce}25`} stroke={C.ce} strokeWidth={0.6}
              initial={{ width: 0 }} animate={{ width: ceW }} transition={{ ...sp, delay: 0.3 + i * 0.15 }} />
            <motion.text x={80 + ceW} y={y + 11} fontSize={8} fontWeight={600} fill={C.ce}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 + i * 0.15 }}>
              {b.ce}%
            </motion.text>

            {/* SupCon 바 */}
            <motion.rect x={75} y={y + 18} rx={3} height={14} fill={`${C.sup}25`} stroke={C.sup} strokeWidth={0.6}
              initial={{ width: 0 }} animate={{ width: scW }} transition={{ ...sp, delay: 0.35 + i * 0.15 }} />
            <motion.text x={80 + scW} y={y + 29} fontSize={8} fontWeight={600} fill={C.sup}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.55 + i * 0.15 }}>
              {b.sc}%
            </motion.text>

            {/* 차이 표시 */}
            {b.noise !== '0%' && (
              <motion.text x={430} y={y + 20} textAnchor="middle" fontSize={8} fontWeight={700} fill={C.sup}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.6 + i * 0.15 }}>
                +{(b.sc - b.ce).toFixed(0)}%
              </motion.text>
            )}
          </motion.g>
        );
      })}
    </g>
  );
}

/* Step 3: 2단계 파이프라인 */
export function Step3() {
  return (
    <g>
      {/* Stage 1 */}
      <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
        <rect x={20} y={20} width={210} height={130} rx={10} fill={`${C.sup}06`} stroke={C.sup} strokeWidth={1} />
        <rect x={20} y={20} width={210} height={5} rx={2.5} fill={C.sup} opacity={0.7} />
        <text x={125} y={40} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.sup}>Stage 1: SupCon 학습</text>

        {/* 파이프라인 */}
        <rect x={35} y={55} width={55} height={25} rx={5} fill={`${C.enc}12`} stroke={C.enc} strokeWidth={0.8} />
        <text x={62} y={71} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.enc}>ResNet</text>

        <line x1={90} y1={68} x2={105} y2={68} stroke={C.muted} strokeWidth={0.8} markerEnd="url(#sc-sv-arr)" />

        <rect x={108} y={55} width={45} height={25} rx={5} fill={`${C.sup}12`} stroke={C.sup} strokeWidth={0.8} />
        <text x={130} y={68} textAnchor="middle" fontSize={7} fontWeight={600} fill={C.sup}>Proj</text>
        <text x={130} y={77} textAnchor="middle" fontSize={7} fill={C.muted}>Head</text>

        <line x1={153} y1={68} x2={168} y2={68} stroke={C.muted} strokeWidth={0.8} markerEnd="url(#sc-sv-arr)" />

        <rect x={170} y={55} width={50} height={25} rx={5} fill={`${C.sup}18`} stroke={C.sup} strokeWidth={1} />
        <text x={195} y={71} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.sup}>SupCon</text>

        <text x={125} y={105} textAnchor="middle" fontSize={8} fill={C.muted}>표현(representation) 최적화</text>
        <text x={125} y={120} textAnchor="middle" fontSize={8} fill={C.sup}>인코더 + projection head 학습</text>
        <text x={125} y={135} textAnchor="middle" fontSize={7} fill={C.muted}>τ=0.07~0.1, balanced sampling</text>
      </motion.g>

      {/* Arrow */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.3 }}>
        <line x1={235} y1={85} x2={255} y2={85} stroke={C.muted} strokeWidth={1.2} markerEnd="url(#sc-sv-arr)" />
      </motion.g>

      {/* Stage 2 */}
      <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ ...sp, delay: 0.2 }}>
        <rect x={260} y={20} width={200} height={130} rx={10} fill={`${C.enc}06`} stroke={C.enc} strokeWidth={1} />
        <rect x={260} y={20} width={200} height={5} rx={2.5} fill={C.enc} opacity={0.7} />
        <text x={360} y={40} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.enc}>Stage 2: Linear Eval</text>

        <rect x={275} y={55} width={55} height={25} rx={5} fill={`${C.enc}12`} stroke={C.enc} strokeWidth={0.8} />
        <text x={302} y={68} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.enc}>ResNet</text>
        <text x={302} y={77} textAnchor="middle" fontSize={6} fill={C.muted}>frozen</text>

        <line x1={330} y1={68} x2={348} y2={68} stroke={C.muted} strokeWidth={0.8} markerEnd="url(#sc-sv-arr)" />

        <rect x={350} y={55} width={55} height={25} rx={5} fill={`${C.pos}12`} stroke={C.pos} strokeWidth={0.8} />
        <text x={377} y={68} textAnchor="middle" fontSize={7} fontWeight={600} fill={C.pos}>Linear</text>
        <text x={377} y={77} textAnchor="middle" fontSize={7} fill={C.muted}>Head</text>

        <line x1={405} y1={68} x2={418} y2={68} stroke={C.muted} strokeWidth={0.8} markerEnd="url(#sc-sv-arr)" />

        <rect x={420} y={55} width={30} height={25} rx={5} fill={`${C.ce}12`} stroke={C.ce} strokeWidth={0.8} />
        <text x={435} y={71} textAnchor="middle" fontSize={7} fontWeight={600} fill={C.ce}>CE</text>

        <text x={360} y={105} textAnchor="middle" fontSize={8} fill={C.muted}>분류(classification) 학습</text>
        <text x={360} y={120} textAnchor="middle" fontSize={8} fill={C.enc}>projection head 제거</text>
        <text x={360} y={135} textAnchor="middle" fontSize={7} fill={C.muted}>인코더 고정, linear만 학습</text>
      </motion.g>

      {/* 결과 */}
      <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.5 }}>
        <rect x={100} y={165} width={280} height={25} rx={6} fill={`${C.pos}08`} stroke={C.pos} strokeWidth={0.8} />
        <text x={240} y={182} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.pos}>
          표현 + 분류 분리 → 범용 표현 유지 + task 최적화
        </text>
      </motion.g>

      <defs>
        <marker id="sc-sv-arr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
          <path d="M0,0 L5,2.5 L0,5 Z" fill={C.muted} />
        </marker>
      </defs>
    </g>
  );
}
