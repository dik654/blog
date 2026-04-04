import Overview from './filecoin-fvm/Overview';
import WasmRuntime from './filecoin-fvm/WasmRuntime';
import BuiltinActors from './filecoin-fvm/BuiltinActors';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './filecoin-fvm/codeRefs';
import { fvmTree } from './filecoin-fvm/fileTrees';

export default function FilecoinFvmArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <WasmRuntime onCodeRef={sidebar.open} />
      <BuiltinActors onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ ref_fvm: fvmTree }}
        projectMetas={{
          ref_fvm: { id: 'ref_fvm', label: 'ref-fvm · Rust', badgeClass: 'bg-cyan-500/10 border-cyan-500 text-cyan-700' },
        }}
      />
    </>
  );
}
