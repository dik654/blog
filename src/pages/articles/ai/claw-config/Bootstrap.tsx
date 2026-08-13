import BootTimingViz from "./viz/BootTimingViz";
import BootstrapViz from "./viz/BootstrapViz";

const readiness = [
  ["설정", "최종 값과 provenance를 검증했다"],
  ["신뢰", "workspace와 plugin 권한을 결정했다"],
  ["외부 연결", "필수 provider·tool 연결이 준비됐다"],
  ["정리 경로", "취소·실패 시 자원을 회수할 수 있다"],
] as const;

export default function Bootstrap() {
  return (
    <section id="bootstrap" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        Bootstrap은 신뢰 경계가 준비된 뒤 side effect를 연다
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          bootstrap의 핵심은 단계가 몇 개인지가 아니라 의존 순서입니다. 설정과
          workspace를 확정하기 전에 plugin을 실행하거나 MCP server를 띄우면,
          아직 신뢰 수준도 모르는 코드가 process와 network 권한을 먼저 갖게
          됩니다. 따라서 로컬 계산, 신뢰 결정, 외부 side effect, readiness
          공개의 순서를 지켜야 합니다.
        </p>
        <p className="leading-7">
          분석한 구현의 <code>BootstrapPhase</code> 이름은 진행 상황을 관찰하기
          위한 내부 모델입니다. phase enum 자체를 설계의 정답으로 보기보다, 각
          phase가 어떤 자원을 만들고 실패할 때 무엇을 정리해야 하는지 확인하는
          편이 중요합니다.
        </p>

        <div className="not-prose my-8">
          <BootstrapViz />
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          외부 process는 trust 결정 뒤에 시작한다
        </h3>
        <p className="leading-7">
          먼저 config를 병합하고 canonical workspace path와 source provenance를
          계산합니다. 그다음 project config, plugin manifest와 executable의 신뢰
          여부를 평가하며, 여기까지는 가능한 한 process 생성이나 network 요청
          없이 끝내는 편이 좋습니다.
        </p>
        <p className="leading-7">
          신뢰 결정이 끝난 뒤에만 provider 연결, plugin enable, MCP spawn과 hook
          등록을 시작합니다. 이 작업들은 서로 독립적이면 병렬화할 수 있지만,
          취소 signal과 initialization generation을 공유해야 이전 실행에서 늦게
          도착한 결과가 새 runtime에 섞이지 않습니다.
        </p>
      </div>

      <div className="not-prose my-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {readiness.map(([title, body]) => (
          <article
            key={title}
            className="min-w-0 rounded-2xl border border-border/70 bg-card p-4 shadow-sm"
          >
            <h4 className="text-sm font-bold text-foreground">{title}</h4>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              {body}
            </p>
          </article>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-8 mb-3">
          Ready는 필수 capability가 준비됐다는 뜻이다
        </h3>
        <p className="leading-7">
          health check 하나가 통과했거나 LLM 요청이 성공했다고 runtime 전체가
          준비된 것은 아닙니다. 현재 명령에 필요한 provider, permission engine,
          tool과 persistence를 required capability로 선언하고, 이들이 검증된
          뒤에만 <code>Ready</code>를 공개해야 합니다.
        </p>
        <p className="leading-7">
          optional MCP나 telemetry가 실패했을 때는 해당 기능만 unavailable로
          표시할 수 있습니다. 다만 사용자가 바로 그 기능을 요청하면 degraded
          상태를 숨기지 말고 재연결하거나 명확히 실패해야 하며, 필수 구성요소의
          실패를 optional처럼 취급해서는 안 됩니다.
        </p>

        <div className="not-prose my-8">
          <BootTimingViz />
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          부분 초기화에는 역순 cleanup이 필요하다
        </h3>
        <p className="leading-7">
          MCP process를 시작한 뒤 provider 인증이 실패하면 이미 열린 child
          process, socket과 임시 callback server를 닫아야 합니다. 각
          initializer가 cleanup handle을 반환하게 하고, 실패나
          cancellation에서는 생성의 역순으로 정리하면 누락을 줄일 수 있습니다.
          credential과 callback code는 진단 로그에 남기지 않습니다.
        </p>
        <p className="leading-7">
          runtime은 부분적으로 채운 <code>Option&lt;T&gt;</code> 묶음을 여러
          component에 노출하기보다, 검증을 통과한 최종 object를 한 번에
          publish하는 편이 안전합니다. 초기화 중인 state와 요청을 처리할 수 있는
          state가 타입과 lifecycle에서 분리되기 때문입니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          timing은 숫자보다 critical path를 보여줘야 한다
        </h3>
        <p className="leading-7">
          MCP 시작 시간처럼 환경에 따라 크게 달라지는 값을 고정된 정상 범위로
          제시하면 오히려 잘못된 기준이 됩니다. phase별 elapsed time, cache
          여부, source, timeout과 cleanup 결과를 기록하고 실제 배포의
          percentile로 baseline을 잡아야 합니다. 그래야 느린 시작이 network,
          인증, plugin discovery 중 어디에서 발생했는지 설명할 수 있습니다.
        </p>
      </div>
    </section>
  );
}
