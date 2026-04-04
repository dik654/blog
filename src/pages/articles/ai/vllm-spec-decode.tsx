import Overview from './vllm-spec-decode/Overview';
import DraftVerify from './vllm-spec-decode/DraftVerify';
import EagleMtp from './vllm-spec-decode/EagleMtp';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { specDecodeCodeRefs } from './vllm-serving/codeRefsSpecDecode';
import { sharedCodeRefs } from './vllm-serving/sharedCodeRefs';
import { vllmTree } from './vllm-serving/fileTrees';

const allRefs = { ...sharedCodeRefs, ...specDecodeCodeRefs };

export default function VLLMSpecDecodeArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <DraftVerify onCodeRef={sidebar.open} />
      <EagleMtp onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={allRefs}
        fileTrees={{ vllm: vllmTree }}
        projectMetas={{
          vllm: { id: 'vllm', label: 'vLLM · Python', badgeClass: 'bg-[#fef3c7] border-[#f59e0b] text-[#92400e]' },
        }}
      />
    </>
  );
}
