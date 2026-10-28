import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import { CitationBlock } from "@/components/ui/citation";
import { codeRefs } from "./codeRefs";

interface Props {
  title: string;
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function ForkChoice({ title, onCodeRef }: Props) {
  return (
    <section id="candidate-order" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">{title}</h2>

      <div
        id="best-update"
        className="prose prose-neutral max-w-none scroll-mt-24 dark:prose-invert"
      >
        <h3>Best update는 가장 높은 slot과 같지 않습니다</h3>
        <p>
          검증된 update가 여러 개 쌓이면 Helios는 먼저 2/3 여부를 비교합니다.
          둘 다 2/3 아래라면 참여가 많은 쪽을 고릅니다. 그다음 relevant next
          committee, finality 유무, 같은 committee period의 finality, 참여 수를
          차례로 비교합니다.
        </p>
        <p>
          여기까지 같을 때는 더 오래된 attested slot과 더 이른 signature slot을
          선호합니다. 같은 품질이라면 candidate가 계속 바뀌는 일을 줄이려는
          tie-break입니다. 이 함수는 검증된 light-client update 중 보존할 후보를
          고를 뿐, full node의 canonical chain fork choice를 대신하지 않습니다.
        </p>
      </div>

      <div className="not-prose mt-5">
        <CodeViewButton
          label="실제 best-update 비교 순서 보기"
          onClick={() =>
            onCodeRef("hl-best-update", codeRefs["hl-best-update"])
          }
        />
      </div>

      <div
        id="force-update"
        className="prose prose-neutral mt-10 max-w-none scroll-mt-24 dark:prose-invert"
      >
        <h3>Force update는 정상 경로와 안전성이 다릅니다</h3>
        <p>
          Finalized header가 sync-committee period 하나보다 오래 멈췄고
          <code>best_valid_update</code>가 남아 있으면 <code>force_update</code>가
          그 후보를 quorum 검사 없이 적용할 수 있습니다. 후보의 finalized
          header가 더 새롭지 않으면 attested header를 finalized 자리에도
          사용합니다.
        </p>
        <p>
          Source 주석도 유효한 update가 검열되고 있을 가능성이 없는 상황에서만
          신중하게 쓰라고 경고합니다. 이는 liveness escape hatch이지 normal
          2/3 finality와 같은 보장이 아닙니다. Endpoint 장애, 검열 가능성,
          restart와 rollback을 포함한 채택 판단은 설정·운영 글에서 별도로
          다룹니다.
        </p>
      </div>

      <div className="not-prose mt-5">
        <CodeViewButton
          label="실제 force-update 경고와 조건 보기"
          onClick={() =>
            onCodeRef("hl-force-update", codeRefs["hl-force-update"])
          }
        />
      </div>

      <div
        id="self-check"
        className="prose prose-neutral mt-12 max-w-none scroll-mt-24 dark:prose-invert"
      >
        <h3>이 글에서 확인할 수 있어야 하는 것</h3>
        <ol>
          <li>Optimistic 전진 조건과 2/3 full apply 조건을 구분할 수 있습니다.</li>
          <li>Period 0의 next K1이 period 1의 current가 되는 근거를 설명할 수 있습니다.</li>
          <li>Epoch 경계에서 반환된 checkpoint와 disk persistence를 구분할 수 있습니다.</li>
          <li>Best update ordering과 full-node fork choice가 다른 역할임을 설명할 수 있습니다.</li>
          <li>Force update를 normal finality와 같은 안전성으로 소개하지 않습니다.</li>
        </ol>
      </div>

      <div id="paper-helios-update-source" className="scroll-mt-24">
        <CitationBlock
          source="a16z/helios source snapshot 43a8c9f — consensus-core Store transition"
          href="https://github.com/a16z/helios/blob/43a8c9f3cdda41a6f383c4db41d9a83f102638b1/ethereum/consensus-core/src/consensus_core.rs"
          citeKey={1}
          type="code"
        >
          문제: 검증된 light-client update를 누적 Store에 반영하는 구현 경계.
          기여: best 후보, 참여 최댓값, optimistic·finalized header, committee
          handoff, checkpoint와 force update 순서를 보여 줍니다. 전제: commit,
          network preset과 fork config를 고정합니다. 근거 범위: 선택한 snapshot의
          메모리 상태 전이입니다. 주장하지 않는 것: Disk durability, restart
          recovery와 대상 환경 성능을 보장하지 않습니다.
        </CitationBlock>
      </div>

      <div id="paper-light-client-update-spec" className="scroll-mt-24">
        <CitationBlock
          source="Ethereum consensus-specs v1.6.1 — light-client sync protocol"
          href="https://github.com/ethereum/consensus-specs/blob/v1.6.1/specs/altair/light-client/sync-protocol.md"
          citeKey={2}
        >
          문제: Resource-limited client가 untrusted updates에서 safe
          optimistic·finalized header와 committee를 유지하는 문제. 기여:
          Update ranking, Store processing과 force-update 규칙을 실행 가능한
          pseudocode로 정의합니다. 전제: v1.6.1, 활성 fork·preset과 trusted
          Store를 고정합니다. 근거 범위: Light-client consensus state
          machine입니다. 주장하지 않는 것: Helios의 disk 저장·polling 방식이나
          execution validity를 정하지 않습니다.
        </CitationBlock>
      </div>
    </section>
  );
}
