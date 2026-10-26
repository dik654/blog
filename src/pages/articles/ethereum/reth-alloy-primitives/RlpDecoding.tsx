import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";

export default function RlpDecoding({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="rlp-decoding" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">복원은 값뿐 아니라 남은 바이트까지 확인해야 끝납니다</h2>
      <div className="not-prose my-5 flex flex-wrap gap-2">
        <CodeViewButton onClick={() => onCodeRef("rlp-header", codeRefs["rlp-header"])} />
        <CodeViewButton onClick={() => onCodeRef("rlp-decode-exact", codeRefs["rlp-decode-exact"])} />
      </div>

      <div className="not-prose my-6 grid gap-px bg-border p-px sm:grid-cols-3" aria-label="RLP 복원 성공과 실패 비교">
        {[
          ["d6 94…01", "성공", "목록 길이와 두 필드가 맞고 남은 바이트가 0"],
          ["81 01", "거절", "01 한 바이트로 쓸 수 있어 더 긴 표현은 비표준"],
          ["b8 02 aa", "거절", "payload 2바이트를 선언했지만 1바이트만 남음"],
        ].map(([bytes, result, reason], index) => (
          <article key={bytes} className="min-w-0 bg-background p-4">
            <div className="flex items-baseline justify-between gap-2">
              <code className="text-xs font-black">{bytes}</code>
              <strong className={`text-[10px] ${index === 0 ? "text-primary" : "text-destructive"}`}>{result}</strong>
            </div>
            <p className="mt-3 text-xs leading-5 text-muted-foreground">{reason}</p>
          </article>
        ))}
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          alloy-rlp 0.3.16의 <code>Header::decode</code>는 첫 바이트에서 문자열인지 목록인지와 payload 길이를 읽습니다. 남은 입력이
          선언 길이보다 짧으면 <code>InputTooShort</code>를 반환하고, 한 바이트로 쓸 수 있는 값을 더 긴 형식으로 적으면
          <code>NonCanonicalSingleByte</code>를 반환합니다.
        </p>
        <p>
          일반 <code>Decodable::decode</code>는 입력 slice를 앞으로 이동시키며 객체 하나를 읽을 수 있습니다. 전체 입력이 객체 하나여야
          하는 경계에서는 <code>decode_exact</code>를 사용합니다. 객체를 복원한 뒤 바이트가 남아 있으면
          <code>UnexpectedLength</code>로 실패하므로, 올바른 객체 뒤에 임의 데이터가 붙은 입력을 성공으로 오해하지 않습니다.
        </p>
      </div>
    </section>
  );
}
