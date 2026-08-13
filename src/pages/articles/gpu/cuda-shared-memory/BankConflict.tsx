import CodePanel from "@/components/ui/code-panel";
import ExplainedFormula from "@/components/ui/explained-formula";

const paddingCode = `// float is one 32-bit word; bank count is 32 on the documented path.
__shared__ float square[32][32];
__shared__ float padded[32][33];

int lane = threadIdx.x;
float conflict = square[lane][0]; // word indices 0,32,64,... → bank 0
float spread   = padded[lane][0]; // word indices 0,33,66,... → banks 0,1,2,...

// 같은 address를 여러 lane이 읽는 broadcast는
// 같은 bank의 서로 다른 address 충돌과 구분한다.`;

export default function BankConflict() {
  return (
    <section id="bank-conflict" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Bank conflict는 “같은 bank”가 아니라 “같은 bank의 서로 다른 address”에서
        생깁니다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          CUDA guide가 설명하는 32-bit bank mode에서는 연속된 32-bit word가 32
          banks에 순환 배치됩니다. 한 warp instruction에서 서로 다른 banks를
          읽으면 병렬로 서비스할 수 있지만, 여러 lane이 같은 bank의 서로 다른
          word를 요구하면 hardware가 request를 여러 wave로 나눕니다. 반면 여러
          lane이 정확히 같은 word를 읽으면 broadcast가 가능하므로 address
          equality까지 확인해야 합니다.
        </p>
      </div>
      <ExplainedFormula
        question="32-bit word index가 어느 shared-memory bank로 갈까요?"
        idea={
          <>
            Byte address를 bank width인 4 B로 나눠 word index를 만들고, 32
            banks를 순환하므로 나머지를 취합니다.
          </>
        }
        formula={String.raw`\operatorname{bank}(a)=\left\lfloor\frac{a}{4\ \mathrm{B}}\right\rfloor\bmod 32`}
        terms={[
          {
            symbol: "a",
            name: "byte address offset",
            description:
              "Shared allocation 시작점에서 접근 word까지의 byte offset입니다.",
          },
          {
            symbol: "4 B",
            name: "documented bank width",
            description: "여기서 계산하는 32-bit word의 byte 폭입니다.",
          },
          {
            symbol: "32",
            name: "bank count",
            description:
              "이 access model에서 병렬로 address를 분산하는 bank 수입니다.",
          },
        ]}
        assumptions={[
          "32-bit bank mapping을 설명하는 current CUDA guide의 일반 path입니다. Data width와 architecture-specific behavior는 target device 문서를 확인합니다.",
          "Conflict degree는 한 warp의 한 memory instruction에 참여한 active lanes로 계산합니다.",
          "같은 address read는 broadcast 예외이며 같은 bank의 다른 address와 구분합니다.",
        ]}
        interpretation="float index가 0, 32, 64이면 byte offset은 0, 128, 256이고 모두 bank 0입니다. Index가 0, 33, 66이면 bank 0, 1, 2로 분산됩니다."
      />
      <CodePanel
        title="32×32 tile에 column padding 1개 추가"
        code={paddingCode}
        annotations={[
          { lines: [1, 3], color: "sky", note: "Stride 32와 33 비교" },
          {
            lines: [5, 7],
            color: "emerald",
            note: "같은 column의 bank mapping 변화",
          },
          { lines: [9, 10], color: "amber", note: "Broadcast 예외" },
        ]}
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3 className="mt-8 text-xl font-semibold">
          Padding은 무료가 아닙니다
        </h3>
        <p>
          32×32 float tile은 4,096 B이고 32×33은 4,224 B이므로 block당 128 B를
          더 씁니다. 작은 차이처럼 보여도 여러 tile과 double buffering을 합치면
          resident block 수 경계를 넘을 수 있습니다. 먼저 profiler의 shared
          load/store transactions per request로 conflict가 실제 bottleneck인지
          확인하고, padding 뒤 kernel time과 occupancy가 함께 좋아졌는지
          비교합니다. Access가 이미 broadcast이거나 compute-bound라면 padding은
          성능을 바꾸지 않을 수 있습니다.
        </p>
      </div>
    </section>
  );
}
