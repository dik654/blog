import type { CodeRef } from "@/components/code/types";

export default function PdpIntegration({
  onCodeRef: _onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="pdp-integration" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Warm Storage와 PDP의 연결</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          PDP는 “데이터를 보유했다”는 암호학적 사실을 판정한다. Warm Storage
          Service는 그 사실을 어느 client·provider·data set의 서비스 이력으로
          해석할지 관리한다. 두 층을 구분해야 proof 로직과 상품 정책이 뒤섞이지
          않는다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          업로드에서 proof record까지
        </h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-5 gap-2 my-4">
          {[
            [
              "1",
              "Provider 선택",
              "SDK가 등록된 서비스 제공자와 조건을 조회한다",
            ],
            [
              "2",
              "Rail 준비",
              "결제 토큰·요율·lockup을 가진 payment rail을 연결한다",
            ],
            [
              "3",
              "Data set 생성",
              "서비스 계약과 PDPVerifier에 소유 관계를 만든다",
            ],
            [
              "4",
              "Piece 추가",
              "데이터를 전송하고 CID·크기·commitment를 등록한다",
            ],
            [
              "5",
              "Proof 추적",
              "provider의 정기 proof와 fault 이벤트를 서비스 상태에 반영한다",
            ],
          ].map(([n, title, text]) => (
            <div key={n} className="rounded-lg border bg-card p-3">
              <div className="text-xs font-semibold text-muted-foreground mb-1">
                {n}
              </div>
              <div className="text-xs font-semibold mb-1">{title}</div>
              <p className="text-[11px] text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          검증 결과가 말하는 것과 말하지 않는 것
        </h3>
        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-3 my-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">PDP가 증명하는 것</h4>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>challenge epoch에 선택된 leaf의 보유</li>
              <li>leaf가 등록된 piece root에 포함됨</li>
              <li>반복된 표본 검사로 누적되는 손실 탐지 확률</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">
              서비스가 추가로 다루는 것
            </h4>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>retrieval endpoint와 실제 응답 품질</li>
              <li>복제 수와 provider 교체·복구</li>
              <li>proof miss를 결제·종료에 반영하는 정책</li>
            </ul>
          </div>
        </div>
        <p className="leading-7">
          따라서 proof 성공을 곧바로 “모든 요청의 지연·가용성 SLA 충족”으로
          해석해서는 안 된다. 저장 보유, 데이터 전달, 서비스 정산은 연결되지만
          서로 다른 관측값이다.
        </p>
      </div>
    </section>
  );
}
