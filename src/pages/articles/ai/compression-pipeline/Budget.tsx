import BudgetViz from './viz/BudgetViz';

export default function Budget() {
  return (
    <section id="budget" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">VRAM 예산별 최적 전략</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          LLM 대회의 표준 환경: <strong>NVIDIA L4 GPU</strong>(22.4GB VRAM, Ada Lovelace 아키텍처).{' '}
          이 VRAM 안에 모델 가중치 + KV 캐시 + 활성값이 모두 들어와야 추론 가능<br />
          VRAM 초과 시 선택지: OOM 에러(추론 불가), 배치=1로 축소(처리량 급감), 시퀀스 길이 제한(긴 입력 불가)
        </p>
        <p>
          <strong>정밀도별 가중치 메모리</strong> — EXAONE 1.2B 기준(1.2 × 10⁹ 파라미터):<br />
          FP16(2바이트) = 2.4GB, INT8(1바이트) = 1.2GB, INT4(0.5바이트) = 0.6GB<br />
          계산: 파라미터 수 × 바이트/파라미터. 1.2B × 2 = 2.4GB(FP16)
        </p>
        <p>
          <strong>KV 캐시 메모리</strong>가 간과되는 함정 — 긴 시퀀스 + 큰 배치에서 KV가 가중치보다 클 수 있음<br />
          공식: KV = 2(K+V) × layers × d_model × seq_len × batch × bytes_per_param<br />
          EXAONE 1.2B(L=24, d=2048) + FP16: seq=2048, batch=8이면 KV=1.5GB.{' '}
          seq=8192, batch=16이면 KV=12GB — 모델 가중치(2.4GB)의 5배
        </p>
        <p>
          <strong>양자화의 진짜 이점</strong>: 가중치 메모리 절감 → 남는 VRAM을 KV 캐시에 투자 → 배치 크기 증가 → throughput 상승<br />
          INT4(0.6GB)로 전환하면 22.4 - 0.6 = 21.8GB 여유 → batch 32+ 가능.{' '}
          FP16(2.4GB)에서는 20GB 여유로 batch 16~24 수준
        </p>
        <p>
          <strong>Pareto Front</strong>(파레토 전선): 속도-정확도 평면에서 어떤 다른 설정에도 지배당하지 않는 점들의 집합.{' '}
          INT4-GPTQ(PPL 12.7, 135tok/s)는 Pareto front 위에 있지만,{' '}
          INT4-RTN(PPL 14.2, 140tok/s)은 INT4-GPTQ에 지배당함(속도는 비슷하나 정확도 열위)<br />
          INT3은 PPL 18.5로 실용 한계 초과 — Pareto front 아래(dominated)
        </p>
        <p>
          <strong>대회 제출 전략</strong>: 3단계 의사결정<br />
          1) PPL 기준 통과 확인 — 기준 미달 시 더 높은 정밀도로 후퇴<br />
          2) VRAM 내 최대 배치 탐색 — binary search(1→2→4→8→...)로 OOM 직전까지<br />
          3) vLLM continuous batching + CUDA graph로 throughput 최적화
        </p>
      </div>
      <BudgetViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          요약: 양자화는 <strong>메모리 절감</strong>이 아니라 <strong>배치 확장을 통한 throughput 증가</strong>가 진짜 이점<br />
          KV 캐시를 반드시 계산에 포함 — 모델 크기만 보면 OOM 함정에 빠짐<br />
          Pareto front 위의 설정만 고려: GPTQ/AWQ &gt; RTN, INT8이 INT4보다 나은 경우도 존재
        </p>
      </div>
    </section>
  );
}
