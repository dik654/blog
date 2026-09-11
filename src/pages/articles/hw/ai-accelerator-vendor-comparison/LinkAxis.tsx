import { Link } from "react-router-dom";
import TermBreakdown from "@/components/articles/term-breakdown";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import LinkViz from "./viz/LinkViz";

export default function LinkAxis() {
  return (
    <section id="link-axis" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">가속기를 잇는 방식에서 셋이 갈라집니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          카드 하나에 모델이 들어가지 않으면 여러 장을 묶어야 하고, 그 순간 가속기 사이를 무엇으로 잇느냐가
          성능을 정합니다. 여기서 세 회사가 서로 다른 선택을 했고, 그 선택이 이 비교에서 가장 구조적인
          차이입니다.
        </p>

        <p className="leading-7">
          첫 번째는 전용 링크와 전용 스위치를 두는 방식입니다. 가속기마다 전용 포트를 내고 그 사이에 스위치
          칩을 놓아, 노드 안의 어떤 두 장이든 같은 대역폭으로 통신하게 만듭니다. 토폴로지에 따른 성능 편차가
          거의 없다는 점이 강점이고, 그 대신 스위치와 보드가 벤더 설계에 묶입니다.
        </p>

        <p className="leading-7">
          두 번째는 전용 링크를 두되 스위치 없이 서로 직접 잇는 방식입니다. 각 가속기가 여러 개의 링크를 내어
          이웃과 그물처럼 연결합니다. 스위치 칩이 없어 구조가 단순하지만, 한 쌍이 쓸 수 있는 대역폭은 그 쌍을
          잇는 링크 수로 정해지고 멀리 있는 쌍은 중계를 거칩니다.
        </p>

        <p className="leading-7">
          세 번째는 아예 표준 이더넷을 가속기 패키지에 넣는 방식입니다. 노드 안이든 밖이든 같은 프로토콜로
          통신하므로 스케일업과 스케일아웃의 경계가 흐려지고, 스위치도 일반 이더넷 장비를 씁니다. 대신 전용
          링크가 주는 낮은 지연과 높은 단일 링크 대역폭은 포기합니다.
        </p>
      </div>

      <LinkViz />

      <TermBreakdown
        title="세 방식이 각각 잘하는 것"
        description="같은 '가속기 간 대역폭'이라는 말이 구조에 따라 다른 성질을 갖습니다."
        items={[
          {
            term: "전용 링크 + 전용 스위치",
            description: "노드 안의 모든 쌍이 동일한 대역폭으로 통신합니다. 토폴로지 의존성이 사라집니다.",
            example: "all-to-all 통신이 잦은 MoE 서빙에서 쏠림이 잘 드러나지 않습니다.",
            boundary: "스위치와 베이스보드가 벤더 설계에 묶여 조달 선택지가 좁아집니다.",
          },
          {
            term: "전용 링크 메시",
            description: "스위치 없이 가속기끼리 직접 잇습니다. 링크 수가 쌍별 대역폭을 정합니다.",
            example: "이웃한 쌍은 빠르지만 멀리 있는 쌍은 중계를 거칩니다.",
            boundary: "통신 패턴이 특정 쌍에 쏠리면 그 링크가 병목이 됩니다.",
          },
          {
            term: "패키지 내장 이더넷",
            description: "가속기에 표준 이더넷 포트를 직접 넣어 노드 안팎을 같은 방식으로 잇습니다.",
            example: "노드를 넘는 확장에서 별도 전용 패브릭이 필요 없습니다.",
            boundary: "전용 링크 대비 단일 링크 대역폭과 지연에서 불리하며 스위치 설정이 성능에 직접 영향을 줍니다.",
          },
        ]}
      />

      <h3 id="scale-up-vs-out" className="mt-10 mb-3 scroll-mt-24 text-xl font-semibold">
        노드 안과 노드 밖을 구분해서 봐야 합니다
      </h3>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-7">
          가속기 간 대역폭이라는 말은 두 가지를 가리킵니다. 한 노드 안에서 카드끼리 잇는 대역폭과, 노드와 노드
          사이를 잇는 네트워크 대역폭입니다. 앞의 것이 보통 한 자릿수 배 이상 큽니다. 그래서 모델을 나눌 때
          어떤 축을 노드 안에 두고 어떤 축을 노드 밖에 두느냐가 성능을 크게 바꿉니다.
        </p>

        <p className="leading-7">
          통신량이 많은 축은 노드 안에 두는 것이 기본입니다. layer마다 전체 합을 구해야 하는 병렬화는 노드
          안에서, 구간 경계에서만 넘기는 병렬화는 노드 밖으로 두는 식입니다. 어느 축을 어디에 둘지의 일반
          기준은 <Link to="/ai/parallelism-strategy-and-placement">병렬화 전략과 배치</Link>에서 다룹니다.
        </p>

        <p className="leading-7">
          패키지에 이더넷을 넣은 설계는 이 경계를 흐립니다. 노드 안팎이 같은 프로토콜이라 배치를 바꾸기 쉽고
          스위치 하나로 규모를 늘릴 수 있습니다. 다만 경계가 흐려진다는 것이 대역폭이 같아진다는 뜻은 아니라,
          실제 배치에서는 여전히 홉 수와 스위치 단수를 세야 합니다.
        </p>
      </div>

      <div className="mt-6">
        <ProgressiveDetail
          title="MoE 서빙에서 이 차이가 왜 크게 드러나나요"
          preview="dense 모델의 통신은 layer마다 대칭이지만 MoE는 라우팅에 따라 비대칭이라, 쌍별 대역폭이 균일하지 않은 구조에서 먼저 병목이 생깁니다."
        >
          <p className="leading-7">
            dense 모델을 텐서 병렬로 나누면 layer마다 같은 크기의 합을 모든 카드가 주고받습니다. 어느 쌍이 더
            많이 보내는 일이 없어 균일한 패브릭이든 메시든 차이가 덜 드러납니다.
          </p>
          <p className="leading-7">
            MoE는 다릅니다. 토큰이 어느 expert로 가느냐가 라우팅으로 정해지므로 특정 카드로 트래픽이 몰릴 수
            있습니다. 모든 쌍이 같은 대역폭을 보장하는 구조에서는 이 쏠림이 흡수되지만, 쌍별 대역폭이 다른
            구조에서는 그대로 병목이 됩니다.
          </p>
          <p className="leading-7">
            이 비대칭성과 완화 기법은{" "}
            <Link to="/gpu/modded-rtx4090-moe-serving#why-interconnect-matters-more">MoE 통신 민감도</Link>에서
            정리했습니다. 벤더 비교에서 이 절이 말하는 것은 그 민감도가 링크 구조에 따라 다르게 나타난다는
            점입니다.
          </p>
        </ProgressiveDetail>
      </div>
    </section>
  );
}
