import Overview from './impl-elliptic-curve/Overview';
import G1Ops from './impl-elliptic-curve/G1Ops';
import G2Ops from './impl-elliptic-curve/G2Ops';
import Pairing from './impl-elliptic-curve/Pairing';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './impl-elliptic-curve/codeRefs';
import { zkCurveTree } from './impl-elliptic-curve/fileTrees';

export default function ImplEllipticCurve() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <G1Ops onCodeRef={sidebar.open} />
      <G2Ops onCodeRef={sidebar.open} />
      <Pairing onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ zkCurve: zkCurveTree }}
        projectMetas={{
          zkCurve: {
            id: 'zkCurve',
            label: 'zk_from_scratch · Rust',
            badgeClass: 'bg-[#fef3c7] border-[#f59e0b] text-[#92400e]',
          },
        }}
      />
    </>
  );
}
