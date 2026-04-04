import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C1 = '#6366f1', C2 = '#10b981', C3 = '#f59e0b';

const STEPS = [
  { label: '니블(nibble) 변환', body: '키의 각 16진수 문자 = 4비트 = 1 니블. 예: 키 "a7" → 니블 [a, 7]' },
  { label: 'Prefix 규칙 표', body: '첫 니블 값으로 노드 유형(Extension/Leaf)과 나머지 니블 수의 홀짝을 구분' },
  { label: '인코딩 예시: Extension "a7"', body: 'Extension + 짝수(2개) → prefix=0, 패딩=0 → 인코딩: [0, 0, a, 7]' },
  { label: '인코딩 예시: Leaf "7"', body: 'Leaf + 홀수(1개) → prefix=3, 첫 니블=7 → 인코딩: [3, 7]' },
];

const NB = ({ x, y, v, color, w = 28 }: { x: number; y: number; v: string; color: string; w?: number }) => (
  <g>
    <rect x={x} y={y} width={w} height={22} rx={3} fill={`${color}12`} stroke={color} strokeWidth={0.8} />
    <text x={x + w / 2} y={y + 14} textAnchor="middle" fontSize={9} fontWeight={500}
      fill="var(--foreground)" fontFamily="monospace">{v}</text>
  </g>
);

export default function HexPrefixViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 420 180" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={30} y={40} fontSize={9} fill="var(--foreground)">키 "a7" →</text>
              <NB x={100} y={26} v="a" color={C1} />
              <NB x={134} y={26} v="7" color={C1} />
              <text x={180} y={40} fontSize={9} fill="var(--muted-foreground)">← 2 니블</text>
              <text x={30} y={80} fontSize={9} fill="var(--foreground)">키 "1355" →</text>
              <NB x={110} y={66} v="1" color={C2} />
              <NB x={144} y={66} v="3" color={C2} />
              <NB x={178} y={66} v="5" color={C2} />
              <NB x={212} y={66} v="5" color={C2} />
              <text x={258} y={80} fontSize={9} fill="var(--muted-foreground)">← 4 니블</text>
              <text x={30} y={120} fontSize={9} fill="var(--muted-foreground)">
                1 니블 = 4비트. 1바이트 = 2 니블.
              </text>
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Table header */}
              {['prefix', '유형', '니블 수', '설명'].map((h, i) => (
                <text key={i} x={[50, 130, 220, 330][i]} y={30} textAnchor="middle"
                  fontSize={9} fontWeight={600} fill="var(--foreground)">{h}</text>
              ))}
              <line x1={20} y1={36} x2={400} y2={36} stroke="var(--border)" strokeWidth={0.5} />
              {[
                { p: '0', t: 'Extension', n: '짝수', d: '+ 패딩 0', c: C2 },
                { p: '1', t: 'Extension', n: '홀수', d: '첫 니블 포함', c: C2 },
                { p: '2', t: 'Leaf', n: '짝수', d: '+ 패딩 0', c: C3 },
                { p: '3', t: 'Leaf', n: '홀수', d: '첫 니블 포함', c: C3 },
              ].map((r, i) => (
                <g key={i}>
                  <rect x={34} y={42 + i * 28} width={30} height={20} rx={3}
                    fill={`${r.c}10`} stroke={r.c} strokeWidth={0.6} />
                  <text x={49} y={56 + i * 28} textAnchor="middle" fontSize={9} fontWeight={600}
                    fill={r.c} fontFamily="monospace">{r.p}</text>
                  <text x={130} y={56 + i * 28} textAnchor="middle" fontSize={9} fill="var(--foreground)">{r.t}</text>
                  <text x={220} y={56 + i * 28} textAnchor="middle" fontSize={9} fill="var(--foreground)">{r.n}</text>
                  <text x={330} y={56 + i * 28} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">{r.d}</text>
                </g>
              ))}
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={30} y={30} fontSize={9} fill="var(--foreground)">Extension, 경로 "a7" (짝수 2개)</text>
              <text x={30} y={60} fontSize={9} fill="var(--muted-foreground)">prefix = 0, 패딩 = 0</text>
              <text x={30} y={90} fontSize={9} fill="var(--foreground)">인코딩 결과:</text>
              <NB x={120} y={76} v="0" color={C1} />
              <NB x={154} y={76} v="0" color={C1} />
              <NB x={194} y={76} v="a" color={C2} />
              <NB x={228} y={76} v="7" color={C2} />
              <text x={126} y={114} fontSize={9} fill={C1}>prefix+pad</text>
              <text x={216} y={114} fontSize={9} fill={C2}>shared nibbles</text>
            </motion.g>
          )}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={30} y={30} fontSize={9} fill="var(--foreground)">Leaf, 경로 "7" (홀수 1개)</text>
              <text x={30} y={60} fontSize={9} fill="var(--muted-foreground)">prefix = 3, 첫 니블 = 7 (패딩 불필요)</text>
              <text x={30} y={90} fontSize={9} fill="var(--foreground)">인코딩 결과:</text>
              <NB x={120} y={76} v="3" color={C1} />
              <NB x={154} y={76} v="7" color={C3} />
              <text x={134} y={114} fontSize={9} fill={C1}>prefix</text>
              <text x={168} y={114} fontSize={9} fill={C3}>key-end</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
