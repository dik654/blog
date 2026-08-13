import ContextViz from "./viz/ContextViz";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";
import type { CodeRef } from "@/components/code/types";

export default function Overview({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        Actor record와 actor state를 두 단계로 읽는다
      </h2>
      <div className="not-prose mb-8">
        <ContextViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          top-level state tree는 ID address를 Actor record에 연결한다. record의
          Code CID는 actor implementation을, Head CID는 그 actor type의
          versioned state root를 가리키며 nonce와 FIL balance도 consensus
          state에 포함된다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton
            onClick={() => onCodeRef("state-tree", codeRefs["state-tree"])}
          />
          <span className="self-center text-xs text-muted-foreground">
            StateTree snapshot
          </span>
          <CodeViewButton
            onClick={() => onCodeRef("hamt-find", codeRefs["hamt-find"])}
          />
          <span className="self-center text-xs text-muted-foreground">
            HAMT lookup snapshot
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 not-prose my-6">
          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold text-sm mb-2">Resolve</h3>
            <p className="text-sm text-muted-foreground">
              robust address를 current state의 ID address로 해석하고 top-level
              actor record를 찾는다.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold text-sm mb-2">Dispatch</h3>
            <p className="text-sm text-muted-foreground">
              Code CID와 network version에 맞는 actor code·state schema를
              선택한다.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold text-sm mb-2">Decode</h3>
            <p className="text-sm text-muted-foreground">
              Head CID 아래 CBOR/IPLD graph를 해당 schema로 읽고 HAMT·AMT child
              roots를 따라간다.
            </p>
          </div>
        </div>
        <p className="leading-7">
          built-in actor 수, state-tree version 번호, address protocol 목록은
          network upgrade로 바뀔 수 있다. root CID만 보고 최신 Go struct로
          decode하지 말고 chain epoch의 network version과 actor bundle
          metadata를 먼저 확인한다.
        </p>
      </div>
    </section>
  );
}
