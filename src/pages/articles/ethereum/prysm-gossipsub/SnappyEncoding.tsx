import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import ExplainedFormula from "@/components/ui/explained-formula";
import { codeRefs } from "./codeRefs";

export default function SnappyEncoding({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="snappy-encoding" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 break-keep text-2xl font-bold">
        압축 bytes와 압축을 푼 bytes를 따로 제한해야 메모리 공격을 막을 수
        있습니다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          압축 파일이 작다는 사실은 메모리에서도 작다는 뜻이 아닙니다. 그래서
          Prysm v7.3.1은 먼저 compressed input이 최악의 Snappy 상한을 넘는지
          보고, <code>snappy.DecodedLen</code>으로 예상 raw 크기를 확인한 뒤에야
          실제 allocation과 SSZ decode를 진행합니다.
        </p>
      </div>

      <div className="not-prose my-5 flex flex-wrap items-center gap-2">
        <CodeViewButton
          onClick={() => onCodeRef("decode-gossip", codeRefs["decode-gossip"])}
        />
        <span className="text-xs text-muted-foreground">
          두 크기 상한을 실제 v7.3.1 DecodeGossip·DecodeSnappy에서 확인
        </span>
      </div>

      <ExplainedFormula
        question="Raw payload를 최대 n bytes 허용한다면 compressed input은 몇 bytes까지 받아야 합니까?"
        idea="Snappy가 압축에 실패해 오히려 조금 커지는 최악의 경우까지 허용하되, 그 상한을 넘는 input은 압축 해제 전에 거절합니다."
        formula={String.raw`C_{\max}(n)=32+n+\left\lfloor\frac{n}{6}\right\rfloor`}
        annotatedFormula={String.raw`C_{\max}(n)=\underbrace{32}_{\text{고정 여유}}+\underbrace{n}_{\text{raw 상한}}+\underbrace{\left\lfloor n/6\right\rfloor}_{\text{비례 여유}}`}
        operations={[
          {
            expression: String.raw`n=10\times1{,}048{,}576=10{,}485{,}760`,
            annotation: [
              "Prysm mainnet config의 MAX_PAYLOAD_SIZE는 10 MiB",
              "MiB는 1,048,576 bytes이므로 먼저 bytes로 바꿈",
            ],
          },
          {
            expression: String.raw`\left\lfloor n/6\right\rfloor=1{,}747{,}626`,
            annotation: [
              "10,485,760을 6으로 나눈 몫",
              "나머지는 버리는 정수 나눗셈",
            ],
          },
          {
            expression: String.raw`32+10{,}485{,}760+1{,}747{,}626=12{,}233{,}418`,
            annotation: [
              "compressed data field의 최악 상한",
              "이보다 크면 Snappy를 풀기 전에 거절",
            ],
          },
        ]}
        terms={[
          {
            symbol: "n",
            name: "원문 상한",
            description: "압축을 푼 SSZ payload가 가질 수 있는 최대 bytes",
          },
          {
            symbol: String.raw`C_{\max}(n)`,
            name: "압축 입력 상한",
            description:
              "Snappy 최악의 경우까지 허용하는 최대 compressed bytes",
          },
          {
            symbol: "32",
            name: "고정 여유",
            description: "Snappy bound에 들어가는 고정 bytes",
          },
          {
            symbol: String.raw`\lfloor n/6\rfloor`,
            name: "비례 여유",
            description: "raw 크기가 커질수록 추가되는 최악의 overhead",
          },
        ]}
        assumptions={[
          "Prysm v7.3.1 mainnet config의 MAX_PAYLOAD_SIZE=10 MiB를 사용합니다.",
          "Compressed input 상한과 decoded raw 상한을 모두 검사합니다.",
          "SSZ type 자체의 더 작은 최대 크기가 있다면 그 경계도 별도로 적용해야 합니다.",
        ]}
        interpretation="12,233,418 bytes는 valid block의 보통 크기가 아니라, 10 MiB raw payload를 Snappy block으로 받을 때 허용할 compressed data의 절대 상한입니다."
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>상한 두 개가 각각 막는 공격</h3>
        <p>
          Compressed 상한은 거대한 wire input을 읽고 보관하는 비용을 막습니다.
          Decoded 상한은 작은 input이 10 MiB보다 큰 메모리로 부푸는
          decompression bomb을 막습니다. 둘 중 하나만 검사하면 다른 쪽의 자원
          사용을 제한하지 못합니다.
        </p>
        <p>
          두 크기를 통과해도 아직 유효한 block은 아닙니다. 정확한 fork-specific
          SSZ type으로 decode하고, signature·proposer·parent·slot 규칙까지
          통과해야 합니다. “압축을 풀었다”와 “전파해도 된다” 사이에 합의 검사가
          남아 있습니다.
        </p>
      </div>
    </section>
  );
}
