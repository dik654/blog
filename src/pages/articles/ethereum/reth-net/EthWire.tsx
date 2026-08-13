import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";

const FLOWS = [
  [
    "Status",
    "compatibility gate",
    "Network·genesis·fork/head context를 검증해 ETH data path를 엽니다.",
  ],
  [
    "Announcement",
    "bounded push",
    "Hash·metadata로 새 object의 존재를 알리고 receiver가 dedupe·policy를 적용합니다.",
  ],
  [
    "Request",
    "correlated pull",
    "Request ID·range·limit와 함께 필요한 headers·bodies·transactions를 요구합니다.",
  ],
  [
    "Response",
    "validated result",
    "ID·size·type·content를 확인한 뒤 downloader·transaction manager에 전달합니다.",
  ],
] as const;

export default function EthWire({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="eth-wire" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        ETH wire는 version 목록보다 Status·announcement·request/response의
        역할이 먼저다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          ETH subprotocol version은 message와 field가 추가될 수 있는 negotiated
          schema입니다. 특정 시점의
          <code>eth/68</code>을 영구 current version처럼 쓰지 않고 session
          receipt에 실제 선택된 version을 남깁니다. 안정적인 reasoning 축은
          Status가 compatibility를 검사하고, announcement가 존재를 push하며,
          request/response가 필요한 bytes를 제한된 범위로 pull한다는 역할
          분리입니다.
        </p>
      </div>

      <div className="not-prose my-8 grid min-w-0 gap-5 md:grid-cols-2">
        {FLOWS.map(([name, role, body]) => (
          <article key={name} className="min-w-0 border-t border-border pt-4">
            <p className="font-mono text-xs font-semibold text-primary">
              {name}
            </p>
            <p className="mt-2 text-sm font-bold">{role}</p>
            <p className="mt-2 break-words text-xs leading-5 text-muted-foreground">
              {body}
            </p>
          </article>
        ))}
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Announcement를 full broadcast와 혼동하지 않습니다</h3>
        <p>
          Transaction hash announcement를 받은 node는 known set과 policy로
          dedupe한 뒤 필요한 object만 요청합니다. 모든 peer에 full transaction을
          보내거나 announcement를 받은 즉시 txpool에 넣는다고 가정하면
          bandwidth와 validation budget이 무제한인 것처럼 설계하게 됩니다. Hash
          count, advertised size·type, response bytes, inflight request와
          per-peer channel을 제한하고 malformed·unsolicited·duplicate response를
          별도 reason으로 버립니다.
        </p>
        <h3>Backpressure는 성능 옵션이 아니라 memory safety 경계입니다</h3>
        <p>
          Peer가 response를 소비하는 속도보다 message를 빨리 보내면 unbounded
          queue는 memory exhaustion으로 이어집니다. Bounded channel이 찼을 때
          pause, drop, disconnect 중 어느 정책을 쓸지 message class별로 정하고,
          gossip loss와 request correctness를 구분합니다. Current Reth release의
          queue size와 policy는 config·source snapshot에 귀속하며 고정 숫자로
          일반화하지 않습니다.{" "}
          <CodeViewButton
            onClick={() => onCodeRef("net-eth-wire", codeRefs["net-eth-wire"])}
          />
        </p>
      </div>

      <div
        id="paper-devp2p-eth"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          공식 규격 읽기 · ETH message semantics
        </p>
        <p className="mt-2 text-sm font-semibold">
          Ethereum Wire Protocol (eth)
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          문제는 Status와 block·transaction message의 versioned wire semantics를
          정의하는 것입니다. 규격은 field·request·response contract를 제공하지만
          local queue limit·peer scoring·sync strategy나 received block의
          validity를 대신 정하지 않습니다.
        </p>
        <a
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
          href="https://github.com/ethereum/devp2p/blob/master/caps/eth.md"
          target="_blank"
          rel="noreferrer"
        >
          ETH wire 규격 보기
        </a>
      </div>
    </section>
  );
}
