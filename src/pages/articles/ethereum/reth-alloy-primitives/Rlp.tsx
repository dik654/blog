import CodeViewButton from "@/components/code/CodeViewButton";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";

export default function Rlp({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="rlp" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">RLP는 두 필드를 23바이트 목록 하나로 만듭니다</h2>
      <div className="not-prose my-5 flex flex-wrap gap-2">
        <CodeViewButton onClick={() => onCodeRef("rlp-header", codeRefs["rlp-header"])} />
        <CodeViewButton onClick={() => onCodeRef("rlp-integer", codeRefs["rlp-integer"])} />
        <CodeViewButton onClick={() => onCodeRef("address-create", codeRefs["address-create"])} />
      </div>

      <div className="not-prose my-6 grid gap-px bg-border p-px sm:grid-cols-[minmax(0,1fr)_5rem_minmax(0,1fr)]" aria-label="CREATE 입력의 RLP 구성">
        <div className="min-w-0 bg-background p-4">
          <p className="text-[10px] font-bold text-muted-foreground">주소 필드 · 21바이트</p>
          <p className="mt-2 font-mono text-sm font-black"><span className="text-primary">94</span> b20a…e1d0</p>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">0x94 = 0x80 + payload 20바이트</p>
        </div>
        <div className="min-w-0 bg-background p-4 text-center">
          <p className="text-[10px] font-bold text-muted-foreground">nonce</p>
          <p className="mt-2 font-mono text-sm font-black text-primary">01</p>
          <p className="mt-2 text-xs text-muted-foreground">1바이트</p>
        </div>
        <div className="min-w-0 bg-background p-4">
          <p className="text-[10px] font-bold text-muted-foreground">목록 전체 · 23바이트</p>
          <p className="mt-2 break-all font-mono text-[11px] font-black leading-5"><span className="text-primary">d6</span> 94b20a608c624ca5003905aa834de7156c68b2e1d001</p>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">0xd6 = 0xc0 + payload 22바이트</p>
        </div>
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          RLP는 바이트 문자열과 목록의 길이를 적습니다. 보내는 주소가 20바이트라는 사실은 <code>0x94</code>로, 두 필드의 payload가
          22바이트라는 사실은 <code>0xd6</code>으로 나타납니다. nonce 1은 <code>0x00..0x7f</code> 범위의 한 바이트라 별도 길이 표시
          없이 <code>0x01</code> 그대로 씁니다.
        </p>
        <p>
          상위 필드가 양의 정수를 요구할 때는 앞쪽의 불필요한 0을 제거한 unsigned big-endian 바이트만 허용합니다. 예를 들어 1024는
          <code>0x04 00</code>이므로 <code>0x82 04 00</code>입니다. <code>0x83 00 04 00</code>은 바이트 문자열로는
          표현할 수 있지만 정수 1024의 표준 표현은 아니므로 <code>u64</code> 복원 단계에서 <code>LeadingZero</code>로 거절됩니다.
        </p>
        <p>
          다만 RLP는 첫 필드가 sender이고 두 번째가 nonce라는 의미를 모릅니다. 그 순서는 <code>Address::create</code>가 소유합니다.
          바이트 문법과 객체 의미를 한 계층으로 합치면, 문법상 올바르지만 필드 순서가 뒤바뀐 입력을 걸러낼 곳이 사라집니다.
        </p>
      </div>
    </section>
  );
}
