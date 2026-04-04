import XCMFlowViz from './viz/XCMFlowViz';
import CodePanel from '@/components/ui/code-panel';

const XCM_CODE = `// XCM 위치 (Location) 계층 구조
pub struct Location {
    parents: u8,           // 위로 올라가는 횟수
    interior: Junctions,   // 아래로 내려가는 경로
}

// 위치 표현 예시
Parachain(1000)                // 릴레이 → 파라체인 1000
Here                           // 현재 위치 (자기 자신)
../Parachain(1000)             // 형제 파라체인
GlobalConsensus(Polkadot)/Parachain(1000) // 절대 위치

// XCM 핵심 명령어 (Instructions)
WithdrawAsset(assets),         // 자산 인출
DepositAsset { assets, beneficiary }, // 자산 예치
TransferAsset { assets, beneficiary }, // 자산 전송
BuyExecution { fees, weight_limit },   // 실행 비용 지불
Transact { origin_kind, call },         // 원격 함수 호출

// 메시지 전달 채널
XCMP  // 파라체인 ↔ 파라체인 (수평)
DMP   // 릴레이 → 파라체인 (하향)
UMP   // 파라체인 → 릴레이 (상향)
HRMP  // 릴레이 경유 수평 (XCMP 대체)`;

export default function XCMCrossChain({ title }: { title?: string }) {
  return (
    <section id="xcm-crosschain" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'XCM 크로스체인'}</h2>
      <div className="not-prose mb-8">
        <XCMFlowViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>XCM</strong>(Cross-Consensus Messaging)은 서로 다른 합의 시스템 간의
          의도(intentions)를 전달하기 위한 언어입니다. 단순한 메시지 프로토콜이 아니라,
          블록체인, 스마트 컨트랙트, 팔렛 등 다양한 환경에서 실행 가능한
          프로그래밍 언어입니다.
        </p>
        <CodePanel
          title="XCM 핵심 구조"
          code={XCM_CODE}
          annotations={[
            { lines: [2, 5], color: 'sky', note: 'Location: 계층적 위치 표현' },
            { lines: [14, 19], color: 'emerald', note: 'Instructions: 핵심 명령어' },
            { lines: [21, 25], color: 'amber', note: '메시지 전달 채널 (4가지)' },
          ]}
        />
      </div>
    </section>
  );
}
