import ContentBoundary from "@/components/articles/content-boundary";
import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import ContextViz from "./viz/ContextViz";
import { codeRefs } from "./codeRefs";
import RethAlloyPrimitivesLocator from "./RethAlloyPrimitivesLocator";

const BOUNDARIES = [
  {
    owner: "타입",
    input: "20바이트 · 숫자 1",
    guarantees: "폭과 허용 연산",
    doesNotKnow: "어떤 wire 형식으로 보낼지",
  },
  {
    owner: "RLP",
    input: "Address · nonce",
    guarantees: "문자열·목록과 길이의 한 표현",
    doesNotKnow: "필드가 sender인지 nonce인지",
  },
  {
    owner: "정확한 복원",
    input: "23바이트 RLP",
    guarantees: "전체 입력 소비와 원래 두 값",
    doesNotKnow: "그 값이 유효한 거래인지",
  },
  {
    owner: "Keccak-256",
    input: "확정된 23바이트",
    guarantees: "같은 입력의 같은 32바이트 digest",
    doesNotKnow: "입력 조립 순서가 옳은지",
  },
] as const;

export default function Overview({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);

  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <RethAlloyPrimitivesLocator />

      <h2 className="mb-6 text-2xl font-bold">
        타입과 바이트가 같아야 모든 노드가 같은 주소를 계산합니다
      </h2>
      <ContextViz />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          보내는 주소 <code>0xb20a…e1d0</code>와 nonce 1로 새 계약 주소를 만든다고 하겠습니다. Alloy는 주소를 정확히
          20바이트인 <code>Address</code>로 받고 nonce를 숫자로 받습니다. 두 값을 RLP 목록으로 바꾸면
          <code>d6 94 b20a…e1d0 01</code>이라는 23바이트가 됩니다.
        </p>
        <p>
          이 바이트를 Keccak-256에 넣으면 <code>c71d…daa99</code>가 나오고, 마지막 20바이트
          <code>e33c…daa99</code>가 새 주소가 됩니다. 이 결과는 alloy-primitives 1.6.1의 공식 예시와 같습니다.
          숫자나 필드 순서, 길이 표시가 하나라도 달라지면 다른 입력이므로 다른 주소가 나옵니다.
        </p>
        <p>
          이 글은 이 한 경로를 확대해 <strong>타입이 지키는 의미, RLP가 지키는 한 가지 표현, 디코더가 확인하는 소비 범위,
          해시가 받는 정확한 바이트</strong>를 나눕니다. Reth v2.8.1이 고정한 alloy-primitives 1.6.1과
          alloy-rlp 0.3.16을 기준으로 합니다.
        </p>
      </div>

      <ContentBoundary article="reth-alloy-primitives" />

      <h2 className="mb-6 mt-12 text-2xl font-bold">
        각 단계는 자기 경계만 보장합니다
      </h2>
      <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-2" aria-label="타입과 직렬화 경계의 책임">
        {BOUNDARIES.map((boundary) => (
          <article key={boundary.owner} className="min-w-0 bg-background p-4 sm:p-5">
            <div className="flex items-baseline justify-between gap-3">
              <strong className="text-sm">{boundary.owner}</strong>
              <span className="text-[10px] font-bold text-muted-foreground">입력 · {boundary.input}</span>
            </div>
            <dl className="mt-4 grid gap-3 text-xs leading-5">
              <div>
                <dt className="font-bold text-primary">확인하는 것</dt>
                <dd className="mt-1 text-muted-foreground">{boundary.guarantees}</dd>
              </div>
              <div>
                <dt className="font-bold">확인하지 못하는 것</dt>
                <dd className="mt-1 text-muted-foreground">{boundary.doesNotKnow}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>

      <div className="not-prose my-5 flex flex-wrap gap-2">
        <CodeViewButton onClick={() => open("address-create")} />
        <CodeViewButton onClick={() => open("fixed-bytes-struct")} />
        <CodeViewButton onClick={() => open("rlp-decode-exact")} />
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          <code>Address</code>가 20바이트라는 사실은 RLP 목록의 필드 순서를 정하지 않습니다. RLP 헤더가 올바르다는 사실은
          그 객체가 실행 규칙에 맞는 계약 생성인지 판단하지 않습니다. Keccak-256도 잘못 조립한 입력을 고쳐 주지 않습니다.
          그래서 검증은 한 번에 끝나는 절차가 아니라 경계마다 다른 질문을 통과하는 과정입니다.
        </p>
      </div>

      <div id="paper-alloy-primitives-source" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">[O] 공식 문서 · alloy-primitives 1.6.1</p>
        <p className="mt-2 text-sm font-semibold">Address·B256·U256과 CREATE 주소 계산</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          고정 릴리스의 공개 타입과 <code>Address::create</code> 구현을 근거로 사용합니다. 타입의 존재가 상위 객체의 필드 순서나
          전체 프로토콜 유효성까지 보장한다는 뜻은 아닙니다.
        </p>
        <a
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
          href="https://docs.rs/alloy-primitives/1.6.1/alloy_primitives/"
          target="_blank"
          rel="noreferrer"
        >
          alloy-primitives 1.6.1 문서 보기
        </a>
      </div>

      <div id="paper-ethereum-rlp-spec" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">[O] 공식 규격 · Ethereum RLP</p>
        <p className="mt-2 text-sm font-semibold">문자열·목록의 길이와 한 가지 바이트 표현</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          RLP 규격은 바이트 문자열과 목록의 prefix·길이를 정합니다. sender·nonce 같은 필드 의미와 순서는 상위 객체가 정합니다.
        </p>
        <a
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
          href="https://ethereum.org/developers/docs/data-structures-and-encoding/rlp/"
          target="_blank"
          rel="noreferrer"
        >
          Ethereum RLP 규격 보기
        </a>
      </div>

      <div id="paper-reth-alloy-source" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">[O] 공식 소스 · Reth v2.8.1</p>
        <p className="mt-2 text-sm font-semibold">Reth가 고정한 Alloy 버전</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Reth v2.8.1의 Cargo.toml은 alloy-primitives 1.6.1과 alloy-rlp 0.3.16을 지정합니다. 이 글의 구현 설명은 이 두 버전과
          각 crate에 기록된 소스 커밋에 한정합니다.
        </p>
        <a
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
          href="https://github.com/paradigmxyz/reth/blob/v2.8.1/Cargo.toml#L240-L247"
          target="_blank"
          rel="noreferrer"
        >
          Reth v2.8.1 의존성 보기
        </a>
      </div>
    </section>
  );
}
