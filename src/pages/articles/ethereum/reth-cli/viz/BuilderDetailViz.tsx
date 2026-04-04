import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import { C, STEPS, STEP_REFS } from './BuilderDetailVizData';

function Step0() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      CLI 파싱 → NodeConfig
    </text>
    <text x={20} y={42} fontSize={10} fill={C.cli}>
      Line 1: let cli = Cli::&lt;EthereumChainSpecParser&gt;::parse()
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.cli}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: let config = cli.node_config()  // ChainSpec + DB 경로
    </motion.text>
    <motion.text x={20} y={78} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
      clap이 CLI 인수를 파싱하여 NodeConfig 생성
    </motion.text>
  </g>);
}

function Step1() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      NodeBuilder 생성
    </text>
    <text x={20} y={42} fontSize={10} fill={C.build}>
      Line 1: let builder = NodeBuilder::new(config)
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.type}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: // NodeBuilder&lt;(), ChainSpec&gt; — DB가 아직 ()
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.type}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: // 이 상태에서 launch() → 컴파일 에러
    </motion.text>
  </g>);
}

function Step2() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      node() → 3단계 체이닝
    </text>
    <text x={20} y={42} fontSize={10} fill={C.build}>
      Line 1: builder.with_types::&lt;EthereumNode&gt;()
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.comp}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2:     .with_components(components_builder)
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.comp}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3:     .with_add_ons(add_ons)  // ExEx + RPC 등록
    </motion.text>
    <motion.text x={20} y={96} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      한 줄로 types + components + add_ons 설정
    </motion.text>
  </g>);
}

function Step3() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      NodeBuilderWithComponents (최종 상태)
    </text>
    <text x={20} y={42} fontSize={10} fill={C.launch}>
      Line 1: struct NodeBuilderWithComponents&lt;T, CB, AO&gt; {'{'}
    </text>
    <motion.text x={40} y={58} fontSize={10} fill={C.launch}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
      Line 2:     components_builder: CB,  // Pool+Evm+Consensus
    </motion.text>
    <motion.text x={40} y={74} fontSize={10} fill={C.launch}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      Line 3:     add_ons: AddOns&lt;T, AO&gt;,  // ExEx, RPC hooks
    </motion.text>
    <motion.text x={20} y={90} fontSize={10} fill={C.launch}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
      Line 4: {'}'}  // 이 상태에서만 launch() 호출 가능
    </motion.text>
  </g>);
}

function Step4() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      launch() → tokio 실행
    </text>
    <text x={20} y={42} fontSize={10} fill={C.launch}>
      Line 1: let node = builder.launch().await?
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.launch}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: // 컴포넌트 빌드 → FullNode 생성
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.launch}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: node.wait_for_node_exit().await  // concurrent 실행
    </motion.text>
  </g>);
}

const R = [Step0, Step1, Step2, Step3, Step4];

export default function BuilderDetailViz({ onOpenCode }: {
  onOpenCode?: (key: string) => void;
}) {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return (
          <div className="w-full">
            <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}>
              <S />
            </svg>
            {onOpenCode && STEP_REFS[step] && (
              <div className="flex items-center gap-2 mt-3 justify-end">
                <CodeViewButton onClick={() => onOpenCode(STEP_REFS[step])} />
                <span className="text-[10px] text-muted-foreground">
                  {STEPS[step].label}
                </span>
              </div>
            )}
          </div>
        );
      }}
    </StepViz>
  );
}
