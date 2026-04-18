import BenchmarkViz from './viz/BenchmarkViz';

export default function Benchmark() {
  return (
    <section id="benchmark" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">벤치마크: 크기 vs 속도 vs 정확도</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          경량화 결과를 <strong>3축으로 평가</strong> — 크기(메모리 사용량), 속도(추론 처리량), 정확도(언어 모델 품질).{' '}
          한 축만 보면 함정에 빠짐: INT4가 크기와 속도에서 우수해도 PPL이 기준 초과면 탈락<br />
          대회에서는 보통 최종 점수 = f(정확도, 속도)로 두 축을 결합. 크기는 VRAM 제약으로 간접 반영
        </p>
        <p>
          <strong>Perplexity(PPL)</strong> — 언어 모델 품질의 표준 지표<br />
          PPL = exp(평균 cross-entropy loss). 모델이 다음 토큰을 얼마나 잘 예측하는가.{' '}
          PPL 12는 "평균적으로 12개 후보 중 하나를 고르는 수준의 불확실성"<br />
          측정 데이터셋: WikiText-2(영어), C4(다국어). 양자화 전후 PPL 차이(ΔPPL)가 핵심 지표 —{' '}
          GPTQ는 ΔPPL 0.5 이내, RTN은 2.0+
        </p>
        <p>
          <strong>추론 Throughput</strong>(tokens/sec) — 두 단계를 분리 측정<br />
          Prefill: 입력 토큰을 병렬 처리. <strong>compute-bound</strong>(GPU 연산 능력이 병목).{' '}
          양자화 효과 작음 — 이미 GPU 코어가 포화<br />
          Decode: 토큰을 하나씩 생성. <strong>memory-bound</strong>(메모리 대역폭이 병목).{' '}
          양자화 효과 큼 — 가중치 로드 양이 1/4로 감소하여 ~3x 속도 향상<br />
          실전에서는 decode throughput이 서빙 성능의 핵심 — 사용자 체감 속도를 결정
        </p>
        <p>
          <strong>메모리 프로파일링</strong> — nvidia-smi vs torch.cuda<br />
          nvidia-smi는 순간 할당량만 표시 — 피크를 놓칠 수 있음.{' '}
          torch.cuda.max_memory_allocated()는 프로세스 생애 최대 VRAM을 추적<br />
          메모리 사용 타임라인: 모델 로드(기준값) → prefill(피크, KV 캐시 생성) → decode(안정).{' '}
          OOM은 대부분 prefill 시점에 발생 → prefill 피크 VRAM이 진짜 제약
        </p>
        <p>
          <strong>vLLM 실측 환경</strong> — 실제 서빙 성능 벤치마크<br />
          핵심 파라미터: --quantization gptq(INT4 커널), --max-model-len 4096(시퀀스 제한),{' '}
          --gpu-memory-utilization 0.9(VRAM 90% 활용)<br />
          Continuous batching: 요청을 동적으로 배치에 추가/제거 — 고정 배치 대비 처리량 2~3배.{' '}
          PagedAttention: KV 캐시를 페이지 단위로 관리하여 메모리 단편화 방지
        </p>
        <p>
          벤치마크 실행: benchmark_serving.py --num-prompts 100 --request-rate 10<br />
          측정 항목: 평균/P50/P99 latency, throughput(tok/s), VRAM 피크.{' '}
          P99 latency가 중요 — 최악 케이스가 사용자 경험을 결정
        </p>
      </div>
      <BenchmarkViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          정리 1: PPL(정확도) + tok/s(속도) + GB(크기)를 <strong>반드시 함께</strong> 측정 — 한 축만 최적화하면 다른 축이 무너짐<br />
          정리 2: decode가 memory-bound → <strong>양자화 효과가 가장 큰 구간</strong>. prefill은 compute-bound<br />
          정리 3: vLLM continuous batching + INT4-GPTQ가 L4 환경에서 가장 균형 잡힌 설정<br />
          정리 4: nvidia-smi 말고 <strong>torch.cuda.max_memory_allocated()</strong>로 피크 VRAM 측정 필수
        </p>
      </div>
    </section>
  );
}
