import { useState } from 'react';
import { ArrowDown, ArrowRight, GitMerge, RotateCcw } from 'lucide-react';
import { LabShell, Metric } from '../dezero-shared/ArticleFrame';

const tabs = ['순전파 기록', '역순으로 꺼내기', '기울기 합산', '미분을 다시 미분'] as const;

function FlowArrow() {
  return (
    <>
      <ArrowRight className="hidden h-5 w-5 shrink-0 text-muted-foreground sm:block" aria-hidden="true" />
      <ArrowDown className="h-5 w-5 shrink-0 text-muted-foreground sm:hidden" aria-hidden="true" />
    </>
  );
}

export default function AutodiffGraphLab() {
  const [active, setActive] = useState(0);

  return (
    <LabShell
      dataAttribute="data-dezero-autodiff-lab"
      eyebrow="Causal graph lab"
      title="공유된 중간값 하나가 순전파 기록에서 이차 미분까지 가는 경로"
      tabs={tabs}
      active={active}
      onChange={setActive}
    >
      {active === 0 && (
        <div className="space-y-5">
          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <Metric label="Leaf" value="x = 3" note="creator가 없는 시작 값 · generation 0" />
            <FlowArrow />
            <Metric label="Mul" value="s = x · x = 9" note="입력 x를 두 번 소유 · generation 1" tone="cyan" />
            <FlowArrow />
            <Metric label="Shared Add" value="y = s + s = 18" note="같은 Value handle을 두 입력으로 재사용 · generation 2" />
            <FlowArrow />
            <Metric label="Scale" value="z = 5y = 90" note="마지막 출력 · generation 3" tone="amber" />
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            숫자만 저장하면 <strong className="text-foreground">90</strong>은 알 수 있지만 어디서 왔는지는 잃는다.
            각 출력은 자신을 만든 operation을 가리키고, operation은 입력을 소유해야 역방향 길이 남는다.
          </p>
        </div>
      )}

      {active === 1 && (
        <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
          <div className="space-y-2">
            {[
              ['generation 3', 'z = 5y', 'dz/dy = 5'],
              ['generation 2', 'y = s+s', 'dy/ds = 1+1'],
              ['generation 1', 's = x·x', 'ds/dx = x+x'],
            ].map(([generation, operation, derivative]) => (
              <div key={operation} className="flex min-w-0 items-center gap-3 rounded-md border border-border p-3">
                <span className="shrink-0 font-mono text-xs text-muted-foreground">{generation}</span>
                <span className="min-w-0 flex-1 font-mono text-sm font-semibold">{operation}</span>
                <span className="shrink-0 font-mono text-xs text-cyan-700 dark:text-cyan-300">{derivative}</span>
              </div>
            ))}
          </div>
          <GitMerge className="mx-auto h-6 w-6 rotate-90 text-muted-foreground sm:rotate-0" aria-hidden="true" />
          <div className="rounded-md border border-cyan-500/35 bg-cyan-500/[0.05] p-5">
            <p className="text-xs font-semibold uppercase text-muted-foreground">Queue invariant</p>
            <p className="mt-2 text-lg font-bold">출력에서 가까운 operation부터 처리</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Operation 하나를 처리한 뒤 끝내지 않는다. 각 입력의 creator도 queue에 넣어야 여러 층을 끝까지 거슬러 간다.
            </p>
          </div>
        </div>
      )}

      {active === 2 && (
        <div className="grid gap-4 sm:grid-cols-3">
          <Metric label="첫 번째 사용" value="∂y/∂s = 1" note="y의 왼쪽 입력으로 들어간 s의 기여" />
          <Metric label="두 번째 사용" value="∂y/∂s += 1" note="같은 node에 새 기여를 덮지 않고 더한다" />
          <Metric label="전체 경로" value="∂z/∂x = 60" note="5 × (1+1) × (3+3)" tone="cyan" />
          <div className="sm:col-span-3 rounded-md border border-amber-500/35 bg-amber-500/[0.05] p-4 text-sm leading-relaxed">
            <strong>덮어쓰면 30, 합산하면 60.</strong> 공유 subgraph와 parameter 재사용에서는 “도착한 기울기는 더한다”가
            최적화 기법이 아니라 미분의 정확성 조건이다.
          </div>
        </div>
      )}

      {active === 3 && (
        <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center">
          <Metric label="함수" value="y = x³" note="x=2이면 y=8" />
          <FlowArrow />
          <Metric label="1차 역전파" value="dy/dx = 3x² = 12" note="create_graph=true라서 3·x² 계산도 graph로 기록" tone="cyan" />
          <RotateCcw className="mx-auto h-5 w-5 rotate-90 text-muted-foreground sm:rotate-0" aria-hidden="true" />
          <Metric label="2차 역전파" value="d²y/dx² = 6x = 12" note="첫 번째 gradient Value에 다시 backward" tone="amber" />
        </div>
      )}
    </LabShell>
  );
}
