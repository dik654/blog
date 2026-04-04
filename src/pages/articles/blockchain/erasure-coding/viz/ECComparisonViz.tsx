import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = ['#6366f1', '#10b981', '#f59e0b'];
const SCHEMES = [
  { label: 'Reed-Solomon', rate: 85, decode: 90, complexity: 70, color: C[0] },
  { label: 'Fountain (LT)', rate: 60, decode: 75, complexity: 30, color: C[1] },
  { label: 'LDPC', rate: 75, decode: 65, complexity: 40, color: C[2] },
];
const ATTRS = ['코딩 효율', '복구 능력', '디코딩 복잡도'];
const STEPS = [
  { label: '세 가지 이레이저 코딩 비교', body: 'RS, Fountain, LDPC — 각각의 트레이드오프를 비교합니다.' },
  { label: 'Reed-Solomon: 최적 복구, 높은 복잡도', body: 'RS는 MDS 코드로 최적 복구율. 그러나 O(n^2) 디코딩 복잡도.' },
  { label: 'Fountain Code: Rateless, 낮은 복잡도', body: 'Fountain은 무한 패리티 생성 가능. 비율 제한 없어 유연하지만 오버헤드 발생.' },
  { label: 'LDPC: 통신 표준, 균형', body: 'LDPC는 5G/WiFi 표준. 희소 행렬로 빠른 디코딩. 블록체인에선 제한적.' },
];
const BX = [60, 190, 320], BY = 28, BW = 100, BH = 30;

export default function ECComparisonViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 140" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {SCHEMES.map((s, i) => {
            const active = step === i + 1;
            const vals = [s.rate, s.decode, s.complexity];
            return (
              <g key={s.label}>
                <motion.rect x={BX[i] - BW / 2} y={BY - BH / 2} width={BW} height={BH}
                  rx={5} animate={{
                    fill: `${s.color}${active ? '22' : '0c'}`,
                    stroke: s.color, strokeWidth: active ? 2 : 1,
                    opacity: step === 0 || active ? 1 : 0.25,
                  }} />
                <text x={BX[i]} y={BY} textAnchor="middle" fontSize={9}
                  fontWeight={600} fill={s.color}>{s.label}</text>
                <text x={BX[i]} y={BY + 10} textAnchor="middle" fontSize={9}
                  fill="var(--muted-foreground)">
                  {i === 0 ? 'MDS' : i === 1 ? 'Rateless' : 'Sparse'}
                </text>
                {vals.map((v, ai) => {
                  const barY = 58 + ai * 24;
                  return (
                    <g key={ai}>
                      {i === 0 && (
                        <text x={6} y={barY + 8} fontSize={9}
                          fill="var(--muted-foreground)">{ATTRS[ai]}</text>
                      )}
                      <motion.rect x={BX[i] - 40} y={barY} height={12} rx={3}
                        animate={{
                          width: (step === 0 || active) ? v * 0.8 : 25,
                          opacity: step === 0 || active ? 1 : 0.25,
                        }}
                        fill={`${s.color}${active ? '50' : '25'}`} />
                    </g>
                  );
                })}
              </g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
