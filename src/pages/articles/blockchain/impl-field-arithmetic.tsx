import Overview from './impl-field-arithmetic/Overview';
import Montgomery from './impl-field-arithmetic/Montgomery';
import Extension from './impl-field-arithmetic/Extension';
import Scalar from './impl-field-arithmetic/Scalar';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './impl-field-arithmetic/codeRefs';
import { zkFieldTree } from './impl-field-arithmetic/fileTrees';

export default function ImplFieldArithmetic() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <Montgomery onCodeRef={sidebar.open} />
      <Extension onCodeRef={sidebar.open} />
      <Scalar onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ zkField: zkFieldTree }}
        projectMetas={{
          zkField: {
            id: 'zkField',
            label: 'zk_from_scratch · Rust',
            badgeClass: 'bg-[#fef3c7] border-[#f59e0b] text-[#92400e]',
          },
        }}
      />
    </>
  );
}
