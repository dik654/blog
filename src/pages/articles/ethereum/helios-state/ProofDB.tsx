import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import { CitationBlock } from "@/components/ui/citation";
import { codeRefs } from "./codeRefs";

interface Props {
  title: string;
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function ProofDB({ title, onCodeRef }: Props) {
  return (
    <section id="proof-db" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">{title}</h2>

      <div
        id="proof-caching"
        className="prose prose-neutral max-w-none scroll-mt-24 dark:prose-invert"
      >
        <h3>Cache key는 값이 유효한 범위를 그대로 담습니다</h3>
        <p>
          현재 고정한 Helios source의 account cache key는
          <code>(address, block_hash)</code>입니다. Account는 block마다 바뀔 수
          있기 때문입니다. Storage proof는 먼저 <code>storage_hash</code>로
          나누고 그 안에서 <code>slot</code>을 찾습니다. Code는
          <code>code_hash</code> 하나로 찾습니다. 뒤의 두 값은 hash가 곧 내용을
          식별하므로 block이 달라도 같은 root·hash이면 재사용할 수 있습니다.
        </p>
        <p>
          Cache insert는 proof 검증 뒤에 호출되어야 합니다. Optimistic head가
          H1에서 H2로 바뀌면 H1 account를 H2 조회에 사용할 수 없습니다. 다만 H2
          account proof가 같은 storage root <code>S</code>나 code hash
          <code>C</code>를 다시 확인했다면, 이미 저장한 content-addressed 항목을
          조합할 수 있습니다. Address만 key로 쓰는 “latest account cache”는 이
          경계를 보존하지 못합니다.
        </p>
      </div>

      <div className="not-prose mt-5">
        <CodeViewButton
          label="실제 account·storage·code cache key 보기"
          onClick={() => onCodeRef("hl-state-cache", codeRefs["hl-state-cache"])}
        />
      </div>

      <div
        id="error-cases"
        className="prose prose-neutral mt-10 max-w-none scroll-mt-24 dark:prose-invert"
      >
        <h3>반환·정상 부재·검증 실패를 서로 바꾸지 않습니다</h3>
        <p>
          Empty value와 온전한 exclusion proof가 함께 오면 account·slot 부재를
          정상 결과로 다룰 수 있습니다. 하지만 wrong state root, 잘린 node
          배열, 잘못된 storage root, code hash mismatch는 검증 실패입니다. 이
          경우 원격 값은 typed Account로 반환되지 않고 cache에도 들어가지
          않아야 합니다.
        </p>
        <p>
          Proof가 성공해도 주장 범위는 <code>H</code>의 상태에 한정됩니다. H가
          현재 head인지, finalized인지, reorg로 교체됐는지는 consensus 쪽에서
          판단합니다. State proof가 provider의 가용성이나 최신성을 보증하는
          것도 아닙니다.
        </p>
      </div>

      <div
        id="self-check"
        className="prose prose-neutral mt-10 max-w-none scroll-mt-24 dark:prose-invert"
      >
        <h3>이 글에서 확인할 수 있어야 하는 것</h3>
        <ol>
          <li>Block H와 state root R이 서로 다른 identity인 이유를 설명할 수 있습니다.</li>
          <li>Account proof가 확인한 storage root만 다음 proof의 root로 쓰는 이유를 설명할 수 있습니다.</li>
          <li>Empty account·slot proof와 잘린 proof를 구분할 수 있습니다.</li>
          <li>Account·storage·code cache key가 서로 다른 이유를 설명할 수 있습니다.</li>
          <li>Proof 성공을 현재 head나 finality 보장으로 확대하지 않습니다.</li>
        </ol>
      </div>

      <div id="paper-eip1186-state-proof" className="scroll-mt-24">
        <CitationBlock
          source="EIP-1186 — eth_getProof"
          href="https://eips.ethereum.org/EIPS/eip-1186"
          citeKey={1}
        >
          문제: 원격 account·storage 값을 state root에 대조할 proof RPC가
          필요합니다. 기여: Account field, accountProof와 slot별 storageProof
          envelope을 정의합니다. 전제: 호출자가 신뢰하는 block·state root를
          별도로 확보합니다. 근거 범위: Proof 응답 형식과 부재 증명의 목적입니다.
          주장하지 않는 것: Provider 호환성, 현재 head와 finality를 보장하지
          않습니다.
        </CitationBlock>
      </div>

      <div id="paper-yellowpaper-state-trie" className="scroll-mt-24">
        <CitationBlock
          source="Ethereum Yellow Paper — pinned state-trie snapshot"
          href="https://github.com/ethereum/yellowpaper/blob/efc5f9a1f356cba376c978eedb63cb0363c2aa85/Paper.tex"
          citeKey={2}
        >
          문제: World state를 하나의 root로 commitment해야 합니다. 기여: Secure
          trie와 nonce·balance·storage root·code hash로 이루어진 account 구조를
          설명합니다. 전제: Canonical Keccak·RLP·trie encoding입니다. 근거 범위:
          State·account·storage commitment의 연결입니다. 주장하지 않는 것:
          Helios의 RPC 호출·cache 구현을 규정하지 않습니다.
        </CitationBlock>
      </div>

      <div id="paper-helios-proof-source" className="scroll-mt-24">
        <CitationBlock
          source="a16z/helios source snapshot 43a8c9f — proof, RPC provider and state cache"
          href="https://github.com/a16z/helios/tree/43a8c9f3cdda41a6f383c4db41d9a83f102638b1/core/src/execution"
          citeKey={3}
          type="code"
        >
          문제: Untrusted EIP-1186 응답을 검증된 typed Account로 바꾸고 안전하게
          재사용해야 합니다. 기여: Block-hash-pinned getProof, account·storage·code
          검증과 검증 후 cache identity를 보여 줍니다. 전제: Commit 43a8c9f3,
          해당 Alloy dependency와 network spec을 고정합니다. 근거 범위: 선택한
          snapshot의 구현입니다. 주장하지 않는 것: 대상 환경 성능, provider
          availability와 최신 head를 보장하지 않습니다.
        </CitationBlock>
      </div>
    </section>
  );
}
