export default function LlmBandwidth() {
  return (
    <section id="llm" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">2. LLM 추론은 왜 memory bound 인가</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          H100 의 peak FP16 = 989 TFLOPS. 실제 LLM 추론에서 사용되는 건 5~10%.
          <br />
          이유는 단순 — <strong>매 token 마다 모든 weight 를 메모리에서 읽어야</strong> 하기 때문.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">2-1. 추론의 두 단계 — Prefill vs Decode</h3>
        <ul className="leading-7">
          <li>
            <strong>Prefill</strong> — 입력 prompt 전체를 한 번에 처리. 큰 행렬 곱 → compute bound. GPU 의 peak 에 가까움.
          </li>
          <li>
            <strong>Decode</strong> — 출력 token 을 1 개씩 생성. 한 token 마다 모든 weight 한 번 read. <strong>완전히 memory bound</strong>.
          </li>
          <li>
            <strong>비율</strong> — prompt 1000 token + output 100 token 이면 prefill 90%, decode 10% 시간. 그러나 chat 의 사용자 체감은 decode 의 token/s 가 결정.
          </li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">2-2. Decode 의 수치 분석</h3>
        <ul className="leading-7">
          <li><strong>모델</strong> — Llama 70B (FP16 = 140 GB).</li>
          <li><strong>H100 80GB 단일</strong> — 모델 못 담음. 두 장 NVLink 필요.</li>
          <li><strong>H100 두 장</strong> — 모델 split 후 GPU 당 70 GB. NVLink 통해 weight 공유.</li>
          <li><strong>한 token decode</strong> — 모든 weight 한 번 read = 140 GB. H100 의 BW 3.35 TB/s = 1 초에 23 token. 두 GPU 면 ~40 token/s.</li>
          <li><strong>peak compute 의 사용률</strong> — 한 token decode 의 실제 FLOPs ≈ 140 GFLOPs. H100 peak 989 TFLOPS 면 0.14 ms 면 끝. 그러나 메모리 read 가 ~42 ms. <strong>compute idle 99.7%</strong>.</li>
          <li><strong>결론</strong> — H100 의 비싼 tensor core 가 거의 안 씀. 진짜 의미 있는 spec 은 HBM bandwidth.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">2-3. Batch 가 답인가?</h3>
        <ul className="leading-7">
          <li><strong>Batch=1</strong> — OI ≈ 1. memory bound 극심.</li>
          <li><strong>Batch=N</strong> — 같은 weight 한 번 read 로 N token 동시 처리. OI ≈ N. compute bound 까지 갈 수도.</li>
          <li><strong>그러나 KV cache 가 늘어남</strong> — sequence 마다 별도 KV cache. 메모리 한계.</li>
          <li><strong>vLLM 의 PagedAttention</strong> — KV cache 를 페이지 단위로 관리해 batch 키움. throughput 5~10x.</li>
          <li><strong>현실 운영</strong> — chat 같은 latency-critical 은 batch 작게, batch inference (RAG indexing) 는 batch 크게.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">2-4. Quantization 의 수치 효과</h3>
        <ul className="leading-7">
          <li><strong>FP16 → FP8</strong> — 메모리 절반, 같은 BW 면 2x token/s. 정확도 거의 동일.</li>
          <li><strong>FP8 → FP4</strong> — 또 절반, 4x. 정확도 trade-off (모델별).</li>
          <li><strong>INT8 / INT4 quantization</strong> — 가중치만 quantize, 활성화는 FP16 유지. 메모리 절반 + 약간의 정확도 손실.</li>
          <li><strong>왜 이렇게 효과적</strong> — memory bound 이라 메모리 절반 = throughput 두 배. compute 는 어차피 idle.</li>
          <li><strong>운영 결정</strong> — chat 추론은 FP8 / INT8 표준. RAG / batch inference 는 FP16 유지 가능.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">2-5. Prompt Caching</h3>
        <ul className="leading-7">
          <li><strong>아이디어</strong> — 같은 prompt prefix (system message · few-shot) 의 KV cache 재사용.</li>
          <li><strong>Anthropic prompt caching</strong> — cached token 은 비용 1/10, 5 분 TTL.</li>
          <li><strong>BW 관점</strong> — KV cache 는 prefill 결과. read 만 필요 → BW 부담 없음.</li>
          <li><strong>운영 영향</strong> — 같은 시스템 prompt 사용하는 multi-turn chat 의 latency · 비용 결정적 절약. 우리 시스템 설계 시 prompt 구조 신중.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">2-6. 큰 모델 vs MoE</h3>
        <ul className="leading-7">
          <li><strong>Dense 70B</strong> — 모든 weight read. BW bound.</li>
          <li><strong>MoE (Mixture of Experts) 8x7B (Mixtral)</strong> — 56B 모델인데 token 당 14B 만 활성. BW 부담 1/4.</li>
          <li><strong>큰 MoE — DeepSeek V3 (671B / 37B active)</strong> — token 당 37B 만 read. 671B dense 보다 18x 빠름.</li>
          <li><strong>운영 영향</strong> — 같은 H100 노드에서 MoE 모델은 dense 대비 2~5x throughput.</li>
        </ul>
      </div>
    </section>
  );
}
