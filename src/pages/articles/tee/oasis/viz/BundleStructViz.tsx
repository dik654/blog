import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: '.orc 번들 파일 구조', body: 'ZIP 아카이브 형태. META-INF/MANIFEST.MF(매니페스트), runtime.elf(ELF 실행), runtime.sgxs(SGX 엔클레이브), runtime.sig(서명).' },
  { label: '매니페스트 타입 정의', body: 'ID: 런타임 식별자(Namespace). Components: RONL/ROFL 컴포넌트 목록. Digests: 파일별 무결성 해시.' },
  { label: '컴포넌트 SGX/ELF 분기', body: 'RONL: 일반 온체인 런타임. ROFL: 오프체인 런타임. 각 컴포넌트는 ELFMetadata 또는 SGXMetadata를 포함.' },
];

const FILES = [
  { name: 'MANIFEST.MF', color: '#6366f1', x: 90 },
  { name: 'runtime.elf', color: '#10b981', x: 220 },
  { name: 'runtime.sgxs', color: '#10b981', x: 350 },
  { name: 'runtime.sig', color: '#f59e0b', x: 470 },
];

export default function BundleStructViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 540 150" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* ORC bundle container */}
          <rect x={20} y={10} width={500} height={50} rx={8}
            fill={step === 0 ? '#6366f110' : '#6366f106'}
            stroke={step === 0 ? '#6366f1' : '#6366f130'}
            strokeWidth={step === 0 ? 1.8 : 0.8} />
          <text x={270} y={28} textAnchor="middle" fontSize={11} fontWeight={700}
            fill="#6366f1">runtime.orc (ZIP)</text>

          {FILES.map((f, i) => (
            <g key={f.name}>
              <motion.line x1={f.x} y1={60} x2={f.x} y2={78}
                stroke={step === 0 ? f.color : 'var(--border)'} strokeWidth={0.8}
                animate={{ opacity: step === 0 ? 1 : 0.3 }} />
              <motion.rect x={f.x - 50} y={78} width={100} height={28} rx={5}
                fill={step === 0 ? `${f.color}18` : `${f.color}06`}
                stroke={step === 0 ? f.color : `${f.color}30`}
                strokeWidth={step === 0 ? 1.5 : 0.6}
                animate={{ opacity: step === 0 ? 1 : 0.25 }} />
              <text x={f.x} y={96} textAnchor="middle" fontSize={10} fontWeight={600}
                fill={step === 0 ? f.color : 'var(--muted-foreground)'}>{f.name}</text>
            </g>
          ))}

          {/* Manifest detail for step 1 */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {[
                { label: 'ID: Namespace', x: 150 },
                { label: 'Components[]', x: 290 },
                { label: 'Digests{hash}', x: 430 },
              ].map((f) => (
                <g key={f.label}>
                  <rect x={f.x - 55} y={115} width={110} height={24} rx={4}
                    fill="#6366f114" stroke="#6366f1" strokeWidth={1} />
                  <text x={f.x} y={131} textAnchor="middle" fontSize={10} fontWeight={600}
                    fill="#6366f1">{f.label}</text>
                </g>
              ))}
            </motion.g>
          )}

          {/* Component types for step 2 */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {[
                { label: 'RONL', sub: '온체인', x: 200, c: '#10b981' },
                { label: 'ROFL', sub: '오프체인', x: 340, c: '#f59e0b' },
              ].map((c) => (
                <g key={c.label}>
                  <rect x={c.x - 50} y={115} width={100} height={28} rx={5}
                    fill={`${c.c}14`} stroke={c.c} strokeWidth={1.2} />
                  <text x={c.x} y={129} textAnchor="middle" fontSize={10} fontWeight={600}
                    fill={c.c}>{c.label}</text>
                  <text x={c.x} y={140} textAnchor="middle" fontSize={10}
                    fill="var(--muted-foreground)">{c.sub}</text>
                </g>
              ))}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
