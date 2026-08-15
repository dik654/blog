import ContentBoundary from "@/components/articles/content-boundary";
import KVCache from "./hybrid-attention-serving/KVCache";

export default function HybridKVCacheAllocationArticle() {
  return (
    <>
      <section id="overview" className="mb-16 scroll-mt-20 space-y-5">
        <p className="text-sm font-semibold text-primary">Visibility ≠ allocation</p>
        <h2 className="text-3xl font-bold tracking-tight">
          최근 token만 읽는 것과 오래된 KV를 반환하는 것은 다른 동작입니다
        </h2>
        <p className="text-lg leading-8 text-foreground/90">
          Model의 local-attention 규칙은 현재 token이 볼 수 있는 위치를 정합니다.
          Runtime allocator는 그 규칙을 보고 더 이상 필요한 reader가 없는 physical
          blocks를 실제 pool로 반환합니다. 이 글은 두 책임을 하나씩 연결합니다.
        </p>
        <ContentBoundary article="hybrid-kv-cache-allocation" />
      </section>
      <KVCache />
    </>
  );
}
