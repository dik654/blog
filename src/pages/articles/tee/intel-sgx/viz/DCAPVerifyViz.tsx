import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'Quote 파싱 + PCK 체인 조회', body: 'isv_enclave_report에서 MRENCLAVE/MRSIGNER 추출. Intel PCS에서 PCK Cert → PCE Cert → Intel SGX Root CA 인증서 체인 조회.' },
  { label: 'ECDSA 서명 검증', body: 'PCK로 Quote의 ECDSA-P256 서명 검증. CPUSVN, ISVSVN이 최소 버전 이상인지 확인. MRENCLAVE/MRSIGNER 예상값 대조.' },
  { label: '신뢰 체인 확립', body: '앱 → EREPORT → QE(ECDSA) → Quote → PCK 체인 → Intel SGX Root CA. Root CA가 최종 신뢰 앵커.' },
];

const CHAIN = [
  { label: 'Quote', sub: 'ECDSA 서명', x: 60, color: '#f59e0b' },
  { label: 'PCK Cert', sub: '플랫폼 인증', x: 195, color: '#6366f1' },
  { label: 'PCE Cert', sub: '중간 인증', x: 330, color: '#6366f1' },
  { label: 'Root CA', sub: '신뢰 앵커', x: 465, color: '#10b981' },
];

export default function DCAPVerifyViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 540 145" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <text x={270} y={18} textAnchor="middle" fontSize={10} fill="var(--foreground)" fontWeight={600}>
            DCAP 검증 체인
          </text>

          {CHAIN.map((c, i) => {
            const reveal = step === 2 ? true : step === 0 ? i <= 1 : i <= 3;
            const active = step === 2 || (step === 0 && i === 0) || (step === 1 && i >= 1);
            return (
              <g key={c.label}>
                {i > 0 && (
                  <motion.line x1={CHAIN[i - 1].x + 50} y1={62}
                    x2={c.x - 50} y2={62}
                    stroke={reveal ? c.color : 'var(--border)'} strokeWidth={1.2}
                    markerEnd="url(#darr)" initial={{ pathLength: 0 }}
                    animate={{ pathLength: reveal ? 1 : 0.3 }} transition={{ delay: i * 0.1, duration: 0.3 }} />
                )}
                <motion.rect x={c.x - 46} y={36} width={92} height={50} rx={6}
                  fill={active ? `${c.color}18` : `${c.color}06`}
                  stroke={active ? c.color : `${c.color}30`}
                  strokeWidth={active ? 2 : 0.8}
                  animate={{ opacity: reveal ? (active ? 1 : 0.5) : 0.15 }} />
                <text x={c.x} y={57} textAnchor="middle" fontSize={10} fontWeight={600}
                  fill={active ? c.color : 'var(--foreground)'}>{c.label}</text>
                <text x={c.x} y={73} textAnchor="middle" fontSize={10}
                  fill="var(--muted-foreground)">{c.sub}</text>
              </g>
            );
          })}

          {step === 1 && (
            <motion.text x={270} y={110} textAnchor="middle" fontSize={10}
              fill="var(--muted-foreground)" initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}>
              MRENCLAVE + CPUSVN + ISVSVN 검증
            </motion.text>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
              <text x={270} y={110} textAnchor="middle" fontSize={10} fill="#10b981" fontWeight={600}>
                앱 → EREPORT → QE → Quote → PCK → Root CA
              </text>
              <text x={270} y={126} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
                Intel SGX Root CA = 최종 신뢰 앵커
              </text>
            </motion.g>
          )}

          <defs>
            <marker id="darr" viewBox="0 0 6 6" refX={5} refY={3}
              markerWidth={5} markerHeight={5} orient="auto-start-reverse">
              <path d="M0,0 L6,3 L0,6 Z" fill="var(--muted-foreground)" />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
