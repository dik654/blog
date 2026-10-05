import ContentBoundary from "@/components/articles/content-boundary";
import KVCache from "./hybrid-attention-serving/KVCache";
import HybridKvCaseViz from "./hybrid-kv-cache-allocation/viz/HybridKvCaseViz";

export default function HybridKVCacheAllocationArticle() {
  return (
    <>
      <section id="overview" className="mb-16 scroll-mt-20 space-y-5">
        <p className="text-sm font-semibold text-primary">Visibility ≠ allocation</p>
        <h2 className="text-3xl font-bold tracking-tight">
          8개 layer가 32,768칸을 잡을지 14,336칸만 잡을지 계산합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            길이 <strong>T=4,096</strong>인 요청에 global layer 2개와 local layer
            6개가 있습니다. Local window는 <strong>W=1,024</strong>입니다. 오래된
            local block을 실제로 회수하면 2×4,096+6×1,024=<strong>14,336</strong>
            layer-token을 보존합니다. 회수하지 않으면 8×4,096=<strong>32,768</strong>입니다.
          </p>
          <p className="font-semibold">그림을 보기 전에 세 가지를 예측해 보세요.</p>
          <ol>
            <li>Local layer가 현재 token에서 읽는 과거 위치는 1,024개일까요?</li>
            <li>최근 1,024개만 읽는다는 사실만으로 physical allocation도 자동으로 줄까요?</li>
            <li>14,336은 allocator가 window 밖 block을 반환할 때만 성립할까요?</li>
          </ol>
          <p>
            답은 차례로 <strong>예, 아니요, 예</strong>입니다. Visibility는 kernel의
            읽기 규칙이고 allocation은 runtime의 소유·회수 규칙입니다.
          </p>
        </div>
        <HybridKvCaseViz />
        <ContentBoundary article="hybrid-kv-cache-allocation" />
      </section>
      <KVCache />
    </>
  );
}
