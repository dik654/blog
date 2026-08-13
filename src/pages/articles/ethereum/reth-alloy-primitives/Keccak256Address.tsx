import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";
import Keccak256Viz from "./viz/Keccak256Viz";

export default function Keccak256Address({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="keccak256-address" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Keccak-256과 주소 유도</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          Ethereum이 사용하는 hash는 표준 SHA3-256과 padding이 다른
          Keccak-256이다. Alloy의 <code>keccak256</code> helper는 결과를
          B256으로 돌려줘 길이와 downstream 타입을 고정한다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">EOA 주소</h3>
        <ol>
          <li>
            secp256k1 public key를 uncompressed 좌표 64 bytes로 표현한다. 형식
            prefix는 hash 입력에서 제외한다.
          </li>
          <li>64 bytes의 Keccak-256을 계산한다.</li>
          <li>32-byte digest의 마지막 20 bytes를 Address로 사용한다.</li>
        </ol>
        <p className="leading-7">
          이 과정은 주소 유도이지 checksum 문자열 encoding은 아니다. EIP-55
          표기는 같은 20-byte 주소를 사람이 입력할 때 오타를 감지하기 위한 별도
          표현 계층이다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">CREATE와 CREATE2</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">CREATE</h4>
            <p className="text-xs text-muted-foreground">
              <code>keccak256(rlp([sender, nonce]))[12..]</code>. sender nonce가
              주소 입력에 포함된다.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">CREATE2</h4>
            <p className="text-xs text-muted-foreground">
              <code>
                keccak256(0xff ++ sender ++ salt ++ keccak256(init_code))[12..]
              </code>
              . salt와 init code hash로 사전 계산 가능하다.
            </p>
          </div>
        </div>
        <p className="leading-7">
          두 방식 모두 마지막 20 bytes를 취하지만 입력 domain이 다르다. 특히
          CREATE2는 runtime bytecode가 아니라 <code>init_code</code>의 hash를
          사용한다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">구현 체크포인트</h3>
        <ul>
          <li>Keccak-256과 SHA3-256을 바꾸어 쓰지 않는다.</li>
          <li>
            public key prefix 포함 여부와 20-byte slice 위치를 test vector로
            고정한다.
          </li>
          <li>
            CREATE의 nonce RLP와 CREATE2의 salt 32-byte 길이를 각각 검증한다.
          </li>
          <li>
            hash throughput은 CPU와 backend에 따라 benchmark하고 protocol
            correctness와 분리한다.
          </li>
        </ul>
      </div>
      <div className="not-prose">
        <Keccak256Viz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
    </section>
  );
}
