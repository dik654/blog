import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = {
  os: '#ef4444',
  hyper: '#f59e0b',
  tee: '#6366f1',
  micro: '#10b981',
  muted: 'var(--muted-foreground)',
};

const STEPS = [
  {
    label: 'OS·하이퍼바이저: 수천만 LOC TCB',
    body: 'Linux/Windows 커널과 하이퍼바이저는 30M LOC 규모. 통계적으로 수만 개의 잠재 버그가 존재합니다.',
  },
  {
    label: 'TEE: TCB를 600~3000배 압축',
    body: 'SGX는 enclave + SDK로 ~50K LOC. seL4는 10K LOC + 정형 검증. OS와 하이퍼바이저를 신뢰 경계에서 제외합니다.',
  },
  {
    label: '버그 확률: TCB 크기에 비례',
    body: '업계 평균 1~25 bugs/KLOC 기준. 30M LOC × 10 = 300,000개 vs 50K LOC × 1 = 50개. 검증 가능성 차이가 수천 배.',
  },
  {
    label: '트레이드오프: 보안 vs 호환성',
    body: 'SGX는 코드 재작성 필요(작은 TCB). SEV/TDX는 기존 VM 그대로(큰 TCB). 호환성을 얻는 대신 공격 표면 확대.',
  },
];

interface Row {
  name: string;
  loc: number; // log10
  raw: string;
  scope: string;
  color: string;
  highlight?: boolean;
}

const ROWS: Row[][] = [
  // Step 0
  [
    { name: 'Linux kernel', loc: 7.48, raw: '30M LOC', scope: '전체 OS', color: C.os, highlight: true },
    { name: 'Windows NT', loc: 7.7, raw: '50M LOC', scope: '전체 OS', color: C.os, highlight: true },
    { name: 'Xen hypervisor', loc: 5.3, raw: '200K LOC', scope: '가상화', color: C.hyper },
    { name: 'KVM hypervisor', loc: 5.18, raw: '150K LOC', scope: '가상화', color: C.hyper },
  ],
  // Step 1
  [
    { name: 'Linux kernel', loc: 7.48, raw: '30M LOC', scope: '비교 기준', color: C.os },
    { name: 'AMD SEV TCB', loc: 5.3, raw: '~200K LOC', scope: 'VM+fw', color: C.tee },
    { name: 'Intel TDX TCB', loc: 5.0, raw: '~100K LOC', scope: 'TD+SEAM', color: C.tee },
    { name: 'Intel SGX TCB', loc: 4.7, raw: '~50K LOC', scope: 'Enclave', color: C.tee, highlight: true },
    { name: 'ARM TZ TCB', loc: 4.48, raw: '~30K LOC', scope: 'Secure OS', color: C.tee },
    { name: 'seL4 microkernel', loc: 4.0, raw: '10K LOC', scope: '정형 검증', color: C.micro, highlight: true },
  ],
  // Step 2
  [
    { name: 'Linux (10 bugs/KLOC)', loc: 7.48, raw: '~300,000 bugs', scope: '잠재', color: C.os, highlight: true },
    { name: 'SGX (1 bug/KLOC)', loc: 4.7, raw: '~50 bugs', scope: '잠재', color: C.tee, highlight: true },
    { name: 'seL4 (검증됨)', loc: 4.0, raw: '0 bugs (proven)', scope: 'Coq/Isabelle', color: C.micro, highlight: true },
  ],
  // Step 3
  [
    { name: 'SGX', loc: 4.7, raw: '~50K LOC', scope: '코드 재작성 필요', color: C.tee },
    { name: 'SEV', loc: 5.3, raw: '~200K LOC', scope: 'Lift & Shift', color: C.hyper },
    { name: 'TDX', loc: 5.0, raw: '~100K LOC', scope: 'Lift & Shift', color: C.hyper },
    { name: 'seL4', loc: 4.0, raw: '10K LOC', scope: '검증됨', color: C.micro },
  ],
];

export default function TcbSizeViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const rows = ROWS[step];
        const maxLoc = 8;
        const rowH = 28;
        const baseY = 26;
        const labelW = 120;
        const barX = labelW + 10;
        const barMaxW = 250;
        const annoX = barX + barMaxW + 12;
        return (
          <svg viewBox={`0 0 480 ${baseY + rows.length * rowH + 14}`}
            className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <text x={10} y={14} fontSize={11} fontWeight={700} fill="var(--foreground)">
              TCB 크기 (log scale, LOC)
            </text>
            {/* axis ticks */}
            {[3, 4, 5, 6, 7, 8].map((tick) => {
              const x = barX + (tick / maxLoc) * barMaxW;
              return (
                <g key={tick}>
                  <line x1={x} y1={baseY - 6} x2={x} y2={baseY + rows.length * rowH - 4}
                    stroke="var(--border)" strokeWidth={0.4} strokeDasharray="2 2" />
                  <text x={x} y={baseY - 9} textAnchor="middle" fontSize={7.5} fill={C.muted}>
                    10^{tick}
                  </text>
                </g>
              );
            })}
            {rows.map((r, i) => {
              const y = baseY + i * rowH;
              const w = (r.loc / maxLoc) * barMaxW;
              return (
                <motion.g key={`${step}-${i}`}
                  initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}>
                  <text x={labelW} y={y + rowH / 2 + 3} textAnchor="end"
                    fontSize={9.5} fontWeight={r.highlight ? 700 : 500} fill={r.color}>
                    {r.name}
                  </text>
                  <rect x={barX} y={y + 6} width={barMaxW} height={rowH - 12}
                    rx={3} fill="var(--border)" opacity={0.18} />
                  <motion.rect x={barX} y={y + 6} height={rowH - 12} rx={3}
                    fill={r.color} opacity={r.highlight ? 0.85 : 0.55}
                    initial={{ width: 0 }} animate={{ width: w }}
                    transition={{ delay: 0.05 + i * 0.08, duration: 0.45 }} />
                  <text x={annoX} y={y + rowH / 2 - 1} fontSize={8.5}
                    fontWeight={600} fill={r.color}>{r.raw}</text>
                  <text x={annoX} y={y + rowH / 2 + 9} fontSize={7.5} fill={C.muted}>
                    {r.scope}
                  </text>
                </motion.g>
              );
            })}
          </svg>
        );
      }}
    </StepViz>
  );
}
