import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = { cons: '#6366f1', root: '#8b5cf6', para: '#10b981', tee: '#f59e0b', key: '#ef4444' };

const LAYERS = [
  { y: 10, label: '합의 계층', items: ['밸리데이터 (CometBFT)', '레지스트리', '루트해시'], color: C.cons },
  { y: 70, label: 'ParaTime 계층', items: ['Sapphire (EVM+SGX)', 'Cipher (WASM+SGX)', 'Emerald (공개 EVM)'], color: C.para },
  { y: 130, label: 'TEE 실행 계층', items: ['SGX 컴퓨트 워커', '키 매니저 (SGX)'], color: C.tee },
];

const STEPS = [
  { label: '전체 아키텍처' }, { label: '합의 계층' },
  { label: 'ParaTime 연결' }, { label: 'TEE 실행' },
];
const ANNOT = ['2계층 분리 구조', 'CometBFT 블록 합의', '루트해시 앵커링', 'SGX 워커 내 TX 실행'];

const active = (step: number, i: number) => {
  if (step === 0) return true;
  if (step === 1) return i === 0;
  if (step === 2) return i <= 1;
  return i >= 1;
};

export default function OasisArchFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 440 190" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="oarr" markerWidth="5" markerHeight="4" refX="4" refY="2" orient="auto">
              <polygon points="0 0,5 2,0 4" fill="var(--muted-foreground)" opacity={0.5} />
            </marker>
          </defs>

          {LAYERS.map((l, i) => {
            const on = active(step, i);
            return (
              <motion.g key={l.label} initial={{ opacity: 0 }} animate={{ opacity: on ? 1 : 0.15 }} transition={{ duration: 0.3 }}>
                <rect x={15} y={l.y} width={310} height={50} rx={6}
                  fill={l.color + '12'} stroke={l.color} strokeWidth={on ? 1.8 : 0.8} />
                <text x={25} y={l.y + 18} fontSize={10} fontWeight={600} fill={l.color}>{l.label}</text>
                {/* items as pills */}
                {l.items.map((item, j) => {
                  const px = 25 + j * 102;
                  return (
                    <g key={j}>
                      <rect x={px} y={l.y + 26} width={96} height={18} rx={4} fill={l.color + '20'} stroke={l.color} strokeWidth={0.6} />
                      <text x={px + 48} y={l.y + 38} textAnchor="middle" fontSize={10} fontWeight={600} fill={l.color}>{item}</text>
                    </g>
                  );
                })}
                {/* Down arrow */}
                {i < LAYERS.length - 1 && (
                  <line x1={170} y1={l.y + 50} x2={170} y2={l.y + 70}
                    stroke={l.color} strokeWidth={1.2} markerEnd="url(#oarr)" opacity={on ? 0.5 : 0.15} />
                )}
              </motion.g>
            );
          })}

          {/* TEE badge at step 3 */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.9 }} transition={{ delay: 0.2 }}>
              <rect x={240} y={170} width={75} height={16} rx={3} fill={C.key + '22'} stroke={C.key} strokeWidth={1} />
              <text x={277} y={181} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.key}>키 매니저 연동</text>
            </motion.g>
          )}
          <motion.text x={345} y={95} fontSize={10} fill="var(--foreground)"
            initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>{ANNOT[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
