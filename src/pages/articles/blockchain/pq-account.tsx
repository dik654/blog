import Overview from './pq-account/Overview';
import UserOpStruct from './pq-account/UserOpStruct';
import EntryPointSection from './pq-account/EntryPointSection';
import ValidateSection from './pq-account/ValidateSection';
import ExecuteSection from './pq-account/ExecuteSection';
import DilithiumKeygen from './pq-account/DilithiumKeygen';
import DilithiumSign from './pq-account/DilithiumSign';
import DilithiumVerify from './pq-account/DilithiumVerify';
import HybridMigration from './pq-account/HybridMigration';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './pq-account/codeRefs';
import { entryPointTree, dilithiumTree } from './pq-account/pqFileTree';

export default function PqAccountArticle() {
  const sidebar = useCodeSidebar();
  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <UserOpStruct />
      <EntryPointSection onCodeRef={sidebar.open} />
      <ValidateSection onCodeRef={sidebar.open} />
      <ExecuteSection onCodeRef={sidebar.open} />
      <DilithiumKeygen onCodeRef={sidebar.open} />
      <DilithiumSign onCodeRef={sidebar.open} />
      <DilithiumVerify onCodeRef={sidebar.open} />
      <HybridMigration />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ erc4337: entryPointTree, dilithium: dilithiumTree }}
        projectMetas={{
          pq: { id: 'pq', label: 'PQ \u00b7 Solidity/Go', badgeClass: 'bg-purple-500/10 border-purple-500 text-purple-700' },
        }}
      />
    </>
  );
}
