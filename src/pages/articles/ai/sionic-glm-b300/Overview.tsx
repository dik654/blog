import ContentBoundary from "@/components/articles/content-boundary";
import {
  B300_OFFICIAL_CONFIG,
  GLM52_OFFICIAL_CONFIG,
} from "@/content/sionic-glm-b300";
import OverviewViz from "./viz/OverviewViz";
import StackViz from "./viz/StackViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        600 tok/s의 질문을 FLOPS가 아니라 두 개의 분모로 바꾸기
      </h2>
      <div className="not-prose mb-8">
        <OverviewViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          batch-1 autoregressive decode의 핵심 비용은 “GPU가 곱셈을 얼마나 많이
          할 수 있는가”만이 아니다. token step마다 활성화된 weight를 얼마나 빨리
          가져오는지, 그리고 main model을 한 번 실행해 몇 token을 확정하는지가
          함께 throughput을 결정한다.
        </p>
        <ContentBoundary article="sionic-glm-b300" />

        <div className="not-prose my-6 grid gap-4 lg:grid-cols-2">
          <section className="rounded-xl border bg-card p-4">
            <h3 className="text-sm font-bold">GLM-5.2 공식 config</h3>
            <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
              {GLM52_OFFICIAL_CONFIG.map(([label, value]) => (
                <div key={label} className="rounded-lg bg-muted/40 p-2">
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd className="mt-1 font-semibold">{value}</dd>
                </div>
              ))}
            </dl>
          </section>
          <section className="rounded-xl border bg-card p-4">
            <h3 className="text-sm font-bold">NVIDIA B300 공식 사양</h3>
            <dl className="mt-3 grid gap-2 text-xs sm:grid-cols-3 lg:grid-cols-1">
              {B300_OFFICIAL_CONFIG.map(([label, value]) => (
                <div key={label} className="rounded-lg bg-muted/40 p-2">
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd className="mt-1 font-semibold">{value}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
        <p className="leading-7">
          위 구성은 official model card·config와 NVIDIA 사양에서 가져온다.
          아래의 6.65GB/rank, kernel µs, bandwidth, tok/s는{" "}
          <strong>Sionic의 특정 TP8 실험값</strong>이며 공식 모델 성능이나 모든
          B300의 보장값이 아니다.
        </p>

        <div className="not-prose my-6">
          <StackViz />
        </div>
      </div>
    </section>
  );
}
