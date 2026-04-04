import Overview from './reth-pipeline/Overview';
import StageTrait from './reth-pipeline/StageTrait';
import HeadersStage from './reth-pipeline/HeadersStage';
import BodiesStage from './reth-pipeline/BodiesStage';
import SendersStage from './reth-pipeline/SendersStage';
import ExecutionStage from './reth-pipeline/ExecutionStage';
import MerkleStage from './reth-pipeline/MerkleStage';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './reth-pipeline/codeRefs';
import { rethPipelineTree } from './reth-pipeline/fileTrees';

export default function RethPipelineArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <HeadersStage onCodeRef={sidebar.open} />
      <BodiesStage onCodeRef={sidebar.open} />
      <SendersStage onCodeRef={sidebar.open} />
      <ExecutionStage onCodeRef={sidebar.open} />
      <MerkleStage onCodeRef={sidebar.open} />
      <StageTrait onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ reth: rethPipelineTree }}
        projectMetas={{
          reth: { id: 'reth', label: 'Reth · Rust', badgeClass: 'bg-orange-500/10 border-orange-500 text-orange-700' },
        }}
      />
    </>
  );
}
