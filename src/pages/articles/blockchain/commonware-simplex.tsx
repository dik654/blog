import Overview from './commonware-simplex/Overview';
import CoreTraits from './commonware-simplex/CoreTraits';
import Engine from './commonware-simplex/Engine';
import Voting from './commonware-simplex/Voting';
import LazyVerify from './commonware-simplex/LazyVerify';
import Threshold from './commonware-simplex/Threshold';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './commonware-simplex/codeRefs';
import { commonwareTree } from './commonware-simplex/fileTrees';

export default function CommonwareSimplex() {
  const sidebar = useCodeSidebar();
  return (
    <>
      <div className="space-y-12">
        <Overview />
        <CoreTraits onCodeRef={sidebar.open} />
        <Engine onCodeRef={sidebar.open} />
        <Voting onCodeRef={sidebar.open} />
        <LazyVerify onCodeRef={sidebar.open} />
        <Threshold onCodeRef={sidebar.open} />
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
