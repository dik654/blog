import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function SignVerify({ onCodeRef }: Props) {
  return (
    <section id="sign-verify" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Sign, Verify & Aggregate</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-2 mb-3">
          Sign — 프로토콜 메시지에서 G2 서명으로
        </h3>
        <ol>
          <li>
            객체의 <code>hash_tree_root</code>와 consensus domain으로 signing
            root를 만든다.
          </li>
          <li>BLS ciphersuite의 DST를 사용해 메시지를 G2 point로 매핑한다.</li>
          <li>
            비밀키 스칼라 곱을 수행하고 point를 canonical 96-byte 형식으로
            압축한다.
          </li>
        </ol>
        <p className="leading-7">
          consensus domain과 ciphersuite DST는 둘 다 “domain”이라 불리지만
          계층이 다르다. 전자는 포크·네트워크·서명 목적을 signing root에 묶고,
          후자는 hash-to-curve의 암호학적 메시지 공간을 분리한다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          Verify — 역직렬화 검증이 먼저다
        </h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">입력 검사</h4>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>압축 형식과 canonical encoding</li>
              <li>curve·subgroup membership</li>
              <li>API가 요구하는 infinity 처리</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">관계 검사</h4>
            <p className="text-xs text-muted-foreground">
              <code>e(G1, sig) = e(pk, H(msg))</code>에 해당하는 pairing
              product를 계산해 같은 비밀키 관계를 확인한다.
            </p>
          </div>
        </div>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton
            onClick={() => onCodeRef("bls-verify", codeRefs["bls-verify"])}
          />
          <span className="text-xs text-muted-foreground self-center">
            Verify()
          </span>
          <CodeViewButton
            onClick={() =>
              onCodeRef("bls-fast-agg-verify", codeRefs["bls-fast-agg-verify"])
            }
          />
          <span className="text-xs text-muted-foreground self-center">
            FastAggregateVerify()
          </span>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          Aggregate — 압축과 검증 조건을 분리
        </h3>
        <p className="leading-7">
          서명 집계는 G2 point 덧셈이고 결과는 여전히 하나의 압축 서명이다. 동일
          메시지라면 공개키를 집계하는 FastAggregateVerify 경로를 사용할 수
          있지만, 서로 다른 메시지라면 각 <code>(public key, message)</code>{" "}
          쌍을 보존하는 AggregateVerify 계열이 필요하다.
        </p>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-4">
            <h4 className="font-semibold text-sm mb-2">같은 메시지</h4>
            <p className="text-xs text-muted-foreground">
              등록된 PoP 등 프로토콜 전제를 확인하고 공개키 집계 + aggregate
              signature 검증을 수행한다.
            </p>
          </div>
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
            <h4 className="font-semibold text-sm mb-2">서로 다른 메시지</h4>
            <p className="text-xs text-muted-foreground">
              메시지별 공개키 관계를 유지하고 구현이 제공하는 안전한 aggregate
              또는 batch 검증 경로를 사용한다.
            </p>
          </div>
        </div>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          “pairing 한 번” 같은 표현은 수학식의 항, library API 호출, Miller
          loop와 final exponentiation 묶음을 혼동하기 쉽다. 이 글은 API 조건과
          결과를 중심으로 설명하고 특정 연산 횟수·시간을 보편 성능으로 제시하지
          않는다.
        </p>
      </div>
    </section>
  );
}
