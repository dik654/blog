import Glossary from './rollup-fundamentals/Glossary';
import Overview from './rollup-fundamentals/Overview';
import GoPatterns from './rollup-fundamentals/GoPatterns';
import PipelineStages from './rollup-fundamentals/PipelineStages';
import OptimisticRollup from './rollup-fundamentals/OptimisticRollup';
import BisectionGame from './rollup-fundamentals/BisectionGame';
import ZKRollup from './rollup-fundamentals/ZKRollup';
import Comparison from './rollup-fundamentals/Comparison';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './rollup-fundamentals/codeRefs';
import { opStackTree } from './rollup-fundamentals/opStackFileTree';

export default function RollupFundamentalsArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Glossary />
      <Overview onCodeRef={sidebar.open} />
      <GoPatterns />
      <PipelineStages onCodeRef={sidebar.open} />
      <OptimisticRollup onCodeRef={sidebar.open} />
      <BisectionGame onCodeRef={sidebar.open} />
      <ZKRollup />
      <Comparison onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ optimism: opStackTree }}
        projectMetas={{
          optimism: { id: 'optimism', label: 'OP Stack \u00b7 Go', badgeClass: 'bg-[#fef2f2] border-[#ef4444] text-[#991b1b]' },
        }}
      />
    </>
  );
}
