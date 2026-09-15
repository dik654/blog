import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import StandardLevelsViz from "./inference-stack-standard-levels/viz/StandardLevelsViz";
import HitRateViz from "./inference-stack-standard-levels/viz/HitRateViz";

/**
 * 표준이라는 말에 세 수준이 섞여 있습니다
 *
 * 스택을 고를 때 무엇이 실제로 옮겨지는지를 가른다. 세 수준의 구분, 아래 두
 * 층의 공통성, 위층의 비이식성, 스택과 엔진의 분리, 그리고 라우팅 정책이
 * 적중률을 통해 결과를 바꾸는 경로까지가 범위다. 제품 비교표는 만들지 않는다.
 */
export default function InferenceStackStandardLevelsArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          표준을 쓴다고 해서 옮길 수 있는 것은 아닙니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            추론 서빙 스택을 고를 때 표준을 쓰면 나중에 옮기기 쉽다고 말합니다.
            절반만 맞습니다.
          </p>

          <p className="leading-7">
            표준이라는 한 단어에 성격이 다른 세 가지가 섞여 있기 때문입니다.
            자원의 모양을 정하는 것, 요청마다 도는 구현체, 그리고 무엇을 얼마나
            띄울지 선언하는 것입니다.
          </p>

          <p className="leading-7">
            앞의 둘은 실제로 공통입니다. 마지막 하나는 공급자마다 다릅니다.
            그래서 옮기는 일은 전부 옮기는 것도 전부 새로 짜는 것도 아닙니다.
          </p>
        </div>

        <StandardLevelsViz />

        <ContentBoundary article="inference-stack-standard-levels" />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            이 글이 푸는 질문은 하나입니다.{" "}
            <strong>
              스택을 고를 때 무엇이 실제로 옮겨지고 무엇을 새로 짜야 하는가
            </strong>
            입니다.
          </p>

          <p className="leading-7">
            순서는 세 수준을 가르고, 아래 두 층이 왜 공통인지 보고, 스택 선택과
            엔진 선택이 왜 다른 결정인지 보고, 마지막으로 이 층이 실제로 무엇을
            바꾸는지를 수치로 봅니다.
          </p>

          <p className="leading-7">
            제품 비교표는 만들지 않습니다. 버전과 이름은 몇 달 단위로 바뀌므로
            여기서 가져갈 것은 특정 제품의 우열이 아니라 층을 가르는 기준입니다.
          </p>
        </div>
      </section>

      <section id="three-levels" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 1. 세 수준을 가르지 않으면 이식성을 말할 수 없습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            같은 스택이 표준을 따른다고 할 때 무엇이 표준인지를 물어야 합니다.
            세 가지를 나눠 보면 답이 서로 다릅니다.
          </p>

          <p className="leading-7">
            아래층은 자원의 모양입니다. 같은 스냅샷을 띄운 파드 집합을 하나의
            풀로 선언하는 자원이 여기 있습니다. 스펙이 있고 적합성 시험이
            있습니다.
          </p>

          <p className="leading-7">
            가운데층은 요청마다 도는 구현체입니다. 그 풀에서 파드를 고르는
            컴포넌트이고, 큐 깊이와 캐시 여유와 어댑터 위치를 봅니다. 이것도
            공통입니다.
          </p>

          <p className="leading-7">
            위층은 운영입니다. 무엇을 얼마나 띄울지 선언하는 자원, 그것을
            인증하는 방식, 그리고 용량을 확보하는 경로입니다. 여기는 공급자마다
            이름도 모양도 다릅니다.
          </p>

          <p className="leading-7">
            그래서 판정은 하나가 아니라 셋입니다. 오픈소스가 지원하는가, 관리형
            상품이 지원하는가, 같은 선언으로 운영되는가.{" "}
            <strong>앞의 둘은 맞고 셋째는 아닙니다.</strong>
          </p>

          <p className="leading-7">
            이 구분이 실전에서 하는 일이 있습니다. 옮길 때 무엇을 다시 짜야
            하는지를 미리 셀 수 있게 해 주고, 그 몫만 공급자별 어댑터로 떼어
            두게 합니다.
          </p>
        </div>

        <TermBreakdown
          title="세 수준의 판정이 각각 다릅니다"
          description="같은 스택에 대해 세 질문의 답이 달라서, 하나로 물으면 답이 반만 맞습니다."
          items={[
            {
              term: "자원의 모양",
              description:
                "같은 스냅샷을 띄운 파드 집합을 선언하는 API 객체입니다.",
              example:
                "풀의 선택자와 대상 포트, 그리고 파드를 고르는 컴포넌트를 가리키는 참조를 적습니다.",
              boundary:
                "단일 클러스터 범위입니다. 클러스터를 가로질러 이 풀을 내보내고 들여오는 공개 표준은 아직 없습니다.",
            },
            {
              term: "요청 경로 구현체",
              description:
                "풀 안에서 파드를 고르는 컴포넌트이며 요청마다 돕니다.",
              example:
                "파드가 내보내는 대기 요청 수와 캐시 사용률과 적재된 어댑터 목록을 보고 고릅니다.",
              boundary:
                "이 컴포넌트 자체가 단일 장애점이자 병목이 될 수 있어 별도로 이중화해야 합니다.",
            },
            {
              term: "운영 매니페스트",
              description:
                "무엇을 얼마나 띄울지 선언하는 제어 자원과 인증·용량 확보입니다.",
              example:
                "같은 일을 하는 자원이 공급자마다 다른 이름과 다른 필드로 있습니다.",
              boundary:
                "여기가 옮겨지지 않으므로, 이 층만 공급자별 어댑터로 떼어 두는 것이 이식성을 확보하는 실제 방법입니다.",
            },
          ]}
        />

        <CitationBlock
          source="Kubernetes SIG Network · Gateway API Inference Extension — InferencePool"
          citeKey={1}
          href="https://gateway-api-inference-extension.sigs.k8s.io/api-types/inferencepool/"
        >
          아래층이 실제로 표준이라는 근거입니다. 같은 연산 구성·가속기·기반
          모델·모델 서버를 공유하는 파드 집합을 하나의 자원으로 정의하고, 파드를
          고르는 컴포넌트가 보는 지표로 &ldquo;the KV-cache utilization, queue
          length of pending requests, active LoRA adapters, etc.&rdquo;를
          듭니다. 같은 문서가 이 자원을 &ldquo;GA since v1.0.0&rdquo;으로
          표시합니다. 문서를 직접 열어 확인했습니다. 이 글이 참고한 사내 정리본의
          초판에는 이 자원이 2026년 4월 릴리스에서 GA 선언됐다고 적혀 있었는데
          문서와 맞지 않아, 교차 검증에서 정정된 쪽을 따랐습니다. 위층의 제어
          자원이 공급자마다 다르다는 것은 이 문서가 다루지 않으며 그 판단은 이
          글의 것입니다.
        </CitationBlock>
      </section>

      <section id="engine-vs-stack" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 2. 스택을 고르는 것과 엔진을 고르는 것은 다른 결정입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            스택을 고르면 엔진도 따라 정해진다고 생각하기 쉽습니다. 실제로는
            두 결정이 분리되어 있고, 그 사실을 놓치면 선택지를 스스로 좁힙니다.
          </p>

          <p className="leading-7">
            스택이 하는 일은 어느 파드로 보낼지를 정하는 것입니다. 파드 안에서
            토큰을 만드는 일은 엔진이 합니다. 스택은 엔진이 내보내는 지표만
            읽습니다.
          </p>

          <p className="leading-7">
            그래서 같은 스택이 여러 엔진을 구성표에 올려 둘 수 있습니다. 실제로
            널리 쓰이는 조합 하나는 릴리스마다 엔진 셋의 검증된 버전을 함께
            적어 배포합니다.
          </p>

          <p className="leading-7">
            다만 목록에 올라 있다는 것과 모든 경로가 같은 성숙도라는 것은 다른
            말입니다. 분리 배치나 캐시 전송 같은 기능이 엔진마다 같은 수준으로
            준비되어 있는지는 따로 확인해야 합니다.
          </p>

          <p className="leading-7">
            그래서 실전 순서는 이렇습니다. 스택은 아래 두 층의 표준을 따르는
            것으로 고르고, 엔진은 지금 쓰려는 기능이 그 엔진 경로에서 실제로
            검증됐는지로 고릅니다. 두 판단을 한 번에 묶지 않습니다.
          </p>
        </div>

        <AlgorithmBlock
          title="스택과 엔진을 나눠 고르는 절차"
          input={[
            "지금 쓰려는 기능 목록",
            "옮길 가능성이 있는 공급자 목록",
            "스택의 릴리스 구성표",
          ]}
          steps={[
            {
              code: "아래 두 층이 표준 자원과 공통 구현체인지 확인한다",
              note: "여기가 아니면 옮길 때 전부 새로 짜게 됩니다. 적합성 시험이 있는지로 확인합니다.",
            },
            {
              code: "위층에서 공급자마다 다른 부분을 목록으로 뽑는다",
              note: "제어 자원 이름, 인증 방식, 용량 확보 경로입니다. 이 목록이 곧 어댑터의 범위입니다.",
            },
            {
              code: "쓰려는 기능마다 그 엔진 경로의 검증 상태를 확인한다",
              note: "구성표에 올라 있는 것과 그 경로가 검증된 것은 다릅니다. 릴리스 노트의 상태 표기를 봅니다.",
            },
            {
              code: "스택 구성표가 명시한 버전 조합을 그대로 핀한다",
              note: "구성 요소를 개별로 올리지 않습니다. 검증된 단위가 조합이지 개별 버전이 아닙니다.",
            },
            {
              code: "상위 버전이 필요하면 따로 검증한 뒤 승격한다",
              note: "릴리스 주기가 짧고 드라이버 요구가 바뀌는 변경이 섞여 들어옵니다.",
            },
          ]}
          output="아래 두 층의 표준 선언, 위층 어댑터의 범위, 그리고 핀할 버전 조합"
        />

        <ProgressiveDetail
          title="이 절도 초판이 반대로 적었던 곳입니다"
          preview="초판은 이 스택이 특정 엔진에 묶여 있다고 적었고, 구성표를 확인하면서 뒤집혔습니다."
        >
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p className="leading-7">
              이 글이 근거로 삼은 조사의 초판에는 이 스택이 특정 엔진에 묶여
              있어 다른 엔진은 일급이 아니라고 적혀 있었습니다.
            </p>

            <p className="leading-7">
              교차 검증에서 릴리스 구성표를 확인하자 엔진 셋의 검증된 버전이
              나란히 적혀 있었고, 그 서술이 정정됐습니다. 다만 같은 정정에
              단서가 붙었습니다. 경로마다 성숙도가 같은지는 확인되지 않았다는
              것입니다.
            </p>

            <p className="leading-7">
              이 글은 정정된 쪽을 따르되 그 단서까지 함께 씁니다. 목록에 있다는
              사실만으로 그 엔진에서 원하는 기능이 검증됐다고 읽으면, 초판과
              반대 방향으로 같은 크기의 실수를 하게 됩니다.
            </p>

            <p className="leading-7">
              한 번 틀린 자리가 반대로 한 번 더 틀리기 쉬운 자리이기도 합니다.
              정정은 주장을 뒤집는 것이지 확신의 크기를 그대로 옮기는 것이
              아닙니다.
            </p>
          </div>
        </ProgressiveDetail>
      </section>

      <section id="hit-rate" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 3. 이 층이 실제로 바꾸는 것은 다시 계산할 양입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            표준이 왜 이 모양인지는 이 층이 무엇을 바꾸는지를 보면 나옵니다.
            파드를 고르는 일이 왜 따로 떼어져 표준이 됐는지의 이유입니다.
          </p>

          <p className="leading-7">
            같은 앞부분을 쓰는 요청들이 있습니다. 시스템 프롬프트나 도구 정의나
            대화 이력입니다. 그 앞부분은 한 번 계산해 두면 캐시에 남습니다.
          </p>

          <p className="leading-7">
            그런데 돌아가며 보내면 그 요청들이 서로 다른 파드로 흩어집니다.
            복제본이 여덟이면 앞 요청이 만들어 둔 캐시를 뒤 요청이 쓸 확률이
            8분의 1 수준입니다. 거의 매번 다시 계산합니다.
          </p>

          <p className="leading-7">
            캐시가 어디 있는지를 보고 고르면 같은 앞부분을 쓰는 요청이 한 곳으로
            모입니다. 첫 요청만 계산하고 나머지는 건너뜁니다.
          </p>

          <p className="leading-7">
            공개된 실험에서 이 차이가 첫 토큰을 35초에서 120밀리초로 줄였습니다.
            약 292배입니다. 다시 계산할 양이 준 것은 그보다 훨씬 작은 배수인데도
            그렇습니다.
          </p>

          <p className="leading-7">
            차이가 나는 이유는 줄어든 일감이 큐를 포화에서 빼냈기 때문입니다.
            <Link to="/cs/ai/region-agnostic-inference-routing#six-choices">
              앞 글의 분해
            </Link>
            에서 큐 대기만 부하에 비선형이었던 것과 같은 자리입니다.
          </p>
        </div>

        <ExplainedFormula
          question="어디로 보낼지가 다시 계산할 양을 얼마나 바꿉니까?"
          idea="앞부분이 캐시에 있으면 그만큼은 계산을 건너뜁니다. 그래서 다시 계산할 양은 적중하지 않은 비율에 비례하고, 그 적중률은 캐시의 성질이 아니라 라우팅 정책이 정합니다. 돌아가며 보내면 같은 앞부분을 쓰는 요청이 복제본 수만큼 흩어져 적중률이 그 역수 수준으로 떨어지고, 캐시 위치를 보고 모으면 첫 요청을 뺀 나머지가 모두 적중합니다."
          formula={String.raw`W = \lambda\,L\,(1 - h), \qquad h_{\text{RR}} \approx \frac{1}{N}, \qquad h_{\text{cache}} \approx \frac{g-1}{g}`}
          annotatedFormula={String.raw`W = \lambda\,L\,\underbrace{(1 - h)}_{\text{적중하지 않은 몫}}, \qquad \underbrace{h_{\text{RR}} \approx \frac{1}{N}}_{\text{흩뿌릴 때}}, \qquad \underbrace{h_{\text{cache}} \approx \frac{g-1}{g}}_{\text{모을 때}}`}
          operations={[
            {
              expression: String.raw`\lambda\,L`,
              annotation: [
                "초당 들어오는 요청 수에 요청당 앞부분 길이를 곱한 것으로, 캐시가 없을 때 계산해야 하는 총량입니다.",
                "여기까지는 라우팅과 무관합니다. 워크로드가 정하는 값입니다.",
              ],
            },
            {
              expression: String.raw`(1 - h)`,
              annotation: [
                "적중하지 않아 실제로 다시 계산해야 하는 비율입니다.",
                "적중률이 0.125에서 0.8로 오르면 이 값이 0.875에서 0.2가 되어 일감이 약 4.4분의 1이 됩니다.",
              ],
            },
            {
              expression: String.raw`h_{\text{RR}} \approx \frac{1}{N}`,
              annotation: [
                "복제본 N개에 차례로 뿌리면 같은 앞부분을 쓰는 요청이 흩어져, 앞 요청이 남긴 캐시를 만날 확률이 복제본 수의 역수 수준이 됩니다.",
                "복제본을 늘릴수록 이 값이 떨어집니다. 규모를 키우는 것이 이 정책 아래에서는 적중률을 깎는 방향으로 작용합니다.",
              ],
            },
            {
              expression: String.raw`h_{\text{cache}} \approx \frac{g-1}{g}`,
              annotation: [
                "같은 앞부분을 쓰는 요청 g개를 한 곳으로 모으면 첫 요청만 계산하고 나머지가 적중합니다.",
                "그룹이 클수록 1에 가까워집니다. 공유 앞부분이 짧거나 그룹이 작으면 이 이득 자체가 작아집니다.",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`h`,
              name: "앞부분 적중률",
              description:
                "요청의 앞부분 가운데 이미 캐시에 있어 계산을 건너뛴 비율이며, 한 토큰이라도 맞은 요청의 비율과는 다른 값입니다.",
            },
            {
              symbol: String.raw`N`,
              name: "복제본 수",
              description:
                "같은 스냅샷을 띄운 파드의 수이며, 돌아가며 보낼 때 요청이 흩어지는 폭을 정합니다.",
            },
            {
              symbol: String.raw`g`,
              name: "같은 앞부분을 쓰는 요청 수",
              description:
                "한 그룹의 크기이며, 모아 보냈을 때 첫 요청을 뺀 나머지가 적중합니다.",
            },
          ]}
          assumptions={[
            "캐시가 그룹이 다 지나갈 때까지 축출되지 않는다고 둡니다. 실제로는 다른 요청이 밀어내면 적중률이 떨어지고, 그래서 캐시 용량과 축출 정책이 이 식에 들어옵니다.",
            "돌아가며 보내는 정책에서 요청이 복제본에 고르게 흩어진다고 둡니다. 실제 분포는 도착 패턴에 따라 다르므로 역수는 어림입니다.",
            "일감이 줄면 대기도 같은 비율로 준다고 두지 않습니다. 이 식은 일감까지만 말하고 대기는 별도의 비선형 관계입니다.",
          ]}
          interpretation="복제본이 여덟이고 같은 앞부분을 쓰는 요청이 다섯 개인 구성을 보겠습니다. 돌아가며 보내면 적중률이 8분의 1인 12.5퍼센트 수준이라 다시 계산할 양이 87.5퍼센트이고, 캐시 위치를 보고 모으면 다섯 중 넷이 적중해 20퍼센트만 남습니다. 일감은 약 4.4분의 1이 됩니다. 그런데 공개된 실험에서 첫 토큰은 35초에서 120밀리초로 약 292배 줄었습니다. 여기서 읽어야 할 것은 292가 4.4의 산술이 아니라는 점입니다. 줄어든 일감이 큐를 포화에서 빼냈고, 포화 근처에서는 대기가 일감에 비선형으로 반응합니다. 읽으면 안 되는 것은 이 배수를 다른 워크로드에 옮기는 것입니다. 공유 앞부분이 긴 합성 워크로드에서 나온 값이고, 공유가 적으면 g가 작아 적중률 자체가 오르지 않습니다. 앞부분만 보고 고르는 정책이 공유가 많은 환경에서도 성공률 55퍼센트에 그쳤다는 보고가 있어, 부하까지 함께 보는 것이 필요합니다."
        />

        <HitRateViz />

        <CitationBlock
          source="Red Hat Developer — Intelligent inference scheduling with llm-d (2026-06-11)"
          citeKey={2}
          href="https://developers.redhat.com/articles/2026/06/11/intelligent-inference-scheduling-llm-d-red-hat-ai"
        >
          구성과 결과를 그대로 옮기면 이렇습니다. &ldquo;8 vLLM replicas on 16
          H100 GPUs (2 GPUs each, Tensor Parallelism = 2), Qwen/Qwen3-32B,
          shared-prefix synthetic workload (150 groups, 5 prompts per group) at
          60 requests per second&rdquo;에서 첫 토큰이 &ldquo;35 seconds to 120
          milliseconds&rdquo;로, 처리량이 &ldquo;More than doubled
          (+151%)&rdquo;, 요청 지연이 &ldquo;Down 35%&rdquo;입니다. 글을 직접
          열어 확인했습니다. 이 글이 참고한 사내 정리본은 같은 실험을 첫 토큰
          최대 57배 단축과 처리량 2배로 적고 있는데, 위 수치로는 첫 토큰이 약
          292배이고 처리량이 2.51배라 맞지 않습니다. 확인한 쪽을 썼습니다. 이
          숫자는 공유 앞부분이 긴 합성 워크로드에서 나온 것이며 다른 워크로드로
          옮길 수 없습니다.
        </CitationBlock>
      </section>

      <section id="version-pinning" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 4. 검증된 단위는 개별 버전이 아니라 조합입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            아래 두 층이 공통이라고 해서 아무 버전이나 섞어도 되는 것은
            아닙니다. 이 영역은 릴리스 주기가 짧고 구성 요소가 여럿입니다.
          </p>

          <p className="leading-7">
            그래서 스택 릴리스는 개별 버전이 아니라 구성표를 냅니다. 엔진, 게이트
            웨이, 메시의 검증된 버전이 함께 적힙니다. 검증한 단위가 그 조합입니다.
          </p>

          <p className="leading-7">
            여기서 흔한 실수가 구성 요소 하나만 최신으로 올리는 것입니다. 각각이
            안정 버전이어도 그 조합은 아무도 돌려 보지 않은 것입니다.
          </p>

          <p className="leading-7">
            변경의 성격도 봐야 합니다. 어떤 릴리스는 드라이버 하한을 올립니다.
            그러면 스택 하나를 올리는 일이 노드 전체를 건드리는 일이 됩니다.
          </p>

          <p className="leading-7">
            그래서 규칙이 둘입니다. 구성표가 적은 조합을 그대로 핀하고, 상위
            버전이 필요하면 따로 검증한 뒤 승격합니다. 표준을 따른다는 것이
            버전 자유를 뜻하지 않습니다.
          </p>
        </div>

        <ProgressiveDetail
          title="아래층 안에서도 경계가 한 번 움직였습니다"
          preview="표준 저장소가 참조 구현을 덜어 내고 스펙과 적합성만 남기는 쪽으로 정리됐습니다."
        >
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p className="leading-7">
              한동안 표준 저장소가 자원의 스펙과 함께 쓸 만한 구현체까지 들고
              있었습니다. 그러다 실험적 자원 몇 개를 덜어 내고 구현체를 다른
              조직으로 옮기는 정리가 있었습니다.
            </p>

            <p className="leading-7">
              남은 것은 스펙과 적합성 시험, 그리고 검증용 경량 구현입니다. 실제
              운영은 별도 조직의 구현체나 공급자 구현체를 쓰는 구조로 굳었습니다.
            </p>

            <p className="leading-7">
              이 정리가 앞 절의 구분을 오히려 또렷하게 만듭니다. 아래층은 스펙과
              시험으로 남고, 가운데층은 여러 구현이 경쟁하되 같은 지표를 보며,
              위층은 처음부터 공급자의 것이었습니다.
            </p>

            <p className="leading-7">
              옮길 때 기준으로 삼을 것도 이것입니다. 적합성 시험을 통과하는
              선언인지가 아래층의 판정이고, 그 시험이 가운데층의 구현 선택까지
              보장하지는 않습니다.
            </p>
          </div>
        </ProgressiveDetail>
      </section>

      <section id="boundary" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          한 클러스터 안까지가 표준이고, 그 바깥은 아직 아닙니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            네 부품을 합치면 이렇습니다. 표준이라는 말에 세 수준이 섞여 있고,
            아래 둘은 옮겨지며 위층은 어댑터로 떼어 내고, 스택과 엔진은 다른
            결정이며, 검증된 단위는 조합입니다.
          </p>

          <p className="leading-7">
            그리고 이 전부가 한 클러스터 안의 이야기입니다. 클러스터를 가로질러
            이 풀을 내보내고 들여오는 공개 표준은 아직 없습니다. 앞 글에서 리전
            게이트웨이가 다른 클러스터의 풀을 가리키는 연결을 직접 만들어야
            한다고 적은 것이 이 자리입니다.
          </p>

          <p className="leading-7">
            그래서 멀티리전으로 가는 팀은 아래 두 층의 이식성과 별개로 그
            연결을 자기 자산으로 갖게 됩니다. 표준을 따랐다고 해서 그 부분이
            줄어들지는 않습니다.
          </p>

          <p className="leading-7">
            다루지 않은 것을 밝혀 둡니다. 제품별 비교표와 우열 판단, 그리고
            분리 배치나 전문가 병렬 같은 개별 기능의 설계는 이 글의 범위 밖
            입니다. 버전과 이름은 몇 달 단위로 바뀌므로 특정 시점의 목록을
            싣지 않았습니다.
          </p>

          <p className="leading-7">
            이 층이 무엇을 보고 고르는지는{" "}
            <Link to="/cs/ai/region-agnostic-inference-routing#six-choices">
              요청 경로
            </Link>
            가, 그 선택이 장애 때 어떻게 작동하는지는{" "}
            <Link to="/cs/ai/inference-failure-absorption">장애 흡수</Link>가
            맡습니다.
          </p>
        </div>
      </section>
    </div>
  );
}
