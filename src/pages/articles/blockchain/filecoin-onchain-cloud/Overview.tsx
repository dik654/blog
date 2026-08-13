import ContextViz from "./viz/ContextViz";
import { CitationBlock } from "@/components/ui/citation";
import { OFFICIAL_SOURCES } from "@/content/official-sources";
import type { CodeRef } from "@/components/code/types";

export default function Overview({
  onCodeRef: _onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        Filecoin Onchain Cloud는 PDP 증명과 결제를 서비스 계층으로 묶는다
      </h2>
      <div className="not-prose mb-8">
        <ContextViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Filecoin Onchain Cloud(FOC)는 “분산 S3 하나”가 아니라
          저장·전달·검증·결제를 <strong>조합 가능한 온체인 서비스</strong>로
          만드는 계층이다. 애플리케이션은 원시 계약을 각각 다루는 대신 Synapse
          SDK를 통해 data set의 수명주기와 payment rail을 함께 관리한다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          문제 — 저장 API만으로는 서비스가 완성되지 않는다
        </h3>
        <p className="leading-7">
          데이터가 업로드됐다는 응답, 제공자가 계속 보관한다는 증거, 사용자가
          인출 가능한 결제 잔액, 실제 전달 경로가 서로 다른 시스템에 있으면 어느
          시점에 서비스가 이행됐는지 하나의 규칙으로 판정하기 어렵다. FOC는 이
          상태들을 공개 계약과 이벤트로 연결한다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          현재 스택의 네 가지 축
        </h3>
        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-3 my-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Warm Storage Service</h4>
            <p className="text-xs text-muted-foreground">
              provider·data set·proof schedule·서비스 규칙을 묶는 업무 계층이다.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">PDP</h4>
            <p className="text-xs text-muted-foreground">
              접근 가능한 데이터의 지속 보유를 무작위 challenge와 Merkle proof로
              검증한다.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Filecoin Pay</h4>
            <p className="text-xs text-muted-foreground">
              ERC-20 기반 payment rail을 열고 서비스 결과에 맞춰 정산 가능한
              금액을 계산한다.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Synapse SDK · Beam</h4>
            <p className="text-xs text-muted-foreground">
              SDK가 계약·업로드 흐름을 추상화하고, Beam은 선택 가능한 데이터
              전달 계층을 제공한다.
            </p>
          </div>
        </div>

        <p className="leading-7">
          이 구조의 핵심은 특정 가격이나 “검열 불가” 같은 절대적 수사가 아니다.
          저장 증거와 결제 조건을 누구나 감사할 수 있고, 서비스 계약을 다른
          애플리케이션이 재사용하거나 확장할 수 있다는 점이다.
        </p>

        <CitationBlock {...OFFICIAL_SOURCES.filecoin.onchainCloud} citeKey={1}>
          공식 아키텍처는 Piece, Data Set, Proof Record, Payment Rail을 핵심
          데이터 모델로 두고 Warm Storage가 PDP와 payment rail을 결합한다고
          설명한다.
        </CitationBlock>
        <CitationBlock {...OFFICIAL_SOURCES.filecoin.pay} citeKey={2}>
          Filecoin Pay는 고정 FIL 전용 escrow가 아니라 ERC-20 payment rail과
          validator 기반 정산을 제공한다. 실제 토큰·요율·lockup은 서비스 설정과
          배포 버전에 따라 확인해야 한다.
        </CitationBlock>
      </div>
    </section>
  );
}
