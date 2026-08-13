import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";
import { BROADCAST_TYPES, ETH_MESSAGES } from "./EthWireData";

export default function EthWire({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="eth-wire" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        ETH wire: version보다 안정적인 message semantics
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <div className="not-prose mb-4 flex flex-wrap gap-2">
          <CodeViewButton
            onClick={() => onCodeRef("net-eth-wire", codeRefs["net-eth-wire"])}
          />
          <span className="self-center text-xs text-muted-foreground">
            버전별 message enum을 보는 축약 코드
          </span>
        </div>
        <h3>배경</h3>
        <p>
          ETH subprotocol은 chain synchronization과 transaction exchange를
          동시에 수행한다. 연결이 성립하면 Status를 먼저 교환하고, 이후
          request/response와 unsolicited announcement를 섞어 쓴다.
        </p>
        <h3>문제</h3>
        <p>
          메시지 이름만 나열하면 “왜 해시를 먼저 알리고 본문을 나중에 받는가”가
          보이지 않는다. 반대로
          <code>eth/68</code>을 현재 버전으로 고정하면 이후 receipt pagination,
          block range나 blob cell relay가 추가된 버전을 설명할 수 없다.
        </p>
        <h3>아이디어</h3>
        <p>
          안정적인 축은 세 가지다. Status는 compatibility gate, 요청-응답은
          필요한 데이터의 pull, announcement는 새 block·transaction의 존재를
          알리는 push다. protocol version은 이 축에 field와 message를 추가하는
          negotiated schema로 본다.
        </p>
        <h3>구현</h3>
        <p>
          transaction announcement를 받은 노드는 이미 아는 hash를 제거하고
          필요한 항목만
          <code>GetPooledTransactions</code>로 요청한다. eth/68에서 type과
          encoded transaction size가 추가됐지만 이 size는 blob sidecar 전체
          크기라는 뜻이 아니다. full transaction을 직접 보낼 피어의 비율과
          response limit도 client policy이므로 고정 공식으로 일반화하지 않는다.
        </p>
      </div>

      <h3 className="mb-3 text-lg font-semibold">요청-응답 경로</h3>
      <div className="not-prose mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {ETH_MESSAGES.map((message) => (
          <article
            key={message.id}
            className="rounded-xl border border-border/70 bg-card p-4"
          >
            <p
              className="font-mono text-xs font-bold"
              style={{ color: message.color }}
            >
              {message.request} → {message.response}
            </p>
            <p className="mt-1 text-sm font-medium text-foreground/70">
              {message.purpose}
            </p>
            <p className="mt-2 text-xs leading-5 text-foreground/55">
              {message.details}
            </p>
          </article>
        ))}
      </div>

      <h3 className="mb-3 text-lg font-semibold">Announcement 경로</h3>
      <div className="not-prose space-y-2">
        {BROADCAST_TYPES.map((item) => (
          <div
            key={item.name}
            className="rounded-lg border border-border/60 px-4 py-3"
          >
            <p className="font-mono text-xs font-semibold text-foreground/75">
              {item.name}
            </p>
            <p className="mt-1 text-xs leading-5 text-foreground/55">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
