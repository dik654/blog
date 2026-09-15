import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import RequestJourneyViz from "./region-agnostic-inference-routing/viz/RequestJourneyViz";
import RetryBoundaryViz from "./region-agnostic-inference-routing/viz/RetryBoundaryViz";

/**
 * 리전과 모델 버전을 숨기려면 여섯 번 고르게 됩니다
 *
 * 한 클러스터 안의 추론 플랫폼을 다룬 앞 글 위에, 리전이 여럿일 때의 요청
 * 경로를 얹는다. 요청 경로와 결정 경로의 분리, 여섯 단계의 역할 분담, 고르는
 * 순서, 그리고 되돌릴 수 없어지는 지점까지가 범위다. 배치 최적화와 원가
 * 모델은 다루지 않는다.
 */
export default function RegionAgnosticInferenceRoutingArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          사용자가 고르지 않은 것은 사라진 것이 아니라 옮겨 간 것입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            추론 API를 쓰는 쪽에서 보면 요청 하나는 단순합니다. 모델 계열과
            원하는 성격만 적습니다. 어느 리전인지, 어떤 양자화인지, 엔진 버전이
            무엇인지는 적지 않습니다.
          </p>

          <p className="leading-7">
            그 선택들이 없어진 것은 아닙니다. 누군가 대신 하고 있습니다. 문제는
            그 일이 요청 경로 안에서 일어난다는 것입니다. 사용자가 기다리는 동안
            여섯 번의 선택이 차례로 일어납니다.
          </p>

          <p className="leading-7">
            그러면 두 가지가 동시에 걸립니다. 선택이 틀리면 품질이 흔들리고,
            선택이 느리면 첫 토큰이 늦습니다. 아래 그림이 그 여섯 번을 시간과
            함께 펼친 것입니다.
          </p>
        </div>

        <RequestJourneyViz />

        <ContentBoundary article="region-agnostic-inference-routing" />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            이 글이 푸는 질문은 하나입니다.{" "}
            <strong>
              사용자가 리전과 모델 버전을 고르지 않게 하려면 그 선택을 누가 언제
              대신 하는가
            </strong>
            입니다.
          </p>

          <p className="leading-7">
            순서는 어떤 일을 요청 경로에서 빼야 하는지, 여섯 단계가 각각 무엇을
            정하는지, 고르는 순서가 왜 결과를 바꾸는지, 그리고 어디서부터
            되돌릴 수 없는지입니다.
          </p>

          <p className="leading-7">
            한 클러스터 안에서 파드와 GPU를 다루는 이야기는 앞 글{" "}
            <Link to="/cs/ai/onprem-k8s-inference-platform">
              온프레미스 추론 인프라
            </Link>
            가 맡습니다. 이 글은 그 위에 리전이 여럿 얹혔을 때만 생기는 문제를
            봅니다.
          </p>
        </div>
      </section>

      <section id="two-paths" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 1. 요청이 지나가는 길과 결정을 내리는 길을 가릅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            이 시스템에는 성격이 전혀 다른 두 종류의 일이 있습니다. 하나는
            밀리초 안에 끝나야 하고, 다른 하나는 분 단위로 천천히 해도 됩니다.
          </p>

          <p className="leading-7">
            앞쪽은 지금 온 요청을 어디로 보낼지입니다. 뒤쪽은 어느 리전에 어떤
            모델을 몇 개 띄울지입니다. 뒤쪽은 15분에 한 번만 다시 계산해도
            충분합니다.
          </p>

          <p className="leading-7">
            그래서 둘을 다른 경로에 둡니다. 컨트롤러는 설정을 밀어 넣을 뿐
            요청이 지나가는 길에 서 있지 않습니다. 컨트롤러가 죽어도 마지막
            설정으로 요청은 계속 흐릅니다.
          </p>

          <p className="leading-7">
            이 규칙을 어기면 어떻게 되는지는 사고 기록으로 남아 있습니다.
            라우팅 메타데이터를 담은 데이터베이스가 요청 경로 안에 있으면 그
            데이터베이스가 죽는 순간 라우팅 전체가 멈춥니다.
          </p>

          <p className="leading-7">
            같은 이유로 모델 선택기도 처음에는 별도 서비스로 떼지 않고
            게이트웨이 안의 논리 모듈로 둡니다. 서비스로 만들면 요청 경로에
            네트워크 왕복과 장애 의존성이 하나씩 늘어납니다.
          </p>
        </div>

        <TermBreakdown
          title="어느 쪽 길에 두어야 하는가"
          description="판단 기준은 중요도가 아니라 얼마나 자주 바뀌어도 되는가입니다."
          items={[
            {
              term: "요청 경로",
              description:
                "요청 하나마다 실행되며 지연 예산이 밀리초 단위인 일입니다.",
              example:
                "키 확인, 스냅샷 선택, 리전 선택, 파드 선택, 토큰 한도 판정이 여기에 들어갑니다.",
              boundary:
                "여기에 있는 것은 전부 장애 의존성입니다. 하나가 느려지면 모든 요청이 느려지고, 하나가 죽으면 모든 요청이 죽습니다.",
            },
            {
              term: "결정 경로",
              description:
                "주기적으로 실행되며 결과를 설정으로 밀어 넣는 일입니다.",
              example:
                "어느 클러스터에 어떤 모델을 몇 개 띄울지, 리전 가중치를 얼마로 둘지가 여기에 들어갑니다.",
              boundary:
                "여기가 멈추면 배치가 갱신되지 않을 뿐 요청은 마지막 설정으로 계속 흐릅니다. 대신 갱신이 멈춘 것을 알아차릴 관측이 필요합니다.",
            },
            {
              term: "둘 다 아닌 것",
              description:
                "요청마다 필요하지만 갱신이 드물어 미리 밀어 두는 데이터입니다.",
              example:
                "API 키와 폐기 목록, 테넌트 정책, 모델 카탈로그를 엣지에 복제해 둡니다.",
              boundary:
                "복제본은 갱신 지연을 만듭니다. 새 키가 즉시 듣지 않거나 폐기가 늦게 반영되는 것을 어디까지 허용할지 정해 두어야 합니다.",
            },
          ]}
        />
      </section>

      <section id="six-choices" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 2. 여섯 단계가 각각 다른 것을 정합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            요청 경로 안의 일을 한 덩어리로 보면 설계가 되지 않습니다. 각 단계가
            무엇을 정하는지가 다르고, 그래서 필요한 정보와 허용되는 지연도
            다릅니다.
          </p>

          <p className="leading-7">
            엣지는 누구인지와 무엇이 허용되는지만 정합니다. GPU와는 아무 관계가
            없습니다. 그다음 슬러그를 실제 스냅샷으로 풉니다. 슬러그는 모델
            이름이 아니라 계약이라, 이 요청이 쓰는 기능을 지원하지 않는 후보를
            여기서 걸러냅니다.
          </p>

          <p className="leading-7">
            여기서 한 가지를 놓치기 쉽습니다. 모델만 따로 고르면 안 됩니다.
            품질 기준을 통과한 스냅샷이라도 이 테넌트가 허용하는 리전에 지금 떠
            있지 않을 수 있습니다. 그래서 평가 단위는 스냅샷 하나가 아니라{" "}
            <strong>스냅샷과 endpoint의 쌍</strong>입니다.
          </p>

          <p className="leading-7">
            그다음이 리전과 클러스터입니다. 여기까지가 후보를 자르는 일이고,
            마지막 두 단계에서 실제 파드가 정해지고 토큰이 나옵니다.
          </p>

          <p className="leading-7">
            파드를 고르는 일은 쿠버네티스 쪽에 표준이 생겼습니다. 같은 스냅샷을
            띄운 파드 집합을 하나의 풀로 선언하고, 그 풀에서 파드를 고르는
            컴포넌트가 파드가 내보내는 지표를 봅니다.
          </p>
        </div>

        <CitationBlock
          source="Kubernetes SIG Network · Gateway API Inference Extension — InferencePool"
          citeKey={1}
          href="https://gateway-api-inference-extension.sigs.k8s.io/api-types/inferencepool/"
        >
          InferencePool을 &ldquo;a group of Pods (containers) dedicated to serving
          AI models&rdquo;로 정의하고, 같은 풀의 파드는 연산 구성·가속기 종류·기반
          모델·모델 서버를 공유한다고 적습니다. Endpoint Picker가 보는 지표로는
          &ldquo;the KV-cache utilization, queue length of pending requests,
          active LoRA adapters, etc.&rdquo;를 듭니다. 이 글의 다섯째 단계가 보는
          재료가 그것입니다. 같은 문서가 InferencePool을 &ldquo;GA since
          v1.0.0&rdquo;으로 표시하고 v1으로 승격되었다고 적습니다. 문서 페이지를
          직접 열어 확인했습니다. 이 글이 쓰는 것은 풀의 정의와 EPP가 보는 지표
          목록, 그리고 GA 상태까지입니다. 클라우드 관리형 상품들이 같은
          매니페스트로 운영되는지는 이 문서가 답하지 않으며 제어 API는 공급자마다
          다릅니다.
        </CitationBlock>

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            다만 이 여섯 단계를 정착된 구조로 읽으면 안 됩니다. 표준이 있는 것은
            다섯째 단계, 그러니까 한 클러스터 안에서 파드를 고르는 부분까지입니다.
            리전 게이트웨이가 다른 클러스터의 풀을 가리키는 연결에는 아직
            공개 표준이 없어서 직접 만들어야 합니다.
          </p>
        </div>

        <ExplainedFormula
          question="여섯 번 고르는 데 쓰는 시간은 첫 토큰까지의 얼마입니까?"
          idea="첫 토큰까지의 시간을 고르는 시간과 만드는 시간으로 나눕니다. 앞의 다섯 단계는 후보를 자르는 일이라 각각 밀리초 단위로 끝나고, 마지막 단계에서 엔진 큐에 기다렸다가 prefill을 계산합니다. 두 덩어리의 크기가 두 자릿수 차이라, 라우팅을 더 정교하게 만드는 것보다 큐 대기를 줄이는 쪽이 첫 토큰을 훨씬 많이 당깁니다."
          formula={String.raw`\mathrm{TTFT} = \underbrace{\textstyle\sum_{k=1}^{5} d_k}_{\text{고르는 시간}} + \underbrace{w_{\text{queue}} + t_{\text{prefill}}}_{\text{만드는 시간}}`}
          annotatedFormula={String.raw`\mathrm{TTFT} = \underbrace{\textstyle\sum_{k=1}^{5} d_k}_{\text{후보를 자르는 다섯 단계}} + \underbrace{w_{\text{queue}}}_{\text{부하가 정하는 항}} + \underbrace{t_{\text{prefill}}}_{\text{캐시 적중이 정하는 항}}`}
          operations={[
            {
              expression: String.raw`\textstyle\sum_{k=1}^{5} d_k`,
              annotation: [
                "엣지·모델 선택·리전 선택·리전 게이트웨이·클러스터 게이트웨이의 처리 시간을 더한 것입니다.",
                "각 항은 후보 집합을 자르는 일이라 계산량이 작고 부하와 거의 무관합니다. 이 합이 커지는 경우는 대개 단계 하나를 별도 서비스로 떼어 네트워크 왕복이 생겼을 때입니다.",
              ],
            },
            {
              expression: String.raw`w_{\text{queue}}`,
              annotation: [
                "고른 파드의 엔진 큐에서 기다린 시간입니다.",
                "이 항만 부하에 따라 0에서 수 초까지 움직입니다. 다섯 단계 전체보다 두 자릿수 크게 흔들릴 수 있어서, 파드를 고를 때 큐 깊이를 보는 이유가 여기 있습니다.",
              ],
            },
            {
              expression: String.raw`t_{\text{prefill}}`,
              annotation: [
                "프롬프트를 읽어 첫 토큰을 만들 준비를 하는 계산입니다.",
                "앞부분이 이미 KV 캐시에 있는 파드로 보내면 그만큼 건너뜁니다. 다만 캐시만 보고 고르면 부하가 몰린 파드로 가서 큐 항이 커지므로 두 항을 함께 봐야 합니다.",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`d_k`,
              name: "k번째 단계의 처리 시간",
              description:
                "그 단계가 후보를 자르고 다음 단계로 넘기는 데 쓴 시간이며, 네트워크 왕복이 끼면 여기에 함께 들어갑니다.",
            },
            {
              symbol: String.raw`w_{\text{queue}}`,
              name: "엔진 큐 대기",
              description:
                "토큰 예산이나 KV 공간이 모자라 배치에 끼지 못하고 기다린 시간입니다.",
            },
            {
              symbol: String.raw`t_{\text{prefill}}`,
              name: "prefill 계산",
              description:
                "프롬프트 토큰을 읽는 계산이며, 캐시에 있는 앞부분만큼 줄어듭니다.",
            },
          ]}
          assumptions={[
            "중간 계층이 버퍼링하지 않는다고 둡니다. 어느 한 계층이라도 응답을 모아서 보내면 이 분해가 무의미해지고 첫 토큰이 마지막 토큰만큼 늦어집니다.",
            "다섯 단계의 값은 측정 범위를 정하기 전의 가정입니다. 네트워크·게이트웨이 처리·원장 예약·엔진 큐·전처리·GPU 계산을 따로 재야 이 식이 검증됩니다.",
            "단일 요청 기준입니다. 같은 요청이 재시도되면 시도마다 이 분해가 따로 생기고, 전체 deadline은 시도들의 합으로 봐야 합니다.",
          ]}
          interpretation="예시 값을 넣어 보겠습니다. 엣지 3밀리초, 모델 선택 6밀리초, 리전 선택 3밀리초, 리전 게이트웨이 2밀리초, 클러스터 게이트웨이 2밀리초면 고르는 시간은 16밀리초입니다. 여기에 큐 대기 40밀리초와 prefill 180밀리초를 더하면 첫 토큰까지 236밀리초이고, 고르는 시간은 그중 6.8퍼센트입니다. 여기서 읽어야 할 것은 라우팅 계층을 아무리 다듬어도 줄일 수 있는 것이 16밀리초뿐이라는 점입니다. 같은 노력을 큐 대기와 prefill에 쓰면 220밀리초를 건드리게 됩니다. 읽으면 안 되는 것은 라우팅이 중요하지 않다는 결론입니다. 라우팅이 하는 일은 자기 시간을 줄이는 것이 아니라 뒤의 두 항이 작은 파드를 고르는 것입니다. 큐가 짧고 캐시가 맞는 파드를 고르면 220밀리초 쪽이 줄어듭니다."
        />
      </section>

      <section id="order-matters" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 3. 무엇을 먼저 보느냐가 결과를 바꿉니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            후보를 자르는 기준은 여럿입니다. 데이터가 어느 나라에 머물러야
            하는지, 지금 어디가 덜 막혔는지, 어디가 싼지. 이것들을 어떤 순서로
            적용하느냐가 결과를 바꿉니다.
          </p>

          <p className="leading-7">
            먼저 강제 제약입니다. 한국 밖으로 나갈 수 없는 테넌트면 서울
            클러스터만 후보입니다. 후보가 없으면 다른 리전으로 넘기지 않고 명시적
            으로 실패시킵니다. 넘기는 순간 그 계약이 깨집니다.
          </p>

          <p className="leading-7">
            그다음이 지금 감당할 수 있는지, 그다음이 얼마나 기다리는지입니다.
            원가는 마지막입니다.
          </p>

          <p className="leading-7">
            원가를 앞으로 올리면 되먹임이 생깁니다. 최근 처리한 토큰 수로 나눈
            평균 원가를 쓰면 트래픽이 몰린 풀이 싸 보이고, 싸 보이니까 더
            몰립니다.
          </p>

          <p className="leading-7">
            더 근본적인 이유가 있습니다. 이미 확보한 용량에 요청 하나를 더 보낼
            때 늘어나는 비용은 전력과 물과 회선뿐입니다. 장비 값과 상면 임대료는
            이미 확정되어 어느 쪽을 골라도 같습니다. 그래서 확보된 용량끼리는
            원가 차이가 라우팅을 좌우할 만큼 크지 않습니다.
          </p>

          <p className="leading-7">
            원가가 실제로 결정을 바꾸는 자리는 따로 있습니다. 확보한 용량이 다
            차서 탄력 임대를 더 돌리거나 외부 API로 넘겨야 하는 경계입니다.
            거기서는 요청 하나가 청구액을 실제로 늘립니다.
          </p>

          <p className="leading-7">
            이 절은 이 글에서 가장 약한 부분이기도 합니다. 비용 항목을 어느
            결정에 넣을지 가른 것에서 라우팅 순서까지 끌어냈는데, 분류가
            맞더라도 순서가 그것만으로 따라 나오지는 않습니다. 실제로 이 논증은
            원 조사를 외부 모델에 검증시켰을 때 가장 크게 지적받은 지점이고,
            순서 자체는 측정으로 확인해야 합니다.
          </p>
        </div>

        <AlgorithmBlock
          title="리전과 클러스터를 고르는 순서"
          input={[
            "요청에 붙은 테넌트 정책(상주·기능·tier)",
            "후보 (스냅샷, endpoint) 쌍",
            "클러스터별 최근 헬스·큐·KV 여유",
            "시간 단위로 갱신되는 원가표",
          ]}
          steps={[
            {
              code: "후보 ← 강제 제약을 통과한 쌍만 남긴다",
              note: "데이터 상주와 요청이 쓰는 기능이 여기 들어갑니다. 남은 후보가 없으면 다른 후보로 넘기지 않고 실패시킵니다.",
            },
            {
              code: "후보 ← 최근 30초 안에 장애가 없던 것만 남긴다",
              note: "지금 감당할 수 있는지를 봅니다. 이 단계가 없으면 아픈 클러스터로 계속 보내게 됩니다.",
            },
            {
              code: "세션 친화 키가 가리키는 후보를 앞으로 당긴다",
              note: "같은 대화가 같은 곳으로 가야 앞부분이 캐시에 남아 있습니다. 강제 제약을 어기면서까지 당기지는 않습니다.",
            },
            {
              code: "큐가 짧고 KV에 여유가 있는 순으로 정렬한다",
              note: "TTFT를 실제로 정하는 항이 여기입니다. 앞 절의 식에서 두 자릿수 큰 쪽입니다.",
            },
            {
              code: "남은 후보가 여럿이면 원가가 낮은 쪽에 가중치를 준다",
              note: "마지막입니다. 평균 원가가 아니라 그 요청이 실제로 늘리는 청구액을 씁니다. 확보된 용량 안에서는 이 값이 거의 같습니다.",
            },
          ]}
          output="요청을 보낼 클러스터와 그 안의 파드"
        />

        <CitationBlock
          source="OpenRouter Docs — Provider Routing (Load Balancing)"
          citeKey={2}
          href="https://openrouter.ai/docs/features/provider-routing"
        >
          외부 provider를 여럿 두고 고르는 쪽의 공개된 기본 순서입니다. 먼저
          &ldquo;Prioritize providers that have not seen significant outages in
          the last 30 seconds&rdquo;로 안정성을 보고, 그다음 &ldquo;look at the
          lowest-cost candidates and select one weighted by inverse square of the
          price&rdquo;로 가격을 역제곱 가중해 고르며, 나머지를 fallback으로
          둡니다. `allow_fallbacks`가 기본값 true입니다. 문서 페이지를 직접 열어
          확인했습니다. 여기서 가격이 둘째로 올라와 있는 것은 대상이 외부
          provider이기 때문입니다. 외부에 보내는 요청은 가격이 곧 그 요청이
          늘리는 비용이라 본문의 마지막 단계와 같은 자리에 있습니다. 자기 용량에
          같은 역제곱 가중을 쓰면 본문에서 말한 되먹임이 생깁니다.
        </CitationBlock>
      </section>

      <section id="commit-point" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 4. 첫 출력 청크가 되돌릴 수 없는 선을 긋습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            고르기를 잘해도 고른 곳이 죽습니다. 그러면 다시 보내야 하는데, 언제
            까지 다시 보낼 수 있는지가 스트리밍에서는 평범하지 않습니다.
          </p>

          <p className="leading-7">
            일반적인 요청이면 응답을 받아 보고 실패면 다시 보내면 됩니다.
            스트리밍은 응답이 조금씩 나가므로, 이미 나간 만큼은 되돌릴 수
            없습니다.
          </p>

          <p className="leading-7">
            그래서 선을 하나 긋습니다. 첫 의미 있는 출력 청크입니다. 그 앞에서는
            백엔드를 바꿔도 클라이언트가 모릅니다. 그 뒤로는 200이 이미
            커밋되어 상태 코드로 실패를 알릴 방법조차 없습니다.
          </p>

          <p className="leading-7">
            이 선 위에서 두 계층이 일을 나눠 갖습니다. 프록시는 응답이 시작되기
            전의 실패만 다룹니다. 스트림 안의 내용을 이해하지 못하기 때문입니다.
            스트림을 소유한 게이트웨이는 헤더가 나간 뒤에도 첫 출력 청크 전까지는
            바꿀 수 있습니다.
          </p>

          <p className="leading-7">
            같은 선이 다른 결정도 정합니다. 서빙한 리전과 스냅샷을 응답 헤더에
            적으면 안 됩니다. 헤더는 이 선보다 먼저 나가는데 그 뒤에 백엔드가
            바뀔 수 있어서, 헤더에 적은 위치가 틀릴 수 있습니다.
          </p>
        </div>

        <RetryBoundaryViz />

        <ProgressiveDetail
          title="무엇이 죽었을 때 어느 계층이 흡수하는가"
          preview="계층마다 흡수할 수 있는 장애가 다르고, 이미 출력이 나간 요청은 어느 계층도 구하지 못합니다."
        >
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p className="leading-7">
              GPU 한 장이 죽으면 파드가 다시 스케줄되고 파드를 고르는 쪽이 즉시
              그 파드를 뺍니다. 신규 요청은 영향이 없고, 아직 출력 전인 요청은
              자동으로 다시 보내지며, 출력 중이던 요청만 끊깁니다.
            </p>

            <p className="leading-7">
              클러스터의 데이터 경로가 끊기면 리전 게이트웨이가 인접 클러스터나
              리전으로 넘깁니다. 이때도 상주 제약은 그대로 적용되어, 넘길 곳이
              없으면 넘기지 않고 실패시킵니다.
            </p>

            <p className="leading-7">
              클러스터의 컨트롤 플레인이 죽는 경우는 성격이 다릅니다. 데이터
              경로는 살아 있어서 요청은 전부 정상입니다. 스케일과 재스케줄만
              멈춥니다. 부품 1의 분리가 실제로 값을 하는 자리입니다.
            </p>

            <p className="leading-7">
              다만 이 분리가 모든 상태에 적용되지는 않습니다. 배치와 라우팅
              가중치는 마지막 스냅샷으로 버틸 수 있지만, 잔액과 한도는 그렇게
              두면 돈이 새어 나갑니다. 상태마다 권위 저장소와 그것이 죽었을 때의
              정책을 따로 정해야 합니다.
            </p>

            <p className="leading-7">
              그리고 자체 클러스터가 노드 두 대뿐이라면 이중화가 아닙니다. 각각
              60퍼센트 부하일 때 한 대가 죽으면 남은 한 대가 120퍼센트를
              받습니다. 판매 가능 용량은 전체 처리량이 아니라 한 대가 빠진
              상태에서 지킬 수 있는 부하로 잡아야 합니다.
            </p>
          </div>
        </ProgressiveDetail>

        <ProgressiveDetail
          title="긴 응답은 중간의 로드밸런서에 먼저 끊깁니다"
          preview="유휴 제한과 전체 요청 제한은 다른 것이라 heartbeat가 모든 경우를 해결하지 않습니다."
        >
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p className="leading-7">
              추론 응답은 수십 초에서 몇 분까지 이어집니다. 그 사이 토큰이 잠시
              안 나오는 구간이 생기면 중간의 로드밸런서가 연결을 끊습니다.
            </p>

            <p className="leading-7">
              그래서 게이트웨이가 유휴 구간에 SSE 주석을 주기적으로 보냅니다.
              다만 이것으로 해결되는 것은 유휴 제한뿐입니다. 전체 요청 시간에
              상한을 두는 종류의 제한은 토큰이 계속 나와도 걸립니다.
            </p>

            <p className="leading-7">
              쓰는 로드밸런서가 어느 종류인지를 먼저 확인해야 합니다. 기본값은
              제품마다 다르고 조정 가능 여부도 요금제에 따라 다릅니다. 이 글은
              특정 제품의 현재 기본값을 싣지 않습니다. 확인 시점에 따라
              달라지는 값이기 때문입니다.
            </p>

            <p className="leading-7">
              배포할 때도 같은 것이 걸립니다. 게이트웨이의 drain 시간과 파드
              종료 유예를 최대 응답 시간에 맞춰 두지 않으면 롤아웃이 진행 중인
              스트림을 끊습니다.
            </p>
          </div>
        </ProgressiveDetail>
      </section>

      <section id="boundary" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          고르는 일까지가 이 글이고, 무엇을 띄울지는 다른 글입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            네 부품을 합치면 이렇습니다. 요청 경로에는 밀리초 안에 끝나는 일만
            두고, 여섯 단계가 각각 다른 것을 정하며, 제약에서 시작해 원가로
            끝나는 순서를 지키고, 첫 출력 청크 전까지만 되돌립니다.
          </p>

          <p className="leading-7">
            이 전부는 이미 떠 있는 것 중에서 고르는 일입니다. 어느 리전에 어떤
            모델을 몇 개 띄울지는 여기서 정하지 않습니다. 그것은 분 단위로 도는
            다른 경로의 일이고, 이 글이 소유하지 않습니다.
          </p>

          <p className="leading-7">
            숫자로도 그렇습니다. 앞 절의 식에서 고르는 시간은 16밀리초였고 나머지
            220밀리초는 엔진 안에 있었습니다. 라우팅이 할 수 있는 최선은 자기
            시간을 줄이는 것이 아니라 뒤의 두 항이 작은 곳을 고르는 것입니다.
            그 두 항이 무엇으로 정해지는지는{" "}
            <Link to="/cs/ai/vllm-scheduler">스케줄러</Link>와{" "}
            <Link to="/cs/ai/prefix-caching-radix-attention">
              prefix 캐시
            </Link>
            가 맡습니다.
          </p>

          <p className="leading-7">
            다루지 않은 것을 밝혀 둡니다. 배치 최적화, 소유와 임대의 손익,
            미터링과 원장 설계는 이 글의 범위 밖입니다. 리전 사이로 KV 캐시를
            옮기는 것도 다루지 않았는데, 조사에서 반복해서 나온 결론이 리전
            간에는 모델이나 캐시가 아니라 요청을 나눈다는 것이었기 때문입니다.
          </p>
        </div>
      </section>
    </div>
  );
}
