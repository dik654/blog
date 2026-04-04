import Overview from './sp1/Overview';
import ProjectStructure from './sp1/ProjectStructure';
import Execution from './sp1/Execution';
import ExecutorDetail from './sp1/ExecutorDetail';
import MemorySystem from './sp1/MemorySystem';
import SyscallSystem from './sp1/SyscallSystem';
import AIR from './sp1/AIR';
import ChipArchitecture from './sp1/ChipArchitecture';
import ALUChips from './sp1/ALUChips';
import STARKProving from './sp1/STARKProving';
import ShardParallel from './sp1/ShardParallel';
import RecursionCompression from './sp1/RecursionCompression';
import SNARKWrapping from './sp1/SNARKWrapping';
import CUDAAcceleration from './sp1/CUDAAcceleration';
import SDK from './sp1/SDK';
import CLITools from './sp1/CLITools';
import Examples from './sp1/Examples';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './sp1/codeRefs';
import { sp1FileTree } from './sp1/fileTrees';

export default function SP1Article() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <ProjectStructure />
      <Execution onCodeRef={sidebar.open} />
      <ExecutorDetail />
      <MemorySystem />
      <SyscallSystem />
      <AIR onCodeRef={sidebar.open} />
      <ChipArchitecture />
      <ALUChips />
      <STARKProving />
      <ShardParallel />
      <RecursionCompression />
      <SNARKWrapping />
      <CUDAAcceleration />
      <SDK onCodeRef={sidebar.open} />
      <CLITools />
      <Examples />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ sp1: sp1FileTree }}
        projectMetas={{
          sp1: { id: 'sp1', label: 'SP1 · Rust', badgeClass: 'bg-[#fef3c7] border-[#f59e0b] text-[#92400e]' },
        }}
      />
    </>
  );
}
