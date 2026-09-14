import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import GroupViz from "./viz/GroupViz";

export default function GroupReplica() {
  return (
    <section id="group-replica" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">복제본이 파드 하나가 아닐 때 배포 추상이 먼저 깨집니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          가속기 한 장에 들어가는 모델이면 복제본 하나가 파드 하나입니다. 이 경우 배포는 단순합니다. 파드를
          여러 개 띄우고 앞에 분배기를 두면 끝입니다. 문제는 모델이 한 노드에 들어가지 않을 때입니다.
        </p>

        <p className="leading-7">
          이때 복제본 하나는 여러 노드의 파드 여럿으로 이뤄집니다. 이 파드들은 서로를 알아야 하고 같이 떠야 하고 하나가 죽으면 나머지도 의미가 없어집니다. 절반만 살아 있는 복제본은
          요청을 처리하지 못하면서 가속기만 잡고 있습니다.
        </p>

        <p className="leading-7">
          기본 배포 추상은 이 관계를 표현하지 못합니다. 파드를 서로 독립적인 복제본으로 보기 때문에 하나가
          죽으면 그 하나만 새로 만듭니다. 새로 만들어진 파드는 이미 초기화를 마친 나머지 파드들과 다시 손을
          잡아야 하는데, 대부분의 분산 실행은 그 재합류를 지원하지 않습니다.
        </p>

        <p className="leading-7">
          그래서 파드 묶음 자체를 복제 단위로 다루는 추상이 따로 필요합니다. 대표 파드 하나와 나머지 파드들을 한 그룹으로 묶어 함께 배치하고 그룹 안에서 하나라도 실패하면 그룹 전체를
          다시 만들고 갱신도 그룹 단위로 한 번에 하나씩 진행하는 방식입니다.
        </p>
      </div>

      <GroupViz />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          배치도 그냥 아무 노드가 아닙니다. 같은 그룹의 파드들은 서로 많은 양을 주고받으므로 같은 스위치
          아래처럼 가까운 곳에 함께 놓여야 합니다. 멀리 흩어지면 통신이 병목이 되어 가속기가 놀게 됩니다. 그룹
          추상이 이 조건을 선언할 자리를 제공합니다.
        </p>

        <p className="leading-7">
          같은 이유로 부분 배치도 소용이 없습니다. 그룹의 파드 여덟 개 중 여섯 개만 자리를 잡으면 그 여섯 개는 아무 일도 못 하면서 자원을 점유합니다. 전부 놓을 수 있을 때만 놓는
          판단이 필요하고 그 판단이 없으면 여러 그룹이 서로의 부분 배치에 막혀 아무도 뜨지 못하는 상황이 생깁니다.
        </p>
      </div>

      <CitationBlock
        source="Kubernetes SIG — LeaderWorkerSet 프로젝트 문서 (2026-09-11 확인)"
        citeKey={2}
        href="https://github.com/kubernetes-sigs/lws"
      >
        파드 묶음을 복제 단위로 배포하는 API이며 여러 노드에 걸쳐 샤딩된 모델을 서빙하는 경우를 대상으로
        한다는 설명, 대표와 작업자 두 종류의 템플릿으로 그룹을 구성한다는 구조, 같은 토폴로지에 함께 배치하는
        기능과 하나가 실패하면 그룹 전체를 다시 만드는 기능, 갱신을 그룹 단위로 하나씩 진행한다는 설명이 이
        문서에 있습니다. 기능 상당수가 선택 사항이므로 켜지 않으면 기본 동작은 달라집니다.
      </CitationBlock>

      <h3 id="rollout-ratio" className="mt-10 mb-3 scroll-mt-24 text-xl font-semibold">
        갱신 중에 남는 용량을 미리 계산해 둡니다
      </h3>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-7">
          그룹 단위 갱신은 한 번에 그룹 하나를 통째로 내렸다 올립니다. 그동안 그 그룹의 가속기는 전부 서비스에서 빠집니다. 복제본이 네 개라면 갱신 중에는 세 개로 버텨야 하고 그 세
          개가 평소 부하를 감당하지 못하면 갱신 자체가 장애가 됩니다.
        </p>

        <p className="leading-7">
          클라우드에서는 이 문제를 돈으로 풉니다. 갱신하는 동안 새 복제본을 추가로 띄우고 다 뜬 뒤에 옛것을
          내리면 용량이 줄지 않습니다. 온프레미스에서는 그 여유분이 없습니다. 새 그룹을 띄울 가속기가 남아 있지
          않으면 내렸다 올리는 순서밖에 쓸 수 없습니다.
        </p>

        <p className="leading-7">
          그래서 온프레미스 배포에서는 갱신 전에 두 숫자를 비교해 둡니다. 갱신 중 남는 복제본이 감당할 수 있는
          처리량과 그 시간대의 실제 부하입니다. 앞의 값이 작으면 선택지는 셋입니다. 부하가 낮은 시간대로
          옮기거나, 복제본 수를 먼저 늘리거나, 갱신을 더 잘게 나누는 것입니다.
        </p>
      </div>

      <ExplainedFormula
        question="갱신 중에 몇 개까지 내려도 됩니까"
        idea="갱신 중 남는 복제본이 감당하는 처리량이 그 시간대의 도착률보다 커야 하고, 이 부등식이 한 번에 내릴 수 있는 복제본 수의 상한을 정합니다."
        formula={String.raw`(N - k)\,\mu \;>\; \lambda`}
        annotatedFormula={String.raw`(\underbrace{N - k}_{\text{갱신 중 살아 있는 복제본}})\,\underbrace{\mu}_{\text{복제본 하나의 처리율}} \;>\; \underbrace{\lambda}_{\text{그 시간대 도착률}}`}
        operations={[
          {
            expression: "N - k",
            annotation: [
              "전체 복제본 N개 중 한 번에 k개를 내렸을 때 남는 수입니다",
              "그룹 단위 갱신에서 k는 보통 1이고, 더 빨리 끝내려면 k를 키웁니다",
            ],
          },
          {
            expression: String.raw`\mu`,
            annotation: "복제본 하나가 초당 처리할 수 있는 요청 수이며 입력·출력 길이 분포에 따라 달라집니다",
          },
          {
            expression: String.raw`k < N - \frac{\lambda}{\mu}`,
            annotation: "부등식을 k에 대해 풀면 한 번에 내릴 수 있는 복제본 수의 상한이 나옵니다",
          },
        ]}
        terms={[
          { symbol: "N", name: "복제본 수", description: "평소 서비스에 들어가 있는 복제본의 수입니다." },
          { symbol: "k", name: "동시 갱신 수", description: "갱신 때문에 동시에 빠지는 복제본의 수입니다." },
          { symbol: String.raw`\mu`, name: "복제본 처리율", description: "복제본 하나의 초당 처리 가능 요청 수입니다." },
          { symbol: String.raw`\lambda`, name: "도착률", description: "그 시간대에 실제로 도착하는 초당 요청 수입니다." },
        ]}
        assumptions={[
          "복제본의 처리율이 서로 같다고 가정합니다. 세대가 다른 가속기가 섞여 있으면 각각 다른 값으로 나눠 계산해야 합니다.",
          "새 복제본이 뜨자마자 처리율 μ를 낸다고 가정합니다. 가중치 적재와 예열이 끝나기 전에는 그보다 낮습니다.",
        ]}
        interpretation="부등식이 아슬아슬하게 성립하는 구간에서는 대기열이 급격히 길어지므로, 실무에서는 여유를 두고 우변에 계수를 곱해 씁니다. 대기열과 지연의 관계는 별도 정본이 다루며 여기서는 상한을 정하는 데까지만 씁니다."
      />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          대기열 길이와 지연의 관계, 그리고 준비 상태의 파드가 실제 용량이 되기까지의 과정은{" "}
          <Link to="/cs/ai/llm-serving-ops#k8s-gpu-fleet">서빙 운영</Link>이 소유합니다. 이 절은 갱신 방식이
          용량에 주는 제약만 다뤘습니다.
        </p>
      </div>
    </section>
  );
}
