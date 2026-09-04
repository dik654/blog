import type { CodeRef } from "@/components/code/types";
import ExplainedFormula from "@/components/ui/explained-formula";

export default function SnappyEncoding({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="snappy-encoding" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">SSZ-Snappy는 압축률이 아니라 압축 해제 전 allocation 경계를 먼저 정한다</h2>
      <ExplainedFormula
        question="최대 raw payload n bytes를 허용할 때 Snappy wire input을 어디까지 읽을 수 있을까요?"
        idea="Snappy의 worst-case compressed length upper bound를 사용해 압축 bytes부터 제한하고, header가 선언한 decoded length와 실제 output도 raw cap 이하인지 별도로 검사합니다."
        formula={String.raw`C_{max}(n)=32+n+\left\lfloor\frac{n}{6}\right\rfloor`}
        annotatedFormula={String.raw`C_{max}(n)=\underbrace{32+n+\left\lfloor\frac{n}{6}\right\rfloor}_{\text{기준량당 비율}}`}
        operations={[
          { expression: String.raw`32+n+\left\lfloor\frac{n}{6}\right\rfloor`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","Snappy의 worst-case compressed","length upper bound를 사용해 압축 bytes부터","제한하고, header가 선언한 decoded length와"] },
        ]}
        terms={[
          { symbol: "n", name: "최대 원문 크기", description: "규격이 허용하는 uncompressed application payload(bytes)" },
          { symbol: "C_{max}(n)", name: "최대 압축 입력", description: "허용할 Snappy compressed bytes의 worst-case 상한" },
          { symbol: "32", name: "고정 오버헤드", description: "Snappy bound의 고정 bytes 항" },
          { symbol: "\\lfloor n/6\\rfloor", name: "크기 비례 오버헤드", description: "원문 크기에 비례하는 worst-case 추가 bytes" },
        ]}
        assumptions={["Current Ethereum networking spec의 MAX_PAYLOAD_SIZE와 Snappy framing 규칙을 사용합니다.", "Compressed cap·declared decoded length·actual output cap을 모두 검사합니다.", "압축 성공이나 SSZ decode 성공은 signature·state validity를 보장하지 않습니다."]}
        interpretation="설명용 n=600 bytes이면 Cmax=32+600+100=732 bytes입니다. 100-byte compressed input도 header가 20 MiB output을 선언하면 allocation 전에 거절해야 합니다."
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Decompression bomb을 막는 순서</h3>
        <p>
          먼저 transport/pubsub frame에서 compressed bytes를 bounded reader로 받고 Snappy decoded length를 allocation
          전에 확인합니다. Streaming decoder가 cap을 넘는 output을 쓰려 하면 즉시 중단합니다. 정확히 한 frame을 소비했는지 trailing data와
          truncation도 검사합니다. 그다음 fork-specific SSZ decoder에 제한된 bytes만 넘깁니다.
        </p>
        <p>
          압축 후 1 MiB 같은 단일 cap만 두면 작은 input이 큰 output을 만드는 공격을 막지 못합니다. 반대로 raw cap만 너무 이르게 적용해 legitimate
          worst-case Snappy overhead를 빼먹으면 valid 최대 payload를 거절할 수 있습니다. Spec-derived 두 cap과 per-peer/global
          queued byte budget을 함께 사용합니다.
        </p>

        <h3>Release gate</h3>
        <p>
          Valid boundary payload, compressed cap ±1, declared raw cap ±1, truncated stream을 같은 fixture로 재생합니다.
          Trailing bytes, malformed varint, expansion bomb, valid-Snappy-but-invalid-SSZ도 같은 자리에서 함께 돌립니다.
          Accept/reject/ignore, allocated peak bytes, worker cleanup, message ID, peer score signal parity를
          통과한 뒤 decode throughput을 비교합니다.
        </p>
      </div>
    </section>
  );
}
