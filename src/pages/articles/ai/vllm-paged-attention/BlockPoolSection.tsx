import ExplainedFormula from "@/components/ui/explained-formula";
import BlockLifecycleViz from "./viz/BlockLifecycleViz";

const REF_TERMS = [
  {
    symbol: String.raw`\mathcal R`,
    name: "Live request 집합",
    description: "현재 block table을 소유한 active·cached request 집합입니다.",
  },
  {
    symbol: "T_r",
    name: "Request block table",
    description: "Request r이 logical 순서로 참조하는 physical block들의 목록입니다.",
  },
  {
    symbol: String.raw`\operatorname{ref}(b)`,
    name: "Block reference count",
    description: "Physical block b를 현재 참조하는 block table entry의 수입니다.",
  },
  {
    symbol: String.raw`\mathbf1[\cdot]`,
    name: "Indicator",
    description: "조건이 참이면 1, 아니면 0을 더하는 표기입니다.",
  },
] as const;

export default function BlockPoolSection() {
  return (
    <section id="block-pool" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        BlockPool은 physical block의 수명과 재사용 가능 시점을 한곳에서 관리합니다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">
          Physical block은 한 request만 영구 소유하는 객체가 아닙니다. Prefix가 같은
          여러 request나 parallel branch가 같은 block을 함께 볼 수 있으므로,
          request 하나가 끝났다고 즉시 내용을 덮어쓰면 다른 request의 attention
          결과가 깨집니다. BlockPool은 reference count와 free queue를 단일 기준으로
          사용해 “현재 사용 중”, “cache hit 후보지만 지금은 참조 없음”, “새
          allocation에 재사용 가능” 상태를 구분합니다.
        </p>
      </div>

      <BlockLifecycleViz />

      <ExplainedFormula
        question="Physical block을 안전하게 덮어써도 되는 시점을 어떤 불변식으로 확인할까요?"
        idea={
          <>
            모든 live request의 block table을 보며 block b를 가리키는 entry 수를
            셉니다. 하나라도 참조하면 b는 eviction 대상이 될 수 없습니다.
          </>
        }
        formula={String.raw`\begin{aligned}
\operatorname{ref}(b)
&=\sum_{r\in\mathcal R}\sum_i \mathbf1[T_r[i]=b] \\
\operatorname{evictable}(b)
&\Longrightarrow \operatorname{ref}(b)=0
\end{aligned}`}
        terms={REF_TERMS}
        assumptions={[
          "Block table entry의 추가·제거와 reference count 갱신이 같은 ownership 계약 안에서 일어납니다.",
          "ref=0은 eviction의 필요조건입니다. pinned/null block이나 별도 transfer state는 추가 조건을 가질 수 있습니다.",
          "Cache hash가 남은 ref=0 block은 free queue의 eviction 후보일 수 있지만 cache lookup 전까지 내용이 유효합니다.",
        ]}
        interpretation="A와 B가 P7을 공유하면 ref(P7)=2입니다. A가 끝나도 ref=1이라 덮어쓸 수 없고, B도 참조를 놓아 ref=0이 된 뒤에야 free queue에서 새 allocation 대상으로 재사용할 수 있습니다."
        title="Reference count와 eviction safety"
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3 id="free-queue-eviction" className="scroll-mt-20">
          Free queue는 빈 block 목록이면서 cached block의 eviction order입니다
        </h3>
        <p className="leading-8">
          Prefix caching이 켜져 있으면 reference count가 0이 된 block도 hash와
          함께 남아 다음 요청의 cache hit가 될 수 있습니다. 동시에 새 token을 위한
          block이 부족하면 이 block은 eviction 후보입니다. 현재 V1 BlockPool은
          ref=0 block을 free queue에 두고, allocation이 그 block을 꺼낼 때 이전 hash
          mapping을 제거한 뒤 새 내용에 사용합니다.
        </p>
        <p className="leading-8">
          따라서 <strong>free</strong>는 “내용이 이미 지워졌다”가 아니라 “현재
          request가 참조하지 않아 필요하면 재할당할 수 있다”에 가깝습니다. Cache
          lookup이 먼저 block을 touch하면 free queue에서 빠지고 reference count가
          올라가 다시 사용 중 상태가 됩니다.
        </p>

        <h3 id="block-invariants" className="scroll-mt-20">
          구현을 읽을 때 확인할 세 가지 불변식
        </h3>
        <ul className="leading-8">
          <li>참조 중인 일반 block은 free queue의 eviction 후보로 동시에 남아 있으면 안 됩니다.</li>
          <li>Eviction해 새 내용을 쓴 block이 이전 hash로 cache hit되어서는 안 됩니다.</li>
          <li>Request의 logical 순서는 physical block ID나 free queue 순서가 아니라 block table이 결정합니다.</li>
        </ul>
      </div>
    </section>
  );
}
