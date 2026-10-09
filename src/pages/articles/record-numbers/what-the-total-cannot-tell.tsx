import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import BuiltTotalViz from "./what-the-total-cannot-tell/viz/BuiltTotalViz";
import LastDigitsViz from "./what-the-total-cannot-tell/viz/LastDigitsViz";

/**
 * 총계는 센 수가 아니라 계산한 수입니다
 *
 * 역사 5편. 앞 글이 하나의 수가 어떤 절차로 나왔는지를 보았다면, 이 글은
 * 여러 수를 합쳐 만든 총계를 본다. 1차 자료는 헤로도토스 『역사』 7권
 * 184~187절이고 Macaulay 영역본(Project Gutenberg eBook 2456) 전사본으로
 * 읽었다. 환산 수치는 영역자 주석을 따랐고, 48로 나눈 검산은 이 글이 했다.
 */
export default function WhatTheTotalCannotTellArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          528만 3220이라는 수와 그 수를 만든 계산이 함께 적혀 있습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            같은 책의 조금 뒤에 더 큰 수가 나옵니다. 크세르크세스가
            테르모필라이까지 이끌고 간 사람이 모두 528만 3220이었다고 적혀
            있습니다. 끝자리가 0이 아니므로 앞 글에서 본 170만보다 정밀해
            보입니다.
          </p>

          <p className="leading-7">
            그런데 저자는 이 수를 그냥 적지 않고 <strong>그 앞 몇 절에 걸쳐
            계산을 전부 적어 둡니다.</strong> 배가 몇 척이었고 한 척에 몇
            명씩으로 쳤고 무엇을 얼마로 어림했는지가 차례로 나옵니다. 그래서
            읽는 쪽은 결과만 받지 않습니다. 어느 자리가 어디서 왔는지를 따라갈
            수 있습니다.
          </p>

          <p className="leading-7">
            <strong>
              계산이 적힌 총계에서 쓸 수 있는 것은 무엇이고, 끝자리의 정밀함은
              무엇을 뜻합니까.
            </strong>{" "}
            <Link to="/history/record-numbers/how-the-army-was-counted">
              앞 글
            </Link>
            이 한 수의 해상도를 물었다면, 이 글은 여러 수를 합칠 때 해상도가 어떻게
            되는지를 묻습니다.
          </p>
        </div>

        <BuiltTotalViz />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            짚을 자리가 넷입니다. 총계의 재료, 재료마다 붙은 꼬리표, 끝자리의
            출처, 그리고 저자가 셀 수 없다고 적은 자리와 직접 해 둔
            검산입니다.
          </p>

          <p className="leading-7">
            <em>여기까지만 읽어도 하나는 분명합니다. 자릿수가 많다고 정밀한
            수가 되지는 않습니다.</em>
          </p>
        </div>
      </section>

      <section id="ingredients" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 1. 총계는 여섯 개의 비율과 어림을 쌓아 만들어졌습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            아시아에서 온 배는 1,207척이었습니다. 저자는 한 척에 200명씩으로
            치면 24만 1400명이 된다고 셈해 둡니다. 여기에 배마다 자기 민족의
            전사 말고도 페르시아·메디아·사카이 사람 30명이 더 탔다고 해서 3만
            6210명을 더하고 오십노선 3,000척에는 여든 남짓씩 탔다고 보아
            24만을 더합니다. 아시아 해군이 51만 7610입니다.
          </p>

          <p className="leading-7">
            육군 쪽에는 앞 글의 보병 170만과 기병 8만이 들어갑니다. 여기에
            아라비아 낙타몰이와 리비아 전차몰이를 2만으로 잡아 더하면
            아시아에서 온 전체가 231만 7610이 됩니다. 유럽 쪽은 배 120척에서
            나온 2만 4000에 트라키아를 비롯한 여러 민족의 육군 30만을
            더합니다. 전투원 합계가 264만 1610이 됩니다.
          </p>

          <p className="leading-7">
            마지막 한 걸음이 가장 큽니다. 저자는 종자와 곡식을 실은 배의
            사람들이 전투원보다 적지 않고 오히려 많을 것이라고 적습니다.
            그러고는 더도 덜도 아니고 같다고 가정하겠다며 두 배로 만듭니다.
            그래서 528만 3220이 나옵니다. <strong>총계의 절반은 가정 하나가
            만든 것</strong>입니다.
          </p>
        </div>

        <CitationBlock
          source="헤로도토스, 『역사』 7권 184~186절 · G. C. Macaulay 영역"
          citeKey={1}
          href="https://www.gutenberg.org/ebooks/2456"
        >
          원문에서 두 대목만 옮깁니다 — “if one reckons at the rate of two
          hundred men to each ship”, 그리고 “I assume them to be equal in number
          with these, and neither at all more nor less; and so, being supposed
          equal in number with the fighting body, they make up the same number of
          myriads as they.” 유럽 쪽을 시작하면서는 “of this we must give a
          probable estimate”라고 적습니다. 본문의 아라비아 숫자는 영역자가 주석에
          풀어 둔 값(241,400 · 36,210 · 240,000 · 517,610 · 300,000 ·
          2,641,610 · 5,283,220)을 따랐습니다. Project Gutenberg의 Macaulay
          영역본 전사본(eBook 2456)으로 읽었고, facsimile이 아니므로 쪽수 대신
          권·절 번호까지만 적습니다.
        </CitationBlock>

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            <em>재료는 다 나왔습니다. 다음은 재료마다 성격이 다르다는 표시가
            어디에 붙어 있는가입니다.</em>
          </p>
        </div>
      </section>

      <section id="tags" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 2. 재료마다 어떤 종류의 수인지가 적혀 있습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            이 계산이 쓸 만한 까닭은 각 재료에 꼬리표가 붙어 있다는 데
            있습니다. 결과가 정확해서는 아닙니다. 배의 수 1,207척은 그냥
            적힙니다. 한 척에 200명은 그렇게 치면 그렇게 된다는 꼴로 적힙니다.
            오십노선의 인원은 여든 남짓이라고 적고, 유럽 쪽은 어림을 내놓아야
            한다고 먼저 밝힙니다.
          </p>

          <p className="leading-7">
            앞 분류에서 본 꼬리표가 여기서는 숫자에 붙습니다. 서술에서 누구의
            말인지를 밝히던 장치가 숫자에서는 <strong>이 수가 어떤 종류의
            수인지를 밝히는 장치</strong>가 됩니다. 둘이 하는 일은 같습니다.
            결과를 받는 쪽이 그 결과의 근거를 다르게 잡게 해 줍니다.
          </p>
        </div>

        <TermBreakdown
          title="총계에 들어간 세 종류의 수"
          description="같은 자리에 더해지지만 믿을 근거가 다릅니다."
          items={[
            {
              term: "그대로 적힌 수",
              description:
                "배 1,207척처럼 세어졌다고 전제되는 수입니다. 7권 89절은 민족별 척수를 늘어놓고 그 합이 1,207이라고 적지만 어떻게 세었는지는 적혀 있지 않습니다.",
              example:
                "앞 글의 보병 170만도 여기 들어오지만, 그 수만은 절차가 적혀 있어 해상도를 계산할 수 있습니다.",
              boundary:
                "출처가 적혀 있지 않은 수가 가장 많고, 그 사실 자체를 결론에 적어야 합니다.",
            },
            {
              term: "비율을 곱해 만든 수",
              description:
                "배 한 척당 200명, 배마다 전사 30명처럼 단위를 정해 곱한 수입니다.",
              example:
                "1,207 × 200 = 241,400, 1,207 × 30 = 36,210입니다. 비율이 틀리면 오차가 척수만큼 곱해집니다.",
              boundary:
                "앞 글의 단위 오차가 여기서도 그대로 작동합니다. 다만 여기서는 비율을 저자가 정했다는 것이 본문에 적혀 있습니다.",
            },
            {
              term: "어림하거나 가정한 수",
              description:
                "오십노선의 여든 남짓, 몰이꾼 2만, 유럽 육군 30만, 그리고 종자를 전투원과 같다고 둔 가정입니다.",
              example:
                "마지막 가정 하나가 총계의 절반을 만듭니다. 저자는 그것이 가정이라고 같은 문장에서 밝힙니다.",
              boundary:
                "가정된 수는 관찰이 아니므로 다른 기록과 맞춰 보는 근거가 되지 못합니다.",
            },
          ]}
        />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            <em>종류는 갈렸습니다. 이 종류들을 합친 뒤 끝자리에 무엇이
            남는지를 봅니다.</em>
          </p>
        </div>
      </section>

      <section id="last-digits" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 3. 끝자리는 여러 재료와 자리올림이 함께 만듭니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            재료를 늘어놓고 천 단위 아래를 보면 두 수가 남습니다. 1,207척에
            200명씩 잡은 24만 1400의 끝 400과 같은 배에 30명씩 더한 3만 6210의
            끝 210입니다. 둘을 더한 끝 610이 전투원 합계 264만 1610에
            남습니다. 다른 재료들은 모두 천의 배수입니다.
          </p>
        </div>

        <LastDigitsViz />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            끝 네 자리를 따지면 유럽 배의 2만 4000도 들어갑니다. 24만 1400의
            끝 1400, 3만 6210의 끝 6210, 2만 4000의 끝 4000을 더하면 1만
            1610입니다. 여기에 나머지 재료의 끝 네 자리 0을 더하고 두 배로
            만든 뒤 끝 네 자리만 남기면 3220입니다. <strong>이 자리는 각
            재료의 합과 자리올림에서 나온 표기입니다. 사람을 한 명씩 센
            정밀도는 아닙니다.</strong>
          </p>

          <p className="leading-7">
            합산에는 늘 이런 성질이 있습니다. 여러 수를 더할 때 결과의
            해상도는 가장 거친 재료에 맞춰져야 합니다. 표기는 그렇게 되지
            않습니다. 가장 거친 재료가 30만 단위로 어림한 값이어도 합계는
            끝자리까지 숫자를 갖습니다. 그 끝자리를 읽는 쪽이 정밀함으로
            착각하면 저자가 이미 밝혀 둔 가정들이 결과에서 지워집니다.
          </p>

          <ProgressiveDetail
            title="그러면 끝자리를 버리고 반올림해 인용하면 됩니까"
            preview="그 편이 낫지만 그것만으로는 부족합니다. 버려야 할 것은 자릿수가 아니라 잘못된 종류의 쓰임입니다."
          >
            <p className="leading-7">
              530만으로 반올림해 적으면 끝자리의 착각은 사라집니다. 그러나
              반올림한 수도 가정 하나가 절반을 만든 수입니다. 그 가정을 떼면
              264만으로 줄어듭니다. 자릿수를 줄여서는 이 사실이 전해지지
              않습니다.
            </p>
            <p className="leading-7">
              쓸 수 있는 방식은 둘입니다. 전투원 합계와 총계를 따로 적고 둘의
              차이가 종자를 전투원과 같다고 둔 가정에서 온다고 밝힐 수
              있습니다. 아니면 총계를 인용하지 않고 자릿수만 말할 수 있습니다.
              어느 쪽이든 저자가 적어 둔 것을 그대로 옮기는 일이며 새로
              판정하는 일은 아닙니다.
            </p>
          </ProgressiveDetail>

          <p className="leading-7">
            <em>끝자리가 어디서 왔는지는 밝혀졌습니다. 마지막으로 저자가 이
            총계로 무엇을 더 했는지를 봅니다.</em>
          </p>
        </div>
      </section>

      <section id="the-check" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 4. 셀 수 없다고 적은 자리가 있고, 해 둔 검산은 맞지 않습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            총계를 적은 바로 다음 절에서 저자는 경계를 긋습니다. 군대에 빵을
            구워 준 여자들, 첩, 환관은 아무도 그 수를 정확히 말할 수 없다고
            짚습니다. 짐 나르는 짐승과 인도 개들도 너무 많아 누구도 수를 댈 수
            없다고 덧붙입니다. <strong>총계에 들어가지 않은 것이 무엇인지가
            적혀 있는 셈</strong>이며 앞 글에서 민족별 수를 적지 못한다고 밝힌
            대목과 같은 꼴입니다.
          </p>

          <p className="leading-7">
            이어서 저자는 그 총계로 계산을 하나 해 봅니다. 사람마다 하루에 밀
            한 코이닉스씩만 받고 그 밖에 아무것도 받지 않아도 하루에 11만 340
            메딤노이가 든다고 적습니다. 여자와 환관과 짐승과 개는 여기 넣지
            않았다는 말도 붙입니다. 수를 그냥 두지 않고 그것으로 다른 양까지
            끌어낸 셈입니다.
          </p>

          <p className="leading-7">
            이 검산은 다시 검산할 수 있습니다. 영역자의 주석에 따르면 1
            메딤노스는 48 코이닉스입니다. 5,283,220을 48로 나누면 11만 67
            메딤노이와 4 코이닉스가 나옵니다. 책에 적힌 11만 340과 맞지
            않습니다. 영역자도 같은 주석에서 이 계산이 틀렸다고 써 두었습니다.
          </p>

          <p className="leading-7">
            틀린 계산이 남아 있다는 사실이 이 대목의 값입니다. 저자가 결과만
            적었다면 11만 340이라는 수는 확인할 길 없는 또 하나의 숫자로
            남았을 것입니다. 사람 수와 하루 배급량이라는 규칙을 함께 적어
            두었기 때문에 2,400년 뒤의 독자가 나눗셈 한 번으로 어긋남을
            찾아냅니다. <strong>계산을 적어 두는 일은 틀릴 위험을 늘리는 대신
            틀림을 찾을 수 있게 만듭니다.</strong>
          </p>

          <p className="leading-7">
            <em>이 글의 답은 여기까지입니다. 총계에서 남는 것은 자릿수와 그
            자릿수가 올라앉은 가정들입니다. 끝자리와 저자의 검산 결과는 남지
            않습니다.</em>
          </p>
        </div>
      </section>

      <section id="handoff" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          다음은 세기 위한 숫자가 아닌 숫자입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            지금까지 두 글에서 본 숫자는 무엇이 얼마나 있는지를 재려고 적힌
            숫자였습니다. 그런데 사료에 적힌 숫자가 모두 재기 위해 적힌 것은
            아닙니다. 어떤 숫자는 무엇을 해야 하는지를 정하려고 적힙니다.
            사람을 쳐서 다치게 하면 은 얼마를 물라는 식입니다.
          </p>

          <p className="leading-7">
            그런 숫자는 센 결과가 아니므로 해상도를 물을 수 없고 검산할 수도
            없습니다. 그러면 거기서 읽을 수 있는 것은 무엇입니까. 측정된
            숫자와 섞어 쓰면 무엇이 잘못됩니까. 다음 글의 질문입니다.
          </p>

          <h3 className="mt-10 mb-4 text-lg font-bold">
            읽고 나서 맞춰 볼 질문
          </h3>

          <p className="leading-7">
            1. 총계 528만 3220의 절반이 어디서 왔습니까.{" "}
            <strong>(답: 부품 1절)</strong>
          </p>

          <p className="leading-7">
            2. 끝 네 자리 3220을 만든 재료는 무엇이고 어떻게 그 자리까지
            왔습니까. <strong>(답: 부품 3절)</strong>
          </p>

          <p className="leading-7">
            3. 저자의 하루치 식량 계산이 틀렸다는 것을 어떻게 알 수 있습니까.{" "}
            <strong>(답: 부품 4절)</strong>
          </p>
        </div>

        <ContentBoundary article="what-the-total-cannot-tell" />
      </section>
    </div>
  );
}
