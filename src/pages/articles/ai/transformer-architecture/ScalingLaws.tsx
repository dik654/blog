import CodePanel from '@/components/ui/code-panel';
import { scalingCode, scalingAnnotations } from './ScalingLawsData';
import ScalingLawsViz from './viz/ScalingLawsViz';

export default function ScalingLaws() {
  return (
    <section id="scaling-laws" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">스케일링 법칙</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Transformer의 성능 — <strong>파라미터 수(N)</strong>, <strong>데이터양(D)</strong>, <strong>연산량(C)</strong>의 멱법칙(Power Law, 변수 간 거듭제곱 관계)을 따라 예측 가능하게 향상<br />
          Chinchilla 논문 — 고정 연산 예산에서 <strong>N:D=1:20</strong>이 최적임을 입증<br />
          LLM 학습 패러다임을 근본적으로 변화시킴
        </p>
      </div>

      <ScalingLawsViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>스케일링 법칙 & Chinchilla</h3>
        <CodePanel title="스케일링 법칙 & 실전 적용" code={scalingCode} annotations={scalingAnnotations} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Scaling Laws 주요 발견</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 1. Kaplan et al. 2020 (OpenAI)
//    "Scaling Laws for Neural Language Models"
//
//    L(N, D, C) ≈ a·N^(-α) + b·D^(-β) + c·C^(-γ)
//
//    N = 파라미터 수
//    D = 데이터 토큰 수
//    C = 연산량 (FLOPs)
//    L = 평가 손실
//
//    α ≈ 0.076, β ≈ 0.095, γ ≈ 0.050
//
//    주요 결론:
//    - 손실은 N, D, C의 멱법칙으로 예측 가능
//    - 세 요인 중 하나라도 부족하면 병목
//    - GPT-3 학습 계획의 기반
//
// 2. Hoffmann et al. 2022 (DeepMind)
//    "Training Compute-Optimal Large Language Models"
//    = Chinchilla 논문
//
//    고정 연산 예산 C에서 최적:
//    N_opt ∝ C^0.5
//    D_opt ∝ C^0.5
//
//    → N과 D를 같은 비율로 스케일링해야 함
//    → N:D ≈ 1:20 (파라미터당 20 토큰)
//
//    기존 모델 재평가:
//    - GPT-3 (175B): 300B tokens → undertrained
//    - Chinchilla (70B): 1.4T tokens → optimal
//    - Chinchilla가 GPT-3 성능 초과

// 3. LLaMA-2 (Meta, 2023)
//    - Chinchilla보다 더 많은 data 사용
//    - 7B → 2T tokens (286× 비율)
//    - "Data is undervalued" 관점
//    - 추론 효율 vs 학습 효율 trade-off

// 4. Data Repetition Laws (Muennighoff 2023)
//    - 데이터 부족 시 반복이 도움
//    - 4 epochs 이상은 효과 감소
//    - 독점 데이터 시대의 대안

// 5. Emergent Abilities (Wei 2022)
//    - 특정 임계 크기에서 급격한 능력 출현
//    - Few-shot, Chain-of-Thought, 계산 등
//    - 작은 모델엔 없다가 갑자기 나타남

// 실무 의미:
//   - 모델 설계 예산 계획 가능
//   - loss curve 예측
//   - 최적 N:D 비율 결정
//   - compute 투자 ROI 평가`}
        </pre>
        <p className="leading-7">
          요약 1: <strong>Kaplan 2020</strong>이 scaling laws 정식화 — 성능 예측 가능해짐.<br />
          요약 2: <strong>Chinchilla (1:20 비율)</strong>이 GPT-3 시대 통념 전복.<br />
          요약 3: <strong>Emergent abilities</strong>는 scaling의 질적 전환 — 아직도 연구 중.
        </p>
      </div>
    </section>
  );
}
