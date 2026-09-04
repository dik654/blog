import { CitationBlock } from "@/components/ui/citation";
import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { FewShotContextViz } from "./viz/FewShotContextViz";

export default function FewShot() {
  return (
    <section id="few-shot" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Few-shot은 예시 개수보다 경계 coverage와 순서 민감도가 중요하다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 id="prompt-roles" className="scroll-mt-20">
          System prompt는 고정 규칙, user prompt는 그 turn의 가변 입력입니다
        </h3>
        <p>
          System prompt는 role=system 메시지에 담겨 대화 내내 유지되는 standing instruction입니다. 매 request마다 다시 전송되지만 화면에는 보이지
          않습니다. persona나 출력 형식처럼 세션 전체에 적용할 규칙을 한 번만 적어 두면 이후 모든 turn에 반복 설명 없이 적용됩니다.
        </p>
        <p>
          User prompt는 role=user 메시지로 그 turn에서 실제로 처리할 질문이나 데이터를 담습니다. System prompt가 고정 규칙이라면 user prompt는
          request마다 바뀌는 가변 입력입니다. few-shot demonstration은 보통 이 user turn 앞뒤에 예시 대화쌍으로 끼워 넣습니다.
        </p>

        <h3 id="prompt-template" className="scroll-mt-20">
          Prompt template은 변수 치환으로 이 두 역할을 채워 넣습니다
        </h3>
        <p>
          Prompt template은 <code>{"{{query}}"}</code>·<code>{"{{examples}}"}</code>처럼
          이름 붙은 자리표시자가 있는 고정 문자열입니다. 요청마다 그 자리에
          실제 사용자 입력과 선택된 demonstration을 채우는 변수 치환을 거쳐야
          최종 prompt 문자열이 완성됩니다.
        </p>
        <p>
          이 치환 단계 덕분에 instruction 뼈대는 그대로 두고 example 개수나
          순서만 바꾸는 A/B 비교가 가능합니다. 예컨대 <code>{"{{examples}}"}</code> 자리에
          예시 3개를 이어 붙이면 template 코드를 고치지 않고도 few-shot 조건을
          4개로 늘릴 수 있습니다.
        </p>

        <h3 className="scroll-mt-20">
          이제 그 예시 하나의 형태를 봅니다
        </h3>
        <p>
          <strong>In-context learning(ICL)</strong>은 model weight를 update하지 않고
          현재 request의 instruction과 demonstration을 조건으로 completion behavior가
          달라지는 사용 방식입니다. Instruction만 주면 zero-shot, 입력·출력 example을
          함께 주면 few-shot입니다. Context가 끝나면 demonstration도 사라지므로
          영구적으로 학습한 것과 같다고 보면 안 됩니다.
        </p>
        <p>
          Few-shot은 label 의미나 output format을 설명만으로 전달하기 어려울 때 유용하지만 example을 많이 넣는다고 단조롭게 좋아지지는 않습니다. 운영
          distribution을 대표하는 사례, 서로 헷갈리는 decision boundary, minority class와 abstention을 포함하고 실제 request와 같은
          serialization을 사용해야 합니다.
        </p>
      </div>

      <TermBreakdown
        title="예시를 넣기 전에 세 가지를 따로 봅니다"
        description="Demonstration의 형태, 선택 민감도, 반복 비용을 이해한 뒤 하나의 request로 조합합니다."
        items={[
          {
            term: "Demonstration",
            description: "현재 context 안에 넣는 입력→출력 견본으로, model weight를 바꾸지 않습니다.",
            example: "'broken'→negative와 'thanks'→positive 같은 실제 serialization의 예시입니다.",
            boundary: "Context가 끝나면 사라지며 영구 학습이나 새로운 지식 저장이 아닙니다.",
          },
          {
            term: "Selection · order sensitivity",
            description: "어떤 예시를 고르고 어느 순서로 놓느냐에 따라 prediction이 달라지는 현상입니다.",
            example: "같은 세 예시의 permutation 10개에서 class별 accuracy와 prediction variance를 비교합니다.",
            boundary: "한 ordering의 최고 점수만 보고 task rule을 배웠다고 결론내리지 않습니다.",
          },
          {
            term: "Context budget",
            description: "매 request마다 demonstration token을 다시 prefill하는 반복 비용입니다.",
            example: "예시 1,200 token을 10만 요청에 넣으면 품질뿐 아니라 TTFT·비용·cache reuse를 비교합니다.",
            boundary: "높은 volume에서 오래 유지할 behavior라면 fine-tuning이나 별도 classifier가 더 나을 수 있습니다.",
          },
        ]}
      />

      <div className="not-prose my-8"><FewShotContextViz /></div>
      <ContentBoundary article="prompt-few-shot" />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div id="paper-gpt3-few-shot" className="not-prose scroll-mt-24">
          <CitationBlock source="Language Models are Few-Shot Learners" citeKey={4} href="https://arxiv.org/abs/2005.14165">
            GPT-3 논문은 gradient update 없이 text instruction과 demonstration으로
            여러 task를 수행하는 zero·one·few-shot evaluation을 대규모로 제시했습니다.
            해당 model family와 dataset의 결과이며 ICL이 영구 학습이거나 모든 task에서
            fine-tuning보다 낫다는 뜻은 아닙니다.
          </CitationBlock>
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 id="example-selection" className="scroll-mt-20">
          예시는 무작위로 뽑을 수도, 유사도로 고를 수도 있습니다
        </h3>
        <p>
          Demonstration을 고르는 방법은 크게 둘로 나뉩니다. 무작위 선택은 고정된 example 집합에서 매번 같은 것을 재사용해 비용이 가장 싸고 재현이 쉽지만 현재 입력과
          관련 없는 예시가 섞여 있어도 그대로 나갑니다.
        </p>
        <p>
          유사도 기반 선택은 현재 query를 embedding으로 바꿔 후보 pool에서 가장
          가까운 k개를 검색해 그때그때 다른 demonstration을 골라 넣습니다.
          예를 들어 pool 500개에서 top-5를 매 request마다 조회하면 관련성은
          오르지만 embedding 계산과 검색이 request 지연에 더해집니다.
        </p>
        <p>
          이때 후보 pool을 평가에 쓸 held-out set과 겹치게 두면 train/eval leakage가 생기므로 선택에 쓰는 pool과 평가에 쓰는 pool은 미리 분리해야
          합니다.
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Example order와 label prior를 흔들어 본다</h3>
        <p>
          Few-shot prediction은 마지막 example, label frequency, prompt format에 민감할 수 있습니다. 그래서 zero-shot
          baseline을 먼저 저장합니다. example subset과 순서를 여러 번 바꾸며 class별 accuracy·prediction variance를 측정합니다. 한
          ordering에서만 좋아진다면 task rule을 배운 것이 아니라 recency나 label prior에 기대고 있을 수 있습니다.
        </p>
        <div id="paper-calibrate-before-use" className="not-prose scroll-mt-24">
          <CitationBlock source="Calibrate Before Use" citeKey={5} href="https://arxiv.org/abs/2102.09690">
            이 논문은 few-shot text classification이 prompt format·example·ordering에
            민감한 문제를 다루고 content-free input으로 output bias를 보정하는
            contextual calibration을 제안했습니다. 해당 GPT-3 시점의 classification
            설정이며 모든 generative task의 example selection 문제를 해결한 것은 아닙니다.
          </CitationBlock>
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Few-shot은 즉시 고치기 쉽지만 매 request에 example token과 prefill cost가 반복됩니다. 같은 behavior를 높은 volume에서 오래 유지해야
          하고 example이 계속 늘어난다면 fine-tuning이나 별도 classifier를 비교합니다. 이때 prompt로 다듬은 examples와 failure cases는 학습
          데이터와 evaluation set의 출발점이 될 수 있지만 train/eval leakage는 분리해야 합니다.
        </p>
      </div>
    </section>
  );
}
