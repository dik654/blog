import Overview from './railgun/Overview';
import NoteStruct from './railgun/NoteStruct';
import Shield from './railgun/Shield';
import Commitment from './railgun/Commitment';
import Nullifier from './railgun/Nullifier';
import Transact from './railgun/Transact';
import Unshield from './railgun/Unshield';
import ZKCircuit from './railgun/ZKCircuit';
import Groth16Verify from './railgun/Groth16Verify';
import Broadcaster from './railgun/Broadcaster';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './railgun/codeRefs';
import { railgunTree } from './railgun/fileTrees';

export default function RailgunArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <NoteStruct onCodeRef={sidebar.open} />
      <Shield onCodeRef={sidebar.open} />
      <Commitment onCodeRef={sidebar.open} />
      <Nullifier onCodeRef={sidebar.open} />
      <Transact onCodeRef={sidebar.open} />
      <Unshield onCodeRef={sidebar.open} />
      <ZKCircuit onCodeRef={sidebar.open} />
      <Groth16Verify onCodeRef={sidebar.open} />
      <Broadcaster onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ railgun: { name: 'railgun', type: 'dir' as const, children: railgunTree } }}
        projectMetas={{
          railgun: { id: 'railgun', label: 'RAILGUN · Solidity', badgeClass: 'bg-purple-500/10 border-purple-500 text-purple-700' },
        }}
      />
    </>
  );
}
