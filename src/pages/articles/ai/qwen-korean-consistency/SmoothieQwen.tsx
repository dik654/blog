import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import SmoothieQwenViz from "./viz/SmoothieQwenViz";

export default function SmoothieQwen() {
  return (
    <section id="smoothie-qwen" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Smoothie-Qwen은 token risk를 lm_head 행의 scale로 바꿉니다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          프롬프트가 요청 시점의 정책이라면 Smoothie-Qwen은 학습이 끝난
          checkpoint의 <strong>출력층 weight를 직접 수정</strong>하는 post-hoc
          방법입니다. tokenizer에서 목표 문자와 관련된 token을 찾고, token마다
          선택한 Unicode 문자군으로 decode될 위험도 <code>r</code>을 계산한 뒤,
          <code>lm_head</code>의 해당 행에 0보다 크고 1 이하인 scale을 곱합니다.
          Transformer 본체를 다시 학습하지는 않지만 weight가 달라지므로, 원본과
          별개의 모델 후보로 평가하고 저장해야 합니다.
        </p>
        <p>
          이 방법의 대상은 “중국어라는 의미”가 아니라 tokenizer와 Unicode
          조합으로 근사한 token risk입니다. 따라서 고정 사례에서 계산 설명에
          우연히 섞인 중국어를 줄일 수 있어도, 사용자가 명시적으로 요구한 번역
          “首尔” 역시 약해질 수 있습니다. suppression과 정상 예외 보존을 같은
          paired evaluation에서 함께 봐야 하는 이유입니다.
        </p>
      </div>

      <div className="not-prose my-8">
        <SmoothieQwenViz />
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>질문: risk가 0에서 1로 커질 때 얼마만큼 낮출까요?</h3>
        <p>
          모든 관련 token에 같은 계수를 곱하면, 명백한 목표 문자와 우연히 그
          문자를 만들 수 있는 subword 조각을 똑같이 벌점 줍니다. 논문은 risk가
          낮은 token은 거의 그대로 두고, risk가 1에 가까울수록
          <code>min_scale</code>에 접근하는 로그 곡선을 사용합니다.
        </p>
      </div>

      <ExplainedFormula
        question="token risk r을 lm_head에 곱할 scale S(r)로 어떻게 바꿀까요?"
        idea={
          <>
            Risk가 0이면 원래 weight를 유지하고, risk가 1이면 최소 scale m만큼만
            남깁니다. 중간 위험도는 smoothness s가 정하는 로그 곡선을 따라
            연속적으로 보간합니다.
          </>
        }
        formula={String.raw`S(r)=1-(1-m)\frac{\log\!\left(1+(s-1)r\right)}{\log s}`}
        terms={[
          { symbol: "r", name: "risk score", description: "token이 목표 문자군을 직접 포함하거나 조합해 만들 가능성을 0에서 1 사이로 근사한 값입니다." },
          { symbol: "m", name: "min_scale", description: "risk가 1인 token에도 남겨 둘 weight 비율의 하한입니다." },
          { symbol: "s", name: "smoothness", description: "중간 risk에서 scale이 얼마나 빠르게 m 쪽으로 내려갈지 정하는 곡선 파라미터입니다." },
          { symbol: "S(r)", name: "token scale", description: "해당 token의 lm_head 행에 곱할 최종 계수입니다." },
        ]}
        assumptions={[
          "논문·공개 구현의 정의에서는 r∈[0,1], 0<m≤1, s>1을 사용합니다.",
          "r=0이면 S(0)=1이고 r=1이면 S(1)=m이지만, 이는 token의 실제 생성 확률이 그 비율로 줄어든다는 뜻은 아닙니다.",
          "s=1이면 log(s)=0이 되어 분모가 0이므로 위 식에 그대로 대입할 수 없습니다.",
          "Risk score는 Unicode target, broken token과 n-gram sampling 규칙이 만든 근사치이며 언어 의미를 판별하는 oracle이 아닙니다.",
        ]}
        interpretation="m=0.5, s=10, r=0.5를 대입하면 S(r)=1−0.5·log(5.5)/log(10)≈0.630입니다. s가 클수록 중간 risk에서도 scale이 더 빨리 낮아지지만, 가장 강한 token도 weight를 0으로 만들지는 않습니다. 어느 m과 s가 적절한지는 서비스의 suppression·정확도·정상 번역 보존 결과로 정해야 합니다."
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>risk score는 세 종류 token을 다르게 취급합니다</h3>
        <p>
          첫째, 설정한 Unicode 범위에 직접 들어가는 <strong>target token</strong>은
          높은 risk를 받습니다. 둘째, tokenizer가 문자를 byte/subword 조각으로
          나누면서 생기는 <strong>broken token</strong>은 혼자서는 언어를 판정하기
          어렵습니다. 셋째, 구현은 이 조각을 다른 token과 2~4-gram으로 조합해
          목표 문자를 만드는 비율을 sampling하고 risk를 근사합니다.
        </p>
        <p>
          그러므로 “중국어 token 목록을 완벽하게 찾았다”가 아니라 “선택한 Unicode
          범위와 sampling recipe 아래에서 위험도를 추정했다”가 정확한 설명입니다.
          tokenizer version, normalization, n-gram window와 sample size가 바뀌면
          risk도 달라질 수 있으므로 변환 artifact에 함께 기록해야 합니다.
        </p>

        <h3>행을 줄여도 확률은 vocabulary 전체에서 다시 계산됩니다</h3>
      </div>

      <ExplainedFormula
        question="token t의 lm_head 행을 줄이면 그 token의 확률만 같은 비율로 줄어들까요?"
        idea={
          <>
            Scale은 먼저 lm_head 행을 바꾸고, 바뀐 행과 hidden state의 내적이 새
            logit을 만듭니다. 그 뒤 softmax가 vocabulary 전체 logit을 한꺼번에
            정규화하므로 효과는 다른 후보와의 상대 순위에 달려 있습니다.
          </>
        }
        formula={String.raw`\begin{aligned}
w'_t&=S(r_t)w_t\\
z'_t&=(w'_t)^{\top}h\\
p'(t\mid h)&=\frac{e^{z'_t}}{\sum_{j\in\mathcal V}e^{z'_j}}
\end{aligned}`}
        terms={[
          { symbol: "w_t, w'_t", name: "original and scaled lm_head row", description: "token t를 hidden state에서 logit으로 투영하는 변환 전·후 weight 벡터입니다." },
          { symbol: "h", name: "hidden state", description: "현재까지의 token 문맥을 Transformer가 만든 표현입니다." },
          { symbol: "z'_t", name: "scaled logit", description: "softmax에 들어가기 전 token t의 새 점수입니다." },
          { symbol: "𝒱", name: "vocabulary", description: "현재 단계에서 softmax 분모를 함께 구성하는 모든 token 후보입니다." },
          { symbol: "p'(t|h)", name: "relative next-token probability", description: "같은 문맥 h에서 token t가 다음 token으로 선택될 상대 확률입니다." },
        ]}
        assumptions={[
          "lm_head에 bias가 있다면 실제 logit 식에는 bias 항도 포함해야 합니다.",
          "Input embedding과 lm_head weight가 tied된 architecture라면 output row 편집이 공유 weight에 어떤 영향을 주는지 model implementation을 확인해야 합니다.",
          "양의 logit은 0<S<1을 곱하면 낮아지지만, 음의 logit은 0에 가까워져 오히려 상대 확률이 늘 수 있습니다.",
          "다른 token의 행을 직접 바꾸지 않아도 softmax 분모가 달라지므로 모든 후보의 상대 확률은 함께 변합니다.",
        ]}
        interpretation="예를 들어 logit이 (4,2,0)이고 첫 행의 결과만 0.5배가 되면 새 logit은 (2,2,0)이며 softmax는 약 (0.468,0.468,0.063)입니다. 첫 확률만 절반이 아니라 세 확률이 함께 다시 정규화됩니다. Smoothie 논문은 대상 high-risk token의 logit이 실험에서 대체로 양수였다고 보고하지만 모든 문맥의 보장은 아니므로, 변환 전후의 logit 분포와 실제 생성 결과를 paired prompt에서 확인해야 합니다."
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>고정 사례로 paired evaluation을 만듭니다</h3>
        <p>
          원본과 smoothing 후보에 완전히 같은 prompt·decoding 설정을 넣고, 계산
          근거의 예기치 않은 중국어 span, 최종 정답 3,200원, 번역 정답 “首尔”을
          따로 채점합니다. 억제 지표만 좋아지고 번역 정답률이 떨어진다면 risk
          범위나 <code>m</code>·<code>s</code>가 과격한 것입니다. 한국어-only
          slice와 명시적 중국어 translation slice를 쌍으로 두지 않으면 이 회귀를
          발견하기 어렵습니다.
        </p>
      </div>

      <div
        id="paper-smoothie-qwen"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">근거 읽기 · Smoothie-Qwen 논문</p>
        <CitationBlock
          source="Ji et al. — Smoothie-Qwen"
          citeKey={2}
          type="paper"
          href="https://arxiv.org/abs/2507.05686"
        >
          <div className="space-y-2 font-sans">
            <p><strong>문제:</strong> 다국어 Qwen이 prompt 언어와 무관하게 중국어를 과도하게 생성하는 language confusion을 재학습 없이 줄이려 합니다.</p>
            <p><strong>핵심 아이디어·기여:</strong> Unicode·broken token·n-gram으로 token risk를 추정하고, 비선형 scale로 lm_head 행을 낮추는 post-hoc 변환을 제안합니다.</p>
            <p><strong>전제·실험 조건:</strong> 공개 실험은 Qwen2.5-Coder-14B-Instruct, 설정된 중국어 Unicode 범위, custom elicitation과 일부 KMMLU slice를 사용합니다.</p>
            <p><strong>근거 범위:</strong> 해당 모델과 평가에서 suppression과 task accuracy의 trade-off를 측정한 증거이며, 식의 endpoint와 logit 부호에 따른 효과도 분석합니다.</p>
            <p><strong>비주장:</strong> 모든 Qwen checkpoint·언어·tokenizer에서 95% 이상 개선되거나 정상 번역과 지식이 항상 보존된다는 보편 법칙은 아닙니다.</p>
          </div>
        </CitationBlock>
      </div>

      <div
        id="paper-smoothie-qwen-code"
        className="not-prose my-8 scroll-mt-24 border-l border-emerald-500/50 pl-4"
      >
        <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">구현 읽기 · 공개 변환 코드</p>
        <CitationBlock
          source="dnotitia/smoothie-qwen"
          citeKey={3}
          type="code"
          href="https://github.com/dnotitia/smoothie-qwen"
        >
          <div className="space-y-2 font-sans">
            <p><strong>문제:</strong> 논문의 token 분석과 weight 변환을 실제 Qwen checkpoint에 재현할 설정·코드·artifact가 필요합니다.</p>
            <p><strong>핵심 아이디어·기여:</strong> Unicode target, n-gram window·sample, min_scale·smoothness를 설정 파일로 받아 변환 모델을 별도 경로에 저장합니다.</p>
            <p><strong>전제·실험 조건:</strong> 지원 model class와 tokenizer, repository revision, config, dependency version이 맞아야 같은 결과를 재현할 수 있습니다.</p>
            <p><strong>근거 범위:</strong> algorithm의 실행 계약과 공개 checkpoint 목록, README의 제한된 실험표를 확인하는 구현 근거입니다.</p>
            <p><strong>비주장:</strong> 저장소의 기본값이 특정 서비스의 최적값이거나 공개 checkpoint가 사내 데이터에서도 회귀 없이 동작한다는 보장은 아닙니다.</p>
          </div>
        </CitationBlock>
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          변환본은 원본 checkpoint를 덮어쓰지 않고 config·tokenizer·risk 목록의
          digest와 함께 versioning합니다. paired evaluation에서 정상 예외와
          과제 품질을 통과했을 때만 canary로 보내며, 문자 suppression이 아니라
          reasoning 구간 전체가 다른 언어로 전환되는 문제가 남는다면 다음 절의
          SFT·RL이 더 직접적인 개입입니다.
        </p>
      </div>
    </section>
  );
}
