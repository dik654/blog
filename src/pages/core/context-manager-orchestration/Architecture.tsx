export default function Architecture() {
  return (
    <section id="architecture" className="space-y-6">
      <h2 className="text-2xl font-semibold tracking-normal text-slate-950">
        아키텍처: 에이전트와 게이트웨이를 분리한다
      </h2>

      <p className="leading-8 text-slate-700">
        Context Manager의 첫 번째 설계 선택은 LLM 호출을 에이전트 프로세스에 직접
        박아 넣지 않는 것이다. 에이전트는 작업 루프와 도구 호출을 담당하고,
        게이트웨이는 모델 API와 보안 정책을 담당한다. 이 분리는 단순한 취향이
        아니라 운영상의 안전장치다.
      </p>

      <pre className="overflow-x-auto rounded-lg border border-slate-200 bg-slate-950 p-4 text-sm leading-6 text-slate-100">
{`User channel
  -> Agent process
    -> Gateway process
      -> LLM providers
  -> PostgreSQL / Qdrant / Redis / file knowledge`}
      </pre>

      <div className="overflow-hidden rounded-lg border border-slate-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3 font-semibold">Layer</th>
              <th className="px-4 py-3 font-semibold">Role</th>
              <th className="px-4 py-3 font-semibold">Why it exists</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-700">
            <tr>
              <td className="px-4 py-3 font-medium text-slate-950">Agent</td>
              <td className="px-4 py-3">대화 루프, 도구 실행, 작업 상태 관리</td>
              <td className="px-4 py-3">프롬프트와 워크플로우가 자주 바뀌므로 수정 속도가 중요하다.</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium text-slate-950">Gateway</td>
              <td className="px-4 py-3">모델 호출, 비용, PII, 캐시, 감사 로그</td>
              <td className="px-4 py-3">API 키와 정책을 에이전트의 프롬프트 표면에서 분리한다.</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium text-slate-950">Knowledge</td>
              <td className="px-4 py-3">메모리, ADR, lesson, trace, 검색 인덱스</td>
              <td className="px-4 py-3">모델이 바뀌어도 개인 맥락과 의사결정 이력이 남는다.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="leading-8 text-slate-700">
        이 구조에서는 모델 공급자를 바꾸는 일이 시스템 전체 교체로 번지지 않는다.
        OpenAI 호환 인터페이스 뒤에 Claude, GPT, Gemini, 로컬 모델을 붙이고,
        게이트웨이는 토큰 예산과 장애 상황에 따라 폴백하거나 다운그레이드한다.
        중요한 것은 "어떤 모델이 최고인가"가 아니라 "이 요청에 어떤 모델이 충분한가"다.
      </p>
    </section>
  );
}
