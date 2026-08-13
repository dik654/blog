import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";

export default function BlstBinding({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="blst-binding" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        BLST binding은 byte ownership과 point validation을 native 연산 앞에서
        고정한다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Prysm의 Go layer는 consensus object와 domain, input length, 오류와
          cancellation을 관리하고 BLST는 compressed point decode, subgroup
          check, hash-to-curve, scalar multiplication과 pairing을 수행합니다.
          Binding은 단순 함수 호출 통로가 아니라 untrusted bytes가 cryptographic
          point로 승격되는 security boundary입니다.
        </p>
        <h3>48 bytes 또는 96 bytes라는 길이는 시작 조건일 뿐입니다</h3>
        <p>
          길이가 맞아도 field element가 canonical 범위를 벗어나거나 curve
          equation을 만족하지 않고, 올바른 prime-order subgroup에 없거나 point
          at infinity일 수 있습니다.{" "}
          <code>deserialize→key/signature validation→protocol API</code> 순서를
          유지하고 “decode 됨”과 “검증 가능한 key”를 다른 typed result로
          반환해야 합니다. All-zero input을 identity로 조용히 받아들이는 경로는
          모든 message에 대한 무의미한 관계를 만들 수 있어 fail-closed해야
          합니다.
        </p>
        <h3>메모리와 오류의 owner를 정합니다</h3>
        <p>
          Go slice가 native call 동안 이동·해제되지 않는지, C allocation을 누가
          해제하는지, panic·error·false를 어떻게 구분하는지, concurrent call이
          shared scratch state를 쓰는지 확인합니다. Batch input 하나가 invalid할
          때 전체 batch를 false로 돌려주는 API와 malformed encoding을 error로
          돌려주는 API를 하나의 bool로 뭉치면 장애 원인을 잃습니다.
        </p>
        <h3>성능 비교 전에 동일한 검증 범위를 맞춥니다</h3>
        <p>
          Base는 subgroup check를 포함하고 candidate는 trusted point를
          재사용하면 속도 비교가 아닙니다. 같은 CPU·instruction set, BLST
          commit, compiler flags, input cardinality, message-size distribution,
          deserialize/cache 포함 여부와 worker count를 고정해 단일·same-message
          aggregate·distinct-message batch를 분리 측정합니다.
        </p>
      </div>
      <div className="not-prose my-4 flex flex-wrap gap-3">
        {codeRefs["bls-sign"] && (
          <CodeViewButton
            onClick={() => onCodeRef("bls-sign", codeRefs["bls-sign"])}
          />
        )}
        {codeRefs["bls-verify"] && (
          <CodeViewButton
            onClick={() => onCodeRef("bls-verify", codeRefs["bls-verify"])}
          />
        )}
      </div>
    </section>
  );
}
