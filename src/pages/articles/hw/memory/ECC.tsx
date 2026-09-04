import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import EccPathViz from "./viz/EccPathViz";

const operations = [
  [
    "수집",
    "Corrected·uncorrectable counter를 DIMM·rank·row와 timestamp에 연결",
  ],
  ["판정", "단발 횟수보다 증가율·반복 위치·온도·전원 event를 함께 비교"],
  [
    "격리",
    "Page offlining, host drain, failover와 machine-check 대응을 오류 등급별 실행",
  ],
  ["복구", "DIMM 교체 뒤 stress test와 counter 재발 여부를 확인"],
] as const;

export default function ECC() {
  return (
    <section id="ecc" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        ECC: 어느 위치의 몇 bit 오류를 다루는지부터 확인합니다
      </h2>
      <EccPathViz />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <div id="ecc-protection-boundary" className="scroll-mt-24">
          <p>
            DDR5 on-die ECC는 DRAM die 내부 cell array에서 read한 값을 내부적으로 교정해 yield와 신뢰성을 높입니다. 하지만 chip 밖 DQ pin,
            module trace, memory bus에서 생긴 오류를 대신 보호하지 않습니다. System ECC는 추가 check bit가 있는 DIMM과 memory
            controller가 codeword를 만들고 syndrome을 계산해 이 더 넓은 transfer 경계를 보호합니다. “DDR5이므로 ECC”와 “system ECC
            memory”는 같은 말이 아닙니다.
          </p>
        </div>
        <div id="ecc-syndrome-secded" className="scroll-mt-24">
          <ExplainedFormula
            question="m개의 data bit 위치에서 single-bit 오류를 식별하려면 Hamming check bit가 최소 몇 개 필요한가?"
            idea={
              <p>
                r개의 check bit가 만드는 2ʳ개 syndrome 상태가 정상 상태 하나와
                data·check bit 각각의 단일 오류 위치를 구분할 만큼 커야 합니다.
              </p>
            }
            formula={"2^r\\ge m+r+1"}
            annotatedFormula={String.raw`2^r\ge \underbrace{m+r+1}_{\text{no-error state 계산}}`}
            operations={[
              { expression: String.raw`m+r+1`, annotation: ["no-error state이(가) 식의 결과에 기여하는 방식을","계산합니다.","r개의 check bit가 만드는 2ʳ개 syndrome","상태가 정상 상태 하나와 data·check bit 각각의"] },
            ]}
            terms={[
              {
                symbol: "m",
                name: "data bits",
                description:
                  "한 codeword에서 보호하려는 실제 data bit 수입니다.",
              },
              {
                symbol: "r",
                name: "Hamming check bits",
                description:
                  "단일 오류 위치를 나타낼 syndrome을 만드는 check bit 수입니다.",
              },
              {
                symbol: "+1",
                name: "no-error state",
                description:
                  "어느 bit도 뒤집히지 않은 정상 상태를 위한 경우입니다.",
              },
            ]}
            assumptions={[
              "독립적인 binary bit-flip과 Hamming-style single-error correction을 설명하는 최소 bound입니다.",
              "SECDED는 보통 전체 parity bit를 더해 double-error detection을 확장하지만 실제 codeword·symbol·chipkill 구성은 platform마다 다릅니다.",
              "이 식은 burst, entire-chip failure나 silent data corruption 전체를 보장하지 않습니다.",
            ]}
            interpretation="m=64이면 r=7에서 128≥72가 되어 단일 오류 위치를 표현할 수 있습니다. 전체 parity를 추가한 SECDED 계열은 1-bit correction과 2-bit detection을 목표로 하지만, 제품의 실제 RAS 능력은 controller 문서를 확인해야 합니다."
          />
        </div>
        <p>
          Corrected error는 즉시 data를 복구했다는 뜻일 뿐입니다. hardware의 건강 상태를 말해 주지는 않습니다. 같은 DIMM·rank에서 증가하면 열, 전원,
          socket contact나 device 열화의 신호일 수 있으므로 로그를 지우지 않고 시간당 비율과 물리 위치를 남깁니다. Uncorrectable error에는 process
          종료나 machine check가 뒤따를 수 있어 service failover와 host 격리를 실제로 시험해야 합니다.
        </p>
        <div className="not-prose my-6 grid min-w-0 gap-3 sm:grid-cols-2">
          {operations.map(([title, detail]) => (
            <article
              key={title}
              className="min-w-0 rounded-lg border border-border/70 p-4"
            >
              <p className="text-sm font-semibold">{title}</p>
              <p className="mt-1 break-words text-sm leading-6 text-muted-foreground">
                {detail}
              </p>
            </article>
          ))}
        </div>
        <div id="paper-ddr5-on-die-ecc" className="scroll-mt-24">
          <CitationBlock
            source="Micron — DDR5 New Features"
            citeKey={3}
            type="paper"
            href="https://www.micron.com/content/dam/micron/global/public/products/white-paper/ddr5-new-features-white-paper.pdf"
          >
            Micron의 기술 문서는 on-die ECC가 DRAM 내부 read 이전에 동작하는
            경계와 system-level ECC와의 차이를 설명합니다. 특정 server의 SECDED,
            device correction과 telemetry 기능은 CPU·board의 RAS 문서를
            우선합니다.
          </CitationBlock>
        </div>
      </div>
    </section>
  );
}
