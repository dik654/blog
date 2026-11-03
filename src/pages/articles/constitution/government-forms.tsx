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
 * 3편이 세운 나누기·견제·굳히기를 실제로 조립하는 방식을 다룬다. 같은 300석
 * 의회와 예산안 P를 대통령제·의원내각제·준대통령제에 차례로 넣어, 정책 패배가
 * 행정부 생존까지 번지는지 추적한다. 선거 제도가 의석을 만드는 과정은 다음 글이
 * 소유한다.
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
            결론부터 말하면, <strong>정부 형태는 권력을 나눴다는 이름이 아니라
            정책 패배가 행정부의 생존까지 번지는지를 정하는 연결 규칙</strong>입니다.
            같은 의회와 같은 예산안도 이 규칙에 따라 다음 장면이 달라집니다.
          </p>

          <p className="leading-7">
            300석 의회에 가당 140석, 나당 140석, 다당 20석이 있다고 합시다.
            가당 출신 행정부가 예산안 P를 냈고 통과에는 151표가 필요합니다.
            나당과 다당이 반대하면 P는 집니다. 여기까지는 어느 체제나 같습니다.
          </p>

          <p className="leading-7">
            그다음이 다릅니다. 대통령제에서는 예산 패배와 대통령 퇴진이 보통
            분리됩니다. 의원내각제에서는 151석이 정책뿐 아니라 정부를 세우고
            유지하는 데도 연결될 수 있습니다. 준대통령제에서는 대통령은 남고
            의회 다수파가 지탱하는 총리가 따로 생길 수 있어, 먼저 누가 P를
            책임지는지부터 확인해야 합니다.
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
            순서는 같은 P가 세 체제에서 지나가는 경로, 각 체제가 얻는 것과 잃는 것,
            연립에서 의석과 형식적 투표력이 갈라지는 계산, 그리고 실제 헌법을 읽을
            때 확인할 조항입니다.
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
          부품 1. 먼저 정책 패배가 정부 퇴진으로 이어지는지 묻습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            예산안 P가 부결됐다는 사실만으로는 정부가 바뀌지 않습니다. 그 표결이
            신임 표결이었는지, 정부가 의회의 신임을 잃으면 물러나야 하는지를
            추가로 알아야 합니다. 이것이 <strong>생존의 의존</strong>입니다.
          </p>

          <p className="leading-7">
            생존이 분리되면 가당 대통령과 나당·다당 160석이 서로 다른 결정을
            원해도 둘 다 자리에 남습니다. P는 막혔지만 누가 물러날지는 정해지지
            않았습니다. 앞 글에서 본 통과 가능 영역이 비어 있는 상태가 임기 동안
            지속될 수 있습니다.
          </p>

          <p className="leading-7">
            생존이 의회에 매여 있으면 P의 패배가 자동으로 불신임인지는 헌법과
            의사 규칙에 따라 다르지만, 의회 다수는 별도의 신임 절차로 내각을 바꿀
            수 있습니다. 독일처럼 후임 총리를 동시에 뽑아야 하는 체제도 있습니다.
            따라서 “한 표결이면 언제나 즉시 퇴진”이 아니라 <strong>교체 경로가
            일상 절차로 열려 있다</strong>고 이해해야 합니다.
          </p>

          <p className="leading-7">
            다음으로 행정부가 의회와 별도의 선거 기원을 갖는지 묻습니다. 직접선거든
            선거인단을 거치든, 의회 다수와 별도로 정해진 대통령은 독자적인 임기를
            주장할 수 있습니다. 다만 준대통령제에는 대통령과 총리가 함께 있으므로
            행정부 수반 하나를 2×2 표의 한 점으로 찍으면 핵심이 사라집니다. 대통령의
            생존과 총리의 생존을 따로 적어야 합니다.
          </p>
        </div>

        <TermBreakdown
          title="이름보다 먼저 확인할 세 가지"
          items={[
            {
              term: "생존의 분리",
              description:
                "정부가 의회의 신임 없이 임기를 채우는가입니다. 정책 패배와 정부 퇴진이 연결되는지, 교착을 정부 교체로 풀 수 있는지가 여기서 갈립니다.",
              example:
                "의회 과반이 반대해도 대통령이 임기를 채우면 분리된 것이고, 불신임 한 번에 내각이 물러나면 매여 있는 것입니다.",
              boundary:
                "정책 표결 패배가 곧 불신임이라는 뜻은 아닙니다. 불신임 요건, 후임 선출, 해산 가능성은 헌법마다 다릅니다.",
            },
            {
              term: "선거 기원의 분리",
              description:
                "대통령의 선출 기반이 의회 다수의 선택과 분리되어 있는가입니다. 분리되어 있으면 대통령과 의회가 서로 다른 국민의 위임을 주장할 수 있습니다.",
              example:
                "가당 대통령은 의회에서 나당·다당이 160석이어도 자기 임기가 별도로 주어졌다고 말할 수 있습니다. 총리는 그 160석의 신임을 잃으면 같은 주장을 하기 어렵습니다.",
              boundary:
                "직선 여부만으로 대통령제 전체를 정의할 수는 없습니다. 선거인단, 의회에 의한 형식적 선출, 대통령 권한의 크기도 따로 봐야 합니다.",
            },
            {
              term: "이중 행정부",
              description:
                "준대통령제는 직선 대통령과 의회에 책임지는 총리·내각을 함께 둡니다. 대통령과 총리의 생존 규칙이 다르므로 단일 수반의 네 칸 분류가 아닙니다.",
              example:
                "프랑스에서 대통령은 총리를 임명하지만 정부는 의회에 책임을 집니다. 반대 당파가 의회 다수면 동거정부가 생길 수 있습니다.",
              boundary:
                "대통령과 의회가 각각 총리를 해임할 수 있는지, 누가 의회를 해산하는지에 따라 준대통령제 안에서도 동작이 크게 달라집니다.",
            },
          ]}
        />

        <CitationBlock
          source="스위스 연방헌법 제174조·제175조 (Fedlex 공식 영문본)"
          citeKey={2}
          href="https://www.fedlex.admin.ch/redirect/rs/101/en"
        >
          연방평의회는 7명으로 된 최고 통치·집행 기관이고, 연방의회가 선출하며
          임기는 4년입니다. 이 사례는 “의회가 뽑으면 곧 의원내각제”라는 단순
          도식을 깨 줍니다. 다만 스위스의 집단 행정부를 대통령제·의원내각제와
          나란히 놓인 보편적 네 번째 칸이라고 단정하려는 예가 아니라, 선출 방식과
          생존 규칙을 따로 읽어야 한다는 경계 사례입니다. 영문은 공식 언어가
          아니라는 Fedlex의 고지도 함께 적용됩니다.
        </CitationBlock>
      </section>

      <section id="presidential" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 2. 대통령제에서는 정책 패배와 대통령 생존이 분리됩니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            대통령제의 핵심은 대통령이 의회 신임에 기대어 재직하지 않는다는
            점입니다. 가당 대통령의 P가 부결되어도 그 표결만으로 대통령직이
            끝나지는 않습니다. 누가 언제까지 행정부를 맡는지가 미리 정해져 있어
            예측 가능하지만, 정책 교착과 사람의 교체가 분리됩니다.
          </p>

          <p className="leading-7">
            첫째 위험은 정통성 주장이 둘이 된다는 것입니다. 대통령도 별도의
            선거에서 선택됐고 의회도 선거로 구성됐으므로, 대통령은 P를 자기
            공약이라고 말하고 나당·다당 160석은 의회 다수의 뜻이라고 말할 수
            있습니다. 헌법은 누가 어느 결정을 내리는지는 정할 수 있지만 어느 쪽이
            “진짜 국민”인지는 판정하지 않습니다.
          </p>

          <p className="leading-7">
            둘째 위험은 고정 임기의 경직성입니다. 심각한 실패나 급변이 일어나도
            단순한 정책 반대만으로 임기를 줄일 수 없습니다. 다만 “아무 출구도
            없다”는 뜻은 아닙니다. 탄핵·직무불능·소환·조기선거·의회 해산을 어느
            범위에서 허용하는지는 나라별 헌법이 다르게 정합니다.
          </p>

          <p className="leading-7">
            셋째 위험은 대통령직 한 자리의 승자독식 성격입니다. 의회 의석과 달리
            대통령직 자체는 비례해 나눌 수 없습니다. 그러나 연정, 내각 임명,
            연방제와 의회의 권한까지 모두 승자독식이라는 뜻은 아닙니다. 여기서도
            제도 조합을 봐야 합니다.
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

        <CitationBlock
          source="Scott Mainwaring · Matthew S. Shugart · Juan Linz, Presidentialism, and Democracy: A Critical Appraisal (1997)"
          citeKey={3}
          href="https://kellogg.nd.edu/sites/default/files/old_files/documents/200_0.pdf"
        >
          이 반론은 Linz가 대통령제 내부의 차이를 작게 보고 결함을 과장했다고
          지적합니다. 대통령의 입법 권한, 정당 규율, 정당 체계의 파편화처럼 서로
          결합되는 제도가 결과를 완화하거나 악화시킬 수 있다는 주장입니다. 따라서
          이 글은 Linz의 세 위험을 운명으로 쓰지 않고, 예산안 P가 막혔을 때
          살펴볼 위험 목록으로만 사용합니다.
        </CitationBlock>

        <div id="deadlock-exit" className="scroll-mt-20">
          <h3 className="mb-4 mt-12 text-xl font-bold">
            교착이 풀리지 않으면 무엇이 남는가
          </h3>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p className="leading-7">
              대통령제의 전형적 설계에서는 의회가 P를 거부해도 내각 불신임으로
              대통령을 바꾸지 못합니다. 반대로 대통령이 의회 다수파를 마음대로
              교체하지도 못합니다. 이 상호 독립이 임기를 예측 가능하게 만들면서
              교착을 오래 남길 수 있습니다.
            </p>

            <p className="leading-7">
              그렇다고 모든 대통령제의 출구가 다음 선거와 탄핵뿐인 것은 아닙니다.
              어떤 헌법은 대통령의 의회 해산, 소환투표, 임기 단축 선거를 두고,
              탄핵 사유도 위법·중대한 비행·직무불능 등 서로 다릅니다. 그러므로
              “대통령제라서 출구가 없다”가 아니라 <strong>정책 불일치만으로
              행정부와 의회를 함께 재설정하는 일상 절차가 제한적인가</strong>를
              조문별로 물어야 합니다.
            </p>

            <p className="leading-7">
              이 글의 가상 사례에서는 먼저 타협안 P′, 예산 임시 집행 규칙, 거부권과
              재의결 정족수, 다음 선거 시점을 봅니다. 그다음에야 제거 절차를 봅니다.
              정책 패배와 헌법 위반을 한 문장에 넣으면 교착 해결과 공직자 책임을
              혼동하게 됩니다.
            </p>

            <p className="leading-7">
              한국 헌법으로 범위를 좁히면 탄핵소추는 직무집행에서 헌법이나 법률을
              위배한 때에 가능하고, 국회는 국무총리·국무위원 해임을 대통령에게
              건의할 수 있습니다. 이 조문은 한국 사례의 답이지 대통령제 일반의
              정의가 아닙니다.
            </p>
          </div>

          <CitationBlock
            source="대한민국헌법 제63조 · 제65조 제1항 · 제86조 제1항 (한국법제연구원 영문 공식 번역본)"
            citeKey={4}
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
          부품 3. 의원내각제는 과반을 정책과 정부 생존에 연결합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            의원내각제에서는 정부가 의회의 신임을 얻거나 적어도 불신임을 당하지
            않아야 재직할 수 있습니다. 가당 140석만으로는 다당의 연정 참여,
            신임·공급 합의, 표결 기권 같은 지원이 필요할 수 있습니다.
          </p>

          <p className="leading-7">
            그래서 나당·다당 160석이 다른 정부를 세울 수 있다면 대통령제의 정책
            교착이 의원내각제에서는 정부 교체로 풀릴 수 있습니다. 다른 과반이
            없으면 소수정부가 남거나, 헌법이 정한 조건에서 의회를 해산하고 총선으로
            갈 수 있습니다. 해산은 모든 나라에서 총리가 마음대로 누르는 버튼이
            아닙니다.
          </p>

          <p className="leading-7">
            대가는 불안정 그 자체가 아니라 과반을 계속 유지하는 비용입니다. 연립은
            정부를 세우는 동시에 내각 안에 새 거부권자를 만듭니다. 그러나 독일의
            건설적 불신임처럼 후임을 동시에 뽑게 하면 단순한 반대 과반만으로 정부를
            쓰러뜨리기 어렵습니다. 정당 규율이 강하고 단독 과반이 안정적이면
            의원내각제가 오히려 매우 강한 정부를 만들 수도 있습니다.
          </p>

          <p className="leading-7">
            따라서 P의 다음 장면을 알려면 의석만이 아니라 신임 규칙, 불신임
            정족수, 후임 동시 선출 여부, 해산 권한과 시한을 함께 읽어야 합니다.
          </p>
        </div>

        <CitationBlock
          source="독일 기본법 제67조·제68조 (독일 연방 법무부 공식 영문본)"
          citeKey={5}
          href="https://www.gesetze-im-internet.de/englisch_gg/englisch_gg.pdf"
        >
          제67조는 연방의회가 재적 과반으로 후임 총리를 선출할 때에만 현 총리에
          대한 불신임을 표시할 수 있게 합니다. 제68조의 신임안이 과반을 얻지
          못해도 의회 해산은 자동이 아니라 총리의 제안과 연방대통령의 결정이라는
          조건을 거칩니다. “의원내각제는 한 표결에 곧 무너진다”는 일반화를 막는
          실제 설계입니다.
        </CitationBlock>

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
              note: "이 표시가 다음 절의 형식적 투표력 계산입니다. 실제 협상 서열은 정책 거리, 대안 연합, 당내 규율과 시간 압박까지 받아 달라질 수 있습니다.",
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
              note: "결정적인 연합이 많으면 표결에서 필요한 당이라는 근거는 생깁니다. 그러나 그 수가 장관 자리나 정책 양보의 하한을 직접 정하지는 않습니다.",
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
            의원내각제에서 내각이 바뀌는 것은 설계된 동작입니다. 신임이 사라진 정부를 임기 때문에 붙잡아 두지 않겠다는 선택의 결과이므로 교체 빈도가 높다는 사실 자체는 체제가 흔들린다는
            뜻이 아닙니다.
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
          부품 4. 의석 비율과 형식적 투표력은 같은 수가 아닙니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            다당은 20석으로 전체의 6.7%뿐이지만, 가당과 나당 중 어느 쪽에도
            과반을 만들어 줄 수 있습니다. 이때 “작은 당인데 왜 필요한가”를
            설명하는 계산이 Banzhaf 지수입니다.
          </p>

          <p className="leading-7">
            물어야 할 것은 그 정당이 몇 석을 가졌는가가 아니라, 그 정당이 빠지면
            승패가 뒤집히는 연합이 몇 개인가입니다. 여기서 얻는 값은 주어진
            정족수 아래의 <strong>형식적 투표력</strong>입니다. 실제 연립 협상력은
            이 값에 정책 거리, 서로에 대한 거부 선언, 시간, 직위의 가치가 더해진
            결과이므로 둘을 같은 말로 부르면 안 됩니다.
          </p>

          <p className="leading-7">
            같은 가상 의회를 한 칸씩 계산해 보겠습니다.
          </p>
        </div>

        <ExplainedFormula
          question="의석 비율이 그대로 형식적 투표력인가?"
          idea="과반 연합에서 특정 정당을 뺐을 때 패배로 바뀌면 그 정당은 그 연합에서 결정적입니다. 이런 swing의 수를 세어 전체 swing으로 나누면 정규화 Banzhaf 지수가 됩니다."
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
                "빠져도 이기는 연합에서는 이 지수가 i의 swing을 하나도 세지 않습니다. 실제 협상 근거가 전혀 없다는 뜻은 아닙니다.",
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
              name: "정당 i의 정규화 Banzhaf 투표력",
              description:
                "i가 결정적인 연합의 수를 전체 결정적 횟수로 나눈 값입니다. 모든 정당의 값을 더하면 1이 됩니다.",
            },
          ]}
          assumptions={[
            "모든 연합이 똑같이 성사될 수 있다고 둡니다. 실제로는 정책 거리가 먼 조합이 먼저 탈락합니다.",
            "각 정당의 의석이 당론으로 한 덩어리처럼 움직인다고 둡니다. 이탈표가 많으면 정당 단위의 계산이 흔들립니다.",
            "사안이 하나이고 표결이 한 번이라고 둡니다. 여러 사안을 묶어 주고받는 거래는 들어 있지 않습니다.",
          ]}
          interpretation="300석 의회에서 과반이 151석이고 의석이 140·140·20이라면, 과반 연합은 가+나, 가+다, 나+다, 가+나+다 네 개입니다. 두 당 연합에서는 두 당이 모두 결정적이고 세 당 연합에서는 누가 빠져도 151석 이상이 남아 아무도 결정적이지 않습니다. swing 수는 2·2·2, 합은 6이므로 정규화 값은 각각 2/6=1/3입니다. 읽어도 되는 결론은 이 모형에서 20석 다당의 표결력이 140석 두 당과 같다는 것입니다. 실제 협상 결과나 장관 몫도 1/3이라는 결론은 읽으면 안 됩니다. 160·120·20으로 바뀌면 가당이 단독 과반이어서 값은 1·0·0이 됩니다."
        />

        <PowerIndexViz />

        <CitationBlock
          source="John F. Banzhaf III · Weighted Voting Doesn't Work: A Mathematical Analysis (Rutgers Law Review 19, 1965, 317~343쪽)"
          citeKey={6}
          href="https://banzhaf.net/about/BanzhafIndexofVotingPower.html"
        >
          가중치의 크기와 결과를 바꿀 수 있는 투표력이 일치하지 않을 수 있다는
          문제를 수학적으로 다룬 원 논문입니다. 여기서는 결정적인 연합의 수를
          정규화한 값만 사용합니다. 가능한 연합을 같은 가능성으로 보고 정당이 한
          덩어리로 투표한다는 가정 때문에, 실제 연정 협상을 예측하는 완성 모형으로
          쓰지 않습니다.
        </CitationBlock>

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            이 계산은 앞 글의 거부권자 계산과 비슷한 질문을 다른 공간에서 묻습니다.
            앞 글은 정책 축 위에서 누가 막을 수 있는지를 봤고, 여기서는 정당
            조합의 공간에서 누가 없어서는 안 되는지를 봅니다. 둘 다 답은 숫자의
            크기가 아니라 구조에서 나옵니다.
          </p>
        </div>
      </section>

      <section id="semi-presidential" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 5. 준대통령제에서는 대통령과 총리를 따로 추적합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            준대통령제를 “대통령제와 의원내각제의 중간”이라고만 외우면 P의 경로를
            설명할 수 없습니다. 이 체제에는 고정 임기의 대통령과 의회에 책임지는
            총리·내각이 함께 있습니다. 두 사람 중 누가 예산과 국내 정책을 지휘하는지,
            누가 누구를 해임할 수 있는지를 조문에서 따로 찾아야 합니다.
          </p>

          <p className="leading-7">
            가당 대통령의 정당이 의회 과반이면 대통령과 총리의 정치적 방향이
            겹칠 수 있습니다. 그러나 이것이 대통령이 언제나 모든 정책을 법적으로
            단독 지휘한다는 뜻은 아닙니다. 공식 권한과 정당 다수의 정치적 통제를
            구별해야 합니다.
          </p>

          <p className="leading-7">
            가상 사례처럼 나당·다당이 160석을 이루고 정부를 지탱하면 가당 대통령과
            반대편 총리가 함께 일하는 동거정부가 생길 수 있습니다. 대통령은 남지만
            의회 책임이 있는 정부는 다수파를 거스를 수 없습니다. 이중 정통성이
            기관 사이뿐 아니라 행정부 내부의 권한 배분 문제로 들어옵니다.
          </p>

          <p className="leading-7">
            따라서 준대통령제의 실제 동작은 헌법과 의석 분포가 함께 정합니다.
            대통령·의회 중 누가 정부를 해임할 수 있는지에 따라 하위 유형도 달라지고,
            동거정부에서 외교·국방과 국내 정책이 나뉘는 방식도 국가마다 같다고
            단정할 수 없습니다.
          </p>
        </div>

        <CitationBlock
          source="프랑스 제5공화국 헌법 제8조·제12조·제20조·제49조·제50조 (Élysée 공식 영문본)"
          citeKey={7}
          href="https://www.elysee.fr/en/french-presidency/constitution-of-4-october-1958"
        >
          대통령은 총리를 임명하고 국회를 해산할 수 있지만, 정부는 국가 정책을
          결정·수행하며 의회에 책임을 집니다. 하원이 불신임안을 가결하거나 정부
          프로그램을 승인하지 않으면 총리는 정부의 사임을 대통령에게 제출해야
          합니다. 이 조문 묶음이 대통령 한 사람만 표시한 2×2 표로는 준대통령제를
          설명할 수 없는 이유를 보여 줍니다.
        </CitationBlock>
      </section>

      <section id="boundary" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          형태는 무엇이 위험한지를 말할 뿐 결과를 말하지 않습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            이 글의 비교는 전부 &ldquo;같은 갈등 다음에 어떤 경로가 열리는가&rdquo;에
            관한 것이지 어느 쪽이 더 나은 결과를 낸다는 주장이 아닙니다. 대통령제는
            정책 패배와 대통령 생존을 분리하고, 의원내각제는 정부 생존을 의회
            신임에 연결하며, 준대통령제는 두 생존 규칙을 한 행정부 안에 둡니다.
          </p>

          <p className="leading-7">
            그 차이가 실제 교착·불안정·타협 가운데 무엇으로 이어지는지는 정당 체계,
            선거 규칙, 대통령의 입법 권한, 불신임과 해산 요건, 정치 관행이 함께
            정합니다. 같은 헌법도 가당이 단독 과반일 때와 140·140·20으로 갈릴 때
            전혀 다르게 움직일 수 있습니다.
          </p>

          <p className="leading-7">
            그러면 그 의석 분포는 어디서 오는지가 다음 질문이 됩니다. 앞 두 절에서 의석은 계속 주어진 것으로 두고 계산만 했지만 같은 득표가 제도에 따라 전혀 다른 의석이 되는 과정이
            실은 앞에 있습니다.
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
