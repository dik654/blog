import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";

export default function Keccak256Address({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="keccak256-address" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">해시는 확정된 23바이트만 입력으로 받습니다</h2>
      <div className="not-prose my-5 flex flex-wrap gap-2">
        <CodeViewButton onClick={() => onCodeRef("keccak-hash", codeRefs["keccak-hash"])} />
        <CodeViewButton onClick={() => onCodeRef("address-create", codeRefs["address-create"])} />
      </div>

      <div className="not-prose my-6 grid gap-px bg-border p-px" aria-label="RLP에서 CREATE 주소까지의 바이트 변화">
        <div className="min-w-0 bg-background p-4 sm:p-5">
          <p className="text-[10px] font-bold text-muted-foreground">Keccak-256 입력 · 23바이트</p>
          <p className="mt-2 break-all font-mono text-[11px] font-bold leading-5">d694b20a608c624ca5003905aa834de7156c68b2e1d001</p>
        </div>
        <div className="min-w-0 bg-background p-4 sm:p-5">
          <p className="text-[10px] font-bold text-muted-foreground">B256 digest · 32바이트</p>
          <p className="mt-2 break-all font-mono text-[11px] font-bold leading-5">c71d864bc265f58febf32269<span className="text-primary">e33c6e89e69d085897f98e92b06ebd541d1daa99</span></p>
        </div>
        <div className="min-w-0 bg-background p-4 sm:p-5">
          <p className="text-[10px] font-bold text-muted-foreground">새 Address · 마지막 20바이트</p>
          <p className="mt-2 break-all font-mono text-sm font-black text-primary">0xe33c6e89e69d085897f98e92b06ebd541d1daa99</p>
        </div>
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          <code>Address::create</code>는 RLP 목록을 만든 뒤 그 전체를 Keccak-256에 넣고 digest의 <code>[12..32]</code>, 즉 마지막
          20바이트를 <code>Address</code>로 바꿉니다. 위의 digest와 주소는 공식 예시의 sender·nonce를 사용해 다시 계산한 값입니다.
        </p>
        <p>
          Keccak-256은 입력이 무엇을 뜻하는지 모릅니다. sender와 nonce의 순서를 뒤집거나 nonce를 불필요하게 길게 적어도 해시는
          32바이트 결과를 냅니다. 그래서 해시 함수의 안전성보다 먼저, 어느 문맥의 어떤 필드를 어떤 순서와 인코딩으로 조립했는지를
          고정해야 합니다. CREATE2는 RLP가 아니라 <code>0xff || sender || salt || keccak(init_code)</code>를 사용하므로 별개의
          입력 규칙입니다.
        </p>
      </div>
    </section>
  );
}
