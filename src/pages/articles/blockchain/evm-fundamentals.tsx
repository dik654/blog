import Overview from './evm-fundamentals/Overview';
import ExecutionFlow from './evm-fundamentals/ExecutionFlow';
import Opcodes from './evm-fundamentals/Opcodes';
import StateModel from './evm-fundamentals/StateModel';
import InterpreterLoop from './evm-fundamentals/InterpreterLoop';
import CallFlow from './evm-fundamentals/CallFlow';
import CallBranches from './evm-fundamentals/CallBranches';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './evm-fundamentals/codeRefs';
import { gethTree } from './evm-fundamentals/fileTrees';

export default function EVMFundamentals() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <ExecutionFlow onCodeRef={sidebar.open} />
      <CallFlow onCodeRef={sidebar.open} />
      <CallBranches onCodeRef={sidebar.open} />
      <InterpreterLoop onCodeRef={sidebar.open} />
      <Opcodes onCodeRef={sidebar.open} />
      <StateModel onCodeRef={sidebar.open} />
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
