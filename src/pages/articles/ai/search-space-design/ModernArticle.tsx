import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import { SearchSpaceDesignViz } from "../hyperparameter-tuning/viz/ModernHpoViz";

export default function SearchSpaceDesignArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Search space는 값 목록이 아니라 configuration을 생성하는 규칙입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            <strong>Search space</strong>는 각 hyperparameter의
            type·scale·bounds, 다른 선택에 따른 존재 조건, 실행 가능한 resource
            한도를 함께 적은 생성 모델입니다. “learning rate 0~1”처럼 범위만
            적으면 어떤 값을 얼마나 자주 시험하는지 알 수 없습니다.
          </p>
          <p>
            좋은 space는 넓은 space가 아닙니다. 같은 trial budget에서 의미 없는
            조합을 늘리면 유망 영역이 차지하는 probability mass가 작아집니다.
            Baseline·문헌·작은 pilot으로 단위와 안정 범위를 확인한 뒤 revision을
            올려 확장합니다.
          </p>
        </div>
        <TermBreakdown
          title="한 parameter를 정의할 때 따로 적을 것"
          items={[
            {
              term: "Type",
              description:
                "Continuous·integer·categorical 중 값이 실제로 갖는 형태입니다.",
              example:
                "Depth는 4~16 integer, optimizer는 AdamW/SGD category입니다.",
              boundary:
                "Integer를 continuous로 뽑아 반올림하면 값별 확률이 달라질 수 있습니다.",
            },
            {
              term: "Scale",
              description:
                "Linear 차이와 multiplicative ratio 중 어느 쪽이 자연스러운지 정합니다.",
              example:
                "Learning rate 1e-5~1e-1은 log scale로 네 decades를 고르게 봅니다.",
              boundary: "0·음수가 있는 값에 log scale을 그대로 쓰지 않습니다.",
            },
            {
              term: "Condition",
              description:
                "Parent choice에 따라 child parameter가 존재하는 규칙입니다.",
              example: "optimizer=SGD일 때만 momentum을 엽니다.",
              boundary:
                "존재하지 않는 momentum을 0으로 채운 조합과 실제 momentum=0을 구분합니다.",
            },
            {
              term: "Constraint",
              description:
                "Memory·latency·shape·compatibility를 만족하는 configuration만 허용합니다.",
              example:
                "Estimated peak가 20GB를 넘는 batch×resolution 조합을 사전에 제외합니다.",
              boundary:
                "Estimator 오차로 난 실제 OOM은 지우지 않고 FAIL로 남깁니다.",
            },
          ]}
        />
        <SearchSpaceDesignViz />
        <ContentBoundary article="search-space-design" />
      </section>

      <section id="scale" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          곱셈 비율이 중요한 양수는 log 좌표에서 뽑습니다
        </h2>
        <ExplainedFormula
          question="a와 b 사이의 각 order of magnitude에 같은 sampling 비중을 주려면 어떻게 하나요?"
          idea={
            <p>
              0과 1 사이 위치를 뽑고 log a와 log b 사이로 옮긴 뒤 exp로 원래
              단위에 되돌립니다.
            </p>
          }
          formula={String.raw`u\sim U(0,1),\quad \lambda=\exp(\log a+u(\log b-\log a))`}
          annotatedFormula={String.raw`\begin{aligned}u&\sim\underbrace{\operatorname{Uniform}(0,1)}_{\text{log interval 안의 위치를 고르게 선택}}\\z&=\underbrace{\log a+u(\log b-\log a)}_{\substack{\text{unit interval을}\text{log a부터 log b까지 이동·확대}}}\\\lambda&=\underbrace{\exp(z)}_{\text{log 좌표를 원래 parameter 단위로 복원}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\operatorname{Uniform}(0,1)`,
              annotation: ["0과 1 사이의 위치를", "같은 확률로 선택"],
            },
            {
              expression: String.raw`\log a+u(\log b-\log a)`,
              annotation: [
                "log 범위의 폭을 u만큼 이동해",
                "두 bounds 사이 log 좌표 생성",
              ],
            },
            {
              expression: String.raw`\exp(z)`,
              annotation: [
                "log 좌표에 지수함수를 적용해",
                "원래 크기의 parameter로 복원",
              ],
            },
          ]}
          terms={[
            {
              symbol: "a, b",
              name: "Positive bounds",
              description: "0보다 큰 lower·upper bound입니다.",
            },
            {
              symbol: "u",
              name: "Uniform position",
              description: "Log interval 안의 상대 위치입니다.",
            },
            {
              symbol: "z",
              name: "Log coordinate",
              description: "Sampling에 사용하는 log-space 값입니다.",
            },
            {
              symbol: String.raw`\lambda`,
              name: "Sampled parameter",
              description: "원래 단위로 복원된 configuration 값입니다.",
            },
          ]}
          assumptions={[
            "0<a<b입니다.",
            "Multiplicative scale이 domain에 자연스럽습니다.",
            "Framework의 endpoint·quantization semantics를 version과 함께 기록합니다.",
          ]}
          interpretation="a=1e-5, b=1e-1이면 1e-5~1e-4와 1e-2~1e-1은 log 길이가 같아 같은 25% 확률을 가집니다."
        />
      </section>

      <section id="conditional-space" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Parent 선택 뒤에만 의미 있는 child parameter를 엽니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Cartesian product는 모든 optimizer에 momentum·beta1·beta2를 동시에
            붙입니다. 그러면 사용되지 않는 값만 다른 duplicate configurations가
            생깁니다. Conditional space는 optimizer를 먼저 고르고 해당 branch의
            children만 생성해 한 configuration이 한 실행 의미를 갖게 합니다.
          </p>
        </div>
        <ExplainedFormula
          question="Branch와 memory limit을 모두 만족하는 후보 집합은 어떻게 만드나요?"
          idea={
            <p>
              전체 configuration 중 parent-child 의미가 맞고 estimated
              resource가 hard bound 이하인 후보만 feasible set에 남깁니다.
            </p>
          }
          formula={String.raw`\Lambda_{\rm feasible}=\{\lambda\in\Lambda:c_{\rm branch}(\lambda)=1,\ \widehat m(\lambda)\le M_{\max}\}`}
          annotatedFormula={String.raw`\begin{aligned}b_\lambda&=\underbrace{\mathbf1[c_\lambda=1]}_{\text{branch 의미 통과}}\\r_\lambda&=\underbrace{\mathbf1[\widehat m_\lambda\le M_{\max}]}_{\text{memory 한도 통과}}\\q_\lambda&=\underbrace{b_\lambda r_\lambda}_{\text{두 gate를 AND로 결합}}\\\Lambda_F&=\underbrace{\{\lambda:q_\lambda=1\}}_{\text{실행 가능한 후보 집합}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\mathbf1[c_{\rm branch}(\lambda)=1]`,
              annotation: [
                "configuration의 branch 의미를 검사해",
                "유효하면 binary gate 1 생성",
              ],
            },
            {
              expression: String.raw`\mathbf1[\widehat m(\lambda)\le M_{\max}]`,
              annotation: [
                "resource estimate를 hard limit과 비교해",
                "실행 가능 gate 생성",
              ],
            },
            {
              expression: String.raw`b(\lambda)r(\lambda)`,
              annotation: [
                "두 binary gates를 곱해",
                "모든 조건을 통과한 경우만 1 유지",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`c_{\rm branch}`,
              name: "Branch rule",
              description: "Parent-child parameter 조합의 의미 유효성입니다.",
            },
            {
              symbol: String.raw`\widehat m`,
              name: "Resource estimate",
              description: "Configuration의 예상 peak memory입니다.",
            },
            {
              symbol: String.raw`M_{\max}`,
              name: "Hard memory limit",
              description: "Headroom을 포함해 미리 정한 허용 상한입니다.",
            },
            {
              symbol: String.raw`\Lambda_{\rm feasible}`,
              name: "Feasible space",
              description: "모든 hard gates를 통과한 후보 집합입니다.",
            },
          ]}
          assumptions={[
            "Estimator와 실제 peak 사이 오차를 위한 headroom이 있습니다.",
            "Hard constraint와 선호 objective를 구분합니다.",
            "Constraint revision을 study history에 기록합니다.",
          ]}
          interpretation="예상 22GB인 후보에 20GB 상한을 적용하면 제안 전에 제외합니다. 예상 18GB였지만 실제 OOM이면 그 attempt는 FAIL evidence입니다."
        />
      </section>

      <section id="versioning" className="scroll-mt-20">
        <h2 className="mb-4 text-2xl font-bold">
          경계값이 반복 선택돼도 같은 study를 조용히 넓히지 않습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Upper bound가 반복해서 선택되면 더 큰 값이 좋다는 신호일 수도 있고,
            다른 축·budget·regularization이 잘못됐다는 신호일 수도 있습니다.
            Pilot evidence와 failure distribution을 확인하고 search-space
            revision을 올린 새 study에서 확장합니다. 그래야 이전 sampler
            history가 어느 확률 모델에서 만들어졌는지 남습니다.
          </p>
        </div>
        <div id="paper-optuna-space" className="scroll-mt-24">
          <CitationBlock
            source="Optuna define-by-run search spaces"
            citeKey={1}
            href="https://arxiv.org/abs/1907.10902"
          >
            <strong>문제:</strong> static configuration으로 conditional space를
            표현하기 어려움. <strong>기여:</strong> 실행 코드에서 parameter
            branches를 구성하는 define-by-run interface. <strong>전제:</strong>{" "}
            논문의 Optuna architecture. <strong>근거 범위:</strong> conditional
            space와 pruning integration. <strong>과장 금지:</strong> 자유로운
            API가 자동으로 좋은 bounds나 valid constraints를 설계해 주지는
            않습니다.
          </CitationBlock>
        </div>
      </section>
    </div>
  );
}
