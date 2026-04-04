import CreateFlow from './evm-fundamentals/CreateFlow';
import DelegateStaticCall from './evm-fundamentals/DelegateStaticCall';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './evm-fundamentals/codeRefs';
import { gethTree } from './evm-fundamentals/fileTrees';

export default function EVMAdvanced() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <CreateFlow onCodeRef={sidebar.open} />
      <DelegateStaticCall onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ geth: gethTree }}
        projectMetas={{
          geth: { id: 'geth', label: 'go-ethereum · Go', badgeClass: 'bg-[#e0f2fe] border-[#0ea5e9] text-[#0369a1]' },
        }}
      />
    </>
  );
}
