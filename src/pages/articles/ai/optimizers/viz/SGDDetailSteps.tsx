import { motion } from 'framer-motion';
import { COLORS } from './SGDDetailVizData';
import { AlertBox, DataBox, ModuleBox, ActionBox, StatusBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

/* ── Step 0: 업데이트 규칙 ── */
export function StepUpdateRule() {
  /* Batch GD vs SGD vs Mini-batch 비교를 화살표 흐름으로 */
  const methods = [
    { label: 'Batch GD', sub: '전체 N개', x: 20, color: COLORS.dim },
    { label: 'SGD', sub: '1개 xᵢ', x: 180, color: COLORS.sgd },
    { label: 'Mini-batch', sub: 'B개', x: 340, color: '#8b5cf6' },
  ];
  return (
    <g>
      {/* 수식 상단 */}
      <motion.text x={240} y={22} textAnchor="middle" fontSize={12} fontWeight={700}
        fill={COLORS.sgd} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
        {'θ'}
        <tspan fontSize={8} dy={3}>t+1</tspan>
        <tspan dy={-3}>{' = θ'}</tspan>
        <tspan fontSize={8} dy={3}>t</tspan>
        <tspan dy={-3}>{' - η · ∇L(θ; x'}</tspan>
        <tspan fontSize={8} dy={3}>i</tspan>
        <tspan dy={-3}>{')'}</tspan>
      </motion.text>

      {/* 세 방식 비교 */}
      {methods.map((m, i) => (
        <motion.g key={i} initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.15 + i * 0.12 }}>
          <ModuleBox x={m.x} y={42} w={120} h={40} label={m.label} sub={m.sub} color={m.color} />
        </motion.g>
      ))}

      {/* 화살표: 모두 → θ 업데이트 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.55 }}>
        <defs>
          <marker id="sgd-arr" markerWidth={5} markerHeight={5} refX={4} refY={2.5} orient="auto">
            <path d="M0,0 L5,2.5 L0,5" fill={COLORS.dim} />
          </marker>
        </defs>
        {methods.map((m, i) => (
          <line key={i} x1={m.x + 60} y1={82} x2={m.x + 60} y2={100}
            stroke={m.color} strokeWidth={1} markerEnd="url(#sgd-arr)" opacity={0.7} />
        ))}
      </motion.g>

      {/* θ 업데이트 결과 행 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.65 }}>
        <DataBox x={50} y={104} w={100} h={28} label="느리지만 정확" color={COLORS.dim} />
        <DataBox x={190} y={104} w={100} h={28} label="빠르지만 노이즈" color={COLORS.sgd} />
        <DataBox x={340} y={104} w={110} h={28} label="균형 (실무 표준)" color="#8b5cf6" />
      </motion.g>

      {/* SGD 강조 표시 */}
      <motion.rect x={176} y={38} width={130} height={100} rx={10}
        fill="none" stroke={COLORS.sgd} strokeWidth={1.2} strokeDasharray="4 3" opacity={0.4}
        initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} transition={{ ...sp, delay: 0.8 }} />
    </g>
  );
}

/* ── Step 1: 4가지 문제 ── */
export function StepFourProblems() {
  const problems = [
    { label: '진동', sub: '지그재그', x: 10, y: 10 },
    { label: '안장점', sub: '∇L≈0 정체', x: 130, y: 10 },
    { label: '지역 최솟값', sub: '차선 갇힘', x: 250, y: 10 },
    { label: 'Ill-cond.', sub: '스케일 상이', x: 370, y: 10 },
  ];
  /* 각 문제를 미니 등고선/곡선으로 시각화 */
  return (
    <g>
      {/* 4개 AlertBox */}
      {problems.map((p, i) => (
        <motion.g key={i} initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: i * 0.12 }}>
          <AlertBox x={p.x} y={p.y} w={100} h={38} label={p.label} sub={p.sub} color={COLORS.problem} />
        </motion.g>
      ))}

      {/* ── 미니 그림 영역 (y=55~145) ── */}

      {/* 1) 진동: 지그재그 선 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
        <ellipse cx={60} cy={110} rx={44} ry={28} fill="none" stroke={COLORS.dim} strokeWidth={0.5} opacity={0.3} />
        <ellipse cx={60} cy={110} rx={26} ry={14} fill="none" stroke={COLORS.dim} strokeWidth={0.5} opacity={0.4} />
        <motion.polyline points="20,70 50,140 55,75 65,135 60,95 62,115 60,110"
          fill="none" stroke={COLORS.problem} strokeWidth={1.2} opacity={0.8}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.6 }} />
        <text x={60} y={148} textAnchor="middle" fontSize={7.5} fill={COLORS.dim}>좁은 골짜기</text>
      </motion.g>

      {/* 2) 안장점: 평탄 영역에서 정체 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.65 }}>
        <path d="M135,125 Q180,70 225,125" fill="none" stroke={COLORS.dim} strokeWidth={0.7} opacity={0.4} />
        <path d="M155,90 Q180,130 205,90" fill="none" stroke={COLORS.dim} strokeWidth={0.7} opacity={0.4} />
        <circle cx={180} cy={100} r={3} fill={COLORS.problem} opacity={0.9} />
        <text x={180} y={90} textAnchor="middle" fontSize={7.5} fill={COLORS.problem} fontWeight={600}>STOP</text>
        <text x={180} y={148} textAnchor="middle" fontSize={7.5} fill={COLORS.dim}>∇L ≈ 0</text>
      </motion.g>

      {/* 3) 지역 최솟값: 두 개 골짜기 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.8 }}>
        <path d="M255,80 Q275,120 295,80 Q315,55 335,80 Q355,120 375,80"
          fill="none" stroke={COLORS.dim} strokeWidth={0.8} opacity={0.5} />
        <circle cx={275} cy={112} r={3} fill={COLORS.problem} />
        <circle cx={335} cy={68} r={3} fill={COLORS.schedule} />
        <text x={275} y={128} textAnchor="middle" fontSize={7} fill={COLORS.problem}>local</text>
        <text x={335} y={60} textAnchor="middle" fontSize={7} fill={COLORS.schedule}>global</text>
        <text x={300} y={148} textAnchor="middle" fontSize={7.5} fill={COLORS.dim}>차선에 갇힘</text>
      </motion.g>

      {/* 4) Ill-conditioning: 서로 다른 막대 높이 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.95 }}>
        <rect x={390} y={68} width={14} height={70} rx={2} fill={COLORS.problem} opacity={0.4} />
        <rect x={412} y={118} width={14} height={20} rx={2} fill={COLORS.sgd} opacity={0.4} />
        <rect x={434} y={88} width={14} height={50} rx={2} fill={COLORS.problem} opacity={0.4} />
        <text x={390} y={64} fontSize={7} fill={COLORS.problem}>η 큼</text>
        <text x={434} y={84} fontSize={7} fill={COLORS.problem}>η 큼</text>
        <text x={412} y={114} fontSize={7} fill={COLORS.sgd}>η 작음</text>
        <text x={420} y={148} textAnchor="middle" fontSize={7.5} fill={COLORS.dim}>동일 η 비효율</text>
      </motion.g>
    </g>
  );
}

/* ── Step 2: LR 스케줄 ── */
export function StepLRSchedules() {
  const W = 130, H = 60;
  /* 3가지 스케줄 곡선: step, cosine, warmup+cosine */
  const schedules = [
    { label: 'Step Decay', x: 15, points: 'M0,5 L40,5 L40,25 L80,25 L80,45 L120,45' },
    { label: 'Cosine Annealing', x: 170, points: '' }, // cosine path 계산
    { label: 'Warmup + Cosine', x: 325, points: '' },
  ];

  /* cosine curve: η_t = η₀ · 0.5(1+cos(πt/T)) */
  const cosPoints: string[] = [];
  const warmupCosPoints: string[] = [];
  for (let t = 0; t <= 120; t += 3) {
    const frac = t / 120;
    const cosY = 5 + 40 * (1 - 0.5 * (1 + Math.cos(Math.PI * frac)));
    cosPoints.push(`${t === 0 ? 'M' : 'L'}${t},${cosY}`);

    /* warmup: 처음 20%는 선형 증가, 이후 cosine */
    let wY: number;
    if (frac < 0.2) {
      wY = 45 - (40 * frac / 0.2); // 선형 증가 (y 작을수록 η 큼)
    } else {
      const cosFrac = (frac - 0.2) / 0.8;
      wY = 5 + 40 * (1 - 0.5 * (1 + Math.cos(Math.PI * cosFrac)));
    }
    warmupCosPoints.push(`${t === 0 ? 'M' : 'L'}${t},${wY}`);
  }

  return (
    <g>
      {/* 3개 미니 차트 */}
      {schedules.map((s, i) => (
        <motion.g key={i} transform={`translate(${s.x}, 10)`}
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          transition={{ ...sp, delay: i * 0.15 }}>
          {/* 배경 + 축 */}
          <rect x={0} y={0} width={W} height={H + 18} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
          <text x={W / 2} y={H + 14} textAnchor="middle" fontSize={8} fontWeight={600} fill={COLORS.schedule}>{s.label}</text>
          {/* Y축 레이블 */}
          <text x={4} y={10} fontSize={7} fill={COLORS.dim}>η</text>
          <text x={4} y={H - 2} fontSize={7} fill={COLORS.dim}>0</text>
          {/* X축 */}
          <line x1={5} y1={H - 5} x2={W - 5} y2={H - 5} stroke={COLORS.dim} strokeWidth={0.4} opacity={0.5} />
          {/* 곡선 */}
          <g transform={`translate(5, ${H - 55})`}>
            <motion.path
              d={i === 0 ? schedules[0].points : i === 1 ? cosPoints.join(' ') : warmupCosPoints.join(' ')}
              fill="none" stroke={COLORS.schedule} strokeWidth={1.5}
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 0.3 + i * 0.15 }} />
          </g>
        </motion.g>
      ))}

      {/* 하단 요약 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.9 }} transition={{ ...sp, delay: 0.8 }}>
        <ActionBox x={15} y={100} w={140} h={44} label="Transformer 표준" sub="warmup + cosine" color={COLORS.schedule} />
        <ActionBox x={170} y={100} w={140} h={44} label="CNN 표준" sub="cosine annealing" color={COLORS.sgd} />
        <ActionBox x={325} y={100} w={140} h={44} label="기본 비교선" sub="step decay (레거시)" color={COLORS.dim} />
      </motion.g>
    </g>
  );
}

/* ── Step 3: 장단점 + 사용 시점 ── */
export function StepProsConsUsage() {
  const pros = ['간단·저메모리', '이론적 수렴 보장', '일반화 성능 우수'];
  const cons = ['느린 수렴', 'LR 민감', '적응적 조절 없음'];
  const usage = ['CNN + momentum', 'cosine schedule 조합', '최종 fine-tuning'];

  return (
    <g>
      {/* 세 열: 장점 / 단점 / 사용 시점 */}
      {/* 헤더 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
        <StatusBox x={10} y={5} w={140} h={36} label="장점" color={COLORS.schedule} progress={1} />
        <StatusBox x={170} y={5} w={140} h={36} label="단점" color={COLORS.problem} progress={0.5} />
        <StatusBox x={330} y={5} w={140} h={36} label="사용 시점" color={COLORS.sgd} progress={0.8} />
      </motion.g>

      {/* 장점 항목 */}
      {pros.map((p, i) => (
        <motion.g key={`p${i}`} initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }} transition={{ ...sp, delay: 0.2 + i * 0.1 }}>
          <rect x={14} y={50 + i * 32} width={132} height={26} rx={13}
            fill={`${COLORS.schedule}12`} stroke={COLORS.schedule} strokeWidth={0.7} />
          <text x={80} y={50 + i * 32 + 17} textAnchor="middle" fontSize={9} fontWeight={500}
            fill={COLORS.schedule}>{p}</text>
        </motion.g>
      ))}

      {/* 단점 항목 */}
      {cons.map((c, i) => (
        <motion.g key={`c${i}`} initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }} transition={{ ...sp, delay: 0.3 + i * 0.1 }}>
          <rect x={174} y={50 + i * 32} width={132} height={26} rx={13}
            fill={`${COLORS.problem}12`} stroke={COLORS.problem} strokeWidth={0.7} />
          <text x={240} y={50 + i * 32 + 17} textAnchor="middle" fontSize={9} fontWeight={500}
            fill={COLORS.problem}>{c}</text>
        </motion.g>
      ))}

      {/* 사용 시점 항목 */}
      {usage.map((u, i) => (
        <motion.g key={`u${i}`} initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }} transition={{ ...sp, delay: 0.4 + i * 0.1 }}>
          <rect x={334} y={50 + i * 32} width={132} height={26} rx={13}
            fill={`${COLORS.sgd}12`} stroke={COLORS.sgd} strokeWidth={0.7} />
          <text x={400} y={50 + i * 32 + 17} textAnchor="middle" fontSize={9} fontWeight={500}
            fill={COLORS.sgd}>{u}</text>
        </motion.g>
      ))}
    </g>
  );
}
