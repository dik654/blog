import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import OverviewViz from "./viz/OverviewViz";
import ThreatChainViz from "./viz/ThreatChainViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        경고의 개수가 아니라 공격 경로의 완성 여부를 본다
      </h2>
      <div className="not-prose mb-8">
        <OverviewViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          AI 에이전트가 실행하는 코드는 신뢰할 수 없는 입력이다. 하지만
          <code>/etc/passwd</code>를 읽었다는 사건과 host kernel을 장악한 사건을
          같은 무게로 세면 우선순위가 무너진다. 관찰한 행위가 어떤 capability를
          만나 어느 경계를 넘고 어떤 영향으로 이어지는지를 추적해야 한다.
        </p>
        <h3 id="container-boundary" className="mt-6 mb-3 scroll-mt-24 text-xl font-semibold">
          Container는 작은 VM이 아니라 제한된 host process다
        </h3>
        <p className="leading-7">
          Process는 실행 중인 program과 그 memory·file descriptor·credential
          상태를 뜻한다. 일반 Linux container는 이 process에 namespace로 보이는
          PID·network·mount 범위를 나누고, cgroup으로 CPU·memory 같은 사용량을
          제한한다. 그러나 runc container는 host kernel을 공유하므로 “filesystem
          view가 분리됐다”와 “kernel이 분리됐다”를 같은 말로 쓰면 안 된다.
          Kubernetes Pod도 하나 이상의 container를 함께 배치하는 실행 단위이지
          그 자체가 새 kernel을 만드는 것은 아니다.
        </p>
        <ContentBoundary article="agent-sandbox-security" />
        <div className="not-prose my-6">
          <ThreatChainViz />
        </div>
        <p className="leading-7">
          따라서 이 글은 “가장 강한 runtime 하나”를 고르는 글이 아니다. token을
          없애도 열린 network가 남을 수 있고, egress를 차단해도 host kernel 공격
          surface는 남는다. identity·network·kernel·filesystem·lifecycle은 서로
          대체하지 않는 독립 경계다.
        </p>
        <div id="attack-path-model" className="scroll-mt-24">
          <ExplainedFormula
            question="관찰된 행위를 실제 침해 위험으로 올릴 조건은 무엇인가?"
            idea={
              <p>
                Signal 하나에 점수를 붙이는 대신, 입력에서 영향까지 이어지는
                경로가 하나라도 있고 그 경로의 모든 edge가 현재 통제에서
                허용되는지를 봅니다. 중간 edge 하나를 확실히 차단하면 그 경로는
                완성되지 않습니다.
              </p>
            }
            formula={String.raw`\begin{aligned}
              \operatorname{reachable}(I)
              &\Longleftrightarrow \exists p:s\leadsto I \\
              &\quad\land\ \prod_{e\in p} a(e)=1
            \end{aligned}`}
            terms={[
              { symbol: "s", name: "observed signal", description: "/etc/passwd read·port scan·metadata request처럼 처음 관찰한 행위입니다." },
              { symbol: "I", name: "security impact", description: "Secret 유출·control-plane 변조·횡적 이동·host 장악 같은 실제 결과입니다." },
              { symbol: "p", name: "attack path", description: "Signal에서 capability와 boundary crossing을 거쳐 impact로 가는 edge 순서입니다." },
              { symbol: "a(e)", name: "edge availability", description: "현재 credential·route·mount·syscall·device 정책에서 edge e가 가능하면 1, 차단되면 0입니다." },
            ]}
            assumptions={[
              "곱은 확률 계산이 아니라 모든 edge가 열려 있어야 한다는 Boolean AND 표기입니다.",
              "현재 Pod의 token·route·mount·device와 실제 enforcement 상태를 inventory했습니다.",
              "알려지지 않은 취약점과 우회 경로가 있을 수 있으므로 한 겹 통제만으로 안전을 선언하지 않습니다.",
            ]}
            interpretation="Port scan 자체의 직접 영향이 작아도 metadata route·credential·egress가 모두 열려 있으면 고위험 path가 완성됩니다. 반대로 한 edge를 차단했더라도 다른 path가 남았는지 다시 확인해야 합니다."
          />
        </div>
      </div>
    </section>
  );
}
