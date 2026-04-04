import Overview from './commonware-broadcast/Overview';
import BroadcasterTrait from './commonware-broadcast/BroadcasterTrait';
import Ordered from './commonware-broadcast/Ordered';
import DSMR from './commonware-broadcast/DSMR';
import Zoda from './commonware-broadcast/Zoda';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './commonware-broadcast/codeRefs';
import { commonwareTree } from './commonware-broadcast/fileTrees';

export default function CommonwareBroadcast() {
  const sidebar = useCodeSidebar();
  return (
    <>
      <div className="space-y-12">
        <Overview />
        <BroadcasterTrait onCodeRef={sidebar.open} />
        <Ordered onCodeRef={sidebar.open} />
        <DSMR onCodeRef={sidebar.open} />
        <Zoda onCodeRef={sidebar.open} />
      </div>
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ commonware: commonwareTree }}
        projectMetas={{
          commonware: { id: 'commonware', label: 'Commonware · Rust', badgeClass: 'bg-orange-500/10 border-orange-500 text-orange-700' },
        }}
      />
    </>
  );
}
