import ContentBoundary from "@/components/articles/content-boundary";
import type { CodeRef } from "@/components/code/types";
import HeliosTrustPathViz from "../helios-trust-path-viz";

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function Overview({ onCodeRef: _onCodeRef }: Props) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">부트스트랩은 서버 응답을 믿는 단계가 아니라 첫 검증 기준을 세우는 단계다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          처음 실행한 Helios에는 “어느 beacon header가 진짜인가”를 판단할 기준이 없습니다. 그래서 사용자가 신뢰한 최근 finalized
          checkpoint root를 하나 받고, 서버가 돌려준 header가 정확히 그 root인지 확인한 뒤, 그 state에 포함된 current sync committee만
          첫 store에 넣습니다. 이 순서가 바뀌면 공격자가 만든 committee로 공격자의 서명을 검증하는 순환 논리가 됩니다.
        </p>
        <p>
          이 글은 checkpoint root <code>C</code> 하나로 시작해 bootstrap response의 header·committee·branch를 검증하고,
          <code>LightClientStore</code>를 초기화한 뒤 첫 update로 넘어가는 과정을 따라갑니다. “checkpoint hash 32 bytes만 저장한다”와
          “실행 중인 store 전체가 32 bytes다”는 서로 다른 주장이라는 점도 함께 구분합니다.
        </p>
      </div>
      <ContentBoundary article="helios-bootstrap" />
      <HeliosTrustPathViz mode="bootstrap" />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>부트스트랩이 끝났다는 판정</h3>
        <p>
          Network identity와 checkpoint provenance가 맞고, 응답 header의 hash-tree-root가 checkpoint와 같으며, current committee의
          Merkle branch가 그 header의 state root까지 재계산될 때만 store를 만듭니다. HTTP 200이나 JSON/SSZ decode 성공은 구조를 읽었다는
          뜻일 뿐 신뢰가 전달됐다는 뜻이 아닙니다.
        </p>
      </div>
    </section>
  );
}
