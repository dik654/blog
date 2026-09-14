import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import ClaimNetworkViz from "./money-as-a-claim/viz/ClaimNetworkViz";
import MoneyAsAClaimViz from "./money-as-a-claim/viz/MoneyAsAClaimViz";
import BarterCostViz from "./money-as-a-claim/viz/BarterCostViz";

/**
 * 돈은 물건이 아니라 남이 갚아야 할 약속입니다
 *
 * 금융 카테고리의 입구 글이다. 먼저 금융 전체를 청구권의 그물로 한 화면에 놓고,
 * 그 그물의 가장 아래 한 칸을 여는 것으로 범위를 좁힌다. 이자·현재가치 계산은
 * 다음 글이, 예금이 생기는 자리는 은행 글이 소유한다.
 */
export default function MoneyAsAClaimArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          금융은 약속이 층으로 겹친 그물이고, 돈은 그 맨 아래 한 칸입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            금융을 멀리서 보면 하나의 그물이 보입니다. 가계와 기업은 은행에
            예금이라는 청구권을 갖고, 은행은 중앙은행에 지급준비금이라는 청구권을
            가지며, 기업과 정부는 시장에서 채권과 주식이라는 청구권을 발행합니다.
            감독기관은 이 칸들이 무너져 옆 칸을 끌고 가지 않도록 각 칸에 미리
            자본을 쌓게 합니다.
          </p>

          <p className="leading-7">
            이 그물의 가장 아래에 한 칸이 있습니다. 우리가 매일 쓰면서도 정체를 거의 묻지 않는 것, 곧 돈입니다. 통장의 100만 원은 창고 어딘가의 금괴가 아니라 은행이 당신에게
            지고 있는 빚입니다. 지갑의 만 원권은 한국은행의 장부에서 부채 항목에 적힙니다.
          </p>

          <p className="leading-7">
            그림을 먼저 보여 드리는 이유가 있습니다. 뒤따르는 글들이 저마다 다른 주제를 다루는 것처럼 보이지만 실은 이 한 장의 화살표를 하나씩 열어 가는 일이기 때문입니다. 예금은
            어떻게 생기는지, 중앙은행은 무엇을 움직여 금리를 정하는지, 시장은 청구권에 어떻게 값을 매기는지, 규제는 왜 자본을 쌓게 하는지가 모두 이 그림 안에 있습니다.
          </p>
        </div>

        <ClaimNetworkViz />

        <ContentBoundary article="money-as-a-claim" />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            그래서 이 글이 푸는 질문은 하나로 좁혀집니다.{" "}
            <strong>
              왜 그물의 맨 아래 칸이 조개껍데기나 금 같은 물건이 아니라, 누군가가
              반드시 갚아야 하는 약속의 형태로 굳었는가
            </strong>
            입니다. 이 질문에 답하고 나면 나머지 그림이 왜 그렇게 생겼는지가 훨씬
            쉽게 읽힙니다.
          </p>

          <p className="leading-7">
            답은 세 걸음으로 나옵니다. 먼저 물건끼리 바꾸는 방식이 어디서 막히는지 보고, 그 막힘을 푸는 도구가 사실 한 가지 일이 아니라 세 가지 일을 한다는 것을 확인합니다. 그러면
            세 가지 중 하나에는 물건일 필요가 전혀 없다는 사실이 드러나고 거기서 약속이 물건의 자리를 차지합니다. 마지막으로 그렇게 만들어진 약속이 얼마나 쌓여 있는지 세는 법으로
            닫습니다.
          </p>

          <p className="leading-7">
            시점이 다른 돈을 견주는 계산, 곧 이자와 현재가치는 이 글이 다루지
            않습니다. 그 계산은{" "}
            <Link to="/finance/money/time-value-and-discounting">
              시간의 값을 재는 법
            </Link>
            이 소유하며, 이 글을 먼저 읽고 넘어가는 것이 자연스럽습니다.
          </p>
        </div>
      </section>

      <section id="exchange-problem" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          첫째 걸음: 물물교환은 두 사람의 필요가 맞물릴 때만 성립합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            그물의 맨 아래 칸이 왜 생겼는지 알려면 그것이 없던 상태를 봐야
            합니다. 쌀을 가진 사람이 신발을 원하면, 신발을 가졌으면서 마침 쌀을
            원하는 사람을 찾아야 합니다. 두 사람의 필요가 서로 맞물려야 한다는 이
            조건을 <strong>욕구의 이중 일치</strong>라고 부릅니다. 거래가 깨지는
            이유는 물건이 없어서가 아니라 짝이 맞지 않아서입니다.
          </p>

          <p className="leading-7">
            짝을 못 찾으면 방법은 하나뿐입니다. 당장 쓸 일이 없어도 남들이 잘
            받아 주는 물건을 일단 받아 두는 것입니다. 이렇게 내가 쓰려고가
            아니라 다음 거래에 넘기려고 받아 두는 물건을{" "}
            <strong>교환 매개</strong>라고 합니다. 소금이든 조개껍데기든 담배든,
            공동체가 그것을 받아 줄 것이라고 서로 믿는 동안에는 돈처럼
            움직입니다.
          </p>

          <p className="leading-7">
            여기서 이미 한 가지가 드러납니다. 매개가 되기 위한 조건은 물건 자체의
            쓸모가 아니라 <em>남들이 다시 받아 준다는 믿음</em>이라는 점입니다.
            이 사실은 뒤에서 결정적인 역할을 하므로 기억해 둘 만합니다.
          </p>
        </div>

        <MoneyAsAClaimViz />

        <div id="price-count" className="scroll-mt-20">
          <h3 className="mb-4 mt-12 text-xl font-bold">
            매개를 쓰면 발품만이 아니라 외울 것도 줄어듭니다
          </h3>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p className="leading-7">
              매개의 이익은 상대를 찾는 수고를 더는 데서 끝나지 않습니다. 물건을 서로 직접 바꾸면 가격은 물건 쌍마다 하나씩 필요하지만 모든 물건의 값을 하나의 매개로만 적으면 물건
              하나당 하나면 됩니다. 이 차이는 물건 종류가 늘수록 빠르게 벌어집니다.
            </p>
          </div>

          <ExplainedFormula
            question="물건 종류가 늘어날 때 사람들이 알고 있어야 할 교환 비율은 몇 개가 되는가?"
            idea="직접 교환에서는 두 물건을 고르는 모든 방법마다 비율이 하나씩 필요합니다. 반대로 모든 물건의 값을 공통의 한 물건으로 적기로 정하면, 그 공통 물건과의 비율만 물건 수만큼 있으면 나머지 비율은 나눗셈으로 만들어집니다."
            formula={String.raw`N_{\text{직접}} = \frac{n(n-1)}{2}, \qquad N_{\text{매개}} = n-1`}
            annotatedFormula={String.raw`N_{\text{직접}} = \underbrace{\frac{n(n-1)}{2}}_{\text{서로 다른 두 물건을 고르는 경우의 수}}, \qquad N_{\text{매개}} = \underbrace{n-1}_{\text{매개를 뺀 나머지 물건 수}}`}
            operations={[
              {
                expression: String.raw`n(n-1)`,
                annotation: [
                  "첫 물건을 n가지 중에 고르고 두 번째를 남은 n-1가지 중에 고른 경우의 수입니다.",
                  "곱은 두 선택을 결합해 순서가 있는 쌍을 셉니다.",
                ],
              },
              {
                expression: String.raw`\frac{n(n-1)}{2}`,
                annotation: [
                  "쌀과 신발의 비율은 신발과 쌀의 비율과 같은 정보이므로 순서가 있는 쌍을 2로 나눠 중복을 지웁니다.",
                ],
              },
              {
                expression: String.raw`n-1`,
                annotation: [
                  "매개 자신은 자기와의 비율이 필요 없으므로 전체 n에서 하나를 뺍니다.",
                  "나머지 비율은 두 값의 나눗셈으로 얻으므로 따로 외우지 않습니다.",
                ],
              },
            ]}
            terms={[
              {
                symbol: String.raw`n`,
                name: "거래되는 물건의 종류 수",
                description:
                  "시장에서 값이 매겨지는 서로 다른 상품의 개수입니다. 같은 쌀이라도 등급이 다르면 다른 종류로 셉니다.",
              },
              {
                symbol: String.raw`N_{\text{직접}}`,
                name: "직접 교환에서 필요한 비율 개수",
                description:
                  "어떤 두 물건을 만나든 바로 교환할 수 있으려면 알고 있어야 하는 비율의 총수입니다.",
              },
              {
                symbol: String.raw`N_{\text{매개}}`,
                name: "매개를 쓸 때 필요한 비율 개수",
                description:
                  "모든 물건의 값을 한 물건으로만 적을 때 필요한 비율의 총수입니다.",
              },
            ]}
            assumptions={[
              "모든 물건 쌍이 실제로 거래될 수 있다고 둡니다. 일부 쌍이 아예 거래되지 않으면 직접 교환 쪽 개수는 이보다 작아집니다.",
              "한 물건에 하나의 값만 있다고 둡니다. 품질·시점·장소에 따라 값이 갈리면 n 자체가 커집니다.",
              "비율을 기억하고 전달하는 비용만 셉니다. 상대를 찾아다니는 비용은 이 식에 들어 있지 않습니다.",
            ]}
            interpretation="물건이 10가지면 45개와 9개, 100가지면 4,950개와 99개로 갈립니다. 늘어나는 속도가 제곱과 직선으로 다르다는 것이 요점입니다. 다만 이 식은 값을 적는 자를 하나로 모을 때 생기는 이익만 셉니다. 뒤에 나올 가치 저장이나 신용 기능의 이익은 여기에 들어 있지 않으므로, 이 식 하나로 화폐의 존재 이유를 다 설명했다고 읽으면 안 됩니다."
          />

          <BarterCostViz />

          <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
            <p className="leading-7">
              그런데 방금 센 이익은 넘겨받는 일이 아니라 값을 적는 일에서 나왔습니다. 같은 물건이 두 가지 일을 하고 있었다는 뜻이고 둘이 원래 한 덩어리인지 따져 볼 필요가
              생깁니다.
            </p>
          </div>
        </div>
      </section>

      <section id="three-functions" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          둘째 걸음: 하나로 보이던 일이 사실은 세 가지입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            앞 절에서 매개가 한 일은 셋으로 갈라집니다. 물건을 넘겨받는 데 쓰는{" "}
            <strong>교환 매개</strong>, 값을 적는 자로 쓰는{" "}
            <strong>계산 단위</strong>, 지금의 구매력을 나중으로 옮기는 데 쓰는{" "}
            <strong>가치 저장</strong>입니다. 한 물건이 셋을 동시에 잘하는 경우가
            흔할 뿐, 셋이 원래 한 덩어리인 것은 아닙니다.
          </p>

          <p className="leading-7">
            이 분해가 이 글의 축입니다. 셋을 갈라 놓고 나면 &ldquo;매개에는 물건이 필요한가&rdquo;라는 질문을 각 기능별로 따로 물을 수 있게 되고 거기서 답이 나옵니다.
          </p>
        </div>

        <TermBreakdown
          title="세 기능을 각각 무엇으로 판정하는가"
          items={[
            {
              term: "교환 매개 (medium of exchange)",
              description:
                "쓰려고가 아니라 다음 거래에 넘기려고 받아 두는 성질입니다. 받는 쪽이 다시 넘길 수 있다고 믿어야 성립하므로, 개인의 선호가 아니라 남들의 수용 여부가 판정 기준입니다.",
              example:
                "점심값 1만 원을 받은 식당은 그 돈을 먹지 않고 재료값으로 넘깁니다.",
              boundary:
                "널리 받아들여진다는 것이 값이 안정적이라는 뜻은 아닙니다. 매일 값이 흔들려도 교환은 계속될 수 있습니다.",
            },
            {
              term: "계산 단위 (unit of account)",
              description:
                "다른 모든 것의 값을 적는 공통의 자입니다. 회계 장부·계약서·세금 고지서가 무엇으로 쓰였는지를 보면 그 사회의 계산 단위를 알 수 있습니다.",
              example:
                "한국의 임대차 계약서에 적히는 보증금과 월세는 원으로 적습니다.",
              boundary:
                "계산 단위는 실제로 그 물건이 오가지 않아도 유지됩니다. 결제는 카드로 해도 값은 원으로 적힙니다.",
            },
            {
              term: "가치 저장 (store of value)",
              description:
                "오늘의 구매력을 미래로 옮기는 성질입니다. 얼마나 잘 옮기는지는 보관 비용과 값의 변동, 그리고 필요할 때 팔 수 있는지로 갈립니다.",
              example:
                "1년 뒤 등록금을 낼 돈을 예금에 두면 금액은 유지되지만 그사이 물가가 오르면 살 수 있는 양은 줄어듭니다.",
              boundary:
                "가치 저장은 돈만의 성질이 아닙니다. 주식·부동산·금이 모두 이 일을 하며, 돈은 대체로 가장 확실하지만 수익은 가장 낮은 선택지입니다.",
            },
          ]}
        />

        <div id="functions-split" className="scroll-mt-20">
          <h3 className="mb-4 mt-12 text-xl font-bold">
            셋이 서로 다른 대상에 맡겨지는 순간이 실제로 있습니다
          </h3>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p className="leading-7">
              구분이 말장난이 아니라는 증거는 셋이 갈라지는 상황에서 나옵니다.
              물가가 빠르게 오르는 나라에서 사람들은 자국 통화로 물건을 사면서도
              값은 달러로 적고 저축은 금이나 부동산으로 합니다. 교환 매개는 자국
              통화가, 계산 단위와 가치 저장은 다른 것이 맡은 상태입니다.
            </p>

            <p className="leading-7">
              반대 방향으로 갈라지기도 합니다. 잘 팔리지 않는 그림 한 점은 가치를 오래 저장할 수는 있어도 점심값으로 건네기는 어렵습니다. 저장에는 좋지만 매개로는 나쁩니다.
            </p>

            <p className="leading-7">
              이제 처음 질문으로 돌아갈 수 있습니다. 세 기능 중 교환 매개의
              성립 조건은 앞 절에서 확인했듯 &ldquo;남들이 다시 받아 준다는
              믿음&rdquo;뿐이었습니다. 그 조건 어디에도 물건이어야 한다는 항목이
              없습니다.
            </p>
          </div>
        </div>
      </section>

      <section id="credit-money" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          셋째 걸음: 조건이 믿음뿐이라면 매개는 약속이어도 됩니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            신뢰할 만한 발행자가 &ldquo;이 증서를 가져오면 갚겠다&rdquo;고 약속하면
            그 약속이 그대로 돌아다닙니다. 물건이 하던 자리를 채무가 대신
            차지하는 것이고, 이렇게 누군가의 채무가 돈으로 쓰이는 것을{" "}
            <strong>신용화폐</strong>라고 합니다. 이것이 첫 절에서 던진 질문의
            답입니다.
          </p>

          <p className="leading-7">
            오늘 쓰는 돈은 거의 전부 이 형태입니다. 예금은 은행이 예금자에게 진 빚이고, 현금은 중앙은행이 진 빚이며, 은행이 중앙은행에 맡겨 둔 지급준비금도 중앙은행의 빚입니다. 처음
            그림에서 본 세 칸이 바로 이 셋이었습니다.
          </p>

          <p className="leading-7">
            여기에 법이 한 겹 더 얹힙니다. <strong>법정통화</strong>는 채무를
            갚겠다고 내밀었을 때 채권자가 거절할 수 없도록 법이 강제 통용력을
            부여한 화폐입니다. 한국에서는 한국은행권이 이에 해당합니다. 다만
            이것은 &ldquo;빚을 갚는 수단으로 인정된다&rdquo;는 뜻이지, 모든 가게가
            현금을 반드시 받아야 한다는 뜻도, 그 값이 보장된다는 뜻도 아닙니다.
          </p>
        </div>

        <CitationBlock
          source="McLeay, Radia, Thomas · Money in the modern economy: an introduction (Bank of England Quarterly Bulletin 2014 Q1)"
          citeKey={1}
          href="https://www.bankofengland.co.uk/quarterly-bulletin/2014/q1/money-in-the-modern-economy-an-introduction"
        >
          중앙은행이 직접 쓴 개론으로, 현대의 돈을 &ldquo;모두가 남들도 받아 줄
          것이라 믿기 때문에 특별해진 차용증&rdquo;으로 정의하고 현금·예금·지급
          준비금을 각각 어느 부문이 어느 부문에 진 채무인지로 나눕니다. 다만 이
          자료는 영국 제도를 기준으로 쓰였고 예금의 대부분이 은행 대출로
          만들어진다는 주장의 근거는 이 글이 아니라 같은 호의 별도 논문에
          있습니다. 그 구조는 예금 창조를 다루는 다음 단계에서 따로 확인합니다.
        </CitationBlock>

        <div id="issuer-layers" className="scroll-mt-20">
          <h3 className="mb-4 mt-12 text-xl font-bold">
            같은 원인데 발행자가 다르면 떠안는 위험도 다릅니다
          </h3>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p className="leading-7">
              돈이 빚이라는 답은 곧바로 새 문제를 만듭니다. 빚은 갚지 못할 수 있으므로 어떤 돈을 들고 있느냐에 따라 떠안는 위험이 달라집니다. 예금 1억 원과 현금 1억 원은 액수가
              같아도 상대가 다릅니다. 처음 그림에서 층이 나뉘어 있던 이유가 여기 있습니다.
            </p>
          </div>

          <ProgressiveDetail
            title="예금과 현금은 같은 원인데 왜 위험이 다른가?"
            preview="예금은 개별 은행이, 현금은 중앙은행이 갚아야 하는 빚이라서 갚지 못할 가능성이 다릅니다."
          >
            <p className="leading-7">
              예금은 그 은행이 부실해지면 약속대로 돌려받지 못할 수 있습니다. 그래서 대부분의 나라는 일정 한도까지 예금을 보장하는 장치를 따로 둡니다. 한국에서는 예금보험공사가 이
              역할을 맡습니다. 한도를 넘는 금액은 은행이 정리될 때 다른 채권자들과 함께 손실을 나눠 집니다.
            </p>
            <p className="leading-7">
              현금과 지급준비금은 중앙은행의 채무입니다. 중앙은행은 자국 통화로 진 빚을 자국 통화를 발행해 갚을 수 있으므로 &ldquo;약속한 원을 못 준다&rdquo;는 의미의
              부도는 일어나지 않습니다. 하지만 그 원으로 살 수 있는 양이 줄어드는 일은 얼마든지 일어납니다. 상환 불능 위험과 구매력 하락 위험은 서로 다른 위험입니다. 하나가 없다고
              다른 하나가 없는 것은 아닙니다.
            </p>
            <p className="leading-7">
              보장 한도와 적용 범위는 나라마다 다르고 제도 개편으로 바뀝니다. 구체적인 금액을 외우기보다 &ldquo;한도 안은 보장, 한도 밖은 채권자로서 손실 분담&rdquo;이라는
              구조를 기억하는 편이 오래갑니다.
            </p>
          </ProgressiveDetail>
        </div>
      </section>

      <section id="money-aggregates" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          그물의 크기를 재려면 어디까지를 돈으로 볼지 먼저 정해야 합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            세 걸음으로 답이 나왔으니 이제 그림 전체로 돌아갈 차례입니다. 돈이
            여러 발행자의 빚이라면 &ldquo;돈의 총량&rdquo;은 그냥 세어지지
            않습니다. 어떤 빚까지 돈으로 칠지 정해야 숫자가 나옵니다. 그 기준을
            정해 만든 숫자가 <strong>통화지표</strong>이고, 기준은 현금으로 바꾸기
            쉬운 정도, 곧 유동성입니다.
          </p>

          <p className="leading-7">
            한국은행은 국제통화기금의 통화금융통계 기준에 맞춰 좁은 것부터 넓은
            것까지 여러 지표를 함께 냅니다. 현금과 바로 꺼내 쓸 수 있는 예금까지
            세면 M1, 여기에 2년 미만 정기예적금처럼 큰 손실 없이 빠르게 현금화할
            수 있는 상품을 더하면 M2입니다. 더 넓히면 금융기관유동성 Lf와
            광의유동성 L이 됩니다.
          </p>
        </div>

        <div id="aggregation-procedure" className="scroll-mt-20">
          <h3 className="mb-4 mt-12 text-xl font-bold">
            무엇을 넣고 뺄지는 발행자와 보유자를 먼저 갈라야 정해집니다
          </h3>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p className="leading-7">
              지표를 만들 때 반드시 지켜야 하는 규칙이 하나 있습니다. 돈을 세는
              대상에서 발행자 자신과 다른 발행 기관을 빼는 것입니다. 은행이 다른
              은행에 맡긴 예금까지 세면 같은 돈이 두 번 잡히기 때문입니다.
              앞 절에서 돈을 &ldquo;누구의 빚인가&rdquo;로 정의해 둔 것이 여기서
              바로 쓰입니다.
            </p>
          </div>

          <AlgorithmBlock
            title="어떤 금융상품을 통화지표에 넣을지 정하는 절차"
            input={[
              "금융상품 목록: 상품마다 발행 기관, 보유 주체, 만기와 중도 해지 조건",
              "포함 기준: 지표가 목표로 하는 유동성 문턱 (예: 즉시 인출 가능 / 2년 미만)",
            ]}
            steps={[
              {
                code: "발행자가 예금취급기관인지 확인한다. 아니면 더 넓은 지표의 후보로만 남긴다.",
                note: "돈은 지급 약속이므로 누가 그 약속을 졌는지가 첫 갈림길입니다. 발행자가 다르면 위험도 다릅니다.",
              },
              {
                code: "보유 주체가 비은행 민간(가계·기업)인지 확인한다. 발행 기관끼리 주고받은 잔액은 제외한다.",
                note: "같은 잔액이 발행자의 부채이면서 다른 발행자의 자산이면 두 번 세게 됩니다. 이 단계가 중복을 지웁니다.",
              },
              {
                code: "유동성 문턱을 적용한다. 문턱보다 꺼내기 쉬우면 포함, 어려우면 제외한다.",
                note: "M1과 M2를 가르는 것이 바로 이 문턱입니다. 문턱을 낮추면 좁은 지표, 높이면 넓은 지표가 됩니다.",
              },
              {
                code: "남은 잔액을 합산하고, 어떤 문턱을 썼는지 지표 이름과 함께 기록한다.",
                note: "같은 나라의 M2라도 문턱 정의가 바뀌면 시계열이 끊깁니다. 숫자만 보고 시점을 넘나들며 비교하면 안 되는 이유입니다.",
              },
            ]}
            output="선택한 유동성 문턱에서의 통화 잔액과, 그 숫자가 어떤 발행자·보유자·문턱 조합을 뜻하는지에 대한 정의"
          />

          <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
            <p className="leading-7">
              이 절차를 보면 통화지표가 자연의 상수가 아니라 정의에 따라 달라지는 숫자임이 드러납니다. &ldquo;통화량이 늘었다&rdquo;는 말은 어느 지표인지를 밝히지 않으면
              절반만 말한 것입니다.
            </p>
          </div>

          <CitationBlock
            source="IMF · Monetary and Financial Statistics Manual and Compilation Guide, Chapter 6: Money, Liquidity, Credit, and Debt (2016)"
            citeKey={2}
            href="https://www.imf.org/external/pubs/ft/mfsmcg/c6.pdf"
          >
            각국 통계 작성자를 위한 국제 기준으로, 통화 총량을 발행 부문과 보유
            부문을 먼저 가른 뒤 유동성 기준으로 묶어 정의하라고 규정합니다. 위
            절차의 첫 두 단계가 여기서 나옵니다. 다만 이 매뉴얼은 지표를 어떻게
            만들지에 대한 기준이지, 어떤 지표가 경기를 잘 설명하는지에 대한
            연구가 아닙니다. 통화량과 물가의 관계를 이 문서로 뒷받침할 수는
            없습니다.
          </CitationBlock>

          <CitationBlock
            source="한국은행 · 최근 유동성 상황에 대한 이해 (2025-12-16)"
            citeKey={3}
            href="https://www.bok.or.kr/portal/bbs/B0000347/view.do?nttId=10095141&menuNo=201106"
          >
            한국의 M1·M2·Lf·L이 각각 무엇까지 포함하는지 발행 기관과 상품 범위로
            정리한 한국은행 자료입니다. 본문의 한국 지표 구분은 여기에 맞췄습니다.
            특정 시점의 잔액 수치는 발표 시점 기준이므로 이 글에서는 숫자가
            아니라 구분 기준만 가져왔습니다.
          </CitationBlock>
        </div>
      </section>

      <section id="boundary" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          그물의 한 칸을 열었으니, 다음은 그 칸이 생기는 자리입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            먼저 경계를 그어 둡니다. 신용카드로 결제해도 카드 자체는 돈이 아닙니다. 카드는 &ldquo;내 예금을 당신에게 옮겨 달라&rdquo;는 지시를 전달하는 수단이고 실제로
            옮겨지는 것은 은행 장부의 예금입니다. 결제 수단과 돈은 층이 다릅니다.
          </p>

          <p className="leading-7">
            교통카드 잔액이나 상품권처럼 발행자가 좁게 정해진 것들도 마찬가지로
            경계에 있습니다. 발행자의 빚이라는 점은 예금과 같지만 받아 주는
            범위가 좁고 통화지표에도 들어가지 않습니다. 앞 절의 절차로 따지면
            발행자가 예금취급기관이 아니기 때문에 첫 단계에서 갈립니다.
          </p>

          <p className="leading-7">
            처음 그림으로 돌아가 보면 이제 맨 아래 화살표 하나를 읽을 수 있게 됐습니다. 남은 화살표들이 곧 다음 질문입니다. 예금이 은행의 빚이라면 그 빚은 애초에 어떻게 생겨났는지,
            중앙은행은 무엇을 움직여 금리를 정한다고 말할 수 있는지, 시장은 청구권에 어떻게 값을 매기는지입니다.
          </p>

          <p className="leading-7">
            다만 그 답들은 전부 &ldquo;지금의 1원과 1년 뒤의 1원은 다르다&rdquo;는
            계산을 전제로 합니다. 그래서 다음 글은 은행이 아니라 시간입니다.{" "}
            <Link to="/finance/money/time-value-and-discounting">
              시간의 값을 재는 법
            </Link>
            에서 할인과 현재가치를 세운 뒤 그림의 다음 칸으로 넘어갑니다.
          </p>
        </div>
      </section>
    </div>
  );
}
