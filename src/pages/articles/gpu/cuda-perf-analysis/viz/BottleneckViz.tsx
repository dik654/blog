import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { AlertBox, ActionBox } from '@/components/viz/boxes';

const STEPS = [
  {
    label: '낮은 점유율 (<25%)',
    body: '원인: 레지스터 과다, 공유 메모리 과다, 작은 블록.\n해결: --maxrregcount 옵션, 블록 크기 조정.',
  },
  {
    label: '비정렬 메모리 접근 (Uncoalesced)',
    body: '원인: 연속 스레드가 비연속 주소를 접근.\n해결: SoA 레이아웃, 접근 패턴 재설계.',
  },
  {
    label: '뱅크 충돌 (Bank Conflict)',
    body: '원인: 같은 뱅크에 동시 접근.\n해결: 패딩 (배열 크기 +1), 접근 스트라이드 변경.',
  },
  {
    label: '워프 분기 (Warp Divergence)',
    body: '원인: if-else에서 워프 내 스레드가 다른 경로.\n해결: 분기를 워프 경계에 맞추기, predication 활용.',
  },
];

const BOTTLENECKS = [
  { label: '낮은 점유율', sub: '< 25%', color: '#6366f1', fix: '--maxrregcount, 블록 크기 조정' },
  { label: '비정렬 접근', sub: 'Uncoalesced', color: '#10b981', fix: 'SoA 레이아웃' },
  { label: '뱅크 충돌', sub: '32-way 최악', color: '#f59e0b', fix: '+1 패딩' },
  { label: '워프 분기', sub: 'if-else 경로', color: '#a855f7', fix: 'predication, 경계 정렬' },
];

export default function BottleneckViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl">
          <text x={240} y={22} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
            GPU 4대 성능 병목 — 진단과 처방
          </text>

          {BOTTLENECKS.map((b, i) => {
            const x = 30 + (i % 2) * 220;
            const y = 50 + Math.floor(i / 2) * 80;
            const active = i === step;
            return (
              <motion.g key={b.label}
                initial={{ opacity: 0.3 }}
                animate={{ opacity: active ? 1 : 0.35 }}
                transition={{ duration: 0.3 }}>
                <AlertBox x={x} y={y} w={200} h={60} label={b.label} sub={b.sub} color={b.color} />
                {active && (
                  <motion.text
                    x={x + 100} y={y + 76}
                    textAnchor="middle" fontSize={8.5} fontWeight={600} fill={b.color}
                    initial={{ opacity: 0, y: y + 70 }}
                    animate={{ opacity: 1, y: y + 76 }}
                    transition={{ duration: 0.3 }}>
                    → {b.fix}
                  </motion.text>
                )}
              </motion.g>
            );
          })}

          {/* Bottom: 활성 처방 강조 */}
          <motion.g key={`fix-${step}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}>
            <ActionBox x={60} y={210} w={360} h={26} label={BOTTLENECKS[step].fix} color="#10b981" />
          </motion.g>
        </svg>
      )}
    </StepViz>
  );
}
