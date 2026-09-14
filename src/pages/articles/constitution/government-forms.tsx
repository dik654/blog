import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import GovernmentFormsViz from "./government-forms/viz/GovernmentFormsViz";
import PowerIndexViz from "./government-forms/viz/PowerIndexViz";

/**
 * 같은 권력분립에서 왜 다른 체계가 나옵니까
 *
 * 3편이 세운 나누기·견제·굳히기를 실제로 조립하는 두 방식을 다룬다. 갈림길은
 * 행정부의 생존이 의회 신임에 달렸는가 하나이며, 임기의 경직성·교착의 출구·
 * 연립의 필요가 전부 거기서 따라 나온다. 선거 제도가 의석을 만드는 과정은
 * 다음 글이 소유한다.
 */
export default function GovernmentFormsArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          같은 부품으로 조립했는데 전혀 다른 기계가 나옵니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            앞 글에서 권력을 묶는 부품 네 개를 봤습니다. 기능을 가르고, 서로 막을
            수단을 주고, 위반을 판정할 자리를 두고, 바꾸기 어렵게 굳히는
            것이었습니다. 그런데 이 부품들을 갖춘 나라들이 실제로는 서로 아주
            다르게 굴러갑니다.
          </p>

          <p className="leading-7">
            한쪽에서는 행정부 수반이 임기 내내 자리를 지키고 의회와 몇 년씩
            맞섭니다. 다른 쪽에서는 한 번의 표결로 내각이 하루 만에 바뀝니다.
            같은 권력분립 원칙을 적고도 이렇게 갈리는 것이 이상합니다.
          </p>

          <p className="leading-7">
            갈리는 지점은 부품의 개수가 아니라 부품을 잇는 방식입니다. 그리고
            그 방식을 정하는 질문은 놀랄 만큼 적습니다.
          </p>
        </div>

        <GovernmentFormsViz />

        <ContentBoundary article="government-forms" />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            이 글이 푸는 질문은 하나입니다.{" "}
            <strong>
              같은 권력분립 원칙에서 왜 전혀 다른 체계가 나오고, 각 체계는 교착을
              어떤 방식으로 푸는가
            </strong>
            입니다.
          </p>

          <p className="leading-7">
            순서는 체계를 가르는 축, 대통령제가 사는 것과 잃는 것, 의원내각제가
            사는 것과 잃는 것, 연립에서 의석과 협상력이 갈라지는 계산, 그리고 둘을
            섞었을 때 생기는 새 문제입니다.
          </p>

          <p className="leading-7">
            의석 자체가 어떻게 만들어지는지는 아직 건드리지 않습니다. 같은 득표가
            선거 제도에 따라 전혀 다른 의석이 되는 과정은 다음 글{" "}
            <Link to="/politics/elections/electoral-systems">선거 제도</Link>가
            맡습니다. 여기서는 의석 분포를 주어진 것으로 두고 시작합니다.
          </p>
        </div>
      </section>

      <section id="two-axes" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 1. 갈림길은 행정부가 의회 신임에 목숨을 거는가입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            체계를 가르는 첫째 질문은 이것입니다. 의회 과반이 등을 돌렸을 때
            행정부가 자리를 잃는가입니다. 잃으면 행정부의 생존이 의회에 매여
            있는 것이고, 잃지 않으면 분리되어 있는 것입니다.
          </p>

          <p className="leading-7">
            이 하나가 왜 그렇게 큰지는 앞 글의 계산으로 설명됩니다. 생존이
            분리되면 행정부와 의회가 각각 독립된 거부권자가 되고, 둘의 선호가
            갈리는 순간 통과 가능 영역이 좁아지거나 비게 됩니다. 그런데 비어도
            둘 다 자리에 남습니다. 교착이 해소되지 않은 채로 유지된다는 뜻입니다.
          </p>

          <p className="leading-7">
            생존이 매여 있으면 같은 상황이 다르게 끝납니다. 과반이 반대하면
            행정부가 교체되므로, 행정부와 의회 과반의 선호가 갈린 상태 자체가
            오래 유지되지 않습니다. 거부권자 둘이 싸우는 대신 하나가 사라집니다.
          </p>

          <p className="leading-7">
            둘째 질문은 행정부 수반을 누가 뽑는가입니다. 국민이 직접 뽑으면
            의회와 별개의 위임을 주장할 근거가 생기고, 의회가 뽑으면 그 근거가
            의회를 거쳐서만 나옵니다. 두 질문을 곱하면 흔히 둘로만 말하는 정부
            형태가 네 칸이 됩니다.
          </p>
        </div>

        <TermBreakdown
          title="두 축이 각각 무엇을 정하는가"
          items={[
            {
              term: "생존의 분리",
              description:
                "행정부가 의회의 신임 없이 임기를 채우는가입니다. 임기가 고정되는지, 교착이 유지되는지, 연립을 만들 필요가 있는지가 전부 여기서 갈립니다.",
              example:
                "의회 과반이 반대해도 대통령이 임기를 채우면 분리된 것이고, 불신임 한 번에 내각이 물러나면 매여 있는 것입니다.",
              boundary:
                "완전한 이분법은 아닙니다. 대통령제에도 탄핵이 있고 의원내각제에도 해산까지 버티는 소수정부가 있어, 실제로는 정도의 문제에 가깝습니다.",
            },
            {
              term: "기원의 분리",
              description:
                "행정부 수반이 국민에게서 직접 위임을 받는가입니다. 직접 받으면 의회와 별개의 정통성을 주장할 수 있습니다.",
              example:
                "직선 대통령은 자기가 국민의 선택이라고 말할 수 있지만, 의회가 뽑은 총리는 그 말을 의회를 거쳐서만 할 수 있습니다.",
              boundary:
                "직선이라도 결선 없이 낮은 득표율로 당선되면 그 위임의 크기가 실제로는 작습니다. 기원이 같아도 무게는 다릅니다.",
            },
            {
              term: "두 축이 만드는 네 칸",
              description:
                "분리·직선이 대통령제, 매임·의회선출이 의원내각제, 매임·직선이 준대통령제입니다. 남는 한 칸은 의회가 뽑되 임기가 고정된 집단 행정부입니다.",
              example:
                "스위스 연방평의회가 마지막 칸에 가깝습니다. 의회가 뽑지만 불신임으로 물러나지 않습니다.",
              boundary:
                "실제 헌법은 칸의 한가운데가 아니라 축 위의 어떤 점에 놓입니다. 칸은 비교를 위한 좌표이지 분류함이 아닙니다.",
            },
          ]}
        />
      </section>

      <section id="presidential" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 2. 대통령제는 고정 임기로 안정과 경직을 함께 삽니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            대통령제는 두 축에서 모두 분리를 택합니다. 국민이 직접 뽑고, 뽑힌
            뒤에는 의회 신임과 무관하게 정해진 기간을 채웁니다. 얻는 것은
            예측 가능성입니다. 누가 언제까지 행정부를 맡는지가 미리 정해져
            있습니다.
          </p>

          <p className="leading-7">
            대가는 세 가지로 나옵니다. 첫째는 정통성이 둘이 된다는 것입니다.
            대통령도 국민이 뽑았고 의회도 국민이 뽑았으므로, 둘의 뜻이 갈릴 때
            누가 국민을 대변하는지 가릴 기준이 체계 안에 없습니다. 헌법이 정할
            수 있는 것은 권한의 경계이지 누구의 주장이 더 정당한가가 아닙니다.
          </p>

          <p className="leading-7">
            둘째는 경직성입니다. 임기가 고정되어 있으니 상황이 바뀌어도 사람을
            바꿔 대응할 수 없습니다. 심각한 실패나 급변이 임기 중간에 일어나면,
            남은 기간 내내 그 조합으로 버티는 것 말고 방법이 없습니다.
          </p>

          <p className="leading-7">
            셋째는 승자독식입니다. 한 자리를 두고 겨루므로 2등은 아무것도 얻지
            못합니다. 의석은 득표에 비례해 나눌 수 있지만 대통령직은 나눌 수
            없습니다. 그래서 선거의 판돈이 커지고, 진 쪽이 다음 기회까지 기다리는
            비용도 커집니다.
          </p>
        </div>

        <CitationBlock
          source="Juan J. Linz · The Perils of Presidentialism (Journal of Democracy 1권 1호, 1990년 겨울, 51~69쪽)"
          citeKey={1}
          href="https://www.journalofdemocracy.org/articles/the-perils-of-presidentialism/"
        >
          대통령제와 의원내각제를 제도 수준에서 비교한 글입니다. 의원내각제를
          &ldquo;민주적 정당성을 가진 유일한 기관이 의회이고 정부의 권한이 전적으로
          의회의 신임에 의존하는 체제&rdquo;로, 대통령제를 &ldquo;국민이 직접 정해진
          임기로 뽑고 의회의 신임 투표로부터 독립된 행정부&rdquo;를 갖는 체제로
          규정합니다. 위 세 가지 대가가 각각 이 글의 이중 정당성 논의, &ldquo;대통령제는
          정치 과정을 불연속적이고 경직되게 구획된 기간으로 쪼갠다&rdquo;는 대목,
          그리고 &ldquo;승자독식&rdquo; 절에 대응합니다. 저자 자신의 결론은
          의원내각제가 &ldquo;대체로 더 안정적인 민주주의에 기여하며 이 결론은 특히
          균열이 깊고 정당이 많은 나라에 적용된다&rdquo;는 것입니다. 다만 이것은
          사례 비교에 기반한 논증이지 통제된 비교 연구가 아니며, 발표 직후부터
          반박이 이어진 논쟁적 주장입니다.
        </CitationBlock>

        <div id="deadlock-exit" className="scroll-mt-20">
          <h3 className="mb-4 mt-12 text-xl font-bold">
            교착이 풀리지 않으면 무엇이 남는가
          </h3>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p className="leading-7">
              의원내각제에서 행정부와 의회가 갈리면 출구가 둘 있습니다. 내각을
              바꾸거나 의회를 해산해 국민에게 다시 묻는 것입니다. 둘 다 체제
              안에서 일상적으로 쓰이는 절차입니다.
            </p>

            <p className="leading-7">
              대통령제에는 그 두 출구가 없습니다. 남는 것은 다음 선거까지
              기다리는 것과, 그 전에 끝내려면 탄핵입니다. 그런데 탄핵은 일상적
              절차가 아니라 위법을 전제로 한 사법적 성격의 절차입니다. 정책이
              맞지 않는다는 이유로는 쓸 수 없게 설계되어 있습니다.
            </p>

            <p className="leading-7">
              그래서 대통령제에서 교착의 출구는 구조적으로 헌법적 위기의 모양을
              띠게 됩니다. 일상적 조정 수단이 없는 자리에 비상 수단만 놓여 있으니,
              조정이 필요할 때마다 비상 수단이 호출됩니다. 이것이 대통령제에서
              탄핵 논의가 자주 등장하는 제도적 이유입니다.
            </p>

            <p className="leading-7">
              한국 헌법은 대통령제 골격에 의회 쪽 장치를 몇 개 덧대 이 문제를
              완화하려 합니다. 국무총리는 국회의 동의를 받아야 임명되고, 국회는
              국무총리와 국무위원의 해임을 대통령에게 건의할 수 있습니다. 다만
              해임건의는 구속력이 없고 대통령 자신의 자리에도 닿지 않으므로,
              위의 구조 자체를 바꾸지는 못합니다.
            </p>
          </div>

          <CitationBlock
            source="대한민국헌법 제63조 · 제65조 제1항 · 제86조 제1항 (한국법제연구원 영문 공식 번역본)"
            citeKey={2}
            href="https://elaw.klri.re.kr/eng_service/lawView.do?hseq=1&lang=ENG"
          >
            제86조 제1항은 국무총리를 &ldquo;대통령이 국회의 동의를 얻어
            임명한다&rdquo;고 정하고, 제63조는 국회가 &ldquo;국무총리 또는 국무위원의
            해임을 대통령에게 건의할 수 있다&rdquo;고 정합니다. 제65조 제1항은
            대통령을 포함한 고위 공직자가 직무집행에서 헌법이나 법률을 위배한 때에
            국회가 탄핵소추를 의결할 수 있게 합니다. 위 세 조문이 각각 임명 동의,
            건의권, 위법 전제의 탄핵이라는 세 층을 이룹니다. 번역본은 참조용이며
            법적 효력은 국문 원문에 있다고 이 사이트가 명시합니다.
          </CitationBlock>
        </div>
      </section>

      <section id="parliamentary" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 3. 의원내각제는 교착을 풀 수 있는 대신 정부가 흔들립니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            의원내각제는 반대쪽을 택합니다. 행정부는 의회 과반의 신임 위에 서고,
            그 신임이 사라지면 물러납니다. 행정부와 의회 과반의 선호가 갈린 상태가
            제도적으로 오래 유지되지 않습니다.
          </p>

          <p className="leading-7">
            여기서 나오는 것이 유연성입니다. 실패한 내각은 임기를 기다리지 않고
            교체되고, 상황이 크게 바뀌면 해산과 총선으로 위임 자체를 새로 받을 수
            있습니다. 앞 절에서 비상 수단이었던 일이 여기서는 일상 절차입니다.
          </p>

          <p className="leading-7">
            대가도 분명합니다. 정부가 언제든 무너질 수 있으므로 계획의 시야가
            짧아지고, 단독 과반이 없으면 여러 당이 손을 잡아야 합니다. 연립은
            정부를 세우지만 동시에 정부 안에 거부권자를 새로 만듭니다. 앞 글의
            교집합 계산이 이번에는 내각 안에서 돌아갑니다.
          </p>

          <p className="leading-7">
            그래서 의원내각제의 실제 성격은 헌법 조문보다 의석이 어떻게 흩어져
            있는지에 더 많이 달려 있습니다. 단독 과반이 자주 나오면 의원내각제는
            매우 강한 정부를 만들고, 잘게 쪼개져 있으면 정부 구성 자체가 몇 달씩
            걸리기도 합니다.
          </p>
        </div>

        <AlgorithmBlock
          title="단독 과반이 없을 때 정부가 서기까지의 절차"
          input={[
            "각 정당의 의석수와 신임에 필요한 정족수",
            "정당들의 정책 위치 또는 서로에 대한 거부 선언",
            "정부 구성 실패 시의 기본값: 소수정부 허용인가 재선거인가",
          ]}
          steps={[
            {
              code: "단독 과반이 있는지 확인한다. 있으면 여기서 끝난다.",
              note: "이 경우 의원내각제는 사실상 가장 강한 정부가 됩니다. 행정부와 의회 과반이 같은 쪽이므로 거부권자가 하나로 줄어듭니다.",
            },
            {
              code: "정족수를 넘는 연합을 모두 나열하고, 각 연합에서 빠지면 과반이 깨지는 정당을 표시한다.",
              note: "이 표시가 다음 절의 협상력 계산 그대로입니다. 의석 순서가 아니라 이 표시가 협상 테이블의 서열을 정합니다.",
            },
            {
              code: "나열된 연합에서 서로를 거부한 조합을 지운다.",
              note: "숫자상 가능해도 정치적으로 불가능한 조합이 있습니다. 거부 선언은 협상 전에 자기 쪽 선택지를 줄여 상대의 선택지도 줄이는 수단입니다.",
            },
            {
              code: "남은 연합 가운데 불필요한 참가자가 없는 것들을 우선 후보로 둔다.",
              note: "빠져도 과반이 유지되는 정당을 끼우면 나눌 몫만 늘어납니다. 다만 표결 이탈에 대비해 여유를 두는 선택도 흔합니다.",
            },
            {
              code: "각 후보 연합에 대해 정책 합의와 자리 배분을 협상하고, 신임 투표에 부친다.",
              note: "협상에서 각 정당이 요구할 수 있는 몫의 하한은 그 정당이 결정적인 연합의 수가 만듭니다. 작은 정당이 큰 몫을 가져가는 장면은 여기서 나옵니다.",
            },
            {
              code: "가결되면 정부가 선다. 부결이 이어지면 소수정부로 가거나 의회를 해산한다.",
              note: "소수정부는 사안마다 다른 상대와 과반을 만들어야 하므로 정부가 서 있어도 거부권자는 계속 바뀝니다.",
            },
          ]}
          output="구성된 연립과 각 정당의 몫, 또는 소수정부·재선거라는 판정"
        />

        <ProgressiveDetail
          title="정부가 자주 바뀌는 것은 얼마나 나쁜가?"
          preview="내각 교체와 체제 위기는 다른 사건인데, 같은 말로 묶이면 판단이 어긋납니다."
        >
          <p className="leading-7">
            의원내각제에서 내각이 바뀌는 것은 설계된 동작입니다. 신임이 사라진
            정부를 임기 때문에 붙잡아 두지 않겠다는 선택의 결과이므로, 교체
            빈도가 높다는 사실 자체는 체제가 흔들린다는 뜻이 아닙니다.
          </p>
          <p className="leading-7">
            다만 같은 빈도가 다른 것을 뜻할 때도 있습니다. 교체될 때마다 정책
            방향이 크게 뒤집히거나, 어떤 조합으로도 과반이 만들어지지 않아 정부
            구성 자체가 반복해서 실패하는 경우입니다. 앞의 것은 유연성이고 뒤의
            것은 앞 글에서 본 통과 가능 영역이 비어 있는 상태입니다.
          </p>
          <p className="leading-7">
            그래서 정부 교체 횟수만으로 체제를 평가하면 두 상황을 구별하지 못합니다.
            같은 사람들이 다른 조합으로 다시 서는지, 아니면 아무 조합도 서지 못하는지를
            따로 봐야 합니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="power-index" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 4. 의석을 많이 가진 것과 협상력이 큰 것은 다릅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            연립을 만들 때 각 정당이 가져가는 몫은 의석 비율을 따라가지 않습니다.
            아주 작은 정당이 큰 자리를 요구해 받아 내는 장면을 종종 보게 되는데,
            이것은 협상 기술의 문제가 아니라 계산의 문제입니다.
          </p>

          <p className="leading-7">
            기준을 바꿔야 합니다. 물어야 할 것은 그 정당이 몇 석을 가졌는가가
            아니라, 그 정당이 빠지면 무너지는 과반 조합이 몇 개인가입니다. 빠져도
            과반이 유지되는 연합에서 그 정당은 있으나 마나 하고, 빠지면 과반이
            깨지는 연합에서는 어느 정당이든 똑같이 없어서는 안 됩니다.
          </p>

          <p className="leading-7">
            이 셈을 그대로 식으로 옮긴 것이 아래입니다. 놀라운 결과가 바로
            나옵니다.
          </p>
        </div>

        <ExplainedFormula
          question="의석 비율이 그대로 협상력인가?"
          idea="한 정당의 힘은 가진 의석이 아니라 그 정당이 결정적인 연합이 몇 개인가로 재야 합니다. 어떤 연합이 과반을 넘는데 특정 정당을 빼면 과반이 깨진다면, 그 연합에서 그 정당은 없어서는 안 됩니다. 이런 연합의 수를 세어 전체로 나눈 것이 협상력의 비율입니다."
          formula={String.raw`\beta_i = \frac{\bigl|\{\, S \ni i : v(S)=1,\ v(S \setminus \{i\})=0 \,\}\bigr|}{\sum_{j} \bigl|\{\, S \ni j : v(S)=1,\ v(S \setminus \{j\})=0 \,\}\bigr|}`}
          annotatedFormula={String.raw`\beta_i = \frac{\overbrace{\bigl|\{\, S \ni i : v(S)=1,\ v(S \setminus \{i\})=0 \,\}\bigr|}^{i\text{가 빠지면 지는 연합의 수}}}{\underbrace{\sum_{j} \bigl|\{\, S \ni j : v(S)=1,\ v(S \setminus \{j\})=0 \,\}\bigr|}_{\text{모든 정당에 대해 같은 수를 더한 것}}}`}
          operations={[
            {
              expression: String.raw`v(S) = 1`,
              annotation: [
                "연합 S의 의석 합이 정족수 이상이면 1, 아니면 0입니다.",
                "이기고 지는 것만 보고 얼마나 크게 이기는지는 보지 않습니다.",
              ],
            },
            {
              expression: String.raw`v(S)=1,\ v(S \setminus \{i\})=0`,
              annotation: [
                "S는 이기는데 i를 빼면 지는 경우입니다. 이때 i를 그 연합에서 결정적이라고 합니다.",
                "빠져도 이기는 연합에서 i는 몫을 요구할 근거가 없습니다.",
              ],
            },
            {
              expression: String.raw`\sum_{j}`,
              annotation: [
                "모든 정당의 결정적 횟수를 더해 전체로 나눕니다. 그래야 비율이 되고 합이 1이 됩니다.",
                "분모가 커지는 것은 결정적인 자리가 여러 정당에 흩어져 있다는 뜻입니다.",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`S`,
              name: "연합",
              description:
                "함께 찬성표를 던지기로 한 정당들의 묶음입니다. 가능한 모든 묶음을 후보로 놓고 셉니다.",
            },
            {
              symbol: String.raw`v`,
              name: "승패 함수",
              description:
                "연합의 의석 합이 정족수를 넘으면 1, 못 넘으면 0을 주는 함수입니다.",
            },
            {
              symbol: String.raw`\beta_i`,
              name: "정당 i의 협상력 비율",
              description:
                "i가 결정적인 연합의 수를 전체 결정적 횟수로 나눈 값입니다. 모든 정당의 값을 더하면 1이 됩니다.",
            },
          ]}
          assumptions={[
            "모든 연합이 똑같이 성사될 수 있다고 둡니다. 실제로는 정책 거리가 먼 조합이 먼저 탈락합니다.",
            "각 정당의 의석이 당론으로 한 덩어리처럼 움직인다고 둡니다. 이탈표가 많으면 정당 단위의 계산이 흔들립니다.",
            "사안이 하나이고 표결이 한 번이라고 둡니다. 여러 사안을 묶어 주고받는 거래는 들어 있지 않습니다.",
          ]}
          interpretation="300석 의회에서 과반이 151석이고 의석이 140·140·20이라면, 과반을 넘는 연합은 두 당씩 묶은 셋과 세 당 전부인 하나입니다. 두 당짜리 셋에서는 양쪽 모두 빠지면 과반이 깨지므로 결정적이고, 세 당 전부인 연합에서는 누가 빠져도 과반이 남아 아무도 결정적이지 않습니다. 결정적 횟수가 2·2·2이므로 세 정당의 협상력은 모두 3분의 1로 같고, 20석짜리 당이 140석짜리 당과 같은 무게를 갖습니다. 여기서 읽어야 할 것은 작은 정당의 큰 몫이 협상을 잘해서가 아니라 조합의 구조에서 나온다는 점입니다. 읽으면 안 되는 것은 작은 정당이 언제나 세다는 결론입니다. 같은 의회에서 20석만 옮겨 160·120·20이 되면 첫째 당이 단독 과반이 되어 협상력이 1·0·0이 되고, 120석을 가진 당의 협상력이 0이 됩니다."
        />

        <PowerIndexViz />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            이 계산은 앞 글의 거부권자 계산과 같은 질문을 다른 공간에서 묻습니다.
            앞 글은 정책 축 위에서 누가 막을 수 있는지를 봤고, 여기서는 정당
            조합의 공간에서 누가 없어서는 안 되는지를 봅니다. 둘 다 답은 숫자의
            크기가 아니라 구조에서 나옵니다.
          </p>
        </div>
      </section>

      <section id="semi-presidential" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 5. 둘을 섞으면 좋은 쪽만 오지는 않습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            두 체계의 장점을 같이 갖고 싶다는 생각은 자연스럽습니다. 직선
            대통령이 주는 안정과 명확한 위임을 두고, 동시에 의회 신임에 매인
            총리를 두어 교착의 출구도 확보하자는 것입니다.
          </p>

          <p className="leading-7">
            이 조합에서는 행정부가 둘로 갈립니다. 국민이 뽑은 대통령과 의회
            과반이 지탱하는 총리가 함께 행정부를 이룹니다. 대통령의 정당이 의회
            과반을 잡고 있으면 문제가 드러나지 않습니다. 대통령이 사실상 둘 다
            지휘하기 때문입니다.
          </p>

          <p className="leading-7">
            갈리는 순간 새 문제가 나옵니다. 의회 과반이 대통령의 반대편이면
            총리도 반대편에서 나오고, 하나의 행정부 안에 서로 다른 위임을 받은
            두 사람이 앉습니다. 앞 절의 이중 정통성이 기관 사이가 아니라 행정부
            내부로 들어온 것입니다.
          </p>

          <p className="leading-7">
            그래서 이 형태의 성격은 헌법이 아니라 그때그때의 의석 분포가
            정합니다. 같은 조문으로 어떤 시기에는 가장 강한 대통령제처럼, 다른
            시기에는 대통령이 외교만 맡는 의원내각제처럼 굴러갑니다. 제도를
            비교할 때 조문만 보면 안 되는 이유가 여기서 또 한 번 나옵니다.
          </p>
        </div>
      </section>

      <section id="boundary" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          형태는 무엇이 위험한지를 말할 뿐 결과를 말하지 않습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            이 글의 비교는 전부 &ldquo;어떤 상황에서 무엇이 막히는가&rdquo;에
            관한 것이지 어느 쪽이 더 나은 결과를 낸다는 주장이 아닙니다. 대통령제는
            교착의 출구가 좁고 의원내각제는 정부의 수명이 짧다는 것까지가 제도에서
            따라 나오는 부분입니다.
          </p>

          <p className="leading-7">
            그 위험이 실제로 터지는지는 다른 조건들이 정합니다. 대통령의 정당이
            의회 과반을 잡으면 이중 정통성 문제는 임기 내내 드러나지 않고, 두 당만
            있고 한쪽이 늘 과반이면 연립 협상은 아예 필요 없습니다. 같은 헌법이
            의석 분포에 따라 전혀 다르게 굴러간다는 말입니다.
          </p>

          <p className="leading-7">
            그러면 그 의석 분포는 어디서 오는지가 다음 질문이 됩니다. 앞 두
            절에서 의석은 계속 주어진 것으로 두고 계산만 했지만, 같은 득표가
            제도에 따라 전혀 다른 의석이 되는 과정이 실은 앞에 있습니다.
          </p>

          <p className="leading-7">
            다음 글{" "}
            <Link to="/politics/elections/electoral-systems">선거 제도</Link>가
            그 과정을 맡습니다. 표를 의석으로 바꾸는 규칙이 무엇을 바꾸고, 왜 어떤
            제도에서는 정당이 둘로 수렴하고 다른 제도에서는 계속 늘어나는지가
            주제입니다.
          </p>
        </div>
      </section>
    </div>
  );
}
