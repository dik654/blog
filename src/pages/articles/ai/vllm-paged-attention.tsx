import Overview from "./vllm-paged-attention/Overview";
import BlockPoolSection from "./vllm-paged-attention/BlockPoolSection";
import KVCacheManagerSection from "./vllm-paged-attention/KVCacheManagerSection";
import PrefixCaching from "./vllm-paged-attention/PrefixCaching";

export default function VLLMPagedAttentionArticle() {
  return (
    <>
      <Overview />
      <BlockPoolSection />
      <KVCacheManagerSection />
      <PrefixCaching />
    </>
  );
}
