import LLMPruningViz from './viz/LLMPruningViz';

export default function LLMPruning() {
  return (
    <section id="llm" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">LLM 프루닝: SparseGPT, Wanda</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          LLM은 수십~수백억 파라미터 — 전체 재학습은 비현실적 (GPT-175B 학습 = $12M+)<br />
          <strong>Post-training Pruning</strong>: 학습 완료된 모델을 재학습 없이 프루닝<br />
          핵심 도전: 재학습 없이도 정확도를 유지하는 프루닝 마스크를 어떻게 찾을 것인가
        </p>
      </div>
      <div className="not-prose my-8">
        <LLMPruningViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">SparseGPT</h3>
        <p>
          Frantar & Alistarh (ICML 2023): 최초의 실용적 LLM 프루닝<br />
          아이디어 — OBS(Optimal Brain Surgeon)를 대규모로 확장<br />
          각 행(row)을 독립적으로 처리, 열(column) 순서로 프루닝 결정<br />
          프루닝된 가중치의 오차를 남은 가중치에 Hessian 기반으로 보상(compensation)
        </p>
        <p>
          Hessian 계산: H = X^T X (보정 데이터 128 샘플의 활성화로 근사)<br />
          보상 공식: δ = -w_pruned × H⁻¹_col / H_diag<br />
          GPT-175B를 단일 A100에서 약 4시간 만에 50% 프루닝 가능
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Wanda (Pruning by Weights and Activations)</h3>
        <p>
          Sun et al. (ICML 2024): SparseGPT보다 훨씬 단순하고 빠른 방법<br />
          핵심 관찰 — 가중치 크기만으로는 중요도 판단 불충분<br />
          가중치가 크더라도 해당 입력이 항상 0에 가까우면 실제 기여도는 0
        </p>
        <p>
          스코어 = |w_ij| × ||x_j||₂ (가중치 절대값 × 입력 활성화 L2-norm)<br />
          스코어가 낮은 가중치를 제거 — Hessian 역행렬 계산 불필요<br />
          계산 비용: SparseGPT 대비 10~100배 빠름 (단순 원소별 곱 + 정렬)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">성능 비교</h3>
        <p>
          LLaMA-7B (Perplexity, WikiText2):<br />
          Dense: 5.68 → SparseGPT 50%: 6.55 → Wanda 50%: 6.72<br />
          2:4 구조적 희소성: SparseGPT 7.15, Wanda 7.26<br />
          50% 비정형 희소성에서 두 방법 모두 실용적 수준의 성능 유지
        </p>

        <div className="bg-purple-50 dark:bg-purple-950/30 border-l-4 border-purple-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: LLM 프루닝의 현재</p>
          <p>
            <strong>SparseGPT</strong>: 정확도 최우선 — Hessian 보상으로 최적에 가까운 프루닝<br />
            <strong>Wanda</strong>: 속도 최우선 — 수 분 내에 프루닝 완료, 정확도는 SparseGPT에 약간 열세<br />
            <strong>실무 선택</strong>: 배포 모델이 크면 Wanda로 빠르게, 정확도 임계점이 빡빡하면 SparseGPT<br />
            둘 다 2:4 N:M 희소성과 결합하면 A100에서 실제 1.5~2배 추론 속도 향상
          </p>
        </div>
      </div>
    </section>
  );
}
