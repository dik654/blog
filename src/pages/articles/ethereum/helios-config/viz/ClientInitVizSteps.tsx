import { motion } from 'framer-motion';
import { ModuleBox, ActionBox, DataBox } from '@/components/viz/boxes';
import { C } from './ClientInitVizData';

/* ── helpers ── */
const fade = (d: number) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { delay: d },
});
const drawLine = (d: number) => ({
  initial: { pathLength: 0 },
  animate: { pathLength: 1 },
  transition: { delay: d, duration: 0.3 },
});

/* ================================================================
   Step 0 — build() 4단계 파이프라인
   ① Validate → ② ConsensusSpec → ③ Checkpoint → ④ Init
   ================================================================ */
export function Step0() {
  const stages = [
    { label: 'Validate', sub: '필수 필드 검증', color: C.build, x: 10 },
    { label: 'ConsensusSpec', sub: '네트워크 파라미터', color: C.spec, x: 126 },
    { label: 'Checkpoint', sub: '3단계 우선순위', color: C.ckpt, x: 242 },
    { label: 'Init', sub: '모듈 생성', color: C.disk, x: 358 },
  ];

  /* ① 필수 필드 3개 */
  const fields = [
    { label: 'network', y: 92 },
    { label: 'consensus_rpc', y: 110 },
    { label: 'execution_rpc', y: 128 },
  ];

  /* ③ 체크포인트 우선순위 3단 */
  const priorities = [
    { label: 'user', color: C.ckpt },
    { label: 'FileDB', color: C.disk },
    { label: 'hardcoded', color: C.warn },
  ];

  return (
    <g>
      {/* 상단 타이틀 */}
      <motion.g {...fade(0)}>
        <text x={240} y={14} textAnchor="middle"
          fontSize={9} fontWeight={600} fill="var(--foreground)" opacity={0.5}>
          ClientBuilder::build() — 4단계
        </text>
      </motion.g>

      {/* ── 4단계 ModuleBox 카드 ── */}
      {stages.map((s, i) => (
        <motion.g key={s.label} {...fade(0.1 + i * 0.15)}>
          <ModuleBox x={s.x} y={26} w={108} h={44} label={s.label} sub={s.sub} color={s.color} />

          {/* 단계 번호 뱃지 */}
          <circle cx={s.x + 10} cy={26} r={7}
            fill={s.color} opacity={0.9} />
          <text x={s.x + 10} y={29.5} textAnchor="middle"
            fontSize={8} fontWeight={700} fill="#ffffff">
            {i + 1}
          </text>
        </motion.g>
      ))}

      {/* ── 단계 사이 화살표 (→) ── */}
      {[0, 1, 2].map((i) => (
        <motion.line key={`arrow-${i}`}
          x1={stages[i].x + 110} y1={48}
          x2={stages[i + 1].x - 2} y2={48}
          stroke={stages[i + 1].color} strokeWidth={1}
          markerEnd={`url(#arrCI${i})`}
          {...drawLine(0.25 + i * 0.15)} />
      ))}

      {/* ── ① Validate 상세: 3개 필드 + 체크마크 ── */}
      <motion.g {...fade(0.6)}>
        <rect x={10} y={82} width={108} height={62} rx={5}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        {fields.map((f, i) => (
          <g key={f.label}>
            {/* 체크마크 */}
            <motion.path
              d={`M 18 ${f.y} L 22 ${f.y + 4} L 28 ${f.y - 3}`}
              fill="none" stroke={C.disk} strokeWidth={1.2} strokeLinecap="round"
              {...drawLine(0.7 + i * 0.1)} />
            <text x={33} y={f.y + 3} fontSize={7.5}
              fontFamily="monospace" fill="var(--foreground)">
              {f.label}
            </text>
          </g>
        ))}
      </motion.g>

      {/* ── ② ConsensusSpec 상세: 네트워크→spec ── */}
      <motion.g {...fade(0.8)}>
        <rect x={126} y={82} width={108} height={62} rx={5}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <DataBox x={133} y={88} w={50} h={20} label="Mainnet" color={C.spec} />
        <motion.line x1={185} y1={98} x2={195} y2={98}
          stroke={C.spec} strokeWidth={0.8} markerEnd="url(#arrCISpec)"
          {...drawLine(0.9)} />
        <text x={200} y={95} fontSize={7} fill="var(--foreground)" fontWeight={600}>
          Spec
        </text>
        <text x={134} y={121} fontSize={7} fill="var(--muted-foreground)">
          slots_per_epoch: 32
        </text>
        <text x={134} y={132} fontSize={7} fill="var(--muted-foreground)">
          genesis_root: 0x4b..
        </text>
      </motion.g>

      {/* ── ③ Checkpoint 상세: 3단 우선순위 작은 뱃지 ── */}
      <motion.g {...fade(0.95)}>
        <rect x={242} y={82} width={108} height={62} rx={5}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        {priorities.map((p, i) => (
          <g key={p.label}>
            <circle cx={254} cy={96 + i * 17} r={5}
              fill={`${p.color}20`} stroke={p.color} strokeWidth={0.8} />
            <text x={254} y={99 + i * 17} textAnchor="middle"
              fontSize={7} fontWeight={700} fill={p.color}>
              {i + 1}
            </text>
            <text x={264} y={99 + i * 17} fontSize={7.5}
              fill="var(--foreground)">{p.label}</text>
            {/* 점선 화살표 (fallback) */}
            {i < 2 && (
              <motion.line
                x1={254} y1={102 + i * 17} x2={254} y2={108 + i * 17}
                stroke={priorities[i + 1].color} strokeWidth={0.6}
                strokeDasharray="2 2" opacity={0.5}
                {...drawLine(1.0 + i * 0.1)} />
            )}
          </g>
        ))}
      </motion.g>

      {/* ── ④ Init 상세: consensus + execution 모듈 ── */}
      <motion.g {...fade(1.1)}>
        <rect x={358} y={82} width={108} height={62} rx={5}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <ActionBox x={363} y={88} w={96} h={20} label="ConsensusClient" color={C.disk} />
        <ActionBox x={363} y={116} w={96} h={20} label="ExecutionClient" color={C.disk} />
      </motion.g>

      {/* ── 하단 결과: Client 생성 ── */}
      <motion.g {...fade(1.3)}>
        <rect x={160} y={160} width={160} height={30} rx={15}
          fill={`${C.disk}12`} stroke={C.disk} strokeWidth={1} />
        <text x={240} y={179} textAnchor="middle"
          fontSize={9} fontWeight={700} fill={C.disk}>
          Client 인스턴스 생성 완료
        </text>
      </motion.g>

      {/* arrow defs */}
      <defs>
        {[0, 1, 2].map((i) => (
          <marker key={i} id={`arrCI${i}`} viewBox="0 0 10 10" refX={9} refY={5}
            markerWidth={5} markerHeight={5} orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={stages[i + 1].color} />
          </marker>
        ))}
        <marker id="arrCISpec" viewBox="0 0 10 10" refX={9} refY={5}
          markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.spec} />
        </marker>
      </defs>
    </g>
  );
}

/* ================================================================
   Step 1 — 체크포인트 우선순위 계단 (vertical cascade)
   User CLI > FileDB > Hardcoded — "First available wins"
   ================================================================ */
export function Step1() {
  const levels = [
    {
      label: '사용자 지정',
      desc: '--checkpoint 0x85e6...',
      color: C.ckpt,
      solid: true,
      icon: 'CLI',
    },
    {
      label: 'FileDB',
      desc: '~/.helios/.../checkpoint.ssz',
      color: C.disk,
      solid: false,
      icon: '32B',
    },
    {
      label: '하드코딩',
      desc: '소스 내장 기본값 (만료 위험)',
      color: C.warn,
      solid: false,
      icon: '!!',
    },
  ];

  return (
    <g>
      {/* 타이틀 */}
      <motion.g {...fade(0)}>
        <text x={240} y={14} textAnchor="middle"
          fontSize={9} fontWeight={600} fill="var(--foreground)" opacity={0.5}>
          체크포인트 3단계 우선순위
        </text>
      </motion.g>

      {/* ── 3단 계층 카드 ── */}
      {levels.map((lv, i) => {
        const y = 28 + i * 52;
        return (
          <motion.g key={lv.label} {...fade(0.15 + i * 0.25)}>
            {/* 카드 */}
            <rect x={80} y={y} width={240} height={40} rx={6}
              fill="var(--card)"
              stroke={lv.color} strokeWidth={lv.solid ? 1.2 : 0.8}
              strokeDasharray={lv.solid ? 'none' : '5 3'} />

            {/* 우선순위 번호 */}
            <circle cx={98} cy={y + 20} r={9}
              fill={lv.color} opacity={0.9} />
            <text x={98} y={y + 24} textAnchor="middle"
              fontSize={9} fontWeight={700} fill="#ffffff">
              {i + 1}
            </text>

            {/* 라벨 */}
            <text x={115} y={y + 16} fontSize={9}
              fontWeight={700} fill="var(--foreground)">
              {lv.label}
            </text>
            <text x={115} y={y + 30} fontSize={7}
              fontFamily="monospace" fill="var(--muted-foreground)">
              {lv.desc}
            </text>

            {/* 아이콘 뱃지 (오른쪽) */}
            <rect x={280} y={y + 10} width={30} height={20} rx={10}
              fill={`${lv.color}15`} stroke={lv.color} strokeWidth={0.6} />
            <text x={295} y={y + 24} textAnchor="middle"
              fontSize={8} fontWeight={700} fill={lv.color}>
              {lv.icon}
            </text>

            {/* fallback 화살표 (아래로) */}
            {i < 2 && (
              <motion.g {...fade(0.4 + i * 0.25)}>
                <motion.line
                  x1={200} y1={y + 42} x2={200} y2={y + 50}
                  stroke={levels[i + 1].color} strokeWidth={0.8}
                  strokeDasharray="3 2"
                  markerEnd={`url(#arrCIPri${i})`}
                  {...drawLine(0.5 + i * 0.25)} />
                {/* "없으면" 라벨 */}
                <rect x={207} y={y + 41} width={32} height={12} rx={3}
                  fill="var(--card)" stroke="var(--border)" strokeWidth={0.4} />
                <text x={223} y={y + 50} textAnchor="middle"
                  fontSize={7} fill="var(--muted-foreground)">없으면</text>
              </motion.g>
            )}
          </motion.g>
        );
      })}

      {/* ── 오른쪽: "First available wins" 뱃지 ── */}
      <motion.g {...fade(1.0)}>
        <rect x={340} y={64} width={120} height={36} rx={18}
          fill={`${C.disk}12`} stroke={C.disk} strokeWidth={1} />
        <text x={400} y={79} textAnchor="middle"
          fontSize={8} fontWeight={700} fill={C.disk}>
          First available
        </text>
        <text x={400} y={91} textAnchor="middle"
          fontSize={7} fill={C.disk}>wins</text>

        {/* 화살표: 카드 → 뱃지 */}
        <motion.line x1={322} y1={82} x2={338} y2={82}
          stroke={C.disk} strokeWidth={0.8}
          markerEnd="url(#arrCIWin)"
          {...drawLine(1.1)} />
      </motion.g>

      {/* ── 하단: or_else 체인 설명 ── */}
      <motion.g {...fade(1.2)}>
        <rect x={80} y={176} width={320} height={18} rx={4}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.4} />
        <text x={240} y={189} textAnchor="middle"
          fontSize={7.5} fontFamily="monospace" fill="var(--muted-foreground)">
          self.checkpoint.or_else(|| FileDB).or_else(|| default)
        </text>
      </motion.g>

      {/* arrow defs */}
      <defs>
        <marker id="arrCIPri0" viewBox="0 0 10 10" refX={9} refY={5}
          markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.disk} />
        </marker>
        <marker id="arrCIPri1" viewBox="0 0 10 10" refX={9} refY={5}
          markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.warn} />
        </marker>
        <marker id="arrCIWin" viewBox="0 0 10 10" refX={9} refY={5}
          markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.disk} />
        </marker>
      </defs>
    </g>
  );
}
