import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import MemoryHierarchyViz from "./viz/MemoryHierarchyViz";

export default function MemoryHierarchy() {
  return (
    <section id="memory-hierarchy" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Register에서 HBM까지: 용량보다 먼저 scope와 traffic을 봅니다
      </h2>
      <MemoryHierarchyViz />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <div id="gpu-memory-traffic-hierarchy" className="scroll-mt-24">
          <p>
            Register는 thread의 operand를, shared memory는 같은 block의 협업
            데이터를, L1은 주로 SM-local access를, L2는 chip-wide access를
            가깝게 보관합니다. 마지막 device memory인 HBM·GDDR은 용량과 순차
            대역폭이 크지만 load의 종단 latency가 길기 때문에, 많은 ready warp와
            연속 transaction으로 기다림을 가려야 합니다. 세대에 따라 cache와
            shared-memory partition이 달라지므로 “항상 몇 cycle”이라는 표는
            정본이 될 수 없습니다.
          </p>
          <p>
            Register가 부족해 compiler가 값을 spill하면 thread-private 값이
            <em> local memory address space</em>로 내려가지만, 이름과 달리
            물리적인 별도 on-chip RAM이 아니라 device memory traffic을 만들 수
            있습니다. Shared memory의 coalescing·bank conflict·padding은{" "}
            <Link to="/gpu/cuda-shared-memory">공유 메모리 정본 글</Link>에서
            계산합니다.
          </p>
        </div>
        <ExplainedFormula
          question="Kernel이 HBM bandwidth 상한에 가까워질 수 있는지 계산량과 memory traffic으로 어떻게 가늠하는가?"
          idea={
            <p>
              실행한 연산 수를 HBM에서 이동한 byte로 나눈 arithmetic intensity와
              장치의 peak compute·peak bandwidth를 결합하면 이상적인 처리량
              상한을 얻습니다.
            </p>
          }
          formula={
            "\\begin{aligned} I&=\\frac{F}{Q}\\\\ P_{\\mathrm{bound}}&=\\min\\left(P_{\\mathrm{peak}},\\ I B_{\\mathrm{peak}}\\right) \\end{aligned}"
          }
          terms={[
            {
              symbol: "F",
              name: "연산량",
              description:
                "분석 경계 안에서 수행한 floating-point operation 수입니다.",
            },
            {
              symbol: "Q",
              name: "HBM traffic",
              description:
                "같은 경계에서 HBM과 chip 사이를 이동한 byte 수입니다.",
            },
            {
              symbol: "I",
              name: "arithmetic intensity",
              description: "Byte당 연산 수이며 단위는 FLOP/byte입니다.",
            },
            {
              symbol: "B_{\\mathrm{peak}}",
              name: "peak memory bandwidth",
              description: "사양상 HBM 전송 상한이며 byte/s입니다.",
            },
            {
              symbol: "P_{\\mathrm{peak}}",
              name: "peak compute",
              description:
                "선택 precision에서의 사양상 연산 상한이며 FLOP/s입니다.",
            },
          ]}
          assumptions={[
            "FLOP 정의와 precision, read/write byte 경계를 같은 kernel에 맞춥니다.",
            "Peak는 충분한 병렬성과 이상적인 access를 가정한 상한이며 cache·instruction·dependency를 생략합니다.",
            "실제 achieved value는 profiler의 elapsed time과 measured traffic으로 다시 계산합니다.",
          ]}
          interpretation="예를 들어 I=2 FLOP/byte, peak bandwidth가 3TB/s라면 memory roof는 6TFLOP/s입니다. Peak compute가 60TFLOP/s여도 이 access pattern은 우선 memory-bound 후보지만, 식만으로 실제 병목을 확정하지는 않습니다."
        />
        <div id="paper-cuda-memory-hierarchy" className="scroll-mt-24">
          <CitationBlock
            source="NVIDIA CUDA C++ Best Practices Guide — Memory Optimizations"
            citeKey={2}
            href="https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/"
          >
            공식 guide는 global-memory transaction을 줄이고 shared memory를
            staging하는 원칙을 설명합니다. 특정 latency나 speedup은
            architecture와 access pattern에 의존하므로 이 글은 고정 배수로
            일반화하지 않습니다.
          </CitationBlock>
        </div>
      </div>
    </section>
  );
}
