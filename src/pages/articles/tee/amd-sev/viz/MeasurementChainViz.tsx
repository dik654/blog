import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = { indigo: '#6366f1', green: '#10b981', amber: '#f59e0b' };

const PAGES = ['펌웨어', 'BIOS', '부트로더', '커널'];

const STEPS = [
  { label: '다이제스트 초기화', body: 'launch_digest = SHA-384("") — 빈 문자열의 해시로 시작' },
  { label: '페이지별 해시 축적', body: 'launch_digest = SHA-384(launch_digest || gpa || page_type || page_data)' },
  { label: '전체 부트 체인 측정', body: '펌웨어 → BIOS → 부트로더 → 커널 이미지까지 누적 해시' },
  { label: 'Attestation Report에 포함', body: '최종 launch_digest → SNP Report의 MEASUREMENT 필드 → 원격 verifier가 비교 검증' },
];

export default function MeasurementChainViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 540 140" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Hash chain */}
          <motion.g animate={{ opacity: step === 0 ? 1 : 0.3 }}>
            <rect x={20} y={20} width={110} height={32} rx={6}
              fill={`${C.indigo}15`} stroke={C.indigo} strokeWidth={1.3} />
            <text x={75} y={40} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.indigo}>SHA-384("")</text>
          </motion.g>
          {/* Pages */}
          {PAGES.map((p, i) => {
            const x = 150 + i * 95;
            const active = step >= 1 && (step === 1 ? true : step >= 2);
            const pageActive = step === 2 ? true : (step === 1 && i === 0);
            return (
              <motion.g key={p} animate={{ opacity: pageActive ? 1 : step >= 1 ? 0.3 : 0.12 }}>
                {/* Arrow from previous */}
                {i === 0 && (
                  <line x1={130} y1={36} x2={x} y2={36} stroke={active ? C.green : '#88888840'} strokeWidth={1} markerEnd="url(#mcArr)" />
                )}
                {i > 0 && (
                  <line x1={x - 15} y1={36} x2={x} y2={36} stroke={active ? C.green : '#88888840'} strokeWidth={1} markerEnd="url(#mcArr)" />
                )}
                <rect x={x} y={14} width={80} height={24} rx={5}
                  fill={pageActive ? `${C.green}15` : 'var(--card)'}
                  stroke={pageActive ? C.green : '#88888840'} strokeWidth={pageActive ? 1.3 : 0.8} />
                <text x={x + 40} y={30} textAnchor="middle" fontSize={10} fontWeight={500} fill={pageActive ? C.green : 'var(--muted-foreground)'}>{p}</text>
                {/* Hash operation */}
                <rect x={x + 5} y={46} width={70} height={18} rx={3}
                  fill={pageActive ? `${C.indigo}10` : 'transparent'} />
                <text x={x + 40} y={58} textAnchor="middle" fontSize={10} fill={pageActive ? C.indigo : 'var(--muted-foreground)'}>SHA-384(d||p)</text>
              </motion.g>
            );
          })}
          {/* Final measurement */}
          <motion.g animate={{ opacity: step === 3 ? 1 : 0.12 }}>
            <rect x={150} y={85} width={370} height={36} rx={6}
              fill={`${C.amber}12`} stroke={C.amber} strokeWidth={step === 3 ? 1.5 : 0.8} />
            <text x={200} y={105} fontSize={10} fontWeight={600} fill={C.amber}>MEASUREMENT</text>
            <text x={340} y={105} fontSize={10} fill="var(--muted-foreground)">= launch_digest [48 bytes] → Attestation Report</text>
            {step === 3 && (
              <motion.line x1={335} y1={64} x2={335} y2={85} stroke={C.amber} strokeWidth={1.2}
                strokeDasharray="4 3" markerEnd="url(#mcArrA)" initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} />
            )}
          </motion.g>
          <defs>
            <marker id="mcArr" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
              <path d="M0,0 L6,3 L0,6" fill={C.green} />
            </marker>
            <marker id="mcArrA" markerWidth={6} markerHeight={6} refX={3} refY={0} orient="auto">
              <path d="M0,0 L3,6 L6,0" fill={C.amber} />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
