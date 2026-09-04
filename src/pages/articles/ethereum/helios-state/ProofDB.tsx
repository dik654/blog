import type { CodeRef } from "@/components/code/types";

interface Props {
  title: string;
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function ProofDB({ title, onCodeRef: _onCodeRef }: Props) {
  return (
    <section id="proof-db" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">{title}</h2>

      <div
        id="proof-caching"
        className="prose prose-neutral max-w-none scroll-mt-24 dark:prose-invert"
      >
        <h3>Cache key는 데이터가 유효한 identity 축을 그대로 따라갑니다</h3>
        <p>
          Helios 0.11.1 account-proof cache는 <code>(address, block_hash)</code>
          로 key를 만들고, storage proof는 content-addressed{" "}
          <code>(storage_root, slot)</code>, code는 <code>code_hash</code>로
          재사용합니다. Account balance는 block마다 바뀔 수 있지만 같은 storage
          root의 같은 slot과 같은 code hash의 bytecode는 content가 같기
          때문입니다.
        </p>
        <p>
          “Latest account”처럼 root가 없는 key는 reorg 뒤 stale 값을 현재 값으로 오인하게 합니다. Optimistic head가 H1에서 H2로 바뀌면 H1
          account cache는 H2 조회에 쓰지 않고 H2 account proof가 같은 storage/code hash를 다시 확인한 경우에만 content-addressed
          항목을 안전하게 조합합니다.
        </p>
      </div>

      <div
        id="error-cases"
        className="prose prose-neutral max-w-none scroll-mt-24 dark:prose-invert"
      >
        <h3>실패는 값 없음·proof 없음·anchor 불일치로 나눕니다</h3>
        <p>
          Empty branch로 증명된 account/slot 부재는 정상 결과 0 또는 empty account로 해석할 수 있지만 missing node·wrong hash·non-
          canonical RLP·잘못된 storageRoot·codeHash mismatch는 검증 실패입니다. Header H와 proof가 서로 다른 block을 가리키거나
          optimistic cache generation이 바뀌어도 fail closed하고 구체적인 H·R·address·slot·첫 divergent node를 receipt에
          남깁니다.
        </p>
        <h3>Release gate는 implementation snapshot보다 넓은 운영 계약입니다</h3>
        <p>
          Helios 0.11.1 source는 현재 검증·cache 구현의 증거이고 배포 gate는 별도 hardening 계약입니다. Existing/non-existing
          account와 slot, branch·extension·leaf, inline/hash 경계, malformed/truncated RLP, wrong
          state/storage/code root, optimistic reorg와 cache eviction을 base/candidate에 넣어 value·error·cache-hit
          identity parity를 먼저 확인한 뒤 proof bytes·latency·memory를 비교합니다.
        </p>
      </div>
    </section>
  );
}
