import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import FailureLadderViz from "./inference-failure-absorption/viz/FailureLadderViz";
import FleetSizeViz from "./inference-failure-absorption/viz/FleetSizeViz";

/**
 * 같은 장애라도 요청이 어디까지 갔느냐에 따라 결과가 갈립니다
 *
 * 앞 글이 접힌 상세로만 넘긴 장애 흡수를 본문으로 펼친다. 계층별 시간 상수,
 * 요청 상태라는 둘째 축, 수용량을 readiness로 표현하면 안 되는 이유, 상태별
 * 권위 저장소까지가 범위다. 장애를 줄이는 하드웨어 이야기는 다루지 않는다.
 */
export default function InferenceFailureAbsorptionArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          장애는 예외가 아니라 빈도가 정해진 입력입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            가속기를 많이 쓰는 시스템에서 고장은 드문 일이 아닙니다. 공개된
            대규모 실측에서 한 곳은 16,384장을 54일 돌리는 동안 계획에 없던
            중단을 419번 겪었습니다. 평균 3.1시간에 한 번입니다.
          </p>

          <p className="leading-7">
            그런데도 그 시스템은 돌아갔습니다. 그러니 물어야 할 것은 고장을
            어떻게 없애느냐가 아닙니다. 고장이 났을 때 그 영향이 어디서
            멈추느냐입니다.
          </p>

          <p className="leading-7">
            그리고 여기에 축이 하나 더 있습니다. 같은 고장이라도 그때 그 요청이
            어디까지 갔느냐에 따라 결과가 다릅니다. 아래 그림이 두 축을 함께
            놓은 것입니다.
          </p>
        </div>

        <FailureLadderViz />

        <ContentBoundary article="inference-failure-absorption" />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            이 글이 푸는 질문은 하나입니다.{" "}
            <strong>
              무엇이 죽었을 때 그 요청은 어디까지 살아남는가
            </strong>
            입니다.
          </p>

          <p className="leading-7">
            순서는 계층마다 흡수에 걸리는 시간이 왜 다른지, 대수를 늘리면 무엇이
            좋아지고 무엇이 나빠지는지, 포화를 장애처럼 다루면 왜 연쇄로
            무너지는지, 그리고 상태마다 어디까지 버틸 수 있는지입니다.
          </p>

          <p className="leading-7">
            요청이 어느 길로 흘러가는지는 앞 글{" "}
            <Link to="/cs/ai/region-agnostic-inference-routing">
              리전과 모델 버전을 숨긴 요청 경로
            </Link>
            가 맡습니다. 이 글은 그 길 위의 무언가가 죽었을 때를 봅니다.
          </p>
        </div>
      </section>

      <section id="time-constants" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 1. 계층마다 흡수에 걸리는 시간이 자릿수로 다릅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            장애를 흡수한다는 말은 그 장애를 못 본 척한다는 뜻이 아닙니다.
            어느 계층이 알아차리고, 대신할 곳을 고르고, 거기로 보내기까지의
            시간이 있습니다.
          </p>

          <p className="leading-7">
            그 시간이 계층마다 자릿수로 다릅니다. 한 클러스터 안에서 파드를 다시
            고르는 것은 밀리초입니다. 리전 게이트웨이가 다른 클러스터로 넘기는
            것은 초입니다. 엣지가 리전을 바꾸는 것은 초에서 분이고, DNS로
            넘기면 전파 시간이 붙습니다.
          </p>

          <p className="leading-7">
            그보다 느린 층도 있습니다. 중앙에서 배치를 다시 계산해 파드를 옮기는
            데는 분이 걸리고, 새 클러스터를 띄우는 데는 시간이 걸립니다.
          </p>

          <p className="leading-7">
            이 차이가 설계를 정합니다. 어떤 장애를 어느 층이 맡을지는 그 층의
            시간 상수가 그 장애가 만드는 손해보다 짧은지로 정해집니다. 밀리초
            안에 대신할 수 있는 것을 분 단위 층에 맡기면 그 시간만큼 요청이
            떨어집니다.
          </p>

          <p className="leading-7">
            그래서 층마다 목표를 따로 적어 두어야 합니다. 하나의 가용성 숫자로
            묶으면 어느 층이 느려서 그 숫자가 깨졌는지 알 수 없습니다.
          </p>
        </div>

        <TermBreakdown
          title="어느 층이 얼마 안에 흡수하는가"
          description="빠른 층이 맡을 수 있는 장애를 느린 층에 미루면 그 차이만큼 요청이 떨어집니다."
          items={[
            {
              term: "파드 고르기 (밀리초)",
              description:
                "같은 클러스터 안에서 다른 파드로 보냅니다. 요청 경로 안에서 일어납니다.",
              example:
                "파드가 죽거나 준비 상태가 아니게 되면 다음 요청부터 그 파드가 후보에서 빠집니다.",
              boundary:
                "같은 클러스터에 대신할 파드가 있을 때만 됩니다. 클러스터 전체가 문제면 이 층은 할 수 있는 것이 없습니다.",
            },
            {
              term: "게이트웨이 fallback (초)",
              description:
                "리전 안의 다른 클러스터나 인접 리전, 또는 외부로 넘깁니다.",
              example:
                "클러스터로 가는 길이 끊기면 헬스체크가 알아차리고 다음 요청을 다른 곳으로 보냅니다.",
              boundary:
                "상주 제약이 걸린 요청은 넘길 곳이 없으면 넘기지 않습니다. 이때는 흡수하지 않고 명시적으로 실패시키는 것이 맞습니다.",
            },
            {
              term: "엣지 우회 (초~분)",
              description:
                "리전 자체를 바꿉니다. Anycast면 빠르고 DNS면 전파 시간이 붙습니다.",
              example:
                "리전 하나가 사라지면 가장 가까운 다른 리전으로 새 요청이 갑니다.",
              boundary:
                "DNS 방식은 느린 대신 새 연결만 옮기므로 진행 중인 스트림을 끊지 않습니다. 느린 것이 늘 나쁜 것은 아닙니다.",
            },
            {
              term: "재스케줄과 프로비저닝 (분~시간)",
              description:
                "중앙이 배치를 다시 계산해 파드를 옮기거나 새 클러스터를 띄웁니다.",
              example:
                "노드가 오래 돌아오지 않으면 그 위의 파드를 다른 노드로 옮기고, 용량이 모자라면 노드를 더 붙입니다.",
              boundary:
                "요청 경로 밖이라 이 층이 멈춰도 요청은 흐릅니다. 대신 이 층이 멈춘 것을 알아차릴 관측이 따로 필요합니다.",
            },
          ]}
        />
      </section>

      <section id="fleet-size" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 2. 대수를 늘리면 장애는 잦아지고 감당은 쉬워집니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            작게 시작하면 안전할 것 같습니다. 두 대면 고장 날 것도 두 대뿐이니
            사고가 드물 것입니다. 앞부분은 맞고 뒷부분이 틀립니다.
          </p>

          <p className="leading-7">
            고장이 서로 독립이라고 두면 플릿 전체의 장애 간격은 대수에 반비례해
            줄어듭니다. 대수를 여덟 배로 늘리면 장애도 여덟 배 자주 옵니다.
            여기까지는 직관과 같습니다.
          </p>

          <p className="leading-7">
            그런데 같은 대수가 반대 방향으로도 작용합니다. 한 대가 빠졌을 때
            남은 대가 받아야 하는 몫이 대수에 따라 줄어듭니다. 두 대면 남은 한
            대가 두 배를 받고, 예순네 대면 남은 예순셋이 1.6퍼센트만 더 받습니다.
          </p>

          <p className="leading-7">
            숫자로 보겠습니다. 각 대를 60퍼센트로 돌리다 한 대를 잃으면 두 대일
            때는 남은 한 대가 120퍼센트를 받아 넘칩니다. 여덟 대면 68.6퍼센트,
            예순네 대면 61퍼센트라 표가 거의 안 납니다.
          </p>

          <p className="leading-7">
            그래서 3.1시간에 한 번 고장 나는 시스템이 돌아갑니다. 잦아지는 쪽과
            가벼워지는 쪽이 같은 변수에 매여 있고, 규모가 커질수록 뒤쪽이
            이깁니다.
          </p>

          <p className="leading-7">
            여기서 나오는 운영 규칙이 하나 있습니다. 팔 수 있는 용량은 전체
            처리량이 아니라 <strong>한 대가 빠진 상태에서 지킬 수 있는 부하</strong>
            입니다. 두 대짜리 클러스터에서 그 값은 절반입니다.
          </p>
        </div>

        <ExplainedFormula
          question="대수를 늘리면 장애는 얼마나 잦아지고, 한 대를 잃었을 때 얼마나 버팁니까?"
          idea="고장이 서로 독립이라고 두면 플릿의 장애 간격은 한 대의 평균 무고장 시간을 대수로 나눈 값입니다. 같은 대수가 다른 쪽에도 들어가는데, 한 대를 잃었을 때 남는 비율이 대수가 커질수록 1에 가까워집니다. 그래서 대수는 장애를 잦게 만들면서 동시에 한 번의 장애를 가볍게 만듭니다."
          formula={String.raw`T_{\text{fleet}} = \frac{\mathrm{MTBF}}{N}, \qquad U_{\text{safe}} = \frac{N-1}{N}`}
          annotatedFormula={String.raw`\underbrace{T_{\text{fleet}} = \frac{\mathrm{MTBF}}{N}}_{\text{대수에 반비례해 잦아진다}}, \qquad \underbrace{U_{\text{safe}} = \frac{N-1}{N}}_{\text{대수에 따라 1에 가까워진다}}`}
          operations={[
            {
              expression: String.raw`T_{\text{fleet}} = \frac{\mathrm{MTBF}}{N}`,
              annotation: [
                "한 대의 평균 무고장 시간을 대수로 나눈 것이며, 어느 대든 하나가 죽기까지의 평균 간격입니다.",
                "고장이 서로 독립이라는 전제 위에서만 성립합니다. 스위치나 전원처럼 여러 대를 한꺼번에 묶는 공통 장애점이 있으면 실제 간격은 이보다 짧게, 그리고 한 번에 크게 옵니다.",
              ],
            },
            {
              expression: String.raw`U_{\text{safe}} = \frac{N-1}{N}`,
              annotation: [
                "한 대를 잃어도 남은 대들이 감당할 수 있는 전체 대비 가동률입니다.",
                "N이 2이면 0.5, 8이면 0.875, 64이면 0.984입니다. 이 값을 넘겨 돌리고 있으면 한 대를 잃는 순간 남은 대가 100퍼센트를 넘게 됩니다.",
              ],
            },
            {
              expression: String.raw`\frac{u\,N}{N-1}`,
              annotation: [
                "각 대를 u로 돌리다 한 대를 잃었을 때 남은 대가 받는 부하입니다.",
                "u가 0.6이면 N=2에서 1.2, N=8에서 0.686, N=64에서 0.610입니다. 이 값이 1을 넘으면 그 장애는 흡수되지 않고 남은 대까지 밀어 넘깁니다.",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`\mathrm{MTBF}`,
              name: "한 대의 평균 무고장 시간",
              description:
                "가속기 한 장이 평균 얼마나 돌다 죽는지이며, 세대와 냉각 방식에 따라 달라집니다.",
            },
            {
              symbol: String.raw`N`,
              name: "플릿의 대수",
              description:
                "같은 역할을 나눠 맡는 단위의 수이며, 노드로 셀지 가속기로 셀지는 무엇이 한꺼번에 빠지는가로 정합니다.",
            },
            {
              symbol: String.raw`u`,
              name: "평소 가동률",
              description:
                "한 대를 잃기 전 각 대가 실제로 쓰이고 있던 비율입니다.",
            },
          ]}
          assumptions={[
            "고장이 서로 독립이라고 둡니다. 실제로는 한 스위치 아래, 한 랙 안, 한 전원 계통에 묶인 대들이 함께 빠지므로 이 식은 낙관 쪽으로 치우칩니다.",
            "빠진 대의 몫이 남은 대들에 고르게 나뉜다고 둡니다. 특정 모델이 특정 노드에만 떠 있으면 그 모델의 부하는 나뉘지 않습니다.",
            "평균 무고장 시간이 대마다 같다고 둡니다. 실측에서는 일부 노드가 전체 격리의 절반 이상을 차지하는 쏠림이 관찰됩니다.",
          ]}
          interpretation="공개 실측에서 16,384장을 54일 돌려 계획에 없던 중단 419건이 나왔으므로 플릿 장애 간격은 1,296시간을 419로 나눈 3.09시간입니다. 여기서 한 장의 평균 무고장 시간을 역산하면 3.09 곱하기 16,384로 약 50,677시간, 5.8년입니다. 이 값을 고정하고 대수를 줄여 보면 예순네 대는 792시간이라 한 달에 한 번, 여덟 대는 6,335시간이라 아홉 달에 한 번, 두 대는 25,339시간이라 3년에 한 번입니다. 여기서 읽어야 할 것은 두 대짜리가 겪는 장애가 3년에 한 번인데도 위험하다는 점입니다. 안전 가동률이 50퍼센트뿐이라 60퍼센트로 돌리고 있었다면 그 한 번에 남은 한 대가 120퍼센트를 받습니다. 읽으면 안 되는 것은 이 역산값을 다른 하드웨어에 그대로 쓰는 것입니다. 같은 자료에서 다른 세대의 가속기는 대당 무고장 시간이 절반 수준으로 관찰됐고, 독립 가정 자체도 공통 장애점 앞에서는 성립하지 않습니다."
        />

        <FleetSizeViz />

        <CitationBlock
          source="Meta · The Llama 3 Herd of Models (arXiv:2407.21783) — 16,384 H100 학습 클러스터 54일 운영 기록"
          citeKey={1}
          href="https://arxiv.org/abs/2407.21783"
        >
          학습 중 신뢰성을 다룬 절에서 &ldquo;During a 54-day snapshot period of
          pre-training, we experienced a total of 466 job interruptions&rdquo;
          라고 적고, 그중 &ldquo;The remaining 419 were unexpected
          interruptions&rdquo;라고 분류합니다. 원인에 대해서는
          &ldquo;Approximately 78% of the unexpected interruptions are
          attributed to confirmed hardware issues, such as GPU or host component
          failures&rdquo;라고 적고, CPU 관련 중단은 두 건입니다. 이 글이 쓰는
          것은 기간과 건수, 그리고 거기서 역산한 대당 무고장 시간까지입니다.
          가속기 종류별 세부 비율은 이 글이 참고한 사내 정리본에 적혀 있으나
          원문 표와 숫자가 맞지 않아 싣지 않았습니다. 학습 클러스터의
          기록이라는 점도 짚어 둡니다. 추론에서는 복제본이 있어 장애가 곧 작업
          손실이 아니라 용량 손실이므로 같은 고장률이 같은 피해를 뜻하지
          않습니다.
        </CitationBlock>
      </section>

      <section id="saturation" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 3. 포화를 장애처럼 다루면 남은 것까지 무너집니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            여기서 실제로 자주 틀리는 것이 하나 있습니다. 파드가 지금 요청을 더
            받을 수 없을 때, 그 파드를 준비되지 않은 것으로 표시해 풀에서 빼는
            방식입니다.
          </p>

          <p className="leading-7">
            자연스러워 보입니다. 이미 있는 장치를 쓰는 것이고, 빠지면 요청이 안
            가니 그 파드는 숨을 돌립니다.
          </p>

          <p className="leading-7">
            그런데 빠진 파드의 몫이 남은 파드로 갑니다. 그 파드들도 이미 바빴으
            므로 차례로 같은 임계를 넘습니다. 하나씩 빠지다 전부 빠집니다.
            포화를 장애로 신고하면 포화가 진짜 장애가 됩니다.
          </p>

          <p className="leading-7">
            그래서 세 가지를 갈라야 합니다. 프로세스가 살아 있는가, 모델을 서빙할
            준비가 됐는가, 지금 요청을 더 받을 수 있는가. 앞의 둘은 파드를 넣고
            빼는 신호이고, 셋째는 파드를 빼는 신호가 아닙니다.
          </p>

          <p className="leading-7">
            셋째는 요청 단위로 처리합니다. 파드를 통째로 빼는 대신 우선순위가
            낮은 요청부터 거절합니다. 그러면 남은 용량이 어디로 갈지를 고를 수
            있게 됩니다.
          </p>

          <p className="leading-7">
            다만 이 거절 장치를 켰다고 끝이 아닙니다. 기본으로 꺼져 있는 구현이
            있고, 대기 큐가 메모리에만 있어 그 컴포넌트가 재시작하면 큐가
            사라집니다. 큐 한도와 수명, 그리고 그 컴포넌트가 죽었을 때의 동작을
            명시적으로 정해 두어야 합니다.
          </p>

          <p className="leading-7">
            같은 이유로 상위 등급에 &ldquo;절대 거절하지 않음&rdquo;을 약속하면
            안 됩니다. 실제로 지킬 수 있는 것은 요청 크기와 몰림 정도와 장애
            조건이 붙은 목표값입니다.
          </p>
        </div>

        <AlgorithmBlock
          title="파드가 바쁠 때 무엇을 하는가"
          input={[
            "파드가 내보내는 큐 깊이와 KV 사용률",
            "요청에 붙은 등급",
            "거절 장치의 큐 한도와 수명",
          ]}
          steps={[
            {
              code: "if 프로세스가 죽었다: 파드를 뺀다",
              note: "살아 있는지의 신호입니다. 여기서만 파드를 재시작합니다.",
            },
            {
              code: "if 모델이 아직 안 올라왔다: 파드를 넣지 않는다",
              note: "준비됐는지의 신호입니다. 가중치를 읽는 중이거나 컴파일 캐시를 붙이는 중이면 아직 넣지 않습니다.",
            },
            {
              code: "if 큐가 길거나 KV가 찼다: 파드는 그대로 두고 순위만 내린다",
              note: "수용량은 파드를 빼는 신호가 아닙니다. 빼면 그 몫이 남은 파드로 가서 연쇄가 시작됩니다.",
            },
            {
              code: "전체가 포화면 낮은 등급 요청부터 거절한다",
              note: "요청 단위로 처리해야 남은 용량을 어디에 쓸지 고를 수 있습니다.",
            },
            {
              code: "거절 장치의 큐 한도·수명·장애 시 동작을 확인한다",
              note: "기본으로 꺼져 있을 수 있고 큐가 메모리에만 있을 수 있습니다. 과부하·재시작·노드 장애 시나리오로 실제로 돌려 봐야 합니다.",
            },
          ]}
          output="파드 집합은 유지한 채 거절된 요청 목록과 남은 용량의 배분"
        />

        <ProgressiveDetail
          title="이 절은 초판 보고서가 반대로 적었던 곳입니다"
          preview="처음에는 준비 상태에 사용률을 반영해 자연스럽게 흘려보내라고 적혀 있었고, 교차 검증에서 뒤집혔습니다."
        >
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p className="leading-7">
              이 글이 근거로 삼은 조사의 초판에는 &ldquo;준비 상태에 KV 사용률과
              큐 깊이를 반영해 서비스 레벨에서 자연스럽게 흘려보내라&rdquo;고
              적혀 있었습니다. 위 본문과 정반대입니다.
            </p>

            <p className="leading-7">
              교차 검증에서 이 서술이 연쇄 붕괴를 부른다는 지적이 나왔고,
              정리본에서는 &ldquo;수용량을 준비 상태로 표현하지 않는다&rdquo;로
              바뀌었습니다. 같은 지적에서 상위 등급의 절대 무거절 약속도
              조건부 목표값으로 내려갔습니다.
            </p>

            <p className="leading-7">
              이 글은 정정된 쪽을 따릅니다. 다만 초판이 틀렸다는 것 자체가
              읽을거리입니다. 이미 있는 장치를 재사용하는 쪽이 늘 그럴듯해
              보이고, 그 그럴듯함이 어디서 깨지는지는 부하가 실제로 몰려야
              드러납니다.
            </p>

            <p className="leading-7">
              그래서 이 경로는 문서로 정하는 것으로 끝나지 않습니다. 복제본
              하나를 죽이고, 지연을 주입하고, KV를 일부러 채워 보는 식으로
              거절과 흘려보내기가 실제로 작동하는지 주기적으로 확인해야 합니다.
            </p>
          </div>
        </ProgressiveDetail>
      </section>

      <section id="state-authority" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 4. 상태마다 버틸 수 있는 방식이 다릅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            중앙이 죽어도 마지막 설정으로 계속 돈다는 말은 모든 상태에
            적용되지 않습니다. 어떤 상태는 낡은 값으로 버텨도 되고, 어떤
            상태는 낡은 값으로 버티면 손해가 쌓입니다.
          </p>

          <p className="leading-7">
            배치와 라우팅 가중치는 앞쪽입니다. 낡은 배치로 도는 동안 최적은
            아니지만 요청은 처리됩니다. 모델 가중치도 같습니다. 미리 모든 리전에
            복제해 두므로 중앙이 없어도 이미 있습니다.
          </p>

          <p className="leading-7">
            KV 캐시는 또 다릅니다. 리전 로컬이고 잃어도 됩니다. 잃으면 다시
            계산하면 되고, 리전 사이로 옮기려 들면 옮기는 비용이 다시 계산하는
            비용보다 큽니다.
          </p>

          <p className="leading-7">
            잔액과 한도는 뒤쪽입니다. 낡은 값으로 계속 받으면 쓴 만큼 못 받게
            됩니다. 그래서 여기는 열어 두는 쪽이 아니라 닫는 쪽으로 기울여야
            합니다.
          </p>

          <p className="leading-7">
            그러면 글로벌 원장을 요청 경로에 넣어야 할 것 같지만 그러면 리전 간
            쓰기 지연이 모든 요청에 붙습니다. 대신 리전마다 미리 배정해 두고 그
            안에서만 차감하면, 단절 중에도 합계가 잔액을 넘지 않습니다.
          </p>
        </div>

        <TermBreakdown
          title="상태별 권위와 단절 시 동작"
          description="같은 시스템 안에서도 상태마다 기울여야 하는 방향이 다릅니다."
          items={[
            {
              term: "배치와 라우팅 가중치",
              description:
                "중앙이 계산해 밀어 넣고, 각 클러스터와 라우터가 사본을 갖습니다.",
              example:
                "중앙이 죽으면 마지막 스냅샷으로 계속 돌고 갱신만 멈춥니다.",
              boundary:
                "열어 두는 쪽입니다. 대신 갱신이 멈춘 것을 알아차릴 관측이 없으면 낡은 배치로 오래 도는 것을 모릅니다.",
            },
            {
              term: "모델 가중치",
              description:
                "미리 모든 리전에 복제해 두고 노드에 내려놓습니다.",
              example:
                "새 레플리카를 띄울 때 중앙 저장소를 다시 받지 않고 리전 안에서 가져옵니다.",
              boundary:
                "복제를 안 해 두면 콜드 상태에서 큰 모델 하나를 올리는 데 분 단위가 걸려 오토스케일이 의미를 잃습니다.",
            },
            {
              term: "KV 캐시",
              description:
                "리전 로컬이고 잃는 것을 전제로 둡니다.",
              example:
                "파드가 죽으면 그 안의 진행 중 상태는 복원되지 않고 다시 계산합니다.",
              boundary:
                "리전 사이로 옮기려 들면 옮기는 값이 다시 계산하는 값보다 커집니다. 리전 간에는 캐시가 아니라 같은 대화를 같은 곳으로 보내는 것으로 다룹니다.",
            },
            {
              term: "잔액과 한도",
              description:
                "트랜잭션이 되는 원장이 권위이고, 리전마다 배정액을 미리 받습니다.",
              example:
                "단절 중에는 자기 리전 배정액 안에서만 차감하고, 소진되면 차단합니다.",
              boundary:
                "닫는 쪽입니다. 배정 합계가 잔액을 넘지 않으므로 단절 중에도 초과 지출이 생기지 않는 대신, 다른 리전의 배정액을 당장 쓰지 못합니다.",
            },
          ]}
        />

        <ProgressiveDetail
          title="두 곳에 나눠 두면 한쪽만 견딥니다"
          preview="합의 저장소를 두 사이트에 나누면 양쪽 각각의 상실을 모두 견디는 배치는 만들 수 없습니다."
        >
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p className="leading-7">
              중앙 상태를 합의로 지키는 저장소는 과반이 살아 있어야 씁니다. 두
              사이트에 나누면 어느 쪽이든 한 사이트에 과반이 몰립니다.
            </p>

            <p className="leading-7">
              그러면 과반이 없는 쪽이 사라지는 경우는 견디지만, 과반이 있는 쪽이
              사라지면 쓰기가 멈춥니다. 두 리전을 두었다고 두 리전 장애를 모두
              견디게 되지는 않습니다.
            </p>

            <p className="leading-7">
              해결은 둘입니다. 세 번째 사이트를 두어 과반이 한쪽에 몰리지 않게
              하거나, 독립된 중앙 둘을 두고 둘이 동시에 지시하지 않도록 승격과
              복구 규칙을 따로 쓰는 것입니다.
            </p>

            <p className="leading-7">
              규모가 작을 때는 세 번째 사이트를 두는 것보다 중앙 자체를 가볍게
              만드는 편이 정당화되기 쉽습니다. 이 판단은 클러스터 수와 운영
              인력에 달려 있어 일반해가 없습니다.
            </p>
          </div>
        </ProgressiveDetail>
      </section>

      <section id="boundary" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          흡수까지가 이 글이고, 줄이는 일은 다른 글입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            네 부품을 합치면 이렇습니다. 계층마다 흡수 시간이 자릿수로 다르고,
            대수는 장애를 잦게 만들면서 동시에 가볍게 만들며, 포화는 장애가
            아니라 요청 단위로 다뤄야 하고, 상태마다 기울일 방향이 다릅니다.
          </p>

          <p className="leading-7">
            그리고 두 축 가운데 하나는 어느 계층도 어쩌지 못합니다. 이미 출력이
            나간 요청입니다. 앞 글의 표현으로는 첫 청크가 나가면 되돌릴 수
            없습니다. 장애 설계로 줄일 수 있는 것은 그 상태에 있는 요청의
            <strong> 수</strong>이지 그 요청들의 결과가 아닙니다.
          </p>

          <p className="leading-7">
            그래서 배포와 종료도 같은 문제로 묶입니다. 새 요청을 먼저 막고
            진행 중인 것이 끝나기를 기다린 뒤 내리면, 계획된 종료는 출력 중
            요청을 만들지 않습니다. 계획되지 않은 종료만 남습니다.
          </p>

          <p className="leading-7">
            다루지 않은 것을 밝혀 둡니다. 고장 자체를 줄이는 하드웨어와 시설
            이야기, 그리고 장애가 난 노드를 진단해 되돌릴지 교체할지 정하는
            절차는 이 글의 범위 밖입니다. 다만 하나는 적어 둡니다. 특정 오류
            코드만으로 교체를 판정하지 않습니다. 격리한 뒤 진단하고, 되돌려
            보고, 통과하면 복귀시킵니다.
          </p>

          <p className="leading-7">
            요청이 어느 길로 흐르는지는{" "}
            <Link to="/cs/ai/region-agnostic-inference-routing#commit-point">
              앞 글
            </Link>
            이, 한 클러스터 안에서 파드와 GPU를 다루는 일은{" "}
            <Link to="/cs/ai/onprem-k8s-inference-platform">
              온프레미스 추론 인프라
            </Link>
            가 맡습니다.
          </p>
        </div>
      </section>
    </div>
  );
}
