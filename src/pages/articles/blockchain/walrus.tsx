import Overview from './walrus/Overview';
import Encoding from './walrus/Encoding';
import Recovery from './walrus/Recovery';
import RedStuffProtocol from './walrus/RedStuffProtocol';
import SliverDistribution from './walrus/SliverDistribution';
import SuiIntegration from './walrus/SuiIntegration';
import Performance from './walrus/Performance';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './walrus/codeRefs';
import { walrusTree } from './walrus/fileTrees';

export default function WalrusArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <Encoding onCodeRef={sidebar.open} />
      <Recovery />
      <RedStuffProtocol onCodeRef={sidebar.open} />
      <SliverDistribution />
      <SuiIntegration />
      <Performance />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ 'walrus-core': walrusTree }}
        projectMetas={{
          'walrus-core': { id: 'walrus-core', label: 'Walrus · Rust', badgeClass: 'bg-[#f0fdf4] border-[#22c55e] text-[#166534]' },
        }}
      />
    </>
  );
}
