export default function Tradeoffs() {
  return (
    <section id="tradeoffs" className="space-y-6">
      <h2 className="text-2xl font-semibold tracking-normal text-slate-950">
        트레이드오프: 자동화보다 운영 가능성이 먼저다
      </h2>

      <p className="leading-8 text-slate-700">
        Context Manager는 "에이전트가 알아서 다 한다"는 식의 낙관을 피한다.
        멀티 에이전트는 단일 모델 호출보다 강력할 수 있지만, 동시에 디버깅 지점도
        늘린다. 어떤 모델이 무엇을 봤는지, 어떤 도구를 열었는지, 비용이 어디서
        발생했는지 추적하지 못하면 시스템은 빠르게 불투명해진다.
      </p>

      <div className="overflow-hidden rounded-lg border border-slate-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3 font-semibold">Choice</th>
              <th className="px-4 py-3 font-semibold">Gain</th>
              <th className="px-4 py-3 font-semibold">Cost</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-700">
            <tr>
              <td className="px-4 py-3 font-medium text-slate-950">게이트웨이 분리</td>
              <td className="px-4 py-3">보안, 비용 통제, 모델 교체성</td>
              <td className="px-4 py-3">운영할 프로세스와 설정이 늘어난다.</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium text-slate-950">워커 위임</td>
              <td className="px-4 py-3">병렬 조사, 비용 절감, 전문화</td>
              <td className="px-4 py-3">결과 통합과 품질 검증이 필요하다.</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium text-slate-950">영구 메모리</td>
              <td className="px-4 py-3">세션을 넘는 프로젝트 맥락</td>
              <td className="px-4 py-3">무분별하게 저장하면 검색 잡음이 생긴다.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="leading-8 text-slate-700">
        그래서 실전 기준은 명확하다. 중요한 작업은 추적 가능해야 하고, 제한된
        워커는 제한된 맥락만 봐야 하며, 자동화는 사람이 검토할 수 있는 단위로
        결과를 남겨야 한다. Context Manager의 목표는 모델을 신뢰하자는 선언이
        아니라, 모델을 바꿔도 작업 방식과 기억과 검증 경계가 남는 구조를 만드는
        것이다.
      </p>
    </section>
  );
}
