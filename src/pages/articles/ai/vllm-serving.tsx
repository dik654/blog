import Overview from './vllm-serving/Overview';
import PagedAttention from './vllm-serving/PagedAttention';
import ServingArchitecture from './vllm-serving/ServingArchitecture';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { sharedCodeRefs } from './vllm-serving/sharedCodeRefs';
import { vllmTree } from './vllm-serving/fileTrees';

export default function VLLMServingArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <PagedAttention onCodeRef={sidebar.open} />
      <ServingArchitecture onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={sharedCodeRefs}
        fileTrees={{ vllm: vllmTree }}
        projectMetas={{
          vllm: { id: 'vllm', label: 'vLLM · Python', badgeClass: 'bg-[#fef3c7] border-[#f59e0b] text-[#92400e]' },
        }}
      />
    </>
  );
}
