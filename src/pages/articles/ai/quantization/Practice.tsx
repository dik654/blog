import VRAMBudgetViz from './viz/VRAMBudgetViz';

export default function Practice() {
  return (
    <section id="practice" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">실전: VRAM 예산별 최적 정밀도</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          <strong>핵심 공식</strong> — 모델 메모리 = 파라미터 수 × 바이트/파라미터 + KV-cache + 활성값 오버헤드.
          1.2B 모델: FP16 = 2.4GB, INT4 = 0.6GB.
          여기에 KV-cache(시퀀스 길이·배치 크기에 비례) + 활성값 버퍼 20~30%를 더해야 실제 VRAM 사용량
        </p>
        <p>
          VRAM 22.4GB 제약에서 INT4 양자화의 의미:
          모델 자체가 0.6GB이면 나머지 21.8GB를 KV-cache와 배치에 활용.
          FP16(2.4GB)일 때 batch 8이 한계라면 INT4에서는 batch 32 이상 가능 —
          <strong>throughput(토큰/초)이 4배 이상 향상</strong>되어 대회 점수에 직결
        </p>
      </div>

      <VRAMBudgetViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">vLLM 양자화 서빙</h3>
        <p>
          vLLM은 PagedAttention 기반의 LLM 추론 엔진으로, GPTQ와 AWQ를 네이티브로 지원.
          PagedAttention이 KV-cache를 페이지 단위로 관리하여 메모리 단편화를 방지하고,
          양자화된 가중치 + 효율적 KV-cache 관리의 조합으로 동시 요청 수를 극대화.
          AWQ 모델은 전용 CUDA 퓨전 커널이 dequantize와 matmul을 하나로 합쳐 GPTQ보다 약간 더 빠름
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">Perplexity vs 메모리 vs 속도</h3>
        <p>
          INT8 PTQ: perplexity +0.05~0.2 수준으로 거의 무손실, 메모리 50%, 속도 1.5~2×.<br />
          INT4 GPTQ: perplexity +0.2~0.5, 메모리 25%, 속도 2~3× (dequant 오버헤드 존재).<br />
          INT4 AWQ: perplexity +0.1~0.4, 메모리 25%, 속도 2.5~3.5× (퓨전 커널 덕분).
          4비트에서도 perplexity 증가가 0.5 미만이면 대부분의 태스크에서 실용적으로 허용 가능한 범위
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">EXAONE 1.2B 대회 전략</h3>
        <p>
          1.2B 모델 × AWQ INT4 = 약 0.6GB → VRAM 22.4GB에서 batch size 극대화.
          AutoAWQ로 양자화 후 vLLM에 --quantization awq 플래그로 서빙.
          KV-cache를 FP16으로 유지하면 perplexity 추가 악화 없이 최적 균형.
          대회 관건: <strong>throughput(토큰/초) 최대화</strong>가 응답 시간과 점수에 직결되므로,
          양자화로 확보한 VRAM을 더 큰 batch에 투입하는 것이 핵심 전략
        </p>
        <p className="leading-7">
          요약 1: <strong>INT4 AWQ + vLLM</strong>이 GPU 서빙의 최적 조합<br />
          요약 2: 양자화로 확보한 VRAM을 <strong>batch size 확대</strong>에 투입 → throughput 극대화<br />
          요약 3: perplexity +0.2~0.4 수준의 품질 저하는 <strong>대부분의 태스크에서 허용 가능</strong>
        </p>
      </div>
    </section>
  );
}
