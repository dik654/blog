import Overview from './irys/Overview';
import VDF from './irys/VDF';
import VDFCheckpoints from './irys/VDFCheckpoints';
import DataPacking from './irys/DataPacking';
import CUDAAcceleration from './irys/CUDAAcceleration';
import P2P from './irys/P2P';
import GossipProtocol from './irys/GossipProtocol';
import ChainSync from './irys/ChainSync';
import APIInterface from './irys/APIInterface';
import CrateAnalysis from './irys/CrateAnalysis';
import NodeConfig from './irys/NodeConfig';
import ClientSDK from './irys/ClientSDK';
import Monitoring from './irys/Monitoring';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './irys/codeRefs';
import { irysTree } from './irys/fileTrees';

export default function IrysArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <CrateAnalysis onCodeRef={sidebar.open} />
      <VDF onCodeRef={sidebar.open} />
      <VDFCheckpoints />
      <DataPacking onCodeRef={sidebar.open} />
      <CUDAAcceleration />
      <P2P onCodeRef={sidebar.open} />
      <GossipProtocol />
      <ChainSync />
      <APIInterface onCodeRef={sidebar.open} />
      <ClientSDK />
      <NodeConfig />
      <Monitoring />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ irys: irysTree }}
        projectMetas={{
          irys: { id: 'irys', label: 'Irys · Rust', badgeClass: 'bg-[#fef3c7] border-[#f59e0b] text-[#92400e]' },
        }}
      />
    </>
  );
}
