import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import PlatformViz from "./viz/PlatformViz";

export default function Overview() {
  return (
    <section id="overview" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">직접 운영하면 먼저 일의 새 담당자를 정해야 합니다</h2>
      <nav className="not-prose mb-8" aria-label="이 글을 읽는 순서">
        <p className="text-sm font-bold text-foreground">이 글에 들어오는 길</p>
        <ol className="mt-3 grid gap-3">
          <li className="min-w-0 rounded-xl border border-border bg-muted/20 p-4">
            <p className="text-xs font-bold text-primary">1 · 먼저 알 것</p>
            <p className="mt-1 text-sm leading-6 text-foreground">
              <Link className="font-semibold underline underline-offset-4" to="/cs/cloud/kubernetes-request-path-and-cka">
                Kubernetes 요청 경로
              </Link>
              에서 원하는 Pod 수가 실제 요청을 받기까지의 순서를 익힙니다.
            </p>
          </li>
          <li className="min-w-0 rounded-xl border border-border bg-muted/20 p-4">
            <p className="text-xs font-bold text-primary">2 · 선택이 필요한 경우</p>
            <p className="mt-1 text-sm leading-6 text-foreground">
              GPU 작업을 어느 환경에 둘지 아직 정하지 않았다면{" "}
              <Link className="font-semibold underline underline-offset-4" to="/cs/gpu/kubernetes-vs-slurm-gpu-scheduling">
                Kubernetes와 Slurm 비교
              </Link>
              를 먼저 읽습니다.
            </p>
          </li>
          <li className="min-w-0 rounded-xl border border-primary/30 bg-primary/5 p-4">
            <p className="text-xs font-bold text-primary">3 · 이 글의 순서</p>
            <p className="mt-1 text-sm leading-6 text-foreground">
              담당자 정하기 → 요청 보낼 서버 고르기 → 여러 Pod를 한 복제본으로 묶기 → 고정된 GPU 나누기 순서로 갑니다.
            </p>
          </li>
        </ol>
      </nav>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          외부 제공자를 쓸 때 게이트웨이 하나가 맡던 일은 생각보다 많습니다. 모델 이름을 실제 엔드포인트로
          바꾸고, 키를 관리하고, 한도를 걸고, 실패하면 다른 제공자로 넘기고, 비용을 집계합니다. 이 전부가 한
          프로세스의 설정 파일 안에 있습니다.
        </p>

        <p className="leading-7">
          자체 클러스터에서 모델을 직접 돌리면 이 목록이 둘로 갈립니다. 한쪽은 여전히 게이트웨이의 일입니다.
          다른 한쪽은 클러스터가 맡아야 하는 일로 내려갑니다. 어느 복제본이 지금 여유가 있는지, 복제본 하나가
          파드 몇 개로 이뤄지는지, 고장 난 복제본을 어떻게 통째로 되살리는지 같은 것들입니다.
        </p>

        <p className="leading-7">
          답은 일을 옮기는 순서에 있습니다. 게이트웨이가 하던 일마다 새 담당자를 정한 뒤, 클러스터 안에서는
          요청 전달, 복제본 배치, 고정된 가속기 배분을 차례로 해결합니다. 어느 복제본으로 보낼지 정하는 계산은{" "}
          <Link to="/cs/ai/disaggregated-prefill-decode-serving#routing">분리 서빙의 복제본 라우팅</Link>에
          있으므로 여기서는 그 계산을 실행할 선택기가 어디에 놓이는지부터 봅니다.
        </p>

        <ContentBoundary article="onprem-k8s-inference-platform" />

        <p className="leading-7">
          그리고 온프레미스에는 클라우드에 없는 제약이 하나 있습니다. 총 가속기 수가 고정돼 있다는 것입니다. 부하가 늘어도 노드를 더 살 수 없으므로 늘리는 문제가 아니라 지금 있는 것을
          어떻게 나눌지의 문제가 됩니다. 이 제약이 배치와 정책을 같은 것으로 만듭니다.
        </p>

      </div>

      <PlatformViz />
    </section>
  );
}
