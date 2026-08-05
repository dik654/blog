import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.55 };

const C = {
  input: '#ef4444',     // (U_n, W_n) input
  sumcheck: '#3b82f6',  // sumcheck rounds
  opening: '#10b981',   // polynomial commitment opening
  ipa: '#a855f7',       // IPA / HyperKZG compression
  ppsnark: '#06b6d4',   // ppsnark variant
  groth: '#10b981',     // Groth16 wrap (same family as opening green)
};

const STEPS = [
  {
    label: '① 마지막 누적기 (U_n, W_n) 입력',
    body: 'n 번 폴딩이 끝난 시점의 누적기. Relaxed R1CS 인스턴스 (U_n) + witness (W_n) ≈ 1 MB.\n그대로는 SNARK 가 아니고 on-chain 검증 불가 — Spartan 으로 압축이 필요.',
  },
  {
    label: '② Sumcheck 라운드 — log m 단계',
    body: 'g(x) = Ãz·B̃z − u·C̃z − Ẽ 가 부울 큐브에서 0 임을 증명.\n라운드마다 prover 가 단변수 다항식 전송 → verifier 가 random challenge 반환 → 변수 하나씩 고정.\n총 라운드 수 = log m, Verifier 비용 O(log m).',
  },
  {
    label: '③ Polynomial commitment opening',
    body: 'Sumcheck 마지막에서 W̃, Ẽ 를 무작위 점 r ∈ F^{log m} 에서 평가해야 함.\nProver 가 commitment opening proof 제출 — "값 v 가 commit(W̃) 의 r 에서의 평가가 맞다" 를 증명.',
  },
  {
    label: '④ IPA / HyperKZG 로 opening 압축',
    body: 'Opening proof 자체가 크면 의미 없음. IPA(Bulletproofs 계열) 또는 HyperKZG(페어링 기반) 로 log 크기로 줄임.\nIPA: O(log m) group elements, no trusted setup. HyperKZG: O(1) pairing, trusted setup 필요.',
  },
  {
    label: '⑤ ppsnark vs snark — 두 변형',
    body: 'ppsnark (preprocessing): 회로 (A,B,C) 를 사전 커밋 → Verifier O(log m), 증명 ~5 KB, EVM 가능.\nsnark (no preprocessing): 회로 매 검증마다 평가 → Verifier O(m), 증명 ~3 KB, 동적 회로용.',
  },
  {
    label: '⑥ 최종 증명 크기 비교',
    body: 'RecursiveSNARK 그대로 ~1 MB → Spartan ppsnark ~5 KB (200× 압축) → Groth16 wrap ~200 B (5,000× 압축).\nNova → Spartan → Groth16 3단 압축이 실전 EVM 배포의 표준.',
  },
];

/* ───────── Step 1: Funnel — 큰 박스에서 작은 박스로 ───────── */
function Step1() {
  return (
    <svg viewBox="0 0 520 280" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={260} y={26} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.input}>
        마지막 누적기 (U_n, W_n) → Spartan 압축 입력
      </text>

      {/* 큰 박스 (1MB) */}
      <motion.rect x={40} y={70} width={200} height={150} rx={12}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1, fill: `${C.input}22`, stroke: C.input, strokeWidth: 1.6 }}
        transition={sp} />
      <motion.text x={140} y={108} textAnchor="middle" fontSize={13} fontWeight={700}
        initial={{ opacity: 0 }} animate={{ opacity: 1, fill: C.input }}
        transition={{ delay: 0.15 }}>RecursiveSNARK</motion.text>
      <motion.text x={140} y={138} textAnchor="middle" fontSize={11}
        initial={{ opacity: 0 }} animate={{ opacity: 0.85, fill: '#cbd5e1' }}
        transition={{ delay: 0.2 }}>(U_n, W_n)</motion.text>
      <motion.text x={140} y={172} textAnchor="middle" fontSize={22} fontWeight={800}
        initial={{ opacity: 0 }} animate={{ opacity: 1, fill: C.input }}
        transition={{ delay: 0.3 }}>~1 MB</motion.text>
      <motion.text x={140} y={200} textAnchor="middle" fontSize={9}
        initial={{ opacity: 0 }} animate={{ opacity: 0.7, fill: '#94a3b8' }}
        transition={{ delay: 0.4 }}>witness 전체 보유</motion.text>

      {/* Funnel — 사다리꼴 */}
      <motion.path d="M 240 90 L 360 130 L 360 160 L 240 200 Z"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, fill: `${C.input}10`, stroke: C.input, strokeWidth: 1, strokeDasharray: '4 2' }}
        transition={{ delay: 0.5 }} />
      <motion.text x={300} y={148} textAnchor="middle" fontSize={9} fontWeight={600}
        initial={{ opacity: 0 }} animate={{ opacity: 1, fill: C.input }}
        transition={{ delay: 0.7 }}>Spartan</motion.text>
      <motion.text x={300} y={162} textAnchor="middle" fontSize={9} fontWeight={600}
        initial={{ opacity: 0 }} animate={{ opacity: 1, fill: C.input }}
        transition={{ delay: 0.75 }}>compress</motion.text>

      {/* 작은 박스 (출력 미리보기) */}
      <motion.rect x={370} y={120} width={110} height={50} rx={8}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1, fill: `${C.opening}22`, stroke: C.opening, strokeWidth: 1.4 }}
        transition={{ ...sp, delay: 0.85 }} />
      <motion.text x={425} y={142} textAnchor="middle" fontSize={11} fontWeight={700}
        initial={{ opacity: 0 }} animate={{ opacity: 1, fill: C.opening }}
        transition={{ delay: 1.0 }}>~5 KB</motion.text>
      <motion.text x={425} y={158} textAnchor="middle" fontSize={8}
        initial={{ opacity: 0 }} animate={{ opacity: 0.8, fill: C.opening }}
        transition={{ delay: 1.05 }}>SNARK</motion.text>

      <text x={260} y={252} textAnchor="middle" fontSize={9} fill="#94a3b8">
        Relaxed R1CS witness 를 sumcheck + opening 으로 log-space 증명
      </text>
    </svg>
  );
}

/* ───────── Step 2: Sumcheck rounds — log m 칸 막대 ───────── */
function Step2() {
  const ROUNDS = 16; // log m, m ≈ 2^16
  return (
    <svg viewBox="0 0 520 280" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={260} y={26} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.sumcheck}>
        Sumcheck — log m 라운드 (m = 제약 수 ≈ 2^16)
      </text>
      <text x={260} y={46} textAnchor="middle" fontSize={9} fill="#94a3b8">
        g(x) = Ãz·B̃z − u·C̃z − Ẽ 가 부울 큐브에서 0
      </text>

      {/* 라운드 막대 — 한 칸씩 진행 */}
      {Array.from({ length: ROUNDS }).map((_, i) => {
        const x = 40 + i * 28;
        return (
          <g key={i}>
            <motion.rect x={x} y={90} width={22} height={70} rx={3}
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{
                opacity: 1, scaleY: 1,
                fill: `${C.sumcheck}30`, stroke: C.sumcheck, strokeWidth: 0.8,
              }}
              transition={{ ...sp, delay: i * 0.06 }}
              style={{ transformOrigin: `${x + 11}px 160px` }} />
            <motion.text x={x + 11} y={178} textAnchor="middle" fontSize={7}
              initial={{ opacity: 0 }} animate={{ opacity: 0.85, fill: C.sumcheck }}
              transition={{ delay: i * 0.06 + 0.1 }}>r{i}</motion.text>
            {/* challenge dot */}
            <motion.circle cx={x + 11} cy={75} r={2.5}
              initial={{ opacity: 0 }} animate={{ opacity: 1, fill: C.sumcheck }}
              transition={{ delay: i * 0.06 + 0.2 }} />
          </g>
        );
      })}
      <text x={40} y={70} fontSize={8} fill="#94a3b8">β₀</text>
      <text x={40 + (ROUNDS - 1) * 28 + 3} y={70} fontSize={8} fill="#94a3b8">β_{ROUNDS - 1}</text>

      {/* progress arrow */}
      <motion.line x1={40} y1={196} x2={40 + ROUNDS * 28 - 6} y2={196}
        stroke={C.sumcheck} strokeWidth={1.2}
        markerEnd="url(#arrSc)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, delay: 0.4 }} />
      <text x={260} y={216} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.sumcheck}>
        매 라운드: prover → 단변수 다항식, verifier → β_i challenge
      </text>
      <text x={260} y={236} textAnchor="middle" fontSize={9} fill="#94a3b8">
        16 라운드 후 한 점에서의 평가만 남음 → polynomial opening 으로 위임
      </text>
      <text x={260} y={258} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.sumcheck}>
        Verifier O(log m) — 회로 크기와 무관하게 logarithmic
      </text>

      <defs>
        <marker id="arrSc" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
          <path d="M 0 0 L 6 3 L 0 6 z" fill={C.sumcheck} />
        </marker>
      </defs>
    </svg>
  );
}

/* ───────── Step 3: Polynomial commitment opening ───────── */
function Step3() {
  return (
    <svg viewBox="0 0 520 280" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={260} y={26} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.opening}>
        Polynomial Commitment Opening — W̃, Ẽ 의 임의 점 평가
      </text>

      {/* 두 commitment 박스 */}
      <motion.rect x={50} y={70} width={150} height={90} rx={10}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0, fill: `${C.opening}15`, stroke: C.opening, strokeWidth: 1.4 }}
        transition={sp} />
      <motion.text x={125} y={96} textAnchor="middle" fontSize={11} fontWeight={700}
        initial={{ opacity: 0 }} animate={{ opacity: 1, fill: C.opening }}
        transition={{ delay: 0.15 }}>commit(W̃)</motion.text>
      <motion.text x={125} y={120} textAnchor="middle" fontSize={9}
        initial={{ opacity: 0 }} animate={{ opacity: 0.85, fill: '#cbd5e1' }}
        transition={{ delay: 0.2 }}>witness multilinear</motion.text>
      <motion.text x={125} y={142} textAnchor="middle" fontSize={9}
        initial={{ opacity: 0 }} animate={{ opacity: 0.85, fill: '#cbd5e1' }}
        transition={{ delay: 0.25 }}>extension polynomial</motion.text>

      <motion.rect x={220} y={70} width={150} height={90} rx={10}
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0, fill: `${C.opening}15`, stroke: C.opening, strokeWidth: 1.4 }}
        transition={{ ...sp, delay: 0.1 }} />
      <motion.text x={295} y={96} textAnchor="middle" fontSize={11} fontWeight={700}
        initial={{ opacity: 0 }} animate={{ opacity: 1, fill: C.opening }}
        transition={{ delay: 0.25 }}>commit(Ẽ)</motion.text>
      <motion.text x={295} y={120} textAnchor="middle" fontSize={9}
        initial={{ opacity: 0 }} animate={{ opacity: 0.85, fill: '#cbd5e1' }}
        transition={{ delay: 0.3 }}>error polynomial</motion.text>
      <motion.text x={295} y={142} textAnchor="middle" fontSize={9}
        initial={{ opacity: 0 }} animate={{ opacity: 0.85, fill: '#cbd5e1' }}
        transition={{ delay: 0.35 }}>(slack 항)</motion.text>

      {/* random point r */}
      <motion.circle cx={420} cy={115} r={26}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1, fill: `${C.opening}30`, stroke: C.opening, strokeWidth: 1.4 }}
        transition={{ ...sp, delay: 0.5 }} />
      <motion.text x={420} y={112} textAnchor="middle" fontSize={11} fontWeight={800}
        initial={{ opacity: 0 }} animate={{ opacity: 1, fill: C.opening }}
        transition={{ delay: 0.65 }}>r</motion.text>
      <motion.text x={420} y={126} textAnchor="middle" fontSize={7}
        initial={{ opacity: 0 }} animate={{ opacity: 0.85, fill: C.opening }}
        transition={{ delay: 0.7 }}>∈ F^{'{log m}'}</motion.text>

      {/* arrows */}
      <motion.line x1={200} y1={115} x2={220} y2={115} stroke={C.opening} strokeWidth={1}
        initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ delay: 0.4 }} />
      <motion.line x1={370} y1={115} x2={394} y2={115} stroke={C.opening} strokeWidth={1.2}
        markerEnd="url(#arrOp)"
        initial={{ opacity: 0 }} animate={{ opacity: 0.9 }} transition={{ delay: 0.8 }} />

      {/* opening proof box */}
      <motion.rect x={120} y={188} width={280} height={56} rx={8}
        initial={{ opacity: 0, y: 198 }}
        animate={{ opacity: 1, y: 188, fill: `${C.opening}10`, stroke: C.opening, strokeWidth: 1.2, strokeDasharray: '4 2' }}
        transition={{ ...sp, delay: 0.9 }} />
      <motion.text x={260} y={210} textAnchor="middle" fontSize={11} fontWeight={700}
        initial={{ opacity: 0 }} animate={{ opacity: 1, fill: C.opening }}
        transition={{ delay: 1.05 }}>opening proof π</motion.text>
      <motion.text x={260} y={228} textAnchor="middle" fontSize={9}
        initial={{ opacity: 0 }} animate={{ opacity: 0.85, fill: '#cbd5e1' }}
        transition={{ delay: 1.1 }}>"v = W̃(r) 가 commit(W̃) 와 일관됨"</motion.text>

      <text x={260} y={266} textAnchor="middle" fontSize={9} fill="#94a3b8">
        sumcheck 마지막에서 verifier 가 단일 평가만 확인 → opening 으로 위임
      </text>

      <defs>
        <marker id="arrOp" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
          <path d="M 0 0 L 6 3 L 0 6 z" fill={C.opening} />
        </marker>
      </defs>
    </svg>
  );
}

/* ───────── Step 4: IPA / HyperKZG compression — 박스가 작아짐 ───────── */
function Step4() {
  return (
    <svg viewBox="0 0 520 280" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={260} y={26} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.ipa}>
        IPA / HyperKZG — opening proof 압축
      </text>

      {/* before — 큰 opening proof 박스 */}
      <motion.rect x={40} y={70} width={170} height={120} rx={10}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1, fill: `${C.opening}18`, stroke: C.opening, strokeWidth: 1.4 }}
        transition={sp} />
      <motion.text x={125} y={94} textAnchor="middle" fontSize={11} fontWeight={700}
        initial={{ opacity: 0 }} animate={{ opacity: 1, fill: C.opening }}
        transition={{ delay: 0.15 }}>raw opening</motion.text>
      <motion.text x={125} y={130} textAnchor="middle" fontSize={20} fontWeight={800}
        initial={{ opacity: 0 }} animate={{ opacity: 1, fill: C.opening }}
        transition={{ delay: 0.25 }}>O(m)</motion.text>
      <motion.text x={125} y={156} textAnchor="middle" fontSize={9}
        initial={{ opacity: 0 }} animate={{ opacity: 0.8, fill: '#cbd5e1' }}
        transition={{ delay: 0.3 }}>group elements</motion.text>

      {/* arrow with label */}
      <motion.line x1={215} y1={130} x2={295} y2={130} stroke={C.ipa} strokeWidth={1.4}
        markerEnd="url(#arrIpa)"
        initial={{ opacity: 0, pathLength: 0 }}
        animate={{ opacity: 0.95, pathLength: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }} />
      <motion.text x={255} y={120} textAnchor="middle" fontSize={9} fontWeight={700}
        initial={{ opacity: 0 }} animate={{ opacity: 1, fill: C.ipa }}
        transition={{ delay: 0.7 }}>fold log m</motion.text>
      <motion.text x={255} y={148} textAnchor="middle" fontSize={8}
        initial={{ opacity: 0 }} animate={{ opacity: 0.85, fill: C.ipa }}
        transition={{ delay: 0.75 }}>recursive halving</motion.text>

      {/* after — 작은 박스 */}
      <motion.rect x={300} y={100} width={90} height={60} rx={8}
        initial={{ opacity: 0, scale: 1.4 }}
        animate={{ opacity: 1, scale: 1, fill: `${C.ipa}25`, stroke: C.ipa, strokeWidth: 1.4 }}
        transition={{ ...sp, delay: 0.9 }} />
      <motion.text x={345} y={124} textAnchor="middle" fontSize={11} fontWeight={700}
        initial={{ opacity: 0 }} animate={{ opacity: 1, fill: C.ipa }}
        transition={{ delay: 1.05 }}>compressed</motion.text>
      <motion.text x={345} y={146} textAnchor="middle" fontSize={14} fontWeight={800}
        initial={{ opacity: 0 }} animate={{ opacity: 1, fill: C.ipa }}
        transition={{ delay: 1.1 }}>O(log m)</motion.text>

      {/* two variant cards */}
      <motion.rect x={400} y={70} width={100} height={56} rx={8}
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 70, fill: `${C.ipa}10`, stroke: C.ipa, strokeWidth: 1 }}
        transition={{ ...sp, delay: 1.2 }} />
      <text x={450} y={90} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.ipa}>IPA</text>
      <text x={450} y={106} textAnchor="middle" fontSize={8} fill="#cbd5e1">no setup</text>
      <text x={450} y={120} textAnchor="middle" fontSize={8} fill="#cbd5e1">slow verify</text>

      <motion.rect x={400} y={134} width={100} height={56} rx={8}
        initial={{ opacity: 0, y: 144 }}
        animate={{ opacity: 1, y: 134, fill: `${C.ipa}10`, stroke: C.ipa, strokeWidth: 1 }}
        transition={{ ...sp, delay: 1.3 }} />
      <text x={450} y={154} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.ipa}>HyperKZG</text>
      <text x={450} y={170} textAnchor="middle" fontSize={8} fill="#cbd5e1">trusted setup</text>
      <text x={450} y={184} textAnchor="middle" fontSize={8} fill="#cbd5e1">O(1) pairing</text>

      <text x={260} y={222} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.ipa}>
        log m 라운드 folding → 최종 size = O(log m) group elements
      </text>
      <text x={260} y={244} textAnchor="middle" fontSize={9} fill="#94a3b8">
        Nova 기본 = IPA (no trusted setup), HyperKZG = 더 빠른 verifier
      </text>
      <text x={260} y={264} textAnchor="middle" fontSize={9} fill="#94a3b8">
        opening 압축이 최종 증명 크기를 결정 — KB 영역 진입
      </text>

      <defs>
        <marker id="arrIpa" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
          <path d="M 0 0 L 6 3 L 0 6 z" fill={C.ipa} />
        </marker>
      </defs>
    </svg>
  );
}

/* ───────── Step 5: ppsnark vs snark cards ───────── */
function Step5() {
  const cards = [
    {
      title: 'ppsnark', sub: '(preprocessing)', color: C.ppsnark,
      rows: [
        ['Verifier', 'O(log m)'],
        ['Proof', '~5 KB'],
        ['Setup', '회로 사전 커밋'],
        ['EVM', '가능'],
      ],
      x: 50,
    },
    {
      title: 'snark', sub: '(no preprocessing)', color: C.opening,
      rows: [
        ['Verifier', 'O(m)'],
        ['Proof', '~3 KB'],
        ['Setup', '없음 (동적 회로)'],
        ['EVM', '가스 폭주'],
      ],
      x: 280,
    },
  ];
  return (
    <svg viewBox="0 0 520 280" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={260} y={26} textAnchor="middle" fontSize={12} fontWeight={700} fill="#e2e8f0">
        Spartan 두 변형 — ppsnark vs snark
      </text>

      {cards.map((c, i) => (
        <motion.g key={c.title}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...sp, delay: 0.1 + i * 0.18 }}>
          <rect x={c.x} y={50} width={190} height={200} rx={12}
            fill={`${c.color}14`} stroke={c.color} strokeWidth={1.5} />
          <text x={c.x + 95} y={78} textAnchor="middle" fontSize={14} fontWeight={800} fill={c.color}>
            {c.title}
          </text>
          <text x={c.x + 95} y={96} textAnchor="middle" fontSize={9} fill={c.color} opacity={0.8}>
            {c.sub}
          </text>
          <line x1={c.x + 16} y1={108} x2={c.x + 174} y2={108}
            stroke={c.color} strokeWidth={0.5} opacity={0.4} />

          {c.rows.map((r, j) => (
            <g key={j}>
              <text x={c.x + 18} y={132 + j * 28} fontSize={9} fontWeight={600} fill="#94a3b8">
                {r[0]}
              </text>
              <text x={c.x + 172} y={132 + j * 28} textAnchor="end" fontSize={10}
                fontWeight={700} fill={c.color}>
                {r[1]}
              </text>
              {j < c.rows.length - 1 && (
                <line x1={c.x + 18} y1={140 + j * 28} x2={c.x + 172} y2={140 + j * 28}
                  stroke={c.color} strokeWidth={0.3} opacity={0.25} />
              )}
            </g>
          ))}
        </motion.g>
      ))}

      <motion.text x={260} y={272} textAnchor="middle" fontSize={9} fill="#94a3b8"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        on-chain 검증 = ppsnark 필수, 동적 회로/no-setup = snark
      </motion.text>
    </svg>
  );
}

/* ───────── Step 6: 최종 증명 크기 비교 막대 ───────── */
function Step6() {
  // 비례: 1MB = 1,048,576 B, 5KB = 5,120 B, 200B = 200 B
  // 시각화 위해 log scale (자연 비례면 KB/B 가 안 보임)
  // 최대 막대 길이 W_MAX 에 1MB 매핑, 다른 둘은 sqrt scale 로 보이게 함
  const W_MAX = 380;
  const items = [
    { name: 'RecursiveSNARK (그대로)', size: '~1 MB', w: W_MAX, color: C.input },
    { name: 'Spartan ppsnark', size: '~5 KB', w: W_MAX * 0.16, color: C.ppsnark },
    { name: 'Groth16 wrap', size: '~200 B', w: W_MAX * 0.04, color: C.groth },
  ];
  return (
    <svg viewBox="0 0 520 280" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={260} y={24} textAnchor="middle" fontSize={12} fontWeight={700} fill="#e2e8f0">
        최종 증명 크기 비교 (log-scale 시각화)
      </text>

      {items.map((it, i) => {
        const y = 60 + i * 60;
        return (
          <g key={it.name}>
            <text x={20} y={y + 14} fontSize={9} fontWeight={700} fill={it.color}>
              {it.name}
            </text>
            {/* track */}
            <rect x={20} y={y + 22} width={W_MAX} height={20} rx={4}
              fill="transparent" stroke="#334155" strokeWidth={0.5} strokeDasharray="2 2" />
            {/* fill */}
            <motion.rect x={20} y={y + 22} height={20} rx={4}
              fill={`${it.color}40`} stroke={it.color} strokeWidth={1.4}
              initial={{ width: 0 }} animate={{ width: it.w }}
              transition={{ ...sp, duration: 0.7, delay: 0.15 + i * 0.25 }} />
            {/* size label */}
            <motion.text x={20 + it.w + 8} y={y + 36} fontSize={11} fontWeight={800}
              initial={{ opacity: 0 }} animate={{ opacity: 1, fill: it.color }}
              transition={{ delay: 0.5 + i * 0.25 }}>
              {it.size}
            </motion.text>
          </g>
        );
      })}

      {/* compression annotations */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}>
        <line x1={20} y1={236} x2={500} y2={236} stroke="#475569" strokeWidth={0.5} />
        <text x={150} y={252} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.ppsnark}>
          1 MB → 5 KB
        </text>
        <text x={150} y={266} textAnchor="middle" fontSize={8} fill="#94a3b8">
          Spartan compress ~200×
        </text>
        <text x={370} y={252} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.groth}>
          5 KB → 200 B
        </text>
        <text x={370} y={266} textAnchor="middle" fontSize={8} fill="#94a3b8">
          Groth16 wrap ~25× (총 5,000×)
        </text>
      </motion.g>
    </svg>
  );
}

export default function SpartanFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) =>
        step === 0 ? <Step1 /> :
        step === 1 ? <Step2 /> :
        step === 2 ? <Step3 /> :
        step === 3 ? <Step4 /> :
        step === 4 ? <Step5 /> :
        <Step6 />
      }
    </StepViz>
  );
}
