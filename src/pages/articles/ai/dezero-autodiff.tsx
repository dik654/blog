import Overview from './dezero-autodiff/Overview';
import Forward from './dezero-autodiff/Forward';
import Backward from './dezero-autodiff/Backward';
import HigherOrder from './dezero-autodiff/HigherOrder';
import Memory from './dezero-autodiff/Memory';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './dezero-autodiff/codeRefs';
import { dezeroTree } from './dezero-autodiff/fileTrees';

export default function DezeroAutodiff() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <Forward onCodeRef={sidebar.open} />
      <Backward onCodeRef={sidebar.open} />
      <HigherOrder onCodeRef={sidebar.open} />
      <Memory onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ dezero: dezeroTree }}
        projectMetas={{
          dezero: {
            id: 'dezero',
            label: 'dezero_rs · Rust',
            badgeClass: 'bg-[#fef3c7] border-[#f59e0b] text-[#92400e]',
          },
        }}
      />
    </>
  );
}
