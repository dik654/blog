import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";

export default function Primitives({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="primitives" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">같은 32바이트라도 해시와 숫자는 다른 값입니다</h2>
      <div className="not-prose my-5 flex flex-wrap gap-2">
        <CodeViewButton onClick={() => onCodeRef("primitives-addr", codeRefs["primitives-addr"])} />
        <CodeViewButton onClick={() => onCodeRef("primitives-u256", codeRefs["primitives-u256"])} />
      </div>

      <div className="not-prose my-6 grid gap-px bg-border p-px sm:grid-cols-3" aria-label="Address B256 U256 비교">
        {[
          ["Address", "20바이트", "계정·계약의 식별자", "체크섬 표시 · 주소 생성"],
          ["B256", "32바이트", "해시처럼 해석하지 않는 고정 바이트", "비교 · map key · digest 보관"],
          ["U256", "256비트", "0부터 2²⁵⁶−1까지의 정수", "덧셈 · 곱셈 · 크기 비교"],
        ].map(([name, width, meaning, operations]) => (
          <article key={name} className="min-w-0 bg-background p-4">
            <div className="flex items-baseline justify-between gap-2">
              <strong className="font-mono text-sm">{name}</strong>
              <span className="text-[10px] font-bold text-primary">{width}</span>
            </div>
            <p className="mt-3 break-keep text-xs font-semibold leading-5">{meaning}</p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">{operations}</p>
          </article>
        ))}
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          <code>B256</code>과 <code>U256</code>은 둘 다 32바이트에 들어갈 수 있지만 같은 타입이 아닙니다. B256은 바이트열이고
          U256은 산술 값입니다. 해시에 1을 더하거나 잔액을 opaque bytes로 다루는 실수를 막으려면 폭뿐 아니라 허용 연산까지
          타입에서 나눠야 합니다.
        </p>
        <p>
          Reth v2.8.1이 사용하는 alloy-primitives 1.6.1에서 B256은 <code>FixedBytes&lt;32&gt;</code>의 별칭이고,
          Address는 <code>FixedBytes&lt;20&gt;</code>을 감싼 별도 타입입니다. U256은 ruint의 64비트 limb 네 개로 구성된 정수
          별칭입니다. 내부 크기가 같다는 사실을 wire encoding이 같다는 뜻으로 확대하면 안 됩니다.
        </p>
      </div>
    </section>
  );
}
