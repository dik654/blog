import CodePanel from "@/components/ui/code-panel";

const layoutCode = `struct ParticleAoS { float x, y, z, mass; };
ParticleAoS aos[N];
// x addresses: base+0, base+16, base+32, ...

struct ParticleSoA { float *x, *y, *z, *mass; } soa;
// x addresses: base+0, base+4, base+8, ...

__global__ void updateX(float* x, const float* velocity, int n, float dt) {
  int i = blockIdx.x * blockDim.x + threadIdx.x;
  if (i < n) x[i] += velocity[i] * dt;
}`;

const decisions = [
  [
    "x 한 field만 scan",
    "SoA",
    "같은 field가 연속이어서 useful-byte 비율이 높음",
  ],
  [
    "한 particle의 모든 field 사용",
    "AoS 또는 AoSoA 측정",
    "한 thread가 가져온 cache line의 여러 field를 실제 사용",
  ],
  [
    "Vector load·library alignment 필요",
    "AoSoA 후보",
    "작은 structure tile로 field 연속성과 record locality 절충",
  ],
] as const;

export default function AosSoa() {
  return (
    <section id="aos-soa" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        AoS와 SoA 선택은 object 취향이 아니라 kernel의 field access pattern
        문제입니다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          AoS(Array of Structures)는 한 record의 fields를 붙여 저장하고,
          SoA(Structure of Arrays)는 같은 field끼리 모읍니다. Warp lanes가
          particle마다 x만 읽는다면 AoS의 y·z·mass bytes는 transaction에 함께
          실려도 쓰이지 않을 수 있습니다. SoA에서는 x 값이 연속이므로 같은 byte
          budget으로 더 많은 useful x를 가져옵니다. 그러나 한 thread가 record의
          모든 field를 바로 쓴다면 AoS의 locality도 유용할 수 있습니다.
        </p>
      </div>
      <CodePanel
        title="같은 data, 다른 address stride"
        code={layoutCode}
        annotations={[
          { lines: [1, 3], color: "amber", note: "AoS x stride = record size" },
          {
            lines: [5, 6],
            color: "emerald",
            note: "SoA x stride = sizeof(float)",
          },
          { lines: [8, 11], color: "sky", note: "Field-wise kernel" },
        ]}
      />
      <div className="not-prose my-8 overflow-x-auto">
        <table className="min-w-[680px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="px-3 py-3">Kernel access</th>
              <th className="px-3 py-3">첫 후보</th>
              <th className="px-3 py-3">판단 이유</th>
            </tr>
          </thead>
          <tbody>
            {decisions.map(([access, choice, reason]) => (
              <tr key={access} className="border-b border-border/70 align-top">
                <td className="px-3 py-3 font-medium">{access}</td>
                <td className="px-3 py-3 text-primary">{choice}</td>
                <td className="px-3 py-3 leading-6 text-muted-foreground">
                  {reason}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          고정된 “SoA가 몇 배 빠르다”는 수치는 model·record
          size·alignment·cache·GPU·compiler가 없는 한 재현 가능한 근거가
          아닙니다. 실제 kernel의 field subset과 access direction을 기록하고,
          layout만 바꾼 paired benchmark에서 global load efficiency·transaction
          수·kernel time·end-to-end conversion cost를 비교해야 합니다. CPU와 GPU
          사이에서 매번 transpose한다면 kernel 이득보다 layout conversion이 더
          클 수도 있습니다.
        </p>
      </div>
    </section>
  );
}
