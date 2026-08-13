import CodePanel from "@/components/ui/code-panel";
import ExplainedFormula from "@/components/ui/explained-formula";

const layoutCode = `// N개의 원소, block당 B threads
int B = 256;
int G = (N + B - 1) / B;
kernel<<<G, B>>>(data, N);

// kernel 안에서 현재 위치와 launch shape를 읽는다.
threadIdx.x;  // block 안 thread 좌표
blockIdx.x;   // grid 안 block 좌표
blockDim.x;   // block의 x 크기
gridDim.x;    // grid의 x 크기

// device마다 resource limit이 다르므로 query한다.
cudaDeviceProp prop{};
cudaGetDeviceProperties(&prop, 0);
printf("maxThreadsPerBlock=%d\\n", prop.maxThreadsPerBlock);`;

export default function BuiltinVars() {
  return (
    <section id="builtin-vars" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Launch configuration은 작업 수가 아니라 block의 모양과 개수를 지정합니다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          <code>&lt;&lt;&lt;gridDim, blockDim&gt;&gt;&gt;</code>은 “core를 몇 개
          켠다”는 명령이 아닙니다. Runtime에 logical block 수와 block당 thread
          수를 제출하는 계약입니다. Hardware scheduler는 register·shared
          memory·최대 resident block/warp 한도를 함께 보고 SM에 block을
          배치합니다. 따라서 같은 256-thread block도 register를 많이 쓰면 동시에
          머무는 block 수가 줄 수 있습니다.
        </p>
      </div>
      <ExplainedFormula
        question="N개 원소를 B개씩 맡길 때 마지막 원소까지 덮으려면 block이 몇 개 필요할까요?"
        idea={
          <>
            정수 나눗셈은 나머지를 버리므로, 나머지가 하나라도 있을 때 block
            하나를 더 만드는 ceiling division을 사용합니다.
          </>
        }
        formula={String.raw`G=\left\lceil\frac{N}{B}\right\rceil=\left\lfloor\frac{N+B-1}{B}\right\rfloor`}
        terms={[
          {
            symbol: "N",
            name: "work item count",
            description: "처리할 전체 원소 수입니다.",
          },
          {
            symbol: "B",
            name: "threads per block",
            description: "1D block에서 만든 logical thread 수입니다.",
          },
          {
            symbol: "G",
            name: "blocks in grid",
            description: "x축으로 launch할 block 수입니다.",
          },
        ]}
        assumptions={[
          "N과 B는 양의 정수이며 B는 해당 device의 block thread 한도를 넘지 않습니다.",
          "마지막 block의 남는 thread는 kernel 안에서 boundary check로 제외합니다.",
          "이 식은 필요한 logical work coverage만 계산하며 fastest block size를 결정하지 않습니다.",
        ]}
        interpretation="N=1,000, B=256이면 G=4이고 1,024 threads가 만들어집니다. 마지막 24 threads는 idx ≥ 1,000이므로 일을 하지 않습니다."
      />
      <CodePanel
        title="Launch shape와 내장 변수"
        code={layoutCode}
        annotations={[
          {
            lines: [1, 4],
            color: "sky",
            note: "Ceiling division으로 grid 구성",
          },
          {
            lines: [6, 10],
            color: "emerald",
            note: "위치와 shape를 kernel에서 읽기",
          },
          {
            lines: [12, 15],
            color: "amber",
            note: "Device resource limit 확인",
          },
        ]}
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3 className="mt-8 text-xl font-semibold">
          Block size의 실제 trade-off
        </h3>
        <p>
          Warp 배수는 마지막 warp의 빈 lane을 줄이는 데 유리하지만, block을 크게
          만들수록 항상 빠른 것은 아닙니다. 큰 block은 block당 warp 수를 늘리는
          대신 register와 shared-memory budget을 한 번에 더 소비하며, 긴
          dependency chain이나 memory latency가 병목이면 resident warp 수가
          부족해질 수 있습니다. 반대로 block이 너무 작으면 scheduler가 가진
          block 한도에 먼저 걸릴 수 있습니다. 먼저 128·256·512처럼 합법적인
          후보를 만들고, 같은 workload에서 achieved occupancy·eligible
          warps·memory throughput·kernel time을 비교합니다.
        </p>
      </div>
    </section>
  );
}
