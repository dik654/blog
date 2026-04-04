import Overview from './impl-groth16/Overview';
import Setup from './impl-groth16/Setup';
import Prove from './impl-groth16/Prove';
import Verify from './impl-groth16/Verify';
import Circuit from './impl-groth16/Circuit';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './impl-groth16/codeRefs';
import { zkGroth16Tree } from './impl-groth16/fileTrees';

export default function ImplGroth16() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <Setup onCodeRef={sidebar.open} />
      <Prove onCodeRef={sidebar.open} />
      <Verify onCodeRef={sidebar.open} />
      <Circuit onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ zkGroth16: zkGroth16Tree }}
        projectMetas={{
          zkGroth16: {
            id: 'zkGroth16',
            label: 'zk_from_scratch · Rust',
            badgeClass: 'bg-[#fef3c7] border-[#f59e0b] text-[#92400e]',
          },
        }}
      />
    </>
  );
}
