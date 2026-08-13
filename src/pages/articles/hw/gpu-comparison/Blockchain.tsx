import WorkloadFitViz from "./viz/WorkloadFitViz";

const workloads = [
  {
    name: "MSM",
    shape: "곡선점·스칼라 읽기 → 버킷 누적 → 환원",
    first: "peak VRAM · 유효 메모리 대역폭",
    verify: "bucket kernel · 불규칙 접근 · reduction 시간",
  },
  {
    name: "NTT",
    shape: "butterfly 연산 ↔ stage별 데이터 재배치",
    first: "커널 처리량 · 유효 대역폭",
    verify: "shared memory · stage fusion · launch 수",
  },
  {
    name: "해시·Merkle",
    shape: "대량 독립 해시 → 트리 레벨별 환원",
    first: "정수 연산 처리량 · 배치 크기",
    verify: "CPU↔GPU 전송 · 작은 레벨의 GPU 이용률",
  },
  {
    name: "종단 prover",
    shape: "witness → NTT → MSM → hash → proof",
    first: "최대 작업 집합 · 가장 긴 stage",
    verify: "memcpy · 동기화 · CPU 구간 · 지속 클럭",
  },
];

export default function Blockchain() {
  return (
    <section id="blockchain" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">블록체인 워크로드별 선택</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          MSM(다중 스칼라 곱셈)·NTT(유한체 위의 고속 다항식 변환)·해시는 모두
          GPU에서 병렬화되지만 데이터 흐름이 다름
          <br />
          “MSM은 H100, NTT는 5090”처럼 제품을 고정해 외우면 라이브러리·회로
          크기·배치 변화에서 바로 틀어짐
        </p>
      </div>

      <div className="not-prose my-7">
        <WorkloadFitViz />
      </div>

      <div className="overflow-x-auto not-prose mb-6">
        <table className="min-w-[820px] w-full text-sm border border-border">
          <thead>
            <tr className="bg-muted/50">
              {[
                "워크로드",
                "데이터 흐름",
                "먼저 거를 사양",
                "반드시 측정할 항목",
              ].map((heading) => (
                <th
                  key={heading}
                  className="border border-border px-3 py-2 text-left"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {workloads.map((workload) => (
              <tr key={workload.name}>
                <td className="border border-border px-3 py-2 font-semibold">
                  {workload.name}
                </td>
                <td className="border border-border px-3 py-2">
                  {workload.shape}
                </td>
                <td className="border border-border px-3 py-2">
                  {workload.first}
                </td>
                <td className="border border-border px-3 py-2">
                  {workload.verify}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          독립 증명 여러 개를 GPU별로 배치하면 통신이 거의 없어 컨슈머 카드도
          수평 확장 가능
          <br />
          반대로 하나의 MSM을 여러 GPU로 나누고 버킷을 자주 합치면 interconnect
          비용이 커져 데이터센터 플랫폼의 장점이 드러남
        </p>

        <div className="not-prose my-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
            <p className="text-xs font-semibold text-emerald-500 mb-2">
              단일 노드·독립 작업
            </p>
            <p className="text-sm leading-6">
              VRAM이 충분한 GeForce부터 실제 prover를 측정해 비용 대비 처리량
              확인
            </p>
          </div>
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
            <p className="text-xs font-semibold text-amber-500 mb-2">
              고밀도·통신 집약·24/7
            </p>
            <p className="text-sm leading-6">
              HBM·NVLink뿐 아니라 서버 냉각, 관리, 장애 교체와 이용률을 함께
              비교
            </p>
          </div>
        </div>

        <div className="not-prose my-6 border-l-4 border-amber-400 bg-amber-50/60 dark:bg-amber-950/20 rounded-r-lg p-4">
          <p className="font-semibold mb-1">💡 최종 선택은 종단 프로파일</p>
          <p className="text-sm leading-6">
            커널 하나가 2배 빨라도 witness 생성이나 CPU↔GPU 복사가 전체 시간의
            절반이면 종단 개선은 2배보다 작음.
            <br />
            Nsight Systems로 stage 경계와 전송을, Nsight Compute로 병목 커널을
            분리해 측정
          </p>
        </div>
      </div>
    </section>
  );
}
