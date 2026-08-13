import CodePanel from "@/components/ui/code-panel";
import ExplainedFormula from "@/components/ui/explained-formula";

const vecAddCode = `__global__ void vecAdd(const float* a, const float* b,
                       float* c, size_t n) {
  size_t i = static_cast<size_t>(blockIdx.x) * blockDim.x + threadIdx.x;
  if (i < n) c[i] = a[i] + b[i];
}

int block = 256;
int grid = static_cast<int>((n + block - 1) / block);
vecAdd<<<grid, block>>>(d_a, d_b, d_c, n);

// Launch error와 비동기 실행 error를 분리해 확인한다.
cudaError_t launchStatus = cudaGetLastError();
cudaError_t executionStatus = cudaDeviceSynchronize();`;

export default function Indexing1D() {
  return (
    <section id="indexing-1d" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        1D index는 block의 시작 위치에 block 내부 offset을 더합니다
      </h2>
      <ExplainedFormula
        question="서로 다른 block 안에서 같은 threadIdx.x를 가진 thread를 전체 배열의 고유 위치로 어떻게 바꿀까요?"
        idea={
          <>
            blockIdx.x 앞에 있는 block들이 각각 blockDim.x개 자리를 차지하므로
            그 길이를 건너뛴 뒤, 현재 block의 thread offset을 더합니다.
          </>
        }
        formula={String.raw`i=\mathrm{blockIdx}.x\times\mathrm{blockDim}.x+\mathrm{threadIdx}.x`}
        terms={[
          {
            symbol: "blockIdx.x",
            name: "block coordinate",
            description: "0부터 시작하는 현재 block의 x 좌표입니다.",
          },
          {
            symbol: "blockDim.x",
            name: "block width",
            description: "각 block에 있는 x축 thread 수입니다.",
          },
          {
            symbol: "threadIdx.x",
            name: "local offset",
            description: "현재 block 안에서 0부터 시작하는 thread 위치입니다.",
          },
          {
            symbol: "i",
            name: "global logical index",
            description: "전체 1D data에서 이 thread가 담당할 후보 위치입니다.",
          },
        ]}
        assumptions={[
          "모든 block이 같은 blockDim으로 launch됩니다.",
          "Index 계산형은 최대 배열 길이를 담을 수 있어야 하므로 큰 data에는 size_t 같은 충분히 넓은 type을 사용합니다.",
          "i가 존재한다고 해서 i < N인 것은 아니므로 별도 boundary check가 필요합니다.",
        ]}
        interpretation="blockIdx.x=2, blockDim.x=256, threadIdx.x=5이면 i=517입니다. N=515라면 이 thread는 만들어졌지만 memory를 읽거나 쓰면 안 됩니다."
      />
      <CodePanel
        title="Boundary-safe vector addition"
        code={vecAddCode}
        annotations={[
          { lines: [1, 5], color: "sky", note: "고유 index와 boundary check" },
          { lines: [7, 9], color: "emerald", note: "Logical launch shape" },
          {
            lines: [11, 13],
            color: "amber",
            note: "Launch와 execution error 확인",
          },
        ]}
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Boundary check는 성능을 망치는 예외 처리가 아니라 launch shape와 실제
          data shape를 분리해 주는 안전 계약입니다. 마지막 warp 일부만 조건에서
          빠지므로 대개 전체 grid를 복잡하게 맞추는 것보다 단순합니다. 다만
          kernel launch는 host에 비동기로 돌아올 수 있어,{" "}
          <code>cudaGetLastError()</code>는 잘못된 launch configuration을
          확인하고 synchronization 뒤 status는 실행 중 illegal access를 확인하는
          식으로 error 위치를 분리해야 합니다.
        </p>
      </div>
    </section>
  );
}
