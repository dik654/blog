import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import TypeBoundaryTraceViz from "./viz/TypeBoundaryTraceViz";

const HELIOS_SHA = "204c998a927348e1c000a664f08d5b37b1b0d924";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">
        Beacon API의 JSON 한 건은 어떻게 검증 입력이 될까요?
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          Helios 0.11.1은 Beacon API 응답을 JSON으로 읽고, 응답 구조에 맞는
          fork별 Rust 타입을 고릅니다. 그 타입이 고정한 SSZ tree shape와 branch
          길이로 Merkle 증명을 확인하고, sync committee 서명까지 통과한 뒤에야
          <code>GenericUpdate</code> 후보를 만듭니다.
        </p>
      </div>

      <TypeBoundaryTraceViz />
      <ContentBoundary article="helios-types" />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          이 경로에서 JSON과 SSZ는 경쟁하는 두 직렬화 방식이 아닙니다. JSON은
          HTTP 응답을 Rust 객체로 옮기는 전송 표현입니다. SSZ의
          <code>tree_hash_root</code>와 고정된 tree 위치는 그 객체가 Ethereum
          consensus state에 포함됐는지 확인하는 정본 규칙입니다.
        </p>
        <p>
          글 전체에서 같은 update를 <code>U1422</code>라고 부릅니다. Mainnet
          Electra 활성 slot 11,649,024에 속한 예시이며, 실제 API에 이런 ID가
          들어 있다는 뜻은 아닙니다. 목표는 한 객체의 표현과 증거가 어느
          단계에서 바뀌는지 놓치지 않는 것입니다.
        </p>
      </div>

      <div id="paper-helios-types-source" className="scroll-mt-24">
        <CitationBlock
          source="a16z/helios 0.11.1 · HTTP RPC와 consensus types"
          href={`https://github.com/a16z/helios/tree/${HELIOS_SHA}/ethereum`}
          citeKey={1}
          type="code"
        >
          문제: Beacon API 응답이 fork별 light-client type과 검증 함수로 들어가는
          실제 구현 경계를 확인합니다. 기여: HTTP JSON decode, untagged
          Base·Electra variant, branch 길이와 GenericUpdate 변환을 보여 줍니다.
          전제: Helios 0.11.1, commit {HELIOS_SHA.slice(0, 8)}를 고정합니다. 근거
          범위: 이 릴리스의 구현입니다. 주장하지 않는 것: Moving main의 API나
          대상 환경의 성능·안전성을 보장하지 않습니다.
        </CitationBlock>
      </div>

      <div id="paper-ethereum-light-client-types" className="scroll-mt-24">
        <CitationBlock
          source="Ethereum consensus-specs v1.6.1 · light-client sync protocol"
          href="https://github.com/ethereum/consensus-specs/blob/v1.6.1/specs/altair/light-client/sync-protocol.md"
          citeKey={2}
        >
          문제: 전체 BeaconState 없이 update의 header·committee·finality를
          검증합니다. 기여: LightClientHeader·Update·Store와 fork별 branch
          index·depth를 정의합니다. 전제: v1.6.1, mainnet preset과 활성 fork를
          고정합니다. 근거 범위: Protocol semantics입니다. 주장하지 않는 것:
          Helios의 HTTP 표현이나 Rust enum 선택 방식을 정하지 않습니다.
        </CitationBlock>
      </div>

      <div id="paper-ethereum-mainnet-preset" className="scroll-mt-24">
        <CitationBlock
          source="Ethereum consensus-specs v1.6.1 · mainnet preset와 config"
          href="https://github.com/ethereum/consensus-specs/tree/v1.6.1/presets/mainnet"
          citeKey={3}
        >
          문제: Slot을 epoch와 sync committee period로 바꾸고 Electra 경계를
          판정합니다. 기여: 32 slots/epoch, 256 epochs/period, Electra epoch
          364,032와 fork version 0x05000000을 제공합니다. 전제: Mainnet
          v1.6.1입니다. 근거 범위: 이 글의 계산 상수입니다. 주장하지 않는 것:
          U1422의 실제 네트워크 응답이나 성능 측정값을 제공하지 않습니다.
        </CitationBlock>
      </div>
    </section>
  );
}
