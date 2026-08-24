import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import ExplainedFormula from "@/components/ui/explained-formula";
import { codeRefs } from "./codeRefs";

export default function Topics({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="topics" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Topic은 fork·message kind·encoding을 wire routing key로 고정한다</h2>
      <div className="not-prose my-5 flex flex-wrap gap-2">
        <CodeViewButton onClick={() => onCodeRef("message-handler", codeRefs["message-handler"])} />
        <span className="self-center text-xs text-muted-foreground">분석한 snapshot의 topic handler 확인</span>
      </div>
      <ExplainedFormula
        question="서로 다른 chain·fork의 같은 message 이름을 topic에서 어떻게 분리할까요?"
        idea="Fork version과 genesis validators root를 SSZ ForkData로 commitment한 뒤 hash의 앞 4 bytes를 routing digest로 씁니다. 이 짧은 값은 실용적 domain separation이며 cryptographic identity 전체를 대체하지 않습니다."
        formula={String.raw`d_f=\operatorname{SHA256}(\operatorname{SSZ}(v_f,g))_{0:4}`}
        annotatedFormula={String.raw`d_f=\underbrace{\operatorname{SHA256}(\operatorname{SSZ}(v_f,g))_{0:4}}_{\text{포크 다이제스트 계산}}`}
        operations={[
          { expression: String.raw`\operatorname{SHA256}(\operatorname{SSZ}(v_f,g))_{0:4}`, annotation: ["포크 다이제스트이(가) 식의 결과에 기여하는 방식을","계산합니다.","Fork version과 genesis validators","root를 SSZ ForkData로 commitment한 뒤"] },
        ]}
        terms={[
          { symbol: "d_f", name: "포크 다이제스트", description: "topic에 들어가는 4-byte fork digest" },
          { symbol: "v_f", name: "포크 버전", description: "해당 epoch에서 활성인 4-byte fork version" },
          { symbol: "g", name: "제네시스 검증자 루트", description: "network identity를 묶는 genesis_validators_root" },
          { symbol: "0{:}4", name: "앞 네 바이트", description: "32-byte hash 결과에서 선택하는 prefix" },
        ]}
        assumptions={["활성 epoch·fork schedule과 genesis root가 local network에서 정확합니다.", "Topic의 message name과 encoding suffix도 exact match로 검사합니다.", "4-byte digest 일치는 signature·SSZ·state validity나 hash collision 불가능을 보장하지 않습니다."]}
        interpretation="같은 beacon_block 이름도 fork version 또는 genesis root가 바뀌면 다른 digest가 되어 다른 topic에 놓입니다. Digest가 맞더라도 body는 이후 validation을 모두 통과해야 합니다."
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Topic string의 세 축</h3>
        <p>
          Ethereum gossip topic은 보통 fork digest, message name과 encoding으로 구성됩니다. Beacon block처럼 global topic이 있는
          반면 attestation은 subnet ID가 message name에 포함돼 traffic을 나눕니다. Node가 자신의 validator duty와 persistent
          subnet metadata를 바꿀 때 subscribe/unsubscribe generation을 기록해야 fork transition에서 old/new topic이 겹치는
          기간을 설명할 수 있습니다.
        </p>
        <p>
          Unknown fork topic을 generic SSZ object로 추측 decode하지 않습니다. Topic이 선택한 exact fork schema와 size bound가
          준비되지 않았다면 ignore/reject 정책에 따라 fail closed합니다. Future fork support는 binary·spec commit과 함께
          배포하며 old topic unsubscribe 전에 duty와 propagation overlap을 검증합니다.
        </p>
      </div>
    </section>
  );
}
