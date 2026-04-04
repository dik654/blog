import Overview from './jolt/Overview';
import Sumcheck from './jolt/Sumcheck';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './jolt/codeRefs';
import { joltTree } from './jolt/fileTrees';

export default function JoltArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <Sumcheck onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ jolt: joltTree }}
        projectMetas={{
          jolt: { id: 'jolt', label: 'Jolt · Rust', badgeClass: 'bg-[#fef3c7] border-[#f59e0b] text-[#92400e]' },
        }}
      />
    </>
  );
}
