import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import { DataBox, ModuleBox, AlertBox } from '@/components/viz/boxes';
import { C, STEPS, STEP_REFS } from './PrimitivesDetailVizData';

function Step0() {
  return (<g>
    <text x={30} y={25} fontSize={11} fill="var(--muted-foreground)">메모리 레이아웃:</text>
    {Array.from({ length: 20 }, (_, i) => (
      <motion.rect key={i} x={30 + i * 18} y={32} width={15} height={18} rx={2}
        fill={`${C.addr}15`} stroke={C.addr} strokeWidth={0.6}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }} />
    ))}
    <text x={30} y={68} fontSize={10} fill={C.addr} fontWeight={600}>20 bytes — 스택에 인라인</text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <DataBox x={30} y={80} w={120} h={24} label="Copy + Eq + Hash" color={C.copy} />
    </motion.g>
  </g>);
}
function Step1() {
  return (<g>
    <text x={30} y={25} fontSize={11} fill="var(--muted-foreground)">메모리 레이아웃:</text>
    {Array.from({ length: 16 }, (_, i) => (
      <motion.rect key={i} x={30 + i * 22} y={32} width={18} height={18} rx={2}
        fill={`${C.hash}15`} stroke={C.hash} strokeWidth={0.6}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }} />
    ))}
    <text x={30} y={68} fontSize={10} fill={C.hash} fontWeight={600}>32 bytes (16 x 2B shown)</text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <ModuleBox x={30} y={78} w={180} h={28} label="FixedBytes<N>"
        sub="Address(20), B256(32) 공유" color={C.fixed} />
    </motion.g>
  </g>);
}
function Step2() {
  const limbs = ['limb0', 'limb1', 'limb2', 'limb3'];
  return (<g>
    {limbs.map((l, i) => (
      <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.12 }}>
        <rect x={30 + i * 90} y={30} width={75} height={30} rx={6}
          fill={`${C.u256}12`} stroke={C.u256} strokeWidth={0.8} />
        <text x={67 + i * 90} y={49} textAnchor="middle" fontSize={11} fill={C.u256}>{l}</text>
        <text x={67 + i * 90} y={70} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">u64</text>
      </motion.g>
    ))}
    <text x={210} y={95} textAnchor="middle" fontSize={11} fill={C.u256}>
      4 x u64 = 256 bits, little-endian
    </text>
  </g>);
}
function Step3() {
  return (<g>
    <AlertBox x={30} y={20} w={150} h={50} label="Go big.Int"
      sub="힙 슬라이스 + GC 오버헤드" color="#ef4444" />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <ModuleBox x={230} y={20} w={150} h={50} label="alloy U256"
        sub="스택 32B 인라인" color={C.u256} />
    </motion.g>
  </g>);
}
function Step4() {
  return (<g>
    <ModuleBox x={100} y={15} w={220} h={42} label="FixedBytes<N: usize>"
      sub="const 제네릭 — 하나의 코드로 N 크기" color={C.fixed} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <DataBox x={50} y={72} w={100} h={26} label="Address (N=20)" color={C.addr} />
      <DataBox x={260} y={72} w={100} h={26} label="B256 (N=32)" color={C.hash} />
    </motion.g>
  </g>);
}

const R = [Step0, Step1, Step2, Step3, Step4];

export default function PrimitivesDetailViz({ onOpenCode }: {
  onOpenCode?: (key: string) => void;
}) {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return (
          <div className="w-full">
            <svg viewBox="0 0 420 120" className="w-full max-w-2xl" style={{ height: 'auto' }}><S /></svg>
            {onOpenCode && STEP_REFS[step] && (
              <div className="flex items-center gap-2 mt-3 justify-end">
                <CodeViewButton onClick={() => onOpenCode(STEP_REFS[step])} />
                <span className="text-[10px] text-muted-foreground">{STEPS[step].label}</span>
              </div>
            )}
          </div>
        );
      }}
    </StepViz>
  );
}
