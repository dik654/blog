import { motion } from 'framer-motion';
import { C } from './ConvDetailVizData';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

/* ---- Step 0: 합성곱 연산 수식 ---- */
export function ConvFormula() {
  const examples = [
    { input: '224x224', k: 3, p: 1, s: 1, out: 224, note: '크기 유지' },
    { input: '224x224', k: 3, p: 1, s: 2, out: 112, note: '다운샘플링' },
    { input: '224x224', k: 7, p: 3, s: 2, out: 112, note: 'ResNet 첫 층' },
  ];

  return (
    <g>
      {/* formula box */}
      <rect x={10} y={6} width={460} height={38} rx={7}
        fill={C.conv} fillOpacity={0.06} stroke={C.conv} strokeWidth={1} />
      <text x={240} y={22} textAnchor="middle" fontSize={10} fontWeight={700}
        fill={C.conv}>Y[i,j] = Sum X[i+dx, j+dy] x K[dx, dy]</text>
      <text x={240} y={36} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
        출력 크기: H' = (H - k + 2p) / s + 1
      </text>

      {/* examples table */}
      <text x={20} y={60} fontSize={9} fontWeight={700} fill="var(--foreground)">
        입력
      </text>
      <text x={110} y={60} fontSize={9} fontWeight={700} fill="var(--foreground)">
        커널
      </text>
      <text x={160} y={60} fontSize={9} fontWeight={700} fill="var(--foreground)">
        pad
      </text>
      <text x={200} y={60} fontSize={9} fontWeight={700} fill="var(--foreground)">
        stride
      </text>
      <text x={260} y={60} fontSize={9} fontWeight={700} fill="var(--foreground)">
        출력
      </text>
      <text x={330} y={60} fontSize={9} fontWeight={700} fill="var(--foreground)">
        설명
      </text>
      <line x1={15} y1={64} x2={420} y2={64} stroke="var(--border)" strokeWidth={0.5} />

      {examples.map((e, i) => (
        <motion.g key={i}
          initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
          transition={{ ...sp, delay: i * 0.1 }}>
          <text x={20} y={78 + i * 16} fontSize={9} fill="var(--foreground)">{e.input}</text>
          <text x={110} y={78 + i * 16} fontSize={9} fill={C.conv}>{e.k}x{e.k}</text>
          <text x={160} y={78 + i * 16} fontSize={9} fill={C.dim}>{e.p}</text>
          <text x={200} y={78 + i * 16} fontSize={9} fill={C.dim}>{e.s}</text>
          <text x={260} y={78 + i * 16} fontSize={9} fontWeight={700} fill={C.conv}>{e.out}</text>
          <text x={330} y={78 + i * 16} fontSize={8} fill="var(--muted-foreground)">{e.note}</text>
        </motion.g>
      ))}

      {/* parameter count */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}>
        <rect x={10} y={125} width={220} height={30} rx={6}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={20} y={140} fontSize={9} fontWeight={600} fill="var(--foreground)">
          파라미터 = k^2 x C_in x C_out + C_out
        </text>
        <text x={20} y={152} fontSize={8} fill="var(--muted-foreground)">
          Conv2d(64, 128, k=3): 73,856
        </text>
      </motion.g>

      {/* visual mini grid */}
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.6 }}>
        <rect x={340} y={125} width={130} height={30} rx={6}
          fill={C.conv} fillOpacity={0.08} stroke={C.conv} strokeWidth={0.8} />
        <text x={405} y={140} textAnchor="middle" fontSize={9} fontWeight={600}
          fill={C.conv}>stride=2 → 해상도 1/2</text>
        <text x={405} y={152} textAnchor="middle" fontSize={8}
          fill="var(--muted-foreground)">padding=1 → 경계 보존</text>
      </motion.g>
    </g>
  );
}

/* ---- Step 1: 커널 유형과 Pooling ---- */
export function KernelAndPooling() {
  /* Sobel X kernel values */
  const sobelX = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]];
  const gauss = [[1, 2, 1], [2, 4, 2], [1, 2, 1]];

  const drawKernel = (
    data: number[][], label: string, ox: number, oy: number, color: string,
  ) => (
    <g>
      <text x={ox + 22} y={oy - 4} textAnchor="middle" fontSize={8}
        fontWeight={600} fill={color}>{label}</text>
      {data.map((row, r) =>
        row.map((v, c) => (
          <g key={`${r}-${c}`}>
            <rect x={ox + c * 16} y={oy + r * 16} width={14} height={14} rx={2}
              fill={v === 0 ? 'var(--card)' : `${color}18`}
              stroke={color} strokeWidth={0.6} />
            <text x={ox + c * 16 + 7} y={oy + r * 16 + 10} textAnchor="middle"
              fontSize={8} fill={color}>{v}</text>
          </g>
        )),
      )}
    </g>
  );

  const poolTypes = [
    { label: 'Max Pool', desc: '영역 내 최대값', color: C.pool },
    { label: 'Avg Pool', desc: '영역 평균', color: C.conv },
    { label: 'GAP', desc: '채널 전체 → 1', color: C.warn },
  ];

  return (
    <g>
      <text x={115} y={14} textAnchor="middle" fontSize={10} fontWeight={700}
        fill={C.kernel}>고전적 필터 (학습 전 수작업)</text>

      {/* kernels */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp }}>
        {drawKernel(sobelX, 'Sobel X (수평 엣지)', 14, 26, C.kernel)}
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.15 }}>
        {drawKernel(gauss, 'Gaussian (x1/16)', 100, 26, C.conv)}
      </motion.g>

      {/* CNN insight */}
      <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.3 }}>
        <rect x={10} y={82} width={215} height={68} rx={6}
          fill={C.kernel} fillOpacity={0.06} stroke={C.kernel} strokeWidth={0.8} />
        <text x={20} y={96} fontSize={9} fontWeight={700} fill={C.kernel}>
          CNN: 학습으로 자동 발견
        </text>
        <text x={20} y={112} fontSize={8} fill="var(--muted-foreground)">
          첫 층 → 엣지 감지기 (Gabor-like)
        </text>
        <text x={20} y={126} fontSize={8} fill="var(--muted-foreground)">
          중간층 → 텍스처, 패턴
        </text>
        <text x={20} y={140} fontSize={8} fill="var(--muted-foreground)">
          후반층 → 객체 부분, 의미 단위
        </text>
      </motion.g>

      {/* Right: Pooling */}
      <text x={365} y={14} textAnchor="middle" fontSize={10} fontWeight={700}
        fill={C.pool}>Pooling 종류</text>

      {poolTypes.map((p, i) => (
        <motion.g key={i}
          initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }}
          transition={{ ...sp, delay: 0.15 + i * 0.1 }}>
          <rect x={260} y={24 + i * 34} width={210} height={28} rx={6}
            fill={`${p.color}08`} stroke={p.color} strokeWidth={0.8} />
          <text x={275} y={42 + i * 34} fontSize={10} fontWeight={600}
            fill={p.color}>{p.label}</text>
          <text x={360} y={42 + i * 34} fontSize={8}
            fill="var(--muted-foreground)">{p.desc}</text>
        </motion.g>
      ))}

      {/* Padding types */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}>
        <text x={260} y={140} fontSize={9} fontWeight={600} fill="var(--foreground)">
          Padding: Zero(기본) | Reflect | Replicate
        </text>
      </motion.g>
    </g>
  );
}
