import Overview from './context-manager-orchestration/Overview';
import Architecture from './context-manager-orchestration/Architecture';
import RoutingMemory from './context-manager-orchestration/RoutingMemory';
import HarnessChannels from './context-manager-orchestration/HarnessChannels';
import Tradeoffs from './context-manager-orchestration/Tradeoffs';

const publicBoundaries = [
  {
    title: '공개 가능한 내용',
    details: [
      '에이전트, 하네스, 게이트웨이, 웹 운영 화면이 어떤 책임으로 나뉘는지 설명한다.',
      '요청 흐름, 작업 위임, 세션 handoff 같은 개념은 코드가 아니라 아키텍처 수준으로만 정리한다.',
    ],
  },
  {
    title: '공개하지 않는 내용',
    details: [
      '라우팅 조건, 권한 처리, 게이트웨이 핸들러, 운영 API, 내부 경로와 실행 세부 코드는 싣지 않는다.',
      '실제 소스 파일, 원본 주석, 파일 트리는 공개 블로그 번들에 포함하지 않는다.',
    ],
  },
  {
    title: '대체 표현 방식',
    details: [
      '보안에 민감한 구현은 의사결정 이유, 실패 모드, 검증 관점으로 설명한다.',
      '필요한 경우 공개용 pseudocode를 별도로 작성하되 실제 내부 로직과 1:1로 대응시키지 않는다.',
    ],
  },
];

export default function ContextManagerOrchestrationArticle() {
  return (
    <div className="space-y-12">
      <Overview />
      <Architecture />
      <RoutingMemory />
      <HarnessChannels />
      <Tradeoffs />

      <section id="sources" className="space-y-5">
        <div>
          <h2 className="text-2xl font-semibold tracking-normal text-slate-950">공개 범위와 보안 경계</h2>
          <p className="mt-2 leading-7 text-slate-700">
            context-manager 자체 로직은 운영 권한, 라우팅 규칙, 내부 API 구조가 드러날 수 있으므로
            공개 블로그에서는 실제 소스 보기 대신 역할과 경계만 설명한다.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {publicBoundaries.map((group) => (
            <div key={group.title} className="rounded-lg border border-slate-200 bg-white p-4">
              <h3 className="text-sm font-semibold text-slate-950">{group.title}</h3>
              <ul className="mt-3 space-y-2">
                {group.details.map((detail) => (
                  <li key={detail} className="text-sm leading-6 text-slate-700">
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
