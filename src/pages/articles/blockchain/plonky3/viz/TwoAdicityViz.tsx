import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const FIELDS = [
  { name: 'BabyBear',   adicity: 27, color: '#10b981', maxFFT: '2^27', note: 'zkVM 표준' },
  { name: 'KoalaBear',  adicity: 24, color: '#84cc16', maxFFT: '2^24', note: 'zkVM 변형' },
  { name: 'Mersenne31', adicity:  1, color: '#6366f1', maxFFT: '2^1',  note: 'Circle FFT 필요' },
  { name: 'Goldilocks', adicity: 32, color: '#f59e0b', maxFFT: '2^32', note: '64-bit 여유' },
];

const MAX_ADICITY = 32;

const STEPS = [
  {
    label: '① 2-adicity 정의',
    body: '2-adicity = p-1 을 나누는 2의 최대 거듭제곱 지수.\n예: BabyBear p-1 = 2^27 × k (k 홀수) → 2-adicity = 27.\nFFT 도메인 크기의 상한을 결정한다.',
  },
  {
    label: '② 4 필드 2-adicity 비교',
    body: 'Goldilocks(32) > BabyBear(27) > KoalaBear(24) ≫ Mersenne31(1).\nMersenne prime 은 p-1 = 2^31-2 = 2×(2^30-1) 로 2-adicity 가 1 에 불과.',
  },
  {
    label: '③ Max FFT size 한계',
    body: 'max FFT size = 2^(2-adicity).\nBabyBear 2^27 ≈ 1.3억, Goldilocks 2^32 ≈ 43억.\nMersenne31 은 2^1 뿐 → 일반 NTT 불가, Circle FFT 기법으로 우회.',
  },
  {
    label: '④ Use case 매핑',
    body: 'zkVM (2^20~2^24 trace) → BabyBear/KoalaBear.\nLarge circuit + 64-bit 편의 → Goldilocks.\nNovel math / 빠른 reduction → Mersenne31 (Circle STARKs).',
  },
];

export default function TwoAdicityViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <DefinitionScene />}
          {step === 1 && <AdicityBarsScene />}
          {step === 2 && <FFTLimitScene />}
          {step === 3 && <UseCaseScene />}
        </svg>
      )}
    </StepViz>
  );
}

function DefinitionScene() {
  return (
    <g>
      <motion.rect x={40} y={30} width={400} height={50} rx={6}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
        fill="#10b98112" stroke="#10b981" strokeWidth={1} />
      <text x={240} y={52} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">
        BabyBear: p - 1 = 2^27 × k
      </text>
      <text x={240} y={70} textAnchor="middle" fontSize={9} fill="#10b981" opacity={0.75}>
        (k 는 홀수, 2 로 더 나누어지지 않는 부분)
      </text>

      <motion.g
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}>
        <rect x={60} y={100} width={140} height={44} rx={5} fill="#6366f112" stroke="#6366f1" strokeWidth={1} />
        <text x={130} y={118} textAnchor="middle" fontSize={9} fontWeight={700} fill="#6366f1">2 의 거듭제곱 인수</text>
        <text x={130} y={134} textAnchor="middle" fontSize={11} fontWeight={700} fill="#6366f1">2^27</text>
      </motion.g>

      <motion.g
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}>
        <rect x={280} y={100} width={140} height={44} rx={5} fill="#f59e0b12" stroke="#f59e0b" strokeWidth={1} />
        <text x={350} y={118} textAnchor="middle" fontSize={9} fontWeight={700} fill="#f59e0b">2-adicity</text>
        <text x={350} y={134} textAnchor="middle" fontSize={11} fontWeight={700} fill="#f59e0b">= 27</text>
      </motion.g>

      <motion.line x1={200} y1={122} x2={280} y2={122}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, delay: 0.45 }}
        stroke="#64748b" strokeWidth={1} strokeDasharray="3 2" />
      <motion.text x={240} y={118} textAnchor="middle" fontSize={8} fill="#64748b"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.6 }}>
        지수 추출
      </motion.text>

      <text x={240} y={176} textAnchor="middle" fontSize={9} fill="#94a3b8">
        FFT 도메인 크기 상한을 결정하는 핵심 파라미터
      </text>
    </g>
  );
}

function AdicityBarsScene() {
  const X0 = 110, Y0 = 28, BW = 300, H = 22, GAP = 12;
  return (
    <g>
      <text x={240} y={16} textAnchor="middle" fontSize={9} fontWeight={700} fill="#94a3b8">
        2-adicity 비교 (p - 1 의 2 의 거듭제곱 지수)
      </text>
      {FIELDS.map((f, i) => {
        const y = Y0 + i * (H + GAP);
        const w = (f.adicity / MAX_ADICITY) * BW;
        return (
          <g key={f.name}>
            <text x={X0 - 8} y={y + H / 2 + 3} textAnchor="end" fontSize={9} fontWeight={700} fill={f.color}>
              {f.name}
            </text>
            <rect x={X0} y={y} width={BW} height={H} rx={3} fill={f.color + '08'} stroke={f.color + '25'} strokeWidth={0.5} />
            <motion.rect x={X0} y={y} height={H} rx={3}
              initial={{ width: 0 }} animate={{ width: w }}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.08 }}
              fill={f.color + '33'} stroke={f.color} strokeWidth={1} />
            <motion.text x={X0 + w + 6} y={y + H / 2 + 3} fontSize={10} fontWeight={700} fill={f.color}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.4 + i * 0.08 }}>
              {f.adicity}
            </motion.text>
          </g>
        );
      })}
      <text y={192} fontSize={7} fill="#94a3b8">
        <tspan x={X0}>0</tspan>
        <tspan x={X0 + BW / 2} textAnchor="middle">16</tspan>
        <tspan x={X0 + BW} textAnchor="end">32</tspan>
      </text>
    </g>
  );
}

function FFTLimitScene() {
  const X0 = 110, Y0 = 26, BW = 300, H = 22, GAP = 12;
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fontWeight={700} fill="#94a3b8">
        Max FFT size = 2^(2-adicity)
      </text>
      {FIELDS.map((f, i) => {
        const y = Y0 + i * (H + GAP);
        const w = (f.adicity / MAX_ADICITY) * BW;
        const isMersenne = f.name === 'Mersenne31';
        return (
          <g key={f.name}>
            <text x={X0 - 8} y={y + H / 2 + 3} textAnchor="end" fontSize={9} fontWeight={700} fill={f.color}>
              {f.name}
            </text>
            <rect x={X0} y={y} width={BW} height={H} rx={3} fill={f.color + '08'} stroke={f.color + '25'}
              strokeWidth={0.5} strokeDasharray={isMersenne ? '3 2' : undefined} />
            <motion.rect x={X0} y={y} height={H} rx={3}
              initial={{ width: 0 }} animate={{ width: Math.max(w, 4) }}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.08 }}
              fill={f.color + (isMersenne ? '22' : '33')} stroke={f.color} strokeWidth={1}
              strokeDasharray={isMersenne ? '3 2' : undefined} />
            <motion.text x={X0 + Math.max(w, 4) + 6} y={y + H / 2 + 3} fontSize={10} fontWeight={700} fill={f.color}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.4 + i * 0.08 }}>
              {f.maxFFT}
            </motion.text>
            {isMersenne && (
              <motion.text x={X0 + BW - 4} y={y + H / 2 + 3} textAnchor="end" fontSize={8} fontWeight={700} fill="#ef4444"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.8 }}>
                ⚠ Circle FFT 필요
              </motion.text>
            )}
          </g>
        );
      })}
      <text x={240} y={192} textAnchor="middle" fontSize={8} fill="#94a3b8">
        zkVM trace 2^20~2^24 행 → BabyBear(2^27) / Goldilocks(2^32) 충분
      </text>
    </g>
  );
}

function UseCaseScene() {
  const cases = [
    {
      title: 'zkVM',
      desc: '2^20~2^24 trace',
      x: 20, color: '#10b981',
      fields: ['BabyBear', 'KoalaBear'],
    },
    {
      title: 'Large circuit',
      desc: '64-bit 여유',
      x: 180, color: '#f59e0b',
      fields: ['Goldilocks'],
    },
    {
      title: 'Circle STARK',
      desc: 'Novel math',
      x: 340, color: '#6366f1',
      fields: ['Mersenne31'],
    },
  ];
  const fieldY: Record<string, number> = { BabyBear: 130, KoalaBear: 160, Goldilocks: 130, Mersenne31: 130 };
  const fieldX: Record<string, number> = { BabyBear: 55, KoalaBear: 55, Goldilocks: 215, Mersenne31: 375 };

  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fontWeight={700} fill="#94a3b8">
        Use case → 필드 선택
      </text>
      {cases.map((c, i) => (
        <motion.g key={c.title}
          initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 + i * 0.1 }}>
          <rect x={c.x} y={26} width={120} height={46} rx={6}
            fill={c.color + '14'} stroke={c.color} strokeWidth={1} />
          <text x={c.x + 60} y={46} textAnchor="middle" fontSize={11} fontWeight={700} fill={c.color}>
            {c.title}
          </text>
          <text x={c.x + 60} y={62} textAnchor="middle" fontSize={8} fill={c.color} opacity={0.7}>
            {c.desc}
          </text>
        </motion.g>
      ))}

      {cases.flatMap((c, ci) =>
        c.fields.map((fname, fi) => {
          const f = FIELDS.find((x) => x.name === fname)!;
          const fx = fieldX[fname];
          const fy = fieldY[fname];
          return (
            <g key={fname}>
              <motion.line x1={c.x + 60} y1={72} x2={fx + 50} y2={fy}
                stroke={c.color} strokeWidth={1} strokeDasharray="3 2"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.55 }}
                transition={{ duration: 0.4, delay: 0.4 + ci * 0.1 + fi * 0.05 }} />
              <motion.g
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.55 + ci * 0.1 + fi * 0.05 }}>
                <rect x={fx} y={fy} width={100} height={26} rx={5}
                  fill={f.color + '18'} stroke={f.color} strokeWidth={1} />
                <text x={fx + 50} y={fy + 13} textAnchor="middle" fontSize={10} fontWeight={700} fill={f.color}>
                  {f.name}
                </text>
                <text x={fx + 50} y={fy + 22} textAnchor="middle" fontSize={7} fill={f.color} opacity={0.7}>
                  2-adic {f.adicity} · {f.maxFFT}
                </text>
              </motion.g>
            </g>
          );
        })
      )}

      <text x={240} y={194} textAnchor="middle" fontSize={8} fill="#94a3b8">
        2-adicity 가 작을수록 FFT 전략 재설계 필요, 클수록 회로 크기 여유
      </text>
    </g>
  );
}
