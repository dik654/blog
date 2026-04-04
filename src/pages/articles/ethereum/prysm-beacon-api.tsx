import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './prysm-beacon-api/codeRefs';
import { prysmTree } from './prysm-beacon-api/fileTrees';
import Overview from './prysm-beacon-api/Overview';
import GrpcServer from './prysm-beacon-api/GrpcServer';
import RestGateway from './prysm-beacon-api/RestGateway';
import ValidatorApi from './prysm-beacon-api/ValidatorApi';

export default function PrysmBeaconApi() {
  const sidebar = useCodeSidebar();
  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <GrpcServer onCodeRef={sidebar.open} />
      <RestGateway onCodeRef={sidebar.open} />
      <ValidatorApi onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ prysm: prysmTree }}
        projectMetas={{
          prysm: { id: 'prysm', label: 'Prysm · Go', badgeClass: 'bg-violet-500/10 border-violet-500 text-violet-700' },
        }}
      />
    </>
  );
}
