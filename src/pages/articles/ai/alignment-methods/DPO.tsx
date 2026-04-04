import { CitationBlock } from '@/components/ui/citation';
import DPODerivationViz from './viz/DPODerivationViz';

export default function DPO() {
  return (
    <section id="dpo" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">DPO: Direct Preference Optimization</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-4">
        <p>
          <strong>핵심 통찰</strong> — RLHF의 최적 정책 π*는 보상 함수 r*의 닫힌 형태 해가 존재<br />
          이를 Bradley-Terry 손실에 대입하면 RM 학습 + PPO가 단일 분류 손실로 소거됨
        </p>
      </div>

      <DPODerivationViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <CitationBlock source="Rafailov et al., 2023 — DPO" citeKey={2} type="paper"
          href="https://arxiv.org/abs/2305.18290">
          <p className="italic text-sm">
            "We show that the RL-based objective can be optimized exactly with a simple
            classification loss, eliminating the need for a reward model or RL training."
          </p>
          <p className="mt-2 text-xs">
            DPO의 수학적 기여: r*(x,y) = β·log(π*/π_ref) + Z(x) — 이 관계를 BT 모델에 대입하면
            Z(x)가 소거되어 정규화 상수 계산이 불필요해짐
          </p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">DPO의 한계</h3>
        <p>
          <strong>분포 이동</strong> — 학습이 진행되면서 π_θ와 π_ref 사이 괴리 증가<br />
          <strong>β 민감도</strong> — β가 너무 크면 탐색 부족, 너무 작으면 보상 해킹<br />
          <strong>여전히 2단계</strong> — SFT → DPO, Reference 모델 메모리 필요
        </p>
      </div>
    </section>
  );
}
