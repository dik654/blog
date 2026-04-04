import Overview from './solana/Overview';
import ProofOfHistory from './solana/ProofOfHistory';
import TowerBFT from './solana/TowerBFT';
import Turbine from './solana/Turbine';
import GulfStream from './solana/GulfStream';
import Sealevel from './solana/Sealevel';
import Pipeline from './solana/Pipeline';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './solana/codeRefs';

export default function SolanaArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <ProofOfHistory onCodeRef={sidebar.open} />
      <TowerBFT onCodeRef={sidebar.open} />
      <Turbine onCodeRef={sidebar.open} />
      <GulfStream onCodeRef={sidebar.open} />
      <Sealevel onCodeRef={sidebar.open} />
      <Pipeline onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{}}
      />
    </>
  );
}
