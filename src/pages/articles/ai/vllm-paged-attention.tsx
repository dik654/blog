import Overview from './vllm-paged-attention/Overview';
import BlockPoolSection from './vllm-paged-attention/BlockPoolSection';
import KVCacheManagerSection from './vllm-paged-attention/KVCacheManagerSection';
import PrefixCaching from './vllm-paged-attention/PrefixCaching';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { blockPoolCodeRefs } from './vllm-serving/codeRefsBlockPool';
import { sharedCodeRefs } from './vllm-serving/sharedCodeRefs';
import { vllmTree } from './vllm-serving/fileTrees';

const allRefs = { ...sharedCodeRefs, ...blockPoolCodeRefs };

export default function VLLMPagedAttentionArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <BlockPoolSection onCodeRef={sidebar.open} />
      <KVCacheManagerSection onCodeRef={sidebar.open} />
      <PrefixCaching onCodeRef={sidebar.open} />
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
