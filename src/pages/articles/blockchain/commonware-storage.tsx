import Overview from './commonware-storage/Overview';
import MMR from './commonware-storage/MMR';
import AdbAny from './commonware-storage/AdbAny';
import AdbCurrent from './commonware-storage/AdbCurrent';
import QMDB from './commonware-storage/QMDB';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './commonware-storage/codeRefs';
import { commonwareStorageTree } from './commonware-storage/fileTrees';

export default function CommonwareStorageArticle() {
  const sidebar = useCodeSidebar();
  return (
    <>
      <div className="space-y-12">
        <Overview onCodeRef={sidebar.open} />
        <MMR onCodeRef={sidebar.open} />
        <AdbAny onCodeRef={sidebar.open} />
        <AdbCurrent onCodeRef={sidebar.open} />
        <QMDB onCodeRef={sidebar.open} />
      </div>
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ commonware: commonwareStorageTree }}
        projectMetas={{
          commonware: { id: 'commonware', label: 'Commonware · Rust', badgeClass: 'bg-orange-500/10 border-orange-500 text-orange-700' },
        }}
      />
    </>
  );
}
