import { CodeViewButton } from "@/components/code";
import ExplainedFormula from "@/components/ui/explained-formula";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";

export default function StateInterface({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="state-interface" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Copy-on-Write는 branch를 싸게 만들되 첫 mutation에서 backing data를
        분리한다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Fork choice는 같은 parent에서 나온 여러 candidate state를 잠시
          유지합니다. 매번 validators·balances 전체를 deep copy하면 메모리와
          copy latency가 커지므로 Prysm은 공유 가능한 field를 참조하고, setter가
          shared field를 바꾸려 할 때 해당 backing data를 복사하는
          Copy-on-Write(COW)를 사용합니다.
        </p>
      </div>

      <ExplainedFormula
        question="큰 state에서 일부 field만 바꿀 때 copy byte를 어떻게 추정할까요?"
        idea={
          <>
            Deep copy는 모든 field를 복제하지만 field-granular COW는 실제로 처음
            쓰는 shared field만 분리합니다. Metadata와 implementation overhead는
            별도로 셉니다.
          </>
        }
        formula={String.raw`\begin{aligned}B_{\rm deep}&=\sum_{j=1}^{F}S_j\\B_{\rm COW}&\approx\sum_{j\in W,\ r_j>1}S_j+B_{\rm meta}\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}B_{\rm deep}&=\underbrace{\sum_{j=1}^{F}S_j}_{\text{Backing size 계산}}\\B_{\rm COW}&\approx\sum_{j\in W,\ r_j>1}S_j+B_{\rm meta}\end{aligned}`}
        operations={[
          { expression: String.raw`\sum_{j=1}^{F}S_j`, annotation: ["Backing size이(가) 식의 결과에 기여하는 방식을","계산합니다.","Deep copy는 모든 field를 복제하지만","field-granular COW는 실제로 처음 쓰는"] },
        ]}
        terms={[
          {
            symbol: "F",
            name: "Field count",
            description: "현재 fork의 BeaconState field 수입니다.",
          },
          {
            symbol: "S_j",
            name: "Backing size",
            description: "Field j를 분리할 때 실제 복사되는 byte 수입니다.",
          },
          {
            symbol: "W",
            name: "Written fields",
            description:
              "해당 branch transition이 처음 수정한 field 집합입니다.",
          },
          {
            symbol: "r_j",
            name: "Reference count",
            description: "Backing field를 공유하는 live state view 수입니다.",
          },
        ]}
        assumptions={[
          "Field 단위 공유와 write-before-mutate 규칙을 지킵니다.",
          "Nested slice·map이 얕게 alias되지 않도록 실제 owner 경계를 확인합니다.",
          "수식은 allocator capacity·GC·lock·trie cache 비용을 정확히 예측하는 모델이 아닙니다.",
        ]}
        interpretation="세 field 크기가 8 MB, 2 MB, 1 MB이고 첫 field만 수정하면 deep copy는 약 11 MB, 이상적인 COW는 약 8 MB+metadata를 복사합니다. 작고 자주 쓰는 field가 많으면 COW 관리 비용이 이득을 상쇄할 수 있습니다."
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Read view와 mutable owner를 type으로 분리합니다</h3>
        <p>
          Reader가 얻은 state view는 관찰하는 동안 slot·fork·root generation이 바뀌지 않아야 합니다. Writer는 setter를 통해서만
          mutation하고 reference count가 1인지 확인한 뒤 backing data를 고유화합니다. Getter가 내부 slice를 그대로 노출해 caller가 수정할 수
          있으면 setter·dirty tracking을 우회하므로 defensive copy나 read-only view가 필요합니다.
        </p>
        <h3>Aliasing 반례</h3>
        <p>
          State A와 B가 balances slice를 공유한 상태에서 B가 index 5를 직접
          바꾸면 A의 root도 논리적으로 바뀌지만 A의 dirty bit는 그대로일 수
          있습니다. 이후 A가 cached root를 반환하면 value와 commitment가
          갈라집니다. COW의 성능 주장은 모든 mutation path가 owner check와 dirty
          marking을 통과한다는 전제에서만 성립합니다.
        </p>
        <h3>Concurrency와 lifetime</h3>
        <p>
          Reference count의 atomicity만으로 state 전체가 thread-safe해지는 것은
          아닙니다. Read snapshot lifetime, writer serialization, cache
          invalidation과 release 시 decrement 순서를 정하고 race detector·branch
          mutation fixture로 A/B 격리를 검사합니다.
        </p>
      </div>
      <div className="not-prose my-4 flex flex-wrap gap-3">
        {codeRefs["state-copy"] && (
          <CodeViewButton
            onClick={() => onCodeRef("state-copy", codeRefs["state-copy"])}
          />
        )}
      </div>
    </section>
  );
}
