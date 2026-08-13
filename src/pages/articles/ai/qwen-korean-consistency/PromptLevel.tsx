import PromptLevelViz from "./viz/PromptLevelViz";

export default function PromptLevel() {
  return (
    <section id="prompt-level" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        프롬프트는 출력 정책을 알려 주지만 weight를 바꾸지는 않습니다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          가중치에 접근할 수 없는 API 모델에서도 즉시 바꿀 수 있는 것은
          프롬프트입니다. 프롬프트는 “기본 응답은 한국어, 명시된 번역은 중국어”와
          같은 <strong>요청 시점의 정책</strong>을 문맥에 추가하고 다음 token
          분포에 영향을 줍니다. 그러나 이미 학습된 weight, tokenizer,
          <code>lm_head</code>를 갱신하는 학습은 아니므로, 한 번 잘 작동했다고
          모델의 언어 선호 자체가 고쳐졌다고 말할 수는 없습니다.
        </p>
        <p>
          그래서 “한국어로만 답하라”를 여러 번 반복하기보다, 기본 언어와 허용
          예외, 각 출력 구간의 계약을 먼저 적습니다. 고정 사례에서는 계산 설명과
          최종 답변은 한국어여야 하지만, 번역 필드의 “首尔”은 반드시 남아야
          합니다. 금지 규칙만 쓰면 정답 일부를 지우는 문제가 생깁니다.
        </p>
      </div>

      <div className="not-prose my-8">
        <PromptLevelViz />
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>정책은 기본값, 출력 구간, 예외 순서로 씁니다</h3>
        <p>
          모델이 판단해야 할 경계를 한 문장에 몰아넣지 않고, 어떤 필드에 어떤
          언어를 쓸지 구조적으로 제시합니다. 연구에서 reasoning trace를
          수집한다면 그 필드의 언어를 명시할 수 있지만, 일반 제품에서는 숨겨진
          chain-of-thought 공개를 요구하지 않고 “짧고 검증 가능한 근거”를 별도
          필드로 요청하는 편이 안전합니다.
        </p>
      </div>

      <div className="not-prose my-6 min-w-0 overflow-hidden rounded-xl border border-border bg-muted/15 p-4 sm:p-5">
        <p className="text-xs font-bold text-primary">고정 사례용 정책 예시</p>
        <pre className="mt-3 min-w-0 whitespace-pre-wrap break-words bg-transparent p-0 text-sm leading-6 text-foreground">
          {`기본 응답 언어는 자연스러운 한국어다.
계산 근거가 필요한 경우 짧고 검증 가능한 한국어 설명을 제공한다.
final_answer에는 계산 결과만 한국어로 쓴다.
translation에는 사용자가 요청한 대상만 지정 언어로 번역한다.
코드·수식·고유명사·명시적 원문 인용은 필요한 원래 표기를 유지한다.`}
        </pre>
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          이 정책에서 “首尔”은 <code>translation</code>에 있을 때만 허용됩니다.
          같은 문자열이 계산 근거에 섞이면 위치와 의도가 다르므로 leakage로
          분류됩니다. 이처럼 예외는 문자 목록이 아니라 요청의 의미와 출력 구간을
          함께 봐야 합니다.
        </p>

        <h3>프롬프트 효과만 보려면 나머지 조건을 고정합니다</h3>
        <p>
          변경 전후의 모델 version, system prompt 이외의 메시지, temperature,
          top-p, 최대 출력 길이를 고정하고 같은 seed를 지원한다면 함께 기록합니다.
          고정 사례도 한 번만 호출하지 않고 여러 번 반복해 문자 leakage율,
          reasoning/final 언어 일치율, 계산 정답률, 번역 예외 보존율을 각각
          비교합니다. 평균 하나로 합치면 “중국어를 없앴지만 번역 정답도
          없어진” 후보가 좋아 보일 수 있습니다.
        </p>

        <h3>한 사례를 길이와 문맥 slice로 확장합니다</h3>
        <p>
          평가 주제는 바꾸지 않되 요구 길이와 주변 문맥을 달리하면 프롬프트의
          취약한 지점을 찾기 쉽습니다. 예를 들어 같은 나눗셈 문제에 한 줄 근거와
          긴 검산을 각각 요구하고, 수식 표기나 중국어 번역 예외를 포함하거나
          제외한 paired slice를 만듭니다. 이때 정답 3,200원은 같으므로 언어
          정책을 바꾸다가 과제 정확도가 달라졌는지도 바로 확인할 수 있습니다.
        </p>
      </div>

      <div className="not-prose my-7 grid min-w-0 gap-3 sm:grid-cols-2">
        {[
          ["측정해야 하는 성공", "계산 근거와 final은 한국어이고, 3,200원이 맞으며, 번역 필드의 首尔은 보존됩니다."],
          ["프롬프트의 한계 신호", "긴 출력에서 전환이 반복되거나 정책을 강화할수록 정답·자연스러움·정상 예외가 손상됩니다."],
        ].map(([title, body]) => (
          <div key={title} className="min-w-0 rounded-lg border border-border/70 bg-background p-4">
            <p className="text-sm font-semibold">{title}</p>
            <p className="mt-2 break-words text-sm leading-6 text-muted-foreground">{body}</p>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>다음 개입으로 넘어가는 조건</h3>
        <p>
          프롬프트 후보를 paired evaluation으로 비교했는데도 허용 실패율을
          넘는다면, 원하는 대상에 따라 다음 층을 고릅니다. 특정 문자군의 과도한
          생성이 반복되고 오픈웨이트가 있다면 Smoothie-Qwen 같은 출력층 보정을,
          reasoning trace 전체의 언어와 문제 풀이 policy를 바꿔야 한다면 SFT와
          RL을 검토합니다. 모델을 바꿀 수 없는 서비스라면 런타임 가드로 남은
          실패를 분류하되, 프롬프트 실패를 무한 재시도로 숨기지는 않습니다.
        </p>
      </div>
    </section>
  );
}
