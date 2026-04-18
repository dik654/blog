import { motion } from 'framer-motion';
import { COLORS } from './ReLUDetailVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

/* ── Step 0: ReLU 정의 + 역사 타임라인 ── */
export function ReLUDefinition() {
  const ox = 120, oy = 85;
  const timeline = [
    { year: '1960s', label: 'Step fn', x: 300, color: COLORS.dim },
    { year: '1980s', label: 'Sigmoid', x: 340, color: COLORS.dim },
    { year: '2010', label: 'ReLU 논문', x: 380, color: COLORS.relu },
    { year: '2012', label: 'AlexNet', x: 420, color: COLORS.relu },
  ];
  return (
    <g>
      {/* ReLU 그래프 */}
      <text x={ox} y={14} textAnchor="middle" fontSize={10}
        fontWeight={700} fill="var(--foreground)">f(x) = max(0, x)</text>

      {/* 축 */}
      <line x1={ox - 90} y1={oy} x2={ox + 90} y2={oy}
        stroke="var(--muted-foreground)" strokeWidth={0.4} />
      <line x1={ox} y1={22} x2={ox} y2={140} stroke="var(--muted-foreground)" strokeWidth={0.4} />
      <text x={ox + 88} y={oy - 4} fontSize={7} fill="var(--muted-foreground)">x</text>
      <text x={ox + 6} y={26} fontSize={7} fill="var(--muted-foreground)">f(x)</text>

      {/* 음수 구간: y=0 */}
      <motion.line x1={ox - 80} y1={oy} x2={ox} y2={oy}
        stroke={COLORS.dim} strokeWidth={2}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ ...sp, delay: 0.1 }} />

      {/* 양수 구간: y=x */}
      <motion.line x1={ox} y1={oy} x2={ox + 70} y2={oy - 70}
        stroke={COLORS.relu} strokeWidth={2}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ ...sp, delay: 0.3 }} />

      <circle cx={ox} cy={oy} r={3} fill={COLORS.relu} />

      {/* 기울기 주석 */}
      <motion.text x={ox - 55} y={oy - 10} fontSize={9} fill={COLORS.dim}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.4 }}>
        f'=0
      </motion.text>
      <motion.text x={ox + 42} y={oy - 48} fontSize={9} fill={COLORS.relu}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.5 }}>
        f'=1
      </motion.text>

      {/* 미분 수식 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.6 }}>
        <text x={ox} y={oy + 28} textAnchor="middle" fontSize={8}
          fill="var(--muted-foreground)">x&gt;0 → 1, x&lt;0 → 0</text>
        <text x={ox} y={oy + 40} textAnchor="middle" fontSize={7}
          fill="var(--muted-foreground)">x=0: 실무에선 0 or 1 선택</text>
      </motion.g>

      {/* 타임라인 */}
      <text x={380} y={14} textAnchor="middle" fontSize={10}
        fontWeight={700} fill="var(--foreground)">활성 함수 역사</text>

      <line x1={280} y1={32} x2={460} y2={32}
        stroke="var(--border)" strokeWidth={1} />

      {timeline.map((t, i) => (
        <motion.g key={i} initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...sp, delay: 0.2 + i * 0.15 }}>
          <circle cx={t.x} cy={32} r={4} fill={t.color} />
          <text x={t.x} y={48} textAnchor="middle" fontSize={8}
            fontWeight={600} fill={t.color}>{t.year}</text>
          <text x={t.x} y={60} textAnchor="middle" fontSize={7.5}
            fill="var(--muted-foreground)">{t.label}</text>
        </motion.g>
      ))}

      {/* 혁명 비교 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.8 }}>
        <rect x={275} y={72} width={85} height={36} rx={5}
          fill="#ef444412" stroke={COLORS.dim} strokeWidth={0.8} />
        <text x={317} y={86} textAnchor="middle" fontSize={8}
          fontWeight={600} fill={COLORS.dim}>Before</text>
        <text x={317} y={98} textAnchor="middle" fontSize={7}
          fill="var(--muted-foreground)">grad&lt;1, exp 연산</text>

        <text x={370} y={90} fontSize={10} fill={COLORS.relu}>→</text>

        <rect x={385} y={72} width={85} height={36} rx={5}
          fill="#ef444418" stroke={COLORS.relu} strokeWidth={1} />
        <text x={427} y={86} textAnchor="middle" fontSize={8}
          fontWeight={600} fill={COLORS.relu}>After (ReLU)</text>
        <text x={427} y={98} textAnchor="middle" fontSize={7}
          fill="var(--muted-foreground)">grad=1, max 비교</text>
      </motion.g>

      {/* AlexNet 결과 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 1 }}>
        <rect x={285} y={118} width={176} height={28} rx={5}
          fill="#8b5cf612" stroke="#8b5cf6" strokeWidth={0.8} />
        <text x={373} y={136} textAnchor="middle" fontSize={8}
          fontWeight={600} fill="#8b5cf6">
          AlexNet: 학습 6x 빠름, error 16.4→15.3%
        </text>
      </motion.g>
    </g>
  );
}

/* ── Step 1: 5가지 장점 ── */
export function ReLUAdvantages() {
  const advantages = [
    { title: '연산 효율', detail: 'max(0,x) = 1 instr', detail2: 'sigmoid ~10 instr', icon: '⚡', x: 15, y: 20 },
    { title: 'Gradient 보존', detail: "f'(x)=1 (x>0)", detail2: '깊은 층에서도 유지', icon: '↑', x: 170, y: 20 },
    { title: 'Sparse 활성화', detail: '~50% 뉴런 = 0', detail2: '효율적 표현', icon: '◇', x: 325, y: 20 },
    { title: '생물학적 유사', detail: 'threshold firing', detail2: 'sigmoid보다 현실적', icon: '◉', x: 85, y: 88 },
    { title: 'No Saturation', detail: '큰 x → 큰 출력', detail2: 'gradient 항상 전파', icon: '∞', x: 250, y: 88 },
  ];
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={10}
        fontWeight={700} fill="var(--foreground)">ReLU 5가지 장점</text>

      {advantages.map((a, i) => (
        <motion.g key={i} initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...sp, delay: i * 0.1 }}>
          <rect x={a.x} y={a.y} width={140} height={55} rx={7}
            fill="#10b98110" stroke={COLORS.advantage} strokeWidth={0.8} />

          {/* 아이콘 원 */}
          <circle cx={a.x + 18} cy={a.y + 20} r={10}
            fill={COLORS.advantage} fillOpacity={0.15} />
          <text x={a.x + 18} y={a.y + 24} textAnchor="middle" fontSize={10}
            fill={COLORS.advantage}>{a.icon}</text>

          {/* 제목 */}
          <text x={a.x + 38} y={a.y + 18} fontSize={9}
            fontWeight={700} fill="var(--foreground)">{a.title}</text>

          {/* 설명 */}
          <text x={a.x + 38} y={a.y + 32} fontSize={7.5}
            fill="var(--muted-foreground)">{a.detail}</text>
          <text x={a.x + 38} y={a.y + 43} fontSize={7.5}
            fill="var(--muted-foreground)">{a.detail2}</text>
        </motion.g>
      ))}
    </g>
  );
}

/* ── Step 2: Dying ReLU 요약 ── */
export function DyingReLUBrief() {
  const cycle = [
    { label: 'W < 0', sub: '가중치 음수' },
    { label: 'input < 0', sub: 'W·x + b 음수' },
    { label: 'output = 0', sub: 'ReLU → 0' },
    { label: 'grad = 0', sub: '미분 = 0' },
    { label: 'dead', sub: '영구 사망' },
  ];
  const startX = 18, gap = 92, cy = 60;
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={10}
        fontWeight={700} fill="var(--foreground)">Dying ReLU — 죽음의 사이클</text>

      <defs>
        <marker id="rd-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L5,3 L0,6" fill={COLORS.dying} />
        </marker>
      </defs>

      {cycle.map((c, i) => {
        const cx_ = startX + i * gap + 30;
        const isDead = i === 4;
        const col = isDead ? COLORS.relu : COLORS.dying;
        return (
          <motion.g key={i} initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...sp, delay: i * 0.12 }}>
            {/* 박스 */}
            <rect x={cx_ - 30} y={cy - 18} width={60} height={36} rx={6}
              fill={`${col}15`} stroke={col} strokeWidth={isDead ? 1.5 : 0.8} />
            <text x={cx_} y={cy - 2} textAnchor="middle" fontSize={8}
              fontWeight={700} fill={col}>{c.label}</text>
            <text x={cx_} y={cy + 10} textAnchor="middle" fontSize={7}
              fill="var(--muted-foreground)">{c.sub}</text>

            {/* 화살표 */}
            {i < 4 && (
              <line x1={cx_ + 32} y1={cy} x2={cx_ + gap - 32} y2={cy}
                stroke={COLORS.dying} strokeWidth={1} markerEnd="url(#rd-arr)" />
            )}
          </motion.g>
        );
      })}

      {/* 루프백 화살표 (dead→W<0) */}
      <motion.path
        d={`M ${startX + 4 * gap + 30} ${cy + 20} Q ${240} ${cy + 50} ${startX + 30} ${cy + 20}`}
        stroke={COLORS.relu} strokeWidth={0.8} fill="none"
        strokeDasharray="3 3"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ ...sp, delay: 0.7 }} />
      <motion.text x={240} y={cy + 50} textAnchor="middle" fontSize={7}
        fill={COLORS.relu}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.9 }}>
        갱신 불가 → 영구 사이클
      </motion.text>

      {/* 방지책 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 1 }}>
        <rect x={90} y={118} width={300} height={28} rx={6}
          fill="#10b98110" stroke={COLORS.advantage} strokeWidth={0.8} />
        <text x={240} y={136} textAnchor="middle" fontSize={8}
          fontWeight={600} fill={COLORS.advantage}>
          방지: He init · LeakyReLU · 낮은 lr · BatchNorm · Gradient clipping
        </text>
      </motion.g>
    </g>
  );
}

/* ── Step 3: PyTorch & He Init ── */
export function PyTorchCode() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={10}
        fontWeight={700} fill="var(--foreground)">PyTorch ReLU & He 초기화</text>

      {/* F.relu 박스 */}
      <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.1 }}>
        <rect x={15} y={24} width={140} height={56} rx={7}
          fill="#8b5cf610" stroke={COLORS.code} strokeWidth={0.8} />
        <rect x={15} y={24} width={140} height={4} rx={2} fill={COLORS.code} opacity={0.6} />
        <text x={85} y={42} textAnchor="middle" fontSize={9}
          fontWeight={700} fill={COLORS.code}>F.relu(x)</text>
        <text x={85} y={55} textAnchor="middle" fontSize={7.5}
          fill="var(--muted-foreground)">함수형 호출</text>
        <text x={85} y={66} textAnchor="middle" fontSize={7.5}
          fill="var(--muted-foreground)">torch.nn.functional</text>
      </motion.g>

      {/* nn.ReLU 박스 */}
      <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.25 }}>
        <rect x={170} y={24} width={140} height={56} rx={7}
          fill="#8b5cf610" stroke={COLORS.code} strokeWidth={0.8} />
        <rect x={170} y={24} width={140} height={4} rx={2} fill={COLORS.code} opacity={0.6} />
        <text x={240} y={42} textAnchor="middle" fontSize={9}
          fontWeight={700} fill={COLORS.code}>nn.ReLU()</text>
        <text x={240} y={55} textAnchor="middle" fontSize={7.5}
          fill="var(--muted-foreground)">모듈형 (Sequential 가능)</text>
        <text x={240} y={66} textAnchor="middle" fontSize={7.5}
          fill="var(--muted-foreground)">inplace=True → 메모리 절약</text>
      </motion.g>

      {/* CNN 패턴 */}
      <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.4 }}>
        <rect x={325} y={24} width={140} height={56} rx={7}
          fill="#8b5cf610" stroke={COLORS.code} strokeWidth={0.8} />
        <rect x={325} y={24} width={140} height={4} rx={2} fill={COLORS.code} opacity={0.6} />
        <text x={395} y={42} textAnchor="middle" fontSize={9}
          fontWeight={700} fill={COLORS.code}>Conv → ReLU</text>
        <text x={395} y={55} textAnchor="middle" fontSize={7.5}
          fill="var(--muted-foreground)">F.relu(conv(x))</text>
        <text x={395} y={66} textAnchor="middle" fontSize={7.5}
          fill="var(--muted-foreground)">CNN 기본 패턴</text>
      </motion.g>

      {/* He 초기화 */}
      <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.6 }}>
        <rect x={40} y={92} width={400} height={52} rx={8}
          fill="#ef444410" stroke={COLORS.relu} strokeWidth={1} />

        <text x={240} y={110} textAnchor="middle" fontSize={9}
          fontWeight={700} fill={COLORS.relu}>He 초기화 (Kaiming, 2015)</text>

        {/* 수식 */}
        <text x={120} y={128} textAnchor="middle" fontSize={9}
          fontWeight={600} fill="var(--foreground)">W ~ N(0, √(2/n_in))</text>

        {/* 설명 */}
        <text x={340} y={128} textAnchor="middle" fontSize={8}
          fill="var(--muted-foreground)">
          ReLU가 음수 절반 소실 → 분산 ×2 보상
        </text>
      </motion.g>
    </g>
  );
}
