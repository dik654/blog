import SynergyViz from './viz/SynergyViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">기법 조합의 시너지</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          LLM 경량화 기법은 크게 세 가지 — <strong>프루닝</strong>(Pruning, 불필요한 파라미터 제거),{' '}
          <strong>지식 증류</strong>(Knowledge Distillation, 큰 모델의 지식을 작은 모델에 전달),{' '}
          <strong>양자화</strong>(Quantization, 비트 정밀도 감소)<br />
          각 기법은 모델의 서로 다른 축을 공략: 프루닝은 <strong>구조</strong>, 증류는 <strong>지식</strong>, 양자화는 <strong>정밀도</strong>
        </p>
        <p>
          단일 기법만으로는 한계가 명확 —{' '}
          양자화만 적용하면 정확도가 급락하고, 프루닝만 적용하면 크기 감소에 비해 속도 개선이 미미하며,{' '}
          증류만 적용하면 GPU 학습 비용이 과도<br />
          세 기법을 <strong>올바른 순서</strong>로 조합해야 곱셈적 효과(multiplicative effect) 발생
        </p>
        <p>
          실전 예시: EXAONE 1.2B(LG AI Research) 모델에 파이프라인 적용 —{' '}
          30% 프루닝 → 7.8B Teacher 증류 → INT4 GPTQ 양자화<br />
          결과: 원본 대비 크기 1/6(2.4GB → 0.42GB), 속도 3배(45 → 135 tok/s), 정확도 95% 유지(PPL 12.1 → 12.7)
        </p>
        <p>
          이 아티클은 <strong>왜 조합하는가</strong>(시너지), <strong>어떤 순서로</strong>(의존성),{' '}
          <strong>VRAM 예산별 전략</strong>(실전), <strong>어떻게 측정하는가</strong>(벤치마크)를 다룸<br />
          대회(LLM 경량화 대회 등) 환경에서 L4 GPU 22.4GB VRAM 제약 하에 최적 전략을 설계하는 것이 목표
        </p>
      </div>
      <SynergyViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          핵심 1: 프루닝(구조) + 증류(지식) + 양자화(정밀도) — <strong>서로 다른 축</strong>이라 조합 시 효과가 곱셈적<br />
          핵심 2: 순서가 중요 — 비가역적 변환(양자화)은 <strong>반드시 마지막</strong><br />
          핵심 3: 대회에서는 PPL 기준 통과 + VRAM 내 최대 throughput이 승부처
        </p>
      </div>
    </section>
  );
}
