import { motion } from 'framer-motion';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, damping: 20, stiffness: 200 };

/* ── Step 0: KL Divergence 정의 ── */
export function StepDefinition() {
  return (
    <g>
      {/* 수식 타이틀 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
        <rect x={60} y={4} width={360} height={28} rx={6}
          fill="#10b98115" stroke="#10b981" strokeWidth={1.2} />
        <text x={240} y={22} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">
          D_KL(P‖Q) = Σ P(x) log(P(x)/Q(x)) = H(P,Q) - H(P)
        </text>
      </motion.g>

      {/* 분해 다이어그램: CE → Entropy + KL */}
      <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.15 }}>
        <ModuleBox x={10} y={42} w={110} h={40} label="CE(P,Q)" sub="교차 엔트로피" color="#ef4444" />
        <text x={135} y={66} fontSize={14} fontWeight={700} fill="var(--foreground)">=</text>
        <DataBox x={150} y={46} w={95} h={32} label="H(P)" sub="자체 엔트로피" color="#3b82f6" />
        <text x={258} y={66} fontSize={14} fontWeight={700} fill="var(--foreground)">+</text>
        <ModuleBox x={272} y={42} w={110} h={40} label="KL(P‖Q)" sub="정보 손실" color="#10b981" />
      </motion.g>

      {/* 속성 4가지 */}
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.3 }}>
        {/* 속성 박스들 */}
        <rect x={10} y={94} width={108} height={24} rx={5}
          fill="#10b98110" stroke="#10b981" strokeWidth={0.8} />
        <text x={64} y={110} textAnchor="middle" fontSize={8} fontWeight={600} fill="#10b981">
          KL &gt;= 0 (Gibbs)
        </text>

        <rect x={126} y={94} width={108} height={24} rx={5}
          fill="#3b82f610" stroke="#3b82f6" strokeWidth={0.8} />
        <text x={180} y={110} textAnchor="middle" fontSize={8} fontWeight={600} fill="#3b82f6">
          KL=0 iff P=Q
        </text>

        <rect x={242} y={94} width={108} height={24} rx={5}
          fill="#f59e0b10" stroke="#f59e0b" strokeWidth={0.8} />
        <text x={296} y={110} textAnchor="middle" fontSize={8} fontWeight={600} fill="#f59e0b">
          비대칭 (metric X)
        </text>

        <rect x={358} y={94} width={108} height={24} rx={5}
          fill="#ef444410" stroke="#ef4444" strokeWidth={0.8} />
        <text x={412} y={110} textAnchor="middle" fontSize={8} fontWeight={600} fill="#ef4444">
          Q=0, P&gt;0 → 발산
        </text>
      </motion.g>

      {/* 연속 버전 힌트 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.4 }}>
        <text x={240} y={140} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          연속 버전: D_KL = ∫ p(x) log(p(x)/q(x)) dx — Q의 support가 P를 포함해야 발산 방지
        </text>
      </motion.g>
    </g>
  );
}

/* ── Step 1: 비대칭성 — Forward vs Reverse KL ── */
export function StepAsymmetry() {
  // bimodal P 곡선 점들 (두 봉우리)
  const pCurve = Array.from({ length: 48 }, (_, i) => {
    const x = -5 + i * (10 / 47);
    const g1 = Math.exp(-0.5 * (x + 2) ** 2);
    const g2 = Math.exp(-0.5 * (x - 2) ** 2);
    return { x, y: 0.5 * (g1 + g2) };
  });
  // Forward KL: 넓게 퍼짐 (μ=0, σ=2.5)
  const fwdCurve = Array.from({ length: 48 }, (_, i) => {
    const x = -5 + i * (10 / 47);
    return { x, y: 0.55 * Math.exp(-0.5 * (x / 2.5) ** 2) };
  });
  // Reverse KL: 한쪽 모드에 집중 (μ=2, σ=1)
  const revCurve = Array.from({ length: 48 }, (_, i) => {
    const x = -5 + i * (10 / 47);
    return { x, y: 0.9 * Math.exp(-0.5 * (x - 2) ** 2) };
  });

  const toSvg = (pt: { x: number; y: number }, ox: number, oy: number, sx: number, sy: number) =>
    `${ox + pt.x * sx},${oy - pt.y * sy}`;

  const pPath = (ox: number) =>
    'M ' + pCurve.map(p => toSvg(p, ox + 100, 100, 18, 55)).join(' L ');
  const fwdPath =
    'M ' + fwdCurve.map(p => toSvg(p, 100, 100, 18, 55)).join(' L ');
  const revPath =
    'M ' + revCurve.map(p => toSvg(p, 340, 100, 18, 55)).join(' L ');

  return (
    <g>
      {/* Forward KL 패널 */}
      <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
        <rect x={5} y={2} width={228} height={148} rx={8}
          fill="#3b82f606" stroke="#3b82f6" strokeWidth={0.8} />
        <text x={119} y={18} textAnchor="middle" fontSize={9} fontWeight={700} fill="#3b82f6">
          Forward KL(P‖Q) — mode covering
        </text>
        {/* P 곡선 */}
        <motion.path d={pPath(0)} fill="none" stroke="#10b981" strokeWidth={1.5}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 0.8 }} />
        {/* Q 곡선 (퍼짐) */}
        <motion.path d={fwdPath} fill="#3b82f615" stroke="#3b82f6" strokeWidth={1.5}
          strokeDasharray="4 2"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }} />
        {/* 레이블 */}
        <text x={60} y={38} fontSize={8} fill="#10b981" fontWeight={600}>P (bimodal)</text>
        <text x={150} y={58} fontSize={8} fill="#3b82f6" fontWeight={600}>Q (퍼짐)</text>
        <text x={119} y={120} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          Q가 P의 모든 mode를 커버 → mean-seeking
        </text>
        {/* x축 */}
        <line x1={15} y1={102} x2={225} y2={102} stroke="var(--border)" strokeWidth={0.5} />
      </motion.g>

      {/* Reverse KL 패널 */}
      <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.15 }}>
        <rect x={247} y={2} width={228} height={148} rx={8}
          fill="#ef444406" stroke="#ef4444" strokeWidth={0.8} />
        <text x={361} y={18} textAnchor="middle" fontSize={9} fontWeight={700} fill="#ef4444">
          Reverse KL(Q‖P) — mode seeking
        </text>
        {/* P 곡선 */}
        <motion.path d={pPath(240)} fill="none" stroke="#10b981" strokeWidth={1.5}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 0.8 }} />
        {/* Q 곡선 (한쪽 집중) */}
        <motion.path d={revPath} fill="#ef444415" stroke="#ef4444" strokeWidth={1.5}
          strokeDasharray="4 2"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }} />
        {/* 레이블 */}
        <text x={300} y={38} fontSize={8} fill="#10b981" fontWeight={600}>P (bimodal)</text>
        <text x={395} y={50} fontSize={8} fill="#ef4444" fontWeight={600}>Q (집중)</text>
        <text x={361} y={120} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          Q가 한 mode에 집중 → zero-forcing
        </text>
        {/* x축 */}
        <line x1={257} y1={102} x2={467} y2={102} stroke="var(--border)" strokeWidth={0.5} />
      </motion.g>
    </g>
  );
}

/* ── Step 2: Jensen-Shannon Divergence ── */
export function StepJSD() {
  return (
    <g>
      {/* 수식 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
        <rect x={40} y={2} width={400} height={26} rx={6}
          fill="#8b5cf610" stroke="#8b5cf6" strokeWidth={1.2} />
        <text x={240} y={19} textAnchor="middle" fontSize={10} fontWeight={700} fill="#8b5cf6">
          JSD(P‖Q) = 0.5 KL(P‖M) + 0.5 KL(Q‖M),   M = (P+Q)/2
        </text>
      </motion.g>

      {/* 3열 구조: P → M ← Q */}
      <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.15 }}>
        <DataBox x={30} y={38} w={80} h={30} label="P" sub="분포 A" color="#3b82f6" />
        <DataBox x={200} y={38} w={80} h={30} label="M" sub="(P+Q)/2" color="#8b5cf6" />
        <DataBox x={370} y={38} w={80} h={30} label="Q" sub="분포 B" color="#ef4444" />

        {/* 화살표 P→M */}
        <line x1={112} y1={53} x2={198} y2={53} stroke="#3b82f6" strokeWidth={1}
          markerEnd="url(#jsd-arrow-b)" />
        <text x={155} y={47} textAnchor="middle" fontSize={7.5} fill="#3b82f6" fontWeight={600}>
          KL(P‖M)
        </text>

        {/* 화살표 Q→M */}
        <line x1={368} y1={53} x2={282} y2={53} stroke="#ef4444" strokeWidth={1}
          markerEnd="url(#jsd-arrow-r)" />
        <text x={325} y={47} textAnchor="middle" fontSize={7.5} fill="#ef4444" fontWeight={600}>
          KL(Q‖M)
        </text>

        {/* 화살표 마커 */}
        <defs>
          <marker id="jsd-arrow-b" viewBox="0 0 6 6" refX={5} refY={3}
            markerWidth={5} markerHeight={5} orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="#3b82f6" />
          </marker>
          <marker id="jsd-arrow-r" viewBox="0 0 6 6" refX={5} refY={3}
            markerWidth={5} markerHeight={5} orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="#ef4444" />
          </marker>
        </defs>
      </motion.g>

      {/* 속성 비교: KL vs JSD */}
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.3 }}>
        {/* KL 약점 */}
        <AlertBox x={20} y={80} w={130} h={34} label="KL" sub="비대칭, 무한 가능" color="#ef4444" />
        {/* JSD 강점들 */}
        <ActionBox x={170} y={80} w={90} h={34} label="대칭" sub="JSD(P‖Q)=JSD(Q‖P)" color="#8b5cf6" />
        <ActionBox x={275} y={80} w={90} h={34} label="유한" sub="0 ~ log2" color="#8b5cf6" />
        <ActionBox x={380} y={80} w={82} h={34} label="Metric" sub="√JSD = 거리" color="#8b5cf6" />
      </motion.g>

      {/* 사용 사례 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.4 }}>
        <text x={240} y={133} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          GAN 평가(FID) / 분포 비교 / 문서 유사도 — Zero overlap에서도 정의됨
        </text>
      </motion.g>
    </g>
  );
}

/* ── Step 3: ML 활용 ── */
export function StepMLApps() {
  return (
    <g>
      {/* 중앙 KL 노드 */}
      <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
        transition={sp}>
        <circle cx={240} cy={50} r={22} fill="#10b98118" stroke="#10b981" strokeWidth={1.5} />
        <text x={240} y={47} textAnchor="middle" fontSize={9} fontWeight={700} fill="#10b981">KL</text>
        <text x={240} y={57} textAnchor="middle" fontSize={7} fill="#10b981">Divergence</text>
      </motion.g>

      {/* VAE */}
      <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.1 }}>
        <line x1={218} y1={45} x2={140} y2={35} stroke="#3b82f6" strokeWidth={0.8} />
        <ModuleBox x={20} y={15} w={118} h={42} label="VAE" sub="KL(q(z|x) ‖ p(z))" color="#3b82f6" />
        <text x={79} y={68} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
          잠재 공간 → N(0,I) 정규화
        </text>
      </motion.g>

      {/* PPO */}
      <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.2 }}>
        <line x1={262} y1={45} x2={340} y2={35} stroke="#f59e0b" strokeWidth={0.8} />
        <ModuleBox x={342} y={15} w={118} h={42} label="PPO" sub="KL(pi_old ‖ pi_new)" color="#f59e0b" />
        <text x={401} y={68} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
          정책 변화량 제약 (beta 계수)
        </text>
      </motion.g>

      {/* Knowledge Distillation */}
      <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.3 }}>
        <line x1={228} y1={70} x2={130} y2={100} stroke="#8b5cf6" strokeWidth={0.8} />
        <ModuleBox x={20} y={85} w={118} h={42} label="Distillation" sub="KL(teacher ‖ student)" color="#8b5cf6" />
        <text x={79} y={138} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
          Temperature T로 soft label 학습
        </text>
      </motion.g>

      {/* GAN / f-divergence */}
      <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.4 }}>
        <line x1={252} y1={70} x2={350} y2={100} stroke="#ef4444" strokeWidth={0.8} />
        <ModuleBox x={342} y={85} w={118} h={42} label="f-GAN" sub="KL, JS, chi-sq" color="#ef4444" />
        <text x={401} y={138} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
          f-divergence로 일반화
        </text>
      </motion.g>
    </g>
  );
}

/* ── Step 4: PyTorch 구현 ── */
export function StepPyTorch() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
        PyTorch KL 계산 — 3가지 방법
      </text>

      {/* 3가지 계산 방법 — 세로 배치 */}
      {[
        { label: '직접 계산', code: 'Σ p·log(p/q)', note: '수식 그대로 구현', result: '= 0.068', color: '#10b981' },
        { label: 'F.kl_div', code: 'kl_div(log_q, p)', note: '⚠ log 입력 + 순서 주의', result: '"reduction=batchmean"', color: '#3b82f6' },
        { label: 'VAE KL', code: '-0.5·Σ(1+logσ²-μ²-σ²)', note: 'Gaussian → closed-form', result: '샘플링 불필요', color: '#8b5cf6' },
      ].map((m, i) => (
        <motion.g key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
          transition={{ ...sp, delay: i * 0.12 }}>
          <rect x={10} y={24 + i * 38} width={460} height={32} rx={6}
            fill={`${m.color}08`} stroke={m.color} strokeWidth={1} />
          <rect x={10} y={24 + i * 38} width={4} height={32} rx={0}
            fill={m.color} opacity={0.8} />
          <text x={24} y={38 + i * 38} fontSize={9} fontWeight={700} fill={m.color}>
            {m.label}
          </text>
          <text x={120} y={38 + i * 38} fontSize={8} fontFamily="monospace" fill="var(--foreground)">
            {m.code}
          </text>
          <text x={24} y={50 + i * 38} fontSize={7} fill="var(--muted-foreground)">
            {m.note}
          </text>
          <text x={350} y={44 + i * 38} fontSize={8} fill={m.color} fontWeight={600}>
            {m.result}
          </text>
        </motion.g>
      ))}

      {/* 하단 요약 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.4 }}>
        <rect x={10} y={140} width={460} height={14} rx={4}
          fill="var(--muted)" fillOpacity={0.2} />
        <text x={240} y={150} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          Gaussian KL → closed-form (빠름) | 일반 분포 → F.kl_div | VAE Loss = Recon + KL
        </text>
      </motion.g>
    </g>
  );
}
