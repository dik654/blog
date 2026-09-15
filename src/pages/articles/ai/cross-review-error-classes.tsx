import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import ReviewRoundsViz from "./cross-review-error-classes/viz/ReviewRoundsViz";
import ClaimTraceViz from "./cross-review-error-classes/viz/ClaimTraceViz";

/**
 * 검증이 잡아낸 것은 지식이 아니라 비교의 모양이었습니다
 *
 * 조사 결과물 하나를 외부 모델에 세 라운드 검증시킨 기록에서, 반복해서 나온
 * 오류의 형태를 추린다. 유형 셋과 고치는 과정에서 새 오류가 생기는 구조까지가
 * 범위다. 모델 비교가 아니고 표본도 하나다.
 */
export default function CrossReviewErrorClassesArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          틀린 자리가 한 종류에 몰려 있었습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            조사 결과물 하나를 다른 회사의 모델에 넘겨 틀린 것만 찾게 했습니다.
            세 라운드를 돌려 마흔아홉 건을 고쳤습니다.
          </p>

          <p className="leading-7">
            흥미로운 것은 건수가 아니라 분포였습니다. 몰라서 틀린 것은 거의
            없었습니다. 출처를 잘못 읽은 몇 건을 빼면, 대부분은 아는 것을 잘못된
            모양으로 견준 것이었습니다.
          </p>

          <p className="leading-7">
            그리고 한 번으로 끝나지 않았습니다. 고친 원고에서 또 나왔고, 세
            번째에는 고치는 과정에서 새로 들어간 것만 여덟 건이 나왔습니다.
          </p>
        </div>

        <ReviewRoundsViz />

        <ContentBoundary article="cross-review-error-classes" />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            이 글이 푸는 질문은 하나입니다.{" "}
            <strong>
              무엇이 반복해서 틀리고, 왜 한 번 고쳐서 끝나지 않는가
            </strong>
            입니다.
          </p>

          <p className="leading-7">
            순서는 가장 많이 나온 유형 셋을 차례로 보고, 그다음 고치는 과정에서
            새 오류가 생기는 구조를 봅니다.
          </p>

          <p className="leading-7">
            모델 비교가 아닙니다. 어느 쪽이 더 낫다는 말을 할 수 있는 설계가
            아니고, 검증한 쪽도 세 건을 스스로 철회했습니다. 표본도 결과물
            하나뿐입니다.
          </p>
        </div>
      </section>

      <section id="unit-mismatch" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          유형 1. 두 숫자를 다른 자로 재고 나란히 놓습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            가장 많았고 가장 먼저 지적된 유형입니다. 양쪽 다 맞게 계산했는데
            같은 자로 재지 않은 채 견줍니다.
          </p>

          <p className="leading-7">
            한 표에서는 한쪽만 가동률로 나누고 다른 쪽은 정가를 그대로 두었습니다.
            차이가 8퍼센트로 보였는데 같은 자로 나누면 81퍼센트였습니다.
          </p>

          <p className="leading-7">
            다른 자리에서는 출력 토큰 기준 원가를 입력과 출력의 단가가 다른
            가격표와 직접 견주었습니다. 세는 대상이 달라서 뺄 수 없는 두 값입니다.
          </p>

          <p className="leading-7">
            또 다른 자리에서는 분모에 팔 수 없는 예비 용량이 들어 있었고, 원가
            식에서는 임대료와 상각이 같은 줄에 더해져 같은 자원이 두 번
            세어졌습니다.
          </p>

          <p className="leading-7">
            이 유형이 위험한 이유는 결과가 그럴듯해 보인다는 데 있습니다. 숫자가
            나오고 단위가 붙어 있으며 계산도 맞습니다. 틀린 것은 두 값을 같은
            자리에 놓아도 된다는 전제뿐입니다.
          </p>

          <p className="leading-7">
            잡는 방법은 값이 아니라 분모를 소리 내어 읽는 것입니다. 무엇을 무엇
            으로 나눈 값인지 두 쪽 모두 말할 수 있어야 하고, 두 문장이 같은
            모양이어야 합니다.
          </p>
        </div>

        <TermBreakdown
          title="같은 자인지 확인하는 세 질문"
          description="값이 맞는지가 아니라 견줄 수 있는 모양인지를 먼저 봅니다."
          items={[
            {
              term: "분모가 같은가",
              description:
                "두 값이 각각 무엇으로 나뉜 것인지를 말로 풀어 봅니다.",
              example:
                "한쪽은 실제로 쓴 시간으로 나눈 값이고 다른 쪽은 나누지 않은 정가였습니다.",
              boundary:
                "단위 기호가 같다고 분모가 같은 것은 아닙니다. 둘 다 시간당 금액이지만 한쪽만 가동률이 들어 있었습니다.",
            },
            {
              term: "세는 대상이 같은가",
              description:
                "같은 이름의 단위가 서로 다른 것을 셀 수 있습니다.",
              example:
                "한쪽의 토큰은 출력만이고 다른 쪽의 토큰은 입력과 캐시가 섞인 것이었습니다.",
              boundary:
                "이 경우는 자를 맞추는 것으로 끝나지 않습니다. 비교 자체를 다른 단위로 다시 정의해야 합니다.",
            },
            {
              term: "같은 것을 두 번 세지 않는가",
              description:
                "여러 항목을 더할 때 같은 자원이 두 줄에 들어갈 수 있습니다.",
              example:
                "임대료를 내는 장비의 상각을 따로 더하면 같은 하드웨어를 두 번 세게 됩니다.",
              boundary:
                "소유와 임대를 섞어 쓰는 구성에서는 항목별로 어느 쪽인지 표시해 두어야 합니다.",
            },
          ]}
        />
      </section>

      <section id="guarantee" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          유형 2. 보장이 아닌 것을 보장으로 적습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            두 번째 유형은 어떤 장치가 대개 그렇게 동작한다는 사실을 언제나
            그렇다는 문장으로 옮기는 것입니다.
          </p>

          <p className="leading-7">
            한 자리에서는 메시지 파이프라인의 중복 제거로 과금이 정확해진다고
            적었습니다. 그 중복 제거는 배경 병합에 기대는 것이라 보장이 아닙니다.
            돈을 다루는 줄에 쓸 수 없습니다.
          </p>

          <p className="leading-7">
            다른 자리에서는 두 지역에 저장소를 나누면 이중화된다고 적었습니다.
            과반이 필요한 저장소는 두 곳에 나누면 한쪽 상실만 견딥니다.
          </p>

          <p className="leading-7">
            또 다른 자리에서는 상위 등급 요청을 절대 거절하지 않는다고
            적었습니다. 실제로 지킬 수 있는 것은 요청 크기와 몰림 정도와 장애
            조건이 붙은 목표값뿐입니다.
          </p>

          <p className="leading-7">
            이 유형은 자신이 만든 장치를 설명할 때보다 남이 만든 장치를 쓸 때 더
            자주 나옵니다. 문서에 적힌 기능 이름을 그 기능의 보장 범위로 읽기
            때문입니다.
          </p>

          <p className="leading-7">
            잡는 방법은 문장을 부정형으로 뒤집어 보는 것입니다. 이것이 깨지는
            조건을 하나도 댈 수 없다면 보장이거나, 아직 그 조건을 모르는
            것입니다. 대개 뒤쪽입니다.
          </p>
        </div>

        <AlgorithmBlock
          title="보장인지 대개 그런 것인지 가르는 절차"
          input={[
            "쓰려는 장치의 문서",
            "그 장치에 기대려는 문장",
            "그 문장이 깨졌을 때의 손해",
          ]}
          steps={[
            {
              code: "문장을 부정형으로 뒤집어 깨지는 조건을 적어 본다",
              note: "하나도 못 대면 아직 모르는 것으로 둡니다. 보장으로 확정하지 않습니다.",
            },
            {
              code: "문서에서 그 조건이 명시적으로 배제됐는지 찾는다",
              note: "기능 이름이 아니라 보장 범위를 적은 문장을 찾습니다. 없으면 없는 것입니다.",
            },
            {
              code: "기본값이 켜져 있는지, 어디에 상태가 있는지 확인한다",
              note: "기본으로 꺼져 있거나 메모리에만 상태가 있는 기능이 흔합니다.",
            },
            {
              code: "if 깨졌을 때 돈이나 정합성이 걸린다: 별도 장치로 다시 받는다",
              note: "대개 그런 것 위에 돈을 올리지 않습니다. 분석용 경로와 정산 경로를 나눕니다.",
            },
            {
              code: "문장에 조건을 붙여 다시 쓴다",
              note: "절대라는 말 대신 어떤 조건에서 어느 수준까지인지를 적습니다.",
            },
          ]}
          output="조건이 붙은 문장과, 조건이 깨졌을 때 받는 별도 장치"
        />
      </section>

      <section id="overgeneralization" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          유형 3. 한 사례를 보편 규칙으로 올립니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            세 번째 유형은 한 조건에서 나온 숫자나 순서를 조건 없이 적는
            것입니다. 가장 오래 살아남는 유형이기도 합니다.
          </p>

          <p className="leading-7">
            한 자리에서는 특정 가동률 아래면 임대가 늘 싸다는 임계값이
            있었습니다. 그 값은 계약마다 다릅니다. 기동 시간과 최소 청구만 넣어도
            움직입니다.
          </p>

          <p className="leading-7">
            다른 자리에서는 하루 몇 토큰 미만이면 외부 API가 싸다는 임계값이
            있었습니다. 이건 앞의 단위 문제까지 겹쳐 있어 두 번 틀린 것이었습니다.
          </p>

          <p className="leading-7">
            또 다른 자리에서는 자체 용량, 그다음 탄력 임대, 그다음 외부라는
            순서가 있었습니다. 비용 항목을 분류한 것에서 그 순서가 도출되지는
            않습니다. 대개 그렇게 나온다는 관찰일 뿐입니다.
          </p>

          <p className="leading-7">
            이 유형이 오래 사는 이유는 고쳐도 한 겹씩만 벗겨지기 때문입니다. 표를
            맞추면 그 위의 임계값이 남고, 임계값을 지우면 그 아래 순서가
            남습니다.
          </p>
        </div>

        <ClaimTraceViz />

        <ProgressiveDetail
          title="관찰을 규칙으로 올리지 않고 쓰는 법"
          preview="조건을 붙여 남기면 판단의 출발점으로 쓸 수 있고, 조건을 지우면 쓸 수 없습니다."
        >
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p className="leading-7">
              관찰을 버리라는 뜻은 아닙니다. 대개 그렇게 나온다는 것은 쓸모
              있는 정보이고, 처음 판단할 때 어디서부터 볼지를 정해 줍니다.
            </p>

            <p className="leading-7">
              문제는 그것을 조건 없이 적었을 때입니다. 조건이 붙어 있으면 읽는
              쪽이 자기 조건과 견줘 볼 수 있지만, 지워져 있으면 그대로 적용하게
              됩니다.
            </p>

            <p className="leading-7">
              그래서 쓰는 방법은 둘입니다. 어떤 조건에서 나온 관찰인지 함께
              적거나, 규칙 대신 그 규칙을 만들어 낸 계산을 적는 것입니다. 뒤쪽이
              더 낫습니다. 읽는 쪽이 자기 숫자를 넣어 볼 수 있기 때문입니다.
            </p>

            <p className="leading-7">
              이 시리즈의 앞 글들이 임계값 대신 식을 실은 이유가 그것입니다.
              손익분기 가동률은 계약마다 다르지만 그 값을 내는 식은 같습니다.
            </p>
          </div>
        </ProgressiveDetail>
      </section>

      <section id="repeated-fix" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          유형을 다 알아도 고치는 과정에서 새로 생깁니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            세 번째 라운드는 질문을 바꿔서 개정판에 새로 생긴 오류만 찾게
            했습니다. 여덟 건이 나왔습니다.
          </p>

          <p className="leading-7">
            성격이 앞의 둘과 다릅니다. 하나는 앞 지적을 반영하려고 새로 쓴
            문장에서 나왔습니다. 대기 시간을 설명하다가 사실과 다른 문장을
            넣었습니다.
          </p>

          <p className="leading-7">
            다른 하나는 표를 다시 짜면서 지워졌습니다. 장애 영향 표를 세 열로
            고치는 과정에서 이미 출력 중인 요청이 끊긴다는 사실이 표에서
            사라졌습니다.
          </p>

          <p className="leading-7">
            또 하나는 자기 모순이었습니다. 한쪽에서 재시도 경계를 새로 정의했는
            데 다른 쪽에 남아 있던 서술이 그 경계와 충돌했습니다.
          </p>

          <p className="leading-7">
            그래서 검증을 한 번 돌리고 끝내면 안 됩니다. 고친 원고는 새 원고이고,
            새 원고는 검증되지 않은 원고입니다.
          </p>

          <p className="leading-7">
            그리고 이 글을 쓰는 동안 같은 일이 한 번 더 있었습니다. 이 시리즈의
            첫 글을 낸 뒤 그 글에서 빠진 한계 두 가지를 찾아 뒤에 덧붙였습니다.
            유형을 알고 쓴 글에서도 나왔습니다.
          </p>
        </div>

        <ExplainedFormula
          question="라운드를 몇 번 돌려야 하고, 지금 몇 건이 남아 있습니까?"
          idea="라운드마다 잡히는 수가 일정한 비율로 줄어든다고 두면 남은 합을 등비급수로 어림할 수 있습니다. 잡히는 수가 줄었다는 것은 남은 수가 0이 되었다는 뜻이 아니라 줄어드는 속도를 알게 되었다는 뜻이고, 그 속도로부터 아직 남은 양을 세어 볼 수 있습니다."
          formula={String.raw`r = \sqrt{\frac{n_3}{n_1}}, \qquad R = n_3 \cdot \frac{r}{1-r}`}
          annotatedFormula={String.raw`\underbrace{r = \sqrt{\frac{n_3}{n_1}}}_{\text{라운드당 감쇠비}}, \qquad \underbrace{R = n_3 \cdot \frac{r}{1-r}}_{\text{앞으로 나올 합의 어림}}`}
          operations={[
            {
              expression: String.raw`\sqrt{\frac{n_3}{n_1}}`,
              annotation: [
                "첫 라운드와 세 번째 라운드 사이에 두 번 줄었으므로 비율의 제곱근이 한 라운드당 감쇠비입니다.",
                "두 번의 비가 각각 다르면 이 값은 그 둘의 기하평균이 됩니다. 라운드가 셋뿐이라 표본으로는 매우 적습니다.",
              ],
            },
            {
              expression: String.raw`n_3 \cdot \frac{r}{1-r}`,
              annotation: [
                "다음 라운드부터의 기대값을 전부 더한 등비급수의 합입니다.",
                "감쇠비가 1에 가까울수록 이 값이 급격히 커집니다. 잡히는 수가 천천히 줄고 있다면 남은 양이 매우 많다는 뜻입니다.",
              ],
            },
            {
              expression: String.raw`n_1, n_3`,
              annotation: [
                "각 라운드에서 실제로 돌아온 지적 수입니다.",
                "세 번째는 새로 생긴 것만 찾게 한 것이라 앞의 둘과 세는 대상이 다릅니다. 이 식에 넣는 순간 이 글이 유형 1로 든 단위 혼동을 저지르게 됩니다.",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`n_k`,
              name: "k번째 라운드의 지적 수",
              description:
                "그 라운드에서 실제로 돌아온 건수이며, 철회된 것은 빼야 합니다.",
            },
            {
              symbol: String.raw`r`,
              name: "라운드당 감쇠비",
              description:
                "한 라운드를 더 돌릴 때 잡히는 수가 몇 배가 되는지이며, 1에 가까울수록 끝이 멉니다.",
            },
            {
              symbol: String.raw`R`,
              name: "앞으로 나올 합의 어림",
              description:
                "지금 상태로 라운드를 무한히 돌렸을 때 더 나올 지적의 총수입니다.",
            },
          ]}
          assumptions={[
            "라운드마다 같은 비율로 줄어든다고 둡니다. 실제로는 질문을 바꾸면 잡히는 대상이 바뀌므로 이 가정이 가장 약합니다.",
            "각 라운드의 지적이 같은 모집단에서 나온다고 둡니다. 세 번째 라운드는 새로 생긴 것만 찾게 한 것이라 이 전제가 깨집니다.",
            "검증하는 쪽이 라운드마다 같은 능력을 유지한다고 둡니다. 같은 원고를 반복해 보면 놓치는 것이 늘어날 수 있습니다.",
          ]}
          interpretation="첫 라운드 25건, 두 번째 16건, 세 번째 8건이었습니다. 25에서 8로 두 번 줄었으므로 감쇠비는 8을 25로 나눈 값의 제곱근인 약 0.57입니다. 남은 합은 8 곱하기 0.57 나누기 0.43으로 약 10건입니다. 여기서 읽어야 할 것은 세 라운드에 마흔아홉 건을 고쳤는데도 남은 어림이 마지막 라운드 한 번 분량보다 많다는 점입니다. 잡히는 수가 줄었다는 사실 자체는 끝났다는 신호가 아닙니다. 읽으면 안 되는 것은 이 10이라는 값입니다. 세 번째 라운드는 새로 생긴 오류만 찾게 한 것이라 앞의 둘과 세는 대상이 다르고, 그래서 이 계산은 이 글이 유형 1로 든 단위 혼동을 그대로 저지릅니다. 방향은 남지만 값은 남지 않습니다."
        />
      </section>

      <section id="boundary" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          이것은 모델 비교가 아니고 표본도 하나입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            세 유형을 합치면 이렇습니다. 두 숫자를 다른 자로 재고 나란히 놓는
            것, 보장이 아닌 것을 보장으로 적는 것, 한 사례를 조건 없이 올리는
            것입니다. 그리고 고치는 과정에서 새로 생깁니다.
          </p>

          <p className="leading-7">
            검증한 쪽도 틀렸다는 것을 적어 둡니다. 두 번째 라운드에서 앞서 낸
            지적 세 건을 스스로 철회했습니다. 하나는 반례로 든 사례가 실은 반례가
            아니었고, 하나는 남의 실험 결과를 잘못 귀속한 것이었습니다.
          </p>

          <p className="leading-7">
            그래서 이 기록에서 어느 쪽이 더 낫다는 말을 끌어낼 수 없습니다.
            한쪽이 쓰고 다른 쪽이 읽었을 뿐이고, 역할을 바꾸면 결과도 바뀔
            것입니다. 그것을 확인하는 설계는 하지 않았습니다.
          </p>

          <p className="leading-7">
            표본도 결과물 하나입니다. 유형 셋이 다른 종류의 글에서도 같은 비중
            으로 나올지는 이 기록으로 말할 수 없습니다. 다만 세 유형 모두 무엇을
            아느냐가 아니라 어떻게 견주느냐의 문제라는 점은 분야를 타지 않을
            것으로 보입니다.
          </p>

          <p className="leading-7">
            이 기록에서 나온 정정들이 실제로 어떻게 반영됐는지는 같은 소재를
            다룬 글들에 있습니다.{" "}
            <Link to="/cs/ai/own-vs-rent-inference-capacity#two-rentals">
              분모를 맞추는 일
            </Link>
            과{" "}
            <Link to="/cs/ai/inference-failure-absorption#saturation">
              포화를 장애로 신고하지 않는 일
            </Link>
            , 그리고{" "}
            <Link to="/cs/ai/inference-stack-standard-levels#three-levels">
              표준의 세 수준
            </Link>
            이 각각 위 유형 하나씩에 대응합니다.
          </p>
        </div>
      </section>
    </div>
  );
}
