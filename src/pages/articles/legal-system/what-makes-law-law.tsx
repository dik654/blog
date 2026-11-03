import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import { CitationBlock } from "@/components/ui/citation";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import NormChainViz from "./what-makes-law-law/viz/NormChainViz";
import LegalityConditionsViz from "./what-makes-law-law/viz/LegalityConditionsViz";

/**
 * 한 과속 고지서를 끝까지 따라가며 법적 효력, 법치의 작동, 도덕적 정당성을
 * 분리한다. 사례와 금액은 설명을 위해 만든 가정이다.
 */
export default function WhatMakesLawLawArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          같은 10만 원 요구인데 왜 하나는 고지서이고 하나는 협박일까요?
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            가상 도시가 1월 1일에 다음 규칙을 공개했다고 하겠습니다. “2월
            1일부터 A도로에서 시속 50km를 넘으면 10만 원을 부과한다.” 민은 2월
            10일에 시속 62km로 달렸고, 시청 명의의 고지서를 받았습니다. 사례와
            금액은 설명을 위한 가정입니다.
          </p>
          <p className="leading-7">
            같은 날 담당 공무원이 개인 문자로 “오늘 내 계좌에 10만 원을 보내지
            않으면 차를 가져가겠다”고 했다면 어떨까요? 두 문장 모두 돈을
            요구하고, 따르지 않으면 불이익이 생깁니다. 힘의 크기만 보아서는 둘의
            차이를 설명할 수 없습니다.
          </p>
          <p className="leading-7">
            답은 한 문장으로 정리됩니다.{" "}
            <strong>
              법적 요구인지 여부는 그 요구를 만들 권한과 절차가 법체계의 최종
              기준까지 이어지는지에서 갈리고, 사람이 미리 행동을 맞출 수
              있는지는 공개성·명확성·소급 금지·집행 일치 같은 법치의 조건에서
              갈립니다.
            </strong>
          </p>
          <p className="leading-7">
            이 답은 바로 다음 질문을 낳습니다. 권한의 근거를 계속 물으면
            어디에서 멈출까요? <strong>(답: 2절)</strong> 적법하게 만든 규칙이면
            언제나 사람을 이끌 수 있을까요? <strong>(답: 3절)</strong> 법적
            효력이 있다는 말은 곧 정의롭고 따라야 한다는 뜻일까요?{" "}
            <strong>(답: 4절)</strong>
          </p>
        </div>

        <div
          className="not-prose my-10 grid gap-3 md:grid-cols-3"
          aria-label="한 고지서에 던지는 세 질문"
        >
          {[
            [
              "1",
              "법적 효력이 있는가?",
              "권한을 받은 기관이 정해진 절차로 만들었는지 봅니다.",
              "출처와 절차",
            ],
            [
              "2",
              "법답게 작동하는가?",
              "사람이 미리 알고 행동을 맞출 수 있는지 봅니다.",
              "공개·명확·장래·집행 일치",
            ],
            [
              "3",
              "도덕적으로 정당한가?",
              "내용이 옳고 복종할 이유가 있는지 따로 묻습니다.",
              "권리·공정·공익",
            ],
          ].map(([number, title, description, test]) => (
            <div
              key={number}
              className="rounded-xl border border-border bg-background p-4"
            >
              <p className="text-xs font-black text-primary">질문 {number}</p>
              <h3 data-toc-ignore className="mt-2 text-base font-bold">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {description}
              </p>
              <p className="mt-3 rounded-lg bg-muted/60 px-3 py-2 text-xs font-bold">
                검사 기준 · {test}
              </p>
            </div>
          ))}
        </div>

        <ContentBoundary article="what-makes-law-law" />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            이 글은 같은 고지서를 세 번 검사합니다. 세 질문은 연결되어 있지만
            서로 대신 답해 주지 않습니다. 먼저 법적 효력을 확인하고, 그다음 법이
            행동을 안내하는 방식으로 작동하는지 확인하고, 마지막에 내용의 옳고
            그름을 남겨 둡니다.
          </p>
          <p className="leading-7">
            여기서는 고지서가 어떤 규칙에서 나왔는지까지만 봅니다. 그 규칙의
            문장이 민의 행동에 정확히 적용되는지는 마지막 절에서 다음 글로
            연결합니다.
          </p>
        </div>
      </section>

      <section id="command-vs-law" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          1. 불이익이 있다는 사실만으로는 법과 협박을 가를 수 없습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            공무원의 개인 문자는 “내가 힘을 쓸 수 있으니 돈을 내라”에서
            끝납니다. 고지서는 다릅니다. “누가, 어떤 조건에서, 얼마를, 어떤
            절차로 부과할 수 있는가”를 미리 정한 규칙과 권한을 가리켜야 합니다.
            담당자는 그 범위를 넘으면 안 되고, 민은 근거와 절차를 다툴 수 있어야
            합니다.
          </p>
          <p className="leading-7">
            그렇다고 모든 법적 결정이 여러 사람에게 똑같이 쓰인 문장이어야 하는
            것은 아닙니다. 판결, 허가 조건, 세금 고지처럼 한 사람에게 향한
            결정도 일반 규칙에 따라 권한 있는 기관이 내렸다면 법적일 수
            있습니다. 중요한 것은 고지서 자체가 일반적인가가 아니라, 그 고지서를
            만드는 권한과 기준이 앞서 마련되어 있는가입니다.
          </p>
          <p className="leading-7">
            또 법은 벌을 명하는 문장만으로 이루어지지 않습니다. 계약을 맺고,
            유언을 남기고, 회사를 세우고, 새 규칙을 만드는 권한도 법이 줍니다.
            “위반하면 벌한다”만으로 법 전체를 설명하면 이런 권한 부여 규칙을
            놓치게 됩니다.
          </p>
          <p className="leading-7">
            따라서 첫 번째 차이는 <strong>힘</strong>이 아니라{" "}
            <strong>권한을 확인할 수 있는 공개된 경로</strong>입니다. 이제
            고지서에서 출발해 그 경로를 거꾸로 따라가 보겠습니다. 문장이 민의
            실제 주행에 맞는지는 5절에서 다시 남는 질문으로 돌려놓습니다.
          </p>
        </div>

        <CitationBlock
          source="Stanford Encyclopedia of Philosophy · The Nature of Law"
          citeKey={1}
          href="https://plato.stanford.edu/entries/lawphil-nature/"
        >
          법을 주권자의 명령과 위협으로만 설명하기 어려운 이유를 정리한
          자료입니다. 계약·유언처럼 사람에게 권한을 주는 규칙과, 법을 만들고
          바꾸고 판정하는 규칙은 단순한 명령 모형에 잘 들어맞지 않습니다.
        </CitationBlock>
      </section>

      <section id="validity-chain" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          2. 권한의 근거는 위로 이어지지만 마지막에는 문서가 아니라 관행이
          있습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            고지서의 근거를 물으면 시 조례나 법률이 나옵니다. 그 규칙을 누가
            만들 수 있었는지 물으면 더 높은 법과 헌법이 나옵니다. 아래 문서가
            <strong>법적 효력</strong>을 가지려면 위에서 권한을 받았고, 정해진
            절차와 범위를 지켜야 합니다.
          </p>
          <p className="leading-7">
            하지만 “헌법도 다른 법이 허락했기 때문에 법이다”라고 답하면 질문은
            끝없이 이어집니다. 어느 지점에서는 법원이 판결할 때, 의회가 법을
            만들 때, 공직자가 집행할 때 실제로 공통 기준으로 쓰는 것이 무엇인지
            보아야 합니다. 법철학자 H. L. A. 하트는 이 최종적인 사회적 기준을
            <strong>승인의 규칙</strong>이라고 불렀습니다.
          </p>
          <p className="leading-7">
            이것은 헌법 위에 놓인 비밀 문서가 아닙니다. 공직자들이 헌법, 입법
            절차, 판례 같은 자료를 법의 근거로 받아들이고 실제 판단에 사용하는
            관행을 가리킵니다. 국가마다 그 기준의 구성은 다를 수 있고, 체제
            전환기에는 어느 기준이 최종적인지를 두고 충돌할 수도 있습니다.
          </p>
        </div>

        <NormChainViz />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            가상 사례에서는 고지서 → 시 규칙 → 법률 → 헌법과 공통의 공직 관행을
            따라갑니다. 중간 어느 곳에서든 권한이 없거나 절차를 어겼다면 그
            고지서의 법적 효력이 흔들립니다. 반대로 이 경로가 이어진다는
            사실만으로 10만 원이라는 내용이 공정하다고 결론 내릴 수는 없습니다.
          </p>
        </div>

        <CitationBlock
          source="Stanford Encyclopedia of Philosophy · Legal Positivism"
          citeKey={2}
          href="https://plato.stanford.edu/entries/legal-positivism/"
        >
          하트의 승인 규칙은 법적 효력의 최종 기준을 정합니다. 이 기준 자체는 더
          높은 법에서 효력을 받는 문서가 아니라, 공직자들이 공통 기준으로
          받아들여 실제로 사용하는 사회적 규칙이라는 설명입니다.
        </CitationBlock>
      </section>

      <section id="form-conditions" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          3. 법적 효력이 있어도 사람이 미리 행동을 맞추지 못할 수 있습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            시의회가 적법한 절차로 속도 규칙을 만들었다고 하겠습니다. 그런데
            규칙을 숨겨 두었다가 단속 뒤에 공개하거나, “적당히 빠르면
            벌한다”고만 쓰거나, 2월에 만든 규칙을 1월 운전에 적용한다면
            어떨까요? 법적 근거가 있다는 답만으로는 민이 자기 행동을 미리 맞출
            수 없습니다.
          </p>
          <p className="leading-7">
            론 풀러는 제정된 일반 규칙을 통해 통치하려면 여덟 가지 이상을
            지향해야 한다고 설명했습니다. 규칙은 일반적인 기준으로 표현되고,
            공개되어야 하며, 앞으로의 행동을 다뤄야 합니다. 뜻이 분명하고 서로
            모순되지 않아야 하며, 실제로 지킬 수 있어야 합니다. 너무 자주 바뀌지
            않아야 하고, 공무원의 집행도 적어 둔 규칙과 맞아야 합니다.
          </p>
          <p className="leading-7">
            이 여덟 항목은 차례대로 통과하는 절차가 아닙니다. 같은 규칙을 서로
            다른 방향에서 확인하는 점검표입니다. 한 항목이 약해질수록 사람이
            규칙을 보고 선택할 가능성도 약해집니다. 다만 항목 하나가 조금
            부족하다고 모든 법학자가 곧바로 “법이 아니다”라고 판정하는 것은
            아닙니다. 풀러의 목록은 영향력 있는 법치 이론이지, 논쟁이 끝난 보편
            공식은 아닙니다.
          </p>
        </div>

        <LegalityConditionsViz />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            적용 범위도 구분해야 합니다. 법원이 특정 피고에게 내리는 판결처럼
            개별 결정을 모두 일반 규칙으로 바꿀 수는 없습니다. 핵심은 그 개별
            결정이 공개되고 안정된 일반 기준과 권한 아래에서 내려지는가입니다.
            법치는 모든 통치 행위를 같은 문장 모양으로 만들라는 요구가 아닙니다.
          </p>
        </div>

        <CitationBlock
          source="Stanford Encyclopedia of Philosophy · The Rule of Law"
          citeKey={3}
          href="https://plato.stanford.edu/entries/rule-of-law/"
        >
          풀러의 여덟 원칙과 그 적용 범위를 함께 정리한 자료입니다. 이 원칙들은
          특히 공개된 일반 규칙으로 통치하는 방식에 관한 것이며, 모든 행정
          과업에 같은 형식이 적합하다는 뜻은 아니라고 설명합니다.
        </CitationBlock>
      </section>

      <section id="why-form-matters" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          4. 법적 효력, 법치의 작동, 도덕적 정당성은 서로 다른 판단입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            이제 처음의 고지서를 세 번 검사할 수 있습니다. 첫째, 시청에 부과
            권한이 있고 절차를 지켰는지 묻습니다. 이것이 법적 효력의 질문입니다.
            둘째, 규칙이 미리 공개되고 이해 가능하며 실제 집행과 일치하는지
            묻습니다. 이것이 법치의 작동에 관한 질문입니다.
          </p>
          <p className="leading-7">
            셋째, 제한 속도와 금액이 공정한지, 권리를 부당하게 해치지 않는지,
            시민이 복종할 도덕적 이유가 있는지 묻습니다. 이것이
            <strong>도덕적 정당성</strong>의 질문입니다. 앞의 두 검사에
            통과했다고 세 번째 답까지 자동으로 “그렇다”가 되지는 않습니다.
          </p>
          <p className="leading-7">
            그렇다고 풀러의 여덟 원칙을 단순한 행정 효율로만 보면 안 됩니다.
            공개된 규칙에 따라 사람을 대한다는 것은 시민을 명령에 반응하는
            물체가 아니라, 이유를 이해하고 자기 행동을 정할 수 있는 사람으로
            대하는 방식이기도 합니다. 풀러가 이를 법의 “내적 도덕성” 논의에 놓은
            이유입니다.
          </p>
        </div>

        <div className="not-prose my-10 overflow-hidden rounded-xl border border-border">
          <div className="grid bg-muted/40 text-sm font-bold sm:grid-cols-[11rem_1fr]">
            <div className="border-b border-border p-3 sm:border-b-0 sm:border-r">
              검사 결과
            </div>
            <div className="p-3">읽어도 되는 결론</div>
          </div>
          {[
            [
              "효력 O · 법치 O",
              "법체계 안의 유효한 규칙이며, 시민이 미리 행동을 맞출 수 있습니다. 그래도 내용이 정의로운지는 별도입니다.",
            ],
            [
              "효력 O · 법치 약함",
              "권한과 절차의 근거는 있지만 숨겨진 규칙·소급 적용·자의적 집행 때문에 행동 안내가 무너집니다.",
            ],
            [
              "효력 X",
              "공개적이고 합리적으로 보이는 요구라도 권한이나 절차의 근거가 없으면 그 체계 안의 법적 요구로 보기 어렵습니다.",
            ],
          ].map(([result, conclusion]) => (
            <div
              key={result}
              className="grid border-t border-border text-sm leading-6 sm:grid-cols-[11rem_1fr]"
            >
              <div className="bg-muted/20 p-3 font-bold sm:border-r sm:border-border">
                {result}
              </div>
              <div className="p-3 text-muted-foreground">{conclusion}</div>
            </div>
          ))}
        </div>

        <ProgressiveDetail
          title="부당한 규칙도 법이라고 불러야 할까요?"
          preview="법실증주의와 자연법론이 갈리는 핵심을 본문보다 한 단계 깊게 봅니다."
        >
          <p className="leading-7">
            법실증주의의 중심 생각은 법의 존재와 내용이 사회적 사실에 달려
            있다는 것입니다. 이 관점에서는 부당한 규칙도 법적 효력을 가질 수
            있으며, “법이다”와 “따라야 한다”를 분리해 말할 수 있습니다.
          </p>
          <p className="leading-7">
            자연법 전통의 여러 입장은 법과 도덕의 연결을 더 강하게 봅니다.
            극도로 부당한 규칙은 법의 핵심 자격을 잃는다고 설명할 수 있습니다.
            같은 전통 안에서도 정확히 어디에서 선을 긋는지는 다릅니다.
          </p>
          <p className="leading-7">
            입문 단계에서 가장 안전한 방법은 이름을 먼저 고르는 것이 아니라 세
            판단을 따로 적는 것입니다. “이 체계에서 효력은 있다. 법치의 조건은
            심하게 훼손됐다. 내용은 부당하다”처럼 쓰면 서로 다른 논쟁을 한
            문장에 섞지 않을 수 있습니다.
          </p>
        </ProgressiveDetail>

        <CitationBlock
          source="Yale University Press · Lon L. Fuller, The Morality of Law"
          citeKey={4}
          href="https://yalebooks.yale.edu/book/9780300010701/the-morality-of-law/"
        >
          풀러가 법과 도덕의 관계를 다루며 여덟 원칙을 법의 내적 도덕성이라는
          문제 안에 놓았음을 확인할 수 있는 출판사 서지입니다. 따라서 이를
          단순한 운영 효율 목록으로 축소해서는 안 됩니다.
        </CitationBlock>
      </section>

      <section id="boundary" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          5. 법이라는 확인이 끝나도 해석과 복종의 질문은 남습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            처음의 시청 고지서를 다시 보겠습니다. 권한과 절차의 경로가 이어지면
            법적 효력을 인정할 근거가 생깁니다. 규칙이 미리 공개되고 분명하며
            적힌 대로 집행되면, 민은 자기 행동을 미리 맞출 수 있습니다.
            여기까지가 이 글에서 확인한 범위입니다.
          </p>
          <p className="leading-7">
            그러나 “시속 62km가 측정 오차를 고려해도 위반인가”, “긴급 피난 중인
            운전자에게도 같은 규칙을 적용하는가”처럼 일반 문장과 개별 사건
            사이의 문제가 남습니다. 다음 글{" "}
            <Link to="/law/legal-system/rules-standards-and-interpretation">
              규칙과 기준
            </Link>
            은 이 해석의 구간을 다룹니다.
          </p>
          <p className="leading-7">
            부당한 규칙에 복종할 도덕적 의무가 있는지도 남습니다. 법적 효력은
            “이 체계가 무엇을 법으로 취급하는가”에 답하지만, “나는 왜 따라야
            하는가”를 혼자 해결하지 않습니다. 이 구분을 지켜야 법을 힘과 같다고
            축소하지 않으면서도, 법이라는 이름만으로 정당성을 보증하지 않을 수
            있습니다.
          </p>
        </div>
      </section>

      <section id="review" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          6. 새 사례에 세 질문을 적용해 보세요
        </h2>
        <ReviewPrompts
          questions={[
            "권한 없는 공무원이 완벽하게 공개된 규칙을 만들어 집행했다면, 법적 효력과 법치의 작동은 각각 어떻게 판정해야 할까요? (답: 2절·4절)",
            "시의회가 적법하게 만든 규칙을 단속 뒤에 처음 공개했다면, 어떤 판단은 통과하고 어떤 판단은 실패할까요? (답: 3절·4절)",
            "법적 효력과 법치의 조건을 모두 충족한 차별 규칙을 보고도 왜 도덕적 정당성을 따로 물어야 할까요? (답: 4절)",
          ]}
        />
      </section>
    </div>
  );
}
