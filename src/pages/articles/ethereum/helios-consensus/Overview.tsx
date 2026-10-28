import ContentBoundary from "@/components/articles/content-boundary";
import type { CodeRef } from "@/components/code/types";
import ConsensusTraceViz from "./viz/ConsensusTraceViz";

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function Overview({ onCodeRef: _onCodeRef }: Props) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Update 하나가 어떻게 신뢰할 수 있는 Store 변경이 될까요?</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          Consensus endpoint가 새 header와 signature를 돌려줘도 Helios는 곧바로 Store를 바꾸지 않습니다. 이 글은 update <code>u-8193</code> 하나를
          고정해, 기존 Store <code>T0</code>의 committee가 새 header와 다음 committee를 검증하고 Store <code>T1</code>을 만드는 과정을 따라갑니다.
        </p>
      </div>
      <ConsensusTraceViz />
      <ContentBoundary article="helios-consensus" />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>검증 통과와 Store 적용은 다른 판정입니다</h3>
        <p>
          <code>u-8193</code>의 signature가 맞다는 사실은 update를 만든 committee가 attested header에 서명했다는 뜻입니다. 그러나 finality branch와
          next-committee branch가 맞는지, 참여가 Store를 전진시킬 만큼 충분한지, 더 새로운 finalized header인지도 따로 확인해야 합니다.
        </p>
        <p>
          참여 bit는 사람 수가 아니라 512칸인 sync committee 목록의 position을 셉니다. Protocol의 committee 추출 과정에서는 같은 validator가 여러
          position에 들어갈 수 있으므로, 구현은 bit와 public key를 position별로 결속하고 임의로 중복 제거하지 않습니다.
        </p>
        <p>
          따라서 검증 단계는 잘못된 입력을 거부하고, 적용 단계는 검증된 입력 중 어떤 상태를 실제로 바꿀지 결정합니다. 어느 단계에서든 조건이 맞지 않으면
          Helios가 현재 사용하는 Store는 <code>T0</code>로 남습니다.
        </p>
      </div>
    </section>
  );
}
