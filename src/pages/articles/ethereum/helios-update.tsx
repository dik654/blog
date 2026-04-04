import Overview from './helios-update/Overview';
import UpdateTrace from './helios-update/UpdateTrace';
import ForkChoice from './helios-update/ForkChoice';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './helios-update/codeRefs';
import { heliosTree } from './helios-update/fileTrees';

export default function HeliosUpdateArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <UpdateTrace title="validate + apply 코드 추적" onCodeRef={sidebar.open} />
      <ForkChoice title="최선 Update 선택 + Reorg 처리" onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ helios: heliosTree }}
        projectMetas={{
          helios: { id: 'helios', label: 'Helios · Rust', badgeClass: 'bg-blue-500/10 border-blue-500 text-blue-700' },
        }}
      />
    </>
  );
}
