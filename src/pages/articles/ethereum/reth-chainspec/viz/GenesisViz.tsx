import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';
import { C, STEPS, STEP_REFS } from './GenesisVizData';

function Step0() {
  return (<g>
    <DataBox x={15} y={15} w={130} h={30} label="mainnet.json" sub="include_str!" color={C.genesis} />
    <motion.line x1={150} y1={30} x2={185} y2={30} stroke={C.genesis} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <ActionBox x={190} y={12} w={105} h={36} label="serde parse" sub="Genesis struct" color={C.genesis} />
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      <ModuleBox x={315} y={8} w={85} h={42} label="MAINNET" sub="LazyLock" color={C.spec} />
    </motion.g>
    <motion.text x={210} y={68} textAnchor="middle" fontSize={8} fontFamily="monospace"
      fill="var(--muted-foreground)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
      8,893 alloc accounts (pre-sale + contracts)
    </motion.text>
  </g>);
}

function Step1() {
  const fields = ['base_fee', 'withdrawals', 'blob_gas'];
  return (<g>
    <ModuleBox x={20} y={15} w={140} h={55} label="make_genesis_header"
      sub="하드포크별 조건부 필드" color={C.header} />
    {fields.map((f, i) => (
      <motion.g key={f} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.12 }}>
        <DataBox x={190} y={10 + i * 24} w={100} h={20} label={f} color={C.header} />
      </motion.g>
    ))}
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <text x={340} y={40} fontSize={10} fill="var(--muted-foreground)">
        London/Shanghai/Cancun
      </text>
      <text x={340} y={53} fontSize={10} fill="var(--muted-foreground)">
        활성 여부로 포함 결정
      </text>
    </motion.g>
  </g>);
}

function Step2() {
  return (<g>
    <DataBox x={15} y={15} w={110} h={28} label="genesis.alloc" color={C.genesis} />
    <motion.line x1={130} y1={29} x2={160} y2={29} stroke={C.hash} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <ActionBox x={165} y={12} w={130} h={36} label="state_root_ref"
        sub="MPT root 계산" color={C.hash} />
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      <rect x={310} y={17} width={95} height={28} rx={5}
        fill={`${C.hash}12`} stroke={C.hash} strokeWidth={0.8} />
      <text x={357} y={35} textAnchor="middle" fontSize={8} fontFamily="monospace" fill={C.hash}>
        d7f8974f..
      </text>
    </motion.g>
    <motion.text x={210} y={68} textAnchor="middle" fontSize={8} fontFamily="monospace"
      fill="var(--muted-foreground)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
      0xd7f8974fb5ac78d9ac099b9ad5018bedc2ce0a72dad1827a1709da30580f0544
    </motion.text>
  </g>);
}

function Step3() {
  return (<g>
    <DataBox x={15} y={15} w={100} h={28} label="Header" color={C.header} />
    <motion.line x1={120} y1={29} x2={155} y2={29} stroke={C.spec} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <ActionBox x={160} y={12} w={115} h={36} label="SealedHeader"
        sub="해시 검증 포함" color={C.spec} />
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      <rect x={290} y={17} width={110} height={28} rx={5}
        fill={`${C.spec}12`} stroke={C.spec} strokeWidth={0.8} />
      <text x={345} y={35} textAnchor="middle" fontSize={8} fontFamily="monospace" fill={C.spec}>
        GENESIS_HASH
      </text>
    </motion.g>
    <motion.text x={210} y={68} textAnchor="middle" fontSize={8} fontFamily="monospace"
      fill="var(--muted-foreground)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
      0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3
    </motion.text>
  </g>);
}

const R = [Step0, Step1, Step2, Step3];

export default function GenesisViz({ onOpenCode }: {
  onOpenCode?: (key: string) => void;
}) {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return (
          <div className="w-full">
            <svg viewBox="0 0 420 85" className="w-full max-w-2xl" style={{ height: 'auto' }}><S /></svg>
            {onOpenCode && STEP_REFS[step] !== undefined && (
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
