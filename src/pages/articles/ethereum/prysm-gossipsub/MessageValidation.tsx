import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";

export default function MessageValidation({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="message-validation" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Validation은 싼 wire gate에서 비싼 stateful check 순서로 내려간다</h2>
      <div className="not-prose my-5 flex flex-wrap gap-2">
        <CodeViewButton onClick={() => onCodeRef("validate-block-pubsub", codeRefs["validate-block-pubsub"])} />
        <span className="self-center text-xs text-muted-foreground">분석한 snapshot의 block validation 확인</span>
      </div>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <ol>
          <li>Topic length·fork digest·message name·encoding과 compressed byte cap을 확인합니다.</li>
          <li>Bounded Snappy decode 뒤 uncompressed cap을 다시 확인하고 exact SSZ type으로 canonical decode합니다.</li>
          <li>Object root·slot/proposer 같은 cheap dedupe key와 seen-state를 확인합니다.</li>
          <li>Time/slot·index·signature 같은 stateless 또는 cached validation을 수행합니다.</li>
          <li>Known parent/beacon state·fork choice가 필요한 stateful rule과 execution dependency를 검사합니다.</li>
          <li>Decision과 reason을 기록한 뒤에만 downstream queue·store와 propagation을 허용합니다.</li>
        </ol>

        <h3>Accept·Reject·Ignore를 구분하는 기준</h3>
        <p>
          Bad signature, impossible index, canonical decode failure처럼 peer가 보내서는 안 되는 input은 Reject 후보입니다. 이미
          본 같은 object, local node가 아직 parent/state를 갖지 못한 경우, 허용 window 밖이지만 악의로 단정하기 어려운 input은 Ignore 또는
          deferred로 처리할 수 있습니다. Exact mapping은 current specification과 client release를 따르되 typed reason을 잃지
          않습니다.
        </p>
        <p>
          Duplicate cache를 decode 전에 compressed bytes hash만으로 두면 다른 invalid encoding이 같은 semantic object처럼 취급될
          수 있습니다. 반대로 같은 object의 byte variant가 비싼 검증을 반복하기도 합니다. Ethereum의 message-id domain과 valid/invalid
          Snappy 경계를 따르고 semantic seen key는 canonical decode 뒤 object type별 invariant로 관리합니다.
        </p>

        <h3>Backpressure와 side-effect invariant</h3>
        <p>
          Validation worker·queued bytes·state lookup·signature batch에 각각 cap과 deadline을 둡니다. Queue가 찼다는 local
          saturation을 remote-invalid penalty로 바꾸지 않고 overload reason으로 drop합니다. Validation 중
          timeout·panic·cancel이 나면 seen-accepted marker, fork-choice store와 DB가 부분 갱신되지 않아야 동일 message replay가
          결정적입니다.
        </p>
      </div>
    </section>
  );
}
