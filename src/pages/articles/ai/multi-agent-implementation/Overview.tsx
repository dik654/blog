import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";

export default function Overview() {
  return <section id="overview" className="scroll-mt-20">
    <h2 className="mb-6 text-2xl font-bold">Multi-agent 구현의 출발점은 agent 수가 아니라, 단일 실행에서 분리해야 할 context·권한·artifact ownership이 있는지 확인하는 것입니다</h2>
    <div className="prose prose-neutral max-w-none dark:prose-invert"><p className="text-lg leading-8">같은 자료를 읽고 같은 도구를 쓰며 하나의 결과만 만드는 작업이라면 agent를 늘려도 호출·조정·검증 비용만 커질 수 있습니다. 반면 서로 독립적인 repository를 조사하거나, 작성자와 검증자가 다른 context·권한을 가져야 하거나, 여러 설비의 분석 artifact를 병렬로 만들 때는 분리가 유용합니다.</p><p><a href="/ai/agentic-patterns">에이전틱 패턴 정본</a>은 delegation의 개념과 manager·handoff·parallel·actor–reviewer 선택을 설명합니다. 이 글은 그 결정을 실제 runtime의 state schema·worker contract·join·retry·side-effect safety로 구현하는 범위만 소유합니다.</p></div>
    <ContentBoundary article="multi-agent-implementation" />
    <ExplainedFormula question="여러 agent를 썼을 때 얻은 이득을 추가 비용과 분리해 어떻게 판단할까요?" idea={<>같은 task set과 quality gate에서 single-agent baseline의 wall time·cost를 먼저 재고, multi-agent의 join·retry·검증을 모두 포함한 값을 뺍니다.</>} formula={String.raw`\begin{aligned}
G_T&=T_{\mathrm{single}}-T_{\mathrm{multi}}\\
G_C&=C_{\mathrm{single}}-C_{\mathrm{multi}}\\
\Delta Q&=Q_{\mathrm{multi}}-Q_{\mathrm{single}}
\end{aligned}`} terms={[{symbol:"G_T",name:"time gain",description:"양수면 multi-agent가 end-to-end wall time을 줄였습니다."},{symbol:"G_C",name:"cost gain",description:"양수면 tool·model·retry·join을 포함한 비용이 줄었습니다."},{symbol:"Delta Q",name:"quality gain",description:"같은 rubric·test에서 quality가 얼마나 달라졌는지 나타냅니다."}]} assumptions={["입력 snapshot·tool 권한·model·완료 조건과 quality gate를 같게 둡니다.","Worker 합계 시간이 아니라 사용자가 기다린 end-to-end 시간과 실제 과금량을 잽니다.","독립 run과 task slice에서 분산·부분 실패율도 함께 보고 test를 보고 구조를 재선택하지 않습니다."]} interpretation="병렬화로 20분을 줄였지만 호출비가 두 배이고 quality가 같다면 latency가 중요한 workload에서만 이득입니다. 세 값 모두 나빠지면 단일 agent로 되돌립니다." />
    <div className="not-prose my-8 overflow-hidden rounded-xl border border-border bg-background"><div className="grid divide-y divide-border sm:grid-cols-4 sm:divide-x sm:divide-y-0">{[["Partition","독립 범위·owner"],["Execute","격리 context·권한"],["Verify","test·evidence"],["Join","충돌·부분 실패"]].map(([a,b],i)=><div key={a} className="p-4"><p className="text-xs font-semibold text-muted-foreground">0{i+1}</p><p className="mt-1 font-semibold">{a}</p><p className="mt-2 text-sm text-muted-foreground">{b}</p></div>)}</div></div>
  </section>;
}
