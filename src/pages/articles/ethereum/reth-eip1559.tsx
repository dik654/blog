import Overview from './reth-eip1559/Overview';
import CalcBaseFee from './reth-eip1559/CalcBaseFee';
import EffectiveTip from './reth-eip1559/EffectiveTip';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './reth-eip1559/codeRefs';
import { rethEip1559Tree } from './reth-eip1559/fileTrees';

export default function RethEip1559Article() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <CalcBaseFee onCodeRef={sidebar.open} />
      <EffectiveTip onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ reth: rethEip1559Tree }}
        projectMetas={{
          reth: { id: 'reth', label: 'Reth · Rust', badgeClass: 'bg-orange-500/10 border-orange-500 text-orange-700' },
        }}
      />
    </>
  );
}
