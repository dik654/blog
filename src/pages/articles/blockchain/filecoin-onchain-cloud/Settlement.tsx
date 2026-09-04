import { CitationBlock } from "@/components/ui/citation";
import { OFFICIAL_SOURCES } from "@/content/official-sources";
import type { CodeRef } from "@/components/code/types";

export default function Settlement({
  onCodeRef: _onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="settlement" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Filecoin Pay와 payment rail</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Filecoin Pay는 서비스마다 별도 escrow 계약을 복제하는 대신 payer와
          payee 사이에 <strong>payment rail</strong>을 만든다. rail은 토큰, 지불
          속도, lockup과 validator를 기록하고, 서비스 계약은 검증된 결과에 따라
          정산 가능한 범위를 제한한다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          왜 단순 자동 송금이 아닌가
        </h3>
        <p className="leading-7">
          proof가 늦거나 서비스가 종료될 때 이미 발생한 비용과 아직 제공되지
          않은 기간을 구분해야 한다. 또한 provider가 매 블록마다 송금
          transaction을 보내지 않으면서도 누적 수익을 인출할 수 있어야 한다.
          rail은 서비스 진행량과 실제 인출을 분리해 이 문제를 푼다.
        </p>

        <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-3 my-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Funding &amp; lockup</h4>
            <p className="text-xs text-muted-foreground">
              payer가 충분한 잔액과 미래 서비스분의 lockup을 유지해 갑작스러운
              미지급을 제한한다.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Accrual</h4>
            <p className="text-xs text-muted-foreground">
              provider의 누적 가능액은 시간·요율과 서비스 validator가 허용한 구간으로 계산한다.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Settlement</h4>
            <p className="text-xs text-muted-foreground">
              payee가 정산을 청구하고 rail 상태는 중복 인출 없이 다음 구간으로
              진행한다.
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          PDP와 결제가 만나는 지점
        </h3>
        <div className="not-prose rounded-lg border bg-card p-4 my-4">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded bg-muted px-2 py-1">provider proof</span>
            <span className="text-muted-foreground">→</span>
            <span className="rounded bg-muted px-2 py-1">
              PDPVerifier event
            </span>
            <span className="text-muted-foreground">→</span>
            <span className="rounded bg-muted px-2 py-1">
              Warm Storage policy
            </span>
            <span className="text-muted-foreground">→</span>
            <span className="rounded bg-muted px-2 py-1">
              rail settlement limit
            </span>
            <span className="text-muted-foreground">→</span>
            <span className="rounded bg-muted px-2 py-1">
              provider withdraw
            </span>
          </div>
        </div>
        <p className="leading-7">
          고정 99.9% SLA, 일률적인 10배 penalty, 30초마다 자동 송금 같은 값은 Filecoin Pay가 정해 주지 않는다. 실제 통화·가격·proof 주기·종료 조건은
          사용 중인 Warm Storage 배포와 SDK 설정에서 읽어야 한다.
        </p>

        <CitationBlock {...OFFICIAL_SOURCES.filecoin.pay} citeKey={3}>
          공식 문서는 Filecoin Pay를 ERC-20 기반의 범용 payment rail로 설명하며,
          validator가 검증된 서비스 결과에 따라 지불을 승인하거나 제한할 수
          있도록 한다.
        </CitationBlock>
      </div>
    </section>
  );
}
