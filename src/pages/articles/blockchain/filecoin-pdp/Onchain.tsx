import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";
import type { CodeRef } from "@/components/code/types";

export default function Onchain({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="onchain" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Verifier와 서비스 계약의 경계</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton
            onClick={() => onCodeRef("pdp-main", codeRefs["pdp-main"])}
          />
          <span className="text-xs text-muted-foreground self-center">
            현재 공개 구현은 Solidity 계약이 기준
          </span>
        </div>
        <p className="leading-7">
          PDP의 구현 핵심은 “증명에 성공하면 곧바로 정해진 보상, 실패하면 고정
          슬래시”가 아니다.
          <strong> 보유 증명을 검증하는 공통 계약</strong>과 그 결과로 어떤
          SLA·fault·payment 규칙을 적용할지 정하는{" "}
          <strong>listener/service 계약</strong>을 분리하는 데 있다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">계약별 책임</h3>
        <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-3 my-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">PDPVerifier</h4>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>provider별 data set 생성과 권한</li>
              <li>piece 추가·삭제와 logical array</li>
              <li>challenge 도출과 Merkle proof 확인</li>
              <li>다음 challenge epoch 갱신</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Listener / service</h4>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>proving period와 submission window</li>
              <li>proof·piece 변경 이벤트 수신</li>
              <li>missed proof를 서비스 fault로 해석</li>
              <li>업무별 계약 조건 확장</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Consumer</h4>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>Warm Storage 같은 실제 상품</li>
              <li>provider 선택과 데이터 수명주기</li>
              <li>Filecoin Pay rail 연결</li>
              <li>모니터링·복구 정책</li>
            </ul>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          운영에서 따로 봐야 할 상태
        </h3>
        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-3 my-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Cryptographic state</h4>
            <p className="text-xs text-muted-foreground">
              proof가 유효한가, 어떤 data set과 epoch을 대상으로 했는가, 다음
              challenge는 언제 가능한가.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Service state</h4>
            <p className="text-xs text-muted-foreground">
              fault를 어떻게 기록하는가, 결제를 얼마나 정산하는가, 계약을
              계속할지 종료할지는 서비스 규칙이 정한다.
            </p>
          </div>
        </div>
        <p className="leading-7">
          이 분리 덕분에 PDPVerifier는 여러 제공자와 서비스가 공유하는 증명 기반이 되고 각 서비스는 검증 로직을 복제하지 않은 채 경제 규칙을 바꿀 수 있다.
        </p>
      </div>
    </section>
  );
}
