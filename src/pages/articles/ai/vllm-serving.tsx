import Overview from './vllm-serving/Overview';
import PagedAttention from './vllm-serving/PagedAttention';
import ServingArchitecture from './vllm-serving/ServingArchitecture';

function References() {
  return (
    <section id="references" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">참고 자료 & 출처</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <ul className="space-y-2 text-sm">
          <li>
            <strong>[PagedAttention 논문]</strong> Kwon et al., &quot;Efficient Memory Management for Large Language Model Serving with PagedAttention&quot;, SOSP 2023
            — KV 캐시 블록 관리, CoW, 메모리 낭비 20-38%→4% 미만 수치의 근거
          </li>
          <li>
            <strong>[vLLM GitHub]</strong> github.com/vllm-project/vllm — V1 멀티프로세스 아키텍처, ZeroMQ IPC, 코드 구조 (v1/engine/core.py 등)
          </li>
          <li>
            <strong>[vLLM 공식 문서]</strong> docs.vllm.ai — API 서버 엔드포인트, 양자화 지원 (FP8/GPTQ/AWQ/GGUF), 분산 추론 설정
          </li>
          <li>
            <strong>[vLLM DeepWiki]</strong> deepwiki.com/vllm-project/vllm — V1 아키텍처 분석, CUDA Graph 모드 (PIECEWISE/FULL/FULL_DECODE_ONLY), KV Cache Manager
          </li>
          <li>
            <strong>[FlashAttention]</strong> Dao et al., &quot;FlashAttention: Fast and Memory-Efficient Exact Attention&quot;, NeurIPS 2022
            — Attention 타일링, O(N²)→O(N) 메모리 절약의 근거
          </li>
          <li>
            <strong>[EAGLE]</strong> Li et al., &quot;EAGLE: Speculative Sampling Requires Rethinking Feature Uncertainty&quot;, ICML 2024
            — Feature-level draft, 최대 2.5x 가속 수치
          </li>
          <li>
            <strong>[vLLM 벤치마크]</strong> vLLM 팀 공식 벤치마크 — HuggingFace 대비 24x 처리량, V1 vs V0 1.7x 향상
          </li>
          <li>
            <strong>[Continuous Batching]</strong> Yu et al., &quot;Orca: A Distributed Serving System for Transformer-Based Generative Models&quot;, OSDI 2022
            — Iteration-level 스케줄링, Chunked Prefill 개념의 원천
          </li>
        </ul>
      </div>
    </section>
  );
}

export default function VLLMServingArticle() {
  return (
    <>
      <Overview />
      <PagedAttention />
      <ServingArchitecture />
      <References />
    </>
  );
}
