import { Link } from "react-router-dom";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import type { CodeRef, FileNode } from "@/components/code/types";
import { CitationBlock } from "@/components/ui/citation";
import mma from "./codebase/ptx-9.0/mma.ptx?raw";
import completion from "./codebase/ptx-9.0/completion.ptx?raw";

const refs: Record<string, CodeRef> = {
  mma: { path: "ptx-9.0/mma.ptx", code: mma, lang: "c", highlight: [1, 1], desc: "PTX ISA 9.0 · tcgen05.mma Examples의 첫 줄을 그대로 발췌했습니다. 독립 실행 가능한 kernel 전체가 아닙니다.", annotations: [{ lines: [1, 1], color: "sky", note: "[taddr0]는 TMEM의 누산 결과 위치이고 adesc·bdesc는 입력의 shared-memory descriptor입니다. 명령 발행은 완료와 다릅니다." }] },
  completion: { path: "ptx-9.0/completion.ptx", code: completion, lang: "c", highlight: [1, 5], desc: "같은 공식 예제의 commit과 parity 대기 부분입니다. 원문의 앞쪽에는 MMA 명령 두 개가 있으며 이 파일은 완료 확인 부분만 보여 줍니다.", annotations: [{ lines: [1, 1], color: "amber", note: "앞서 제출한 같은 cta_group의 비동기 작업 완료를 mbarrier로 알리도록 연결합니다." }, { lines: [3, 5], color: "emerald", note: "예제는 phase 0을 기다립니다. 반복 pipeline은 barrier 초기화·도착·phase 갱신과 재사용 순서까지 맞춰야 합니다." }] },
};
const tree: FileNode = { name: "PTX ISA 9.0 · official excerpts", type: "dir", children: [{ name: "mma.ptx", type: "file", path: "ptx-9.0/mma.ptx", codeKey: "mma" }, { name: "completion.ptx", type: "file", path: "ptx-9.0/completion.ptx", codeKey: "completion" }] };

export default function TmemSource() {
  const sidebar = useCodeSidebar();
  return <div id="tmem-official-source" className="my-8 space-y-5">
    <h4 className="text-lg font-semibold">실제 명령은 계산 제출과 완료 확인을 나눈다</h4>
    <p className="leading-8">PTX ISA 9.0의 공식 예제에서 첫 MMA 명령은 결과를 <code>[taddr0]</code>에 둔다. 이 주소는 TMEM이고 입력 두 개의 descriptor는 shared memory의 배치를 가리킨다. CPU가 제출한 64개 단순 덧셈을 이 명령 하나로 바꾸는 예제가 아니다. GEMM의 입력 tile·dtype·shape를 해당 명령 계약에 맞춘 경우의 누산 경로다.</p>
    <div className="not-prose flex flex-wrap gap-3">
      <CodeViewButton label="PTX 9.0 · tcgen05.mma 원문" onClick={() => sidebar.open("mma", refs.mma)} />
      <CodeViewButton label="PTX 9.0 · commit과 완료 대기 원문" onClick={() => sidebar.open("completion", refs.completion)} />
    </div>
    <p className="leading-8">원문 예제는 MMA 두 개를 발행한 뒤 commit 한 번으로 완료 알림을 연결한다. 이어 barrier의 phase 0 완료를 반복 확인한다. 따라서 명령을 냈다는 사실만으로 TMEM을 읽거나 이전 tile의 공간을 덮어쓸 수 없다. 실제 pipeline에는 barrier 초기화와 도착수, phase 갱신, TMEM 할당·읽기·해제까지 필요하다. 이 부분 발췌만으로 실행 가능한 전체 kernel이라고 주장하지 않는다.</p>
    <p className="leading-8">해당 <code>tcgen05.mma</code>의 target notes는 <code>sm_100a</code>와 그 문서가 열거한 architecture·family target을 지정한다. <code>sm_120</code>처럼 숫자가 더 크다고 같은 기능을 지원하는 것은 아니다. PTX 9.0은 이전 <code>sm_101a</code> 명칭의 <code>sm_110a</code> 변경도 명시한다. 다른 dtype·shape·qualifier는 각각의 target notes를 확인해야 한다.</p>
    <p className="leading-8">Hopper의 shared-memory 복사와 128개 thread의 협력 행렬 명령은 <Link to="/cs/gpu/warp-specialization-and-async-pipelines#warpgroup-wgmma">TMA·WGMMA 정본</Link>에서 다룬다. TMEM은 전용 저장 공간이고 TMA는 복사 장치이므로 둘을 혼동하지 않는다.</p>
    <CitationBlock source="NVIDIA PTX ISA 9.0 ·CUDA 13.0.2 ·tcgen05.mma, Examples와 Target ISA Notes" citeKey={6} href="https://docs.nvidia.com/cuda/archive/13.0.2/parallel-thread-execution/index.html#tcgen05-mma-instructions-mma">2026-10-04 확인. 사이드바는 공식 예제의 분리된 실물 발췌이며 독립 실행 프로그램이 아니다.</CitationBlock>
    <CodeSidebar codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef} onClose={sidebar.close} onNavigate={sidebar.navigate} codeRefs={refs} fileTrees={{ "ptx-9.0": tree }} projectMetas={{ "ptx-9.0": { id: "ptx-9.0", label: "PTX ISA 9.0 · CUDA 13.0.2", badgeClass: "bg-sky-50 border-sky-300 text-sky-800" } }} />
  </div>;
}
