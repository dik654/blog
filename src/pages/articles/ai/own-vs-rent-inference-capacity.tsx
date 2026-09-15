import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import CostCurveViz from "./own-vs-rent-inference-capacity/viz/CostCurveViz";
import DenominatorViz from "./own-vs-rent-inference-capacity/viz/DenominatorViz";

/**
 * 무엇이 싼지 묻기 전에 분모를 맞춰야 합니다
 *
 * 소유와 임대의 손익분기를 다루되, 결론보다 비교의 단위를 먼저 세운다.
 * 임대 두 종류의 구분, 분모에서 빼야 할 예비 용량, 토큰 원가와 API 가격의
 * 단위 불일치, 그리고 결론을 실제로 움직이는 변수까지가 범위다.
 */
export default function OwnVsRentInferenceCapacityArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          같은 표를 다른 자로 읽으면 결론이 뒤집힙니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            추론 용량을 사야 할지 빌려야 할지는 표 하나로 정리되는 것처럼
            보입니다. 월 비용을 적고 시간당으로 환산해 견주면 됩니다.
          </p>

          <p className="leading-7">
            그런데 그 환산에서 자주 틀립니다. 한쪽만 가동률로 나누고 다른 쪽은
            정가 그대로 두면 두 숫자가 가까워 보이고, 거기서 나온 결론이
            뒤집힙니다.
          </p>

          <p className="leading-7">
            그래서 무엇이 싼지를 묻기 전에 무엇과 무엇을 같은 자에 올릴지부터
            정해야 합니다. 아래 그림이 그 자를 맞추기 전과 후입니다.
          </p>
        </div>

        <CostCurveViz />

        <ContentBoundary article="own-vs-rent-inference-capacity" />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            이 글이 푸는 질문은 하나입니다.{" "}
            <strong>
              소유와 임대를 견주려면 무엇과 무엇을 같은 자에 올려야 하는가
            </strong>
            입니다.
          </p>

          <p className="leading-7">
            순서는 임대 두 종류를 가르고, 분모에서 팔 수 없는 용량을 빼고,
            토큰당 원가와 API 가격이 왜 같은 자가 아닌지 보고, 마지막으로
            결론을 실제로 움직이는 변수가 무엇인지 봅니다.
          </p>

          <p className="leading-7">
            숫자는 특정 시점의 공개 시세를 쓴 예시입니다. 시세는 주 단위로
            움직이므로 여기서 가져갈 것은 값이 아니라 자를 맞추는 방법입니다.
          </p>
        </div>
      </section>

      <section id="two-rentals" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 1. 임대 두 종류 가운데 하나만 가동률에 나뉩니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            임대라고 부르는 것에 성격이 다른 둘이 섞여 있습니다. 월 단위로 잡아
            두는 것과 필요할 때만 확보하는 것입니다.
          </p>

          <p className="leading-7">
            월 단위로 잡아 두면 쉬는 시간도 청구됩니다. 그러면 소유와 똑같은
            일이 벌어집니다. 절반만 쓰면 쓴 만큼의 단가가 두 배가 됩니다.
          </p>

          <p className="leading-7">
            필요할 때만 확보하면 쉬는 시간이 청구되지 않습니다. 이쪽만 가동률과
            무관하게 시간당 단가가 그대로입니다.
          </p>

          <p className="leading-7">
            이 구분을 빠뜨리면 어떻게 되는지 숫자로 보겠습니다. 소유를 60퍼센트
            가동으로 환산하면 시간당 4.24달러이고 임대 정가는 4.60달러입니다.
            나란히 놓으면 차이가 8퍼센트라 대수롭지 않아 보입니다.
          </p>

          <p className="leading-7">
            그런데 월 단위로 잡아 둔 임대를 같은 60퍼센트로 나누면 7.67달러
            입니다. <strong>차이가 8퍼센트가 아니라 81퍼센트입니다.</strong>{" "}
            앞의 비교는 소유만 가동률로 나누고 임대는 정가를 그대로 둔 것이라
            성립하지 않습니다.
          </p>

          <p className="leading-7">
            자를 맞추면 결론도 달라집니다. 월 단위로 잡아 둔 임대와 견주면
            소유는 어떤 가동률에서도 쌉니다. 두 곡선이 만나지 않으므로 여기에는
            손익분기가 없습니다. 손익분기가 있는 것은 필요할 때만 빌리는
            쪽과의 사이뿐입니다.
          </p>
        </div>

        <ExplainedFormula
          question="가동률이 단가를 어떻게 바꾸고, 사는 쪽과 빌리는 쪽은 어디서 만납니까?"
          idea="한 달에 정해진 돈이 나가는 방식은 얼마나 쓰든 금액이 같으므로, 쓴 시간으로 나눈 단가가 가동률에 반비례해 올라갑니다. 쓴 만큼만 내는 방식은 분자와 분모가 함께 줄어 단가가 변하지 않습니다. 그래서 두 방식은 고정비를 쓴 시간으로 나눈 값이 시간당 단가와 같아지는 한 점에서 만나고, 그 점이 손익분기 가동률입니다."
          formula={String.raw`c(u) = \frac{C_{\text{fixed}}}{H \cdot G \cdot u}, \qquad u^{*} = \frac{C_{\text{fixed}}}{p \cdot H \cdot G}`}
          annotatedFormula={String.raw`\underbrace{c(u) = \frac{C_{\text{fixed}}}{H \cdot G \cdot u}}_{\text{고정비 방식의 단가}}, \qquad \underbrace{u^{*} = \frac{C_{\text{fixed}}}{p \cdot H \cdot G}}_{\text{쓴 만큼 내는 방식과 만나는 지점}}`}
          operations={[
            {
              expression: String.raw`\frac{C_{\text{fixed}}}{H \cdot G \cdot u}`,
              annotation: [
                "한 달 고정비를 그달에 실제로 쓴 가속기 시간으로 나눈 것입니다.",
                "소유만이 아니라 월 단위로 잡아 둔 임대도 여기에 들어갑니다. 유휴가 청구되는 방식은 전부 이 식을 씁니다.",
              ],
            },
            {
              expression: String.raw`p`,
              annotation: [
                "쓴 시간에만 청구되는 방식의 시간당 단가입니다.",
                "분자와 분모가 함께 줄어 가동률과 무관하게 일정합니다. 대신 기동 시간과 최소 청구가 붙으면 실효 단가가 이보다 높아집니다.",
              ],
            },
            {
              expression: String.raw`u^{*} = \frac{C_{\text{fixed}}}{p \cdot H \cdot G}`,
              annotation: [
                "두 식이 같아지는 가동률이며, 고정비를 그 방식으로 한 달 내내 빌렸을 때의 금액으로 나눈 값입니다.",
                "이 값보다 높게 쓸 자신이 있으면 고정비 방식이 싸고, 낮으면 쓴 만큼 내는 쪽이 쌉니다.",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`C_{\text{fixed}}`,
              name: "한 달 고정비",
              description:
                "상각·상면·전력·운영을 합한 값이며, 쓰든 안 쓰든 같은 금액이 나갑니다.",
            },
            {
              symbol: String.raw`H \cdot G`,
              name: "한 달의 가속기 시간",
              description:
                "월 시간에 노드당 가속기 수를 곱한 것으로, 100퍼센트로 돌렸을 때 쓸 수 있는 최대치입니다.",
            },
            {
              symbol: String.raw`u`,
              name: "가동률",
              description:
                "결제한 시간 가운데 실제로 일을 시킨 비율이며, 최대 처리량 대비 비율과는 다른 값입니다.",
            },
          ]}
          assumptions={[
            "고정비가 가동률과 무관하게 일정하다고 둡니다. 실제로는 전력이 부하에 따라 움직이지만 전체에서 차지하는 몫이 작아 이 식의 결론을 바꾸지 않습니다.",
            "쓴 만큼 내는 방식에 기동 시간과 최소 청구가 없다고 둡니다. 둘을 넣으면 실효 단가가 올라가 손익분기 가동률이 내려갑니다.",
            "가동률이 결제 시간 대비 실행 시간이라고 둡니다. 같은 이름으로 커널 점유율이나 최대 처리량 대비 비율을 재면 다른 숫자가 나옵니다.",
          ]}
          interpretation="8장짜리 노드 한 대의 월 고정비가 14,650달러이고 한 달을 720시간으로 잡으면, 100퍼센트로 돌릴 때 시간당 2.54달러, 60퍼센트면 4.24달러, 40퍼센트면 6.36달러입니다. 월 단위로 잡아 둔 임대가 26,500달러라면 같은 식을 써서 4.60달러, 7.67달러, 11.50달러입니다. 필요할 때만 빌리는 쪽은 4.60달러로 고정입니다. 손익분기는 14,650을 4.60 곱하기 720 곱하기 8로 나눈 55.3퍼센트입니다. 여기서 읽어야 할 것은 월 단위로 잡아 둔 임대와 소유 사이에는 손익분기가 아예 없다는 점입니다. 같은 식에 분자만 다르므로 두 곡선은 평행하게 벌어질 뿐 만나지 않습니다. 읽으면 안 되는 것은 55.3퍼센트를 계약과 무관한 상수로 쓰는 것입니다. 기동 시간과 최소 청구를 넣으면 이 값은 내려가고, 예약 할인을 받으면 올라갑니다."
        />

        <TermBreakdown
          title="세 가지를 같은 자에 올리면"
          description="유휴 시간이 청구되는가가 세 방식을 가르는 축입니다."
          items={[
            {
              term: "소유",
              description:
                "상각·상면·전력·운영이 매달 같은 금액으로 나갑니다.",
              example:
                "60퍼센트 가동이면 시간당 4.24달러, 40퍼센트면 6.36달러입니다.",
              boundary:
                "쉬는 가속기는 매몰비용이 아니라 팔지 못한 재고입니다. 야간 할인이나 배치 작업으로 그 재고를 내놓는 것이 가동률을 올리는 방법입니다.",
            },
            {
              term: "월 단위로 잡아 둔 임대",
              description:
                "예약해 둔 기간 동안 쓰든 안 쓰든 청구됩니다.",
              example:
                "같은 60퍼센트에서 시간당 7.67달러로, 소유보다 81퍼센트 비쌉니다.",
              boundary:
                "소유와 같은 식을 쓰므로 두 곡선이 만나지 않습니다. 이쪽과 견주어 나온 손익분기는 계산이 잘못된 것입니다.",
            },
            {
              term: "필요할 때만 빌리는 임대",
              description:
                "쓴 시간에만 청구되어 단가가 가동률과 무관합니다.",
              example:
                "시간당 4.60달러로 고정이고, 소유와는 55.3퍼센트에서 만납니다.",
              boundary:
                "기동 시간·최소 청구·가용성 리스크가 붙습니다. 웜 상태를 유지하려고 켜 두면 그만큼은 다시 유휴가 청구되는 방식으로 바뀝니다.",
            },
          ]}
        />
      </section>

      <section id="denominator" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 2. 분모에서 팔 수 없는 용량을 먼저 빼야 합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            자를 맞춰도 아직 하나가 남습니다. 만들 수 있는 양과 팔 수 있는 양이
            다릅니다.
          </p>

          <p className="leading-7">
            앞 글에서 봤듯 한 대가 빠진 상태에서도 약속을 지키려면 그만큼은
            비워 두어야 합니다. 그 비워 둔 몫은 비용에는 들어가는데 파는 양에는
            들어가지 않습니다.
          </p>

          <p className="leading-7">
            숫자로 보겠습니다. 노드 한 대를 60퍼센트로 돌리면 한 달에 31.1B
            토큰이 나오고, 월 비용을 그대로 나누면 100만 토큰당 0.471달러
            입니다.
          </p>

          <p className="leading-7">
            그런데 한 대뿐이면 그 한 대가 빠졌을 때 대신할 것이 없습니다. 두
            대를 두면 비용은 두 배인데 팔 수 있는 양은 그대로라{" "}
            <strong>단가가 정확히 두 배인 0.942달러</strong>가 됩니다.
          </p>

          <p className="leading-7">
            네 대면 0.628달러, 여덟 대면 0.538달러입니다. 대수를 늘릴수록
            0.471달러에 가까워지지만 닿지는 않습니다. 앞 글의 안전 가동률이
            여기서는 그대로 토큰 단가에 얹힙니다.
          </p>

          <p className="leading-7">
            그래서 작게 시작하는 쪽이 토큰 단가에서 두 번 불리합니다. 가동률을
            채우기 어렵고, 예비 용량의 비중이 큽니다. 두 불리함이 곱해집니다.
          </p>
        </div>

        <DenominatorViz />

        <AlgorithmBlock
          title="토큰당 원가를 낼 때 분모에 넣을 것과 뺄 것"
          input={[
            "월 고정비 또는 청구액",
            "노드 수와 노드당 처리량",
            "결제 시간 대비 실행 시간",
            "지켜야 할 장애 조건",
          ]}
          steps={[
            {
              code: "총 처리량 ← 노드 수 × 노드당 처리량 × 결제 시간",
              note: "여기까지는 만들 수 있는 양입니다. 파는 양이 아닙니다.",
            },
            {
              code: "총 처리량 ← 총 처리량 × 가동률",
              note: "결제한 시간 가운데 실제로 일을 시킨 비율만 남깁니다. 최대 처리량 대비 비율과 혼동하지 않습니다.",
            },
            {
              code: "판매 가능 ← 총 처리량 × (노드 수 - 1) / 노드 수",
              note: "한 대가 빠져도 지킬 수 있는 만큼만 팝니다. 지키기로 한 조건이 두 대 동시 장애면 분자가 하나 더 줄어듭니다.",
            },
            {
              code: "원가 ← 월 비용 / 판매 가능",
              note: "분자는 노드 수 전체의 비용이고 분모는 팔 수 있는 양뿐이라 둘의 대수가 다릅니다.",
            },
            {
              code: "소유와 임대를 섞었으면 각각 따로 계산해 더한다",
              note: "상각과 청구액을 한 줄에 더하면 같은 자원을 두 번 세게 됩니다.",
            },
          ]}
          output="팔 수 있는 양을 분모로 한 100만 토큰당 원가"
        />
      </section>

      <section id="unit-mismatch" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 3. 토큰당 원가와 API 가격은 같은 자가 아닙니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            자체 원가를 냈으면 외부 API 가격과 견주고 싶어집니다. 그런데 두
            숫자가 세는 것이 다릅니다.
          </p>

          <p className="leading-7">
            자체 원가에 들어가는 처리량은 대개 출력 토큰입니다. API 가격표는
            입력과 출력과 캐시 읽기의 단가가 각각 다르고, 요청마다 그 비율이
            다릅니다.
          </p>

          <p className="leading-7">
            그러면 긴 프롬프트에 짧은 답을 받는 사용 패턴에서는 출력 기준
            원가가 실제보다 낮게 보이고, 짧은 프롬프트에 긴 답을 받는 쪽에서는
            반대가 됩니다.
          </p>

          <p className="leading-7">
            그래서 둘을 직접 빼거나 나누면 안 됩니다. 비교는 같은 요청 집합을
            두고, 정한 지연 목표를 만족한 요청 하나당 총비용으로 해야 합니다.
          </p>

          <p className="leading-7">
            지연 목표를 넣어야 하는 이유가 따로 있습니다. 배치를 키우면 가속기
            하나가 내는 토큰은 늘지만 사용자 한 명이 체감하는 속도는
            떨어집니다. 그래서 같은 하드웨어가 목표를 어디에 두느냐에 따라 전혀
            다른 단가를 냅니다.
          </p>

          <p className="leading-7">
            공개 분석 하나는 같은 가속기에서 사용자당 초당 50토큰을 목표로 하면
            100만 토큰에 0.56달러, 125토큰을 목표로 하면 약 4달러라고 봅니다.{" "}
            <strong>속도 2.5배에 비용 7배입니다.</strong> 원가 한 줄로 말할 수
            있는 것이 아닙니다.
          </p>
        </div>

        <ProgressiveDetail
          title="그래서 자체 인프라의 임계를 숫자 하나로 말할 수 없습니다"
          preview="하루 몇 토큰 이상이면 직접 돌리는 게 싸다는 식의 임계값은 비교 단위를 고정했을 때만 성립합니다."
        >
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p className="leading-7">
              이 글이 근거로 삼은 조사의 초판에는 하루 몇 토큰 미만이면 API가
              싸다는 임계값이 적혀 있었습니다. 교차 검증에서 그 값이 삭제됐고
              정리본에는 남아 있지 않습니다.
            </p>

            <p className="leading-7">
              삭제된 이유가 위 두 가지입니다. 출력 처리량과 혼합 가격을 직접
              견준 것이고, 지연 목표를 고정하지 않은 것입니다. 둘 중 하나만
              바꿔도 임계값이 몇 배로 움직입니다.
            </p>

            <p className="leading-7">
              대신 남는 것은 절차입니다. 실제 요청 로그를 받아 입력과 출력의
              비율을 재고, 지연 목표를 정하고, 그 목표를 만족하는 구성에서
              요청당 총비용을 양쪽 모두에 대해 계산합니다.
            </p>

            <p className="leading-7">
              그 절차를 밟기 전까지 자체 인프라가 싸다거나 비싸다고 말하는 것은
              어느 쪽이든 근거가 없습니다. 방향을 잡는 데는 쓸 수 있어도 결정을
              내리는 데는 쓸 수 없습니다.
            </p>
          </div>
        </ProgressiveDetail>
      </section>

      <section id="what-moves-it" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 4. 결론을 움직이는 것은 전기요금이 아닙니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            자를 맞추고 나면 어느 항목이 결론을 흔드는지가 보입니다. 직관과 좀
            다릅니다.
          </p>

          <p className="leading-7">
            전력은 토큰당 원가의 5에서 15퍼센트입니다. 하드웨어 상각이 60에서
            75퍼센트이고 나머지가 상면과 네트워크와 운영입니다. 전기요금이
            지역마다 두 배 차이 나도 전체로는 한 자릿수 퍼센트입니다.
          </p>

          <p className="leading-7">
            가동률은 다릅니다. 앞의 식에서 분모에 그대로 들어가므로 60퍼센트가
            40퍼센트로 떨어지면 단가가 1.5배가 됩니다. 어떤 전기요금 차이보다
            큽니다.
          </p>

          <p className="leading-7">
            그런데 업계에서 관찰되는 가동률은 낮습니다. 피크에도 70퍼센트에
            못 미친다는 조사가 있고, 프로덕션 평균이 한 자릿수라는 보고도
            있습니다.
          </p>

          <p className="leading-7">
            그래서 순서가 뒤집힙니다. 더 싼 전기를 찾거나 다음 세대 하드웨어를
            사기 전에, 지금 가진 것의 가동률을 올리는 쪽이 훨씬 큽니다. 양자화와
            추측 디코딩으로 같은 하드웨어에서 두 배에서 네 배를 짜내는 것도 같은
            자리에 있습니다.
          </p>

          <p className="leading-7">
            쉬는 가속기를 어떻게 볼지도 여기서 갈립니다. 상각과 전력은 이미
            나가므로 되돌릴 수 없지만, 그렇다고 지워도 되는 값은 아닙니다. 쉬는
            시간은{" "}
            <Link to="/economics/scarcity/scarcity-and-opportunity-cost#sunk">
              매몰비용
            </Link>
            이 아니라 팔지 못한 재고입니다. 야간 할인이나 배치 작업으로 그
            재고를 내놓는 것이 가동률을 올리는 실제 방법입니다.
          </p>
        </div>

        <CitationBlock
          source="Modal — Beyond GPU utilization: a guide to measuring what matters"
          citeKey={1}
          href="https://modal.com/blog/gpu-utilization-guide"
        >
          가동률이라는 한 단어가 서로 다른 것을 가리킨다는 점을 정리한
          글입니다. 셋을 각각 &ldquo;GPU-seconds running application code ÷
          GPU-seconds paid for&rdquo;, &ldquo;GPU-seconds running kernels ÷
          GPU-seconds paid for&rdquo;, &ldquo;Model FLOP/s throughput achieved ÷
          FLOP/s bandwidth paid for&rdquo;로 정의하고, 이것들이 &ldquo;very
          different things that all get called &lsquo;GPU
          utilization&rsquo;&rdquo;이라고 적습니다. 위 계층에서 높다고 아래가
          높은 것도 아니어서, 커널 점유율이 높아도 메모리 병목이나 통신
          오버헤드 때문에 마지막 값이 낮을 수 있다고 덧붙입니다. 이 글의 식에
          들어가는 것은 첫째입니다. 같은 구성에서 셋을 재면 서로 크게
          다른 숫자가 나오므로, 가동률 60퍼센트라는 말은 어느 정의인지를 밝히지
          않으면 비교에 쓸 수 없습니다. 이 글이 인용한 것은 정의의 구분까지이며,
          같은 글이 제시하는 개선 방법과 자사 제품에 대한 주장은 다루지
          않습니다.
        </CitationBlock>
      </section>

      <section id="boundary" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          자를 맞추는 것까지가 이 글이고, 결정은 로그를 봐야 합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            네 부품을 합치면 이렇습니다. 임대 두 종류 가운데 유휴가 청구되는
            쪽만 가동률에 나뉘고, 분모에서 예비 용량을 빼야 하며, 토큰 원가와
            API 가격은 요청당 총비용으로만 견줄 수 있고, 결론을 움직이는 것은
            가동률입니다.
          </p>

          <p className="leading-7">
            이것들은 전부 비교를 세우는 방법이지 결론이 아닙니다. 결론은 실제
            요청 로그의 입출력 비율과 지연 목표가 있어야 나오고, 그 둘은
            서비스마다 다릅니다.
          </p>

          <p className="leading-7">
            그리고 큰 리스크가 하나 남습니다. 상각이 끝나기 전에 외부 API
            가격이 크게 떨어지면 계산 전체가 바뀝니다. 중고 시세도 다음 세대가
            나오면 급락합니다. 그래서 소유의 근거는 단가만으로 서지 않고 데이터
            주권이나 커스텀 모델 같은 다른 이유가 함께 있어야 합니다.
          </p>

          <p className="leading-7">
            다루지 않은 것을 밝혀 둡니다. 어떤 가속기를 골라야 하는지, 어떤
            모델이 어느 구성에 들어가는지, 시설과 냉각을 어떻게 잡는지는 이
            글의 범위 밖입니다. 이 글의 수치는 특정 시점의 공개 시세이고 계약
            전에 다시 확인해야 합니다.
          </p>

          <p className="leading-7">
            한 대가 빠진 상태를 기준으로 삼는 이유는{" "}
            <Link to="/cs/ai/inference-failure-absorption#fleet-size">
              장애 흡수
            </Link>
            가, 확보한 용량의 한계비용이 왜 작은지는{" "}
            <Link to="/cs/ai/region-agnostic-inference-routing#order-matters">
              요청 경로
            </Link>
            가 맡습니다.
          </p>
        </div>
      </section>
    </div>
  );
}
