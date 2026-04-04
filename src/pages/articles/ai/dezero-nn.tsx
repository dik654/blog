import Overview from './dezero-nn/Overview';
import LinearLayer from './dezero-nn/LinearLayer';
import Activation from './dezero-nn/Activation';
import Optimizer from './dezero-nn/Optimizer';
import Training from './dezero-nn/Training';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './dezero-nn/codeRefs';
import { dezeroTree } from './dezero-nn/fileTrees';

export default function DezeroNn() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <LinearLayer onCodeRef={sidebar.open} />
      <Activation onCodeRef={sidebar.open} />
      <Optimizer onCodeRef={sidebar.open} />
      <Training onCodeRef={sidebar.open} />
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
