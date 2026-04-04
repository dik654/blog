import Overview from './helios-execution/Overview';
import ExecutionTrace from './helios-execution/ExecutionTrace';
import RpcMethods from './helios-execution/RpcMethods';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './helios-execution/codeRefs';

export default function HeliosExecution() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <ExecutionTrace title="eth_call + gas estimation 코드 추적" onCodeRef={sidebar.open} />
      <RpcMethods title="5가지 RPC 메서드 변형" onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{}}
        projectMetas={{
          helios: { id: 'helios', label: 'Helios · Rust', badgeClass: 'bg-blue-500/10 border-blue-500 text-blue-700' },
        }}
      />
    </>
  );
}
