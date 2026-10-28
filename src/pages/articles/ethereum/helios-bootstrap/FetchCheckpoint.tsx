import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function FetchCheckpoint({ title, onCodeRef }: Props & { title: string }) {
  return (
    <section id="fetch-checkpoint" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">{title}</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Client는 trusted root C를 request key로 사용해 <code>LightClientBootstrap</code>을 요청합니다. 먼저 transport timeout, HTTP
          status, response size를 제한합니다.
        </p>
        <p>
          응답은 fork context에 맞는 SSZ 또는 API schema로 decode한 뒤 cryptographic validation에 넘어갑니다. Decode와 validation은 다른
          단계입니다. 알 수 없는 fork version이나 trailing data를 임의의 현재 구조로 읽지 않습니다.
        </p>
        <p>
          Retry할 때도 request identity는 network와 C로 고정합니다. Endpoint A가 timeout난 뒤 endpoint B를 쓰는 것은 괜찮지만 retry
          도중 더 최신이라는 이유로 root를 C′로 바꾸면 다른 trust decision이 됩니다. 그런 변경은 새 checkpoint approval로 기록해야 합니다.
        </p>
      </div>
      <div className="not-prose mt-5">
        <CodeViewButton label="실제 bootstrap 순서 보기" onClick={() => onCodeRef("hl-fetch", codeRefs["hl-fetch"])} />
      </div>
    </section>
  );
}
