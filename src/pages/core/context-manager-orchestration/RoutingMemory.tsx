export default function RoutingMemory() {
  return (
    <section id="routing-memory" className="space-y-6">
      <h2 className="text-2xl font-semibold tracking-normal text-slate-950">
        라우팅과 메모리: 컨텍스트를 많이 넣는 것이 답은 아니다
      </h2>

      <p className="leading-8 text-slate-700">
        멀티 에이전트 시스템에서 흔한 실수는 모든 워커에게 전체 프로젝트 맥락을
        넘기는 것이다. 그러면 비용은 늘고, 민감한 정보는 퍼지고, 작은 모델은
        오히려 핵심을 놓친다. Context Manager의 라우팅은 반대로 움직인다.
        메인 오케스트레이터는 큰 그림을 들고, 워커는 독립적으로 답할 수 있는
        좁은 질문만 받는다.
      </p>

      <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
        <h3 className="font-semibold text-slate-950">작업 분해 기준</h3>
        <ul className="mt-3 space-y-2 leading-7 text-slate-700">
          <li>즉시 다음 행동을 막는 일은 메인 오케스트레이터가 직접 처리한다.</li>
          <li>조사, 비교, 감사, 검증처럼 독립적인 일은 워커에게 넘긴다.</li>
          <li>민감한 프로젝트 맥락이 필요 없는 일은 제한된 모델에도 보낼 수 있다.</li>
          <li>결과는 "긴 대화"가 아니라 findings, risks, changed files 같은 통합 가능한 형태로 받는다.</li>
        </ul>
      </div>

      <p className="leading-8 text-slate-700">
        메모리도 비슷하다. 모든 대화 로그를 영구 지식으로 저장하면 검색 품질이
        떨어진다. 저장할 가치가 있는 것은 공개 지식이 아니라 개인 맥락이다.
        왜 이 구조를 택했는지, 어떤 버그에서 무엇을 배웠는지, 이 프로젝트에서는
        어떤 규칙을 우선하는지가 다음 작업의 정확도를 올린다.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="font-semibold text-slate-950">저장할 것</h3>
          <p className="mt-2 leading-7 text-slate-700">
            ADR, 실패 회고, 프로젝트별 컨벤션, 배포 절차, 에이전트별 역할 기억.
            다음 작업에서 판단 비용을 줄이는 맥락이다.
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="font-semibold text-slate-950">저장하지 않을 것</h3>
          <p className="mt-2 leading-7 text-slate-700">
            공식 문서 복사본, 일반 튜토리얼, 금방 낡는 API 스펙. 링크나 원본
            참조로 충분한 지식은 로컬 메모리의 밀도를 낮춘다.
          </p>
        </div>
      </div>
    </section>
  );
}
