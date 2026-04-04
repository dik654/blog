import Overview from './open-r1/Overview';
import SFTProcess from './open-r1/SFTProcess';
import GRPOProcess from './open-r1/GRPOProcess';
import RewardSystem from './open-r1/RewardSystem';
import DataPipeline from './open-r1/DataPipeline';
import Evaluation from './open-r1/Evaluation';
import Deployment from './open-r1/Deployment';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './open-r1/codeRefs';
import { openR1Tree } from './open-r1/fileTrees';

export default function OpenR1Article() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <SFTProcess onCodeRef={sidebar.open} />
      <GRPOProcess onCodeRef={sidebar.open} />
      <RewardSystem onCodeRef={sidebar.open} />
      <DataPipeline onCodeRef={sidebar.open} />
      <Evaluation />
      <Deployment />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ 'open-r1': openR1Tree }}
        projectMetas={{
          'open-r1': { id: 'open-r1', label: 'Open-R1 · Python', badgeClass: 'bg-[#fef3c7] border-[#f59e0b] text-[#92400e]' },
        }}
      />
    </>
  );
}
