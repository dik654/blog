export default function Overview() {
  return (
    <section id="overview" className="space-y-6">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Agent orchestration
        </p>
        <h1 className="text-3xl font-semibold tracking-normal text-slate-950">
          Context Manager: 단일 모델이 아니라 작업 시스템을 설계하기
        </h1>
        <p className="text-lg leading-8 text-slate-700">
          좋은 LLM 하나를 고르는 일과 좋은 에이전트 시스템을 만드는 일은 다르다.
          모델은 답을 생성하지만, 시스템은 어떤 맥락을 줄지, 어떤 도구를 열지,
          어느 작업을 다른 모델에 맡길지, 결과를 어디에 남길지 결정한다.
          Context Manager는 이 결정을 한곳에 모으려는 개인용 오케스트레이션 레이어다.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="text-base font-semibold text-slate-950">Route</h2>
          <p className="mt-2 leading-7 text-slate-700">
            모든 요청을 같은 모델에 던지지 않는다. 난이도, 비용, 도구 권한,
            컨텍스트 민감도를 보고 메인 오케스트레이터와 워커를 나눈다.
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="text-base font-semibold text-slate-950">Remember</h2>
          <p className="mt-2 leading-7 text-slate-700">
            세션 로그, 의사결정, 실패 회고, 프로젝트 규칙을 지식 저장소에 남긴다.
            다음 모델은 빈 화면에서 시작하지 않고 누적된 맥락을 빌린다.
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="text-base font-semibold text-slate-950">Contain</h2>
          <p className="mt-2 leading-7 text-slate-700">
            API 키, 비용 정책, PII 마스킹, 캐시, 감사 로그를 게이트웨이로 분리한다.
            에이전트가 강해질수록 경계도 명확해야 한다.
          </p>
        </div>
      </div>

      <p className="leading-8 text-slate-700">
        핵심은 거창한 자율성 주장이 아니다. Context Manager는 사람을 대체하는
        자동 개발자가 아니라, 여러 LLM과 하네스와 지식 저장소를 한 작업 흐름으로
        묶는 운영체제에 가깝다. 사용자는 Telegram, CLI, 웹 UI 어디에서든 같은
        작업을 시작하고, 시스템은 그 요청을 처리 가능한 단위로 쪼개며, 필요한
        경우 다른 에이전트에게 독립된 하위 작업을 위임한다.
      </p>
    </section>
  );
}
