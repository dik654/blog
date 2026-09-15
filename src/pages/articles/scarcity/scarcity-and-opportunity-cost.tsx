import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import OpportunityCostViz from "./scarcity-and-opportunity-cost/viz/OpportunityCostViz";
import MarginalStopViz from "./scarcity-and-opportunity-cost/viz/MarginalStopViz";

/**
 * 무엇을 포기할지부터 정해야 합니다
 *
 * 경제 시리즈의 1편. 바깥 선수 지식 없이 닫힌다. 고르는 일이 왜 생기는지,
 * 무엇으로 값을 재는지, 얼마나 할지를 어떻게 정하는지, 무엇을 계산에서
 * 빼는지까지가 범위다. 여럿이 서로의 사정을 모른 채 고르는 문제는 다음 글로
 * 넘긴다.
 */
export default function ScarcityAndOpportunityCostArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          무엇을 할지 정하는 일은 무엇을 안 할지 정하는 일과 같습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            오늘 오후에 무엇을 할지 정했다면 같은 시간에 할 수 있었던 다른 일을
            전부 정하지 않은 것입니다. 한쪽을 고르는 행동과 다른 쪽을 버리는
            행동은 두 개가 아니라 하나입니다.
          </p>

          <p className="leading-7">
            이것이 사소해 보이는 이유는 개인의 하루에서는 티가 안 나기
            때문입니다. 그런데 같은 일이 한 나라의 한 해에서도 일어납니다.
            무엇을 짓기로 하면 같은 사람과 같은 자재로 지을 수 있었던 다른 것을
            짓지 않기로 한 것입니다.
          </p>

          <p className="leading-7">
            그래서 첫 질문은 무엇을 만들까가 아니라 무엇을 안 만들까입니다.
            아래 그림이 그 셈을 한 번 보여 줍니다.
          </p>
        </div>

        <OpportunityCostViz />

        <ContentBoundary article="scarcity-and-opportunity-cost" />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            이 글이 푸는 질문은 하나입니다.{" "}
            <strong>
              모자란 것 앞에서 무엇을 기준으로 고르고, 그 선택이 잘한 것인지를
              무엇으로 재는가
            </strong>
            입니다.
          </p>

          <p className="leading-7">
            순서는 고르는 일이 왜 생기는지, 값을 무엇으로 재는지, 얼마나 할지는
            어떻게 정하는지, 그리고 무엇을 계산에서 빼야 하는지입니다.
          </p>

          <p className="leading-7">
            혼자 고를 때만 다룹니다. 여럿이 서로의 사정을 모르는 채 고르는 일은 이 글의 계산으로는 닫히지 않고 다음 글부터의 몫입니다.
          </p>
        </div>
      </section>

      <section id="why-choose" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 1. 모자란 것만으로는 고르는 일이 생기지 않습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            흔히 경제를 자원이 모자라서 생기는 문제라고 말하지만 모자람 하나로는
            부족합니다. 조건이 둘 다 필요합니다.
          </p>

          <p className="leading-7">
            하고 싶은 것이 여럿이어도 시간과 수단이 넉넉하면 고를 일이
            없습니다. 둘 다 하면 그만입니다. 반대로 수단이 모자라도 그것을 다른
            데 쓸 수 없으면 역시 고를 일이 없습니다. 쓸 데가 하나뿐인 것은 아껴
            봐야 돌아올 것이 없습니다.
          </p>

          <p className="leading-7">
            그래서 고르는 일은 <strong>모자라면서 동시에 쓸 데가 여럿일 때</strong>{" "}
            생깁니다. 공기는 모자라지 않아서 고를 일이 없고, 어제 지나간 시간은
            모자라지만 이제 쓸 데가 없어서 역시 고를 일이 없습니다.
          </p>

          <p className="leading-7">
            이 구분이 실제로 쓸모가 있는 이유는, 무언가가 문제가 되는지를 묻기
            전에 그것이 어느 쪽 조건에 걸리는지부터 갈라 주기 때문입니다.
            모자라지 않은 것을 아끼자는 말과 쓸 데가 하나뿐인 것을 아끼자는 말은
            둘 다 셈이 되지 않습니다.
          </p>
        </div>

        <CitationBlock
          source="Lionel Robbins, An Essay on the Nature and Significance of Economic Science (Macmillan, 1932), ch. I, pp. 13–15"
          citeKey={1}
          href="https://archive.org/details/1932RobbinsEssayOnTheNatureAndSignificanceOfEconomicScienceOCRe"
        >
          두 조건을 따로 떼어 적은 자리입니다. 목적이 여럿인 것만으로는
          부족하다는 대목에서 &ldquo;If I want to do two things, and I have ample
          time and ample means with which to do them, &hellip; then my conduct
          assumes none of those forms which are the subject of economic
          science&rdquo;라고 적고, 수단이 모자란 것만으로도 부족하다는 대목에서
          &ldquo;If means of satisfaction have no alternative use, then they may
          be scarce, but they cannot be economised&rdquo;라고 적습니다. 둘을
          합쳐 &ldquo;But when time and the means for achieving ends are limited
          and capable of alternative application, then behaviour necessarily
          assumes the form of choice&rdquo;로 맺고, 15면에서 &ldquo;Economics is
          the science which studies human behaviour as a relationship between
          ends and scarce means which have alternative uses&rdquo;라는 정의를
          내놓습니다. 공기를 자유재의 예로 드는 대목도 같은 쪽입니다. 1932년
          초판 본문을 Internet Archive의 스캔 전문으로 직접 대조했습니다. 이
          글이 쓰는 것은 위 두 조건까지이며, 로빈스가 같은 책에서 이어 가는
          가치판단과 경제학의 관계에 대한 논의는 다루지 않습니다.
        </CitationBlock>
      </section>

      <section id="opportunity-cost" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 2. 값은 치른 돈이 아니라 포기한 최선입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            고를 일이 생겼으면 이제 무엇으로 잴지가 남습니다. 치른 돈으로 재면
            돈이 안 드는 선택은 전부 공짜가 되어 버립니다. 하루를 통째로 쓰는
            일에 0원을 적을 수는 없습니다.
          </p>

          <p className="leading-7">
            그래서 값은 포기한 것으로 잽니다. 무언가를 하기로 한 값은 그 때문에
            하지 못한 것 가운데 가장 좋은 하나입니다. 이것을 기회비용이라고
            부릅니다.
          </p>

          <p className="leading-7">
            여기서 자주 틀리는 자리가 있습니다. 포기한 것이 여럿일 때 그것을
            전부 더하면 안 됩니다. 어차피 하나만 할 수 있었으므로 실제로 잃은
            것도 하나뿐입니다. 위 그림의 세 번째 장면이 그 자리입니다.
          </p>

          <p className="leading-7">
            그리고 기회비용은 사람마다 다릅니다. 같은 세 시간이라도 그 시간에
            할 수 있는 최선이 다르면 값이 다릅니다. 이 사실이 다음 글에서
            교환의 이득이 생기는 근원이 됩니다.
          </p>
        </div>

        <TermBreakdown
          title="값을 재는 세 가지 방식"
          description="같은 선택을 두고 무엇을 값으로 칠지에 따라 결론이 갈립니다."
          items={[
            {
              term: "치른 돈",
              description:
                "실제로 지갑에서 나간 금액만 셉니다. 회계가 쓰는 방식입니다.",
              example:
                "석 달 동안 일을 쉬고 시험을 준비했다면 교재값 30만 원만 값으로 칩니다.",
              boundary:
                "돈이 들지 않는 선택을 전부 공짜로 만들어, 시간을 쓰는 결정을 비교할 수 없게 합니다.",
            },
            {
              term: "포기한 최선",
              description:
                "그 선택 때문에 하지 못한 것 가운데 가장 좋은 하나를 값으로 칩니다.",
              example:
                "같은 석 달에 일했다면 벌었을 600만 원이 있으면 값은 630만 원입니다.",
              boundary:
                "포기한 것들의 값을 같은 자로 잴 수 있다고 가정합니다. 실제로는 그 자가 사람마다 다르고 본인도 정확히 모릅니다.",
            },
            {
              term: "포기한 것 전부의 합",
              description:
                "하지 못하게 된 모든 선택지의 값을 더합니다. 흔한 오해입니다.",
              example:
                "일할 기회 600만 원과 여행 200만 원을 더해 800만 원으로 칩니다.",
              boundary:
                "둘을 동시에 할 수 없었으므로 실제로 잃은 것은 하나뿐입니다. 더하면 값이 부풀어 어떤 선택도 밑지는 것으로 보입니다.",
            },
          ]}
        />

        <ProgressiveDetail
          title="포기한 최선을 그림으로 옮기면 경계선이 하나 나옵니다"
          preview="가진 것을 다 쓴 조합들을 이으면 선이 되고, 그 선의 기울기가 곧 기회비용입니다."
        >
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p className="leading-7">
              빵집이 하루에 쓸 수 있는 시간이 8시간이고 빵 한 판에 1시간,
              케이크 하나에 2시간이 든다고 하겠습니다. 시간을 남김없이 쓰는
              조합은 빵 8판과 케이크 0개에서 시작해 빵 0판과 케이크 4개까지
              이어집니다.
            </p>

            <p className="leading-7">
              이 조합들을 이은 선을 생산가능곡선이라고 부릅니다. 선 안쪽은 시간을
              남긴 것이라 아깝고, 선 바깥쪽은 8시간으로는 닿지 않습니다.
            </p>

            <p className="leading-7">
              이 선에서 읽어야 할 것은 위치가 아니라 기울기입니다. 케이크를
              하나 더 만들려면 빵 두 판을 포기해야 하므로 케이크 한 개의
              기회비용이 빵 두 판입니다. 기울기가 곧 값입니다.
            </p>

            <p className="leading-7">
              실제 생산가능곡선은 직선이 아니라 바깥으로 휩니다. 사람도 장비도 잘 맞는 일이 따로 있어서 빵을 많이 만들던 곳에서 케이크로 옮길수록 포기해야 하는 빵이 점점 늘어납니다.
              그래서 어느 한쪽으로 완전히 몰아가는 것이 대개 손해입니다.
            </p>
          </div>
        </ProgressiveDetail>
      </section>

      <section id="margin" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 3. 전부냐 아니냐가 아니라 한 단위 더냐를 묻습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            실제 결정은 대개 할지 말지가 아니라 얼마나 할지입니다. 빵을 구울지
            말지가 아니라 몇 판을 구울지이고, 공부를 할지 말지가 아니라 몇
            시간을 할지입니다.
          </p>

          <p className="leading-7">
            그런데 얼마나 할지를 총액으로 따지면 답이 안 나옵니다. 빵집 전체가
            남는 장사인지를 물으면 굽는 편이 낫다는 답만 나오고 몇 판인지는
            나오지 않습니다.
          </p>

          <p className="leading-7">
            그래서 질문을 한 단위로 좁힙니다. 한 판을 더 구우면 더 들어오는
            것과 더 나가는 것만 견줍니다. 들어오는 쪽이 크면 굽고 작으면
            멈춥니다.
          </p>

          <p className="leading-7">
            이 방식이 통하는 이유는 대개 한 단위 더 얻는 것이 점점 줄고 한 단위 더 드는 것이 점점 늘기 때문입니다. 두 값이 반대로 움직이므로 어딘가 한 번 교차하고 그 자리가 멈출
            곳입니다.
          </p>
        </div>

        <ExplainedFormula
          question="몇 개까지 하는 것이 맞습니까?"
          idea="한 단위를 더 했을 때 더 들어오는 것과 더 나가는 것만 견줍니다. 들어오는 쪽이 크면 그 한 단위는 하는 것이 낫고, 작으면 하지 않는 것이 낫습니다. 이 판정을 한 단위씩 계속 적용하면 두 값이 뒤집히는 자리에서 멈추게 되고, 그 지점이 전체 순이득이 가장 큰 곳과 같습니다."
          formula={String.raw`MB(q) > MC(q) \;\Rightarrow\; q\text{번째를 한다}, \qquad q^{*} = \max\{\, q : MB(q) > MC(q) \,\}`}
          annotatedFormula={String.raw`\underbrace{MB(q) > MC(q)}_{q\text{번째 하나에 대한 판정}} \;\Rightarrow\; \text{한다}, \qquad q^{*} = \max\{\, q : \underbrace{MB(q) > MC(q)}_{\text{뒤집히기 직전까지}} \,\}`}
          operations={[
            {
              expression: String.raw`MB(q) > MC(q)`,
              annotation: [
                "q번째 하나가 더 벌어 주는 것과 그 하나에 더 드는 것을 견줍니다.",
                "판정의 대상은 q번째 하나이지 전체가 아닙니다. 1번째가 남는다고 5번째도 남는 것은 아닙니다.",
              ],
            },
            {
              expression: String.raw`\max\{\, q : MB(q) > MC(q) \,\}`,
              annotation: [
                "판정을 통과하는 마지막 단위까지 하고 멈춥니다.",
                "MB가 줄고 MC가 느는 경우에만 이 집합이 1부터 이어지는 한 덩어리가 되어 max가 뜻을 갖습니다. 두 값이 오르내리면 남는 구간이 여럿으로 쪼개져 한 번 뒤집힌 곳에서 멈추면 안 됩니다.",
              ],
            },
            {
              expression: String.raw`\sum_{j=1}^{q} \bigl[\, MB(j) - MC(j) \,\bigr]`,
              annotation: [
                "1번째부터 q번째까지의 한 단위 순이득을 더한 값이며, q까지 했을 때의 전체 순이득입니다.",
                "이 합은 각 항이 양수인 동안 커지고 음수로 바뀌는 순간부터 작아집니다. 그래서 한 단위 판정만으로 전체의 최댓값에 닿습니다.",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`q`,
              name: "몇 번째 단위인가",
              description:
                "총량이 아니라 순번입니다. q번째 하나를 할지 말지가 판정의 대상입니다.",
            },
            {
              symbol: String.raw`MB(q)`,
              name: "그 하나가 더 벌어 주는 것",
              description:
                "q번째를 함으로써 늘어나는 값이며, 앞의 q−1개가 이미 벌어 둔 것은 들어가지 않습니다.",
            },
            {
              symbol: String.raw`MC(q)`,
              name: "그 하나에 더 드는 것",
              description:
                "q번째를 하는 데 추가로 드는 값이며, 이미 나간 것은 들어가지 않습니다.",
            },
          ]}
          assumptions={[
            "q번째 하나의 값을 앞뒤와 따로 잴 수 있다고 둡니다. 묶어서만 팔리거나 설비를 통째로 늘려야 하면 한 단위씩 쪼개는 것 자체가 안 됩니다.",
            "MB가 줄고 MC가 느는 방향을 가정합니다. 규모가 커질수록 단가가 내려가는 경우에는 처음 몇 단위가 밑지고 그 뒤부터 남아서, 처음 뒤집힌 곳에서 멈추면 답을 놓칩니다.",
            "들어오는 것과 나가는 것을 같은 자로 잴 수 있다고 둡니다. 시간과 돈이 섞이면 이 전제가 먼저 깨집니다.",
          ]}
          interpretation="빵 한 판이 더 벌어 주는 것이 48에서 시작해 판마다 5씩 줄고, 한 판에 더 드는 것이 12에서 시작해 판마다 3씩 는다고 하겠습니다. 첫 판은 43을 벌어 주고 15가 들어 28이 남고, 네 판째는 28과 24라 겨우 4가 남습니다. 다섯 판째는 23을 벌어 주는데 27이 들어 4를 밑집니다. 그래서 네 판에서 멈춥니다. 누적 순이득을 따로 계산해 보면 28, 48, 60, 64, 60으로 네 판에서 가장 크므로 한 단위 판정과 전체 최댓값이 같은 곳을 가리킵니다. 여기서 읽어야 할 것은 네 판째가 겨우 4밖에 남지 않아도 하는 편이 낫다는 점입니다. 적게 남는 것과 밑지는 것은 다릅니다. 읽으면 안 되는 것은 이 규칙이 언제나 통한다는 결론입니다. 규모가 커질수록 단가가 내려가는 일에서는 처음 몇 단위가 밑지고 그 뒤부터 남으므로, 처음 뒤집힌 자리에서 멈추면 가장 좋은 답을 지나쳐 버립니다."
        />

        <MarginalStopViz />

        <AlgorithmBlock
          title="얼마나 할지 정하는 절차"
          input={[
            "한 단위 더 했을 때 늘어나는 값 MB(q)",
            "한 단위 더 하는 데 드는 값 MC(q)",
            "쪼갤 수 있는 최소 단위",
          ]}
          steps={[
            {
              code: "q ← 1; 누적 ← 0",
              note: "총액이 아니라 순번에서 시작합니다.",
            },
            {
              code: "이미 나간 것과 이미 들어온 것을 MB·MC에서 제외한다",
              note: "되돌릴 수 없는 값은 어느 쪽 선택에도 똑같이 들어 있어 비교를 바꾸지 못합니다.",
            },
            {
              code: "if MB(q) ≤ MC(q): return q - 1",
              note: "판정을 통과하지 못한 첫 단위 직전까지가 답입니다.",
            },
            {
              code: "누적 ← 누적 + (MB(q) - MC(q)); q ← q + 1",
              note: "누적은 판정에 쓰이지 않고 결과를 확인하는 데만 씁니다.",
            },
            {
              code: "MB가 줄고 MC가 느는지 확인한다",
              note: "이 방향이 아니면 위의 조기 종료가 틀립니다. 그때는 모든 q에 대해 누적을 계산해 최댓값을 찾아야 합니다.",
            },
          ]}
          output="멈출 수량 q*와 그때의 누적 순이득"
          repeatUntil="MB(q)가 MC(q) 이하가 될 때까지"
        />
      </section>

      <section id="sunk" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 4. 이미 사라진 것은 계산에 넣지 않습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            앞 절의 판정에는 지금부터 들어오고 나가는 것만 들어갔습니다. 이미
            나간 돈이 빠진 것은 실수가 아니라 규칙입니다.
          </p>

          <p className="leading-7">
            이유는 부품 2로 돌아가면 바로 나옵니다. 값은 포기한 것으로 재는데 이미 나가서 돌려받을 수 없는 돈은 어느 쪽을 골라도 똑같이 사라져 있습니다. 양쪽에 같은 값이 있으면 그
            값은 둘을 가르지 못합니다.
          </p>

          <p className="leading-7">
            작은 예로 보겠습니다. 재료비 30을 이미 치렀고 돌려받을 수
            없습니다. 지금 굽는다면 5가 더 들고 20을 받습니다. 굽지 않으면 아무
            일도 일어나지 않습니다.
          </p>

          <p className="leading-7">
            굽는 쪽이 15만큼 낫습니다. 전체로 보면 −30 + 15라 여전히 손해지만 굽지 않으면 −30이므로 손해가 더 큽니다. 30은 두 줄 모두에 적혀 있어 비교에서 지워집니다.
          </p>

          <p className="leading-7">
            이것이 실제로 어려운 이유는 셈이 어려워서가 아닙니다. 이미 쓴 것을
            지우면 그 결정이 틀렸다고 인정하는 셈이 되기 때문입니다. 셈은 쉬운데
            지우는 일이 어렵습니다.
          </p>
        </div>

        <ProgressiveDetail
          title="그래도 이미 쓴 것을 봐야 하는 경우가 있습니다"
          preview="지운다는 규칙이 적용되는 것은 그 값이 양쪽에 똑같이 들어 있을 때뿐입니다."
        >
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p className="leading-7">
              일부라도 돌려받을 수 있으면 그만큼은 이미 사라진 것이 아닙니다.
              30을 썼는데 그만두면 10을 돌려받는다면, 계속하는 쪽은 그 10을
              포기하는 것이므로 10이 계속하는 쪽의 비용으로 들어갑니다.
            </p>

            <p className="leading-7">
              이미 쓴 것이 앞으로 들어올 것의 크기를 알려 주는 경우도 있습니다.
              같은 일에 세 번 돈을 넣었는데 세 번 다 결과가 나쁘면, 그 지출
              자체는 지우더라도 앞으로의 성공 확률을 다시 잡아야 합니다. 지워야
              하는 것은 값이지 그 값이 남긴 정보가 아닙니다.
            </p>

            <p className="leading-7">
              이 두 경우를 빼면 규칙은 그대로입니다. 되돌릴 수 없고 어느 쪽을
              골라도 똑같이 사라지는 값은 비교에서 뺍니다.
            </p>
          </div>
        </ProgressiveDetail>
      </section>

      <section id="boundary" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          여기까지는 혼자 고를 때입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            네 부품을 합치면 하나가 나옵니다. 모자라면서 쓸 데가 여럿일 때 고를
            일이 생기고, 값은 포기한 최선으로 재고, 얼마나 할지는 한 단위씩
            묻고, 이미 사라진 것은 지웁니다.
          </p>

          <p className="leading-7">
            이 계산은 한 사람이 자기 기회비용을 알 때만 돌아갑니다. 그런데 앞
            절에서 확인했듯 기회비용은 사람마다 다릅니다. 그러면 남이 무엇을
            포기하는지는 내가 모릅니다.
          </p>

          <p className="leading-7">
            그래서 빈칸이 하나 남습니다. 서로의 사정을 모르는 사람들이 각자
            고르는데 그 선택들이 어떻게 맞물리느냐입니다. 다음 글은 이 빈칸의
            첫 조각을 채웁니다. 기회비용이 서로 다르다는 사실 하나에서 왜 혼자
            다 하지 않는 편이 나은지가 나옵니다.
          </p>

          <p className="leading-7">
            한 단위씩 견주는 이 판정은 경제 바깥에서도 같은 모양으로
            나타납니다. 얼마나 조심하는 것이 맞는지를 따지는{" "}
            <Link to="/law/private-law/tort-and-accident-cost#how-much-care">
              사고의 비용
            </Link>
            이 바로 이 셈이고, 형벌의 크기를 정하는{" "}
            <Link to="/law/criminal-law/crime-and-punishment-purpose">
              범죄와 형벌
            </Link>
            도 같은 자리를 씁니다. 그 글들은 이 판정을 쓰는 쪽이고, 이 글은 그
            판정 자체를 소유합니다.
          </p>

          <p className="leading-7">
            다루지 않은 것을 밝혀 둡니다. 무엇을 얼마나 원하는지가 어떻게
            정해지는지는 이 글의 범위 밖입니다. 이 글은 원하는 정도가 이미
            정해져 있다고 두고 그것을 어떻게 재고 어디서 멈추는지만 다룹니다.
          </p>
        </div>
      </section>
    </div>
  );
}
