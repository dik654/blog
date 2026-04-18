import { CitationBlock } from '@/components/ui/citation';
import BradleyTerryViz from './viz/BradleyTerryViz';
import BTModelDetailViz from './viz/BTModelDetailViz';
import M from '@/components/ui/math';

export default function RewardModel() {
  return (
    <section id="reward-model" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Bradley-Terry 보상 모델</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-4">
        <p>
          <strong>목표</strong> — "이 응답이 얼마나 좋은가"를 숫자로 매기는 모델 만들기<br />
          절대 점수를 매기긴 어렵지만, "A가 B보다 낫다" 비교는 쉬움 → 이걸 숫자로 변환
        </p>
        <h4>Bradley-Terry 선호 확률</h4>
        <M display>{'P(y_w \\succ y_l) = \\underbrace{\\sigma}_{\\text{시그모이드}}\\!\\Big(\\underbrace{r_\\theta(x, y_w)}_{\\text{선호 응답 점수}} - \\underbrace{r_\\theta(x, y_l)}_{\\text{비선호 응답 점수}}\\Big)'}</M>
        <h4>RM 학습 손실</h4>
        <M display>{'\\mathcal{L}_{\\text{RM}} = -\\underbrace{\\mathbb{E}}_{\\text{선호 쌍}}\\Big[\\log \\sigma\\big(r_\\theta(x, y_w) - r_\\theta(x, y_l)\\big)\\Big]'}</M>
        <div className="not-prose grid grid-cols-3 gap-2 mt-3 mb-4 text-sm">
          {[
            { sym: 'r_θ(x, y)', name: '보상 함수', desc: '프롬프트 x와 응답 y를 받아 스칼라 점수 출력 — LLM 마지막 층에 Linear head 추가' },
            { sym: 'σ(·)', name: '시그모이드', desc: '점수 차이를 0~1 확률로 변환 — 차이가 클수록 선호 확률이 1에 가까움' },
            { sym: 'y_w ≻ y_l', name: '선호 쌍', desc: '인간 평가자가 y_w를 y_l보다 낫다고 판단한 비교 데이터' },
          ].map((p) => (
            <div key={p.sym} className="rounded-lg border border-border bg-card px-3 py-2">
              <span className="font-mono font-bold text-foreground text-xs">{p.sym}</span>
              <span className="text-muted-foreground ml-1.5 text-xs font-semibold">{p.name}</span>
              <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{p.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <BradleyTerryViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <CitationBlock source="Christiano et al., 2017 — Deep RL from Human Preferences"
          citeKey={2} type="paper" href="https://arxiv.org/abs/1706.03741">
          <p className="italic text-sm">
            "We show that this approach can effectively optimize complex RL goals
            without access to the reward function, using comparisons between
            pairs of trajectory segments."
          </p>
        </CitationBlock>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Bradley-Terry 모델 수식</h3>
        <div className="not-prose"><BTModelDetailViz /></div>
        <p className="leading-7">
          요약 1: <strong>Bradley-Terry 모델</strong>이 이론적 기반 — pairwise 비교를 scalar score로.<br />
          요약 2: RM 학습 = <strong>BCE loss로 이진 분류</strong> — chosen vs rejected.<br />
          요약 3: <strong>Reward hacking</strong>이 RLHF의 핵심 약점 — KL 제약 필수.
        </p>
      </div>
    </section>
  );
}
