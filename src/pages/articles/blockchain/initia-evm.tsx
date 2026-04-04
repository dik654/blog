import Overview from './initia-evm/Overview';
import Architecture from './initia-evm/Architecture';
import EVMExecution from './initia-evm/EVMExecution';
import TxLifecycle from './initia-evm/TxLifecycle';
import Precompiles from './initia-evm/Precompiles';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './initia-evm/codeRefs';
import { minievm } from './initia-evm/fileTrees';

export default function InitiaEVMArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <Architecture onCodeRef={sidebar.open} />
      <EVMExecution onCodeRef={sidebar.open} />
      <TxLifecycle onCodeRef={sidebar.open} />
      <Precompiles onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ minievm }}
        projectMetas={{
          minievm: { id: 'minievm', label: 'MiniEVM · Go', badgeClass: 'bg-[#fef3c7] border-[#f59e0b] text-[#92400e]' },
        }}
      />
    </>
  );
}
