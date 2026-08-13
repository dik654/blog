import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import GenesisViz from "./viz/GenesisViz";
import { codeRefs } from "./codeRefs";

export default function Genesis({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);

  return (
    <section id="genesis" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Genesis JSON은 parse 결과가 아니라 재계산 가능한 block 0 commitment다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Genesis alloc은 address별 balance·nonce·code·storage를 기술합니다.
          구현은 이를 canonical account와 trie key/value로 바꿔 state root를
          계산하고, genesis 시점에 활성인 fork rule로 base fee·withdrawals·blob
          관련 조건부 header field를 채운 뒤 sealed header hash를 만듭니다.
          Input byte를 읽었다는 사실보다 이 derivation이 모든 node에서 같다는
          점이 중요합니다.
        </p>
      </div>

      <GenesisViz onOpenCode={open} />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>한 계정 차이가 왜 chain을 바꾸는지 단계별로 추적합니다</h3>
        <p>
          Alice의 초기 balance가 100에서 101로 바뀌면 account encoding이
          달라지고 해당 trie path와 state root가 달라집니다. Header의 state
          root가 바뀌므로 canonical header encoding과 genesis hash도 달라집니다.
          Chain ID를 그대로 두어도 두 database는 같은 chain state를 공유하지
          않으며, expected genesis hash와 기존 database identity가 다르면
          fail-closed해야 합니다.
        </p>
        <h3>Conditional field도 genesis context에서 rule을 따릅니다</h3>
        <p>
          Custom development chain이 어떤 fork를 block 0 또는 timestamp 0에
          활성화했다면 그 fork가 요구하는 genesis header semantics를 적용해야
          합니다. Mainnet field 목록을 그대로 복사하거나 최신 fork field를
          언제나 채우면 다른 hash가 나올 수 있습니다. Parser output,
          active-at-genesis decisions, state root, sealed header와 expected
          hash를 하나의 receipt로 보존합니다.{" "}
          <CodeViewButton onClick={() => open("make-genesis")} />
        </p>
        <h3>Release matrix는 rule selection과 identity를 먼저 고정합니다</h3>
        <p>
          Base와 candidate에 같은 raw genesis bytes와 chain spec을 주고 alloc
          순서 변경, duplicate/invalid field, boundary fork, wrong expected
          hash, existing database mismatch와 restart를 주입합니다. Parse error
          class, derived state root·genesis hash, fork decision·fork ID와
          downstream validator/EVM/payload decision parity가 모두 맞은 뒤 성능을
          비교합니다. 실패 시 이전 binary·config와 호환 storage snapshot으로
          되돌리고 migration receipt를 남깁니다.
        </p>
      </div>

      <div
        id="paper-reth-chainspec-source"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          공식 source 읽기 · genesis derivation
        </p>
        <p className="mt-2 text-sm font-semibold">
          reth-chainspec source and crate documentation
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          문제는 Genesis에서 ChainSpec과 sealed header가 만들어지는 실제 release
          경로를 확인하는 것입니다. Source는 parser·builder· header
          construction을 보여 주지만, custom input의 경제적 안전성이나 다른
          client와의 상호운용을 자동으로 검증하지는 않습니다.
        </p>
        <a
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
          href="https://reth.rs/docs/reth_ethereum/chainspec/index.html"
          target="_blank"
          rel="noreferrer"
        >
          공식 chainspec module 보기
        </a>
      </div>
    </section>
  );
}
