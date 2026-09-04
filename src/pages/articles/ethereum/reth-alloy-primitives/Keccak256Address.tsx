import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";

export default function Keccak256Address({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="keccak256-address" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Hash가 같으려면 입력 bytes와 domain 조립 순서가 먼저 같아야 한다</h2>
      <div className="not-prose my-5 flex flex-wrap gap-2">
        <CodeViewButton onClick={() => onCodeRef("keccak-hash", codeRefs["keccak-hash"])} />
        <CodeViewButton onClick={() => onCodeRef("create2-address", codeRefs["create2-address"])} />
      </div>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Keccak-256은 임의 bytes를 32-byte digest로 바꾸지만 입력의 의미를 알지 못합니다. CREATE address는 RLP(sender, nonce)를,
          CREATE2는 0xff || sender || salt || keccak(init_code)를 hash한 뒤 마지막 20 bytes를 취합니다. 같은 sender라도 nonce와 salt,
          init code domain을 섞으면 전혀 다른 주소가 됩니다.
        </p>
        <p>
          Worked example receipt에는 algorithm 이름을 단순히 “SHA3”로 쓰지 않습니다. Keccak-256과 domain prefix, 각 field의
          exact bytes와 order를 적고 32-byte digest, 취한 [12..32) range까지 남깁니다. Hash collision resistance는 잘못 조립한
          입력이나 다른 schema를 구분해 주지 않으므로 canonical encoding과 domain separation이 먼저입니다.
        </p>
      </div>
    </section>
  );
}
