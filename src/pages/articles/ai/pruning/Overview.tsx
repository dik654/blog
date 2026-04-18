import OverviewViz from './viz/OverviewViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">프루닝의 원리</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          신경망의 가중치 수 — GPT-3 1,750억, LLaMA-70B 700억 개<br />
          이 중 상당수는 최종 출력에 거의 영향을 주지 않는다<br />
          <strong>프루닝</strong>(Pruning) — "없어도 되는" 뉴런·가중치를 제거하여 모델을 경량화하는 기법
        </p>
        <p>
          핵심 질문: 어떤 가중치를 제거해도 되는가?<br />
          가장 단순한 답 — 절대값이 작은 가중치 (Magnitude Pruning)<br />
          더 정교한 답 — 출력 변화를 최소화하는 가중치 조합 (SparseGPT, Wanda)
        </p>
      </div>
      <div className="not-prose my-8">
        <OverviewViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">Lottery Ticket Hypothesis</h3>
        <p>
          Frankle & Carlin (2019): 랜덤 초기화된 Dense 네트워크 안에는,
          독립적으로 학습 가능한 Sparse 서브네트워크("당첨 티켓")가 존재<br />
          이 서브네트워크만 학습해도 원래 네트워크와 동일한 정확도 달성 가능<br />
          함의 — 처음부터 작은 네트워크를 찾을 수 있다면 학습 비용도 절감
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">프루닝 비율 vs 정확도</h3>
        <p>
          프루닝 비율 0~80% — 정확도 거의 유지 ("Free Lunch" 구간)<br />
          80~90% — 점진적 하락, fine-tuning으로 복구 가능<br />
          90% 이상 — 급격한 하락, 구조적 한계<br />
          모델·태스크마다 임계점이 다르지만, 50% 프루닝은 거의 항상 안전
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">LLM 경량화에서의 역할</h3>
        <p>
          <strong>양자화</strong>(Quantization) — 비트 수 축소 → VRAM 절감 (FP16→INT4 = 4배)<br />
          <strong>프루닝</strong>(Pruning) — 연결 자체 제거 → 연산량(FLOP) 절감<br />
          <strong>지식 증류</strong>(Distillation) — 작은 모델로 지식 전달 → 근본적 크기 축소<br />
          세 기법은 상호 보완적 — 프루닝 + 양자화 조합이 실무에서 가장 흔함
        </p>

        <div className="bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">프루닝의 두 갈래</p>
          <p>
            <strong>Unstructured</strong>: 개별 가중치 단위로 제거 — 높은 희소성, 하드웨어 가속 어려움<br />
            <strong>Structured</strong>: 필터/채널/헤드 단위로 제거 — 낮은 희소성, 실제 속도 향상<br />
            LLM에서는 N:M 희소성(2:4)이 두 장점을 절충
          </p>
        </div>
      </div>
    </section>
  );
}
