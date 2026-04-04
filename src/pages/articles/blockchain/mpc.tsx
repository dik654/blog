import Overview from './mpc/Overview';
import Shamir from './mpc/Shamir';
import Paillier from './mpc/Paillier';
import DKG from './mpc/DKG';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './mpc/codeRefs';
import { tssLibTree } from './mpc/fileTree';

export default function MPCArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <Shamir onCodeRef={sidebar.open} />
      <Paillier onCodeRef={sidebar.open} />
      <DKG onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ 'tss-lib': tssLibTree }}
        projectMetas={{
          'tss-lib': { id: 'tss-lib', label: 'tss-lib · Go', badgeClass: 'bg-[#f0fdf4] border-[#22c55e] text-[#166534]' },
        }}
      />
    </>
  );
}
