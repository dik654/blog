import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";

export default function BlockStateOps({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="block-state-ops" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Save 성공은 primary·index·checkpoint가 durable commit 뒤 함께 보인다는
        뜻이어야 한다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Write path</h3>
        <p>
          먼저 object를 fork에 맞는 SSZ bytes로 encode하고 root를 재계산해
          caller가 준 identity와 비교합니다. Write transaction 안에서 primary
          record, secondary indexes와 필요한 summary를 갱신한 뒤 commit합니다.
          Only-after-commit cache publication과 success response를 수행해야
          crash가 cache-only object를 만든 것으로 보이지 않습니다.
        </p>
        <p>
          같은 root의 동일 bytes 재저장은 idempotent success가 될 수 있지만 같은
          root에 다른 bytes가 오면 hash collision을 추정하기 전에
          schema/fork/corruption mismatch로 fail-closed합니다. State 저장은
          block root·state root·slot·fork와 reconstruction base를 구분하고,
          “async”라는 이유로 durability requirement를 없애지 않습니다.
        </p>
        <h3>Read path</h3>
        <p>
          Cache hit에도 schema generation과 immutable bytes/root identity를
          확인합니다. Cache miss는 하나의 read snapshot에서 index→root→primary를
          따라가고 bytes를 bounded decode한 뒤 root를 다시 확인합니다. Index가
          있는데 primary가 없거나 wrong slot object가 나오면 not-found로 숨기지
          않고 corruption/rebuild 대상으로 분류합니다.
        </p>
        <h3>Crash matrix</h3>
        <p>
          Primary 전, primary 뒤/index 전, index 뒤/commit 전, commit 뒤/cache
          전, cache 뒤/response 전에서 process를 종료합니다. Restart 후
          all-or-none visibility, idempotent retry, no dangling index와
          checkpoint monotonicity를 검사합니다. Fault injection 없이 transaction
          API 이름만 보고 application-level recovery가 끝났다고 판단하지
          않습니다.
        </p>
      </div>
      <div className="not-prose my-4 flex flex-wrap gap-3">
        <CodeViewButton
          onClick={() => onCodeRef("save-block", codeRefs["save-block"])}
        />
        <CodeViewButton
          onClick={() => onCodeRef("get-block", codeRefs["get-block"])}
        />
        <CodeViewButton
          onClick={() => onCodeRef("save-state", codeRefs["save-state"])}
        />
      </div>
    </section>
  );
}
