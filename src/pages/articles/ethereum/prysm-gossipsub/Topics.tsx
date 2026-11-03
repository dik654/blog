import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import ExplainedFormula from "@/components/ui/explained-formula";
import { codeRefs } from "./codeRefs";

export default function Topics({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="topics" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 break-keep text-2xl font-bold">
        Topic은 “어떤 fork의 어떤 물건을 어떤 포장으로 보냈는가”를 먼저
        고정합니다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          B352의 봉투 겉면은 대략{" "}
          <code>/eth2/&lbrace;fork digest&rbrace;/beacon_block/ssz_snappy</code>
          처럼 생깁니다. 가운데 이름만 보고 block이라고 추측하지 않습니다. Fork
          digest가 schema 세대를, message name이 객체 종류를, suffix가
          압축·직렬화 방식을 정합니다.
        </p>
      </div>

      <div className="not-prose my-5 flex flex-wrap items-center gap-2">
        <CodeViewButton
          onClick={() =>
            onCodeRef("subscribe-topic", codeRefs["subscribe-topic"])
          }
        />
        <CodeViewButton
          onClick={() => onCodeRef("decode-pubsub", codeRefs["decode-pubsub"])}
        />
        <span className="text-xs text-muted-foreground">
          Topic 조립과 fork별 Go type 선택은 서로 다른 단계입니다
        </span>
      </div>

      <ExplainedFormula
        question="같은 beacon_block 이름을 fork와 network별로 어떻게 나눕니까?"
        idea="Fork version과 genesis validators root를 ForkData로 묶어 hash한 뒤 앞 4 bytes를 topic의 fork digest로 씁니다."
        formula={String.raw`d_f=\operatorname{SHA256}(\operatorname{SSZ}(v_f,g))_{0:4}`}
        annotatedFormula={String.raw`d_f=\operatorname{SHA256}(\underbrace{\operatorname{SSZ}(v_f,g)}_{\text{fork version과 genesis root}})_{0:4}`}
        operations={[
          {
            expression: String.raw`\operatorname{SSZ}(v_f,g)`,
            annotation: [
              "활성 fork version과 genesis validators root를 묶음",
              "fork나 network가 달라지면 입력도 달라짐",
            ],
          },
          {
            expression: String.raw`\operatorname{SHA256}(\cdot)_{0:4}`,
            annotation: [
              "32-byte hash의 앞 4 bytes를 topic에 사용",
              "이 값은 routing 구분자이지 block 유효성 증명이 아님",
            ],
          },
        ]}
        terms={[
          {
            symbol: "d_f",
            name: "포크 다이제스트",
            description: "topic에 들어가는 4-byte fork 구분자",
          },
          {
            symbol: "v_f",
            name: "포크 버전",
            description: "해당 epoch에서 활성인 4-byte version",
          },
          {
            symbol: "g",
            name: "제네시스 검증자 루트",
            description: "어느 beacon network인지 묶는 32-byte root",
          },
          {
            symbol: "0{:}4",
            name: "앞 네 바이트",
            description: "hash 결과에서 topic에 넣는 prefix",
          },
        ]}
        assumptions={[
          "Local clock과 fork schedule이 올바른 network config를 사용합니다.",
          "Message name과 /ssz_snappy suffix도 정확히 일치해야 합니다.",
          "4-byte digest가 같아도 signature·parent·state validity는 별도로 검사합니다.",
        ]}
        interpretation="Topic은 decoder를 고르는 첫 번째 경계입니다. 통과 결과는 ‘열어 볼 종류를 알았다’이지 ‘내용이 옳다’가 아닙니다."
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Fork가 바뀌면 왜 type도 다시 고릅니까?</h3>
        <p>
          같은 <code>beacon_block</code> 이름이어도 fork에 따라 body field가
          달라집니다. Prysm은 topic에서 digest를 꺼내고 현재 schedule에서 fork
          version을 찾은 뒤 그 version에 맞는 SignedBeaconBlock type을
          선택합니다. 알 수 없는 digest를 “비슷해 보이는 최신 type”으로 억지
          decode하지 않습니다.
        </p>
        <p>
          Attestation·sync committee·data column처럼 subnet 번호가 붙는 메시지는
          topic이 traffic을 더 잘게 나눕니다. 구독 여부는 duty와 fork schedule에
          따라 달라질 수 있지만, topic이 맞다는 사실만으로 payload가 합의상
          유효해지지는 않습니다.
        </p>
      </div>
    </section>
  );
}
