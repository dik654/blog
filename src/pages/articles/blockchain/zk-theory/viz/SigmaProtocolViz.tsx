import { motion, type ReactNode } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C1 = '#6366f1', C2 = '#10b981', C3 = '#f59e0b';

const STEPS = [
  { label: 'Sigma 프로토콜 3-move 구조', body: '공개 파라미터 (g, q) 공유, Prover는 비밀 x를 알고 y = gˣ를 공개한 상태.' },
  { label: '① Commit — 커밋 전송', body: 'Prover가 랜덤 r을 선택하고 a = gʳ을 전송 — 변경 불가(바인딩).' },
  { label: '② Challenge — 도전값 전송', body: 'Verifier가 CSPRNG으로 랜덤 e를 생성 — 예측 불가해야 건전성 보장.' },
  { label: '③ Response — 응답 계산', body: 'z = r + e·x 전송. r이 랜덤이므로 z만으로 비밀 x를 알 수 없다(영지식성).' },
  { label: '④ 검증 — 수식 전개', body: 'gᶻ = gʳ·(gˣ)ᵉ = a·yᵉ — 비밀 x 없이 검증 완료.' },
];

const Sup = ({ children }: { children: ReactNode }) => (
  <tspan baselineShift="super" fontSize="75%">{children}</tspan>
);

const PX = 60, VX = 360, BY = 30, MH = 32;
const ARROWS = [
  { y: BY + MH, dir: 'right' as const, color: C1, text: <>a = g<Sup>r</Sup></> },
  { y: BY + MH * 2, dir: 'left' as const, color: C2, text: <>e = 랜덤 값 (CSPRNG)</> },
  { y: BY + MH * 3, dir: 'right' as const, color: C3, text: <>z = r + e·x</> },
];

export default function SigmaProtocolViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 420 210" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <rect x={PX - 30} y={BY - 14} width={60} height={24} rx={5}
            fill={`${C1}12`} stroke={C1} strokeWidth={1} />
          <text x={PX} y={BY} textAnchor="middle" fontSize={9} fontWeight={600} fill={C1}>Prover</text>
          <rect x={VX - 30} y={BY - 14} width={60} height={24} rx={5}
            fill={`${C2}12`} stroke={C2} strokeWidth={1} />
          <text x={VX} y={BY} textAnchor="middle" fontSize={9} fontWeight={600} fill={C2}>Verifier</text>

          {ARROWS.map((m, i) => {
            const visible = step === 0 || step >= i + 1;
            const active = step === i + 1;
            const x1 = m.dir === 'right' ? PX + 35 : VX - 35;
            const x2 = m.dir === 'right' ? VX - 35 : PX + 35;
            return (
              <motion.g key={i} animate={{ opacity: visible ? 1 : 0.15 }} transition={{ duration: 0.3 }}>
                <line x1={Math.min(x1, x2)} y1={m.y} x2={Math.max(x1, x2)} y2={m.y}
                  stroke={m.color} strokeWidth={active ? 1.5 : 0.8} />
                <polygon points={m.dir === 'right'
                  ? `${x2 - 5},${m.y - 3} ${x2},${m.y} ${x2 - 5},${m.y + 3}`
                  : `${x2 + 5},${m.y - 3} ${x2},${m.y} ${x2 + 5},${m.y + 3}`}
                  fill={m.color} />
                <text x={210} y={m.y - 6} textAnchor="middle" fontSize={9}
                  fontWeight={500} fill={m.color}>{m.text}</text>
              </motion.g>
            );
          })}

          {/* 검증 수식 */}
          {step >= 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={75} y={BY + MH * 3 + 12} width={270} height={50} rx={5}
                fill={`${C2}10`} stroke={C2} strokeWidth={0.8} />
              <text x={210} y={BY + MH * 3 + 28} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">
                g<Sup>z</Sup> = g<Sup>r+ex</Sup> = g<Sup>r</Sup> · (g<Sup>x</Sup>)<Sup>e</Sup>
              </text>
              <text x={210} y={BY + MH * 3 + 42} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">
                g<Sup>r</Sup> = a(커밋),  g<Sup>x</Sup> = y(공개키) 대입
              </text>
              <text x={210} y={BY + MH * 3 + 56} textAnchor="middle" fontSize={9}
                fontWeight={600} fill={C2}>∴ g<Sup>z</Sup> = a · y<Sup>e</Sup> ✓</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
