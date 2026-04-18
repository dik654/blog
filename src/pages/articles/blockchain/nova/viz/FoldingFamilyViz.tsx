import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = {
  nova: '#a855f7',
  supernova: '#3b82f6',
  hypernova: '#10b981',
  protostar: '#f59e0b',
  protogalaxy: '#ec4899',
  halo2: '#06b6d4',
  fg: '#e5e7eb',
  mut: '#9ca3af',
};

const STEPS = [
  {
    label: '① Nova (2022) — IVC 의 시초',
    body: 'Microsoft Research 의 Kothapalli·Setty·Tzialla 가 제안한 폴딩 기반 IVC.\nR1CS 두 인스턴스를 한 번에 합치는 2-1 폴딩 + 동일 회로 반복이 핵심.',
  },
  {
    label: '② Nova 패밀리 진화 트리 (2022~2023)',
    body: 'Nova 의 한계 — 동일 회로 / R1CS 만 / 저차 게이트 — 를 극복하기 위해 4 갈래로 갈라짐.\nSuperNova(이종회로) · HyperNova(CCS+lookup) · ProtoStar(고차) · ProtoGalaxy(PLONKish).',
  },
  {
    label: '③ 패밀리 5종 비교 — 폴딩 형태 / 비용 / 차별점',
    body: '폴딩 대상 산술 시스템(R1CS / CCS / PLONKish), 회로 동질성, MSM 비용에서 차이.\nzkVM 처럼 opcode 가 다양하면 SuperNova/ProtoStar, lookup 위주면 HyperNova 가 유리.',
  },
  {
    label: '④ Halo2 누적 vs Nova IVC — 스텝당 비용 비교',
    body: 'Halo2 는 매 스텝 SNARK 생성 → 수 초 + GB 메모리.\nNova 는 매 스텝 폴딩만 → 수십 ms + 100MB, 최종 1회만 SNARK 압축.\n1만+ step 누적에서 1~2 자릿수 빠름.',
  },
  {
    label: '⑤ 선택 기준 — 시나리오별 권장 방식',
    body: '긴 시퀀스 → Nova 계열 / 짧은 트레이스 → Halo2 누적.\n이종 회로 → SuperNova·ProtoStar / lookup 의존 → HyperNova.\nEVM 검증은 Nova → Spartan → Groth16 wrap 으로 48B proof 마무리.',
  },
  {
    label: '⑥ 실전 활용 — Lurk / Mina / Nexus·Jolt / EZKL',
    body: 'Lurk REPL — Nova 로 Lisp 인터프리터 IVC.\nMina — Pickles(Halo2 누적) 으로 22KB 상태.\nNexus·Jolt — RISC-V zkVM, HyperNova/Lookup.\nEZKL — ZK ML, 큰 회로 한 번 vs 작게 누적.',
  },
];

const FAMILY = [
  { name: 'Nova',        x: 30,  color: C.nova,        sys: 'R1CS',     fold: '2-1',        step: '~50 ms',  why: '동일 회로 IVC' },
  { name: 'SuperNova',   x: 130, color: C.supernova,   sys: 'R1CS',     fold: 'N-1 (다종)', step: '~70 ms',  why: 'opcode 분기' },
  { name: 'HyperNova',   x: 230, color: C.hypernova,   sys: 'CCS',      fold: '2-1+sumck',  step: '~80 ms',  why: 'lookup 효율' },
  { name: 'ProtoStar',   x: 330, color: C.protostar,   sys: 'CCS',      fold: 'N-1',        step: '~60 ms',  why: '고차 게이트' },
  { name: 'ProtoGalaxy', x: 430, color: C.protogalaxy, sys: 'PLONKish', fold: 'N-1',        step: '~55 ms',  why: 'log N MSM' },
];

const USECASES = [
  { name: 'Lurk',        sub: 'Lisp REPL · Nova',         color: C.nova,      x: 30,  y: 50,  w: 220, h: 95 },
  { name: 'Mina',        sub: 'Pickles · 22KB state',     color: C.halo2,     x: 270, y: 50,  w: 220, h: 95 },
  { name: 'Nexus / Jolt',sub: 'RISC-V zkVM · HyperNova',  color: C.hypernova, x: 30,  y: 160, w: 220, h: 95 },
  { name: 'EZKL',        sub: 'ZK ML · 회로 누적',         color: C.protostar, x: 270, y: 160, w: 220, h: 95 },
];

function NovaOriginPanel() {
  return (
    <svg viewBox="0 0 520 300" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={260} y={28} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.mut}>
        2022 — Nova: 첫 폴딩 기반 IVC
      </text>

      {/* Central Nova node */}
      <motion.circle
        cx={260} cy={150} r={70}
        initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        fill={`${C.nova}1c`} stroke={C.nova} strokeWidth={1.6}
      />
      <motion.circle
        cx={260} cy={150} r={88}
        initial={{ opacity: 0 }} animate={{ opacity: 0.4 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        fill="none" stroke={C.nova} strokeWidth={0.8} strokeDasharray="3 3"
      />
      <text x={260} y={146} textAnchor="middle" fontSize={18} fontWeight={700} fill={C.nova}>Nova</text>
      <text x={260} y={162} textAnchor="middle" fontSize={9} fill={C.nova} opacity={0.85}>2-1 folding · R1CS</text>

      {/* 3 labels around */}
      {[
        { x: 80,  y: 80,  label: 'Kothapalli · Setty · Tzialla', sub: 'Microsoft Research' },
        { x: 80,  y: 230, label: 'Relaxed R1CS', sub: '2개 인스턴스 → 1개' },
        { x: 440, y: 150, label: '동일 회로 F', sub: 'IVC step 반복' },
      ].map((t, i) => (
        <motion.g key={t.label}
          initial={{ opacity: 0, x: t.x < 260 ? -10 : 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 + i * 0.15 }}>
          <text x={t.x} y={t.y} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.fg}>{t.label}</text>
          <text x={t.x} y={t.y + 14} textAnchor="middle" fontSize={8.5} fill={C.mut}>{t.sub}</text>
        </motion.g>
      ))}
    </svg>
  );
}

function FamilyTreePanel() {
  const children = FAMILY.slice(1);
  return (
    <svg viewBox="0 0 520 300" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={260} y={22} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.mut}>
        Nova 패밀리 진화 트리
      </text>

      {/* Root: Nova */}
      <motion.rect
        x={210} y={40} width={100} height={50} rx={10}
        initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 40 }}
        transition={{ duration: 0.4 }}
        fill={`${C.nova}1c`} stroke={C.nova} strokeWidth={1.4}
      />
      <text x={260} y={62} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.nova}>Nova</text>
      <text x={260} y={78} textAnchor="middle" fontSize={8.5} fill={C.nova} opacity={0.8}>2022 · R1CS · 2-1</text>

      {/* Branch lines + child cards */}
      {children.map((c, i) => {
        const cx = 70 + i * 130;
        const cy = 200;
        return (
          <g key={c.name}>
            <motion.path
              d={`M 260 90 C 260 130, ${cx + 50} 150, ${cx + 50} ${cy}`}
              fill="none" stroke={c.color} strokeWidth={1.1} opacity={0.55}
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ delay: 0.4 + i * 0.12, duration: 0.5 }}
            />
            <motion.rect
              x={cx} y={cy} width={100} height={70} rx={10}
              initial={{ opacity: 0, y: cy + 8 }} animate={{ opacity: 1, y: cy }}
              transition={{ delay: 0.7 + i * 0.1 }}
              fill={`${c.color}14`} stroke={c.color} strokeWidth={1.2}
            />
            <text x={cx + 50} y={cy + 22} textAnchor="middle" fontSize={11.5} fontWeight={700} fill={c.color}>{c.name}</text>
            <text x={cx + 50} y={cy + 38} textAnchor="middle" fontSize={8.5} fontFamily="monospace" fill={c.color} opacity={0.85}>{c.sys}</text>
            <text x={cx + 50} y={cy + 52} textAnchor="middle" fontSize={8} fill={c.color} opacity={0.7}>{c.fold}</text>
            <text x={cx + 50} y={cy + 64} textAnchor="middle" fontSize={7.5} fill={C.mut}>{c.why}</text>
          </g>
        );
      })}

      <text x={260} y={290} textAnchor="middle" fontSize={8} fill={C.mut} opacity={0.7}>
        모두 2023 발표 · 폴딩 대상과 산술 시스템이 분기 포인트
      </text>
    </svg>
  );
}

function FamilyComparePanel() {
  return (
    <svg viewBox="0 0 520 300" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={260} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.mut}>
        패밀리 5종 — 폴딩 / 산술계 / 스텝당 / 차별점
      </text>

      {/* Header row */}
      {['system', 'fold', 'step', 'why'].map((h, i) => (
        <text key={h} x={120 + i * 90} y={48} textAnchor="middle" fontSize={8.5} fill={C.mut} opacity={0.7}>{h}</text>
      ))}

      {FAMILY.map((f, i) => {
        const y = 60 + i * 42;
        return (
          <g key={f.name}>
            <motion.rect
              x={20} y={y} width={480} height={36} rx={8}
              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              fill={`${f.color}10`} stroke={f.color} strokeWidth={0.9}
            />
            <rect x={20} y={y} width={4} height={36} rx={2} fill={f.color} />
            <text x={32} y={y + 22} fontSize={11} fontWeight={700} fill={f.color}>{f.name}</text>
            <text x={120} y={y + 22} textAnchor="middle" fontSize={9.5} fontFamily="monospace" fill={C.fg}>{f.sys}</text>
            <text x={210} y={y + 22} textAnchor="middle" fontSize={9.5} fontFamily="monospace" fill={C.fg}>{f.fold}</text>
            <text x={300} y={y + 22} textAnchor="middle" fontSize={9.5} fontFamily="monospace" fill={f.color}>{f.step}</text>
            <text x={420} y={y + 22} textAnchor="middle" fontSize={9} fill={C.mut}>{f.why}</text>
          </g>
        );
      })}
    </svg>
  );
}

function Halo2VsNovaPanel() {
  // 두 큰 카드 (Halo2 vs Nova) + 스텝당 비용 막대
  const cards = [
    {
      name: 'Halo2 누적',
      sub: 'Pickles · Plonky2',
      color: C.halo2,
      x: 20,
      bullets: ['매 스텝 SNARK 생성', '스텝당 수 초', '메모리 GB', '짧은 trace 유리'],
      barW: 380, barText: '~3,000 ms / step',
    },
    {
      name: 'Nova IVC',
      sub: '폴딩 · 최종 1회 압축',
      color: C.nova,
      x: 270,
      bullets: ['매 스텝 폴딩만', '스텝당 수십 ms', '메모리 100MB', '1만+ step 유리'],
      barW: 18, barText: '~50 ms / step',
    },
  ];
  return (
    <svg viewBox="0 0 520 300" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={260} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.mut}>
        Halo2 누적 vs Nova IVC
      </text>

      {/* 두 큰 카드 사이드바이사이드 */}
      {cards.map((c, idx) => (
        <g key={c.name}>
          <motion.rect
            x={c.x} y={30} width={230} height={150} rx={10}
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.15, duration: 0.4 }}
            fill={`${c.color}10`} stroke={c.color} strokeWidth={1.3}
          />
          <text x={c.x + 14} y={52} fontSize={13} fontWeight={700} fill={c.color}>{c.name}</text>
          <text x={c.x + 14} y={68} fontSize={9} fill={c.color} opacity={0.75}>{c.sub}</text>
          <line x1={c.x + 14} y1={76} x2={c.x + 216} y2={76} stroke={c.color} strokeWidth={0.4} opacity={0.4} />
          {c.bullets.map((b, i) => (
            <motion.g key={b}
              initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.07 + idx * 0.05 }}>
              <circle cx={c.x + 20} cy={94 + i * 20} r={2} fill={c.color} />
              <text x={c.x + 30} y={97 + i * 20} fontSize={9.5} fill={C.fg}>{b}</text>
            </motion.g>
          ))}
        </g>
      ))}

      {/* 스텝당 비용 막대 (log scale 감각) */}
      <text x={20} y={210} fontSize={9.5} fontWeight={600} fill={C.mut}>스텝당 비용 (log-scale 감각)</text>
      {cards.map((c, i) => (
        <g key={`bar-${c.name}`}>
          <text x={20} y={230 + i * 30} fontSize={9} fontWeight={600} fill={c.color}>{c.name}</text>
          <motion.rect
            x={100} y={222 + i * 30} height={16} rx={3}
            initial={{ width: 0 }} animate={{ width: c.barW }}
            transition={{ duration: 0.7, delay: 0.5 + i * 0.15 }}
            fill={`${c.color}30`} stroke={c.color} strokeWidth={0.9}
          />
          <text x={104 + c.barW + 4} y={234 + i * 30} fontSize={9} fontWeight={600} fill={c.color}>{c.barText}</text>
        </g>
      ))}
      <text x={260} y={290} textAnchor="middle" fontSize={8} fill={C.mut} opacity={0.7}>
        * 자릿수 감각용 — 1만 step 누적 시 약 60배 차이
      </text>
    </svg>
  );
}

function CriteriaPanel() {
  const criteria = [
    { scenario: '긴 시퀀스 (1만+ step)',     pick: 'Nova 계열',           color: C.nova },
    { scenario: '짧은 trace (<1k step)',     pick: 'Halo2 누적',          color: C.halo2 },
    { scenario: '이종 회로 (zkVM opcode)',   pick: 'SuperNova / ProtoStar', color: C.supernova },
    { scenario: 'Lookup 의존 (range/byte)',  pick: 'HyperNova',           color: C.hypernova },
    { scenario: 'EVM 온체인 검증',            pick: 'Nova → Spartan → Groth16', color: C.protostar },
  ];
  return (
    <svg viewBox="0 0 520 300" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={260} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.mut}>
        선택 기준 — 시나리오별 권장 방식
      </text>

      {criteria.map((c, i) => {
        const y = 40 + i * 48;
        return (
          <g key={c.scenario}>
            {/* 시나리오 카드 */}
            <motion.rect
              x={20} y={y} width={220} height={38} rx={8}
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              fill="var(--card)" stroke={C.mut} strokeWidth={0.6} strokeDasharray="3 2"
            />
            <text x={32} y={y + 17} fontSize={9} fill={C.mut} opacity={0.75}>시나리오</text>
            <text x={32} y={y + 32} fontSize={10.5} fontWeight={600} fill={C.fg}>{c.scenario}</text>

            {/* 화살표 */}
            <motion.path
              d={`M 245 ${y + 19} L 275 ${y + 19}`}
              stroke={c.color} strokeWidth={1.2}
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ delay: 0.3 + i * 0.08, duration: 0.3 }}
              markerEnd="url(#critArrow)"
            />

            {/* 권장 방식 카드 */}
            <motion.rect
              x={285} y={y} width={215} height={38} rx={8}
              initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.08 }}
              fill={`${c.color}14`} stroke={c.color} strokeWidth={1.1}
            />
            <text x={297} y={y + 17} fontSize={9} fill={c.color} opacity={0.75}>권장</text>
            <text x={297} y={y + 32} fontSize={10.5} fontWeight={700} fill={c.color}>{c.pick}</text>
          </g>
        );
      })}

      <defs>
        <marker id="critArrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 z" fill={C.mut} />
        </marker>
      </defs>
    </svg>
  );
}

function UseCasesPanel() {
  return (
    <svg viewBox="0 0 520 300" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={260} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.mut}>
        실전 활용 — 4 사례
      </text>

      {USECASES.map((u, i) => (
        <g key={u.name}>
          <motion.rect
            x={u.x} y={u.y} width={u.w} height={u.h} rx={10}
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.12, duration: 0.35 }}
            fill={`${u.color}10`} stroke={u.color} strokeWidth={1.2}
          />
          <rect x={u.x} y={u.y} width={u.w} height={4} rx={2} fill={u.color} opacity={0.85} />
          <text x={u.x + 16} y={u.y + 28} fontSize={13} fontWeight={700} fill={u.color}>{u.name}</text>
          <text x={u.x + 16} y={u.y + 44} fontSize={9.5} fill={u.color} opacity={0.8}>{u.sub}</text>

          {/* 추가 설명 */}
          {u.name === 'Lurk' && (
            <>
              <text x={u.x + 16} y={u.y + 66} fontSize={9} fill={C.fg}>Lisp 인터프리터 IVC</text>
              <text x={u.x + 16} y={u.y + 80} fontSize={8.5} fill={C.mut}>REPL 매 evaluate → 1 폴딩</text>
            </>
          )}
          {u.name === 'Mina' && (
            <>
              <text x={u.x + 16} y={u.y + 66} fontSize={9} fill={C.fg}>Pickles = Halo 누적</text>
              <text x={u.x + 16} y={u.y + 80} fontSize={8.5} fill={C.mut}>전체 체인 → 22KB 상태</text>
            </>
          )}
          {u.name === 'Nexus / Jolt' && (
            <>
              <text x={u.x + 16} y={u.y + 66} fontSize={9} fill={C.fg}>RISC-V zkVM (HyperNova)</text>
              <text x={u.x + 16} y={u.y + 80} fontSize={8.5} fill={C.mut}>opcode lookup + 폴딩</text>
            </>
          )}
          {u.name === 'EZKL' && (
            <>
              <text x={u.x + 16} y={u.y + 66} fontSize={9} fill={C.fg}>ZK ML 추론 증명</text>
              <text x={u.x + 16} y={u.y + 80} fontSize={8.5} fill={C.mut}>큰 회로 1회 vs 작게 누적</text>
            </>
          )}
        </g>
      ))}

      <text x={260} y={282} textAnchor="middle" fontSize={8} fill={C.mut} opacity={0.7}>
        Nova 계열은 긴 누적, Halo2 계열은 트리 압축에 강점
      </text>
    </svg>
  );
}

export default function FoldingFamilyViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        if (step === 0) return <NovaOriginPanel />;
        if (step === 1) return <FamilyTreePanel />;
        if (step === 2) return <FamilyComparePanel />;
        if (step === 3) return <Halo2VsNovaPanel />;
        if (step === 4) return <CriteriaPanel />;
        return <UseCasesPanel />;
      }}
    </StepViz>
  );
}
