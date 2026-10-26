import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import EthereumP2PPathLocator, {
  EthereumP2PMapReturn,
} from "../shared/EthereumP2PPathLocator";
import ForkIdHandshakeTraceViz from "./viz/ForkIdHandshakeTraceViz";
import {
  ForkBoundaryViz,
  ForkHashTraceViz,
  ForkIdMatrixViz,
} from "./viz/ModernForkIdViz";

export default function ModernForkIdArticle() {
  return (
    <article className="space-y-14 [&_section]:scroll-mt-20 [&_section]:space-y-6 [&_h2]:text-2xl [&_h2]:font-bold [&_p]:leading-8">
      <EthereumP2PPathLocator current="fork-filter" />

      <section id="overview" data-teach-level="S">
        <h2>다른 체인인지, 아직 뒤처진 노드인지 먼저 가릅니다</h2>
        <ForkIdHandshakeTraceViz />
        <p className="text-lg text-foreground/90">
          실행 클라이언트가 다른 노드의 주소를 찾았다고 해서 곧바로 유용한 피어가 되지는 않습니다. 같은 genesis에서 출발했고 지금까지 적용한 네트워크 변경 이력을 서로 설명할 수 있어야 긴 동기화를 시작할 이유가 생깁니다.
        </p>
        <p>
          EIP-2124의 Fork ID는 이미 지난 fork 이력을 4바이트 <code>FORK_HASH</code>로 줄이고, 아직 지나지 않은 가장 가까운 fork를 <code>FORK_NEXT</code>로 함께 보냅니다. 이 요약은 discovery ENR이나 <code>eth</code> handshake 같은 네트워크 프로토콜에 넣을 수 있습니다. 규격은 요약과 판정 방법을 정의하며 한 가지 전달 위치만 강제하지 않습니다.
        </p>
        <p>
          Fork ID는 상대가 정직하다는 증명도, 받은 블록이 유효하다는 증명도 아닙니다. 명백히 다른 chain configuration을 이른 단계에서 거르는 호환성 필터입니다. 피어 세션과 블록 검증은 <Link to="/cs/blockchain/reth-net">Reth P2P 흐름</Link>에서 이어서 추적합니다.
        </p>
      </section>

      <section id="forkhash" data-teach-level="0">
        <h2>지난 fork는 hash에 넣고, 다음 fork는 따로 알립니다</h2>
        <ForkHashTraceViz />
        <p>
          예시의 현재 head는 9이고 fork schedule은 5와 10입니다. Genesis hash에서 CRC32를 시작해 이미 지난 fork 5의 숫자만 누산합니다. 아직 오지 않은 10은 checksum에 넣지 않고 <code>FORK_NEXT</code>에 둡니다.
        </p>
        <p>
          CRC32는 서명이나 충돌 저항성을 위한 암호학적 hash가 아닙니다. EIP-2124는 300바이트로 제한된 ENR에도 넣을 수 있는 작은 요약이 필요했고, 노드는 어차피 임의의 값을 말할 수 있으므로 4바이트 오류 검출 checksum을 선택했습니다.
        </p>

        <ExplainedFormula
          question="현재 head가 9이고 fork schedule이 [5, 10]이면 무엇을 광고할까요?"
          idea="Head가 이미 지난 fork 5만 CRC32에 누산하고, 아직 오지 않은 fork 10은 FORK_NEXT로 분리합니다."
          formula={String.raw`\begin{aligned}
            h_0&=CRC32(genesis)\\
            h_1&=CRC32(h_0\parallel BE_8(5))\\
            forkid&=RLP([h_1,10])
          \end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}
            h_0&=\underbrace{CRC32(genesis)}_{\text{chain의 시작점}}\\
            h_1&=\underbrace{CRC32(h_0\parallel BE_8(5))}_{\text{이미 지난 fork 5를 누산}}\\
            forkid&=RLP([\underbrace{h_1}_{\text{FORK\_HASH}},\underbrace{10}_{\text{FORK\_NEXT}}])
          \end{aligned}`}
          operations={[
            { expression: String.raw`CRC32(genesis)`, annotation: ["genesis hash의 바이트로 시작합니다", "다른 genesis면 첫 checksum부터 달라집니다"] },
            { expression: String.raw`CRC32(h_0\parallel BE_8(5))`, annotation: ["5를 uint64 big-endian 8바이트로 바꿉니다", "head 9가 이미 지난 값만 이어 붙입니다"] },
            { expression: String.raw`RLP([h_1,10])`, annotation: ["과거 이력 checksum과 다음 fork를 묶습니다", "head 10부터는 10도 hash에 들어갑니다"] },
          ]}
          terms={[
            { symbol: "genesis", name: "Genesis hash", description: "두 노드가 같은 chain 시작점을 따르는지 구분하는 첫 입력입니다." },
            { symbol: String.raw`BE_8(5)`, name: "fork 숫자 인코딩", description: "Fork block 5를 uint64 big-endian 8바이트로 표현한 값입니다." },
            { symbol: "h₁", name: "FORK_HASH", description: "현재 head까지 이미 지난 fork history의 4바이트 CRC32 checksum입니다." },
            { symbol: "10", name: "FORK_NEXT", description: "아직 지나지 않은 가장 가까운 fork block입니다. 없으면 0입니다." },
          ]}
          assumptions={[
            "이 계산은 block number로 활성화되는 EIP-2124 예시입니다.",
            "Fork 숫자는 오름차순으로 넣고 같은 block의 중복 숫자는 한 번만 넣습니다.",
            "CRC32가 같다는 사실만으로 peer honesty나 block validity를 결론 내리지 않습니다.",
          ]}
          interpretation="Head가 10에 도달하면 fork 10도 누산한 새 FORK_HASH를 만들고, 더 예정된 fork가 없다면 FORK_NEXT는 0입니다."
        />

        <div id="paper-eip2124">
          <CitationBlock source="EIP-2124 · Fork identifier for chain compatibility checks" citeKey={1} href="https://eips.ethereum.org/EIPS/eip-2124">
            <p><strong>문제:</strong> 긴 동기화 전에 서로 호환되지 않는 chain history를 낮은 비용으로 식별해야 합니다.</p>
            <p><strong>기여:</strong> Genesis와 이미 지난 fork의 CRC32, 다음 fork와 네 가지 교차 판정 규칙을 정의합니다.</p>
            <p><strong>전제:</strong> EIP-2124의 block-number schedule, local canonical head와 정해진 인코딩을 사용합니다.</p>
            <p><strong>근거 범위:</strong> Fork ID tuple과 피어 호환성 판정에 한정합니다.</p>
            <p><strong>말하지 않는 것:</strong> Peer honesty, block validity, consensus finality나 timestamp fork 지원을 증명하지 않습니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="validation" data-teach-level="1">
        <h2>같은 값인지 보지 않고 어느 쪽이 뒤처졌는지 설명합니다</h2>
        <ForkIdMatrixViz />
        <p>
          두 노드의 hash가 같아도 원격이 알린 다음 fork가 이미 로컬 head를 지났다면 원격 소프트웨어가 낡았을 수 있으므로 거절합니다. 반대로 다음 fork가 아직 오지 않았다면 미래 일정이 달라도 지금은 갈라졌다고 단정하지 않습니다.
        </p>
        <p>
          Hash가 다를 때는 원격 값이 로컬의 과거 fork sequence 중 하나인지, 또는 로컬이 알고 있는 future fork를 적용하면 원격 값에 도달하는지 확인합니다. 둘 중 하나로 설명되면 한쪽이 동기화 중인 경우로 받아들이고, 어느 방향으로도 설명할 수 없으면 거절합니다. 양쪽이 각각 같은 결론에 도달해야 반복 연결을 피할 수 있습니다.
        </p>

        <AlgorithmBlock
          title="원격 Fork ID를 local head와 schedule로 판정하는 의사코드"
          input={[
            "local = { head, genesis, ordered fork schedule }",
            "remote = { FORK_HASH, FORK_NEXT }",
          ]}
          steps={[
            {
              code: "localIds ← genesis에서 각 fork 경계까지 CRC32를 순서대로 계산",
              note: "같은 block의 중복 fork는 한 번만 넣고 각 숫자를 uint64 big-endian으로 인코딩합니다.",
            },
            {
              code: "if remote.hash = local.currentHash: remote.next가 0이거나 local head보다 미래인지 확인",
              note: "같은 과거 이력이어도 이미 지났어야 할 remote next를 놓친 stale peer는 거절합니다.",
            },
            {
              code: "else if remote.hash가 local 과거 hash이고 remote.next가 바로 다음 local fork이면 accept",
              note: "원격 노드가 아직 그 fork에 도달하지 않은 동기화 중 상태로 설명됩니다.",
            },
            {
              code: "else if known local future forks를 적용해 remote.hash를 재현할 수 있으면 accept",
              note: "이번에는 로컬 노드가 원격보다 뒤처진 상태로 설명됩니다.",
            },
            {
              code: "else reject",
              note: "알고 있는 같은 schedule의 어느 위치로도 설명할 수 없으므로 호환되지 않는 configuration으로 봅니다.",
            },
          ]}
          output="compatible remote-syncing | compatible local-syncing | compatible same-state | incompatible"
        />
      </section>

      <section id="release" data-teach-level="2">
        <h2>경계 높이와 timestamp 확장을 따로 확인합니다</h2>
        <ForkBoundaryViz />
        <p>
          Schedule이 5와 10이면 head 4, 5, 9, 10에서 식별자가 어떻게 바뀌는지 먼저 고정합니다. 경계 바로 전과 정확한 경계에서 기대값을 확인해야 <code>&lt;</code>와 <code>≤</code>를 뒤바꾼 구현을 찾을 수 있습니다. 숫자의 endian을 바꾸거나 같은 block을 두 번 넣은 경우도 별도 반례가 됩니다.
        </p>
        <p>
          EIP-2124만으로 같은 미래 block에서 서로 다른 규칙을 선택한 3-way fork를 완전히 구분할 수는 없습니다. Fork ID에는 규칙 이름이 아니라 fork 숫자가 들어가기 때문입니다. 이 한계는 peer identity나 추가 네트워크 식별을 별도로 다뤄야 하는 이유입니다.
        </p>
        <p>
          The Merge 이후 execution-layer upgrade에도 timestamp 활성화가 쓰이므로 EIP-6122가 계산 입력을 확장했습니다. Block-number fork를 먼저, timestamp fork를 그다음 검사하고 각각의 현재 block과 현재 시간을 사용합니다. 기존 EIP-2124 구현이 자동으로 이 규칙을 지원하는 것은 아닙니다.
        </p>

        <div id="paper-eip6122">
          <CitationBlock source="EIP-6122 · Forkid checks based on timestamps" citeKey={2} href="https://eips.ethereum.org/EIPS/eip-6122">
            <p><strong>문제:</strong> Block number만 넣는 기존 계산으로 timestamp 기반 execution upgrade를 표현할 수 없습니다.</p>
            <p><strong>기여:</strong> Fork block 또는 timestamp를 uint64 big-endian으로 누산하고 block 기준 뒤에 timestamp 기준을 검사하도록 확장합니다.</p>
            <p><strong>전제:</strong> Timestamp fork는 block-number fork 이후에 배치하고 두 활성화 기준을 구분합니다.</p>
            <p><strong>근거 범위:</strong> EIP-2124 이후 timestamp 기반 Fork ID 계산과 판정에 한정합니다.</p>
            <p><strong>말하지 않는 것:</strong> 이전 구현의 자동 호환이나 peer가 보내는 데이터의 유효성을 보장하지 않습니다.</p>
          </CitationBlock>
        </div>

        <p>
          특정 클라이언트가 genesis와 fork schedule을 어디서 읽는지, 어떤 버전에 이 규칙을 구현했는지는 이 개념 글의 책임이 아닙니다. Reth 구현에서는 <Link to="/cs/blockchain/reth-chainspec#hardfork">ChainSpec과 hardfork 조건</Link>을 이어서 확인합니다.
        </p>
      </section>

      <EthereumP2PMapReturn current="fork-filter" />
      <ContentBoundary article="eip2124-fork-id" />
    </article>
  );
}
